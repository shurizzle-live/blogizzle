<script lang="ts">
    import { Template } from '@/components';
    import { Post } from '@/Api';
    import { User } from '@/Api/UserRepo';
    import { api } from '@/stores';
    import { ConvertedParam, goto, query } from 'svelte-pathfinder';
    import { format } from 'date-fns';
    import { enGB as locale } from 'date-fns/locale';
    import Fa from 'svelte-fa/src/fa.svelte';
    import { faPenRuler } from '@fortawesome/free-solid-svg-icons/index.js';

    function extractPage(query: { [key: string]: ConvertedParam }) {
        let page = query.page;
        if (Number.isSafeInteger(page)) {
            let p = page as number;
            if (p > 0) {
                return p;
            }
        }
        return 1;
    }

    export let user: User;
    let page: number = extractPage($query);
    query.subscribe((q) => {
        let newPage = extractPage(q);
        if (newPage !== page) {
            page = newPage;
        }
    });

    let posts: { posts: Post[]; prev: boolean; next: boolean } = {
        posts: [],
        prev: false,
        next: false,
    };
    let promise: Promise<{ posts: Post[]; prev: boolean; next: boolean }>;
    $: {
        promise = api.post.list(user.name, page);
        promise.then((p) => {
            posts = p;
        });
    }
</script>

{#await promise}
    Loading...
{:then}
    <Template>
        <header><h1>{user.name}</h1></header>
        <main>
            {#each posts.posts as post}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                    class="post"
                    on:click|preventDefault={() => goto(`/${user.name}/${post.slug}`)}
                >
                    {#if post.draft}
                        <Fa icon={faPenRuler} />
                    {/if}
                    <strong>{post.title}</strong>
                    <i><small>@ {format(post.created_at, 'PPPpp', { locale })}</small></i>
                </div>
            {/each}

            <!-- Pagination -->
            {#if posts.prev}
                Prev
            {/if}
            {#if posts.next}
                Next
            {/if}
        </main>
    </Template>
{/await}

<style lang="scss">
    header {
        h1 {
            margin: 0;
            padding-top: 0.5em;
            text-align: center;
            padding-bottom: 3em;
        }
    }

    .post {
        line-height: 2em;
        cursor: pointer;
        padding: 0 2em;

        &:hover {
            background-color: var(--focus-bg);
        }
    }
</style>
