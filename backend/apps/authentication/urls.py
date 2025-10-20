"""
URLs para autenticación
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    path('me/', views.me_view, name='me'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]