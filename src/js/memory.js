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
    this.shuffleCollection()
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

  shuffleCollection () {
    for (let i = this.collection.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.collection[i], this.collection[j]] = [this.collection[j], this.collection[i]]
    }
    console.log(this.collection)
  }
}

module.exports = Memory
