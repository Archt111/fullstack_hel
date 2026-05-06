import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3000
const countriesApiUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/countries', async (_req, res, next) => {
  try {
    const response = await fetch(countriesApiUrl)
    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch countries data' })
    }

    const data = await response.json()
    return res.json(data)
  } catch (error) {
    return next(error)
  }
})

app.get('/api/weather', async (req, res, next) => {
  const { capital } = req.query
  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!capital) {
    return res.status(400).json({ error: 'capital query param is required' })
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'OPENWEATHER_API_KEY is not configured' })
  }

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(capital)}&appid=${apiKey}`

  try {
    const response = await fetch(weatherUrl)
    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch weather data' })
    }

    const data = await response.json()
    return res.json(data)
  } catch (error) {
    return next(error)
  }
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(port, () => {
  console.log(`Countries backend running on port ${port}`)
})
