<script lang="ts">
    import Chat from '$lib/components/Chat.svelte';
    import { currentMessages } from "$lib/stores";
    import { onMount } from "svelte";

    export let data; // data from server

    // Add current messages to store
    currentMessages.set(data.messages);

    /**
     * If current friend is droid, send a welcome message as droid to user. Otherwise, connect
     * to the chat room of the current friend and user.
     */
    onMount(() => {
        if(data.friend._id === "droid")
        {
            // Get the first message from droid
            currentMessages.update((messages) => [
                ...messages,
                {
                    senderId: "droid",
                    receiverId: data.userId,
                    content: `Hi, I'm ${data.friend.name}! I will send you a random message every time when you send me a message.`
                }
            ]);
        }
    });

    // Listen to new messages from server
    const socket = new WebSocket(`ws://localhost:3000/chat/${data.userId}/${data.friend._id}`);
    socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        currentMessages.update((messages) => [...messages, message]);
    });
</script>

<Chat friend="{data.friend}" userId="{data.userId}"/>
