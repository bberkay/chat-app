<script lang="ts">
    import { onMount } from "svelte"
    import { searchResultsStore, profileStore, messagesStore, lastMessagesStore } from '$lib/stores';
    import Search from '$lib/components/Sidebar/Search.svelte';
    import Profile from '$lib/components/Sidebar/Profile.svelte';
    import FriendCard from '$lib/components/Sidebar/FriendCard.svelte';
    import { get } from 'svelte/store';

    export let profile;
    export let users;

    /**
     * Responsive Sidebar
     */
    let innerWidth;
    onMount(() => {
        innerWidth = window.innerWidth;
    })

    /* Remove hide when the window is resized to a width greater than 768px */
    $: if (innerWidth > 768) {
        document.querySelector('#sidebar')?.classList.remove('hide');
    }

    /**
     * Search
     * Subscribe to the store for search results
     */
    let searchedUsers = [];
    searchResultsStore.subscribe((value) => {
        searchedUsers = value.length > 0 ? value : users;
    });

    // Remove current user from search results
    profileStore.subscribe(() => { searchedUsers = users });
    $: searchedUsers = searchedUsers.filter(user => user._id !== profile._id);

    /**
     * Messages
     * Sort friends by last message.
     */
    messagesStore.subscribe((value) => {
        if(value.length === 0) return;
        const lastMessage = value[value.length - 1];
        const index = searchedUsers.findIndex(user => user._id === lastMessage.senderId);
        if (index > 0) { // if user is not already at the top of the list
            const temp = searchedUsers.splice(index, 1);
            searchedUsers.unshift(temp[0]);
            users = searchedUsers;
            searchedUsers = searchedUsers; // force update
        }
    });
</script>

<svelte:window bind:innerWidth/>

<section id="sidebar">
    <Search />
    {#each searchedUsers as user}
        {#if user._id !== profile._id}
            <FriendCard user="{user}" lastMessage="{get(lastMessagesStore)[user._id]}"/>
        {/if}
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