<?php

if (!defined('ABSPATH')) {
    exit;
}

set_time_limit(0);

require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

if (!function_exists('gw_cb_asset_log')) {
    function gw_cb_asset_log(string $message): void
    {
        if (class_exists('WP_CLI')) {
            WP_CLI::log($message);
            return;
        }

        echo $message . "\n";
    }
}

if (!function_exists('gw_cb_find_brand_asset')) {
    function gw_cb_find_brand_asset(string $file): int
    {
        $attachments = get_posts(array(
            'post_type' => 'attachment',
            'post_status' => 'inherit',
            'posts_per_page' => 1,
            'fields' => 'ids',
            'meta_key' => '_charabreak_brand_asset',
            'meta_value' => $file,
        ));

        return !empty($attachments) ? (int) $attachments[0] : 0;
    }
}

$assets = array(
    array(
        'file' => 'charabreak-logo-transparent-hd.png',
        'title' => 'CharaBreak Brand Logo Transparent HD',
        'alt' => 'CharaBreak high resolution pixel character logo with transparent background',
        'site_icon' => true,
    ),
    array(
        'file' => 'charabreak-logo-transparent.png',
        'title' => 'CharaBreak Brand Logo Transparent',
        'alt' => 'CharaBreak pixel character logo with transparent background',
    ),
    array(
        'file' => 'charabreak-logo.png',
        'title' => 'CharaBreak Brand Logo',
        'alt' => 'CharaBreak pixel character logo',
    ),
    array(
        'file' => 'charabreak-hero-smash.png',
        'title' => 'CharaBreak Hero Smash',
        'alt' => 'Pixel character smashing a website into CharaBreak fragments',
    ),
    array(
        'file' => 'charabreak-feature-dashboard.png',
        'title' => 'CharaBreak Feature Dashboard',
        'alt' => 'Game-like analytics dashboard for CharaBreak features',
    ),
    array(
        'file' => 'charabreak-demo-world.png',
        'title' => 'CharaBreak Demo World',
        'alt' => 'Playable web pages connected as a CharaBreak demo world',
    ),
    array(
        'file' => 'charabreak-pricing-worlds.png',
        'title' => 'CharaBreak Pricing Worlds',
        'alt' => 'Free and Pro CharaBreak worlds connected by glowing paths',
    ),
    array(
        'file' => 'charabreak-boss-gate.png',
        'title' => 'CharaBreak Boss Gate',
        'alt' => 'Locked gate and shadow boss in the CharaBreak world',
    ),
    array(
        'file' => 'charabreak-analytics-dashboard.png',
        'title' => 'CharaBreak Analytics Dashboard',
        'alt' => 'CharaBreak analytics and progression dashboard',
    ),
    array(
        'file' => 'charabreak-locked-gate.png',
        'title' => 'CharaBreak Locked Gate',
        'alt' => 'CharaBreak locked portal with game rewards',
    ),
);

$base_dir = dirname(__DIR__) . '/assets/brand';
$imported = 0;

foreach ($assets as $asset) {
    $existing_id = gw_cb_find_brand_asset($asset['file']);
    if ($existing_id > 0) {
        gw_cb_asset_log('Exists: ' . $asset['title'] . ' #' . $existing_id);
        if (!empty($asset['site_icon'])) {
            update_option('site_icon', $existing_id);
            set_theme_mod('custom_logo', $existing_id);
        }
        continue;
    }

    $source = trailingslashit($base_dir) . $asset['file'];
    if (!file_exists($source)) {
        gw_cb_asset_log('Missing: ' . $source);
        continue;
    }

    $tmp = wp_tempnam($asset['file']);
    if (!$tmp || !copy($source, $tmp)) {
        gw_cb_asset_log('Could not prepare: ' . $asset['file']);
        continue;
    }

    $file_array = array(
        'name' => $asset['file'],
        'tmp_name' => $tmp,
    );

    $attachment_id = media_handle_sideload($file_array, 0, $asset['title']);
    if (is_wp_error($attachment_id)) {
        @unlink($tmp);
        gw_cb_asset_log('Import failed: ' . $asset['title'] . ' - ' . $attachment_id->get_error_message());
        continue;
    }

    update_post_meta($attachment_id, '_wp_attachment_image_alt', $asset['alt']);
    update_post_meta($attachment_id, '_charabreak_brand_asset', $asset['file']);
    wp_update_post(array(
        'ID' => $attachment_id,
        'post_title' => $asset['title'],
        'post_excerpt' => $asset['alt'],
    ));

    if (!empty($asset['site_icon'])) {
        update_option('site_icon', $attachment_id);
        set_theme_mod('custom_logo', $attachment_id);
    }

    $imported++;
    gw_cb_asset_log('Imported: ' . $asset['title'] . ' #' . $attachment_id);
}

if (class_exists('WP_CLI')) {
    WP_CLI::success('CharaBreak brand assets ready. Imported ' . $imported . ' new file(s).');
}
