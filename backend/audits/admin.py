from django.contrib import admin
from .models import Audit, AuditTemplate, AuditSection, AuditQuestion, AuditResponse

class AuditQuestionInline(admin.TabularInline):
    model = AuditQuestion
    extra = 1
    fields = ['order', 'question_text', 'answer_type', 'weight']

class AuditSectionInline(admin.TabularInline):
    model = AuditSection
    extra = 1
    fields = ['order', 'name']

@admin.register(AuditTemplate)
class AuditTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'iso_standard', 'created_at']
    search_fields = ['name', 'iso_standard']
    inlines = [AuditSectionInline]

@admin.register(AuditSection)
class AuditSectionAdmin(admin.ModelAdmin):
    list_display = ['name', 'template', 'order']
    list_filter = ['template']
    inlines = [AuditQuestionInline]

@admin.register(AuditQuestion)
class AuditQuestionAdmin(admin.ModelAdmin):
    list_display = ['question_text', 'section', 'answer_type', 'order', 'weight']
    list_filter = ['section__template', 'answer_type']
    search_fields = ['question_text']

@admin.register(Audit)
class AuditAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'auditor', 'status', 'score', 'created_at']
    list_filter = ['status', 'iso_standard']
    search_fields = ['title', 'company__name']
    autocomplete_fields = ['company', 'auditor', 'assigned_to', 'template']

@admin.register(AuditResponse)
class AuditResponseAdmin(admin.ModelAdmin):
    list_display = ['audit', 'question', 'answer_choice', 'created_at']
    list_filter = ['audit__status']
    search_fields = ['audit__title']