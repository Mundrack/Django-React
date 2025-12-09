"""
Serializers for core app.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Company, Branch, Department, Team, SubTeam, UserAssignment, Invitation

User = get_user_model()


# ============ Hierarchy Serializers ============

class SubTeamSerializer(serializers.ModelSerializer):
    """Serializer for SubTeam"""
    
    class Meta:
        model = SubTeam
        fields = ['id', 'team', 'name', 'code', 'description', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class TeamSerializer(serializers.ModelSerializer):
    """Serializer for Team"""
    subteams = SubTeamSerializer(many=True, read_only=True)
    subteams_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ['id', 'department', 'name', 'code', 'description', 'is_active', 'created_at', 'subteams', 'subteams_count']
        read_only_fields = ['id', 'created_at']
    
    def get_subteams_count(self, obj):
        return obj.subteams.filter(is_active=True).count()


class DepartmentSerializer(serializers.ModelSerializer):
    """Serializer for Department"""
    teams = TeamSerializer(many=True, read_only=True)
    teams_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Department
        fields = ['id', 'branch', 'name', 'code', 'description', 'is_active', 'created_at', 'teams', 'teams_count']
        read_only_fields = ['id', 'created_at']
    
    def get_teams_count(self, obj):
        return obj.teams.filter(is_active=True).count()


class BranchSerializer(serializers.ModelSerializer):
    """Serializer for Branch"""
    departments = DepartmentSerializer(many=True, read_only=True)
    departments_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Branch
        fields = ['id', 'company', 'name', 'code', 'description', 'address', 'phone', 'email', 'is_active', 'created_at', 'departments', 'departments_count']
        read_only_fields = ['id', 'created_at']
    
    def get_departments_count(self, obj):
        return obj.departments.filter(is_active=True).count()


class CompanySerializer(serializers.ModelSerializer):
    """Serializer for Company"""
    branches = BranchSerializer(many=True, read_only=True)
    branches_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = ['id', 'organization', 'name', 'code', 'description', 'address', 'phone', 'email', 'is_active', 'created_at', 'branches', 'branches_count']
        read_only_fields = ['id', 'organization', 'created_at']
    
    def get_branches_count(self, obj):
        return obj.branches.filter(is_active=True).count()


class CompanyListSerializer(serializers.ModelSerializer):
    """Simplified serializer for Company list"""
    branches_count = serializers.SerializerMethodField()
    audits_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = ['id', 'name', 'code', 'description', 'address', 'phone', 'email', 'is_active', 'created_at', 'branches_count', 'audits_count']
    
    def get_branches_count(self, obj):
        return obj.branches.filter(is_active=True).count()
    
    def get_audits_count(self, obj):
        return obj.audits.count()


class BranchListSerializer(serializers.ModelSerializer):
    """Simplified serializer for Branch list"""
    company_name = serializers.CharField(source='company.name', read_only=True)
    departments_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Branch
        fields = ['id', 'company', 'company_name', 'name', 'code', 'description', 'address', 'is_active', 'created_at', 'departments_count']
    
    def get_departments_count(self, obj):
        return obj.departments.filter(is_active=True).count()


class DepartmentListSerializer(serializers.ModelSerializer):
    """Simplified serializer for Department list"""
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    company_name = serializers.CharField(source='branch.company.name', read_only=True)
    teams_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Department
        fields = ['id', 'branch', 'branch_name', 'company_name', 'name', 'code', 'description', 'is_active', 'created_at', 'teams_count']
    
    def get_teams_count(self, obj):
        return obj.teams.filter(is_active=True).count()


class TeamListSerializer(serializers.ModelSerializer):
    """Simplified serializer for Team list"""
    department_name = serializers.CharField(source='department.name', read_only=True)
    subteams_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ['id', 'department', 'department_name', 'name', 'code', 'description', 'is_active', 'created_at', 'subteams_count']
    
    def get_subteams_count(self, obj):
        return obj.subteams.filter(is_active=True).count()


class SubTeamListSerializer(serializers.ModelSerializer):
    """Simplified serializer for SubTeam list"""
    team_name = serializers.CharField(source='team.name', read_only=True)
    
    class Meta:
        model = SubTeam
        fields = ['id', 'team', 'team_name', 'name', 'code', 'description', 'is_active', 'created_at']


# ============ User Assignment Serializers ============

class UserAssignmentSerializer(serializers.ModelSerializer):
    """Serializer for UserAssignment"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    level_name = serializers.SerializerMethodField()
    
    class Meta:
        model = UserAssignment
        fields = ['id', 'user', 'user_email', 'user_name', 'organization', 'company', 'branch', 'department', 'team', 'subteam', 'role', 'is_active', 'created_at', 'level_name']
        read_only_fields = ['id', 'created_at']
    
    def get_level_name(self, obj):
        return obj.get_level_name()


# ============ Invitation Serializers ============

class InvitationSerializer(serializers.ModelSerializer):
    """Serializer for Invitation"""
    from_user_name = serializers.CharField(source='from_user.full_name', read_only=True)
    level_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Invitation
        fields = ['id', 'from_user', 'from_user_name', 'to_email', 'organization', 'company', 'branch', 'department', 'team', 'subteam', 'role', 'token', 'status', 'created_at', 'responded_at', 'expires_at', 'level_name']
        read_only_fields = ['id', 'from_user', 'token', 'status', 'created_at', 'responded_at']
    
    def get_level_name(self, obj):
        return obj.get_level_name()


class CreateInvitationSerializer(serializers.Serializer):
    """Serializer for creating invitation"""
    to_email = serializers.EmailField()
    role = serializers.ChoiceField(choices=['manager', 'employee'])
    level_type = serializers.ChoiceField(choices=['company', 'branch', 'department', 'team', 'subteam'])
    level_id = serializers.IntegerField()
    
    def validate(self, data):
        level_type = data['level_type']
        level_id = data['level_id']
        
        # Validate that the level exists
        model_map = {
            'company': Company,
            'branch': Branch,
            'department': Department,
            'team': Team,
            'subteam': SubTeam,
        }
        
        model = model_map.get(level_type)
        if not model.objects.filter(id=level_id, is_active=True).exists():
            raise serializers.ValidationError(f'{level_type} con id {level_id} no existe')
        
        return data


class AcceptInvitationSerializer(serializers.Serializer):
    """Serializer for accepting invitation"""
    full_name = serializers.CharField(max_length=255)
    password = serializers.CharField(min_length=6, write_only=True)


# ============ Hierarchy Tree Serializer ============

class HierarchyTreeSerializer(serializers.Serializer):
    """Serializer for full hierarchy tree"""
    
    def to_representation(self, organization):
        companies = Company.objects.filter(organization=organization, is_active=True)
        
        tree = {
            'organization': {
                'id': organization.id,
                'name': organization.name,
                'description': organization.description,
            },
            'companies': []
        }
        
        for company in companies:
            company_data = {
                'id': company.id,
                'name': company.name,
                'code': company.code,
                'branches': []
            }
            
            for branch in company.branches.filter(is_active=True):
                branch_data = {
                    'id': branch.id,
                    'name': branch.name,
                    'code': branch.code,
                    'departments': []
                }
                
                for dept in branch.departments.filter(is_active=True):
                    dept_data = {
                        'id': dept.id,
                        'name': dept.name,
                        'code': dept.code,
                        'teams': []
                    }
                    
                    for team in dept.teams.filter(is_active=True):
                        team_data = {
                            'id': team.id,
                            'name': team.name,
                            'code': team.code,
                            'subteams': []
                        }
                        
                        for subteam in team.subteams.filter(is_active=True):
                            team_data['subteams'].append({
                                'id': subteam.id,
                                'name': subteam.name,
                                'code': subteam.code,
                            })
                        
                        dept_data['teams'].append(team_data)
                    
                    branch_data['departments'].append(dept_data)
                
                company_data['branches'].append(branch_data)
            
            tree['companies'].append(company_data)
        
        return tree
