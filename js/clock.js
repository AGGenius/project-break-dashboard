const clockDom = document.getElementById('clock');
const dateDom = document.getElementById('date');
const phraseDom = document.getElementById('phrase');

setInterval(getDateValues, 1000);

function getDateValues() {
    const date = new Date();
     
    clockDom.innerHTML = format(date.getHours()) + ":" + format(date.getMinutes()) + ":" + format(date.getSeconds());
    dateDom.innerHTML = format(date.getDay()) + "/" +  format(date.getMonth()) + "/" + date.getFullYear();
    phraseDom.innerHTML = customPhrase();
    
    function customPhrase() {
        const hour = format(date.getHours());
        const minute = format(date.getMinutes());

        if((hour >= 0 && minute >= 1) && hour < 7) {
            return 'Espero que si sigues aqui sea jugando.';
        } else if ((hour >= 7 && minute >= 1) && hour < 12) {
            return '¡Toca ponerse manos a la obra!';
        } else if ((hour >= 12 && minute >= 1) && hour < 14)  {
            return 'Ves pensando que toca comer. ¡Ese cerebro no vive del aire!';
        } else if ((hour >= 14 && minute >= 1) && hour < 16)  {
            return 'Un buen reposo es lo mejor poder rendir correctamente.';
        } else if ((hour >= 16 && minute >= 1) && hour < 18)  {
            return '¿Nos ponemos un rato más? ¡Tu puedes!';
        } else if ((hour >= 18 && minute >= 1) && hour < 22)  {
            return '¿Sabes? Descansar de vez en cuando también va bien.';
        } else if ((hour >= 22 && minute >= 1))  {
            return 'No me obliges a progamar una apagado automatico. A dormir.';
        } else {
            return ''; // ¿Que pasa en el intervalo de tiempo de un minuto entre 07:00 y 07:01?
        }
    }    
    
    function format(val) {
        if (val < 10) {
            return val = '0' + val;
        } else {
            return val;
        }
    }

}