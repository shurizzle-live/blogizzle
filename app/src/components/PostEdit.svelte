<script lang="ts">
    import { form as _form, field } from 'svelte-forms';
    import { required } from 'svelte-forms/validators';
    import { api } from '@/stores';
    import { Input } from '@/components';
    import { _ } from 'svelte-i18n';
    import makeSlug from 'slug';
    import { createEventDispatcher } from 'svelte';
    import { Post } from '@/Api';

    const slugNotExists = (id?: string | null) => {
        return async (value: string) => {
            const valid = !(await api.post.slugExists(api.me(), value, id));
            return { valid, name: 'unique' };
        };
    };

    export let post: Post | null = null;

    const title = field('title', post?.title ?? '', [required()], {
        checkOnInit: Boolean(post),
    });
    const slug = field('slug', post?.slug ?? '', [required(), slugNotExists(post?.id)], {
        stopAtFirstError: true,
        checkOnInit: Boolean(post),
    });
    const content = field('content', post?.content ?? '', [required()], {
        checkOnInit: Boolean(post),
    });
    let draft = field('draft', post?.draft ?? false, [], {
        checkOnInit: Boolean(post),
    });
    const form = _form(title, slug, content, draft);
    form.validate();

    title.subscribe((title) => {
        if (title.dirty) {
            slug.set(makeSlug(title.value));
        }
    });

    const dispatch = createEventDispatcher();

    export let submitting: boolean;

    const submit = () => {
        if ($form.dirty && $form.valid) {
            dispatch('submit', {
                title: $title.value,
                slug: $slug.value,
                content: $content.value,
                draft: $draft.value,
            });
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
                        ><input type="checkbox" bind:checked={$draft.value} disabled={submitting} />
                        Draft</label
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
