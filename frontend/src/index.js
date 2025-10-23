// com : Je lance le root React, je plug le Router et je restaure le token stock.
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
