from django.db import models

class User(models.Model):
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('company_admin', 'Company Admin'),
        ('company_user', 'Company User'),
    ]

    id = models.BigAutoField(primary_key=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} ({self.email})"