<?php

if (!defined('ABSPATH')) {
    exit;
}

class GW_License
{
    public static function is_pro(): bool
    {
        if (!function_exists('cha_fs')) {
            return false;
        }

        try {
            $freemius = cha_fs();
            if (is_object($freemius) && method_exists($freemius, 'can_use_premium_code')) {
                return (bool) $freemius->can_use_premium_code();
            }
        } catch (Throwable $exception) {
            return false;
        }

        return false;
    }

    public static function plan_slug(): string
    {
        return self::is_pro() ? 'pro' : 'free';
    }

    public static function stage_limit(): int
    {
        return self::is_pro() ? 0 : 1;
    }

    public static function can_use_stage(int $post_id): bool
    {
        if ($post_id <= 0 || self::is_pro()) {
            return true;
        }

        $free_stage_id = self::first_free_stage_id();
        return $free_stage_id <= 0 || $free_stage_id === $post_id;
    }

    public static function limit_stage_ids(array $post_ids): array
    {
        $post_ids = array_values(array_unique(array_map('absint', $post_ids)));
        if (self::is_pro()) {
            return $post_ids;
        }

        return array_slice($post_ids, 0, 1);
    }

    public static function first_free_stage_id(): int
    {
        $enabled_types = GW_Settings::get(GW_Settings::OPTION_POST_TYPES);
        $enabled_types = is_array($enabled_types) ? array_values(array_filter($enabled_types)) : array('page', 'post');
        if (empty($enabled_types)) {
            return 0;
        }

        $posts = get_posts(array(
            'post_type' => $enabled_types,
            'post_status' => 'publish',
            'posts_per_page' => 80,
            'orderby' => array(
                'menu_order' => 'ASC',
                'title' => 'ASC',
            ),
            'suppress_filters' => false,
        ));

        $candidates = array();
        foreach ($posts as $post) {
            if (!$post instanceof WP_Post) {
                continue;
            }

            if (get_post_meta($post->ID, '_gaming_web_mode', true) === 'disabled') {
                continue;
            }

            if (get_post_meta($post->ID, '_gaming_web_world_map_include', true) === '0') {
                continue;
            }

            $candidates[] = array(
                'id' => $post->ID,
                'order' => absint(get_post_meta($post->ID, '_gaming_web_world_map_order', true)),
                'title' => get_the_title($post),
            );
        }

        usort($candidates, static function (array $a, array $b): int {
            $a_order = (int) ($a['order'] ?? 0);
            $b_order = (int) ($b['order'] ?? 0);
            if ($a_order !== $b_order) {
                if ($a_order === 0) {
                    return 1;
                }
                if ($b_order === 0) {
                    return -1;
                }
                return $a_order <=> $b_order;
            }

            return strcasecmp((string) ($a['title'] ?? ''), (string) ($b['title'] ?? ''));
        });

        return (int) ($candidates[0]['id'] ?? 0);
    }

    public static function pro_upgrade_url(): string
    {
        if (function_exists('cha_fs')) {
            try {
                $freemius = cha_fs();
                if (is_object($freemius) && method_exists($freemius, 'get_upgrade_url')) {
                    return (string) $freemius->get_upgrade_url();
                }
            } catch (Throwable $exception) {
                return '';
            }
        }

        return '';
    }
}
