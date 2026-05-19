<?php

if (!defined('ABSPATH')) {
    exit;
}

update_option('gaming_web_enabled', '1');
update_option('gaming_web_show_floating_button', '1');
update_option('gaming_web_post_types', array('page', 'post'));
update_option('gaming_web_button_label', 'ゲームモード');
update_option('gaming_web_character_name', 'ピコ');
update_option('gaming_web_logging_enabled', '1');
update_option('gaming_web_debug', '0');

$gw_seed_assets = array(
    plugins_url('assets/sprites/demo-crystal.svg', dirname(__DIR__) . '/gaming-web.php'),
    plugins_url('assets/sprites/demo-ribbon.svg', dirname(__DIR__) . '/gaming-web.php'),
    plugins_url('assets/sprites/demo-window.svg', dirname(__DIR__) . '/gaming-web.php'),
);

$gw_seed_word_sets = array(
    array('余白', '光', '記憶', '観測', '小さな発見'),
    array('街角', '音', 'リズム', '散歩', '夜明け'),
    array('庭', '風', '影', '粒子', 'ひらめき'),
    array('窓', '地図', '入口', '深呼吸', '透明な時間'),
    array('頁', '合図', '結晶', '反射', '遊び心'),
);

if (!function_exists('gw_seed_find_post_id')) {
    function gw_seed_find_post_id(string $title, string $post_type): int
    {
        $posts = get_posts(array(
            'post_type' => $post_type,
            'post_status' => 'any',
            'title' => $title,
            'numberposts' => 1,
            'fields' => 'ids',
        ));

        return isset($posts[0]) ? absint($posts[0]) : 0;
    }
}

if (!function_exists('gw_seed_demo_content')) {
    function gw_seed_demo_content(string $title, string $stage_name, array $words, string $image_url, int $index): string
    {
        $word_text = implode('、', $words);
        $safe_id = 'gw-demo-note-' . $index;

        return '<!-- wp:html -->
<main class="gw-demo-content">
    <section class="gw-demo-hero" aria-label="メインビジュアル">
        <div class="gw-demo-hero__copy">
            <p class="gw-demo-kicker">PLAYFUL BRAND JOURNAL</p>
            <h1>' . esc_html($title) . '</h1>
            <p>静かな文章、整った写真、読みやすい余白。ふつうに美しいWebサイトの表面を、ゲームモードで少しずつ攻撃できます。</p>
            <p>壊すためではなく、触って確かめるためのページです。' . esc_html($word_text) . ' が、画面の奥で小さく光っています。</p>
            <p class="gw-demo-actions"><a href="#gaming-web-start" class="gw-inline-start" data-gaming-web-start>このページで遊ぶ</a><a href="#' . esc_attr($safe_id) . '">今日の展示を見る</a><a href="' . esc_url(home_url('/?page_id=2')) . '">別ページへ歩く</a><button type="button">小さな合図を鳴らす</button></p>
        </div>
        <figure class="gw-demo-hero__media">
            <img src="' . esc_url($image_url) . '" alt="' . esc_attr($stage_name) . 'の抽象ビジュアル">
            <figcaption>' . esc_html($stage_name) . '</figcaption>
        </figure>
    </section>

    <section class="gw-demo-band">
        <h2>このページの見どころ</h2>
        <p>見出し、本文、写真、ボタンが、それぞれ違う手ごたえを持つように配置されています。文字は一つずつ欠け、写真は斜めに残り、レイアウトのきれいさが崩れていくほど遊び場になります。</p>
        <div class="gw-demo-card-grid">
            <article>
                <h3>' . esc_html($words[0]) . 'の棚</h3>
                <p>短い言葉が並ぶ棚。攻撃すると、余白に小さな穴が開きます。</p>
            </article>
            <article>
                <h3>' . esc_html($words[1]) . 'の窓</h3>
                <p>画像やカードの上を歩き、崩れた場所を足場にできます。</p>
            </article>
            <article>
                <h3>' . esc_html($words[2]) . 'の回廊</h3>
                <p>少しずつ壊すほど、ページの読み方がゲームの地形に変わります。</p>
            </article>
        </div>
    </section>

    <section class="gw-demo-split" id="' . esc_attr($safe_id) . '">
        <div>
            <h2>整った画面を、手で揺らす</h2>
            <p>ブランドサイトのような静かな構成に、ゲームの物理を重ねます。テキストを攻撃した瞬間の細かな破片、画面の揺れ、画像が斜めに残る感覚を試してください。</p>
            <p>' . esc_html($words[3]) . ' と ' . esc_html($words[4]) . ' は収集できる言葉のかけらです。読み進める前に、まず触って遊ぶことを優先しています。</p>
        </div>
        <aside>
            <h3>Stage memo</h3>
            <p>Space / Z / X で攻撃。左右で移動。ゲームモードを終了すれば、ページは元通りです。</p>
            <button type="button">メモをひらく</button>
        </aside>
    </section>
</main>
<!-- /wp:html -->';
    }
}

if (!function_exists('gw_seed_upsert_post')) {
    function gw_seed_upsert_post(string $post_type, string $title, string $content, array $meta): int
    {
        $existing_id = gw_seed_find_post_id($title, $post_type);
        $post_data = array(
            'post_type' => $post_type,
            'post_title' => $title,
            'post_content' => $content,
            'post_status' => 'publish',
            'comment_status' => 'closed',
            'ping_status' => 'closed',
        );

        if ($existing_id > 0) {
            $post_data['ID'] = $existing_id;
        }

        $post_id = wp_insert_post(wp_slash($post_data), true);
        if (is_wp_error($post_id)) {
            return 0;
        }

        foreach ($meta as $key => $value) {
            update_post_meta($post_id, $key, $value);
        }

        return absint($post_id);
    }
}

$page_titles = array(
    'Gaming Web Playground',
    '光の余白スタジオ',
    '言葉の庭ギャラリー',
    '夜明けのカードホテル',
    '小さな入口のショールーム',
    '揺れる見出しのラウンジ',
    '粒子を集めるアトリエ',
    '静かな冒険の案内板',
    '触れると鳴る窓辺',
    'ページを守る準備室',
);

$created_pages = array();
foreach ($page_titles as $index => $title) {
    $words = $gw_seed_word_sets[$index % count($gw_seed_word_sets)];
    $stage_name = 'Stage ' . ($index + 1) . ' / ' . $words[0] . 'の場所';
    $content = gw_seed_demo_content($title, $stage_name, $words, $gw_seed_assets[$index % count($gw_seed_assets)], $index + 1);
    $page_id = gw_seed_upsert_post('page', $title, $content, array(
        '_gaming_web_mode' => 'enabled',
        '_gaming_web_important_words' => implode(', ', $words),
        '_gaming_web_stage_name' => $stage_name,
        '_gaming_web_reward_enabled' => '1',
        '_gaming_web_reward_title' => 'GOALした人だけの特典',
        '_gaming_web_reward_message' => 'ページの奥まで遊んでくれてありがとう。次のステージへ進む前に、小さなごほうびをどうぞ。',
        '_gaming_web_reward_coupon_code' => 'GW-CLEAR-' . str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT),
        '_gaming_web_reward_url' => home_url('/?page_id=2'),
    ));

    if ($page_id > 0) {
        $created_pages[] = $page_id;
    }
}

for ($index = 1; $index <= 30; $index += 1) {
    $words = $gw_seed_word_sets[$index % count($gw_seed_word_sets)];
    $title = 'プレイログ断片 ' . str_pad((string) $index, 2, '0', STR_PAD_LEFT);
    $stage_name = '断片ステージ ' . $index;
    $content = gw_seed_demo_content($title, $stage_name, $words, $gw_seed_assets[$index % count($gw_seed_assets)], 100 + $index);

    gw_seed_upsert_post('post', $title, $content, array(
        '_gaming_web_mode' => 'enabled',
        '_gaming_web_important_words' => implode(', ', $words),
        '_gaming_web_stage_name' => $stage_name,
        '_gaming_web_reward_enabled' => '1',
        '_gaming_web_reward_title' => '読破クリア特典',
        '_gaming_web_reward_message' => 'この投稿を守り抜いた人だけに見える、デモ用のクーポンです。',
        '_gaming_web_reward_coupon_code' => 'POST-CLEAR-' . str_pad((string) $index, 2, '0', STR_PAD_LEFT),
        '_gaming_web_reward_url' => home_url('/'),
    ));
}

if (!empty($created_pages)) {
    update_option('show_on_front', 'page');
    update_option('page_on_front', $created_pages[0]);
}

if (class_exists('WP_CLI')) {
    WP_CLI::success('Gaming Web demo content seeded: 10 pages, 30 posts, plugin settings enabled.');
} else {
    echo "Gaming Web demo content seeded.\n";
}
