<script lang="ts">
    import Chat from '$lib/components/Chat.svelte';
    import { Client } from '$lib/classes/Client';
    import { messagesStore, clientStore } from "$lib/stores";
    import { onMount } from "svelte";

    export let data; // data from server

    // Add current messages to store
    messagesStore.set(data.messages);

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
                    receiverId: data.userId,
                    content: `Hi, I'm ${data.friend.name}! I will send you a random message every time when you send me a message.`
                }
            ]);
        }
    });

    // Listen to messages from server.
    const client = new Client(data.userId, data.friend._id);
    clientStore.set(client);
    client.getSocket().addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        messagesStore.update((messages) => [...messages, message]);
    });
</script>

<Chat friend="{data.friend}" userId="{data.userId}"/>
