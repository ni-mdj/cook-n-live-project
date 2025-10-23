# com : Je seed qq data (user Noor, rec demo, live test) pr demarrer.
from datetime import timedelta

from django.contrib.auth.hashers import make_password
from django.db import migrations
from django.utils import timezone


def seed_data(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    Recipe = apps.get_model('api', 'Recipe')
    LiveSession = apps.get_model('api', 'LiveSession')

    chef, created = User.objects.get_or_create(
        username='chef_noor',
        defaults={'email': 'noor@cooknlive.test'}
    )
    if created or not getattr(chef, 'password', ''):
        chef.password = make_password('cookandlive')
        chef.save()

    recipes = [
        {
            'title': 'Tajine poulet olive',
            'description': 'Un tajine familial au poulet, olives et citron confit.',
            'category': 'Plat principal',
            'ingredients': (
                '4 cuisses de poulet\n'
                '2 oignons\n'
                '2 gousses d\'ail\n'
                '150 g d\'olives vertes\n'
                '1 citron confit\n'
                '1 c.à.s de curcuma, gingembre et paprika\n'
                'Huile d\'olive, sel, poivre'
            ),
            'steps': (
                '1. Faire revenir le poulet avec l\'huile et les épices.\n'
                '2. Ajouter les oignons émincés et l\'ail puis couvrir d\'eau.\n'
                '3. Laisser mijoter 30 minutes et ajouter les olives rincées.\n'
                '4. Terminer avec des quartiers de citron confit et servir chaud.'
            )
        },
        {
            'title': 'Couscous marocain',
            'description': 'Le grand classique du jeudi soir accompagné de légumes fondants.',
            'category': 'Plat principal',
            'ingredients': (
                '500 g de semoule moyenne\n'
                '3 carottes, 2 courgettes, 2 navets\n'
                'Pois chiches cuits\n'
                'Viande (agneau ou poulet) selon le goût\n'
                'Épices à couscous, concentré de tomate'
            ),
            'steps': (
                '1. Préparer le bouillon avec la viande, les légumes et les épices.\n'
                '2. Cuire la semoule à la vapeur en l\'égrenant entre chaque passage.\n'
                '3. Ajouter les pois chiches et laisser mijoter encore 10 minutes.\n'
                '4. Servir la semoule avec le bouillon et les légumes disposés sur le dessus.'
            )
        },
        {
            'title': 'Msemen',
            'description': 'Des crêpes feuilletées parfaites pour le goûter ou le petit déjeuner.',
            'category': 'Goûter',
            'ingredients': (
                '500 g de farine\n'
                '100 g de semoule fine\n'
                'Sel\n'
                'Eau tiède\n'
                'Beurre fondu et huile pour le pliage'
            ),
            'steps': (
                '1. Former une pâte souple avec la farine, la semoule, le sel et l\'eau.\n'
                '2. Diviser en boules et les huiler.\n'
                '3. Étaler finement, plier en carrés puis cuire sur une poêle chaude.\n'
                '4. Servir chaud avec du miel.'
            )
        },
        {
            'title': 'Baghrir (crêpes mille trous)',
            'description': 'Crêpes légères à base de semoule, très simples à réaliser.',
            'category': 'Petit-déjeuner',
            'ingredients': (
                '250 g de semoule fine\n'
                '50 g de farine\n'
                '1 sachet de levure boulangère\n'
                '1 c.à.c de levure chimique\n'
                'Sel et eau tiède'
            ),
            'steps': (
                '1. Mixer tous les ingrédients avec l\'eau pour obtenir une pâte lisse.\n'
                '2. Laisser reposer 30 minutes.\n'
                '3. Cuire les baghrirs sur une poêle chaude sans retourner.\n'
                '4. Napper de beurre fondu et de miel.'
            )
        },
        {
            'title': 'Matlou (pain marocain)',
            'description': 'Un pain moelleux cuit à la poêle, idéal pour accompagner les tajines.',
            'category': 'Pain',
            'ingredients': (
                '500 g de semoule fine ou moyenne\n'
                '1 c.à.s de levure boulangère\n'
                'Sel\n'
                'Eau tiède'
            ),
            'steps': (
                '1. Mélanger la semoule, la levure et le sel avec de l\'eau pour obtenir une pâte souple.\n'
                '2. Pétrir 10 minutes puis laisser lever.\n'
                '3. Former des galettes et laisser lever à nouveau.\n'
                '4. Cuire à la poêle sur feu moyen en retournant régulièrement.'
            )
        },
    ]

    for recipe in recipes:
        Recipe.objects.get_or_create(
            title=recipe['title'],
              defaults={
                'description': recipe['description'],
                'ingredients': recipe['ingredients'],
                'steps': recipe['steps'],
                'category': recipe.get('category', ''),
                'author': chef,
            }
        )

    now = timezone.now()
    days_until_thursday = (3 - now.weekday()) % 7
    if days_until_thursday == 0 and now.hour >= 18:
        days_until_thursday = 7
    next_live = (now + timedelta(days=days_until_thursday)).replace(
        hour=18, minute=0, second=0, microsecond=0
    )

    LiveSession.objects.get_or_create(
        title='Live du jeudi',
        scheduled_at=next_live,
        defaults={
            'description': 'On cuisine ensemble une spécialité marocaine en direct.',
            'twitch_channel': 'cooknlive',
            'twitch_url': 'https://www.twitch.tv/cooknlive',
            'created_by': chef,
        }
    )


def unseed_data(apps, schema_editor):
    Recipe = apps.get_model('api', 'Recipe')
    LiveSession = apps.get_model('api', 'LiveSession')
    User = apps.get_model('auth', 'User')

    titles = [
        'Tajine poulet olive',
        'Couscous marocain',
        'Msemen',
        'Baghrir (crêpes mille trous)',
        'Matlou (pain marocain)',
    ]
    Recipe.objects.filter(title__in=titles).delete()
    LiveSession.objects.filter(title='Live du jeudi').delete()
    User.objects.filter(username='chef_noemie').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_data, unseed_data),
    ]

