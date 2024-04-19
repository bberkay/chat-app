<script lang="ts">
    import type { User, Droid } from "$lib/types";
    import { messagesStore, clientStore, sessionIdStore } from "$lib/stores";
    import { get } from "svelte/store";
    import { onMount } from "svelte";

    // Component properties
    export let friend: User | Droid;
    export let profile: User;

    // Current message
    let message: string;

    onMount(() => {
        // Scroll to the bottom of the messages
        const messages = document.getElementById("messages")!;
        messages.scrollTop = messages.scrollHeight;

        // Focus on the message input
        document.getElementById("message-input")!.focus();
    });

    /**
     * Handle user's message input. If the user presses enter,
     * send the message.
     */
    function handleMessageInput(event: any): void
    {
        message = event.target.value;
        if(event.key === "Enter")
        {
            event.preventDefault();
            sendMessage();
        }
    }

    /**
     * Save the message to the store and send it to the server.
     */
    function sendMessage(): void
    {
        document.getElementById("message-input")!.innerText = "";
        if(message.length > 0){
            clientStore.subscribe((client) => {
                if(friend._id !== "droid")
                {
                    // Send message to the server
                    client.send({
                        sessionId: get(sessionIdStore),
                        senderId: profile._id,
                        receiverId: friend._id,
                        content: message
                    });
                }

                // Save message to the store
                messagesStore.update((messages) => [
                    ...messages,
                    {
                        sessionId: get(sessionIdStore),
                        senderId: profile._id,
                        receiverId: friend._id,
                        content: message
                    }
                ]);
            });
        }

        /**
         * Droid logic
         * Send random message as droid after user send a message to droid.
         */
        if(friend._id === "droid")
        {
            // Send random message after 1 second.
            setTimeout(() => {
                messagesStore.update((messages) => [
                    ...messages,
                    {
                        sessionId: get(sessionIdStore),
                        senderId: friend._id,
                        receiverId: profile._id,
                        content: (friend as Droid).readyMessages[Math.floor(Math.random() * (friend as Droid).readyMessages.length)]
                    }
                ]);
            }, 1000);
        }
    }
</script>

<div id = "message-form">
    <form>
        <input type="text" id = "message-input" on:keydown={handleMessageInput} autocomplete="off">
        <button id = "send-button" on:click={sendMessage}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.42,29.84l85.62,40.55,40.55,85.62A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14L118.42,148.9l47.24-47.25a8,8,0,0,0-11.31-11.31L107.1,137.58,24,98.22l.14,0L216,40Z"></path></svg>
        </button>
    </form>
</div>

<style>
    #message-form{
        width:100%;
        border-top: 2px solid var(--border-color);
    }

    #message-form form{
        padding:1.23rem 1rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    #message-form #message-input{
        width: 100%;
        padding: 0.5rem;
        height:1.4rem;
        margin-right: 0.5rem;
    }

    #message-form #send-button{
        background-color: var(--front-color);
        color: var(--background-color);
        border: 1px solid var(--border-color);
        border-radius: 5px;
        cursor: pointer;
        padding: 0.5rem 0.5rem 0.3rem 0.5rem;
    }

    #message-form #send-button svg{
        width: 1.7em;
        height: 1.7em;
        color: var(--text-color);
    }

    #message-form #send-button:hover{
        background-color: var(--border-color);
    }

    #message-form #send-button:active{
        opacity:0.9;
    }
</style>