import { useState, useEffect } from 'react'
import talk from './services/server.jsx'
import { DisplayCountry, Display } from './components/display.jsx'

const App = () => {
  const [all, setAll] = useState([])
  const [foundList, setFound] = useState([])
  const [shownCountry, setCountry] = useState(null)
  const [buttonClicked, setClick] = useState(false)

  useEffect(() => {
    talk.load().then(clist => {
      setAll(clist)
    })
  }, [])

  useEffect(() => {
    const shouldFetchWeather = foundList.length === 1 || buttonClicked
    if (!shownCountry || !shouldFetchWeather || shownCountry.weather) {
      setClick(false)
      return
    }

    const capital = Array.isArray(shownCountry.capital)
      ? shownCountry.capital[0]
      : shownCountry.capital

    if (!capital) {
      setClick(false)
      return
    }

    talk.weatherGet(capital).then(wInfo => {
      setCountry({ ...shownCountry, weather: wInfo })
    })

    setClick(false)
  }, [foundList, buttonClicked, shownCountry])

  const onSearch = (val) => {
    const filtered = all.filter(c => c.name.common.toLowerCase().includes(val.toLowerCase()))
    setFound(filtered)

    filtered.length === 1
      ? setCountry(filtered[0])
      : setCountry(null)
  }

  return (
    <div>
      <p>
        find countries
        <input type='text' onChange={event => onSearch(event.target.value)} />
      </p>
      <Display foundList={foundList} setCountry={setCountry} setClick={setClick} />
      <DisplayCountry country={shownCountry} />
    </div>
  )
}

export default App
