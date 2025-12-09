"""
Management command to seed demo data for testing.
Usage: python manage.py seed_demo_data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.authentication.models import Organization
from apps.core.models import Company, Branch, Department, Team, SubTeam, UserAssignment
from apps.audits.models import AuditTemplate, Audit, AuditAnswer, Question
from django.utils import timezone
from datetime import timedelta
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed demo data for testing'
    
    def handle(self, *args, **options):
        self.stdout.write('🌱 Creando datos de demostración...\n')
        
        # Create demo owner
        owner, created = User.objects.get_or_create(
            email='admin@demo.com',
            defaults={'full_name': 'Administrador Demo', 'user_type': 'owner'}
        )
        if created:
            owner.set_password('admin123')
            owner.save()
        self.stdout.write(self.style.SUCCESS('✅ Owner: admin@demo.com / admin123'))
        
        # Create organization
        org, _ = Organization.objects.get_or_create(
            owner=owner,
            defaults={'name': 'Grupo Empresarial Demo', 'description': 'Organización demo'}
        )
        
        # Create companies
        companies = []
        for name, code in [('TechCorp', 'TECH-001'), ('HealthPlus', 'HEALTH-001')]:
            c, _ = Company.objects.get_or_create(code=code, defaults={
                'organization': org, 'name': name, 'created_by': owner
            })
            companies.append(c)
        
        # Create branches
        branches = []
        for company in companies:
            for city in ['Quito', 'Guayaquil']:
                code = f"{company.code[:4]}-{city[:3].upper()}"
                b, _ = Branch.objects.get_or_create(code=code, defaults={
                    'company': company, 'name': f'Sucursal {city}', 'created_by': owner
                })
                branches.append(b)
        
        # Create departments
        for branch in branches[:2]:
            for dept in ['Sistemas', 'RRHH']:
                code = f"{branch.code}-{dept[:3].upper()}"
                Department.objects.get_or_create(code=code, defaults={
                    'branch': branch, 'name': f'Dept. {dept}', 'created_by': owner
                })
        
        # Create employees
        for email, name, role in [
            ('gerente@demo.com', 'María García', 'manager'),
            ('auditor@demo.com', 'Carlos López', 'employee'),
        ]:
            emp, created = User.objects.get_or_create(
                email=email, defaults={'full_name': name, 'user_type': 'employee'}
            )
            if created:
                emp.set_password('demo123')
                emp.save()
            
            if role == 'manager' and companies:
                UserAssignment.objects.get_or_create(
                    user=emp, organization=org, company=companies[0], defaults={'role': role}
                )
            elif branches:
                UserAssignment.objects.get_or_create(
                    user=emp, organization=org, branch=branches[0], defaults={'role': role}
                )
        
        self.stdout.write(self.style.SUCCESS('✅ Gerente: gerente@demo.com / demo123'))
        self.stdout.write(self.style.SUCCESS('✅ Auditor: auditor@demo.com / demo123'))
        
        # Create audits
        template = AuditTemplate.objects.filter(code='ISO-27701').first()
        if template:
            for i, company in enumerate(companies):
                audit, created = Audit.objects.get_or_create(
                    code=f'AUD-2025-{i+1:04d}',
                    defaults={
                        'name': f'Auditoría {company.name}',
                        'template': template, 'organization': org, 'company': company,
                        'status': 'completed', 'total_questions': template.total_questions,
                        'score': random.uniform(70, 95), 'created_by': owner,
                        'completed_at': timezone.now() - timedelta(days=i*5),
                    }
                )
                if created:
                    for q in Question.objects.filter(section__template=template):
                        if q.question_type == 'yes_no':
                            AuditAnswer.objects.create(
                                audit=audit, question=q, answer_boolean=random.choice([True, True, False]),
                                score=q.max_score * (1 if random.random() > 0.3 else 0), max_score=q.max_score
                            )
                        elif q.question_type == 'scale':
                            val = random.randint(3, 5)
                            AuditAnswer.objects.create(
                                audit=audit, question=q, answer_scale=val,
                                score=q.max_score * val/5, max_score=q.max_score
                            )
                    audit.answered_questions = audit.answers.count()
                    audit.save()
        
        self.stdout.write(self.style.SUCCESS('\n🎉 ¡Datos demo creados!'))
