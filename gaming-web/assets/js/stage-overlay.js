import { liveRectForTarget } from './dom-scanner.js?v=0.1.35';

const UI_TEXT = {
    defaultCharacter: '\u30d4\u30b3',
    exit: '\u7d42\u4e86',
    inventoryPrefix: '\u3053\u3068\u3070',
    inventoryTitle: '\u898b\u3064\u3051\u305f\u8a00\u8449',
    emptyInventory: '\u307e\u3060\u7a7a\u3063\u307d',
    start: '\u3053\u306e\u30da\u30fc\u30b8\u3001\u3061\u3087\u3063\u3068\u89e6\u3063\u3066\u307f\u308b\uff1f',
    hint: '\u53e9\u304f\u3068\u4f55\u304b\u51fa\u308b\u304b\u3082',
    headingFallback: '\u898b\u51fa\u3057',
    headingShake: '\u6587\u5b57\u304c\u3086\u308c\u305f\uff01',
    imageCrack: '\u304d\u3089\u3063\u3068\u5272\u308c\u3066\u3001\u5149\u3060\u3051\u6b8b\u3063\u305f\uff01',
    imageSpin: '\u753b\u50cf\u304c\u3050\u3089\u3063\u3068\u56de\u3063\u305f\uff01',
    imageBreak: '\u753b\u50cf\u306b\u7a74\u304c\u3042\u3044\u305f\uff01',
    gateReady: '\u30ea\u30f3\u30af\u30b2\u30fc\u30c8\u304c\u958b\u3044\u3066\u3044\u308b\uff01',
    gateBreak: '\u30b2\u30fc\u30c8\u304c\u5d29\u308c\u305f\uff01',
    gateNeedsTextBreak: '\u5148\u306b\u4e2d\u306e\u6587\u5b57\u3092\u653b\u6483\u3057\u3088\u3046\uff01',
    enemyAppear: '\u6575\u304c\u30da\u30fc\u30b8\u3092\u72d9\u3063\u3066\u3044\u308b\uff01',
    enemyHit: '\u305d\u306e\u8abf\u5b50\uff01',
    enemyAttack: '\u30da\u30fc\u30b8\u304c\u653b\u6483\u3055\u308c\u305f\uff01',
    enemyDefeat: '\u6575\u3092\u8ffd\u3044\u6255\u3063\u305f\uff01',
    bossAppear: '\u4e2d\u30dc\u30b9\u304c\u73fe\u308c\u305f\uff01',
    bossDefeat: '\u4e2d\u30dc\u30b9\u3092\u6b62\u3081\u305f\uff01',
    criticalGuard: '\u5b88\u308b\u6587\u5b57',
    criticalLost: '\u91cd\u8981\u306a\u6587\u5b57\u304c\u58ca\u3055\u308c\u305f\uff01',
    stageFailed: '\u30a2\u30a6\u30c8\uff01\u5408\u8a00\u8449\u306e\u6587\u5b57\u304c\u6d88\u3048\u305f\uff01',
    lifeLabel: 'LIFE',
    playerDamage: '\u30c0\u30e1\u30fc\u30b8\uff01\u76fe\u3067\u9632\u3054\u3046\uff01',
    gameOverTitle: 'GAME OVER',
    retry: '\u3082\u3046\u4e00\u56de',
    gameOverCritical: '\u5408\u8a00\u8449\u306e\u6587\u5b57\u304c\u5931\u308f\u308c\u305f\u3002',
    gameOverLife: '\u30e9\u30a4\u30d5\u304c\u306a\u304f\u306a\u3063\u305f\u3002',
    gameOverHint: '\u4f55\u5ea6\u3067\u3082\u6311\u6226\u3067\u304d\u308b\u3002\u6587\u5b57\u3092\u5b88\u3063\u3066\u3001\u3082\u3046\u4e00\u5ea6\uff01',
    goalBlocked: '\u5b88\u308b\u6587\u5b57\u3092\u5931\u3063\u305f\u306e\u3067\u30af\u30ea\u30a2\u3067\u304d\u306a\u3044\uff01',
    missileParry: '\u30df\u30b5\u30a4\u30eb\u3092\u5f3e\u304d\u8fd4\u3057\u305f\uff01',
    shieldHint: 'Shift\u3067\u76fe\uff01\u30df\u30b5\u30a4\u30eb\u3092\u53d7\u3051\u6b62\u3081\u308b\uff01',
    returnRoute: '\u4e0a\u3078\u623b\u308b',
    returnRouteHint: '\u4e0a\u306e\u6bb5\u3078\u623b\u3063\u305f\uff01',
    lockOn: '\u30ed\u30c3\u30af\u30aa\u30f3\uff01',
    lockHint: 'T / Tab\u3067\u6575\u3092\u30ed\u30c3\u30af\u30aa\u30f3\uff01',
    lockLost: '\u30ed\u30c3\u30af\u304c\u5916\u308c\u305f\uff01',
    noEnemy: '\u72d9\u3046\u6575\u304c\u3044\u306a\u3044\uff01',
    noFootWord: '\u8db3\u5143\u306b\u6295\u3052\u308b\u6587\u5b57\u304c\u306a\u3044\uff01',
    wordHold: '\u8db3\u5143\u306e\u6587\u5b57\u3092\u6301\u3063\u305f\uff01',
    wordThrow: '\u8a00\u8449\u3092\u6295\u3052\u305f\uff01',
    actionFallback: '\u3053\u3053\u3082\u52d5\u304f',
    actionHop: '\u3059\u3053\u3057\u9003\u3052\u305f\uff01',
    brighten: '\u5c11\u3057\u30da\u30fc\u30b8\u304c\u660e\u308b\u304f\u306a\u3063\u305f\uff01',
    runnerBreak: '\u30c9\u30c3\u30c8\u306e\u5b50\u304c\u6587\u5b57\u3092\u304f\u3060\u3044\u305f\uff01',
    playerHint: 'Space/Z\u3067\u653b\u6483\u3001X\u3067\u6295\u3052\u308b\u3001Shift/E\u3067\u76fe\uff01',
    miss: '\u7a7a\u3092\u305f\u305f\u3044\u305f\uff01',
    chargeReady: '\u529b\u304c\u305f\u307e\u3063\u305f\uff01',
    chargeFull: '\u5927\u632f\u308a\u306e\u4e00\u6483\uff01',
    missionTitle: '\u6848\u5185\u677f',
    missionReachGoal: '\u30da\u30fc\u30b8\u4e0b\u90e8\u306eGOAL\u30b2\u30fc\u30c8\u3078',
    missionProtect: '\u6575\u304b\u3089\u6587\u5b57\u3092\u5b88\u308b',
    goalReady: '\u30b4\u30fc\u30eb\u30b2\u30fc\u30c8\u304c\u958b\u3044\u305f\uff01',
    goalGate: 'GOAL',
    goalNext: '\u6b21\u306e\u30da\u30fc\u30b8\u3078',
    goalEnd: '\u30a8\u30f3\u30c9\u30ed\u30fc\u30eb',
    stageClear: '\u30b9\u30c6\u30fc\u30b8\u30af\u30ea\u30a2\uff01',
    stageClearBurst: '\u30af\u30ea\u30a2\uff01\u6575\u304c\u3071\u3063\u3068\u5f3e\u3051\u305f\uff01',
    protectedLabel: '\u5b88\u3063\u305f',
    brokenLabel: '\u5d29\u3057\u305f',
    lostLabel: '\u524a\u3089\u308c\u305f',
    defeatedLabel: '\u6483\u9000',
    progressLabel: '\u9032\u884c',
    summaryTitle: '\u30da\u30fc\u30b8\u306e\u8981\u7d04',
    endRollTitle: '\u30da\u30fc\u30b8\u306e\u8a18\u61b6',
    endRollClose: '\u623b\u308b',
    enemyDamage: '\u5b88\u308b\u6587\u5b57\u304c\u524a\u3089\u308c\u305f\uff01',
    bgmOn: 'BGM ON',
    bgmOff: 'BGM OFF',
};

const RUNNER_WIDTH = 52;
const RUNNER_HEIGHT = 58;
const RUNNER_FOOT_WIDTH = 48;
const ENEMY_WIDTH = 44;
const ENEMY_HEIGHT = 42;
const BOSS_WIDTH = 78;
const BOSS_HEIGHT = 70;
const WORD_THROW_SIZE = 24;
const WORD_THROW_HITBOX = 40;
const WORD_THROW_SPEED = 960;
const WORD_THROW_LIFETIME = 1500;
const CHARGE_READY_MS = 520;
const CHARGE_FULL_MS = 1180;
const CHARGE_MAX_MS = 1500;
const GOAL_REVEAL_PROGRESS = 0.92;
const FALL_CAMERA_START_RATIO = 0.68;
const FALL_CAMERA_TARGET_RATIO = 0.48;
const FALL_CAMERA_FOLLOW_MS = 180;
const FALL_CAMERA_MIN_SCROLL_STEP = 5;
const FALL_CAMERA_MAX_SPEED = 620;
const HUD_GATE_SAFE_MARGIN = 12;
const ENEMY_MISSILE_SPEED = 270;
const ENEMY_MISSILE_LIFETIME = 3600;
const RETURN_ROUTE_REVEAL_PROGRESS = 0.58;
const PLAYER_MAX_LIFE = 3;
const RUNNER_CONTROL_DEFS = [
    { control: 'left', label: '\u2190', keys: 'A / \u2190' },
    { control: 'jump', label: '\u2191', keys: 'W / \u2191' },
    { control: 'right', label: '\u2192', keys: 'D / \u2192' },
    { control: 'shield', label: '\u76fe', keys: 'Shift / E' },
    { control: 'lock', label: '\u30ed\u30c3\u30af', keys: 'T / Tab' },
    { control: 'throw', label: '\u6295\u3052', keys: 'X' },
    { control: 'attack', label: '\u653b\u6483', keys: 'Space / Z' },
];

export class StageOverlay {
    constructor(options = {}) {
        this.characterName = options.characterName || UI_TEXT.defaultCharacter;
        this.messages = options.messages || {};
        this.importantWords = Array.isArray(options.importantWords) ? options.importantWords : [];
        this.reducedMotion = Boolean(options.reducedMotion);
        this.onExit = options.onExit || (() => {});
        this.onRetry = options.onRetry || (() => {});
        this.onInventoryOpen = options.onInventoryOpen || (() => {});
        this.onBgmToggle = options.onBgmToggle || (() => {});
        this.onStageClear = options.onStageClear || (() => {});
        this.onNavigate = options.onNavigate || ((href) => {
            window.location.href = href;
        });
        this.onRunnerSound = options.onRunnerSound || (() => {});
        this.bgmEnabled = Boolean(options.bgmEnabled);
        this.textBreaker = options.textBreaker || null;
        this.imageBreaker = options.imageBreaker || null;
        this.root = null;
        this.effectLayer = null;
        this.speech = null;
        this.inventoryList = null;
        this.inventoryToggle = null;
        this.bgmToggle = null;
        this.inventoryPanel = null;
        this.missionHud = null;
        this.missionGoal = null;
        this.missionProgress = null;
        this.missionStats = null;
        this.goalGate = null;
        this.gameOverPanel = null;
        this.endRoll = null;
        this.runner = null;
        this.runnerRaf = 0;
        this.runnerTargets = [];
        this.runnerState = null;
        this.runnerOnHit = null;
        this.runnerControls = null;
        this.runnerOnImageHit = null;
        this.runnerOnGateHit = null;
        this.runnerOnEnemyHit = null;
        this.runnerKeys = new Set();
        this.runnerGamepadKeys = new Set();
        this.runnerGamepadButtons = new Set();
        this.runnerLastTime = 0;
        this.runnerScrollFollowUntil = 0;
        this.lastAttackTapAt = 0;
        this.attackCharge = null;
        this.stageStats = createStageStats();
        this.lastMissionUpdateAt = 0;
        this.stageCleared = false;
        this.stageFailed = false;
        this.playerLife = PLAYER_MAX_LIFE;
        this.criticalWord = '';
        this.criticalWordLost = false;
        this.goalRevealed = false;
        this.nextGoalHref = '';
        this.endRollItems = [];
        this.endRollSummary = '';
        this.brickLayer = null;
        this.gateLayer = null;
        this.linkGates = [];
        this.gateCooldownUntil = 0;
        this.enemyLayer = null;
        this.enemies = [];
        this.enemySequence = 0;
        this.enemyMissiles = [];
        this.enemyMissileSequence = 0;
        this.enemyWaveStarted = false;
        this.bossSpawned = false;
        this.lastEnemySpawnAt = 0;
        this.projectileLayer = null;
        this.projectiles = [];
        this.lockedEnemyId = null;
        this.heldLetter = null;
        this.heldLetterSequence = 0;
        this.returnRoute = null;
        this.returnRouteCooldownUntil = 0;
        this.playBounds = null;
        this.handleViewportResize = this.handleViewportResize.bind(this);
        this.handleWindowScroll = this.handleWindowScroll.bind(this);
        this.handleRunnerKeyDown = this.handleRunnerKeyDown.bind(this);
        this.handleRunnerKeyUp = this.handleRunnerKeyUp.bind(this);
        this.timers = new Set();
    }

    mount() {
        this.root = document.createElement('div');
        this.root.className = `gw-stage${this.reducedMotion ? ' gw-stage--reduced' : ''}`;
        this.root.setAttribute('data-gaming-web-stage', 'active');

        this.effectLayer = document.createElement('div');
        this.effectLayer.className = 'gw-effect-layer';
        this.effectLayer.setAttribute('aria-hidden', 'true');

        const controls = document.createElement('div');
        controls.className = 'gw-controls';

        const exitButton = document.createElement('button');
        exitButton.type = 'button';
        exitButton.className = 'gw-exit-button';
        exitButton.textContent = UI_TEXT.exit;
        exitButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.onExit();
        });

        this.inventoryToggle = document.createElement('button');
        this.inventoryToggle.type = 'button';
        this.inventoryToggle.className = 'gw-inventory-toggle';
        this.inventoryToggle.textContent = `${UI_TEXT.inventoryPrefix} 0`;
        this.inventoryToggle.addEventListener('click', (event) => {
            event.preventDefault();
            this.toggleInventory();
        });

        this.bgmToggle = document.createElement('button');
        this.bgmToggle.type = 'button';
        this.bgmToggle.className = 'gw-bgm-toggle';
        this.setBgmEnabled(this.bgmEnabled);
        this.bgmToggle.addEventListener('click', (event) => {
            event.preventDefault();
            this.onBgmToggle(!this.bgmEnabled);
        });

        this.inventoryPanel = document.createElement('div');
        this.inventoryPanel.className = 'gw-inventory-panel';
        this.inventoryPanel.hidden = true;

        const inventoryTitle = document.createElement('div');
        inventoryTitle.className = 'gw-inventory-title';
        inventoryTitle.textContent = UI_TEXT.inventoryTitle;

        this.inventoryList = document.createElement('ul');
        this.inventoryList.className = 'gw-inventory-list';

        this.inventoryPanel.append(inventoryTitle, this.inventoryList);
        controls.append(this.inventoryToggle, this.bgmToggle, exitButton, this.inventoryPanel);

        this.speech = document.createElement('div');
        this.speech.className = 'gw-speech';
        this.speech.setAttribute('aria-live', 'polite');

        this.root.append(this.effectLayer, controls, this.speech);
        document.body.appendChild(this.root);

        this.mountMissionHud();
        this.setInventory([]);
        this.showMessage(this.messages.start || UI_TEXT.start);
    }

    destroy() {
        this.stopRunner();

        for (const timer of this.timers) {
            window.clearTimeout(timer);
        }

        this.timers.clear();
        this.root?.remove();
        this.root = null;
        this.effectLayer = null;
        this.missionHud = null;
        this.missionGoal = null;
        this.missionProgress = null;
        this.missionStats = null;
        this.goalGate = null;
        this.gameOverPanel = null;
        this.endRoll = null;
        document.body.classList.remove('gw-screen-shake', 'gw-screen-shake--soft', 'gw-screen-shake--medium', 'gw-screen-shake--hard');
    }

    owns(node) {
        return Boolean(this.root && node instanceof Node && this.root.contains(node));
    }

    showMessage(message, duration = 2600) {
        if (!this.speech) {
            return;
        }

        this.speech.textContent = message;
        this.speech.classList.add('gw-speech--visible');

        const timer = window.setTimeout(() => {
            this.speech?.classList.remove('gw-speech--visible');
            this.timers.delete(timer);
        }, duration);

        this.timers.add(timer);
    }

    setInventory(words) {
        if (!this.inventoryList || !this.inventoryToggle) {
            return;
        }

        this.inventoryToggle.textContent = `${UI_TEXT.inventoryPrefix} ${words.length}`;
        this.inventoryList.replaceChildren();

        if (words.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'gw-inventory-empty';
            empty.textContent = UI_TEXT.emptyInventory;
            this.inventoryList.appendChild(empty);
            return;
        }

        for (const word of words) {
            const item = document.createElement('li');
            item.textContent = word;
            this.inventoryList.appendChild(item);
        }
    }

    toggleInventory() {
        if (!this.inventoryPanel) {
            return;
        }

        this.inventoryPanel.hidden = !this.inventoryPanel.hidden;

        if (!this.inventoryPanel.hidden) {
            this.onInventoryOpen();
        }
    }

    setBgmEnabled(enabled) {
        this.bgmEnabled = Boolean(enabled);

        if (!this.bgmToggle) {
            return;
        }

        this.bgmToggle.textContent = this.bgmEnabled ? UI_TEXT.bgmOn : UI_TEXT.bgmOff;
        this.bgmToggle.setAttribute('aria-pressed', this.bgmEnabled ? 'true' : 'false');
        this.bgmToggle.classList.toggle('gw-bgm-toggle--on', this.bgmEnabled);
    }

    mountMissionHud() {
        this.missionHud?.remove();
        this.missionHud = document.createElement('aside');
        this.missionHud.className = 'gw-mission-hud';
        this.missionHud.setAttribute('aria-live', 'polite');
        this.missionHud.innerHTML = `
            <div class="gw-mission-hud__title">${UI_TEXT.missionTitle}</div>
            <div class="gw-mission-hud__goal"></div>
            <div class="gw-mission-hud__bar"><span></span></div>
            <dl class="gw-mission-hud__stats"></dl>
        `;
        this.missionGoal = this.missionHud.querySelector('.gw-mission-hud__goal');
        this.missionProgress = this.missionHud.querySelector('.gw-mission-hud__bar span');
        this.missionStats = this.missionHud.querySelector('.gw-mission-hud__stats');
        this.root?.appendChild(this.missionHud);
        this.updateMissionHud(true);
    }

    updateMissionHud(force = false) {
        if (!this.missionHud) {
            return;
        }

        const now = currentTime();
        if (!force && now - this.lastMissionUpdateAt < 180) {
            return;
        }

        this.lastMissionUpdateAt = now;
        const progress = Math.round(pageScrollProgress() * 100);
        const protectedCount = this.protectedCharCount();

        if (this.missionGoal) {
            if (this.stageFailed) {
                this.missionGoal.textContent = this.criticalWordLost ? UI_TEXT.stageFailed : UI_TEXT.gameOverLife;
            } else {
                const critical = this.criticalWord
                    ? ` / ${UI_TEXT.criticalGuard}\u300c${this.criticalWord}\u300d`
                    : '';
                this.missionGoal.textContent = this.goalRevealed
                    ? `${UI_TEXT.goalReady}${critical}`
                    : `${UI_TEXT.missionReachGoal} / ${UI_TEXT.missionProtect}${critical}`;
            }
        }

        if (this.missionProgress) {
            this.missionProgress.style.width = `${progress}%`;
        }

        if (this.missionStats) {
            this.missionStats.innerHTML = `
                <div><dt>${UI_TEXT.lifeLabel}</dt><dd class="gw-life-hearts" aria-label="${this.playerLife} / ${PLAYER_MAX_LIFE}">${renderLifeHearts(this.playerLife)}</dd></div>
                <div><dt>${UI_TEXT.progressLabel}</dt><dd>${progress}%</dd></div>
                <div><dt>${UI_TEXT.protectedLabel}</dt><dd>${protectedCount}</dd></div>
                <div><dt>${UI_TEXT.brokenLabel}</dt><dd>${this.stageStats.playerBroken}</dd></div>
                <div><dt>${UI_TEXT.lostLabel}</dt><dd>${this.stageStats.enemyBroken}</dd></div>
                <div><dt>${UI_TEXT.defeatedLabel}</dt><dd>${this.stageStats.enemiesDefeated}</dd></div>
            `;
        }
    }

    protectedCharCount() {
        return Math.max(0, this.stageStats.totalChars - this.stageStats.enemyBroken);
    }

    bumpStageStat(key, amount = 1) {
        if (!Number.isFinite(amount) || amount <= 0 || !(key in this.stageStats)) {
            return;
        }

        this.stageStats[key] += amount;
        this.updateMissionHud(true);
    }

    startRunner(targets, onHit, onTextBreak, onImageHit, onGateHit, onEnemyHit) {
        this.runnerTargets = targets
            .filter((target) => ['heading', 'paragraph', 'action', 'image'].includes(target.type))
            .filter((target) => isPlayableContentElement(target.element));
        this.runnerOnHit = onHit;
        this.runnerOnTextBreak = onTextBreak || (() => {});
        this.runnerOnImageHit = onImageHit || (() => {});
        this.runnerOnGateHit = onGateHit || (() => {});
        this.runnerOnEnemyHit = onEnemyHit || (() => {});
        this.playBounds = this.calculatePlayBounds();
        this.stageStats = createStageStats(this.textBreaker?.countTotalChars?.() || 0);
        this.endRollItems = this.buildEndRollItems(targets);
        this.endRollSummary = this.buildPageSummary(targets);
        const critical = this.textBreaker?.markImportantChars?.([this.buildCriticalWord(targets)]);
        this.criticalWord = critical?.count > 0 ? critical.word : '';
        this.criticalWordLost = false;
        this.nextGoalHref = '';
        this.stageCleared = false;
        this.stageFailed = false;
        this.playerLife = PLAYER_MAX_LIFE;
        this.goalRevealed = false;
        this.updateMissionHud(true);

        if (!this.effectLayer) {
            return;
        }

        this.mountBrickRails();
        this.mountLinkGates(targets);
        this.mountEnemyLayer();
        this.mountProjectileLayer();
        this.mountGoalGate();
        this.mountReturnRoute();
        this.runner = document.createElement('div');
        this.runner.className = 'gw-pixel-runner';
        this.runner.innerHTML = `
            <div class="gw-pixel-runner__sprite">
                <span class="gw-pixel-runner__pack"></span>
                <span class="gw-pixel-runner__head"></span>
                <span class="gw-pixel-runner__hair"></span>
                <span class="gw-pixel-runner__brow"></span>
                <span class="gw-pixel-runner__eye gw-pixel-runner__eye--left"></span>
                <span class="gw-pixel-runner__eye gw-pixel-runner__eye--right"></span>
                <span class="gw-pixel-runner__nose"></span>
                <span class="gw-pixel-runner__mouth"></span>
                <span class="gw-pixel-runner__body"></span>
                <span class="gw-pixel-runner__scarf"></span>
                <span class="gw-pixel-runner__belt"></span>
                <span class="gw-pixel-runner__arm gw-pixel-runner__arm--front"></span>
                <span class="gw-pixel-runner__arm gw-pixel-runner__arm--back"></span>
                <span class="gw-pixel-runner__leg gw-pixel-runner__leg--front"></span>
                <span class="gw-pixel-runner__leg gw-pixel-runner__leg--back"></span>
                <span class="gw-pixel-runner__boot gw-pixel-runner__boot--front"></span>
                <span class="gw-pixel-runner__boot gw-pixel-runner__boot--back"></span>
                <span class="gw-pixel-runner__hammer"></span>
            </div>
            <span class="gw-pixel-runner__facing"></span>
        `;
        this.effectLayer.appendChild(this.runner);
        const initialRect = this.initialRunnerRect();

        this.runnerState = {
            x: initialRect.x,
            y: initialRect.y,
            vx: 0,
            vy: 0,
            direction: 1,
            grounded: true,
            attackLockedUntil: 0,
            lastDustAt: 0,
            lastLandAt: 0,
            fallStartY: initialRect.y,
            fallSoundPlayed: false,
            scrollPinned: false,
        };

        this.gateCooldownUntil = currentTime() + 1200;
        this.lastEnemySpawnAt = currentTime();

        this.mountRunnerControls();
        window.addEventListener('resize', this.handleViewportResize);
        window.addEventListener('scroll', this.handleWindowScroll, { passive: true });
        document.addEventListener('keydown', this.handleRunnerKeyDown, true);
        document.addEventListener('keyup', this.handleRunnerKeyUp, true);
        this.showMessage(UI_TEXT.playerHint, 3600);
        this.runnerLastTime = 0;
        this.runnerRaf = requestFrame((time) => this.updateRunner(time));
    }

    initialRunnerRect() {
        const target = this.visibleRunnerTargets()[0];

        if (!target) {
            const bounds = this.currentPlayBounds();
            return {
                x: clamp(Math.min(80, Math.max(24, window.innerWidth * 0.12)), bounds.left, bounds.right - RUNNER_WIDTH),
                y: runnerGroundY(),
            };
        }

        const rect = liveRectForTarget(target);

        return {
            x: clamp(rect.left + 6, this.currentPlayBounds().left, this.currentPlayBounds().right - RUNNER_WIDTH),
            y: clamp(rect.top - RUNNER_HEIGHT + 4, 28, runnerGroundY()),
        };
    }

    buildEndRollItems(targets = []) {
        const items = [];

        for (const target of targets) {
            if (!['heading', 'paragraph'].includes(target.type)) {
                continue;
            }

            const text = normalizeText(target.text || target.element?.textContent || '');
            if (!text || items.includes(text)) {
                continue;
            }

            items.push(text.slice(0, target.type === 'heading' ? 42 : 76));
            if (items.length >= 12) {
                break;
            }
        }

        return items;
    }

    buildPageSummary(targets = []) {
        const headings = [];
        const sentences = [];

        for (const target of targets) {
            const text = normalizeText(target.text || target.element?.textContent || '');
            if (!text) {
                continue;
            }

            if (target.type === 'heading' && headings.length < 2 && !headings.includes(text)) {
                headings.push(text.slice(0, 42));
                continue;
            }

            if (target.type !== 'paragraph') {
                continue;
            }

            for (const sentence of splitSummarySentences(text)) {
                if (sentence.length < 12 || sentence.length > 110 || sentences.includes(sentence)) {
                    continue;
                }

                sentences.push(sentence);
                if (sentences.length >= 4) {
                    break;
                }
            }

            if (sentences.length >= 4) {
                break;
            }
        }

        const lines = [];
        const title = headings[0] || normalizeText(document.title || '');
        if (title) {
            lines.push(`このページは「${title}」を中心にしたステージです。`);
        }

        lines.push(...sentences.slice(0, 3));

        if (lines.length === 0) {
            return normalizeText(document.title || UI_TEXT.endRollTitle);
        }

        return lines.join('\n');
    }

    buildCriticalWord(targets = []) {
        const configured = this.importantWords
            .map((word) => normalizeText(word).replace(/\s+/g, ''))
            .find((word) => Array.from(word).length >= 2);

        if (configured) {
            return Array.from(configured).slice(0, 6).join('');
        }

        const heading = targets.find((target) => target.type === 'heading' && normalizeText(target.text || target.element?.textContent || ''));
        const headingText = normalizeText(heading?.text || heading?.element?.textContent || '').replace(/\s+/g, '');
        if (headingText) {
            return Array.from(headingText).slice(0, 4).join('');
        }

        return '';
    }

    stopRunner() {
        if (this.runnerRaf) {
            cancelFrame(this.runnerRaf);
        }

        this.runnerRaf = 0;
        this.runner?.remove();
        this.unmountRunnerControls();
        document.removeEventListener('keydown', this.handleRunnerKeyDown, true);
        document.removeEventListener('keyup', this.handleRunnerKeyUp, true);
        this.runnerKeys.clear();
        this.runnerGamepadKeys.clear();
        this.runnerGamepadButtons.clear();
        this.clearAttackCharge();
        window.removeEventListener('resize', this.handleViewportResize);
        window.removeEventListener('scroll', this.handleWindowScroll);
        this.brickLayer?.remove();
        this.brickLayer = null;
        this.gateLayer?.remove();
        this.gateLayer = null;
        this.linkGates = [];
        this.enemyLayer?.remove();
        this.enemyLayer = null;
        this.enemies = [];
        for (const projectile of this.projectiles) {
            projectile.element.remove();
        }

        this.dropHeldLetter();
        this.projectileLayer?.remove();
        this.projectileLayer = null;
        this.goalGate?.remove();
        this.goalGate = null;
        this.gameOverPanel?.remove();
        this.gameOverPanel = null;
        this.returnRoute?.remove();
        this.returnRoute = null;
        this.endRoll?.remove();
        this.endRoll = null;
        for (const missile of this.enemyMissiles) {
            missile.element.remove();
        }
        this.projectiles = [];
        this.enemyMissiles = [];
        this.lockedEnemyId = null;
        this.playBounds = null;
        this.stageCleared = false;
        this.stageFailed = false;
        this.playerLife = PLAYER_MAX_LIFE;
        this.criticalWord = '';
        this.criticalWordLost = false;
        this.goalRevealed = false;
        this.nextGoalHref = '';
        this.endRollItems = [];
        this.endRollSummary = '';
        this.runner = null;
        this.runnerState = null;
        this.runnerTargets = [];
        this.runnerOnHit = null;
        this.runnerOnTextBreak = null;
        this.runnerOnImageHit = null;
        this.runnerOnGateHit = null;
        this.runnerOnEnemyHit = null;
        this.lastAttackTapAt = 0;
    }

    handleViewportResize() {
        this.playBounds = this.calculatePlayBounds();
        this.updateBrickRails();
        this.updateLinkGates();
        this.updateGoalGate(true);
        this.updateReturnRoute(true);

        if (this.runnerState) {
            const bounds = this.currentPlayBounds();
            this.runnerState.x = clamp(this.runnerState.x, bounds.left, bounds.right - RUNNER_WIDTH);
        }
    }

    handleWindowScroll() {
        if (!this.runnerState) {
            return;
        }

        this.playBounds = this.calculatePlayBounds();
        this.updateBrickRails();
        this.updateLinkGates();
        this.updateGoalGate(true);
        this.updateReturnRoute(true);

        if (currentTime() < this.runnerScrollFollowUntil) {
            this.runnerState.x = clamp(this.runnerState.x, this.currentPlayBounds().left, this.currentPlayBounds().right - RUNNER_WIDTH);
            return;
        }

        this.runnerState.x = clamp(this.runnerState.x, this.currentPlayBounds().left, this.currentPlayBounds().right - RUNNER_WIDTH);
        this.runnerState.vx = 0;
        this.runnerState.vy = 0;
        this.runnerState.grounded = true;
        this.runnerState.scrollPinned = true;
    }

    releaseScrollPin() {
        if (this.runnerState) {
            this.runnerState.scrollPinned = false;
        }
    }

    updateRunner(time) {
        if (!this.runner || !this.runnerState) {
            return;
        }

        const delta = this.runnerLastTime ? Math.min((time - this.runnerLastTime) / 1000, 0.05) : 0.016;
        this.runnerLastTime = time;
        this.updateGamepadControls();
        this.updateRunnerPhysics(delta);
        this.maybeSpawnEnemies(time);
        this.updateEnemies(delta, time);
        this.syncLockedEnemy();
        this.updateProjectiles(delta);
        this.updateEnemyMissiles(delta, time);
        this.renderRunner(time);
        this.updateMissionHud();
        this.updateGoalGate();
        this.updateReturnRoute();
        this.checkGateEntry();
        this.checkGoalEntry();
        this.checkReturnRouteEntry();
        this.runnerRaf = requestFrame((nextTime) => this.updateRunner(nextTime));
    }

    visibleRunnerTargets() {
        return this.runnerTargets.filter((target) => {
            const rect = liveRectForTarget(target);
            return rect.width > 12
                && rect.height > 12
                && rect.bottom > 48
                && rect.top < window.innerHeight - 52
                && rect.right > 0
                && rect.left < window.innerWidth;
        });
    }

    calculatePlayBounds() {
        const usableRects = this.runnerTargets
            .map((target) => liveRectForTarget(target))
            .filter((rect) => rect.width > 8 && rect.height > 8 && rect.right > 0 && rect.left < window.innerWidth);

        if (usableRects.length === 0) {
            return {
                left: 12,
                right: Math.max(12 + RUNNER_WIDTH, window.innerWidth - 12),
            };
        }

        const padding = window.innerWidth < 640 ? 18 : 34;
        const minWidth = Math.min(window.innerWidth - 24, 260);
        let left = Math.max(12, Math.min(...usableRects.map((rect) => rect.left)) - padding);
        let right = Math.min(window.innerWidth - 12, Math.max(...usableRects.map((rect) => rect.right)) + padding);

        if (right - left < minWidth) {
            const center = (left + right) / 2;
            left = Math.max(12, center - minWidth / 2);
            right = Math.min(window.innerWidth - 12, left + minWidth);
            left = Math.max(12, right - minWidth);
        }

        return {
            left,
            right: Math.max(right, left + RUNNER_WIDTH + 16),
        };
    }

    currentPlayBounds() {
        return this.playBounds || {
            left: 12,
            right: Math.max(12 + RUNNER_WIDTH, window.innerWidth - 12),
        };
    }

    mountBrickRails() {
        this.brickLayer?.remove();
        this.brickLayer = document.createElement('div');
        this.brickLayer.className = 'gw-brick-rails';
        this.brickLayer.innerHTML = `
            <span class="gw-brick-wall gw-brick-wall--left" aria-hidden="true"></span>
            <span class="gw-brick-wall gw-brick-wall--right" aria-hidden="true"></span>
        `;
        this.effectLayer?.prepend(this.brickLayer);
        this.updateBrickRails();
    }

    updateBrickRails() {
        if (!this.brickLayer) {
            return;
        }

        const bounds = this.currentPlayBounds();
        const leftWall = this.brickLayer.querySelector('.gw-brick-wall--left');
        const rightWall = this.brickLayer.querySelector('.gw-brick-wall--right');
        const leftWidth = Math.max(0, bounds.left);
        const rightWidth = Math.max(0, window.innerWidth - bounds.right);

        if (leftWall) {
            leftWall.style.left = '0px';
            leftWall.style.top = '0px';
            leftWall.style.width = `${leftWidth}px`;
            leftWall.style.height = `${window.innerHeight}px`;
            leftWall.hidden = leftWidth < 10;
        }

        if (rightWall) {
            rightWall.style.left = `${bounds.right}px`;
            rightWall.style.top = '0px';
            rightWall.style.width = `${rightWidth}px`;
            rightWall.style.height = `${window.innerHeight}px`;
            rightWall.hidden = rightWidth < 10;
        }
    }

    mountLinkGates(targets) {
        this.gateLayer?.remove();
        this.linkGates = [];

        const gateTargets = targets
            .filter((target) => target.type === 'action' && target.element instanceof HTMLAnchorElement)
            .filter((target) => isPlayableContentElement(target.element))
            .filter((target) => isInternalLinkGate(target.element));

        if (gateTargets.length === 0 || !this.effectLayer) {
            return;
        }

        this.gateLayer = document.createElement('div');
        this.gateLayer.className = 'gw-link-gates';
        this.effectLayer.appendChild(this.gateLayer);

        for (const target of gateTargets) {
            const gateElement = document.createElement('span');
            gateElement.className = 'gw-link-gate';
            gateElement.setAttribute('aria-hidden', 'true');
            gateElement.textContent = (target.text || '\u30b2\u30fc\u30c8').slice(0, 18);
            this.gateLayer.appendChild(gateElement);

            this.linkGates.push({
                target,
                element: gateElement,
                href: target.element.href,
                destroyed: false,
            });
        }

        this.updateLinkGates();
    }

    updateLinkGates() {
        for (const gate of this.linkGates) {
            if (gate.destroyed || !gate.target.element.isConnected) {
                continue;
            }

            const rect = liveRectForTarget(gate.target);
            const visible = rect.width > 8
                && rect.height > 8
                && rect.bottom > 0
                && rect.top < window.innerHeight
                && rect.right > 0
                && rect.left < window.innerWidth
                && !this.linkGateOverlapsHud(rect);

            gate.element.hidden = !visible;
            if (!visible) {
                continue;
            }

            gate.element.style.left = `${rect.left}px`;
            gate.element.style.top = `${rect.top}px`;
            gate.element.style.width = `${Math.max(rect.width, 72)}px`;
            gate.element.style.height = `${Math.max(rect.height, 42)}px`;
        }
    }

    linkGateOverlapsHud(rect) {
        if (!this.missionHud) {
            return false;
        }

        const hudRect = this.missionHud.getBoundingClientRect();
        const safeRect = {
            left: hudRect.left - HUD_GATE_SAFE_MARGIN,
            top: hudRect.top - HUD_GATE_SAFE_MARGIN,
            right: hudRect.right + HUD_GATE_SAFE_MARGIN,
            bottom: hudRect.bottom + HUD_GATE_SAFE_MARGIN,
        };

        return rect.right > safeRect.left
            && rect.left < safeRect.right
            && rect.bottom > safeRect.top
            && rect.top < safeRect.bottom;
    }

    mountEnemyLayer() {
        this.enemyLayer?.remove();
        this.enemyLayer = document.createElement('div');
        this.enemyLayer.className = 'gw-enemy-layer';
        this.effectLayer?.appendChild(this.enemyLayer);
    }

    mountProjectileLayer() {
        this.projectileLayer?.remove();
        this.projectileLayer = document.createElement('div');
        this.projectileLayer.className = 'gw-projectile-layer';
        this.effectLayer?.appendChild(this.projectileLayer);
    }

    mountReturnRoute() {
        this.returnRoute?.remove();
        this.returnRoute = document.createElement('div');
        this.returnRoute.className = 'gw-return-route';
        this.returnRoute.setAttribute('aria-hidden', 'true');
        this.returnRoute.hidden = true;
        this.returnRoute.innerHTML = `<span>\u2191</span><small>${UI_TEXT.returnRoute}</small>`;
        this.effectLayer?.appendChild(this.returnRoute);
        this.updateReturnRoute(true);
    }

    updateReturnRoute(force = false) {
        if (!this.returnRoute) {
            return;
        }

        const visible = !this.stageCleared
            && !this.stageFailed
            && pageScrollProgress() >= RETURN_ROUTE_REVEAL_PROGRESS
            && window.scrollY > window.innerHeight * 0.45;
        this.returnRoute.hidden = !visible;
        if (!visible) {
            return;
        }

        const bounds = this.currentPlayBounds();
        const left = clamp(bounds.left + 18, 12, Math.max(12, bounds.right - 92));
        this.returnRoute.style.left = `${left}px`;
        this.returnRoute.style.top = `${Math.max(96, window.innerHeight - 176)}px`;

        if (force) {
            this.returnRoute.classList.remove('gw-return-route--active');
        }
    }

    checkReturnRouteEntry() {
        if (!this.runnerState || !this.returnRoute || this.returnRoute.hidden || currentTime() < this.returnRouteCooldownUntil) {
            return;
        }

        const routeRect = this.returnRoute.getBoundingClientRect();
        const runnerRect = this.runnerPhysicsRect();
        const overlap = rectOverlapArea(routeRect, runnerRect);
        if (overlap < Math.min(420, routeRect.width * routeRect.height * 0.2)) {
            return;
        }

        this.returnRouteCooldownUntil = currentTime() + 1600;
        this.returnRoute.classList.add('gw-return-route--active');
        const targetY = Math.max(0, window.scrollY - window.innerHeight * 0.86);
        this.runnerScrollFollowUntil = currentTime() + 420;
        window.scrollTo({ top: targetY, behavior: this.reducedMotion ? 'auto' : 'smooth' });
        this.runnerState.y = Math.max(92, Math.min(this.runnerState.y, window.innerHeight * 0.52));
        this.runnerState.vy = -120;
        this.runnerState.grounded = false;
        this.onRunnerSound('warp', { volume: 0.12, rate: 1.08 });
        this.showMessage(UI_TEXT.returnRouteHint, 1400);
    }

    maybeSpawnEnemies(time) {
        if (!this.enemyLayer || this.stageCleared || this.stageFailed) {
            return;
        }

        const progress = pageScrollProgress();
        const activeEnemies = this.enemies.filter((enemy) => !enemy.defeated);

        if (progress > 0.28 && !this.enemyWaveStarted) {
            this.enemyWaveStarted = true;
            this.spawnEnemy('minion');
            this.showMessage(UI_TEXT.enemyAppear, 2400);
        }

        if (progress > 0.44 && activeEnemies.filter((enemy) => enemy.type === 'minion').length < 2 && time - this.lastEnemySpawnAt > 7200) {
            this.spawnEnemy('minion');
            this.lastEnemySpawnAt = time;
        }

        if (progress > 0.66 && !this.bossSpawned) {
            this.bossSpawned = true;
            this.spawnEnemy('boss');
            this.showMessage(UI_TEXT.bossAppear, 3200);
            this.shakeScreen('medium');
        }
    }

    spawnEnemy(type = 'minion') {
        const boss = type === 'boss';
        const element = document.createElement('div');
        element.className = `gw-enemy gw-enemy--${type}`;
        element.innerHTML = `
            <span class="gw-enemy__shadow"></span>
            <span class="gw-enemy__body"></span>
            <span class="gw-enemy__eye gw-enemy__eye--left"></span>
            <span class="gw-enemy__eye gw-enemy__eye--right"></span>
            <span class="gw-enemy__hand gw-enemy__hand--left"></span>
            <span class="gw-enemy__hand gw-enemy__hand--right"></span>
            <span class="gw-enemy__hp"><span></span></span>
        `;
        this.enemyLayer?.appendChild(element);

        const width = boss ? BOSS_WIDTH : ENEMY_WIDTH;
        const height = boss ? BOSS_HEIGHT : ENEMY_HEIGHT;
        const fromRight = Math.random() > 0.5;
        const y = clamp(randomBetween(118, window.innerHeight - height - 124), 74, window.innerHeight - height - 84);
        const enemy = {
            id: `enemy-${++this.enemySequence}`,
            type,
            element,
            width,
            height,
            x: fromRight ? window.innerWidth - width - 30 : 30,
            y,
            vx: fromRight ? -38 : 38,
            vy: 0,
            hp: boss ? 8 : 3,
            maxHp: boss ? 8 : 3,
            defeated: false,
            countedDefeat: false,
            hitUntil: 0,
            nextAttackAt: currentTime() + (boss ? 1100 : 1700),
            nextMissileAt: currentTime() + randomBetween(boss ? 1350 : 2200, boss ? 2600 : 4200),
            nextTargetPickAt: 0,
            targetRect: null,
            roamUntil: 0,
        };

        this.enemies.push(enemy);
        this.renderEnemy(enemy);
    }

    updateEnemies(delta, time) {
        if (this.stageCleared || this.stageFailed) {
            return;
        }

        for (const enemy of this.enemies) {
            if (enemy.defeated) {
                continue;
            }

            this.updateEnemyTarget(enemy, time);
            const target = enemy.targetRect || this.enemyFallbackTarget(enemy);
            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2;
            const targetCenterX = target.left + target.width / 2;
            const targetCenterY = target.top + Math.min(target.height / 2, 80);
            const speed = enemy.type === 'boss' ? 62 : 86;
            const dx = targetCenterX - enemyCenterX;
            const dy = targetCenterY - enemyCenterY;
            const distance = Math.max(1, Math.hypot(dx, dy));

            enemy.vx = lerp(enemy.vx, (dx / distance) * speed, 0.04);
            enemy.vy = lerp(enemy.vy, (dy / distance) * speed, 0.035);
            enemy.x = clamp(enemy.x + enemy.vx * delta, 12, window.innerWidth - enemy.width - 12);
            enemy.y = clamp(enemy.y + enemy.vy * delta, 58, window.innerHeight - enemy.height - 76);

            if (distance < (enemy.type === 'boss' ? 96 : 72) && time > enemy.nextAttackAt) {
                this.enemyAttackPage(enemy);
                enemy.nextAttackAt = time + (enemy.type === 'boss' ? 1550 : 2300);
                enemy.targetRect = this.enemyRoamTarget(enemy);
                enemy.nextTargetPickAt = time + randomBetween(900, 1600);
                enemy.roamUntil = time + randomBetween(900, 1500);
            }

            if (!this.stageCleared && !this.stageFailed && time > enemy.nextMissileAt) {
                this.fireEnemyMissile(enemy);
                enemy.nextMissileAt = time + randomBetween(enemy.type === 'boss' ? 1700 : 2800, enemy.type === 'boss' ? 3200 : 5200);
            }

            this.renderEnemy(enemy);
        }

        this.enemies = this.enemies.filter((enemy) => enemy.element.isConnected || !enemy.defeated);
    }

    activeEnemies() {
        return this.enemies.filter((enemy) => !enemy.defeated && enemy.element.isConnected);
    }

    visibleActiveEnemies() {
        return this.activeEnemies().filter((enemy) => {
            const rect = this.enemyRect(enemy);
            return rect.right > -20
                && rect.left < window.innerWidth + 20
                && rect.bottom > -20
                && rect.top < window.innerHeight + 20;
        });
    }

    lockedEnemy() {
        if (!this.lockedEnemyId) {
            return null;
        }

        return this.activeEnemies().find((enemy) => enemy.id === this.lockedEnemyId) || null;
    }

    syncLockedEnemy() {
        if (!this.lockedEnemyId) {
            return;
        }

        if (this.lockedEnemy()) {
            return;
        }

        this.lockedEnemyId = null;
        this.showMessage(UI_TEXT.lockLost, 900);
    }

    cycleLockOn() {
        const enemies = this.visibleActiveEnemies();

        if (enemies.length === 0) {
            this.lockedEnemyId = null;
            this.showMessage(UI_TEXT.noEnemy, 900);
            return;
        }

        const handRect = this.runnerHandRect();
        const handX = handRect.left + handRect.width / 2;
        const handY = handRect.top + handRect.height / 2;
        const facing = this.runnerState?.direction || 1;
        enemies.sort((a, b) => {
            const aRect = this.enemyRect(a);
            const bRect = this.enemyRect(b);
            return enemyAimScore(a, handX, handY, facing) - enemyAimScore(b, handX, handY, facing)
                || (aRect.left + aRect.width / 2) - (bRect.left + bRect.width / 2);
        });

        const currentIndex = enemies.findIndex((enemy) => enemy.id === this.lockedEnemyId);
        const nextEnemy = enemies[(currentIndex + 1) % enemies.length];
        this.lockedEnemyId = nextEnemy.id;
        this.renderEnemy(nextEnemy);
        this.impactBurstAt(this.enemyRect(nextEnemy), 'soft');
        this.onRunnerSound('lock', { volume: 0.24 });
        this.showMessage(UI_TEXT.lockOn, 950);
    }

    autoLockNearestEnemy() {
        if (this.lockedEnemy()) {
            return this.lockedEnemy();
        }

        const handRect = this.runnerHandRect();
        const enemy = this.nearestEnemyFromPoint(
            handRect.left + handRect.width / 2,
            handRect.top + handRect.height / 2,
            this.runnerState?.direction || 1
        );

        if (!enemy) {
            return null;
        }

        this.lockedEnemyId = enemy.id;
        this.renderEnemy(enemy);
            this.onRunnerSound('lock', { volume: 0.14 });
        return enemy;
    }

    pickAndThrowAtLock(options = {}) {
        const enemy = options.autoLock ? this.autoLockNearestEnemy() : this.lockedEnemy();

        if (!enemy) {
            this.showMessage(options.autoLock ? UI_TEXT.noEnemy : UI_TEXT.lockHint, 1300);
            this.impactBurstAt(this.runnerHandRect(), 'soft');
            return true;
        }

        if (this.heldLetter) {
            return this.launchWordProjectile();
        }

        const pickupRect = this.runnerPickupRect();
        const picked = this.textBreaker?.pickCharAtRect(pickupRect, {
            centerX: this.runnerState.x + RUNNER_WIDTH / 2,
            centerY: this.runnerState.y + RUNNER_HEIGHT,
        });

        if (!picked?.char) {
            this.showMessage(UI_TEXT.noFootWord, 1100);
            this.impactBurstAt(pickupRect, 'soft');
            this.shakeScreen('soft');
            return true;
        }

        if (this.criticalDestroyed(picked)) {
            this.bumpStageStat('playerBroken', 1);
            this.impactBurstAt(picked.rect, 'char');
            this.shakeScreen('hard');
            this.failStage('critical_player_pickup');
            return true;
        }

        this.holdLetter(picked);
        const timer = window.setTimeout(() => {
            this.timers.delete(timer);
            if (this.heldLetter && this.lockedEnemy()) {
                this.launchWordProjectile();
            }
        }, this.reducedMotion ? 40 : 150);
        this.timers.add(timer);

        return true;
    }

    holdLetter(picked) {
        this.dropHeldLetter(true);

        const element = document.createElement('span');
        element.className = 'gw-held-letter';
        element.textContent = picked.char;
        this.applyPageLetterStyle(element, picked);
        element.style.left = `${picked.rect.left + picked.rect.width / 2}px`;
        element.style.top = `${picked.rect.top + picked.rect.height / 2}px`;
        this.projectileLayer?.appendChild(element);

        this.heldLetter = {
            id: `held-letter-${++this.heldLetterSequence}`,
            char: picked.char,
            element,
            style: picked.style || {},
            width: Math.max(picked.rect.width, WORD_THROW_SIZE),
            height: Math.max(picked.rect.height, WORD_THROW_SIZE),
        };

        this.bumpStageStat('playerBroken', 1);
        this.runner?.classList.add('gw-pixel-runner--holding');
        this.impactBurstAt(picked.rect, 'char');
        this.shakeScreen('soft');
        this.onRunnerSound('pickupLetter', { volume: 0.28, rate: 1.05 });
        this.showMessage(UI_TEXT.wordHold, 720);
        this.renderHeldLetter();
    }

    dropHeldLetter(immediate = false) {
        if (!this.heldLetter) {
            return;
        }

        const element = this.heldLetter.element;
        this.heldLetter = null;
        this.runner?.classList.remove('gw-pixel-runner--holding');

        if (immediate) {
            element.remove();
            return;
        }

        element.classList.add('gw-held-letter--drop');
        this.removeLater(element, 220);
    }

    renderHeldLetter() {
        if (!this.heldLetter || !this.runnerState) {
            return;
        }

        const handRect = this.runnerHandRect();
        const x = handRect.left + handRect.width / 2 + this.runnerState.direction * 6;
        const y = handRect.top + 1;
        this.heldLetter.element.style.left = `${x}px`;
        this.heldLetter.element.style.top = `${y}px`;
        this.heldLetter.element.style.transform = `translate(-50%, -50%) rotate(${this.runnerState.direction > 0 ? -8 : 8}deg)`;
    }

    applyPageLetterStyle(element, picked) {
        const style = picked.style || {};
        for (const property of ['color', 'fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'letterSpacing', 'lineHeight', 'textShadow']) {
            if (style[property]) {
                element.style[property] = style[property];
            }
        }

        element.style.width = `${Math.max(picked.rect?.width || WORD_THROW_SIZE, WORD_THROW_SIZE)}px`;
        element.style.height = `${Math.max(picked.rect?.height || WORD_THROW_SIZE, WORD_THROW_SIZE)}px`;
    }

    launchWordProjectile() {
        if (!this.runnerState || !this.projectileLayer || !this.heldLetter) {
            return false;
        }

        const enemy = this.lockedEnemy();
        if (!enemy) {
            this.showMessage(UI_TEXT.lockHint, 1200);
            return false;
        }

        const held = this.heldLetter;
        const power = wordPowerForHeldLetter(held);
        const handRect = this.runnerHandRect();
        const startX = handRect.left + handRect.width / 2;
        const startY = handRect.top + handRect.height / 2;
        const targetRect = this.enemyRect(enemy);
        const targetX = targetRect.left + targetRect.width / 2;
        const targetY = targetRect.top + targetRect.height / 2;
        const dx = targetX - startX;
        const dy = targetY - startY;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const speed = this.reducedMotion ? WORD_THROW_SPEED * 1.2 : WORD_THROW_SPEED;
        const element = held.element;
        element.className = `gw-word-shot gw-word-shot--page-letter gw-word-shot--power-${power.name}`;
        element.textContent = held.char;
        element.style.left = `${startX}px`;
        element.style.top = `${startY}px`;
        element.style.transform = `translate(-50%, -50%) rotate(${Math.atan2(dy, dx) * 180 / Math.PI}deg)`;
        this.heldLetter = null;
        this.runner?.classList.remove('gw-pixel-runner--holding');

        this.projectiles.push({
            element,
            x: startX,
            y: startY,
            vx: (dx / distance) * speed,
            vy: (dy / distance) * speed,
            age: 0,
            targetId: enemy.id,
            direction: this.runnerState.direction,
            char: held.char,
            damage: power.damage,
            intensity: power.intensity,
            power: power.name,
            hitbox: clamp(Math.max(held.width, held.height) + power.hitboxBonus, power.hitboxMin, 116),
        });

        this.impactBurstAt(handRect, 'soft');
        this.onRunnerSound('throwWord', { volume: power.throwVolume, rate: power.rate });
        this.showMessage(UI_TEXT.wordThrow, 900);
        return true;
    }

    updateProjectiles(delta) {
        if (this.projectiles.length === 0) {
            return;
        }

        const remaining = [];

        for (const projectile of this.projectiles) {
            projectile.age += delta * 1000;
            const target = this.enemies.find((enemy) => enemy.id === projectile.targetId && !enemy.defeated)
                || this.nearestEnemyFromPoint(projectile.x, projectile.y, projectile.direction);

            if (target) {
                const targetRect = this.enemyRect(target);
                const targetX = targetRect.left + targetRect.width / 2;
                const targetY = targetRect.top + targetRect.height / 2;
                const dx = targetX - projectile.x;
                const dy = targetY - projectile.y;
                const distance = Math.max(1, Math.hypot(dx, dy));
                projectile.vx = lerp(projectile.vx, (dx / distance) * WORD_THROW_SPEED, 0.26);
                projectile.vy = lerp(projectile.vy, (dy / distance) * WORD_THROW_SPEED, 0.26);
            }

            projectile.x += projectile.vx * delta;
            projectile.y += projectile.vy * delta;
            const angle = Math.atan2(projectile.vy, projectile.vx) * 180 / Math.PI;
            projectile.element.style.left = `${projectile.x}px`;
            projectile.element.style.top = `${projectile.y}px`;
            projectile.element.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

            const hitbox = projectile.hitbox || WORD_THROW_HITBOX;
            const shotRect = {
                left: projectile.x - hitbox / 2,
                top: projectile.y - hitbox / 2,
                width: hitbox,
                height: hitbox,
                right: projectile.x + hitbox / 2,
                bottom: projectile.y + hitbox / 2,
            };
            const hitEnemy = this.enemyAtRect(shotRect, 10);

            if (hitEnemy) {
                const hit = this.damageEnemy(hitEnemy, {
                    projectile: true,
                    damage: projectile.damage || 1,
                    intensity: projectile.intensity || 'medium',
                    knockbackDirection: Math.sign(projectile.vx) || projectile.direction || 1,
                    impactRect: shotRect,
                });
                hit.word = projectile.char;
                hit.damage = projectile.damage || 1;
                hit.power = projectile.power || 'small';
                projectile.element.classList.add('gw-word-shot--hit');
                this.removeLater(projectile.element, 180);
                this.runnerOnEnemyHit?.(hit);
                continue;
            }

            const outOfView = projectile.x < -60
                || projectile.x > window.innerWidth + 60
                || projectile.y < -80
                || projectile.y > window.innerHeight + 80;

            if (projectile.age > WORD_THROW_LIFETIME || outOfView) {
                projectile.element.remove();
                continue;
            }

            remaining.push(projectile);
        }

        this.projectiles = remaining;
    }

    fireEnemyMissile(enemy) {
        if (!this.projectileLayer || !enemy?.element?.isConnected) {
            return;
        }

        const enemyRect = this.enemyRect(enemy);
        const criticalRect = this.textBreaker?.criticalRect?.();
        const useCritical = criticalRect
            && criticalRect.bottom > 0
            && criticalRect.top < window.innerHeight
            && Math.random() < (enemy.type === 'boss' ? 0.72 : 0.5);
        const targetX = useCritical && criticalRect
            ? criticalRect.left + criticalRect.width / 2
            : (this.runnerState?.x || window.innerWidth / 2) + RUNNER_WIDTH / 2;
        const targetY = useCritical && criticalRect
            ? criticalRect.top + criticalRect.height / 2
            : (this.runnerState?.y || window.innerHeight / 2) + RUNNER_HEIGHT / 2;
        const startX = enemyRect.left + enemyRect.width / 2;
        const startY = enemyRect.top + enemyRect.height / 2;
        const dx = targetX - startX;
        const dy = targetY - startY;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const element = document.createElement('span');
        element.className = `gw-enemy-missile${enemy.type === 'boss' ? ' gw-enemy-missile--boss' : ''}`;
        element.style.left = `${startX}px`;
        element.style.top = `${startY}px`;
        this.projectileLayer.appendChild(element);

        this.enemyMissiles.push({
            id: `missile-${++this.enemyMissileSequence}`,
            ownerId: enemy.id,
            element,
            x: startX,
            y: startY,
            vx: (dx / distance) * ENEMY_MISSILE_SPEED,
            vy: (dy / distance) * ENEMY_MISSILE_SPEED,
            age: 0,
            parried: false,
            targetX,
            targetY,
            targetCritical: Boolean(useCritical),
        });

        this.onRunnerSound('throwWord', { volume: enemy.type === 'boss' ? 0.12 : 0.08, rate: enemy.type === 'boss' ? 0.86 : 1.16 });
    }

    updateEnemyMissiles(delta, time) {
        if (this.enemyMissiles.length === 0) {
            return;
        }

        const remaining = [];
        const runnerRect = this.runnerPhysicsRect();
        const shieldRect = this.runnerShieldRect();
        const meleeRect = this.runnerMeleeRect();
        const shielding = this.controlHeld('shield');
        const striking = Boolean(this.runner?.classList.contains('gw-pixel-runner--strike'));

        for (const missile of this.enemyMissiles) {
            missile.age += delta * 1000;

            if (missile.parried) {
                const target = this.enemies.find((enemy) => enemy.id === missile.ownerId && !enemy.defeated)
                    || this.nearestEnemyFromPoint(missile.x, missile.y, missile.vx >= 0 ? 1 : -1);
                if (target) {
                    const targetRect = this.enemyRect(target);
                    const targetX = targetRect.left + targetRect.width / 2;
                    const targetY = targetRect.top + targetRect.height / 2;
                    const dx = targetX - missile.x;
                    const dy = targetY - missile.y;
                    const distance = Math.max(1, Math.hypot(dx, dy));
                    missile.vx = lerp(missile.vx, (dx / distance) * (ENEMY_MISSILE_SPEED * 1.35), 0.24);
                    missile.vy = lerp(missile.vy, (dy / distance) * (ENEMY_MISSILE_SPEED * 1.35), 0.24);

                    if (rectOverlapArea(this.missileRect(missile), targetRect) > 18) {
                        const hit = this.damageEnemy(target, {
                            projectile: true,
                            damage: 2,
                            intensity: target.type === 'boss' ? 'hard' : 'medium',
                            impactRect: this.missileRect(missile),
                        });
                        this.runnerOnEnemyHit?.(hit);
                        missile.element.classList.add('gw-enemy-missile--pop');
                        this.removeLater(missile.element, 180);
                        continue;
                    }
                }
            }

            missile.x += missile.vx * delta;
            missile.y += missile.vy * delta;
            const angle = Math.atan2(missile.vy, missile.vx) * 180 / Math.PI;
            missile.element.style.left = `${missile.x}px`;
            missile.element.style.top = `${missile.y}px`;
            missile.element.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
            const missileRect = this.missileRect(missile);

            if (!missile.parried && ((shielding && rectOverlapArea(missileRect, shieldRect) > 6) || (striking && rectOverlapArea(missileRect, meleeRect) > 8))) {
                this.parryMissile(missile);
                remaining.push(missile);
                continue;
            }

            if (!missile.parried && rectOverlapArea(missileRect, runnerRect) > 12) {
                this.impactBurstAt(missileRect, 'soft');
                this.shakeScreen('soft');
                this.damagePlayer(1, 'missile');
                missile.element.classList.add('gw-enemy-missile--pop');
                this.removeLater(missile.element, 180);
                continue;
            }

            if (!missile.parried && Math.hypot(missile.x - missile.targetX, missile.y - missile.targetY) < 22) {
                const textHit = this.textBreaker?.destroyAtRect(missileRect, { limit: 1, source: 'enemy_missile' });
                if (textHit?.count > 0) {
                    this.bumpStageStat('enemyBroken', textHit.count);
                    this.impactBurstAt(textHit.rect, textHit.chars?.some(Boolean) ? 'medium' : 'soft');
                    if (this.criticalDestroyed(textHit)) {
                        this.failStage('critical_missile');
                    }
                } else {
                    this.impactBurstAt(missileRect, 'soft');
                }
                missile.element.classList.add('gw-enemy-missile--pop');
                this.removeLater(missile.element, 180);
                continue;
            }

            const outOfView = missile.x < -80
                || missile.x > window.innerWidth + 80
                || missile.y < -90
                || missile.y > window.innerHeight + 90;
            if (missile.age > ENEMY_MISSILE_LIFETIME || outOfView || this.stageCleared || this.stageFailed) {
                missile.element.remove();
                continue;
            }

            remaining.push(missile);
        }

        this.enemyMissiles = remaining;
    }

    parryMissile(missile) {
        if (missile.parried) {
            return;
        }

        missile.parried = true;
        missile.element.classList.add('gw-enemy-missile--parried');
        missile.vx *= -1.28;
        missile.vy = Math.min(missile.vy * -0.72, -90);
        this.impactBurstAt(this.missileRect(missile), 'medium');
        this.shakeScreen('soft');
        this.onRunnerSound('lock', { volume: 0.14, rate: 1.18 });
        this.showMessage(UI_TEXT.missileParry, 1100);
    }

    missileRect(missile) {
        const size = missile.element.classList.contains('gw-enemy-missile--boss') ? 34 : 26;
        return {
            left: missile.x - size / 2,
            top: missile.y - size / 2,
            width: size,
            height: size,
            right: missile.x + size / 2,
            bottom: missile.y + size / 2,
        };
    }

    nearestEnemyFromPoint(x, y, facing = 1) {
        let bestEnemy = null;
        let bestScore = Infinity;

        for (const enemy of this.activeEnemies()) {
            const rect = this.enemyRect(enemy);
            if (rect.right < -20 || rect.left > window.innerWidth + 20 || rect.bottom < -20 || rect.top > window.innerHeight + 20) {
                continue;
            }

            const score = enemyAimScore(enemy, x, y, facing);

            if (score < bestScore) {
                bestScore = score;
                bestEnemy = enemy;
            }
        }

        return bestEnemy;
    }

    updateEnemyTarget(enemy, time) {
        if (time < enemy.nextTargetPickAt && enemy.targetRect) {
            return;
        }

        enemy.nextTargetPickAt = time + randomBetween(760, 1500);
        const candidates = this.runnerTargets
            .filter((target) => target.type !== 'action')
            .map((target) => liveRectForTarget(target))
            .filter((rect) => rect.width > 16 && rect.height > 12 && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth);

        if (candidates.length === 0) {
            enemy.targetRect = this.enemyRoamTarget(enemy);
            return;
        }

        const enemyCenterX = enemy.x + enemy.width / 2;
        const enemyCenterY = enemy.y + enemy.height / 2;
        const farCandidates = candidates.filter((rect) => Math.hypot((rect.left + rect.width / 2) - enemyCenterX, (rect.top + rect.height / 2) - enemyCenterY) > 120);
        const pool = farCandidates.length > 0 ? farCandidates : candidates;
        const picked = pool[Math.floor(Math.random() * pool.length)];
        const jitterX = randomBetween(-80, 80);
        const jitterY = randomBetween(-54, 54);

        enemy.targetRect = {
            left: clamp(picked.left + jitterX, 24, window.innerWidth - 120),
            top: clamp(picked.top + jitterY, 70, window.innerHeight - 150),
            width: Math.min(140, Math.max(80, picked.width)),
            height: Math.min(90, Math.max(52, picked.height)),
            right: clamp(picked.left + jitterX, 24, window.innerWidth - 120) + Math.min(140, Math.max(80, picked.width)),
            bottom: clamp(picked.top + jitterY, 70, window.innerHeight - 150) + Math.min(90, Math.max(52, picked.height)),
        };
    }

    enemyFallbackTarget(enemy) {
        return this.enemyRoamTarget(enemy);
    }

    enemyRoamTarget(enemy) {
        const awayX = enemy.x < window.innerWidth / 2 ? randomBetween(window.innerWidth * 0.48, window.innerWidth - 150) : randomBetween(40, window.innerWidth * 0.52);
        const awayY = enemy.y < window.innerHeight / 2 ? randomBetween(window.innerHeight * 0.46, window.innerHeight - 150) : randomBetween(74, window.innerHeight * 0.54);

        return {
            left: clamp(awayX, 40, window.innerWidth - 160),
            top: clamp(awayY, 90, window.innerHeight - 160),
            width: 120,
            height: 80,
            right: clamp(awayX, 40, window.innerWidth - 160) + 120,
            bottom: clamp(awayY, 90, window.innerHeight - 160) + 80,
        };
    }

    enemyAttackPage(enemy) {
        const attackRect = this.enemyAttackRect(enemy);
        enemy.element.classList.add('gw-enemy--attack');
        const timer = window.setTimeout(() => {
            enemy.element?.classList.remove('gw-enemy--attack');
            this.timers.delete(timer);
        }, 360);
        this.timers.add(timer);

        if (this.runnerState && rectOverlapArea(attackRect, this.runnerPhysicsRect()) > 18) {
            this.damagePlayer(enemy.type === 'boss' ? 2 : 1, 'enemy_attack');
            return;
        }

        const textHit = this.textBreaker?.destroyAtRect(attackRect, { limit: enemy.type === 'boss' ? 2 : 1, source: 'enemy' });
        if (textHit?.count > 0) {
            this.bumpStageStat('enemyBroken', textHit.count);
            this.impactBurstAt(textHit.rect, enemy.type === 'boss' ? 'hard' : 'medium');
            this.shakeScreen(enemy.type === 'boss' ? 'medium' : 'soft');
            if (this.criticalDestroyed(textHit)) {
                this.failStage('critical_enemy_attack');
                return;
            }
            this.showMessage(UI_TEXT.enemyDamage, 1500);
            return;
        }

        const imageHit = this.imageBreaker?.hitAtRect(attackRect, { direction: enemy.vx >= 0 ? 1 : -1 });
        if (imageHit?.count > 0) {
            this.bumpStageStat('imagesDamaged', 1);
            this.impactBurstAt(imageHit.rect, enemy.type === 'boss' ? 'hard' : 'medium');
            this.spawnImageChips(imageHit.rect, enemy.vx >= 0 ? 1 : -1, Boolean(imageHit.destroyed));
            this.shakeScreen('medium');
            this.showMessage(UI_TEXT.enemyAttack, 1500);
        }
    }

    enemyAttackRect(enemy) {
        const direction = enemy.vx >= 0 ? 1 : -1;
        const left = direction > 0 ? enemy.x + enemy.width - 4 : enemy.x - 44;
        const top = enemy.y + enemy.height * 0.2;
        const width = enemy.type === 'boss' ? 78 : 52;
        const height = enemy.type === 'boss' ? 62 : 42;

        return {
            left,
            top,
            width,
            height,
            right: left + width,
            bottom: top + height,
        };
    }

    renderEnemy(enemy) {
        enemy.element.style.left = `${enemy.x}px`;
        enemy.element.style.top = `${enemy.y}px`;
        enemy.element.classList.toggle('gw-enemy--left', enemy.vx < 0);
        enemy.element.classList.toggle('gw-enemy--hit', currentTime() < enemy.hitUntil);
        enemy.element.classList.toggle('gw-enemy--locked', enemy.id === this.lockedEnemyId);
        const hpFill = enemy.element.querySelector('.gw-enemy__hp span');
        if (hpFill) {
            hpFill.style.width = `${Math.max(0, enemy.hp / enemy.maxHp) * 100}%`;
        }
    }

    hitEnemyAtRect(rect, options = {}) {
        const bestEnemy = this.enemyAtRect(rect, options.minOverlap || 18);

        if (!bestEnemy) {
            return null;
        }

        return this.damageEnemy(bestEnemy, {
            knockbackDirection: this.runnerState?.direction || (bestEnemy.vx >= 0 ? 1 : -1),
            damage: options.damage || 1,
            intensity: options.intensity || 'medium',
            impactRect: options.impactRect,
            charged: Boolean(options.charged),
        });
    }

    enemyAtRect(rect, minOverlap = 12) {
        let bestEnemy = null;
        let bestOverlap = 0;

        for (const enemy of this.enemies) {
            if (enemy.defeated) {
                continue;
            }

            const overlap = rectOverlapArea(rect, this.enemyRect(enemy));
            if (overlap > bestOverlap) {
                bestOverlap = overlap;
                bestEnemy = enemy;
            }
        }

        if (!bestEnemy || bestOverlap < minOverlap) {
            return null;
        }

        return bestEnemy;
    }

    damageEnemy(enemy, options = {}) {
        const direction = options.knockbackDirection || this.runnerState?.direction || (enemy.vx >= 0 ? 1 : -1);
        const damage = options.damage || 1;
        const projectile = Boolean(options.projectile);
        const charged = Boolean(options.charged);
        const impactRect = options.impactRect || this.enemyRect(enemy);
        const intensity = options.intensity || (enemy.type === 'boss' ? 'hard' : 'medium');
        const shake = options.shake || (charged || intensity === 'hard' ? 'medium' : (intensity === 'medium' ? 'soft' : 'soft'));

        enemy.hp -= damage;
        enemy.hitUntil = currentTime() + (projectile ? 250 + damage * 72 : (charged ? 390 : 280));
        enemy.vx += direction * (projectile ? 78 + damage * 42 : (charged ? 210 + damage * 32 : 150));
        enemy.vy -= projectile ? 28 + damage * 16 : (charged ? 58 : 35);
        this.impactBurstAt(impactRect, intensity);
        this.shakeScreen(shake);

        if (enemy.hp <= 0) {
            enemy.defeated = true;
            enemy.element.classList.add('gw-enemy--defeated');
            if (!enemy.countedDefeat) {
                enemy.countedDefeat = true;
                this.bumpStageStat('enemiesDefeated', 1);
            }
            this.removeLater(enemy.element, 720);
            this.showMessage(enemy.type === 'boss' ? UI_TEXT.bossDefeat : UI_TEXT.enemyDefeat, 2100);
        } else {
            this.showMessage(UI_TEXT.enemyHit, 900);
        }

        return {
            count: 1,
            enemy_type: enemy.type,
            enemy_id: enemy.id,
            defeated: enemy.defeated,
            hp: Math.max(0, enemy.hp),
            damage,
            source: projectile ? 'word_throw' : (charged ? 'charged_melee' : 'melee'),
            rect: this.enemyRect(enemy),
        };
    }

    enemyRect(enemy) {
        return {
            left: enemy.x,
            top: enemy.y,
            width: enemy.width,
            height: enemy.height,
            right: enemy.x + enemy.width,
            bottom: enemy.y + enemy.height,
        };
    }

    hitLinkGateAtRect(rect) {
        let bestGate = null;
        let bestOverlap = 0;

        for (const gate of this.linkGates) {
            if (gate.destroyed || gate.element.hidden) {
                continue;
            }

            const gateRect = gate.element.getBoundingClientRect();
            const overlap = rectOverlapArea(rect, gateRect);
            if (overlap > bestOverlap) {
                bestOverlap = overlap;
                bestGate = gate;
            }
        }

        if (!bestGate || bestOverlap < 16) {
            return null;
        }

        const gateRect = bestGate.element.getBoundingClientRect();
        if (this.textBreaker?.hasUnbrokenText(bestGate.target.element)) {
            return {
                count: 0,
                blocked: true,
                href: bestGate.href,
                selector: bestGate.target.selector,
                text: bestGate.target.text,
                rect: gateRect,
            };
        }

        bestGate.destroyed = true;
        bestGate.element.classList.add('gw-link-gate--broken');
        this.removeLater(bestGate.element, 620);

        return {
            count: 1,
            href: bestGate.href,
            selector: bestGate.target.selector,
            text: bestGate.target.text,
            rect: gateRect,
        };
    }

    criticalDestroyed(textHit) {
        if (!textHit) {
            return false;
        }

        const destroyedCritical = Boolean(textHit.critical)
            || Boolean(textHit.items?.some((item) => item.critical))
            || Boolean(textHit.criticalWord);
        if (!destroyedCritical) {
            return false;
        }

        this.criticalWordLost = true;
        return true;
    }

    checkGateEntry() {
        if (!this.runnerState || currentTime() < this.gateCooldownUntil) {
            return;
        }

        if (Math.abs(this.runnerState.vx) < 18) {
            return;
        }

        const runnerRect = {
            left: this.runnerState.x + 8,
            top: this.runnerState.y + 8,
            right: this.runnerState.x + RUNNER_WIDTH - 8,
            bottom: this.runnerState.y + RUNNER_HEIGHT - 3,
            width: RUNNER_WIDTH - 16,
            height: RUNNER_HEIGHT - 11,
        };

        for (const gate of this.linkGates) {
            if (gate.destroyed || gate.element.hidden) {
                continue;
            }

            const gateRect = gate.element.getBoundingClientRect();
            const overlap = rectOverlapArea(runnerRect, gateRect);
            if (overlap < Math.min(420, gateRect.width * gateRect.height * 0.22)) {
                continue;
            }

            this.enterLinkGate(gate);
            return;
        }
    }

    enterLinkGate(gate) {
        this.gateCooldownUntil = currentTime() + 1800;
        gate.element.classList.add('gw-link-gate--enter');
        this.showMessage(UI_TEXT.gateReady, 1100);

        const timer = window.setTimeout(() => {
            this.onNavigate(gate.href);
            this.timers.delete(timer);
        }, 260);

        this.timers.add(timer);
    }

    mountGoalGate() {
        this.goalGate?.remove();
        this.goalGate = document.createElement('div');
        this.goalGate.className = 'gw-goal-gate';
        this.goalGate.setAttribute('aria-hidden', 'true');
        this.goalGate.hidden = true;
        this.goalGate.innerHTML = `<span>${UI_TEXT.goalGate}</span><small>${UI_TEXT.goalEnd}</small>`;
        this.effectLayer?.appendChild(this.goalGate);
        this.updateGoalGate(true);
    }

    updateGoalGate(force = false) {
        if (!this.goalGate || this.stageCleared) {
            return;
        }

        const progress = pageScrollProgress();
        const reveal = progress >= GOAL_REVEAL_PROGRESS || isNearPageBottom();
        if (!reveal) {
            this.goalGate.hidden = true;
            this.goalRevealed = false;
            return;
        }

        const wasHidden = this.goalGate.hidden;
        this.goalGate.hidden = false;
        this.goalRevealed = true;
        this.nextGoalHref = this.currentGoalHref();
        const label = this.nextGoalHref ? UI_TEXT.goalNext : UI_TEXT.goalEnd;
        this.goalGate.innerHTML = `<span>${UI_TEXT.goalGate}</span><small>${label}</small>`;

        const bounds = this.currentPlayBounds();
        const width = Math.min(180, Math.max(132, bounds.right - bounds.left - 24));
        const left = clamp((bounds.left + bounds.right) / 2 - width / 2, 12, window.innerWidth - width - 12);
        this.goalGate.style.left = `${left}px`;
        this.goalGate.style.top = `${Math.max(86, window.innerHeight - 148)}px`;
        this.goalGate.style.width = `${width}px`;

        if ((wasHidden || force) && wasHidden) {
            this.showMessage(UI_TEXT.goalReady, 2200);
            this.onRunnerSound('cheer', { volume: 0.12, rate: 1.04 });
        }

        this.updateMissionHud(force || wasHidden);
    }

    checkGoalEntry() {
        if (!this.runnerState || !this.goalGate || this.goalGate.hidden || this.stageCleared || currentTime() < this.gateCooldownUntil) {
            return;
        }

        if (this.stageFailed) {
            this.showMessage(UI_TEXT.goalBlocked, 1300);
            return;
        }

        const runnerRect = {
            left: this.runnerState.x + 6,
            top: this.runnerState.y + 6,
            right: this.runnerState.x + RUNNER_WIDTH - 6,
            bottom: this.runnerState.y + RUNNER_HEIGHT - 2,
            width: RUNNER_WIDTH - 12,
            height: RUNNER_HEIGHT - 8,
        };
        const goalRect = this.goalGate.getBoundingClientRect();
        const overlap = rectOverlapArea(runnerRect, goalRect);
        if (overlap < Math.min(520, goalRect.width * goalRect.height * 0.18)) {
            return;
        }

        this.finishStage('goal_gate');
    }

    damagePlayer(amount = 1, reason = 'damage') {
        if (!this.runnerState || this.stageCleared || this.stageFailed) {
            return;
        }

        const damage = Math.max(1, Math.round(amount));
        this.playerLife = Math.max(0, this.playerLife - damage);
        const rect = this.runnerPhysicsRect();
        this.runner?.classList.add('gw-pixel-runner--damage');
        const timer = window.setTimeout(() => {
            this.runner?.classList.remove('gw-pixel-runner--damage');
            this.timers.delete(timer);
        }, 420);
        this.timers.add(timer);

        this.impactBurstAt(rect, damage >= 2 ? 'medium' : 'soft');
        this.shakeScreen(damage >= 2 ? 'medium' : 'soft');
        this.onRunnerSound('hitMedium', { volume: damage >= 2 ? 0.15 : 0.1, rate: damage >= 2 ? 0.92 : 1.08 });
        this.updateMissionHud(true);

        if (this.playerLife <= 0) {
            this.failStage(`life_zero_${reason}`);
            return;
        }

        this.showMessage(UI_TEXT.playerDamage, 1300);
    }

    failStage(reason = 'critical_lost') {
        if (this.stageCleared || this.stageFailed) {
            return;
        }

        const reasonText = String(reason || '');
        const criticalLost = reasonText.includes('critical');
        this.stageFailed = true;
        this.criticalWordLost = criticalLost;
        this.gateCooldownUntil = currentTime() + 3000;
        this.goalGate?.classList.add('gw-goal-gate--failed');
        this.missionHud?.classList.add('gw-mission-hud--danger');
        this.clearAttackCharge();
        this.dropHeldLetter();
        for (const missile of this.enemyMissiles) {
            missile.element.classList.add('gw-enemy-missile--pop');
            this.removeLater(missile.element, 160);
        }
        this.enemyMissiles = [];
        this.showMessage(criticalLost ? UI_TEXT.stageFailed : UI_TEXT.gameOverLife, 2800);
        this.shakeScreen('hard');
        this.onRunnerSound('enemyExplode', { volume: 0.16, rate: 0.92 });
        this.onStageClear(this.stageResult(reason));
        this.updateMissionHud(true);
        this.showGameOver(reason);
    }

    showGameOver(reason = '') {
        this.gameOverPanel?.remove();
        this.gameOverPanel = document.createElement('section');
        this.gameOverPanel.className = 'gw-game-over';
        this.gameOverPanel.setAttribute('role', 'dialog');
        this.gameOverPanel.setAttribute('aria-modal', 'true');
        this.gameOverPanel.setAttribute('aria-label', UI_TEXT.gameOverTitle);

        const reasonText = String(reason || '');
        const message = reasonText.includes('life') ? UI_TEXT.gameOverLife : UI_TEXT.gameOverCritical;
        this.gameOverPanel.innerHTML = `
            <div class="gw-game-over__panel">
                <h2>${UI_TEXT.gameOverTitle}</h2>
                <p>${message}</p>
                <p>${UI_TEXT.gameOverHint}</p>
                <div class="gw-game-over__actions">
                    <button type="button" class="gw-game-over__retry">${UI_TEXT.retry}</button>
                    <button type="button" class="gw-game-over__exit">${UI_TEXT.exit}</button>
                </div>
            </div>
        `;

        this.root?.appendChild(this.gameOverPanel);
        this.gameOverPanel.querySelector('.gw-game-over__retry')?.addEventListener('click', (event) => {
            event.preventDefault();
            this.onRetry();
        });
        this.gameOverPanel.querySelector('.gw-game-over__exit')?.addEventListener('click', (event) => {
            event.preventDefault();
            this.onExit();
        });
        this.gameOverPanel.querySelector('.gw-game-over__retry')?.focus({ preventScroll: true });
    }

    finishStage(reason = 'goal_gate') {
        if (this.stageCleared || this.stageFailed) {
            return;
        }

        this.stageCleared = true;
        this.gateCooldownUntil = currentTime() + 3000;
        this.goalGate?.classList.add('gw-goal-gate--clear');
        const burstCount = this.explodeEnemiesForStageClear();
        this.showMessage(burstCount > 0 ? UI_TEXT.stageClearBurst : UI_TEXT.stageClear, 2400);
        this.shakeScreen(burstCount > 0 ? 'hard' : 'medium');
        this.onRunnerSound('stageClear', { volume: 0.075, cheerVolume: 0.06, fadeMs: 620, rate: 1 });
        this.onStageClear(this.stageResult(reason));

        const timer = window.setTimeout(() => {
            this.showEndRoll();
            this.timers.delete(timer);
        }, this.reducedMotion ? 120 : (burstCount > 0 ? 1280 : 720));
        this.timers.add(timer);
    }

    explodeEnemiesForStageClear() {
        const enemies = this.activeEnemies();
        if (enemies.length === 0) {
            return 0;
        }

        enemies.forEach((enemy, index) => {
            enemy.defeated = true;
            enemy.stageClearPending = true;
            enemy.hp = 0;
            enemy.vx = 0;
            enemy.vy = 0;
            if (!enemy.countedDefeat) {
                enemy.countedDefeat = true;
                this.bumpStageStat('enemiesDefeated', 1);
            }
            if (this.lockedEnemyId === enemy.id) {
                this.lockedEnemyId = null;
            }

            const delay = this.reducedMotion ? 0 : index * 140;
            const timer = window.setTimeout(() => {
                this.explodeEnemyForStageClear(enemy, index);
                this.timers.delete(timer);
            }, delay);
            this.timers.add(timer);
        });

        return enemies.length;
    }

    explodeEnemyForStageClear(enemy, index = 0) {
        if (!enemy || !enemy.element?.isConnected || (enemy.defeated && !enemy.stageClearPending)) {
            return;
        }

        const rect = this.enemyRect(enemy);
        enemy.stageClearPending = false;
        enemy.defeated = true;
        enemy.hp = 0;
        enemy.vx = 0;
        enemy.vy = 0;
        if (!enemy.countedDefeat) {
            enemy.countedDefeat = true;
            this.bumpStageStat('enemiesDefeated', 1);
        }

        if (this.lockedEnemyId === enemy.id) {
            this.lockedEnemyId = null;
        }

        enemy.element.classList.remove('gw-enemy--hit', 'gw-enemy--attack', 'gw-enemy--locked');
        enemy.element.classList.add('gw-enemy--goal-explode');
        enemy.element.style.setProperty('--gw-pop-x', `${randomBetween(-18, 18)}px`);
        enemy.element.style.setProperty('--gw-pop-y', `${randomBetween(-28, -12)}px`);
        this.renderEnemy(enemy);
        this.spawnEnemyBlast(rect, enemy.type === 'boss');
        this.impactBurstAt(rect, enemy.type === 'boss' ? 'hard' : 'medium');
        this.shakeScreen(enemy.type === 'boss' ? 'hard' : 'medium');
        this.onRunnerSound('enemyExplode', {
            volume: enemy.type === 'boss' ? 0.2 : 0.13,
            rate: enemy.type === 'boss' ? 0.86 : 0.96 + index * 0.04,
        });
        this.removeLater(enemy.element, enemy.type === 'boss' ? 1050 : 860);
    }

    spawnEnemyBlast(rect, boss = false) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const blast = document.createElement('span');
        blast.className = `gw-enemy-blast${boss ? ' gw-enemy-blast--boss' : ''}`;
        blast.style.left = `${centerX}px`;
        blast.style.top = `${centerY}px`;
        this.addTemporaryEffect(blast, boss ? 820 : 680);

        const smokeCount = boss ? 8 : 5;
        for (let index = 0; index < smokeCount; index += 1) {
            const smoke = document.createElement('span');
            smoke.className = 'gw-enemy-smoke';
            smoke.style.left = `${centerX + randomBetween(-18, 18)}px`;
            smoke.style.top = `${centerY + randomBetween(-18, 18)}px`;
            smoke.style.setProperty('--gw-x', `${randomBetween(-80, 80)}px`);
            smoke.style.setProperty('--gw-y', `${randomBetween(-74, 46)}px`);
            smoke.style.setProperty('--gw-s', `${randomBetween(0.72, boss ? 1.5 : 1.1)}`);
            smoke.style.setProperty('--gw-d', `${randomBetween(0, 70)}ms`);
            this.addTemporaryEffect(smoke, boss ? 980 : 820);
        }
    }

    currentGoalHref() {
        const currentUrl = normalizeUrl(window.location.href);
        const gate = this.linkGates.find((item) => !item.destroyed
            && item.href
            && normalizeUrl(item.href) !== currentUrl);
        return gate?.href || '';
    }

    stageResult(reason = '') {
        return {
            reason,
            stage_name: window.GamingWebConfig?.stageName || '',
            total_chars: this.stageStats.totalChars,
            protected_count: this.protectedCharCount(),
            player_broken_count: this.stageStats.playerBroken,
            enemy_broken_count: this.stageStats.enemyBroken,
            enemy_defeated_count: this.stageStats.enemiesDefeated,
            gates_broken: this.stageStats.gatesBroken,
            images_damaged: this.stageStats.imagesDamaged,
            critical_word: this.criticalWord || '',
            critical_lost: Boolean(this.criticalWordLost),
            player_life: this.playerLife,
            failed: Boolean(this.stageFailed),
            next_href: this.nextGoalHref || '',
        };
    }

    showEndRoll() {
        this.endRoll?.remove();
        this.endRoll = document.createElement('section');
        this.endRoll.className = 'gw-end-roll';
        this.endRoll.setAttribute('role', 'dialog');
        this.endRoll.setAttribute('aria-modal', 'true');
        this.endRoll.setAttribute('aria-label', UI_TEXT.stageClear);

        const stats = this.stageResult('end_roll');
        const nextButton = this.nextGoalHref
            ? `<button type="button" class="gw-end-roll__next">${UI_TEXT.goalNext}</button>`
            : '';
        const memoryItems = this.endRollItems.length > 0
            ? this.endRollItems.map((item) => `<p>${escapeHtml(item)}</p>`).join('')
            : `<p>${escapeHtml(document.title || UI_TEXT.endRollTitle)}</p>`;
        const summaryText = this.endRollSummary || normalizeText(document.title || UI_TEXT.endRollTitle);
        const summaryItems = summaryText.split('\n')
            .filter(Boolean)
            .map((line) => `<p>${escapeHtml(line)}</p>`)
            .join('');

        this.endRoll.innerHTML = `
            <div class="gw-end-roll__panel">
                <h2>${UI_TEXT.stageClear}</h2>
                <dl class="gw-end-roll__stats">
                    <div><dt>${UI_TEXT.protectedLabel}</dt><dd>${stats.protected_count}</dd></div>
                    <div><dt>${UI_TEXT.brokenLabel}</dt><dd>${stats.player_broken_count}</dd></div>
                    <div><dt>${UI_TEXT.lostLabel}</dt><dd>${stats.enemy_broken_count}</dd></div>
                    <div><dt>${UI_TEXT.defeatedLabel}</dt><dd>${stats.enemy_defeated_count}</dd></div>
                </dl>
                <section class="gw-end-roll__summary">
                    <h3>${UI_TEXT.summaryTitle}</h3>
                    ${summaryItems}
                </section>
                <div class="gw-end-roll__viewport">
                    <div class="gw-end-roll__content">
                        <h3>${UI_TEXT.endRollTitle}</h3>
                        ${memoryItems}
                    </div>
                </div>
                <div class="gw-end-roll__actions">
                    ${nextButton}
                    <button type="button" class="gw-end-roll__close">${UI_TEXT.endRollClose}</button>
                </div>
            </div>
        `;

        this.root?.appendChild(this.endRoll);
        this.endRoll.querySelector('.gw-end-roll__close')?.addEventListener('click', (event) => {
            event.preventDefault();
            this.endRoll?.remove();
            this.endRoll = null;
            this.goalGate?.classList.add('gw-goal-gate--clear');
        });
        this.endRoll.querySelector('.gw-end-roll__next')?.addEventListener('click', (event) => {
            event.preventDefault();
            if (this.nextGoalHref) {
                this.onNavigate(this.nextGoalHref);
            }
        });
    }

    updateRunnerPhysics(delta) {
        if (this.runnerState.scrollPinned) {
            const bounds = this.currentPlayBounds();
            this.runnerState.x = clamp(this.runnerState.x, bounds.left, bounds.right - RUNNER_WIDTH);
            this.runnerState.y = clamp(this.runnerState.y, 28, runnerGroundY());
            this.runnerState.vx = 0;
            this.runnerState.vy = 0;
            this.runnerState.grounded = true;
            return;
        }

        const left = this.controlHeld('left');
        const right = this.controlHeld('right');
        const jump = this.controlHeld('jump');
        const shielding = this.controlHeld('shield');
        const runSpeed = shielding ? 145 : 250;
        const friction = this.runnerState.grounded ? 0.74 : 0.9;
        const gravity = 920;
        const maxFallSpeed = 470;
        const worldGroundY = runnerGroundY();
        const oldBottom = this.runnerState.y + RUNNER_HEIGHT;
        const bounds = this.currentPlayBounds();

        if (left && !right) {
            this.runnerState.vx = -runSpeed;
            this.runnerState.direction = -1;
        } else if (right && !left) {
            this.runnerState.vx = runSpeed;
            this.runnerState.direction = 1;
        } else {
            this.runnerState.vx *= friction;
            if (Math.abs(this.runnerState.vx) < 8) {
                this.runnerState.vx = 0;
            }
        }

        if (jump && this.runnerState.grounded) {
            this.runnerState.vy = -560;
            this.runnerState.grounded = false;
            this.runnerState.fallStartY = this.runnerState.y;
            this.runnerState.fallSoundPlayed = false;
            this.onRunnerSound('jump', { volume: 0.14, rate: 1.04 });
        }

        this.runnerState.vy = Math.min(this.runnerState.vy + gravity * delta, maxFallSpeed);
        this.runnerState.x = clamp(this.runnerState.x + this.runnerState.vx * delta, bounds.left, bounds.right - RUNNER_WIDTH);
        this.runnerState.y += this.runnerState.vy * delta;
        const runnerRect = this.runnerPhysicsRect();

        if (this.runnerState.vy >= 0) {
            const landingY = firstLandingY(
                this.textBreaker?.findLandingY(runnerRect, oldBottom, runnerRect.bottom),
                this.imageBreaker?.findLandingY(runnerRect, oldBottom, runnerRect.bottom)
            );
            if (landingY !== null && landingY <= worldGroundY) {
                this.landRunnerAt(landingY, this.runnerState.vy);
                return;
            }
        }

        if (this.followRunnerFall(delta)) {
            this.maybePlayFallSound();
            return;
        }

        if (this.runnerState.y >= worldGroundY) {
            this.landRunnerAt(worldGroundY + RUNNER_HEIGHT, this.runnerState.vy);
            return;
        }

        if (this.runnerState.grounded && !jump) {
            const supportRect = this.runnerPhysicsRect();
            const textSupportY = this.textBreaker?.findSupportY(supportRect);
            const imageSupportY = this.imageBreaker?.findSupportY(supportRect);
            const supportY = firstLandingY(textSupportY, imageSupportY);
            const supportTolerance = imageSupportY !== null && (textSupportY === null || imageSupportY <= textSupportY) ? 20 : 10;
            if (supportY !== null && Math.abs(this.runnerState.y - (supportY - RUNNER_HEIGHT)) < supportTolerance) {
                this.runnerState.y = supportY - RUNNER_HEIGHT;
                this.runnerState.vy = 0;
                return;
            }

            if (this.runnerState.y < worldGroundY - 2) {
                this.runnerState.grounded = false;
                this.runnerState.fallStartY = this.runnerState.y;
                this.runnerState.fallSoundPlayed = false;
            }
        }

        this.maybePlayFallSound();
    }

    followRunnerFall(delta) {
        if (!this.runnerState || this.runnerState.grounded || this.runnerState.vy <= 40) {
            return false;
        }

        const maxScroll = maxPageScrollY();
        const remaining = maxScroll - window.scrollY;
        if (remaining <= 1) {
            return false;
        }

        const runnerBottom = this.runnerState.y + RUNNER_HEIGHT;
        const followStart = Math.min(runnerGroundY() - 6, window.innerHeight * FALL_CAMERA_START_RATIO);
        if (runnerBottom < followStart) {
            return false;
        }

        const targetTop = clamp(
            window.innerHeight * FALL_CAMERA_TARGET_RATIO,
            118,
            Math.max(118, runnerGroundY() - RUNNER_HEIGHT - 92)
        );
        const fallingStep = Math.max(FALL_CAMERA_MIN_SCROLL_STEP, this.runnerState.vy * delta * 0.92);
        const pressureStep = Math.max(0, runnerBottom - followStart) * 0.18;
        const maxStep = Math.max(FALL_CAMERA_MIN_SCROLL_STEP, FALL_CAMERA_MAX_SPEED * delta);
        const scrollAmount = Math.min(
            remaining,
            this.runnerState.y - targetTop > 0 ? Math.max(fallingStep, pressureStep) : fallingStep,
            maxStep
        );

        if (scrollAmount <= 0) {
            return false;
        }

        this.runnerScrollFollowUntil = currentTime() + FALL_CAMERA_FOLLOW_MS;
        window.scrollBy(0, scrollAmount);
        this.runnerState.y = Math.max(28, this.runnerState.y - scrollAmount);
        this.playBounds = this.calculatePlayBounds();
        this.updateBrickRails();
        this.updateLinkGates();
        this.updateGoalGate(true);
        return true;
    }

    landRunnerAt(surfaceY, velocity) {
        const now = currentTime();
        const wasAirborne = !this.runnerState.grounded;
        const fallDistance = Math.max(0, (this.runnerState.y || 0) - (this.runnerState.fallStartY || this.runnerState.y || 0));

        this.runnerState.y = surfaceY - RUNNER_HEIGHT;
        this.runnerState.vy = 0;
        this.runnerState.grounded = true;
        this.runnerState.fallSoundPlayed = false;
        this.runnerState.fallStartY = this.runnerState.y;

        if (wasAirborne && now - this.runnerState.lastLandAt > 140) {
            const heavy = velocity > 390 || fallDistance > 150;
            this.runnerState.lastLandAt = now;
            this.onRunnerSound(heavy ? 'landHeavy' : 'land', {
                volume: heavy ? 0.09 : 0.055,
                rate: heavy ? 0.94 : 1.04,
            });

            if (heavy) {
                this.shakeScreen('soft');
            }
        }
    }

    maybePlayFallSound() {
        if (this.runnerState.grounded || this.runnerState.fallSoundPlayed || this.runnerState.vy < 210) {
            return;
        }

        const fallDistance = this.runnerState.y - (this.runnerState.fallStartY || this.runnerState.y);
        if (fallDistance < 34) {
            return;
        }

        this.runnerState.fallSoundPlayed = true;
        this.onRunnerSound('fall', { volume: 0.075, rate: 1.08 });
    }

    controlHeld(control) {
        return this.runnerKeys.has(control) || this.runnerGamepadKeys.has(control);
    }

    updateGamepadControls() {
        if (!navigator.getGamepads) {
            return;
        }

        const pads = Array.from(navigator.getGamepads()).filter(Boolean);
        const pad = pads.find((gamepad) => gamepad.connected !== false);

        if (!pad) {
            this.runnerGamepadKeys.clear();
            this.runnerGamepadButtons.clear();
            return;
        }

        const axisX = Number(pad.axes?.[0] || 0);
        this.setGamepadHeld('left', axisX < -0.35 || Boolean(pad.buttons?.[14]?.pressed));
        this.setGamepadHeld('right', axisX > 0.35 || Boolean(pad.buttons?.[15]?.pressed));
        this.setGamepadHeld('jump', Boolean(pad.buttons?.[0]?.pressed || pad.buttons?.[12]?.pressed));
        this.setGamepadHeld('shield', Boolean(pad.buttons?.[6]?.pressed || pad.buttons?.[7]?.pressed));
        this.handleGamepadChargeButton('attack', Boolean(pad.buttons?.[1]?.pressed));
        this.handleGamepadButton('throw', Boolean(pad.buttons?.[2]?.pressed || pad.buttons?.[5]?.pressed), () => this.runnerThrow());
        this.handleGamepadButton('lock', Boolean(pad.buttons?.[3]?.pressed || pad.buttons?.[4]?.pressed), () => this.cycleLockOn());
    }

    setGamepadHeld(control, pressed) {
        if (pressed) {
            this.runnerGamepadKeys.add(control);
            this.releaseScrollPin();
            return;
        }

        this.runnerGamepadKeys.delete(control);
    }

    handleGamepadButton(control, pressed, callback) {
        if (!pressed) {
            this.runnerGamepadButtons.delete(control);
            return;
        }

        if (this.runnerGamepadButtons.has(control)) {
            return;
        }

        this.runnerGamepadButtons.add(control);
        this.releaseScrollPin();
        callback();
    }

    handleGamepadChargeButton(control, pressed) {
        if (pressed) {
            if (this.runnerGamepadButtons.has(control)) {
                return;
            }

            this.runnerGamepadButtons.add(control);
            this.releaseScrollPin();
            this.startAttackCharge('gamepad');
            return;
        }

        if (!this.runnerGamepadButtons.has(control)) {
            return;
        }

        this.runnerGamepadButtons.delete(control);
        this.finishAttackCharge();
    }

    runnerPhysicsRect() {
        const footLeft = this.runnerState.x + (RUNNER_WIDTH - RUNNER_FOOT_WIDTH) / 2;

        return {
            left: footLeft,
            top: this.runnerState.y,
            right: footLeft + RUNNER_FOOT_WIDTH,
            bottom: this.runnerState.y + RUNNER_HEIGHT,
            width: RUNNER_FOOT_WIDTH,
            height: RUNNER_HEIGHT,
        };
    }

    renderRunner(time = currentTime()) {
        this.runner.style.left = `${this.runnerState.x}px`;
        this.runner.style.top = `${this.runnerState.y}px`;
        this.runner.classList.toggle('gw-pixel-runner--left', this.runnerState.direction < 0);
        const running = Math.abs(this.runnerState.vx) > 16;
        this.runner.classList.toggle('gw-pixel-runner--running', running);
        this.runner.classList.toggle('gw-pixel-runner--jumping', !this.runnerState.grounded);
        this.runner.classList.toggle('gw-pixel-runner--shielding', this.controlHeld('shield'));

        if (running && this.runnerState.grounded && !this.reducedMotion) {
            this.spawnRunnerDust(time);
        }

        this.renderHeldLetter();
    }

    spawnRunnerDust(time) {
        if (time - this.runnerState.lastDustAt < 115) {
            return;
        }

        this.runnerState.lastDustAt = time;
        const dust = document.createElement('span');
        dust.className = 'gw-run-dust';
        const behindX = this.runnerState.direction > 0
            ? this.runnerState.x + 10
            : this.runnerState.x + RUNNER_WIDTH - 10;
        dust.style.left = `${behindX}px`;
        dust.style.top = `${this.runnerState.y + RUNNER_HEIGHT - 6}px`;
        dust.style.setProperty('--gw-dust-x', `${this.runnerState.direction > 0 ? -24 : 24}px`);
        this.addTemporaryEffect(dust, 360);
    }

    playRunnerStrike(options = {}) {
        if (!this.runner) {
            return;
        }

        this.runner.classList.add('gw-pixel-runner--strike');
        this.runner.classList.toggle('gw-pixel-runner--charged-strike', Boolean(options.charged));
        const timer = window.setTimeout(() => {
            this.runner?.classList.remove('gw-pixel-runner--strike');
            this.runner?.classList.remove('gw-pixel-runner--charged-strike');
            this.timers.delete(timer);
        }, options.charged ? 470 : 360);
        this.timers.add(timer);
    }

    startAttackCharge(source = 'manual') {
        if (!this.runnerState || this.attackCharge) {
            return false;
        }

        const now = currentTime();
        if (now < this.runnerState.attackLockedUntil) {
            return false;
        }

        const readyTimer = window.setTimeout(() => {
            if (!this.attackCharge) {
                return;
            }

            this.runner?.classList.add('gw-pixel-runner--charge-ready');
            this.setAttackControlCharging(true, true);
            this.onRunnerSound('chargeReady', { volume: 0.12 });
            this.showMessage(UI_TEXT.chargeReady, 900);
            this.timers.delete(readyTimer);
        }, CHARGE_READY_MS);

        const fullTimer = window.setTimeout(() => {
            if (!this.attackCharge) {
                return;
            }

            this.runner?.classList.add('gw-pixel-runner--charge-full');
            this.onRunnerSound('chargeFull', { volume: 0.14 });
            this.showMessage(UI_TEXT.chargeFull, 900);
            this.timers.delete(fullTimer);
        }, CHARGE_FULL_MS);

        this.timers.add(readyTimer);
        this.timers.add(fullTimer);
        this.attackCharge = {
            startedAt: now,
            source,
            readyTimer,
            fullTimer,
        };
        this.runner?.classList.add('gw-pixel-runner--charging');
        this.setAttackControlCharging(true, false);
        this.onRunnerSound('chargeStart', { volume: 0.055 });
        return true;
    }

    finishAttackCharge(options = {}) {
        if (!this.attackCharge) {
            return false;
        }

        const charge = this.attackCharge;
        const duration = Math.min(currentTime() - charge.startedAt, CHARGE_MAX_MS);
        this.clearAttackCharge();

        if (options.cancel) {
            return false;
        }

        if (duration >= CHARGE_READY_MS) {
            this.runnerChargedAttack(duration);
        } else {
            this.runnerAttack();
        }

        return true;
    }

    clearAttackCharge() {
        const hadCharge = Boolean(this.attackCharge);

        if (this.attackCharge) {
            window.clearTimeout(this.attackCharge.readyTimer);
            window.clearTimeout(this.attackCharge.fullTimer);
            this.timers.delete(this.attackCharge.readyTimer);
            this.timers.delete(this.attackCharge.fullTimer);
        }

        this.attackCharge = null;
        this.runner?.classList.remove(
            'gw-pixel-runner--charging',
            'gw-pixel-runner--charge-ready',
            'gw-pixel-runner--charge-full'
        );
        this.setAttackControlCharging(false, false);

        if (hadCharge) {
            this.onRunnerSound('chargeStop');
        }
    }

    setAttackControlCharging(charging, ready = false) {
        const button = this.runnerControls?.querySelector('[data-gw-control="attack"]');
        if (!button) {
            return;
        }

        button.classList.toggle('gw-player-control--charging', Boolean(charging));
        button.classList.toggle('gw-player-control--charge-ready', Boolean(ready));
    }

    runnerAttack() {
        if (!this.runnerState) {
            return;
        }

        const now = currentTime();
        if (now < this.runnerState.attackLockedUntil) {
            return;
        }

        this.runnerState.attackLockedUntil = now + 280;
        this.playRunnerStrike();

        const attackRect = this.runnerAttackRect();
        const meleeRect = this.runnerMeleeRect();
        const enemyHit = this.hitEnemyAtRect(meleeRect, {
            minOverlap: 12,
            damage: 1,
            intensity: 'medium',
        });
        if (enemyHit?.count > 0) {
            this.runnerOnEnemyHit?.(enemyHit);
            return;
        }

        const charBreak = this.textBreaker?.destroyAtRect(attackRect, { limit: 1, source: 'player' });
        if (charBreak?.count > 0) {
            this.bumpStageStat('playerBroken', charBreak.count);
            this.impactBurstAt(charBreak.rect, 'char');
            this.shakeScreen('medium');
            this.runnerOnTextBreak?.(charBreak);
            if (this.criticalDestroyed(charBreak)) {
                this.failStage('critical_player_attack');
                return;
            }

            this.showMessage(UI_TEXT.runnerBreak, 1800);
            return;
        }

        const gateHit = this.hitLinkGateAtRect(attackRect);
        if (gateHit?.blocked) {
            this.impactBurstAt(gateHit.rect, 'soft');
            this.showMessage(UI_TEXT.gateNeedsTextBreak, 1300);
            return;
        }

        if (gateHit?.count > 0) {
            this.bumpStageStat('gatesBroken', 1);
            this.impactBurstAt(gateHit.rect, 'medium');
            this.shakeScreen('medium');
            this.showMessage(UI_TEXT.gateBreak, 1500);
            this.runnerOnGateHit?.(gateHit);
            return;
        }

        const imageHit = this.imageBreaker?.hitAtRect(attackRect, { direction: this.runnerState.direction });
        if (imageHit?.count > 0) {
            this.bumpStageStat('imagesDamaged', 1);
            this.impactBurstAt(imageHit.rect, imageHit.destroyed ? 'hard' : 'medium');
            this.spawnImageChips(imageHit.rect, this.runnerState.direction, imageHit.destroyed);
            this.shakeScreen(imageHit.destroyed ? 'hard' : 'medium');
            this.showMessage(imageHit.destroyed ? UI_TEXT.imageBreak : UI_TEXT.imageSpin, 1800);
            this.runnerOnImageHit?.(imageHit);
            return;
        }

        this.impactBurstAt(this.runnerHandRect(), 'soft');
        this.shakeScreen('soft');
        this.onRunnerSound('swing', { volume: 0.16, rate: 1.06 });
        this.showMessage(UI_TEXT.miss, 1200);
    }

    runnerChargedAttack(duration) {
        if (!this.runnerState) {
            return;
        }

        const now = currentTime();
        if (now < this.runnerState.attackLockedUntil) {
            return;
        }

        const full = duration >= CHARGE_FULL_MS;
        const damage = full ? 3 : 2;
        const intensity = full ? 'hard' : 'medium';
        this.runnerState.attackLockedUntil = now + (full ? 540 : 430);
        this.playRunnerStrike({ charged: true });

        const chargedRect = this.runnerChargedAttackRect(full);
        const enemyHit = this.hitEnemyAtRect(chargedRect, {
            minOverlap: 10,
            damage,
            intensity,
            charged: true,
        });
        if (enemyHit?.count > 0) {
            this.runnerOnEnemyHit?.(enemyHit);
            return;
        }

        const charBreak = this.textBreaker?.destroyAtRect(chargedRect, { limit: full ? 4 : 2, source: 'player' });
        if (charBreak?.count > 0) {
            this.bumpStageStat('playerBroken', charBreak.count);
            this.impactBurstAt(charBreak.rect, intensity);
            this.shakeScreen(full ? 'hard' : 'medium');
            this.runnerOnTextBreak?.(charBreak);
            if (this.criticalDestroyed(charBreak)) {
                this.failStage('critical_player_attack');
                return;
            }

            this.showMessage(UI_TEXT.chargeFull, 1400);
            return;
        }

        const gateHit = this.hitLinkGateAtRect(chargedRect);
        if (gateHit?.blocked) {
            this.impactBurstAt(gateHit.rect, 'soft');
            this.showMessage(UI_TEXT.gateNeedsTextBreak, 1300);
            return;
        }

        if (gateHit?.count > 0) {
            this.bumpStageStat('gatesBroken', 1);
            this.impactBurstAt(gateHit.rect, intensity);
            this.shakeScreen(full ? 'hard' : 'medium');
            this.showMessage(UI_TEXT.gateBreak, 1500);
            this.runnerOnGateHit?.(gateHit);
            return;
        }

        const imageHit = this.imageBreaker?.hitAtRect(chargedRect, { direction: this.runnerState.direction });
        if (imageHit?.count > 0) {
            this.bumpStageStat('imagesDamaged', 1);
            this.impactBurstAt(imageHit.rect, imageHit.destroyed || full ? 'hard' : 'medium');
            this.spawnImageChips(imageHit.rect, this.runnerState.direction, imageHit.destroyed || full);
            this.shakeScreen(full ? 'hard' : 'medium');
            this.showMessage(imageHit.destroyed ? UI_TEXT.imageBreak : UI_TEXT.imageSpin, 1800);
            this.runnerOnImageHit?.(imageHit);
            return;
        }

        this.impactBurstAt(this.runnerHandRect(), full ? 'medium' : 'soft');
        this.shakeScreen(full ? 'medium' : 'soft');
        this.onRunnerSound('swing', { volume: full ? 0.22 : 0.18, rate: full ? 0.9 : 0.98 });
        this.showMessage(UI_TEXT.miss, 1200);
    }

    runnerThrow() {
        if (!this.runnerState) {
            return;
        }

        const now = currentTime();
        if (now < this.runnerState.attackLockedUntil) {
            return;
        }

        this.runnerState.attackLockedUntil = now + 250;
        this.playRunnerStrike();

        if (this.activeEnemies().length > 0 && this.pickAndThrowAtLock({ autoLock: true })) {
            return;
        }

        this.impactBurstAt(this.runnerHandRect(), 'soft');
        this.onRunnerSound('swing', { volume: 0.12, rate: 1.08 });
        this.showMessage(UI_TEXT.noEnemy, 1000);
    }

    runnerAttackRect() {
        const frontLeft = this.runnerState.direction > 0
            ? this.runnerState.x + RUNNER_WIDTH + 2
            : this.runnerState.x - 38;
        const top = this.runnerState.y + RUNNER_HEIGHT - 10;

        return {
            left: frontLeft,
            top,
            width: 36,
            height: 52,
            right: frontLeft + 36,
            bottom: top + 52,
        };
    }

    runnerMeleeRect() {
        const reach = 62;
        const left = this.runnerState.direction > 0
            ? this.runnerState.x + RUNNER_WIDTH - 8
            : this.runnerState.x - reach + 8;
        const top = this.runnerState.y + 7;

        return {
            left,
            top,
            width: reach,
            height: RUNNER_HEIGHT - 2,
            right: left + reach,
            bottom: top + RUNNER_HEIGHT - 2,
        };
    }

    runnerChargedAttackRect(full = false) {
        const width = full ? 112 : 88;
        const left = this.runnerState.direction > 0
            ? this.runnerState.x + RUNNER_WIDTH - 12
            : this.runnerState.x - width + 12;
        const top = this.runnerState.y - (full ? 4 : 0);
        const height = RUNNER_HEIGHT + (full ? 20 : 10);

        return {
            left,
            top,
            width,
            height,
            right: left + width,
            bottom: top + height,
        };
    }

    runnerHandRect() {
        const left = this.runnerState.direction > 0
            ? this.runnerState.x + RUNNER_WIDTH - 6
            : this.runnerState.x - 20;
        const top = this.runnerState.y + 16;

        return {
            left,
            top,
            width: 28,
            height: 28,
            right: left + 28,
            bottom: top + 28,
        };
    }

    runnerShieldRect() {
        const width = 34;
        const left = this.runnerState.direction > 0
            ? this.runnerState.x + RUNNER_WIDTH - 3
            : this.runnerState.x - width + 3;
        const top = this.runnerState.y + 4;

        return {
            left,
            top,
            width,
            height: RUNNER_HEIGHT - 4,
            right: left + width,
            bottom: top + RUNNER_HEIGHT - 4,
        };
    }

    runnerPickupRect() {
        const runnerRect = this.runnerPhysicsRect();
        const left = runnerRect.left - 8;
        const top = runnerRect.bottom - 16;
        const width = runnerRect.width + 16;
        const height = 34;

        return {
            left,
            top,
            width,
            height,
            right: left + width,
            bottom: top + height,
        };
    }

    findRunnerStrikeTarget() {
        const attackRect = this.runnerAttackRect();
        let bestTarget = null;
        let bestScore = 0;

        for (const target of this.visibleRunnerTargets()) {
            const rect = liveRectForTarget(target);
            const overlap = rectOverlapArea(attackRect, rect);
            if (overlap <= 0) {
                continue;
            }

            const centerDistance = Math.abs((rect.left + rect.width / 2) - (attackRect.left + attackRect.width / 2));
            const score = overlap - centerDistance * 0.35 + runnerTargetPriority(target);

            if (score > bestScore) {
                bestScore = score;
                bestTarget = target;
            }
        }

        return bestTarget;
    }

    mountRunnerControls() {
        this.runnerControls = document.createElement('div');
        this.runnerControls.className = 'gw-player-controls';
        this.runnerControls.setAttribute('role', 'group');
        this.runnerControls.setAttribute('aria-label', 'Player controls');

        for (const { control, label, keys } of RUNNER_CONTROL_DEFS) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `gw-player-control gw-player-control--${control}`;
            button.dataset.gwControl = control;
            button.setAttribute('aria-label', `${label}: ${keys}`);
            button.title = `${label}: ${keys}`;
            button.innerHTML = `
                <span class="gw-player-control__label">${label}</span>
                <kbd class="gw-player-control__keys">${keys}</kbd>
            `;
            this.bindRunnerControlButton(button, control);
            this.runnerControls.appendChild(button);
        }

        this.root?.appendChild(this.runnerControls);
    }

    unmountRunnerControls() {
        this.runnerControls?.remove();
        this.runnerControls = null;
    }

    bindRunnerControlButton(button, control) {
        const activate = (event) => {
            event.preventDefault();
            button.classList.add('gw-player-control--active');
            this.releaseScrollPin();

            if (control === 'lock') {
                this.cycleLockOn();
                return;
            }

            if (control === 'throw') {
                this.runnerThrow();
                return;
            }

            if (control === 'attack') {
                const now = currentTime();
                if (now - this.lastAttackTapAt < 340) {
                    this.lastAttackTapAt = 0;
                    this.finishAttackCharge({ cancel: true });
                    this.runnerThrow();
                    return;
                }

                this.lastAttackTapAt = now;
                this.startAttackCharge('touch');
                return;
            }

            this.runnerKeys.add(control);
        };

        const release = (event) => {
            event.preventDefault();
            button.classList.remove('gw-player-control--active');

            if (control === 'attack') {
                this.finishAttackCharge();
                return;
            }

            if (control !== 'throw' && control !== 'lock') {
                this.runnerKeys.delete(control);
            }
        };

        button.addEventListener('pointerdown', activate);
        button.addEventListener('pointerup', release);
        button.addEventListener('pointercancel', release);
        button.addEventListener('pointerleave', release);
        button.addEventListener('click', (event) => event.preventDefault());
    }

    handleRunnerKeyDown(event) {
        if (this.isTypingTarget(event.target)) {
            return;
        }

        if (isBlockedDownKey(event.key)) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        const control = keyToRunnerControl(event.key);
        if (!control) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        this.releaseScrollPin();

        if (control === 'lock') {
            this.cycleLockOn();
            return;
        }

        if (control === 'throw') {
            this.runnerThrow();
            return;
        }

        if (control === 'attack') {
            if (!event.repeat) {
                this.startAttackCharge('keyboard');
            }
            return;
        }

        this.runnerKeys.add(control);
    }

    handleRunnerKeyUp(event) {
        if (isBlockedDownKey(event.key)) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        const control = keyToRunnerControl(event.key);
        if (!control) {
            return;
        }

        event.preventDefault();

        if (control === 'attack') {
            event.stopPropagation();
            this.finishAttackCharge();
            return;
        }

        if (control === 'throw' || control === 'lock') {
            return;
        }

        this.runnerKeys.delete(control);
    }

    isTypingTarget(target) {
        return target instanceof HTMLInputElement
            || target instanceof HTMLTextAreaElement
            || target instanceof HTMLSelectElement
            || (target instanceof HTMLElement && target.isContentEditable);
    }

    runnerStrikeText(target) {
        this.shatterText(target, { runner: true });
        this.impactBurstAt(liveRectForTarget(target), 'hard');
        this.shakeScreen('hard');
        this.showMessage(UI_TEXT.runnerBreak, 2200);
    }

    shakeHeading(target) {
        const rect = liveRectForTarget(target);
        const sourceStyle = window.getComputedStyle(target.element);
        const echo = document.createElement('div');
        echo.className = 'gw-heading-echo';
        echo.textContent = target.text || target.element.textContent || UI_TEXT.headingFallback;
        placeBox(echo, rect);
        echo.style.font = sourceStyle.font;
        echo.style.letterSpacing = sourceStyle.letterSpacing;
        echo.style.color = sourceStyle.color;
        echo.style.textAlign = sourceStyle.textAlign;
        this.addTemporaryEffect(echo, 800);
        this.shatterText(target, { soft: true });
        this.impactBurstAt(rect, 'medium');
        this.shakeScreen('soft');
        this.showMessage(UI_TEXT.headingShake);
    }

    shatterText(target, options = {}) {
        const rect = liveRectForTarget(target);
        const sourceStyle = window.getComputedStyle(target.element);
        const text = normalizeText(target.text || target.element.textContent || '');

        if (!text || rect.width < 8 || rect.height < 8) {
            return;
        }

        const burst = document.createElement('div');
        burst.className = `gw-text-burst${options.runner ? ' gw-text-burst--runner' : ''}${options.soft ? ' gw-text-burst--soft' : ''}`;
        placeBox(burst, rect);
        burst.style.font = sourceStyle.font;
        burst.style.lineHeight = sourceStyle.lineHeight;
        burst.style.letterSpacing = sourceStyle.letterSpacing;
        burst.style.color = sourceStyle.color;
        burst.style.textAlign = sourceStyle.textAlign;

        const chars = Array.from(text.slice(0, target.type === 'paragraph' ? 140 : 84));
        for (const char of chars) {
            const shard = document.createElement('span');
            shard.className = 'gw-text-shard';
            shard.textContent = char === ' ' ? '\u00a0' : char;
            shard.style.setProperty('--gw-x', `${randomBetween(-86, 86)}px`);
            shard.style.setProperty('--gw-y', `${randomBetween(-132, 64)}px`);
            shard.style.setProperty('--gw-r', `${randomBetween(-48, 48)}deg`);
            shard.style.setProperty('--gw-d', `${randomBetween(0, 120)}ms`);
            burst.appendChild(shard);
        }

        this.addTemporaryEffect(burst, options.runner ? 1350 : 1050);
    }

    impactBurstAt(rect, intensity = 'medium') {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + Math.min(rect.height / 2, 64);
        const ring = document.createElement('span');
        ring.className = `gw-impact-ring gw-impact-ring--${intensity}`;
        ring.style.left = `${centerX}px`;
        ring.style.top = `${centerY}px`;
        this.addTemporaryEffect(ring, 620);

        const debrisCount = intensity === 'hard' ? 22 : (intensity === 'char' ? 8 : 12);
        for (let index = 0; index < debrisCount; index += 1) {
            const debris = document.createElement('span');
            debris.className = `gw-pixel-debris gw-pixel-debris--${index % 3}`;
            debris.style.left = `${centerX + randomBetween(-16, 16)}px`;
            debris.style.top = `${centerY + randomBetween(-14, 14)}px`;
            debris.style.setProperty('--gw-x', `${randomBetween(-150, 150)}px`);
            debris.style.setProperty('--gw-y', `${randomBetween(-130, 78)}px`);
            debris.style.setProperty('--gw-r', `${randomBetween(-180, 180)}deg`);
            debris.style.setProperty('--gw-d', `${randomBetween(0, 80)}ms`);
            this.addTemporaryEffect(debris, 780);
        }

        if (intensity === 'hard') {
            const flash = document.createElement('span');
            flash.className = 'gw-impact-flash';
            this.addTemporaryEffect(flash, 180);
        }
    }

    shakeScreen(strength = 'medium') {
        if (this.reducedMotion) {
            return;
        }

        const strengthClass = `gw-screen-shake--${strength}`;
        document.body.classList.remove('gw-screen-shake', 'gw-screen-shake--soft', 'gw-screen-shake--medium', 'gw-screen-shake--hard');
        document.body.classList.add('gw-screen-shake', strengthClass);

        const timer = window.setTimeout(() => {
            document.body.classList.remove('gw-screen-shake', strengthClass);
            this.timers.delete(timer);
        }, strength === 'hard' ? 390 : 260);

        this.timers.add(timer);
    }

    crackImage(target) {
        const imageHit = this.imageBreaker?.hitTarget(target, { direction: Math.random() > 0.5 ? 1 : -1 });
        const rect = imageHit?.rect || liveRectForTarget(target);
        const field = document.createElement('div');
        field.className = 'gw-crack-field';
        placeBox(field, rect);

        for (let index = 0; index < 7; index += 1) {
            const line = document.createElement('span');
            line.className = 'gw-crack-line';
            line.style.left = `${20 + Math.random() * 60}%`;
            line.style.top = `${18 + Math.random() * 58}%`;
            line.style.width = `${24 + Math.random() * 68}px`;
            line.style.transform = `rotate(${Math.random() * 140 - 70}deg)`;
            field.appendChild(line);
        }

        for (let index = 0; index < 12; index += 1) {
            const particle = document.createElement('span');
            particle.className = 'gw-spark-particle';
            particle.style.left = `${35 + Math.random() * 30}%`;
            particle.style.top = `${35 + Math.random() * 30}%`;
            particle.style.setProperty('--gw-x', `${Math.random() * 90 - 45}px`);
            particle.style.setProperty('--gw-y', `${Math.random() * 90 - 45}px`);
            field.appendChild(particle);
        }

        this.addTemporaryEffect(field, 900);
        this.impactBurstAt(rect, imageHit?.destroyed ? 'hard' : 'medium');
        this.spawnImageChips(rect, imageHit?.target ? (imageHit.stage % 2 === 0 ? -1 : 1) : 1, Boolean(imageHit?.destroyed));
        this.shakeScreen(imageHit?.destroyed ? 'hard' : 'medium');
        this.showMessage(imageHit?.destroyed ? UI_TEXT.imageBreak : UI_TEXT.imageCrack);
    }

    spawnImageChips(rect, direction = 1, destroyed = false) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const chipCount = destroyed ? 18 : 9;

        for (let index = 0; index < chipCount; index += 1) {
            const chip = document.createElement('span');
            chip.className = `gw-image-chip gw-image-chip--${index % 4}`;
            chip.style.left = `${centerX + randomBetween(-rect.width * 0.18, rect.width * 0.18)}px`;
            chip.style.top = `${centerY + randomBetween(-rect.height * 0.18, rect.height * 0.18)}px`;
            chip.style.setProperty('--gw-x', `${direction * randomBetween(28, 120) + randomBetween(-42, 42)}px`);
            chip.style.setProperty('--gw-y', `${randomBetween(-110, 76)}px`);
            chip.style.setProperty('--gw-r', `${randomBetween(-210, 210)}deg`);
            chip.style.setProperty('--gw-d', `${randomBetween(0, 90)}ms`);
            this.addTemporaryEffect(chip, destroyed ? 940 : 720);
        }
    }

    spawnWordFragments(words, target, onCollect) {
        const rect = liveRectForTarget(target);
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + Math.min(rect.height / 2, 80);

        this.shatterText(target, { soft: true });
        this.impactBurstAt(rect, 'soft');

        words.forEach((word, index) => {
            const fragment = document.createElement('button');
            fragment.type = 'button';
            fragment.className = 'gw-word-fragment';
            fragment.textContent = word;
            fragment.style.left = `${centerX + (Math.random() * 120 - 60)}px`;
            fragment.style.top = `${centerY + (index * 12) + (Math.random() * 24 - 12)}px`;
            fragment.style.setProperty('--gw-float-x', `${Math.random() * 120 - 60}px`);
            fragment.style.setProperty('--gw-float-y', `${-50 - Math.random() * 70}px`);
            fragment.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                onCollect(word);
                fragment.classList.add('gw-word-fragment--collected');
                this.removeLater(fragment, 260);
            });
            this.effectLayer?.appendChild(fragment);
            this.removeLater(fragment, 7600);
        });

        this.showMessage(this.messages.hint || UI_TEXT.hint);
    }

    bumpAction(target) {
        const rect = liveRectForTarget(target);
        const label = document.createElement('div');
        label.className = 'gw-action-echo';
        label.textContent = target.text || UI_TEXT.actionFallback;
        label.style.left = `${rect.left + rect.width / 2}px`;
        label.style.top = `${rect.top + rect.height / 2}px`;
        this.addTemporaryEffect(label, 700);
        this.shatterText(target, { soft: true });
        this.impactBurstAt(rect, 'medium');
        this.shakeScreen('soft');
        this.showMessage(UI_TEXT.actionHop);
    }

    brighten(target) {
        const rect = liveRectForTarget(target);
        const glow = document.createElement('div');
        glow.className = 'gw-soft-glow';
        placeBox(glow, rect);
        this.addTemporaryEffect(glow, 850);
        this.impactBurstAt(rect, 'soft');
        this.showMessage(UI_TEXT.brighten);
    }

    addTemporaryEffect(element, lifetime) {
        this.effectLayer?.appendChild(element);
        this.removeLater(element, this.reducedMotion ? Math.min(lifetime, 260) : lifetime);
    }

    removeLater(element, lifetime) {
        const timer = window.setTimeout(() => {
            element.remove();
            this.timers.delete(timer);
        }, lifetime);

        this.timers.add(timer);
    }
}

function placeBox(element, rect) {
    element.style.left = `${rect.left}px`;
    element.style.top = `${rect.top}px`;
    element.style.width = `${rect.width}px`;
    element.style.height = `${rect.height}px`;
}

function normalizeText(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
}

function splitSummarySentences(text) {
    const normalized = normalizeText(text);
    if (!normalized) {
        return [];
    }

    const matches = normalized.match(/[^。！？!?]+[。！？!?]?/g) || [normalized];
    return matches
        .map((sentence) => normalizeText(sentence).slice(0, 120))
        .filter(Boolean);
}

function createStageStats(totalChars = 0) {
    return {
        totalChars,
        playerBroken: 0,
        enemyBroken: 0,
        enemiesDefeated: 0,
        gatesBroken: 0,
        imagesDamaged: 0,
    };
}

function renderLifeHearts(life = 0) {
    const filled = Math.max(0, Math.min(PLAYER_MAX_LIFE, Math.round(life)));
    const empty = Math.max(0, PLAYER_MAX_LIFE - filled);
    return `${'\u2665'.repeat(filled)}${'\u2661'.repeat(empty)}`;
}

function runnerGroundY() {
    return Math.max(72, window.innerHeight - 118);
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function lerp(start, end, progress) {
    return start + (end - start) * progress;
}

function easeInOut(value) {
    return value < 0.5
        ? 4 * value * value * value
        : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function isNearPageBottom() {
    const scrollMax = Math.max(1, maxPageScrollY());

    return window.scrollY >= scrollMax - 120;
}

function maxPageScrollY() {
    return Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
        document.body.scrollHeight - window.innerHeight
    );
}

function normalizeUrl(url) {
    try {
        const parsed = new URL(url, window.location.href);
        parsed.hash = '';
        parsed.searchParams.delete('gwv');
        return parsed.href.replace(/\/$/, '');
    } catch (error) {
        return String(url || '').split('#')[0].replace(/\/$/, '');
    }
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
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

function requestFrame(callback) {
    if (typeof window.requestAnimationFrame === 'function' && typeof window.setTimeout === 'function') {
        let settled = false;
        let rafId = 0;
        const timerId = window.setTimeout(() => {
            if (settled) {
                return;
            }

            settled = true;
            if (rafId && typeof window.cancelAnimationFrame === 'function') {
                window.cancelAnimationFrame(rafId);
            }
            callback(currentTime());
        }, 48);

        rafId = window.requestAnimationFrame((time) => {
            if (settled) {
                return;
            }

            settled = true;
            window.clearTimeout(timerId);
            callback(time || currentTime());
        });

        return {
            type: 'hybrid',
            rafId,
            timerId,
        };
    }

    if (typeof window.requestAnimationFrame === 'function') {
        return {
            type: 'raf',
            id: window.requestAnimationFrame(callback),
        };
    }

    return {
        type: 'timer',
        id: window.setTimeout(() => callback(currentTime()), 16),
    };
}

function cancelFrame(frame) {
    if (!frame) {
        return;
    }

    if (frame.type === 'hybrid') {
        if (frame.rafId && typeof window.cancelAnimationFrame === 'function') {
            window.cancelAnimationFrame(frame.rafId);
        }
        window.clearTimeout(frame.timerId);
        return;
    }

    if (frame.type === 'raf' && typeof window.cancelAnimationFrame === 'function') {
        window.cancelAnimationFrame(frame.id);
        return;
    }

    window.clearTimeout(frame.id);
}

function pageScrollProgress() {
    const scrollMax = Math.max(1, maxPageScrollY());

    return clamp(window.scrollY / scrollMax, 0, 1);
}

function firstLandingY(...values) {
    const usable = values.filter((value) => value !== null && value !== undefined);
    if (usable.length === 0) {
        return null;
    }

    return Math.min(...usable);
}

function keyToRunnerControl(key) {
    const normalized = String(key || '').toLowerCase();

    if (normalized === 'arrowleft' || normalized === 'a') {
        return 'left';
    }

    if (normalized === 'arrowright' || normalized === 'd') {
        return 'right';
    }

    if (normalized === 'arrowup' || normalized === 'w') {
        return 'jump';
    }

    if (normalized === 'tab' || normalized === 't') {
        return 'lock';
    }

    if (normalized === 'shift' || normalized === 'e') {
        return 'shield';
    }

    if (normalized === 'x') {
        return 'throw';
    }

    if (normalized === ' ' || normalized === 'spacebar' || normalized === 'z' || normalized === 'enter') {
        return 'attack';
    }

    return '';
}

function isBlockedDownKey(key) {
    const normalized = String(key || '').toLowerCase();
    return normalized === 'arrowdown' || normalized === 's';
}

function rectOverlapArea(first, second) {
    const left = Math.max(first.left, second.left);
    const right = Math.min(first.right, second.right);
    const top = Math.max(first.top, second.top);
    const bottom = Math.min(first.bottom, second.bottom);

    if (right <= left || bottom <= top) {
        return 0;
    }

    return (right - left) * (bottom - top);
}

function enemyAimScore(enemy, x, y, facing = 1) {
    const rect = {
        left: enemy.x,
        top: enemy.y,
        width: enemy.width,
        height: enemy.height,
        right: enemy.x + enemy.width,
        bottom: enemy.y + enemy.height,
    };
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const behindPenalty = (centerX - x) * facing < -16 ? 620 : 0;
    const bossBonus = enemy.type === 'boss' ? -80 : 0;

    return Math.hypot(centerX - x, centerY - y) + behindPenalty + bossBonus;
}

function wordPowerForHeldLetter(held) {
    const fontSize = parseFloat(held.style?.fontSize || '') || 16;
    const visualSize = Math.max(fontSize, held.width || 0, held.height || 0);

    if (visualSize >= 48) {
        return {
            name: 'large',
            damage: 3,
            intensity: 'hard',
            hitboxBonus: 32,
            hitboxMin: 58,
            throwVolume: 0.34,
            rate: 0.94,
        };
    }

    if (visualSize >= 28) {
        return {
            name: 'medium',
            damage: 2,
            intensity: 'medium',
            hitboxBonus: 24,
            hitboxMin: 44,
            throwVolume: 0.28,
            rate: 1,
        };
    }

    return {
        name: 'small',
        damage: 1,
        intensity: 'soft',
        hitboxBonus: 16,
        hitboxMin: 30,
        throwVolume: 0.22,
        rate: 1.08,
    };
}

function runnerTargetPriority(target) {
    if (target.type === 'heading') {
        return 90000;
    }

    if (target.type === 'paragraph') {
        return 70000;
    }

    if (target.type === 'action') {
        return 32000;
    }

    return 0;
}

function isInternalLinkGate(element) {
    if (!(element instanceof HTMLAnchorElement) || !element.href) {
        return false;
    }

    const url = new URL(element.href, window.location.href);
    if (url.origin !== window.location.origin) {
        return false;
    }

    if (url.href === window.location.href || url.href === `${window.location.href}#`) {
        return false;
    }

    return true;
}

function isPlayableContentElement(element) {
    if (!(element instanceof Element)) {
        return false;
    }

    if (element.closest('header,footer,nav')) {
        return false;
    }

    return Boolean(element.closest('.gw-demo-content,.entry-content,main,article'));
}



