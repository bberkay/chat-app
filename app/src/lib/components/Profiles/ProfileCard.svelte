<script lang="ts">
    import type { User } from '$lib/types';
    import { profileStore } from '$lib/stores';

    export let user; // user object
    export let isSelected; // is the user selected

    /**
     * Selects the user
     */
    async function selectUser(user: User): void
    {
        // Send a request to the server to profile the user and save it to the cookies.
        fetch(`/api/profile/select`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (response) => {
            if (response.ok)
                profileStore.set(user);
        });
    }
</script>

<div class="profile-card">
    <div class="profile-image">
        <img src="{user.avatar}" alt="">
    </div>
    <div class="profile-info">
        <span>{user.name}</span>
        {#if isSelected}
            <button class = "selected" disabled>Selected</button>
        {:else}
            <button on:click={async () => { await selectUser(user) }}>Select</button>
        {/if}
    </div>
</div>

<style>
    .profile-card{
        margin:1rem;
        padding:1rem 2rem;
        border:1px solid var(--border-color);
        border-radius: 5px;
        background-color: var(--front-color);
        color: var(--text-color);
    }

    .profile-info{
        display:flex;
        flex-direction:column;
        text-align: center;
    }

    .profile-card .profile-image{
        margin-bottom:1rem;
    }

    .profile-card .profile-image img{
        border-radius: 50%;
        width:8em;
        height:8em;
    }

    .profile-info span{
        margin-bottom:0.5rem;
    }

    .profile-info button{
        padding:0.5rem 1rem;
        border:1px solid var(--border-color);
        border-radius: 5px;
        background-color: var(--front-bright-color);
        color: var(--text-color);
        cursor:pointer;
        font-size:0.9rem;
    }

    .profile-info button.selected{
        background-color: var(--front-color);
        cursor:default;
    }

    .profile-info button:not(.selected):hover{
        opacity:0.9;
    }

    .profile-info button:not(.selected):active{
        opacity:0.8;
    }
</style>