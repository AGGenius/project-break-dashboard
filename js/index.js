import { setClock, setLinksUi, setInput, passwordTest, weatherStation, setBackground, navFeedback } from '../js/functions.js';

const mainDom = document.getElementById('index');

setBackground();
navFeedback();
setClock(mainDom);
setInput(mainDom);
setLinksUi(mainDom);
weatherStation(mainDom);

