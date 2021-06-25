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

const computerHandEl    = document.querySelector('.computer-hand')
const dayNightToggle    = document.querySelector("#day-toggle")
const deckEl            = document.querySelector('#deck')
const fieldEl           = document.querySelector('.field')
const playerHandEl      = document.querySelector('.player-hand')
const scorePileEl       = document.querySelector('.drawer')

/*----- event listeners -----*/ 


dayNightToggle.addEventListener('click', toggleTheme)
deckEl.addEventListener('click', deckClickHandler)
fieldEl.addEventListener('click', fieldClickHandler)
playerHandEl.addEventListener('click', selectCardHandler)

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
    renderComputerHand();
}

function fieldClickHandler(){
    let idAsInt = extractIndexFromId(event.target.id);
    if (isNaN(idAsInt)) return;

    let fieldSelection = checkSuite(field[idAsInt])
    console.log(fieldSelection)
    if(player.selectedCard=== fieldSelection){
    moveMatchingPair(idAsInt)

    render();
}
}

function moveMatchingPair(idAsInt){
    let fieldTile = field.splice(idAsInt, 1)
    let playerTile = player.hand.splice(player.selectedCardIdx, 1)
    player.scorePile.push(fieldTile)
    player.scorePile.push(playerTile)

    renderScorePile()
}

function selectCardHandler(){
    if (turn !== 1) return;
    let idAsInt = extractIndexFromId(event.target.id);
    if (isNaN(idAsInt)) return;
    player.selectedCardIdx= idAsInt
    player.selectedCard = checkSuite(player.hand[idAsInt])
    console.log(player.selectedCard)
    renderPlayerHand();
}

function extractIndexFromId(evtId){
    let indexNum = evtId.split('').filter(i => /\d/.test(i)).join('')
    return parseInt(indexNum);
}

function checkSuite(string){
    return string.slice(0, string.length -1);
}

function renderField(){
    fieldEl.innerHTML = ""
    field.forEach((i, idx) => {
        let fieldTile = document.createElement('div')
        fieldTile.classList.add('field-tile')
        fieldTile.innerHTML = `<img id='f${idx}' src="../assets/tiles/${i}.jpeg">`
        fieldEl.appendChild(fieldTile);
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
    playerHandEl.innerHTML = ""
    player.hand.forEach((i, idx) => {
        let handTile = document.createElement('div')
        handTile.classList.add('hand-tile')
        handTile.innerHTML = `<img id='p${idx}' src="../assets/tiles/${i}.jpeg">`
        playerHandEl.appendChild(handTile);
    })
}

function renderComputerHand(){
    computerHandEl.innerHTML = ""
    computer.hand.forEach((i, idx) => {
        let compTile = document.createElement('div')
        compTile.classList.add('hand-tile')
        compTile.innerHTML = `<img id='p${idx}' src="../assets/tiles/${i}.jpeg">`
        computerHandEl.appendChild(compTile);
    })
}

function deckClickHandler(){
    if (!deck.deck.length) return;

    console.log(deck.deck)
    let cardOffTopDeck = deck.deck.pop();
    field.push(cardOffTopDeck);
    renderField();
    incrementTurn()
}

function incrementTurn(){
    turn *= -1;
}

// computer logic

// async function computerTurn(){
//     let result = await computerThinking()
//     let play = computerPlay(result)
//     flip deck;
// }

// function computerThinking(){
//     let timeoutLength = Math.floor(Math.random() * 5000)
//     setTimeout(() => {
//         console.log('done', timeoutLength)
//       }, timeoutLength);
// }

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
    localStorage.getItem('theme') === 'theme-day' ?
    dayNightToggle.className = "btn btn-dark w-100"
    :
    dayNightToggle.className = "btn btn-light w-100"
}