import { setClock, setLinksUi, setInput, passwordTest, weatherStation, setBackground } from '../js/functions.js';

const clockDisplay = document.getElementById('watch');
const passwordDisplay = document.getElementById('password')
const linksDisplay = document.getElementById('links');
const weatherDisplay = document.getElementById('weather');

setBackground();
setClock(clockDisplay);
setInput(passwordDisplay);
setLinksUi(linksDisplay);
weatherStation(weatherDisplay);