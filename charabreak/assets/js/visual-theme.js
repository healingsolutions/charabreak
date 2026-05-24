const VISUAL_STYLES = new Set(['auto', 'soft', 'pastel', 'neon', 'dark']);

export function resolveVisualTheme(requestedStyle = 'auto', rootDocument = document) {
    const requested = normalizeStyle(requestedStyle);
    const samples = collectThemeSamples(rootDocument);
    const background = firstUsableColor(samples.backgrounds, { r: 255, g: 255, b: 255, a: 1 });
    const text = firstUsableColor(samples.texts, { r: 31, g: 41, b: 55, a: 1 });
    const accent = firstUsableColor(samples.accents, null) || deriveAccent(background, text);
    const tone = requested === 'auto' ? classifyTone(background, accent) : requested;
    const tokens = buildTokens(tone, background, text, accent);

    return {
        style: tone,
        source: requested,
        tokens,
    };
}

function collectThemeSamples(rootDocument) {
    const body = rootDocument.body;
    const selectors = [
        'body',
        'main',
        'article',
        '.wp-site-blocks',
        '.elementor',
        '.elementor-section',
        '.e-con',
        'section',
        'header',
        'h1',
        'h2',
        'p',
        'a',
        'button',
        '[class*="button"]',
    ];
    const elements = new Set([body, rootDocument.documentElement]);

    selectors.forEach((selector) => {
        rootDocument.querySelectorAll(selector).forEach((element) => {
            if (elements.size < 90) {
                elements.add(element);
            }
        });
    });

    const backgrounds = [];
    const texts = [];
    const accents = [];

    elements.forEach((element) => {
        if (!element || element.nodeType !== 1) {
            return;
        }

        const style = rootDocument.defaultView.getComputedStyle(element);
        const rect = element.getBoundingClientRect?.();
        const visible = !rect || rect.width > 0 || rect.height > 0;
        if (!visible) {
            return;
        }

        pushColor(backgrounds, style.backgroundColor);
        pushColor(texts, style.color);

        const tag = String(element.tagName || '').toLowerCase();
        if (tag === 'a' || tag === 'button' || /button|link|cta/i.test(element.className || '')) {
            pushColor(accents, style.backgroundColor);
            pushColor(accents, style.borderTopColor);
            pushColor(accents, style.color);
        }
    });

    return { backgrounds, texts, accents };
}

function pushColor(list, value) {
    const color = parseColor(value);
    if (!color || color.a < 0.12) {
        return;
    }

    list.push(color);
}

function firstUsableColor(colors, fallback) {
    if (!colors.length) {
        return fallback;
    }

    const scored = colors
        .map((color) => ({ color, score: color.a * (0.35 + Math.abs(luminance(color) - 0.5)) }))
        .sort((first, second) => second.score - first.score);

    return scored[0]?.color || fallback;
}

function deriveAccent(background, text) {
    if (luminance(background) < 0.34) {
        return { r: 78, g: 220, b: 207, a: 1 };
    }

    const textHsl = rgbToHsl(text);
    const hue = Number.isFinite(textHsl.h) ? (textHsl.h + 168) % 360 : 174;
    return hslToRgb(hue, 0.52, 0.44);
}

function classifyTone(background, accent) {
    const bgLum = luminance(background);
    const accentHsl = rgbToHsl(accent);

    if (bgLum < 0.24) {
        return 'neon';
    }

    if (bgLum > 0.72 && accentHsl.s < 0.58 && accentHsl.l > 0.46) {
        return 'pastel';
    }

    return 'soft';
}

function buildTokens(tone, background, text, accent) {
    const accentHsl = rgbToHsl(accent);
    const textLum = luminance(text);
    const panelText = textLum < 0.5 ? text : { r: 17, g: 24, b: 39, a: 1 };

    if (tone === 'pastel') {
        const softAccent = hslToRgb(accentHsl.h || 170, Math.min(0.48, accentHsl.s + 0.1), 0.68);
        const peach = hslToRgb(28, 0.78, 0.75);
        const lavender = hslToRgb(258, 0.5, 0.68);
        return tokenSet({
            accent: softAccent,
            gold: peach,
            danger: lavender,
            panel: 'rgba(255, 255, 255, 0.72)',
            panelText,
            radius: '14px',
            glowStrength: '0.34',
            shadow: 'rgba(90, 78, 112, 0.16)',
        });
    }

    if (tone === 'neon' || tone === 'dark') {
        return tokenSet({
            accent: { r: 78, g: 220, b: 207, a: 1 },
            gold: { r: 245, g: 213, b: 101, a: 1 },
            danger: { r: 169, g: 111, b: 212, a: 1 },
            panel: 'rgba(7, 18, 27, 0.58)',
            panelText: { r: 237, g: 252, b: 250, a: 1 },
            radius: '4px',
            glowStrength: '0.72',
            shadow: 'rgba(6, 15, 24, 0.42)',
        });
    }

    const softAccent = hslToRgb(accentHsl.h || 172, Math.min(0.62, Math.max(0.34, accentHsl.s)), Math.min(0.46, Math.max(0.34, accentHsl.l)));
    const warm = hslToRgb(45, 0.72, 0.62);

    return tokenSet({
        accent: softAccent,
        gold: warm,
        danger: hslToRgb(280, 0.42, 0.54),
        panel: luminance(background) < 0.5 ? 'rgba(8, 18, 28, 0.54)' : 'rgba(255, 255, 255, 0.66)',
        panelText,
        radius: '8px',
        glowStrength: '0.42',
        shadow: 'rgba(22, 33, 43, 0.18)',
    });
}

function tokenSet(values) {
    return {
        accent: toHex(values.accent),
        accentRgb: toRgbTuple(values.accent),
        accentSoft: `rgba(${toRgbTuple(values.accent)}, 0.18)`,
        gold: toHex(values.gold),
        goldRgb: toRgbTuple(values.gold),
        danger: toHex(values.danger),
        dangerRgb: toRgbTuple(values.danger),
        panel: values.panel,
        panelText: toHex(values.panelText),
        panelTextRgb: toRgbTuple(values.panelText),
        radius: values.radius,
        glowStrength: values.glowStrength,
        shadow: values.shadow,
    };
}

function normalizeStyle(value) {
    const style = String(value || 'auto').toLowerCase();
    return VISUAL_STYLES.has(style) ? style : 'auto';
}

function parseColor(value) {
    const raw = String(value || '').trim();
    if (!raw || raw === 'transparent') {
        return null;
    }

    const rgb = raw.match(/^rgba?\(([^)]+)\)$/i);
    if (rgb) {
        const parts = rgb[1].split(',').map((part) => Number.parseFloat(part.trim()));
        if (parts.length >= 3 && parts.slice(0, 3).every(Number.isFinite)) {
            return {
                r: clamp(Math.round(parts[0]), 0, 255),
                g: clamp(Math.round(parts[1]), 0, 255),
                b: clamp(Math.round(parts[2]), 0, 255),
                a: Number.isFinite(parts[3]) ? clamp(parts[3], 0, 1) : 1,
            };
        }
    }

    const hex = raw.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (!hex) {
        return null;
    }

    const value6 = hex[1].length === 3
        ? hex[1].split('').map((char) => char + char).join('')
        : hex[1];
    const number = Number.parseInt(value6, 16);

    return {
        r: (number >> 16) & 255,
        g: (number >> 8) & 255,
        b: number & 255,
        a: 1,
    };
}

function luminance(color) {
    const convert = (channel) => {
        const value = channel / 255;
        return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    };

    return 0.2126 * convert(color.r) + 0.7152 * convert(color.g) + 0.0722 * convert(color.b);
}

function rgbToHsl(color) {
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    if (max === min) {
        return { h: 0, s: 0, l };
    }

    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = 0;

    if (max === r) {
        h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max === g) {
        h = (b - r) / d + 2;
    } else {
        h = (r - g) / d + 4;
    }

    return { h: h * 60, s, l };
}

function hslToRgb(h, s, l) {
    const hue = ((h % 360) + 360) % 360 / 360;
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const convert = (t) => {
        let value = t;
        if (value < 0) {
            value += 1;
        }
        if (value > 1) {
            value -= 1;
        }
        if (value < 1 / 6) {
            return p + (q - p) * 6 * value;
        }
        if (value < 1 / 2) {
            return q;
        }
        if (value < 2 / 3) {
            return p + (q - p) * (2 / 3 - value) * 6;
        }
        return p;
    };

    return {
        r: Math.round(convert(hue + 1 / 3) * 255),
        g: Math.round(convert(hue) * 255),
        b: Math.round(convert(hue - 1 / 3) * 255),
        a: 1,
    };
}

function toHex(color) {
    const hex = [color.r, color.g, color.b]
        .map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0'))
        .join('');

    return `#${hex}`;
}

function toRgbTuple(color) {
    return `${clamp(Math.round(color.r), 0, 255)}, ${clamp(Math.round(color.g), 0, 255)}, ${clamp(Math.round(color.b), 0, 255)}`;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
