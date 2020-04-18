/**
 * Module for managing Desktop
 * @author Olga Christensen
 */
const DTW = require('./window')

/**
 * Desktop manager
 * @constructor
 */
class Desktop {
  constructor () {
    // track number of initiated windows
    this.chatId = 0
    this.memoryId = 0
    this.todoId = 0

    // starting coordinates for app windows
    this.chatX = 0
    this.memoryX = 280
    this.todoX = 560
    this.chatY = 0
    this.memoryY = 0
    this.todoY = 0

    // offset for new app window
    this.chatOffsetX = 30
    this.memoryOffsetX = 30
    this.todoOffsetX = 30
    this.chatOffsetY = 30
    this.memoryOffsetY = 30
    this.todoOffsetY = 30
  }

  /**
   * enable launching apps from Dock on click
   * @todo add 'quit app'
   */
  initDock () {
    const dock = document.getElementById('dock')
    dock.addEventListener('click', event => {
      if (event.target.closest('#chat')) {
        this.getXY('chat')
        this.launch('chat', this.chatId++, this.chatX + this.chatOffsetX, this.chatY + this.chatOffsetY)
      }
      if (event.target.closest('#memory')) {
        this.getXY('memory')
        this.launch('memory', this.memoryId++, this.memoryX + this.memoryOffsetX, this.memoryY + this.memoryOffsetY)
      }
      if (event.target.closest('#todo')) {
        this.getXY('todo')
        this.launch('todo', this.todoId++, this.todoX + this.todoOffsetX, this.todoY + this.todoOffsetY)
      }
    })
  }

  /**
   * open new window / instance of an app
   * @param {string} app name
   * @param {number} id - app windows count
   * @param {number} x - starting position X
   * @param {number} y - starting position Y
   */
  launch (app, id, x, y) {
    const w = new DTW(id, x, y)
    w.openWindow(app)
  }

  /**
   * Calculate coordinates to open new window at
   * to prevent stacking
   *
   * @param {string} app - app name
   */
  getXY (app) {
    const wh = window.innerHeight
    const ww = window.innerWidth
    console.log(`width: ${ww}`)
    console.log(`height: ${wh}`)
    console.log(`offsetX: ${this[app + 'OffsetX']}`)
    console.log(`offsetY: ${this[app + 'OffsetY']}`)

    // if app window gets too close to browser's right edge
    if (this[app + 'OffsetX'] + this[app + 'X'] > ww - 200) {
      this[app + 'X'] += 30
      this[app + 'OffsetX'] = 30
      this[app + 'OffsetY'] = 30
    }
    this[app + 'OffsetX'] += 15

    // if app window gets too close to browser's bottom edge
    if (this[app + 'OffsetY'] > wh - 200) {
      this[app + 'X'] += 30
      this[app + 'OffsetX'] = 30
      this[app + 'OffsetY'] = 30
    }
    this[app + 'OffsetY'] += 15
  }
}

module.exports = Desktop
