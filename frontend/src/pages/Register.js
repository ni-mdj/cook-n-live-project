// Note perso : page pour créer un compte afin de participer aux commentaires et recettes.
import React, { useState } from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)
    try {
      await API.post('auth/register/', { username, email, password })
      setMessage('Inscription réussie !')
      setTimeout(() => navigate('/login'), 1000)
    } catch (err) {
      setError("Je n'ai pas pu créer le compte.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='simple-page'>
      <h2>Inscription</h2>
      <p className='small-text'>Crée ton compte pour participer aux lives.</p>
      {message && <p className='success'>{message}</p>}
      {error && <p className='warning'>{error}</p>}
      <form onSubmit={submit} className='simple-form'>
        <label>Pseudo</label>
        <input value={username} onChange={e => setUsername(e.target.value)} />

        <label>Email (facultatif)</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />

        <label>Mot de passe</label>
        <input type='password' value={password} onChange={e => setPassword(e.target.value)} />

        <button type='submit' disabled={loading}>
          {loading ? 'En cours…' : "S'inscrire"}
        </button>
      </form>
    </div>
  )
}
