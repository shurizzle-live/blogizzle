<script lang="ts">
    import { Post } from '@/Api';
    import { User } from '@/Api/UserRepo';
    import { api } from '@/stores';
    import { ConvertedParam, goto, query } from 'svelte-pathfinder';

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

    let posts: Post[] = [];
    let promise: Promise<Post[]>;
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
    <header><h1>{user.name}</h1></header>
    <main>
        {#each posts as post}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div on:click|preventDefault={() => goto(`/${user.name}/${post.slug}`)}>
                {post.title}
            </div>
        {/each}
    </main>
{/await}

<style lang="scss">
    header {
        h1 {
            margin: 0;
            padding-top: 0.5em;
            text-align: center;
        }
    }
</style>
