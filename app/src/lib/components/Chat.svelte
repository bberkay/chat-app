<script lang="ts">
    import { userMessages } from "$lib/stores";
    import FriendHeader from "$lib/components/Chat/FriendHeader.svelte";
    import MessageForm from "$lib/components/Chat/MessageForm.svelte";
    import FriendMessage from "$lib/components/Chat/FriendMessage.svelte";
    import MyMessage from "$lib/components/Chat/MyMessage.svelte";
    import { afterUpdate } from "svelte";

    export let friend;
    export let userId;
    export let messages;

    // Add current messages to store
    userMessages.set(messages);

    // Scroll to bottom of messages when new message is added
    afterUpdate(() => {
        const messages = document.getElementById("messages");
        messages.scrollTop = messages.scrollHeight;
    });
</script>

<section id="chat">
    <FriendHeader name="{friend.name}" avatar="{friend.avatar}"/>
    <div id="messages">
        {#each $userMessages as message}
            {#if message.senderId === userId}
                <MyMessage message="{message.content}"/>
            {:else}
                <FriendMessage friendAvatar="{friend.avatar}" message="{message.content}"/>
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
        padding: 1.5rem 1.5rem 0;
        overflow-y: scroll;
        height: 100%;
    }
</style>