"""
Serializers para autenticación
"""
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer para el modelo User"""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class LoginSerializer(serializers.Serializer):
    """Serializer para login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            user = authenticate(email=email, password=password)
            
            if not user:
                raise serializers.ValidationError('Credenciales inválidas')
            
            if not user.is_active:
                raise serializers.ValidationError('Usuario desactivado')
            
            data['user'] = user
            return data
        else:
            raise serializers.ValidationError('Debe incluir email y contraseña')


class TokenSerializer(serializers.Serializer):
    """Serializer para tokens JWT"""
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserSerializer()


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer para registro de usuarios"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'full_name', 'password', 'password_confirm', 'role']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password': 'Las contraseñas no coinciden'})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user