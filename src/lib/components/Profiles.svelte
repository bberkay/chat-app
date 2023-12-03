<section id = "profiles">
    <div id="page-info">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path></svg>
        <span>You can change your current user by selecting some of the users below.</span>
    </div>
    <div id="profile-container">
        <div class="profile-card">
            <div class="profile-image">
                <img src="https://www.w3schools.com/howto/img_avatar.png" alt="">
            </div>
            <div class="profile-info">
                <span>John Doe</span>
                <button class = "selected" disabled>Selected</button>
            </div>
        </div>
        <div class="profile-card">
            <div class="profile-image">
                <img src="https://www.w3schools.com/howto/img_avatar.png" alt="">
            </div>
            <div class="profile-info">
                <span>John Doe</span>
                <button>Select</button>
            </div>
        </div>
        <div class="profile-card">
            <div class="profile-image">
                <img src="https://www.w3schools.com/howto/img_avatar.png" alt="">
            </div>
            <div class="profile-info">
                <span>John Doe</span>
                <button>Select</button>
            </div>
        </div>
    </div>
</section>

<style>
    #profiles{
        width:100%;
        padding:1rem;
    }

    #profiles #page-info{
        display:flex;
        align-items:center;
        padding:1rem;
        border:1px solid var(--current-border-color);
        border-radius: 5px;
        background-color: var(--current-front-bright-color);
        color: var(--current-text-color);
    }

    #profiles #page-info svg{
        margin-right:0.50rem;
    }

    #profiles #profile-container{
        display:flex;
        flex-wrap:wrap;
        justify-content:center;
        padding:1rem;
    }

    #profiles .profile-card{
        margin:1rem;
        padding:1rem 2rem;
        border:1px solid var(--current-border-color);
        border-radius: 5px;
        background-color: var(--current-front-color);
        color: var(--current-text-color);
    }

    #profiles .profile-info{
        display:flex;
        flex-direction:column;
        text-align: center;
    }

    #profiles .profile-card .profile-image{
        margin-bottom:1rem;
    }

    #profiles .profile-card .profile-image img{
        border-radius: 50%;
        width:8em;
        height:8em;
    }

    #profiles .profile-info span{
        margin-bottom:0.5rem;
    }

    #profiles .profile-info button{
        padding:0.5rem 1rem;
        border:1px solid var(--current-border-color);
        border-radius: 5px;
        background-color: var(--current-front-bright-color);
        color: var(--current-text-color);
        cursor:pointer;
        font-size:0.9rem;
    }

    #profiles .profile-info button.selected{
        background-color: var(--current-front-color);
        cursor:default;
    }

    #profiles .profile-info button:not(.selected):hover{
        filter: brightness(1.1);
    }

    #profiles .profile-info button:not(.selected):active{
        filter: brightness(0.9);
    }
</style>
