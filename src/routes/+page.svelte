<script lang ="ts">
    import Menu from "$lib/components/Menu.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
</script>

<main>
    <Menu />
    <Sidebar />
</main>

<style>
    main{
        display: flex;
        flex-direction: row;
        height: 100vh;
    }
</style>