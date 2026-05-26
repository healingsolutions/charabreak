=== CharaBreak ===
Contributors: healingsolutions
Tags: gamification, interactive web, engagement, elementor, game
Requires at least: 6.0
Tested up to: 6.9.4
Requires PHP: 7.4
Stable tag: 0.2.45
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Turn WordPress pages into playable stages. CharaBreak lets visitors attack text, jump across content, defend words, fight enemies, clear pages, and move through a site like a small web adventure.

== Description ==

CharaBreak is an interactive WordPress plugin that transforms selected pages into playable stages.

Instead of asking visitors to read first, CharaBreak invites them to play first: run over headings, attack letters, break visual elements, collect meaningful fragments, block enemy attacks, and reach a clear goal. The original page content is restored by reloading or exiting game mode, so the experience remains playful while the site stays safe.

The plugin is designed for marketing sites, campaign pages, brand sites, product launches, event pages, portfolios, and any website that wants to turn reading into interaction.

Japanese note:
CharaBreak is built around the message "読む前に、壊せ。" Visitors can play with the page before reading it, then naturally become more interested in the content. It can also use Bloom mode, where letters transform into flowers and colorful particles instead of being destroyed.

= What Visitors Can Do =

* Start game mode from a floating button or an in-page start link.
* Control a pixel-style character with keyboard, touch controls, or supported gamepads.
* Walk on text and foreground page elements as platforms.
* Attack letters and page elements with hammer-style effects.
* Transform letters into flowers and light in Bloom mode.
* Throw letters at enemies.
* Defend against enemy attacks.
* Clear stages and unlock rewards or coupons.
* Open a world map to see multiple pages as connected stages.
* Replay stages for local best scores and S/A/B/C ranks.

= What Site Owners Can Configure =

* Enable or disable CharaBreak globally.
* Choose which posts or pages become stages.
* Configure stage labels, order, type, reward text, and clear effects.
* Register enemy characters and boss characters.
* Assign enemies to each stage.
* Set difficulty with simple levels.
* Add stage clear rewards such as coupon codes, secret messages, or bonus URLs.
* Enable or disable lightweight event logging.

= Free And Pro =

The Free plan lets a site owner make one selected page playable with the core CharaBreak experience.

Pro unlocks multi-page adventures, the world map, custom enemy and boss assignment, enemy difficulty presets, stage-specific BGM, final-stage BGM, advanced objectives, and campaign-style rewards.

Freemius handles license activation and upgrades. Do not install a second plugin folder for Pro; a valid Pro license unlocks the Pro features inside the same `charabreak` plugin.

= Social Sharing / OG Image =

CharaBreak includes a branded Open Graph image:

`charabreak/assets/brand/charabreak-og-image.png`

The plugin can print fallback `og:title`, `og:description`, `og:image`, and X/Twitter card metadata for public pages when page-specific social metadata is missing.

If Facebook or another crawler returns `403`, check the host firewall, WAF, bot protection, country/IP restrictions, hotlink protection, Basic authentication, and `robots.txt`. Meta crawler user agents such as `facebookexternalhit`, `Facebot`, `meta-externalagent`, and `meta-externalfetcher` need access to the page HTML and the OG image over HTTPS.

= Replayability / Local High Scores =

Stage clear results can show a total score, S/A/B/C rank, clear time, parry combo, retry count, and best-score update.

Best scores are saved only in the visitor's browser `localStorage`. This MVP does not send personal information or public ranking data.

= How To Start CharaBreak On A Page =

1. Install and activate the plugin.
2. Open the WordPress admin menu: CharaBreak > Stage Management.
3. Enable the pages or posts you want to turn into stages.
4. Save the stage settings.
5. Visit the enabled page and press the game start button.

You can also place a start link inside the page content:

`[gaming_web_start]`

or add a custom element with:

`data-gaming-web-start`

This is useful when you want the game start action to feel like part of the page design instead of only using the floating button.

== Installation ==

1. Download `charabreak.zip` from the official release package.
2. In WordPress, go to Plugins > Add New > Upload Plugin.
3. Upload `charabreak.zip`.
4. Activate CharaBreak.
5. Open CharaBreak > Settings and enable the plugin.
6. Open CharaBreak > Stage Management and choose the pages that should become playable.

== Frequently Asked Questions ==

= Does CharaBreak permanently destroy page content? =

No. CharaBreak is a playful layer over the page experience. Exiting game mode or reloading the page restores the normal page.

= Can I choose which pages become stages? =

Yes. Use CharaBreak > Stage Management to enable only the pages or posts you want.

= Can I use this with Elementor pages? =

Yes. CharaBreak is designed to work with normal WordPress content and Elementor-built pages. Some advanced layouts may need tuning, but the plugin is built around frontend scanning rather than a specific builder.

= Can I offer a reward only after the visitor clears a stage? =

Yes. Stage clear rewards can show coupon codes, bonus links, or private messages after the visitor clears the page.

= Does the plugin collect personal information? =

The MVP event logger stores gameplay events such as stage start, element hit, word collect, and stage clear. It is designed not to collect personal information.

== Screenshots ==

1. CharaBreak playable page mode.
2. World map view for connected stages.
3. Stage management screen.
4. Enemy registry screen.
5. Stage clear reward screen.

== Changelog ==

= 0.2.45 =

* Added explicit Free/Pro feature gates for the public package.
* Limited Free plan gameplay to one enabled stage.
* Locked world map, custom enemies, stage audio, and advanced objectives behind Pro.
* Kept stage clear rewards available for the playable Free stage.
* Removed development-only builder logs, generated Elementor JSON, and old demo import scripts from the distribution package.

= 0.2.44 =

* Restored a safer mobile text platform budget so phones still have enough letters to stand on in later sections.
* Kept mobile attack hit detection limited to the active room cache to avoid returning to full-page scans.
* Rebuilt text platform rectangles from live layout when the room cache refreshes, preventing stale mobile font/layout coordinates from making letters non-solid.

= 0.2.43 =

* Explicitly bumped frontend module cache-busting versions for the next mobile performance build.
* Restricted mobile text and image hit checks to the active room cache instead of scanning the full page on every attack.
* Reduced mobile target and text budgets again to lower late-stage memory pressure.
* Further throttled mobile HUD, camera UI, enemy, projectile, gate, and route refreshes.
* Disabled costly page-text shadows, text break animations, image `will-change`, and page-wide shake during mobile play.
* Reduced mobile flower and temporary effect caps so long sessions do not accumulate visual load.

= 0.2.42 =

* Added a more aggressive mobile ultra-light mode for long pages and lower-page play.
* Reduced mobile scan and wrapped-character budgets to lower memory use on phones.
* Suppressed page-wide shake and nonessential particle effects on mobile.
* Cached mobile text collision rectangles so scrolling and falling do not repeatedly measure every letter.
* Suppressed duplicate scroll-sync work while the game camera scrolls the page.
* Slowed nonessential mobile enemy, chest, projectile, gate, and route checks while keeping runner input responsive.

= 0.2.41 =

* Expanded charged attack hit areas on mobile so saved-up attacks break a visibly wider space.
* Increased charged attack letter-break limits without adding heavy mobile particle effects.
* Improved mobile fall camera catch-up so the character is less likely to outrun the viewport during fast drops.
* Throttled mobile camera-side UI refreshes while keeping placed letters synced to scroll.

= 0.2.40 =

* Added a mobile low-power gameplay mode for phones and coarse-pointer devices.
* Reduced mobile-only visual effect counts, lifetimes, shadows, and screen shake.
* Reduced mobile text wrapping and page scan limits to lower memory pressure.
* Throttled mobile enemy, HUD, dust, fall trail, flower, chest, image chip, and debris updates.
* Kept desktop visual impact unchanged while making phone controls more responsive.

= 0.2.39 =

* Added fallback Open Graph and X/Twitter metadata output for CharaBreak pages.
* Added local stage score calculation with S/A/B/C ranks.
* Added local best score, attempt count, and best rank storage in browser localStorage.
* Added score and rank display to the stage clear screen.
* Added best-rank badges to the world map.
* Kept gameplay score data local-only and out of anonymous event logs.
* Updated cache-busting version strings for frontend modules.

= 0.2.28 =

* Renamed the public distribution package to CharaBreak / `charabreak`.
* Added Freemius SDK integration.
* Added world map, stage management, enemy registry, rewards, and enhanced gameplay systems.
* Added gamepad, keyboard, and mobile controls.
* Improved stage clear UI and frontend playability.

== Upgrade Notice ==

= 0.2.45 =

Public distribution build. Free sites can play one stage, while Pro unlocks multi-page maps, custom enemies, stage audio, and advanced objectives.

= 0.2.44 =

Recommended for mobile gameplay. This build restores reliable text platforms while preserving the active-room performance optimizations.

= 0.2.43 =

Recommended for mobile sites. This build further limits late-stage hit detection and GPU-heavy effects on phones.

= 0.2.42 =

Recommended for mobile-heavy sites. This release reduces mobile memory pressure and scroll-related jank during long-page gameplay.

= 0.2.41 =

Improves mobile charged attack impact and fast-fall camera follow behavior while preserving the low-power mobile profile.

= 0.2.40 =

Improves mobile playability by dramatically reducing mobile-only effects and memory pressure. Recommended for all public sites.

= 0.2.39 =

Adds social preview recovery helpers and local high-score replayability. Upload this package over the existing `charabreak` plugin folder.

= 0.2.28 =

This version standardizes the public plugin package as `charabreak.zip`. Upload this package over the existing CharaBreak plugin folder.
