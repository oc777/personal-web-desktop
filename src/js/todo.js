/**
 * Module for TODO app
 * @author Olga Christensen
 */

/**
 * TODO app
 * @constructor
 */
class Todo {
  constructor (element) {
    this.el = element
    this.todos = []
    this.todo = {}
  }

  init () {
    console.log('Hello world')
    const input = this.el.querySelector('input')
    input.addEventListener('keydown', e => {
      this.getInput(input, e, this.addToList.bind(this))
    })

    const list = this.el.querySelector('ol')
    list.addEventListener('click', e => this.openList(e))

    if (window.localStorage.getItem('todos') !== null) {
      this.todos = this.getAllTodoLists()
    }
  }

  getInput (input, e, callback) {
    if (e.keyCode === 13 && input.value.length > 1) {
      const msg = input.value
      e.preventDefault()
      input.value = ''
      console.log(e.target.name)
      callback(msg, e)
    }
  }

  addToList (msg, e) {
    console.log(msg)
    if (e.target.name === 'title') {
      this.addNewList(msg)
    } else if (e.target.name === 'todo') {
      this.addNewTodo(msg)
    }
  }

  addNewList (title) {
    console.log(title)
    // const list = this.el.querySelector('ol')
    // const li = document.createElement('li')
    // li.textContent = title
    // list.prepend(li)
    this.printListEl('ol', title)
    const todoList = {
      id: Date.now(),
      title: title
    }
    this.todos.push(todoList)
    window.localStorage.setItem('todos', JSON.stringify(this.todos))
  }

  printListEl (parent, txt) {
    const list = this.el.querySelector(parent)
    const li = document.createElement('li')
    li.textContent = txt
    list.prepend(li)
  }

  addNewTodo (todo) {
    console.log(todo)
  }

  getAllTodoLists () {
    const todos = window.localStorage.getItem('todos')
    console.log(JSON.parse(todos))
    const lists = JSON.parse(todos)

    lists.forEach(list => this.printListEl('ol', list.title))

    return lists
  }
}
// <i class="far fa-check-circle"></i>

module.exports = Todo
