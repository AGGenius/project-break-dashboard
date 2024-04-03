const linkTittle = document.getElementById('linkName');
const linkValue = document.getElementById('linkValue');
const mainDisplay = document.getElementById('mainDisplay');
const linkWarning = document.getElementById('linkWarning');

setLocalstorage();
getLink();
delListener();

// Sets the local storage for first load of webpage.
function setLocalstorage () {
    if(localStorage.getItem('links') === null) {
        localStorage.setItem('links', JSON.stringify([]));
    } else {
        const links = JSON.parse(localStorage.getItem('links'));
        displayLinks(links);
    }
}

// Get the values from the imputs and stores them in an object that will be stored on localStorage.
// Validates for empty fields, already stored links and valid links.
function getLink() {
    const link = {
        tittle: '',
        value: '',
    }

    linkTittle.addEventListener('keydown', getValues);
    linkValue.addEventListener('keydown', getValues);

    function getValues(input) {
        if(input.key === 'Enter') {
            link.tittle = linkTittle.value;
            link.value = linkValue.value;
            let links = JSON.parse(localStorage.getItem('links'));

            // This checks if is a valid URL. If it is, in continues, and if not, outputs an error and
            // exits the funcion at all.
            try { 
                new URL(link.value);
            } catch (error) {
                linkWarning.textContent = 'No es un enlace valido.'
                return false;
            }
            
            if (links.find((element) => element.value === link.value)) {
                linkWarning.textContent = '¡Ya tienes guardado este enlace!';
            } else if (!link.tittle || !link.value) {
                linkWarning.textContent = 'Alguno de los campos esta vacio.';
            } else if (link.tittle && link.value) {     
                links.push(link);
                displayLinks(links);
                localStorage.setItem('links', JSON.stringify(links));       
                linkWarning.textContent = '';
            } 

            linkTittle.value = '';
            linkValue.value = '';
        }
    }
}

// Refresh the display and then renders each link in the array that is passed has value.
function displayLinks(links) {
    mainDisplay.innerHTML = '';

    links.forEach(link => {
        const linkCard = document.createElement('article');
        const linkTittle = document.createElement('h3');
        const linkValue = document.createElement('p');
        const linkDelButton = document.createElement('img');

        // Modificar este bloque desde el CSS, solo por test.
        linkDelButton.src = '/resources/Pokeball-PNG-File.png'
        linkDelButton.width = 25;
        linkDelButton.height = 25;
    
        linkTittle.textContent = 'Titulo: ' + link.tittle;
        linkValue.textContent = 'Enlace: ' + link.value;
        linkDelButton.value = link.value;
    
        linkCard.append(linkTittle, linkValue, linkDelButton);
        mainDisplay.appendChild(linkCard);
    });
}

// Function to add a listener to the main dom to look for the del button on each card.
// Gets the values from local storage to find the element to remove and then filter it with no
// coincident values. Saves the new array on localstorage and renews the display.
function delListener() {
    mainDisplay.addEventListener('click', event => {
        let links = JSON.parse(localStorage.getItem('links'));

        const linkCard = event.target.closest('img');

        if(!linkCard) return;

        const linkToRemove = links.find((element) => element.value === linkCard.value);
        links = links.filter((val) => val !== linkToRemove);
        
        displayLinks(links);

        localStorage.setItem('links', JSON.stringify(links));

        event.stopPropagation();
    })
}