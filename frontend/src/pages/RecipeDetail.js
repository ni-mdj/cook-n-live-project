// com : Je montre la fiche rec (txt, img, likes, com) et je gere les actions.
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../api'

const splitSteps = (rawSteps) => {
  if (!rawSteps) return []
  return rawSteps
    .split(/\r?\n/)
    .map(line => line.replace(/^\d+[\).\-\s]*/, '').trim())
    .filter(Boolean)
}

export default function RecipeDetail({ user }){
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [comments, setComments] = useState([])
  const [body, setBody] = useState('')
  const [message, setMessage] = useState('')
  const [commentError, setCommentError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editIngredients, setEditIngredients] = useState('')
  const [editSteps, setEditSteps] = useState('')
  const [editImage, setEditImage] = useState(null)
  const [editError, setEditError] = useState('')
  const [likeError, setLikeError] = useState('')
  const [stepList, setStepList] = useState([])
  const [checkedSteps, setCheckedSteps] = useState([])

  const stepsStorageKey = `recipeSteps-${id}`

  useEffect(()=>{
    API.get(`recipes/${id}/`).then(res=>{
      setRecipe(res.data)
      setStepList(splitSteps(res.data.steps))
    }).catch(()=>setMessage("Recette introuvable."))
    API.get(`comments/?recipe=${id}`).then(res=>setComments(res.data)).catch(()=>{})
  }, [id])

  useEffect(() => {
    if (!stepList.length) {
      setCheckedSteps([])
      return
    }
    try {
      const saved = localStorage.getItem(stepsStorageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length === stepList.length) {
          setCheckedSteps(parsed)
          return
        }
      }
    } catch (err) {
      // ignore parsing errors and reset checklist
    }
    setCheckedSteps(Array(stepList.length).fill(false))
  }, [stepList, stepsStorageKey])

  useEffect(() => {
    if (!stepList.length) return
    if (checkedSteps.length !== stepList.length) return
    try {
      localStorage.setItem(stepsStorageKey, JSON.stringify(checkedSteps))
    } catch (err) {
      // storage might be unavailable, safely ignore
    }
  }, [checkedSteps, stepList.length, stepsStorageKey])

  const submitComment = async (event) => {
    event.preventDefault()
    if (!user) {
      navigate('/login', { replace: true, state: { from: `/recipes/${id}` } })
      return
    }
    if (body.trim() === '') return
    try{
      await API.post('comments/', { recipe: id, body })
      setBody('')
      setCommentError('')
      const newComments = await API.get(`comments/?recipe=${id}`)
      setComments(newComments.data)
    }catch(err){
      setCommentError("Je n'ai pas réussi à enregistrer ton commentaire.")
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
    setEditImage(null)
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
      const formData = new FormData()
      formData.append('title', editTitle)
      formData.append('description', editDescription)
      formData.append('category', editCategory)
      formData.append('ingredients', editIngredients)
      formData.append('steps', editSteps)
      if (editImage) {
        formData.append('image', editImage)
      }
      const res = await API.patch(`recipes/${id}/`, formData)
      const updatedSteps = splitSteps(res.data.steps)
      setRecipe(res.data)
      setStepList(updatedSteps)
      try {
        localStorage.removeItem(stepsStorageKey)
      } catch (err) {
        // ignore
      }
      setCheckedSteps(Array(updatedSteps.length).fill(false))
      setIsEditing(false)
      setMessage('Recette mise à jour.')
      setEditImage(null)
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

  const handleLike = async () => {
    try {
      const res = await API.post(`recipes/${id}/like/`)
      setRecipe(res.data)
      setLikeError('')
    } catch (err) {
      setLikeError("Impossible d'ajouter un like pour le moment.")
    }
  }

  const toggleStep = (index) => {
    setCheckedSteps(prev => {
      const baseLengthMatch = prev.length === stepList.length
      const next = baseLengthMatch ? [...prev] : Array(stepList.length).fill(false)
      next[index] = !next[index]
      return next
    })
  }

  const resetSteps = () => {
    setCheckedSteps(Array(stepList.length).fill(false))
    try {
      localStorage.removeItem(stepsStorageKey)
    } catch (err) {
      // ignore
    }
  }

  return (
    <div className='simple-page'>
      {message && <p className='success'>{message}</p>}
      <h2>{recipe.title}</h2>
      <p className='small-text'>Par {recipe.author?.username || 'anonyme'}</p>
      {recipe.image && (
        <div className='recipe-detail__image'>
          <img src={recipe.image} alt={`Illustration de ${recipe.title}`} />
        </div>
      )}
      {recipe.category && <p className='small-text'>Catégorie : {recipe.category}</p>}
      {recipe.description && <p>{recipe.description}</p>}
      <div className='like-box'>
        <button type='button' onClick={handleLike}>J&apos;aime 👍</button>
        <span className='small-text'>{recipe.likes} like(s)</span>
      </div>
      {likeError && <p className='warning'>{likeError}</p>}

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

          <label>Image (facultatif)</label>
          <input
            type='file'
            accept='image/*'
            onChange={e => setEditImage(e.target.files?.[0] || null)}
          />

          {editError && <p className='warning'>{editError}</p>}
          <button type='submit'>Enregistrer</button>
        </form>
      )}

      <h3>Ingrédients</h3>
      <pre className='recipe-text'>{recipe.ingredients}</pre>

      <h3>Préparation</h3>
      {stepList.length === 0 ? (
        <pre className='recipe-text'>{recipe.steps}</pre>
      ) : (
        <>
          <ol className='step-checklist'>
            {stepList.map((step, index) => (
              <li
                key={index}
                className={`step-checklist__item ${checkedSteps[index] ? 'step-checklist__item--done' : ''}`}
              >
                <input
                  type='checkbox'
                  id={`step-${index}`}
                  checked={Boolean(checkedSteps[index])}
                  onChange={() => toggleStep(index)}
                />
                <label htmlFor={`step-${index}`}>{step}</label>
              </li>
            ))}
          </ol>
          {stepList.length > 0 && (
            <button
              type='button'
              className='small-button step-checklist__reset'
              onClick={resetSteps}
              disabled={!checkedSteps.some(Boolean)}
            >
              Réinitialiser les étapes
            </button>
          )}
        </>
      )}

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
      {commentError && <p className='warning'>{commentError}</p>}
      {!user && <p className='small-text'>Il faut être connecté pour commenter.</p>}
    </div>
  )
}
