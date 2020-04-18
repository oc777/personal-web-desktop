'use strict'
const DTW = require('./window')

module.exports.init = () => {
  const dock = document.getElementById('dock')
  dock.addEventListener('click', event => {
    if (event.target.closest('#chat')) launch('chat')
    if (event.target.closest('#memory')) launch('memory')
    if (event.target.closest('#todo')) launch('todo')
  })

  function launch (app) {
    console.log('clicked!')
    const w = new DTW()
    w.openWindow(app)
  }
}
