<script lang="ts">
    import { onMount } from "svelte"
    import { SharedStore } from '$lib/stores/shared.svelte';
    import Search from '$lib/components/Sidebar/Search.svelte';
    import Profile from '$lib/components/Sidebar/Profile.svelte';
    import FriendCard from '$lib/components/Sidebar/FriendCard.svelte';
    import { sortFriendsByLastMessage } from "$lib/utils";

    /**
     * Responsive Sidebar
     */
    onMount(() => {
        document.querySelector('#sidebar .loading')?.remove();
        sortFriendsByLastMessage(SharedStore.searchResults);
    })

    /**
     * Messages
     * Sort friends by last message when a new message is received.
     */
    $effect(() => {
        if(SharedStore.messages.length === 0)
            return;

        sortFriendsByLastMessage(SharedStore.searchResults);
    });
</script>

<section id="sidebar">
    <Search />
    <div class="loading">
        <span class = "loader"></span>
        <span>Loading...</span>
    </div>
    {#each SharedStore.searchResults as friend}
        <FriendCard friend={friend}/>
    {/each}
    <Profile/>
</section>

<style>
    #sidebar{
        height: 100vh;
        background-color: var(--front-color);
        border-right: 1px solid var(--border-color);
        position:relative;
        display: block;
    }
</style>
