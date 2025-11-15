from django.contrib import admin
from .models import Audit

@admin.register(Audit)
class AuditAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'iso_standard', 'status', 'score', 'start_date']
    list_filter = ['status', 'iso_standard', 'created_at']
    search_fields = ['title', 'company__name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Información General', {
            'fields': ('title', 'company', 'auditor', 'iso_standard')
        }),
        ('Estado y Resultados', {
            'fields': ('status', 'score', 'observations')
        }),
        ('Fechas', {
            'fields': ('start_date', 'end_date', 'created_at', 'updated_at')
        }),
    )
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """DROPDOWNS para empresa y auditor"""
        if db_field.name == "company":
            kwargs["empty_label"] = "--- Seleccione Empresa ---"
        if db_field.name == "auditor":
            kwargs["empty_label"] = "--- Seleccione Auditor ---"
        return super().formfield_for_foreignkey(db_field, request, **kwargs)