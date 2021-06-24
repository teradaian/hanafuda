import Deck from './deck.js'

/*----- app's state (variables) -----*/ 

let isWinner
let turn
let feild

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

init()

function init(){
    let deck = new Deck()
    deck.reset()
    deck.shuffle()
    player.hand = deck.dealPlayerHand()
    computer.hand = deck.dealComputerHand()
    feild = deck.dealFeild()
    console.log(player.hand, 'hand')
    console.log(computer.hand, 'comp')
    console.log(feild, 'feild')
}

function feildClickHandler(){
    let idAsInt = parseInt(event.target.id.split('').pop())
    if (isNaN(idAsInt)) return;
    renderFeild()
    console.log(feild[idAsInt])
}

function renderFeild(){
    feild.forEach((i, idx) => {
        feildEl.children[idx].innerHTML = `<img src="../assets/tiles/${feild[idx]}.jpeg" >`
    })
}

function renderPlayerHand(){
    player.hand.forEach((i, idx) => {
        playerHandEl.children[idx].innerHTML = `<img src="../assets/tiles/${player.hand[idx]}.jpeg" >`
    })
}

function playCardHandler(){
    let idAsInt = parseInt(event.target.id.split('').pop())
    if (isNaN(idAsInt)) return;
    renderPlayerHand()
    console.log(player.hand[idAsInt])
}

function deckClickHandler(){
    console.log('deck clicked')
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
