# com : Endpoints simples pour l'API.
from rest_framework import viewsets, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser

from .models import Recipe, Comment, LiveSession
from .serializers import RecipeSerializer, CommentSerializer, LiveSessionSerializer, RegisterSerializer, PasswordResetSerializer
from .permissions import IsOwnerOrReadOnly

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all().order_by('-created_at')
    serializer_class = RecipeSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category__iexact=category)
        show_mine = self.request.query_params.get('mine')
        if show_mine and self.request.user.is_authenticated:
            # com : si je passe mine=true côté front, je ne retourne que mes propres recettes.
            qs = qs.filter(author=self.request.user)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
        return [permissions.AllowAny()]

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        recipe = self.get_object()
        recipe.likes += 1
        recipe.save(update_fields=['likes'])
        serializer = self.get_serializer(recipe)
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = super().get_queryset()
        recipe_id = self.request.query_params.get('recipe')
        if recipe_id:
            qs = qs.filter(recipe_id=recipe_id)
        return qs


class LiveSessionViewSet(viewsets.ModelViewSet):
    queryset = LiveSession.objects.all().order_by('scheduled_at')
    serializer_class = LiveSessionSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    @action(detail=False, methods=['get'])
    def next(self, request):
        upcoming = LiveSession.objects.filter(is_active=True, scheduled_at__gte=gulf_time()).order_by('scheduled_at').first()
        if not upcoming:
            return Response({'detail': 'Aucune session à venir'})
        serializer = self.get_serializer(upcoming)
        return Response(serializer.data)


class PasswordResetView(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        user.set_password(serializer.validated_data['new_password'])
        user.save(update_fields=['password'])
        return Response({'detail': 'Mot de passe mis à jour.'})


def gulf_time():
    # Petite fonction d'aide : retourne l'heure actuelle (timezone-aware)
    from django.utils import timezone
    return timezone.now()
