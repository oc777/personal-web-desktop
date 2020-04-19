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
    this.channel = 'chat'
    this.socket = undefined
  }

  init () {
    if (window.localStorage.getItem('username') === null) {
      this.getUsername()
    } else {
      this.username = window.localStorage.getItem('username')
      this.connect()
    }
  }

  // NB! socket.close()
  destroy () {
    this.socket.close()
  }

  getUsername () {
    // this.el.querySelector('.loading').style.display = 'none'
    this.el.querySelector('.username').style.display = 'flex'
    const input = this.el.querySelector('input[name="username"]')
    input.addEventListener('keydown', e => {
      this.getInput(input, e, this.saveUsername.bind(this))
    })
  }

  getInput (input, e, callback) {
    if (e.keyCode === 13 && input.value.length > 1) {
      const msg = input.value
      e.preventDefault()
      input.value = ''
      // console.log(msg)
      callback(msg)
    }
  }

  saveUsername (name) {
    this.username = name
    window.localStorage.setItem('username', this.username)
    this.connect()
  }

  connect () {
    // redraw the window
    // this.el.querySelector('.body .loading').style.display = 'none'
    this.el.querySelector('.body .username').style.display = 'none'
    this.el.querySelector('.body .chat').style.display = 'flex'

    const txtarea = this.el.querySelector('.chat .msg textarea')

    // connect to socket
    this.socket = new window.WebSocket(this.server)

    this.socket.addEventListener('open', event => {
      // add event listeners to send msg
      txtarea.addEventListener('keydown', (e) => {
        this.getInput(txtarea, e, this.sendMessage.bind(this))
      })
    })

    this.socket.addEventListener('message', event => {
      const data = JSON.parse(event.data)
      // console.log(data.type)
      if (data.type !== 'heartbeat') {
        this.printMessage(data)
      }
    })

    this.socket.addEventListener('error', event => {
      console.log(event.data)
      this.printMessage(JSON.parse(event.data))
    })
  }

  sendMessage (text) {
    // this.socket.send(JSON.stringify(data))
    // prepare msg object
    const data = {
      type: 'message',
      data: this.showEmoji(text),
      username: this.username,
      channel: this.channel,
      key: this.key
    }
    this.socket.send(JSON.stringify(data))
  }

  printMessage (msg) {
    console.log(msg)
    const conversation = this.el.querySelector('.conversation')
    const temp = this.el.querySelector('template')
    const msgBlock = document.importNode(temp.content, true)

    msgBlock.querySelector('.txt').textContent = msg.data
    msgBlock.querySelector('.user').textContent = ` ${msg.username} ${this.timestamp()} `
    conversation.appendChild(msgBlock)

    // scroll to bottom
    conversation.scrollTop = conversation.scrollHeight
  }

  timestamp () {
    const date = new Date()
    let hrs = date.getHours()
    let min = date.getMinutes()
    if (hrs < 10) hrs = `0${hrs}`
    if (min < 10) min = `0${min}`
    return `${hrs}:${min}`
  }

  showEmoji (txt) {
    console.log(txt)
    let msg = txt
    msg = msg.replace(/(:\)|\(:|:-\))/gi, '\u{1f642}')
    msg = msg.replace(/(:\(|\):|:-\()/gi, '\u{1f641}')
    msg = msg.replace(/(:\p|=\p|:-\p)/gi, '\u{1f61c}')
    msg = msg.replace(/(\8p|\8-p)/gi, '\u{1f92a}')
    msg = msg.replace(/(=-\)|=\))/gi, '\u{1f600}')
    msg = msg.replace(/(:[D]|:-[D])/gi, '\u{1f601}')
    msg = msg.replace('<3', '\u{1F5A4}')
    msg = msg.replace('</3', '\u{1F494}')
    msg = msg.replace('8)', '\u{1F60E}')
    msg = msg.replace('B)', '\u{1F913}')

    return msg
  }
}

module.exports = Chat
