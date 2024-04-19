<script lang="ts">
    import { MessageType } from "$lib/types";
    import type { User } from "$lib/types";
    import { Client } from "$lib/classes/Client";
    import Navbar from "$lib/components/Navbar.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import { profileStore, clientStore, messagesStore, sessionIdStore, usersStore } from "$lib/stores";
    import { page } from "$app/stores";

    // Data from the server(+layout.server.ts)
    export let data;
    usersStore.set(data.users);
    profileStore.set(data.profile);
    sessionIdStore.set(data.sessionId);

    // Get the profile from the data, also subscribe to the userIdStore to listen for profile changes.
    let profile: User = data.profile as User;
    profileStore.subscribe((value) => {
        profile = data.users.find((user) => user._id === value._id)!;
    })

    /**
     * Client
     * Connect to Server with Client and store it in the clientStore for use in other components.
     */
    const client = new Client();
    messagesStore.set([]);
    if(!client.isConnected())
    {
        clientStore.set(client);
        const friendId = $page.url.pathname.split("/messages/")[1];
        if(friendId && friendId !== "droid"){
            client.connect(friendId);
        }
    }

    // Listen to messages from friend and also store the last messages.
    if(client.isConnected())
    {
        client.getSocket().addEventListener("message", (event) => {
            let message = JSON.parse(event.data);
            if(message.type === MessageType.NewMessage || message.type === MessageType.CurrentMessages)
                messagesStore.update((messages) => [...messages, ...(message.type === MessageType.CurrentMessages ? message.data : [message.data])]);
        });
    }
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