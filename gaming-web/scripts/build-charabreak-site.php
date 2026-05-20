<?php

if (!defined('ABSPATH')) {
    exit;
}

set_time_limit(0);

if (!function_exists('gw_cb_log')) {
    function gw_cb_log(string $message): void
    {
        if (class_exists('WP_CLI')) {
            WP_CLI::log($message);
            return;
        }

        echo $message . "\n";
    }
}

if (!function_exists('gw_cb_id')) {
    function gw_cb_id(string $seed): string
    {
        static $index = 0;
        $index++;
        return substr(md5($seed . '-' . $index), 0, 8);
    }
}

if (!function_exists('gw_cb_space')) {
    function gw_cb_space($top, $right, $bottom, $left, string $unit = 'px'): array
    {
        return array(
            'unit' => $unit,
            'top' => (string) $top,
            'right' => (string) $right,
            'bottom' => (string) $bottom,
            'left' => (string) $left,
            'isLinked' => false,
        );
    }
}

if (!function_exists('gw_cb_size')) {
    function gw_cb_size($size, string $unit = 'px'): array
    {
        return array(
            'unit' => $unit,
            'size' => $size,
            'sizes' => array(),
        );
    }
}

if (!function_exists('gw_cb_link')) {
    function gw_cb_link(string $url, bool $external = false): array
    {
        return array(
            'url' => $url,
            'is_external' => $external ? 'on' : '',
            'nofollow' => '',
            'custom_attributes' => '',
        );
    }
}

if (!function_exists('gw_cb_container')) {
    function gw_cb_container(string $seed, string $label, array $settings = array(), array $elements = array(), bool $inner = false): array
    {
        $settings['_title'] = $label;

        return array(
            'id' => gw_cb_id($seed),
            'settings' => $settings,
            'elements' => $elements,
            'isInner' => $inner,
            'elType' => 'container',
        );
    }
}

if (!function_exists('gw_cb_heading')) {
    function gw_cb_heading(string $seed, string $label, string $title, string $tag = 'h2', array $settings = array()): array
    {
        $settings = array_merge(array(
            'title' => $title,
            'header_size' => $tag,
            'title_color' => '#08141f',
            'typography_font_family' => 'Inter',
            'typography_typography' => 'custom',
            'typography_font_weight' => '900',
            'typography_line_height' => gw_cb_size(1.08, 'em'),
            '_title' => $label,
        ), $settings);

        return array(
            'id' => gw_cb_id($seed),
            'settings' => $settings,
            'elements' => array(),
            'isInner' => false,
            'widgetType' => 'heading',
            'elType' => 'widget',
        );
    }
}

if (!function_exists('gw_cb_text')) {
    function gw_cb_text(string $seed, string $label, string $text, array $settings = array()): array
    {
        $settings = array_merge(array(
            'editor' => '<p>' . esc_html($text) . '</p>',
            'text_color' => '#18222d',
            'typography_font_family' => 'Inter',
            'typography_typography' => 'custom',
            'typography_font_size' => gw_cb_size(16),
            'typography_line_height' => gw_cb_size(1.8, 'em'),
            '_title' => $label,
        ), $settings);

        return array(
            'id' => gw_cb_id($seed),
            'settings' => $settings,
            'elements' => array(),
            'isInner' => false,
            'widgetType' => 'text-editor',
            'elType' => 'widget',
        );
    }
}

if (!function_exists('gw_cb_button')) {
    function gw_cb_button(string $seed, string $label, string $text, string $url, string $style = 'primary', string $classes = '', bool $external = false): array
    {
        $is_primary = $style === 'primary';
        $settings = array(
            'text' => $text,
            'link' => gw_cb_link($url, $external),
            'align' => 'left',
            'typography_font_family' => 'Inter',
            'typography_typography' => 'custom',
            'typography_font_size' => gw_cb_size(14),
            'typography_font_weight' => '900',
            'typography_text_transform' => 'uppercase',
            'button_text_color' => $is_primary ? '#08141f' : '#f5d565',
            'background_background' => 'classic',
            'background_color' => $is_primary ? '#f5d565' : '#102335',
            'border_border' => 'solid',
            'border_color' => $is_primary ? '#f5d565' : '#4edccf',
            'border_width' => gw_cb_space(1, 1, 1, 1),
            'border_radius' => gw_cb_space(8, 8, 8, 8),
            'text_padding' => gw_cb_space(16, 22, 16, 22),
            '_title' => $label,
        );

        if ($classes !== '') {
            $settings['_css_classes'] = $classes;
        }

        return array(
            'id' => gw_cb_id($seed),
            'settings' => $settings,
            'elements' => array(),
            'isInner' => false,
            'widgetType' => 'button',
            'elType' => 'widget',
        );
    }
}

if (!function_exists('gw_cb_image')) {
    function gw_cb_image(string $seed, string $label, string $url, int $id = 0, array $settings = array()): array
    {
        $settings = array_merge(array(
            'image' => array(
                'url' => $url,
                'id' => $id,
                'size' => '',
                'alt' => '',
                'source' => $id > 0 ? 'library' : 'url',
            ),
            'image_size' => 'full',
            '_title' => $label,
        ), $settings);

        return array(
            'id' => gw_cb_id($seed),
            'settings' => $settings,
            'elements' => array(),
            'isInner' => false,
            'widgetType' => 'image',
            'elType' => 'widget',
        );
    }
}

if (!function_exists('gw_cb_icon_box')) {
    function gw_cb_icon_box(string $seed, string $label, string $icon, string $title, string $description, array $settings = array()): array
    {
        $settings = array_merge(array(
            'selected_icon' => array(
                'value' => $icon,
                'library' => 'fa-solid',
            ),
            'title_text' => $title,
            'description_text' => $description,
            'position' => 'top',
            'title_size' => 'h3',
            'primary_color' => '#4edccf',
            'title_color' => '#08141f',
            'description_color' => '#607080',
            'icon_space' => gw_cb_size(14),
            'title_bottom_space' => gw_cb_size(10),
            'title_typography_typography' => 'custom',
            'title_typography_font_size' => gw_cb_size(20),
            'description_typography_typography' => 'custom',
            'description_typography_font_size' => gw_cb_size(15),
            '_title' => $label,
        ), $settings);

        return array(
            'id' => gw_cb_id($seed),
            'settings' => $settings,
            'elements' => array(),
            'isInner' => false,
            'widgetType' => 'icon-box',
            'elType' => 'widget',
        );
    }
}

if (!function_exists('gw_cb_accordion')) {
    function gw_cb_accordion(string $seed, string $label, array $items): array
    {
        $tabs = array();
        foreach ($items as $index => $item) {
            $tabs[] = array(
                'tab_title' => $item['title'],
                'tab_content' => '<p>' . esc_html($item['body']) . '</p>',
                '_id' => substr(md5($seed . '-tab-' . $index), 0, 7),
            );
        }

        return array(
            'id' => gw_cb_id($seed),
            'settings' => array(
                'tabs' => $tabs,
                'title_html_tag' => 'h3',
                'border_width' => 1,
                'border_color' => '#d9e7e3',
                'title_color' => '#08141f',
                'tab_active_color' => '#4edccf',
                'content_color' => '#18222d',
                'title_typography_typography' => 'custom',
                'title_typography_font_size' => gw_cb_size(18),
                'content_typography_typography' => 'custom',
                'content_typography_font_size' => gw_cb_size(16),
                '_title' => $label,
            ),
            'elements' => array(),
            'isInner' => false,
            'widgetType' => 'accordion',
            'elType' => 'widget',
        );
    }
}

if (!function_exists('gw_cb_section_title')) {
    function gw_cb_section_title(string $seed, string $kicker, string $title, string $body, bool $dark = false): array
    {
        return gw_cb_container($seed . '-title-wrap', 'container:: セクション見出し', array(
            'content_width' => 'boxed',
            'flex_direction' => 'column',
            'flex_gap' => array('column' => '10', 'row' => '10', 'isLinked' => true, 'unit' => 'px', 'size' => 10),
            'width' => gw_cb_size(100, '%'),
        ), array(
            gw_cb_heading($seed . '-kicker', 'title:: ' . $kicker, $kicker, 'h6', array(
                'title_color' => $dark ? '#4edccf' : '#2f9a8a',
                'typography_font_size' => gw_cb_size(14),
                'typography_text_transform' => 'uppercase',
                'typography_letter_spacing' => gw_cb_size(0.8, 'px'),
            )),
            gw_cb_heading($seed . '-heading', 'title:: ' . $title, $title, 'h2', array(
                'title_color' => $dark ? '#fbfaf4' : '#08141f',
                'typography_font_size' => gw_cb_size(42),
            )),
            gw_cb_text($seed . '-body', 'text:: ' . mb_substr($body, 0, 24), $body, array(
                'text_color' => $dark ? 'rgba(251,250,244,0.82)' : '#607080',
                'typography_font_size' => gw_cb_size(17),
            )),
        ), true);
    }
}

if (!function_exists('gw_cb_card_grid')) {
    function gw_cb_card_grid(string $seed, array $cards, bool $dark = false): array
    {
        $elements = array();
        foreach ($cards as $index => $card) {
            $elements[] = gw_cb_container($seed . '-card-' . $index, 'container:: カード' . ($index + 1) . '・' . $card['title'], array(
                'content_width' => 'full',
                'width' => gw_cb_size(31, '%'),
                'width_tablet' => gw_cb_size(48, '%'),
                'width_mobile' => gw_cb_size(100, '%'),
                'padding' => gw_cb_space(24, 22, 24, 22),
                'background_background' => 'classic',
                'background_color' => $dark ? '#102335' : '#ffffff',
                'border_border' => 'solid',
                'border_color' => $dark ? 'rgba(78,220,207,0.32)' : '#d9e7e3',
                'border_width' => gw_cb_space(1, 1, 1, 1),
                'border_radius' => gw_cb_space(8, 8, 8, 8),
                'box_shadow_box_shadow_type' => 'yes',
                'box_shadow_box_shadow' => array(
                    'horizontal' => 0,
                    'vertical' => 18,
                    'blur' => 45,
                    'spread' => 0,
                    'color' => 'rgba(8,20,31,0.10)',
                ),
            ), array(
                gw_cb_icon_box($seed . '-icon-' . $index, 'icon-box:: ' . $card['title'], $card['icon'], $card['title'], $card['body'], array(
                    'title_color' => $dark ? '#fbfaf4' : '#08141f',
                    'description_color' => $dark ? 'rgba(251,250,244,0.72)' : '#607080',
                    'primary_color' => $card['accent'] ?? '#4edccf',
                )),
            ), true);
        }

        return gw_cb_container($seed . '-grid', 'container:: カードグリッド', array(
            'content_width' => 'boxed',
            'flex_direction' => 'row',
            'flex_wrap' => 'wrap',
            'flex_gap' => array('column' => '24', 'row' => '24', 'isLinked' => true, 'unit' => 'px', 'size' => 24),
            'padding' => gw_cb_space(24, 0, 0, 0),
        ), $elements, true);
    }
}

if (!function_exists('gw_cb_nav')) {
    function gw_cb_nav(array $links): array
    {
        $buttons = array(
            gw_cb_button('nav-home', 'button:: Home', 'Home', $links['home'], 'secondary'),
            gw_cb_button('nav-features', 'button:: Features', 'Features', $links['features'], 'secondary'),
            gw_cb_button('nav-pricing', 'button:: Pricing', 'Pricing', $links['pricing'], 'secondary'),
            gw_cb_button('nav-demo', 'button:: Demo', 'Demo', $links['demo'], 'secondary'),
            gw_cb_button('nav-faq', 'button:: FAQ', 'FAQ', $links['faq'], 'secondary'),
            gw_cb_button('nav-play', 'button:: Play this page', 'Play', '#gaming-web-start', 'primary', 'gw-inline-start'),
        );

        return gw_cb_container('nav-section', 'section:: 00・グローバルナビ', array(
            'html_tag' => 'header',
            'content_width' => 'full',
            'flex_direction' => 'row',
            'flex_align_items' => 'center',
            'flex_justify_content' => 'space-between',
            'flex_wrap' => 'wrap',
            'flex_gap' => array('column' => '16', 'row' => '12', 'isLinked' => false, 'unit' => 'px', 'size' => 16),
            'padding' => gw_cb_space(16, 24, 16, 24),
            'background_background' => 'classic',
            'background_color' => '#08141f',
            '_css_classes' => 'cb-nav',
        ), array(
            gw_cb_heading('nav-brand', 'title:: CharaBreakロゴ', 'CharaBreak', 'h3', array(
                'title_color' => '#fbfaf4',
                'typography_font_size' => gw_cb_size(24),
            )),
            gw_cb_container('nav-links', 'container:: ナビゲーションリンク', array(
                'html_tag' => 'nav',
                'content_width' => 'full',
                'flex_direction' => 'row',
                'flex_wrap' => 'wrap',
                'flex_justify_content' => 'flex-end',
                'flex_gap' => array('column' => '8', 'row' => '8', 'isLinked' => true, 'unit' => 'px', 'size' => 8),
            ), $buttons, true),
        ));
    }
}

if (!function_exists('gw_cb_footer_cta')) {
    function gw_cb_footer_cta(array $links): array
    {
        return gw_cb_container('footer-cta', 'section:: 99・フッターCTA', array(
            'content_width' => 'boxed',
            'flex_direction' => 'column',
            'flex_align_items' => 'center',
            'padding' => gw_cb_space(86, 24, 96, 24),
            'background_background' => 'classic',
            'background_color' => '#08141f',
            '_css_classes' => 'cb-footer-cta',
        ), array(
            gw_cb_heading('footer-title', 'title:: 最後のCTA見出し', 'まずは1ページ、遊べるWebに変えてみる。', 'h2', array(
                'title_color' => '#fbfaf4',
                'typography_font_size' => gw_cb_size(40),
                'align' => 'center',
            )),
            gw_cb_text('footer-body', 'text:: フッターCTA説明', '無料版は1ページから。Pro版では複数ページをリンクゲートでつなぎ、サイト全体をひとつの冒険にできます。', array(
                'text_color' => 'rgba(251,250,244,0.78)',
                'align' => 'center',
            )),
            gw_cb_container('footer-buttons', 'container:: フッターCTAボタン', array(
                'content_width' => 'full',
                'flex_direction' => 'row',
                'flex_justify_content' => 'center',
                'flex_wrap' => 'wrap',
                'flex_gap' => array('column' => '12', 'row' => '12', 'isLinked' => true, 'unit' => 'px', 'size' => 12),
            ), array(
                gw_cb_button('footer-download', 'button:: 無料ダウンロード', 'Free Download', 'https://github.com/healingsolutions/charabreak', 'primary', '', true),
                gw_cb_button('footer-play', 'button:: このページで遊ぶ', 'Play Demo', '#gaming-web-start', 'secondary', 'gw-inline-start'),
            ), true),
        ));
    }
}

if (!function_exists('gw_cb_business_image')) {
    function gw_cb_business_image(): array
    {
        $url = home_url('/wp-content/uploads/2026/05/multicultural-business-team-headed-by-boss-posing-FFEKMDQ.jpg');
        $id = attachment_url_to_postid($url);

        return array('url' => $url, 'id' => $id);
    }
}

if (!function_exists('gw_cb_character_image')) {
    function gw_cb_character_image(): array
    {
        return array(
            'url' => plugins_url('assets/sprites/character-placeholder.svg', dirname(__FILE__)),
            'id' => 0,
        );
    }
}

if (!function_exists('gw_cb_home_data')) {
    function gw_cb_home_data(array $links): array
    {
        $business = gw_cb_business_image();
        $character = gw_cb_character_image();

        return array(
            gw_cb_nav($links),
            gw_cb_container('home-hero', 'section:: 01・ファーストビュー', array(
                'content_width' => 'boxed',
                'flex_direction' => 'row',
                'flex_wrap' => 'wrap',
                'flex_align_items' => 'center',
                'flex_gap' => array('column' => '48', 'row' => '36', 'isLinked' => false, 'unit' => 'px', 'size' => 48),
                'min_height' => gw_cb_size(92, 'vh'),
                'padding' => gw_cb_space(92, 24, 76, 24),
                'background_background' => 'classic',
                'background_color' => '#08141f',
                'background_overlay_background' => 'classic',
                'background_overlay_color' => 'rgba(8,20,31,0.72)',
                'background_overlay_image' => array(
                    'url' => $business['url'],
                    'id' => $business['id'],
                    'size' => '',
                    'alt' => '',
                    'source' => $business['id'] ? 'library' : 'url',
                ),
                'background_overlay_position' => 'center center',
                'background_overlay_repeat' => 'no-repeat',
                'background_overlay_size' => 'cover',
                '_css_classes' => 'cb-hero cb-site',
            ), array(
                gw_cb_container('home-hero-copy', 'container:: ヒーローコピー', array(
                    'content_width' => 'full',
                    'width' => gw_cb_size(58, '%'),
                    'width_tablet' => gw_cb_size(100, '%'),
                    'width_mobile' => gw_cb_size(100, '%'),
                    'flex_direction' => 'column',
                    'flex_gap' => array('column' => '18', 'row' => '18', 'isLinked' => true, 'unit' => 'px', 'size' => 18),
                ), array(
                    gw_cb_heading('home-kicker', 'title:: プロダクトカテゴリ', 'PLAYABLE WORDPRESS PLUGIN', 'h6', array(
                        'title_color' => '#4edccf',
                        'typography_font_size' => gw_cb_size(14),
                        'typography_letter_spacing' => gw_cb_size(0.8, 'px'),
                    )),
                    gw_cb_heading('home-h1', 'title:: メイン見出し', '読む前に、壊せ。', 'h1', array(
                        'title_color' => '#fbfaf4',
                        'typography_font_size' => gw_cb_size(72),
                        'typography_line_height' => gw_cb_size(0.98, 'em'),
                    )),
                    gw_cb_text('home-lead', 'text:: メインリード', 'ユーザーは、最初から長い文章を読んでくれません。だからCharaBreakは、読む前の数秒をゲームに変えます。文字を攻撃し、画像を揺らし、ページの上を走り回るうちに、訪問者はいつの間にか本文・見出し・ボタンに触れています。壊すことをコンテンツ化し、サイト滞在時間と記憶に残る体験をつくる、WordPress向けインタラクティブWebプラグインです。', array(
                        'text_color' => 'rgba(251,250,244,0.84)',
                        'typography_font_size' => gw_cb_size(18),
                    )),
                    gw_cb_container('home-hero-buttons', 'container:: ヒーローCTAボタン', array(
                        'content_width' => 'full',
                        'flex_direction' => 'row',
                        'flex_wrap' => 'wrap',
                        'flex_gap' => array('column' => '12', 'row' => '12', 'isLinked' => true, 'unit' => 'px', 'size' => 12),
                    ), array(
                        gw_cb_button('home-free-download', 'button:: 無料ダウンロード', 'Free Download', 'https://github.com/healingsolutions/charabreak', 'primary', '', true),
                        gw_cb_button('home-play', 'button:: このページで遊ぶ', 'Break This Page', '#gaming-web-start', 'secondary', 'gw-inline-start'),
                    ), true),
                ), true),
                gw_cb_container('home-hero-visual', 'container:: ヒーロービジュアル', array(
                    'content_width' => 'full',
                    'width' => gw_cb_size(34, '%'),
                    'width_tablet' => gw_cb_size(100, '%'),
                    'width_mobile' => gw_cb_size(100, '%'),
                    'padding' => gw_cb_space(30, 30, 30, 30),
                    'background_background' => 'classic',
                    'background_color' => 'rgba(251,250,244,0.92)',
                    'border_border' => 'solid',
                    'border_color' => 'rgba(78,220,207,0.48)',
                    'border_width' => gw_cb_space(1, 1, 1, 1),
                    'border_radius' => gw_cb_space(8, 8, 8, 8),
                ), array(
                    gw_cb_image('home-character', 'image:: CharaBreakキャラクター', $character['url'], $character['id'], array(
                        'width' => gw_cb_size(46, '%'),
                        'align' => 'center',
                    )),
                    gw_cb_heading('home-visual-title', 'title:: 壊せるサイト訴求', 'Serious page. Playable content.', 'h3', array(
                        'title_color' => '#08141f',
                        'align' => 'center',
                        'typography_font_size' => gw_cb_size(28),
                    )),
                    gw_cb_text('home-visual-body', 'text:: ビジュアル説明', 'きちんと作り込まれたWebサイトほど、ゲームとして触れた時のギャップが強くなります。おしゃれなページなのに壊せる。その違和感が、思わず誰かに見せたくなる体験になります。', array(
                        'align' => 'center',
                    )),
                ), true),
            )),
            gw_cb_container('home-concept', 'section:: 02・コンセプト', array(
                'content_width' => 'boxed',
                'flex_direction' => 'column',
                'padding' => gw_cb_space(92, 24, 96, 24),
                'background_background' => 'classic',
                'background_color' => '#fbfaf4',
            ), array(
                gw_cb_section_title('home-concept-title', 'Concept', '読まれない時代の、読むきっかけを作る。', '広告もLPも、最初の壁は「読まれない」ことです。CharaBreakは文章をいきなり読ませるのではなく、ページそのものを遊べる対象に変えます。触る、攻撃する、守る、進む。その行為の中で、訪問者は自然に言葉へ接触していきます。'),
                gw_cb_card_grid('home-concept-cards', array(
                    array('icon' => 'fas fa-stopwatch', 'title' => '滞在時間を体験に変える', 'body' => 'ただ長く滞在させるのではなく、ページを探索する理由を作ります。訪問者はゲームとして遊びながら、結果的に見出し・本文・CTAを何度も目にします。', 'accent' => '#4edccf'),
                    array('icon' => 'fas fa-hand-sparkles', 'title' => '読む前の抵抗を下げる', 'body' => '「理解してください」ではなく「触ってみてください」から始めることで、難しい説明や長い文章への心理的な距離を縮めます。', 'accent' => '#f5d565'),
                    array('icon' => 'fas fa-users', 'title' => 'ファンになる余白を作る', 'body' => 'ゲーム性、爽快感、クリア特典、ページ移動の驚きが、ブランドを覚える理由になります。情報接触を、記憶に残る遊びへ変えます。', 'accent' => '#ff7a66'),
                )),
            )),
            gw_cb_container('home-business-impact', 'section:: 03・ビジネス価値', array(
                'content_width' => 'boxed',
                'flex_direction' => 'column',
                'padding' => gw_cb_space(92, 24, 96, 24),
                'background_background' => 'classic',
                'background_color' => '#08141f',
            ), array(
                gw_cb_section_title('home-business-impact-title', 'Interactive Web', '壊すことを、マーケティング施策にする。', 'CharaBreakは単なるミニゲームではありません。Webサイトの上に、滞在・回遊・読了・特典導線を生むインタラクティブレイヤーを追加します。ビジネスサイトの信頼感はそのままに、遊べる驚きでファンをつかみます。', true),
                gw_cb_card_grid('home-business-impact-cards', array(
                    array('icon' => 'fas fa-eye', 'title' => '見られる接点が増える', 'body' => '文字が足場になり、画像が壁になり、リンクがゲートになる。ページの要素そのものが体験に変わるため、通常より多くのコンテンツ接点を作れます。', 'accent' => '#4edccf'),
                    array('icon' => 'fas fa-route', 'title' => 'ページ回遊をゲーム化する', 'body' => 'リンク先への移動をゲートにすることで、複数ページの閲覧を「次のステージへ進む」感覚に変えられます。', 'accent' => '#f5d565'),
                    array('icon' => 'fas fa-ticket-alt', 'title' => 'クリア後の行動につなげる', 'body' => 'クリアした人だけにクーポン、特典ページ、限定メッセージを表示。楽しかった直後の熱量を、登録・購入・問い合わせの手前まで運べます。', 'accent' => '#ff7a66'),
                ), true),
            )),
            gw_cb_container('home-loop', 'section:: 04・ゲームループ', array(
                'content_width' => 'boxed',
                'flex_direction' => 'column',
                'padding' => gw_cb_space(92, 24, 96, 24),
                'background_background' => 'classic',
                'background_color' => '#eaf6f3',
            ), array(
                gw_cb_section_title('home-loop-title', 'Game Loop', '走る、攻撃する、守る、そして読む。', 'プレイヤーはページの上に落ちてきて、文字や画像を足場に進みます。壊した文字、守った文字、敵から守ったページの記憶が、最後に本文の要約と重なります。遊びのあとに、読まれる構造です。'),
                gw_cb_card_grid('home-loop-cards', array(
                    array('icon' => 'fas fa-running', 'title' => 'Start', 'body' => 'キャラクターが上から落ちてきて、文字の上に着地します。', 'accent' => '#4edccf'),
                    array('icon' => 'fas fa-bolt', 'title' => 'Break', 'body' => '文字を1文字ずつ攻撃し、穴を作って次の足場へ降ります。', 'accent' => '#f5d565'),
                    array('icon' => 'fas fa-shield-alt', 'title' => 'Guard', 'body' => '守りたい文字を3文字以上集め、敵からページを守ります。', 'accent' => '#a6e35d'),
                    array('icon' => 'fas fa-flag-checkered', 'title' => 'Goal', 'body' => 'クリア後は要約、守った文字、特典、次ページへの導線を表示します。', 'accent' => '#ff7a66'),
                )),
            )),
            gw_cb_container('home-pricing-preview', 'section:: 05・料金導線', array(
                'content_width' => 'boxed',
                'flex_direction' => 'row',
                'flex_wrap' => 'wrap',
                'flex_gap' => array('column' => '24', 'row' => '24', 'isLinked' => true, 'unit' => 'px', 'size' => 24),
                'padding' => gw_cb_space(92, 24, 96, 24),
                'background_background' => 'classic',
                'background_color' => '#08141f',
            ), array(
                gw_cb_section_title('home-price-title', 'Plans', '無料で試して、1サイト買い切りで広げる。', '無料版は1ページだけゲーム化できる入口。Proではページ数制限を外し、リンクゲートで複数ページを冒険化します。個人制作から企業サイトまで、導入しやすい1サイト単位の販売を想定しています。', true),
                gw_cb_card_grid('home-price-cards', array(
                    array('icon' => 'fas fa-seedling', 'title' => 'Free', 'body' => '1ページだけゲーム化。CharaBreakの楽しさをすぐ試せます。', 'accent' => '#4edccf'),
                    array('icon' => 'fas fa-crown', 'title' => 'Pro / 1 Site', 'body' => '1サイト買い切り。無制限ページ、複数ページ冒険、特典、分析を開放予定です。', 'accent' => '#f5d565'),
                    array('icon' => 'fas fa-globe', 'title' => 'Freemius', 'body' => '海外販売、ライセンス、自動アップデート、決済をFreemiusで扱う想定です。', 'accent' => '#ff7a66'),
                ), true),
            )),
            gw_cb_footer_cta($links),
        );
    }
}

if (!function_exists('gw_cb_features_data')) {
    function gw_cb_features_data(array $links): array
    {
        return array(
            gw_cb_nav($links),
            gw_cb_container('features-hero', 'section:: 01・機能ページヒーロー', array(
                'content_width' => 'boxed',
                'flex_direction' => 'column',
                'padding' => gw_cb_space(92, 24, 72, 24),
                'background_background' => 'classic',
                'background_color' => '#fbfaf4',
            ), array(
                gw_cb_section_title('features-title', 'Features', 'ページそのものを、インタラクティブWebにする。', 'CharaBreakはWordPressの本文、画像、ボタン、リンクを読み取り、遊べる足場とリアクションに変換します。訪問者はコンテンツを読む前に、コンテンツの中へ入り込みます。'),
                gw_cb_card_grid('features-grid', array(
                    array('icon' => 'fas fa-font', 'title' => '文字がステージになる', 'body' => '1文字ずつ攻撃でき、壊れた場所は穴として残ります。本文そのものが、進行と発見のきっかけになります。', 'accent' => '#4edccf'),
                    array('icon' => 'fas fa-image', 'title' => '画像やアイコンも遊べる', 'body' => '通常画像、アイコン、バー、ボタン枠も足場や攻撃対象になります。ビジュアル要素まで、触れるコンテンツになります。', 'accent' => '#f5d565'),
                    array('icon' => 'fas fa-door-open', 'title' => 'リンクをゲートにする', 'body' => 'サイト内リンクに滞在するとゲージが溜まり、ゲームモードのままページ移動できます。回遊がステージ攻略に変わります。', 'accent' => '#ff7a66'),
                    array('icon' => 'fas fa-robot', 'title' => '敵が意味を生む', 'body' => '下へ進むほど敵が現れ、ページや守りたい文字を守る戦いに変化します。遊びに目的が生まれます。', 'accent' => '#a6e35d'),
                    array('icon' => 'fas fa-ticket-alt', 'title' => 'クリア後だけの特典', 'body' => 'ゴールした人だけにクーポン、特典URL、限定メッセージを表示。体験の達成感を次の行動につなげます。', 'accent' => '#4edccf'),
                    array('icon' => 'fas fa-chart-line', 'title' => '軽量な体験ログ', 'body' => '開始、終了、文字収集、クリアなどを匿名イベントとして記録。どのページが遊ばれたかを把握できます。', 'accent' => '#f5d565'),
                )),
            )),
            gw_cb_container('features-flow', 'section:: 02・導入フロー', array(
                'content_width' => 'boxed',
                'flex_direction' => 'column',
                'padding' => gw_cb_space(82, 24, 90, 24),
                'background_background' => 'classic',
                'background_color' => '#eaf6f3',
            ), array(
                gw_cb_section_title('features-flow-title', 'Creator Flow', 'Elementorページにも、自然に開始リンクを置ける。', '右下の固定ボタンだけでなく、ヒーローのCTA、料金表のボタン、記事中のリンクからゲームを開始できます。おしゃれなサイトの文脈を壊さず、遊びだけを自然に重ねます。'),
                gw_cb_card_grid('features-flow-cards', array(
                    array('icon' => 'fas fa-toggle-on', 'title' => 'ページごとにON', 'body' => '無料版は1ページで検証。Proでは複数ページをステージ化し、サイト全体の回遊施策として使えます。', 'accent' => '#4edccf'),
                    array('icon' => 'fas fa-pencil-alt', 'title' => '守る文字を設定', 'body' => 'ページごとに守りたい文字やステージ名を管理できます。ブランドや記事テーマに合わせたゲーム体験にできます。', 'accent' => '#f5d565'),
                    array('icon' => 'fas fa-gamepad', 'title' => '操作説明も内蔵', 'body' => 'キーボード、スマホ、ゲームパッド操作をゲーム開始時に案内。難しい説明より先に、まず触れる導線を作ります。', 'accent' => '#ff7a66'),
                )),
            )),
            gw_cb_footer_cta($links),
        );
    }
}

if (!function_exists('gw_cb_pricing_data')) {
    function gw_cb_pricing_data(array $links): array
    {
        return array(
            gw_cb_nav($links),
            gw_cb_container('pricing-hero', 'section:: 01・料金ページヒーロー', array(
                'content_width' => 'boxed',
                'flex_direction' => 'column',
                'padding' => gw_cb_space(92, 24, 72, 24),
                'background_background' => 'classic',
                'background_color' => '#08141f',
            ), array(
                gw_cb_section_title('pricing-title', 'Pricing', '無料で試して、Proでサイト全体を冒険に。', '無料版は誰でもダウンロードでき、1ページだけゲーム化できます。Proは1サイトごとの単発販売としてFreemiusで提供し、複数ページの回遊、特典導線、より深いステージ設定を開放する想定です。', true),
                gw_cb_card_grid('pricing-plans', array(
                    array('icon' => 'fas fa-leaf', 'title' => 'Free / 1 Page', 'body' => '1ページのゲーム化、基本操作、クリア演出、軽量ログ。まずは「自分のサイトで本当に面白いか」を低いハードルで試せます。', 'accent' => '#4edccf'),
                    array('icon' => 'fas fa-gem', 'title' => 'Pro / 1 Site', 'body' => 'ページ数無制限、リンクゲートで複数ページ冒険、特典/クーポン、ステージ設定拡張。サイト全体をインタラクティブ施策にできます。', 'accent' => '#f5d565'),
                    array('icon' => 'fas fa-store', 'title' => 'Freemius Commerce', 'body' => '海外決済、ライセンス、自動アップデート、購入者管理はFreemiusへ。開発リソースはゲーム体験の改善に集中します。', 'accent' => '#ff7a66'),
                ), true),
                gw_cb_container('pricing-buttons', 'container:: 料金ページCTAボタン', array(
                    'content_width' => 'full',
                    'flex_direction' => 'row',
                    'flex_wrap' => 'wrap',
                    'flex_justify_content' => 'center',
                    'flex_gap' => array('column' => '12', 'row' => '12', 'isLinked' => true, 'unit' => 'px', 'size' => 12),
                    'padding' => gw_cb_space(24, 0, 0, 0),
                ), array(
                    gw_cb_button('pricing-github', 'button:: GitHubを見る', 'GitHub', 'https://github.com/healingsolutions/charabreak', 'primary', '', true),
                    gw_cb_button('pricing-play', 'button:: このページで遊ぶ', 'Play Pricing Page', '#gaming-web-start', 'secondary', 'gw-inline-start'),
                ), true),
            )),
            gw_cb_container('pricing-comparison', 'section:: 02・プラン比較', array(
                'content_width' => 'boxed',
                'flex_direction' => 'column',
                'padding' => gw_cb_space(82, 24, 90, 24),
                'background_background' => 'classic',
                'background_color' => '#fbfaf4',
            ), array(
                gw_cb_section_title('pricing-comparison-title', 'Plan Difference', '無料は体験、Proはビジネス施策。', '無料版はCharaBreakの面白さを1ページで試す入口。Proはサイト内リンクをゲームのゲートにして、複数ページを渡り歩く体験、クリア後特典、回遊導線を作ります。'),
                gw_cb_card_grid('pricing-comparison-cards', array(
                    array('icon' => 'fas fa-file-alt', 'title' => 'Free: 1ページ', 'body' => '1ページだけゲームモードを有効化。配布しやすく、試しやすい入口です。', 'accent' => '#4edccf'),
                    array('icon' => 'fas fa-sitemap', 'title' => 'Pro: 無制限ページ', 'body' => 'サイト全体をステージ化し、ゲート移動や特典導線を組み合わせられます。', 'accent' => '#f5d565'),
                    array('icon' => 'fas fa-key', 'title' => '1サイトライセンス', 'body' => '買い切り型の1サイト価格を基本に、海外向けにはFreemiusで販売します。', 'accent' => '#ff7a66'),
                )),
            )),
            gw_cb_footer_cta($links),
        );
    }
}

if (!function_exists('gw_cb_demo_data')) {
    function gw_cb_demo_data(array $links): array
    {
        $business = gw_cb_business_image();

        return array(
            gw_cb_nav($links),
            gw_cb_container('demo-hero', 'section:: 01・デモページヒーロー', array(
                'content_width' => 'boxed',
                'flex_direction' => 'row',
                'flex_wrap' => 'wrap',
                'flex_align_items' => 'center',
                'flex_gap' => array('column' => '42', 'row' => '32', 'isLinked' => false, 'unit' => 'px', 'size' => 42),
                'padding' => gw_cb_space(92, 24, 72, 24),
                'background_background' => 'classic',
                'background_color' => '#fbfaf4',
            ), array(
                gw_cb_container('demo-copy', 'container:: デモ導入コピー', array(
                    'content_width' => 'full',
                    'width' => gw_cb_size(52, '%'),
                    'width_tablet' => gw_cb_size(100, '%'),
                    'flex_direction' => 'column',
                    'flex_gap' => array('column' => '16', 'row' => '16', 'isLinked' => true, 'unit' => 'px', 'size' => 16),
                ), array(
                    gw_cb_heading('demo-h1', 'title:: デモ見出し', '読む前に、まず壊してみる。', 'h1', array(
                        'typography_font_size' => gw_cb_size(62),
                    )),
                    gw_cb_text('demo-lead', 'text:: デモ説明', 'このページの文章、画像、ボタン、アイコン、ゲートは、ゲームモードで足場にも攻撃対象にもなります。普通なら読み飛ばされる要素が、遊びの対象になる。STARTを押して、Webサイトがインタラクティブなステージに変わる瞬間を試してください。'),
                    gw_cb_button('demo-start', 'button:: デモ開始', 'Start Demo', '#gaming-web-start', 'primary', 'gw-inline-start'),
                ), true),
                gw_cb_image('demo-image', 'image:: ビジネスサイト画像', $business['url'], $business['id'], array(
                    'width' => gw_cb_size(42, '%'),
                    'width_tablet' => gw_cb_size(100, '%'),
                    'border_radius' => gw_cb_space(8, 8, 8, 8),
                )),
            )),
            gw_cb_container('demo-playground', 'section:: 02・壊せるデモ要素', array(
                'content_width' => 'boxed',
                'flex_direction' => 'column',
                'padding' => gw_cb_space(82, 24, 90, 24),
                'background_background' => 'classic',
                'background_color' => '#eaf6f3',
            ), array(
                gw_cb_section_title('demo-playground-title', 'Playable Elements', 'この下の文章やカードが、ゲームの地形になります。', '普通に読むとプロダクト紹介。ゲームを始めると、文字は足場に、カードは壁に、ボタンはゲートになります。壊すことが、結果的に読むことへつながる体験をここで確認できます。'),
                gw_cb_card_grid('demo-cards', array(
                    array('icon' => 'fas fa-mouse-pointer', 'title' => 'クリックではなく操作する', 'body' => 'キャラクターを動かし、目の前の文字を丁寧に攻撃します。訪問者は「読者」ではなく「プレイヤー」になります。', 'accent' => '#4edccf'),
                    array('icon' => 'fas fa-sort-amount-down', 'title' => '落下が進行になる', 'body' => '穴から下へ落ちることで、ページを読み進める感覚が生まれます。スクロールが攻略に変わります。', 'accent' => '#f5d565'),
                    array('icon' => 'fas fa-link', 'title' => 'リンクはゲートになる', 'body' => '触れて待つとリンク先へ。サイト回遊を、次のステージへ向かう行動として演出できます。', 'accent' => '#ff7a66'),
                    array('icon' => 'fas fa-heart', 'title' => '文字を守る', 'body' => '長く持った文字は守る文字になり、クリア条件へ近づきます。', 'accent' => '#a6e35d'),
                    array('icon' => 'fas fa-bomb', 'title' => '敵がページを狙う', 'body' => '下へ進むほど戦いが始まり、ページを守る意味が出てきます。', 'accent' => '#ff7a66'),
                    array('icon' => 'fas fa-scroll', 'title' => '最後に内容へ戻る', 'body' => 'クリア後の要約で、遊んだページの内容をもう一度見せます。', 'accent' => '#4edccf'),
                )),
            )),
            gw_cb_footer_cta($links),
        );
    }
}

if (!function_exists('gw_cb_faq_data')) {
    function gw_cb_faq_data(array $links): array
    {
        return array(
            gw_cb_nav($links),
            gw_cb_container('faq-hero', 'section:: 01・FAQヒーロー', array(
                'content_width' => 'boxed',
                'flex_direction' => 'column',
                'padding' => gw_cb_space(92, 24, 72, 24),
                'background_background' => 'classic',
                'background_color' => '#fbfaf4',
            ), array(
                gw_cb_section_title('faq-title', 'FAQ', '配布、販売、ビジネス活用のよくある質問。', '無料配布からFreemius販売、インタラクティブWeb施策としての使い方まで、CharaBreakを世界に出すために必要な情報をまとめます。'),
                gw_cb_accordion('faq-accordion', 'accordion:: CharaBreak FAQ', array(
                    array('title' => 'どんなWordPressページでもゲーム化できますか？', 'body' => '固定ページや投稿を中心に対応します。Elementorなど主要ビルダーは順次互換性を高めますが、複雑なスライダーや特殊な埋め込みは個別調整が必要です。'),
                    array('title' => 'ビジネス上の狙いは何ですか？', 'body' => '文章を最初から読ませるのではなく、壊す・進む・守るという行為を通じてページとの接触時間を増やすことです。結果的に見出しや本文、CTAへの接触回数が増え、ブランド記憶や回遊につながります。'),
                    array('title' => '無料版では何ができますか？', 'body' => '1ページだけゲーム化できます。基本操作、文字攻撃、守る文字、GOAL、簡単なログを試せます。'),
                    array('title' => 'Pro版は何が違いますか？', 'body' => 'ページ数制限を外し、複数ページをリンクゲートでつなぐ冒険、特典やクーポン、ステージ設定の拡張を想定しています。'),
                    array('title' => 'Freemiusで販売する理由は？', 'body' => '海外販売、ライセンス、自動アップデート、決済、購入者管理を早く整え、開発リソースをゲーム体験に集中するためです。'),
                    array('title' => 'ページの本物のDOMは壊れますか？', 'body' => 'ゲーム中の破壊は視覚・状態として扱います。リロードや終了で通常ページへ戻り、SEOやフォームを壊さない設計です。'),
                )),
            )),
            gw_cb_footer_cta($links),
        );
    }
}

if (!function_exists('gw_cb_upsert_page')) {
    function gw_cb_upsert_page(string $slug, string $title): int
    {
        $existing = get_page_by_path($slug, OBJECT, 'page');
        $postarr = array(
            'post_title' => $title,
            'post_name' => $slug,
            'post_type' => 'page',
            'post_status' => 'publish',
            'post_content' => '',
        );

        if ($existing instanceof WP_Post) {
            $postarr['ID'] = $existing->ID;
            $post_id = wp_update_post($postarr, true);
        } else {
            $post_id = wp_insert_post($postarr, true);
        }

        if (is_wp_error($post_id)) {
            throw new RuntimeException($post_id->get_error_message());
        }

        return (int) $post_id;
    }
}

if (!function_exists('gw_cb_apply_elementor')) {
    function gw_cb_apply_elementor(int $post_id, string $slug, array $data): void
    {
        update_post_meta($post_id, '_elementor_edit_mode', 'builder');
        update_post_meta($post_id, '_elementor_template_type', 'wp-page');
        update_post_meta($post_id, '_elementor_version', defined('ELEMENTOR_VERSION') ? ELEMENTOR_VERSION : '4.0.9');
        update_post_meta($post_id, '_wp_page_template', 'elementor_canvas');
        update_post_meta($post_id, '_elementor_data', wp_slash(wp_json_encode($data)));
        update_post_meta($post_id, '_gaming_web_mode', 'enabled');
        update_post_meta($post_id, '_gaming_web_important_words', '遊, 壊, 守, 響, 触, 記');
        update_post_meta($post_id, '_gaming_web_stage_name', 'CharaBreak ' . ucfirst(str_replace('charabreak-', '', $slug)));
        update_post_meta($post_id, '_gaming_web_reward_enabled', '1');
        update_post_meta($post_id, '_gaming_web_reward_title', 'CharaBreak Clear Reward');
        update_post_meta($post_id, '_gaming_web_reward_message', 'このページを遊び切った人だけに見える、CharaBreakデモ用の特典です。');
        update_post_meta($post_id, '_gaming_web_reward_coupon_code', 'CHARABREAK-CLEAR');
        update_post_meta($post_id, '_gaming_web_reward_url', home_url('/charabreak-pricing/'));

        $export_dir = dirname(__DIR__) . '/_generated';
        if (!is_dir($export_dir)) {
            wp_mkdir_p($export_dir);
        }

        file_put_contents(
            trailingslashit($export_dir) . $slug . '-elementor.json',
            wp_json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
        );
    }
}

$pages = array(
    'home' => array('slug' => 'charabreak', 'title' => 'CharaBreak'),
    'features' => array('slug' => 'charabreak-features', 'title' => 'CharaBreak Features'),
    'pricing' => array('slug' => 'charabreak-pricing', 'title' => 'CharaBreak Pricing'),
    'demo' => array('slug' => 'charabreak-demo', 'title' => 'CharaBreak Playable Demo'),
    'faq' => array('slug' => 'charabreak-faq', 'title' => 'CharaBreak FAQ'),
);

$ids = array();
foreach ($pages as $key => $page) {
    $ids[$key] = gw_cb_upsert_page($page['slug'], $page['title']);
}

$links = array();
foreach ($pages as $key => $page) {
    $links[$key] = get_permalink($ids[$key]);
}

$builders = array(
    'home' => 'gw_cb_home_data',
    'features' => 'gw_cb_features_data',
    'pricing' => 'gw_cb_pricing_data',
    'demo' => 'gw_cb_demo_data',
    'faq' => 'gw_cb_faq_data',
);

foreach ($builders as $key => $callback) {
    $data = $callback($links);
    gw_cb_apply_elementor($ids[$key], $pages[$key]['slug'], $data);
    gw_cb_log('Built ' . $pages[$key]['title'] . ' #' . $ids[$key]);
}

update_option('blogname', 'CharaBreak');
update_option('blogdescription', 'Make stylish WordPress pages playable.');
update_option('show_on_front', 'page');
update_option('page_on_front', $ids['home']);
update_option('gaming_web_enabled', '1');
update_option('gaming_web_post_types', array('page', 'post'));
update_option('gaming_web_show_floating_button', '1');
update_option('gaming_web_button_label', 'PLAY');

if (class_exists('WP_CLI')) {
    WP_CLI::success('CharaBreak Elementor site generated.');
}
