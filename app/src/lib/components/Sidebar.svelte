<script lang="ts">
    import { onMount } from "svelte"
    import { searchResultsStore, messagesStore } from '$lib/stores';
    import Search from '$lib/components/Sidebar/Search.svelte';
    import Profile from '$lib/components/Sidebar/Profile.svelte';
    import FriendCard from '$lib/components/Sidebar/FriendCard.svelte';
    import type { Message } from "$lib/types";
    import { sortFriendsByLastMessage } from "$lib/utils";
    import { get } from "svelte/store";

    /**
     * Responsive Sidebar
     */
    onMount(() => {
        document.querySelector('#sidebar .loading')?.remove();
        sortFriendsByLastMessage(get(searchResultsStore));
    })

    /**
     * Messages
     * Sort friends by last message when a new message is received.
     */
    messagesStore.subscribe((messages: Message[]) => {
        if(messages.length === 0)
            return;

        sortFriendsByLastMessage(get(searchResultsStore));
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
