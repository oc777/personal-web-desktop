module.exports = `
<div class="todo-window">
    <div class="header">
        <span class="fa"><i class="far fa-check-square"></i></span>
        <span class="fa close"><i class="far fa-times-circle"></i></span>
    </div>
    <div class="body">
        <div class="lists">
            <h1>My TODO lists</h1>
            <input type="text" name="title" placeholder="Add new list name & hit enter"></input>
            <ol></ol>
        </div>
        <div class="todos"></div>
    </div>
    <template id="todo">
        <h1></h1>
        <input type="text" name="todo" placeholder="Add new TODO & hit enter"></input>
        <ul></ul>
    </template>
    <template id="todo-item">
        <li class="pending">
            <i class="far fa-circle"></i>
            <p></p>
            <i class="far fa-times-circle"></i>
        </li>
    </template>
</div>
`
