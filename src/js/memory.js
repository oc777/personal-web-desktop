/**
 * Module for Memory app
 * @author Olga Christensen
 */

/**
 * TODO app
 * @constructor
 */
class Memory {
  constructor (element, rows, cols) {
    this.el = element
    this.rows = rows || 4
    this.cols = cols || 4
    this.board = 0
    this.bricks = []
    this.collection = [
      'atom', 'bath', 'bug', 'code', 'coffee', 'meteor',
      'keyboard', 'robot', 'terminal', 'rocket', 'sitemap', 'code-branch',
      'user-astronaut', 'satellite', 'user-secret', 'cat', 'dog', 'frog'
    ]
    this.turned1 = undefined
    this.turned2 = undefined
    this.gameDiv = undefined
  }

  init () {
    console.log('game on')
    this.gameDiv = this.el.querySelector('.game')
    this.drawBoard()
    this.shuffleArray(this.collection)
    this.selectBricks()
  }

  drawBoard () {
    this.gameDiv.classList.add(`sq${this.rows}`)
    const brickTemp = this.el.querySelector('#brick-temp')
    this.board = this.rows * this.rows
    for (let i = 0; i < this.board; i++) {
      const node = document.importNode(brickTemp.content, true)
      this.gameDiv.appendChild(node)
    }
  }

  shuffleArray (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
  }

  selectBricks () {
    for (let i = 0; i < this.board / 2; i++) {
      this.bricks.push(this.collection[i])
      this.bricks.push(this.collection[i])
    }
    this.shuffleArray(this.bricks)
  }
}

module.exports = Memory
