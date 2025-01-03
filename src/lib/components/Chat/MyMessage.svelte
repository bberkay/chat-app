<script lang="ts">
    export let message: string;
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
</style>

