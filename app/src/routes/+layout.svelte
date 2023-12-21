<script lang ="ts">
    import { Client } from "$lib/classes/Client";
    import Navbar from "$lib/components/Navbar.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import { profileStore, clientStore, messagesStore } from "$lib/stores"
    import { onMount } from "svelte";

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
        if(!client.isConnected()) client.connect();
        clientStore.set(client);

        // Listen to messages from friend
        client.getSocket().addEventListener("message", (event) => {
            let message = JSON.parse(event.data);
            messagesStore.update((messages) => [...messages, ...(message instanceof Array ? message : [message])]);
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