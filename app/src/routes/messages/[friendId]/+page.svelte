<script lang="ts">
    import Chat from '$lib/components/Chat.svelte';
    import { messagesStore, profileStore } from "$lib/stores";
    import { onMount } from "svelte";

    // Data from +page.server.ts
    export let data;
    messagesStore.set(data.messages);
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
                    content: `Hi, I'm ${data.friend.name}! I will send you a random message every time when you send me a message.`
                }
            ]);
        }
    });
</script>

<Chat friend="{data.friend}" profile="{data.profile}"/>
