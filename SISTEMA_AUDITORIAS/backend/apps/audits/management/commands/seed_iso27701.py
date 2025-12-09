from django.core.management.base import BaseCommand
from apps.audits.models import AuditTemplate, QuestionSection, Question


class Command(BaseCommand):
    help = 'Seed ISO 27701 audit template'

    def handle(self, *args, **options):
        self.stdout.write('Verificando plantilla ISO 27701:2019...')
        
        if AuditTemplate.objects.filter(code='ISO-27701').exists():
            template = AuditTemplate.objects.get(code='ISO-27701')
            self.stdout.write(self.style.SUCCESS(
                'La plantilla ISO 27701 ya existe con {} preguntas.'.format(template.total_questions)
            ))
            return
        
        self.stdout.write('Creando plantilla ISO 27701...')
        template = AuditTemplate.objects.create(
            name='ISO 27701:2019 - Gestion de Privacidad',
            code='ISO-27701',
            description='Sistema de gestion de informacion de privacidad basado en ISO 27701:2019',
            standard='ISO 27701',
            version='2019',
            is_active=True,
            is_public=True,
        )

        sections_data = [
            {
                'name': 'Contexto de la Organizacion',
                'code': 'SEC-4',
                'order': 1,
                'questions': [
                    ('Q-4.1', 'Se ha identificado el contexto de la organizacion respecto al tratamiento de datos personales?', 'yes_no'),
                    ('Q-4.2', 'Se han identificado las partes interesadas relevantes para el SGPI?', 'yes_no'),
                    ('Q-4.3', 'Se ha definido el alcance del sistema de gestion de privacidad?', 'yes_no'),
                    ('Q-4.4', 'Existe un sistema de gestion de privacidad de la informacion implementado?', 'yes_no'),
                ]
            },
            {
                'name': 'Liderazgo y Compromiso',
                'code': 'SEC-5',
                'order': 2,
                'questions': [
                    ('Q-5.1', 'La alta direccion demuestra liderazgo y compromiso con el SGPI?', 'yes_no'),
                    ('Q-5.2', 'Existe una politica de privacidad documentada y comunicada?', 'yes_no'),
                    ('Q-5.3', 'Se han asignado roles y responsabilidades para la proteccion de datos?', 'yes_no'),
                    ('Q-5.4', 'Se ha designado un Delegado de Proteccion de Datos (DPO)?', 'yes_no'),
                    ('Q-5.5', 'El DPO tiene acceso directo a la alta direccion?', 'yes_no'),
                ]
            },
            {
                'name': 'Planificacion',
                'code': 'SEC-6',
                'order': 3,
                'questions': [
                    ('Q-6.1', 'Se han identificado riesgos y oportunidades relacionados con la privacidad?', 'yes_no'),
                    ('Q-6.2', 'Existen objetivos de privacidad medibles y documentados?', 'yes_no'),
                    ('Q-6.3', 'Se realiza evaluacion de impacto en la privacidad (PIA)?', 'yes_no'),
                    ('Q-6.4', 'Existe un plan de tratamiento de riesgos de privacidad?', 'yes_no'),
                    ('Q-6.5', 'Se documentan los cambios planificados al SGPI?', 'yes_no'),
                ]
            },
            {
                'name': 'Soporte y Recursos',
                'code': 'SEC-7',
                'order': 4,
                'questions': [
                    ('Q-7.1', 'Se proporcionan recursos adecuados para el SGPI?', 'yes_no'),
                    ('Q-7.2', 'El personal tiene competencias adecuadas en proteccion de datos?', 'yes_no'),
                    ('Q-7.3', 'Existe un programa de concienciacion sobre privacidad?', 'yes_no'),
                    ('Q-7.4', 'La documentacion del SGPI esta controlada y actualizada?', 'yes_no'),
                    ('Q-7.5', 'Nivel de capacitacion del personal en proteccion de datos:', 'scale'),
                ]
            },
            {
                'name': 'Operacion',
                'code': 'SEC-8',
                'order': 5,
                'questions': [
                    ('Q-8.1', 'Existen procedimientos operativos para el tratamiento de datos?', 'yes_no'),
                    ('Q-8.2', 'Se mantiene un registro de actividades de tratamiento (RAT)?', 'yes_no'),
                    ('Q-8.3', 'Se aplica el principio de minimizacion de datos?', 'yes_no'),
                    ('Q-8.4', 'Se obtiene consentimiento valido cuando es requerido?', 'yes_no'),
                    ('Q-8.5', 'Existen controles para datos sensibles o de categorias especiales?', 'yes_no'),
                    ('Q-8.6', 'Se documenta la base legal para cada tratamiento?', 'yes_no'),
                ]
            },
            {
                'name': 'Derechos del Titular',
                'code': 'SEC-9',
                'order': 6,
                'questions': [
                    ('Q-9.1', 'Existe procedimiento para atender el derecho de acceso?', 'yes_no'),
                    ('Q-9.2', 'Existe procedimiento para atender el derecho de rectificacion?', 'yes_no'),
                    ('Q-9.3', 'Existe procedimiento para atender el derecho de supresion?', 'yes_no'),
                    ('Q-9.4', 'Existe procedimiento para atender el derecho de oposicion?', 'yes_no'),
                    ('Q-9.5', 'Existe procedimiento para la portabilidad de datos?', 'yes_no'),
                    ('Q-9.6', 'Se responde a las solicitudes en los plazos legales (15 dias)?', 'yes_no'),
                    ('Q-9.7', 'Se mantiene registro de las solicitudes de derechos atendidas?', 'yes_no'),
                ]
            },
            {
                'name': 'Seguridad de Datos Personales',
                'code': 'SEC-10',
                'order': 7,
                'questions': [
                    ('Q-10.1', 'Existen controles de acceso a los datos personales?', 'yes_no'),
                    ('Q-10.2', 'Se utiliza cifrado para proteger datos personales?', 'yes_no'),
                    ('Q-10.3', 'Existen procedimientos de respaldo y recuperacion?', 'yes_no'),
                    ('Q-10.4', 'Se realizan pruebas periodicas de seguridad?', 'yes_no'),
                    ('Q-10.5', 'Existe un procedimiento de gestion de incidentes de seguridad?', 'yes_no'),
                    ('Q-10.6', 'Se notifican las brechas de seguridad a la autoridad en 72 horas?', 'yes_no'),
                    ('Q-10.7', 'Se notifican las brechas de seguridad a los titulares afectados?', 'yes_no'),
                    ('Q-10.8', 'Nivel de madurez de los controles de seguridad:', 'scale'),
                ]
            },
            {
                'name': 'Transferencias de Datos',
                'code': 'SEC-11',
                'order': 8,
                'questions': [
                    ('Q-11.1', 'Se identifican todas las transferencias de datos a terceros?', 'yes_no'),
                    ('Q-11.2', 'Existen contratos con encargados del tratamiento?', 'yes_no'),
                    ('Q-11.3', 'Se verifican las garantias de los encargados del tratamiento?', 'yes_no'),
                    ('Q-11.4', 'Se controlan las transferencias internacionales de datos?', 'yes_no'),
                    ('Q-11.5', 'Existen clausulas contractuales tipo para transferencias internacionales?', 'yes_no'),
                ]
            },
            {
                'name': 'Evaluacion del Desempeno',
                'code': 'SEC-12',
                'order': 9,
                'questions': [
                    ('Q-12.1', 'Se realizan auditorias internas del SGPI?', 'yes_no'),
                    ('Q-12.2', 'La alta direccion revisa el SGPI periodicamente?', 'yes_no'),
                    ('Q-12.3', 'Se miden indicadores de desempeno del SGPI?', 'yes_no'),
                    ('Q-12.4', 'Se evalua el cumplimiento con requisitos legales?', 'yes_no'),
                    ('Q-12.5', 'Frecuencia de auditorias de privacidad:', 'multiple_choice'),
                ]
            },
            {
                'name': 'Mejora Continua',
                'code': 'SEC-13',
                'order': 10,
                'questions': [
                    ('Q-13.1', 'Se identifican no conformidades y se toman acciones correctivas?', 'yes_no'),
                    ('Q-13.2', 'Se implementan mejoras continuas al SGPI?', 'yes_no'),
                    ('Q-13.3', 'Se documentan las lecciones aprendidas?', 'yes_no'),
                    ('Q-13.4', 'Existe un proceso de gestion de cambios para el SGPI?', 'yes_no'),
                    ('Q-13.5', 'Se revisan y actualizan las politicas periodicamente?', 'yes_no'),
                ]
            },
        ]

        total_questions = 0
        for section_data in sections_data:
            section = QuestionSection.objects.create(
                template=template,
                name=section_data['name'],
                code=section_data['code'],
                order=section_data['order'],
            )
            
            for i, (code, text, q_type) in enumerate(section_data['questions'], 1):
                choices = None
                if q_type == 'multiple_choice':
                    choices = ['Anualmente', 'Semestralmente', 'Trimestralmente', 'Mensualmente']
                
                Question.objects.create(
                    section=section,
                    code=code,
                    text=text,
                    question_type=q_type,
                    choices=choices,
                    order=i,
                    is_required=True,
                    weight=1.0,
                    max_score=10,
                )
                total_questions += 1

        self.stdout.write(self.style.SUCCESS(
            'Plantilla ISO 27701 creada con {} preguntas en {} secciones.'.format(total_questions, len(sections_data))
        ))
