import deck from './deck.js'

/*----- app's state (variables) -----*/ 

let isWinner
let turn

const player = {
        name: 'player',
        hand: [],
        score: null,
        scorePile: []
}

const computer = {
        name: 'computer',
        hand: [],
        score: null,
        scorePile: []
}

let cardsPlayed


/*----- cached element references -----*/ 

const dayToggle = document.querySelector("#day-toggle")
const playerHandEl = document.querySelector('.player-hand')
const feildEl = document.querySelector('.feild')
const deckEl = document.querySelector('#deck')
//drawer

/*----- event listeners -----*/ 

dayToggle.addEventListener('click', toggleTheme)
playerHandEl.addEventListener('click', playCardHandler)
feildEl.addEventListener('click', feildClickHandler)
deckEl.addEventListener('click', deckClickHandler)

/*----- functions -----*/

function feildClickHandler(){
    let idAsInt = parseInt(event.target.id.split('').pop())
    if (isNaN(idAsInt)) return;
    console.log(idAsInt)
}

function playCardHandler(){
    let idAsInt = parseInt(event.target.id.split('').pop())
    if (isNaN(idAsInt)) return;
    console.log(idAsInt)
}

function deckClickHandler(){
    console.log('deck clicked!')
}

// night mode toggle
function setTheme(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme;
}

function toggleTheme() {
    localStorage.getItem('theme') === 'theme-day' ? 
        setTheme('theme-night') 
    : 
        setTheme('theme-day');
    renderThemeUI();
}

(function () {
    localStorage.getItem('theme') === 'theme-day' ? 
        setTheme('theme-day') 
    : 
        setTheme('theme-night');
    renderThemeUI();
})();

function renderThemeUI() {
    console.log('working!')
}
