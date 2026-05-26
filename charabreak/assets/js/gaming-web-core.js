import { scanGameTargets } from './dom-scanner.js?v=0.2.45';
import { StageOverlay } from './stage-overlay.js?v=0.2.45';
import { InteractionEngine } from './interaction-engine.js?v=0.2.45';
import { TextBreaker } from './text-breaker.js?v=0.2.45';
import { ImageBreaker } from './image-breaker.js?v=0.2.45';

const MOBILE_GAME_SCALE = 0.75;

export class GamingWebCore {
    constructor(config = {}) {
        this.config = config;
        this.logger = config.logger;
        this.audio = config.audio;
        this.onExit = config.onExit || (() => {});
        this.overlay = null;
        this.engine = null;
        this.textBreaker = null;
        this.imageBreaker = null;
        this.active = false;
    }

    isActive() {
        return this.active;
    }

    start() {
        if (this.active) {
            return;
        }

        this.active = true;
        document.body.classList.add('gw-game-active');
        const mobileGameScale = resolveMobileGameScale();
        const mobileGameMode = mobileGameScale < 1;
        document.body.classList.toggle('gw-game-mobile-scale', mobileGameScale < 1);
        document.body.classList.toggle('gw-game-mobile-low-power', mobileGameMode);
        document.body.style.setProperty('--gw-mobile-stage-scale', String(mobileGameScale));
        this.audio?.resume();
        this.audio?.play('start', { volume: 0.24 });

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const targets = scanGameTargets(document, { limit: mobileGameMode ? 110 : 320 });
        this.textBreaker = new TextBreaker({
            maxChars: mobileGameMode ? 1400 : 7200,
            lowPower: mobileGameMode,
        });
        this.textBreaker.prepare(targets);
        this.imageBreaker = new ImageBreaker({ lowPower: mobileGameMode });
        this.imageBreaker.prepare(targets);

        this.overlay = new StageOverlay({
            characterName: this.config.characterName,
            messages: this.config.messages,
            importantWords: this.config.importantWords || [],
            hasReward: this.config.hasReward === '1' || this.config.hasReward === true,
            visualStyle: this.config.visualStyle || 'auto',
            playStyle: this.config.playStyle || 'break',
            themeTokens: this.config.themeTokens || {},
            enemyConfig: this.config.enemyConfig || {},
            objectiveConfig: this.config.objectiveConfig || {},
            mobileGameScale,
            reducedMotion,
            textBreaker: this.textBreaker,
            imageBreaker: this.imageBreaker,
            bgmEnabled: this.audio?.getBgmEnabled?.() || false,
            onBgmChoice: async (enabled) => {
                const nextEnabled = await this.audio?.setBgmEnabled(enabled);
                this.overlay?.setBgmEnabled(Boolean(nextEnabled));
                this.audio?.play(enabled ? 'uiOpen' : 'uiMove', { volume: enabled ? 0.12 : 0.08 });
            },
            onBgmToggle: async (enabled) => {
                const nextEnabled = await this.audio?.setBgmEnabled(enabled);
                this.audio?.play('uiMove', { volume: 0.16 });
                this.overlay?.setBgmEnabled(Boolean(nextEnabled));
            },
            worldMapEnabled: Boolean(this.config.worldMap?.enabled && this.config.worldMap?.showInHud),
            worldMapAfterClear: Boolean(this.config.worldMap?.enabled && this.config.worldMap?.showAfterClear),
            onWorldMapOpen: () => {
                if (typeof this.config.onWorldMapOpen === 'function') {
                    this.config.onWorldMapOpen();
                }
            },
            onNavigate: (href) => {
                if (typeof this.config.onNavigate === 'function') {
                    this.config.onNavigate(href);
                    return;
                }

                window.location.href = href;
            },
            onRunnerSound: (name, options) => {
                this.audio?.play(name, options);
            },
            onTreasureCollect: (detail) => {
                this.logger?.log('word_collect', {
                    stage_name: this.config.stageName,
                    inventory_count: this.engine?.inventory.length || 0,
                    ...detail,
                });
            },
            onRetry: () => {
                this.restart();
            },
            onStageClear: (detail) => {
                const payload = {
                    stage_name: this.config.stageName,
                    inventory_count: this.engine?.inventory.length || 0,
                    ...detail,
                };
                const request = this.logger?.log('stage_soft_clear', stageLogPayload(payload)) || Promise.resolve({ skipped: true });

                return Promise.resolve(request).then((response) => {
                    if (typeof this.config.onStageClear === 'function') {
                        this.config.onStageClear(payload, response);
                    }

                    return response;
                });
            },
            onExit: () => this.stop(),
            onInventoryOpen: () => {
                this.audio?.play('uiOpen', { volume: 0.2 });
                this.logger?.log('inventory_open', {
                    stage_name: this.config.stageName,
                    inventory_count: this.engine?.inventory.length || 0,
                });
            },
        });

        this.overlay.mount();

        this.engine = new InteractionEngine({
            targets,
            overlay: this.overlay,
            logger: this.logger,
            audio: this.audio,
            stageName: this.config.stageName,
            importantWords: this.config.importantWords || [],
        });

        this.overlay.startRunner(
            targets,
            (target, trigger) => {
                this.engine?.runnerHitTarget(target, trigger);
            },
            (detail) => {
                this.engine?.playerBreakText(detail);
            },
            (detail) => {
                this.engine?.playerHitImage(detail);
            },
            (detail) => {
                this.engine?.playerHitGate(detail);
            },
            (detail) => {
                this.engine?.playerHitEnemy(detail);
            }
        );

        this.logger?.log('game_start', {
            stage_name: this.config.stageName,
            inventory_count: 0,
        });

        if (this.config.debug) {
            console.info('[Gaming Web] scanned targets', targets);
        }
    }

    restart() {
        if (!this.active) {
            return;
        }

        this.stop({ restarting: true });
        window.setTimeout(() => {
            this.start();
        }, 180);
    }

    stop(options = {}) {
        if (!this.active) {
            return;
        }

        const inventoryCount = this.engine?.inventory.length || 0;
        const stageResult = this.overlay?.stageResult?.('exit') || {};
        if (!options.restarting) {
            this.audio?.play('exit', { volume: 0.22 });
        }
        this.audio?.stopBgm();
        this.engine?.stop();
        this.textBreaker?.restore();
        this.imageBreaker?.restore();
        this.overlay?.destroy();
        this.engine = null;
        this.textBreaker = null;
        this.imageBreaker = null;
        this.overlay = null;
        this.active = false;
        document.body.classList.remove('gw-game-active');
        document.body.classList.remove('gw-game-mobile-scale');
        document.body.classList.remove('gw-game-mobile-low-power');
        document.body.style.removeProperty('--gw-mobile-stage-scale');

        this.logger?.log('game_exit', stageLogPayload({
            stage_name: this.config.stageName,
            inventory_count: inventoryCount,
            ...stageResult,
        }));

        if (!options.restarting) {
            this.onExit();
        }
    }
}

function resolveMobileGameScale() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return 1;
    }

    return window.matchMedia('(max-width: 700px), (pointer: coarse)').matches
        ? MOBILE_GAME_SCALE
        : 1;
}

function stageLogPayload(payload) {
    const result = { ...(payload || {}) };

    delete result.score;
    Object.keys(result).forEach((key) => {
        if (
            key === 'score_total'
            || key === 'score_rank'
            || key === 'score_best'
            || key === 'score_new_best'
            || key === 'score_attempts'
            || key === 'clear_time_ms'
            || key === 'clear_time_label'
            || key === 'max_parry_combo'
            || key === 'damage_taken'
        ) {
            delete result[key];
        }
    });

    return result;
}



