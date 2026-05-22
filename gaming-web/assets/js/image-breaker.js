import { isGameIgnoredElement } from './dom-scanner.js?v=0.2.28';

const IMAGE_TYPES = new Set(['image', 'icon', 'platform', 'action']);
const IMAGE_BREAK_STAGE = 5;
const IMAGE_MAX_VISUAL_STAGE = 4;
const IMAGE_DESTROY_SUPPORT_MS = 12000;
const IMAGE_SUPPORT_MIN_OVERLAP = 22;
const IMAGE_SUPPORT_TOLERANCE = 18;

export class ImageBreaker {
    constructor() {
        this.records = new Map();
        this.timers = new Set();
        this.prepared = false;
    }

    prepare(targets = []) {
        if (this.prepared) {
            return;
        }

        for (const target of targets) {
            if (!IMAGE_TYPES.has(target.type) || !(target.element instanceof Element)) {
                continue;
            }

            if (target.type === 'image' && !isPlayableImage(target.element)) {
                continue;
            }

            if (target.type === 'icon' && !isPlayableIcon(target.element)) {
                continue;
            }

            if (target.type === 'platform' && !isPlayablePlatform(target.element)) {
                continue;
            }

            if (target.type === 'action' && !isPlayableActionSupport(target.element)) {
                continue;
            }

            if (target.type === 'icon' && target.element.parentElement?.closest('.gw-icon-breakable')) {
                continue;
            }

            this.ensureRecord(target);
        }

        this.prepared = true;
    }

    restore() {
        for (const timer of this.timers) {
            window.clearTimeout(timer);
        }

        this.timers.clear();

        for (const record of this.records.values()) {
            restoreAttribute(record.element, 'class', record.classAttribute);

            if (record.styleAttribute === null) {
                record.element.removeAttribute('style');
            } else {
                record.element.setAttribute('style', record.styleAttribute);
            }
        }

        this.records.clear();
        this.prepared = false;
    }

    hitTarget(target, options = {}) {
        if (!target || !IMAGE_TYPES.has(target.type) || !(target.element instanceof Element)) {
            return emptyHit();
        }

        const record = this.ensureRecord(target);
        return this.applyHit(record, options);
    }

    hitAtRect(rect, options = {}) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        let best = null;

        for (const record of this.records.values()) {
            if (!canHit(record) || !record.element.isConnected) {
                continue;
            }

            const imageRect = record.element.getBoundingClientRect();
            if (imageRect.width < 8 || imageRect.height < 8) {
                continue;
            }

            const overlap = rectOverlapArea(rect, imageRect);
            if (overlap <= 0) {
                continue;
            }

            const imageCenterX = imageRect.left + imageRect.width / 2;
            const imageCenterY = imageRect.top + imageRect.height / 2;
            const distance = Math.hypot(centerX - imageCenterX, (centerY - imageCenterY) * 0.72);
            const score = overlap - distance * 0.28;

            if (!best || score > best.score) {
                best = { record, score };
            }
        }

        if (!best) {
            return emptyHit();
        }

        return this.applyHit(best.record, options);
    }

    findLandingY(runnerRect, previousBottom, nextBottom) {
        let landingY = null;

        for (const record of this.records.values()) {
            if ((!canSupport(record)) || !record.element.isConnected) {
                continue;
            }

            const surface = supportSurfaceForRunner(record, runnerRect);
            if (!surface) {
                continue;
            }

            if (surface.y >= previousBottom - 5 && surface.y <= nextBottom + 12) {
                landingY = landingY === null ? surface.y : Math.min(landingY, surface.y);
            }
        }

        return landingY;
    }

    findLandingDocY(runnerRect, previousBottom, nextBottom) {
        let landingY = null;

        for (const record of this.records.values()) {
            if ((!canSupport(record)) || !record.element.isConnected) {
                continue;
            }

            const surface = supportSurfaceDocForRunner(record, runnerRect);
            if (!surface) {
                continue;
            }

            if (surface.y >= previousBottom - 5 && surface.y <= nextBottom + 12) {
                landingY = landingY === null ? surface.y : Math.min(landingY, surface.y);
            }
        }

        return landingY;
    }

    findSupportY(runnerRect) {
        const feet = runnerRect.bottom;
        let supportY = null;

        for (const record of this.records.values()) {
            if ((!canSupport(record)) || !record.element.isConnected) {
                continue;
            }

            const surface = supportSurfaceForRunner(record, runnerRect);
            if (!surface) {
                continue;
            }

            if (Math.abs(surface.y - feet) <= IMAGE_SUPPORT_TOLERANCE) {
                supportY = supportY === null ? surface.y : Math.min(supportY, surface.y);
            }
        }

        return supportY;
    }

    findSupportDocY(runnerRect) {
        const feet = runnerRect.bottom;
        let supportY = null;

        for (const record of this.records.values()) {
            if ((!canSupport(record)) || !record.element.isConnected) {
                continue;
            }

            const surface = supportSurfaceDocForRunner(record, runnerRect);
            if (!surface) {
                continue;
            }

            if (Math.abs(surface.y - feet) <= IMAGE_SUPPORT_TOLERANCE) {
                supportY = supportY === null ? surface.y : Math.min(supportY, surface.y);
            }
        }

        return supportY;
    }

    platformRectsForRoom(room) {
        if (!room) {
            return [];
        }

        const top = Number.isFinite(room.top) ? room.top : 0;
        const bottom = Number.isFinite(room.bottom) ? room.bottom : Number.MAX_SAFE_INTEGER;
        const platforms = [];

        for (const record of this.records.values()) {
            if ((!canSupport(record)) || !record.element.isConnected) {
                continue;
            }

            const surface = supportSurfaceDocForRunner(record, {
                left: record.baseDocRect.left,
                right: record.baseDocRect.right,
                top: record.baseDocRect.top - 4,
                bottom: record.baseDocRect.bottom + 4,
                width: record.baseDocRect.width,
                height: record.baseDocRect.height + 8,
            });
            const rect = surface?.rect || supportDocRectForRecord(record);
            if (!rect || rect.width < 8 || rect.height < 2 || rect.bottom < top - 64 || rect.top > bottom + 64) {
                continue;
            }

            platforms.push({
                rect,
                surfaceY: surface?.y ?? rect.top,
                record,
                type: record.type,
            });
        }

        return platforms;
    }

    ensureRecord(target) {
        const existing = this.records.get(target.element);
        if (existing) {
            return existing;
        }

        const record = {
            element: target.element,
            selector: target.selector || defaultSelectorForType(target.type),
            type: target.type,
            classAttribute: target.element.getAttribute('class'),
            styleAttribute: target.element.getAttribute('style'),
            baseDocRect: rectToDocumentObject(target.element.getBoundingClientRect()),
            stage: 0,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            supportUntil: 0,
            backdrop: target.type === 'image' ? isBackdropImage(target.element) : false,
        };

        if (target.type === 'platform' || target.type === 'action') {
            target.element.classList.add('gw-platform-support');
        } else {
            target.element.classList.add('gw-image-breakable');
        }
        if (target.type === 'icon') {
            target.element.classList.add('gw-icon-breakable');
        }
        if (target.type === 'platform') {
            target.element.classList.add('gw-platform-support');
        }
        this.records.set(target.element, record);
        return record;
    }

    applyHit(record, options = {}) {
        const direction = options.direction === -1 ? -1 : 1;
        record.stage = Math.min(IMAGE_BREAK_STAGE, record.stage + 1);
        record.rotation += direction * imageRotationStep(record.stage);
        record.offsetX += direction * randomBetween(3, 8);
        record.offsetY += record.stage >= 4 ? randomBetween(2, 5) : randomBetween(-2, 3);

        const element = record.element;
        const visualStage = Math.min(IMAGE_MAX_VISUAL_STAGE, record.stage);
        element.classList.remove(
            'gw-image-breakable--stage-1',
            'gw-image-breakable--stage-2',
            'gw-image-breakable--stage-3',
            'gw-image-breakable--stage-4',
            'gw-image-breakable--hit'
        );
        element.classList.add(`gw-image-breakable--stage-${visualStage}`);
        void element.offsetWidth;
        element.classList.add('gw-image-breakable--hit');

        element.style.transformOrigin = 'center center';
        element.style.transform = `translate(${record.offsetX}px, ${record.offsetY}px) rotate(${record.rotation}deg)`;
        element.style.transition = 'transform 170ms steps(3, end), clip-path 170ms steps(3, end), opacity 170ms steps(3, end), filter 170ms steps(3, end)';
        element.style.willChange = 'transform, clip-path, opacity, filter';

        if (record.stage === 1) {
            element.style.filter = 'saturate(1.15) contrast(1.06)';
        } else if (record.stage === 2) {
            element.style.filter = 'saturate(1.1) contrast(1.14)';
            element.style.clipPath = 'polygon(0 0, 100% 0, 95% 42%, 100% 100%, 0 100%, 8% 57%, 0 34%)';
        } else if (record.stage === 3) {
            element.style.filter = 'grayscale(0.22) contrast(1.2)';
            element.style.clipPath = 'polygon(0 0, 82% 0, 100% 22%, 86% 44%, 100% 100%, 14% 100%, 0 76%, 11% 49%, 0 26%)';
            element.style.opacity = '0.78';
        } else if (record.stage < IMAGE_BREAK_STAGE) {
            element.style.filter = 'grayscale(0.32) contrast(1.22)';
            element.style.clipPath = 'polygon(4% 0, 72% 0, 96% 18%, 83% 45%, 100% 100%, 18% 100%, 0 78%, 14% 48%, 0 21%)';
            element.style.opacity = '0.62';
        } else {
            element.style.filter = 'grayscale(0.45) contrast(1.24)';
            element.style.clipPath = 'polygon(8% 0, 48% 0, 63% 18%, 94% 24%, 74% 51%, 92% 100%, 28% 100%, 0 78%, 16% 46%, 0 18%)';
            element.style.opacity = '0.34';
            record.supportUntil = performance.now() + IMAGE_DESTROY_SUPPORT_MS;

            const timer = window.setTimeout(() => {
                if (record.stage >= IMAGE_BREAK_STAGE && record.element.isConnected) {
                    record.element.classList.add('gw-image-breakable--gone');
                    record.element.style.opacity = '0';
                    record.supportUntil = 0;
                }

                this.timers.delete(timer);
            }, IMAGE_DESTROY_SUPPORT_MS);

            this.timers.add(timer);
        }

        const rect = rectToObject(element.getBoundingClientRect());
        return {
            count: 1,
            rect,
            selector: record.selector,
            type: record.type,
            stage: record.stage,
            target: element,
            destroyed: record.stage >= IMAGE_BREAK_STAGE,
        };
    }
}

function emptyHit() {
    return {
        count: 0,
        rect: null,
        selector: '',
        stage: 0,
        target: null,
        destroyed: false,
    };
}

function isPlayableImage(element) {
    if (!(element instanceof HTMLImageElement)) {
        return false;
    }

    if (isGameIgnoredElement(element)) {
        return false;
    }

    return Boolean(element.closest('.gw-demo-content,.entry-content,main,article,.elementor,.elementor-element,.elementor-widget-container,.e-con'));
}

function isPlayableIcon(element) {
    if (!(element instanceof Element)) {
        return false;
    }

    if (isGameIgnoredElement(element)) {
        return false;
    }

    const rect = element.getBoundingClientRect();
    if (rect.width < 12 || rect.height < 12 || rect.width > 240 || rect.height > 240) {
        return false;
    }

    if (!element.closest('.gw-demo-content,.entry-content,main,article,.elementor,.elementor-element,.elementor-widget-container,.e-con')) {
        return false;
    }

    const tag = element.tagName.toLowerCase();
    return tag === 'svg'
        || tag === 'i'
        || element.classList.contains('elementor-icon')
        || element.classList.contains('elementor-icon-box-icon')
        || element.classList.contains('elementskit-info-box-icon')
        || element.classList.contains('ekit_icon_button')
        || element.classList.contains('icon');
}

function isPlayablePlatform(element) {
    if (!(element instanceof Element)) {
        return false;
    }

    if (isGameIgnoredElement(element)) {
        return false;
    }

    if (!element.closest('.gw-demo-content,.entry-content,main,article,.elementor,.elementor-element,.elementor-widget-container,.e-con')) {
        return false;
    }

    const rect = element.getBoundingClientRect();
    return rect.width >= 24 && rect.height >= 2;
}

function isPlayableActionSupport(element) {
    if (!(element instanceof Element)) {
        return false;
    }

    if (isGameIgnoredElement(element)) {
        return false;
    }

    if (!element.closest('.gw-demo-content,.entry-content,main,article,.elementor,.elementor-element,.elementor-widget-container,.e-con')) {
        return false;
    }

    const rect = element.getBoundingClientRect();
    return rect.width >= 36 && rect.height >= 18;
}

function defaultSelectorForType(type) {
    if (type === 'icon') {
        return '.elementor-icon';
    }

    if (type === 'platform') {
        return '.gw-platform-support';
    }

    if (type === 'action') {
        return 'a,button';
    }

    return 'img';
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

function horizontalOverlap(first, second) {
    return Math.max(0, Math.min(first.right, second.right) - Math.max(first.left, second.left));
}

function rectToObject(rect) {
    return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        right: rect.right,
        bottom: rect.bottom,
    };
}

function rectToDocumentObject(rect) {
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
    };
}

function supportRectForRecord(record) {
    return {
        left: record.baseDocRect.left - window.scrollX + record.offsetX,
        top: record.baseDocRect.top - window.scrollY + record.offsetY,
        width: record.baseDocRect.width,
        height: record.baseDocRect.height,
        right: record.baseDocRect.left - window.scrollX + record.offsetX + record.baseDocRect.width,
        bottom: record.baseDocRect.top - window.scrollY + record.offsetY + record.baseDocRect.height,
    };
}

function supportDocRectForRecord(record) {
    return {
        left: record.baseDocRect.left + record.offsetX,
        top: record.baseDocRect.top + record.offsetY,
        width: record.baseDocRect.width,
        height: record.baseDocRect.height,
        right: record.baseDocRect.left + record.offsetX + record.baseDocRect.width,
        bottom: record.baseDocRect.top + record.offsetY + record.baseDocRect.height,
    };
}

function supportSurfaceForRunner(record, runnerRect) {
    const rect = supportRectForRecord(record);

    if (rect.width < 12 || rect.height < 12 || horizontalOverlap(runnerRect, rect) < IMAGE_SUPPORT_MIN_OVERLAP) {
        return null;
    }

    if (record.backdrop) {
        return {
            y: clamp(rect.bottom, rect.top + 18, rect.bottom),
            rect,
        };
    }

    if (record.type === 'platform') {
        return {
            y: rect.top,
            rect,
        };
    }

    const centerX = runnerRect.left + runnerRect.width / 2;
    const clampedX = clamp(centerX, rect.left, rect.right);
    const rotation = clamp(record.rotation, -24, 24);
    const slope = Math.tan(rotation * Math.PI / 180) * (clampedX - (rect.left + rect.width / 2)) * 0.42;
    const y = clamp(rect.top + slope, rect.top - 18, rect.top + 42);

    return { y, rect };
}

function supportSurfaceDocForRunner(record, runnerRect) {
    const rect = supportDocRectForRecord(record);

    if (rect.width < 12 || rect.height < 12 || horizontalOverlap(runnerRect, rect) < IMAGE_SUPPORT_MIN_OVERLAP) {
        return null;
    }

    if (record.backdrop) {
        return null;
    }

    if (record.type === 'platform') {
        return {
            y: rect.top,
            rect,
        };
    }

    const centerX = runnerRect.left + runnerRect.width / 2;
    const clampedX = clamp(centerX, rect.left, rect.right);
    const rotation = clamp(record.rotation, -24, 24);
    const slope = Math.tan(rotation * Math.PI / 180) * (clampedX - (rect.left + rect.width / 2)) * 0.42;
    const y = clamp(rect.top + slope, rect.top - 18, rect.top + 42);

    return { y, rect };
}

function imageRotationStep(stage) {
    if (stage <= 1) {
        return randomBetween(4, 7);
    }

    if (stage <= 3) {
        return randomBetween(5, 8);
    }

    return randomBetween(7, 11);
}

function canSupport(record) {
    if (record.backdrop) {
        return false;
    }

    if (record.type === 'platform') {
        return true;
    }

    return record.stage < IMAGE_BREAK_STAGE || hasTemporarySupport(record);
}

function canHit(record) {
    return record.type !== 'platform' && record.type !== 'action' && !record.backdrop && record.stage < IMAGE_BREAK_STAGE;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function hasTemporarySupport(record) {
    return record.supportUntil > performance.now();
}

function restoreAttribute(element, name, value) {
    if (value === null) {
        element.removeAttribute(name);
        return;
    }

    element.setAttribute(name, value);
}

function isBackdropImage(element) {
    const rect = element.getBoundingClientRect();
    const viewportArea = Math.max(1, window.innerWidth * window.innerHeight);
    const imageArea = Math.max(0, rect.width * rect.height);
    const classText = `${element.className || ''} ${element.parentElement?.className || ''}`.toLowerCase();

    if (classText.includes('background') || classText.includes('hero')) {
        return imageArea > viewportArea * 0.22;
    }

    return rect.width > window.innerWidth * 0.52
        && rect.height > window.innerHeight * 0.42
        && imageArea > viewportArea * 0.24;
}
