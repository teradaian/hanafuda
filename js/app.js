import Deck from './deck.js'

/*----- app's state (variables) -----*/ 

let isWinner
let turn
let field
let deck


const player = {
        name: 'player',
        hand: [],
        selectedCard: null,
        selectedCardIdx: null,
        score: null,
        scorePile: []
}

const computer = {
        name: 'computer',
        hand: [],
        score: null,
        scorePile: []
}

/*----- cached element references -----*/ 

const dayToggle = document.querySelector("#day-toggle")
const playerHandEl = document.querySelector('.player-hand')
const fieldEl = document.querySelector('.field')
const deckEl = document.querySelector('#deck')
const drawerOpen = document.querySelector("#open-drawer")
const scoreDrawer = document.querySelector('#score-drawer')
const drawerClose = document.querySelector('.close-btn')
const scorePileEl = document.querySelector('.drawer')

/*----- event listeners -----*/ 

dayToggle.addEventListener('click', toggleTheme)
playerHandEl.addEventListener('click', selectCardHandler)
fieldEl.addEventListener('click', fieldClickHandler)
deckEl.addEventListener('click', deckClickHandler)
drawerOpen.addEventListener('click', openDrawer)
drawerClose.addEventListener('click', closeDrawer)

/*----- functions -----*/

init()

function init(){
    deck = new Deck()
    deck.reset()
    deck.shuffle()
    player.hand = deck.dealPlayerHand()
    computer.hand = deck.dealComputerHand()
    field = deck.dealField()
    turn = 1;
    render()
}

function render(){
    renderField();
    renderPlayerHand();
}

function fieldClickHandler(){
    let idAsInt = parseInt(event.target.id.split('').pop())
    if (isNaN(idAsInt)) return;

    let fieldSelection = checkSuite(field[idAsInt])

    if(player.selectedCard=== fieldSelection){
    score(idAsInt)

    render();
}

function score(idAsInt){
        let wonCard = field.splice(idAsInt, 1)
        let playerCard = player.hand.splice(player.selectedCardIdx, 1)
        player.scorePile.push(wonCard)
        player.scorePile.push(playerCard)
        renderScorePile()
    }
}

function selectCardHandler(){
    if (turn !== 1) return;
    let idAsInt = parseInt(event.target.id.split('').pop())
    if (isNaN(idAsInt)) return;

    player.selectedCardIdx= idAsInt
    player.selectedCard = checkSuite(player.hand[idAsInt])
    renderPlayerHand();
}


function checkSuite(string){
    return string.slice(0, string.length -1);
}

function renderField(){
    field.forEach((i, idx) => {
        fieldEl.children[idx].innerHTML = `<img id="f${idx}" src="../assets/tiles/${field[idx]}.jpeg" >`
    })
}

function renderScorePile(){
    scorePileEl.innerHTML = ""
    player.scorePile.forEach(i => {
        let scoredTile = document.createElement('div')
        scoredTile.classList.add('scored-tile')
        scoredTile.innerHTML = `<img src="../assets/tiles/${i}.jpeg">`
        scorePileEl.appendChild(scoredTile);
    })
}

function renderPlayerHand(){
    player.hand.forEach((i, idx) => {
        playerHandEl.children[idx].innerHTML = `<img id="h${idx}" src="../assets/tiles/${player.hand[idx]}.jpeg" >`
    })
}

function deckClickHandler(){
    if (!deck.deck.length) return;

    console.log(deck.deck)
    let cardOffTopDeck = deck.deck.pop();
    field.push(cardOffTopDeck);
    renderField();
}

// drawer
function openDrawer() {
    scoreDrawer.style.width = "400px";
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

function incrementTurn(){
    turn *= -1;
}