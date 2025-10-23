// com : Je mix accueil, teaser live et rec recentes pr hook l'user.
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api'
import LiveEmbed from '../components/LiveEmbed'
import AboutCard from '../components/AboutCard'

export default function Home(){
  const [recipes, setRecipes] = useState([])
  const [upcomingLives, setUpcomingLives] = useState([])

  useEffect(() => {
    API.get('recipes/')
      .then(res => setRecipes(res.data.slice(0, 5)))
      .catch(() => setRecipes([]))

    API.get('livesessions/')
      .then(res => {
        const upcoming = res.data.filter(session => session.is_active).slice(0, 3)
        setUpcomingLives(upcoming)
      })
      .catch(() => setUpcomingLives([]))
  }, [])

  return (
    <div className='simple-page'>
      <section className='hero-banner'>
        <div className='hero-content'>
          <h1>Bienvenue dans ma cuisine live</h1>
          <p>
            Je suis Noor Medjahed passionée de cuisine, chaque jeudi à 20h, je prépare un menu complet en direct sur Twitch :
            entrée fraîche, plat généreux et dessert maison.
            Installe-toi, remplis ton carnet de recettes et cuisine avec moi !
          </p>
          <div className='hero-actions'>
            <Link to='/recipes' className='btn-accent'>Voir toutes les recettes</Link>
            <Link to='/live' className='small-button'>Suivre le live du jeudi à 20h</Link>
          </div>
        </div>
        <div className='hero-note'>
          <span></span>
          <p>Astuces du Jour : prépare ton thé à la menthe et rejoins le chat pour poser toute tes questions en direct.</p>
        </div>
      </section>

      <section className='feature-strip'>
        <div>
          <span></span>
          <h3>Entrées</h3>
          <p>Salades marocaines, petites bouchées et sauces simples pour lancer un bon repas en famille.</p>
        </div>
        <div>
          <span></span>
          <h3>Plats réconfortants chauds</h3>
          <p>Tajines, pastillas, pâtes... les classiques à refaire facilement chez toi.</p>
        </div>
        <div>
          <span></span>
          <h3>Desserts</h3>
          <p>Msemen, Baghrir, Gâteaux express pour terminer en douceur.</p>
        </div>
        <div>
          <span></span>
          <h3>Live interactif</h3>
          <p>On cuisine ensemble chaque jeudi à 20h, tu peux liker et commenter les recettes reagir en direct.</p>
        </div>
      </section>

      <AboutCard />

      <h2>Live Twitch</h2>
      <p>Le live commence le jeudi à 20H. Voici le lecteur :</p>
      <LiveEmbed channel='cooknlive' />

      <h3>Programme des prochains lives</h3>
      {upcomingLives.length === 0 ? (
        <p className='small-text'>Le prochain planning arrive bientôt.</p>
      ) : (
        <ul className='simple-list'>
          {upcomingLives.map(live => (
            <li key={live.id}>
              <strong>{live.title}</strong> — {new Date(live.scheduled_at).toLocaleString('fr-FR')}
            </li>
          ))}
        </ul>
      )}

      <h2>Quelques recettes</h2>
      <div className='recipes-grid'>
        {recipes.map(recipe => (
          <div key={recipe.id} className='recipe-card'>
            {recipe.image && (
              <div className='recipe-card__thumb'>
                <img src={recipe.image} alt={`Illustration de ${recipe.title}`} />
              </div>
            )}
            <h3>{recipe.title}</h3>
            {recipe.category && <p className='small-text'>Catégorie : {recipe.category}</p>}
            <p>{recipe.description || 'Sans description'}</p>
            <p className='small-text'>{recipe.likes} like(s)</p>
            <Link to={`/recipes/${recipe.id}`} className='small-button'>Voir la recette</Link>
          </div>
        ))}
      </div>
      <Link to='/recipes'>Voir toutes les recettes</Link>
    </div>
  )
}
