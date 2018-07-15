import { Davinci } from './core'

function show(cards) {
  cards.forEach(card => {
    console.log('color: ' + card.color + ', number: ' + card.number)
  })
}

export default class Main {
  constructor() {
    this.newGame()
  }

  newGame() {
    let game = new Davinci()

    console.log(game.players)
    console.log(game.cards)
  }
}
