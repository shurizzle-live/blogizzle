<script lang="ts">
    import { redirect } from 'svelte-pathfinder';
    import { api } from '@/stores';

    api.user.me().then((me) => redirect(`/${me.name}`));
</script>

Loading...
