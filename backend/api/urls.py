# com : cable ttes mes routes API (rec, com, live, auth).
from rest_framework import routers
from django.urls import path, include
from .views import RecipeViewSet, CommentViewSet, LiveSessionViewSet, RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = routers.DefaultRouter()
router.register(r'recipes', RecipeViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'livesessions', LiveSessionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
