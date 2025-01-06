import axios from "axios";
const all_URL = 'https://studies.cs.helsinki.fi/restcountries/api/all';
const load = () => {
  return axios.get(all_URL).then(response => response.data)
}

const weatherGet = (city) => {
  const api_key = import.meta.env.VITE_SOME_KEY
  const wea_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`
  return axios.get(wea_URL).then(response => response.data)
}

export default {load,weatherGet}