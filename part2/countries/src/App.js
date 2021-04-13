import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({filters, handleFiltersChange}) => {
  return (
    <>
      <div>
        find countries <input value={filters} onChange={handleFiltersChange}/>
      </div>
    </>
  )
}

const Button = ({country}) => {
  const [showViews, setShowViews] = React.useState(false)
  const onClick = () => setShowViews(true)
  return (
    <>
      <button onClick={onClick}>show</button>
      {showViews ? <Views country={country}/> : null}
    </>
  )
}

const Weather = ({capital}) => {
  const [weather, setWeather] = useState({location:{}, current: {}});

  useEffect(() => {
    const api_key = process.env.REACT_APP_API_KEY
    const url = `http://api.weatherstack.com/current?access_key=${api_key}&query=${capital}`
    axios
    .get(url)
    .then(response => {
      console.log('promise fulfilled')
      setWeather(response.data)
    })
  }, [capital])

  return(
    <div>
      <h3>Weather in {weather.location.name}</h3>
      <strong>temperature: </strong>{weather.current.temperature}<br/>
      <img src = {weather.current.weather_icons} alt={`${weather.location.name}`}/><br/>
      <strong>wind: </strong>{weather.current.wind_speed} kph direction {weather.current.wind_dir}<br/><br/>
    </div>
  )
}

const Views = ({country}) => {
  return (
    <>
      <h2>{country.name}</h2>
      capital {country.capital}<br/>
      population {country.population}<br/>
      <h3>Spoken languages</h3>
      <ul>
        {country.languages.map((country, i) => <li key={i}>{country.name}</li>)}
      </ul>
      <img src={country.flag} width={100} alt={`${country.name}`}/>
      <Weather capital={country.capital}/>
    </>
  )
}

const Countries = ({filterShow}) => {
  if(filterShow.length > 10) {
    return (
      <>
        Too many matches, specify another filter
      </>
    )
  } else if (filterShow.length === 1) {
    return (
      <>
        <Views country={filterShow[0]}/>
      </>
    )
  } else {
    return (
      <>
        {filterShow.map(country => 
        <div key={country.name}>
          {country.name} {country.number}
          <Button country={country}/>
        </div>
        )}
      </>
    )
  }
}

const App = () => {
  const [ countries, setCountries ] = useState([]) 
  const [ filters, setFilters ] = useState('')
  const [ status, setStatus] = useState(false)

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFiltersChange = (event) => {
    if(countries.some(country => country.name.toLowerCase().includes(event.target.value.toLowerCase()))) {
      setStatus(true)
    } else {
      setStatus(false)
    }

    setFilters(event.target.value)
  }

  const filterShow = status ? countries.filter(country => country.name.toLowerCase().includes(filters.toLowerCase())) : countries

  return (
    <div>
      <Filter filters={filters} handleFiltersChange={handleFiltersChange}/>
      <Countries filterShow={filterShow}/>
    </div>
  )
}

export default App