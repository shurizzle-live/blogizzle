<script lang="ts">
    import { Template } from '@/components';
    import { NotFound } from '@/pages';
    import { Post } from '@/Api';
    import { User } from '@/Api/UserRepo';
    import { api } from '@/stores';
    import { format } from 'date-fns';
    import { enGB as locale } from 'date-fns/locale';
    import SvelteMarkdown from 'svelte-markdown';
    import Fa from 'svelte-fa/src/fa.svelte';
    import { faPenRuler } from '@fortawesome/free-solid-svg-icons/index.js';
    import { goto } from 'svelte-pathfinder';

    export let user: User;
    export let slug: string;

    let post: Post | null;
    let promise: Promise<Post | null>;
    $: {
        promise = api.post.bySlug(user.id, slug);
        promise.then((p) => {
            post = p;
        });
    }
</script>

{#await promise}
    Loading...
{:then}
    {#if post}
        <Template>
            <header>
                <h1>{user.name}</h1>
                <h2>{post.title}</h2>
                <time datetime={format(post.created_at, "yyyy-MM-dd'T'HH:mm:ssXX")}
                    >{format(post.created_at, 'PPPpp', { locale })}</time
                >
            </header>
            <main>
                <div class="can-edit">
                    <a href="/" on:click|preventDefault={() => goto(`/admin/post/edit/${post.id}`)}
                        >x</a
                    >
                    {#if post.draft}
                        <Fa icon={faPenRuler} />
                    {/if}
                </div>
                <article>
                    <SvelteMarkdown source={post.content} />
                </article>
            </main>
        </Template>
    {:else}
        <NotFound />
    {/if}
{/await}

<style lang="scss">
    header {
        h1,
        h2,
        time {
            margin: 0;
            padding-top: 0.5em;
            text-align: center;
            display: block;
        }

        time {
            font-size: 0.8em;
            padding-bottom: 3em;
        }
    }
    main {
        padding: 0.5em;
    }
    .can-edit {
        text-align: right;
    }
</style>
