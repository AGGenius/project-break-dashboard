// #region Clock related -->

function setClock(display) {
    const clockArticle = document.createElement('article');
    const clockDom = document.createElement('h1');
    const dateDom = document.createElement('h2');
    const phraseDom = document.createElement('h3');
    clockArticle.id = 'watch';
    clockDom.id = 'clock';
    dateDom. id = 'date';
    phraseDom.id = 'phrase';

    clockArticle.append(clockDom, dateDom, phraseDom);
    display.appendChild(clockArticle);

    getDateValues();
    setInterval(getDateValues, 1000);

    function getDateValues() {
        const date = new Date();
        
        clockDom.innerHTML = format(date.getHours()) + ":" + format(date.getMinutes()) + ":" + format(date.getSeconds());
        dateDom.innerHTML = format(date.getDate()) + "/" +  format(date.getMonth() + 1) + "/" + date.getFullYear();
        phraseDom.innerHTML = customPhrase();
        
        function customPhrase() {
            const hour = format(date.getHours());
            const minute = format(date.getMinutes());
    
            if(hour >= 0 && hour < 7) {
                return "I hope that if you are still here it's playing.";
            } else if (hour >= 7&& hour < 12) {
                return "¡It's time to start working!";
            } else if (hour >= 12&& hour < 14)  {
                return "Start thinking what you want to eat. That brain don't live from air!";
            } else if (hour >= 14 && hour < 16)  {
                return "A good rest is the best to keep going on fine.";
            } else if (hour >= 16 && hour < 18)  {
                return "A little more? Go on!";
            } else if (hour >= 18 && hour < 22)  {
                return "You know? Stoping it's a good thing too.";
            } else if (hour >= 22)  {
                return "Don't make me program an automatic shutoff! Go to sleep.";
            } else {
                return '';
            }
        }    
        
        function format(val) { return val.toString().padStart(2, '0') }
    }
}

// #endregion

// #region Links related -->

// Sets the local storage for first load of webpage.
function setLocalstorage () {
    if(localStorage.getItem('links') === null) {
        localStorage.setItem('links', JSON.stringify([]));
    } else {
        const links = JSON.parse(localStorage.getItem('links'));
        displayLinks(links);
    }
}

function setLinksUi(dom) { 
    const linkArticle = document.createElement('article');
    linkArticle.id = 'links';
    dom.appendChild(linkArticle);

    linkArticle.innerHTML = `
        <label for="linkName" class="link__text">Give a tittle for your link.</label>
        <input id="linkName" type="text" placeholder="tittle">
        <label for="linkValue" class="link__text">Give a link to store.</label>
        <input id="linkValue" type="text" placeholder="http://">
        <button id="addLinkButton">Add link</button>

        <p id="linkWarning" class="link__text"></p>
        <div id="mainDisplay"></div>
    `;

    setLocalstorage ();
    getLink();  
    delListener();
}

// Get the values from the imputs and stores them in an object that will be stored on localStorage.
// Validates for empty fields, already stored links and valid links.
function getLink() {
    const linkTittle = document.getElementById('linkName');
    const linkValue = document.getElementById('linkValue');
    const linkButton = document.getElementById('addLinkButton');
    const linkWarning = document.getElementById('linkWarning');

    const link = {
        tittle: '',
        value: '',
    }

    linkTittle.addEventListener('keydown', getValues);
    linkValue.addEventListener('keydown', getValues);
    linkButton.addEventListener('click', getValues);

    function getValues(input) {
        if(input.key === 'Enter' || input.type === 'click') {
            link.tittle = linkTittle.value;
            link.value = linkValue.value;
            let links = JSON.parse(localStorage.getItem('links'));

            // This checks if is a valid URL. If it is, in continues, and if not, outputs an error and
            // exits the funcion at all.
            try { 
                new URL(link.value);
            } catch (error) {
                linkWarning.textContent = 'Not a valid link.'
                return false;
            }
            
            if (links.find((element) => element.value === link.value)) {
                linkWarning.textContent = 'You have stored this link already!';
            } else if (!link.tittle || !link.value) {
                linkWarning.textContent = 'You left empty some input.';
            } else if (link.tittle && link.value) {     
                links.push(link);
                displayLinks(links);
                localStorage.setItem('links', JSON.stringify(links));       
                linkWarning.textContent = '';
            } 

            linkTittle.value = '';
            linkValue.value = '';
        }
    }
}

// Refresh the display and then renders each link in the array that is passed has value.
function displayLinks(links) {
    const mainDisplay = document.getElementById('mainDisplay');

    mainDisplay.innerHTML = '';

    links.forEach(link => {
        const linkCard = document.createElement('article');
        const linkTittle = document.createElement('h3');
        const linkValue = document.createElement('a');
        const linkDelButton = document.createElement('img');

        linkCard.className = 'linkCard';
        linkDelButton.className = 'linkCard__delButton';
    
        linkTittle.textContent = cutText(link.tittle);
        linkTittle.title = link.tittle;

        linkValue.textContent = cutText(link.value);
        linkValue.href = link.value;
        linkValue.title = link.value;
        linkValue.target = '_blank';
        linkValue.className = 'linkCard__link'

        linkDelButton.value = link.value;
    
        linkCard.append(linkTittle, linkValue, linkDelButton);
        mainDisplay.appendChild(linkCard);
    });

    function cutText(text) {
        if(text.includes('https')) {
            text = text.slice(8);
        } else if(text.includes('http')) {
            text = text.slice(7);
        } 

        return text.length > 20 ?  text.slice(0, 12) + '...' : text;
    }
}

// Function to add a listener to the main dom to look for the del button on each card.
// Gets the values from local storage to find the element to remove and then filter it with no
// coincident values. Saves the new array on localstorage and renews the display.
function delListener() {
    mainDisplay.addEventListener('click', event => {
        let links = JSON.parse(localStorage.getItem('links'));

        const linkCard = event.target.closest('img');

        if(!linkCard) return;

        const linkToRemove = links.find((element) => element.value === linkCard.value);
        links = links.filter((val) => val !== linkToRemove);
        
        displayLinks(links);

        localStorage.setItem('links', JSON.stringify(links));

        event.stopPropagation();
    })
}

// #endregion

// #region Password Related -->

// Gets the DOM values. Checks for a valid input, and calls the function to generate a password if it really is. If not, displays a message on the webpage.
function setInput(domWrap) {
    const passwordArticle = document.createElement('article');
    passwordArticle.id = 'password';
    domWrap.appendChild(passwordArticle);

    const passworTittle = document.createElement('h1');
    const passwordInput = document.createElement('input');
    const passwordInputButton = document.createElement('button');
    const passwordInputLabel = document.createElement('label');

    passworTittle.classList = 'password__tittle'
    passworTittle.innerText = 'Generate a secure password';

    passwordInput.id = 'passInput';
    passwordInput.name = 'passInput';
    passwordInput.type = 'number';
    passwordInput.min = '12';
    passwordInput.max = '50';
    passwordInput.value = '12';

    passwordInputButton.id = 'passInputButton';
    passwordInputButton.textContent = 'Generate Password';

    passwordInputLabel.for = 'passInput';
    passwordInputLabel.id =  'passInputLabel';
    passwordInputLabel.textContent = '';

    passwordArticle.append(passworTittle, passwordInput, passwordInputButton, passwordInputLabel);

    passwordInput.addEventListener('keydown', enterPress);
    passwordInputButton.addEventListener('click', callGenerator);

    function enterPress(input) {
        if(input.key === 'Enter') { callGenerator();    }
    }

    function callGenerator() {
        const pureValue = passwordInput.value;
        let password;
        let value = pureValue * 1;

        if (pureValue.length > 2) {
            passwordInputLabel.textContent = `Input value longer than two digits. Input a number between 12 and 50.`;
        } else if(typeof value === 'number' && !Number.isNaN(value) && (value >= 12 && value <= 50)) {
            password = setPassword(value);
            passwordInputLabel.textContent = `${password}`;
        } else {
            passwordInputLabel.textContent = `"${pureValue}" is not a valid. Input a number between 12 and 50.`;
        }

        passwordInputLabel.addEventListener('click', event => {
            navigator.clipboard.writeText(password);
        })

        passwordInput.value = 12;
    }
}

// Base password characters.
function passwordValues() {
    const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    const uppercases = [];
    const numbers = ['0','1','2','3','4','5','6','7','8','9',];
    const symbols = ['!','@','#','$','%','^','&','*','(',')','-','_','=','+'];
    let chars = [];

    letters.forEach(letter => uppercases.push(letter.toUpperCase()) )

    return chars = [letters, uppercases, numbers, symbols];
}

function setPassword(long) {
    const chars = passwordValues();

    let password = [];

    for(let i = 0; i < long; i++) {
        const randArr = Math.floor(Math.random() * chars.length);
        password.push(chars[randArr][Math.floor(Math.random() * chars[randArr].length)]);
    }

    charCheck();
    password = password.join('');
    return password;

    // This function checks the password to look if in includes at least one of each type of character, if not, includes one.
    // The if it detects any character from the give array, and if it's true, increments the internal counter, changes the check value
    // to true and exits the current array check.
    // If detects no coincidence in the array, it gives a random charactar from that array to a random position.
    // Lastly checks if cont is less than the number of arrays to check. If so, call recursively the check function.
    // Once called recursively, the curren pasword has been already changed, so it can be it checks true alrready.
    // If not, changes any position for a character of the array that isn't present already.
    function charCheck() {
        let chars = passwordValues();
        let cont = 0;

        chars.forEach(arr => {
            let check = false;

            arr.forEach((char, index) => {
                if(password.includes(char)) { 
                    check = true;
                    cont++;
                    arr.length = index + 1;
                }
            });           
    
            if(!check) {
                const changePosition = Math.floor(Math.random() * password.length);
                const toChange = password[changePosition];

                const changeValue = arr[Math.floor(Math.random() * arr.length)];
                password.splice(password.indexOf(toChange), 1, changeValue);
            }
        });

        if(cont < chars.length) { charCheck(); };
    }   
}

// An automatic test function to check if the password really includes all in the end.
function passwordTest(x) {
    let ok = 0;
    let fail = 0;
    let failArr = [];

    for(let i = 0; i < x; i++) {
        const failElement = {
            test: 0,
            pass: '',
            long: 0,
        };

        let chars = passwordValues();
        const passLong = Math.floor(Math.random() * (51 - 12) + 12);
        const password = setPassword(passLong);
        let cont = 0;

        chars.forEach(arr => {
            arr.forEach((char, index) => {   
                if(password.includes(char)) {
                    cont++;
                    arr.length = index + 1; //Like a break. Exits once finds first ok. If used had to restart the chars array.
                } 
            });
        }) 

        if(cont === 4) {
            ok++;
        } else {
            fail++;
            failElement.test = i;
            failElement.pass = password;
            failElement.long = password.length;
            failArr.push(failElement);
        }
    }

    console.log('ok:',ok,'fail:',fail, failArr);
}

// #endregion

// #region Weather related --> 

function weatherStation(display, searchedCity) {
    const weatherArticle = document.createElement('article');
    weatherArticle.id = 'weather';
    display.appendChild(weatherArticle);

    let city;
    const key = '6eaad4d899a24149a05110251240304';
    searchedCity ? city = searchedCity : city = 'Madrid';
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
            renderWeatherData(setWeatherData(data));
        })
        .catch((error) => {
            console.log('Error: '+ error);
        })
    } 

    // Sets the value of weather object with retrieved data.
    function setWeatherData(data) {
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

        weatherData.city = data.location.name; 
        weatherData.country = data.location.country;
        weatherData.weather = data.current.condition.text;
        weatherData.img = data.current.condition.icon;
        weatherData.temperature = data.current.temp_c;
        weatherData.precipitations = data.current.precip_mm;
        weatherData.humidity = data.current.humidity;
        weatherData.wind = data.current.wind_kph;
        weatherData.forecast = data.forecast.forecastday[0].hour;

        return weatherData; 
    }


    // Renders the data on the DOM.
    function renderWeatherData(values) {

        const forecast = document.querySelectorAll('.forecast');

        weatherArticle.innerHTML = `
            <div class="weather__wrap">
                <section class="weather__location"> 
                    <p><span>Country:</span> ${values.country}</p>
                    <p><span>City:</span> ${values.city}</p>
                </section>
                <section class="weather__climate">
                    <p><span>Weather:</span> ${values.weather}</p>
                    <img src='${values.img}'/>
                    <p><span>Temperature:</span> ${values.temperature} ºC</p>
                </section>
                <section class="weather__info">
                    <p><span>Precipitations:</span> ${values.precipitations} mm</p>
                    <p><span>Humidity:</span> ${values.humidity} %</p>
                    <p><span>Wind:</span> ${values.wind} km/h</p>
                </section>
            </div>
            <section id='forecast${forecast.length}' class='forecast''></section>
        `;

        const validForecastData = document.getElementById(`forecast${forecast.length}`)
        const forecastData = values.forecast;

        validForecastData.addEventListener('wheel', event => {
            validForecastData.scrollLeft += event.deltaY;
        }, {passive: true})

        forecastData.forEach(element => {
            const wrap = document.createElement('article');
            wrap.className = 'forecast__card';
            const hour = document.createElement('p');
            const img = document.createElement('img');
            const temp = document.createElement('p');

            hour.textContent = element.time.slice(-5);
            img.src = element.condition.icon;
            temp.textContent = element.temp_c + ' ºC';

            wrap.append(hour, img, temp);
            validForecastData.appendChild(wrap);
        });
    }
}

// To check for a search value and display the ones the user select. Can select a favourite to display on main page and remove them.
function weatherStationSearch(domElement) {
    const storedWeather = document.createElement('section');
    const input = document.createElement('input');
    const resultBox = document.createElement('div');

    const baseDom = domElement;

    renderSearch(baseDom);
    setListener(baseDom);
    setLocalstorage();

    // Sets local storage for first load and changes the webpage once it retrieves values.
    function setLocalstorage () {

        // To search for previously saved locations. Loads the stored cards and weather reports.
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

        // To search if had a selected country. Sets the card as selected if it's true.
        if(localStorage.getItem('storedCountry') === null) {
            localStorage.setItem('storedCountry', JSON.stringify(''));
        } else {    
            const countryCardArr = document.querySelectorAll('.weather__country__card');

            let archived = JSON.parse(localStorage.getItem('storedCountry')); 

            countryCardArr.forEach(element => {
                if (element.textContent === archived) element.classList.toggle('selected');
            })
        }
    }

    // Renders the base elements and the search button. 
    // Ads the listener to the search input that will output search values over two characters long.
    // The api doesn't return any value shorter than that and we reduce requests to the api.
    function renderSearch(dom){
        storedWeather.className = 'search__cards';
        input.className = 'search__input';
        resultBox.className = 'search__result';
    
        input.type = 'text';
        input.placeholder = 'Search for a city.';

        dom.append(storedWeather, input, resultBox);
    
        input.addEventListener('input', event => {
            const value = input.value;
    
            if(value.length > 2) { 
                resultBox.style.display = 'flex';
                getWeatherData(value);
            }
        })
    }
    
    // To get the data from the api with the values from the search bar.
    // Once we have a valid response we call for the render function on values to display, with the values asigned on
    // "getLocations" with the api data.
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

    // The function returns an array of objects with the values of city and country given by the api.
    // This values are feeded to "renderLocationsData".
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


    // Renders the data on the DOM with the values returned from "getLocations". Refresh the content on each call of function.
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
    // Asigns value to DOM elements to ease further search of values to compare.
    function setStoredCard(value) {
        const card = document.createElement('article');
        const delButton = document.createElement('img');

        card.className = 'weather__country__card';
        card.textContent = value;

        delButton.value = value;

        card.append(delButton);
        storedWeather.append(card);
    }

    // To set the various listener needed.
    function setListener(domElement) {
        // Listener to select a country weather to add on the display.
        resultBox.addEventListener('click', event => {   
            const searchCountry = event.target.closest('p');

            let archived = JSON.parse(localStorage.getItem('storedWeather'));
    
            // Doesn't execute this if detects nothing or if has that city-country.
            if (!searchCountry || archived.includes(searchCountry.value)) return;

            archived.push(searchCountry.value);
            localStorage.setItem('storedWeather', JSON.stringify(archived)); 
                
            weatherStation(domElement, searchCountry.value);
            setStoredCard(searchCountry.value);
                
            //restart search values.
            resultBox.style.display = 'none';
            resultBox.innerHTML = '';
            input.value = '';
        });

        // Remove a weather card and his display on the webpage. Removes it from localStorage, both the general list
        // and the selected card to show on main.
        domElement.addEventListener('click', event => {           
            const targetCountry = event.target.closest('img');
            const countryCardArr = document.querySelectorAll('.weather__country__card');
    
            if (!targetCountry) return;

            //Local storage for saved countries. Gets the value, filters, and saves the new.              
            let archivedCountrieCards = JSON.parse(localStorage.getItem('storedWeather'));
            archivedCountrieCards = archivedCountrieCards.filter((val) => val !== targetCountry.value);
            localStorage.setItem('storedWeather', JSON.stringify(archivedCountrieCards));   
            
            //Local storage for selected country. 
            let archivedCountry = JSON.parse(localStorage.getItem('storedCountry')); 

            domElement.innerHTML = '';

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
                weatherStation(domElement, element);
            })
        });

        // To show a selected country of the already selected values. This will be displayed on main webpage.
        domElement.addEventListener('click', event => {         
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

// #endregion

// #region Background related --> 

function setAutors() {
    const basePath = '../resources/background/';

    const autors = [
        {
            source: 'alphacoders',
            autor: 'Andrea Pipar',
            img: basePath + 'alphacoders_Andrea-Piparo.jpg',
            externalLink: 'https://www.artstation.com/andreapiparo'
        }, 
        {
            source: 'alphacoders',
            autor: 'Arvalis',
            img: basePath + 'alphacoders_arvalis.jpg',
            externalLink: 'https://www.deviantart.com/arvalis/subscriptions?tier=82-890597716'
        }, 
        {
            source: 'alphacoders',
            autor: 'Duong ct',
            img: basePath + 'alphacoders_Duong-ct.jpg',
            externalLink: 'https://www.artstation.com/duongct'
        }, 
        {
            source: 'alphacoders',
            autor: 'Eddie Deasy',
            img: basePath + 'alphacoders_Eddie-Deasy.jpg',
            externalLink: 'https://www.deviantart.com/drfaustus3'
        }, 
        {
            source: 'alphacoders',
            autor: 'Eryk Szczygieł',
            img: basePath + 'alphacoders_Eryk-Szczygieł.jpg',
            externalLink: 'https://www.artstation.com/typhonart'
        }, 
        {
            source: 'alphacoders',
            autor: 'Julian Calle',
            img: basePath + 'alphacoders_Julian-Calle.jpg',
            externalLink: 'https://www.artstation.com/handsdigitalstudio'
        }, 
        {
            source: 'alphacoders',
            autor: 'Nick Deligaris',
            img: basePath + 'alphacoders_Nick-Deligaris.jpg',
            externalLink: 'https://www.deviantart.com/deligaris'
        }, 
        {
            source: 'alphacoders',
            autor: 'Philipp A. Urlich',
            img: basePath + 'alphacoders_Philipp-A.Urlich.jpg',
            externalLink: 'https://www.artstation.com/somartist'
        }, 
        {
            source: 'alphacoders',
            autor: 'robokoto',
            img: basePath + 'alphacoders_Nick-Deligaris.jpg',
            externalLink: 'https://alphacoders.com/users/profile/69089/robokoboto'
        }, 
        {
            source: 'alphacoders',
            autor: 'robokoto',
            img: basePath + 'alphacoders_robokoboto_2.png',
            externalLink: 'https://alphacoders.com/users/profile/69089/robokoboto'
        }, 
        {
            source: 'alphacoders',
            autor: 'Sandara',
            img: basePath + 'alphacoders_sandara.jpg',
            externalLink: 'https://www.artstation.com/sandara'
        }, 
        {
            source: 'alphacoders',
            autor: 'Stefan Koidl',
            img: basePath + 'alphacoders_Stefan-Koidl.jpg',
            externalLink: 'https://www.artstation.com/stefankoidl'
        }, 
        {
            source: 'alphacoders',
            autor: 'Victor Sales',
            img: basePath + 'alphacoders_Victor-Sales.jpg',
            externalLink: 'https://www.deviantart.com/vsales'
        }, 
        {
            source: 'alphacoders',
            autor: 'Arucarrd',
            img: basePath + 'alphacoders-arucarrd.png',
            externalLink: 'https://www.deviantart.com/arucarrd'
        }, 
    ];

    return autors;
}

function setBackground() {
    const time = 10;
    const domBack = document.querySelector('body');
    const domFoot = document.querySelector('footer');
    const autorRef = document.createElement('p');
    const autorSource = document.createElement('a');

    const autors = setAutors();
    selectBackground();
    setInterval(selectBackground, time * 1000);

    function selectBackground() {  
        const fadeInterval = setInterval(fade, (time * 1000) - 500); 

        domBack.classList.toggle("in");
        domBack.classList.toggle("out");

        const selection = Math.floor(Math.random() * autors.length);
        domBack.style.backgroundImage = `url(${autors[selection].img})`; 
        autorRef.textContent = `From ${autors[selection].source} by`;
        autorSource.textContent = `${autors[selection].autor}`
        autorSource.href = `${autors[selection].externalLink}`
        autorSource.target = '_blank';

        function fade() {
            domBack.classList.toggle("in");
            domBack.classList.toggle("out");
            clearInterval(fadeInterval);
        }
    }

    domFoot.append(autorRef, autorSource);
}

// #endregion

// #region Navigation feedback related -->

function navFeedback() {
    const linkIndex = document.querySelector('.nav__link--index');
    const linkClock = document.querySelector('.nav__link--clock');
    const linkPassword = document.querySelector('.nav__link--password');
    const linkLinks = document.querySelector('.nav__link--links');
    const linkWeather = document.querySelector('.nav__link--weather');
    const url = document.URL;

    if (url.includes('index')){
        setAnchor(linkIndex);
    } else if (url.includes('clock')){
        setAnchor(linkClock);
    } else if (url.includes('password')){
        setAnchor(linkPassword);
    } else if (url.includes('links')){
        setAnchor(linkLinks);
    } else if (url.includes('weather')){
        setAnchor(linkWeather);
    }

    function setAnchor(element) {
        element.classList.toggle('alreadySelected');
        element.href = 'javaScript:void(0)';
    }
}

// #endregion

// Search engine Google --> 

function setSearchbar(dom) {
    const searchBar = document.createElement('article');
    searchBar.className = 'searchEngine';

    searchBar.innerHTML = `<style type="text/css">
    
    </style>
    <div class="gcse-search"></div>
    `;

    dom.append(searchBar);
}

export { setClock, setLinksUi, setInput, passwordTest, weatherStation, weatherStationSearch, setBackground, navFeedback, setSearchbar }