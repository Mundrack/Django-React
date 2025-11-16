from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Audit, AuditTemplate, AuditSection, AuditQuestion, AuditResponse
from .serializers import (
    AuditSerializer, AuditDetailSerializer, 
    AuditTemplateSerializer, AuditSectionSerializer, 
    AuditQuestionSerializer, AuditResponseSerializer
)

class AuditTemplateViewSet(viewsets.ModelViewSet):
    queryset = AuditTemplate.objects.all().prefetch_related('sections__questions')
    serializer_class = AuditTemplateSerializer
    permission_classes = [AllowAny]

class AuditViewSet(viewsets.ModelViewSet):
    queryset = Audit.objects.all().select_related('company', 'auditor', 'assigned_to', 'template')
    serializer_class = AuditSerializer
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AuditDetailSerializer
        return AuditSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        company_id = self.request.query_params.get('company', None)
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        
        assigned_to = self.request.query_params.get('assigned_to', None)
        if assigned_to:
            queryset = queryset.filter(assigned_to_id=assigned_to)
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Enviar auditoría (cambiar estado a completed)"""
        audit = self.get_object()
        audit.status = 'completed'
        
        # Calcular puntaje automáticamente
        responses = audit.responses.all()
        if responses.exists():
            total_weight = 0
            earned_points = 0
            
            for response in responses:
                weight = response.question.weight
                total_weight += weight
                
                if response.answer_choice == 'yes':
                    earned_points += weight
                elif response.answer_choice == 'partial':
                    earned_points += weight * 0.5
            
            if total_weight > 0:
                audit.score = (earned_points / total_weight) * 100
        
        audit.save()
        return Response({'status': 'Auditoría enviada', 'score': audit.score})

class AuditResponseViewSet(viewsets.ModelViewSet):
    queryset = AuditResponse.objects.all()
    serializer_class = AuditResponseSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        audit_id = self.request.query_params.get('audit', None)
        if audit_id:
            queryset = queryset.filter(audit_id=audit_id)
        return queryset