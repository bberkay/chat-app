<section id = "friend-header">
    <div id="friend-info">
        <div id="friend-avatar">
            <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar">
        </div>
        <div id="friend-name">
            <span>İsim Soyisim</span>
        </div>
    </div>
</section>

<style>
    #friend-header{
        width:100%;
        height:5rem;
        background-color: var(--current-front-color);
        color: var(--current-text-color);
    }

    #friend-info{
        height:100%;
        display:flex;
        flex-direction:row;
        align-items:center;
        justify-content:flex-start;
        padding-top:0.2rem;
        padding-left:1rem;
    }

    #friend-avatar{
        margin-right: 1rem;
    }

    #friend-avatar img{
        width:2.5em;
        height:2.5em;
        border-radius: 50%;
    }

    #friend-name{
        font-size:1rem;
        font-weight:bold;
    }
</style>