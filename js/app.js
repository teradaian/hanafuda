import Deck from './deck.js'
import { yakuSets, tilesValues } from './scoring.js'

let isWinner
let turn
let field
let deck
let topDeckTile
let marioTheme

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

const computerHandEl    = document.querySelector('.computer-hand')
const dayNightToggleEl  = document.querySelector("#day-toggle")
const deckEl            = document.querySelector('#deck')
const dropdownBgEl      = document.querySelector('#dropdown')
const dropdownBtnEl     = document.querySelector('#dropdownMenuButton1')
const fieldEl           = document.querySelector('.field')
const marioToggleEl     = document.querySelector('#mario-toggle')
const navbarEl          = document.querySelector('.navbar')
const playAgainBtn      = document.querySelector('.play-again-btn')
const playerHandEl      = document.querySelector('.player-hand')
const resetBtnEl        = document.querySelector('.reset-btn')
const scorePileEl       = document.querySelector('.drawer')

dayNightToggleEl.addEventListener('click', toggleDayNight)
deckEl.addEventListener('click', deckClickHandler)
fieldEl.addEventListener('click', fieldTileClickHandler)
marioToggleEl.addEventListener('click', toggleMario)
playAgainBtn.addEventListener('click', reset)
playerHandEl.addEventListener('click', selectCardHandler)
resetBtnEl.addEventListener('click', reset)

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
    playerHandEl.addEventListener('click', selectCardHandler)
    deckEl.className = ""
    playAgainBtn.className = "btn btn-danger play-again-btn hidden"

    render()
    renderScorePile()
}

function fieldTileClickHandler(){
    let idAsInt = extractIndexFromId(event.target.id);

    if (isNaN(idAsInt)) return emptyFieldPlayHandler()
    if (player.selectedCard === null) return

    let fieldSelection = checkSuit(field[idAsInt])
    let playerSelection = checkSuit(player.selectedCard)
    
    if(playerSelection === fieldSelection){
        capturePair(idAsInt)
        disableHandSelection()
        setTimeout(()=> playTopTileFromDeck(), 1000)
    }
}

function emptyFieldPlayHandler(){
    if (player.selectedCard === null) return
    disableHandSelection()

    console.log('hand Selection Disabled')
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
    player.selectedCardIdx= idAsInt
    player.selectedCard = player.hand[idAsInt]
    renderPlayerHand();
    renderSelectedCard()
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
    }
    if (turn === -1) {
        setTimeout(()=>{
        computerTurn()
        }, 1000)
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

function handleGameEnd(){
    renderEndOfGameDisplay()
    renderWinningYaku()
    playAgainBtn.className = "btn btn-danger play-again-btn"
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

function render(){
    renderField();
    renderPlayerHand();
    renderComputerHand();
}

function renderTopDeckTileAnimation(){
    renderField()
    fieldEl.children[field.length - 1].className = "animate__animated animate__fadeInLeftBig"
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
        marioTheme === false ?
        fieldTile.innerHTML = `<img id='f${idx}' src="../assets/tiles/${i}.jpeg">`
        :
        fieldTile.innerHTML = `<img id='f${idx}' src="../assets/mario-tiles/${i}.png">`
        fieldEl.appendChild(fieldTile);
    })
}

function renderScorePile(){
    scorePileEl.innerHTML = ""
    player.scorePile.forEach(i => {
        let scoredTile = document.createElement('div')
        scoredTile.classList.add('scored-tile')
        marioTheme === false ?
        scoredTile.innerHTML = `<img src="../assets/tiles/${i}.jpeg">`
        :
        scoredTile.innerHTML = `<img src="../assets/mario-tiles/${i}.png">`
        scorePileEl.appendChild(scoredTile);
    })
}

function renderPlayerHand(){
    playerHandEl.innerHTML = ""
    player.hand.forEach((i, idx) => {
        let handTile = document.createElement('div')
        handTile.classList.add('hand-tile')
        marioTheme === false ?
        handTile.innerHTML =  `<img id='p${idx}' src="../assets/tiles/${i}.jpeg">`
        :
        handTile.innerHTML = `<img id='p${idx}' src="../assets/mario-tiles/${i}.png">`
        playerHandEl.appendChild(handTile);
    })
}

function renderComputerHand(){
    computerHandEl.innerHTML = ""
    computer.hand.forEach((i, idx) => {
        let compTile = document.createElement('div')
        compTile.classList.add('hand-tile')
        marioTheme === false ?
        compTile.innerHTML = `<img id='p${idx}' src="../assets/tiles/back.jpeg">`
        :
        compTile.innerHTML = `<img id='p${idx}' src="../assets/mario-tiles/mario-back.jpg">`
        computerHandEl.appendChild(compTile);
    })
}

function renderSelectedCard(){
    playerHandEl.children[player.selectedCardIdx].className = "selected hand-tile"
}

const renderEmptyDeck = () => deckEl.className="hidden"

function setTheme(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme;
    renderThemeUI();
}

function toggleDayNight() {
    if (localStorage.getItem('theme') === 'theme-mario-day') return setTheme('theme-mario-night')
    if (localStorage.getItem('theme') === 'theme-mario-night') return setTheme('theme-mario-day')
    if (localStorage.getItem('theme') === 'theme-day') return setTheme ('theme-night')
    if (localStorage.getItem('theme') === 'theme-night') return setTheme ('theme-day')
}

function toggleMario(){
    if (localStorage.getItem('theme') === 'theme-mario-day') {
        marioTheme = false
        setTheme('theme-day') 
        return render()
    }
    if (localStorage.getItem('theme') === 'theme-mario-night') {
        marioTheme = false
        setTheme('theme-night')
        return render()
    }
    if (localStorage.getItem('theme') === 'theme-day') {
        marioTheme = true
        setTheme ('theme-mario-day')
        return render()
    } 
    if (localStorage.getItem('theme') === 'theme-night') {
        marioTheme = true
        setTheme ('theme-mario-night')
        return render()
    }
}

(function () {
    if (localStorage.getItem('theme') === 'theme-mario-day') return setTheme('theme-mario-day')
    if (localStorage.getItem('theme') === 'theme-mario-night') return setTheme('theme-mario-night')

    localStorage.getItem('theme') === 'theme-day' ?
        setTheme('theme-day') 
    : 
        setTheme('theme-night')

    marioTheme = false;
    return render()
})()

function renderThemeUI() {
    if (localStorage.getItem('theme') === 'theme-day' || localStorage.getItem('theme') === 'theme-mario-day') {
        navbarEl.className = "navbar w-100 navbar-light bg-light"
        dayNightToggleEl.className = "btn w-100 btn-lg btn-outline-dark"
        dayNightToggleEl.innerHTML = `Night Mode <i class="bi bi-moon-stars-fill"></i>`
        dropdownBgEl.className = "dropdown-menu"
        dropdownBtnEl.className = "btn btn-light dropdown-toggle btn-lg"
        return renderThemeImages()
    } 
    if (localStorage.getItem('theme') === 'theme-night' || localStorage.getItem('theme') === 'theme-mario-night') {
        navbarEl.className = "navbar w-100 navbar-dark bg-dark"
        dayNightToggleEl.className = "btn w-100 btn-lg btn-outline-light"
        dayNightToggleEl.innerHTML = `Day Mode <i class="bi bi-brightness-high"></i>`
        dropdownBgEl.className = "dropdown-menu dropdown-menu-dark"
        dropdownBtnEl.className = "btn btn-dark dropdown-toggle btn-lg"
        return renderThemeImages();
    }    
}

function renderWinningYaku(){
    let winningYaku = yakuSets.filter(yaku => yaku.every(tile => player.scorePile.includes(tile)))

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

