from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AuthTests(APITestCase):
    def test_register_and_login(self):
        register_url = '/api/auth/register/'
        login_url = '/api/auth/login/'

        data = {'username': 'testuser', 'email': 'test@example.com', 'password': 'Password123!'}
        res = self.client.post(register_url, data, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        res = self.client.post(login_url, {'username': 'testuser', 'password': 'Password123!'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('access', res.data)


class RecipeTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='alice', password='Password123!')
        login = self.client.post('/api/auth/login/', {'username': 'alice', 'password': 'Password123!'}, format='json')
        self.access = login.data['access']

    def test_create_recipe_requires_auth(self):
        url = '/api/recipes/'
        data = {'title': 'Tajine', 'description': 'Bon', 'ingredients': 'Poulet', 'steps': 'Cuire'}

        res = self.client.post(url, data, format='json')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access}')
        res = self.client.post(url, data, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)


class CommentTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='bob', password='Password123!')
        login = self.client.post('/api/auth/login/', {'username': 'bob', 'password': 'Password123!'}, format='json')
        self.access = login.data['access']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access}')
        recipe_res = self.client.post('/api/recipes/', {
            'title': 'Pastilla',
            'description': 'Délicieuse',
            'ingredients': 'Poulet, amandes',
            'steps': 'Cuire'
        }, format='json')
        self.recipe_id = recipe_res.data['id']
        self.client.credentials()

    def test_comment_requires_auth(self):
        res = self.client.post('/api/comments/', {'recipe': self.recipe_id, 'body': 'Super !'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access}')
        res = self.client.post('/api/comments/', {'recipe': self.recipe_id, 'body': 'Super !'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
