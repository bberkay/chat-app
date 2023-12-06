<script lang="ts">
    import { onMount } from "svelte";
    import { searchResults } from '$lib/stores/search';
    import Search from '$lib/components/Sidebar/Search.svelte';
    import Profile from '$lib/components/Sidebar/Profile.svelte';
    import FriendCard from '$lib/components/Sidebar/FriendCard.svelte';

    // Users and current profile from the database
    export let users;
    export let profile;

    // Listen for window resize
    let innerWidth;
    onMount(() => {
        innerWidth = window.innerWidth;
    })

    /* Remove hide when the window is resized to a width greater than 768px */
    $: if (innerWidth > 768) {
        document.querySelector('#sidebar')?.classList.remove('hide');
    }

    // Subscribe to the store for search results
    let searchedUsers = [];
    searchResults.subscribe((value) => {
        searchedUsers = value.length > 0 ? value : users;
    });
</script>

<svelte:window bind:innerWidth/>

<section id="sidebar">
    <Search />
    {#each searchedUsers as user}
        <FriendCard user={user}/>
    {/each}
    <Profile profile={profile}/>
    <span class = "hide"></span>
</section>

<style>
    #sidebar{
        height: 100vh;
        background-color: var(--front-color);
        border-right: 1px solid var(--border-color);
        position:relative;
    }

    .hide {
        width: 0;
        opacity: 0;
        border-right: 0 !important; /* remove border right from sidebar */
    }
</style>