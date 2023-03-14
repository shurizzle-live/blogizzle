import Api from '@/Api';

export interface PostCreate {
    slug: string;
    title: string;
    content: string;
    draft?: boolean;
}

export interface Post {
    title: string;
    slug: string;
    content: string;
    created_at: string;
}

export interface Post extends PostCreate {
    created_at: string;
}

export default class PostRepo {
    private api: Api;

    constructor(api: Api) {
        this.api = api;
    }

    public async create(data: PostCreate): Promise<PostCreate | null> {
        let res = await this.api.query<PostCreate>(
            'CREATE post CONTENT { slug: $slug, title: $title, content: $content, draft: $draft }',
            data,
        );
        return res.length > 0 ? res[0] : null;
    }

    public list(name: string, page: number): Promise<Post[]> {
        return this.api.query<Post>(
            'SELECT title, slug, content, created_at FROM post WHERE owner.name = $name ORDER BY created_at DESC LIMIT BY 10 START AT $start',
            {
                name,
                start: (page - 1) * 10,
            },
        );
    }

    public async slugExists(user: string, slug: string): Promise<boolean> {
        let res = await this.api.query<{ exists: boolean }>(
            'SELECT count() > 0 AS exists FROM post WHERE owner = type::thing("user", $user) AND slug = $slug',
            {
                user,
                slug,
            },
        );

        return res.length > 0 ? res[0].exists : false;
    }
}
