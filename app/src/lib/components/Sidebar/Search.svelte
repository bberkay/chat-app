<script lang="ts">
    import { searchResults } from "$lib/stores/search.js";

    let search: string = "";

    /**
     * Search person by name from search endpoint
     */
    async function searchPerson(): Promise<void>
    {
        const response = await fetch(`/search?name=${search}`);
        const data = await response.json();
        searchResults.set(data);
    }

    // Search person if search string is at least 3 characters long
    $: if(search.length >= 3) { searchPerson() } else { searchResults.set([]) }
</script>

<div id="search">
    <form>
        <input type="text" name="search" id="search" min="3" autocomplete="off" size="30" placeholder="Search person" bind:value = {search} required/>
    </form>
</div>

<style>
    #search {
        width:350px;
    }

    #search form {
        display:flex;
        justify-content:center;
        align-items:center;
        padding:1rem 1rem 0.84rem 1rem;
        border-bottom:2px solid var(--border-color);
    }

    #search input {
        height:30px;
        width: 100%;
        padding-left:10px;
    }
</style>