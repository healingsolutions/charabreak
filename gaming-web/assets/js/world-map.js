const DEFAULT_TEXT = {
    eyebrow: 'WORLD MAP',
    title: 'CharaBreak World',
    goal: 'Final Gate',
    subtitle: 'Each page is a stage. Clear the route and unlock the reward.',
    current: 'Current',
    cleared: 'Cleared',
    available: 'Open',
    locked: 'Locked',
    reward: 'Reward',
    unknownReward: '???',
    progress: 'Route progress',
    start: 'Start stage',
    resume: 'Back to stage',
    enter: 'Enter',
    close: 'Close',
    finalLocked: 'Clear more stages to open the final gate.',
    finalReady: 'The final gate is open.',
    clearNeed: '{count} clear(s) to final gate',
    modeStart: 'Choose your path before entering the page.',
    modeHud: 'Pause, look at the whole field, then jump back in.',
    modeClear: 'A new route lit up.',
};

const JA_TEXT = {
    eyebrow: 'WORLD MAP',
    title: 'CharaBreak World',
    goal: '\u6700\u7d42\u30b2\u30fc\u30c8',
    subtitle: '\u30da\u30fc\u30b8\u3054\u3068\u306b\u500b\u6027\u304c\u3042\u308b\u30b9\u30c6\u30fc\u30b8\u3002\u30eb\u30fc\u30c8\u3092\u30af\u30ea\u30a2\u3057\u3066\u7279\u5178\u3078\u9032\u3082\u3046\u3002',
    current: '\u73fe\u5728\u5730',
    cleared: '\u30af\u30ea\u30a2',
    available: '\u9032\u884c\u53ef',
    locked: 'LOCKED',
    reward: '\u7279\u5178',
    unknownReward: '???',
    progress: '\u30eb\u30fc\u30c8\u9032\u884c',
    start: '\u3053\u306e\u30b9\u30c6\u30fc\u30b8\u3078',
    resume: '\u30b9\u30c6\u30fc\u30b8\u306b\u623b\u308b',
    enter: '\u5165\u308b',
    close: '\u9589\u3058\u308b',
    finalLocked: '\u3082\u3046\u5c11\u3057\u30af\u30ea\u30a2\u3059\u308b\u3068\u6700\u7d42\u30b2\u30fc\u30c8\u304c\u958b\u304f\u3002',
    finalReady: '\u6700\u7d42\u30b2\u30fc\u30c8\u304c\u958b\u3044\u305f\u3002',
    clearNeed: '\u6700\u7d42\u30b2\u30fc\u30c8\u307e\u3067\u3042\u3068{count}\u30b9\u30c6\u30fc\u30b8',
    modeStart: '\u30da\u30fc\u30b8\u306b\u5165\u308b\u524d\u306b\u3001\u5192\u967a\u306e\u5168\u4f53\u50cf\u3092\u898b\u3088\u3046\u3002',
    modeHud: '\u4e00\u5ea6\u5730\u56f3\u3092\u958b\u3044\u3066\u3001\u4eca\u306e\u4f4d\u7f6e\u3068\u6b21\u306e\u30b4\u30fc\u30eb\u3092\u78ba\u8a8d\u3002',
    modeClear: '\u65b0\u3057\u3044\u30eb\u30fc\u30c8\u304c\u5149\u3063\u305f\u3002',
};

export class GamingWebWorldMap {
    constructor(config = {}, options = {}) {
        this.config = normalizeConfig(config);
        this.text = localizedText(config.locale || '');
        this.onStart = options.onStart || (() => {});
        this.onNavigate = options.onNavigate || ((href) => {
            window.location.href = href;
        });
        this.isGameActive = options.isGameActive || (() => false);
        this.onSound = options.onSound || (() => {});
        this.root = null;
        this.progress = readProgress(this.config.progressKey);
    }

    isEnabled() {
        return Boolean(this.config.enabled && this.config.stages.length > 0);
    }

    open(options = {}) {
        if (!this.isEnabled()) {
            if (typeof options.onStart === 'function') {
                options.onStart();
            }
            return;
        }

        this.close();
        const mode = options.mode || 'browse';
        const active = this.isGameActive();
        const currentStage = this.currentStage();
        const clearedCount = this.clearedCount();
        const requiredCount = this.requiredClearCount();
        const remaining = Math.max(0, requiredCount - clearedCount);
        const layout = this.stageLayout();
        const routePoints = layout.map((item) => `${item.x},${item.y}`).join(' ');
        const finalReady = remaining === 0;
        const statusText = finalReady
            ? this.text.finalReady
            : this.text.clearNeed.replace('{count}', String(remaining));

        this.root = document.createElement('section');
        this.root.className = `gw-world-map gw-world-map--${escapeAttribute(mode)}`;
        this.root.setAttribute('role', 'dialog');
        this.root.setAttribute('aria-modal', 'true');
        this.root.setAttribute('aria-label', this.config.title || this.text.title);
        this.root.innerHTML = `
            <div class="gw-world-map__panel">
                <header class="gw-world-map__header">
                    <div>
                        <span class="gw-world-map__eyebrow">${escapeHtml(this.text.eyebrow)}</span>
                        <h2>${escapeHtml(this.config.title || this.text.title)}</h2>
                        <p>${escapeHtml(this.modeLead(mode))}</p>
                    </div>
                    <button type="button" class="gw-world-map__close" aria-label="${escapeAttribute(this.text.close)}">${escapeHtml(this.text.close)}</button>
                </header>
                <div class="gw-world-map__body">
                    <div class="gw-world-map__field" aria-label="${escapeAttribute(this.config.title || this.text.title)}">
                        <div class="gw-world-map__grid" aria-hidden="true"></div>
                        <svg class="gw-world-map__paths" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                            <polyline class="gw-world-map__path gw-world-map__path--shadow" points="${escapeAttribute(routePoints)}"></polyline>
                            <polyline class="gw-world-map__path" points="${escapeAttribute(routePoints)}"></polyline>
                        </svg>
                        ${layout.map((item) => this.renderStageNode(item)).join('')}
                        <div class="gw-world-map__final ${finalReady ? 'gw-world-map__final--ready' : ''}">
                            <span>${escapeHtml(this.config.goalLabel || this.text.goal)}</span>
                            <strong>${finalReady ? 'OPEN' : 'LOCK'}</strong>
                        </div>
                    </div>
                    <aside class="gw-world-map__status">
                        <span class="gw-world-map__status-kicker">${escapeHtml(this.text.progress)}</span>
                        <strong>${clearedCount}/${requiredCount}</strong>
                        <p>${escapeHtml(statusText)}</p>
                        ${currentStage ? this.renderCurrentCard(currentStage) : ''}
                    </aside>
                </div>
                <footer class="gw-world-map__actions">
                    <button type="button" class="gw-world-map__primary" data-gw-world-start>${escapeHtml(active ? this.text.resume : this.text.start)}</button>
                    <button type="button" class="gw-world-map__secondary gw-world-map__close">${escapeHtml(this.text.close)}</button>
                </footer>
            </div>
        `;

        this.root.addEventListener('click', (event) => this.handleClick(event, options));
        document.body.appendChild(this.root);
        document.body.classList.add('gw-world-map-open');
        this.onSound('uiOpen', { volume: 0.12 });
        this.root.querySelector('[data-gw-world-start], .gw-world-map__close')?.focus?.({ preventScroll: true });
    }

    close() {
        if (!this.root) {
            return;
        }

        this.root.remove();
        this.root = null;
        document.body.classList.remove('gw-world-map-open');
    }

    markStageCleared(detail = {}, response = null) {
        if (!this.isEnabled() || detail.failed || detail.critical_lost) {
            return;
        }

        const stageId = this.config.currentStageId;
        if (!stageId) {
            return;
        }

        const reward = response?.reward_unlocked ? normalizeReward(response.reward) : null;
        this.progress.cleared[stageId] = {
            at: Date.now(),
            treasure: String(detail.treasure_word || ''),
            broken: Number(detail.player_broken_count || 0),
            defeated: Number(detail.enemy_defeated_count || 0),
        };
        if (reward) {
            this.progress.rewards[stageId] = reward;
        }
        this.progress.lastStageId = stageId;
        writeProgress(this.config.progressKey, this.progress);

        if (this.root) {
            this.open({ mode: 'clear' });
        }
    }

    currentStage() {
        return this.config.stages.find((stage) => stage.id === this.config.currentStageId) || this.config.stages[0] || null;
    }

    clearedCount() {
        return this.config.stages.filter((stage) => Boolean(this.progress.cleared[stage.id])).length;
    }

    requiredClearCount() {
        const configured = Number(this.config.requiredClearCount || 0);
        if (configured <= 0) {
            return this.config.stages.length;
        }

        return Math.min(configured, this.config.stages.length);
    }

    stageStatus(stage, index) {
        if (!stage) {
            return 'locked';
        }

        if (this.progress.cleared[stage.id]) {
            return 'cleared';
        }

        if (stage.id === this.config.currentStageId) {
            return 'current';
        }

        const previous = index > 0 ? this.config.stages[index - 1] : null;
        const previousCleared = !previous || Boolean(this.progress.cleared[previous.id]);
        if (stage.type === 'final' && this.clearedCount() < this.requiredClearCount()) {
            return 'locked';
        }

        return previousCleared || index === 0 ? 'available' : 'locked';
    }

    stageLayout() {
        const count = Math.max(1, this.config.stages.length);
        const yPattern = [72, 54, 60, 38, 48, 28, 42, 64];
        return this.config.stages.map((stage, index) => {
            const x = count === 1 ? 50 : 9 + (82 * index) / (count - 1);
            const y = yPattern[index % yPattern.length];
            return {
                stage,
                index,
                status: this.stageStatus(stage, index),
                x,
                y,
            };
        });
    }

    renderStageNode(item) {
        const stage = item.stage;
        const status = item.status;
        const rewardLabel = this.rewardLabel(stage);
        const disabled = status === 'locked' ? ' disabled aria-disabled="true"' : '';
        const icon = stageIcon(stage, item.index);
        const style = `--gw-map-x: ${item.x}%; --gw-map-y: ${item.y}%;`;

        return `
            <button type="button" class="gw-world-map__node gw-world-map__node--${escapeAttribute(status)} gw-world-map__node--${escapeAttribute(stage.type)}" style="${escapeAttribute(style)}" data-gw-world-stage="${escapeAttribute(stage.id)}"${disabled}>
                <span class="gw-world-map__node-icon">${escapeHtml(icon)}</span>
                <span class="gw-world-map__node-label">${escapeHtml(stage.label)}</span>
                <small>${escapeHtml(this.statusLabel(status))}</small>
                ${rewardLabel ? `<em>${escapeHtml(rewardLabel)}</em>` : ''}
            </button>
        `;
    }

    renderCurrentCard(stage) {
        const rewardLabel = this.rewardLabel(stage) || this.text.unknownReward;
        return `
            <div class="gw-world-map__current">
                <span>${escapeHtml(this.text.current)}</span>
                <strong>${escapeHtml(stage.label)}</strong>
                <p>${escapeHtml(this.text.reward)}: ${escapeHtml(rewardLabel)}</p>
            </div>
        `;
    }

    rewardLabel(stage) {
        if (!stage) {
            return '';
        }

        const savedReward = this.progress.rewards[stage.id];
        if (savedReward?.coupon_code) {
            return savedReward.coupon_code;
        }
        if (savedReward?.title) {
            return savedReward.title;
        }
        if (stage.rewardLabel) {
            return stage.rewardLabel;
        }

        return stage.hasReward ? this.text.unknownReward : '';
    }

    statusLabel(status) {
        return this.text[status] || status;
    }

    modeLead(mode) {
        if (mode === 'start') {
            return this.text.modeStart;
        }
        if (mode === 'hud') {
            return this.text.modeHud;
        }
        if (mode === 'clear') {
            return this.text.modeClear;
        }

        return this.text.subtitle;
    }

    handleClick(event, options) {
        const close = event.target.closest('.gw-world-map__close');
        if (close) {
            event.preventDefault();
            this.close();
            return;
        }

        const start = event.target.closest('[data-gw-world-start]');
        if (start) {
            event.preventDefault();
            this.close();
            const startHandler = options.onStart || this.onStart;
            startHandler();
            return;
        }

        const stageButton = event.target.closest('[data-gw-world-stage]');
        if (!stageButton) {
            return;
        }

        event.preventDefault();
        const stage = this.config.stages.find((item) => item.id === stageButton.dataset.gwWorldStage);
        const index = this.config.stages.indexOf(stage);
        const status = this.stageStatus(stage, index);
        if (!stage || status === 'locked') {
            this.flashLocked(stageButton);
            return;
        }

        if (stage.id === this.config.currentStageId) {
            this.close();
            if (!this.isGameActive()) {
                const startHandler = options.onStart || this.onStart;
                startHandler();
            }
            return;
        }

        this.progress.lastStageId = stage.id;
        writeProgress(this.config.progressKey, this.progress);
        this.close();
        this.onNavigate(stage.url, { resume: true, source: 'world_map' });
    }

    flashLocked(button) {
        button?.classList.add('gw-world-map__node--shake');
        window.setTimeout(() => button?.classList.remove('gw-world-map__node--shake'), 360);
        this.onSound('uiCancel', { volume: 0.1 });
    }
}

function normalizeConfig(config) {
    const world = config.worldMap && typeof config.worldMap === 'object' ? config.worldMap : {};
    const stages = Array.isArray(world.stages) ? world.stages : [];

    return {
        enabled: isTruthy(world.enabled),
        title: String(world.title || ''),
        goalLabel: String(world.goalLabel || ''),
        currentStageId: String(world.currentStageId || ''),
        progressKey: String(world.progressKey || 'gaming_web_world_progress_v1'),
        requiredClearCount: Number(world.requiredClearCount || 0),
        showOnStart: isTruthy(world.showOnStart),
        showInHud: isTruthy(world.showInHud),
        showAfterClear: isTruthy(world.showAfterClear),
        locale: String(config.locale || ''),
        stages: stages
            .filter((stage) => stage && typeof stage === 'object' && stage.id && stage.url)
            .map((stage, index) => ({
                id: String(stage.id),
                pageId: Number(stage.pageId || 0),
                label: String(stage.label || stage.stageName || stage.title || `Stage ${index + 1}`),
                title: String(stage.title || ''),
                stageName: String(stage.stageName || ''),
                url: String(stage.url || ''),
                type: normalizeStageType(stage.type),
                order: Number(stage.order || 0),
                hasReward: isTruthy(stage.hasReward),
                rewardLabel: String(stage.rewardLabel || ''),
                index,
            })),
    };
}

function localizedText(locale) {
    return String(locale).toLowerCase().startsWith('ja')
        ? { ...DEFAULT_TEXT, ...JA_TEXT }
        : DEFAULT_TEXT;
}

function normalizeStageType(type) {
    const value = String(type || 'normal');
    return ['normal', 'reward', 'boss', 'final'].includes(value) ? value : 'normal';
}

function normalizeReward(reward) {
    if (!reward || typeof reward !== 'object') {
        return null;
    }

    return {
        title: String(reward.title || ''),
        coupon_code: String(reward.coupon_code || ''),
        reward_url: String(reward.reward_url || ''),
    };
}

function readProgress(key) {
    try {
        const parsed = JSON.parse(window.localStorage.getItem(key) || '{}');
        return {
            cleared: parsed && typeof parsed.cleared === 'object' ? parsed.cleared : {},
            rewards: parsed && typeof parsed.rewards === 'object' ? parsed.rewards : {},
            lastStageId: String(parsed?.lastStageId || ''),
        };
    } catch (error) {
        return { cleared: {}, rewards: {}, lastStageId: '' };
    }
}

function writeProgress(key, progress) {
    try {
        window.localStorage.setItem(key, JSON.stringify(progress));
    } catch (error) {
        // Progress is cosmetic for this MVP; gameplay must continue without storage.
    }
}

function stageIcon(stage, index) {
    if (stage.type === 'final') {
        return '\u2691';
    }
    if (stage.type === 'boss') {
        return '\u26a0';
    }
    if (stage.type === 'reward' || stage.hasReward) {
        return '\u25c8';
    }

    return index === 0 ? '\u25b6' : '\u25cf';
}

function isTruthy(value) {
    return value === true || value === 1 || value === '1' || value === 'true';
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#096;');
}
