import deck from './deck.js'

/*----- app's state (variables) -----*/ 

let isWinner
let turn

let playerHand
let computerHand
let playerScore
let computerScore
let playerScorePile
let computerScorePile
// object? 
let cardsPlayed


/*----- cached element references -----*/ 

const dayToggle = document.querySelector("#day-toggle")
const playerHandEl = document.querySelector('.player-hand')
const computerHandEl = document.querySelector('.computer-hand')
const feildEl = document.querySelector('.field')
const deckEl = document.querySelector('#deck')
//drawer

/*----- event listeners -----*/ 

dayToggle.addEventListener('click', toggleTheme)
playerHandEl.addEventListener('click', playCardHandler)
feildEl.addEventListener('click', feildClickHandler)
deckEl.addEventListener('click', deckClickHandler)

/*----- functions -----*/

function feildClickHandler(){
    console.log(event.target.id)
}

function playCardHandler(){
    console.log(event.target.id)
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
