<div class="friend-card">
    <div class="friend-avatar">
        <img src="https://www.w3schools.com/howto/img_avatar.png" alt="">
    </div>
    <div class="message-info">
        <span>İsim Soyisim</span>
        <span>Lorem ipsum dolor sit amet...</span>
    </div>
</div>

<style>
    .friend-card{
        display:flex;
        align-items:center;
        justify-content: flex-start;
        padding:1rem;
        cursor:pointer;
        color:var(--current-text-color);
    }

    .friend-card:hover{
        background-color:var(--current-border-color);
    }

    .friend-card:active{
        opacity:0.8;
    }

    .friend-card .message-info{
        display:flex;
        flex-direction: column;
    }

    .friend-card .message-info span:first-child{
        font-weight: bold;
    }

    .friend-card .message-info span:last-child{
        font-size: 0.8rem;
        color:var(--current-text-color);
    }

    .friend-card .friend-avatar img{
        margin-right:1rem;
        border-radius: 50%;
        width:3em;
        height:3em;
    }
</style>