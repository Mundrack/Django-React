"""
Admin configuration for core app.
"""
from django.contrib import admin
from .models import Company, Branch, Department, Team, SubTeam, UserAssignment, Invitation


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'organization', 'is_active', 'created_at']
    list_filter = ['is_active', 'organization']
    search_fields = ['name', 'code']


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'company', 'is_active', 'created_at']
    list_filter = ['is_active', 'company']
    search_fields = ['name', 'code']


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'branch', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'code']


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'department', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'code']


@admin.register(SubTeam)
class SubTeamAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'team', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'code']


@admin.register(UserAssignment)
class UserAssignmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'organization', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active']
    search_fields = ['user__email']


@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    list_display = ['to_email', 'organization', 'role', 'status', 'created_at']
    list_filter = ['status', 'role']
    search_fields = ['to_email']
