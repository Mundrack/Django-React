from django.db import models
from companies.models import Company
from authentication.models import User

STATUS_CHOICES = [
    ('pending', 'Pendiente'),
    ('in_progress', 'En Progreso'),
    ('completed', 'Completada'),
]

class AuditTemplate(models.Model):
    """Plantilla de auditoría (ISO 9001, ISO 27001, etc.)"""
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    iso_standard = models.CharField(max_length=50)  # ISO 9001, ISO 27001, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'audit_templates'
    
    def __str__(self):
        return f"{self.name} - {self.iso_standard}"

class AuditSection(models.Model):
    """Secciones de una plantilla de auditoría"""
    template = models.ForeignKey(AuditTemplate, on_delete=models.CASCADE, related_name='sections')
    name = models.CharField(max_length=255)
    order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'audit_sections'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.template.name} - {self.name}"

class AuditQuestion(models.Model):
    """Preguntas de una sección de auditoría"""
    ANSWER_TYPES = [
        ('yes_no', 'Sí/No'),
        ('yes_no_partial', 'Sí/No/Parcial'),
        ('scale_1_5', 'Escala 1-5'),
        ('text', 'Texto'),
    ]
    
    section = models.ForeignKey(AuditSection, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    answer_type = models.CharField(max_length=20, choices=ANSWER_TYPES, default='yes_no_partial')
    order = models.IntegerField(default=0)
    weight = models.DecimalField(max_digits=5, decimal_places=2, default=1.0)  # Peso para el puntaje
    
    class Meta:
        db_table = 'audit_questions'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.section.name} - Q{self.order}"

class Audit(models.Model):
    """Auditoría individual asignada a una empresa"""
    template = models.ForeignKey(AuditTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='audits')
    auditor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='audits_created')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='audits_assigned')
    
    title = models.CharField(max_length=255)
    iso_standard = models.CharField(max_length=50)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    observations = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'audits'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.company.name}"

class AuditResponse(models.Model):
    """Respuestas a preguntas de auditoría"""
    audit = models.ForeignKey(Audit, on_delete=models.CASCADE, related_name='responses')
    question = models.ForeignKey(AuditQuestion, on_delete=models.CASCADE)
    
    # Diferentes tipos de respuestas
    answer_text = models.TextField(blank=True)  # Para respuestas de texto
    answer_choice = models.CharField(max_length=20, blank=True)  # yes/no/partial
    answer_numeric = models.IntegerField(null=True, blank=True)  # Para escala 1-5
    
    evidence_file = models.CharField(max_length=500, blank=True)  # URL del archivo
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'audit_responses'
        unique_together = ('audit', 'question')
    
    def __str__(self):
        return f"{self.audit.title} - {self.question.question_text[:50]}"