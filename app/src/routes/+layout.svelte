<script lang ="ts">
    import { MessageType } from "$lib/types";
    import { Client } from "$lib/classes/Client";
    import Navbar from "$lib/components/Navbar.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import { profileStore, clientStore, messagesStore, lastMessagesStore } from "$lib/stores"
    import { onMount } from "svelte"

    // Data from the server(+layout.server.ts)
    export let data;
    profileStore.set(data.profile);

    // Get the profile from the data, also subscribe to the userIdStore to listen for profile changes.
    let profile = data.profile
    profileStore.subscribe((value) => {
        profile = data.users.find((user) => user._id === value._id);
    })

    // Listen messages from the server.
    onMount(() => {
        /**
         * Client
         * Connect to Server with Client and store it in the clientStore for use in other components.
         */
        const client = new Client();
        if(!client.isConnected()){
            const friendId = window.location.href.split("/messages/")[1];
            client.connect(friendId);
            clientStore.set(client);
        }

        // Listen to messages from friend and also store the last messages.
        client.getSocket().addEventListener("message", (event) => {
            let message = JSON.parse(event.data);
            if(message.type === MessageType.NewMessage || message.type === MessageType.CurrentMessages)
                messagesStore.update((messages) => [...messages, ...(message.type === MessageType.CurrentMessages ? message.data : [message.data])]);
            else if(message.type === MessageType.LastMessage){
                const friendId = message.data.senderId === profile._id ? message.data.receiverId : message.data.senderId;
                lastMessagesStore.update((messages) => { return {...messages, ...{[friendId]: message.data.content}} });
            }
        });
    })
</script>

<main class="{data.theme}">
    <Navbar theme="{data.theme}"/>
    <Sidebar profile="{profile}" users="{data.users}"/>

    <!-- Content -->
    <slot/>
    <!-- Content End -->
</main>

<style>
    main{
        display: flex;
        flex-direction: row;
        height: 100vh;
    }
</style>