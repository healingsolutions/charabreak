import { isGameIgnoredElement } from './dom-scanner.js?v=0.2.18';

const BREAKABLE_TYPES = new Set(['heading', 'paragraph', 'action']);
const SKIP_SELECTOR = 'script,style,noscript,svg,canvas,input,textarea,select,.gw-stage,.gw-stage *,.gw-break-char,.cb-nav,.cb-nav *';
const TEXT_DIRECT_SUPPORT_OVERLAP = 5;
const TEXT_BRIDGE_GAP_CHARS = 2.8;
const TEXT_LINE_TOLERANCE = 6;
const TEXT_LANDING_OVERSHOOT = 64;

export class TextBreaker {
    constructor() {
        this.records = [];
        this.charSpans = [];
        this.breakTimers = new Set();
        this.prepared = false;
    }

    prepare(targets = []) {
        if (this.prepared) {
            return;
        }

        const elements = uniqueElements(
            targets
                .filter((target) => BREAKABLE_TYPES.has(target.type))
                .filter((target) => isContentElement(target.element))
                .map((target) => target.element)
        );

        for (const element of elements) {
            this.wrapElementText(element);
        }

        this.prepared = true;
    }

    restore() {
        for (const timer of this.breakTimers) {
            window.clearTimeout(timer);
        }

        this.breakTimers.clear();

        for (let index = this.records.length - 1; index >= 0; index -= 1) {
            const record = this.records[index];
            const firstNode = record.nodes.find((node) => node.parentNode === record.parent);

            if (firstNode) {
                record.parent.insertBefore(document.createTextNode(record.text), firstNode);
            } else {
                record.parent.appendChild(document.createTextNode(record.text));
            }

            for (const node of record.nodes) {
                node.remove();
            }
        }

        this.records = [];
        this.charSpans = [];
        this.prepared = false;
    }

    destroyAtRect(rect, options = {}) {
        const limit = options.limit || 1;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const candidates = [];

        for (const span of this.charSpans) {
            if (span.dataset.gwBroken === '1' || !span.isConnected) {
                continue;
            }

            const spanRect = span.getBoundingClientRect();
            const overlap = rectOverlapArea(rect, spanRect);
            if (overlap <= 0) {
                continue;
            }

            const spanCenterX = spanRect.left + spanRect.width / 2;
            const spanCenterY = spanRect.top + spanRect.height / 2;
            const distance = Math.hypot(centerX - spanCenterX, (centerY - spanCenterY) * 1.35);

            candidates.push({ span, rect: spanRect, distance });
        }

        candidates.sort((a, b) => a.distance - b.distance);

        const destroyed = candidates.slice(0, limit).map((candidate) => this.destroySpan(candidate.span, candidate.rect, options.source || 'player'));

        return {
            count: destroyed.length,
            chars: destroyed.map((item) => item.char),
            items: destroyed,
            critical: destroyed.some((item) => item.critical),
            criticalWord: destroyed.find((item) => item.critical)?.criticalWord || '',
            target: destroyed[0]?.target || null,
            rect: unionRects(destroyed.map((item) => item.rect)) || rect,
        };
    }

    pickCharAtRect(rect, options = {}) {
        const centerX = options.centerX || rect.left + rect.width / 2;
        const centerY = options.centerY || rect.top + rect.height / 2;
        const candidates = [];

        for (const span of this.charSpans) {
            if (span.dataset.gwBroken === '1' || !span.isConnected) {
                continue;
            }

            const spanRect = span.getBoundingClientRect();
            const overlap = rectOverlapArea(rect, spanRect);
            if (overlap <= 0) {
                continue;
            }

            const spanCenterX = spanRect.left + spanRect.width / 2;
            const spanCenterY = spanRect.top + spanRect.height / 2;
            const distance = Math.hypot(centerX - spanCenterX, (centerY - spanCenterY) * 1.6);

            candidates.push({ span, rect: spanRect, distance, overlap });
        }

        candidates.sort((a, b) => a.distance - b.distance || b.overlap - a.overlap);

        if (!candidates[0]) {
            return null;
        }

        return this.pickSpan(candidates[0].span, candidates[0].rect);
    }

    findLandingY(runnerRect, previousBottom, nextBottom) {
        const overshoot = Math.min(TEXT_LANDING_OVERSHOOT, Math.max(24, runnerRect.height * 0.86));
        return this.findTextSurfaceY(runnerRect, (rect) => rect.top >= previousBottom - overshoot && rect.top <= nextBottom + 12);
    }

    findLandingDocY(runnerRect, previousBottom, nextBottom) {
        const overshoot = Math.min(TEXT_LANDING_OVERSHOOT, Math.max(24, runnerRect.height * 0.86));
        return this.findTextSurfaceDocY(runnerRect, (rect) => rect.top >= previousBottom - overshoot && rect.top <= nextBottom + 12);
    }

    findSupportY(runnerRect) {
        const feet = runnerRect.bottom;
        return this.findTextSurfaceY(runnerRect, (rect) => rect.top >= feet - 6 && rect.top <= feet + 8);
    }

    findSupportDocY(runnerRect) {
        const feet = runnerRect.bottom;
        return this.findTextSurfaceDocY(runnerRect, (rect) => rect.top >= feet - 7 && rect.top <= feet + 9);
    }

    findSupportBelowY(runnerRect, maxTop = window.innerHeight + 460) {
        return this.findTextSurfaceY(
            runnerRect,
            (rect) => rect.top > runnerRect.bottom + 10 && rect.top <= maxTop
        );
    }

    findSupportBelowDocY(runnerRect, maxTop = runnerRect.bottom + 900) {
        return this.findTextSurfaceDocY(
            runnerRect,
            (rect) => rect.top > runnerRect.bottom + 10 && rect.top <= maxTop
        );
    }

    hasSupportBelow(runnerRect, maxTop = window.innerHeight + 460) {
        return this.findSupportBelowY(runnerRect, maxTop) !== null;
    }

    findTextSurfaceY(runnerRect, acceptsRect) {
        const rects = [];

        for (const span of this.charSpans) {
            if (span.dataset.gwBroken === '1' || !span.isConnected) {
                continue;
            }

            const rect = span.getBoundingClientRect();
            if (rect.width < 1 || rect.height < 1 || !acceptsRect(rect)) {
                continue;
            }

            rects.push(plainRect(rect));
        }

        const lines = groupRectsByLine(rects);
        let surfaceY = null;

        for (const line of lines) {
            if (!lineSupportsRunner(line, runnerRect)) {
                continue;
            }

            const top = Math.min(...line.map((rect) => rect.top));
            surfaceY = surfaceY === null ? top : Math.min(surfaceY, top);
        }

        return surfaceY;
    }

    findTextSurfaceDocY(runnerRect, acceptsRect) {
        const rects = [];

        for (const span of this.charSpans) {
            if (span.dataset.gwBroken === '1' || !span.isConnected) {
                continue;
            }

            const rect = rectToDocumentObject(span.getBoundingClientRect());
            if (rect.width < 1 || rect.height < 1 || !acceptsRect(rect)) {
                continue;
            }

            rects.push(rect);
        }

        const lines = groupRectsByLine(rects);
        let surfaceY = null;

        for (const line of lines) {
            if (!lineSupportsRunner(line, runnerRect)) {
                continue;
            }

            const top = Math.min(...line.map((rect) => rect.top));
            surfaceY = surfaceY === null ? top : Math.min(surfaceY, top);
        }

        return surfaceY;
    }

    charPlatformRectsForRoom(room) {
        if (!room) {
            return [];
        }

        const top = Number.isFinite(room.top) ? room.top : 0;
        const bottom = Number.isFinite(room.bottom) ? room.bottom : Number.MAX_SAFE_INTEGER;
        const rects = [];

        for (const span of this.charSpans) {
            if (span.dataset.gwBroken === '1' || !span.isConnected) {
                continue;
            }

            const rect = rectToDocumentObject(span.getBoundingClientRect());
            if (rect.width < 1 || rect.height < 1 || rect.bottom < top - 36 || rect.top > bottom + 36) {
                continue;
            }

            rects.push({
                rect,
                span,
                type: 'text',
            });
        }

        return rects;
    }

    hasUnbrokenText(element) {
        if (!(element instanceof Element)) {
            return false;
        }

        return this.charSpans.some((span) => span.isConnected
            && span.dataset.gwBroken !== '1'
            && span.__gwTargetElement === element);
    }

    countTotalChars() {
        return this.charSpans.length;
    }

    countBrokenBySource(source = '') {
        return this.charSpans.filter((span) => span.dataset.gwBroken === '1'
            && (!source || span.dataset.gwBrokenBy === source)).length;
    }

    countUnbrokenChars() {
        return this.charSpans.filter((span) => span.dataset.gwBroken !== '1').length;
    }

    markImportantChars(words = []) {
        for (const span of this.charSpans) {
            delete span.dataset.gwCritical;
            delete span.dataset.gwCriticalWord;
            span.classList.remove('gw-break-char--critical');
        }

        const normalizedWords = words
            .map((word) => normalizeCriticalWord(word))
            .filter((word) => word.length >= 2)
            .sort((a, b) => b.length - a.length);

        for (const word of normalizedWords) {
            const match = findWordSpanSequence(this.charSpans, word);
            if (!match.length) {
                continue;
            }

            for (const span of match) {
                span.dataset.gwCritical = '1';
                span.dataset.gwCriticalWord = word;
                span.classList.add('gw-break-char--critical');
            }

            return {
                word,
                count: match.length,
                rect: unionRects(match.map((span) => plainRect(span.getBoundingClientRect()))),
            };
        }

        return {
            word: '',
            count: 0,
            rect: null,
        };
    }

    criticalRect() {
        const rects = this.charSpans
            .filter((span) => span.dataset.gwCritical === '1'
                && span.dataset.gwBroken !== '1'
                && span.isConnected)
            .map((span) => plainRect(span.getBoundingClientRect()));

        return unionRects(rects);
    }

    wrapElementText(element) {
        if (!(element instanceof Element) || isGameIgnoredElement(element)) {
            return;
        }

        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    if (!node.nodeValue || node.nodeValue.trim() === '') {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (node.parentElement?.closest(SKIP_SELECTOR) || isGameIgnoredElement(node.parentElement)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    return NodeFilter.FILTER_ACCEPT;
                },
            }
        );

        const nodes = [];
        while (walker.nextNode()) {
            nodes.push(walker.currentNode);
        }

        for (const node of nodes) {
            this.wrapTextNode(node, element);
        }
    }

    wrapTextNode(node, ownerElement) {
        const parent = node.parentNode;
        const text = node.nodeValue;
        const fragment = document.createDocumentFragment();
        const insertedNodes = [];

        for (const char of Array.from(text)) {
            if (/^\s$/u.test(char)) {
                const space = document.createTextNode(char);
                fragment.appendChild(space);
                insertedNodes.push(space);
                continue;
            }

            const span = document.createElement('span');
            span.className = 'gw-break-char';
            span.textContent = char;
            span.dataset.gwChar = char;
            span.__gwTargetElement = ownerElement;
            fragment.appendChild(span);
            insertedNodes.push(span);
            this.charSpans.push(span);
        }

        parent.insertBefore(fragment, node);
        parent.removeChild(node);
        this.records.push({
            parent,
            text,
            nodes: insertedNodes,
        });
    }

    destroySpan(span, rect, source = 'player') {
        const char = span.dataset.gwChar || span.textContent || '';
        span.dataset.gwBroken = '1';
        span.dataset.gwBrokenBy = source;
        span.style.width = `${Math.max(rect.width, 6)}px`;
        span.style.minWidth = `${Math.max(rect.width, 6)}px`;
        span.style.height = `${Math.max(rect.height, 8)}px`;
        span.classList.add('gw-break-char--breaking');
        span.setAttribute('aria-hidden', 'true');

        const timer = window.setTimeout(() => {
            span.textContent = '';
            span.classList.remove('gw-break-char--breaking');
            span.classList.add('gw-break-char--broken');
            this.breakTimers.delete(timer);
        }, 180);

        this.breakTimers.add(timer);

        return {
            char,
            rect,
            target: span.__gwTargetElement || null,
            critical: span.dataset.gwCritical === '1',
            criticalWord: span.dataset.gwCriticalWord || '',
        };
    }

    pickSpan(span, rect) {
        const char = span.dataset.gwChar || span.textContent || '';
        const style = snapshotCharStyle(span);
        span.dataset.gwBroken = '1';
        span.dataset.gwBrokenBy = 'player';
        span.style.width = `${Math.max(rect.width, 6)}px`;
        span.style.minWidth = `${Math.max(rect.width, 6)}px`;
        span.style.height = `${Math.max(rect.height, 8)}px`;
        span.classList.add('gw-break-char--breaking', 'gw-break-char--picked');
        span.setAttribute('aria-hidden', 'true');

        const timer = window.setTimeout(() => {
            span.textContent = '';
            span.classList.remove('gw-break-char--breaking', 'gw-break-char--picked');
            span.classList.add('gw-break-char--broken');
            this.breakTimers.delete(timer);
        }, 90);

        this.breakTimers.add(timer);

        return {
            char,
            rect: plainRect(rect),
            style,
            target: span.__gwTargetElement || null,
            critical: span.dataset.gwCritical === '1',
            criticalWord: span.dataset.gwCriticalWord || '',
        };
    }
}

function uniqueElements(elements) {
    const result = [];
    const seen = new Set();

    for (const element of elements) {
        if (!element || seen.has(element)) {
            continue;
        }

        seen.add(element);
        result.push(element);
    }

    return result;
}

function isContentElement(element) {
    if (!(element instanceof Element)) {
        return false;
    }

    if (isGameIgnoredElement(element)) {
        return false;
    }

    return Boolean(element.closest('.gw-demo-content,.entry-content,main,article,.elementor,.elementor-element,.elementor-widget-container,.e-con'));
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

function groupRectsByLine(rects) {
    const sorted = [...rects].sort((a, b) => a.top - b.top || a.left - b.left);
    const lines = [];

    for (const rect of sorted) {
        const line = lines.find((candidate) => Math.abs(candidate.top - rect.top) <= TEXT_LINE_TOLERANCE);
        if (line) {
            line.rects.push(rect);
            line.top = Math.min(line.top, rect.top);
            continue;
        }

        lines.push({
            top: rect.top,
            rects: [rect],
        });
    }

    return lines.map((line) => line.rects);
}

function lineSupportsRunner(line, runnerRect) {
    if (line.length === 0) {
        return false;
    }

    const sorted = [...line].sort((a, b) => a.left - b.left);
    const charWidth = median(sorted.map((rect) => rect.width).filter((width) => width > 1)) || 10;
    const bridgeGap = Math.max(18, charWidth * TEXT_BRIDGE_GAP_CHARS);
    const merged = [];

    for (const rect of sorted) {
        const last = merged[merged.length - 1];
        if (!last || rect.left - last.right > bridgeGap) {
            merged.push({ ...rect });
            continue;
        }

        last.right = Math.max(last.right, rect.right);
        last.left = Math.min(last.left, rect.left);
        last.width = last.right - last.left;
        last.top = Math.min(last.top, rect.top);
        last.bottom = Math.max(last.bottom, rect.bottom);
        last.height = last.bottom - last.top;
    }

    const centerX = runnerRect.left + runnerRect.width / 2;
    return merged.some((rect) => {
        if (centerX >= rect.left - 2 && centerX <= rect.right + 2) {
            return true;
        }

        return horizontalOverlap(runnerRect, rect) >= Math.min(22, runnerRect.width * 0.48);
    });
}

function median(values) {
    if (values.length === 0) {
        return null;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
}

function normalizeCriticalWord(word) {
    return Array.from(String(word || '').replace(/\s+/g, '').trim())
        .slice(0, 8)
        .join('');
}

function normalizeCriticalChar(char) {
    return String(char || '').toLocaleLowerCase();
}

function findWordSpanSequence(spans, word) {
    const chars = Array.from(word).map(normalizeCriticalChar);
    if (chars.length === 0) {
        return [];
    }

    const usable = spans.filter((span) => span.isConnected && span.dataset.gwBroken !== '1');
    for (let start = 0; start <= usable.length - chars.length; start += 1) {
        const match = [];
        for (let offset = 0; offset < chars.length; offset += 1) {
            const span = usable[start + offset];
            if (normalizeCriticalChar(span.dataset.gwChar || span.textContent || '') !== chars[offset]) {
                break;
            }

            match.push(span);
        }

        if (match.length === chars.length) {
            return match;
        }
    }

    return [];
}

function unionRects(rects) {
    const usable = rects.filter(Boolean);
    if (usable.length === 0) {
        return null;
    }

    const left = Math.min(...usable.map((rect) => rect.left));
    const top = Math.min(...usable.map((rect) => rect.top));
    const right = Math.max(...usable.map((rect) => rect.right));
    const bottom = Math.max(...usable.map((rect) => rect.bottom));

    return {
        left,
        top,
        right,
        bottom,
        width: right - left,
        height: bottom - top,
    };
}

function plainRect(rect) {
    return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
    };
}

function rectToDocumentObject(rect) {
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        right: rect.right + window.scrollX,
        bottom: rect.bottom + window.scrollY,
        width: rect.width,
        height: rect.height,
    };
}

function snapshotCharStyle(span) {
    const computed = window.getComputedStyle(span);

    return {
        color: computed.color,
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontStyle: computed.fontStyle,
        fontWeight: computed.fontWeight,
        letterSpacing: computed.letterSpacing,
        lineHeight: computed.lineHeight,
        textShadow: computed.textShadow,
    };
}
