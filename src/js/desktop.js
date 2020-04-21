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

    this.chatWindows = []
    this.memoryWindows = []
    this.todoWindows = []

    this.contextMenu = document.getElementById('context-menu')
    this.quitAppLink = document.getElementById('quit-app')
    this.contextMenuVisible = false
  }

  /**
   * enable launching apps from Dock on click
   */
  initDock () {
    const dock = document.getElementById('dock')

    // events to launch apps
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

    // events to apps context menu
    dock.addEventListener('contextmenu', e => {
      e.preventDefault()
      if (e.target.closest('#chat')) {
        this.showOptions('chat', e)
      }
      if (e.target.closest('#memory')) {
        this.showOptions('memory', e)
      }
      if (e.target.closest('#todo')) {
        this.showOptions('todo', e)
      }
    })

    // event to close context menu
    window.addEventListener('click', e => {
      if (this.contextMenuVisible && !e.target.closest('#context-menu')) {
        this.contextMenu.style.display = 'none'
        this.contextMenuVisible = false
      }
    })

    // event to quit app
    this.quitAppLink.addEventListener('click', this.quitAppHandler.bind(this))
  }

  /**
   * open context menu to quit app
   * @param {string} app - app name o quit
   * @param {event} e - click event
   */
  showOptions (app, e) {
    // const menu = document.getElementById('context-menu')
    if (this[app + 'Windows'].length > 0) {
      this.contextMenu.setAttribute('data-app', app)
      const left = e.pageX
      const top = e.pageY - 30
      this.contextMenu.style.left = `${left}px`
      this.contextMenu.style.top = `${top}px`
      this.contextMenu.style.display = 'block'
      this.quitAppLink.textContent = `Quit ${app}`
      this.contextMenuVisible = true
    }
  }

  /**
   * Event handler to quit app
   * @param {event} e - click on context menu
   */
  quitAppHandler (e) {
    // get app name to quit
    const app = e.target.parentNode.attributes['data-app'].value

    // remove each open app div
    this[app + 'Windows'].forEach(i => {
      i.el.remove()
    })

    // reset app values
    this[app + 'Windows'] = []
    this[app + 'Id'] = 0
    this[app + 'OffsetX'] = 30
    this[app + 'OffsetY'] = 30

    // close menu
    this.contextMenu.style.display = 'none'
    this.contextMenuVisible = false
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
    this[app + 'Windows'].push(w)
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
