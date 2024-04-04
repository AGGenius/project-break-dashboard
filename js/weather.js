const mainDisplay = document.getElementById('mainDisplay');

weatherStation();

function weatherStation() {
    const weatherData = {
        city: '',
        country: '',
        weather: '',
        img: '',
        temperature: '',
        precipitations: '',
        humidity: '',
        wind: '',
        forecast: {}
    }

    const key = '6eaad4d899a24149a05110251240304';
    const city = 'Madrid';
    const link = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&aqi=no`;

    getWeatherData(link);
    
    // To get the data from the api.
    function getWeatherData(source) {
        fetch(source)
        .then((response) => {
            if(!response.ok) {
                console.log("Error: " + response.status);
            } else {
                return response.json();
            }
        })
        .then((data) => {
            setWeatherData(data);
            renderWeatherData();
        })
        .catch((error) => {
            console.log('Error: '+ error);
        })
    } 

    // Sets the value of weather object with retrieved data.
    function setWeatherData(data) {
        weatherData.city = data.location.name; 
        weatherData.country = data.location.country;
        weatherData.weather = data.current.condition.text;
        weatherData.img = data.current.condition.icon;
        weatherData.temperature = data.current.temp_c;
        weatherData.precipitations = data.current.precip_mm;
        weatherData.humidity = data.current.humidity;
        weatherData.wind = data.current.wind_kph;
        weatherData.forecast = data.forecast.forecastday[0].hour;
    }

    // Renders the data on the DOM.
    function renderWeatherData() {
        mainDisplay.innerHTML = `
        <article>
            <p>Country: ${weatherData.country}</p>
            <p>City: ${weatherData.city}</p>
            <p>Weather: ${weatherData.weather}</p>
            <img src='${weatherData.img}'/>
            <p>Temperature: ${weatherData.temperature} ºC</p>
            <p>Precipitations: ${weatherData.precipitations} mm</p>
            <p>Humidity: ${weatherData.humidity} %</p>
            <p>Wind: ${weatherData.wind} km/h</p>
            <div class='forecast'></div>
        </article>
        `;

        const forecast = document.querySelector('.forecast');
        const forecastData = weatherData.forecast;

        // Borrar este bloque de estilo provisional antes de tocar el CSS.
        forecast.style.display = 'flex';
        forecast.style.flexDirection = 'center';
        forecast.style.alignItem = 'center';

        forecastData.forEach(element => {
            const wrap = document.createElement('div');
            const hour = document.createElement('p');
            const img = document.createElement('img');
            const temp = document.createElement('p');

            hour.textContent = element.time.slice(-5);
            img.src = element.condition.icon;
            temp.textContent = element.temp_c + ' ºC';

            wrap.append(hour, img, temp);
            forecast.appendChild(wrap);
        });
    }
}