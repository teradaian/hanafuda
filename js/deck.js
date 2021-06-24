class Deck {
    constructor() {
      this.deck = [];
      this.reset();
      this.shuffle();
      this.deal();
    }
    
    reset(){
      this.deck = []

      const suits = 
      ['Pine', 'Plum', 'Cherry', 'Wisteria',
      'Iris', 'Peony', 'Clover', 'Grass', 
      'Chrysanthemum', 'Maple', 'Willow', 'Paulownia']

      const values = ['0', '1', '2', '3']

      for (let suit in suits) {
        for (let value in values) {
          this.deck.push(`${suits[suit]}${values[value]}`)
        }
      }
    }

    shuffle() {
        const { deck } = this;
        let m = deck.length, i;
      
        while (m) {
          i = Math.floor(Math.random() * m--);
      
          [deck[m], deck[i]] = [deck[i], deck[m]];
        }
      
        return this;
      }

    dealFeild(){
        let feild = this.deck.splice(this.deck.length -8, 8)
        console.log(feild)
        return feild;
    }

    dealPlayerHand() {
        let playerHand = this.deck.splice(this.deck.length -8, 8)
        console.log(playerHand)
        return playerHand;
    }

    dealComputerHand(){
        let computerHand = this.deck.splice(this.deck.length -8, 8)
        console.log(computerHand)
        return computerHand;
    }

    deal(){
        this.dealFeild()
        this.dealPlayerHand()
        this.dealComputerHand()
    }

}

const deck1 = new Deck();

console.log(deck1.deck)
