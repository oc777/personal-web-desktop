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
    this.todoLists = []
    this.todoItems = []
    this.todoListId = undefined
  }

  init () {
    // press enter to create new list
    const input = this.el.querySelector('input')
    input.addEventListener('keydown', e => {
      this.getInput(input, e, this.addToList.bind(this))
    })

    // listen to clicks on all elements
    this.el.addEventListener('click', e => {
      console.log(e.target)
      if (e.target.parentNode.nodeName === 'OL') {
        // ol - todo lists
        console.log('todo lists')
        this.openList(e.target.id, e.target.innerText)
      } else if (e.target.parentNode.nodeName === 'UL') {
        // ul - todo items in a specific list
        console.log('todo items')
      }
    })

    // render lists if saved
    if (window.localStorage.getItem('todoLists') !== null) {
      this.todoLists = this.getAllTodoLists()
    }
  }

  // get text from input field
  getInput (input, e, callback) {
    if (e.keyCode === 13 && input.value.length > 1) {
      const msg = input.value
      e.preventDefault()
      input.value = ''
      console.log(e.target.name)
      callback(msg, e)
    }
  }

  // add item as a list or as todo
  addToList (msg, e) {
    // console.log(msg)
    if (e.target.name === 'title') {
      this.addNewList(msg)
    } else if (e.target.name === 'todo') {
      this.addNewTodo(msg)
    }
  }

  // render new list and save to storage
  addNewList (title) {
    // console.log(title)
    this.printListEl('ol', title)
    const todoList = {
      id: Date.now(),
      title: title
    }
    this.todoLists.push(todoList)
    window.localStorage.setItem('todoLists', JSON.stringify(this.todoLists))
  }

  // render a LI element
  printListEl (parent, txt, id) {
    const list = this.el.querySelector(parent)
    const li = document.createElement('li')

    // list name
    if (parent === 'ol') {
      li.setAttribute('id', id)
      li.textContent = txt
      list.prepend(li)
    }

    // todo item
    if (parent === 'ul') {
      const tempTodo = this.el.querySelector('#todo-item')
      const todoItem = document.importNode(tempTodo.content, true)

      todoItem.querySelector('p').textContent = txt
      list.appendChild(todoItem)
    }
  }

  // render new todo item and add to storage
  addNewTodo (todo) {
    // console.log(todo)
    this.printListEl('ul', todo)
    const todoItem = {
      id: Date.now(),
      title: todo,
      status: 'pending'
    }
    this.todoItems.push(todoItem)
    console.log(this.todoItems)
    window.localStorage.setItem(this.todoListId, JSON.stringify(this.todoItems))
  }

  // get lists from storage and render
  getAllTodoLists () {
    const todoLists = window.localStorage.getItem('todoLists')
    const lists = JSON.parse(todoLists)
    console.log(lists)

    lists.forEach(list => this.printListEl('ol', list.title, list.id))

    return lists
  }

  // get todo items from storage for specific List id
  // render new view
  openList (id, title) {
    this.todoListId = id
    this.todoItems = []
    if (window.localStorage.getItem(id) === null) {
      window.localStorage.setItem(id, '')
    } else {
      const todos = window.localStorage.getItem(id)
      this.todoItems = JSON.parse(todos)
    }

    // render view
    this.el.querySelector('.lists').style.display = 'none'
    const todoPage = this.el.querySelector('.todos')
    const tempTodo = this.el.querySelector('#todo')
    const todoItems = document.importNode(tempTodo.content, true)

    todoItems.querySelector('h1').textContent = title
    todoPage.appendChild(todoItems)

    // if items already exist
    if (todoItems.length !== 0) {
      this.todoItems.forEach(todo =>
        this.printListEl('ul', todo.title, todo.id)
      )
    }

    // listen to input
    const input = this.el.querySelector('input[name=todo]')
    input.addEventListener('keydown', e => {
      this.getInput(input, e, this.addToList.bind(this))
    })
  }
}
// <i class="far fa-check-circle"></i>

module.exports = Todo
