import Api from '@/Api';
import { parseISO } from 'date-fns';

export interface PostCreate {
    slug: string;
    title: string;
    content: string;
    draft?: boolean;
}

interface RawPost extends PostCreate {
    id: string;
    created_at: string;
}

export interface Post extends PostCreate {
    id: string;
    created_at: Date;
}

function rawToPost(p: RawPost): Post {
    return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        content: p.content,
        draft: p.draft,
        created_at: parseISO(p.created_at),
    };
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

    public async update(id: string, data: PostCreate): Promise<PostCreate | null> {
        let res = await this.api.query<PostCreate>(
            'UPDATE type::thing("post", $id) CONTENT { slug: $slug, title: $title, content: $content, draft: $draft }',
            {
                id,
                ...data,
            },
        );
        return res.length > 0 ? res[0] : null;
    }

    public async list(
        name: string,
        page: number,
        size: number = 10,
    ): Promise<{ posts: Post[]; prev: boolean; next: boolean }> {
        let posts = await this.api.query<RawPost>(
            'SELECT meta::id(id) as id, title, slug, content, draft, created_at FROM post WHERE owner.name = $name ORDER BY created_at DESC LIMIT BY $size START AT $start',
            {
                name,
                size: size + 1,
                start: (page - 1) * size,
            },
        );

        const next = posts.length > size;

        return {
            prev: page > 2,
            next,
            posts: posts.slice(0, size).map(rawToPost),
        };
    }

    public async slugExists(user: string, slug: string, currentId?: string): Promise<boolean> {
        let query =
            'SELECT count() > 0 AS exists FROM post WHERE owner = type::thing("user", $user) AND slug = $slug';
        let pars = {
            user,
            slug,
        };

        if (currentId) {
            query += ' AND id != type::thing("post", $current)';
            pars['current'] = currentId;
        }

        let res = await this.api.query<{ exists: boolean }>(query, pars);

        return res.length > 0 ? res[0].exists : false;
    }

    public async bySlug(user: string, slug: string): Promise<Post | null> {
        let res = await this.api.query<RawPost>(
            'SELECT meta::id(id) as id, title, slug, content, draft, created_at FROM post WHERE owner = type::thing("user", $user) AND slug = $slug',
            {
                user,
                slug,
            },
        );

        if (res.length > 0) {
            return rawToPost(res[0]);
        } else {
            return null;
        }
    }

    public async byId(id: string): Promise<Post | null> {
        let res = await this.api.query<RawPost>(
            'SELECT meta::id(id) as id, title, slug, content, draft, created_at FROM post WHERE id = type::thing("post", $id)',
            {
                id,
            },
        );

        if (res.length > 0) {
            return rawToPost(res[0]);
        } else {
            return null;
        }
    }
}
