import Deck from './deck.js'

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

let cardsPlayed;

/*----- cached element references -----*/ 

const dayToggle = document.querySelector("#day-toggle")
const playerHandEl = document.querySelector('.player-hand')
const feildEl = document.querySelector('.feild')
const deckEl = document.querySelector('#deck')
const drawerOpen = document.querySelector("#open-drawer")
const scoreDrawer = document.querySelector('#score-drawer')
const drawerClose = document.querySelector('.close-btn')

/*----- event listeners -----*/ 

dayToggle.addEventListener('click', toggleTheme)
playerHandEl.addEventListener('click', playCardHandler)
feildEl.addEventListener('click', feildClickHandler)
deckEl.addEventListener('click', deckClickHandler)
drawerOpen.addEventListener('click', openDrawer)
drawerClose.addEventListener('click', closeDrawer)

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
    let deck = new Deck()
    console.log(deck.deck)
}

// drawer
function openDrawer() {
    scoreDrawer.style.width = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    openDrawer.className = 'close-btn'
  }
  
function closeDrawer() {
    scoreDrawer.style.width = "0";
    document.body.style.backgroundColor = "white";
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
