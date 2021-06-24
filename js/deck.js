class Deck {
    constructor() {
      this.deck = [];
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

    dealField(){
        let feild = this.deck.splice(this.deck.length -8, 8)
        return feild;
    }

    dealPlayerHand() {
        let playerHand = this.deck.splice(this.deck.length -8, 8)
        return playerHand;
    }

    dealComputerHand(){
        let computerHand = this.deck.splice(this.deck.length -8, 8)
        return computerHand;
    }

    deal(){
        this.reset()
        this.shuffle()
    }
}

const deck1 = new Deck();

export default Deck;

