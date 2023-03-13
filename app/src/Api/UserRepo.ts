import Api from '@/Api';

export interface Me {
    id: string;
    name: string;
    email: string;
}

export interface User {
    id: string;
    name: string;
}

export default class UserRepo {
    private api: Api;

    constructor(api: Api) {
        this.api = api;
    }

    public async nameExists(name: string): Promise<boolean> {
        let res = await this.api.query<{ exists: boolean }>(
            'SELECT count() > 0 AS exists FROM user WHERE name = $name',
            { name },
        );
        return res.length > 0 ? res[0].exists : false;
    }

    public async emailExists(email: string): Promise<boolean> {
        let res = await this.api.query<{ exists: boolean }>(
            'SELECT count() > 0 AS exists FROM user WHERE email = $email',
            { email },
        );
        return res.length > 0 ? res[0].exists : false;
    }

    public async me(): Promise<Me | null> {
        let res = await this.api.query<Me>(
            'SELECT meta::id(id) AS id, name, email FROM user WHERE id = type::thing("user", $id)',
            {
                id: this.api.me(),
            },
        );

        return res.length > 0 ? res[0] : null;
    }

    public async get(id: string): Promise<User | null> {
        let res = await this.api.query<Me>(
            'SELECT meta::id(id) AS id, name FROM user WHERE id = type::thing("user", $id)',
            {
                id,
            },
        );

        return res.length > 0 ? res[0] : null;
    }

    public async getByName(name: string): Promise<User | null> {
        let res = await this.api.query<Me>(
            'SELECT meta::id(id) AS id, name FROM user WHERE name = $name',
            {
                name,
            },
        );

        return res.length > 0 ? res[0] : null;
    }
}
