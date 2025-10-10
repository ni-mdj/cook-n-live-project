import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <h1>Cook&Live</h1>
      <p>Bienvenue sur Cook&Live — ton site de cuisine.</p>
    </div>
  )
}

function NotFound() {
  return <h2>Page non trouvée</h2>
}

export default function App() {
  return (
    <div>
      <nav>
        <Link to='/'>Accueil</Link> | <Link to='/recipes'>Recettes</Link> | <Link to='/login'>Connexion</Link>
      </nav>
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
