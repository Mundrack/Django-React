"""
Business logic services for audits app.
"""
from django.db.models import Q, Avg, Sum, Count
from django.utils import timezone
from .models import Audit, AuditAnswer, Question, QuestionSection, Recommendation


def calculate_answer_score(answer):
    """Calculate score for a single answer"""
    question = answer.question
    max_score = question.max_score * question.weight
    
    if question.question_type == 'yes_no':
        if answer.answer_boolean is True:
            return max_score
        return 0
    
    elif question.question_type == 'scale':
        if answer.answer_scale:
            return (answer.answer_scale / 5) * max_score
        return 0
    
    elif question.question_type == 'multiple_choice':
        # For multiple choice, first option is typically the best
        if answer.answer_choice and question.choices:
            try:
                choices = question.choices if isinstance(question.choices, list) else []
                if choices and answer.answer_choice == choices[0]:
                    return max_score
                elif len(choices) > 1 and answer.answer_choice == choices[1]:
                    return max_score * 0.5
            except:
                pass
        return 0
    
    elif question.question_type == 'text':
        # Text questions get full score if answered
        if answer.answer_text:
            return max_score
        return 0
    
    return 0


def calculate_audit_score(audit):
    """Calculate overall audit score"""
    answers = audit.answers.all()
    
    if not answers:
        return 0
    
    total_possible = 0
    total_earned = 0
    
    for answer in answers:
        question = answer.question
        max_score = question.max_score * question.weight
        total_possible += max_score
        total_earned += calculate_answer_score(answer)
    
    if total_possible == 0:
        return 0
    
    return round((total_earned / total_possible) * 100, 2)


def calculate_section_score(audit, section):
    """Calculate score for a specific section"""
    answers = audit.answers.filter(question__section=section)
    
    total_possible = 0
    total_earned = 0
    
    for answer in answers:
        question = answer.question
        max_score = question.max_score * question.weight
        total_possible += max_score
        total_earned += calculate_answer_score(answer)
    
    if total_possible == 0:
        return 0
    
    return round((total_earned / total_possible) * 100, 2)


def get_section_scores(audit):
    """Get scores for all sections in an audit"""
    sections = audit.template.sections.all()
    section_scores = []
    
    for section in sections:
        questions = section.questions.all()
        answers = audit.answers.filter(question__section=section)
        
        total_possible = sum(q.max_score * q.weight for q in questions)
        total_earned = sum(calculate_answer_score(a) for a in answers)
        
        percentage = round((total_earned / total_possible) * 100, 2) if total_possible > 0 else 0
        
        section_scores.append({
            'section_id': section.id,
            'section_name': section.name,
            'section_code': section.code,
            'total_questions': questions.count(),
            'answered_questions': answers.count(),
            'score': total_earned,
            'max_score': total_possible,
            'percentage': percentage,
        })
    
    return section_scores


def generate_recommendations(audit):
    """Generate automatic recommendations based on audit results"""
    # Clear existing recommendations
    audit.recommendations.all().delete()
    
    recommendations = []
    section_scores = get_section_scores(audit)
    
    # 1. Recommendations for sections with low scores
    for section_data in section_scores:
        section = QuestionSection.objects.get(id=section_data['section_id'])
        percentage = section_data['percentage']
        
        if percentage < 50:
            recommendations.append(Recommendation(
                audit=audit,
                section=section,
                title=f'Sección crítica: {section.name}',
                description=f'La sección "{section.name}" tiene un score de {percentage:.0f}%, muy por debajo del mínimo aceptable (50%).',
                action_required=f'Revisar urgentemente todos los controles de {section.name}. Implementar medidas correctivas inmediatas.',
                priority='critical',
                category='organizational',
            ))
        elif percentage < 70:
            recommendations.append(Recommendation(
                audit=audit,
                section=section,
                title=f'Sección a mejorar: {section.name}',
                description=f'La sección "{section.name}" tiene un score de {percentage:.0f}%, por debajo del nivel óptimo (70%).',
                action_required=f'Identificar las brechas específicas en {section.name} y planificar mejoras.',
                priority='high',
                category='organizational',
            ))
        elif percentage < 85:
            recommendations.append(Recommendation(
                audit=audit,
                section=section,
                title=f'Oportunidad de mejora: {section.name}',
                description=f'La sección "{section.name}" tiene un score de {percentage:.0f}%. Hay oportunidades de mejora.',
                action_required=f'Revisar los controles de {section.name} para optimizar el cumplimiento.',
                priority='medium',
                category='organizational',
            ))
    
    # 2. Recommendations for individual questions with bad answers
    for answer in audit.answers.all():
        question = answer.question
        
        # Yes/No questions answered "No"
        if question.question_type == 'yes_no' and answer.answer_boolean is False:
            recommendations.append(Recommendation(
                audit=audit,
                section=question.section,
                question=question,
                title=f'Control no implementado: {question.code}',
                description=question.text,
                action_required='Implementar este control según los requisitos del estándar.',
                priority='high',
                category='technical',
            ))
        
        # Scale questions with low values (1-2)
        elif question.question_type == 'scale' and answer.answer_scale and answer.answer_scale <= 2:
            recommendations.append(Recommendation(
                audit=audit,
                section=question.section,
                question=question,
                title=f'Control deficiente: {question.code}',
                description=f'{question.text} - Puntuación: {answer.answer_scale}/5',
                action_required='Mejorar significativamente la implementación de este control.',
                priority='high' if answer.answer_scale == 1 else 'medium',
                category='technical',
            ))
    
    # Save all recommendations
    Recommendation.objects.bulk_create(recommendations)
    
    return recommendations


def get_audit_results(audit):
    """Get complete results for an audit"""
    section_scores = get_section_scores(audit)
    
    # Answers summary
    answers = audit.answers.all()
    yes_count = answers.filter(answer_boolean=True).count()
    no_count = answers.filter(answer_boolean=False).count()
    
    answers_summary = {
        'yes': yes_count,
        'no': no_count,
        'scale_avg': answers.filter(answer_scale__isnull=False).aggregate(avg=Avg('answer_scale'))['avg'] or 0,
        'total_answered': answers.count(),
        'total_questions': audit.total_questions,
    }
    
    return {
        'audit': audit,
        'overall_score': float(audit.score),
        'total_questions': audit.total_questions,
        'answered_questions': audit.answered_questions,
        'sections_scores': section_scores,
        'answers_summary': answers_summary,
        'recommendations': audit.recommendations.all(),
    }


def get_visible_audits(user):
    """Get audits visible to a user based on their role and assignment"""
    from apps.core.models import UserAssignment
    
    # Owners see everything in their organization
    if user.user_type == 'owner' and hasattr(user, 'organization'):
        return Audit.objects.filter(organization=user.organization)
    
    # Get user's assignment
    assignment = user.assignments.filter(is_active=True).first()
    
    if not assignment:
        # User without assignment can only see audits they created or are assigned to
        return Audit.objects.filter(Q(created_by=user) | Q(assigned_to=user))
    
    base_filter = Q(organization=assignment.organization)
    
    if assignment.company:
        # Manager of company sees company and everything below
        return Audit.objects.filter(
            base_filter & (
                Q(company=assignment.company) |
                Q(branch__company=assignment.company) |
                Q(department__branch__company=assignment.company) |
                Q(team__department__branch__company=assignment.company) |
                Q(subteam__team__department__branch__company=assignment.company)
            )
        )
    
    elif assignment.branch:
        # Manager of branch sees branch and everything below
        return Audit.objects.filter(
            base_filter & (
                Q(branch=assignment.branch) |
                Q(department__branch=assignment.branch) |
                Q(team__department__branch=assignment.branch) |
                Q(subteam__team__department__branch=assignment.branch)
            )
        )
    
    elif assignment.department:
        # Manager of department sees department and everything below
        return Audit.objects.filter(
            base_filter & (
                Q(department=assignment.department) |
                Q(team__department=assignment.department) |
                Q(subteam__team__department=assignment.department)
            )
        )
    
    elif assignment.team:
        # Manager of team sees team and subteams
        return Audit.objects.filter(
            base_filter & (
                Q(team=assignment.team) |
                Q(subteam__team=assignment.team)
            )
        )
    
    elif assignment.subteam:
        # Manager of subteam sees only subteam
        return Audit.objects.filter(
            base_filter & Q(subteam=assignment.subteam)
        )
    
    else:
        # Employee: only audits created by or assigned to them
        return Audit.objects.filter(
            base_filter & (Q(created_by=user) | Q(assigned_to=user))
        )


def get_comparison_data(audits):
    """Get comparison data for multiple audits"""
    if len(audits) < 2:
        return None
    
    # Get sections from template (assuming same template)
    template = audits[0].template
    sections = template.sections.all()
    
    # Build comparison data
    sections_comparison = []
    for section in sections:
        section_data = {
            'section_id': section.id,
            'section_name': section.name,
            'section_code': section.code,
            'audits': {}
        }
        
        for audit in audits:
            score = calculate_section_score(audit, section)
            section_data['audits'][audit.id] = {
                'audit_name': audit.name,
                'score': score,
            }
        
        sections_comparison.append(section_data)
    
    # Calculate statistics
    scores = [float(a.score) for a in audits]
    avg_score = sum(scores) / len(scores)
    
    best_audit = max(audits, key=lambda a: float(a.score))
    worst_audit = min(audits, key=lambda a: float(a.score))
    
    return {
        'audits': audits,
        'sections_comparison': sections_comparison,
        'average_score': round(avg_score, 2),
        'best_audit': {
            'id': best_audit.id,
            'name': best_audit.name,
            'score': float(best_audit.score),
        },
        'worst_audit': {
            'id': worst_audit.id,
            'name': worst_audit.name,
            'score': float(worst_audit.score),
        },
    }


def get_audit_statistics(user):
    """Get audit statistics for a user"""
    audits = get_visible_audits(user)
    
    total = audits.count()
    completed = audits.filter(status='completed').count()
    in_progress = audits.filter(status='in_progress').count()
    draft = audits.filter(status='draft').count()
    
    # Average score of completed audits
    avg_score = audits.filter(status='completed').aggregate(avg=Avg('score'))['avg'] or 0
    
    # Audits by status
    audits_by_status = {
        'completed': completed,
        'in_progress': in_progress,
        'draft': draft,
    }
    
    # Audits by level
    audits_by_level = {
        'company': audits.filter(company__isnull=False, branch__isnull=True).count(),
        'branch': audits.filter(branch__isnull=False, department__isnull=True).count(),
        'department': audits.filter(department__isnull=False, team__isnull=True).count(),
        'team': audits.filter(team__isnull=False, subteam__isnull=True).count(),
        'subteam': audits.filter(subteam__isnull=False).count(),
    }
    
    # Recent audits
    recent = audits.order_by('-created_at')[:5]
    
    # Score trend (last 10 completed audits)
    trend_audits = audits.filter(status='completed').order_by('-completed_at')[:10]
    score_trend = [
        {
            'date': a.completed_at.strftime('%Y-%m-%d') if a.completed_at else a.created_at.strftime('%Y-%m-%d'),
            'score': float(a.score),
            'name': a.name,
        }
        for a in reversed(trend_audits)
    ]
    
    return {
        'total_audits': total,
        'completed_audits': completed,
        'in_progress_audits': in_progress,
        'draft_audits': draft,
        'average_score': round(float(avg_score), 2),
        'audits_by_status': audits_by_status,
        'audits_by_level': audits_by_level,
        'recent_audits': recent,
        'score_trend': score_trend,
    }
