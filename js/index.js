import { setClock, setLinksUi, setInput, passwordTest, weatherStation, setBackground, navFeedback, setSearchbar } from '../js/functions.js';

const firstDom = document.getElementById('indexLinks');
const centerDom = document.getElementById('indexClockWeatherSearch');
const lastDom = document.getElementById('indexPassword');

setBackground();
navFeedback();
setLinksUi(firstDom);
setClock(centerDom);
setSearchbar(centerDom);
weatherStation(centerDom);
setInput(lastDom);

