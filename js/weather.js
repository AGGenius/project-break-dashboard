import { weatherStation, setBackground, navFeedback} from '../js/functions.js';

const mainDisplay = document.querySelector('main');

setBackground();
navFeedback();
weatherStationSearch(mainDisplay);

function weatherStationSearch(domElement) {
    const storedWeather = document.createElement('section');
    const input = document.createElement('input');
    const resultBox = document.createElement('div');

    storedWeather.className = 'search__cards';
    input.className = 'search__input';
    resultBox.className = 'search__result';

    input.type = 'text';
    input.placeholder = 'Search for a city.';

    const baseDom = domElement;

    renderSearch(baseDom);
    setListener(baseDom);
    setLocalstorage();

    function setLocalstorage () {

        if(localStorage.getItem('storedWeather') === null) {
            localStorage.setItem('storedWeather', JSON.stringify([]));
        } else {

            const archived = JSON.parse(localStorage.getItem('storedWeather'));
            
            if(archived) {
                archived.forEach(element => {
                    setStoredCard(element);
                    weatherStation(baseDom, element);
                })
            }
        }

        if(localStorage.getItem('storedCountry') === null) {
            localStorage.setItem('storedCountry', JSON.stringify(''));
        } else {    
            const countryCardArr = document.querySelectorAll('.weather__country__card');

            let archived = JSON.parse(localStorage.getItem('storedCountry')); 
            
            countryCardArr.forEach(element => {
                if (element.textContent === archived) {
                    element.classList.toggle('selected');
                }
            })
        }
    }

    function renderSearch(dom){
        dom.append(storedWeather, input, resultBox);
    
        input.addEventListener('input', event => {
            const value = input.value;
    
            if(value.length > 2) { 
                resultBox.style.display = 'flex';
                getWeatherData(value);
            }
        })
    }
    
    // To get the data from the api.
    function getWeatherData(searchVal) {
        const key = '6eaad4d899a24149a05110251240304';
        const searchValue = searchVal;
        const link = `https://api.weatherapi.com/v1/search.json?key=${key}&q=${searchValue}`;

        fetch(link)
        .then((response) => {
            if(!response.ok) {  console.log("Error: " + response.status);  }
            else {  return response.json(); }
        })
        .then((data) => {   renderLocationsData(getLocations(data));    })
        .catch((error) => { console.log('Error: '+ error);  })
    } 

    function getLocations(data) {
        const locationsArr = [];

        data.forEach(element => {

            const location = {
                city: '',
                country: ''
            }

            location.city = element.name;
            location.country = element.country;

            locationsArr.push(location);
        });

        return locationsArr;
    }


    // Renders the data on the DOM.
    function renderLocationsData(values) {
        resultBox.innerHTML = '';
        values.forEach(element => {
            const country = document.createElement('p');
            country.className = 'country__result';
            country.value = element.city + '-' + element.country;
            country.textContent = element.city + ' from ' + element.country;

            resultBox.append(country);
        });
    }

    // Sets the cards to delete a weather card or select one to display on index page.
    function setStoredCard(value) {
        const card = document.createElement('article');
        const delButton = document.createElement('img');

        card.className = 'weather__country__card';
        card.textContent = value;
        delButton.value = value;

        card.append(delButton);
        storedWeather.append(card);
    }

    function setListener(value) {
        // Listener to select a country weather to show.
        resultBox.addEventListener('click', event => {   
            const searchCountry = event.target.closest('p');

            //Local storage.                   
            let archived = JSON.parse(localStorage.getItem('storedWeather'));
    
            // Dosen't execute this if detects nothing or if has that city-country.
            if (!searchCountry || archived.includes(searchCountry.value)) return;

            archived.push(searchCountry.value);
            localStorage.setItem('storedWeather', JSON.stringify(archived)); 
                
            weatherStation(value, searchCountry.value);
            setStoredCard(searchCountry.value);
                
            //restart search values.
            resultBox.style.display = 'none';
            resultBox.innerHTML = '';
            input.value = '';
        });

        // Remove a weather card and display.
        value.addEventListener('click', event => {           
            const targetCountry = event.target.closest('img');
            const countryCardArr = document.querySelectorAll('.weather__country__card');
    
            if (!targetCountry) return;

            //Local storage for saved countries. Gets the value, filters, and saves the new.              
            let archivedCountrieCards = JSON.parse(localStorage.getItem('storedWeather'));
            archivedCountrieCards = archivedCountrieCards.filter((val) => val !== targetCountry.value);
            localStorage.setItem('storedWeather', JSON.stringify(archivedCountrieCards));   
            
            //Local storage for selected country. 
            let archivedCountry = JSON.parse(localStorage.getItem('storedCountry')); 

            value.innerHTML = '';

            renderSearch(baseDom);

            storedWeather.innerHTML = '';

            countryCardArr.forEach(element => {
                if (element.textContent === archivedCountry) {        
                    element.classList.remove('selected');
                    localStorage.setItem('storedCountry', JSON.stringify(''));
                }
            })

            archivedCountrieCards.forEach(element => {
                setStoredCard(element);
                weatherStation(value, element);
            })
        });

        // Show a country weather in main page.
        value.addEventListener('click', event => {         
            const countryCard = event.target.closest('.weather__country__card');
            const targetCountry = event.target.closest('img');

            if (!countryCard || targetCountry) return;

            const countryCardArr = document.querySelectorAll('.weather__country__card');

            countryCardArr.forEach(element => {
                element.classList.remove('selected');
            })

            let archived = JSON.parse(localStorage.getItem('storedCountry')); 

            if(countryCard.textContent === archived) {
                localStorage.setItem('storedCountry', JSON.stringify(''));
            } else {
                localStorage.setItem('storedCountry', JSON.stringify(countryCard.textContent));
                countryCard.classList.toggle('selected');  
            }
        });
    }
}

