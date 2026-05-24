import { findScannedTarget } from './dom-scanner.js?v=0.2.38';

const MESSAGE_WORD_COLLECT = '\u8a00\u8449\u306e\u304b\u3051\u3089\u3092\u898b\u3064\u3051\u305f\uff01';
const MESSAGE_SOFT_CLEAR = '\u5c11\u3057\u30da\u30fc\u30b8\u304c\u660e\u308b\u304f\u306a\u3063\u305f\uff01';

export class InteractionEngine {
    constructor(options = {}) {
        this.targets = options.targets || [];
        this.overlay = options.overlay;
        this.logger = options.logger;
        this.audio = options.audio;
        this.stageName = options.stageName || '';
        this.importantWords = options.importantWords || [];
        this.inventory = [];
        this.active = false;
        this.softCleared = false;
        this.handleClick = this.handleClick.bind(this);
    }

    start() {
        if (this.active) {
            return;
        }

        this.active = true;
        document.addEventListener('click', this.handleClick, true);
    }

    stop() {
        if (!this.active) {
            return;
        }

        this.active = false;
        document.removeEventListener('click', this.handleClick, true);
    }

    handleClick(event) {
        if (!this.active || this.overlay?.owns(event.target)) {
            return;
        }

        if (window.__GamingWebAllowNativeClickUntil && performance.now() < window.__GamingWebAllowNativeClickUntil) {
            return;
        }

        const target = findScannedTarget(event.target, this.targets);
        if (!target) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (typeof event.stopImmediatePropagation === 'function') {
            event.stopImmediatePropagation();
        }

        this.hitTarget(target, 'player_tap');
    }

    hitTarget(target, trigger = 'player_tap') {
        this.logElementHit(target, trigger);

        if (target.type === 'heading') {
            this.audio?.play('hitMedium', { volume: 0.32 });
            this.overlay.shakeHeading(target);
            return;
        }

        if (target.type === 'image' || target.type === 'icon') {
            this.audio?.play('hitHeavy', { volume: 0.34 });
            this.overlay.crackImage(target);
            return;
        }

        if (target.type === 'paragraph') {
            const words = this.wordsForTarget(target);
            if (words.length > 0) {
                this.audio?.play('pop', { volume: 0.22 });
                this.overlay.spawnWordFragments(words, target, (word) => this.collectWord(word));
            }
            return;
        }

        if (target.type === 'action') {
            this.audio?.play('hitLight', { volume: 0.24 });
            this.overlay.bumpAction(target);
            return;
        }

        if (target.type === 'accordion') {
            this.audio?.play('uiOpen', { volume: 0.18, rate: 1.04 });
            this.overlay.toggleAccordionTarget(target, { trigger });
            return;
        }

        this.audio?.play('uiMove', { volume: 0.16 });
        this.overlay.brighten(target);
    }

    runnerHitTarget(target, trigger = 'player_control') {
        if (!this.active || !target) {
            return;
        }

        this.logElementHit(target, trigger);

        if (target.type === 'heading' || target.type === 'paragraph' || target.type === 'action') {
            this.audio?.play(target.type === 'paragraph' ? 'hitMedium' : 'hitHeavy', { volume: 0.34 });
            this.overlay.runnerStrikeText(target);
            return;
        }

        if (target.type === 'accordion') {
            this.audio?.play('uiOpen', { volume: 0.18, rate: 1.04 });
            return;
        }

        if (target.type === 'image' || target.type === 'icon') {
            this.audio?.play('hitHeavy', { volume: 0.34 });
            this.overlay.crackImage(target);
            return;
        }

        this.audio?.play('uiMove', { volume: 0.16 });
        this.overlay.brighten(target);
    }

    playerBreakText(detail) {
        this.audio?.play('textBreak', { volume: 0.28 });
        this.logger?.log('element_hit', {
            element_selector: '.gw-break-char',
            element_type: 'text_char',
            stage_name: this.stageName,
            inventory_count: this.inventory.length,
            trigger: 'player_control',
            word: (detail.chars || []).join(''),
            broken_count: detail.count || 0,
        });
    }

    playerHitImage(detail) {
        this.audio?.play(detail.destroyed ? 'imageBreak' : 'imageCrack', { volume: detail.destroyed ? 0.34 : 0.24 });
        this.logger?.log('element_hit', {
            element_selector: detail.selector || 'img',
            element_type: detail.type === 'icon' ? 'icon' : 'image',
            stage_name: this.stageName,
            inventory_count: this.inventory.length,
            trigger: 'player_control',
            image_stage: detail.stage || 0,
            destroyed: Boolean(detail.destroyed),
        });
    }

    playerHitGate(detail) {
        this.audio?.play('gateBreak', { volume: 0.26 });
        this.logger?.log('element_hit', {
            element_selector: detail.selector || 'a',
            element_type: 'link_gate',
            stage_name: this.stageName,
            inventory_count: this.inventory.length,
            trigger: 'player_control',
            href: detail.href || '',
            label: detail.text || '',
        });
    }

    playerHitEnemy(detail) {
        if (detail.defeated) {
            this.audio?.play('ko', { volume: 0.28, rate: 1 });
            this.audio?.play('cheer', { volume: 0.12, rate: 1.02 });
        } else {
            const damageVolume = detail.power === 'large' ? 0.34 : (detail.power === 'medium' ? 0.26 : 0.18);
            this.audio?.play(detail.source === 'word_throw' ? 'throwHit' : 'hitHeavy', {
                volume: detail.source === 'word_throw' ? damageVolume : (detail.source === 'charged_melee' ? 0.38 : 0.34),
            });
        }
        this.logger?.log('element_hit', {
            element_selector: '.gw-enemy',
            element_type: detail.enemy_type === 'boss' ? 'mid_boss' : 'enemy',
            stage_name: this.stageName,
            inventory_count: this.inventory.length,
            trigger: 'player_control',
            defeated: Boolean(detail.defeated),
            hp: detail.hp || 0,
            source: detail.source || '',
            word: detail.word || '',
        });
    }

    logElementHit(target, trigger) {
        this.logger?.log('element_hit', {
            element_selector: target.selector,
            element_type: target.type,
            stage_name: this.stageName,
            inventory_count: this.inventory.length,
            trigger,
        });
    }

    collectWord(word) {
        const normalized = String(word || '').trim();
        if (!normalized) {
            return;
        }

        if (!this.inventory.includes(normalized)) {
            this.inventory.push(normalized);
        }

        this.overlay.setInventory(this.inventory);
        this.audio?.play('collect', { volume: 0.24 });
        this.overlay.showMessage(MESSAGE_WORD_COLLECT);
        this.logger?.log('word_collect', {
            word: normalized,
            stage_name: this.stageName,
            inventory_count: this.inventory.length,
        });

        if (!this.softCleared && this.inventory.length >= 5) {
            this.softCleared = true;
            this.audio?.play('cheer', { volume: 0.16 });
            this.overlay.showMessage(MESSAGE_SOFT_CLEAR, 3200);
            this.logger?.log('stage_soft_clear', {
                stage_name: this.stageName,
                inventory_count: this.inventory.length,
            });
        }
    }

    wordsForTarget(target) {
        const text = target.text || '';
        const preferred = this.importantWords.filter((word) => text.includes(word));
        const discovered = extractWords(text).filter((word) => !preferred.includes(word));
        const pool = shuffle([...preferred, ...discovered]);

        return pool.slice(0, 5);
    }
}

function extractWords(text) {
    const cleaned = String(text || '').replace(/\s+/g, ' ').trim();
    if (!cleaned) {
        return [];
    }

    try {
        const matches = cleaned.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\u30fc]{2,8}|[A-Za-z0-9][A-Za-z0-9_-]{2,}/gu) || [];
        return uniqueWords(matches);
    } catch (error) {
        return uniqueWords(cleaned.split(/[^\w]+/).filter((word) => word.length >= 3));
    }
}

function uniqueWords(words) {
    const seen = new Set();
    const result = [];

    for (const rawWord of words) {
        const word = String(rawWord).trim();
        if (word && !seen.has(word)) {
            seen.add(word);
            result.push(word);
        }
    }

    return result;
}

function shuffle(items) {
    const copy = [...items];

    for (let index = copy.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }

    return copy;
}



