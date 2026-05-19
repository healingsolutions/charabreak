<?php

if (!defined('ABSPATH')) {
    exit;
}

$template_dir = defined('GAMING_WEB_DIR')
    ? GAMING_WEB_DIR . '_tmp_apollo/templates'
    : __DIR__ . '/../_tmp_apollo/templates';

if (!is_dir($template_dir)) {
    if (class_exists('WP_CLI')) {
        WP_CLI::error('Apollo template directory was not found: ' . $template_dir);
    }

    echo "Apollo template directory was not found: {$template_dir}\n";
    return;
}

$templates = array(
    array('file' => 'homepage.json', 'title' => 'Apollo Business Gaming Demo', 'slug' => 'apollo-business-gaming-demo'),
    array('file' => 'about-us.json', 'title' => 'Apollo About Gaming Demo', 'slug' => 'apollo-about-gaming-demo'),
    array('file' => 'services.json', 'title' => 'Apollo Services Gaming Demo', 'slug' => 'apollo-services-gaming-demo'),
    array('file' => 'case-studies.json', 'title' => 'Apollo Case Studies Gaming Demo', 'slug' => 'apollo-case-studies-gaming-demo'),
    array('file' => 'pricing-plan.json', 'title' => 'Apollo Pricing Gaming Demo', 'slug' => 'apollo-pricing-gaming-demo'),
    array('file' => 'faq.json', 'title' => 'Apollo FAQ Gaming Demo', 'slug' => 'apollo-faq-gaming-demo'),
    array('file' => 'contact-us.json', 'title' => 'Apollo Contact Gaming Demo', 'slug' => 'apollo-contact-gaming-demo'),
);

$created_ids = array();

foreach ($templates as $template) {
    $path = trailingslashit($template_dir) . $template['file'];
    if (!file_exists($path)) {
        continue;
    }

    $raw = file_get_contents($path);
    $json = json_decode($raw, true);
    if (!is_array($json) || empty($json['content']) || !is_array($json['content'])) {
        continue;
    }

    $existing = get_page_by_path($template['slug'], OBJECT, 'page');
    $post_data = array(
        'post_type' => 'page',
        'post_status' => 'publish',
        'post_title' => $template['title'],
        'post_name' => $template['slug'],
        'post_content' => '<!-- wp:paragraph --><p>[gaming_web_start label="このビジネスサイトで遊ぶ"]</p><!-- /wp:paragraph -->',
        'comment_status' => 'closed',
        'ping_status' => 'closed',
    );

    if ($existing instanceof WP_Post) {
        $post_data['ID'] = $existing->ID;
    }

    $post_id = wp_insert_post(wp_slash($post_data), true);
    if (is_wp_error($post_id)) {
        continue;
    }

    $metadata = isset($json['metadata']) && is_array($json['metadata']) ? $json['metadata'] : array();
    $page_template = sanitize_key((string) ($metadata['wp_page_template'] ?? 'elementor_header_footer'));
    if ($page_template === '') {
        $page_template = 'elementor_header_footer';
    }

    update_post_meta($post_id, '_elementor_edit_mode', 'builder');
    update_post_meta($post_id, '_elementor_template_type', 'wp-page');
    update_post_meta($post_id, '_elementor_version', defined('ELEMENTOR_VERSION') ? ELEMENTOR_VERSION : '4.0.9');
    update_post_meta($post_id, '_elementor_data', wp_slash(wp_json_encode($json['content'])));
    update_post_meta($post_id, '_elementor_page_settings', array());
    update_post_meta($post_id, '_wp_page_template', $page_template);

    update_post_meta($post_id, '_gaming_web_mode', 'enabled');
    update_post_meta($post_id, '_gaming_web_important_words', 'strategy, growth, trust, insight, value');
    update_post_meta($post_id, '_gaming_web_stage_name', 'Apollo Business Stage / ' . $template['title']);
    update_post_meta($post_id, '_gaming_web_reward_enabled', '1');
    update_post_meta($post_id, '_gaming_web_reward_title', 'Business Stage Clear Reward');
    update_post_meta($post_id, '_gaming_web_reward_message', 'You reached the end of a serious business page and turned it into a playful memory.');
    update_post_meta($post_id, '_gaming_web_reward_coupon_code', 'APOLLO-CLEAR-' . str_pad((string) (count($created_ids) + 1), 2, '0', STR_PAD_LEFT));
    update_post_meta($post_id, '_gaming_web_reward_url', home_url('/?page_id=' . $post_id));

    $created_ids[$template['slug']] = $post_id;
}

if (!empty($created_ids['apollo-business-gaming-demo'])) {
    update_option('show_on_front', 'page');
    update_option('page_on_front', $created_ids['apollo-business-gaming-demo']);
}

if (class_exists('\Elementor\Plugin')) {
    \Elementor\Plugin::$instance->files_manager->clear_cache();
}

if (class_exists('WP_CLI')) {
    WP_CLI::success('Apollo Elementor gaming demo imported: ' . count($created_ids) . ' pages.');
} else {
    echo 'Apollo Elementor gaming demo imported: ' . count($created_ids) . " pages.\n";
}
