<script lang="ts">
    import type { User } from '$lib/types';

    interface Props {
        user: User; // user object
    }

    let { user }: Props = $props();

    /**
     * Selects the user
     */
    async function selectUser(user: User): Promise<void>
    {
        // Send a request to the server to profile the user and save it to the cookies.
        const response = await fetch(`/api/profile/select?id=${user._id}`);
        if(response.ok) {
            window.location.reload();
        }
    }
</script>

<div class="profile-card">
    <div class="profile-image">
        <img src="/images/avatar/{user.avatar}" alt="selectable person">
    </div>
    <div class="profile-info">
        <span>{user.name}</span>
        <button onclick={async () => { await selectUser(user) }}>Select</button>
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
</style>
