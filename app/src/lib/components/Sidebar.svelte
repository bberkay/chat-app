<script lang="ts">
    import type { User } from '$lib/types';
    import { onMount } from "svelte"
    import { searchResultsStore, messagesStore, profileStore } from '$lib/stores';
    import Search from '$lib/components/Sidebar/Search.svelte';
    import Profile from '$lib/components/Sidebar/Profile.svelte';
    import FriendCard from '$lib/components/Sidebar/FriendCard.svelte';
    import { get } from 'svelte/store';

    export let profile: User;
    export let users: User[] = [];

    /**
     * Responsive Sidebar
     */
    let innerWidth = 0;
    onMount(() => {
        innerWidth = window.innerWidth;
        document.querySelector('#sidebar .loading')?.remove();
        searchResultsStore.set(users.filter(user => user._id !== profile._id));
    })

    /* Remove hide when the window is resized to a width greater than 768px */
    $: if (innerWidth > 768) {
        document.querySelector('#sidebar')?.classList.remove('hide');
    }

    /**
     * Profile Change
     * Change users when profile changes.
     */
    profileStore.subscribe((value) => {
        searchResultsStore.set(users.filter(user => user._id !== value._id));
    });

    /**
     * Messages
     * Sort friends by last message when a new message is received.
     */
    messagesStore.subscribe((value) => {
        if(value.length === 0) return;
        const searchResults = get(searchResultsStore);
        const lastMessage = value[value.length - 1];
        const index = searchResults.findIndex(user => user._id === lastMessage.senderId);
        const temp = searchResults.splice(index, 1);
        searchResults.unshift(temp[0]);
        searchResultsStore.set(searchResults);
    })
</script>

<svelte:window bind:innerWidth/>

<section id="sidebar">
    <Search />
    <div class="loading">
        <span class = "loader"></span>
        <span>Loading...</span>
    </div>
    {#each $searchResultsStore as user}
        <FriendCard user="{user}"/>
    {/each}
    <Profile user="{profile}"/>
    <span class = "hide"></span>
</section>

<style>
    #sidebar{
        height: 100vh;
        background-color: var(--front-color);
        border-right: 1px solid var(--border-color);
        position:relative;
        display: block;
    }

    .hide {
        display:none!important;
        border-right: 0 !important; /* remove border right from sidebar */
    }
</style>