<script lang="ts">
    import Search from '$lib/components/Sidebar/Search.svelte';
</script>

<section id="sidebar">
    <Search />
</section>

<style>
    #sidebar{
        height: 100vh;
        background-color: var(--current-front-color);
        border-right: 1px solid var(--current-border-color);
        border-left: 1px solid var(--current-border-color);
    }
</style>