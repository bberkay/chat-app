<script lang="ts">
    import { messages } from "$lib/stores/messages";
    import FriendHeader from "$lib/components/Chat/FriendHeader.svelte";
    import MessageForm from "$lib/components/Chat/MessageForm.svelte";
    import FriendMessage from "$lib/components/Chat/FriendMessage.svelte";
    import MyMessage from "$lib/components/Chat/MyMessage.svelte";

    export let friend;
    export let userId;
</script>

<section id="chat">
    <FriendHeader name="{friend.name}" avatar="{friend.avatar}"/>
    <div id="messages">
        {#each $messages as message}
            {#if message.senderId === userId}
                <MyMessage message="{message.message}"/>
            {:else}
                <FriendMessage friendAvatar="{friend.avatar}" message="{message.message}"/>
            {/if}
        {/each}
    </div>
    <MessageForm friendId="{friend._id}" userId="{userId}"/>
</section>

<style>
    #chat {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
    }

    #messages{
        padding:1.5rem;
        overflow-y: scroll;
        height: 100%;
    }
</style>