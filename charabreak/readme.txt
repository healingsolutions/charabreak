=== CharaBreak ===
Contributors: healingsolutions
Tags: gamification, interactive web, engagement, elementor, game
Requires at least: 6.0
Tested up to: 6.9.4
Requires PHP: 7.4
Stable tag: 0.2.41
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

= 0.2.41 =

Improves mobile charged attack impact and fast-fall camera follow behavior while preserving the low-power mobile profile.

= 0.2.40 =

Improves mobile playability by dramatically reducing mobile-only effects and memory pressure. Recommended for all public sites.

= 0.2.39 =

Adds social preview recovery helpers and local high-score replayability. Upload this package over the existing `charabreak` plugin folder.

= 0.2.28 =

This version standardizes the public plugin package as `charabreak.zip`. Upload this package over the existing CharaBreak plugin folder.
