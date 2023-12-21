<script lang ="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import { profileStore } from "$lib/stores"

    // Data from the server(+layout.server.ts)
    export let data;
    profileStore.set(data.profile);

    // Get the profile from the data, also subscribe to the userIdStore to listen for profile changes.
    let profile = data.profile
    profileStore.subscribe((value) => {
        profile = data.users.find((user) => user._id === value._id);
    });
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