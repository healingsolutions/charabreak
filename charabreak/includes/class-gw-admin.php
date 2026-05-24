<?php

if (!defined('ABSPATH')) {
    exit;
}

class GW_Admin
{
    private GW_Settings $settings;

    public function __construct(GW_Settings $settings)
    {
        $this->settings = $settings;
    }

    public function init(): void
    {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_assets'));
        add_action('admin_post_gaming_web_save_stages', array($this, 'save_stages'));
        add_action('admin_post_gaming_web_save_enemies', array($this, 'save_enemies'));
    }

    public function add_admin_menu(): void
    {
        add_menu_page(
            __('CharaBreak', 'gaming-web'),
            __('CharaBreak', 'gaming-web'),
            'manage_options',
            'gaming-web-stages',
            array($this, 'render_stages_page'),
            'dashicons-games',
            56
        );

        add_submenu_page(
            'gaming-web-stages',
            __('ステージ管理', 'gaming-web'),
            __('ステージ管理', 'gaming-web'),
            'manage_options',
            'gaming-web-stages',
            array($this, 'render_stages_page')
        );

        add_submenu_page(
            'gaming-web-stages',
            __('キャラクター・敵キャラ台帳', 'gaming-web'),
            __('キャラクター・敵キャラ台帳', 'gaming-web'),
            'manage_options',
            'gaming-web-enemies',
            array($this, 'render_enemies_page')
        );

        add_submenu_page(
            'gaming-web-stages',
            __('基本設定', 'gaming-web'),
            __('基本設定', 'gaming-web'),
            'manage_options',
            'gaming-web',
            array($this->settings, 'render_admin_page')
        );
    }

    public function enqueue_assets(string $hook): void
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

        wp_enqueue_media();
        wp_enqueue_script(
            'gaming-web-admin',
            GAMING_WEB_URL . 'admin/admin.js',
            array('jquery'),
            GAMING_WEB_VERSION,
            true
        );
    }

    public function render_stages_page(): void
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        $stages = $this->stage_rows();
        $enemies = GW_Enemies::all();
        include GAMING_WEB_DIR . 'admin/stages-page.php';
    }

    public function render_enemies_page(): void
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        $enemies = GW_Enemies::all();
        include GAMING_WEB_DIR . 'admin/enemies-page.php';
    }

    public function save_stages(): void
    {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('CharaBreakのステージ設定を編集する権限がありません。', 'gaming-web'));
        }

        check_admin_referer('gaming_web_save_stages');

        $post_ids = array_map('absint', (array) ($_POST['gaming_web_stage_ids'] ?? array()));
        $enabled_ids = array_map('absint', (array) ($_POST['gaming_web_stage_enabled'] ?? array()));
        $labels = isset($_POST['gaming_web_world_map_label']) && is_array($_POST['gaming_web_world_map_label']) ? $_POST['gaming_web_world_map_label'] : array();
        $orders = isset($_POST['gaming_web_world_map_order']) && is_array($_POST['gaming_web_world_map_order']) ? $_POST['gaming_web_world_map_order'] : array();
        $types = isset($_POST['gaming_web_world_map_type']) && is_array($_POST['gaming_web_world_map_type']) ? $_POST['gaming_web_world_map_type'] : array();
        $play_styles = isset($_POST['gaming_web_play_style']) && is_array($_POST['gaming_web_play_style']) ? $_POST['gaming_web_play_style'] : array();
        $rewards = isset($_POST['gaming_web_world_map_reward_label']) && is_array($_POST['gaming_web_world_map_reward_label']) ? $_POST['gaming_web_world_map_reward_label'] : array();
        $difficulties = isset($_POST['gaming_web_stage_difficulty']) && is_array($_POST['gaming_web_stage_difficulty']) ? $_POST['gaming_web_stage_difficulty'] : array();
        $effects = isset($_POST['gaming_web_stage_clear_effect']) && is_array($_POST['gaming_web_stage_clear_effect']) ? $_POST['gaming_web_stage_clear_effect'] : array();
        $objective_types = isset($_POST['gaming_web_stage_objective_type']) && is_array($_POST['gaming_web_stage_objective_type']) ? $_POST['gaming_web_stage_objective_type'] : array();
        $objective_labels = isset($_POST['gaming_web_stage_objective_label']) && is_array($_POST['gaming_web_stage_objective_label']) ? $_POST['gaming_web_stage_objective_label'] : array();
        $objective_counts = isset($_POST['gaming_web_stage_objective_count']) && is_array($_POST['gaming_web_stage_objective_count']) ? $_POST['gaming_web_stage_objective_count'] : array();
        $normal_bgm_ids = isset($_POST['gaming_web_stage_normal_bgm_id']) && is_array($_POST['gaming_web_stage_normal_bgm_id']) ? $_POST['gaming_web_stage_normal_bgm_id'] : array();
        $stage_bgm_ids = isset($_POST['gaming_web_stage_bgm_id']) && is_array($_POST['gaming_web_stage_bgm_id']) ? $_POST['gaming_web_stage_bgm_id'] : array();
        $boss_bgm_ids = isset($_POST['gaming_web_stage_boss_bgm_id']) && is_array($_POST['gaming_web_stage_boss_bgm_id']) ? $_POST['gaming_web_stage_boss_bgm_id'] : array();
        $clear_sound_ids = isset($_POST['gaming_web_stage_clear_sound_id']) && is_array($_POST['gaming_web_stage_clear_sound_id']) ? $_POST['gaming_web_stage_clear_sound_id'] : array();
        $enemy_ids = isset($_POST['gaming_web_stage_enemy_ids']) && is_array($_POST['gaming_web_stage_enemy_ids']) ? $_POST['gaming_web_stage_enemy_ids'] : array();
        $boss_ids = isset($_POST['gaming_web_stage_boss_enemy_id']) && is_array($_POST['gaming_web_stage_boss_enemy_id']) ? $_POST['gaming_web_stage_boss_enemy_id'] : array();
        $known_enemy_ids = array_map(static fn(array $enemy): string => (string) ($enemy['enemy_id'] ?? ''), GW_Enemies::all());

        foreach ($post_ids as $post_id) {
            if ($post_id <= 0 || !current_user_can('edit_post', $post_id)) {
                continue;
            }

            $enabled = in_array($post_id, $enabled_ids, true);
            update_post_meta($post_id, '_gaming_web_mode', $enabled ? 'enabled' : 'disabled');
            update_post_meta($post_id, '_gaming_web_world_map_include', $enabled ? '1' : '0');
            update_post_meta($post_id, '_gaming_web_world_map_label', sanitize_text_field(wp_unslash((string) ($labels[$post_id] ?? ''))));
            update_post_meta($post_id, '_gaming_web_world_map_order', (string) max(0, absint($orders[$post_id] ?? 0)));

            $type = sanitize_key((string) ($types[$post_id] ?? 'normal'));
            if (!in_array($type, array('normal', 'reward', 'boss', 'final'), true)) {
                $type = 'normal';
            }
            update_post_meta($post_id, '_gaming_web_world_map_type', $type);

            $play_style = sanitize_key((string) ($play_styles[$post_id] ?? 'inherit'));
            if (!in_array($play_style, array_merge(array('inherit'), array_keys(GW_Settings::play_style_choices())), true)) {
                $play_style = 'inherit';
            }
            update_post_meta($post_id, '_gaming_web_play_style', $play_style);

            update_post_meta($post_id, '_gaming_web_world_map_reward_label', sanitize_text_field(wp_unslash((string) ($rewards[$post_id] ?? ''))));
            update_post_meta($post_id, '_gaming_web_stage_difficulty', (string) GW_Enemies::difficulty($difficulties[$post_id] ?? 3));

            $effect = sanitize_key((string) ($effects[$post_id] ?? 'auto'));
            if (!array_key_exists($effect, GW_Enemies::clear_effect_choices())) {
                $effect = 'auto';
            }
            update_post_meta($post_id, '_gaming_web_stage_clear_effect', $effect);

            $objective_type = sanitize_key((string) ($objective_types[$post_id] ?? 'chests'));
            if (!in_array($objective_type, array('chests', 'products'), true)) {
                $objective_type = 'chests';
            }
            update_post_meta($post_id, '_gaming_web_stage_objective_type', $objective_type);
            update_post_meta($post_id, '_gaming_web_stage_objective_label', sanitize_text_field(wp_unslash((string) ($objective_labels[$post_id] ?? ''))));
            update_post_meta($post_id, '_gaming_web_stage_objective_count', (string) max(1, min(9, absint($objective_counts[$post_id] ?? 3))));

            update_post_meta($post_id, '_gaming_web_stage_normal_bgm_id', (string) absint($normal_bgm_ids[$post_id] ?? 0));
            update_post_meta($post_id, '_gaming_web_stage_bgm_id', (string) absint($stage_bgm_ids[$post_id] ?? 0));
            update_post_meta($post_id, '_gaming_web_stage_boss_bgm_id', (string) absint($boss_bgm_ids[$post_id] ?? 0));
            update_post_meta($post_id, '_gaming_web_stage_clear_sound_id', (string) absint($clear_sound_ids[$post_id] ?? 0));

            $stage_enemy_ids = array();
            foreach ((array) ($enemy_ids[$post_id] ?? array()) as $enemy_id) {
                $enemy_id = sanitize_key((string) $enemy_id);
                if ($enemy_id !== '' && in_array($enemy_id, $known_enemy_ids, true)) {
                    $stage_enemy_ids[] = $enemy_id;
                }
            }
            update_post_meta($post_id, '_gaming_web_stage_enemy_ids', array_values(array_unique($stage_enemy_ids)));

            $boss_id = sanitize_key((string) ($boss_ids[$post_id] ?? ''));
            update_post_meta($post_id, '_gaming_web_stage_boss_enemy_id', in_array($boss_id, $known_enemy_ids, true) ? $boss_id : '');
        }

        wp_safe_redirect(add_query_arg('gaming_web_updated', '1', admin_url('admin.php?page=gaming-web-stages')));
        exit;
    }

    public function save_enemies(): void
    {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('CharaBreakの敵キャラ台帳を編集する権限がありません。', 'gaming-web'));
        }

        check_admin_referer('gaming_web_save_enemies');
        GW_Enemies::save_from_request($_POST['gaming_web_enemies'] ?? array());
        wp_safe_redirect(add_query_arg('gaming_web_updated', '1', admin_url('admin.php?page=gaming-web-enemies')));
        exit;
    }

    private function stage_rows(): array
    {
        $enabled_types = GW_Settings::get(GW_Settings::OPTION_POST_TYPES);
        $enabled_types = is_array($enabled_types) ? array_values(array_filter($enabled_types)) : array('page', 'post');
        if (empty($enabled_types)) {
            $enabled_types = array('page', 'post');
        }

        return get_posts(array(
            'post_type' => $enabled_types,
            'post_status' => 'publish',
            'posts_per_page' => 120,
            'orderby' => array(
                'menu_order' => 'ASC',
                'title' => 'ASC',
            ),
            'suppress_filters' => false,
        ));
    }
}
