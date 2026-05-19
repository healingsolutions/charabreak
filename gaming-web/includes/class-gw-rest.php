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

        $response = array(
            'ok' => true,
            'logged' => $logged,
        );

        if ($event_type === 'stage_soft_clear') {
            $reward = $this->clear_reward_for_event($page_id, $event_data);
            if (!empty($reward)) {
                $response['reward_unlocked'] = true;
                $response['reward'] = $reward;
            }
        }

        return rest_ensure_response($response);
    }

    private function sanitize_event_data(array $params): array
    {
        $viewport = isset($params['viewport']) && is_array($params['viewport']) ? $params['viewport'] : array();
        $scroll = isset($params['scroll']) && is_array($params['scroll']) ? $params['scroll'] : array();
        $treasure_letters = isset($params['treasure_letters']) && is_array($params['treasure_letters'])
            ? array_map(static fn($letter) => sanitize_text_field((string) $letter), array_filter($params['treasure_letters'], 'is_scalar'))
            : array();
        $treasure_word = is_scalar($params['treasure_word'] ?? null)
            ? (string) $params['treasure_word']
            : (is_scalar($params['treasure_letters'] ?? null) ? (string) $params['treasure_letters'] : '');

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
            'letters_collected' => absint($params['letters_collected'] ?? 0),
            'letters_required' => absint($params['letters_required'] ?? 0),
            'treasure_letters' => $treasure_letters,
            'treasure_word' => sanitize_text_field($treasure_word),
            'clear_reason' => sanitize_key((string) ($params['reason'] ?? '')),
            'next_href' => esc_url_raw((string) ($params['next_href'] ?? '')),
            'stage_name' => sanitize_text_field((string) ($params['stage_name'] ?? '')),
            'critical_word' => sanitize_text_field((string) ($params['critical_word'] ?? '')),
            'critical_lost' => !empty($params['critical_lost']),
            'player_life' => absint($params['player_life'] ?? 0),
            'failed' => !empty($params['failed']),
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

    private function clear_reward_for_event(int $page_id, array $event_data): array
    {
        if ($page_id <= 0 || !empty($event_data['failed']) || !empty($event_data['critical_lost'])) {
            return array();
        }

        if (absint($event_data['letters_collected'] ?? 0) < 3) {
            return array();
        }

        if (get_post_meta($page_id, '_gaming_web_reward_enabled', true) !== '1') {
            return array();
        }

        $reward = array(
            'title' => sanitize_text_field((string) get_post_meta($page_id, '_gaming_web_reward_title', true)),
            'message' => sanitize_textarea_field((string) get_post_meta($page_id, '_gaming_web_reward_message', true)),
            'coupon_code' => sanitize_text_field((string) get_post_meta($page_id, '_gaming_web_reward_coupon_code', true)),
            'reward_url' => esc_url_raw((string) get_post_meta($page_id, '_gaming_web_reward_url', true)),
        );

        $has_content = false;
        foreach ($reward as $value) {
            if (trim((string) $value) !== '') {
                $has_content = true;
                break;
            }
        }

        if (!$has_content) {
            return array();
        }

        if ($reward['title'] === '') {
            $reward['title'] = __('Clear reward', 'gaming-web');
        }

        return $reward;
    }
}
