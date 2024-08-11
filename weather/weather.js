document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.querySelector('.cinput'),
        search = document.querySelector('.search'),
        location = document.querySelector('.location'),
        api_key = '68af705b273a66dec80c35f6987aae95',
        currentWeatherCard = document.querySelector('.weather-left .card'),
        sunriseCard = document.querySelectorAll('.highlights .card')[1],
        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        monthsValue = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        aqiCardValue = document.querySelectorAll('.highlights .card')[0],
        humidityValue = document.querySelector('.humidity'),
        pressureValue = document.querySelector('.pressure'),
        visibilityValue = document.querySelector('.visibility'),
        windspeedValue = document.querySelector('.windspeed'),
        feelsLikeValue = document.querySelector('.feels-like'),
        hourlyForecastCard = document.querySelector('.hourly-forecast'),
        aqilist = ['good', 'fair', 'moderate', 'poor', 'very poor'];

    function getWeatherDetails(name, lat, lon, country, state) {
        const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`,
            WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`,
            AIR_POLLUTION_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

        fetch(AIR_POLLUTION_URL)
            .then(res => res.json())
            .then(data => {
                const { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
                aqiCardValue.innerHTML = `
                    <div class="card-head">
                        <p>Air quality index</p>
                        <p class="air-index aqi-${data.list[0].main.aqi}">${aqilist[data.list[0].main.aqi - 1]}</p>
                    </div>
                    <i class="bx bx-wind" style="font-size: 3em;"></i>
                    <div class="air-indices">
                        <div class="item">
                            <p>PM2.5</p>
                            <h2>${pm2_5}</h2>
                        </div>
                        <div class="item">
                            <p>PM10</p>
                            <h2>${pm10}</h2>
                        </div>
                        <div class="item">
                            <p>SO2</p>
                            <h2>${so2}</h2>
                        </div>
                        <div class="item">
                            <p>CO</p>
                            <h2>${co}</h2>
                        </div>
                        <div class="item">
                            <p>NO</p>
                            <h2>${no}</h2>
                        </div>
                        <div class="item">
                            <p>O3</p>
                            <h2>${o3}</h2>
                        </div>
                    </div>
                `;
            })
            .catch(() => {
                alert('Failed to fetch air quality index');
            });

        fetch(WEATHER_API_URL)
            .then(res => res.json())
            .then(data => {
                const date = new Date();
                currentWeatherCard.innerHTML = `
                    <div class="current-weather">
                        <div class="details">
                            <p>Now</p>
                            <h2>${data.main.temp.toFixed(1)}&deg;C</h2>
                            <p>${data.weather[0].description}</p>
                        </div>
                        <img class="weather-icon" src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather">
                    </div>
                    <hr>
                    <div class="card-footer">
                        <p><i class="bx bx-calendar"></i> ${days[date.getDay()]}, ${date.getDate()} ${monthsValue[date.getMonth()]} ${date.getFullYear()}</p>
                        <p><i class="bx bx-map"></i> ${name}, ${country}</p>
                    </div>
                `;

                const { sunrise, sunset } = data.sys,
                    { timezone, visibility } = data,
                    { humidity, pressure, temp, feels_like } = data.main,
                    { speed } = data.wind;

                const sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A'),
                    sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');

                sunriseCard.innerHTML = `
                    <div class="card-head">
                        <p>Sunrise & Sunset</p>
                    </div>
                    <div class="sunrise-sunset">
                        <div class="item">
                            <img src="sunrise.png" class="weather-icon2" alt="sunrise">
                            <div>
                                <p>Sunrise</p>
                                <h2>${sRiseTime}</h2>
                            </div>
                        </div>
                        <div class="item">
                            <img src="sunset.png" class="weather-icon2" alt="sunset">
                            <div>
                                <p>Sunset</p>
                                <h2>${sSetTime}</h2>
                            </div>
                        </div>
                    </div>
                `;
                humidityValue.innerText = `${humidity}%`;
                pressureValue.innerText = `${pressure} hPa`;
                visibilityValue.innerText = `${(visibility / 1000).toFixed(1)} km`;
                windspeedValue.innerText = `${speed} m/s`;
                feelsLikeValue.innerText = `${feels_like.toFixed(1)}°C`;
            })
            .catch(() => {
                alert('Failed to fetch current weather');
            });

        fetch(FORECAST_API_URL)
            .then(res => res.json())
            .then(data => {
                const hourlyForecast = data.list;
                hourlyForecastCard.innerHTML = '';
                for (let i = 0; i < Math.min(8, hourlyForecast.length); i++) { // Limit to 8 items
                    const hrForecast = hourlyForecast[i];
                    const hrForecastDate = new Date(hrForecast.dt * 1000);
                    let hr = hrForecastDate.getHours();
                    const period = hr < 12 ? 'AM' : 'PM';
                    hr = hr % 12 || 12; // Convert to 12-hour format
                    const iconUrl = `http://openweathermap.org/img/wn/${hrForecast.weather[0].icon}@2x.png`;
                    hourlyForecastCard.innerHTML += `
                        <div class="card">
                            <p>${hr}${period}</p>
                            <img src="${iconUrl}" class="weather-icon1" alt="${hrForecast.weather[0].description}">
                            <p class="hourly-temp">${hrForecast.main.temp.toFixed(1)}&deg;C</p>
                        </div>
                    `;
                }

                const forecastContainer = document.querySelector('.day-forecast');
                forecastContainer.innerHTML = '';
                const forecastByDate = hourlyForecast.reduce((acc, forecast) => {
                    const date = moment.utc(forecast.dt, 'X').add(data.city.timezone, 'seconds').format('YYYY-MM-DD');
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(forecast);
                    return acc;
                }, {});

                Object.entries(forecastByDate).forEach(([date, forecasts]) => {
                    const dailyTemps = forecasts.map(forecast => forecast.main.temp);
                    const minTemp = Math.min(...dailyTemps);
                    const maxTemp = Math.max(...dailyTemps);
                    const dayName = moment(date).format('dddd');
                    const weatherIcon = forecasts[0].weather[0].icon;
                    forecastContainer.innerHTML += `
                        <div class="fore-item">
                            <p class="day">${dayName}</p>
                            <img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" class="weather-icon1" alt="${forecasts[0].weather[0].description}">
                            <p class="temp">${minTemp.toFixed(1)}&deg;C / ${maxTemp.toFixed(1)}&deg;C</p>
                        </div>
                    `;
                });
            })
            .catch(() => {
                alert('Failed to fetch weather forecast');
            });
    }

    search.addEventListener('click', () => {
        const cityValue = cityInput.value.trim();
        if (cityValue) {
            const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityValue}&appid=${api_key}`;
            fetch(API_URL)
                .then(res => res.json())
                .then(data => {
                    if (data.length) {
                        const { name, lat, lon, country, state } = data[0];
                        getWeatherDetails(name, lat, lon, country, state);
                    } else {
                        alert('City not found!');
                    }
                })
                .catch(() => {
                    alert('Failed to fetch city coordinates');
                });
        }
    });

    location.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${api_key}`;
                fetch(API_URL)
                    .then(res => res.json())
                    .then(data => {
                        if (data.length) {
                            const { name, lat, lon, country, state } = data[0];
                            getWeatherDetails(name, lat, lon, country, state);
                        } else {
                            alert('Failed to get location details.');
                        }
                    })
                    .catch(() => {
                        alert('Failed to fetch location coordinates');
                    });
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });
});
