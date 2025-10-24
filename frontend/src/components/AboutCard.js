// com : Je presente rapidement moi meme Chef Noor ds une card cool.
import React from 'react'

export default function AboutCard() {
  return (
    <section className='simple-card'>
      <div className='portrait-placeholder' aria-hidden='true'>👩‍🍳</div>
      <div>
        <h2>Qui est Chef Noor ?</h2>
        <p>
          Pationnée de cuisine depuis toujours, j'aime partager mes recettes simples et savoureuses.
          J'aime cuisiner des plats marocains faciles et les partager en direct chaque jeudi soir.
          Sur Cook&Live, je mélange recettes traditionnelles, boissons fraîches et desserts rapides.
        </p>
        <p className='small-text'>
          Mon objectif : prouver qu&apos;une débutante motivée peut faire quelque chose de génial !
        </p>
      </div>
    </section>
  )
}
