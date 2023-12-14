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

    /**
     * Droid logic
     * Send random message as droid after user send a message to droid.
     * Also add message sending animation and remove it after 1 second when droid send message.
     */
    currentMessages.subscribe((subscribeValue) => {
        if(subscribeValue.length > 0 && subscribeValue[subscribeValue.length - 1].receiverId === "droid" && friend._id === "droid")
        {
            // Message sending animation.
            currentMessages.update((innerSubscribeValue) => [...innerSubscribeValue, {senderId: "droid", receiverId: userId, content: "..." }]);

            // Send random message after 1 second.
            setTimeout(() => {
                currentMessages.update((innerSubscribeValue) => [
                        ...innerSubscribeValue,
                        {
                            senderId: "droid",
                            receiverId: userId,
                            content: friend.readyMessages[Math.floor(Math.random() * friend.readyMessages.length)]
                        }
                ]);
            }, 1000);

            // Remove message sending animation.
            setTimeout(() => {
                currentMessages.update((innerSubscribeValue) => innerSubscribeValue.filter((message) => message.content !== "..."));
            }, 1000);
        }
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