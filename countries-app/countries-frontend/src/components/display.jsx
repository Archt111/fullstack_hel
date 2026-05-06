import PropTypes from 'prop-types'

const weatherShape = PropTypes.shape({
  main: PropTypes.shape({
    temp: PropTypes.number.isRequired,
  }).isRequired,
  weather: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
    })
  ).isRequired,
  wind: PropTypes.shape({
    speed: PropTypes.number.isRequired,
  }).isRequired,
})

const countryShape = PropTypes.shape({
  cca2: PropTypes.string.isRequired,
  name: PropTypes.shape({
    common: PropTypes.string.isRequired,
  }).isRequired,
  capital: PropTypes.arrayOf(PropTypes.string),
  area: PropTypes.number.isRequired,
  languages: PropTypes.objectOf(PropTypes.string).isRequired,
  flags: PropTypes.shape({
    png: PropTypes.string.isRequired,
  }).isRequired,
  weather: weatherShape,
})

const DisplayCountry = ({ country }) => {
  if (!country || !country.weather) return null

  const capital = country.capital?.[0] ?? ''
  const moreInfo = country.weather
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {capital}</p>
      <p>area {country.area}</p>
      <p><b>languages:</b></p>
      <ul>
        {Object.entries(country.languages).map(([id, lang]) => <li key={id}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} alt={country.name.common} />
      <h3>Weather in {capital}</h3>
      <p>temperature {(moreInfo.main.temp - 273.15).toFixed(2)} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${moreInfo.weather[0].icon}@2x.png`} alt='icon' />
      <p>wind {moreInfo.wind.speed} m/s</p>
    </div>
  )
}

const Display = ({ foundList, setCountry, setClick }) => {
  const len = foundList.length

  if (len === 0) {
    return <p>No country found</p>
  } else if (len === 1) {
    return null
  } else if (len >= 10) {
    return <p>Too many matches, specify another filter</p>
  }

  return foundList.map(c => (
    <p key={c.cca2}>
      {c.name.common}
      <button
        type='button'
        onClick={() => {
          setCountry(c)
          setClick(true)
        }}
      >
        show
      </button>
    </p>
  ))
}

DisplayCountry.propTypes = {
  country: countryShape,
}

Display.propTypes = {
  foundList: PropTypes.arrayOf(countryShape).isRequired,
  setCountry: PropTypes.func.isRequired,
  setClick: PropTypes.func.isRequired,
}

export { Display, DisplayCountry }
