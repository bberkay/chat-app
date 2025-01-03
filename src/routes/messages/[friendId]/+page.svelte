<script lang="ts">
    import { onMount } from "svelte";
    import { afterUpdate } from "svelte";
    import { messagesStore, profileStore } from "$lib/stores";
    import FriendHeader from "$lib/components/Chat/FriendHeader.svelte";
    import MessageForm from "$lib/components/Chat/MessageForm.svelte";
    import FriendMessage from "$lib/components/Chat/FriendMessage.svelte";
    import MyMessage from "$lib/components/Chat/MyMessage.svelte";
    import Alert from "$lib/components/Utils/Alert.svelte";

    // Data from +page.server.ts
    export let data;
    profileStore.set(data.profile);

    /**
     * If current friend is droid, send a welcome message as droid to user. Otherwise, connect
     * to the chat room of the current friend and user.
     */
    onMount(() => {

        if(data.friend._id === "droid")
        {
            // Get the first message from droid
            messagesStore.update((messages) => [
                ...messages,
                {
                    senderId: "droid",
                    receiverId: data.profile._id,
                    content: `Hi, I'm ${data.friend.name}! I will send you a random message every time when you send me a message.`,
                    sentAt: new Date()
                }
            ]);
        }

        document.querySelector('#chat .loading')?.remove();
    });

    // Scroll to bottom of messages when new message is added
    afterUpdate(() => {
        const messagesDiv = document.getElementById("messages")!;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
</script>

<section id="chat">
    <FriendHeader name="{data.friend.name}" avatar="{data.friend.avatar}"/>
    <Alert message="Messages sent in the demo will not be saved to the MongoDB database. So messages will be lost when you refresh the page."/>
    <div id="messages">
        <div class="loading">
            <span class = "loader"></span>
            <span>Loading...</span>
        </div>
        {#each $messagesStore as message}
            {#if message.senderId === data.profile._id && message.receiverId === data.friend._id}
                <MyMessage message="{message.content}"/>
            {:else if message.receiverId === data.profile._id && message.senderId === data.friend._id}
                <FriendMessage friendAvatar="{data.friend.avatar}" message="{message.content}"/>
            {/if}
        {/each}
    </div>
    <MessageForm friend="{data.friend}"/>
</section>

<style>
    #chat {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%!important;
    }

    #messages{
        padding: 1.5rem 1.5rem 0;
        overflow-y: scroll;
        height: 100%;
    }
</style>
