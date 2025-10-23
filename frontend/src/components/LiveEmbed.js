// com : Je embed le player Twitch pr le live du jeudi.
import React from 'react'

export default function LiveEmbed({ channel = 'cooknlive' }){
  const parent = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
  const src = `https://player.twitch.tv/?channel=${channel}&parent=${parent}&muted=true`

  return (
    <div className='video-box'>
      <iframe
        title='Twitch Live'
        src={src}
        height='360'
        width='100%'
        allowFullScreen
      />
    </div>
  )
}
