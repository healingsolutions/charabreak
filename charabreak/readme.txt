=== CharaBreak ===
Contributors: healingsolutions
Tags: gamification, interactive web, engagement, elementor, game
Requires at least: 6.0
Tested up to: 6.9.4
Requires PHP: 7.4
Stable tag: 0.2.38
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Turn WordPress pages into playable stages. CharaBreak lets visitors attack text, jump across content, defend words, fight enemies, clear pages, and move through a site like a small web adventure.

== Description ==

CharaBreak is an interactive WordPress plugin that transforms selected pages into playable stages.

Instead of asking visitors to read first, CharaBreak invites them to play first: run over headings, attack letters, break visual elements, collect meaningful fragments, block enemy attacks, and reach a clear goal. The original page content is restored by reloading or exiting game mode, so the experience remains playful while the site stays safe.

The plugin is designed for marketing sites, campaign pages, brand sites, product launches, event pages, portfolios, and any website that wants to turn reading into interaction.

日本語メモ:
CharaBreak は「読む前に、壊せ。」をコンセプトにしたインタラクティブWebプラグインです。文章を読まない時代に、まずページで遊んでもらい、結果的に内容へ触れてもらうためのゲーミングWeb体験を作ります。

= What Visitors Can Do =

* Start game mode from a floating button or an in-page start link.
* Control a pixel-style character with keyboard, touch controls, or supported gamepads.
* Walk on text and foreground page elements as platforms.
* Attack letters and page elements with hammer-style effects.
* Throw letters at enemies.
* Defend against enemy attacks.
* Clear stages and unlock rewards or coupons.
* Open a world map to see multiple pages as connected stages.

= What Site Owners Can Configure =

* Enable or disable CharaBreak globally.
* Choose which posts or pages become stages.
* Configure stage labels, order, type, reward text, and clear effects.
* Register enemy characters and boss characters.
* Assign enemies to each stage.
* Set difficulty with simple levels.
* Add stage clear rewards such as coupon codes, secret messages, or bonus URLs.
* Enable or disable lightweight event logging.

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

= 0.2.28 =

* Renamed the public distribution package to CharaBreak / `charabreak`.
* Added Freemius SDK integration.
* Added world map, stage management, enemy registry, rewards, and enhanced gameplay systems.
* Added gamepad, keyboard, and mobile controls.
* Improved stage clear UI and frontend playability.

== Upgrade Notice ==

= 0.2.28 =

This version standardizes the public plugin package as `charabreak.zip`. Upload this package over the existing CharaBreak plugin folder.
