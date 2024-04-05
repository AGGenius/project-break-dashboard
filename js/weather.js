import { weatherStation, setBackground } from '../js/functions.js';

const mainDisplay = document.querySelector('main');

setBackground();
weatherStation(mainDisplay);
