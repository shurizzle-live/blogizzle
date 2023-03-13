<script lang="ts">
    import { api } from './stores';
    import { Login, Register, Home, NotFound, Me, Blog, PostNew } from './pages';
    import { pattern, redirect, query, ConvertedParam } from 'svelte-pathfinder';
    import { isLoading as i18nIsLoading } from 'svelte-i18n';

    let apiIsLoading = true;
    api.init().then(() => {
        apiIsLoading = false;
    });
    let isLogged = false;
    api.subscribe(() => (isLogged = api.isLogged()));
    let params;

    const getPage = (page: ConvertedParam): number => {
        if (!page) {
            return 1;
        }

        if (Number.isInteger(page)) {
            return page as number;
        } else {
            parseInt(page.toString());
        }
    };
</script>

{#if apiIsLoading || $i18nIsLoading}
    Loading...
{:else if $pattern('/')}
    <Home />
{:else if $pattern('/login')}
    {#if isLogged}
        {redirect('/')}
    {:else}
        <Login />
    {/if}
{:else if $pattern('/register')}
    {#if isLogged}
        {redirect('/')}
    {:else}
        <Register />
    {/if}
{:else if (params = $pattern('/me/:slug'))}
    <Me slug={params.slug} />
{:else if $pattern('/admin/post/new')}
    {#if isLogged}
        <PostNew />
    {:else}
        {redirect('/login')}
    {/if}
{:else if $pattern('/:username/:slug?')}
    <Blog />
{:else}
    <NotFound />
{/if}
