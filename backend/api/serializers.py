# com : Je transforme mes objets Django <-> JSON pr l'API.
"""Sérialiseurs simples pour mon projet Cook'n'Live.

Ici je transforme les instances Django en JSON (et l'inverse quand c'est utile).
Je garde les sérialiseurs courts pour que ce soit facile à relire et à expliquer.
"""

from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Recipe, Comment, LiveSession

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Ici je retourne une petite représentation d'un utilisateur (id, nom, email)."""

    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class RegisterSerializer(serializers.ModelSerializer):
    """Ici j'utilise ce sérialiseur pour créer un utilisateur. Le mot de passe est write-only."""

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        # Ici j'appelle create_user : il s'occupe de hacher le mot de passe
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )


class RecipeSerializer(serializers.ModelSerializer):
    """Ici je sérialise une recette. L'auteur est en lecture seule et je le renseigne lors de la création."""

    author = UserSerializer(read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Recipe
        fields = ('id', 'title', 'description', 'ingredients', 'steps', 'category', 'image', 'likes', 'author', 'created_at', 'updated_at')
        read_only_fields = ('author', 'created_at', 'updated_at', 'likes')


class CommentSerializer(serializers.ModelSerializer):
    """Ici je sérialise un commentaire. L'auteur est en lecture seule et je l'ajoute quand on poste."""

    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'recipe', 'author', 'body', 'created_at')
        read_only_fields = ('author', 'created_at')


class LiveSessionSerializer(serializers.ModelSerializer):
    """Ici je sérialise une session live (titre, date, chaîne Twitch...)."""

    created_by = UserSerializer(read_only=True)

    class Meta:
        model = LiveSession
        fields = ('id', 'title', 'description', 'scheduled_at', 'twitch_channel', 'twitch_url', 'created_by', 'is_active')
        read_only_fields = ('created_by',)


class PasswordResetSerializer(serializers.Serializer):
    """Réinitialise le mot de passe via un identifiant (email ou pseudo)."""

    identifier = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=6)

    def validate(self, attrs):
        identifier = attrs.get('identifier', '').strip()
        if not identifier:
            raise serializers.ValidationError({'identifier': "L'identifiant est requis."})

        user = None
        try:
            user = User.objects.get(email__iexact=identifier)
        except User.DoesNotExist:
            try:
                user = User.objects.get(username__iexact=identifier)
            except User.DoesNotExist:
                user = None

        if not user:
            raise serializers.ValidationError({'identifier': "Aucun utilisateur trouvé avec cet identifiant."})

        attrs['user'] = user
        return attrs
