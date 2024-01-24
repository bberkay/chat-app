<script lang="ts">
    import { onMount, afterUpdate } from "svelte";
    import { profileStore, messagesStore } from "$lib/stores";
    import { get } from "svelte/store";

    export let user;
    let lastMessageOfUser;
    let currentProfile = get(profileStore);

    /**
     * Get the last message of the user
     */
    async function getLastMessageBetweenUsers(user1: string, user2: string): Promise<string>
    {
        return await fetch(`/api/messages/last?user1=${user1}&user2=${user2}`).then(res => res.json()).then(res => res[0] ? res[0].content : "");
    }

    /**
     * Get the last message of the user when the component is mounted and
     * every time the profile changes or new message is sent.
     */
    onMount(async () => {
        if(user._id !== "droid")
        {
            messagesStore.subscribe((messages) => {
                const lastMessage = messages[messages.length - 1];
                if(lastMessage && (lastMessage.senderId === user._id || lastMessage.receiverId === user._id))
                    lastMessageOfUser = lastMessage.content;
            });

            profileStore.subscribe(async (profile) => {
                if(profile._id !== currentProfile._id)
                    lastMessageOfUser = await getLastMessageBetweenUsers(user._id, profile._id)
            });

            lastMessageOfUser = lastMessageOfUser ? lastMessageOfUser : await getLastMessageBetweenUsers(user._id, get(profileStore)._id);
        }
    });

    /**
     * Get the last message of the user when the component is updated(this happens
     * when the friend cards are updated/moved to the top of the list
     * after a new message is sent).
     */
    afterUpdate(async () => {
        if(user._id !== "droid" && !lastMessageOfUser && get(profileStore)._id !== currentProfile._id)
            lastMessageOfUser = await getLastMessageBetweenUsers(user._id, get(profileStore)._id);
    });
</script>

<div class="friend-card" on:click={() => { window.location.href = `/messages/${user._id}` }}>
    <div class="friend-avatar">
        <img src="{user.avatar}" alt="">
    </div>
    <div class="message-info">
        <span>{user.name}</span>
        <span>{@html lastMessageOfUser && lastMessageOfUser.length > 0 ? (lastMessageOfUser.length >= 30 ? lastMessageOfUser.slice(0, 30) + "..." : lastMessageOfUser) : (user._id === "droid" ? "<i>Start a conversation</i>" : "<i>No messages yet</i>")}</span>
    </div>
    {#if user._id === 'droid'}
        <div class="droid-icon">
            <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke-width="2" class="ai ai-AndroidFill"><path d="M17.532 15.106a1.003 1.003 0 1 1 .001-2.007 1.003 1.003 0 0 1 0 2.007zm-11.044 0a1.003 1.003 0 1 1 .001-2.007 1.003 1.003 0 0 1 0 2.007zm11.4-6.018l2.006-3.459a.413.413 0 1 0-.721-.407l-2.027 3.5a12.243 12.243 0 0 0-5.13-1.108c-1.85 0-3.595.398-5.141 1.098l-2.027-3.5a.413.413 0 1 0-.72.407l1.995 3.458C2.696 10.947.345 14.417 0 18.523h24c-.334-4.096-2.675-7.565-6.112-9.435z"/></svg></span>
        </div>
    {/if}
</div>

<style>
    .friend-card{
        display:flex;
        align-items:center;
        justify-content: flex-start;
        padding:1rem;
        cursor:pointer;
        color:var(--text-color);
    }

    .friend-card .droid-icon{
        margin-left:auto;
        filter: brightness(0.5);
    }

    .friend-card:hover{
        background-color:var(--border-color);
    }

    .friend-card:hover .droid-icon{
        filter: brightness(1);
    }

    .friend-card:active{
        opacity:0.8;
    }

    .friend-card .message-info{
        display:flex;
        flex-direction: column;
    }

    .friend-card .message-info span:first-child{
        font-weight: bold;
    }

    .friend-card .message-info span:last-child{
        font-size: 0.8rem;
        color:var(--text-color);
    }

    .friend-card .friend-avatar img{
        margin-right:1rem;
        border-radius: 50%;
        width:3em;
        height:3em;
    }
</style>