<?php

if (!defined('ABSPATH')) {
    exit;
}

class GW_Plugin
{
    private static ?GW_Plugin $instance = null;
    private GW_Settings $settings;
    private GW_Admin $admin;
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
        $this->admin = new GW_Admin($this->settings);
        $this->rest = new GW_REST();
    }

    public function init(): void
    {
        $this->settings->init();
        $this->admin->init();
        $this->rest->init();

        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
        add_action('send_headers', array($this, 'send_frontend_headers'));
        add_action('wp_head', array($this, 'print_social_meta'), 5);
        add_action('template_redirect', array($this, 'redirect_attachment_pages'), 0);
        add_filter('script_loader_tag', array($this, 'mark_adapter_as_module'), 10, 3);
        add_action('add_meta_boxes', array($this, 'add_meta_boxes'));
        add_action('save_post', array($this, 'save_meta_box'));
        add_shortcode('gaming_web_start', array($this, 'render_start_shortcode'));
    }

    public function send_frontend_headers(): void
    {
        if (is_admin() || headers_sent()) {
            return;
        }

        header('Permissions-Policy: gamepad=(self)', false);
    }

    public function redirect_attachment_pages(): void
    {
        if (!is_attachment() || is_admin() || wp_doing_ajax() || wp_is_json_request()) {
            return;
        }

        $attachment_id = get_queried_object_id();
        $parent_id = $attachment_id > 0 ? (int) wp_get_post_parent_id($attachment_id) : 0;
        $target = $parent_id > 0 ? get_permalink($parent_id) : home_url('/');

        if (!$target) {
            $target = home_url('/');
        }

        wp_safe_redirect($target, 301);
        exit;
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

    public function print_social_meta(): void
    {
        if (is_admin() || is_feed() || wp_is_json_request()) {
            return;
        }

        $post_id = get_queried_object_id();
        if ($post_id <= 0 && is_front_page()) {
            $post_id = (int) get_option('page_on_front');
        }

        $title = $post_id > 0 ? (string) get_post_meta($post_id, '_charabreak_og_title', true) : '';
        $description = $post_id > 0 ? (string) get_post_meta($post_id, '_charabreak_og_description', true) : '';
        $image = $post_id > 0 ? (string) get_post_meta($post_id, '_charabreak_og_image', true) : '';

        $is_charabreak_front = is_front_page() || is_home();
        if ($title === '' && $description === '' && $image === '' && !$is_charabreak_front) {
            return;
        }

        $title = $title !== '' ? $title : $this->default_social_title($post_id);
        $description = $description !== '' ? $description : $this->default_social_description($post_id);
        $image = $image !== '' ? $image : $this->default_social_image($post_id);
        $url = $post_id > 0 ? get_permalink($post_id) : home_url('/');

        echo "\n" . '<!-- CharaBreak social preview -->' . "\n";
        echo '<meta property="og:type" content="website">' . "\n";
        echo '<meta property="og:site_name" content="' . esc_attr(get_bloginfo('name')) . '">' . "\n";
        echo '<meta property="og:title" content="' . esc_attr($title) . '">' . "\n";
        echo '<meta property="og:description" content="' . esc_attr($description) . '">' . "\n";
        echo '<meta property="og:url" content="' . esc_url($this->social_url($url)) . '">' . "\n";
        if ($image) {
            echo '<meta property="og:image" content="' . esc_url($this->social_url($image)) . '">' . "\n";
            echo '<meta property="og:image:secure_url" content="' . esc_url($this->social_url($image)) . '">' . "\n";
            echo '<meta property="og:image:width" content="1200">' . "\n";
            echo '<meta property="og:image:height" content="630">' . "\n";
            echo '<meta property="og:image:alt" content="' . esc_attr($title) . '">' . "\n";
        }
        echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
        echo '<meta name="twitter:title" content="' . esc_attr($title) . '">' . "\n";
        echo '<meta name="twitter:description" content="' . esc_attr($description) . '">' . "\n";
        if ($image) {
            echo '<meta name="twitter:image" content="' . esc_url($this->social_url($image)) . '">' . "\n";
        }
        echo '<!-- /CharaBreak social preview -->' . "\n";
    }

    private function default_social_title(int $post_id = 0): string
    {
        if ($post_id > 0 && !is_front_page()) {
            return wp_get_document_title();
        }

        return 'CharaBreak｜読む前に、壊せ。';
    }

    private function default_social_description(int $post_id = 0): string
    {
        if ($post_id > 0 && !is_front_page()) {
            $excerpt = wp_strip_all_tags(get_the_excerpt($post_id));
            if ($excerpt !== '') {
                return $excerpt;
            }
        }

        return 'WordPressサイトを、壊す・咲かせる・守るゲームステージに変えるインタラクティブWebプラグイン。';
    }

    private function default_social_image(int $post_id = 0): string
    {
        if ($post_id > 0) {
            $thumbnail = get_the_post_thumbnail_url($post_id, 'full');
            if ($thumbnail) {
                return $thumbnail;
            }
        }

        return GAMING_WEB_URL . 'assets/brand/charabreak-og-image.png';
    }

    private function social_url(string $url): string
    {
        if ($url === '') {
            return '';
        }

        return is_ssl() ? set_url_scheme($url, 'https') : $url;
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
                __('CharaBreak ページ設定', 'gaming-web'),
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
        $play_style = get_post_meta($post->ID, '_gaming_web_play_style', true);
        $play_style = in_array($play_style, array_merge(array('inherit'), array_keys(GW_Settings::play_style_choices())), true) ? $play_style : 'inherit';
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
        $stage_difficulty = GW_Enemies::difficulty(get_post_meta($post->ID, '_gaming_web_stage_difficulty', true) ?: 3);
        $stage_clear_effect = get_post_meta($post->ID, '_gaming_web_stage_clear_effect', true);
        $stage_clear_effect = array_key_exists($stage_clear_effect, GW_Enemies::clear_effect_choices()) ? $stage_clear_effect : 'auto';
        ?>
        <p>
            <label for="gaming-web-mode"><strong><?php esc_html_e('このページのゲーム化', 'gaming-web'); ?></strong></label>
            <select name="gaming_web_mode" id="gaming-web-mode" class="widefat">
                <option value="inherit" <?php selected($mode, 'inherit'); ?>><?php esc_html_e('全体設定に従う', 'gaming-web'); ?></option>
                <option value="enabled" <?php selected($mode, 'enabled'); ?>><?php esc_html_e('このページで有効', 'gaming-web'); ?></option>
                <option value="disabled" <?php selected($mode, 'disabled'); ?>><?php esc_html_e('このページでは無効', 'gaming-web'); ?></option>
            </select>
        </p>
        <p>
            <label for="gaming-web-important-words"><strong><?php esc_html_e('重要な言葉', 'gaming-web'); ?></strong></label>
            <textarea name="gaming_web_important_words" id="gaming-web-important-words" class="widefat" rows="3" placeholder="<?php esc_attr_e('未来, 体験, ファン', 'gaming-web'); ?>"><?php echo esc_textarea($important_words); ?></textarea>
        </p>
        <p>
            <label for="gaming-web-stage-name"><strong><?php esc_html_e('ステージ名', 'gaming-web'); ?></strong></label>
            <input type="text" name="gaming_web_stage_name" id="gaming-web-stage-name" class="widefat" value="<?php echo esc_attr($stage_name); ?>" placeholder="<?php esc_attr_e('言葉の庭', 'gaming-web'); ?>">
        </p>
        <p>
            <label for="gaming-web-visual-style"><strong><?php esc_html_e('ビジュアルスタイル', 'gaming-web'); ?></strong></label>
            <select name="gaming_web_visual_style" id="gaming-web-visual-style" class="widefat">
                <option value="inherit" <?php selected($visual_style, 'inherit'); ?>><?php esc_html_e('全体設定に従う', 'gaming-web'); ?></option>
                <?php foreach (GW_Settings::visual_style_choices() as $style_value => $style_label) : ?>
                    <option value="<?php echo esc_attr($style_value); ?>" <?php selected($visual_style, $style_value); ?>><?php echo esc_html($style_label); ?></option>
                <?php endforeach; ?>
            </select>
        </p>
        <p>
            <label for="gaming-web-play-style"><strong><?php esc_html_e('Game Action Style / ゲームアクション', 'gaming-web'); ?></strong></label>
            <select name="gaming_web_play_style" id="gaming-web-play-style" class="widefat">
                <option value="inherit" <?php selected($play_style, 'inherit'); ?>><?php esc_html_e('全体設定に従う', 'gaming-web'); ?></option>
                <?php foreach (GW_Settings::play_style_choices() as $style_value => $style_label) : ?>
                    <option value="<?php echo esc_attr($style_value); ?>" <?php selected($play_style, $style_value); ?>><?php echo esc_html($style_label); ?></option>
                <?php endforeach; ?>
            </select>
            <span class="description"><?php esc_html_e('ステージごとに「壊す」「花に変える」「混合」を選べます。', 'gaming-web'); ?></span>
        </p>
        <hr>
        <p>
            <label>
                <input type="hidden" name="gaming_web_reward_enabled" value="0">
                <input type="checkbox" name="gaming_web_reward_enabled" value="1" <?php checked($reward_enabled, '1'); ?>>
                <strong><?php esc_html_e('クリア特典を表示する', 'gaming-web'); ?></strong>
            </label>
        </p>
        <p>
            <label for="gaming-web-reward-title"><strong><?php esc_html_e('特典タイトル', 'gaming-web'); ?></strong></label>
            <input type="text" name="gaming_web_reward_title" id="gaming-web-reward-title" class="widefat" value="<?php echo esc_attr($reward_title); ?>" placeholder="<?php esc_attr_e('クリア特典', 'gaming-web'); ?>">
        </p>
        <p>
            <label for="gaming-web-reward-message"><strong><?php esc_html_e('特典メッセージ', 'gaming-web'); ?></strong></label>
            <textarea name="gaming_web_reward_message" id="gaming-web-reward-message" class="widefat" rows="3" placeholder="<?php esc_attr_e('GOALに到達した人だけが読めるメッセージ', 'gaming-web'); ?>"><?php echo esc_textarea($reward_message); ?></textarea>
        </p>
        <p>
            <label for="gaming-web-reward-coupon-code"><strong><?php esc_html_e('クーポンコード', 'gaming-web'); ?></strong></label>
            <input type="text" name="gaming_web_reward_coupon_code" id="gaming-web-reward-coupon-code" class="widefat" value="<?php echo esc_attr($reward_coupon_code); ?>" placeholder="CLEAR-THANKS">
        </p>
        <p>
            <label for="gaming-web-reward-url"><strong><?php esc_html_e('特典URL', 'gaming-web'); ?></strong></label>
            <input type="url" name="gaming_web_reward_url" id="gaming-web-reward-url" class="widefat" value="<?php echo esc_url($reward_url); ?>" placeholder="https://example.com/special">
        </p>
        <hr>
        <p>
            <label>
                <input type="hidden" name="gaming_web_world_map_include" value="0">
                <input type="checkbox" name="gaming_web_world_map_include" value="1" <?php checked($world_map_include, '1'); ?>>
                <strong><?php esc_html_e('ワールドマップに表示する', 'gaming-web'); ?></strong>
            </label>
        </p>
        <p>
            <label for="gaming-web-world-map-label"><strong><?php esc_html_e('マップ上の表示名', 'gaming-web'); ?></strong></label>
            <input type="text" name="gaming_web_world_map_label" id="gaming-web-world-map-label" class="widefat" value="<?php echo esc_attr($world_map_label); ?>" placeholder="<?php esc_attr_e('フィールドマップ上のステージ名', 'gaming-web'); ?>">
        </p>
        <p>
            <label for="gaming-web-world-map-order"><strong><?php esc_html_e('マップ順', 'gaming-web'); ?></strong></label>
            <input type="number" min="0" step="1" name="gaming_web_world_map_order" id="gaming-web-world-map-order" class="widefat" value="<?php echo esc_attr($world_map_order); ?>" placeholder="0">
        </p>
        <p>
            <label for="gaming-web-world-map-type"><strong><?php esc_html_e('ステージ種別', 'gaming-web'); ?></strong></label>
            <select name="gaming_web_world_map_type" id="gaming-web-world-map-type" class="widefat">
                <option value="normal" <?php selected($world_map_type, 'normal'); ?>><?php esc_html_e('通常ステージ', 'gaming-web'); ?></option>
                <option value="reward" <?php selected($world_map_type, 'reward'); ?>><?php esc_html_e('報酬ステージ', 'gaming-web'); ?></option>
                <option value="boss" <?php selected($world_map_type, 'boss'); ?>><?php esc_html_e('ボスステージ', 'gaming-web'); ?></option>
                <option value="final" <?php selected($world_map_type, 'final'); ?>><?php esc_html_e('最終ゴール', 'gaming-web'); ?></option>
            </select>
        </p>
        <p>
            <label for="gaming-web-world-map-reward-label"><strong><?php esc_html_e('マップ上の報酬予告', 'gaming-web'); ?></strong></label>
            <input type="text" name="gaming_web_world_map_reward_label" id="gaming-web-world-map-reward-label" class="widefat" value="<?php echo esc_attr($world_map_reward_label); ?>" placeholder="<?php esc_attr_e('クーポン、限定ページ、秘密のメッセージなど', 'gaming-web'); ?>">
        </p>
        <p>
            <label for="gaming-web-stage-difficulty"><strong><?php esc_html_e('ステージ難易度', 'gaming-web'); ?></strong></label>
            <select name="gaming_web_stage_difficulty" id="gaming-web-stage-difficulty" class="widefat">
                <?php for ($level = 1; $level <= 8; $level++) : ?>
                    <option value="<?php echo esc_attr((string) $level); ?>" <?php selected($stage_difficulty, $level); ?>>Lv.<?php echo esc_html((string) $level); ?></option>
                <?php endfor; ?>
            </select>
        </p>
        <p>
            <label for="gaming-web-stage-clear-effect"><strong><?php esc_html_e('クリア演出', 'gaming-web'); ?></strong></label>
            <select name="gaming_web_stage_clear_effect" id="gaming-web-stage-clear-effect" class="widefat">
                <?php foreach (GW_Enemies::clear_effect_choices() as $effect_value => $effect_label) : ?>
                    <option value="<?php echo esc_attr($effect_value); ?>" <?php selected($stage_clear_effect, $effect_value); ?>><?php echo esc_html($effect_label); ?></option>
                <?php endforeach; ?>
            </select>
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
        $play_style = sanitize_key((string) ($_POST['gaming_web_play_style'] ?? 'inherit'));
        if (!in_array($play_style, array_merge(array('inherit'), array_keys(GW_Settings::play_style_choices())), true)) {
            $play_style = 'inherit';
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
        $stage_difficulty = (string) GW_Enemies::difficulty($_POST['gaming_web_stage_difficulty'] ?? 3);
        $stage_clear_effect = sanitize_key((string) ($_POST['gaming_web_stage_clear_effect'] ?? 'auto'));
        if (!array_key_exists($stage_clear_effect, GW_Enemies::clear_effect_choices())) {
            $stage_clear_effect = 'auto';
        }

        update_post_meta($post_id, '_gaming_web_mode', $mode);
        update_post_meta($post_id, '_gaming_web_important_words', $important_words);
        update_post_meta($post_id, '_gaming_web_stage_name', $stage_name);
        update_post_meta($post_id, '_gaming_web_visual_style', $visual_style);
        update_post_meta($post_id, '_gaming_web_play_style', $play_style);
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
        update_post_meta($post_id, '_gaming_web_stage_difficulty', $stage_difficulty);
        update_post_meta($post_id, '_gaming_web_stage_clear_effect', $stage_clear_effect);
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

        if (get_post_meta($post->ID, '_gaming_web_mode', true) === 'disabled') {
            return false;
        }

        return GW_License::can_use_stage((int) $post->ID);
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
            'playStyle' => $this->play_style_for_post($post_id),
            'stageType' => $this->stage_type_for_post($post_id),
            'themeTokens' => array(),
            'importantWords' => $this->parse_important_words($important_words),
            'hasReward' => $this->has_clear_reward($post_id) ? '1' : '0',
            'enemyConfig' => $this->enemy_config_for_post($post_id),
            'stageAudio' => $this->stage_audio_for_post($post_id),
            'objectiveConfig' => $this->objective_config_for_post($post_id),
            'worldMap' => $this->world_map_config($post_id),
            'loggingEnabled' => GW_Settings::is_truthy(GW_Settings::OPTION_LOGGING_ENABLED),
            'debug' => GW_Settings::is_truthy(GW_Settings::OPTION_DEBUG),
            'locale' => determine_locale(),
            'messages' => array(),
            'license' => array(
                'plan' => GW_License::plan_slug(),
                'isPro' => GW_License::is_pro(),
                'stageLimit' => GW_License::stage_limit(),
            ),
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

    private function play_style_for_post(int $post_id): string
    {
        $global_style = sanitize_key((string) GW_Settings::get(GW_Settings::OPTION_PLAY_STYLE));
        if (!GW_Settings::is_allowed_play_style($global_style)) {
            $global_style = 'break';
        }

        $page_style = $post_id ? sanitize_key((string) get_post_meta($post_id, '_gaming_web_play_style', true)) : '';
        if (GW_Settings::is_allowed_play_style($page_style)) {
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
            return __('ゲームプレイ', 'gaming-web');
        }

        if ($key === GW_Settings::OPTION_CHARACTER_NAME && $value === 'Pico') {
            return __('チャラ', 'gaming-web');
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
        if (!GW_License::is_pro()) {
            return array(
                'enabled' => false,
                'plan' => 'free',
                'stageLimit' => GW_License::stage_limit(),
            );
        }

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
            'scoreKey' => 'gaming_web_stage_scores_' . substr(md5(home_url('/')), 0, 10),
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
        if (!GW_License::is_pro()) {
            $stages = array_slice($stages, 0, 1);
        }

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
        $type = $this->stage_type_for_post($post->ID);

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
            'difficulty' => GW_Enemies::difficulty(get_post_meta($post->ID, '_gaming_web_stage_difficulty', true) ?: 3),
            'playStyle' => $this->play_style_for_post($post->ID),
            'clearEffect' => $this->clear_effect_for_post($post->ID),
            'objective' => $this->objective_config_for_post($post->ID),
        );
    }

    private function enemy_config_for_post(int $post_id): array
    {
        if ($post_id <= 0 || !GW_License::is_pro()) {
            return array('enabled' => false);
        }

        $stage_difficulty = GW_Enemies::difficulty(get_post_meta($post_id, '_gaming_web_stage_difficulty', true) ?: 3);
        $normal_ids = get_post_meta($post_id, '_gaming_web_stage_enemy_ids', true);
        $normal_ids = is_array($normal_ids) ? array_map('strval', $normal_ids) : array();
        $boss_id = (string) get_post_meta($post_id, '_gaming_web_stage_boss_enemy_id', true);

        $normal_enemies = array();
        foreach ($normal_ids as $enemy_id) {
            $enemy = GW_Enemies::by_id($enemy_id);
            if ($enemy !== null) {
                $normal_enemies[] = GW_Enemies::frontend_enemy($enemy, 'normal');
            }
        }

        $boss_enemy = array();
        if ($boss_id !== '') {
            $enemy = GW_Enemies::by_id($boss_id);
            if ($enemy !== null) {
                $boss_enemy = GW_Enemies::frontend_enemy($enemy, 'boss');
            }
        }

        return array(
            'enabled' => !empty($normal_enemies) || !empty($boss_enemy),
            'stageDifficulty' => $stage_difficulty,
            'clearEffect' => $this->clear_effect_for_post($post_id),
            'normal' => $normal_enemies,
            'boss' => $boss_enemy,
        );
    }

    private function clear_effect_for_post(int $post_id): string
    {
        $effect = sanitize_key((string) get_post_meta($post_id, '_gaming_web_stage_clear_effect', true));
        return array_key_exists($effect, GW_Enemies::clear_effect_choices()) ? $effect : 'auto';
    }

    private function stage_type_for_post(int $post_id): string
    {
        if ($post_id <= 0) {
            return 'normal';
        }

        $type = sanitize_key((string) get_post_meta($post_id, '_gaming_web_world_map_type', true));
        if (in_array($type, array('normal', 'reward', 'boss', 'final'), true)) {
            return $type;
        }

        return $this->has_clear_reward($post_id) ? 'reward' : 'normal';
    }

    private function stage_is_final(int $post_id): bool
    {
        if ($post_id <= 0) {
            return false;
        }

        if ($this->stage_type_for_post($post_id) === 'final') {
            return true;
        }

        $current_id = 'post-' . $post_id;
        $stages = $this->world_map_stages($post_id);
        $has_explicit_final = false;
        foreach ($stages as $stage) {
            if (($stage['type'] ?? '') === 'final') {
                $has_explicit_final = true;
                break;
            }
        }

        foreach ($stages as $index => $stage) {
            if (($stage['id'] ?? '') === $current_id) {
                if (!$has_explicit_final && $index === count($stages) - 1) {
                    return true;
                }

                return ($stage['type'] ?? '') === 'final';
            }
        }

        return false;
    }

    private function stage_audio_for_post(int $post_id): array
    {
        if ($post_id <= 0) {
            return array();
        }

        if (!GW_License::is_pro()) {
            return array(
                'stageType' => $this->stage_type_for_post($post_id),
                'normalBgmUrl' => '',
                'stageBgmUrl' => '',
                'finalBgmUrl' => '',
                'bossBgmUrl' => '',
                'clearSoundUrl' => '',
            );
        }

        $stage_bgm_url = $this->attachment_url_meta($post_id, '_gaming_web_stage_bgm_id');
        $final_bgm_url = $this->attachment_url_from_id(absint(GW_Settings::get(GW_Settings::OPTION_AUDIO_FINAL_BGM_ID)));
        $normal_bgm_url = $this->attachment_url_meta($post_id, '_gaming_web_stage_normal_bgm_id');
        if ($normal_bgm_url === '') {
            $normal_bgm_url = $this->attachment_url_from_id(absint(GW_Settings::get(GW_Settings::OPTION_AUDIO_NORMAL_BGM_ID)));
        }

        return array(
            'stageType' => $this->stage_is_final($post_id) ? 'final' : $this->stage_type_for_post($post_id),
            'normalBgmUrl' => $normal_bgm_url,
            'stageBgmUrl' => $stage_bgm_url,
            'finalBgmUrl' => $final_bgm_url,
            'bossBgmUrl' => $this->attachment_url_meta($post_id, '_gaming_web_stage_boss_bgm_id'),
            'clearSoundUrl' => $this->attachment_url_meta($post_id, '_gaming_web_stage_clear_sound_id'),
        );
    }

    private function attachment_url_meta(int $post_id, string $meta_key): string
    {
        $attachment_id = absint(get_post_meta($post_id, $meta_key, true));
        if ($attachment_id <= 0) {
            return '';
        }

        $url = wp_get_attachment_url($attachment_id);
        return $url ? esc_url_raw($url) : '';
    }

    private function attachment_url_from_id(int $attachment_id): string
    {
        if ($attachment_id <= 0) {
            return '';
        }

        $url = wp_get_attachment_url($attachment_id);
        return $url ? esc_url_raw($url) : '';
    }

    private function objective_config_for_post(int $post_id): array
    {
        if (!GW_License::is_pro()) {
            return array(
                'type' => 'chests',
                'label' => __('宝箱', 'gaming-web'),
                'requiredCount' => 3,
            );
        }

        $type = sanitize_key((string) get_post_meta($post_id, '_gaming_web_stage_objective_type', true));
        if (!in_array($type, array('chests', 'products'), true)) {
            $type = 'chests';
        }

        $label = trim((string) get_post_meta($post_id, '_gaming_web_stage_objective_label', true));
        if ($label === '') {
            $label = $type === 'products'
                ? __('商品・アイテム', 'gaming-web')
                : __('宝箱', 'gaming-web');
        }

        $count = max(1, min(9, absint(get_post_meta($post_id, '_gaming_web_stage_objective_count', true) ?: 3)));

        return array(
            'type' => $type,
            'label' => $label,
            'requiredCount' => $count,
        );
    }
}
