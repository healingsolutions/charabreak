const AUDIO_FILES = {
    start: ['warp.mp3', 'warp-2.mp3'],
    exit: 'ui-cancel.mp3',
    uiMove: 'ui-move.mp3',
    uiOpen: 'ui-open.mp3',
    collect: 'collect.mp3',
    cheer: 'cheer.mp3',
    pop: 'pop.mp3',
    swing: ['punch-swing.mp3', 'hit-small.mp3'],
    lock: ['shakiin-1.mp3', 'shakiin-2.mp3', 'shakiin-3.mp3'],
    pickupLetter: ['pop.mp3', 'ui-move.mp3'],
    throwWord: ['punch-swing.mp3', 'light-punch-1.mp3', 'light-punch-2.mp3'],
    throwHit: ['hit-medium.mp3', 'impact-4.mp3', 'impact-6.mp3'],
    jump: 'jump.mp3',
    fall: ['fall-slide.mp3', 'dragon-wing.mp3'],
    land: 'jump-land.mp3',
    landHeavy: 'fall-down.mp3',
    ko: 'ko.mp3',
    gateBreak: ['building-small-collapse.mp3', 'glass-break-3.mp3'],
    imageCrack: ['glass-crack.mp3', 'glass-break-3.mp3'],
    imageBreak: ['glass-break-2.mp3', 'glass-break-3.mp3', 'building-small-collapse.mp3'],
    textBreak: ['heavy-punch.mp3', 'impact-6.mp3', 'impact-4.mp3', 'strike-8.mp3'],
    hitLight: ['light-punch-1.mp3', 'light-punch-2.mp3', 'hit-small.mp3', 'punch-swing.mp3'],
    hitMedium: ['hit-medium.mp3', 'impact-1.mp3', 'impact-4.mp3', 'strike-8.mp3'],
    hitHeavy: ['heavy-punch.mp3', 'impact-6.mp3', 'kick-medium.mp3'],
    enemyExplode: ['building-big-collapse.mp3', 'cliff-collapse.mp3', 'ground-rumble.mp3', 'ko.mp3'],
    stageClearJingle: 'stage-clear-8bit-jingle.mp3',
};

const BGM_KEY = 'gaming_web_bgm_enabled';

export class AudioManager {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || '';
        this.debug = Boolean(options.debug);
        this.sfxVolume = 0.38;
        this.sfxMasterVolume = 0.56;
        this.bgmVolume = 0.036;
        this.context = null;
        this.bgmTimer = 0;
        this.bgmStep = 0;
        this.bgmMode = 'normal';
        this.clearJingleAudio = null;
        this.clearJingleFadeTimer = 0;
        this.chargeTimer = 0;
        this.chargeStep = 0;
        this.chargeVolume = 0.04;
        this.bgmEnabled = readStoredBgmEnabled();
    }

    getBgmEnabled() {
        return this.bgmEnabled;
    }

    async resume() {
        if (!window.AudioContext && !window.webkitAudioContext) {
            return;
        }

        if (!this.context) {
            const Context = window.AudioContext || window.webkitAudioContext;
            this.context = new Context();
        }

        if (this.context.state === 'suspended') {
            await this.context.resume();
        }
    }

    play(name, options = {}) {
        if (name === 'chargeStart') {
            this.startChargeLoop(options);
            return;
        }

        if (name === 'chargeStop') {
            this.stopChargeLoop();
            return;
        }

        if (name === 'chargeReady' || name === 'chargeFull') {
            this.playChargeAccent(name, options);
            return;
        }

        if (name === 'stageClear') {
            this.playStageClearMusic(options);
            return;
        }

        const file = this.pickFile(AUDIO_FILES[name]);
        if (!file || !this.baseUrl) {
            return;
        }

        const audio = new Audio(`${this.baseUrl}${file}`);
        audio.volume = clamp(Number(options.volume ?? this.sfxVolume) * this.sfxMasterVolume, 0, 1);
        audio.playbackRate = clamp(Number(options.rate ?? randomBetween(0.94, 1.06)), 0.6, 1.5);

        audio.play().catch((error) => {
            if (this.debug) {
                console.warn('[Gaming Web] sound blocked', error);
            }
        });
    }

    async setBgmEnabled(enabled) {
        this.bgmEnabled = Boolean(enabled);
        storeBgmEnabled(this.bgmEnabled);

        if (this.bgmEnabled) {
            await this.resume();
            this.startBgmIfEnabled();
        } else {
            this.stopBgm();
        }

        return this.bgmEnabled;
    }

    startBgmIfEnabled() {
        if (!this.bgmEnabled || !this.context || this.bgmTimer) {
            return;
        }

        this.bgmStep = 0;
        this.bgmTimer = window.setInterval(() => {
            this.playBgmStep();
        }, this.bgmMode === 'clear' ? 178 : 165);
        this.playBgmStep();
    }

    stopBgm() {
        if (this.bgmTimer) {
            window.clearInterval(this.bgmTimer);
            this.bgmTimer = 0;
        }

        if (this.clearJingleAudio) {
            this.clearJingleAudio.pause();
            this.clearJingleAudio = null;
        }

        if (this.clearJingleFadeTimer) {
            window.clearInterval(this.clearJingleFadeTimer);
            this.clearJingleFadeTimer = 0;
        }
    }

    setBgmMode(mode = 'normal') {
        const nextMode = mode === 'clear' ? 'clear' : 'normal';
        if (this.bgmMode === nextMode) {
            return;
        }

        this.bgmMode = nextMode;
        if (!this.bgmEnabled || !this.context) {
            return;
        }

        this.stopBgm();
        this.startBgmIfEnabled();
    }

    playStageClearMusic(options = {}) {
        this.stopChargeLoop();
        this.bgmMode = 'clear';
        this.stopBgm();
        this.play('cheer', { volume: Number(options.cheerVolume ?? 0.11), rate: 1.04 });

        if (!this.bgmEnabled || !this.baseUrl) {
            this.startClearBgmFallback();
            return;
        }

        const file = this.pickFile(AUDIO_FILES.stageClearJingle);
        const audio = new Audio(`${this.baseUrl}${file}`);
        const targetVolume = clamp(Number(options.volume ?? 0.075), 0, 0.12);
        audio.volume = Math.min(0.018, targetVolume);
        audio.playbackRate = clamp(Number(options.rate ?? 1), 0.82, 1.18);
        audio.addEventListener('ended', () => {
            if (this.clearJingleAudio === audio) {
                this.clearJingleAudio = null;
                this.startClearBgmFallback();
            }
        }, { once: true });
        this.clearJingleAudio = audio;
        audio.play().then(() => {
            this.fadeClearJingle(audio, targetVolume, Number(options.fadeMs ?? 560));
        }).catch((error) => {
            this.clearJingleAudio = null;
            this.startClearBgmFallback();
            if (this.debug) {
                console.warn('[Gaming Web] stage clear music blocked', error);
            }
        });
    }

    fadeClearJingle(audio, targetVolume, duration = 560) {
        if (!audio || this.clearJingleAudio !== audio) {
            return;
        }

        if (this.clearJingleFadeTimer) {
            window.clearInterval(this.clearJingleFadeTimer);
        }

        const startTime = currentTime();
        const startVolume = audio.volume;
        const endVolume = clamp(targetVolume, 0, 0.12);
        this.clearJingleFadeTimer = window.setInterval(() => {
            if (this.clearJingleAudio !== audio) {
                window.clearInterval(this.clearJingleFadeTimer);
                this.clearJingleFadeTimer = 0;
                return;
            }

            const progress = clamp((currentTime() - startTime) / Math.max(120, duration), 0, 1);
            audio.volume = startVolume + (endVolume - startVolume) * easeOut(progress);
            if (progress >= 1) {
                window.clearInterval(this.clearJingleFadeTimer);
                this.clearJingleFadeTimer = 0;
            }
        }, 40);
    }

    startClearBgmFallback() {
        if (!this.bgmEnabled || !this.context) {
            return;
        }

        this.bgmMode = 'clear';
        this.startBgmIfEnabled();
    }

    startChargeLoop(options = {}) {
        if (!this.context || this.chargeTimer) {
            return;
        }

        this.chargeStep = 0;
        this.chargeVolume = clamp(Number(options.volume ?? 0.055) * this.sfxMasterVolume, 0, 0.08);
        const tick = () => this.playChargeStep();
        this.chargeTimer = window.setInterval(tick, 118);
        tick();
    }

    stopChargeLoop() {
        if (!this.chargeTimer) {
            return;
        }

        window.clearInterval(this.chargeTimer);
        this.chargeTimer = 0;
        this.chargeStep = 0;
    }

    playChargeStep() {
        if (!this.context) {
            return;
        }

        const time = this.context.currentTime;
        const climb = Math.min(this.chargeStep, 12);
        const base = 72 + climb * 4;
        this.playTone(base, time, 0.075, this.chargeVolume, 'triangle');

        if (this.chargeStep % 3 === 0) {
            this.playTone(base / 2, time, 0.055, this.chargeVolume * 0.65, 'sine');
        }

        this.chargeStep += 1;
    }

    playChargeAccent(name, options = {}) {
        if (!this.context) {
            return;
        }

        const volume = clamp(Number(options.volume ?? 0.12) * this.sfxMasterVolume, 0, 0.12);
        const time = this.context.currentTime;
        const high = name === 'chargeFull' ? 196 : 148;
        this.playTone(high, time, 0.11, volume, 'triangle');
        this.playTone(high / 2, time, 0.14, volume * 0.58, 'sine');
    }

    playBgmStep() {
        if (!this.context || !this.bgmEnabled) {
            return;
        }

        const clearMode = this.bgmMode === 'clear';
        const melody = clearMode
            ? [523.25, 659.25, 783.99, 1046.5, 987.77, 783.99, 880, 1046.5, 0, 783.99, 880, 987.77, 1046.5, 0, 783.99, 0]
            : [392, 0, 523.25, 0, 587.33, 523.25, 392, 329.63, 0, 392, 493.88, 0, 440, 392, 329.63, 0];
        const bass = clearMode
            ? [196, 0, 261.63, 0, 329.63, 0, 261.63, 0, 220, 0, 293.66, 0, 349.23, 0, 261.63, 0]
            : [130.81, 0, 130.81, 0, 164.81, 0, 196, 0, 146.83, 0, 146.83, 0, 196, 0, 164.81, 0];
        const step = this.bgmStep % melody.length;
        const time = this.context.currentTime;

        if (melody[step]) {
            this.playTone(melody[step], time, clearMode ? 0.13 : 0.105, clearMode ? this.bgmVolume * 0.84 : this.bgmVolume, 'square');
        }

        if (bass[step] && step % 2 === 0) {
            this.playTone(bass[step], time, clearMode ? 0.14 : 0.12, this.bgmVolume * (clearMode ? 0.52 : 0.64), 'triangle');
        }

        this.bgmStep += 1;
    }

    playTone(frequency, startTime, duration, volume, type) {
        const oscillator = this.context.createOscillator();
        const gain = this.context.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, startTime);
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        oscillator.connect(gain);
        gain.connect(this.context.destination);
        oscillator.start(startTime);
        oscillator.stop(startTime + duration + 0.03);
    }

    pickFile(entry) {
        if (Array.isArray(entry)) {
            return entry[Math.floor(Math.random() * entry.length)];
        }

        return entry;
    }
}

function readStoredBgmEnabled() {
    try {
        return window.localStorage.getItem(BGM_KEY) === '1';
    } catch (error) {
        return false;
    }
}

function storeBgmEnabled(enabled) {
    try {
        window.localStorage.setItem(BGM_KEY, enabled ? '1' : '0');
    } catch (error) {
        // Storage can be unavailable in private contexts; session behavior still works.
    }
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function currentTime() {
    if (window.performance && typeof window.performance.now === 'function') {
        return window.performance.now();
    }

    return Date.now();
}

function easeOut(value) {
    return 1 - Math.pow(1 - value, 3);
}
