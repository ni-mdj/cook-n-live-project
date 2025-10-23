# com : Je configure l'admin pr voir rec/com/live vite fait.
from django.contrib import admin
from .models import Recipe, Comment, LiveSession

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('recipe', 'author', 'created_at')

@admin.register(LiveSession)
class LiveSessionAdmin(admin.ModelAdmin):
    list_display = ('title', 'scheduled_at', 'twitch_channel', 'is_active')
