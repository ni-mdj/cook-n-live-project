// Note perso : détail d'une recette avec le texte complet et un petit formulaire de commentaires.
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../api'

export default function RecipeDetail({ user }){
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [comments, setComments] = useState([])
  const [body, setBody] = useState('')
  const [message, setMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editIngredients, setEditIngredients] = useState('')
  const [editSteps, setEditSteps] = useState('')
  const [editError, setEditError] = useState('')

  useEffect(()=>{
    API.get(`recipes/${id}/`).then(res=>setRecipe(res.data)).catch(()=>setMessage("Recette introuvable."))
    API.get(`comments/?recipe=${id}`).then(res=>setComments(res.data)).catch(()=>{})
  }, [id])

  const submitComment = async (event) => {
    event.preventDefault()
    if (!user) {
      alert('Connecte-toi pour commenter')
      return
    }
    if (body.trim() === '') return
    try{
      await API.post('comments/', { recipe: id, body })
      setBody('')
      const newComments = await API.get(`comments/?recipe=${id}`)
      setComments(newComments.data)
    }catch(err){
      alert("Je n'ai pas réussi à enregistrer ton commentaire.")
    }
  }

  const startEditing = () => {
    if (!recipe) return
    setIsEditing(true)
    setEditTitle(recipe.title || '')
    setEditDescription(recipe.description || '')
    setEditCategory(recipe.category || '')
    setEditIngredients(recipe.ingredients || '')
    setEditSteps(recipe.steps || '')
    setEditError('')
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditError('')
  }

  const saveRecipe = async (event) => {
    event.preventDefault()
    if (!user) return
    try {
      const res = await API.patch(`recipes/${id}/`, {
        title: editTitle,
        description: editDescription,
        category: editCategory,
        ingredients: editIngredients,
        steps: editSteps
      })
      setRecipe(res.data)
      setIsEditing(false)
      setMessage('Recette mise à jour.')
    } catch (err) {
      setEditError("Impossible de mettre à jour la recette.")
    }
  }

  const deleteRecipe = async () => {
    if (!user) return
    const confirmDelete = window.confirm('Supprimer cette recette ?')
    if (!confirmDelete) return
    try {
      await API.delete(`recipes/${id}/`)
      navigate('/recipes')
    } catch (err) {
      setMessage("La suppression a échoué.")
    }
  }

  if(!recipe) {
    return <div className='simple-page'><p>{message || 'Chargement...'}</p></div>
  }

  return (
    <div className='simple-page'>
      {message && <p className='success'>{message}</p>}
      <h2>{recipe.title}</h2>
      <p className='small-text'>Par {recipe.author?.username || 'anonyme'}</p>
      {recipe.category && <p className='small-text'>Catégorie : {recipe.category}</p>}
      {recipe.description && <p>{recipe.description}</p>}

      {user && user.username === recipe.author?.username && (
        <div className='simple-nav__right' style={{gap: '8px', marginBottom: '12px'}}>
          {isEditing ? (
            <>
              <button type='button' onClick={cancelEditing}>Annuler</button>
            </>
          ) : (
            <>
              <button type='button' onClick={startEditing}>Modifier</button>
              <button type='button' onClick={deleteRecipe}>Supprimer</button>
            </>
          )}
        </div>
      )}

      {isEditing && (
        <form onSubmit={saveRecipe} className='simple-form'>
          <label>Titre</label>
          <input value={editTitle} onChange={e => setEditTitle(e.target.value)} />

          <label>Description</label>
          <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} />

          <label>Catégorie</label>
          <input value={editCategory} onChange={e => setEditCategory(e.target.value)} />

          <label>Ingrédients</label>
          <textarea value={editIngredients} onChange={e => setEditIngredients(e.target.value)} />

          <label>Étapes</label>
          <textarea value={editSteps} onChange={e => setEditSteps(e.target.value)} />

          {editError && <p className='warning'>{editError}</p>}
          <button type='submit'>Enregistrer</button>
        </form>
      )}

      <h3>Ingrédients</h3>
      <pre className='recipe-text'>{recipe.ingredients}</pre>

      <h3>Préparation</h3>
      <pre className='recipe-text'>{recipe.steps}</pre>

      <h3>Commentaires</h3>
      {comments.length === 0 ? (
        <p className='small-text'>Pas encore de commentaire.</p>
      ) : (
        <ul className='comment-list'>
          {comments.map(c => (
            <li key={c.id}>
              <strong>{c.author?.username || 'anonyme'} :</strong> {c.body}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submitComment} className='simple-form'>
        <label>Laisser un commentaire</label>
        <textarea value={body} onChange={e => setBody(e.target.value)} />
        <button type='submit'>Envoyer</button>
      </form>
      {!user && <p className='small-text'>Il faut être connecté pour commenter.</p>}
    </div>
  )
}
