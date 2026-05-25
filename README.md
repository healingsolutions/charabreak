# CharaBreak

**Turn your WordPress pages into playable stages.**

CharaBreak is a WordPress plugin that adds a playful game layer on top of your existing pages. Visitors can walk across text, jump between images and buttons, attack page elements, defend content from enemies, collect rewards, and move through multiple pages as if your website were an adventure field.

The core idea is simple:

> People do not always read first.
> Let them play first, then make the content memorable.

For the Japanese launch, the product message is:

> **読む前に、壊せ。**
> Before reading, break it.

CharaBreak is designed for interactive websites, campaign pages, product storytelling, fan engagement, educational content, and playful landing pages.

## What CharaBreak Does

- Turns WordPress pages and posts into game stages.
- Treats text, images, icons, buttons, and links as playable terrain.
- Adds a pixel-style character that can move, jump, attack, defend, parry, hold objects, and clear stages.
- Supports three play styles: **Break**, **Bloom**, and **Hybrid**.
- Adds enemies, bosses, missiles, parries, shields, treasure chests, rewards, and clear animations.
- Connects multiple pages through a world map, turning the entire site into an adventure route.
- Lets site owners configure stages, enemies, difficulty, rewards, BGM, and gameplay style.
- Can show coupons, bonus URLs, and special messages only after a visitor clears a stage.
- Stores lightweight anonymous event logs when logging is enabled.

## Gameplay Styles

CharaBreak is not limited to destructive effects. Different sites need different emotional tones, so stages can be designed around breaking, blooming, or both.

### Break

**Before reading, break it.**

In Break mode, text, images, buttons, and icons become objects that can be attacked. Visitors can smash letters one by one, create holes, drop to lower content, fight enemies, parry missiles, and protect the page.

This is the signature CharaBreak feeling: a polished website suddenly becomes a physical, playable world.

### Bloom

**Do not break it. Make it bloom.**

Bloom mode is for sites where destruction feels too aggressive. Instead of smashing letters, the player uses a magic wand to transform words into colorful flowers and light particles.

Flowers flutter away, disappear gracefully, and leave soft traces in the world. The result is still interactive and satisfying, but the tone is positive, gentle, and brand-friendly.

Bloom energy can also become a visual attack, such as energy arrows, without making the page feel hostile.

### Hybrid

Hybrid mode combines the impact of Break with the satisfaction of Bloom. A site can use Break on campaign pages, Bloom on brand pages, and a mixed style for special stages.

This gives creators room to build interactive content that matches the personality of each page.

## Free And Pro Strategy

CharaBreak is planned as a free-to-start WordPress plugin with Pro upgrades handled through Freemius.

### Free Version

The free version is intended to help users experience CharaBreak quickly:

- Game-enable one page.
- Use the basic character and default enemy behavior.
- Try the core Break / Bloom / Hybrid experience.
- Show a simple game start button.
- Use basic clear effects and lightweight logs.

### Pro Version

The Pro version is for full website adventures and commercial campaigns:

- Unlimited game-enabled pages.
- World map across multiple pages.
- Stage-by-stage configuration.
- Custom enemies and boss characters.
- Enemy difficulty presets.
- Stage BGM, boss BGM, final-stage BGM, and clear sounds.
- Treasure chests, rewards, coupons, bonus URLs, and gated offers.
- Advanced stage goals and campaign-style progression.
- More control over Break / Bloom / Hybrid per stage.

Freemius is used for license activation, paid upgrades, and Pro distribution.

## Installation

### Recommended: Install From A Release ZIP

1. Download `charabreak.zip` from the official distribution page or GitHub Releases.
2. Open your WordPress admin.
3. Go to `Plugins > Add New > Upload Plugin`.
4. Upload `charabreak.zip`.
5. Activate **CharaBreak**.

The ZIP should contain:

```text
charabreak/
├─ charabreak.php
├─ includes/
├─ admin/
└─ assets/
```

### Installing From GitHub Source

Do not upload the GitHub repository ZIP directly unless it contains only the plugin folder.

If you clone or download this repository, upload only the `charabreak` folder to:

```text
wp-content/plugins/charabreak/
```

Then activate **CharaBreak** from the WordPress plugin screen.

## How To Start CharaBreak

After activation:

1. Open `CharaBreak > Settings`.
2. Enable CharaBreak globally.
3. Choose the post types you want to support, such as pages or posts.
4. Decide whether to show the floating game start button.
5. Open `CharaBreak > Stage Manager`.
6. Enable the page you want to turn into a stage.
7. Configure the stage label, order, type, difficulty, enemies, reward teaser, BGM, and play style.
8. Open the page on the front end.
9. Click the CharaBreak start button or a custom start link.

The character will appear and the page becomes playable.

## Starting From A Page Button

You can start CharaBreak from a natural button or link inside the page, instead of using only the floating button.

Shortcode:

```text
[gaming_web_start label="Start Game"]
```

HTML:

```html
<a href="#gaming-web-start" data-gaming-web-start>Start Game</a>
```

This also works with page builders such as Elementor when the link or button can include the `data-gaming-web-start` attribute.

## Admin Screens

CharaBreak adds a top-level `CharaBreak` menu in the WordPress admin.

### Settings

Global plugin settings:

- Enable or disable CharaBreak.
- Choose supported post types.
- Show or hide the floating start button.
- Set the game button label.
- Set the main character name.
- Configure visual style.
- Configure BGM and sound behavior.
- Enable world map options.
- Enable lightweight logging.
- Enable debug mode.

### Stage Manager

Choose which pages become stages:

- Enable or disable each page.
- Set stage label and map order.
- Choose stage type: normal, reward, boss, or final.
- Set stage difficulty.
- Assign normal enemies and boss enemies.
- Add reward teaser text.
- Select clear effect.
- Configure stage audio and objective options.
- Choose Break, Bloom, or Hybrid play style.

### Character And Enemy Registry

Manage playable world characters and enemies:

- Enemy name.
- Image upload.
- Role: normal, boss, or both.
- Behavior preset.
- Difficulty level from 1 to 8.
- Automatically calculated HP, speed, attack frequency, destruction speed, and boss missile timing.

Site owners do not need to tune deep numbers. The 1-8 difficulty scale is intended to be understandable for clients and non-technical teams.

## Player Controls

### Keyboard

| Action | Key |
| --- | --- |
| Move | `A / D` or arrow keys |
| Jump | `Space`, `W`, or up arrow |
| Attack | `J` or `Z` |
| Hold / throw | `K` or `X` |
| Shield | `L` or `Shift` |
| Lock on | `T` or `Tab` |

### Mobile

Mobile controls are designed around touch gestures and compact UI:

- Tap to attack.
- Long press to hold a letter or object.
- Double tap to throw or release energy.
- Swipe up to jump.
- Slow horizontal swipe to move.
- Fast horizontal swipe to parry.
- Down swipe and release for charged attack.

Mobile mode may scale the game layer down to keep the stage readable and reduce clutter.

### Gamepad

CharaBreak uses the browser Gamepad API when available.

- Left stick or D-pad: move.
- Bottom button: jump.
- Right button: attack.
- Left button: hold or throw.
- Top button: lock on.

Browser support depends on the OS, browser, and controller. Some browsers detect a gamepad only after the page is clicked or a gamepad button is pressed.

## World Map

CharaBreak can connect multiple pages into a world map.

The world map helps visitors understand:

- Where they are now.
- Which page is the next stage.
- Which stages have rewards.
- Which gate or final reward they are trying to unlock.
- How many stages remain before the final goal.

This turns a normal website structure into a visible adventure field, improving site exploration and giving visitors a reason to move through multiple pages.

## Rewards And Campaign Use

Stage clear rewards can be shown only after the visitor clears the game.

Examples:

- Coupon code.
- Bonus page URL.
- Special campaign message.
- Product offer.
- Hidden download.
- Event reward.

This makes CharaBreak useful for campaigns where the visitor should interact with the page before receiving the offer.

## Privacy

CharaBreak is designed to avoid personal data collection in the MVP.

When basic logging is enabled, it can store anonymous events such as:

- `game_start`
- `game_exit`
- `element_hit`
- `word_collect`
- `inventory_open`
- `stage_soft_clear`

Stored data may include:

- Anonymous session ID.
- Page ID.
- Page URL.
- Event type.
- Element type.
- Viewport size.
- Scroll position.
- Timestamp.

The plugin does not need to collect names, email addresses, or other personal information for the core game experience.

## FAQ

### Does CharaBreak permanently destroy my page?

No. The effects are visual and game-state based. Reloading the page or exiting game mode restores the normal page.

### Can I use it with Elementor?

Yes. CharaBreak can run on Elementor-built pages. Some complex layouts may need tuning for the best platforming feel.

### Can I choose which pages become stages?

Yes. Use `CharaBreak > Stage Manager` to enable only the pages you want to use as stages.

### Can each page have different enemies or BGM?

Yes. Stage settings are designed so each page can have its own difficulty, enemies, boss, reward, BGM, and play style.

### Can I sell products or coupons after a clear?

Yes. CharaBreak can show rewards, coupon codes, bonus links, and clear-only messages after a stage is completed.

### Why does the gamepad not work in my browser?

Gamepad support depends on the browser's Gamepad API. Try clicking the page once, pressing a controller button, and using Chrome or Edge. If the OS does not expose the controller to the browser, CharaBreak cannot read it.

## Developer Notes

The JavaScript core is kept as framework-agnostic as possible so it can later be adapted outside WordPress.

Main files:

- `charabreak/charabreak.php`: plugin entry point.
- `charabreak/includes/class-gw-plugin.php`: frontend bootstrapping, meta settings, shortcode.
- `charabreak/includes/class-gw-settings.php`: global settings.
- `charabreak/includes/class-gw-admin.php`: admin menu.
- `charabreak/includes/class-gw-enemies.php`: enemy registry.
- `charabreak/includes/class-gw-rest.php`: REST API.
- `charabreak/includes/class-gw-logger.php`: event logging.
- `charabreak/assets/js/gaming-web-core.js`: game lifecycle.
- `charabreak/assets/js/dom-scanner.js`: DOM scanning.
- `charabreak/assets/js/stage-overlay.js`: runner, physics, effects, enemies, game UI.
- `charabreak/assets/js/world-map.js`: world map UI.
- `charabreak/assets/js/audio-manager.js`: BGM, sound effects, fallback audio.
- `charabreak/assets/css/gaming-web.css`: frontend styling.

REST endpoint:

```text
/wp-json/gaming-web/v1/event
```

Event table:

```text
wp_gaming_web_events
```

Internal option keys, table names, and REST namespaces still use the original `gaming_web_*` naming for compatibility.

## Local Development

This repository includes a local WordPress Docker environment.

Start WordPress:

```powershell
docker compose up -d
```

Setup script:

```powershell
.\scripts\setup-wordpress.ps1
```

Local URL:

```text
http://localhost:8089
```

Build the distribution ZIP:

```powershell
.\scripts\build-charabreak-zip.ps1
```

The generated file is:

```text
exports/charabreak.zip
```

For GitHub Releases and Freemius distribution, use the packaged `charabreak.zip`, not the raw repository ZIP.

## Japanese / 日本語補足

CharaBreakは、WordPressの固定ページや投稿を「読む前に遊べる」ステージへ変えるプラグインです。

日本でのプロモーションでは、次のメッセージを中心にしています。

> **読む前に、壊せ。**

今は文章を最初から読んでもらうことが難しい時代です。CharaBreakは、ページをゲーム化することで、訪問者がまずページに触れ、遊び、壊し、守り、咲かせ、結果的にコンテンツへ愛着を持つきっかけを作ります。

### 日本語での使い方

1. `charabreak.zip` をWordPressにアップロードします。
2. プラグインを有効化します。
3. `CharaBreak > Settings` で全体設定を行います。
4. `CharaBreak > Stage Manager` でゲーム化したいページを選びます。
5. ページを開き、ゲーム開始ボタンを押します。

### 無料版とPro版

無料版は、まず1ページをゲーム化してCharaBreakの体験を試してもらう入口です。

Pro版では、複数ページのワールドマップ化、ステージごとのBGM、敵キャラ台帳、ボス、報酬、クーポン、限定URL、Break / Bloom / Hybridのステージ別設定などを開放する方針です。

海外展開を主戦場にしつつ、日本向けには公式サイトや記事で日本語の導入説明、事例、プロモーションを行う想定です。

## License

License details will be finalized before broad public distribution.

Because CharaBreak is a WordPress plugin, a GPL-compatible license is expected for the free distribution package.
