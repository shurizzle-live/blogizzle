<script lang="ts">
    import 'tippy.js/animations/perspective-subtle.css';
    import { tippy } from 'svelte-tippy';

    import { style, field as _field } from 'svelte-forms';

    import Fa from 'svelte-fa/src/fa.svelte';
    import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons/index.js';

    import { _ } from 'svelte-i18n';
    import { get } from 'svelte/store';

    let klass: string = '';
    export { klass as class };
    export let disabled: boolean = false;
    export let field: ReturnType<typeof _field> = _field('', '', []);
    let errors: string[] = $field.errors;
    $: {
        errors = $field.errors;
    }
    let focus: boolean = false;

    let errorText: string | null = null;
    $: {
        if (!disabled && $field.dirty && $field.invalid && errors.length > 0) {
            let tmp = errors.map((name) => `<li>${get(_)('error.' + name)}</li>`).join('');
            if (tmp.length > 0) {
                errorText = `<ul>${tmp}</ul>`;
            }
        } else {
            errorText = null;
        }
    }

    let input: HTMLElement | null = null;
    const focusInput = () => input?.focus();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class={`container ${klass}`}
    class:disabled
    class:focus
    use:style={{ field }}
    on:click|preventDefault={focusInput}
>
    <div class="input-wrapper">
        <input
            bind:this={input}
            bind:value={$field.value}
            on:focusin={() => {
                focus = true;
            }}
            on:focusout={() => {
                focus = false;
            }}
            {disabled}
            {...$$restProps}
        />
    </div>
    {#if errorText}
        <div
            use:tippy={{
                content: errorText,
                allowHTML: true,
                arrow: false,
                placement: 'bottom-end',
                animation: 'perspective-subtle',
                hideOnClick: false,
            }}
            class="icon-wrapper"
        >
            <Fa icon={faTriangleExclamation} />
        </div>
    {/if}
</div>

<style lang="scss">
    input {
        padding: 0;
        border: none;
        width: 100%;
        background-color: transparent !important;

        &:focus {
            background-color: transparent !important;
        }
    }

    .container {
        cursor: text;
        border: none;
        border-bottom: solid 1px var(--fg);
        background-color: var(--bg);
        color: var(--fg);
        border-radius: 2px 2px 0 0;
        padding: 0.3em 0.3em;
        display: flex;
        flex-direction: row;

        &.focus {
            background-color: var(--focus-bg);
        }

        &.invalid {
            border-bottom-color: var(--red);
        }

        &.disabled {
            border-bottom: solid 1px var(--fg) !important;
        }

        transition: background-color 150ms linear, border-bottom 150ms linear;
    }

    .input-wrapper {
        flex-grow: 1;
    }

    .tooltip {
        flex-wrap: wrap;
    }

    .icon-wrapper {
        color: var(--red);
        cursor: pointer;
    }
</style>
