"""
Custom permissions for core app.
"""
from rest_framework import permissions


class IsOwnerOrManager(permissions.BasePermission):
    """
    Permission that allows only owners or managers.
    """
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Owners have full access
        if request.user.user_type == 'owner':
            return True
        
        # Check if user is a manager
        assignment = request.user.assignments.filter(is_active=True, role='manager').first()
        return assignment is not None


class CanManageLevel(permissions.BasePermission):
    """
    Permission that checks if user can manage a specific level.
    """
    
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        # Owners can manage everything
        if user.user_type == 'owner':
            return True
        
        # Get user's assignment
        assignment = user.assignments.filter(is_active=True).first()
        if not assignment:
            return False
        
        # Check based on the level being accessed
        # This is a simplified check - in production you'd want more complex logic
        
        return True


class IsOwner(permissions.BasePermission):
    """
    Permission that allows only the owner of the organization.
    """
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'owner'
