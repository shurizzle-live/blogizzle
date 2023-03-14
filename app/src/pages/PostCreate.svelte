<script lang="ts">
    import { PostEdit } from '@/components';
    import { api } from '@/stores';
    import { redirect } from 'svelte-pathfinder';

    let submitting = false;
    const submit = (
        evt: CustomEvent<{ title: string; slug: string; content: string; draft: boolean }>,
    ) => {
        evt.preventDefault();
        submitting = true;
        try {
            const fut = api.post.create(evt.detail);
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

<PostEdit {submitting} on:submit={submit} />
