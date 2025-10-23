// Note perso : liste toutes les recettes pour que je puisse les voir et en ajouter une si je suis connectée.
import React, { useEffect, useState } from 'react'
import API from '../api'
import { Link } from 'react-router-dom'

export default function RecipesList({ user }) {
  const [recipes, setRecipes] = useState([])
  const [allRecipes, setAllRecipes] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    API.get('recipes/')
      .then(response => {
        setRecipes(response.data)
        setAllRecipes(response.data)
      })
      .catch(() => setError("Je n'arrive pas à charger les recettes pour le moment."))
  }, [])

  useEffect(() => {
    if (selectedCategory === '') {
      setRecipes(allRecipes)
    } else {
      const filtered = allRecipes.filter(recipe =>
        (recipe.category || '').toLowerCase() === selectedCategory.toLowerCase()
      )
      setRecipes(filtered)
    }
  }, [selectedCategory, allRecipes])

  const categories = Array.from(
    new Set(
      allRecipes
        .map(r => (r.category || '').trim())
        .filter(Boolean)
    )
  )

  return (
    <div className='simple-page'>
      <h2>Les recettes</h2>
      {user ? (
        <Link to='/recipes/new' className='small-button'>Ajouter ma recette</Link>
      ) : (
        <p className='small-text'>Connecte-toi pour publier tes recettes.</p>
      )}

      {error && <p className='warning'>{error}</p>}

      <label className='small-text' style={{marginTop: '8px'}}>
        Filtrer par catégorie :
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          style={{marginLeft: '8px'}}
        >
          <option value=''>Toutes</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </label>

      <div className='recipe-list'>
        {recipes.map(recipe => (
          <div key={recipe.id} className='recipe-card'>
            <h3>{recipe.title}</h3>
            <p className='recipe-author'>par {recipe.author?.username || 'anonyme'}</p>
            {recipe.category && <p className='small-text'>Catégorie : {recipe.category}</p>}
            {recipe.description && <p>{recipe.description}</p>}
            <Link to={`/recipes/${recipe.id}`}>Voir la recette</Link>
          </div>
        ))}
      </div>

      {recipes.length === 0 && !error && (
        <p className='small-text'>Aucune recette pour l'instant.</p>
      )}
    </div>
  )
}
