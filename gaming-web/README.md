# Gaming Web Plugin

Gaming Web adds a light, playful mode to enabled WordPress pages. The MVP keeps destructive effects temporary: game mode may wrap visible text into per-character spans, but exit mode or reload restores the original page content.

## Features

- Floating game mode button on enabled singular pages/posts.
- Full-page overlay with a small character and exit control.
- Safe interactions for headings, paragraphs, images, links, buttons, and layout containers.
- Pixel-art runner that jumps around the viewport, attacks real per-character page text, and restores it on exit/reload.
- Combat controls: attack breaks the page in front of you; throw picks up a real character underfoot and throws it at an enemy, with automatic lock-on when needed.
- Optional in-game BGM toggle with chiptune Web Audio playback.
- MP3 sound effects for hits, UI, collection, start, exit, jumping, falling, landing, lock-on, throws, and KO moments.
- Collectible word fragments and a compact inventory panel.
- Admin settings for global enablement, post types, floating start button visibility, labels, character name, logging, and debug mode.
- Per-page meta for game mode, important words, and stage name.
- REST event endpoint at `/wp-json/gaming-web/v1/event`.
- Anonymous event table: `wp_gaming_web_events`.

## Starting From Page Content

Enabled pages can start game mode from natural in-page copy instead of the fixed lower-right button:

```text
[gaming_web_start label="このページで遊ぶ"]
```

The fixed floating button can be hidden in **Settings > Gaming Web**. Custom markup can also trigger the game by adding `data-gaming-web-start`:

```html
<a href="#gaming-web-start" data-gaming-web-start>このページを触ってみる</a>
```

`wordpress-adapter.js` exposes `window.GamingWeb.start()` for non-WordPress wrappers or custom theme scripts after the adapter has loaded.

## JavaScript Structure

- `gaming-web-core.js`: lifecycle orchestration.
- `dom-scanner.js`: visible element discovery.
- `stage-overlay.js`: overlay UI and visual effects.
- `interaction-engine.js`: click/tap behavior and inventory.
- `logger.js`: framework-agnostic event transport.
- `wordpress-adapter.js`: WordPress bootstrapping and REST wiring.

## Local Demo

From the workspace root:

```powershell
.\scripts\setup-wordpress.ps1
```

Open `http://localhost:8089`, click `ゲームモード`, then tap headings, images, paragraphs, buttons, and links.

Audio assets live under `assets/audio`. BGM preference is stored in the browser as `gaming_web_bgm_enabled`.

Player controls:

- Keyboard: `A/D` or arrow keys to move, `W` or up arrow to jump, `T`/`Tab` to lock on, `Space`/`Z` to attack, `X` to throw.
- Touch/mobile: use the on-screen arrow, lock, throw, and attack buttons. A quick double tap on attack also throws.
- Gamepad: left stick/D-pad moves, bottom button jumps, right button attacks, left face button throws, top button locks on.
- During game mode, page text is temporarily split into per-character spans so the character can walk on and break real page text. Exit mode or reload restores the original text.
