<script lang="ts">
    import Fa from 'svelte-fa/src/fa.svelte';
    import { faChevronLeft, faSun, faMoon } from '@fortawesome/free-solid-svg-icons/index.js';
    import { theme } from '@/stores';
    import { bindScroll } from '@/util';

    export let back: () => void | null = null;
</script>

<div class="placeholder" />
<nav use:bindScroll={{ hide: 'hide' }}>
    <div class="side left">
        {#if back}
            <a href="/" class="pointer" on:click|preventDefault={back}
                ><Fa icon={faChevronLeft} /></a
            >
        {/if}
    </div>
    <div class="spacer" />
    <div class="side right">
        {#if $theme == 'light'}
            <a href="/" class="pointer" on:click|preventDefault={() => theme.set('dark')}
                ><Fa icon={faMoon} /></a
            >
        {:else}
            <a href="/" class="pointer" on:click|preventDefault={() => theme.set('light')}
                ><Fa icon={faSun} /></a
            >
        {/if}
    </div>
</nav>

<style lang="scss">
    .placeholder {
        height: 40px;
    }

    nav {
        background: var(--bg);
        box-shadow: 0 0 10px var(--shadow);
        height: 40px;
        position: fixed;
        top: 0;
        transition: top 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        width: 100%;
        display: flex;
        flex-flow: row;

        &:is(.hide) {
            box-shadow: none;
        }

        .spacer {
            flex-grow: 1;
        }

        .side {
            width: 40px;
            line-height: 40px;
            text-align: center;

            .pointer {
                cursor: pointer;
                color: var(--secondary);
            }
        }
    }
</style>
