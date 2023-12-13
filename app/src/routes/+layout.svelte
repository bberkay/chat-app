<script lang ="ts">
    import { selectedUserId } from "$lib/stores";
    import Navbar from "$lib/components/Navbar.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";

    export let data; // data from the server

    /**
     * Find the profile of the selected user.
     */
    let profile = data.profile;
    selectedUserId.subscribe((value) => {
        if(value && value.length > 0 && value !== profile._id)
            profile = data.users.find((user) => user._id === value);
    });
</script>

<main class="{data.theme}">
    <Navbar theme="{data.theme}"/>
    <Sidebar users="{data.users}" profile="{profile}" chatbot="{data.chatbot}"/>

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