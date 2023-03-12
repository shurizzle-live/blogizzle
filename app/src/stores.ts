import { Readable, Unsubscriber, Subscriber, Writable, Updater, writable } from 'svelte/store';
import Api from './Api';

export const api = new Api(new URL('http://localhost:8000'), 'test', 'test', 'allusers');
// @ts-ignore
window.api = api;

export type Theme = 'dark' | 'light';

class ThemeStore implements Readable<Theme>, Writable<Theme> {
    private store: Writable<Theme>;
    private media: MediaQueryList | null;

    constructor() {
        if (window.matchMedia) {
            this.media = window.matchMedia('(prefers-color-scheme: dark)');
        }
        this.store = writable(this.compute());

        this.media.onchange = this.onChange.bind(this);
    }

    private onChange() {
        if (!this.getFromStore()) {
            this.store.set(this.compute());
        }
    }

    private getFromMedia(): Theme | null {
        if (this.media) {
            return this.media.matches ? 'dark' : 'light';
        }
    }

    private getFromStore(): Theme | null {
        if (localStorage) {
            let t = localStorage.getItem('theme');
            if (t == 'dark' || t == 'light') {
                return t;
            }
        }
    }

    private deleteStore() {
        if (localStorage) {
            localStorage.removeItem('theme');
        }
    }

    private setStore(theme: Theme) {
        if (localStorage) {
            localStorage.setItem('theme', theme);
        }
    }

    private getDefault(): Theme {
        return 'light';
    }

    private compute(): Theme {
        return this.getFromStore() ?? this.getFromMedia() ?? this.getDefault();
    }

    public subscribe(run: Subscriber<Theme>, invalidate?: (value?: Theme) => void): Unsubscriber {
        if (invalidate) {
            return this.store.subscribe(run, invalidate);
        }
        return this.store.subscribe(run);
    }

    public set(value: Theme): void {
        this.update((_) => value);
    }

    public update(update: Updater<Theme>): void {
        this.store.update((old: Theme) => {
            let _new = update(old);

            if (_new == this.compute()) {
                return _new;
            }

            if (_new == this.getFromMedia() && _new != this.getFromStore()) {
                this.deleteStore();
            }

            this.setStore(_new);

            return _new;
        });
    }
}

export const theme: Writable<Theme> = (() => {
    const inst = new ThemeStore();

    inst.subscribe((theme) => {
        document.documentElement.setAttribute('data-theme', theme);
    });

    return {
        subscribe: inst.subscribe.bind(inst),
        set: inst.set.bind(inst),
        update: inst.update.bind(inst),
    };
})();
