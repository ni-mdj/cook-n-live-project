// com : petite aide pour choisir une image de recette quand aucune photo n'est stockée.

const specificImages = {
  'tajine poulet olive': 'https://images.pexels.com/photos/6849653/pexels-photo-6849653.jpeg?auto=compress&cs=tinysrgb&w=900',
  'couscous marocain': 'https://images.pexels.com/photos/5490899/pexels-photo-5490899.jpeg?auto=compress&cs=tinysrgb&w=900',
  'msemen': 'https://upload.wikimedia.org/wikipedia/commons/d/db/Msemmem.jpg',
  'baghrir crepes mille trous': 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Baghrir_1.jpg',
  'crepes mille trous baghrir': 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Baghrir_1.jpg',
  'matlou pain marocain': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Pains_matlou_dans_une_boulangerie_de_la_rue_d%27Aligre%2C_%C3%A0_Paris.jpg',
  'the marocain a la menthe': 'https://upload.wikimedia.org/wikipedia/commons/4/42/Moroccan_Mint_Tea_-_1.jpg',
  'tajine kefta': 'https://images.pexels.com/photos/5847934/pexels-photo-5847934.jpeg?auto=compress&cs=tinysrgb&w=900',
  'lasagnes faciles': 'https://upload.wikimedia.org/wikipedia/commons/0/06/Meaty_Lasagna_8of8_%288736299782%29.jpg',
  'pates au saumon': 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Smoked_salmon_pasta_-_Figaros%2C_Brighton_2024-04-19.jpg',
  'gateau au chocolat moelleux': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Moelleux_chocolat.jpg',
  'tarte aux pommes rapide': 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Apple_cake_with_vanilla_ice_cream_2.jpg',
  'creme josephine baker': 'https://upload.wikimedia.org/wikipedia/commons/1/12/Creme_Brule_Dessert%2C_MicroCon_2025.jpg',
  'virgin pina colada': 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Pi%C3%B1a_Colada.jpg',
  'msemen maison': 'https://upload.wikimedia.org/wikipedia/commons/d/db/Msemmem.jpg',
  'harcha express': 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Harcha_%28Homemade%29.jpg',
  'salade marocaine': 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Salade_marocaine.jpg',
  'pastilla fruits de mer': 'https://upload.wikimedia.org/wikipedia/commons/8/82/Pastilla_Seafood.jpg',
  'pastilla au poulet': 'https://upload.wikimedia.org/wikipedia/commons/5/51/Pastilla_au_poulet.jpg',
  'salade composee': 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Mixed_salad_and_turshu.jpg',
  'salade de riz': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Rice_salad_%283513765313%29.jpg',
  'fondant au chocolat': 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Fondant_au_Chocolat_1.jpg'
}

const fallbackImages = [
  { keyword: 'tajine', url: specificImages['tajine poulet olive'] },
  { keyword: 'couscous', url: specificImages['couscous marocain'] },
  { keyword: 'msemen', url: specificImages['msemen'] },
  { keyword: 'baghrir', url: specificImages['baghrir crepes mille trous'] },
  { keyword: 'matlou', url: specificImages['matlou pain marocain'] },
  { keyword: 'harcha', url: specificImages['harcha express'] },
  { keyword: 'pastilla', url: specificImages['pastilla au poulet'] },
  { keyword: 'salade', url: specificImages['salade marocaine'] },
  { keyword: 'pates', url: specificImages['pates au saumon'] },
  { keyword: 'pasta', url: specificImages['pates au saumon'] },
  { keyword: 'poisson', url: specificImages['pates au saumon'] },
  { keyword: 'gateau', url: specificImages['gateau au chocolat moelleux'] },
  { keyword: 'fondant', url: specificImages['fondant au chocolat'] },
  { keyword: 'tarte', url: specificImages['tarte aux pommes rapide'] },
  { keyword: 'dessert', url: specificImages['gateau au chocolat moelleux'] },
  { keyword: 'cocktail', url: specificImages['virgin pina colada'] },
  { keyword: 'the', url: specificImages['the marocain a la menthe'] },
  { keyword: 'pain', url: specificImages['matlou pain marocain'] }
]

const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Couscous_marocain_resto_UCAD_12.jpg'

const normalizeText = (text = '') =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

export function getRecipeImage(recipe) {
  if (!recipe) return defaultImage
  if (recipe.image) return recipe.image

  const titleKey = normalizeText(recipe.title)
  if (titleKey && specificImages[titleKey]) {
    return specificImages[titleKey]
  }

  const text = `${normalizeText(recipe.category)} ${titleKey}`.trim()
  const match = fallbackImages.find(item => text.includes(item.keyword))
  if (match) return match.url

  return defaultImage
}
