from rest_framework import serializers
from .models import Audit, AuditTemplate, AuditSection, AuditQuestion, AuditResponse
from companies.serializers import CompanySerializer

class AuditQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditQuestion
        fields = ['id', 'question_text', 'answer_type', 'order', 'weight']

class AuditSectionSerializer(serializers.ModelSerializer):
    questions = AuditQuestionSerializer(many=True, read_only=True)
    questions_count = serializers.SerializerMethodField()
    
    class Meta:
        model = AuditSection
        fields = ['id', 'name', 'order', 'questions', 'questions_count']
    
    def get_questions_count(self, obj):
        return obj.questions.count()

class AuditTemplateSerializer(serializers.ModelSerializer):
    sections = AuditSectionSerializer(many=True, read_only=True)
    sections_count = serializers.SerializerMethodField()
    total_questions = serializers.SerializerMethodField()
    
    class Meta:
        model = AuditTemplate
        fields = ['id', 'name', 'description', 'iso_standard', 'sections', 
                  'sections_count', 'total_questions', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def get_sections_count(self, obj):
        return obj.sections.count()
    
    def get_total_questions(self, obj):
        total = 0
        for section in obj.sections.all():
            total += section.questions.count()
        return total

class AuditResponseSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    
    class Meta:
        model = AuditResponse
        fields = ['id', 'question', 'question_text', 'answer_text', 
                  'answer_choice', 'answer_numeric', 'evidence_file', 'notes']

class AuditSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    auditor_name = serializers.CharField(source='auditor.full_name', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.full_name', read_only=True)
    template_name = serializers.CharField(source='template.name', read_only=True)
    
    class Meta:
        model = Audit
        fields = [
            'id', 'template', 'template_name', 'company', 'company_name', 
            'auditor', 'auditor_name', 'assigned_to', 'assigned_to_name',
            'title', 'iso_standard', 'status', 'score', 
            'start_date', 'end_date', 'observations',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class AuditDetailSerializer(AuditSerializer):
    """Serializer con más detalle incluyendo respuestas"""
    company = CompanySerializer(read_only=True)
    template = AuditTemplateSerializer(read_only=True)
    responses = AuditResponseSerializer(many=True, read_only=True)
    
    class Meta(AuditSerializer.Meta):
        fields = AuditSerializer.Meta.fields + ['responses']