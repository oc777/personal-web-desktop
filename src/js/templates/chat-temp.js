module.exports = `
<div class="chat-window">
    <div class="header">
        <span class="fa"><i class="far fa-comment-alt"></i></span>
        <span class="fa close"><i class="far fa-times-circle"></i></span>
    </div>
    <div class="body">
        <!--div class="loading">
            <span class="fa"><i class="fas fa-sync-alt fa-spin"></i></span>
        </div-->
        <div class="username">
            <p>Type your username and hit <i>enter</i> to start chatting!</p>
            <input type="text" name="username" required />
        </div>
        <div class="chat">
            <div class="conversation"></div>
            <div class="msg">
                <textarea id="msg" rows="3"> </textarea>
                <!--p class="btn"><span class="fa"><i class="far fa-paper-plane"></i></span></p-->
            </div>
            <template>
                <div class="block">
                    <p class="user"></p>
                    <p class="txt"></p>
                </div>
            </template>
        </div>
    </div>
</div>
`
