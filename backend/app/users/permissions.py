from rest_framework import permissions

class IsOwnerOfObject(permissions.BasePermission):
    """Allows to edit object only for his owner"""

    def has_object_permission(self, request, view, obj):
        return obj == request.user