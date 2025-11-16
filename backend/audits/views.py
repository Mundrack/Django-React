from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Audit
from .serializers import AuditSerializer, AuditDetailSerializer

class AuditViewSet(viewsets.ModelViewSet):
    queryset = Audit.objects.all().select_related('company', 'auditor')
    serializer_class = AuditSerializer
    permission_classes = [AllowAny]  # Temporalmente público
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AuditDetailSerializer
        return AuditSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtrar por empresa
        company_id = self.request.query_params.get('company', None)
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        
        # Filtrar por estado
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        
        # Filtrar por estándar ISO
        iso_standard = self.request.query_params.get('iso_standard', None)
        if iso_standard:
            queryset = queryset.filter(iso_standard=iso_standard)
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Enviar auditoría (cambiar estado a completed)"""
        audit = self.get_object()
        audit.status = 'completed'
        audit.save()
        return Response({'status': 'Auditoría enviada correctamente'})