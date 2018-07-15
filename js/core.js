/**
 * 初始化若干名玩家
 * @param {number} number 玩家数
 * @returns {[{order: number, hand: [{color: string, number: number}]}]} 这名玩家的手牌
 */
function initializePlayers(number) {
  let z = []

  for (let i = 0; i < number; i++) {
    z.push({
      order: i,
      hand: []
    })
  }

  return z
}

/**
 * 洗牌（打乱一个数组）
 * @param {[any]} list 要打乱顺序的数组
 * @returns {[any]} 已被打乱顺序的数组
 */
function shuffle(list) {
  return list.sort(() => Math.random() - 0.5)
}

/**
 * 初始化牌组
 * @param {number} maxNumber 卡牌上的最大数字
 * @returns {[{color: string, number: number}]} 初始化的按顺序排好的卡牌
 */
function initializeCardBox(maxNumber) {
  let cardBox = []
  let colors = ['black', 'white']

  colors.forEach(color => {
    for (let i = 0; i <= maxNumber; i++) {
      cardBox.push({
        color: color,
        number: i
      })
    }
  })

  return cardBox
}

export class Davinci {
  /**
   * 游戏主进程
   * @param {number} maxNumber 最大卡牌数字（默认11）
   * @param {number} playerNumber 玩家数（本游戏适合2~4人游玩，默认3人）
   */
  constructor(maxNumber, playerNumber) {
    if (maxNumber === undefined) {
      maxNumber = 11
    }
    if (playerNumber === undefined) {
      playerNumber = 3
    }

    this.maxNumber = maxNumber
    this.playerNumber = playerNumber
    this.players = initializePlayers(playerNumber)
    this.cards = initializeCardBox(maxNumber)

    // 指定游戏是否允许玩家主动选择要抽取的牌的颜色
    this.allowColorSelection = true

    // 洗牌
    shuffle(this.cards)

    // 发牌
    this.deal()

    this.gameRunning = true
    this.currentPlayer = 0

    let rd = 0
    while (this.gameRunning) {
      this.nextRound()
      rd++
      if (rd > 13) {
        this.gameRunning = false
      }
    }
  }

  nextRound() {
    let nextCard = this.drawCardWithSelection()
    if (nextCard) {
      this.players[this.currentPlayer].hand.push(nextCard)
    }
    else {
      console.warn('牌组空了')
    }

    // Do something

    this.currentPlayer = (this.currentPlayer + 1 + this.playerNumber) % this.playerNumber
  }

  /**
   * 发牌环节
   */
  deal() {
    // 初始手牌数
    let initialHandNumber = Math.floor((this.maxNumber + 1) / this.playerNumber)

    for (let i = 0; i < this.playerNumber; i++) {
      for (let j = 0; j < initialHandNumber; j++) {
        this.players[i].hand.push(this.drawCardWithSelection())
      }
    }
  }

  /**
   * 抽牌动作
   * @param {[{color: string, number: number}]} cardBox 牌组
   * @param {string} color 要抽的牌的颜色
   * @returns {{color: string, number: number} | undefined} 如果有这种颜色的牌剩余，返回一张这样的牌，牌组中除去这张牌，否则返回undefined，牌组不变
   */
  drawCard(color) {
    if (color === undefined) {
      if (this.cards.length > 0) {
        return this.cards.shift()
      }
      else {
        return undefined
      }
    }
    else {
      let c = this.cards.find(x => x.color == color)

      if (c) {
        this.cards = this.cards.filter(
          x => !(
            x.color === c.color
            && x.number === c.number
          )
        )

        return c
      }
      else {
        return undefined
      }
    }
  }

  drawCardWithSelection() {
    return this.drawCard((() => {
      if (this.allowColorSelection) {
        if (!this.cards.find(x => x.color === 'black')) {
          return 'white'
        }
        else if (!this.cards.find(x => x.color === 'white')) {
          return 'black'
        }
        // Input a color
        return 'black' // The color
      }
      else {
        return undefined
      }
    })())
  }
}
