import { weatherStation, setBackground, navFeedback} from '../js/functions.js';

const mainDisplay = document.querySelector('main');

setBackground();
navFeedback();
weatherStation(mainDisplay);
