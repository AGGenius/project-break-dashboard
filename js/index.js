import { setClock, setLinksUi, setInput, passwordTest, weatherStation, setBackground, navFeedback, setSearchbar } from '../js/functions.js';

const firstDom = document.getElementById('indexLinks');
const centerDom = document.getElementById('indexClockWeatherSearch');
const lastDom = document.getElementById('indexPassword');

setBackground();
navFeedback();
setLinksUi(firstDom);
setClock(centerDom);
setSearchbar(centerDom);
setLocalstorage();
setInput(lastDom);

function setLocalstorage() {
    const country = 'madrid-spain';

    if(localStorage.getItem('storedCountry') === null) {
        localStorage.setItem('storedCountry', JSON.stringify(''));
    } else {     
        country = JSON.parse(localStorage.getItem('storedCountry')); 
    }
    

    weatherStation(centerDom, country);
}

