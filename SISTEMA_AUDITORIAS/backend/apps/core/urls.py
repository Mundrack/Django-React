"""
URLs for core app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    HierarchyTreeView,
    CompanyViewSet,
    BranchViewSet,
    DepartmentViewSet,
    TeamViewSet,
    SubTeamViewSet,
    UserListView,
    InvitationViewSet,
    InvitationDetailView,
    AcceptInvitationView,
    RejectInvitationView,
    OrganizationStatsView,
)

router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'branches', BranchViewSet, basename='branch')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'subteams', SubTeamViewSet, basename='subteam')
router.register(r'invitations', InvitationViewSet, basename='invitation')

urlpatterns = [
    path('', include(router.urls)),
    path('hierarchy/tree/', HierarchyTreeView.as_view(), name='hierarchy-tree'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('invitation/<str:token>/', InvitationDetailView.as_view(), name='invitation-detail'),
    path('invitation/<str:token>/accept/', AcceptInvitationView.as_view(), name='invitation-accept'),
    path('invitation/<str:token>/reject/', RejectInvitationView.as_view(), name='invitation-reject'),
    path('stats/', OrganizationStatsView.as_view(), name='organization-stats'),
]
