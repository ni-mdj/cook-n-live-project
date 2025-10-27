// com : Je pilote la nav + pages et je garde l'etat usr pr savoir si qqn est log.
import React, { useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RecipesList from './pages/RecipesList'
import RecipeDetail from './pages/RecipeDetail'
import NouvelRecette from './pages/NouvelRecette'
import Live from './pages/Live'
import Profile from './pages/Profile'
import { setAuthToken } from './api'
import ForgotPassword from './pages/ForgotPassword'

export default function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('access')
    const username = localStorage.getItem('username')
    if (token && username) {
      setAuthToken(token)
      setUser({ username })
    }
  }, [])

  const handleLogin = ({ username, access, refresh }) => {
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)
    localStorage.setItem('username', username)
    setAuthToken(access)
    setUser({ username })
    navigate('/')
  }

  const handleLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('username')
    setAuthToken(null)
    setUser(null)
    navigate('/')
  }

  return (
    <div>
      <header className='simple-nav'>
        <div className='simple-nav__left'>
          <Link to='/' className='simple-nav__logo'>Cook&Live</Link>
          <Link to='/recipes'>Recettes</Link>
          <Link to='/live'>Live</Link>
        </div>
        <div className='simple-nav__right'>
          {user ? (
            <>
              <span>Bonjour {user.username}</span>
              <button type='button' onClick={handleLogout}>Se déconnecter</button>
              <Link to='/profile'>Mon profil</Link>
              <Link to='/recipes/new'>Ajouter une recette</Link>
            </>
          ) : (
            <>
              <Link to='/login'>Connexion</Link>
              <Link to='/register'>Inscription</Link>
            </>
          )}
        </div>
      </header>

      <main className='simple-container'>
        <Routes>
          <Route path='/' element={<Home user={user} />} />
          <Route path='/login' element={<Login onLogin={handleLogin} />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/recipes' element={<RecipesList user={user} />} />
          <Route path='/recipes/new' element={<NouvelRecette user={user} />} />
          <Route path='/recipes/:id' element={<RecipeDetail user={user} />} />
          <Route path='/live' element={<Live />} />
          <Route path='/profile' element={<Profile user={user} />} />
          <Route path='*' element={<div>Page non trouvée</div>} />
        </Routes>
      </main>
    </div>
  )
}
