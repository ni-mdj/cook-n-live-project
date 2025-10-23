// com : Je montre mon profil + rec perso pr suivre mes stats.
import React, { useEffect, useState } from 'react'
import API from '../api'
import { Link } from 'react-router-dom'

export default function Profile({ user }) {
  const [recipes, setRecipes] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    API.get('recipes/?mine=true')
      .then(res => setRecipes(res.data))
      .catch(() => setError("Impossible de récupérer mes recettes."))
  }, [user])

  if (!user) {
    return (
      <div className='simple-page'>
        <p>Connecte-toi pour accéder à ton profil.</p>
        <Link to='/login'>Aller à la connexion</Link>
      </div>
    )
  }

  return (
    <div className='simple-page'>
      <h2>Mon profil</h2>
      <p className='small-text'>Pseudo : {user.username}</p>
      <p className='small-text'>Astuce : ajoute tes recettes pour que le jury voie ton travail.</p>

      <h3>Mes recettes</h3>
      {error && <p className='warning'>{error}</p>}
      {recipes.length === 0 ? (
        <p className='small-text'>
          Tu n'as pas encore publié de recette.
          {' '}<Link to='/recipes/new'>Créer ma première recette</Link>
        </p>
      ) : (
        <ul className='simple-list'>
          {recipes.map(recipe => (
            <li key={recipe.id}>
              <strong>{recipe.title}</strong>
              {recipe.category && ` (${recipe.category})`}
              {' — '}
              {recipe.likes} like(s) —{' '}
              <Link to={`/recipes/${recipe.id}`}>ouvrir</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
