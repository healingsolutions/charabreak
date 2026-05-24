const AUDIO_FILES = {
    start: ['warp.mp3', 'warp-2.mp3'],
    exit: 'ui-cancel.mp3',
    uiMove: 'ui-move.mp3',
    uiOpen: 'ui-open.mp3',
    collect: 'collect.mp3',
    cheer: 'cheer.mp3',
    pop: 'pop.mp3',
    bloom: ['cute-sparkle.mp3', 'twinkle-1.mp3', 'soft-pop-positive.mp3', 'sparkle-1.mp3'],
    bloomFull: ['cute-sparkle.mp3', 'status-up-magic-1.mp3', 'heal-magic-1.mp3'],
    magicWand: ['magic-wand.mp3', 'twinkle-1.mp3'],
    swing: ['punch-swing.mp3', 'hit-small.mp3'],
    lock: ['shakiin-1.mp3', 'shakiin-2.mp3', 'shakiin-3.mp3'],
    pickupLetter: ['pop.mp3', 'ui-move.mp3'],
    throwWord: ['punch-swing.mp3', 'light-punch-1.mp3', 'light-punch-2.mp3'],
    flowerArrow: ['magic-wand.mp3', 'soft-pop-positive.mp3', 'twinkle-1.mp3'],
    parry: ['shakiin-3.mp3', 'shakiin-2.mp3', 'shakiin-1.mp3'],
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
        this.stageAudio = normalizeStageAudio(options.stageAudio || {});
        this.sfxVolume = 0.38;
        this.sfxMasterVolume = 0.56;
        this.bgmVolume = 0.036;
        this.context = null;
        this.bgmTimer = 0;
        this.bgmAudio = null;
        this.bgmAudioUrl = '';
        this.bgmAudioMode = '';
        this.bgmFadeTimer = 0;
        this.bgmStep = 0;
        this.bgmMode = 'normal';
        this.clearJingleAudio = null;
        this.clearJingleFadeTimer = 0;
        this.activeSfx = new Set();
        this.chargeTimer = 0;
        this.chargeStep = 0;
        this.chargeVolume = 0.04;
        this.bgmEnabled = readStoredBgmEnabled();
        this.unlockBound = false;
        this.lastError = '';
        this.lastPlayed = '';
        this.handleUnlockGesture = this.handleUnlockGesture.bind(this);
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

    bindUnlockEvents() {
        if (this.unlockBound) {
            return;
        }

        window.addEventListener('pointerdown', this.handleUnlockGesture, { passive: true });
        window.addEventListener('touchstart', this.handleUnlockGesture, { passive: true });
        window.addEventListener('keydown', this.handleUnlockGesture, true);
        window.addEventListener('gamepadconnected', this.handleUnlockGesture, { passive: true });
        this.unlockBound = true;
    }

    unbindUnlockEvents() {
        if (!this.unlockBound) {
            return;
        }

        window.removeEventListener('pointerdown', this.handleUnlockGesture, { passive: true });
        window.removeEventListener('touchstart', this.handleUnlockGesture, { passive: true });
        window.removeEventListener('keydown', this.handleUnlockGesture, true);
        window.removeEventListener('gamepadconnected', this.handleUnlockGesture, { passive: true });
        this.unlockBound = false;
    }

    handleUnlockGesture() {
        this.resume().then(() => {
            if (this.bgmEnabled) {
                this.startBgmIfEnabled();
            }
        }).catch((error) => {
            this.lastError = error?.message || String(error);
        });
    }

    play(name, options = {}) {
        this.lastPlayed = String(name || '');
        this.resume().catch((error) => {
            this.lastError = error?.message || String(error);
        });

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

        if (name === 'bossBgm') {
            this.setBgmMode('boss');
            return;
        }

        if (name === 'normalBgm') {
            this.setBgmMode('normal');
            return;
        }

        const file = this.pickFile(AUDIO_FILES[name]);
        if (!file || !this.baseUrl) {
            return;
        }

        if (mobileAudioBudgetMode() && this.activeSfx.size >= 10) {
            this.playFallbackSound(name, options);
            return;
        }

        const audio = new Audio(`${this.baseUrl}${file}`);
        audio.volume = clamp(Number(options.volume ?? this.sfxVolume) * this.sfxMasterVolume, 0, 1);
        audio.playbackRate = clamp(Number(options.rate ?? randomBetween(0.94, 1.06)), 0.6, 1.5);
        const cleanup = () => {
            this.activeSfx.delete(audio);
        };
        audio.addEventListener('ended', cleanup, { once: true });
        audio.addEventListener('pause', cleanup, { once: true });
        this.activeSfx.add(audio);

        audio.play().catch((error) => {
            cleanup();
            this.lastError = error?.message || String(error);
            this.playFallbackSound(name, options);
            if (this.debug) {
                console.warn('[Gaming Web] sound blocked', error);
            }
        });
    }

    async setBgmEnabled(enabled) {
        this.bgmEnabled = Boolean(enabled);
        storeBgmEnabled(this.bgmEnabled);

        if (this.bgmEnabled) {
            const customUrl = this.customBgmUrlForMode();
            const startedCustom = Boolean(customUrl);
            if (startedCustom) {
                this.startCustomBgm(customUrl);
            }

            try {
                await this.resume();
            } catch (error) {
                this.lastError = error?.message || String(error);
            }

            if (!startedCustom || !this.bgmAudio) {
                this.startBgmIfEnabled();
            }
        } else {
            this.stopBgm();
        }

        return this.bgmEnabled;
    }

    startBgmIfEnabled() {
        if (!this.bgmEnabled) {
            return;
        }

        const customUrl = this.customBgmUrlForMode();
        if (customUrl) {
            this.startCustomBgm(customUrl);
            return;
        }

        if (!this.context) {
            return;
        }

        if (this.bgmTimer) {
            return;
        }

        this.stopCustomBgm();
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

        this.stopCustomBgm();

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
        const nextMode = ['boss', 'clear'].includes(mode) ? mode : 'normal';
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

        const clearSoundUrl = this.stageAudio.clearSoundUrl;
        if (this.bgmEnabled && clearSoundUrl) {
            this.playClearJingleUrl(clearSoundUrl, options);
            return;
        }

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

    playClearJingleUrl(url, options = {}) {
        const audio = new Audio(url);
        const targetVolume = clamp(Number(options.volume ?? 0.068), 0, 0.11);
        audio.volume = Math.min(0.014, targetVolume);
        audio.playbackRate = clamp(Number(options.rate ?? 1), 0.82, 1.18);
        audio.addEventListener('ended', () => {
            if (this.clearJingleAudio === audio) {
                this.clearJingleAudio = null;
                this.startClearBgmFallback();
            }
        }, { once: true });
        this.clearJingleAudio = audio;
        audio.play().then(() => {
            this.fadeClearJingle(audio, targetVolume, Number(options.fadeMs ?? 620));
        }).catch((error) => {
            this.clearJingleAudio = null;
            this.startClearBgmFallback();
            if (this.debug) {
                console.warn('[Gaming Web] custom clear sound blocked', error);
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

    customBgmUrlForMode() {
        if (this.bgmMode === 'boss') {
            return this.stageAudio.bossBgmUrl
                || this.stageAudio.stageBgmUrl
                || (this.stageAudio.stageType === 'final' ? this.stageAudio.finalBgmUrl : '')
                || this.stageAudio.normalBgmUrl;
        }

        if (this.bgmMode === 'normal') {
            return this.stageAudio.stageBgmUrl
                || (this.stageAudio.stageType === 'final' ? this.stageAudio.finalBgmUrl : '')
                || this.stageAudio.normalBgmUrl;
        }

        return '';
    }

    startCustomBgm(url) {
        if (this.bgmAudio && this.bgmAudioUrl === url && this.bgmAudioMode === this.bgmMode && !this.bgmAudio.paused) {
            return;
        }

        if (this.bgmTimer) {
            window.clearInterval(this.bgmTimer);
            this.bgmTimer = 0;
        }

        this.stopCustomBgm();

        const audio = new Audio(url);
        const targetVolume = this.bgmMode === 'boss'
            ? clamp(this.bgmVolume * 1.18, 0, 0.06)
            : clamp(this.bgmVolume, 0, 0.052);
        audio.loop = true;
        audio.preload = 'auto';
        audio.playsInline = true;
        audio.setAttribute('playsinline', '');
        audio.volume = Math.min(0.008, targetVolume);
        audio.playbackRate = 1;
        this.bgmAudio = audio;
        this.bgmAudioUrl = url;
        this.bgmAudioMode = this.bgmMode;
        audio.play().then(() => {
            this.fadeCustomBgm(audio, targetVolume, 760);
        }).catch((error) => {
            this.stopCustomBgm();
            if (this.context && this.bgmEnabled) {
                this.bgmStep = 0;
                this.bgmTimer = window.setInterval(() => {
                    this.playBgmStep();
                }, this.bgmMode === 'boss' ? 148 : 165);
                this.playBgmStep();
            }
            if (this.debug) {
                console.warn('[Gaming Web] custom bgm blocked', error);
            }
        });
    }

    stopCustomBgm() {
        if (this.bgmFadeTimer) {
            window.clearInterval(this.bgmFadeTimer);
            this.bgmFadeTimer = 0;
        }

        if (this.bgmAudio) {
            this.bgmAudio.pause();
            this.bgmAudio = null;
        }

        this.bgmAudioUrl = '';
        this.bgmAudioMode = '';
    }

    fadeCustomBgm(audio, targetVolume, duration = 760) {
        if (!audio || this.bgmAudio !== audio) {
            return;
        }

        if (this.bgmFadeTimer) {
            window.clearInterval(this.bgmFadeTimer);
        }

        const startTime = currentTime();
        const startVolume = audio.volume;
        const endVolume = clamp(targetVolume, 0, 0.065);
        this.bgmFadeTimer = window.setInterval(() => {
            if (this.bgmAudio !== audio) {
                window.clearInterval(this.bgmFadeTimer);
                this.bgmFadeTimer = 0;
                return;
            }

            const progress = clamp((currentTime() - startTime) / Math.max(120, duration), 0, 1);
            audio.volume = startVolume + (endVolume - startVolume) * easeOut(progress);
            if (progress >= 1) {
                window.clearInterval(this.bgmFadeTimer);
                this.bgmFadeTimer = 0;
            }
        }, 40);
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
            this.playFallbackSound(name, options);
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
        const bossMode = this.bgmMode === 'boss';
        const melody = clearMode
            ? [523.25, 659.25, 783.99, 1046.5, 987.77, 783.99, 880, 1046.5, 0, 783.99, 880, 987.77, 1046.5, 0, 783.99, 0]
            : bossMode
                ? [196, 0, 233.08, 0, 261.63, 311.13, 293.66, 0, 196, 0, 246.94, 0, 293.66, 349.23, 311.13, 0]
            : [392, 0, 523.25, 0, 587.33, 523.25, 392, 329.63, 0, 392, 493.88, 0, 440, 392, 329.63, 0];
        const bass = clearMode
            ? [196, 0, 261.63, 0, 329.63, 0, 261.63, 0, 220, 0, 293.66, 0, 349.23, 0, 261.63, 0]
            : bossMode
                ? [98, 0, 98, 0, 116.54, 0, 98, 0, 103.83, 0, 103.83, 0, 130.81, 0, 116.54, 0]
            : [130.81, 0, 130.81, 0, 164.81, 0, 196, 0, 146.83, 0, 146.83, 0, 196, 0, 164.81, 0];
        const step = this.bgmStep % melody.length;
        const time = this.context.currentTime;

        if (melody[step]) {
            const volume = clearMode ? this.bgmVolume * 0.84 : (bossMode ? this.bgmVolume * 0.78 : this.bgmVolume);
            this.playTone(melody[step], time, clearMode ? 0.13 : 0.105, volume, 'square');
        }

        if (bass[step] && step % 2 === 0) {
            this.playTone(bass[step], time, clearMode ? 0.14 : 0.12, this.bgmVolume * (clearMode ? 0.52 : (bossMode ? 0.72 : 0.64)), 'triangle');
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

    playFallbackSound(name, options = {}) {
        if (!this.context || this.context.state !== 'running') {
            return;
        }

        const profile = fallbackToneProfile(name);
        if (!profile) {
            return;
        }

        const time = this.context.currentTime;
        const volume = clamp(Number(options.volume ?? profile.volume) * this.sfxMasterVolume, 0, profile.maxVolume || 0.12);
        this.playTone(profile.frequency, time, profile.duration, volume, profile.type || 'square');
        if (profile.secondFrequency) {
            this.playTone(profile.secondFrequency, time + (profile.secondDelay || 0.035), profile.secondDuration || profile.duration, volume * 0.58, profile.secondType || 'triangle');
        }
    }

    debugState() {
        return {
            baseUrl: this.baseUrl,
            contextState: this.context?.state || 'none',
            bgmEnabled: this.bgmEnabled,
            lastPlayed: this.lastPlayed,
            lastError: this.lastError,
        };
    }

    pickFile(entry) {
        if (Array.isArray(entry)) {
            return entry[Math.floor(Math.random() * entry.length)];
        }

        return entry;
    }
}

function fallbackToneProfile(name) {
    const profiles = {
        start: { frequency: 246.94, secondFrequency: 493.88, duration: 0.08, secondDuration: 0.1, volume: 0.08, maxVolume: 0.09, type: 'sine' },
        exit: { frequency: 164.81, secondFrequency: 110, duration: 0.08, secondDuration: 0.09, volume: 0.06, maxVolume: 0.08, type: 'triangle' },
        uiMove: { frequency: 440, duration: 0.045, volume: 0.045, maxVolume: 0.06, type: 'square' },
        uiOpen: { frequency: 329.63, secondFrequency: 659.25, duration: 0.055, secondDuration: 0.075, volume: 0.055, maxVolume: 0.07, type: 'triangle' },
        collect: { frequency: 587.33, secondFrequency: 880, duration: 0.07, secondDuration: 0.08, volume: 0.08, maxVolume: 0.1, type: 'square' },
        cheer: { frequency: 523.25, secondFrequency: 783.99, duration: 0.08, secondDuration: 0.12, volume: 0.06, maxVolume: 0.08, type: 'triangle' },
        pop: { frequency: 392, secondFrequency: 523.25, duration: 0.045, secondDuration: 0.045, volume: 0.06, maxVolume: 0.08, type: 'square' },
        swing: { frequency: 196, secondFrequency: 130.81, duration: 0.045, secondDelay: 0.028, secondDuration: 0.05, volume: 0.095, maxVolume: 0.1, type: 'square' },
        lock: { frequency: 659.25, secondFrequency: 987.77, duration: 0.07, secondDuration: 0.08, volume: 0.07, maxVolume: 0.09, type: 'triangle' },
        pickupLetter: { frequency: 440, secondFrequency: 587.33, duration: 0.055, secondDuration: 0.06, volume: 0.07, maxVolume: 0.09, type: 'square' },
        throwWord: { frequency: 174.61, secondFrequency: 123.47, duration: 0.06, secondDelay: 0.04, secondDuration: 0.07, volume: 0.09, maxVolume: 0.1, type: 'sawtooth' },
        flowerArrow: { frequency: 659.25, secondFrequency: 987.77, duration: 0.055, secondDelay: 0.035, secondDuration: 0.06, volume: 0.055, maxVolume: 0.075, type: 'triangle' },
        parry: { frequency: 783.99, secondFrequency: 1174.66, duration: 0.045, secondDelay: 0.03, secondDuration: 0.06, volume: 0.08, maxVolume: 0.1, type: 'triangle' },
        throwHit: { frequency: 146.83, secondFrequency: 98, duration: 0.08, secondDelay: 0.035, secondDuration: 0.08, volume: 0.105, maxVolume: 0.12, type: 'triangle' },
        jump: { frequency: 493.88, secondFrequency: 739.99, duration: 0.065, secondDelay: 0.035, secondDuration: 0.05, volume: 0.07, maxVolume: 0.08, type: 'square' },
        fall: { frequency: 220, secondFrequency: 174.61, duration: 0.08, secondDelay: 0.04, secondDuration: 0.09, volume: 0.05, maxVolume: 0.07, type: 'triangle' },
        land: { frequency: 130.81, secondFrequency: 82.41, duration: 0.055, secondDelay: 0.035, secondDuration: 0.05, volume: 0.045, maxVolume: 0.065, type: 'triangle' },
        landHeavy: { frequency: 98, secondFrequency: 65.41, duration: 0.1, secondDelay: 0.04, secondDuration: 0.1, volume: 0.075, maxVolume: 0.095, type: 'triangle' },
        ko: { frequency: 196, secondFrequency: 73.42, duration: 0.11, secondDelay: 0.06, secondDuration: 0.16, volume: 0.08, maxVolume: 0.1, type: 'sawtooth' },
        gateBreak: { frequency: 110, secondFrequency: 73.42, duration: 0.1, secondDelay: 0.045, secondDuration: 0.12, volume: 0.1, maxVolume: 0.12, type: 'triangle' },
        imageCrack: { frequency: 261.63, secondFrequency: 523.25, duration: 0.045, secondDelay: 0.026, secondDuration: 0.04, volume: 0.055, maxVolume: 0.075, type: 'square' },
        imageBreak: { frequency: 130.81, secondFrequency: 98, duration: 0.1, secondDelay: 0.045, secondDuration: 0.12, volume: 0.09, maxVolume: 0.11, type: 'triangle' },
        textBreak: { frequency: 146.83, secondFrequency: 110, duration: 0.075, secondDelay: 0.034, secondDuration: 0.075, volume: 0.095, maxVolume: 0.11, type: 'triangle' },
        hitLight: { frequency: 184.99, secondFrequency: 138.59, duration: 0.055, secondDelay: 0.028, secondDuration: 0.055, volume: 0.075, maxVolume: 0.09, type: 'square' },
        hitMedium: { frequency: 146.83, secondFrequency: 98, duration: 0.075, secondDelay: 0.035, secondDuration: 0.075, volume: 0.095, maxVolume: 0.11, type: 'triangle' },
        hitHeavy: { frequency: 110, secondFrequency: 73.42, duration: 0.105, secondDelay: 0.04, secondDuration: 0.105, volume: 0.115, maxVolume: 0.13, type: 'triangle' },
        enemyExplode: { frequency: 98, secondFrequency: 65.41, duration: 0.12, secondDelay: 0.045, secondDuration: 0.15, volume: 0.105, maxVolume: 0.13, type: 'sawtooth' },
        chargeReady: { frequency: 196, secondFrequency: 392, duration: 0.08, secondDuration: 0.08, volume: 0.07, maxVolume: 0.09, type: 'triangle' },
        chargeFull: { frequency: 261.63, secondFrequency: 523.25, duration: 0.11, secondDuration: 0.11, volume: 0.085, maxVolume: 0.1, type: 'triangle' },
    };

    return profiles[name] || null;
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

function mobileAudioBudgetMode() {
    return Boolean(window.matchMedia?.('(pointer: coarse)')?.matches || window.innerWidth <= 700);
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

function normalizeStageAudio(stageAudio = {}) {
    if (!stageAudio || typeof stageAudio !== 'object') {
        return {
            stageType: '',
            normalBgmUrl: '',
            stageBgmUrl: '',
            finalBgmUrl: '',
            bossBgmUrl: '',
            clearSoundUrl: '',
        };
    }

    return {
        stageType: String(stageAudio.stageType || ''),
        normalBgmUrl: safeAudioUrl(stageAudio.normalBgmUrl),
        stageBgmUrl: safeAudioUrl(stageAudio.stageBgmUrl),
        finalBgmUrl: safeAudioUrl(stageAudio.finalBgmUrl),
        bossBgmUrl: safeAudioUrl(stageAudio.bossBgmUrl),
        clearSoundUrl: safeAudioUrl(stageAudio.clearSoundUrl),
    };
}

function safeAudioUrl(url) {
    const value = String(url || '').trim();
    if (!value) {
        return '';
    }

    try {
        const parsed = new URL(value, window.location.href);
        if (!['http:', 'https:', 'blob:', 'data:'].includes(parsed.protocol)) {
            return '';
        }

        return parsed.href;
    } catch (error) {
        return '';
    }
}
