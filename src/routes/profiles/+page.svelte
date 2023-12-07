<script lang="ts">
    import Profiles from '$lib/components/Profiles.svelte';

    export let data;
</script>

<Profiles users="{data.users}" selectedUserId = "{data.selectedUserId}"/>



