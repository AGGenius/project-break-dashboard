setInput();

//test(1000);

// Gets the DOM values. Checks for a valid input, and calls the function to generate a password if it really is. If not, displays a message on the webpage.
function setInput() {
    const passwordInput = document.getElementById('passInput');
    const passwordInputLabel = document.getElementById('passInputLabel');
    const passwordInputButton = document.getElementById('passInputButton');

    passwordInput.addEventListener('keydown', enterPress);
    passwordInputButton.addEventListener('click', callGenerator);

    function enterPress(input) {
        if(input.key === 'Enter') { callGenerator();    }
    }

    function callGenerator() {
        const pureValue = passwordInput.value;
        let value = pureValue * 1;

        if (pureValue.length > 2) {
            passwordInputLabel.textContent = `Input value longer than two digits. Input a number between 12 and 50.`;
        } else if(typeof value === 'number' && !Number.isNaN(value) && (value >= 12 && value <= 50)) {
            const password = setPassword(value);
            passwordInputLabel.textContent = `"${password}`;
        } else {
            passwordInputLabel.textContent = `"${pureValue}" is not a valid. Input a number between 12 and 50.`;
        }

        passwordInput.value = '';
    }
}

function setPassword(long) {
    const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    const uppercases = [];
    const numbers = ['0','1','2','3','4','5','6','7','8','9',];
    const symbols = ['!','@','#','$','%','^','&','*','(',')','-','_','=','+'];

    letters.forEach(letter => uppercases.push(letter.toUpperCase()) )

    const chars = [letters, uppercases, numbers, symbols];

    let password = [];

    for(let i = 0; i < long; i++) {
        const randArr = Math.floor(Math.random() * chars.length);
        password.push(chars[randArr][Math.floor(Math.random() * chars[randArr].length)]);
    }

    charCheck();
    password = password.join('');
    return password;

    // This function checks the password to look if in includes at least one of each type of character, if not, includes one.
    function charCheck() {

        chars.forEach(arr => {
            let check = false;

            arr.forEach(char => {
                if(password.includes(char)) { check = true; }
            });   
    
            if(!check) {
                const toChange = password[Math.floor(Math.random() * password.length)];
                const changeValue = arr[Math.floor(Math.random() * arr.length)];
                password.splice(password.indexOf(toChange), 1, changeValue);
            }
        })    
    }   
}

// A automatic test function to check if the password really includes all in the end.
function test(x) {
    for(let i = 0; i < x; i++) {
        const passLong = Math.floor(Math.random() * (51 - 12) + 12);

        const password = setPassword(passLong);
    
        const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
        const uppercases = [];
        const numbers = ['0','1','2','3','4','5','6','7','8','9',];
        const symbols = ['!','@','#','$','%','^','&','*','(',')','-','_','=','+'];
    
        letters.forEach(letter => uppercases.push(letter.toUpperCase()) )
    
        const chars = [letters, uppercases, numbers, symbols];
    
        chars.forEach(arr => {
            let check = false;
    
            arr.forEach(char => {
                if(password.includes(char)) { 
                    check = true;
                }
            });   
    
            console.log(check);
        }) 
    }
}
