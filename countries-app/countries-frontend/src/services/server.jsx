import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL || '/api'

const load = () => {
  return axios.get(`${backendUrl}/countries`).then(response => response.data)
}

const weatherGet = (city) => {
  return axios.get(`${backendUrl}/weather`, { params: { capital: city } }).then(response => response.data)
}

export default { load, weatherGet }
