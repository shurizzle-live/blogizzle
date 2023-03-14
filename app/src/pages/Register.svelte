<script lang="ts">
    import { Input } from '@/components';
    import { form as _form, field } from 'svelte-forms';
    import { required, email as emailValid, matchField } from 'svelte-forms/validators';
    import { api } from '@/stores';
    import { _ } from 'svelte-i18n';

    const nameNotExists = () => {
        return async (value: string) => {
            const valid = !(await api.user.nameExists(value));
            return { valid, name: 'unique' };
        };
    };

    const emailNotExists = () => {
        return async (value: string) => {
            const valid = !(await api.user.emailExists(value));
            return { valid, name: 'unique' };
        };
    };

    const name = field('name', '', [required(), nameNotExists()], {
        valid: false,
        stopAtFirstError: true,
    });
    const email = field('email', '', [emailValid(), emailNotExists()], {
        valid: false,
        stopAtFirstError: true,
    });
    const password = field('password', '', [required()], {
        valid: false,
    });
    const passwordConfirmation = field('passwordConfirmation', '', [matchField(password)], {
        valid: false,
    });
    const form = _form(name, email, password, passwordConfirmation);

    let submitting = false;
    let error: string | null;

    const submit = () => {
        if ($form.dirty && $form.valid) {
            submitting = true;
            try {
                api.signup({
                    username: $name.value,
                    email: $email.value,
                    password: $password.value,
                    marketing: true,
                }).catch(() => {
                    error = 'Username/email combination already exists';
                    submitting = false;
                });
            } catch (_e) {
                submitting = false;
            }
        }
    };
</script>

<svelte:head>
    <title>{$_('pages.signup')}</title>
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
                    placeholder={$_('form.signup.name')}
                    disabled={submitting}
                />
            </fieldset>

            <fieldset>
                <Input
                    type="text"
                    field={email}
                    class="w-full"
                    placeholder={$_('form.signup.email')}
                    disabled={submitting}
                />
            </fieldset>

            <fieldset>
                <Input
                    type="password"
                    field={password}
                    class="w-full"
                    placeholder={$_('form.signup.password')}
                    disabled={submitting}
                />
            </fieldset>

            <fieldset>
                <Input
                    type="password"
                    field={passwordConfirmation}
                    class="w-full"
                    placeholder={$_('form.signup.password_confirm')}
                    disabled={submitting}
                />
            </fieldset>

            <fieldset class="t-center">
                <input
                    type="submit"
                    class="m-auto"
                    value={$_('form.signup.submit')}
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
