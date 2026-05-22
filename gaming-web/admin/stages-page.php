<?php

if (!defined('ABSPATH')) {
    exit;
}

$enemy_choices = is_array($enemies ?? null) ? $enemies : array();
$stage_types = array(
    'normal' => __('通常ステージ', 'gaming-web'),
    'reward' => __('報酬ステージ', 'gaming-web'),
    'boss' => __('ボスステージ', 'gaming-web'),
    'final' => __('最終ステージ', 'gaming-web'),
);
$objective_types = array(
    'chests' => __('宝箱を集める', 'gaming-web'),
    'products' => __('商品・アイテムを集める', 'gaming-web'),
);
$audio_fields = array(
    'normal_bgm' => array(
        'label' => __('通常BGM', 'gaming-web'),
        'meta' => '_gaming_web_stage_normal_bgm_id',
        'name' => 'gaming_web_stage_normal_bgm_id',
    ),
    'stage_bgm' => array(
        'label' => __('このステージのBGM', 'gaming-web'),
        'meta' => '_gaming_web_stage_bgm_id',
        'name' => 'gaming_web_stage_bgm_id',
    ),
    'boss_bgm' => array(
        'label' => __('ボス登場BGM', 'gaming-web'),
        'meta' => '_gaming_web_stage_boss_bgm_id',
        'name' => 'gaming_web_stage_boss_bgm_id',
    ),
    'clear_sound' => array(
        'label' => __('クリア音', 'gaming-web'),
        'meta' => '_gaming_web_stage_clear_sound_id',
        'name' => 'gaming_web_stage_clear_sound_id',
    ),
);
$clear_effects = GW_Enemies::clear_effect_choices();
?>

<div class="wrap gaming-web-admin gaming-web-admin--wide">
    <h1><?php esc_html_e('CharaBreak ステージ管理', 'gaming-web'); ?></h1>
    <p class="gaming-web-admin__lead">
        <?php esc_html_e('ゲーム化するページ、ワールドマップの並び、敵キャラ、報酬、クリア条件をまとめて設定します。', 'gaming-web'); ?>
    </p>

    <?php if (isset($_GET['gaming_web_updated'])) : ?>
        <div class="notice notice-success is-dismissible"><p><?php esc_html_e('ステージ設定を保存しました。', 'gaming-web'); ?></p></div>
    <?php endif; ?>

    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
        <?php wp_nonce_field('gaming_web_save_stages'); ?>
        <input type="hidden" name="action" value="gaming_web_save_stages">

        <div class="gaming-web-admin__toolbar">
            <p><?php esc_html_e('チェックを外したページはゲーム化されず、ワールドマップにも表示されません。', 'gaming-web'); ?></p>
            <?php submit_button(__('ステージ設定を保存', 'gaming-web'), 'primary', 'submit', false); ?>
        </div>

        <div class="gaming-web-admin__filters" data-gw-admin-filters="stages">
            <label>
                <span><?php esc_html_e('検索', 'gaming-web'); ?></span>
                <input type="search" data-gw-admin-search placeholder="<?php esc_attr_e('ページ名、ID、種類で検索', 'gaming-web'); ?>">
            </label>
            <label>
                <span><?php esc_html_e('状態', 'gaming-web'); ?></span>
                <select data-gw-admin-filter="enabled">
                    <option value=""><?php esc_html_e('すべて', 'gaming-web'); ?></option>
                    <option value="1"><?php esc_html_e('使用中', 'gaming-web'); ?></option>
                    <option value="0"><?php esc_html_e('未使用', 'gaming-web'); ?></option>
                </select>
            </label>
            <label>
                <span><?php esc_html_e('種類', 'gaming-web'); ?></span>
                <select data-gw-admin-filter="type">
                    <option value=""><?php esc_html_e('すべて', 'gaming-web'); ?></option>
                    <?php foreach ($stage_types as $value => $text) : ?>
                        <option value="<?php echo esc_attr($value); ?>"><?php echo esc_html($text); ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <p class="gaming-web-admin__result-count" data-gw-admin-count></p>
        </div>

        <table class="widefat striped gaming-web-stage-table">
            <thead>
                <tr>
                    <th class="gaming-web-stage-table__enabled"><?php esc_html_e('使用', 'gaming-web'); ?></th>
                    <th><?php esc_html_e('ページ', 'gaming-web'); ?></th>
                    <th><?php esc_html_e('マップ表示', 'gaming-web'); ?></th>
                    <th><?php esc_html_e('敵・難易度', 'gaming-web'); ?></th>
                    <th><?php esc_html_e('報酬・クリア条件', 'gaming-web'); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($stages as $post) : ?>
                    <?php
                    if (!$post instanceof WP_Post) {
                        continue;
                    }
                    $post_id = $post->ID;
                    $mode = get_post_meta($post_id, '_gaming_web_mode', true);
                    $enabled = $mode !== 'disabled' && get_post_meta($post_id, '_gaming_web_world_map_include', true) !== '0';
                    $label = get_post_meta($post_id, '_gaming_web_world_map_label', true);
                    $order = get_post_meta($post_id, '_gaming_web_world_map_order', true);
                    $type = get_post_meta($post_id, '_gaming_web_world_map_type', true);
                    $type = array_key_exists($type, $stage_types) ? $type : 'normal';
                    $reward_label = get_post_meta($post_id, '_gaming_web_world_map_reward_label', true);
                    $difficulty = GW_Enemies::difficulty(get_post_meta($post_id, '_gaming_web_stage_difficulty', true) ?: 3);
                    $effect = get_post_meta($post_id, '_gaming_web_stage_clear_effect', true);
                    $effect = array_key_exists($effect, $clear_effects) ? $effect : 'auto';
                    $objective_type = get_post_meta($post_id, '_gaming_web_stage_objective_type', true);
                    $objective_type = array_key_exists($objective_type, $objective_types) ? $objective_type : 'chests';
                    $objective_label = get_post_meta($post_id, '_gaming_web_stage_objective_label', true);
                    $objective_count = max(1, min(9, absint(get_post_meta($post_id, '_gaming_web_stage_objective_count', true) ?: 3)));
                    $stage_enemy_ids = get_post_meta($post_id, '_gaming_web_stage_enemy_ids', true);
                    $stage_enemy_ids = is_array($stage_enemy_ids) ? array_map('strval', $stage_enemy_ids) : array();
                    $boss_enemy_id = (string) get_post_meta($post_id, '_gaming_web_stage_boss_enemy_id', true);
                    $post_type_label = $post->post_type === 'page' ? __('固定ページ', 'gaming-web') : ($post->post_type === 'post' ? __('投稿', 'gaming-web') : $post->post_type);
                    ?>
                    <tr
                        data-gw-admin-row
                        data-gw-enabled="<?php echo esc_attr($enabled ? '1' : '0'); ?>"
                        data-gw-type="<?php echo esc_attr($type); ?>"
                        data-gw-search="<?php echo esc_attr(strtolower(get_the_title($post) . ' ' . $post_id . ' ' . $post->post_type . ' ' . $label . ' ' . $type)); ?>"
                    >
                        <td class="gaming-web-stage-table__enabled">
                            <input type="hidden" name="gaming_web_stage_ids[]" value="<?php echo esc_attr($post_id); ?>">
                            <label>
                                <input type="checkbox" name="gaming_web_stage_enabled[]" value="<?php echo esc_attr($post_id); ?>" <?php checked($enabled); ?>>
                                <strong><?php esc_html_e('使用する', 'gaming-web'); ?></strong>
                            </label>
                            <p class="description">#<?php echo esc_html((string) $post_id); ?></p>
                        </td>
                        <td>
                            <strong><?php echo esc_html(get_the_title($post)); ?></strong>
                            <p class="description">
                                <?php echo esc_html($post_type_label); ?> /
                                <a href="<?php echo esc_url(get_permalink($post)); ?>" target="_blank" rel="noopener"><?php esc_html_e('表示', 'gaming-web'); ?></a> /
                                <a href="<?php echo esc_url(get_edit_post_link($post_id)); ?>"><?php esc_html_e('編集', 'gaming-web'); ?></a>
                            </p>
                        </td>
                        <td>
                            <label>
                                <span><?php esc_html_e('ステージ名', 'gaming-web'); ?></span>
                                <input type="text" name="gaming_web_world_map_label[<?php echo esc_attr($post_id); ?>]" value="<?php echo esc_attr($label); ?>" class="widefat" placeholder="<?php echo esc_attr(get_the_title($post)); ?>">
                            </label>
                            <div class="gaming-web-admin__inline-fields">
                                <label>
                                    <span><?php esc_html_e('順番', 'gaming-web'); ?></span>
                                    <input type="number" min="0" step="1" name="gaming_web_world_map_order[<?php echo esc_attr($post_id); ?>]" value="<?php echo esc_attr($order); ?>">
                                </label>
                                <label>
                                    <span><?php esc_html_e('種類', 'gaming-web'); ?></span>
                                    <select name="gaming_web_world_map_type[<?php echo esc_attr($post_id); ?>]">
                                        <?php foreach ($stage_types as $value => $text) : ?>
                                            <option value="<?php echo esc_attr($value); ?>" <?php selected($type, $value); ?>><?php echo esc_html($text); ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </label>
                                <label>
                                    <span><?php esc_html_e('難易度', 'gaming-web'); ?></span>
                                    <select name="gaming_web_stage_difficulty[<?php echo esc_attr($post_id); ?>]">
                                        <?php for ($level = 1; $level <= 8; $level++) : ?>
                                            <option value="<?php echo esc_attr((string) $level); ?>" <?php selected($difficulty, $level); ?>><?php echo esc_html((string) $level); ?></option>
                                        <?php endfor; ?>
                                    </select>
                                </label>
                            </div>
                        </td>
                        <td>
                            <label>
                                <span><?php esc_html_e('通常敵', 'gaming-web'); ?></span>
                                <select name="gaming_web_stage_enemy_ids[<?php echo esc_attr($post_id); ?>][]" class="widefat" multiple size="4">
                                    <?php foreach ($enemy_choices as $enemy) : ?>
                                        <?php
                                        $enemy_id = (string) ($enemy['enemy_id'] ?? '');
                                        $role = (string) ($enemy['role'] ?? 'normal');
                                        if ($enemy_id === '' || !in_array($role, array('normal', 'both'), true)) {
                                            continue;
                                        }
                                        ?>
                                        <option value="<?php echo esc_attr($enemy_id); ?>" <?php selected(in_array($enemy_id, $stage_enemy_ids, true)); ?>>
                                            <?php echo esc_html(sprintf('%s / Lv.%d', (string) ($enemy['name'] ?? ''), GW_Enemies::difficulty($enemy['difficulty'] ?? 3))); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </label>
                            <label>
                                <span><?php esc_html_e('ボス敵', 'gaming-web'); ?></span>
                                <select name="gaming_web_stage_boss_enemy_id[<?php echo esc_attr($post_id); ?>]" class="widefat">
                                    <option value=""><?php esc_html_e('デフォルト / なし', 'gaming-web'); ?></option>
                                    <?php foreach ($enemy_choices as $enemy) : ?>
                                        <?php
                                        $enemy_id = (string) ($enemy['enemy_id'] ?? '');
                                        $role = (string) ($enemy['role'] ?? 'normal');
                                        if ($enemy_id === '' || !in_array($role, array('boss', 'both'), true)) {
                                            continue;
                                        }
                                        ?>
                                        <option value="<?php echo esc_attr($enemy_id); ?>" <?php selected($boss_enemy_id, $enemy_id); ?>>
                                            <?php echo esc_html(sprintf('%s / Lv.%d', (string) ($enemy['name'] ?? ''), GW_Enemies::difficulty($enemy['difficulty'] ?? 3))); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </label>
                        </td>
                        <td>
                            <label>
                                <span><?php esc_html_e('報酬の予告', 'gaming-web'); ?></span>
                                <input type="text" name="gaming_web_world_map_reward_label[<?php echo esc_attr($post_id); ?>]" value="<?php echo esc_attr($reward_label); ?>" class="widefat" placeholder="<?php esc_attr_e('クーポン、限定ページ、秘密のメッセージなど', 'gaming-web'); ?>">
                            </label>
                            <label>
                                <span><?php esc_html_e('クリア演出', 'gaming-web'); ?></span>
                                <select name="gaming_web_stage_clear_effect[<?php echo esc_attr($post_id); ?>]" class="widefat">
                                    <?php foreach ($clear_effects as $value => $text) : ?>
                                        <option value="<?php echo esc_attr($value); ?>" <?php selected($effect, $value); ?>><?php echo esc_html($text); ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </label>
                            <details class="gaming-web-stage-advanced">
                                <summary><?php esc_html_e('Pro設定：BGM・クリア条件', 'gaming-web'); ?></summary>
                                <div class="gaming-web-admin__inline-fields gaming-web-admin__inline-fields--objective">
                                    <label>
                                        <span><?php esc_html_e('クリア条件', 'gaming-web'); ?></span>
                                        <select name="gaming_web_stage_objective_type[<?php echo esc_attr($post_id); ?>]">
                                            <?php foreach ($objective_types as $value => $text) : ?>
                                                <option value="<?php echo esc_attr($value); ?>" <?php selected($objective_type, $value); ?>><?php echo esc_html($text); ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </label>
                                    <label>
                                        <span><?php esc_html_e('集めるものの名前', 'gaming-web'); ?></span>
                                        <input type="text" name="gaming_web_stage_objective_label[<?php echo esc_attr($post_id); ?>]" value="<?php echo esc_attr($objective_label); ?>" placeholder="<?php esc_attr_e('自社製品', 'gaming-web'); ?>">
                                    </label>
                                    <label>
                                        <span><?php esc_html_e('必要数', 'gaming-web'); ?></span>
                                        <input type="number" min="1" max="9" step="1" name="gaming_web_stage_objective_count[<?php echo esc_attr($post_id); ?>]" value="<?php echo esc_attr((string) $objective_count); ?>">
                                    </label>
                                </div>
                                <div class="gaming-web-audio-grid">
                                    <?php foreach ($audio_fields as $audio_field) : ?>
                                        <?php
                                        $audio_id = absint(get_post_meta($post_id, $audio_field['meta'], true));
                                        $audio_url = $audio_id > 0 ? wp_get_attachment_url($audio_id) : '';
                                        $audio_label = $audio_url ? basename((string) parse_url($audio_url, PHP_URL_PATH)) : __('標準シンセ', 'gaming-web');
                                        ?>
                                        <div class="gaming-web-media-field gaming-web-media-field--audio" data-gw-media-type="audio" data-gw-media-preview="text">
                                            <span><?php echo esc_html($audio_field['label']); ?></span>
                                            <input type="hidden" class="gaming-web-media-field__input" name="<?php echo esc_attr($audio_field['name']); ?>[<?php echo esc_attr($post_id); ?>]" value="<?php echo esc_attr((string) $audio_id); ?>">
                                            <div class="gaming-web-media-field__preview"><span><?php echo esc_html($audio_label); ?></span></div>
                                            <button type="button" class="button gaming-web-media-field__choose"><?php esc_html_e('選択', 'gaming-web'); ?></button>
                                            <button type="button" class="button-link gaming-web-media-field__clear"><?php esc_html_e('解除', 'gaming-web'); ?></button>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            </details>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <p class="submit"><?php submit_button(__('ステージ設定を保存', 'gaming-web'), 'primary', 'submit', false); ?></p>
    </form>
</div>
