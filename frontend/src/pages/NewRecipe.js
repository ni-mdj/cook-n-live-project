// Note perso : formulaire simple pour publier une nouvelle recette quand je suis connectée.
import React, { useState } from 'react'
import API from '../api'
import { Link, useNavigate } from 'react-router-dom'

export default function NewRecipe({ user }){
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className='simple-page'>
        <p>Il faut être connecté pour poster une recette.</p>
        <Link to='/login'>Aller à la page de connexion</Link>
      </div>
    )
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try{
      await API.post('recipes/', { title, description, ingredients, steps, category })
      navigate('/recipes')
    }catch(err){
      setError("La recette n'a pas pu être enregistrée.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='simple-page'>
      <h2>Ajouter une recette</h2>
      {error && <p className='warning'>{error}</p>}
      <form onSubmit={submit} className='simple-form'>
        <label>Titre</label>
        <input value={title} onChange={e => setTitle(e.target.value)} />

        <label>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} />

        <label>Catégorie (ex : Plat, Dessert)</label>
        <input value={category} onChange={e => setCategory(e.target.value)} />

        <label>Ingrédients</label>
        <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} />

        <label>Étapes</label>
        <textarea value={steps} onChange={e => setSteps(e.target.value)} />

        <button type='submit' disabled={loading}>
          {loading ? 'En cours…' : 'Publier'}
        </button>
      </form>
    </div>
  )
}
