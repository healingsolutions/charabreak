const TARGET_SELECTOR = 'h1,h2,h3,p,img,a,button,section,article,main';
const IGNORE_SELECTOR = '.gw-mode-button, .gw-stage, .gw-stage *';

export function scanGameTargets(root = document, options = {}) {
    const limit = options.limit || 180;
    const elements = Array.from(root.querySelectorAll(TARGET_SELECTOR));
    const targets = [];

    for (const element of elements) {
        if (!(element instanceof Element)) {
            continue;
        }

        if (element.matches(IGNORE_SELECTOR) || element.closest('.gw-stage')) {
            continue;
        }

        if (!isVisibleElement(element)) {
            continue;
        }

        const type = classifyElement(element);
        targets.push({
            id: `gw-target-${targets.length + 1}`,
            element,
            type,
            tag: element.tagName.toLowerCase(),
            selector: buildSelector(element),
            text: extractElementText(element),
            href: element instanceof HTMLAnchorElement ? element.href : '',
            rect: rectToObject(element.getBoundingClientRect()),
        });

        if (targets.length >= limit) {
            break;
        }
    }

    return targets;
}

export function findScannedTarget(startNode, targets) {
    const lookup = new Map(targets.map((target) => [target.element, target]));
    let node = startNode instanceof Element ? startNode : startNode?.parentElement;

    while (node && node !== document.body && node !== document.documentElement) {
        if (lookup.has(node)) {
            return lookup.get(node);
        }

        node = node.parentElement;
    }

    return lookup.get(node) || null;
}

export function liveRectForTarget(target) {
    return rectToObject(target.element.getBoundingClientRect());
}

function classifyElement(element) {
    const tag = element.tagName.toLowerCase();

    if (/^h[1-3]$/.test(tag)) {
        return 'heading';
    }

    if (tag === 'p') {
        return 'paragraph';
    }

    if (tag === 'img') {
        return 'image';
    }

    if (tag === 'a' || tag === 'button') {
        return 'action';
    }

    return 'container';
}

function extractElementText(element) {
    if (element instanceof HTMLImageElement) {
        return element.alt || element.currentSrc || element.src || 'image';
    }

    return (element.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 240);
}

function isVisibleElement(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    return rect.width > 4
        && rect.height > 4
        && style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number(style.opacity || 1) > 0;
}

function buildSelector(element) {
    if (element.id) {
        return `#${escapeIdent(element.id)}`;
    }

    const parts = [];
    let node = element;

    while (node && node.nodeType === Node.ELEMENT_NODE && node !== document.body && parts.length < 4) {
        let part = node.tagName.toLowerCase();
        const stableClass = Array.from(node.classList || []).find((className) => !className.startsWith('gw-'));

        if (stableClass) {
            part += `.${escapeIdent(stableClass)}`;
        }

        const index = nthOfType(node);
        if (index > 1) {
            part += `:nth-of-type(${index})`;
        }

        parts.unshift(part);
        node = node.parentElement;
    }

    return parts.join(' > ');
}

function nthOfType(element) {
    let index = 1;
    let sibling = element.previousElementSibling;

    while (sibling) {
        if (sibling.tagName === element.tagName) {
            index += 1;
        }

        sibling = sibling.previousElementSibling;
    }

    return index;
}

function escapeIdent(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') {
        return window.CSS.escape(value);
    }

    return String(value).replace(/[^A-Za-z0-9_-]/g, '\\$&');
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
