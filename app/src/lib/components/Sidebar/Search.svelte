<script lang="ts">
    import { searchResultsStore, friendsStore } from "$lib/stores";
    import { get } from "svelte/store";
    import type { Friend } from "$lib/types";

    let search: string = "";

    /**
     * Search person by name from search endpoint
     */
    async function searchPerson(): Promise<void>
    {
        const response = await fetch(`/api/search?name=${search}`);
        let data = await response.json();
        searchResultsStore.set(data.map((friend: Friend) => {
            const friendFromStore = get(friendsStore).find((f: Friend) => f._id === friend._id);
            if(friendFromStore && friendFromStore.lastMessage)
                friend.lastMessage = friendFromStore.lastMessage;
            return friend;
        }));
    }

    // Search person if search string is at least 3 characters long
    $: if(search.length >= 3) {
        searchPerson()
    } else {
        searchResultsStore.set(get(friendsStore))
    }
</script>

<div id="search">
    <form>
        <input type="text" name="search" id="search" min="3" autocomplete="off" size="30" placeholder="Search person" bind:value={search} required/>
    </form>
</div>

<style>
    #search {
        width:350px;
    }

    #search form {
        height: 60px;
        display:flex;
        justify-content:center;
        align-items:center;
        padding:0 1rem 0rem 1rem;
        border-bottom:2px solid var(--border-color);
    }

    #search input {
        height:30px;
        width: 100%;
        padding-left:10px;
    }
</style>
