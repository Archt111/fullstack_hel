const DisplayCountry = ({country}) => {
  if (!country || !country.weather) return null

  console.log('inside display, check legal country: ',country)
  const moreinfo = country.weather
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p></p>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <p></p>
      <p><b>languages:</b></p>
      <ul>
        {Object.entries(country.languages).map(([id, lang]) => <li key={id}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} alt={country.name.common}/>

      <p></p>
      <h3>Weather in {country.capital}</h3>
      <p></p>
      <p>temperature {(moreinfo.main.temp - 273.15).toFixed(2)} Celcius</p>
      <img src={`https://openweathermap.org/img/wn/${moreinfo.weather[0].icon}@2x.png`} alt="icon"/>
      <p>wind {moreinfo.wind.speed} m/s</p>
    </div>)
}
const Display = ({foundList, setCountry, setClick}) => {
  console.log('display ip: ', foundList)
  const len = foundList.length

  if (len === 0) {
    return <p>No country found</p>
  } else if (len === 1) {
    return null
  } else if (len >= 10) {
    return <p>Too many matches, specify another filter</p>}
    return (foundList.map(c => <p key={c.cca2}>{c.name.common}
                                  <button type='button' onClick={()=> {
                                    setCountry(c)
                                    setClick(true)
                                  }}>show</button>
                               </p>))
  }

export {Display,DisplayCountry}