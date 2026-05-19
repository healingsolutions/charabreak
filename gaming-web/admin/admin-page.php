<?php

if (!defined('ABSPATH')) {
    exit;
}

$enabled = GW_Settings::get(GW_Settings::OPTION_ENABLED);
$post_types = GW_Settings::get(GW_Settings::OPTION_POST_TYPES);
$post_types = is_array($post_types) ? $post_types : array();
$button_label = GW_Settings::get(GW_Settings::OPTION_BUTTON_LABEL);
$character_name = GW_Settings::get(GW_Settings::OPTION_CHARACTER_NAME);
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
        <input type="hidden" name="<?php echo esc_attr(GW_Settings::OPTION_POST_TYPES); ?>[]" value="">
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
