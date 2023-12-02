<div class = "friend-message">
    <div class="message-avatar">
        <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar">
    </div>
    <div class="message-content">
        <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</span>
    </div>
</div>

<style>
    .friend-message{
        display: flex;
        flex-direction: row;
        margin-bottom: 20px;
        align-items:center;
    }

    .message-content{
        background-color: var(--current-front-color);
        border-radius: 10px;
        padding: 0.5rem 1rem;
        color: var(--current-text-color);
        border: 1px solid var(--current-border-color);
    }

    .message-avatar img{
        width: 1.5em;
        height: 1.5em;
        border-radius: 50%;
        margin-right: 10px;
    }
</style>

