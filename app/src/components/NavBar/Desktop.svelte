<script lang="ts">
    import Fa from 'svelte-fa/src/fa.svelte';
    import { faChevronLeft, faSun, faMoon } from '@fortawesome/free-solid-svg-icons/index.js';
    import { theme } from '@/stores';

    let bigger = false;
    let innerWidth: number;
    $: {
        bigger = innerWidth >= 1392;
    }

    export let back: () => void | null = null;
</script>

<svelte:window bind:innerWidth />

<nav>
    <div class="side left">
        {#if back}
            <a href="/" class="pointer" on:click|preventDefault={back}
                ><Fa icon={faChevronLeft} /></a
            >
        {/if}
    </div>
    <div class:bigger class="spacer" />
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
    nav {
        background: transparent;
        height: 40px;
        position: fixed;
        top: 0;
        width: 100%;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-items: center;
        font-size: 1.2em;
        pointer-events: none;
    }

    .spacer {
        width: 800px;
        height: 100%;

        &.bigger {
            width: 1200px;
        }
    }

    .side {
        height: 100%;
        flex-grow: 1;
        line-height: 40px;
        pointer-events: all;

        & > * {
            display: block;
            line-height: 40px;
            width: 40px;
            text-align: center;
        }
    }

    .left {
        text-align: right;
    }

    .right {
        text-align: left;
    }

    .pointer {
        cursor: pointer;
        color: var(--secondary);
    }
</style>
