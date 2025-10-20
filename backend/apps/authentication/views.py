"""
Views para autenticación
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer, UserSerializer, RegisterSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Endpoint de login
    POST /api/auth/login/
    Body: {"email": "user@example.com", "password": "password"}
    """
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Generar tokens JWT
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Endpoint de logout
    POST /api/auth/logout/
    """
    try:
        # En un sistema JWT stateless, el logout se maneja en el cliente
        # eliminando los tokens. Aquí solo confirmamos la acción.
        return Response({
            'message': 'Sesión cerrada exitosamente'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    """
    Obtener información del usuario actual
    GET /api/auth/me/
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Endpoint de registro
    POST /api/auth/register/
    Body: {
        "email": "user@example.com", 
        "full_name": "Name",
        "password": "password",
        "password_confirm": "password",
        "role": "company_user"
    }
    """
    serializer = RegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        
        # Generar tokens JWT
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)