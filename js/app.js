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
fieldEl.addEventListener('click', fieldTileClickHandler)
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

function fieldTileClickHandler(){
    let idAsInt = extractIndexFromId(event.target.id);
    if (isNaN(idAsInt)) {
        return emptyFieldClickHandler()
    }

    let fieldSelection = checkSuit(field[idAsInt])
    let playerSelection = checkSuit(player.selectedCard)
    
    if(playerSelection === fieldSelection){
    capturePair(idAsInt)
    }
}

function emptyFieldClickHandler(){
    if (player.selectedCard === null) return
    if (!field.filter(i => checkSuit(player.selectedCard) === checkSuit(i)).length){
        field.push(player.hand.splice(player.selectedCardIdx, 1).join(''))
        render();
    } else {
        matchHighestValueTile()
    }
}

function matchHighestValueTile(){

    let suit = checkSuit(player.selectedCard)

    let i = field.filter(tileName => tileName.toLowerCase().includes(suit.toLowerCase())).sort()

    let indexOfHighestMatch = field.findIndex(name => name === i[0])
    console.log(indexOfHighestMatch, 'highest match')
    capturePair(indexOfHighestMatch)
}

function extractIndexFromId(evtId){
    let indexNum = evtId.split('').filter(i => /\d/.test(i)).join('')
    return parseInt(indexNum);
}

function checkSuit(string){
    return string.slice(0, string.length -1);
}

function capturePair(idAsInt){
    let fieldTile = field.splice(idAsInt, 1)
    let playerTile = player.hand.splice(player.selectedCardIdx, 1)

    renderMatchingPairAnimation(idAsInt)

    setTimeout(() =>{
        player.scorePile.push(fieldTile)
        player.scorePile.push(playerTile)
        renderScorePile()
        render()
    }, 800)
}

function renderMatchingPairAnimation(fieldTileId){
    fieldEl.children[fieldTileId].className = "animate__animated animate__backOutDown"
    playerHandEl.children[player.selectedCardIdx].className = "animate__animated animate__backOutDown"
}

function selectCardHandler(){
    if (turn !== 1) return;
    let idAsInt = extractIndexFromId(event.target.id);
    if (isNaN(idAsInt)) return;
    player.selectedCardIdx= idAsInt
    player.selectedCard = player.hand[idAsInt]
    renderPlayerHand();
    highlightSelectedCard()
}

function highlightSelectedCard(){
    playerHandEl.children[player.selectedCardIdx].className = "selected hand-tile"
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
        compTile.innerHTML = `<img id='p${idx}' src="../assets/tiles/back.jpeg">`
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