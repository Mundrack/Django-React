"""
Views for authentication app.
"""
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    OrganizationSerializer,
    CustomTokenObtainPairSerializer,
    ChangePasswordSerializer,
)
from .models import Organization

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """Register a new user"""
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        response_data = {
            'message': 'Usuario registrado exitosamente',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }
        
        # Add organization if owner
        if user.user_type == 'owner' and hasattr(user, 'organization'):
            response_data['organization'] = OrganizationSerializer(user.organization).data
        
        return Response(response_data, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login view with extra user data"""
    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(APIView):
    """Logout user by blacklisting refresh token"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Sesión cerrada exitosamente'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    """Get current user data"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        data = UserSerializer(user).data
        
        # Add organization data
        if user.user_type == 'owner' and hasattr(user, 'organization'):
            data['organization'] = OrganizationSerializer(user.organization).data
        
        # Add assignment data if employee
        if hasattr(user, 'assignments'):
            from apps.core.serializers import UserAssignmentSerializer
            assignments = user.assignments.filter(is_active=True)
            if assignments.exists():
                data['assignment'] = UserAssignmentSerializer(assignments.first()).data
        
        return Response(data)
    
    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ChangePasswordView(APIView):
    """Change user password"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({'error': 'Contraseña actual incorrecta'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({'message': 'Contraseña actualizada exitosamente'})


class OrganizationView(APIView):
    """Get/Update organization data"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if user.user_type == 'owner' and hasattr(user, 'organization'):
            organization = user.organization
        elif hasattr(user, 'assignments'):
            assignment = user.assignments.filter(is_active=True).first()
            if assignment:
                organization = assignment.organization
            else:
                return Response({'error': 'No tienes una organización asignada'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'No tienes una organización'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(OrganizationSerializer(organization).data)
    
    def put(self, request):
        user = request.user
        
        if user.user_type != 'owner':
            return Response({'error': 'Solo el dueño puede editar la organización'}, status=status.HTTP_403_FORBIDDEN)
        
        if not hasattr(user, 'organization'):
            return Response({'error': 'No tienes una organización'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = OrganizationSerializer(user.organization, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data)
