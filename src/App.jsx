import { useState } from "react";
import axios from 'axios'
const App = () => {

  const [location, setLocation] = useState('')
  const [da, setData] = useState({})

  async function searchLocation(e) {

    if (e.key === 'Enter') {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=19b15efc74b01eb7cc0574d85791c65c`)

      console.log(res.data)
      setData(res.data)

    }

  }


  return (
    <>
      <div className="app">
        <div className="search">
          <input
            value={location}
            onChange={e => setLocation(e.target.value)}
            onKeyDown={searchLocation}

            placeholder='Enter Location'
            type="text" />
        </div>
        <div className="container">

          <div className="top">
            <div>
              <div className="location">
                {da.name && <p>{da.name}</p>}

              </div>
              <div className="temp">
                {da.main && <h1>{da.main.temp.toFixed()} <small><sup>&deg;C</sup></small></h1>}
              </div>
            </div>
            <div className="description">
              {da.weather && <p>{da.weather[0].description}</p>}
            </div>
          </div>

          <div className="bottom">
            <div className="feels">
              {da.main && <p>{da.main.feels_like.toFixed()} <small><sup>&deg;C</sup></small></p>}

              <p>Feels</p>
            </div>
            <div className="humidity">
              {da.main && <p>{da.main.humidity}</p>}

              <p>Humidity</p>
            </div>
            <div className="wind">
              {da.wind && <p >{da.wind.speed} KPH</p>}

              <p>Wind</p>
            </div>

          </div>

        </div>

      </div>
    </>
  )
}

export default App;