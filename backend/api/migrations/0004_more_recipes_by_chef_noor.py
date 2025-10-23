# com : J'ajoute d'autres rec signee Noor pr booster le portfolio.
from django.db import migrations


def add_recipes(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    Recipe = apps.get_model('api', 'Recipe')

    chef, created = User.objects.get_or_create(
        username='chef_noor',
        defaults={'email': 'noor@cooknlive.test'}
    )
    if created or not getattr(chef, 'password', ''):
        from django.contrib.auth.hashers import make_password
        chef.password = make_password('cookwithnoor')
        chef.save()

    # Je rattache les anciennes recettes au nouveau pseudo pour garder une histoire de base.
    old_titles = [
        'Tajine poulet olive',
        'Couscous marocain',
        'Msemen',
        'Baghrir (crêpes mille trous)',
        'Matlou (pain marocain)',
    ]
    Recipe.objects.filter(title__in=old_titles).update(author=chef)

    new_recipes = [
        {
            'title': 'Thé marocain à la menthe',
            'description': 'La boisson conviviale servie à chaque fin de repas.',
            'category': 'Boisson',
            'ingredients': (
                '1 litre d\'eau\n'
                '2 c. à soupe de thé vert\n'
                '1 belle botte de menthe fraîche\n'
                '4 c. à soupe de sucre'
            ),
            'steps': (
                '1. Rincer le thé vert à l\'eau chaude.\n'
                '2. Ajouter la menthe et le sucre, puis verser l\'eau bouillante.\n'
                '3. Laisser infuser 3 minutes et servir bien chaud.'
            )
        },
        {
            'title': 'Tajine kefta',
            'description': 'Boulettes de viande parfumées cuites dans une sauce tomate épicée.',
            'category': 'Plat principal',
            'ingredients': (
                '400 g de viande hachée\n'
                '1 oignon\n'
                '1 boîte de tomates concassées\n'
                '1 c. à café de cumin, paprika, coriandre\n'
                '2 œufs\n'
                'Sel, poivre'
            ),
            'steps': (
                '1. Mélanger la viande hachée avec la moitié des épices et former des boulettes.\n'
                '2. Faire revenir l\'oignon, ajouter les tomates et le reste des épices.\n'
                '3. Ajouter les boulettes et cuire 15 minutes.\n'
                '4. Casser les œufs sur le dessus en fin de cuisson.'
            )
        },
        {
            'title': 'Lasagnes faciles',
            'description': 'Version rapide avec béchamel simple et viande hachée.',
            'category': 'Plat principal',
            'ingredients': (
                'Feuilles de lasagne\n'
                '400 g de viande hachée\n'
                '1 oignon\n'
                '500 ml de sauce tomate\n'
                '40 g de beurre, 40 g de farine, 500 ml de lait\n'
                'Fromage râpé'
            ),
            'steps': (
                '1. Faire revenir la viande avec l\'oignon et la sauce tomate.\n'
                '2. Préparer une béchamel avec beurre, farine et lait.\n'
                '3. Monter les couches : sauce, pâtes, viande, béchamel.\n'
                '4. Terminer par du fromage râpé et enfourner 30 minutes à 180°C.'
            )
        },
        {
            'title': 'Pâtes au saumon',
            'description': 'Crème légère et saumon fumé pour un plat du soir prêt en 15 minutes.',
            'category': 'Plat principal',
            'ingredients': (
                '300 g de pâtes\n'
                '150 g de saumon fumé\n'
                '20 cl de crème liquide\n'
                '1 échalote\n'
                'Jus de citron, aneth'
            ),
            'steps': (
                '1. Cuire les pâtes selon les indications.\n'
                '2. Faire revenir l\'échalote, ajouter la crème et le saumon coupé.\n'
                '3. Mélanger avec les pâtes, ajouter un trait de citron et de l\'aneth.'
            )
        },
        {
            'title': 'Gâteau au chocolat moelleux',
            'description': 'Un grand classique simple à réaliser, parfait pour le goûter.',
            'category': 'Dessert',
            'ingredients': (
                '200 g de chocolat noir\n'
                '120 g de beurre\n'
                '120 g de sucre\n'
                '4 œufs\n'
                '80 g de farine'
            ),
            'steps': (
                '1. Faire fondre le chocolat avec le beurre.\n'
                '2. Ajouter le sucre, les œufs puis la farine.\n'
                '3. Verser dans un moule beurré et cuire 20 minutes à 180°C.'
            )
        },
        {
            'title': 'Tarte aux pommes rapide',
            'description': 'Pâte feuilletée, pommes et cannelle : un dessert express.',
            'category': 'Dessert',
            'ingredients': (
                '1 pâte feuilletée\n'
                '4 pommes\n'
                '2 c. à soupe de sucre\n'
                'Cannelle'
            ),
            'steps': (
                '1. Étaler la pâte dans un moule.\n'
                '2. Disposer les pommes en fines lamelles, saupoudrer de sucre et cannelle.\n'
                '3. Cuire 25 minutes à 190°C.'
            )
        },
        {
            'title': 'Crème Josephine Baker',
            'description': 'Dessert inspiré des parfums exotiques aimés par Joséphine Baker.',
            'category': 'Dessert',
            'ingredients': (
                '400 ml de lait de coco\n'
                '2 bananes\n'
                '2 c. à soupe de sucre de canne\n'
                '1 c. à café de vanille\n'
                'Copeaux de noix de coco'
            ),
            'steps': (
                '1. Mixer les bananes avec le lait de coco, le sucre et la vanille.\n'
                '2. Verser dans des verrines et mettre au frais 1 heure.\n'
                '3. Servir avec des copeaux de coco sur le dessus.'
            )
        },
        {
            'title': 'Virgin Piña Colada',
            'description': 'Version sans alcool du célèbre cocktail, fraîche et douce.',
            'category': 'Boisson',
            'ingredients': (
                '200 ml de jus d\'ananas\n'
                '100 ml de lait de coco\n'
                'Glace pilée\n'
                'Ananas frais pour la déco'
            ),
            'steps': (
                '1. Mixer le jus d\'ananas avec le lait de coco et la glace pilée.\n'
                '2. Verser dans un grand verre et décorer avec un morceau d\'ananas.'
            )
        },
        {
            'title': 'Msemen maison',
            'description': 'Crêpes feuilletées marocaines à déguster avec du miel.',
            'category': 'Petit-déjeuner',
            'ingredients': (
                '500 g de farine\n'
                '120 g de semoule fine\n'
                'Sel\n'
                'Eau tiède\n'
                'Huile pour le pliage'
            ),
            'steps': (
                '1. Mélanger la farine, la semoule et le sel avec l\'eau tiède.\n'
                '2. Former des boules, huiler et laisser reposer.\n'
                '3. Étaler chaque boule en carré, plier et cuire sur une poêle chaude.'
            )
        },
        {
            'title': 'Crêpes mille trous (Baghrir)',
            'description': 'Crêpes légères et pleines de petits trous, parfaites pour le petit déjeuner.',
            'category': 'Petit-déjeuner',
            'ingredients': (
                '250 g de semoule fine\n'
                '50 g de farine\n'
                '1 sachet de levure boulangère\n'
                '1 c. à café de levure chimique\n'
                'Sel, eau tiède'
            ),
            'steps': (
                '1. Mixer tous les ingrédients avec de l\'eau tiède.\n'
                '2. Laisser reposer 30 minutes.\n'
                '3. Cuire chaque crêpe sur une poêle sans la retourner.'
            )
        },
        {
            'title': 'Harcha express',
            'description': 'Galette à la semoule moelleuse, idéale pour le goûter.',
            'category': 'Goûter',
            'ingredients': (
                '300 g de semoule fine\n'
                '50 g de sucre\n'
                '1 sachet de levure chimique\n'
                '80 g de beurre fondu\n'
                'Lait pour ajuster'
            ),
            'steps': (
                '1. Mélanger la semoule, le sucre, la levure et le beurre.\n'
                '2. Ajouter un peu de lait pour obtenir une pâte souple.\n'
                '3. Former une galette et cuire sur une poêle chaude des deux côtés.'
            )
        },
        {
            'title': 'Salade marocaine',
            'description': 'Une salade fraîche avec tomates, concombre et poivron.',
            'category': 'Entrée',
            'ingredients': (
                '3 tomates\n'
                '1 concombre\n'
                '1 poivron vert\n'
                '1 oignon\n'
                'Coriandre, citron, huile d\'olive'
            ),
            'steps': (
                '1. Couper tous les légumes en petits dés.\n'
                '2. Assaisonner avec le citron, l\'huile, le sel et la coriandre.\n'
                '3. Servir bien frais.'
            )
        },
        {
            'title': 'Pastilla fruits de mer',
            'description': 'Feuilles croustillantes garnies de crevettes et calamars.',
            'category': 'Plat principal',
            'ingredients': (
                'Feuilles de brick\n'
                '300 g de crevettes\n'
                '200 g de calamars\n'
                'Vermicelles chinois\n'
                'Oignon, coriandre, épices'
            ),
            'steps': (
                '1. Faire revenir les fruits de mer avec l\'oignon et les épices.\n'
                '2. Ajouter les vermicelles cuits et la coriandre.\n'
                '3. Garnir les feuilles de brick et cuire au four.'
            )
        },
        {
            'title': 'Pastilla au poulet',
            'description': 'Version classique avec poulet, amandes et cannelle.',
            'category': 'Plat principal',
            'ingredients': (
                'Feuilles de brick\n'
                '1 poulet\n'
                '2 oignons\n'
                '100 g d\'amandes\n'
                'Oeufs, cannelle, sucre glace'
            ),
            'steps': (
                '1. Cuire le poulet avec les oignons et les épices, puis effilocher.\n'
                '2. Ajouter les amandes grillées et concassées.\n'
                '3. Garnir les feuilles et cuire au four, saupoudrer de sucre glace et cannelle.'
            )
        },
        {
            'title': 'Salade composée',
            'description': 'Salade complète avec légumes, œufs et thon.',
            'category': 'Entrée',
            'ingredients': (
                'Laitue\n'
                '2 tomates\n'
                '1 concombre\n'
                '2 œufs durs\n'
                '1 boîte de thon\n'
                'Maïs, olives'
            ),
            'steps': (
                '1. Couper les légumes et disposer dans un plat.\n'
                '2. Ajouter les œufs, le thon, le maïs et les olives.\n'
                '3. Assaisonner avec une vinaigrette simple.'
            )
        },
        {
            'title': 'Salade de riz',
            'description': 'Recette rapide avec riz, légumes et thon.',
            'category': 'Entrée',
            'ingredients': (
                '200 g de riz cuit\n'
                '1 carotte\n'
                '1 poivron\n'
                '1 boîte de thon\n'
                'Maïs, petits pois'
            ),
            'steps': (
                '1. Mélanger le riz cuit avec les légumes coupés en dés.\n'
                '2. Ajouter le thon, le maïs et les petits pois.\n'
                '3. Assaisonner avec une sauce légère.'
            )
        },
    ]

    for data in new_recipes:
        Recipe.objects.get_or_create(
            title=data['title'],
            defaults={
                'description': data['description'],
                'category': data['category'],
                'ingredients': data['ingredients'],
                'steps': data['steps'],
                'author': chef,
            }
        )


def remove_recipes(apps, schema_editor):
    Recipe = apps.get_model('api', 'Recipe')
    titles_to_remove = [
        'Thé marocain à la menthe',
        'Tajine kefta',
        'Lasagnes faciles',
        'Pâtes au saumon',
        'Gâteau au chocolat moelleux',
        'Tarte aux pommes rapide',
        'Crème Josephine Baker',
        'Virgin Piña Colada',
        'Msemen maison',
        'Crêpes mille trous (Baghrir)',
        'Harcha express',
        'Salade marocaine',
        'Pastilla fruits de mer',
        'Pastilla au poulet',
        'Salade composée',
        'Salade de riz',
    ]
    Recipe.objects.filter(title__in=titles_to_remove).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_recipe_category'),
    ]

    operations = [
        migrations.RunPython(add_recipes, remove_recipes),
    ]
