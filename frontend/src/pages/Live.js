// Note perso : page dédiée aux lives Twitch avec le flux et la liste des sessions prévues.
import React, { useEffect, useState } from 'react'
import API from '../api'
import LiveEmbed from '../components/LiveEmbed'

function formatDate(dateString) {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) {
    return dateString
  }
  return d.toLocaleString('fr-FR')
}

export default function Live() {
  const [sessions, setSessions] = useState([])
  const [nextSession, setNextSession] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    API.get('livesessions/')
      .then(res => setSessions(res.data))
      .catch(() => setError("Impossible de charger la liste des lives."))

    API.get('livesessions/next/')
      .then(res => {
        if (!res.data.detail) {
          setNextSession(res.data)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className='simple-page'>
      <h1>Live du jeudi</h1>
      <p>Je fais un live de cuisine tous les jeudis à 18h. Tu peux le regarder ici :</p>
      <LiveEmbed channel={nextSession?.twitch_channel || 'cooknlive'} />

      {nextSession ? (
        <div className='next-live'>
          <h2>Prochain live</h2>
          <p><strong>{nextSession.title}</strong></p>
          <p>{formatDate(nextSession.scheduled_at)}</p>
          {nextSession.description && <p>{nextSession.description}</p>}
          {nextSession.twitch_url && (
            <p><a href={nextSession.twitch_url} target='_blank' rel='noreferrer'>Ouvrir sur Twitch</a></p>
          )}
        </div>
      ) : (
        <p className='small-text'>Pas encore de live prévu.</p>
      )}

      <h2>Liste des lives</h2>
      {error && <p className='warning'>{error}</p>}
      <ul className='simple-list'>
        {sessions.map(session => (
          <li key={session.id}>
            <strong>{session.title}</strong> — {formatDate(session.scheduled_at)}
          </li>
        ))}
      </ul>
      {sessions.length === 0 && !error && <p className='small-text'>Rien de planifié pour l'instant.</p>}
    </div>
  )
}
