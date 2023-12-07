<script lang="ts">
    import Chat from '$lib/components/Chat.svelte';
    export let data;
</script>

<Chat friend="{data.friend}"/>
