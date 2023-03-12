<script lang="ts">
    import Desktop from './NavBar/Desktop.svelte';
    import Mobile from './NavBar/Mobile.svelte';

    let desktop = true;
    let innerWidth: number;
    $: {
        desktop = innerWidth >= 992;
    }

    export let back: () => void | null = null;
</script>

<svelte:window bind:innerWidth />

{#if desktop}
    <Desktop {back} {...$$restProps} />
{:else}
    <Mobile {back} {...$$restProps} />
{/if}
