<script lang="ts">
    import { Template } from '@/components';
    import List from './Blog/PostList.svelte';
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
        <Template>
            {#if $parameters.slug}
                Single post
            {:else}
                <List {user} />
            {/if}
        </Template>
    {:else}
        <NotFound />
    {/if}
{/await}
