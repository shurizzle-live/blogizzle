<script lang="ts">
    import { form as _form, field } from 'svelte-forms';
    import { required } from 'svelte-forms/validators';
    import { api } from '@/stores';
    import { Input } from '@/components';
    import { _ } from 'svelte-i18n';

    const name = field('name', '', [required()]);
    const password = field('password', '', [required()]);
    const form = _form(name, password);
    form.validate();

    let submitting = false;
    let error: string | null = null;

    const submit = () => {
        if ($form.dirty && $form.valid) {
            submitting = true;
            try {
                const fut = api.signin({
                    user: $name.value,
                    password: $password.value,
                });

                fut.catch(() => (error = 'Invalid username/password'));
                fut.finally(() => {
                    submitting = false;
                });
            } catch (_e) {
                submitting = false;
            }
        }
    };
</script>

<svelte:head>
    <title>{$_('pages.signin')}</title>
</svelte:head>

<div class="center-container">
    <div class="w-full m-auto">
        <form on:submit|preventDefault={submit}>
            {#if error}
                <span>{error}</span>
            {/if}
            <fieldset>
                <Input
                    type="text"
                    field={name}
                    class="w-full"
                    placeholder={$_('form.signin.name_email')}
                    disabled={submitting}
                />
            </fieldset>
            <fieldset>
                <Input
                    type="password"
                    field={password}
                    class="w-full"
                    placeholder={$_('form.signin.password')}
                    disabled={submitting}
                />
            </fieldset>
            <fieldset class="t-center">
                <input
                    type="submit"
                    value={$_('form.signin.submit')}
                    disabled={!$form.dirty || !$form.valid || submitting}
                />
            </fieldset>
        </form>
    </div>
</div>

<style lang="scss">
    .center-container {
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        & > div {
            max-width: 400px;
        }
    }
</style>
