<script lang="ts">
    import { Post } from '@/Api';
    import { PostEdit } from '@/components';
    import { NotFound } from '@/pages';
    import { api } from '@/stores';
    import { redirect } from 'svelte-pathfinder';

    export let postId: string;

    let post: Post | null = null;
    let promise: Promise<Post | null>;
    $: {
        promise = api.post.byId(postId);
        promise.then((p) => {
            post = p;
        });
    }

    let submitting = false;
    const submit = (
        evt: CustomEvent<{ title: string; slug: string; content: string; draft: boolean }>,
    ) => {
        evt.preventDefault();
        submitting = true;
        try {
            const fut = api.post.update(post.id, evt.detail);
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
    };
</script>

{#await promise}
    Loading...
{:then}
    {#if post}
        <PostEdit {post} {submitting} on:submit={submit} />
    {:else}
        <NotFound />
    {/if}
{/await}
