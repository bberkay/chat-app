<script lang="ts">
    import { onMount } from "svelte"
    import { searchResultsStore, messagesStore } from '$lib/stores';
    import Search from '$lib/components/Sidebar/Search.svelte';
    import Profile from '$lib/components/Sidebar/Profile.svelte';
    import FriendCard from '$lib/components/Sidebar/FriendCard.svelte';
    import { get } from 'svelte/store';
    import type { Friend, Message } from "$lib/types";

    /**
     * Responsive Sidebar
     */
    onMount(() => {
        document.querySelector('#sidebar .loading')?.remove();
        sortByLastMessage();
    })

    /**
     * Sort friends by last message
     */
    function sortByLastMessage() {
        searchResultsStore.set(get(searchResultsStore).sort((a, b) => {
            const dateA = a.lastMessage?.sentAt.getTime() ?? -Infinity;
            const dateB = b.lastMessage?.sentAt.getTime() ?? -Infinity;
            return dateB - dateA;
        }));
    }

    /**
     * Messages
     * Sort friends by last message when a new message is received.
     */
    messagesStore.subscribe((messages: Message[]) => {
        if(messages.length === 0)
            return;

        sortByLastMessage();
    })
</script>

<section id="sidebar">
    <Search />
    <div class="loading">
        <span class = "loader"></span>
        <span>Loading...</span>
    </div>
    {#each $searchResultsStore as friend}
        <FriendCard friend="{friend}"/>
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
        display: block;

        &.hide {
            display:none!important;
            border-right: 0 !important;
        }
    }
</style>
