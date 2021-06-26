import Deck from './deck.js'

/*----- app's state (variables) -----*/ 

let isWinner
let turn
let field
let deck
let topDeckTile


const player = {
        name: 'player',
        hand: [],
        selectedCard: null,
        selectedCardIdx: null,
        scorePile: []
}

const computer = {
        name: 'computer',
        hand: [],
        selectedCard: null,
        selectedCardIdx: null,
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
    turn = 1
    render()
}

function render(){
    renderField();
    renderPlayerHand();
    renderComputerHand();
}

function fieldTileClickHandler(){
    let idAsInt = extractIndexFromId(event.target.id);

    disableHandSelection()

    if (isNaN(idAsInt)) return emptyFieldPlayHandler()
    if (player.selectedCard === null) return

    let fieldSelection = checkSuit(field[idAsInt])
    let playerSelection = checkSuit(player.selectedCard)
    
    if(playerSelection === fieldSelection){
        capturePair(idAsInt)
        setTimeout(()=> playTopTileFromDeck(), 1000)
    }
}


function emptyFieldPlayHandler(){
    if (player.selectedCard === null) return

    disableHandSelection()

    if (!field.filter(tile => checkSuit(player.selectedCard) === checkSuit(tile)).length){
        field.push(player.hand.splice(player.selectedCardIdx, 1).join(''))
        player.selectedCard = null;
        render()
    } else {
        matchHighestValueTile()
    }
    setTimeout(()=> playTopTileFromDeck(), 1000)
}

function disableHandSelection(){
    playerHandEl.removeEventListener('click', selectCardHandler)
}

function playTopTileFromDeck(){
    if (!deck.deck.length) return renderEmptyDeck()

    topDeckTile = deck.deck.pop()
    matchHighestValueTile()
    renderField()
}

function deckClickHandler() {
    !player.hand.length && playTopTileFromDeck();
}

function resetSelections(){
    player.selectedCard = null;
    computer.selectedCard = null;
    topDeckTile = null;
}

function matchHighestValueTile(){
    if (player.selectedCard === null && computer.selectedCard === null) {
        console.log(topDeckTile, 'topDeck')
        testDeckTile()
    } else if ( player.selectedCard !== null ) {
        testPlayerTile()
    } else {
        testComputerTile()
    }
}

function testPlayerTile(){
    let tileID = findIndexOfHighestMatch(player.selectedCard)
    capturePair(tileID)
}

function testComputerTile(){
    console.log('not built yet')
}

function testDeckTile(){
    let tileID = findIndexOfHighestMatch(topDeckTile)

    if (tileID === -1) {
        field.push(topDeckTile)
        incrementTurn();
    } else {
        field.push(topDeckTile)
        setTimeout(()=> captureMatchInField(tileID), 500)
    }
}

function findIndexOfHighestMatch(tile){
    let tileSuit = checkSuit(tile)
    let i = field.filter(tileName => tileName.toLowerCase().includes(tileSuit.toLowerCase())).sort()

    let indexOfHighestMatch = field.findIndex(name => name === i[0])
    return indexOfHighestMatch;
}

function extractIndexFromId(evtId){
    let indexNum = evtId.split('').filter(i => /\d/.test(i)).join('')
    return parseInt(indexNum);
}

function checkSuit(string){
    return string.slice(0, string.length -1);
}

function captureMatchInField(idAsInt){
    let fieldTileMatch = field.splice(idAsInt, 1)
    let playedFieldTile = field.pop()

    renderMatchOnDrawAnimation(idAsInt)

    setTimeout(() =>{
        if (turn === 1) {
            player.scorePile.push(fieldTileMatch.join(''))
            player.scorePile.push(playedFieldTile)
            resetSelections()
            renderScorePile()
            render()
            incrementTurn()
        } else {
            computer.scorePile.push(fieldTileMatch.join(''))
            computer.scorePile.push(playedFieldTile)
            resetSelections()
            render()
            incrementTurn()
        }
    }, 800)
}

function capturePair(idAsInt){

    let fieldTile = field.splice(idAsInt, 1)
    let playerTile = player.hand.splice(player.selectedCardIdx, 1)

    renderMatchingPairAnimation(idAsInt)
   
    setTimeout(() =>{
        player.scorePile.push(fieldTile)
        player.scorePile.push(playerTile)
        resetSelections()
        renderScorePile()
        render()
    }, 800)
}

function selectCardHandler(){
    if (turn !== 1) return;

    let idAsInt = extractIndexFromId(event.target.id);
    if (isNaN(idAsInt)) return;
    
    player.selectedCardIdx= idAsInt
    player.selectedCard = player.hand[idAsInt]
    renderPlayerHand();
    renderSelectedCard()
}

function renderMatchingPairAnimation(fieldTileId){
    if(turn === 1) {
        fieldEl.children[fieldTileId].className = "animate__animated animate__backOutDown"
        playerHandEl.children[player.selectedCardIdx].className = "animate__animated animate__backOutDown"    
    } else {
        fieldEl.children[fieldTileId].className = "animate__animated animate__backOutUp"
        computerHandEl.children[computer.selectedCardIdx].className = "animate__animated animate__backOutUp"
    }
}

function renderMatchOnDrawAnimation(fieldTileId){
    const fieldElArray = Array.from(fieldEl.children)
    // convert to iterable for compatability
    if( turn === 1) {
        fieldEl.children[fieldTileId].className = "animate__animated animate__backOutDown"
        fieldEl.children[fieldElArray.length -1].className = "animate__animated animate__backOutDown"    
    } else {
        fieldEl.children[fieldTileId].className = "animate__animated animate__backOutUp"
        fieldEl.children[fieldElArray.length -1].className = "animate__animated animate__backOutUp"
    }
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

function renderSelectedCard(){
    playerHandEl.children[player.selectedCardIdx].className = "selected hand-tile"
}

const renderEmptyDeck = () => deckEl.src = ""

const incrementTurn = () => {
    turn *= -1
    console.log(turn, 'turn')
    if (turn === 1) playerHandEl.addEventListener('click', selectCardHandler)
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


// test!
const title = document.querySelector('#deck')
title.addEventListener('click', incrementTurn)