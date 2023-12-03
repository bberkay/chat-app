<div id="profile-card-container">
    <div id = "profile-card">
        <div id = "profile-info">
            <img src="https://www.w3schools.com/howto/img_avatar.png" alt="">
            <span><b>İsim Soyisim</b><br><small><i>My Profile</i></small></span>
        </div>
        <a href="/profiles">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M253.66,133.66l-24,24a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L216,132.69V128A88,88,0,0,0,56.49,76.67a8,8,0,0,1-13-9.34A104,104,0,0,1,232,128v4.69l10.34-10.35a8,8,0,0,1,11.32,11.32Zm-41.18,55A104,104,0,0,1,24,128v-4.69L13.66,133.66A8,8,0,0,1,2.34,122.34l24-24a8,8,0,0,1,11.32,0l24,24a8,8,0,0,1-11.32,11.32L40,123.31V128a87.62,87.62,0,0,0,22.24,58.41A79.66,79.66,0,0,1,98.3,157.66a48,48,0,1,1,59.4,0,79.59,79.59,0,0,1,36.08,28.78,89.68,89.68,0,0,0,5.71-7.11,8,8,0,0,1,13,9.34ZM128,152a32,32,0,1,0-32-32A32,32,0,0,0,128,152Zm0,64a88.2,88.2,0,0,0,53.92-18.49,64,64,0,0,0-107.84,0A87.57,87.57,0,0,0,128,216Z"></path></svg>
        </a>
    </div>
</div>

<style>
    #profile-card-container{
        position:absolute;
        bottom:0;
        width:100%;
    }

    #profile-card{
        display:flex;
        align-items:center;
        justify-content: space-between;
        cursor:pointer;
        margin-top:-3px;
        border-top:2px solid var(--current-border-color);
        color:var(--current-text-color);
        padding:1rem;
        background-color:var(--current-front-color);
    }

    #profile-card #profile-info{
        display:flex;
        align-items:center;
    }

    #profile-card img{
        margin-right:1rem;
        border-radius: 50%;
        width:3em;
        height:3em;
    }

    #profile-card a{
        padding:0.4rem 0.4rem 0.2rem 0.4rem;
        border:1px solid var(--current-border-color);
        background-color:var(--current-front-bright-color);
        border-radius:5px;
    }

    #profile-card a svg{
        color:var(--current-text-color);
        width:1.5em;
        height:1.5em;
    }

    #profile-card a:hover{
        filter: brightness(1.1);
    }

    #profile-card a:active{
        filter: brightness(0.9);
    }
</style>