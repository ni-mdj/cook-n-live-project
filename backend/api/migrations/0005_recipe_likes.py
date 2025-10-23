# com : J'ajoute un compteur likes basic pr chaque rec.
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_more_recipes_by_chef_noor'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='likes',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
