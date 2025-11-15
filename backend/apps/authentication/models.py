"""
Modelos de autenticación
Nota: Usamos Supabase como base de datos, estos modelos son solo para Django Admin
"""

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import uuid


class UserManager(BaseUserManager):
    """Manager personalizado para el modelo de usuario"""
    
    def create_user(self, email, full_name, password=None, **extra_fields):
        """Crea y guarda un usuario regular"""
        if not email:
            raise ValueError('El email es obligatorio')
        
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, full_name, password=None, **extra_fields):
        """Crea y guarda un superusuario"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'super_admin')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser debe tener is_superuser=True.')
        
        return self.create_user(email, full_name, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Modelo de usuario personalizado
    Este modelo se sincroniza con Supabase
    """
    
    ROLE_CHOICES = [
        ('super_admin', 'Super Administrador'),
        ('company_admin', 'Administrador de Empresa'),
        ('company_user', 'Usuario de Empresa'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, verbose_name='Correo Electrónico')
    full_name = models.CharField(max_length=255, verbose_name='Nombre Completo')
    role = models.CharField(
        max_length=50,
        choices=ROLE_CHOICES,
        default='company_user',
        verbose_name='Rol'
    )
    is_active = models.BooleanField(default=True, verbose_name='Activo')
    is_staff = models.BooleanField(default=False, verbose_name='Es Staff')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de Actualización')
    
    # Relaciones Many-to-Many con related_name personalizado para evitar conflictos
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name='custom_user_set',
        related_query_name='user',
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='custom_user_set',
        related_query_name='user',
    )
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.email} - {self.get_role_display()}"
    
    def is_super_admin(self):
        """Verifica si el usuario es super admin"""
        return self.role == 'super_admin'
    
    def is_company_admin(self):
        """Verifica si el usuario es admin de empresa"""
        return self.role == 'company_admin'
    
    def is_company_user(self):
        """Verifica si el usuario es usuario de empresa"""
        return self.role == 'company_user'