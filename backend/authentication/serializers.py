from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    company_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'is_active', 'created_at', 'company_id']
        read_only_fields = ['created_at']

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    company_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'password_confirm', 'full_name', 'role', 'company_id']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Las contraseñas no coinciden")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        company_id = validated_data.pop('company_id', None)
        
        user = User.objects.create(**validated_data)
        
        # Crear relación con empresa si se proporcionó
        if company_id:
            from companies.models import CompanyUser, Company
            try:
                company = Company.objects.get(id=company_id)
                CompanyUser.objects.create(company=company, user=user)
            except Company.DoesNotExist:
                pass
        
        return user