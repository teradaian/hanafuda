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
const fieldContEl       = document.querySelector('.field-container')
const marioToggleEl     = document.querySelector('#mario-toggle')
const navbarEl          = document.querySelector('.navbar')
const playAgainBtn      = document.querySelector('.play-again-btn')
const playerHandEl      = document.querySelector('.player-hand')
const resetBtnEl        = document.querySelector('.reset-btn')
const scorePileEl       = document.querySelector('.drawer')
const turnMsgEl         = document.querySelector('#turn-msg')

dayNightToggleEl.addEventListener('click', toggleDayNight)
deckEl.addEventListener('click', deckClickHandler)
fieldContEl.addEventListener('click', fieldTileClickHandler)
marioToggleEl.addEventListener('click', toggleMario)
playAgainBtn.addEventListener('click', reset)
playerHandEl.addEventListener('click', selectCardHandler)
resetBtnEl.addEventListener('click', reset)

init()

function init(){
    turn = 1
    isWinner = null
    deck = new Deck()
    deck.reset()
    deck.shuffle()
    player.hand = deck.dealPlayerHand()
    computer.hand = deck.dealComputerHand()
    field = deck.dealField()
    preventFourOfAKind()
    deckEl.className = ""
    playAgainBtn.className = "hidden"
    turnMsgEl.innerText = "It's your turn!"
    playerHandEl.addEventListener('click', selectCardHandler)

    render()
    renderScorePile()
}

function preventFourOfAKind(){
    let numSuitInField = field.reduce((acc, tile) => {
        if (checkSuit(tile) in acc) {
            acc[checkSuit(tile)] ++
        } else {
            acc[checkSuit(tile)] = 1
        }
        return acc;
    }, {})
    if(Object.values(numSuitInField).includes(4)){
        reset()
    }
}

function fieldTileClickHandler(){
    let idAsInt = extractIndexFromId(event.target.id)

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
    if (typeof tileID === undefined) return
    capturePair(tileID)
}

function testComputerTile(){
    let tileID = findIndexOfHighestMatch(computer.selectedCard)
    if (typeof tileID === undefined) return
    capturePair(tileID)
}

function testDeckTile(){
    let tileID = findIndexOfHighestMatch(topDeckTile)
    if (typeof tileID === undefined) return

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
    let arrOfMatchesByValue = field.filter(tileName => tileName.toLowerCase().includes(tileSuit.toLowerCase())).sort()
    if (arrOfMatchesByValue.length === 3) return captureAllFour(tileSuit)

    let indexOfHighestMatch = field.findIndex(name => name === arrOfMatchesByValue[0])
    return indexOfHighestMatch;
}

function captureAllFour(suit){
    if (turn === 1) {
        let playerTile = player.hand.splice(player.selectedCardIdx, 1).join('')
        setTimeout(() =>{
            player.scorePile.push(playerTile)
            field.forEach((i, idx) => {
                if (checkSuit(i) === suit){
                    player.scorePile.push(field[idx], 1)
                    field.splice(idx, 1)
                }
            })
            player.scorePile = filterScoringTiles(player.scorePile, tilesValues).sort()
            resetSelections()
            renderScorePile()
            render()
        }, 800)
    } else {
        let computerTile = computer.hand.splice(computer.selectedCardIdx, 1).join('')
        setTimeout(() =>{
            computer.scorePile.push(computerTile)
            field.forEach((i, idx) => {
                if (checkSuit(i) === suit){
                    computer.scorePile.push(field[idx], 1)
                    field.splice(idx, 1)
                }
            })
            resetSelections()
            render()
        }, 800)
    }
}

function extractIndexFromId(evtId){
    let idx = evtId.split('').filter(i => /\d/.test(i)).join('')
    return parseInt(idx);
}

function checkSuit(string){
    return string.slice(0, string.length -1);
}

function captureMatchInField(id){
    let fieldTileMatch = field.splice(id, 1).join('')
    let playedFieldTile = field.pop()
    if (id !== undefined) renderMatchOnDrawAnimation(id)

    setTimeout(() =>{
        if (turn === 1) {
            player.scorePile.push(fieldTileMatch)
            player.scorePile.push(playedFieldTile)
            renderScorePile()
        } 
        if (turn === -1) {
            computer.scorePile.push(fieldTileMatch)
            computer.scorePile.push(playedFieldTile)
        }
        resetSelections()
        render()
        incrementTurn()
    }, 800)
}
           
function capturePair(id){
    let fieldTile = field.splice(id, 1).join('')
    if (turn === 1) {
        let playerTile = player.hand.splice(player.selectedCardIdx, 1).join('')

        renderMatchingPairAnimation(id)
        setTimeout(() =>{
            player.scorePile.push(fieldTile)
            player.scorePile.push(playerTile)
            player.scorePile = filterScoringTiles(player.scorePile, tilesValues).sort()
            resetSelections()
            renderScorePile()
            render()
        }, 800)
    } else {
        let computerTile = computer.hand.splice(computer.selectedCardIdx, 1).join('')

        renderMatchingPairAnimation(id)
        setTimeout(() =>{
            computer.scorePile.push(fieldTile)
            computer.scorePile.push(computerTile)
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
    return computer.hand.length > 1 ? Math.floor(Math.random() * computer.hand.length) : 0
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
        return calculateScore()
    }
    turn *= -1
    renderTurnMsg()

    if (turn === 1) {
        playerHandEl.addEventListener('click', selectCardHandler)
        deckEl.addEventListener('click', deckClickHandler)
    } else {
        setTimeout(() => { computerTurn() }, 1000)
    }
}

function renderTurnMsg(){
    if (turn === 1){
        turnMsgEl.innerText = "It's your turn"
    } else {
        turnMsgEl.innerText = "Computer Turn"
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

function endGame(){
    renderEndOfGameDisplay()
    renderWinningYaku()
    playAgainBtn.className = "btn btn-danger play-again-btn"
}

function calculateScore(){
    scorePlayerTiles()
    scoreComputerTiles()

    if(player.score === computer.score) return renderTieGame()
    player.score > computer.score ? isWinner = 1 : isWinner = -1

    endGame()
}

function scorePlayerTiles(){
    scoreTiles(player.scorePile, tilesValues, player)
    scoreYakus(player.scorePile, yakuSets, player)
}

function scoreComputerTiles(){
    scoreTiles(computer.scorePile, tilesValues, computer)
    scoreYakus(computer.scorePile, yakuSets, computer)
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
        if(isWinner === 1) {
            turnMsgEl.innerHTML =`You win! You scored ${player.score} and the computer scored ${computer.score}`
        } 
        if(isWinner === -1)
            turnMsgEl.innerHTML = `You lost! You scored ${player.score} and the computer scored ${computer.score}`
}

function renderTieGame(){
    let scoreMsg = document.createElement('div')
    scoreMsg.classList.add('score-message')
    scoreMsg.innerHTML =`<h1>Tie Game! You both scored ${player.score}!<h1>`
    fieldEl.appendChild(scoreMsg);
}

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
        renderSetTheme()
        return render()
    }
    if (localStorage.getItem('theme') === 'theme-mario-night') {
        marioTheme = false
        setTheme('theme-night')
        renderSetTheme()
        return render()
    }
    if (localStorage.getItem('theme') === 'theme-day') {
        marioTheme = true
        setTheme ('theme-mario-day')
        renderSetTheme()
        return render()
    } 
    if (localStorage.getItem('theme') === 'theme-night') {
        marioTheme = true
        setTheme ('theme-mario-night')
        renderSetTheme()
        return render()
    }
}

function renderSetTheme(){
    if(marioTheme === true){
        document.querySelector('#set-overlay').className = "hidden"
        document.querySelector('#mario-set-overlay').className = ""
        document.querySelector('#suits-overlay').className = "hidden"
        document.querySelector('#mario-suits-overlay').className = ""
    } 
    if(marioTheme === false){
        document.querySelector('#mario-set-overlay').className = "hidden"
        document.querySelector('#set-overlay').className = ""
        document.querySelector('#mario-suits-overlay').className = "hidden"
        document.querySelector('#suits-overlay').className = ""
    }
}

(function () {
    if (localStorage.getItem('theme') === 'theme-mario-day') {
        marioTheme = true
        setTheme('theme-mario-day')
        renderSetTheme()
    }
    if (localStorage.getItem('theme') === 'theme-mario-night') {
        marioTheme = true
        setTheme('theme-mario-night')
        renderSetTheme()
    }
    if (localStorage.getItem('theme') === 'theme-day'){
        marioTheme = false
        setTheme('theme-day') 
        renderSetTheme()
    }
    if (localStorage.getItem('theme') === 'theme-night'){
        marioTheme = false
        setTheme('theme-night')
        renderSetTheme()
    }
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

function renderThemeImages(){
    let carousel = document.querySelector(".carousel-inner")
    carousel.innerHTML = ""
    let carouselCards = document.createElement('div')
    carouselCards.innerHTML =  
    `<div class="carousel-item active">
    <img src="./assets/rules/rule1-${localStorage.getItem('theme')}.jpg" id="rule1" class="d-block w-100" alt="ruleset one"> </div>
    <div class="carousel-item">
    <img src="./assets/rules/rule2-${localStorage.getItem('theme')}.jpg" id='rule2' class="d-block w-100" alt="ruleset two"></div>
    <div class="carousel-item">
    <img src="./assets/rules/rule3-${localStorage.getItem('theme')}.jpg" id='rule3' class="d-block w-100" alt="ruleset three"></div>
     <div class="carousel-item">
    <img src="./assets/rules/rule4-${localStorage.getItem('theme')}.jpg" id='rule4' class="d-block w-100" alt="ruleset four"></div>`
  carousel.appendChild(carouselCards)
}