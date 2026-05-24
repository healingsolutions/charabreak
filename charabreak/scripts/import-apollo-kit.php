<?php

if (!defined('ABSPATH')) {
    exit;
}

set_time_limit(0);

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

if (!function_exists('gw_apollo_cli_note')) {
    function gw_apollo_cli_note(string $message): void
    {
        if (class_exists('WP_CLI')) {
            WP_CLI::log($message);
            return;
        }

        echo $message . "\n";
    }
}

if (!function_exists('gw_apollo_load_json')) {
    function gw_apollo_load_json(string $template_dir, string $file): array
    {
        $path = trailingslashit($template_dir) . $file;
        if (!file_exists($path)) {
            return array();
        }

        $json = json_decode((string) file_get_contents($path), true);
        return is_array($json) ? $json : array();
    }
}

if (!function_exists('gw_apollo_start_container')) {
    function gw_apollo_start_container(string $page_title): array
    {
        return array(
            'id' => substr(md5('gw-apollo-start-' . $page_title), 0, 8),
            'settings' => array(
                'content_width' => 'full',
                'flex_direction' => 'row',
                'flex_justify_content' => 'center',
                'flex_align_items' => 'center',
                'padding' => array(
                    'unit' => 'px',
                    'top' => '14',
                    'right' => '18',
                    'bottom' => '14',
                    'left' => '18',
                    'isLinked' => false,
                ),
                'background_background' => 'classic',
                'background_color' => '#071723',
                '_title' => 'Gaming Web Start Bar',
            ),
            'elements' => array(
                array(
                    'id' => substr(md5('gw-apollo-start-html-' . $page_title), 0, 8),
                    'settings' => array(
                        'html' => '<div class="gw-apollo-start"><div><strong>Interactive Business Demo</strong><span>Elementor kit demo with Gaming Web play mode.</span></div><a href="#gaming-web-start" class="gw-inline-start gw-apollo-start__button" data-gaming-web-start>&#12466;&#12540;&#12512;&#12434;&#22987;&#12417;&#12427;</a></div>',
                    ),
                    'elements' => array(),
                    'isInner' => false,
                    'widgetType' => 'html',
                    'elType' => 'widget',
                ),
            ),
            'isInner' => false,
            'elType' => 'container',
        );
    }
}

if (!function_exists('gw_apollo_create_categories')) {
    function gw_apollo_create_categories(): array
    {
        $terms = array(
            'apollo-strategy' => 'Apollo Strategy',
            'apollo-growth' => 'Apollo Growth',
            'apollo-operations' => 'Apollo Operations',
            'apollo-leadership' => 'Apollo Leadership',
            'apollo-finance' => 'Apollo Finance',
        );
        $ids = array();

        foreach ($terms as $slug => $name) {
            $term = term_exists($slug, 'category');
            if (!$term) {
                $term = wp_insert_term($name, 'category', array('slug' => $slug));
            }

            if (!is_wp_error($term)) {
                $ids[$slug] = (int) (is_array($term) ? $term['term_id'] : $term);
            }
        }

        return $ids;
    }
}

if (!function_exists('gw_apollo_is_remote_asset')) {
    function gw_apollo_is_remote_asset(string $url): bool
    {
        return (bool) preg_match('#^https?://pai\.nomadenstudio\.com/(apollo|athena)/wp-content/uploads/#', $url);
    }
}

if (!function_exists('gw_apollo_sideload_asset')) {
    function gw_apollo_sideload_asset(string $url, array &$media_map, array &$stats): array
    {
        if (!gw_apollo_is_remote_asset($url)) {
            return array('id' => 0, 'url' => $url);
        }

        if (!empty($media_map[$url])) {
            $existing_url = wp_get_attachment_url((int) $media_map[$url]);
            if ($existing_url) {
                return array('id' => (int) $media_map[$url], 'url' => $existing_url);
            }
        }

        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';

        $attachment_id = media_sideload_image($url, 0, null, 'id');
        if (is_wp_error($attachment_id)) {
            $stats['media_failed']++;
            return array('id' => 0, 'url' => $url);
        }

        $attachment_id = (int) $attachment_id;
        $media_map[$url] = $attachment_id;
        $stats['media_imported']++;

        $local_url = wp_get_attachment_url($attachment_id);
        return array('id' => $attachment_id, 'url' => $local_url ? $local_url : $url);
    }
}

if (!function_exists('gw_apollo_create_demo_posts')) {
    function gw_apollo_create_demo_posts(array &$media_map, array &$stats): array
    {
        $category_ids = gw_apollo_create_categories();
        $image_urls = array(
            'https://pai.nomadenstudio.com/apollo/wp-content/uploads/sites/4/2024/07/business-people-meeting-conference-discussion-corp-U65KMHX-800x450.jpg',
            'https://pai.nomadenstudio.com/apollo/wp-content/uploads/sites/4/2024/07/confident-professionals-walking-forward-in-a-moder-NX49UZ8-utm_nooverride1-800x533.jpg',
            'https://pai.nomadenstudio.com/apollo/wp-content/uploads/sites/4/2024/07/collaboration-and-analysis-by-business-people-work-EQZZQEW-800x450.jpg',
            'https://pai.nomadenstudio.com/apollo/wp-content/uploads/sites/4/2024/07/diverse-business-team-sharing-ideas-in-meeting-SVE8M4G.jpg',
            'https://pai.nomadenstudio.com/apollo/wp-content/uploads/sites/4/2024/07/african-american-businesswoman-showing-marketing-g-EY24MZ4.jpg',
            'https://pai.nomadenstudio.com/apollo/wp-content/uploads/sites/4/2024/07/happy-business-colleagues-signing-contract-at-ware-K8JLN2T.jpg',
        );
        $posts = array(
            array('slug' => 'apollo-market-signals', 'title' => 'Reading Market Signals Before the Shift', 'cat' => 'apollo-strategy'),
            array('slug' => 'apollo-team-decisions', 'title' => 'How Teams Make Faster Decisions Together', 'cat' => 'apollo-leadership'),
            array('slug' => 'apollo-growth-map', 'title' => 'A Practical Growth Map for Complex Services', 'cat' => 'apollo-growth'),
            array('slug' => 'apollo-operating-rhythm', 'title' => 'Building an Operating Rhythm That Holds', 'cat' => 'apollo-operations'),
            array('slug' => 'apollo-finance-review', 'title' => 'Turning Finance Reviews into Clear Choices', 'cat' => 'apollo-finance'),
            array('slug' => 'apollo-client-trust', 'title' => 'Small Signals That Build Client Trust', 'cat' => 'apollo-strategy'),
        );
        $post_ids = array();

        foreach ($posts as $index => $post) {
            $existing = get_page_by_path($post['slug'], OBJECT, 'post');
            $post_data = array(
                'post_type' => 'post',
                'post_status' => 'publish',
                'post_title' => $post['title'],
                'post_name' => $post['slug'],
                'post_excerpt' => 'A concise consulting note used by the Apollo demo to make blog and archive widgets feel complete.',
                'post_content' => '<p>This Apollo demo article gives the business layout enough real content for cards, links, text blocks, and Gaming Web interactions.</p><p>Use the page as a serious consulting site first, then start the game and turn the same content into a playful stage.</p>',
            );

            if ($existing instanceof WP_Post) {
                $post_data['ID'] = $existing->ID;
            }

            $post_id = wp_insert_post(wp_slash($post_data), true);
            if (is_wp_error($post_id)) {
                continue;
            }

            if (!empty($category_ids[$post['cat']])) {
                wp_set_post_terms($post_id, array($category_ids[$post['cat']]), 'category');
            }

            if (!empty($image_urls[$index])) {
                $image = gw_apollo_sideload_asset($image_urls[$index], $media_map, $stats);
                if (!empty($image['id'])) {
                    set_post_thumbnail($post_id, $image['id']);
                }
            }

            $post_ids[] = $post_id;
        }

        return array_values($category_ids);
    }
}

if (!function_exists('gw_apollo_apply_global_settings')) {
    function gw_apollo_apply_global_settings(string $template_dir): void
    {
        $global = gw_apollo_load_json($template_dir, 'global.json');
        if (empty($global['page_settings']) || !is_array($global['page_settings'])) {
            return;
        }

        gw_apollo_normalize_typography_units($global['page_settings']);

        $kit_id = (int) get_option('elementor_active_kit');
        if (!$kit_id) {
            return;
        }

        $current = get_post_meta($kit_id, '_elementor_page_settings', true);
        $current = is_array($current) ? $current : array();
        update_post_meta($kit_id, '_elementor_page_settings', array_merge($current, $global['page_settings']));
    }
}

if (!function_exists('gw_apollo_normalize_typography_units')) {
    function gw_apollo_normalize_typography_units(array &$node): void
    {
        foreach ($node as $key => &$value) {
            if (is_array($value)) {
                if (
                    strpos((string) $key, 'font_size') !== false
                    && isset($value['unit'], $value['size'])
                    && $value['unit'] === 'rem'
                    && is_numeric($value['size'])
                ) {
                    $value['unit'] = 'px';
                    $value['size'] = round(((float) $value['size']) * 10, 2);
                }

                gw_apollo_normalize_typography_units($value);
            }
        }
        unset($value);
    }
}

if (!function_exists('gw_apollo_rekey_elementor_data')) {
    function gw_apollo_rekey_elementor_data(array &$nodes, string $seed): void
    {
        foreach ($nodes as &$node) {
            if (!is_array($node)) {
                continue;
            }

            if (!empty($node['id']) && is_string($node['id'])) {
                $node['id'] = substr(md5($seed . '-' . $node['id']), 0, 8);
            }

            foreach ($node as &$value) {
                if (is_array($value)) {
                    gw_apollo_rekey_elementor_data($value, $seed);
                }
            }
            unset($value);
        }
        unset($node);
    }
}

if (!function_exists('gw_apollo_normalize_elementor_data')) {
    function gw_apollo_normalize_elementor_data(array &$node, array $category_ids, array &$media_map, array &$stats): void
    {
        if (!empty($node['url']) && is_string($node['url']) && gw_apollo_is_remote_asset($node['url'])) {
            $asset = gw_apollo_sideload_asset($node['url'], $media_map, $stats);
            $node['url'] = $asset['url'];

            if (array_key_exists('id', $node)) {
                $node['id'] = $asset['id'];
                $node['source'] = $asset['id'] ? 'library' : ($node['source'] ?? '');
            }
        }

        $animation_keys = array(
            '_animation',
            '_animation_delay',
            '_animation_duration',
            '_animation_tablet',
            '_animation_mobile',
            'animation',
            'animation_delay',
            'animation_duration',
        );

        foreach ($node as $key => &$value) {
            if (is_string($value) && gw_apollo_is_remote_asset($value)) {
                $asset = gw_apollo_sideload_asset($value, $media_map, $stats);
                $value = $asset['url'];
                continue;
            }

            if (is_array($value)) {
                gw_apollo_normalize_elementor_data($value, $category_ids, $media_map, $stats);
            }
        }
        unset($value);

        if (!empty($node['settings']) && is_array($node['settings'])) {
            gw_apollo_normalize_typography_units($node['settings']);

            foreach ($animation_keys as $key) {
                unset($node['settings'][$key]);
            }

            if (!empty($node['settings']['ekit_blog_posts_cats']) || (($node['widgetType'] ?? '') === 'elementskit-blog-posts')) {
                $node['settings']['ekit_blog_posts_cats'] = array_map('strval', $category_ids);
                $node['settings']['ekit_blog_posts_num'] = 6;
            }
        }

    }
}

if (!function_exists('gw_apollo_force_dark_section_contrast')) {
    function gw_apollo_force_dark_section_contrast(array &$node): void
    {
        if (!empty($node['settings']) && is_array($node['settings'])) {
            $settings = &$node['settings'];
            $widget_type = (string) ($node['widgetType'] ?? '');

            if ($widget_type === 'heading') {
                $settings['title_color'] = '#FFFFFF';
                unset($settings['__globals__']['title_color']);
            }

            if ($widget_type === 'text-editor') {
                $settings['text_color'] = '#D1D1D1';
                unset($settings['__globals__']['text_color']);
            }

            if ($widget_type === 'button') {
                $settings['button_text_color'] = '#FFFFFF';
                $settings['background_background'] = 'classic';
                $settings['background_color'] = '#0077B6';
                $settings['border_color'] = '#0077B6';
                $settings['button_background_hover_background'] = 'classic';
                $settings['button_background_hover_color'] = '#03045E';
                unset($settings['__globals__']['button_text_color'], $settings['__globals__']['background_color'], $settings['__globals__']['border_color'], $settings['__globals__']['button_background_hover_color']);
            }

            if ($widget_type === 'icon-list') {
                $settings['text_color'] = '#FFFFFF';
                $settings['icon_color'] = '#0077B6';
                unset($settings['__globals__']['text_color'], $settings['__globals__']['icon_color']);
            }

            if ($widget_type === 'counter') {
                $settings['number_color'] = '#FFFFFF';
                $settings['title_color'] = '#D1D1D1';
                unset($settings['__globals__']['number_color'], $settings['__globals__']['title_color']);
            }

            unset($settings);
        }

        foreach ($node as &$value) {
            if (is_array($value)) {
                gw_apollo_force_dark_section_contrast($value);
            }
        }
        unset($value);
    }
}

if (!function_exists('gw_apollo_prepare_page_content')) {
    function gw_apollo_prepare_page_content(array $content): array
    {
        $dark_section_titles = array('Home Hero', 'Services', 'Counter & Testimonials', 'CTA');

        foreach ($content as &$section) {
            if (!is_array($section)) {
                continue;
            }

            $section_title = (string) ($section['settings']['_title'] ?? '');
            $has_background_image = !empty($section['settings']['background_overlay_image']) || !empty($section['settings']['background_image']);

            if (in_array($section_title, $dark_section_titles, true) || $has_background_image) {
                gw_apollo_force_dark_section_contrast($section);
            }
        }
        unset($section);

        return $content;
    }
}

if (!function_exists('gw_apollo_create_menu')) {
    function gw_apollo_create_menu(array $created_ids): void
    {
        $menu_name = 'athena-menus';
        $menu = wp_get_nav_menu_object($menu_name);
        if ($menu) {
            $menu_id = (int) $menu->term_id;
        } else {
            $created_menu = wp_create_nav_menu($menu_name);
            if (is_wp_error($created_menu)) {
                return;
            }
            $menu_id = (int) $created_menu;
        }

        if (!$menu_id) {
            return;
        }

        $items = wp_get_nav_menu_items($menu_id);
        if ($items) {
            foreach ($items as $item) {
                wp_delete_post((int) $item->ID, true);
            }
        }

        $labels = array(
            'apollo-business-gaming-demo' => 'Home',
            'apollo-about-gaming-demo' => 'About',
            'apollo-services-gaming-demo' => 'Services',
            'apollo-case-studies-gaming-demo' => 'Case Studies',
            'apollo-pricing-gaming-demo' => 'Pricing',
            'apollo-faq-gaming-demo' => 'FAQ',
            'apollo-contact-gaming-demo' => 'Contact',
        );

        foreach ($labels as $slug => $label) {
            if (empty($created_ids[$slug])) {
                continue;
            }

            wp_update_nav_menu_item($menu_id, 0, array(
                'menu-item-title' => $label,
                'menu-item-object-id' => (int) $created_ids[$slug],
                'menu-item-object' => 'page',
                'menu-item-type' => 'post_type',
                'menu-item-status' => 'publish',
            ));
        }
    }
}

$stats = array(
    'media_imported' => 0,
    'media_failed' => 0,
);
$media_map = get_option('gaming_web_apollo_media_map', array());
$media_map = is_array($media_map) ? $media_map : array();

gw_apollo_apply_global_settings($template_dir);
$demo_category_ids = gw_apollo_create_demo_posts($media_map, $stats);

$header = gw_apollo_load_json($template_dir, 'header.json');
$footer = gw_apollo_load_json($template_dir, 'footer.json');
$header_content = !empty($header['content']) && is_array($header['content']) ? $header['content'] : array();
$footer_content = !empty($footer['content']) && is_array($footer['content']) ? $footer['content'] : array();
foreach ($footer_content as &$footer_section) {
    if (is_array($footer_section)) {
        gw_apollo_force_dark_section_contrast($footer_section);
    }
}
unset($footer_section);

$created_ids = array();

foreach ($templates as $template) {
    $json = gw_apollo_load_json($template_dir, $template['file']);
    if (empty($json['content']) || !is_array($json['content'])) {
        continue;
    }

    $existing = get_page_by_path($template['slug'], OBJECT, 'page');
    $post_data = array(
        'post_type' => 'page',
        'post_status' => 'publish',
        'post_title' => $template['title'],
        'post_name' => $template['slug'],
        'post_content' => '<!-- wp:paragraph --><p>[gaming_web_start label="GAME START"]</p><!-- /wp:paragraph -->',
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

    $page_content = gw_apollo_prepare_page_content($json['content']);

    $content = array_merge(
        array(gw_apollo_start_container($template['title'])),
        $header_content,
        $page_content,
        $footer_content
    );

    gw_apollo_rekey_elementor_data($content, $template['slug']);
    gw_apollo_normalize_elementor_data($content, $demo_category_ids, $media_map, $stats);

    update_post_meta($post_id, '_elementor_edit_mode', 'builder');
    update_post_meta($post_id, '_elementor_template_type', 'wp-page');
    update_post_meta($post_id, '_elementor_version', defined('ELEMENTOR_VERSION') ? ELEMENTOR_VERSION : '4.0.9');
    update_post_meta($post_id, '_elementor_data', wp_slash(wp_json_encode($content)));
    update_post_meta($post_id, '_elementor_page_settings', array());
    update_post_meta($post_id, '_wp_page_template', 'elementor_canvas');

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

gw_apollo_create_menu($created_ids);
update_option('gaming_web_apollo_media_map', $media_map, false);

if (class_exists('\Elementor\Plugin')) {
    \Elementor\Plugin::$instance->files_manager->clear_cache();
}

$message = sprintf(
    'Apollo Elementor gaming demo imported: %d pages, %d media files, %d media failures.',
    count($created_ids),
    $stats['media_imported'],
    $stats['media_failed']
);

if (class_exists('WP_CLI')) {
    WP_CLI::success($message);
} else {
    echo $message . "\n";
}
