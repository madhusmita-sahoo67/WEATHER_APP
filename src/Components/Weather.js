import React, { useState, useEffect } from 'react';
import './Weather.css';
import { FaSearch, FaWind, FaTrashAlt } from "react-icons/fa";
import { MdLocationOn } from 'react-icons/md';
import { WiHumidity } from 'react-icons/wi';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [favorites, setFavorites] = useState([]);

    const API_KEY = "96a8fb074d2d99a21f18af6758c6febf";

    const fetchData = async (url) => {
        try {
            let response = await fetch(url);
            let output = await response.json();
            if (response.ok) {
                return output;
            } else {
                setError('No data found. Please enter a valid location name.');
            }
        } catch (error) {
            console.error("Error fetching the weather data:", error);
            setError('An error occurred while fetching the data.');
        }
    };

    const handleOnChange = (event) => {
        setCity(event.target.value);
    };

    const handleSearch = async () => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
        const data = await fetchData(url);
        if (data) {
            setWeather(data);
            setError('');
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    const handleAddFavorite = async () => {
        if (weather && weather.name && !favorites.some(fav => fav.name === weather.name)) {
            setFavorites([...favorites, weather]);
        }
    };

    const handleDeleteFavorite = (index) => {
        const updatedFavorites = favorites.filter((_, favIndex) => favIndex !== index);
        setFavorites(updatedFavorites);
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
                const data = await fetchData(url);
                if (data) {
                    setWeather(data);
                    setError('');
                }
            }, (error) => {
                setError('Unable to retrieve your location. Please enable location services and try again.');
            });
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    }, []); 

    return (
        <div className={`weather-app ${darkMode ? 'dark-mode' : ''}`}>
            <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
                <div className='city'>
                    <input 
                        type='text' 
                        value={city} 
                        onChange={handleOnChange} 
                        placeholder='Enter any location name'
                        className={darkMode ? 'dark-mode' : ''}
                    />
                    <button onClick={handleSearch} className={darkMode ? 'dark-mode' : ''}>
                        <FaSearch />
                    </button>
                    <button onClick={toggleDarkMode} className={`dark-mode-toggle ${darkMode ? 'dark-mode' : ''}`}>
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                </div>

                {error && <p className={`error-message ${darkMode ? 'dark-mode' : ''}`}>{error}</p>}

                {weather && weather.weather &&
                    <div className='content'>
                        <div className={`weather-image ${darkMode ? 'dark-mode' : ''}`}>
                            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt='' />
                            <h3 className='desc'>{weather.weather[0].description}</h3>
                        </div>

                        <div className={`weather-temp ${darkMode ? 'dark-mode' : ''}`}>
                            <h2>{weather.main.temp}<span>&deg;C</span></h2>
                        </div>

                        <div className={`weather-city ${darkMode ? 'dark-mode' : ''}`}>
                            <div className='location'>
                                <MdLocationOn />
                            </div>
                            <p>{weather.name},<span>{weather.sys.country}</span></p>
                        </div>

                        <div className='weather-stats'>
                            <div className={`wind ${darkMode ? 'dark-mode' : ''}`}>
                                <div className='wind-icon'>
                                    <FaWind />
                                </div>
                                <h3 className='wind-speed'>{weather.wind.speed}<span>Km/h</span></h3>
                                <h3 className='wind-heading'>Wind Speed</h3>
                            </div>
                            <div className={`humidity ${darkMode ? 'dark-mode' : ''}`}>
                                <div className='humidity-icon'>
                                    <WiHumidity />
                                </div>
                                <h3 className='humidity-percent'>{weather.main.humidity}<span>%</span></h3>
                                <h3 className='humidity-heading'>Humidity</h3>
                            </div>
                        </div>

                        <button onClick={handleAddFavorite} className={`favorite-button ${darkMode ? 'dark-mode' : ''}`}>
                            Add Favorite
                        </button>
                    </div>
                }
            </div>

            <div className={`favorite-list-container ${darkMode ? 'dark-mode' : ''}`}>
                <h3 className={`favorite-list-title ${darkMode ? 'dark-mode' : ''}`}>Favorite Locations:</h3>
                {favorites.length > 0 && (
                    <ul className={`favorites ${darkMode ? 'dark-mode' : ''}`}>
                        {favorites.map((favorite, index) => (
                            <li key={index} className="favorite-item">
                                <div className="weather-info">
                                    <p>{favorite.name}</p>
                                    <img src={`https://openweathermap.org/img/wn/${favorite.weather[0].icon}@2x.png`} alt="" />
                                    <div>
                                        <span className="temp">{favorite.main.temp}°C</span>
                                        <span className="desc">  {favorite.weather[0].description}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDeleteFavorite(index)} 
                                    className="delete-favorite-button"
                                >
                                    <FaTrashAlt />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Weather;
