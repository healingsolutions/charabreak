<?php

if (!defined('ABSPATH')) {
    exit;
}

class GW_REST
{
    private const ALLOWED_EVENTS = array(
        'game_start',
        'game_exit',
        'element_hit',
        'word_collect',
        'inventory_open',
        'stage_soft_clear',
    );

    public function init(): void
    {
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    public function register_routes(): void
    {
        register_rest_route('gaming-web/v1', '/event', array(
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => array($this, 'handle_event'),
            'permission_callback' => '__return_true',
        ));
    }

    public function handle_event(WP_REST_Request $request)
    {
        $params = $request->get_json_params();
        $params = is_array($params) ? $params : array();

        $event_type = sanitize_key($params['event_type'] ?? '');
        if (!in_array($event_type, self::ALLOWED_EVENTS, true)) {
            return new WP_Error('gaming_web_invalid_event', __('Invalid event type.', 'gaming-web'), array('status' => 400));
        }

        $session_id = preg_replace('/[^A-Za-z0-9_-]/', '', (string) ($params['session_id'] ?? ''));
        $session_id = substr($session_id, 0, 64);
        if ($session_id === '') {
            $session_id = 'anonymous';
        }

        $page_id = absint($params['page_id'] ?? 0);
        $event_data = $this->sanitize_event_data($params);

        $logged = GW_Logger::insert_event($session_id, $page_id, $event_type, $event_data);

        return rest_ensure_response(array(
            'ok' => true,
            'logged' => $logged,
        ));
    }

    private function sanitize_event_data(array $params): array
    {
        $viewport = isset($params['viewport']) && is_array($params['viewport']) ? $params['viewport'] : array();
        $scroll = isset($params['scroll']) && is_array($params['scroll']) ? $params['scroll'] : array();

        return array(
            'page_url' => esc_url_raw((string) ($params['page_url'] ?? '')),
            'element_selector' => sanitize_text_field((string) ($params['element_selector'] ?? '')),
            'element_type' => sanitize_key((string) ($params['element_type'] ?? '')),
            'trigger' => sanitize_key((string) ($params['trigger'] ?? '')),
            'word' => sanitize_text_field((string) ($params['word'] ?? '')),
            'broken_count' => absint($params['broken_count'] ?? 0),
            'total_chars' => absint($params['total_chars'] ?? 0),
            'protected_count' => absint($params['protected_count'] ?? 0),
            'player_broken_count' => absint($params['player_broken_count'] ?? 0),
            'enemy_broken_count' => absint($params['enemy_broken_count'] ?? 0),
            'enemy_defeated_count' => absint($params['enemy_defeated_count'] ?? 0),
            'gates_broken' => absint($params['gates_broken'] ?? 0),
            'images_damaged' => absint($params['images_damaged'] ?? 0),
            'clear_reason' => sanitize_key((string) ($params['reason'] ?? '')),
            'next_href' => esc_url_raw((string) ($params['next_href'] ?? '')),
            'stage_name' => sanitize_text_field((string) ($params['stage_name'] ?? '')),
            'timestamp' => sanitize_text_field((string) ($params['timestamp'] ?? '')),
            'viewport' => array(
                'width' => absint($viewport['width'] ?? 0),
                'height' => absint($viewport['height'] ?? 0),
            ),
            'scroll' => array(
                'x' => intval($scroll['x'] ?? 0),
                'y' => intval($scroll['y'] ?? 0),
            ),
            'inventory_count' => absint($params['inventory_count'] ?? 0),
        );
    }
}
