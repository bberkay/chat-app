<script lang="ts">
    import Profiles from '$lib/components/Profiles.svelte';

    export let data; // data from server
</script>

<Profiles users="{data.users}" currentUserId="{data.currentUserId}"/>



