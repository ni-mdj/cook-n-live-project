// com : Je setup axios pr parler au back local en mode dev.
import axios from 'axios'

// J'utilise le port par défaut de Django (8000) pendant le dev.
// Si je change de port ou que je déploie le site, je modifie simplement cette ligne.
const API = axios.create({
  baseURL: 'http://127.0.0.1:8001/api/'
})

// Fonction utilitaire : si on a un token JWT, on l'ajoute aux headers
export function setAuthToken(token) {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete API.defaults.headers.common['Authorization']
  }
}

export default API
