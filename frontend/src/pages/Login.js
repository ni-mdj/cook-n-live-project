// com : Je gere la connexion (usr/pwd -> back) de facon ultra simple.
import React, { useState } from 'react'
import API from '../api'
import { Link } from 'react-router-dom'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await API.post('auth/login/', { username, password })
      const { access, refresh } = response.data
      if (onLogin) {
        onLogin({ username, access, refresh })
      }
    } catch (err) {
      setError("Connexion impossible. Vérifie ton mot de passe.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='simple-page'>
      <h2>Connexion</h2>
      <p className='small-text'>Entre ton pseudo et ton mot de passe pour participer aux lives.</p>
      {error && <p className='warning'>{error}</p>}
      <form onSubmit={submit} className='simple-form'>
        <label>Pseudo</label>
        <input value={username} onChange={e => setUsername(e.target.value)} />

        <label>Mot de passe</label>
        <input type='password' value={password} onChange={e => setPassword(e.target.value)} />

        <button type='submit' disabled={loading}>
          {loading ? 'Chargement...' : 'Se connecter'}
        </button>
      </form>
      <p className='small-text'>
        Pas encore de compte ? <Link to='/register'>Créer un compte</Link>
      </p>
      <p className='small-text'>
        Mot de passe oublié ? <Link to='/forgot-password'>Le réinitialiser ici</Link>
      </p>
    </div>
  )
}
