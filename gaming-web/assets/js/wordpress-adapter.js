import { GamingWebCore } from './gaming-web-core.js?v=0.1.46';
import { GamingWebLogger } from './logger.js?v=0.1.46';
import { AudioManager } from './audio-manager.js?v=0.1.46';

const config = window.GamingWebConfig || {};
const RESUME_KEY = 'gaming_web_resume_mode';

ready(() => {
    if (!config.enabled) {
        return;
    }

    config.audioBase = config.audioBase || `${pluginAssetBase()}audio/`;

    const logger = new GamingWebLogger(config);
    const audio = new AudioManager({
        baseUrl: config.audioBase,
        debug: config.debug,
    });

    const floatingButton = shouldShowFloatingButton(config) ? createFloatingButton(config) : null;
    let lastStartTrigger = null;

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
            setStartTriggersEnabled(true);

            if (floatingButton) {
                floatingButton.hidden = false;
            }

            const focusTarget = lastStartTrigger?.isConnected ? lastStartTrigger : floatingButton;
            focusTarget?.focus?.({ preventScroll: true });
        },
    });

    function startGame(trigger = null) {
        if (core.isActive()) {
            return;
        }

        lastStartTrigger = trigger;
        storeResumeMode(true);
        setStartTriggersEnabled(false);

        if (floatingButton) {
            floatingButton.hidden = true;
        }

        core.start();
    }

    if (floatingButton) {
        floatingButton.addEventListener('click', () => startGame(floatingButton));
        document.body.appendChild(floatingButton);
    }

    document.addEventListener('click', (event) => {
        const trigger = event.target?.closest?.('[data-gaming-web-start], .gw-inline-start');
        if (!trigger) {
            return;
        }

        event.preventDefault();
        startGame(trigger);
    });

    window.GamingWeb = {
        ...(window.GamingWeb || {}),
        core,
        config,
        start: () => startGame(null),
        stop: () => core.stop(),
        isActive: () => core.isActive(),
    };

    if (readResumeMode()) {
        setStartTriggersEnabled(false);
        if (floatingButton) {
            floatingButton.hidden = true;
        }

        window.setTimeout(() => {
            core.start();
        }, 260);
    }
});

function createFloatingButton(config) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gw-mode-button';
    button.textContent = config.buttonLabel || '\u30b2\u30fc\u30e0\u30e2\u30fc\u30c9';
    button.setAttribute('aria-label', button.textContent);

    return button;
}

function setStartTriggersEnabled(enabled) {
    document.querySelectorAll('[data-gaming-web-start], .gw-inline-start').forEach((trigger) => {
        trigger.classList.toggle('is-gaming-web-active', !enabled);
        trigger.setAttribute('aria-disabled', enabled ? 'false' : 'true');
    });
}

function shouldShowFloatingButton(config) {
    return config.showFloatingButton !== false
        && config.showFloatingButton !== '0'
        && config.showFloatingButton !== 0;
}

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



