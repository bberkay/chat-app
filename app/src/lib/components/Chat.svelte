<script lang="ts">
    import { afterUpdate } from "svelte";
    import { messagesStore } from "$lib/stores";
    import FriendHeader from "$lib/components/Chat/FriendHeader.svelte";
    import MessageForm from "$lib/components/Chat/MessageForm.svelte";
    import FriendMessage from "$lib/components/Chat/FriendMessage.svelte";
    import MyMessage from "$lib/components/Chat/MyMessage.svelte";

    export let friend;
    export let profile;

    // Scroll to bottom of messages when new message is added
    afterUpdate(() => {
        const messagesDiv = document.getElementById("messages");
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
</script>

<section id="chat">
    <FriendHeader name="{friend.name}" avatar="{friend.avatar}"/>
    <div id="messages">
        {#each $messagesStore as message}
            {#if message.senderId === profile._id}
                <MyMessage message="{message.content}"/>
            {:else if message.receiverId === profile._id}
                <FriendMessage friendAvatar="{friend.avatar}" message="{message.content}"/>
            {/if}
        {/each}
    </div>
    <MessageForm friend="{friend}" profile="{profile}"/>
</section>

<style>
    #chat {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
    }

    #messages{
        padding: 1.5rem 1.5rem 0;
        overflow-y: scroll;
        height: 100%;
    }
</style>