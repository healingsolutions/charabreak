<?php

if (!defined('ABSPATH')) {
    exit;
}

$enabled = GW_Settings::get(GW_Settings::OPTION_ENABLED);
$show_floating_button = GW_Settings::get(GW_Settings::OPTION_SHOW_FLOATING_BUTTON);
$post_types = GW_Settings::get(GW_Settings::OPTION_POST_TYPES);
$post_types = is_array($post_types) ? $post_types : array();
$button_label = GW_Settings::get(GW_Settings::OPTION_BUTTON_LABEL);
$character_name = GW_Settings::get(GW_Settings::OPTION_CHARACTER_NAME);
$visual_style = GW_Settings::get(GW_Settings::OPTION_VISUAL_STYLE);
$audio_normal_bgm_id = absint(GW_Settings::get(GW_Settings::OPTION_AUDIO_NORMAL_BGM_ID));
$audio_normal_bgm_url = $audio_normal_bgm_id ? wp_get_attachment_url($audio_normal_bgm_id) : '';
$world_map_enabled = GW_Settings::get(GW_Settings::OPTION_WORLD_MAP_ENABLED);
$world_map_title = GW_Settings::get(GW_Settings::OPTION_WORLD_MAP_TITLE);
$world_map_goal_label = GW_Settings::get(GW_Settings::OPTION_WORLD_MAP_GOAL_LABEL);
$world_map_required_clear_count = GW_Settings::get(GW_Settings::OPTION_WORLD_MAP_REQUIRED_CLEAR_COUNT);
$world_map_show_on_start = GW_Settings::get(GW_Settings::OPTION_WORLD_MAP_SHOW_ON_START);
$world_map_show_in_hud = GW_Settings::get(GW_Settings::OPTION_WORLD_MAP_SHOW_IN_HUD);
$world_map_show_after_clear = GW_Settings::get(GW_Settings::OPTION_WORLD_MAP_SHOW_AFTER_CLEAR);
$logging_enabled = GW_Settings::get(GW_Settings::OPTION_LOGGING_ENABLED);
$debug = GW_Settings::get(GW_Settings::OPTION_DEBUG);
?>

<div class="wrap gaming-web-admin">
    <h1><?php esc_html_e('CharaBreak 基本設定', 'gaming-web'); ?></h1>
    <p class="gaming-web-admin__lead">
        <?php esc_html_e('ページを壊して遊べるゲーム体験を追加します。通常のHTMLやSEO、アクセシビリティを壊さず、ゲーム終了後は元のページに戻れます。', 'gaming-web'); ?>
    </p>

    <form method="post" action="options.php" class="gaming-web-admin__form">
        <?php settings_fields('gaming_web_settings'); ?>

        <input type="hidden" name="<?php echo esc_attr(GW_Settings::OPTION_ENABLED); ?>" value="0">
        <input type="hidden" name="<?php echo esc_attr(GW_Settings::OPTION_SHOW_FLOATING_BUTTON); ?>" value="0">
        <input type="hidden" name="<?php echo esc_attr(GW_Settings::OPTION_POST_TYPES); ?>[]" value="">
        <input type="hidden" name="<?php echo esc_attr(GW_Settings::OPTION_WORLD_MAP_ENABLED); ?>" value="0">
        <input type="hidden" name="<?php echo esc_attr(GW_Settings::OPTION_WORLD_MAP_SHOW_ON_START); ?>" value="0">
        <input type="hidden" name="<?php echo esc_attr(GW_Settings::OPTION_WORLD_MAP_SHOW_IN_HUD); ?>" value="0">
        <input type="hidden" name="<?php echo esc_attr(GW_Settings::OPTION_WORLD_MAP_SHOW_AFTER_CLEAR); ?>" value="0">
        <input type="hidden" name="<?php echo esc_attr(GW_Settings::OPTION_LOGGING_ENABLED); ?>" value="0">
        <input type="hidden" name="<?php echo esc_attr(GW_Settings::OPTION_DEBUG); ?>" value="0">

        <table class="form-table" role="presentation">
            <tbody>
                <tr>
                    <th scope="row"><?php esc_html_e('CharaBreakを有効化', 'gaming-web'); ?></th>
                    <td>
                        <label>
                            <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_ENABLED); ?>" value="1" <?php checked($enabled, '1'); ?>>
                            <?php esc_html_e('有効にする', 'gaming-web'); ?>
                        </label>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('右下の開始ボタン', 'gaming-web'); ?></th>
                    <td>
                        <label>
                            <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_SHOW_FLOATING_BUTTON); ?>" value="1" <?php checked($show_floating_button, '1'); ?>>
                            <?php esc_html_e('画面右下に固定のゲーム開始ボタンを表示する', 'gaming-web'); ?>
                        </label>
                        <p class="description">
                            <?php esc_html_e('非表示にして、本文内の [gaming_web_start] ショートコードから自然に開始することもできます。', 'gaming-web'); ?>
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('対象の投稿タイプ', 'gaming-web'); ?></th>
                    <td>
                        <fieldset>
                            <label>
                                <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_POST_TYPES); ?>[]" value="page" <?php checked(in_array('page', $post_types, true)); ?>>
                                <?php esc_html_e('固定ページ', 'gaming-web'); ?>
                            </label>
                            <br>
                            <label>
                                <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_POST_TYPES); ?>[]" value="post" <?php checked(in_array('post', $post_types, true)); ?>>
                                <?php esc_html_e('投稿', 'gaming-web'); ?>
                            </label>
                        </fieldset>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="gaming-web-button-label"><?php esc_html_e('開始ボタンの文言', 'gaming-web'); ?></label>
                    </th>
                    <td>
                        <input type="text" id="gaming-web-button-label" name="<?php echo esc_attr(GW_Settings::OPTION_BUTTON_LABEL); ?>" value="<?php echo esc_attr($button_label); ?>" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="gaming-web-character-name"><?php esc_html_e('メインキャラクター名', 'gaming-web'); ?></label>
                    </th>
                    <td>
                        <input type="text" id="gaming-web-character-name" name="<?php echo esc_attr(GW_Settings::OPTION_CHARACTER_NAME); ?>" value="<?php echo esc_attr($character_name); ?>" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="gaming-web-visual-style"><?php esc_html_e('ビジュアルスタイル', 'gaming-web'); ?></label>
                    </th>
                    <td>
                        <select id="gaming-web-visual-style" name="<?php echo esc_attr(GW_Settings::OPTION_VISUAL_STYLE); ?>">
                            <?php foreach (GW_Settings::visual_style_choices() as $style_value => $style_label) : ?>
                                <option value="<?php echo esc_attr($style_value); ?>" <?php selected($visual_style, $style_value); ?>><?php echo esc_html($style_label); ?></option>
                            <?php endforeach; ?>
                        </select>
                        <p class="description">
                            <?php esc_html_e('自動はページのデザインを優先し、ゲーム演出だけを軽く加えます。ネオンはCharaBreakらしいサイバー感を強めます。', 'gaming-web'); ?>
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('標準BGM', 'gaming-web'); ?></th>
                    <td>
                        <div class="gaming-web-media-field gaming-web-media-field--audio" data-gw-media-type="audio">
                            <input type="hidden" class="gaming-web-media-field__input" name="<?php echo esc_attr(GW_Settings::OPTION_AUDIO_NORMAL_BGM_ID); ?>" value="<?php echo esc_attr($audio_normal_bgm_id); ?>">
                            <div class="gaming-web-media-field__preview">
                                <span><?php echo esc_html($audio_normal_bgm_url ? basename((string) wp_parse_url($audio_normal_bgm_url, PHP_URL_PATH)) : __('標準シンセ', 'gaming-web')); ?></span>
                            </div>
                            <button type="button" class="button gaming-web-media-field__choose"><?php esc_html_e('音源を選択', 'gaming-web'); ?></button>
                            <button type="button" class="button-link-delete gaming-web-media-field__clear"><?php esc_html_e('解除', 'gaming-web'); ?></button>
                        </div>
                        <p class="description">
                            <?php esc_html_e('ステージ専用BGMが未設定のときに使われます。ステージBGM、ボスBGM、クリア音はステージ管理で個別に上書きできます。', 'gaming-web'); ?>
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('ワールドマップ', 'gaming-web'); ?></th>
                    <td>
                        <label>
                            <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_WORLD_MAP_ENABLED); ?>" value="1" <?php checked($world_map_enabled, '1'); ?>>
                            <?php esc_html_e('サイト全体をステージフィールドとして表示する', 'gaming-web'); ?>
                        </label>
                        <p class="description">
                            <?php esc_html_e('有効なページがつながったステージになります。MVPでは進行状況を訪問者のブラウザに保存します。', 'gaming-web'); ?>
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="gaming-web-world-map-title"><?php esc_html_e('ワールドマップ名', 'gaming-web'); ?></label>
                    </th>
                    <td>
                        <input type="text" id="gaming-web-world-map-title" name="<?php echo esc_attr(GW_Settings::OPTION_WORLD_MAP_TITLE); ?>" value="<?php echo esc_attr($world_map_title); ?>" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="gaming-web-world-map-goal-label"><?php esc_html_e('最終ゴール名', 'gaming-web'); ?></label>
                    </th>
                    <td>
                        <input type="text" id="gaming-web-world-map-goal-label" name="<?php echo esc_attr(GW_Settings::OPTION_WORLD_MAP_GOAL_LABEL); ?>" value="<?php echo esc_attr($world_map_goal_label); ?>" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="gaming-web-world-map-required-clear-count"><?php esc_html_e('最終ゲートに必要なクリア数', 'gaming-web'); ?></label>
                    </th>
                    <td>
                        <input type="number" min="0" step="1" id="gaming-web-world-map-required-clear-count" name="<?php echo esc_attr(GW_Settings::OPTION_WORLD_MAP_REQUIRED_CLEAR_COUNT); ?>" value="<?php echo esc_attr($world_map_required_clear_count); ?>" class="small-text">
                        <p class="description">
                            <?php esc_html_e('0にすると、マップ上の全ステージクリアが必要になります。', 'gaming-web'); ?>
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('ワールドマップの表示タイミング', 'gaming-web'); ?></th>
                    <td>
                        <label>
                            <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_WORLD_MAP_SHOW_ON_START); ?>" value="1" <?php checked($world_map_show_on_start, '1'); ?>>
                            <?php esc_html_e('ゲーム開始前に表示する', 'gaming-web'); ?>
                        </label>
                        <br>
                        <label>
                            <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_WORLD_MAP_SHOW_IN_HUD); ?>" value="1" <?php checked($world_map_show_in_hud, '1'); ?>>
                            <?php esc_html_e('ゲーム中HUDにMAPボタンを表示する', 'gaming-web'); ?>
                        </label>
                        <br>
                        <label>
                            <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_WORLD_MAP_SHOW_AFTER_CLEAR); ?>" value="1" <?php checked($world_map_show_after_clear, '1'); ?>>
                            <?php esc_html_e('ステージクリア後にマップ導線を表示する', 'gaming-web'); ?>
                        </label>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('基本ログ', 'gaming-web'); ?></th>
                    <td>
                        <label>
                            <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_LOGGING_ENABLED); ?>" value="1" <?php checked($logging_enabled, '1'); ?>>
                            <?php esc_html_e('匿名のプレイイベントを保存する', 'gaming-web'); ?>
                        </label>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('デバッグモード', 'gaming-web'); ?></th>
                    <td>
                        <label>
                            <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_DEBUG); ?>" value="1" <?php checked($debug, '1'); ?>>
                            <?php esc_html_e('ブラウザのコンソールにデバッグ情報を出力する', 'gaming-web'); ?>
                        </label>
                    </td>
                </tr>
            </tbody>
        </table>

        <?php submit_button(__('CharaBreak設定を保存', 'gaming-web')); ?>
    </form>
</div>
