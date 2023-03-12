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
{:else if isLogged}
    {#if $pattern('/')}
        <Home />
    {:else if $pattern('/login') || $pattern('/register')}
        {redirect('/')}
    {:else if $pattern('/me')}
        <Me />
    {:else if (params = $pattern('/:username'))}
        <Blog name={params.username} />
    {:else}
        <NotFound />
    {/if}
{:else}
    <!-- break -->
    {#if $pattern('/')}
        <Home />
    {:else if $pattern('/login')}
        <Login />
    {:else if $pattern('/register')}
        <Register />
    {:else}
        <NotFound />
    {/if}
{/if}
