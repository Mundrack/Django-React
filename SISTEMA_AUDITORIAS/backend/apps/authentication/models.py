"""
Models for authentication app.
User and Organization models.
"""
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    """Custom user manager"""
    
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('user_type', 'owner')
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Custom User model with email as username"""
    
    USER_TYPE_CHOICES = [
        ('owner', 'Dueño'),
        ('employee', 'Empleado'),
    ]
    
    email = models.EmailField(unique=True, verbose_name='Email')
    full_name = models.CharField(max_length=255, verbose_name='Nombre completo')
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='employee', verbose_name='Tipo de usuario')
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.full_name} ({self.email})"
    
    @property
    def is_owner(self):
        return self.user_type == 'owner'


class Organization(models.Model):
    """Organization model - top level of hierarchy"""
    
    name = models.CharField(max_length=255, verbose_name='Nombre')
    description = models.TextField(blank=True, null=True, verbose_name='Descripción')
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name='organization', verbose_name='Dueño')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Organización'
        verbose_name_plural = 'Organizaciones'
    
    def __str__(self):
        return self.name
