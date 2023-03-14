<script lang="ts">
    import { form as _form, field } from 'svelte-forms';
    import { required } from 'svelte-forms/validators';
    import { api } from '@/stores';
    import { Input } from '@/components';
    import { _ } from 'svelte-i18n';
    import makeSlug from 'slug';
    import { redirect } from 'svelte-pathfinder';

    const slugNotExists = () => {
        return async (value: string) => {
            const valid = !(await api.post.slugExists(api.me(), value));
            return { valid, name: 'unique' };
        };
    };

    const title = field('title', '', [required()]);
    const slug = field('slug', '', [required(), slugNotExists()], {
        stopAtFirstError: true,
    });
    const content = field('content', '', [required()]);
    let draft = false;
    const form = _form(title, slug, content);
    form.validate();

    title.subscribe((title) => {
        if (title.dirty) {
            slug.set(makeSlug(title.value));
        }
    });

    let submitting = false;
    const submit = () => {
        console.log('here');
        if ($form.dirty && $form.valid) {
            submitting = true;
            try {
                const fut = api.post.create({
                    title: $title.value,
                    slug: $slug.value,
                    content: $content.value,
                    draft,
                });

                fut.then(
                    (p) => {
                        redirect(`/me/${p.slug}`);
                    },
                    () => {
                        submitting = false;
                    },
                );
            } catch (_e) {
                submitting = false;
            }
        }
    };
</script>

<form on:submit|preventDefault={submit}>
    <div class="post-wrapper">
        <div class="post-title">
            <fieldset>
                <Input
                    type="text"
                    class="w-full"
                    field={title}
                    placeholder={$_('form.post-new.title')}
                    disabled={submitting}
                />
            </fieldset>
            <fieldset>
                <Input
                    type="text"
                    class="w-full"
                    field={slug}
                    placeholder={$_('form.post-new.slug')}
                    disabled={submitting}
                />
            </fieldset>
        </div>
        <fieldset class="post-content">
            <textarea
                bind:value={$content.value}
                placeholder={$_('form.post-new.content')}
                disabled={submitting}
            />
        </fieldset>
        <div class="post-submit">
            <div class="submit-wrapper">
                <fieldset>
                    <label
                        ><input type="checkbox" bind:checked={draft} disabled={submitting} /> Draft</label
                    >
                </fieldset>
                <fieldset style="text-align: right">
                    <input
                        type="submit"
                        value="Create"
                        disabled={!$form.dirty || !$form.valid || submitting}
                    />
                </fieldset>
            </div>
        </div>
    </div>
</form>

<style lang="scss">
    form {
        height: 100%;
    }

    .post-wrapper {
        display: flex;
        flex-flow: column;
        align-content: stretch;
        align-items: stretch;
        height: 100%;

        .post-title {
            flex-grow: 0;
        }
        .post-content {
            flex-grow: 1;
            height: 100%;

            textarea {
                resize: none;
                height: 100%;
                width: 100%;
            }
        }
        .post-submit {
            flex-grow: 0;
        }
    }

    .submit-wrapper {
        display: flex;

        fieldset {
            flex-grow: 1;
        }
    }

    label {
        user-select: none;
    }
</style>
