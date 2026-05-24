<?php

if (!defined('ABSPATH')) {
    exit;
}

class GW_Enemies
{
    public const OPTION_REGISTRY = 'gaming_web_enemy_registry';

    public static function all(): array
    {
        $enemies = get_option(self::OPTION_REGISTRY, array());
        return is_array($enemies) ? array_values(array_filter($enemies, 'is_array')) : array();
    }

    public static function by_id(string $enemy_id): ?array
    {
        foreach (self::all() as $enemy) {
            if ((string) ($enemy['enemy_id'] ?? '') === $enemy_id) {
                return $enemy;
            }
        }

        return null;
    }

    public static function role_choices(): array
    {
        return array(
            'character' => __('プレイヤー / 案内役', 'gaming-web'),
            'normal' => __('通常敵', 'gaming-web'),
            'boss' => __('ボス敵', 'gaming-web'),
            'both' => __('通常敵・ボス兼用', 'gaming-web'),
            'npc' => __('NPC / サポート役', 'gaming-web'),
        );
    }

    public static function behavior_choices(): array
    {
        return array(
            'guide' => __('案内する', 'gaming-web'),
            'walker' => __('歩き回る', 'gaming-web'),
            'chaser' => __('追いかける', 'gaming-web'),
            'guardian' => __('守る', 'gaming-web'),
            'boss_guardian' => __('ボスとして守る', 'gaming-web'),
        );
    }

    public static function clear_effect_choices(): array
    {
        return array(
            'auto' => __('自動', 'gaming-web'),
            'spark' => __('ルート発光', 'gaming-web'),
            'treasure' => __('宝箱バースト', 'gaming-web'),
            'gate' => __('ゲート破壊', 'gaming-web'),
            'crown' => __('王冠フィナーレ', 'gaming-web'),
        );
    }

    public static function enemies_for_role(string $role): array
    {
        $role = $role === 'boss' ? 'boss' : 'normal';
        return array_values(array_filter(self::all(), static function (array $enemy) use ($role): bool {
            $enemy_role = (string) ($enemy['role'] ?? 'normal');
            return $enemy_role === 'both' || $enemy_role === $role;
        }));
    }

    public static function save_from_request($value): void
    {
        update_option(self::OPTION_REGISTRY, self::sanitize_registry($value), false);
    }

    public static function sanitize_registry($value): array
    {
        $value = is_array($value) ? $value : array();
        $registry = array();
        $seen = array();

        foreach ($value as $row) {
            if (!is_array($row)) {
                continue;
            }

            $name = sanitize_text_field(wp_unslash((string) ($row['name'] ?? '')));
            if ($name === '') {
                continue;
            }

            $enemy_id = sanitize_key((string) ($row['enemy_id'] ?? ''));
            if ($enemy_id === '' || isset($seen[$enemy_id])) {
                $enemy_id = 'enemy-' . substr(str_replace('-', '', wp_generate_uuid4()), 0, 12);
            }
            $seen[$enemy_id] = true;

            $role = sanitize_key((string) ($row['role'] ?? 'normal'));
            if (!array_key_exists($role, self::role_choices())) {
                $role = 'normal';
            }

            $behavior = sanitize_key((string) ($row['behavior'] ?? 'walker'));
            if (!array_key_exists($behavior, self::behavior_choices())) {
                $behavior = $role === 'boss' ? 'boss_guardian' : 'walker';
            }

            $registry[] = array(
                'enemy_id' => $enemy_id,
                'name' => $name,
                'image_id' => absint($row['image_id'] ?? 0),
                'role' => $role,
                'behavior' => $behavior,
                'difficulty' => self::difficulty($row['difficulty'] ?? 3),
            );
        }

        return $registry;
    }

    public static function frontend_enemy(array $enemy, string $fallback_role = 'normal'): array
    {
        $role = (string) ($enemy['role'] ?? $fallback_role);
        if ($role === 'both') {
            $role = $fallback_role;
        }
        if (!in_array($role, array('normal', 'boss'), true)) {
            $role = $fallback_role;
        }

        $difficulty = self::difficulty($enemy['difficulty'] ?? 3);
        $image_id = absint($enemy['image_id'] ?? 0);
        $image_url = $image_id > 0 ? wp_get_attachment_image_url($image_id, 'medium') : '';

        return array(
            'enemyId' => (string) ($enemy['enemy_id'] ?? ''),
            'name' => (string) ($enemy['name'] ?? ''),
            'imageUrl' => $image_url ? esc_url_raw($image_url) : '',
            'role' => $role,
            'behavior' => (string) ($enemy['behavior'] ?? ($role === 'boss' ? 'boss_guardian' : 'walker')),
            'difficulty' => $difficulty,
            'stats' => self::stats($role, $difficulty),
        );
    }

    public static function stats(string $role, int $difficulty): array
    {
        $difficulty = self::difficulty($difficulty);
        $boss = $role === 'boss';
        $missile_min = (int) round(12600 - ($difficulty * 650));
        $missile_min = max(6400, $missile_min);

        return array(
            'hp' => $boss ? 6 + ($difficulty * 2) : 2 + (int) ceil($difficulty / 2),
            'speed' => $boss ? 45 + ($difficulty * 5) : 58 + ($difficulty * 7),
            'attackInterval' => max(1100, $boss ? 2050 - ($difficulty * 110) : 2500 - ($difficulty * 150)),
            'destroyLimit' => $boss ? 2 + (int) floor($difficulty / 4) : 1 + (int) floor($difficulty / 5),
            'missileMinInterval' => $boss ? $missile_min : 0,
            'missileMaxInterval' => $boss ? $missile_min + 2400 : 0,
        );
    }

    public static function difficulty($value): int
    {
        return max(1, min(8, absint($value)));
    }
}
