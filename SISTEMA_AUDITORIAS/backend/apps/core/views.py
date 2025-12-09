"""
Views for core app.
Hierarchy management and user invitations.
"""
from rest_framework import viewsets, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from django.db.models import Q, Count
from django.utils import timezone
from datetime import timedelta

from .models import Company, Branch, Department, Team, SubTeam, UserAssignment, Invitation
from .serializers import (
    CompanySerializer, CompanyListSerializer,
    BranchSerializer, BranchListSerializer,
    DepartmentSerializer, DepartmentListSerializer,
    TeamSerializer, TeamListSerializer,
    SubTeamSerializer, SubTeamListSerializer,
    UserAssignmentSerializer,
    InvitationSerializer, CreateInvitationSerializer, AcceptInvitationSerializer,
    HierarchyTreeSerializer,
)
from .permissions import IsOwnerOrManager, CanManageLevel

User = get_user_model()


def get_user_organization(user):
    """Get organization for a user"""
    if user.user_type == 'owner' and hasattr(user, 'organization'):
        return user.organization
    
    assignment = user.assignments.filter(is_active=True).first()
    if assignment:
        return assignment.organization
    
    return None


# ============ Hierarchy Views ============

class HierarchyTreeView(APIView):
    """Get full hierarchy tree"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        organization = get_user_organization(request.user)
        if not organization:
            return Response({'error': 'No tienes una organización'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = HierarchyTreeSerializer()
        return Response(serializer.to_representation(organization))


class CompanyViewSet(viewsets.ModelViewSet):
    """ViewSet for Company CRUD"""
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CompanyListSerializer
        return CompanySerializer
    
    def get_queryset(self):
        user = self.request.user
        organization = get_user_organization(user)
        
        if not organization:
            return Company.objects.none()
        
        queryset = Company.objects.filter(organization=organization)
        
        # Filter for non-owners based on assignment
        if user.user_type != 'owner':
            assignment = user.assignments.filter(is_active=True).first()
            if assignment and assignment.company:
                queryset = queryset.filter(id=assignment.company.id)
        
        return queryset.filter(is_active=True)
    
    def perform_create(self, serializer):
        organization = get_user_organization(self.request.user)
        serializer.save(organization=organization, created_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """Get company statistics"""
        company = self.get_object()
        
        stats = {
            'branches_count': company.branches.filter(is_active=True).count(),
            'departments_count': Department.objects.filter(branch__company=company, is_active=True).count(),
            'teams_count': Team.objects.filter(department__branch__company=company, is_active=True).count(),
            'audits_count': company.audits.count(),
            'completed_audits': company.audits.filter(status='completed').count(),
        }
        
        return Response(stats)


class BranchViewSet(viewsets.ModelViewSet):
    """ViewSet for Branch CRUD"""
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BranchListSerializer
        return BranchSerializer
    
    def get_queryset(self):
        user = self.request.user
        organization = get_user_organization(user)
        
        if not organization:
            return Branch.objects.none()
        
        queryset = Branch.objects.filter(company__organization=organization, is_active=True)
        
        # Filter by company if provided
        company_id = self.request.query_params.get('company')
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        
        # Filter for non-owners
        if user.user_type != 'owner':
            assignment = user.assignments.filter(is_active=True).first()
            if assignment:
                if assignment.company:
                    queryset = queryset.filter(company=assignment.company)
                elif assignment.branch:
                    queryset = queryset.filter(id=assignment.branch.id)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class DepartmentViewSet(viewsets.ModelViewSet):
    """ViewSet for Department CRUD"""
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return DepartmentListSerializer
        return DepartmentSerializer
    
    def get_queryset(self):
        user = self.request.user
        organization = get_user_organization(user)
        
        if not organization:
            return Department.objects.none()
        
        queryset = Department.objects.filter(branch__company__organization=organization, is_active=True)
        
        # Filters
        branch_id = self.request.query_params.get('branch')
        if branch_id:
            queryset = queryset.filter(branch_id=branch_id)
        
        company_id = self.request.query_params.get('company')
        if company_id:
            queryset = queryset.filter(branch__company_id=company_id)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class TeamViewSet(viewsets.ModelViewSet):
    """ViewSet for Team CRUD"""
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TeamListSerializer
        return TeamSerializer
    
    def get_queryset(self):
        user = self.request.user
        organization = get_user_organization(user)
        
        if not organization:
            return Team.objects.none()
        
        queryset = Team.objects.filter(department__branch__company__organization=organization, is_active=True)
        
        # Filters
        department_id = self.request.query_params.get('department')
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class SubTeamViewSet(viewsets.ModelViewSet):
    """ViewSet for SubTeam CRUD"""
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return SubTeamListSerializer
        return SubTeamSerializer
    
    def get_queryset(self):
        user = self.request.user
        organization = get_user_organization(user)
        
        if not organization:
            return SubTeam.objects.none()
        
        queryset = SubTeam.objects.filter(team__department__branch__company__organization=organization, is_active=True)
        
        # Filters
        team_id = self.request.query_params.get('team')
        if team_id:
            queryset = queryset.filter(team_id=team_id)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# ============ User and Invitation Views ============

class UserListView(generics.ListAPIView):
    """List users in organization"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserAssignmentSerializer
    
    def get_queryset(self):
        user = self.request.user
        organization = get_user_organization(user)
        
        if not organization:
            return UserAssignment.objects.none()
        
        return UserAssignment.objects.filter(organization=organization, is_active=True)


class InvitationViewSet(viewsets.ModelViewSet):
    """ViewSet for Invitations"""
    permission_classes = [IsAuthenticated]
    serializer_class = InvitationSerializer
    
    def get_queryset(self):
        user = self.request.user
        organization = get_user_organization(user)
        
        if not organization:
            return Invitation.objects.none()
        
        return Invitation.objects.filter(organization=organization)
    
    def create(self, request, *args, **kwargs):
        serializer = CreateInvitationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        organization = get_user_organization(request.user)
        
        if not organization:
            return Response({'error': 'No tienes una organización'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if already invited
        if Invitation.objects.filter(to_email=data['to_email'], organization=organization, status='pending').exists():
            return Response({'error': 'Este email ya tiene una invitación pendiente'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create invitation
        invitation_data = {
            'from_user': request.user,
            'to_email': data['to_email'],
            'organization': organization,
            'role': data['role'],
            'expires_at': timezone.now() + timedelta(days=7),
        }
        
        # Set the level
        level_type = data['level_type']
        level_id = data['level_id']
        invitation_data[level_type] = level_id
        
        invitation = Invitation.objects.create(**invitation_data)
        
        return Response(InvitationSerializer(invitation).data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def resend(self, request, pk=None):
        """Resend invitation"""
        invitation = self.get_object()
        invitation.expires_at = timezone.now() + timedelta(days=7)
        invitation.save()
        return Response({'message': 'Invitación reenviada'})
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel invitation"""
        invitation = self.get_object()
        invitation.status = 'expired'
        invitation.save()
        return Response({'message': 'Invitación cancelada'})


class InvitationDetailView(APIView):
    """Get invitation by token (public)"""
    permission_classes = [AllowAny]
    
    def get(self, request, token):
        try:
            invitation = Invitation.objects.get(token=token, status='pending')
            
            # Check if expired
            if invitation.expires_at and invitation.expires_at < timezone.now():
                invitation.status = 'expired'
                invitation.save()
                return Response({'error': 'Invitación expirada'}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response({
                'id': invitation.id,
                'organization_name': invitation.organization.name,
                'from_user': invitation.from_user.full_name,
                'role': invitation.role,
                'level_name': invitation.get_level_name(),
                'to_email': invitation.to_email,
            })
        except Invitation.DoesNotExist:
            return Response({'error': 'Invitación no encontrada'}, status=status.HTTP_404_NOT_FOUND)


class AcceptInvitationView(APIView):
    """Accept invitation and create user/assignment"""
    permission_classes = [AllowAny]
    
    def post(self, request, token):
        try:
            invitation = Invitation.objects.get(token=token, status='pending')
        except Invitation.DoesNotExist:
            return Response({'error': 'Invitación no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if expired
        if invitation.expires_at and invitation.expires_at < timezone.now():
            invitation.status = 'expired'
            invitation.save()
            return Response({'error': 'Invitación expirada'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = AcceptInvitationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Check if user already exists
        existing_user = User.objects.filter(email=invitation.to_email).first()
        
        if existing_user:
            user = existing_user
        else:
            # Create new user
            user = User.objects.create(
                email=invitation.to_email,
                full_name=serializer.validated_data['full_name'],
                user_type='employee',
            )
            user.set_password(serializer.validated_data['password'])
            user.save()
        
        # Create assignment
        assignment_data = {
            'user': user,
            'organization': invitation.organization,
            'role': invitation.role,
        }
        
        # Set the level
        if invitation.company:
            assignment_data['company'] = invitation.company
        elif invitation.branch:
            assignment_data['branch'] = invitation.branch
        elif invitation.department:
            assignment_data['department'] = invitation.department
        elif invitation.team:
            assignment_data['team'] = invitation.team
        elif invitation.subteam:
            assignment_data['subteam'] = invitation.subteam
        
        UserAssignment.objects.create(**assignment_data)
        
        # Update invitation
        invitation.status = 'accepted'
        invitation.responded_at = timezone.now()
        invitation.save()
        
        return Response({
            'message': 'Invitación aceptada exitosamente',
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name,
            }
        })


class RejectInvitationView(APIView):
    """Reject invitation"""
    permission_classes = [AllowAny]
    
    def post(self, request, token):
        try:
            invitation = Invitation.objects.get(token=token, status='pending')
        except Invitation.DoesNotExist:
            return Response({'error': 'Invitación no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
        invitation.status = 'rejected'
        invitation.responded_at = timezone.now()
        invitation.save()
        
        return Response({'message': 'Invitación rechazada'})


# ============ Statistics View ============

class OrganizationStatsView(APIView):
    """Get organization statistics"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        organization = get_user_organization(user)
        
        if not organization:
            return Response({'error': 'No tienes una organización'}, status=status.HTTP_404_NOT_FOUND)
        
        stats = {
            'companies_count': Company.objects.filter(organization=organization, is_active=True).count(),
            'branches_count': Branch.objects.filter(company__organization=organization, is_active=True).count(),
            'departments_count': Department.objects.filter(branch__company__organization=organization, is_active=True).count(),
            'teams_count': Team.objects.filter(department__branch__company__organization=organization, is_active=True).count(),
            'subteams_count': SubTeam.objects.filter(team__department__branch__company__organization=organization, is_active=True).count(),
            'users_count': UserAssignment.objects.filter(organization=organization, is_active=True).count() + 1,  # +1 for owner
            'pending_invitations': Invitation.objects.filter(organization=organization, status='pending').count(),
        }
        
        return Response(stats)
