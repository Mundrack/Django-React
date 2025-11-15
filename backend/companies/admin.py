from django.contrib import admin
from .models import Company

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'ruc', 'is_parent', 'parent', 'phone', 'created_at']
    list_filter = ['is_parent', 'created_at']
    search_fields = ['name', 'ruc']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('name', 'ruc', 'is_parent')
        }),
        ('Jerarquía Empresarial', {
            'fields': ('parent',),
            'description': 'Si esta es una filial, seleccione la empresa matriz del dropdown'
        }),
        ('Datos de Contacto', {
            'fields': ('address', 'phone')
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """DROPDOWN para seleccionar empresa matriz - solo muestra empresas que son matriz"""
        if db_field.name == "parent":
            kwargs["queryset"] = Company.objects.filter(is_parent=True)
            kwargs["empty_label"] = "--- Seleccione Empresa Matriz ---"
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('parent')