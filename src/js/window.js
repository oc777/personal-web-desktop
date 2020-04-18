/**
 * Module for managing Windows
 * @author Olga Christensen
 */
const chatTemp = require('./templates/chat-temp.js')
const memoryTemp = require('./templates/memory-temp.js')
const todoTemp = require('./templates/todo-temp.js')

/**
 * Window manager
 * @constructor
 */
class Window {
  constructor (id, x, y) {
    this.el = undefined
    this.x = x || 10
    this.y = y || 10
    this.offset = 30
    this.id = id || 0
    this.isDragged = false
    this.isFocused = false
  }

  /**
   * create app's div, add template and attach to DOM
   * @param {string} app - app name
   */
  openWindow (app) {
    const div = document.createElement('div')
    div.setAttribute('class', `window ${app}`)
    // enables focus/blur events on divs
    div.setAttribute('tabindex', this.id)
    div.innerHTML = this.loadTemplate(app)
    this.el = div
    this.setPosition()

    const dt = document.querySelector('main')
    dt.appendChild(div)

    // start application
    const App = require(`./${app}.js`)
    const application = new App(div)
    application.init()

    // add events handlers on window
    this.addCloseEvent()
    this.addDragEvent()
    this.addFocusEvent()
  }

  /**
   * event handler to close a window
   */
  addCloseEvent () {
    // console.log(this.el)
    this.el.querySelector('.close').addEventListener('click', event => {
      this.el.remove()
    })
  }

  /**
   * event handler to set/remove focus
   */
  addFocusEvent () {
    this.el.addEventListener('focus', event => {
      this.el.style.zIndex = 1000
    })
    this.el.addEventListener('blur', event => {
      this.el.style.zIndex = 1
    })
  }

  /**
   * event handler for dragging a window
   */
  addDragEvent () {
    let offsetx, offsety

    this.el.querySelector('.header').addEventListener('mousedown', e => {
      this.el.style.zIndex = 1000
      dragStart(e)
    })

    const dragStart = (e) => {
      // e.preventDefault()
      this.isDragged = true
      offsetx = this.x - e.clientX
      offsety = this.y - e.clientY

      document.addEventListener('mouseup', dragStop)
      document.addEventListener('mousemove', drag)
    }

    const dragStop = () => {
      this.isDragged = false
      // this.el.style.zIndex = 1
      document.removeEventListener('mouseup', dragStop)
      document.removeEventListener('mousemove', drag)
    }

    const drag = (e) => {
      if (this.isDragged) {
        // prevent dragging outside of browser's window
        if (e.clientX > 0 && e.clientX < window.innerWidth && e.clientY < window.innerHeight && e.clientY > 0) {
          this.x = e.clientX + offsetx
          this.y = e.clientY + offsety

          this.el.style.left = `${this.x}px`
          this.el.style.top = `${this.y}px`
        }
      }
    }
  }

  /**
   * Select template for the app
   * @param {string} app - app name
   */
  loadTemplate (app) {
    switch (app) {
      case 'chat':
        return chatTemp
      case 'memory':
        return memoryTemp
      case 'todo':
        return todoTemp
    }
  }

  /**
   * add CSS rules to the window
   * for placing it on the Desktop
   */
  setPosition () {
    this.el.style.left = `${this.x}px`
    this.el.style.top = `${this.y}px`
  }
}

module.exports = Window
