from rest_framework import serializers
from .models import Audit
from companies.serializers import CompanySerializer

class AuditSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    auditor_name = serializers.CharField(source='auditor.full_name', read_only=True)
    
    class Meta:
        model = Audit
        fields = [
            'id', 'company', 'company_name', 'auditor', 'auditor_name',
            'title', 'iso_standard', 'status', 'score', 
            'start_date', 'end_date', 'observations',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class AuditDetailSerializer(AuditSerializer):
    """Serializer con más detalle incluyendo info completa de la empresa"""
    company = CompanySerializer(read_only=True)
    
    class Meta(AuditSerializer.Meta):
        fields = AuditSerializer.Meta.fields