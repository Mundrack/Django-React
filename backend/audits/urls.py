from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuditViewSet, AuditTemplateViewSet, AuditResponseViewSet

router = DefaultRouter()
router.register(r'audits', AuditViewSet, basename='audit')
router.register(r'templates', AuditTemplateViewSet, basename='template')
router.register(r'responses', AuditResponseViewSet, basename='response')

urlpatterns = [
    path('', include(router.urls)),
]