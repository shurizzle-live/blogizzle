<script lang="ts">
    import { api } from './stores';
    import { Login, Register, Home, NotFound, Me, Blog } from './pages';
    import { pattern, redirect } from 'svelte-pathfinder';
    import { isLoading as i18nIsLoading } from 'svelte-i18n';

    let apiIsLoading = true;
    api.init().then(() => {
        apiIsLoading = false;
    });
    let isLogged = false;
    api.subscribe(() => (isLogged = api.isLogged()));
    let params;
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
{:else if $pattern('/me')}
    <Me />
{:else if (params = $pattern('/:username'))}
    <Blog name={params.username} />
{:else}
    <NotFound />
{/if}
