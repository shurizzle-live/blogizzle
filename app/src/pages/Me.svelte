<script lang="ts">
    import { redirect } from 'svelte-pathfinder';
    import { api } from '@/stores';

    export let slug: string | null = null;

    api.user.me().then((me) => {
        let url = `/${me.name}`;
        if (slug) {
            url = `${url}/${slug}`;
        }
        redirect(url);
    });
</script>

Loading...
