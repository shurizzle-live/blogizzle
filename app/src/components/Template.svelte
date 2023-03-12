<script lang="ts">
    import { NavBar } from '@/components';
    import { createEventDispatcher } from 'svelte';

    let bigger = false;
    let innerWidth: number;
    $: {
        bigger = innerWidth >= 1392;
    }

    const dispatch = createEventDispatcher<{ back: void }>();

    export let showBack: boolean = false;
    const goBack = () => {
        dispatch('back');
    };

    let props = { back: null };
    $: {
        if (showBack) {
            props.back = goBack;
        }
    }
</script>

<svelte:window bind:innerWidth />

<NavBar {...props} />

<div class="wrapper" class:bigger>
    <slot />
</div>

<style lang="scss">
    .wrapper {
        width: 100%;
        max-width: 800px;
        margin: auto;
        &.bigger {
            max-width: 1200px;
        }

        @media screen and (max-width: 992px) {
            & {
                padding: 0 10px;
            }
        }
    }
</style>
