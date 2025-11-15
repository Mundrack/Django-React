from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'full_name', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active']
    search_fields = ['email', 'full_name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Información Personal', {
            'fields': ('email', 'full_name', 'password')
        }),
        ('Permisos', {
            'fields': ('role', 'is_active')
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at')
        }),
    )