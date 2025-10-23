# com : J'ajoute champ categorie aux rec pr tri futur.
from django.db import migrations, models


def fill_categories(apps, schema_editor):
    Recipe = apps.get_model('api', 'Recipe')
    categories = {
        'Tajine poulet olive': 'Plat principal',
        'Couscous marocain': 'Plat principal',
        'Msemen': 'Goûter',
        'Baghrir (crêpes mille trous)': 'Petit-déjeuner',
        'Matlou (pain marocain)': 'Pain',
    }
    for title, category in categories.items():
        Recipe.objects.filter(title=title).update(category=category)


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_seed_initial_data'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='category',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.RunPython(fill_categories, noop),
    ]
