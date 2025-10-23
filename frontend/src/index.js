// Note perso : point d'entrée React qui monte l'application et recharge le token stocké si besoin.
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { setAuthToken } from './api'

const savedToken = localStorage.getItem('access')
if (savedToken) {
  setAuthToken(savedToken)
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
