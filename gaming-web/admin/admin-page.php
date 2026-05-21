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
    <h1><?php esc_html_e('Gaming Web', 'gaming-web'); ?></h1>
    <p class="gaming-web-admin__lead">
        <?php esc_html_e('Add a safe, overlay-only playful mode to enabled pages without damaging the real DOM.', 'gaming-web'); ?>
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
                    <th scope="row"><?php esc_html_e('Enable Gaming Web globally', 'gaming-web'); ?></th>
                    <td>
                        <label>
                            <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_ENABLED); ?>" value="1" <?php checked($enabled, '1'); ?>>
                            <?php esc_html_e('Enabled', 'gaming-web'); ?>
                        </label>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('Show floating start button', 'gaming-web'); ?></th>
                    <td>
                        <label>
                            <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_SHOW_FLOATING_BUTTON); ?>" value="1" <?php checked($show_floating_button, '1'); ?>>
                            <?php esc_html_e('Display the fixed game start button in the lower-right corner.', 'gaming-web'); ?>
                        </label>
                        <p class="description">
                            <?php esc_html_e('You can hide this and start the game from page content using the [gaming_web_start] shortcode.', 'gaming-web'); ?>
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('Enable on post types', 'gaming-web'); ?></th>
                    <td>
                        <fieldset>
                            <label>
                                <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_POST_TYPES); ?>[]" value="page" <?php checked(in_array('page', $post_types, true)); ?>>
                                <?php esc_html_e('Pages', 'gaming-web'); ?>
                            </label>
                            <br>
                            <label>
                                <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_POST_TYPES); ?>[]" value="post" <?php checked(in_array('post', $post_types, true)); ?>>
                                <?php esc_html_e('Posts', 'gaming-web'); ?>
                            </label>
                        </fieldset>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="gaming-web-button-label"><?php esc_html_e('Game button label', 'gaming-web'); ?></label>
                    </th>
                    <td>
                        <input type="text" id="gaming-web-button-label" name="<?php echo esc_attr(GW_Settings::OPTION_BUTTON_LABEL); ?>" value="<?php echo esc_attr($button_label); ?>" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="gaming-web-character-name"><?php esc_html_e('Primary character name', 'gaming-web'); ?></label>
                    </th>
                    <td>
                        <input type="text" id="gaming-web-character-name" name="<?php echo esc_attr(GW_Settings::OPTION_CHARACTER_NAME); ?>" value="<?php echo esc_attr($character_name); ?>" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="gaming-web-visual-style"><?php esc_html_e('Visual style', 'gaming-web'); ?></label>
                    </th>
                    <td>
                        <select id="gaming-web-visual-style" name="<?php echo esc_attr(GW_Settings::OPTION_VISUAL_STYLE); ?>">
                            <?php foreach (GW_Settings::visual_style_choices() as $style_value => $style_label) : ?>
                                <option value="<?php echo esc_attr($style_value); ?>" <?php selected($visual_style, $style_value); ?>><?php echo esc_html($style_label); ?></option>
                            <?php endforeach; ?>
                        </select>
                        <p class="description">
                            <?php esc_html_e('Auto respects each page first, then lightly adds game accents. Pastel softens chests, jewels, enemies, and glow.', 'gaming-web'); ?>
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('World map', 'gaming-web'); ?></th>
                    <td>
                        <label>
                            <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_WORLD_MAP_ENABLED); ?>" value="1" <?php checked($world_map_enabled, '1'); ?>>
                            <?php esc_html_e('Show the site as a stage field map', 'gaming-web'); ?>
                        </label>
                        <p class="description">
                            <?php esc_html_e('Enabled pages become connected stages. Progress is stored in the visitor browser for this MVP.', 'gaming-web'); ?>
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="gaming-web-world-map-title"><?php esc_html_e('World map title', 'gaming-web'); ?></label>
                    </th>
                    <td>
                        <input type="text" id="gaming-web-world-map-title" name="<?php echo esc_attr(GW_Settings::OPTION_WORLD_MAP_TITLE); ?>" value="<?php echo esc_attr($world_map_title); ?>" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="gaming-web-world-map-goal-label"><?php esc_html_e('Final goal label', 'gaming-web'); ?></label>
                    </th>
                    <td>
                        <input type="text" id="gaming-web-world-map-goal-label" name="<?php echo esc_attr(GW_Settings::OPTION_WORLD_MAP_GOAL_LABEL); ?>" value="<?php echo esc_attr($world_map_goal_label); ?>" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="gaming-web-world-map-required-clear-count"><?php esc_html_e('Required clears for final gate', 'gaming-web'); ?></label>
                    </th>
                    <td>
                        <input type="number" min="0" step="1" id="gaming-web-world-map-required-clear-count" name="<?php echo esc_attr(GW_Settings::OPTION_WORLD_MAP_REQUIRED_CLEAR_COUNT); ?>" value="<?php echo esc_attr($world_map_required_clear_count); ?>" class="small-text">
                        <p class="description">
                            <?php esc_html_e('Use 0 to require all mapped stages.', 'gaming-web'); ?>
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('World map timing', 'gaming-web'); ?></th>
                    <td>
                        <label>
                            <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_WORLD_MAP_SHOW_ON_START); ?>" value="1" <?php checked($world_map_show_on_start, '1'); ?>>
                            <?php esc_html_e('Show before game start', 'gaming-web'); ?>
                        </label>
                        <br>
                        <label>
                            <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_WORLD_MAP_SHOW_IN_HUD); ?>" value="1" <?php checked($world_map_show_in_hud, '1'); ?>>
                            <?php esc_html_e('Show MAP button in game HUD', 'gaming-web'); ?>
                        </label>
                        <br>
                        <label>
                            <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_WORLD_MAP_SHOW_AFTER_CLEAR); ?>" value="1" <?php checked($world_map_show_after_clear, '1'); ?>>
                            <?php esc_html_e('Show map action after stage clear', 'gaming-web'); ?>
                        </label>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('Enable basic logging', 'gaming-web'); ?></th>
                    <td>
                        <label>
                            <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_LOGGING_ENABLED); ?>" value="1" <?php checked($logging_enabled, '1'); ?>>
                            <?php esc_html_e('Store anonymous gameplay events', 'gaming-web'); ?>
                        </label>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('Debug mode', 'gaming-web'); ?></th>
                    <td>
                        <label>
                            <input type="checkbox" name="<?php echo esc_attr(GW_Settings::OPTION_DEBUG); ?>" value="1" <?php checked($debug, '1'); ?>>
                            <?php esc_html_e('Log client-side debug messages to the browser console', 'gaming-web'); ?>
                        </label>
                    </td>
                </tr>
            </tbody>
        </table>

        <?php submit_button(__('Save Gaming Web settings', 'gaming-web')); ?>
    </form>
</div>
