import {weatherStationSearch, setBackground, navFeedback} from '../js/functions.js';

const mainDisplay = document.querySelector('main');

setBackground();
navFeedback();
weatherStationSearch(mainDisplay);



