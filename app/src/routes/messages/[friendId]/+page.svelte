<script lang="ts">
    import { onMount } from "svelte";
    import { SharedStore } from "$lib/stores/shared.svelte";
    import FriendHeader from "$lib/components/Chat/FriendHeader.svelte";
    import MessageForm from "$lib/components/Chat/MessageForm.svelte";
    import FriendMessage from "$lib/components/Chat/FriendMessage.svelte";
    import MyMessage from "$lib/components/Chat/MyMessage.svelte";
    import Alert from "$lib/components/Utils/Alert.svelte";
    import type { User, Friend } from "$lib/types";

    // Data from +page.server.ts
    interface Props {
        data: {
            profile: User;
            friend: Friend;
        }
    }

    let { data }: Props = $props();
    SharedStore.profile = data.profile;

    /**
     * If current friend is droid, send a welcome message as droid to user. Otherwise, connect
     * to the chat room of the current friend and user.
     */
    onMount(() => {

        if(data.friend._id === "droid")
        {
            // Get the first message from droid
            SharedStore.messages = [
                ...SharedStore.messages,
                {
                    senderId: "droid",
                    receiverId: data.profile._id,
                    content: `Hi, I'm ${data.friend.name}! I will send you a random message every time when you send me a message.`,
                    sentAt: new Date()
                }
            ]
        }

        document.querySelector('#chat .loading')?.remove();
    });

    // Scroll to bottom of messages when new message is added
    $effect(() => {
        SharedStore.messages.length; // to trigger reactivity

        const messagesDiv = document.getElementById("messages")!;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
</script>

<section id="chat">
    <FriendHeader name={data.friend.name} avatar={data.friend.avatar}/>
    <Alert message="Messages sent in the demo will not be saved to the MongoDB database."/>
    <div id="messages">
        <div class="loading">
            <span class = "loader"></span>
            <span>Loading...</span>
        </div>
        {#each SharedStore.messages as message}
            {#if message.senderId === data.profile._id && message.receiverId === data.friend._id}
                <MyMessage message={message.content}/>
            {:else if message.receiverId === data.profile._id && message.senderId === data.friend._id}
                <FriendMessage friendAvatar={data.friend.avatar} message={message.content}/>
            {/if}
        {/each}
    </div>
    <MessageForm friend={data.friend}/>
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
