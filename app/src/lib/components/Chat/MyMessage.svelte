<script lang="ts">
    export let message;
</script>

<div class = "my-message">
    <div class="message-content">
        <span>{message}</span>
    </div>
</div>

<style>
    .my-message{
        display: flex;
        flex-direction: row;
        margin-bottom: 20px;
        align-items:center;
        justify-content:flex-end;
    }

    .message-content{
        background-color: var(--front-bright-color);
        border-radius: 10px 10px 0 10px;
        padding: 0.4rem 0.7rem;
        color: var(--text-color);
    }

    .message-avatar img{
        width: 1.5em;
        height: 1.5em;
        border-radius: 50%;
        margin-right: 10px;
    }
</style>

