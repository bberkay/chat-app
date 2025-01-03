<script lang="ts">
    import type { User, Friend, Droid } from "$lib/types";
    import { SharedStore } from "$lib/stores/shared.svelte";
    import { onMount } from "svelte";


    interface Props {
        // Component properties
        friend: Friend | Droid;
    }

    let { friend }: Props = $props();

    // Current message
    let message: string;
    let messageInput: HTMLInputElement;
    onMount(() => {
        // Scroll to the bottom of the messages
        const messages = document.getElementById("messages")!;
        messages.scrollTop = messages.scrollHeight;

        // Focus on the message input
        messageInput = document.getElementById("message-input") as HTMLInputElement;
        messageInput.focus();
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
        messageInput.value = "";
        if(message.length > 0 && friend._id !== "droid"){
            // Send message to the server
            SharedStore.chatSocket!.send({
                sessionId: SharedStore.sessionId,
                senderId: SharedStore.profile!._id,
                receiverId: friend._id,
                content: message
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
                SharedStore.messages = [
                    ...SharedStore.messages,
                    {
                        senderId: friend._id,
                        receiverId: SharedStore.profile!._id,
                        content: (friend as Droid).readyMessages[Math.floor(Math.random() * (friend as Droid).readyMessages.length)],
                        sentAt: new Date()
                    }
                ];
            }, 1000);
        }
    }
</script>

<div id = "message-form">
    <form>
        <input type="text" id = "message-input" onkeydown={handleMessageInput} autocomplete="off">
        <button id = "send-button" onclick={sendMessage} aria-labelledby="Send Message">
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
