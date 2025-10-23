// com : Je recense les lives Twitch (flux + planning) pr la commu.
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
  const [replaySession, setReplaySession] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    API.get('livesessions/')
      .then(res => {
        setSessions(res.data)
        const lastReplay = res.data.find(session => !session.is_active && session.twitch_url)
        if (lastReplay) {
          setReplaySession(lastReplay)
        }
      })
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
      <p>Je fais un live de cuisine tous les jeudis à 20h. Tu peux le regarder ici :</p>

      <div className='live-grid'>
        <div className='video-box'>
          <LiveEmbed channel={nextSession?.twitch_channel || replaySession?.twitch_channel || 'cooknlive'} />
        </div>
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
          <div className='next-live'>
            <h2>Pas de live prévu</h2>
            <p className='small-text'>
              Je prépare la prochaine session. En attendant, regarde le dernier replay pour te mettre dans l'ambiance.
            </p>
            {replaySession?.twitch_url ? (
              <p>
                <a href={replaySession.twitch_url} target='_blank' rel='noreferrer'>
                  Voir le replay : {replaySession.title}
                </a>
              </p>
            ) : (
              <p className='small-text'>Aucun replay n'est disponible pour le moment.</p>
            )}
          </div>
        )}
      </div>

      <h2>Liste des lives</h2>
      {error && <p className='warning'>{error}</p>}
      <ul className='simple-list'>
        {sessions.map(session => (
          <li key={session.id}>
            <strong>{session.title}</strong> — {formatDate(session.scheduled_at)}
            {session.is_active ? ' (à venir)' : ' (terminé)'}
          </li>
        ))}
      </ul>
      {sessions.length === 0 && !error && <p className='small-text'>Rien de planifié pour l'instant.</p>}
    </div>
  )
}
