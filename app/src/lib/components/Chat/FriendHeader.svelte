<script lang="ts">
    // Current chatting friend
    export let name: string;
    export let avatar: string;
</script>

<div id = "friend-header">
    <div id="friend-info">
        <div id="friend-avatar">
            <img src="{avatar}" alt="Avatar">
        </div>
        <div id="friend-name">
            <span>{name}</span>
        </div>
    </div>
</div>

<style>
    #friend-header{
        width:100%;
        padding:0.5rem 0;
        background-color: var(--front-color);
        color: var(--text-color);
        border-bottom:2px solid var(--border-color);
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