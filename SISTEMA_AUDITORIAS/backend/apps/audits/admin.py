"""
Admin configuration for audits app.
"""
from django.contrib import admin
from .models import AuditTemplate, QuestionSection, Question, Audit, AuditAnswer, Recommendation


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 0


class QuestionSectionInline(admin.TabularInline):
    model = QuestionSection
    extra = 0


@admin.register(AuditTemplate)
class AuditTemplateAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'standard', 'version', 'is_active', 'created_at']
    list_filter = ['is_active', 'standard']
    search_fields = ['name', 'code']
    inlines = [QuestionSectionInline]


@admin.register(QuestionSection)
class QuestionSectionAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'template', 'order']
    list_filter = ['template']
    search_fields = ['name', 'code']
    inlines = [QuestionInline]


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['code', 'text', 'section', 'question_type', 'order']
    list_filter = ['question_type', 'section__template']
    search_fields = ['text', 'code']


class AuditAnswerInline(admin.TabularInline):
    model = AuditAnswer
    extra = 0
    readonly_fields = ['question', 'score', 'answered_at']


@admin.register(Audit)
class AuditAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'template', 'status', 'score', 'created_at']
    list_filter = ['status', 'template']
    search_fields = ['name', 'code']
    inlines = [AuditAnswerInline]


@admin.register(AuditAnswer)
class AuditAnswerAdmin(admin.ModelAdmin):
    list_display = ['audit', 'question', 'score', 'answered_at']
    list_filter = ['audit']


@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = ['title', 'audit', 'priority', 'category', 'status', 'created_at']
    list_filter = ['priority', 'category', 'status']
    search_fields = ['title', 'description']
