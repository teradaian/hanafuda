import Deck from './deck.js'
import { yakuSets, tilesValues } from './scoring.js'

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
        score: 0,
        scorePile: []
}

const computer = {
        name: 'computer',
        hand: [],
        selectedCard: null,
        selectedCardIdx: null,
        score: 0 ,
        scorePile: []
}

/*----- cached element references -----*/ 

const computerHandEl    = document.querySelector('.computer-hand')
const dayNightToggleEl  = document.querySelector("#day-toggle")
const deckEl            = document.querySelector('#deck')
const fieldEl           = document.querySelector('.field')
const playerHandEl      = document.querySelector('.player-hand')
const scorePileEl       = document.querySelector('.drawer')
const navbarEl          = document.querySelector('.navbar')
const resetBtnEl        = document.querySelector('.reset-btn')
const playAgainBtn      = document.querySelector('.play-again-btn')

/*----- event listeners -----*/ 

dayNightToggleEl.addEventListener('click', toggleTheme)
deckEl.addEventListener('click', deckClickHandler)
fieldEl.addEventListener('click', fieldTileClickHandler)
playerHandEl.addEventListener('click', selectCardHandler)
resetBtnEl.addEventListener('click', reset)
playAgainBtn.addEventListener('click', reset)

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
    isWinner = null
    deckEl.src = "../assets/tiles/back.jpeg"
    playAgainBtn.className = "btn btn-danger play-again-btn hidden"

    render()
    renderScorePile()
    console.log(turn, 'init turn')
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
    deckEl.removeEventListener('click', deckClickHandler)
    topDeckTile = deck.deck.pop()
    testDeckTile()
}

function deckClickHandler() {
    !player.hand.length && playTopTileFromDeck();
}

function resetSelections(){
    computer.selectedCard = null;
    player.selectedCard = null;
    topDeckTile = null;
}

function matchHighestValueTile(){
    if ( turn === 1 ) {
        testPlayerTile()
    } else if ( turn === -1) {
        testComputerTile()
    } else {
        console.log(player.selectedCard)
        console.log(computer.selectedCard)
        console.log('err!')
    }
}

function testPlayerTile(){
    let tileID = findIndexOfHighestMatch(player.selectedCard)
    capturePair(tileID)
}

function testComputerTile(){
    let tileID = findIndexOfHighestMatch(computer.selectedCard)
    console.log(computer.selectedCardIdx, 'testcomputertile')
    capturePair(tileID)
}

function testDeckTile(){
    let tileID = findIndexOfHighestMatch(topDeckTile)

    if (tileID === -1) {
        field.push(topDeckTile)
        renderTopDeckTileAnimation()
        setTimeout(() => {
            renderField()
            console.log('incrementTurn')
            resetSelections()
            incrementTurn()
        }, 1000)
        
    } else {
        field.push(topDeckTile)
        renderTopDeckTileAnimation()
        setTimeout(() => renderField(), 1000)
        setTimeout(() => captureMatchInField(tileID), 2000)
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
            renderScorePile()
        } 
        if (turn === -1) {
            computer.scorePile.push(fieldTileMatch.join(''))
            computer.scorePile.push(playedFieldTile)
        }
        resetSelections()
        render()
        incrementTurn()
    }, 800)
}
           
function capturePair(idAsInt){
    if (turn === 1) {

        let fieldTile = field.splice(idAsInt, 1)
        let playerTile = player.hand.splice(player.selectedCardIdx, 1)

        renderMatchingPairAnimation(idAsInt)
   
        setTimeout(() =>{
            player.scorePile.push(fieldTile.join(''))
            player.scorePile.push(playerTile.join(''))
            player.scorePile = filterScoringTiles(player.scorePile, tilesValues).sort()
            resetSelections()
            renderScorePile()
            render()
        }, 800)
    }
    if (turn === -1) {
        let fieldTile = field.splice(idAsInt, 1)
        let computerTile = computer.hand.splice(computer.selectedCardIdx, 1)

        renderMatchingPairAnimation(idAsInt)

        setTimeout(() =>{
            computer.scorePile.push(fieldTile.join(''))
            computer.scorePile.push(computerTile.join(''))
            resetSelections()
            render()
        }, 800)
    }
}

function selectCardHandler(){
    if (turn !== 1) return;

    let idAsInt = extractIndexFromId(event.target.id);
    if (isNaN(idAsInt)) return;
    console.log(idAsInt, 'card handler')
    player.selectedCardIdx= idAsInt
    player.selectedCard = player.hand[idAsInt]
    renderPlayerHand();
    renderSelectedCard()
}

function renderTopDeckTileAnimation(){
    const fieldElArray = Array.from(fieldEl.children)
    renderField()
    fieldEl.children[field.length - 1].className = "animate__animated animate__fadeInLeftBig"
}

function renderMatchingPairAnimation(fieldTileId){
    if(turn === 1) {
        fieldEl.children[fieldTileId].className = "animate__animated animate__backOutDown"
        playerHandEl.children[player.selectedCardIdx].className = "animate__animated animate__backOutDown"    
    } else {
        fieldEl.children[fieldTileId].className = "animate__animated animate__backOutUp"
        console.log(computer.selectedCardIdx, 'selectedid')
        computerHandEl.children[computer.selectedCardIdx].className = "animate__animated animate__backOutUp"
    }
}

function renderMatchOnDrawAnimation(fieldTileId){
    const fieldElArray = Array.from(fieldEl.children)
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
    resetSelections()
    if (!deck.deck.length) {
        renderEmptyDeck()
        calculateScore()
    }

    turn *= -1
    console.log(turn, 'startofturn')
    if (turn === 1) {
        playerHandEl.addEventListener('click', selectCardHandler)
        deckEl.addEventListener('click', deckClickHandler)
        console.log("select handler fired")
    }
    if (turn === -1) {
        setTimeout(()=>{
        console.log('comp turn started')
        computerTurn()
        }, 1000)
    }
}

function computerTurn(){
    if(!computer.hand.length) return setTimeout(() =>playTopTileFromDeck(), 1000)

    computerSelectRandom()
    computerPlayHandler()
    setTimeout(()=> playTopTileFromDeck(), 2000)
    return
}

function computerSelectRandom(){
    let tileId = generateRandomHandId()
    computer.selectedCard = computer.hand[tileId]
    computer.selectedCardIdx = tileId
}

function generateRandomHandId(){
    return computer.hand.length > 1 ? 
    Math.floor(Math.random() * computer.hand.length)
    :
    0
}

function computerPlayHandler(){
    if (!field.filter(tile => checkSuit(computer.selectedCard) === checkSuit(tile)).length){
        field.push(computer.hand.splice(computer.selectedCardIdx, 1).join(''))
        computer.selectedCard = null;
        render()
    } else {
        matchHighestValueTile()
    }
   
}

function reset(){
    resetPlayers()
    init()
}

function resetPlayers(){
    player.hand = []
    player.selectedCards = null
    player.selectedCardIdx = null
    player.score = 0
    player.scorePile=[]

    computer.hand = []
    computer.selectedCard = null
    computer.selectedCardIdx = null
    computer.score = 0
    computer.scorePile = []
}

// scoring

function calculateScore(){
    scoreTiles(player.scorePile, tilesValues, player)
    scoreYakus(player.scorePile, yakuSets, player)

    filterScoringTiles(computer.scorePile, tilesValues)
    scoreTiles(computer.scorePile, tilesValues, computer)
    scoreYakus(computer.scorePile, yakuSets, computer)

    if(player.score === computer.score) return console.log('TIEGAME')

    player.score > computer.score ? isWinner = 1 : isWinner = -1

    handleGameEnd()
}

function scoreTiles(scorePileArray, arrayOfValues, owner){
    let total = 0;
    let scoredPoints = arrayOfValues.map((i, idx) => {
      return scorePileArray.filter(i => arrayOfValues[idx].includes(i)).length
    })
    if(scoredPoints.every(val => val > 0)) {
        total += scoredPoints[0] * 20
        total += scoredPoints[1] * 10
        total += scoredPoints[2] * 5
        return owner.score += total
    } else {
        scoredPoints[0] === 0 ? total : total += scoredPoints[0] * 20
        scoredPoints[1] === 0 ? total : total += scoredPoints[1] * 10
        scoredPoints[2] === 0 ? total : total += scoredPoints[2] * 5
        return owner.score += total
    }
}

function filterScoringTiles(scorePileArray, arrayOfValues){
    let allScoreTiles = arrayOfValues.flat();
    return scorePileArray.filter(i => allScoreTiles.includes(i))   
}

function scoreYakus(scorePileArray, yakuArr, owner){
    let numOfYakuScored = yakuArr.filter(yaku => yaku.every(tile => scorePileArray.includes(tile))).length;
    return numOfYakuScored > 0 ? owner.score += numOfYakuScored * 50 : 0
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
    if (localStorage.getItem('theme') === 'theme-day') {
        navbarEl.className = "navbar w-100 navbar-light bg-light"
        dayNightToggleEl.className = "btn btn-light w-100"
    } else {
        navbarEl.className = "navbar w-100 navbar-dark bg-dark"
        dayNightToggleEl.className = "btn btn-dark w-100"
    }
    renderThemeImages()
}

function handleGameEnd(){
    renderEndOfGameDisplay()
    renderWinningYaku()
    playAgainBtn.className = "btn btn-danger play-again-btn"
}

function renderWinningYaku(){
    let winningYaku = yakuSets.filter(yaku => yaku.every(tile => player.scorePile.includes(tile)))
    console.log(winningYaku)
    
    if (!winningYaku.length) return;
    winningYaku.forEach(tile => field.push(tile))
    field.forEach(yakuArr => {
        yakuArr.forEach(tile => {
            let fieldTile = document.createElement('div')
            fieldTile.classList.add('field-tile')
            fieldTile.innerHTML = `<img src="../assets/tiles/${tile}.jpeg">`
            fieldEl.appendChild(fieldTile);
        })
})
}

function renderEndOfGameDisplay(){
        let scoreMsg = document.createElement('div')
        scoreMsg.classList.add('score-message')

        if(isWinner === 1) {
            scoreMsg.innerHTML =`<h1>You win! You scored ${player.score} and the computer scored ${computer.score}<h1>`
        } 
        if(isWinner === -1)
            scoreMsg.innerHTML = `<h1>You lost! You scored ${player.score} and the computer scored ${computer.score}<h1>`
        fieldEl.appendChild(scoreMsg);
}

function renderThemeImages(){
    let carousel = document.querySelector(".carousel-inner")
    carousel.innerHTML = ""
    let carouselCards = document.createElement('div')
    carouselCards.innerHTML =  `<div class="carousel-item active">
    <img src="./assets/rules/rule1-${localStorage.getItem('theme')}.jpg" id="rule1" class="d-block w-100" alt="ruleset one">
  </div>
  <div class="carousel-item">
    <img src="./assets/rules/rule2-${localStorage.getItem('theme')}.jpg" id='rule2' class="d-block w-100" alt="ruleset two">
  </div>
  <div class="carousel-item">
    <img src="./assets/rules/rule3-${localStorage.getItem('theme')}.jpg" id='rule3' class="d-block w-100" alt="ruleset three">
  </div>`
  carousel.appendChild(carouselCards)
}



   


