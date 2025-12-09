"""
Serializers for audits app.
"""
from rest_framework import serializers
from django.db.models import Avg, Sum
from .models import AuditTemplate, QuestionSection, Question, Audit, AuditAnswer, Recommendation


# ============ Template Serializers ============

class QuestionSerializer(serializers.ModelSerializer):
    """Serializer for Question"""
    
    class Meta:
        model = Question
        fields = ['id', 'section', 'text', 'code', 'description', 'question_type', 'choices', 'is_required', 'order', 'weight', 'max_score']


class QuestionSectionSerializer(serializers.ModelSerializer):
    """Serializer for QuestionSection"""
    questions = QuestionSerializer(many=True, read_only=True)
    questions_count = serializers.SerializerMethodField()
    
    class Meta:
        model = QuestionSection
        fields = ['id', 'template', 'name', 'code', 'description', 'order', 'questions', 'questions_count']
    
    def get_questions_count(self, obj):
        return obj.questions.count()


class AuditTemplateSerializer(serializers.ModelSerializer):
    """Serializer for AuditTemplate"""
    sections = QuestionSectionSerializer(many=True, read_only=True)
    total_questions = serializers.ReadOnlyField()
    total_sections = serializers.ReadOnlyField()
    
    class Meta:
        model = AuditTemplate
        fields = ['id', 'name', 'code', 'description', 'standard', 'version', 'is_active', 'is_public', 'created_at', 'sections', 'total_questions', 'total_sections']


class AuditTemplateListSerializer(serializers.ModelSerializer):
    """Simplified serializer for template list"""
    total_questions = serializers.ReadOnlyField()
    total_sections = serializers.ReadOnlyField()
    
    class Meta:
        model = AuditTemplate
        fields = ['id', 'name', 'code', 'description', 'standard', 'version', 'is_active', 'total_questions', 'total_sections']


# ============ Audit Serializers ============

class AuditAnswerSerializer(serializers.ModelSerializer):
    """Serializer for AuditAnswer"""
    question_text = serializers.CharField(source='question.text', read_only=True)
    question_code = serializers.CharField(source='question.code', read_only=True)
    question_type = serializers.CharField(source='question.question_type', read_only=True)
    answer_display = serializers.SerializerMethodField()
    
    class Meta:
        model = AuditAnswer
        fields = ['id', 'audit', 'question', 'question_text', 'question_code', 'question_type', 
                  'answer_boolean', 'answer_scale', 'answer_choice', 'answer_text',
                  'score', 'max_score', 'comments', 'answered_at', 'answer_display']
        read_only_fields = ['id', 'answered_at', 'score']
    
    def get_answer_display(self, obj):
        return obj.get_answer_display()


class SubmitAnswerSerializer(serializers.Serializer):
    """Serializer for submitting an answer"""
    question_id = serializers.IntegerField()
    answer_boolean = serializers.BooleanField(required=False, allow_null=True)
    answer_scale = serializers.IntegerField(required=False, allow_null=True, min_value=1, max_value=5)
    answer_choice = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    answer_text = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    comments = serializers.CharField(required=False, allow_null=True, allow_blank=True)


class RecommendationSerializer(serializers.ModelSerializer):
    """Serializer for Recommendation"""
    section_name = serializers.CharField(source='section.name', read_only=True)
    question_code = serializers.CharField(source='question.code', read_only=True)
    
    class Meta:
        model = Recommendation
        fields = ['id', 'audit', 'section', 'section_name', 'question', 'question_code',
                  'title', 'description', 'action_required', 'priority', 'category', 'status',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at']


class AuditSerializer(serializers.ModelSerializer):
    """Full serializer for Audit"""
    template_name = serializers.CharField(source='template.name', read_only=True)
    level_name = serializers.SerializerMethodField()
    level_type = serializers.SerializerMethodField()
    progress_percentage = serializers.ReadOnlyField()
    answers = AuditAnswerSerializer(many=True, read_only=True)
    recommendations = RecommendationSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.full_name', read_only=True)
    
    class Meta:
        model = Audit
        fields = ['id', 'name', 'code', 'description', 'template', 'template_name', 'organization',
                  'company', 'branch', 'department', 'team', 'subteam',
                  'status', 'total_questions', 'answered_questions', 'score', 'progress_percentage',
                  'start_date', 'end_date', 'completed_at',
                  'created_by', 'created_by_name', 'assigned_to', 'assigned_to_name',
                  'created_at', 'updated_at', 'level_name', 'level_type', 'answers', 'recommendations']
        read_only_fields = ['id', 'code', 'total_questions', 'answered_questions', 'score', 
                           'completed_at', 'created_at', 'updated_at']
    
    def get_level_name(self, obj):
        return obj.get_level_name()
    
    def get_level_type(self, obj):
        return obj.get_level_type()


class AuditListSerializer(serializers.ModelSerializer):
    """Simplified serializer for audit list"""
    template_name = serializers.CharField(source='template.name', read_only=True)
    level_name = serializers.SerializerMethodField()
    level_type = serializers.SerializerMethodField()
    progress_percentage = serializers.ReadOnlyField()
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.full_name', read_only=True)
    
    class Meta:
        model = Audit
        fields = ['id', 'name', 'code', 'template', 'template_name', 'status', 
                  'total_questions', 'answered_questions', 'score', 'progress_percentage',
                  'start_date', 'completed_at', 'created_by_name', 'assigned_to_name',
                  'created_at', 'level_name', 'level_type']
    
    def get_level_name(self, obj):
        return obj.get_level_name()
    
    def get_level_type(self, obj):
        return obj.get_level_type()


class CreateAuditSerializer(serializers.Serializer):
    """Serializer for creating an audit"""
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True)
    template_id = serializers.IntegerField()
    level_type = serializers.ChoiceField(choices=['company', 'branch', 'department', 'team', 'subteam'])
    level_id = serializers.IntegerField()
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)
    assigned_to_id = serializers.IntegerField(required=False, allow_null=True)


# ============ Results Serializers ============

class SectionScoreSerializer(serializers.Serializer):
    """Serializer for section score in results"""
    section_id = serializers.IntegerField()
    section_name = serializers.CharField()
    section_code = serializers.CharField()
    total_questions = serializers.IntegerField()
    answered_questions = serializers.IntegerField()
    score = serializers.FloatField()
    max_score = serializers.FloatField()
    percentage = serializers.FloatField()


class AuditResultsSerializer(serializers.Serializer):
    """Serializer for audit results"""
    audit = AuditListSerializer()
    overall_score = serializers.FloatField()
    total_questions = serializers.IntegerField()
    answered_questions = serializers.IntegerField()
    sections_scores = SectionScoreSerializer(many=True)
    answers_summary = serializers.DictField()
    recommendations = RecommendationSerializer(many=True)


class ComparisonSerializer(serializers.Serializer):
    """Serializer for audit comparison"""
    audits = AuditListSerializer(many=True)
    sections_comparison = serializers.ListField()
    average_score = serializers.FloatField()
    best_audit = serializers.DictField()
    worst_audit = serializers.DictField()


# ============ Statistics Serializers ============

class AuditStatisticsSerializer(serializers.Serializer):
    """Serializer for audit statistics"""
    total_audits = serializers.IntegerField()
    completed_audits = serializers.IntegerField()
    in_progress_audits = serializers.IntegerField()
    draft_audits = serializers.IntegerField()
    average_score = serializers.FloatField()
    audits_by_status = serializers.DictField()
    audits_by_level = serializers.DictField()
    recent_audits = AuditListSerializer(many=True)
    score_trend = serializers.ListField()
