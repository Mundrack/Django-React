from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User
from .serializers import UserSerializer, LoginSerializer, RegisterSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Crear usuario y asignar empresa"""
        company_id = request.data.get('company_id')
        
        # Crear usuario
        user = User.objects.create(
            email=request.data.get('email'),
            full_name=request.data.get('full_name'),
            role=request.data.get('role', 'company_user'),
            is_active=True
        )
        
        # Asignar empresa si se proporcionó
        if company_id:
            from companies.models import CompanyUser, Company
            try:
                company = Company.objects.get(id=company_id)
                CompanyUser.objects.create(company=company, user=user)
            except Company.DoesNotExist:
                pass
        
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Endpoint de login - retorna info del usuario"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            user = User.objects.get(email=email)
            # TODO: Verificar password hasheado
            # Por ahora solo verificamos que el usuario existe
            
            return Response({
                'user': UserSerializer(user).data,
                'token': 'dummy-token-12345',  # TODO: Implementar JWT real
                'message': 'Login exitoso'
            })
        except User.DoesNotExist:
            return Response(
                {'error': 'Credenciales inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Endpoint de registro"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Usuario creado exitosamente'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def me_view(request):
    """Obtener usuario actual - TODO: basado en token"""
    # Por ahora retorna el primer super_admin
    try:
        user = User.objects.filter(role='super_admin').first()
        if user:
            return Response(UserSerializer(user).data)
        return Response({'error': 'Usuario no encontrado'}, status=404)
    except:
        return Response({'error': 'Error al obtener usuario'}, status=500)