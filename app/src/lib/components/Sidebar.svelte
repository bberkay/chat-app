<script lang="ts">
    import { onMount } from "svelte"
    import { searchResultsStore, messagesStore } from '$lib/stores';
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
        searchResultsStore.set(users.filter(user => user._id !== profile._id));
    })

    /* Remove hide when the window is resized to a width greater than 768px */
    $: if (innerWidth > 768) {
        document.querySelector('#sidebar')?.classList.remove('hide');
    }

    /**
     * Messages
     * Sort friends by last message when a new message is received.
     */
    messagesStore.subscribe((value) => {
        if(value.length === 0) return;
        const lastMessage = value[value.length - 1];
        const index = get(searchResultsStore).findIndex(user => user._id === lastMessage.senderId);
        if (index > 0) { // if user is not already at the top of the list
            const temp = get(searchResultsStore).splice(index, 1);
            searchResultsStore.set(get(searchResultsStore).unshift(temp[0]));
        }
    })
</script>

<svelte:window bind:innerWidth/>

<section id="sidebar">
    <Search />
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