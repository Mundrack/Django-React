"""
URL configuration for audit_system project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/', include('apps.core.urls')),
    path('api/', include('apps.audits.urls')),
]
