<svelte:head>
    <title>Not Found</title>
</svelte:head>

<div class="center-container">
    <div class="w-full m-auto t-center">
        <header class="_404">404</header>
        <content>
            I'm really sorry, my good sir, but I cannot found a nice looking article for you.
        </content>
    </div>
</div>

<style lang="scss">
    .center-container {
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    ._404 {
        font-size: 10em;
        margin: 0;
        text-shadow: 0 0 30px var(--shadow);
    }

    content {
        margin: auto;
        display: block;
        max-width: 20em;
    }
</style>
