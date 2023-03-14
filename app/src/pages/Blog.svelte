<script lang="ts">
    import List from './Blog/PostList.svelte';
    import Single from './Blog/PostSingle.svelte';
    import { paramable } from 'svelte-pathfinder';
    import { User } from '@/Api/UserRepo';
    import { api } from '@/stores';
    import { NotFound } from '@/pages';

    const parameters = paramable<{ name: string; slug: string | null }>('/:name/:slug?');
    let user: User | null;
    let promise: Promise<User | null>;
    $: {
        promise = api.user.getByName($parameters.name);
        promise.then((u) => (user = u));
    }
</script>

{#await promise}
    Loading...
{:then}
    {#if user}
        {#if $parameters.slug}
            <Single {user} slug={$parameters.slug} />
        {:else}
            <List {user} />
        {/if}
    {:else}
        <NotFound />
    {/if}
{/await}
