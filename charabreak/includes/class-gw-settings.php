<?php

if (!defined('ABSPATH')) {
    exit;
}

class GW_Settings
{
    public const OPTION_ENABLED = 'gaming_web_enabled';
    public const OPTION_SHOW_FLOATING_BUTTON = 'gaming_web_show_floating_button';
    public const OPTION_POST_TYPES = 'gaming_web_post_types';
    public const OPTION_BUTTON_LABEL = 'gaming_web_button_label';
    public const OPTION_CHARACTER_NAME = 'gaming_web_character_name';
    public const OPTION_VISUAL_STYLE = 'gaming_web_visual_style';
    public const OPTION_PLAY_STYLE = 'gaming_web_play_style';
    public const OPTION_AUDIO_NORMAL_BGM_ID = 'gaming_web_audio_normal_bgm_id';
    public const OPTION_AUDIO_FINAL_BGM_ID = 'gaming_web_audio_final_bgm_id';
    public const OPTION_WORLD_MAP_ENABLED = 'gaming_web_world_map_enabled';
    public const OPTION_WORLD_MAP_TITLE = 'gaming_web_world_map_title';
    public const OPTION_WORLD_MAP_GOAL_LABEL = 'gaming_web_world_map_goal_label';
    public const OPTION_WORLD_MAP_REQUIRED_CLEAR_COUNT = 'gaming_web_world_map_required_clear_count';
    public const OPTION_WORLD_MAP_SHOW_ON_START = 'gaming_web_world_map_show_on_start';
    public const OPTION_WORLD_MAP_SHOW_IN_HUD = 'gaming_web_world_map_show_in_hud';
    public const OPTION_WORLD_MAP_SHOW_AFTER_CLEAR = 'gaming_web_world_map_show_after_clear';
    public const OPTION_LOGGING_ENABLED = 'gaming_web_logging_enabled';
    public const OPTION_DEBUG = 'gaming_web_debug';

    public static function defaults(): array
    {
        return array(
            self::OPTION_ENABLED => '1',
            self::OPTION_SHOW_FLOATING_BUTTON => '1',
            self::OPTION_POST_TYPES => array('page', 'post'),
            self::OPTION_BUTTON_LABEL => 'ゲームプレイ',
            self::OPTION_CHARACTER_NAME => 'チャラ',
            self::OPTION_VISUAL_STYLE => 'auto',
            self::OPTION_PLAY_STYLE => 'break',
            self::OPTION_AUDIO_NORMAL_BGM_ID => '0',
            self::OPTION_AUDIO_FINAL_BGM_ID => '0',
            self::OPTION_WORLD_MAP_ENABLED => '1',
            self::OPTION_WORLD_MAP_TITLE => 'CharaBreak ワールド',
            self::OPTION_WORLD_MAP_GOAL_LABEL => '最終ゲート',
            self::OPTION_WORLD_MAP_REQUIRED_CLEAR_COUNT => '3',
            self::OPTION_WORLD_MAP_SHOW_ON_START => '0',
            self::OPTION_WORLD_MAP_SHOW_IN_HUD => '1',
            self::OPTION_WORLD_MAP_SHOW_AFTER_CLEAR => '1',
            self::OPTION_LOGGING_ENABLED => '1',
            self::OPTION_DEBUG => '0',
        );
    }

    public static function add_default_options(): void
    {
        foreach (self::defaults() as $key => $value) {
            if (get_option($key, null) === null) {
                add_option($key, $value);
            }
        }
    }

    public function init(): void
    {
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
    }

    public function register_settings(): void
    {
        register_setting('gaming_web_settings', self::OPTION_ENABLED, array(
            'type' => 'string',
            'sanitize_callback' => array($this, 'sanitize_checkbox'),
            'default' => '1',
        ));

        register_setting('gaming_web_settings', self::OPTION_SHOW_FLOATING_BUTTON, array(
            'type' => 'string',
            'sanitize_callback' => array($this, 'sanitize_checkbox'),
            'default' => '1',
        ));

        register_setting('gaming_web_settings', self::OPTION_POST_TYPES, array(
            'type' => 'array',
            'sanitize_callback' => array($this, 'sanitize_post_types'),
            'default' => array('page', 'post'),
        ));

        register_setting('gaming_web_settings', self::OPTION_BUTTON_LABEL, array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
            'default' => 'ゲームプレイ',
        ));

        register_setting('gaming_web_settings', self::OPTION_CHARACTER_NAME, array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
            'default' => 'チャラ',
        ));

        register_setting('gaming_web_settings', self::OPTION_VISUAL_STYLE, array(
            'type' => 'string',
            'sanitize_callback' => array($this, 'sanitize_visual_style'),
            'default' => 'auto',
        ));

        register_setting('gaming_web_settings', self::OPTION_PLAY_STYLE, array(
            'type' => 'string',
            'sanitize_callback' => array($this, 'sanitize_play_style'),
            'default' => 'break',
        ));

        register_setting('gaming_web_settings', self::OPTION_AUDIO_NORMAL_BGM_ID, array(
            'type' => 'string',
            'sanitize_callback' => array($this, 'sanitize_non_negative_int_string'),
            'default' => '0',
        ));

        register_setting('gaming_web_settings', self::OPTION_AUDIO_FINAL_BGM_ID, array(
            'type' => 'string',
            'sanitize_callback' => array($this, 'sanitize_non_negative_int_string'),
            'default' => '0',
        ));

        register_setting('gaming_web_settings', self::OPTION_WORLD_MAP_ENABLED, array(
            'type' => 'string',
            'sanitize_callback' => array($this, 'sanitize_checkbox'),
            'default' => '1',
        ));

        register_setting('gaming_web_settings', self::OPTION_WORLD_MAP_TITLE, array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
            'default' => 'CharaBreak ワールド',
        ));

        register_setting('gaming_web_settings', self::OPTION_WORLD_MAP_GOAL_LABEL, array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
            'default' => '最終ゲート',
        ));

        register_setting('gaming_web_settings', self::OPTION_WORLD_MAP_REQUIRED_CLEAR_COUNT, array(
            'type' => 'string',
            'sanitize_callback' => array($this, 'sanitize_non_negative_int_string'),
            'default' => '3',
        ));

        register_setting('gaming_web_settings', self::OPTION_WORLD_MAP_SHOW_ON_START, array(
            'type' => 'string',
            'sanitize_callback' => array($this, 'sanitize_checkbox'),
            'default' => '0',
        ));

        register_setting('gaming_web_settings', self::OPTION_WORLD_MAP_SHOW_IN_HUD, array(
            'type' => 'string',
            'sanitize_callback' => array($this, 'sanitize_checkbox'),
            'default' => '1',
        ));

        register_setting('gaming_web_settings', self::OPTION_WORLD_MAP_SHOW_AFTER_CLEAR, array(
            'type' => 'string',
            'sanitize_callback' => array($this, 'sanitize_checkbox'),
            'default' => '1',
        ));

        register_setting('gaming_web_settings', self::OPTION_LOGGING_ENABLED, array(
            'type' => 'string',
            'sanitize_callback' => array($this, 'sanitize_checkbox'),
            'default' => '1',
        ));

        register_setting('gaming_web_settings', self::OPTION_DEBUG, array(
            'type' => 'string',
            'sanitize_callback' => array($this, 'sanitize_checkbox'),
            'default' => '0',
        ));
    }

    public function enqueue_admin_assets(string $hook): void
    {
        if (strpos($hook, 'gaming-web') === false) {
            return;
        }

        wp_enqueue_style(
            'gaming-web-admin',
            GAMING_WEB_URL . 'admin/admin.css',
            array(),
            GAMING_WEB_VERSION
        );
    }

    public function render_admin_page(): void
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        include GAMING_WEB_DIR . 'admin/admin-page.php';
    }

    public function sanitize_checkbox($value): string
    {
        return $value === '1' || $value === 1 || $value === true ? '1' : '0';
    }

    public function sanitize_post_types($value): array
    {
        $allowed = array('page', 'post');
        $value = is_array($value) ? $value : array();

        return array_values(array_intersect($allowed, array_map('sanitize_key', $value)));
    }

    public function sanitize_visual_style($value): string
    {
        $value = sanitize_key((string) $value);

        return self::is_allowed_visual_style($value) ? $value : 'auto';
    }

    public function sanitize_play_style($value): string
    {
        $value = sanitize_key((string) $value);

        return self::is_allowed_play_style($value) ? $value : 'break';
    }

    public function sanitize_non_negative_int_string($value): string
    {
        return (string) max(0, absint($value));
    }

    public static function visual_style_choices(): array
    {
        return array(
            'auto' => __('自動', 'gaming-web'),
            'soft' => __('ソフト', 'gaming-web'),
            'pastel' => __('パステル', 'gaming-web'),
            'neon' => __('ネオン', 'gaming-web'),
        );
    }

    public static function is_allowed_visual_style(string $value): bool
    {
        return array_key_exists($value, self::visual_style_choices());
    }

    public static function play_style_choices(): array
    {
        return array(
            'break' => __('Break: 壊して進む', 'gaming-web'),
            'bloom' => __('Bloom: 花に変えて進む', 'gaming-web'),
            'hybrid' => __('Hybrid: 攻撃は壊す / ため攻撃は咲かせる', 'gaming-web'),
        );
    }

    public static function is_allowed_play_style(string $value): bool
    {
        return array_key_exists($value, self::play_style_choices());
    }

    public static function get(string $key)
    {
        $defaults = self::defaults();
        return get_option($key, $defaults[$key] ?? null);
    }

    public static function is_truthy(string $key): bool
    {
        return self::get($key) === '1';
    }
}
