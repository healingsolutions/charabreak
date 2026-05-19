import { GamingWebCore } from './gaming-web-core.js?v=0.1.32';
import { GamingWebLogger } from './logger.js?v=0.1.32';
import { AudioManager } from './audio-manager.js?v=0.1.32';

const config = window.GamingWebConfig || {};
const RESUME_KEY = 'gaming_web_resume_mode';

ready(() => {
    if (!config.enabled) {
        return;
    }

    config.characterSprite = config.characterSprite || `${pluginAssetBase()}sprites/character-placeholder.svg`;
    config.audioBase = config.audioBase || `${pluginAssetBase()}audio/`;

    const logger = new GamingWebLogger(config);
    const audio = new AudioManager({
        baseUrl: config.audioBase,
        debug: config.debug,
    });

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gw-mode-button';
    button.textContent = config.buttonLabel || '\u30b2\u30fc\u30e0\u30e2\u30fc\u30c9';
    button.setAttribute('aria-label', button.textContent);
    document.body.appendChild(button);

    const core = new GamingWebCore({
        ...config,
        logger,
        audio,
        onNavigate: (href) => {
            storeResumeMode(true);
            window.location.href = href;
        },
        onExit: () => {
            storeResumeMode(false);
            button.hidden = false;
            button.focus({ preventScroll: true });
        },
    });

    button.addEventListener('click', () => {
        storeResumeMode(true);
        button.hidden = true;
        core.start();
    });

    if (readResumeMode()) {
        button.hidden = true;
        window.setTimeout(() => {
            core.start();
        }, 260);
    }
});

function ready(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback, { once: true });
        return;
    }

    callback();
}

function pluginAssetBase() {
    const script = document.querySelector('script[src*="/gaming-web/assets/js/wordpress-adapter.js"]');
    if (!script) {
        return '/wp-content/plugins/gaming-web/assets/';
    }

    const scriptUrl = new URL(script.src, window.location.href);
    scriptUrl.pathname = scriptUrl.pathname.replace('/js/wordpress-adapter.js', '/');
    scriptUrl.search = '';
    scriptUrl.hash = '';

    return scriptUrl.toString();
}

function readResumeMode() {
    try {
        return window.sessionStorage.getItem(RESUME_KEY) === '1';
    } catch (error) {
        return false;
    }
}

function storeResumeMode(enabled) {
    try {
        if (enabled) {
            window.sessionStorage.setItem(RESUME_KEY, '1');
        } else {
            window.sessionStorage.removeItem(RESUME_KEY);
        }
    } catch (error) {
        // Session storage can be blocked; navigation still works without resume.
    }
}



