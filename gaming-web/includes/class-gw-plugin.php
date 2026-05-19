<?php

if (!defined('ABSPATH')) {
    exit;
}

class GW_Plugin
{
    private static ?GW_Plugin $instance = null;
    private GW_Settings $settings;
    private GW_REST $rest;

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

        wp_enqueue_script(
            'gaming-web-adapter',
            GAMING_WEB_URL . 'assets/js/wordpress-adapter.js',
            array(),
            GAMING_WEB_VERSION,
            true
        );

        wp_localize_script('gaming-web-adapter', 'GamingWebConfig', $this->frontend_config());
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
                'label' => GW_Settings::get(GW_Settings::OPTION_BUTTON_LABEL),
                'class' => '',
            ),
            $atts,
            'gaming_web_start'
        );

        $label = trim((string) $atts['label']);
        if ($label === '') {
            $label = GW_Settings::get(GW_Settings::OPTION_BUTTON_LABEL);
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
        $reward_enabled = get_post_meta($post->ID, '_gaming_web_reward_enabled', true);
        $reward_title = get_post_meta($post->ID, '_gaming_web_reward_title', true);
        $reward_message = get_post_meta($post->ID, '_gaming_web_reward_message', true);
        $reward_coupon_code = get_post_meta($post->ID, '_gaming_web_reward_coupon_code', true);
        $reward_url = get_post_meta($post->ID, '_gaming_web_reward_url', true);
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
            <textarea name="gaming_web_important_words" id="gaming-web-important-words" class="widefat" rows="3" placeholder="光, 記憶, 余白"><?php echo esc_textarea($important_words); ?></textarea>
        </p>
        <p>
            <label for="gaming-web-stage-name"><strong><?php esc_html_e('Stage name', 'gaming-web'); ?></strong></label>
            <input type="text" name="gaming_web_stage_name" id="gaming-web-stage-name" class="widefat" value="<?php echo esc_attr($stage_name); ?>" placeholder="言葉の庭">
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
            <input type="text" name="gaming_web_reward_title" id="gaming-web-reward-title" class="widefat" value="<?php echo esc_attr($reward_title); ?>" placeholder="クリア特典">
        </p>
        <p>
            <label for="gaming-web-reward-message"><strong><?php esc_html_e('Reward message', 'gaming-web'); ?></strong></label>
            <textarea name="gaming_web_reward_message" id="gaming-web-reward-message" class="widefat" rows="3" placeholder="GOALした人だけに見えるメッセージ"><?php echo esc_textarea($reward_message); ?></textarea>
        </p>
        <p>
            <label for="gaming-web-reward-coupon-code"><strong><?php esc_html_e('Coupon code', 'gaming-web'); ?></strong></label>
            <input type="text" name="gaming_web_reward_coupon_code" id="gaming-web-reward-coupon-code" class="widefat" value="<?php echo esc_attr($reward_coupon_code); ?>" placeholder="CLEAR-THANKS">
        </p>
        <p>
            <label for="gaming-web-reward-url"><strong><?php esc_html_e('Reward URL', 'gaming-web'); ?></strong></label>
            <input type="url" name="gaming_web_reward_url" id="gaming-web-reward-url" class="widefat" value="<?php echo esc_url($reward_url); ?>" placeholder="https://example.com/special">
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
        $reward_enabled = (string) ($_POST['gaming_web_reward_enabled'] ?? '0') === '1' ? '1' : '0';
        $reward_title = sanitize_text_field(wp_unslash((string) ($_POST['gaming_web_reward_title'] ?? '')));
        $reward_message = sanitize_textarea_field(wp_unslash((string) ($_POST['gaming_web_reward_message'] ?? '')));
        $reward_coupon_code = sanitize_text_field(wp_unslash((string) ($_POST['gaming_web_reward_coupon_code'] ?? '')));
        $reward_url = esc_url_raw(wp_unslash((string) ($_POST['gaming_web_reward_url'] ?? '')));

        update_post_meta($post_id, '_gaming_web_mode', $mode);
        update_post_meta($post_id, '_gaming_web_important_words', $important_words);
        update_post_meta($post_id, '_gaming_web_stage_name', $stage_name);
        update_post_meta($post_id, '_gaming_web_reward_enabled', $reward_enabled);
        update_post_meta($post_id, '_gaming_web_reward_title', $reward_title);
        update_post_meta($post_id, '_gaming_web_reward_message', $reward_message);
        update_post_meta($post_id, '_gaming_web_reward_coupon_code', $reward_coupon_code);
        update_post_meta($post_id, '_gaming_web_reward_url', $reward_url);
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
            'buttonLabel' => GW_Settings::get(GW_Settings::OPTION_BUTTON_LABEL),
            'showFloatingButton' => GW_Settings::is_truthy(GW_Settings::OPTION_SHOW_FLOATING_BUTTON) ? '1' : '0',
            'characterName' => GW_Settings::get(GW_Settings::OPTION_CHARACTER_NAME),
            'importantWords' => $this->parse_important_words($important_words),
            'hasReward' => $this->has_clear_reward($post_id) ? '1' : '0',
            'loggingEnabled' => GW_Settings::is_truthy(GW_Settings::OPTION_LOGGING_ENABLED),
            'debug' => GW_Settings::is_truthy(GW_Settings::OPTION_DEBUG),
            'messages' => array(
                'start' => 'このページ、ちょっと触ってみる？',
                'hint' => '叩くと何か出るかも',
                'collect' => '言葉のかけらを見つけた！',
                'clear' => '少しページが明るくなった！',
            ),
        );
    }

    private function parse_important_words(string $words): array
    {
        $parts = preg_split('/[,、\n]/u', $words);
        $parts = is_array($parts) ? $parts : array();
        $parts = array_map('trim', $parts);
        $parts = array_filter($parts, static fn($word) => $word !== '');

        return array_values(array_unique($parts));
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
}
