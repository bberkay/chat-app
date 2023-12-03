<script lang="ts">
    import Search from '$lib/components/Sidebar/Search.svelte';
    import Profile from '$lib/components/Sidebar/Profile.svelte';
    import FriendCard from '$lib/components/Sidebar/FriendCard.svelte';
</script>

<section id="sidebar" class = "show">
    <Search />
    <FriendCard/>
    <FriendCard/>
    <FriendCard/>
    <FriendCard/>
    <Profile/>
    <span class = "hide"></span>
</section>

<style>
    #sidebar{
        height: 100vh;
        background-color: var(--current-front-color);
        border-right: 1px solid var(--current-border-color);
        position:relative;
    }

    #sidebar.show{
        display: flex;
        flex-direction: column;
    }

    .hide{
        display: none;
    }
</style>