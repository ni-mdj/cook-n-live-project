Frontend React pour Cook&Live

Installation et lancement :

```bash
cd frontend
npm install
npm start
```

Le front communiquera avec l'API Django sur `http://127.0.0.1:8000/api/`.

Pages incluses :
- / : accueil (Live embed)
- /recipes : liste des recettes
- /recipes/:id : détail recette et commentaires
- /recipes/new : créer une recette (auth requis)
- /login et /register
