<?php

if (!defined('ABSPATH')) {
    exit;
}

class GW_Logger
{
    public static function table_name(): string
    {
        global $wpdb;
        return $wpdb->prefix . 'gaming_web_events';
    }

    public static function create_table(): void
    {
        global $wpdb;

        $table_name = self::table_name();
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE {$table_name} (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            session_id VARCHAR(64) NOT NULL,
            page_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
            event_type VARCHAR(40) NOT NULL,
            event_data LONGTEXT NULL,
            created_at DATETIME NOT NULL,
            PRIMARY KEY  (id),
            KEY session_id (session_id),
            KEY page_id (page_id),
            KEY event_type (event_type),
            KEY created_at (created_at)
        ) {$charset_collate};";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }

    public static function insert_event(string $session_id, int $page_id, string $event_type, array $event_data): bool
    {
        global $wpdb;

        if (!GW_Settings::is_truthy(GW_Settings::OPTION_LOGGING_ENABLED)) {
            return false;
        }

        $event_data_json = wp_json_encode($event_data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        $result = $wpdb->insert(
            self::table_name(),
            array(
                'session_id' => $session_id,
                'page_id' => $page_id,
                'event_type' => $event_type,
                'event_data' => $event_data_json,
                'created_at' => current_time('mysql'),
            ),
            array('%s', '%d', '%s', '%s', '%s')
        );

        return $result !== false;
    }
}
