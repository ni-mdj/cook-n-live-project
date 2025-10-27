// com : Page ultra simple pour demander un nouveau mot de passe via l'API.
import React, { useState } from 'react'
import API from '../api'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (newPassword !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    try {
      const payload = { email, new_password: newPassword }
      await API.post('auth/password/reset/', payload)
      setMessage('Ton mot de passe est mis à jour. Tu peux te reconnecter.')
      setEmail('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      if (err.response?.status === 404) {
        setError("On ne trouve pas d'utilisateur avec cet e-mail.")
      } else {
        setError("Oups, la demande n'a pas fonctionné. Réessaie plus tard.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='simple-page'>
      <h2>Mot de passe oublié</h2>
      <p className='small-text'>Entre l&apos;e-mail de ton compte et choisis un nouveau mot de passe.</p>
      {message && <p className='success'>{message}</p>}
      {error && <p className='warning'>{error}</p>}

      <form onSubmit={submit} className='simple-form'>
        <label>E-mail</label>
        <input
          type='email'
          value={email}
          onChange={event => setEmail(event.target.value)}
          required
        />

        <label>Nouveau mot de passe</label>
        <input
          type='password'
          value={newPassword}
          onChange={event => setNewPassword(event.target.value)}
          required
        />

        <label>Confirmer le mot de passe</label>
        <input
          type='password'
          value={confirmPassword}
          onChange={event => setConfirmPassword(event.target.value)}
          required
        />

        <button type='submit' disabled={loading}>
          {loading ? 'En cours...' : 'Mettre à jour'}
        </button>
      </form>

      <p className='small-text'>
        <Link to='/login'>Retour à la connexion</Link>
      </p>
    </div>
  )
}
