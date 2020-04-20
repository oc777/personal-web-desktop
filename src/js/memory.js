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
    this.boardSize = 16
    this.bricks = []
    this.collection = [
      'atom', 'bath', 'bug', 'code', 'coffee', 'meteor',
      'keyboard', 'robot', 'terminal', 'rocket', 'sitemap', 'code-branch',
      'user-astronaut', 'satellite', 'user-secret', 'cat', 'dog', 'frog'
    ]
    this.turned1 = undefined
    this.turned2 = undefined
    this.gameDiv = undefined
    this.isClickable = true
  }

  init () {
    console.log('game on')
    this.gameDiv = this.el.querySelector('.game')
    this.drawBoard()
    this.selectBricks()

    this.gameDiv.addEventListener('click', e => {
      this.clickHandler(e)
    })
    this.gameDiv.addEventListener('keydown', e => {
      if (e.keyCode === 13) this.clickHandler(e)
    })
    this.el.querySelector('select').addEventListener('change', e => {
      console.log(e.target.value)
      switch (e.target.value) {
        case '1':
          this.rows = 4
          this.cols = 4
          break
        case '2':
          this.rows = 4
          this.cols = 6
          break
        case '3':
          this.rows = 6
          this.cols = 6
      }
      console.log(this.rows)
      console.log(this.cols)
      console.log(this.boardSize)
      if (this.rows * this.cols !== this.boardSize) {
        console.log('remove')
        this.gameDiv.textContent = ''
        this.drawBoard()
        this.selectBricks()
      }
    })
  }

  clickHandler (event) {
    const brickIndex = parseInt(event.target.closest('.brick').getAttribute('data-brickIndex'))
    console.log(this.isClickable)
    // check if target element or its parent has 'data-brickIndex'
    // check if the pair match is in progress
    if (Number.isInteger(brickIndex) && this.isClickable) {
      let icon
      // get the icon element
      switch (event.target.nodeName) {
        case 'DIV':
          icon = event.target.firstElementChild.firstElementChild
          break
        case 'A':
          icon = event.target.firstElementChild
          break
        default:
          icon = event.target
      }
      // console.log(event.target)
      // console.log(icon)

      this.turnBrick(brickIndex, icon)
    }
  }

  // dynamically draw the board
  drawBoard () {
    this.gameDiv.setAttribute('class', `game sq${this.cols}`)
    const brickTemp = this.el.querySelector('#brick-temp')
    this.boardSize = this.cols * this.rows
    for (let i = 0; i < this.boardSize; i++) {
      const node = document.importNode(brickTemp.content, true)
      node.firstElementChild.setAttribute('data-brickIndex', i)
      this.gameDiv.appendChild(node)
    }
  }

  // shuffles array element
  shuffleArray (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
  }

  // create an array of icons/bricks for the game
  selectBricks () {
    // make sure the bricks array is empty
    this.bricks = []
    // shuffle the collection
    this.shuffleArray(this.collection)
    // grab pairs of icons/bricks from collection
    // to this game selection
    for (let i = 0; i < this.boardSize / 2; i++) {
      this.bricks.push(this.collection[i])
      this.bricks.push(this.collection[i])
    }
    // shuffle this game bricks
    this.shuffleArray(this.bricks)
  }

  // turn the clicked brick
  // index of the brick in game bricks array
  // i element that was clicked
  turnBrick (index, el) {
    // show the icon
    el.setAttribute('class', `fas fa-${this.bricks[index]}`)

    // check for pair
    if (!this.turned1) {
      // first brick turned
      this.turned1 = el
      console.log(this.turned1)
    } else {
      // same el was clicked twice
      if (this.turned1 === el) return

      // second brick turned
      this.turned2 = el
      console.log(this.turned2)

      // disable clicks on the board
      this.isClickable = false
      // check for a match
      if (this.turned1.getAttribute('class') === this.turned2.getAttribute('class')) {
        console.log('Pair!')
        // mark the pair
        window.setTimeout(() => {
          // <i class="fas fa-trophy"></i>

          // change the icon to 'trophy' on both bricks
          this.turned1.setAttribute('class', 'fas fa-trophy')
          this.turned2.setAttribute('class', 'fas fa-trophy')
          // remove 'brickIndex' from both bricks to prevent clicking
          this.turned1.closest('.brick').removeAttribute('data-brickIndex')
          this.turned2.closest('.brick').removeAttribute('data-brickIndex')
          // prepare for the next pair
          this.turned1 = undefined
          this.turned2 = undefined

          // enable clicks on the board
          this.isClickable = true
        }, 500)
      } else {
        // not a pair
        window.setTimeout(() => {
          // turn the brick around again
          this.turned1.setAttribute('class', 'fas fa-question')
          this.turned2.setAttribute('class', 'fas fa-question')
          // prepare for the next pair
          this.turned1 = undefined
          this.turned2 = undefined

          // enable clicks on the board
          this.isClickable = true
        }, 500)
      }
    }
  }
}

module.exports = Memory
