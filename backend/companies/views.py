from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Company
from .serializers import CompanySerializer

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all().select_related('parent')
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]  # Temporalmente público para pruebas
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Filtrar por tipo (matriz o filial)
        is_parent = self.request.query_params.get('is_parent', None)
        if is_parent is not None:
            queryset = queryset.filter(is_parent=is_parent.lower() == 'true')
        return queryset
    
    @action(detail=True, methods=['get'])
    def tree(self, request, pk=None):
        """Obtiene el árbol jerárquico de una empresa"""
        company = self.get_object()
        
        if company.is_parent:
            # Es matriz, devolver con sus filiales
            subsidiaries = Company.objects.filter(parent=company)
            data = {
                'company': CompanySerializer(company).data,
                'subsidiaries': CompanySerializer(subsidiaries, many=True).data
            }
        else:
            # Es filial, devolver con su matriz
            data = {
                'company': CompanySerializer(company).data,
                'parent': CompanySerializer(company.parent).data if company.parent else None
            }
        
        return Response(data)
    
    @action(detail=False, methods=['get'])
    def parents(self, request):
        """Lista solo empresas matriz"""
        parents = Company.objects.filter(is_parent=True)
        serializer = self.get_serializer(parents, many=True)
        return Response(serializer.data)