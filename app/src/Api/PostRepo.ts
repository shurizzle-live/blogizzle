import Api from '@/Api';

export interface PostCreate {
    slug: string;
    title: string;
    content: string;
    draft?: boolean;
}

export interface Post extends PostCreate {
    created_at: string;
}

export default class PostRepo {
    private api: Api;

    constructor(api: Api) {
        this.api = api;
    }
}
