/**
 * Module for TODO app
 * @author Olga Christensen
 */

/**
 * TODO app
 * @constructor
 *
 * @todo go back from todo items to lists overview
 * @todo comment code
 * @todo rm event listeners?
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
      // console.log(e)
      if (e.target.closest('ol')) {
        // ol - todo lists
        if (e.target.className === 'far fa-times-circle') {
          this.deleteList(e.target.parentNode.parentNode)
        } else {
          this.openList(e.target.id, e.target.innerText)
        }
      } else if (e.target.closest('.todo-list') && e.target.nodeName !== 'P') {
        // ul - todo items in a specific list
        this.manageTodo(e.target)
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
    const todoList = {
      id: Date.now(),
      title: title
    }
    this.printListEl('ol', title, todoList.id)
    this.todoLists.push(todoList)
    window.localStorage.setItem('todoLists', JSON.stringify(this.todoLists))
  }

  // render a LI element
  printListEl (parent, txt, id, status) {
    const list = this.el.querySelector(parent)
    const li = document.createElement('li')

    // list name
    if (parent === 'ol') {
      li.setAttribute('id', id)
      li.textContent = txt
      const span = document.createElement('span')
      // span.setAttribute('class', 'fa-li')
      span.innerHTML = '<i class="far fa-times-circle"></i>'
      li.append(span)
      list.prepend(li)
    }

    // todo item
    if (parent === 'ul') {
      let template, node
      if (status === 'pending') {
        template = this.el.querySelector('#todo-item')
        node = document.importNode(template.content, true)
      } else if (status === 'done') {
        template = this.el.querySelector('#done-item')
        node = document.importNode(template.content, true)
      }

      node.querySelector('li').setAttribute('id', id)
      node.querySelector('p').textContent = txt

      status === 'pending'
        ? list.prepend(node)
        : list.appendChild(node)
    }
  }

  // render new todo item and add to storage
  addNewTodo (todo) {
    // console.log(todo)
    const todoItem = {
      id: Date.now(),
      title: todo,
      status: 'pending'
    }
    this.printListEl('ul', todo, todoItem.id, 'pending')
    this.todoItems.push(todoItem)
    window.localStorage.setItem(this.todoListId, JSON.stringify(this.todoItems))
  }

  // get lists from storage and render
  getAllTodoLists () {
    const todoLists = window.localStorage.getItem('todoLists')
    const lists = JSON.parse(todoLists)
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
    } else if (window.localStorage.getItem(id) !== '') {
      const todos = window.localStorage.getItem(id)
      this.todoItems = JSON.parse(todos)
    }

    // render view
    this.el.querySelector('.lists').style.display = 'none'
    const todoPage = this.el.querySelector('.todos')
    const tempTodo = this.el.querySelector('#todo-items')
    const todoItems = document.importNode(tempTodo.content, true)

    todoItems.querySelector('h1').textContent = title
    todoPage.appendChild(todoItems)

    // if items already exist
    if (todoItems.length !== 0) {
      this.todoItems.forEach(todo =>
        this.printListEl('ul', todo.title, todo.id, todo.status)
      )
    }

    // listen to input
    const input = this.el.querySelector('input[name=todo]')
    input.addEventListener('keydown', e => {
      this.getInput(input, e, this.addToList.bind(this))
    })
  }

  manageTodo (el) {
    const id = el.parentNode.id
    if (el.className === 'far fa-circle') {
      // set item as done
      el.setAttribute('class', 'far fa-check-circle')
      // move to the end of the list
      const li = el.closest('li')
      const clone = li.cloneNode(true)
      li.closest('ul').appendChild(clone)
      li.remove()
      // update status in storage
      this.updateStatus(id, 'done')
    }

    if (el.className === 'far fa-times-circle') {
      // delete item
      el.closest('li').remove()
      this.updateStatus(id, 'deleted')
      this.deleteTodo(id)
    }
  }

  updateStatus (todoId, status) {
    // update class obj first
    const i = this.todoItems.findIndex(x => x.id === parseInt(todoId))
    const o = this.todoItems[i]
    status === 'done'
      ? o.status = status
      : this.todoItems.splice(i, 1)

    window.localStorage.setItem(this.todoListId, JSON.stringify(this.todoItems))
  }

  deleteList (li) {
    // delete from lists
    const i = this.todoLists.findIndex(x => x.id === parseInt(li.id))
    this.todoLists.splice(i, 1)
    window.localStorage.setItem('todoLists', JSON.stringify(this.todoLists))

    // delete todo items from storage
    window.localStorage.removeItem(li.id)

    // remove from DOM
    li.remove()
  }
}

module.exports = Todo
