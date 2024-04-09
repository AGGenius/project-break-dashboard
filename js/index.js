import { setClock, setLinksUi, setInput, passwordTest, weatherStation, setBackground, navFeedback } from '../js/functions.js';

const firstDom = document.getElementById('indexFirst');
const centerDom = document.getElementById('indexCenter');
const lastDom = document.getElementById('indexLast');

setBackground();
navFeedback();
setLinksUi(firstDom);
setClock(centerDom);
weatherStation(centerDom);
setInput(lastDom);

