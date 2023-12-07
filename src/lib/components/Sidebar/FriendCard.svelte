<script lang="ts">
    import type { User } from "$lib/database/types"
    import { messages } from "$lib/stores/messages";

    export let user; // user object

    /**
     * Show messages
     */
    function showMessages(user: User): void
    {
        messages.set(user);
    }
</script>

<div class="friend-card" on:click={showMessages(user)}>
    <div class="friend-avatar">
        <img src="{user.avatar}" alt="">
    </div>
    <div class="message-info">
        <span>{user.name}</span>
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
        color:var(--text-color);
    }

    .friend-card:hover{
        background-color:var(--border-color);
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
        color:var(--text-color);
    }

    .friend-card .friend-avatar img{
        margin-right:1rem;
        border-radius: 50%;
        width:3em;
        height:3em;
    }
</style>