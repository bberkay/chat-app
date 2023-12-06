<script lang="ts">
    import {onMount} from "svelte";
    import Search from '$lib/components/Sidebar/Search.svelte';
    import Profile from '$lib/components/Sidebar/Profile.svelte';
    import FriendCard from '$lib/components/Sidebar/FriendCard.svelte';

    // Users from the database
    export let users;

    // Listen for window resize
    let innerWidth;
    onMount(() => {
        innerWidth = window.innerWidth;
    })

    /* Remove hide when the window is resized to a width greater than 768px */
    $: if (innerWidth > 768) {
        document.querySelector('#sidebar')?.classList.remove('hide');
    }
</script>

<svelte:window bind:innerWidth/>

<section id="sidebar">
    <Search />
    {#each users as user}
        <FriendCard user={user}/>
    {/each}
    <Profile/>
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