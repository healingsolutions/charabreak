import { GamingWebCore } from './gaming-web-core.js?v=0.2.41';
import { GamingWebLogger } from './logger.js?v=0.2.41';
import { AudioManager } from './audio-manager.js?v=0.2.41';
import { resolveVisualTheme } from './visual-theme.js?v=0.2.41';
import { GamingWebWorldMap } from './world-map.js?v=0.2.41';

const RESUME_KEY = 'gaming_web_resume_mode';

ready(() => {
    const config = resolveConfig();

    if (!isEnabled(config.enabled)) {
        return;
    }

    config.audioBase = config.audioBase || `${pluginAssetBase()}audio/`;
    const visualTheme = resolveVisualTheme(config.visualStyle || 'auto', document);
    config.visualStyle = visualTheme.style;
    config.themeTokens = {
        ...(config.themeTokens || {}),
        ...visualTheme.tokens,
    };

    const logger = new GamingWebLogger(config);
    const audio = new AudioManager({
        baseUrl: config.audioBase,
        debug: config.debug,
        stageAudio: config.stageAudio || {},
    });
    const worldMap = new GamingWebWorldMap(config, {
        isGameActive: () => core?.isActive?.() || false,
        onStart: () => beginGame(lastStartTrigger),
        onNavigate: (href) => {
            storeResumeMode(true);
            window.location.href = href;
        },
        onSound: (name, options) => {
            audio.play(name, options);
        },
    });

    const floatingButton = shouldShowFloatingButton(config) ? createFloatingButton(config) : null;
    let lastStartTrigger = null;

    const core = new GamingWebCore({
        ...config,
        logger,
        audio,
        onWorldMapOpen: () => {
            worldMap.open({ mode: 'hud', onStart: () => beginGame(lastStartTrigger) });
        },
        onStageClear: (detail, response) => {
            worldMap.markStageCleared(detail, response);
        },
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

    function beginGame(trigger = null) {
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

    function startGame(trigger = null, options = {}) {
        if (core.isActive()) {
            return;
        }

        lastStartTrigger = trigger;

        if (!options.skipWorldMap && shouldShowWorldMapOnStart(config, worldMap)) {
            worldMap.open({
                mode: 'start',
                onStart: () => beginGame(trigger),
            });
            return;
        }

        beginGame(trigger);
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
        openWorldMap: () => worldMap.open({ mode: core.isActive() ? 'hud' : 'browse', onStart: () => beginGame(null) }),
    };

    if (readResumeMode()) {
        setStartTriggersEnabled(false);
        if (floatingButton) {
            floatingButton.hidden = true;
        }

        window.setTimeout(() => {
            startGame(null, { skipWorldMap: true });
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

function shouldShowWorldMapOnStart(config, worldMap) {
    return worldMap?.isEnabled?.()
        && config.worldMap?.showOnStart !== false
        && config.worldMap?.showOnStart !== '0'
        && config.worldMap?.showOnStart !== 0;
}

function resolveConfig() {
    const globalConfig = globalThis.GamingWebConfig || window.GamingWebConfig;
    if (globalConfig && typeof globalConfig === 'object') {
        return globalConfig;
    }

    const configScript = document.getElementById('gaming-web-config');
    if (!configScript) {
        return {};
    }

    try {
        const parsed = JSON.parse(configScript.textContent || '{}');
        if (parsed && typeof parsed === 'object') {
            globalThis.GamingWebConfig = parsed;
            return parsed;
        }
    } catch (error) {
        if (window.console && typeof window.console.warn === 'function') {
            window.console.warn('[Gaming Web] Invalid frontend config.', error);
        }
    }

    return {};
}

function isEnabled(value) {
    return value === true
        || value === 1
        || value === '1'
        || value === 'true';
}

function ready(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback, { once: true });
        return;
    }

    callback();
}

function pluginAssetBase() {
    const script = document.querySelector('script[src*="/charabreak/assets/js/wordpress-adapter.js"], script[src*="/gaming-web/assets/js/wordpress-adapter.js"]');
    if (!script) {
        return '/wp-content/plugins/charabreak/assets/';
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



