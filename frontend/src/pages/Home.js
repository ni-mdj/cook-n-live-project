// Note perso : page d'accueil qui présente le live et montre quelques recettes récentes.
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api'
import LiveEmbed from '../components/LiveEmbed'

export default function Home(){
  const [recipes, setRecipes] = useState([])

  useEffect(() => {
    API.get('recipes/')
      .then(res => setRecipes(res.data.slice(0, 5)))
      .catch(() => setRecipes([]))
  }, [])

  return (
    <div className='simple-page'>
      <h1>Cook&Live</h1>
      <p>Ceci est mon petit site de cuisine. Chaque jeudi je fais un live Twitch pour cuisiner en famille.</p>

      <h2>Live Twitch</h2>
      <p>Le live commence le jeudi à 18h. Voici le lecteur :</p>
      <LiveEmbed channel='cooknlive' />

      <h2>Quelques recettes</h2>
      <ul className='simple-list'>
        {recipes.map(recipe => (
          <li key={recipe.id}>
            <strong>{recipe.title}</strong>
            {recipe.category && ` (${recipe.category})`}
            {' — '}
            {recipe.description || 'Sans description'}
            {' '}<Link to={`/recipes/${recipe.id}`}>voir</Link>
          </li>
        ))}
      </ul>
      <Link to='/recipes'>Voir toutes les recettes</Link>
    </div>
  )
}
