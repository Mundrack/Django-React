from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    parent_name = serializers.CharField(source='parent.name', read_only=True)
    subsidiaries_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = [
            'id', 'name', 'ruc', 'is_parent', 'parent', 'parent_name',
            'address', 'phone', 'subsidiaries_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_subsidiaries_count(self, obj):
        """Cuenta cuántas filiales tiene esta empresa"""
        if obj.is_parent:
            return obj.subsidiaries.count()
        return 0
    
    def validate_ruc(self, value):
        """Validación adicional de RUC"""
        if len(value) != 13 or not value.isdigit():
            raise serializers.ValidationError(
                "El RUC debe tener exactamente 13 dígitos numéricos."
            )
        return value