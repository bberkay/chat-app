<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import { currentMessages } from "$lib/stores";
    import FriendHeader from "$lib/components/Chat/FriendHeader.svelte";
    import MessageForm from "$lib/components/Chat/MessageForm.svelte";
    import FriendMessage from "$lib/components/Chat/FriendMessage.svelte";
    import MyMessage from "$lib/components/Chat/MyMessage.svelte";

    export let friend;
    export let userId;
    export let messages;

    // Add current messages to store
    currentMessages.set(messages);

    // Send first message if friend is droid
    onMount(() => {
        if(friend._id === "droid")
            currentMessages.update((messages) => [...messages, {senderId: "droid", receiverId: userId, content: `Hi, I'm ${friend.name}! I will send you a random message every time when you send me a message.`}]);
    });

    // Scroll to bottom of messages when new message is added
    afterUpdate(() => {
        const messagesDiv = document.getElementById("messages");
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
</script>

<section id="chat">
    <FriendHeader name="{friend.name}" avatar="{friend.avatar}"/>
    <div id="messages">
        {#each $currentMessages as message}
            {#if message.senderId === userId}
                <MyMessage message="{message.content}"/>
            {:else if message.receiverId === userId}
                <FriendMessage friendAvatar="{friend.avatar}" message="{message.content}"/>
            {/if}
        {/each}
    </div>
    <MessageForm friend="{friend}" userId="{userId}"/>
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