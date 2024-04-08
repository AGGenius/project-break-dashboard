import { setClock, setBackground, navFeedback  } from '../js/functions.js';

setBackground();
navFeedback();
const display = document.querySelector('main');  
setClock(display);
