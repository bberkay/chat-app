<script lang="ts">
    import FriendHeader from "$lib/components/Chat/FriendHeader.svelte";
    import MessageForm from "$lib/components/Chat/MessageForm.svelte";
</script>

<section id="chat">
    <FriendHeader/>
    <div id="messages">
        <p>Messages here</p>
    </div>
    <MessageForm/>
</section>

<style>
    #chat {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
    }
</style>