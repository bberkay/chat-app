<script lang ="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";

    export let data; // data from the server
</script>

<main class="{data.theme}">
    <Navbar theme="{data.theme}"/>
    <Sidebar users="{data.users}"/>

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