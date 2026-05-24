const TARGET_SELECTOR = [
    'h1,h2,h3,h4,h5,h6',
    'p',
    'img',
    'a,button',
    'section,article,main',
    '.elementor-heading-title',
    '.elementor-widget-text-editor',
    '.elementor-button',
    '.e-heading-base',
    '.e-paragraph-base',
    'details > summary',
    '.elementor-accordion .elementor-tab-title',
    '.elementor-toggle .elementor-tab-title',
    '.elementor-widget-accordion .elementor-tab-title',
    '.elementor-widget-toggle .elementor-tab-title',
    '.e-n-accordion-item-title',
    '.accordion-button',
    '.elementor-divider-separator',
    '.elementor-progress-bar',
    '.elementor-widget-divider',
    '.elementor-widget-progress',
    '.elementor-spacer-inner',
    '.ekit-progressbar-bar',
    '.progress-bar',
    'hr',
    '.elementor-icon',
    '.elementor-icon-box-icon',
    '.elementskit-info-box-icon',
    '.ekit-wid-con .icon',
    '.ekit-wid-con svg',
    '.ekit-wid-con i',
].join(',');
const GAME_IGNORE_SELECTOR = [
    '.gw-mode-button',
    '.gw-stage',
    'header',
    'footer',
    'nav',
    '.cb-nav',
    '[role="banner"]',
    '[role="navigation"]',
    '.elementor-location-header',
    '.site-header',
    '.main-header',
    '.site-navigation',
    '.main-navigation',
].join(',');

export function scanGameTargets(root = document, options = {}) {
    const limit = options.limit || 180;
    const elements = Array.from(root.querySelectorAll(TARGET_SELECTOR));
    const targets = [];

    for (const element of elements) {
        if (!(element instanceof Element)) {
            continue;
        }

        if (isGameIgnoredElement(element)) {
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

export function isGameIgnoredElement(element) {
    return element instanceof Element
        && (element.matches(GAME_IGNORE_SELECTOR)
            || Boolean(element.closest(GAME_IGNORE_SELECTOR))
            || Boolean(closestLikelyHeaderNavBar(element)));
}

function closestLikelyHeaderNavBar(element) {
    let node = element;

    while (node && node instanceof Element && node !== document.body && node !== document.documentElement) {
        if (isLikelyHeaderNavBar(node)) {
            return node;
        }

        node = node.parentElement;
    }

    return null;
}

function isLikelyHeaderNavBar(element) {
    if (!(element instanceof Element) || element.classList.contains('gw-stage')) {
        return false;
    }

    const rect = element.getBoundingClientRect();
    const docTop = rect.top + window.scrollY;
    const interactiveCount = element.querySelectorAll('a[href],button').length;

    if (docTop > 220 || rect.height > 220 || rect.width < Math.min(260, window.innerWidth * 0.45)) {
        return false;
    }

    if (interactiveCount >= 3) {
        return true;
    }

    const identity = `${element.id || ''} ${element.className || ''} ${element.getAttribute('role') || ''}`;
    return interactiveCount >= 2 && /\b(nav|menu|header|brand|logo)\b/i.test(identity);
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

    if (/^h[1-6]$/.test(tag)
        || element.classList.contains('elementor-heading-title')
        || element.classList.contains('e-heading-base')) {
        return 'heading';
    }

    if (tag === 'p'
        || element.classList.contains('elementor-widget-text-editor')
        || element.classList.contains('e-paragraph-base')) {
        return 'paragraph';
    }

    if (tag === 'img') {
        return 'image';
    }

    if (isAccordionElement(element)) {
        return 'accordion';
    }

    if (isPlatformElement(element)) {
        return 'platform';
    }

    if (isIconElement(element)) {
        return 'icon';
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

    if (isIconElement(element)) {
        return element.getAttribute('aria-label')
            || element.getAttribute('title')
            || element.closest('.elementor-widget-icon-box,.elementskit-infobox')?.textContent?.trim()
            || 'icon';
    }

    if (isAccordionElement(element)) {
        return element.getAttribute('aria-label')
            || element.getAttribute('title')
            || element.textContent?.replace(/\s+/g, ' ').trim()
            || 'accordion';
    }

    if (isPlatformElement(element)) {
        return element.getAttribute('aria-label')
            || element.getAttribute('title')
            || element.textContent?.replace(/\s+/g, ' ').trim()
            || 'platform';
    }

    return (element.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 240);
}

function isAccordionElement(element) {
    const tag = element.tagName.toLowerCase();
    if (tag === 'summary' && element.parentElement?.tagName?.toLowerCase() === 'details') {
        return true;
    }

    if (element.classList.contains('elementor-tab-title')
        && element.closest('.elementor-accordion,.elementor-toggle,.elementor-widget-accordion,.elementor-widget-toggle')) {
        return true;
    }

    return element.classList.contains('e-n-accordion-item-title')
        || element.classList.contains('accordion-button');
}

function isPlatformElement(element) {
    const tag = element.tagName.toLowerCase();
    return tag === 'hr'
        || element.classList.contains('elementor-divider-separator')
        || element.classList.contains('elementor-progress-bar')
        || element.classList.contains('elementor-widget-divider')
        || element.classList.contains('elementor-widget-progress')
        || element.classList.contains('elementor-spacer-inner')
        || element.classList.contains('ekit-progressbar-bar')
        || element.classList.contains('progress-bar');
}

function isIconElement(element) {
    const tag = element.tagName.toLowerCase();
    return tag === 'svg'
        || tag === 'i'
        || element.classList.contains('elementor-icon')
        || element.classList.contains('elementor-icon-box-icon')
        || element.classList.contains('elementskit-info-box-icon')
        || element.classList.contains('ekit_icon_button')
        || element.classList.contains('icon');
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
