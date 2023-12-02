<script lang="ts">
    import FriendHeader from "$lib/components/Chat/FriendHeader.svelte";
    import MessageForm from "$lib/components/Chat/MessageForm.svelte";
    import FriendMessage from "$lib/components/Chat/FriendMessage.svelte";
    import MyMessage from "$lib/components/Chat/MyMessage.svelte";
</script>

<section id="chat">
    <FriendHeader/>
    <div id="messages">
        <FriendMessage/>
        <FriendMessage/>
        <FriendMessage/>
        <FriendMessage/>
        <MyMessage/>
        <MyMessage/>
        <FriendMessage/>
        <FriendMessage/>
        <MyMessage/>
        <FriendMessage/>
        <MyMessage/>
        <FriendMessage/>
        <MyMessage/>
        <FriendMessage/>
        <FriendMessage/>
        <MyMessage/>
        <FriendMessage/>
        <MyMessage/>
        <FriendMessage/>
        <MyMessage/>
        <FriendMessage/>
        <MyMessage/>
        <FriendMessage/>
        <MyMessage/>
        <FriendMessage/>
        <MyMessage/>
        <FriendMessage/>
        <MyMessage/>
        <FriendMessage/>
        <MyMessage/>
        <FriendMessage/>
        <MyMessage/>
        <FriendMessage/>
        <MyMessage/>
        <FriendMessage/>
        <MyMessage/>
        <FriendMessage/>
        <MyMessage/>
        <FriendMessage/>
        <MyMessage/>
        <FriendMessage/>
        <MyMessage/>
        <FriendMessage/>
        <MyMessage/>
        <FriendMessage/>
        <MyMessage/>
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

    #messages{
        padding:1.5rem;
        overflow-y: scroll;
        height: 100%;
    }
</style>