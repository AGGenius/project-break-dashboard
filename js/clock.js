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

        if(hour >= 0 && hour < 7) {
            return 'Espero que si sigues aqui sea jugando.';
        } else if (hour >= 7&& hour < 12) {
            return '¡Toca ponerse manos a la obra!';
        } else if (hour >= 12&& hour < 14)  {
            return 'Ves pensando que toca comer. ¡Ese cerebro no vive del aire!';
        } else if (hour >= 14 && hour < 16)  {
            return 'Un buen reposo es lo mejor poder rendir correctamente.';
        } else if (hour >= 16 && hour < 18)  {
            return '¿Nos ponemos un rato más? ¡Tu puedes!';
        } else if (hour >= 18 && hour < 22)  {
            return '¿Sabes? Descansar de vez en cuando también va bien.';
        } else if (hour >= 22)  {
            return 'No me obliges a progamar una apagado automatico. A dormir.';
        } else {
            return '';
        }
    }    
    
    function format(val) { return val.toString().padStart(2, '0') }
}