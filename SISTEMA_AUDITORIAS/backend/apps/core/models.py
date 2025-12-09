"""
Models for core app.
Organizational hierarchy: Company, Branch, Department, Team, SubTeam
User assignments and invitations
"""
from django.db import models
from django.conf import settings
from apps.authentication.models import Organization
import uuid


class Company(models.Model):
    """Company model - first level under Organization"""
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='companies')
    name = models.CharField(max_length=255, verbose_name='Nombre')
    code = models.CharField(max_length=50, unique=True, verbose_name='Código')
    description = models.TextField(blank=True, null=True, verbose_name='Descripción')
    address = models.TextField(blank=True, null=True, verbose_name='Dirección')
    phone = models.CharField(max_length=50, blank=True, null=True, verbose_name='Teléfono')
    email = models.EmailField(blank=True, null=True, verbose_name='Email')
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='companies_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Empresa'
        verbose_name_plural = 'Empresas'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class Branch(models.Model):
    """Branch model - second level"""
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='branches')
    name = models.CharField(max_length=255, verbose_name='Nombre')
    code = models.CharField(max_length=50, unique=True, verbose_name='Código')
    description = models.TextField(blank=True, null=True, verbose_name='Descripción')
    address = models.TextField(blank=True, null=True, verbose_name='Dirección')
    phone = models.CharField(max_length=50, blank=True, null=True, verbose_name='Teléfono')
    email = models.EmailField(blank=True, null=True, verbose_name='Email')
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='branches_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Sucursal'
        verbose_name_plural = 'Sucursales'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class Department(models.Model):
    """Department model - third level"""
    
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=255, verbose_name='Nombre')
    code = models.CharField(max_length=50, unique=True, verbose_name='Código')
    description = models.TextField(blank=True, null=True, verbose_name='Descripción')
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='departments_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Departamento'
        verbose_name_plural = 'Departamentos'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class Team(models.Model):
    """Team model - fourth level"""
    
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='teams')
    name = models.CharField(max_length=255, verbose_name='Nombre')
    code = models.CharField(max_length=50, unique=True, verbose_name='Código')
    description = models.TextField(blank=True, null=True, verbose_name='Descripción')
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='teams_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Equipo'
        verbose_name_plural = 'Equipos'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class SubTeam(models.Model):
    """SubTeam model - fifth level (last)"""
    
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='subteams')
    name = models.CharField(max_length=255, verbose_name='Nombre')
    code = models.CharField(max_length=50, unique=True, verbose_name='Código')
    description = models.TextField(blank=True, null=True, verbose_name='Descripción')
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='subteams_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Sub-equipo'
        verbose_name_plural = 'Sub-equipos'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class UserAssignment(models.Model):
    """User assignment to a specific level in the hierarchy"""
    
    ROLE_CHOICES = [
        ('manager', 'Gerente'),
        ('employee', 'Empleado'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assignments')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='user_assignments')
    
    # Only ONE of these should have a value (the others should be NULL)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True, related_name='user_assignments')
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, null=True, blank=True, related_name='user_assignments')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True, related_name='user_assignments')
    team = models.ForeignKey(Team, on_delete=models.CASCADE, null=True, blank=True, related_name='user_assignments')
    subteam = models.ForeignKey(SubTeam, on_delete=models.CASCADE, null=True, blank=True, related_name='user_assignments')
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Asignación de Usuario'
        verbose_name_plural = 'Asignaciones de Usuarios'
    
    def __str__(self):
        return f"{self.user.email} - {self.role} en {self.get_level_name()}"
    
    def get_level_name(self):
        """Get the name of the assigned level"""
        if self.subteam:
            return f"Sub-equipo: {self.subteam.name}"
        elif self.team:
            return f"Equipo: {self.team.name}"
        elif self.department:
            return f"Departamento: {self.department.name}"
        elif self.branch:
            return f"Sucursal: {self.branch.name}"
        elif self.company:
            return f"Empresa: {self.company.name}"
        return "Organización"


class Invitation(models.Model):
    """Invitation to join the organization"""
    
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('accepted', 'Aceptada'),
        ('rejected', 'Rechazada'),
        ('expired', 'Expirada'),
    ]
    
    ROLE_CHOICES = [
        ('manager', 'Gerente'),
        ('employee', 'Empleado'),
    ]
    
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='invitations_sent')
    to_email = models.EmailField(verbose_name='Email del invitado')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='invitations')
    
    # Level to assign (only one should have value)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True, related_name='invitations')
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, null=True, blank=True, related_name='invitations')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True, related_name='invitations')
    team = models.ForeignKey(Team, on_delete=models.CASCADE, null=True, blank=True, related_name='invitations')
    subteam = models.ForeignKey(SubTeam, on_delete=models.CASCADE, null=True, blank=True, related_name='invitations')
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee')
    token = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Invitación'
        verbose_name_plural = 'Invitaciones'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Invitación a {self.to_email} - {self.status}"
    
    def get_level_name(self):
        """Get the name of the level to assign"""
        if self.subteam:
            return f"Sub-equipo: {self.subteam.name}"
        elif self.team:
            return f"Equipo: {self.team.name}"
        elif self.department:
            return f"Departamento: {self.department.name}"
        elif self.branch:
            return f"Sucursal: {self.branch.name}"
        elif self.company:
            return f"Empresa: {self.company.name}"
        return "Organización"
