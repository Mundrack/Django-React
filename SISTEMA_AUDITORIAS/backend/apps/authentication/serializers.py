"""
Serializers for authentication app.
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import Organization

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'user_type', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class OrganizationSerializer(serializers.ModelSerializer):
    """Serializer for Organization model"""
    owner = UserSerializer(read_only=True)
    
    class Meta:
        model = Organization
        fields = ['id', 'name', 'description', 'owner', 'is_active', 'created_at']
        read_only_fields = ['id', 'owner', 'created_at']


class RegisterSerializer(serializers.Serializer):
    """Serializer for user registration"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    full_name = serializers.CharField(max_length=255)
    user_type = serializers.ChoiceField(choices=['owner', 'employee'], default='owner')
    org_name = serializers.CharField(max_length=255, required=False)
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Este email ya está registrado')
        return value
    
    def validate(self, data):
        if data.get('user_type') == 'owner' and not data.get('org_name'):
            raise serializers.ValidationError({'org_name': 'El nombre de la organización es requerido para dueños'})
        return data
    
    def create(self, validated_data):
        org_name = validated_data.pop('org_name', None)
        password = validated_data.pop('password')
        
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        
        # Si es owner, crear organización automáticamente
        if user.user_type == 'owner' and org_name:
            Organization.objects.create(
                name=org_name,
                owner=user
            )
        
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom token serializer with extra user data"""
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add extra user data to response
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'full_name': self.user.full_name,
            'user_type': self.user.user_type,
        }
        
        # Add organization if owner
        if self.user.user_type == 'owner' and hasattr(self.user, 'organization'):
            data['organization'] = {
                'id': self.user.organization.id,
                'name': self.user.organization.name,
            }
        
        return data


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=6)
