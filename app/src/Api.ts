import { writable, get } from 'svelte/store';
import type { Subscriber, Unsubscriber, Writable } from 'svelte/store';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import UserRepo from './Api/UserRepo';

declare type Invalidator<T> = (value?: T) => void;

export interface Me {
    token: string;
    id: string;
}

export interface User {
    name: string;
    tags: string[];
}

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>;

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export interface ApiError {
    code: IntRange<100, 200> | IntRange<400, 600>;
    details: string;
    description: string;
    information?: string;
}

export interface SignResponse {
    code: IntRange<400, 500>;
    details: string;
    token: string;
}

export type QueryResult<T> =
    | {
          time: string;
          status: 'OK';
          result: T[];
      }
    | {
          time: string;
          status: 'ERR';
          detail: string;
      };

export interface SignUp {
    username: string;
    email: string;
    password: string;
    marketing: boolean;
}

export interface SignIn {
    user: string;
    password: string;
}

class Api {
    private store: Writable<Me | null>;
    readonly url: URL;
    readonly namespace: string;
    readonly database: string;
    readonly scope: string;

    constructor(url: URL, namespace: string, database: string, scope: string) {
        this.store = writable<Me | null>(null);
        this.url = new URL(url.toString());
        if (!this.url.pathname.endsWith('/')) {
            this.url.pathname += '/';
        }
        this.namespace = namespace;
        this.database = database;
        this.scope = scope;
    }

    public init(): Promise<void> {
        let token = Cookies.get('TOKEN');
        if (token && token.trim().length > 0) {
            return this.validate(token).then(
                () => {},
                () => {},
            );
        } else {
            return Promise.resolve();
        }
    }

    public isLogged(): boolean {
        return Boolean(get(this.store));
    }

    public subscribe(run: Subscriber<void>, invalidate?: Invalidator<void>): Unsubscriber {
        if (invalidate) {
            return this.store.subscribe(
                (_) => run(),
                (_) => invalidate(),
            );
        } else {
            return this.store.subscribe((_) => run());
        }
    }

    private request<T, D = any>(config: AxiosRequestConfig<D>): Promise<AxiosResponse<T>> {
        config.baseURL = this.url.toString();
        config.responseType = 'json';
        config.validateStatus = function (status) {
            return (status >= 200 && status < 300) || (status >= 400 && status < 600);
        };

        let res = axios.request<T, AxiosResponse<T, D>, D>(config);
        res.then((res) => {
            if (res.status == 401 || res.status == 403) {
                Cookies.remove('TOKEN', '');
                this.store.set(null);
            }
        });

        return res;
    }

    private async validate(token: string): Promise<void> {
        const res = await this._query<{ id: string }>(
            token,
            'SELECT meta::id(id) AS id FROM user WHERE id = $auth.id',
        );
        Cookies.set('TOKEN', token, 14, 'd');
        this.store.set({ id: res[0].id, token });
    }

    private async sign(url: string, data: unknown): Promise<void> {
        let vars = {
            ns: this.namespace,
            db: this.database,
            sc: this.scope,
            ...JSON.parse(JSON.stringify(data)),
        };

        const res = await this.request<SignResponse | ApiError>({
            method: 'post',
            url,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            data: vars,
        });

        if (res.data.code >= 200 && res.data.code < 300) {
            const token = (res.data as SignResponse).token;
            return await this.validate(token);
        } else {
            throw res.data;
        }
    }

    public signup(data: SignUp): Promise<void> {
        return this.sign('signup', data);
    }

    public signin(data: SignIn): Promise<void> {
        return this.sign('signin', data);
    }

    public me(): string | null {
        return get(this.store)?.id;
    }

    private async _query<T>(
        token: string | null,
        query: string,
        vars?: Record<string, any>,
    ): Promise<T[]> {
        let headers = {
            'Content-Type': 'text/plain',
            Accept: 'application/json',
            NS: this.namespace,
            DB: this.database,
            Authorization: null,
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        let params: Record<string, string> = {};
        for (const k in vars) {
            params[k] = JSON.stringify(vars[k]);
        }

        const res = await this.request<[QueryResult<T>] | ApiError>({
            method: 'post',
            url: 'sql',
            headers,
            params,
            data: query,
        });
        if (Array.isArray(res.data)) {
            const data = res.data[0];

            if (data.status == 'ERR') {
                throw data;
            } else {
                return data.result;
            }
        } else {
            throw res.data;
        }
    }

    public query<T>(query: string, vars?: Record<string, any>): Promise<T[]> {
        return this._query<T>(get(this.store)?.token, query, vars);
    }

    get user(): UserRepo {
        return new UserRepo(this);
    }
}

export default Api;
