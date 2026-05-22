<?php

if (!defined('ABSPATH')) {
    exit;
}

$role_choices = GW_Enemies::role_choices();
$behavior_choices = GW_Enemies::behavior_choices();
$rows = array_values(is_array($enemies ?? null) ? $enemies : array());
$rows[] = array(
    'enemy_id' => '',
    'name' => '',
    'image_id' => 0,
    'role' => 'normal',
    'behavior' => 'walker',
    'difficulty' => 3,
);
?>

<div class="wrap gaming-web-admin gaming-web-admin--wide">
    <h1><?php esc_html_e('CharaBreak キャラクター・敵キャラ台帳', 'gaming-web'); ?></h1>
    <p class="gaming-web-admin__lead">
        <?php esc_html_e('プレイヤー、案内役、通常敵、ボスを登録します。運営者は画像、役割、動き、難易度1〜8を選ぶだけで使えます。', 'gaming-web'); ?>
    </p>

    <?php if (isset($_GET['gaming_web_updated'])) : ?>
        <div class="notice notice-success is-dismissible"><p><?php esc_html_e('キャラクター・敵キャラ台帳を保存しました。', 'gaming-web'); ?></p></div>
    <?php endif; ?>

    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
        <?php wp_nonce_field('gaming_web_save_enemies'); ?>
        <input type="hidden" name="action" value="gaming_web_save_enemies">

        <div class="gaming-web-admin__toolbar">
            <p><?php esc_html_e('名前が空の行は保存されません。新しいキャラは一番下の空欄に入力してください。', 'gaming-web'); ?></p>
            <?php submit_button(__('台帳を保存', 'gaming-web'), 'primary', 'submit', false); ?>
        </div>

        <div class="gaming-web-admin__filters" data-gw-admin-filters="enemies">
            <label>
                <span><?php esc_html_e('検索', 'gaming-web'); ?></span>
                <input type="search" data-gw-admin-search placeholder="<?php esc_attr_e('キャラ名、IDで検索', 'gaming-web'); ?>">
            </label>
            <label>
                <span><?php esc_html_e('役割', 'gaming-web'); ?></span>
                <select data-gw-admin-filter="role">
                    <option value=""><?php esc_html_e('すべて', 'gaming-web'); ?></option>
                    <?php foreach ($role_choices as $value => $text) : ?>
                        <option value="<?php echo esc_attr($value); ?>"><?php echo esc_html($text); ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>
                <span><?php esc_html_e('動き', 'gaming-web'); ?></span>
                <select data-gw-admin-filter="behavior">
                    <option value=""><?php esc_html_e('すべて', 'gaming-web'); ?></option>
                    <?php foreach ($behavior_choices as $value => $text) : ?>
                        <option value="<?php echo esc_attr($value); ?>"><?php echo esc_html($text); ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <p class="gaming-web-admin__result-count" data-gw-admin-count></p>
        </div>

        <table class="widefat striped gaming-web-enemy-table">
            <thead>
                <tr>
                    <th><?php esc_html_e('キャラクター / モンスター', 'gaming-web'); ?></th>
                    <th><?php esc_html_e('画像', 'gaming-web'); ?></th>
                    <th><?php esc_html_e('役割 / 動き', 'gaming-web'); ?></th>
                    <th><?php esc_html_e('難易度', 'gaming-web'); ?></th>
                    <th><?php esc_html_e('自動ステータス', 'gaming-web'); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($rows as $index => $enemy) : ?>
                    <?php
                    $enemy_id = (string) ($enemy['enemy_id'] ?? '');
                    $name = (string) ($enemy['name'] ?? '');
                    $image_id = absint($enemy['image_id'] ?? 0);
                    $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'thumbnail') : '';
                    $role = (string) ($enemy['role'] ?? 'normal');
                    $role = array_key_exists($role, $role_choices) ? $role : 'normal';
                    $behavior = (string) ($enemy['behavior'] ?? 'walker');
                    $behavior = array_key_exists($behavior, $behavior_choices) ? $behavior : 'walker';
                    $difficulty = GW_Enemies::difficulty($enemy['difficulty'] ?? 3);
                    $stats_role = $role === 'boss' ? 'boss' : 'normal';
                    $stats = GW_Enemies::stats($stats_role, $difficulty);
                    ?>
                    <tr
                        data-gw-admin-row
                        data-gw-role="<?php echo esc_attr($role); ?>"
                        data-gw-behavior="<?php echo esc_attr($behavior); ?>"
                        data-gw-search="<?php echo esc_attr(strtolower($name . ' ' . $enemy_id . ' ' . $role . ' ' . $behavior)); ?>"
                    >
                        <td>
                            <input type="hidden" name="gaming_web_enemies[<?php echo esc_attr((string) $index); ?>][enemy_id]" value="<?php echo esc_attr($enemy_id); ?>">
                            <label>
                                <span><?php esc_html_e('名前', 'gaming-web'); ?></span>
                                <input type="text" name="gaming_web_enemies[<?php echo esc_attr((string) $index); ?>][name]" value="<?php echo esc_attr($name); ?>" class="widefat" placeholder="<?php esc_attr_e('クリスタルインプ', 'gaming-web'); ?>">
                            </label>
                            <?php if ($enemy_id !== '') : ?>
                                <p class="description"><?php echo esc_html($enemy_id); ?></p>
                            <?php endif; ?>
                        </td>
                        <td>
                            <div class="gaming-web-media-field">
                                <input type="hidden" class="gaming-web-media-field__input" name="gaming_web_enemies[<?php echo esc_attr((string) $index); ?>][image_id]" value="<?php echo esc_attr((string) $image_id); ?>">
                                <div class="gaming-web-media-field__preview">
                                    <?php if ($image_url) : ?>
                                        <img src="<?php echo esc_url($image_url); ?>" alt="">
                                    <?php else : ?>
                                        <span><?php esc_html_e('標準ドット表示', 'gaming-web'); ?></span>
                                    <?php endif; ?>
                                </div>
                                <button type="button" class="button gaming-web-media-field__choose"><?php esc_html_e('画像を選択', 'gaming-web'); ?></button>
                                <button type="button" class="button-link gaming-web-media-field__clear"><?php esc_html_e('解除', 'gaming-web'); ?></button>
                            </div>
                        </td>
                        <td>
                            <label>
                                <span><?php esc_html_e('役割', 'gaming-web'); ?></span>
                                <select name="gaming_web_enemies[<?php echo esc_attr((string) $index); ?>][role]" class="widefat">
                                    <?php foreach ($role_choices as $value => $text) : ?>
                                        <option value="<?php echo esc_attr($value); ?>" <?php selected($role, $value); ?>><?php echo esc_html($text); ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </label>
                            <label>
                                <span><?php esc_html_e('動き', 'gaming-web'); ?></span>
                                <select name="gaming_web_enemies[<?php echo esc_attr((string) $index); ?>][behavior]" class="widefat">
                                    <?php foreach ($behavior_choices as $value => $text) : ?>
                                        <option value="<?php echo esc_attr($value); ?>" <?php selected($behavior, $value); ?>><?php echo esc_html($text); ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </label>
                        </td>
                        <td>
                            <select name="gaming_web_enemies[<?php echo esc_attr((string) $index); ?>][difficulty]" class="widefat">
                                <?php for ($level = 1; $level <= 8; $level++) : ?>
                                    <option value="<?php echo esc_attr((string) $level); ?>" <?php selected($difficulty, $level); ?>>Lv.<?php echo esc_html((string) $level); ?></option>
                                <?php endfor; ?>
                            </select>
                        </td>
                        <td>
                            <dl class="gaming-web-stat-list">
                                <div><dt>HP</dt><dd><?php echo esc_html((string) $stats['hp']); ?></dd></div>
                                <div><dt><?php esc_html_e('速度', 'gaming-web'); ?></dt><dd><?php echo esc_html((string) $stats['speed']); ?></dd></div>
                                <div><dt><?php esc_html_e('攻撃間隔', 'gaming-web'); ?></dt><dd><?php echo esc_html((string) $stats['attackInterval']); ?>ms</dd></div>
                                <div><dt><?php esc_html_e('破壊力', 'gaming-web'); ?></dt><dd><?php echo esc_html((string) $stats['destroyLimit']); ?></dd></div>
                            </dl>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <p class="submit"><?php submit_button(__('台帳を保存', 'gaming-web'), 'primary', 'submit', false); ?></p>
    </form>
</div>
