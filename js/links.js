import { setLinksUi, setBackground, navFeedback } from '../js/functions.js';

const mainDom = document.querySelector('main');

setBackground();
navFeedback();
setLinksUi(mainDom);

