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
    public const OPTION_LOGGING_ENABLED = 'gaming_web_logging_enabled';
    public const OPTION_DEBUG = 'gaming_web_debug';

    public static function defaults(): array
    {
        return array(
            self::OPTION_ENABLED => '1',
            self::OPTION_SHOW_FLOATING_BUTTON => '1',
            self::OPTION_POST_TYPES => array('page', 'post'),
            self::OPTION_BUTTON_LABEL => 'Game Mode',
            self::OPTION_CHARACTER_NAME => 'Pico',
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
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
    }

    public function add_admin_menu(): void
    {
        add_options_page(
            __('Gaming Web', 'gaming-web'),
            __('Gaming Web', 'gaming-web'),
            'manage_options',
            'gaming-web',
            array($this, 'render_admin_page')
        );
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
            'default' => 'Game Mode',
        ));

        register_setting('gaming_web_settings', self::OPTION_CHARACTER_NAME, array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
            'default' => 'Pico',
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
        if ($hook !== 'settings_page_gaming-web') {
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
