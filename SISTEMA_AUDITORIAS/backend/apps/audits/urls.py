"""
URLs for audits app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    AuditTemplateViewSet,
    AuditViewSet,
    RecommendationViewSet,
    AuditComparisonView,
    AuditStatisticsView,
    DashboardView,
)

router = DefaultRouter()
router.register(r'templates', AuditTemplateViewSet, basename='template')
router.register(r'audits', AuditViewSet, basename='audit')
router.register(r'recommendations', RecommendationViewSet, basename='recommendation')

urlpatterns = [
    path('', include(router.urls)),
    path('comparisons/', AuditComparisonView.as_view(), name='audit-comparison'),
    path('statistics/', AuditStatisticsView.as_view(), name='audit-statistics'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]
