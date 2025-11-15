from django.db import models
from django.core.exceptions import ValidationError
import re

def validate_ruc(value):
    """Validación de RUC ecuatoriano: debe tener exactamente 13 dígitos numéricos"""
    if not re.match(r'^\d{13}$', value):
        raise ValidationError('El RUC debe tener exactamente 13 dígitos numéricos.')
    return value

class Company(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    ruc = models.CharField(max_length=13, unique=True, validators=[validate_ruc])
    is_parent = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subsidiaries')
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'companies'
        managed = False
        verbose_name = 'Empresa'
        verbose_name_plural = 'Empresas'
    
    def clean(self):
        """Validación adicional en el modelo"""
        # Validar formato de RUC
        validate_ruc(self.ruc)
        
        # Validar lógica de empresa matriz/filial
        if self.is_parent and self.parent:
            raise ValidationError('Una empresa matriz no puede tener una empresa padre.')
        if not self.is_parent and not self.parent:
            # Permitir empresas independientes (ni matriz ni filial)
            pass
    
    def save(self, *args, **kwargs):
        self.full_clean()  # Ejecuta las validaciones antes de guardar
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.name} - RUC: {self.ruc}"