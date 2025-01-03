<script lang="ts">
    interface Props {
        friendAvatar: string;
        message: string;
    }

    let { friendAvatar, message }: Props = $props();
</script>

<div class = "friend-message">
    <div class="message-avatar">
        <img src="/images/avatar/{friendAvatar}" alt="Avatar">
    </div>
    <div class="message-content">
        <span>{message}</span>
    </div>
</div>

<style>
    .friend-message{
        display: flex;
        flex-direction: row;
        margin-bottom: 20px;
        align-items:center;
    }

    .message-content{
        background-color: var(--front-color);
        border-radius: 10px;
        padding: 0.4rem 0.7rem;
        color: var(--text-color);
        border: 1px solid var(--border-color);
    }

    .message-avatar img{
        width: 1.5em;
        height: 1.5em;
        border-radius: 50%;
        margin-right: 10px;
    }
</style>
