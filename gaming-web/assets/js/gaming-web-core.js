import { scanGameTargets } from './dom-scanner.js?v=0.1.35';
import { StageOverlay } from './stage-overlay.js?v=0.1.35';
import { InteractionEngine } from './interaction-engine.js?v=0.1.35';
import { TextBreaker } from './text-breaker.js?v=0.1.35';
import { ImageBreaker } from './image-breaker.js?v=0.1.35';

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
        this.audio?.resume();
        this.audio?.play('start', { volume: 0.24 });
        this.audio?.startBgmIfEnabled();

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const targets = scanGameTargets(document, { limit: 180 });
        this.textBreaker = new TextBreaker();
        this.textBreaker.prepare(targets);
        this.imageBreaker = new ImageBreaker();
        this.imageBreaker.prepare(targets);

        this.overlay = new StageOverlay({
            characterName: this.config.characterName,
            messages: this.config.messages,
            importantWords: this.config.importantWords || [],
            reducedMotion,
            textBreaker: this.textBreaker,
            imageBreaker: this.imageBreaker,
            bgmEnabled: this.audio?.getBgmEnabled?.() || false,
            onBgmToggle: async (enabled) => {
                const nextEnabled = await this.audio?.setBgmEnabled(enabled);
                this.audio?.play('uiMove', { volume: 0.16 });
                this.overlay?.setBgmEnabled(Boolean(nextEnabled));
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
            onRetry: () => {
                this.restart();
            },
            onStageClear: (detail) => {
                this.logger?.log('stage_soft_clear', {
                    stage_name: this.config.stageName,
                    inventory_count: this.engine?.inventory.length || 0,
                    ...detail,
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

        this.logger?.log('game_exit', {
            stage_name: this.config.stageName,
            inventory_count: inventoryCount,
            ...stageResult,
        });

        if (!options.restarting) {
            this.onExit();
        }
    }
}



