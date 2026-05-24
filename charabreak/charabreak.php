<?php
/**
 * Plugin Name: CharaBreak
 * Description: WordPressページを、文字や画像を足場にして遊べるインタラクティブなステージへ変えるプラグインです。
 * Version: 0.2.38
 * Author: CharaBreak
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Tested up to: 6.9.4
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: gaming-web
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
    exit;
}

if (defined('WP_CLI') && WP_CLI && empty($_SERVER['HTTP_HOST'])) {
    $_SERVER['HTTP_HOST'] = (string) (parse_url(get_site_url(), PHP_URL_HOST) ?: 'localhost');
}

if (!function_exists('cha_fs')) {
    /**
     * Freemius SDK accessor.
     */
    function cha_fs() {
        global $cha_fs;

        if (!isset($cha_fs)) {
            require_once dirname(__FILE__) . '/vendor/freemius/start.php';

            $cha_fs = fs_dynamic_init(array(
                'id'                  => '30130',
                'slug'                => 'charabreak',
                'type'                => 'plugin',
                'public_key'          => 'pk_0636a1bf49411fd942c3fa90367ff',
                'is_premium'          => true,
                'premium_suffix'      => 'Pro',
                'has_premium_version' => true,
                'has_addons'          => false,
                'has_paid_plans'      => true,
                'is_org_compliant'    => true,
                'wp_org_gatekeeper'   => 'OA7#BoRiBNqdf52FvzEf!!074aRLPs8fspif$7K1#4u4Csys1fQlCecVcUTOs2mcpeVHi#C2j9d09fOTvbC0HloPT7fFee5WdS3G',
                'menu'                => array(
                    'support' => false,
                ),
            ));
        }

        return $cha_fs;
    }

    cha_fs();
    do_action('cha_fs_loaded');
}

define('GAMING_WEB_VERSION', '0.2.38');
define('GAMING_WEB_FILE', __FILE__);
define('GAMING_WEB_DIR', plugin_dir_path(__FILE__));
define('GAMING_WEB_URL', plugin_dir_url(__FILE__));

require_once GAMING_WEB_DIR . 'includes/class-gw-settings.php';
require_once GAMING_WEB_DIR . 'includes/class-gw-enemies.php';
require_once GAMING_WEB_DIR . 'includes/class-gw-admin.php';
require_once GAMING_WEB_DIR . 'includes/class-gw-logger.php';
require_once GAMING_WEB_DIR . 'includes/class-gw-rest.php';
require_once GAMING_WEB_DIR . 'includes/class-gw-plugin.php';

register_activation_hook(__FILE__, array('GW_Plugin', 'activate'));

add_action('plugins_loaded', function () {
    load_plugin_textdomain('gaming-web', false, dirname(plugin_basename(__FILE__)) . '/languages');
    GW_Plugin::instance()->init();
});
