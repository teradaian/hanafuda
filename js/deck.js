class Deck {
    constructor() {
      this.deck = [];
  
      const suits = ['Pine', 'Plum', 'Cherry', 'Wisteria', 'Iris', 'Peony', 'Clover', 'Grass', 'Chrysanthemum', 'Maple', 'Willow', 'Paulownia'];
      const values = ['0', '1', '2', '3'];
  
      for (let suit in suits) {
        for (let value in values) {
          this.deck.push(`${values[value]} of ${suits[suit]}`);
        }
      }
    }
  }
  
  const deck1 = new Deck();
  console.log(deck1.deck);

export default deck;