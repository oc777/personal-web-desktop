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
    this.attempts = 0
    this.pairs = 0
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
      this.selectHandler(e)
    })
  }

  // Handler for click events on game board
  clickHandler (event) {
    // check if reset link was clicked
    if (event.target.id === 'reset') {
      event.preventDefault()
      this.reset()
      return
    }

    const brickIndex = parseInt(event.target.closest('.brick').getAttribute('data-brickIndex'))
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

  // handler for events on select element
  // (changing board size)
  selectHandler (event) {
    switch (event.target.value) {
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
    // console.log(this.rows)
    // console.log(this.cols)
    // console.log(this.boardSize)

    // reset the game only if new boar size was selected
    if (this.rows * this.cols !== this.boardSize) {
      this.reset()
    }
  }

  // resets the state of the game and redraws the board
  reset () {
    this.attempts = 0
    this.pairs = 0
    this.bricks = []
    this.turned1 = undefined
    this.turned2 = undefined
    this.isClickable = true

    this.gameDiv.textContent = ''
    this.drawBoard()
    this.selectBricks()
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

      this.attempts++

      // disable clicks on the board
      this.isClickable = false
      // check for a match
      if (this.turned1.getAttribute('class') === this.turned2.getAttribute('class')) {
        console.log('Pair!')
        this.pairs++
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

        if (this.boardSize / 2 === this.pairs) this.showFinalView()
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

  // render when game is won
  showFinalView () {
    const finalTemp = this.el.querySelector('#final-temp')
    const node = document.importNode(finalTemp.content, true)
    node.querySelector('#attempts').textContent = this.attempts
    this.gameDiv.appendChild(node)
  }
}

module.exports = Memory
