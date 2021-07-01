<img src="assets/readme/hana-banner.png" width=100% height=auto alt="Hanafuda banner">

Hanafuda, known colloquially as Koi Koi or Sakura among a variety of other names, is a traditional Japanese matching card game. The deck consists of 48 cards divided into 12 months, with each month represented by a symbol of Japanese nature. Each tile corresponds to a certain point value, although how these values are given varies greatly across region and individual household. For this reason, I decided to build this game based on the house rules my grandmother taught me growing up-- an easy to pick-up-and-play variant somewhere in the middle of Koi Koi and the Hawaiian variant of Sakura. 

## **RULES**
2 players

At the start of the game, the deck is shuffled and 8 tiles are dealt to both players. Then, 8 cards are dealt into the "field", which is the center of play. 

<p align="center">
  <img src="assets/readme/rules.png" width=auto height=331px;>
  <img src="assets/readme/hanafuda-main.png" width=auto height=331px;> 
</p>

The first player will select a tile from their hand and may either: 

1. Choose a tile with a matching suit in the field and collect both of them into their score-pile, or
2. Play a tile with no matching suit into the field, where it will stay and become fair game for the opponent.

Then, the top tile of the deck is revealed, and if it has a matching suit in the field, both are collected by the player into their score-pile. In the instance of multiple matching suits in the field, the highest value tile is selected. In the instance that 3 tiles of the same suit are in the field, revealing the 4th will automatically claim all 4.

The turn then passes to player 2, who repeats this process. 

The game ends when no player has tiles in their hands, and the deck is empty. Players then tally their scores and the highest score wins. Completed sets of specific cards are worth 50 points each, so it's often worth it to chase them in order to secure a victory! 

<img align="left" src="assets/readme/sets.png" width=30%% height=auto>

The combinations for these sets (also called Yaku), as well as a visual guide to the suits, is available within the game menu.

One final rule: 

'Fukeru': If either player manages to empty their entire hand with a score of under 20 points, the game immediately ends in their victory. 

## Getting Started

The game is deployed on netlify at https://hanafuda-sakura.netlify.app/. Rules and information on the tile suits and different sets are available from the in-game menu. The game will offer an option to play again upon ending, but you may also reset at any time from the menu as well.

## Extras

<img align="left" src="assets/readme/side-menu.png" width=30%% height=auto>
Nintendo started out as a manufacturer of Hanafuda cards long before it became the gaming behemoth it is today. As a result, the company created a special Mario edition of the game, which has been ported over as an additional theme. You can select it from the top-menu, and because it's only a cosmetic theme, you can toggle between the normal and Mario modes to see what was added to the tiles. It even has it's own light and dark theme!

Mario Theme - Day         |  Mario Theme - Night
:-------------------------:|:-------------------------:
<img src="assets/readme/mario-day.png" width=90% height=auto>  |  <img src="assets/readme/mario-night.png" width= 90% height=auto>

## Languages

* HTML
* CSS
* JavaScript

## Built With

* Bootstrap(https://getbootstrap.com/) - Components and light styling
* Bootstrap Icons (https://icons.getbootstrap.com/) - Light/Dark mode icons
* Animate.css(https://animate.style/) - Animations
* Gradient Animator (https://www.gradient-animator.com/) - BG gradients
* Hanafuda and Hanafuda Nintendo Tile sets courtesy of Wikipedia

## Authors

**Ian Terada** 

## Next Steps

* Improved Computer Logic
* Koi Koi Ruleset



