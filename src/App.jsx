
import { useState, useEffect } from "react";
import axios from "axios";
import village from '../src/assets/village-2090495_1920.jpg'
import nature from '../src/assets/nature-1959229_1920.jpg'
import pexels from '../src/assets/pexels-jplenio-3473659.jpg'
import sunrise from '../src/assets/sunrise-1959227_1920.jpg'


const App = () => {
  const [location, setLocation] = useState(""); 
  const [data, setData] = useState({});
  const [error, setError] = useState(null); 
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

const backgroundImages = [
  village,
  nature,
  pexels,
  sunrise,
  village
];
  const getRandomBackground = () => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    return backgroundImages[randomIndex];
  };

  useEffect(() => {
    const randomBackground = getRandomBackground(); 
    console.log(randomBackground);
    document.documentElement.style.setProperty('--random-bg', `url(${randomBackground})`);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoordinates(latitude, longitude);
        },
        (err) => {
          setError("Could not retrieve location. Please try to search your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchWeatherByCoordinates = async (lat, lon) => {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=19b15efc74b01eb7cc0574d85791c65c`
    );
    setData(res.data);
    setError(null);
    setSuggestions([]);
  };

  const handleInputChange = async (e) => {
    const userInput = e.target.value;
    setLocation(userInput);

    if (userInput.length > 2) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${userInput}&type=like&units=metric&appid=19b15efc74b01eb7cc0574d85791c65c`
        );
        setSuggestions(response.data.list);
      } catch (err) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleCitySelect(suggestions[selectedIndex]);
    }
  };

  const handleCitySelect = (city) => {
    setLocation(city.name);
    fetchWeatherByCoordinates(city.coord.lat, city.coord.lon);
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter Location"
          type="text"
        />
      </div>

      {error && !data.name && <p>{error}</p>}

      {suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((city, index) => (
            <div
              key={index}
              className={`suggestion-item ${selectedIndex === index ? "selected" : ""}`}
              onClick={() => handleCitySelect(city)}
            >
              {city.name}, {city.sys.country}
            </div>
          ))}
        </div>
      )}

      <div className="container">
        <div className="top">
          <div>
            <div className="location">{data.name && <p>{data.name}</p>}</div>
            <div className="temp">
              {data.main && (
                <h1>
                  {data.main.temp.toFixed()}{" "}
                  <small>
                    <sup>&deg;C</sup>
                  </small>
                </h1>
              )}
            </div>
          </div>
          <div className="description">
            {data.weather && <p>{data.weather[0].description}</p>}
          </div>
        </div>

        <div className="bottom">
          <div className="feels">
            {data.main && (
              <p>
                {data.main.feels_like.toFixed()}{" "}
                <small>
                  <sup>&deg;C</sup>
                </small>
              </p>
            )}
            <p>Feels</p>
          </div>
          <div className="humidity">
            {data.main && <p>{data.main.humidity}</p>}
            <p>Humidity</p>
          </div>
          <div className="wind">
            {data.wind && <p>{data.wind.speed} KPH</p>}
            <p>Wind</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;