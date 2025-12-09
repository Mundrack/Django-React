"""
Models for audits app.
AuditTemplate, QuestionSection, Question, Audit, AuditAnswer, Recommendation
"""
from django.db import models
from django.conf import settings
from apps.authentication.models import Organization
from apps.core.models import Company, Branch, Department, Team, SubTeam
import uuid


class AuditTemplate(models.Model):
    """Audit template (ISO 27701, etc.)"""
    
    name = models.CharField(max_length=255, verbose_name='Nombre')
    code = models.CharField(max_length=50, unique=True, verbose_name='Código')
    description = models.TextField(verbose_name='Descripción')
    standard = models.CharField(max_length=100, verbose_name='Estándar')
    version = models.CharField(max_length=50, verbose_name='Versión')
    is_active = models.BooleanField(default=True)
    is_public = models.BooleanField(default=True, verbose_name='Público')  # Available to all orgs
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='templates_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Plantilla de Auditoría'
        verbose_name_plural = 'Plantillas de Auditoría'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    @property
    def total_questions(self):
        return Question.objects.filter(section__template=self).count()
    
    @property
    def total_sections(self):
        return self.sections.count()


class QuestionSection(models.Model):
    """Section of questions within a template"""
    
    template = models.ForeignKey(AuditTemplate, on_delete=models.CASCADE, related_name='sections')
    name = models.CharField(max_length=255, verbose_name='Nombre')
    code = models.CharField(max_length=50, verbose_name='Código')
    description = models.TextField(blank=True, null=True, verbose_name='Descripción')
    order = models.IntegerField(default=0, verbose_name='Orden')
    
    class Meta:
        verbose_name = 'Sección de Preguntas'
        verbose_name_plural = 'Secciones de Preguntas'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    @property
    def questions_count(self):
        return self.questions.count()


class Question(models.Model):
    """Audit question"""
    
    QUESTION_TYPE_CHOICES = [
        ('yes_no', 'Sí/No'),
        ('scale', 'Escala (1-5)'),
        ('multiple_choice', 'Opción Múltiple'),
        ('text', 'Texto Libre'),
    ]
    
    section = models.ForeignKey(QuestionSection, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField(verbose_name='Texto de la pregunta')
    code = models.CharField(max_length=50, verbose_name='Código')
    description = models.TextField(blank=True, null=True, verbose_name='Descripción/Ayuda')
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPE_CHOICES, default='yes_no')
    choices = models.JSONField(blank=True, null=True, verbose_name='Opciones')  # For multiple_choice
    is_required = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    weight = models.IntegerField(default=1, verbose_name='Peso')
    max_score = models.IntegerField(default=5, verbose_name='Puntos máximos')
    
    class Meta:
        verbose_name = 'Pregunta'
        verbose_name_plural = 'Preguntas'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.code} - {self.text[:50]}..."


class Audit(models.Model):
    """Executed audit at a specific organizational level"""
    
    STATUS_CHOICES = [
        ('draft', 'Borrador'),
        ('in_progress', 'En Progreso'),
        ('completed', 'Completada'),
        ('reviewed', 'Revisada'),
    ]
    
    name = models.CharField(max_length=255, verbose_name='Nombre')
    code = models.CharField(max_length=50, unique=True, verbose_name='Código')
    description = models.TextField(blank=True, null=True, verbose_name='Descripción')
    
    template = models.ForeignKey(AuditTemplate, on_delete=models.PROTECT, related_name='audits')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='audits')
    
    # Level where audit is executed (only ONE should have a value)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True, related_name='audits')
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, null=True, blank=True, related_name='audits')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True, related_name='audits')
    team = models.ForeignKey(Team, on_delete=models.CASCADE, null=True, blank=True, related_name='audits')
    subteam = models.ForeignKey(SubTeam, on_delete=models.CASCADE, null=True, blank=True, related_name='audits')
    
    # Status and scores
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    total_questions = models.IntegerField(default=0)
    answered_questions = models.IntegerField(default=0)
    score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Dates
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Users
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='audits_created')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='audits_assigned')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Auditoría'
        verbose_name_plural = 'Auditorías'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    def save(self, *args, **kwargs):
        if not self.code:
            # Auto-generate code
            year = self.created_at.year if self.created_at else 2025
            count = Audit.objects.filter(organization=self.organization).count() + 1
            self.code = f"AUD-{year}-{count:04d}"
        super().save(*args, **kwargs)
    
    def get_level_name(self):
        """Get the name of the level where audit is executed"""
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
    
    def get_level_type(self):
        """Get the type of level"""
        if self.subteam:
            return 'subteam'
        elif self.team:
            return 'team'
        elif self.department:
            return 'department'
        elif self.branch:
            return 'branch'
        elif self.company:
            return 'company'
        return 'organization'
    
    @property
    def progress_percentage(self):
        if self.total_questions == 0:
            return 0
        return round((self.answered_questions / self.total_questions) * 100, 2)


class AuditAnswer(models.Model):
    """Answer to an audit question"""
    
    audit = models.ForeignKey(Audit, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='audit_answers')
    
    # Answer based on question type
    answer_boolean = models.BooleanField(null=True, blank=True)  # For yes_no
    answer_scale = models.IntegerField(null=True, blank=True)  # For scale (1-5)
    answer_choice = models.CharField(max_length=255, null=True, blank=True)  # For multiple_choice
    answer_text = models.TextField(null=True, blank=True)  # For text
    
    # Scoring
    score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    max_score = models.DecimalField(max_digits=5, decimal_places=2, default=5)
    
    # Metadata
    comments = models.TextField(blank=True, null=True)
    answered_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='answers_given')
    answered_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Respuesta de Auditoría'
        verbose_name_plural = 'Respuestas de Auditoría'
        unique_together = ['audit', 'question']
    
    def __str__(self):
        return f"Respuesta a {self.question.code} en {self.audit.code}"
    
    def get_answer_display(self):
        """Get human-readable answer"""
        if self.question.question_type == 'yes_no':
            if self.answer_boolean is None:
                return "Sin respuesta"
            return "Sí" if self.answer_boolean else "No"
        elif self.question.question_type == 'scale':
            return f"{self.answer_scale}/5" if self.answer_scale else "Sin respuesta"
        elif self.question.question_type == 'multiple_choice':
            return self.answer_choice or "Sin respuesta"
        elif self.question.question_type == 'text':
            return self.answer_text[:50] + "..." if self.answer_text else "Sin respuesta"
        return "Sin respuesta"


class Recommendation(models.Model):
    """Automatic recommendation based on audit results"""
    
    PRIORITY_CHOICES = [
        ('critical', 'Crítico'),
        ('high', 'Alto'),
        ('medium', 'Medio'),
        ('low', 'Bajo'),
    ]
    
    CATEGORY_CHOICES = [
        ('technical', 'Técnico'),
        ('organizational', 'Organizacional'),
        ('legal', 'Jurídico'),
        ('documentation', 'Documentación'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('in_progress', 'En Progreso'),
        ('completed', 'Completado'),
    ]
    
    audit = models.ForeignKey(Audit, on_delete=models.CASCADE, related_name='recommendations')
    section = models.ForeignKey(QuestionSection, on_delete=models.SET_NULL, null=True, blank=True, related_name='recommendations')
    question = models.ForeignKey(Question, on_delete=models.SET_NULL, null=True, blank=True, related_name='recommendations')
    
    title = models.CharField(max_length=255, verbose_name='Título')
    description = models.TextField(verbose_name='Descripción')
    action_required = models.TextField(verbose_name='Acción requerida')
    
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='organizational')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Recomendación'
        verbose_name_plural = 'Recomendaciones'
        ordering = ['priority', '-created_at']
    
    def __str__(self):
        return f"{self.priority}: {self.title}"
