# com : Je definis ici mes perms custom pr controler qui edite quoi.
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Je me rappelle : lecture pour tous, écriture seulement pour moi

    - Les méthodes 'safe' (GET, HEAD, OPTIONS) sont publiques.
    - Pour PUT/PATCH/DELETE je dois être l'auteur ou un administrateur.
    """

    def has_object_permission(self, request, view, obj):
        # lecture pour tous
        if request.method in permissions.SAFE_METHODS:
            return True
        # écriture seulement pour le propriétaire ou deuxieme superuser
        return getattr(obj, 'author', None) == request.user or request.user.is_staff
