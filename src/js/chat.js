/**
 * Module for Chat app
 * @author Olga Christensen
 */

/**
 * Chat app
 * @constructor
 */
class Chat {
  constructor (element) {
    this.el = element
    this.username = undefined
    this.server = 'ws://vhost3.lnu.se:20080/socket/' // move to config?
    this.key = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd' // move to config?
    this.channel = 'chat channel'
  }

  init () {
    this.checkUsername()
  }

  checkUsername () {
    if (window.localStorage.getItem('username') === null) {
      this.getUsername()
    } else {
      this.username = window.localStorage.getItem('username')
      this.connect()
    }
  }

  getUsername () {
    this.el.querySelector('.loading').style.display = 'none'
    this.el.querySelector('.username').style.display = 'flex'
    const input = this.el.querySelector('input[name="username"]')
    input.addEventListener('keydown', e => {
      this.getInput(input, e, this.saveUsername.bind(this))
    })
  }

  getInput (input, e, callback) {
    if (e.keyCode === 13) {
      const msg = input.value
      console.log(msg)
      callback(msg)
    }
  }

  saveUsername (name) {
    this.username = name
    window.localStorage.setItem('username', this.username)
    this.connect()
  }

  connect () {
    this.el.querySelector('.body .loading').style.display = 'none'
    this.el.querySelector('.body .username').style.display = 'none'
    this.el.querySelector('.body .chat').style.display = 'flex'
  }
}

module.exports = Chat
