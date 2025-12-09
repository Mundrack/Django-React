"""
Views for audits app.
"""
from rest_framework import viewsets, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q

from .models import AuditTemplate, QuestionSection, Question, Audit, AuditAnswer, Recommendation
from .serializers import (
    AuditTemplateSerializer, AuditTemplateListSerializer,
    QuestionSectionSerializer, QuestionSerializer,
    AuditSerializer, AuditListSerializer, CreateAuditSerializer,
    AuditAnswerSerializer, SubmitAnswerSerializer,
    RecommendationSerializer,
    AuditResultsSerializer, ComparisonSerializer, AuditStatisticsSerializer,
)
from .services import (
    calculate_answer_score, calculate_audit_score, get_section_scores,
    generate_recommendations, get_audit_results, get_visible_audits,
    get_comparison_data, get_audit_statistics,
)
from apps.core.models import Company, Branch, Department, Team, SubTeam


def get_user_organization(user):
    """Get organization for a user"""
    if user.user_type == 'owner' and hasattr(user, 'organization'):
        return user.organization
    
    assignment = user.assignments.filter(is_active=True).first()
    if assignment:
        return assignment.organization
    
    return None


# ============ Template Views ============

class AuditTemplateViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for AuditTemplate (read-only for now)"""
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return AuditTemplateListSerializer
        return AuditTemplateSerializer
    
    def get_queryset(self):
        return AuditTemplate.objects.filter(is_active=True, is_public=True)


# ============ Audit Views ============

class AuditViewSet(viewsets.ModelViewSet):
    """ViewSet for Audit"""
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return AuditListSerializer
        elif self.action == 'create':
            return CreateAuditSerializer
        return AuditSerializer
    
    def get_queryset(self):
        user = self.request.user
        audits = get_visible_audits(user)
        
        # Filters
        status_filter = self.request.query_params.get('status')
        if status_filter:
            audits = audits.filter(status=status_filter)
        
        template_id = self.request.query_params.get('template')
        if template_id:
            audits = audits.filter(template_id=template_id)
        
        level_type = self.request.query_params.get('level_type')
        level_id = self.request.query_params.get('level_id')
        if level_type and level_id:
            filter_kwargs = {level_type + '_id': level_id}
            audits = audits.filter(**filter_kwargs)
        
        return audits.order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        serializer = CreateAuditSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        organization = get_user_organization(request.user)
        
        if not organization:
            return Response({'error': 'No tienes una organización'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get template
        try:
            template = AuditTemplate.objects.get(id=data['template_id'], is_active=True)
        except AuditTemplate.DoesNotExist:
            return Response({'error': 'Plantilla no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
        # Create audit
        audit_data = {
            'name': data['name'],
            'description': data.get('description', ''),
            'template': template,
            'organization': organization,
            'created_by': request.user,
            'total_questions': template.total_questions,
            'start_date': data.get('start_date'),
            'end_date': data.get('end_date'),
        }
        
        # Set level
        level_type = data['level_type']
        level_id = data['level_id']
        
        level_models = {
            'company': Company,
            'branch': Branch,
            'department': Department,
            'team': Team,
            'subteam': SubTeam,
        }
        
        model = level_models.get(level_type)
        try:
            level_obj = model.objects.get(id=level_id)
            audit_data[level_type] = level_obj
        except model.DoesNotExist:
            return Response({'error': f'{level_type} no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Set assigned user if provided
        if data.get('assigned_to_id'):
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                assigned_user = User.objects.get(id=data['assigned_to_id'])
                audit_data['assigned_to'] = assigned_user
            except User.DoesNotExist:
                pass
        
        audit = Audit.objects.create(**audit_data)
        
        return Response(AuditSerializer(audit).data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Start an audit (change status to in_progress)"""
        audit = self.get_object()
        
        if audit.status != 'draft':
            return Response({'error': 'Solo se pueden iniciar auditorías en borrador'}, status=status.HTTP_400_BAD_REQUEST)
        
        audit.status = 'in_progress'
        audit.save()
        
        return Response(AuditSerializer(audit).data)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Complete an audit"""
        audit = self.get_object()
        
        if audit.status != 'in_progress':
            return Response({'error': 'Solo se pueden completar auditorías en progreso'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate final score
        audit.score = calculate_audit_score(audit)
        audit.status = 'completed'
        audit.completed_at = timezone.now()
        audit.save()
        
        # Generate recommendations
        generate_recommendations(audit)
        
        return Response(AuditSerializer(audit).data)
    
    @action(detail=True, methods=['get'])
    def questions(self, request, pk=None):
        """Get all questions for an audit"""
        audit = self.get_object()
        sections = audit.template.sections.all().order_by('order')
        
        data = []
        for section in sections:
            section_data = QuestionSectionSerializer(section).data
            
            # Add answered status to each question
            for question_data in section_data['questions']:
                answer = audit.answers.filter(question_id=question_data['id']).first()
                question_data['answered'] = answer is not None
                if answer:
                    question_data['answer'] = AuditAnswerSerializer(answer).data
            
            data.append(section_data)
        
        return Response(data)
    
    @action(detail=True, methods=['post'])
    def answer(self, request, pk=None):
        """Submit an answer for a question"""
        audit = self.get_object()
        
        if audit.status == 'completed':
            return Response({'error': 'No se pueden modificar auditorías completadas'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Auto-start if in draft
        if audit.status == 'draft':
            audit.status = 'in_progress'
        
        serializer = SubmitAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        
        # Get question
        try:
            question = Question.objects.get(id=data['question_id'], section__template=audit.template)
        except Question.DoesNotExist:
            return Response({'error': 'Pregunta no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
        # Create or update answer
        answer, created = AuditAnswer.objects.update_or_create(
            audit=audit,
            question=question,
            defaults={
                'answer_boolean': data.get('answer_boolean'),
                'answer_scale': data.get('answer_scale'),
                'answer_choice': data.get('answer_choice'),
                'answer_text': data.get('answer_text'),
                'comments': data.get('comments'),
                'answered_by': request.user,
                'max_score': question.max_score * question.weight,
            }
        )
        
        # Calculate score for this answer
        answer.score = calculate_answer_score(answer)
        answer.save()
        
        # Update audit progress
        audit.answered_questions = audit.answers.count()
        audit.score = calculate_audit_score(audit)
        audit.save()
        
        return Response(AuditAnswerSerializer(answer).data)
    
    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        """Get audit results"""
        audit = self.get_object()
        results = get_audit_results(audit)
        
        return Response({
            'audit': AuditListSerializer(results['audit']).data,
            'overall_score': results['overall_score'],
            'total_questions': results['total_questions'],
            'answered_questions': results['answered_questions'],
            'sections_scores': results['sections_scores'],
            'answers_summary': results['answers_summary'],
            'recommendations': RecommendationSerializer(results['recommendations'], many=True).data,
        })
    
    @action(detail=True, methods=['get'])
    def answers(self, request, pk=None):
        """Get all answers for an audit"""
        audit = self.get_object()
        answers = audit.answers.all().order_by('question__section__order', 'question__order')
        return Response(AuditAnswerSerializer(answers, many=True).data)


# ============ Recommendations Views ============

class RecommendationViewSet(viewsets.ModelViewSet):
    """ViewSet for Recommendations"""
    permission_classes = [IsAuthenticated]
    serializer_class = RecommendationSerializer
    
    def get_queryset(self):
        user = self.request.user
        audits = get_visible_audits(user)
        return Recommendation.objects.filter(audit__in=audits)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update recommendation status"""
        recommendation = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in ['pending', 'in_progress', 'completed']:
            return Response({'error': 'Estado inválido'}, status=status.HTTP_400_BAD_REQUEST)
        
        recommendation.status = new_status
        recommendation.save()
        
        return Response(RecommendationSerializer(recommendation).data)


# ============ Comparison Views ============

class AuditComparisonView(APIView):
    """Compare multiple audits"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        audit_ids = request.query_params.get('audit_ids', '').split(',')
        audit_ids = [int(id) for id in audit_ids if id.isdigit()]
        
        if len(audit_ids) < 2:
            return Response({'error': 'Se necesitan al menos 2 auditorías para comparar'}, status=status.HTTP_400_BAD_REQUEST)
        
        if len(audit_ids) > 5:
            return Response({'error': 'Máximo 5 auditorías para comparar'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get visible audits
        visible_audits = get_visible_audits(request.user)
        audits = list(visible_audits.filter(id__in=audit_ids, status='completed'))
        
        if len(audits) < 2:
            return Response({'error': 'No se encontraron suficientes auditorías completadas'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check same template
        templates = set(a.template_id for a in audits)
        if len(templates) > 1:
            return Response({'error': 'Solo se pueden comparar auditorías de la misma plantilla'}, status=status.HTTP_400_BAD_REQUEST)
        
        comparison = get_comparison_data(audits)
        
        return Response({
            'audits': AuditListSerializer(comparison['audits'], many=True).data,
            'sections_comparison': comparison['sections_comparison'],
            'average_score': comparison['average_score'],
            'best_audit': comparison['best_audit'],
            'worst_audit': comparison['worst_audit'],
        })


# ============ Statistics Views ============

class AuditStatisticsView(APIView):
    """Get audit statistics"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        stats = get_audit_statistics(request.user)
        
        return Response({
            'total_audits': stats['total_audits'],
            'completed_audits': stats['completed_audits'],
            'in_progress_audits': stats['in_progress_audits'],
            'draft_audits': stats['draft_audits'],
            'average_score': stats['average_score'],
            'audits_by_status': stats['audits_by_status'],
            'audits_by_level': stats['audits_by_level'],
            'recent_audits': AuditListSerializer(stats['recent_audits'], many=True).data,
            'score_trend': stats['score_trend'],
        })


class DashboardView(APIView):
    """Dashboard data combining stats and hierarchy info"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        organization = get_user_organization(user)
        
        if not organization:
            return Response({'error': 'No tienes una organización'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get audit stats
        audit_stats = get_audit_statistics(user)
        
        # Get hierarchy stats
        from apps.core.models import Company, Branch, Department, Team, SubTeam
        
        hierarchy_stats = {
            'companies_count': Company.objects.filter(organization=organization, is_active=True).count(),
            'branches_count': Branch.objects.filter(company__organization=organization, is_active=True).count(),
            'departments_count': Department.objects.filter(branch__company__organization=organization, is_active=True).count(),
            'teams_count': Team.objects.filter(department__branch__company__organization=organization, is_active=True).count(),
        }
        
        # Get company scores for owner
        companies_scores = []
        if user.user_type == 'owner':
            companies = Company.objects.filter(organization=organization, is_active=True)
            for company in companies:
                company_audits = Audit.objects.filter(
                    Q(company=company) |
                    Q(branch__company=company) |
                    Q(department__branch__company=company) |
                    Q(team__department__branch__company=company) |
                    Q(subteam__team__department__branch__company=company),
                    status='completed'
                )
                avg_score = company_audits.aggregate(avg=models.Avg('score'))['avg'] or 0
                companies_scores.append({
                    'id': company.id,
                    'name': company.name,
                    'audits_count': company_audits.count(),
                    'average_score': round(float(avg_score), 2),
                })
        
        return Response({
            'organization': {
                'id': organization.id,
                'name': organization.name,
            },
            'user': {
                'id': user.id,
                'full_name': user.full_name,
                'user_type': user.user_type,
            },
            'audit_stats': audit_stats,
            'hierarchy_stats': hierarchy_stats,
            'companies_scores': companies_scores,
        })
