export class GamingWebLogger {
    constructor(config = {}) {
        this.enabled = Boolean(config.loggingEnabled);
        this.endpoint = config.restUrl || '';
        this.nonce = config.nonce || '';
        this.pageId = Number(config.pageId || 0);
        this.pageUrl = config.pageUrl || window.location.href;
        this.debug = Boolean(config.debug);
        this.sessionId = getOrCreateSessionId();
    }

    log(eventType, data = {}) {
        const payload = {
            session_id: this.sessionId,
            page_id: this.pageId,
            page_url: this.pageUrl,
            event_type: eventType,
            timestamp: new Date().toISOString(),
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
            scroll: {
                x: Math.round(window.scrollX),
                y: Math.round(window.scrollY),
            },
            ...data,
        };

        if (this.debug) {
            console.info('[Gaming Web]', payload);
        }

        if (!this.enabled || !this.endpoint) {
            return Promise.resolve({ skipped: true });
        }

        return fetch(this.endpoint, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': this.nonce,
            },
            body: JSON.stringify(payload),
        }).catch((error) => {
            if (this.debug) {
                console.warn('[Gaming Web] event log failed', error);
            }
        });
    }
}

function getOrCreateSessionId() {
    const key = 'gaming_web_session_id';

    try {
        const existing = window.sessionStorage.getItem(key);
        if (existing) {
            return existing;
        }

        const created = `gw_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
        window.sessionStorage.setItem(key, created);
        return created;
    } catch (error) {
        return `gw_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    }
}
