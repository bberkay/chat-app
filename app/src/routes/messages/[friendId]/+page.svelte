<script lang="ts">
    import Chat from '$lib/components/Chat.svelte';

    export let data; // data from server
</script>

<Chat friend="{data.friend}" userId="{data.userId}" messages="{data.messages}"/>
