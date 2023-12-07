<script lang="ts">
    import { selectedUserId } from "$lib/stores/select";
    import ProfileCard from "$lib/components/Profiles/ProfileCard.svelte";

    export let users; // users from the server
    export let currentUserId; // selected user id

    // Change current user id when selectedUserId store changes
    selectedUserId.subscribe((value) => {
        if(value && value.length > 0)
            currentUserId = value;
    });
</script>

<section id = "profiles">
    <div id="page-info">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path></svg>
        <span>You can change your current user by selecting some of the users below.</span>
    </div>
    <div id="profile-container">
        {#each users as user}
            <ProfileCard user="{user}" isSelected={currentUserId === user._id}/>
        {/each}
    </div>
</section>

<style>
    #profiles{
        width:100%;
        padding:1rem;
    }

    #profiles #page-info{
        display:flex;
        align-items:center;
        padding:1rem;
        border:1px solid var(--border-color);
        border-radius: 5px;
        background-color: var(--front-bright-color);
        color: var(--text-color);
    }

    #profiles #page-info svg{
        margin-right:0.50rem;
    }

    #profiles #profile-container{
        display:flex;
        flex-wrap:wrap;
        justify-content:center;
        padding:1rem;
    }
</style>
