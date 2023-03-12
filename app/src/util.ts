export function debounce<T extends (...args: any) => any>(
    func: T,
    timeout: number,
): { func: (...args: Parameters<T>) => void; clear: () => void } {
    let timer: number | null = null;
    return {
        func: (...args: Parameters<T>) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                try {
                    func.apply(this, args);
                } finally {
                    timer = null;
                }
            }, timeout);
        },
        clear: () => clearTimeout(timer),
    };
}

export function bindScroll(
    node: HTMLElement,
    opts?: { delta?: number; show?: string; hide?: string },
): { destroy: () => void } {
    const documentHeight = () => {
        var body = document.body,
            html = document.documentElement;

        return Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight,
        );
    };

    let delta = opts?.delta ?? 5;
    let lastScrollTop = 0;

    const { func: onScroll, clear } = debounce(() => {
        let st = window.pageYOffset;

        if (Math.abs(lastScrollTop - st) <= delta) return;

        if (st > lastScrollTop && st > node.offsetHeight) {
            node.style.top = `-${node.offsetHeight}px`;
            if (opts?.hide) {
                node.classList.add(opts!.hide);
            }
            if (opts?.show) {
                node.classList.remove(opts!.show);
            }
        } else if (st + window.innerHeight < documentHeight()) {
            node.style.top = '0';
            if (opts?.show) {
                node.classList.add(opts!.show);
            }
            if (opts?.hide) {
                node.classList.remove(opts!.hide);
            }
        }

        lastScrollTop = st;
    }, 150);

    window.addEventListener('scroll', onScroll, false);

    return {
        destroy() {
            window.removeEventListener('scroll', onScroll);
            clear();
        },
    };
}
