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
    this.todoListId = undefined
  }

  init () {
    console.log('Hello world')
    const input = this.el.querySelector('input')
    input.addEventListener('keydown', e => {
      this.getInput(input, e, this.addToList.bind(this))
    })

    this.el.addEventListener('click', e => {
      console.log(e.target)
      if (e.target.parentNode.nodeName === 'OL') {
        console.log('todo lists')
        this.openList(e.target.id, e.target.innerText)
      } else if (e.target.parentNode.nodeName === 'UL') {
        console.log('todo items')
      }
    })
    // const list = this.el.querySelector('ol')
    // list.addEventListener('click', e => this.openList(e))

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

  printListEl (parent, txt, id) {
    const list = this.el.querySelector(parent)
    const li = document.createElement('li')

    if (parent === 'ol') {
      li.setAttribute('id', id)
      li.textContent = txt
      list.prepend(li)
    }

    if (parent === 'ul') {
      const tempTodo = this.el.querySelector('#todo-item')
      const todoItem = document.importNode(tempTodo.content, true)

      todoItem.querySelector('p').textContent = txt
      list.appendChild(todoItem)
    }
  }

  addNewTodo (todo) {
    console.log(todo)
    this.printListEl('ul', todo)
    const todoItem = {
      id: Date.now(),
      title: todo,
      status: 'pending'
    }
    this.todo = todoItem
    window.localStorage.setItem(this.todoListId, this.todo)
  }

  getAllTodoLists () {
    const todos = window.localStorage.getItem('todos')
    console.log(JSON.parse(todos))
    const lists = JSON.parse(todos)

    lists.forEach(list => this.printListEl('ol', list.title, list.id))

    return lists
  }

  openList (id, title) {
    this.todoListId = id
    if (window.localStorage.getItem('id') === null) {
      window.localStorage.setItem(id, '')
    } else {
      this.todo = window.localStorage.getItem(id)
    }

    this.el.querySelector('.lists').style.display = 'none'
    const todoPage = this.el.querySelector('.todos')
    const tempTodo = this.el.querySelector('#todo')
    const todoItems = document.importNode(tempTodo.content, true)

    todoItems.querySelector('h1').textContent = title
    todoPage.appendChild(todoItems)

    const input = this.el.querySelector('input[name=todo]')
    input.addEventListener('keydown', e => {
      this.getInput(input, e, this.addToList.bind(this))
    })
  }
}
// <i class="far fa-check-circle"></i>

module.exports = Todo
