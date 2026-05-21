<?php

if (!defined('ABSPATH')) {
    exit;
}

class GW_Plugin
{
    private static ?GW_Plugin $instance = null;
    private GW_Settings $settings;
    private GW_REST $rest;
    private array $frontend_config_for_footer = array();

    public static function instance(): GW_Plugin
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public static function activate(): void
    {
        GW_Settings::add_default_options();
        GW_Logger::create_table();
    }

    private function __construct()
    {
        $this->settings = new GW_Settings();
        $this->rest = new GW_REST();
    }

    public function init(): void
    {
        $this->settings->init();
        $this->rest->init();

        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
        add_filter('script_loader_tag', array($this, 'mark_adapter_as_module'), 10, 3);
        add_action('add_meta_boxes', array($this, 'add_meta_boxes'));
        add_action('save_post', array($this, 'save_meta_box'));
        add_shortcode('gaming_web_start', array($this, 'render_start_shortcode'));
    }

    public function enqueue_frontend_assets(): void
    {
        if (!is_singular() || !$this->is_enabled_for_current_post()) {
            return;
        }

        wp_enqueue_style(
            'gaming-web',
            GAMING_WEB_URL . 'assets/css/gaming-web.css',
            array(),
            GAMING_WEB_VERSION
        );

        wp_enqueue_script('jquery');

        wp_enqueue_script(
            'gaming-web-adapter',
            GAMING_WEB_URL . 'assets/js/wordpress-adapter.js',
            array(),
            GAMING_WEB_VERSION,
            true
        );

        $this->frontend_config_for_footer = $this->frontend_config();
        add_action('wp_footer', array($this, 'print_frontend_config'), 19);
    }

    public function print_frontend_config(): void
    {
        if (empty($this->frontend_config_for_footer)) {
            return;
        }

        $frontend_config = wp_json_encode(
            $this->frontend_config_for_footer,
            JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
        );

        echo '<script id="gaming-web-config" type="application/json">' . ($frontend_config ?: '{}') . '</script>' . "\n";
    }

    public function mark_adapter_as_module(string $tag, string $handle, string $src): string
    {
        if ($handle !== 'gaming-web-adapter') {
            return $tag;
        }

        return sprintf(
            '<script type="module" src="%s" id="%s-js"></script>' . "\n",
            esc_url($src),
            esc_attr($handle)
        );
    }

    public function render_start_shortcode($atts = array()): string
    {
        if (!is_singular() || !$this->is_enabled_for_current_post()) {
            return '';
        }

        $atts = shortcode_atts(
            array(
                'label' => $this->localized_default_option(GW_Settings::OPTION_BUTTON_LABEL),
                'class' => '',
            ),
            $atts,
            'gaming_web_start'
        );

        $label = trim((string) $atts['label']);
        if ($label === '') {
            $label = $this->localized_default_option(GW_Settings::OPTION_BUTTON_LABEL);
        }

        $classes = array('gw-inline-start');
        $extra_classes = preg_split('/\s+/', (string) $atts['class']);
        $extra_classes = is_array($extra_classes) ? $extra_classes : array();
        foreach ($extra_classes as $class_name) {
            $class_name = sanitize_html_class($class_name);
            if ($class_name !== '') {
                $classes[] = $class_name;
            }
        }

        return sprintf(
            '<a href="#gaming-web-start" class="%s" data-gaming-web-start role="button">%s</a>',
            esc_attr(implode(' ', array_unique($classes))),
            esc_html($label)
        );
    }

    public function add_meta_boxes(): void
    {
        foreach (array('page', 'post') as $post_type) {
            add_meta_box(
                'gaming-web-meta',
                __('Gaming Web', 'gaming-web'),
                array($this, 'render_meta_box'),
                $post_type,
                'side',
                'default'
            );
        }
    }

    public function render_meta_box(WP_Post $post): void
    {
        wp_nonce_field('gaming_web_save_meta', 'gaming_web_meta_nonce');

        $mode = get_post_meta($post->ID, '_gaming_web_mode', true);
        $mode = in_array($mode, array('inherit', 'enabled', 'disabled'), true) ? $mode : 'inherit';
        $important_words = get_post_meta($post->ID, '_gaming_web_important_words', true);
        $stage_name = get_post_meta($post->ID, '_gaming_web_stage_name', true);
        $visual_style = get_post_meta($post->ID, '_gaming_web_visual_style', true);
        $visual_style = in_array($visual_style, array_merge(array('inherit'), array_keys(GW_Settings::visual_style_choices())), true) ? $visual_style : 'inherit';
        $reward_enabled = get_post_meta($post->ID, '_gaming_web_reward_enabled', true);
        $reward_title = get_post_meta($post->ID, '_gaming_web_reward_title', true);
        $reward_message = get_post_meta($post->ID, '_gaming_web_reward_message', true);
        $reward_coupon_code = get_post_meta($post->ID, '_gaming_web_reward_coupon_code', true);
        $reward_url = get_post_meta($post->ID, '_gaming_web_reward_url', true);
        $world_map_include = get_post_meta($post->ID, '_gaming_web_world_map_include', true);
        $world_map_include = $world_map_include === '0' ? '0' : '1';
        $world_map_label = get_post_meta($post->ID, '_gaming_web_world_map_label', true);
        $world_map_order = get_post_meta($post->ID, '_gaming_web_world_map_order', true);
        $world_map_type = get_post_meta($post->ID, '_gaming_web_world_map_type', true);
        $world_map_type = in_array($world_map_type, array('normal', 'reward', 'boss', 'final'), true) ? $world_map_type : 'normal';
        $world_map_reward_label = get_post_meta($post->ID, '_gaming_web_world_map_reward_label', true);
        ?>
        <p>
            <label for="gaming-web-mode"><strong><?php esc_html_e('Page game mode', 'gaming-web'); ?></strong></label>
            <select name="gaming_web_mode" id="gaming-web-mode" class="widefat">
                <option value="inherit" <?php selected($mode, 'inherit'); ?>><?php esc_html_e('Inherit global setting', 'gaming-web'); ?></option>
                <option value="enabled" <?php selected($mode, 'enabled'); ?>><?php esc_html_e('Enable on this page', 'gaming-web'); ?></option>
                <option value="disabled" <?php selected($mode, 'disabled'); ?>><?php esc_html_e('Disable on this page', 'gaming-web'); ?></option>
            </select>
        </p>
        <p>
            <label for="gaming-web-important-words"><strong><?php esc_html_e('Important words', 'gaming-web'); ?></strong></label>
            <textarea name="gaming_web_important_words" id="gaming-web-important-words" class="widefat" rows="3" placeholder="<?php esc_attr_e('light, memory, space', 'gaming-web'); ?>"><?php echo esc_textarea($important_words); ?></textarea>
        </p>
        <p>
            <label for="gaming-web-stage-name"><strong><?php esc_html_e('Stage name', 'gaming-web'); ?></strong></label>
            <input type="text" name="gaming_web_stage_name" id="gaming-web-stage-name" class="widefat" value="<?php echo esc_attr($stage_name); ?>" placeholder="<?php esc_attr_e('Garden of Words', 'gaming-web'); ?>">
        </p>
        <p>
            <label for="gaming-web-visual-style"><strong><?php esc_html_e('Visual style', 'gaming-web'); ?></strong></label>
            <select name="gaming_web_visual_style" id="gaming-web-visual-style" class="widefat">
                <option value="inherit" <?php selected($visual_style, 'inherit'); ?>><?php esc_html_e('Inherit global setting', 'gaming-web'); ?></option>
                <?php foreach (GW_Settings::visual_style_choices() as $style_value => $style_label) : ?>
                    <option value="<?php echo esc_attr($style_value); ?>" <?php selected($visual_style, $style_value); ?>><?php echo esc_html($style_label); ?></option>
                <?php endforeach; ?>
            </select>
        </p>
        <hr>
        <p>
            <label>
                <input type="hidden" name="gaming_web_reward_enabled" value="0">
                <input type="checkbox" name="gaming_web_reward_enabled" value="1" <?php checked($reward_enabled, '1'); ?>>
                <strong><?php esc_html_e('Show a clear reward', 'gaming-web'); ?></strong>
            </label>
        </p>
        <p>
            <label for="gaming-web-reward-title"><strong><?php esc_html_e('Reward title', 'gaming-web'); ?></strong></label>
            <input type="text" name="gaming_web_reward_title" id="gaming-web-reward-title" class="widefat" value="<?php echo esc_attr($reward_title); ?>" placeholder="<?php esc_attr_e('Clear reward', 'gaming-web'); ?>">
        </p>
        <p>
            <label for="gaming-web-reward-message"><strong><?php esc_html_e('Reward message', 'gaming-web'); ?></strong></label>
            <textarea name="gaming_web_reward_message" id="gaming-web-reward-message" class="widefat" rows="3" placeholder="<?php esc_attr_e('A message only players who reached GOAL can see', 'gaming-web'); ?>"><?php echo esc_textarea($reward_message); ?></textarea>
        </p>
        <p>
            <label for="gaming-web-reward-coupon-code"><strong><?php esc_html_e('Coupon code', 'gaming-web'); ?></strong></label>
            <input type="text" name="gaming_web_reward_coupon_code" id="gaming-web-reward-coupon-code" class="widefat" value="<?php echo esc_attr($reward_coupon_code); ?>" placeholder="CLEAR-THANKS">
        </p>
        <p>
            <label for="gaming-web-reward-url"><strong><?php esc_html_e('Reward URL', 'gaming-web'); ?></strong></label>
            <input type="url" name="gaming_web_reward_url" id="gaming-web-reward-url" class="widefat" value="<?php echo esc_url($reward_url); ?>" placeholder="https://example.com/special">
        </p>
        <hr>
        <p>
            <label>
                <input type="hidden" name="gaming_web_world_map_include" value="0">
                <input type="checkbox" name="gaming_web_world_map_include" value="1" <?php checked($world_map_include, '1'); ?>>
                <strong><?php esc_html_e('Include in world map', 'gaming-web'); ?></strong>
            </label>
        </p>
        <p>
            <label for="gaming-web-world-map-label"><strong><?php esc_html_e('Map label', 'gaming-web'); ?></strong></label>
            <input type="text" name="gaming_web_world_map_label" id="gaming-web-world-map-label" class="widefat" value="<?php echo esc_attr($world_map_label); ?>" placeholder="<?php esc_attr_e('Stage label on the field map', 'gaming-web'); ?>">
        </p>
        <p>
            <label for="gaming-web-world-map-order"><strong><?php esc_html_e('Map order', 'gaming-web'); ?></strong></label>
            <input type="number" min="0" step="1" name="gaming_web_world_map_order" id="gaming-web-world-map-order" class="widefat" value="<?php echo esc_attr($world_map_order); ?>" placeholder="0">
        </p>
        <p>
            <label for="gaming-web-world-map-type"><strong><?php esc_html_e('Stage type', 'gaming-web'); ?></strong></label>
            <select name="gaming_web_world_map_type" id="gaming-web-world-map-type" class="widefat">
                <option value="normal" <?php selected($world_map_type, 'normal'); ?>><?php esc_html_e('Normal stage', 'gaming-web'); ?></option>
                <option value="reward" <?php selected($world_map_type, 'reward'); ?>><?php esc_html_e('Reward stage', 'gaming-web'); ?></option>
                <option value="boss" <?php selected($world_map_type, 'boss'); ?>><?php esc_html_e('Boss stage', 'gaming-web'); ?></option>
                <option value="final" <?php selected($world_map_type, 'final'); ?>><?php esc_html_e('Final goal', 'gaming-web'); ?></option>
            </select>
        </p>
        <p>
            <label for="gaming-web-world-map-reward-label"><strong><?php esc_html_e('Map reward teaser', 'gaming-web'); ?></strong></label>
            <input type="text" name="gaming_web_world_map_reward_label" id="gaming-web-world-map-reward-label" class="widefat" value="<?php echo esc_attr($world_map_reward_label); ?>" placeholder="<?php esc_attr_e('Coupon, bonus page, secret message...', 'gaming-web'); ?>">
        </p>
        <?php
    }

    public function save_meta_box(int $post_id): void
    {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (!isset($_POST['gaming_web_meta_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['gaming_web_meta_nonce'])), 'gaming_web_save_meta')) {
            return;
        }

        $post_type = get_post_type($post_id);
        if (!in_array($post_type, array('page', 'post'), true)) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        $mode = sanitize_key((string) ($_POST['gaming_web_mode'] ?? 'inherit'));
        if (!in_array($mode, array('inherit', 'enabled', 'disabled'), true)) {
            $mode = 'inherit';
        }

        $important_words = sanitize_textarea_field(wp_unslash((string) ($_POST['gaming_web_important_words'] ?? '')));
        $stage_name = sanitize_text_field(wp_unslash((string) ($_POST['gaming_web_stage_name'] ?? '')));
        $visual_style = sanitize_key((string) ($_POST['gaming_web_visual_style'] ?? 'inherit'));
        if (!in_array($visual_style, array_merge(array('inherit'), array_keys(GW_Settings::visual_style_choices())), true)) {
            $visual_style = 'inherit';
        }
        $reward_enabled = (string) ($_POST['gaming_web_reward_enabled'] ?? '0') === '1' ? '1' : '0';
        $reward_title = sanitize_text_field(wp_unslash((string) ($_POST['gaming_web_reward_title'] ?? '')));
        $reward_message = sanitize_textarea_field(wp_unslash((string) ($_POST['gaming_web_reward_message'] ?? '')));
        $reward_coupon_code = sanitize_text_field(wp_unslash((string) ($_POST['gaming_web_reward_coupon_code'] ?? '')));
        $reward_url = esc_url_raw(wp_unslash((string) ($_POST['gaming_web_reward_url'] ?? '')));
        $world_map_include = (string) ($_POST['gaming_web_world_map_include'] ?? '0') === '1' ? '1' : '0';
        $world_map_label = sanitize_text_field(wp_unslash((string) ($_POST['gaming_web_world_map_label'] ?? '')));
        $world_map_order = (string) max(0, absint($_POST['gaming_web_world_map_order'] ?? 0));
        $world_map_type = sanitize_key((string) ($_POST['gaming_web_world_map_type'] ?? 'normal'));
        if (!in_array($world_map_type, array('normal', 'reward', 'boss', 'final'), true)) {
            $world_map_type = 'normal';
        }
        $world_map_reward_label = sanitize_text_field(wp_unslash((string) ($_POST['gaming_web_world_map_reward_label'] ?? '')));

        update_post_meta($post_id, '_gaming_web_mode', $mode);
        update_post_meta($post_id, '_gaming_web_important_words', $important_words);
        update_post_meta($post_id, '_gaming_web_stage_name', $stage_name);
        update_post_meta($post_id, '_gaming_web_visual_style', $visual_style);
        update_post_meta($post_id, '_gaming_web_reward_enabled', $reward_enabled);
        update_post_meta($post_id, '_gaming_web_reward_title', $reward_title);
        update_post_meta($post_id, '_gaming_web_reward_message', $reward_message);
        update_post_meta($post_id, '_gaming_web_reward_coupon_code', $reward_coupon_code);
        update_post_meta($post_id, '_gaming_web_reward_url', $reward_url);
        update_post_meta($post_id, '_gaming_web_world_map_include', $world_map_include);
        update_post_meta($post_id, '_gaming_web_world_map_label', $world_map_label);
        update_post_meta($post_id, '_gaming_web_world_map_order', $world_map_order);
        update_post_meta($post_id, '_gaming_web_world_map_type', $world_map_type);
        update_post_meta($post_id, '_gaming_web_world_map_reward_label', $world_map_reward_label);
    }

    private function is_enabled_for_current_post(): bool
    {
        $post = get_post();
        if (!$post instanceof WP_Post) {
            return false;
        }

        if (!GW_Settings::is_truthy(GW_Settings::OPTION_ENABLED)) {
            return false;
        }

        $enabled_types = GW_Settings::get(GW_Settings::OPTION_POST_TYPES);
        $enabled_types = is_array($enabled_types) ? $enabled_types : array();
        if (!in_array($post->post_type, $enabled_types, true)) {
            return false;
        }

        return get_post_meta($post->ID, '_gaming_web_mode', true) !== 'disabled';
    }

    private function frontend_config(): array
    {
        $post = get_post();
        $post_id = $post instanceof WP_Post ? $post->ID : 0;
        $stage_name = $post_id ? get_post_meta($post_id, '_gaming_web_stage_name', true) : '';
        $important_words = $post_id ? get_post_meta($post_id, '_gaming_web_important_words', true) : '';

        return array(
            'enabled' => true,
            'restUrl' => esc_url_raw(rest_url('gaming-web/v1/event')),
            'nonce' => wp_create_nonce('wp_rest'),
            'pageId' => $post_id,
            'pageUrl' => $post_id ? get_permalink($post_id) : home_url('/'),
            'stageName' => $stage_name ?: get_the_title($post_id),
            'buttonLabel' => $this->localized_default_option(GW_Settings::OPTION_BUTTON_LABEL),
            'showFloatingButton' => GW_Settings::is_truthy(GW_Settings::OPTION_SHOW_FLOATING_BUTTON) ? '1' : '0',
            'characterName' => $this->localized_default_option(GW_Settings::OPTION_CHARACTER_NAME),
            'visualStyle' => $this->visual_style_for_post($post_id),
            'themeTokens' => array(),
            'importantWords' => $this->parse_important_words($important_words),
            'hasReward' => $this->has_clear_reward($post_id) ? '1' : '0',
            'worldMap' => $this->world_map_config($post_id),
            'loggingEnabled' => GW_Settings::is_truthy(GW_Settings::OPTION_LOGGING_ENABLED),
            'debug' => GW_Settings::is_truthy(GW_Settings::OPTION_DEBUG),
            'locale' => determine_locale(),
            'messages' => array(),
        );
    }

    private function visual_style_for_post(int $post_id): string
    {
        $global_style = sanitize_key((string) GW_Settings::get(GW_Settings::OPTION_VISUAL_STYLE));
        if (!GW_Settings::is_allowed_visual_style($global_style)) {
            $global_style = 'auto';
        }

        $page_style = $post_id ? sanitize_key((string) get_post_meta($post_id, '_gaming_web_visual_style', true)) : '';
        if (GW_Settings::is_allowed_visual_style($page_style)) {
            return $page_style;
        }

        return $global_style;
    }

    private function parse_important_words(string $words): array
    {
        $parts = preg_split('/[,、\n]/u', $words);
        $parts = is_array($parts) ? $parts : array();
        $parts = array_map('trim', $parts);
        $parts = array_filter($parts, static fn($word) => $word !== '');

        return array_values(array_unique($parts));
    }

    private function localized_default_option(string $key): string
    {
        $value = (string) GW_Settings::get($key);

        if ($key === GW_Settings::OPTION_BUTTON_LABEL && $value === 'Game Mode') {
            return __('Game Mode', 'gaming-web');
        }

        if ($key === GW_Settings::OPTION_CHARACTER_NAME && $value === 'Pico') {
            return __('Pico', 'gaming-web');
        }

        return $value;
    }

    private function has_clear_reward(int $post_id): bool
    {
        if ($post_id <= 0 || get_post_meta($post_id, '_gaming_web_reward_enabled', true) !== '1') {
            return false;
        }

        $fields = array(
            '_gaming_web_reward_title',
            '_gaming_web_reward_message',
            '_gaming_web_reward_coupon_code',
            '_gaming_web_reward_url',
        );

        foreach ($fields as $field) {
            if (trim((string) get_post_meta($post_id, $field, true)) !== '') {
                return true;
            }
        }

        return false;
    }

    private function world_map_config(int $current_post_id): array
    {
        if (!GW_Settings::is_truthy(GW_Settings::OPTION_WORLD_MAP_ENABLED)) {
            return array('enabled' => false);
        }

        $stages = $this->world_map_stages($current_post_id);
        if (empty($stages)) {
            return array('enabled' => false);
        }

        $required_count = absint(GW_Settings::get(GW_Settings::OPTION_WORLD_MAP_REQUIRED_CLEAR_COUNT));
        if ($required_count <= 0) {
            $required_count = count($stages);
        }

        return array(
            'enabled' => true,
            'title' => (string) GW_Settings::get(GW_Settings::OPTION_WORLD_MAP_TITLE),
            'goalLabel' => (string) GW_Settings::get(GW_Settings::OPTION_WORLD_MAP_GOAL_LABEL),
            'currentStageId' => $current_post_id > 0 ? 'post-' . $current_post_id : '',
            'progressKey' => 'gaming_web_world_progress_' . substr(md5(home_url('/')), 0, 10),
            'requiredClearCount' => min($required_count, count($stages)),
            'showOnStart' => GW_Settings::is_truthy(GW_Settings::OPTION_WORLD_MAP_SHOW_ON_START),
            'showInHud' => GW_Settings::is_truthy(GW_Settings::OPTION_WORLD_MAP_SHOW_IN_HUD),
            'showAfterClear' => GW_Settings::is_truthy(GW_Settings::OPTION_WORLD_MAP_SHOW_AFTER_CLEAR),
            'stages' => $stages,
        );
    }

    private function world_map_stages(int $current_post_id): array
    {
        $enabled_types = GW_Settings::get(GW_Settings::OPTION_POST_TYPES);
        $enabled_types = is_array($enabled_types) ? array_values(array_filter($enabled_types)) : array('page', 'post');
        if (empty($enabled_types)) {
            return array();
        }

        $posts = get_posts(array(
            'post_type' => $enabled_types,
            'post_status' => 'publish',
            'posts_per_page' => 60,
            'orderby' => array(
                'menu_order' => 'ASC',
                'title' => 'ASC',
            ),
            'suppress_filters' => false,
        ));

        $stages = array();
        foreach ($posts as $post) {
            if (!$post instanceof WP_Post || !$this->is_world_map_stage($post)) {
                continue;
            }

            $stages[] = $this->world_map_stage_data($post);
        }

        usort($stages, static function (array $a, array $b): int {
            $a_order = (int) ($a['order'] ?? 0);
            $b_order = (int) ($b['order'] ?? 0);
            if ($a_order !== $b_order) {
                if ($a_order === 0) {
                    return 1;
                }
                if ($b_order === 0) {
                    return -1;
                }
                return $a_order <=> $b_order;
            }

            return strcasecmp((string) ($a['label'] ?? ''), (string) ($b['label'] ?? ''));
        });

        if ($current_post_id > 0) {
            $current_id = 'post-' . $current_post_id;
            $has_current = false;
            foreach ($stages as $stage) {
                if (($stage['id'] ?? '') === $current_id) {
                    $has_current = true;
                    break;
                }
            }

            if (!$has_current) {
                $current_post = get_post($current_post_id);
                if ($current_post instanceof WP_Post) {
                    array_unshift($stages, $this->world_map_stage_data($current_post));
                }
            }
        }

        $stages = array_slice($stages, 0, 24);

        foreach ($stages as $index => &$stage) {
            $stage['index'] = $index;
            if ($index === count($stages) - 1 && $stage['type'] === 'normal') {
                $stage['type'] = 'final';
            }
        }
        unset($stage);

        return $stages;
    }

    private function is_world_map_stage(WP_Post $post): bool
    {
        $enabled_types = GW_Settings::get(GW_Settings::OPTION_POST_TYPES);
        $enabled_types = is_array($enabled_types) ? $enabled_types : array();
        if (!in_array($post->post_type, $enabled_types, true)) {
            return false;
        }

        if (get_post_meta($post->ID, '_gaming_web_mode', true) === 'disabled') {
            return false;
        }

        return get_post_meta($post->ID, '_gaming_web_world_map_include', true) !== '0';
    }

    private function world_map_stage_data(WP_Post $post): array
    {
        $stage_name = trim((string) get_post_meta($post->ID, '_gaming_web_stage_name', true));
        $map_label = trim((string) get_post_meta($post->ID, '_gaming_web_world_map_label', true));
        $type = sanitize_key((string) get_post_meta($post->ID, '_gaming_web_world_map_type', true));
        if (!in_array($type, array('normal', 'reward', 'boss', 'final'), true)) {
            $type = $this->has_clear_reward($post->ID) ? 'reward' : 'normal';
        }

        $reward_label = trim((string) get_post_meta($post->ID, '_gaming_web_world_map_reward_label', true));
        if ($reward_label === '' && $this->has_clear_reward($post->ID)) {
            $reward_label = trim((string) get_post_meta($post->ID, '_gaming_web_reward_title', true));
        }

        return array(
            'id' => 'post-' . $post->ID,
            'pageId' => $post->ID,
            'label' => $map_label !== '' ? $map_label : ($stage_name !== '' ? $stage_name : get_the_title($post)),
            'title' => get_the_title($post),
            'stageName' => $stage_name !== '' ? $stage_name : get_the_title($post),
            'url' => get_permalink($post),
            'type' => $type,
            'order' => absint(get_post_meta($post->ID, '_gaming_web_world_map_order', true)),
            'hasReward' => $this->has_clear_reward($post->ID),
            'rewardLabel' => $reward_label,
        );
    }
}
