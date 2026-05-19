<?php
/**
 * Plugin Name: Gaming Web
 * Description: Adds a playful temporary game mode to enabled WordPress pages.
 * Version: 0.1.40
 * Author: Gaming Web MVP
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Text Domain: gaming-web
 */

if (!defined('ABSPATH')) {
    exit;
}

define('GAMING_WEB_VERSION', '0.1.40');
define('GAMING_WEB_FILE', __FILE__);
define('GAMING_WEB_DIR', plugin_dir_path(__FILE__));
define('GAMING_WEB_URL', plugin_dir_url(__FILE__));

require_once GAMING_WEB_DIR . 'includes/class-gw-settings.php';
require_once GAMING_WEB_DIR . 'includes/class-gw-logger.php';
require_once GAMING_WEB_DIR . 'includes/class-gw-rest.php';
require_once GAMING_WEB_DIR . 'includes/class-gw-plugin.php';

register_activation_hook(__FILE__, array('GW_Plugin', 'activate'));

add_action('plugins_loaded', function () {
    GW_Plugin::instance()->init();
});
