import { isGameIgnoredElement, liveRectForTarget } from './dom-scanner.js?v=0.2.18';

const UI_TEXT_EN = {
    defaultCharacter: 'Pico',
    exit: 'END',
    inventoryPrefix: 'W',
    inventoryTitle: 'Found Words',
    emptyInventory: 'Nothing yet',
    start: 'Want to play with this page for a moment?',
    hint: 'Hit something and something may pop out',
    headingFallback: 'Heading',
    headingShake: 'The letters shook!',
    imageCrack: 'It cracked with a flash!',
    imageSpin: 'The image tilted and spun!',
    imageBreak: 'You opened a hole in the image!',
    iconSpin: 'The icon bounced away!',
    iconBreak: 'The icon burst apart!',
    gateReady: 'The link gate is open!',
    gateCharge: 'Stay on the gate to travel!',
    gateBreak: 'The gate collapsed!',
    gateNeedsTextBreak: 'Break the words inside first!',
    enemyAppear: 'An enemy is aiming at the page!',
    enemyHit: 'Nice hit!',
    enemyAttack: 'The page was attacked!',
    enemyDefeat: 'Enemy driven away!',
    bossAppear: 'A mid-boss appeared!',
    bossDefeat: 'Mid-boss stopped!',
    criticalGuard: 'Guard letters',
    criticalLost: 'An important letter was destroyed!',
    stageFailed: 'OUT! A passphrase letter disappeared!',
    lifeLabel: 'LIFE',
    collectedLabel: 'Guarded letters',
    collectMission: 'Open 3 treasure chests to unlock GOAL / Letters are optional memories',
    goalNeedsChests: 'Open {count} more treasure chests!',
    goalReadyWithChests: 'You opened 3 treasure chests! Go to GOAL!',
    chestProgressLabel: 'Chests',
    treasureTitle: 'Guarded Letters',
    treasureEmpty: 'None yet',
    treasureHint: 'Hold X to raise a favorite letter underfoot',
    treasureHold: 'Letter raised! Guard it for 3 seconds!',
    treasurePlaced: 'You placed the letter back down!',
    treasureStored: 'Carved "{char}" into your guard-letter target!',
    treasureNoLetter: 'No guardable letter underfoot!',
    treasureResult: 'You protected "{word}", the letters you chose to guard.',
    placedLetterBreak: 'You broke a placed letter!',
    playerDamage: 'Damage! Block with your shield!',
    gameOverTitle: 'GAME OVER',
    retry: 'Try Again',
    gameOverCritical: 'A passphrase letter was lost.',
    gameOverLife: 'You ran out of life.',
    gameOverHint: 'You can try again anytime. Guard the letters and go once more!',
    goalBlocked: 'You lost a guarded letter, so the stage cannot be cleared!',
    missileParry: 'Missile parried!',
    bossMissileWarn: 'The mid-boss is preparing a missile!',
    shieldHint: 'Use Shift to shield against missiles!',
    returnRoute: 'Return Up',
    returnRouteHint: 'You returned to an upper platform!',
    lockOn: 'Lock on!',
    lockHint: 'Press T / Tab to lock on to an enemy!',
    lockLost: 'Lock lost!',
    noEnemy: 'No enemy to target!',
    noFootWord: 'No throwable letter underfoot!',
    wordHold: 'You picked up a letter!',
    wordThrow: 'Word thrown!',
    actionFallback: 'This moves too',
    actionHop: 'It dodged a little!',
    accordionOpen: 'The mechanism opened!',
    accordionClose: 'The mechanism closed!',
    brighten: 'The page got a little brighter!',
    runnerBreak: 'The pixel kid smashed a letter!',
    playerHint: 'Space/W/↑: Jump, J/Z: Attack, K/X: Throw/Guard, L/Shift: Shield',
    miss: 'You swung through the air!',
    chargeReady: 'Power charged!',
    chargeFull: 'Heavy strike!',
    missionTitle: 'QUEST BOARD',
    missionReachGoal: 'Reach the GOAL gate near the bottom',
    missionProtect: 'Protect letters from enemies',
    goalReady: 'The GOAL gate opened!',
    goalGate: 'GOAL',
    goalNext: 'Next page',
    goalEnd: 'End roll',
    stageClear: 'STAGE CLEAR!',
    stageClearBurst: 'CLEAR! Enemies burst away!',
    protectedLabel: 'Protected',
    brokenLabel: 'Broken',
    lostLabel: 'Lost',
    defeatedLabel: 'Defeated',
    progressLabel: 'Progress',
    summaryTitle: 'Page Summary',
    endRollTitle: 'Page Memory',
    endRollClose: 'Back',
    rewardTitle: 'Clear Reward',
    rewardLoading: 'Opening your reward...',
    rewardUnavailable: 'The reward is not available yet.',
    rewardCoupon: 'Coupon code',
    rewardLink: 'Reward page',
    enemyDamage: 'A guarded letter was damaged!',
    bgmOn: 'BGM',
    bgmOff: 'BGM',
    controlsToggle: 'CTRL',
    mapToggle: 'MAP',
    controlsClose: 'Close',
    controlGuideTitle: 'QUICK MENU',
    controlGuideKeys: 'CTRL: Controls / J Hit / K-X Letters / Space Jump / L Shield',
    controlGuidePad: 'Gamepad supported',
    introTitle: 'Use the page as your platform',
    introLead: 'Land on letters, cross images and buttons, and move downward. Open 3 treasure chests to bring the GOAL closer.',
    introKeys: 'J: Attack / K-X: Pick up or throw letters / L: Shield / Space: Jump',
    introPad: 'Gamepads are supported too',
    introStart: 'START',
    introDrop: 'Dropping in!',
    chestAppear: 'A treasure chest shimmered nearby!',
    chestOpen: 'Treasure opened!',
    chestReady: 'All 3 treasure chests are open! Head for GOAL!',
    itemHeal: 'Heart restored!',
    itemShield: 'Shield boosted for a moment!',
    itemHammer: 'Hammer power boosted!',
    itemHint: 'A guard-letter hint glows: "{char}"',
    itemJewel: 'Score jewel +1!',
};

const UI_TEXT_JA = {
    defaultCharacter: '\u30d4\u30b3',
    exit: 'END',
    inventoryPrefix: 'W',
    inventoryTitle: '\u898b\u3064\u3051\u305f\u8a00\u8449',
    emptyInventory: '\u307e\u3060\u7a7a\u3063\u307d',
    start: '\u3053\u306e\u30da\u30fc\u30b8\u3001\u3061\u3087\u3063\u3068\u89e6\u3063\u3066\u307f\u308b\uff1f',
    hint: '\u53e9\u304f\u3068\u4f55\u304b\u51fa\u308b\u304b\u3082',
    headingFallback: '\u898b\u51fa\u3057',
    headingShake: '\u6587\u5b57\u304c\u3086\u308c\u305f\uff01',
    imageCrack: '\u304d\u3089\u3063\u3068\u5272\u308c\u3066\u3001\u5149\u3060\u3051\u6b8b\u3063\u305f\uff01',
    imageSpin: '\u753b\u50cf\u304c\u3050\u3089\u3063\u3068\u56de\u3063\u305f\uff01',
    imageBreak: '\u753b\u50cf\u306b\u7a74\u304c\u3042\u3044\u305f\uff01',
    iconSpin: '\u30a2\u30a4\u30b3\u30f3\u304c\u30ab\u30e9\u30f3\u3068\u8df3\u306d\u305f\uff01',
    iconBreak: '\u30a2\u30a4\u30b3\u30f3\u304c\u306f\u3058\u3051\u305f\uff01',
    gateReady: '\u30ea\u30f3\u30af\u30b2\u30fc\u30c8\u304c\u958b\u3044\u3066\u3044\u308b\uff01',
    gateCharge: '\u30b2\u30fc\u30c8\u3067\u3059\u3053\u3057\u5f85\u3064\u3068\u79fb\u52d5\u3067\u304d\u308b\uff01',
    gateBreak: '\u30b2\u30fc\u30c8\u304c\u5d29\u308c\u305f\uff01',
    gateNeedsTextBreak: '\u5148\u306b\u4e2d\u306e\u6587\u5b57\u3092\u653b\u6483\u3057\u3088\u3046\uff01',
    enemyAppear: '\u6575\u304c\u30da\u30fc\u30b8\u3092\u72d9\u3063\u3066\u3044\u308b\uff01',
    enemyHit: '\u305d\u306e\u8abf\u5b50\uff01',
    enemyAttack: '\u30da\u30fc\u30b8\u304c\u653b\u6483\u3055\u308c\u305f\uff01',
    enemyDefeat: '\u6575\u3092\u8ffd\u3044\u6255\u3063\u305f\uff01',
    bossAppear: '\u4e2d\u30dc\u30b9\u304c\u73fe\u308c\u305f\uff01',
    bossDefeat: '\u4e2d\u30dc\u30b9\u3092\u6b62\u3081\u305f\uff01',
    criticalGuard: '\u5b88\u308b\u6587\u5b57',
    criticalLost: '\u91cd\u8981\u306a\u6587\u5b57\u304c\u58ca\u3055\u308c\u305f\uff01',
    stageFailed: '\u30a2\u30a6\u30c8\uff01\u5408\u8a00\u8449\u306e\u6587\u5b57\u304c\u6d88\u3048\u305f\uff01',
    lifeLabel: 'LIFE',
    collectedLabel: '\u5b88\u3063\u305f\u6587\u5b57',
    collectMission: '\u5b9d\u7bb1\u30923\u3064\u958b\u3051\u308b\u3068GOAL\u3078 / \u6587\u5b57\u96c6\u3081\u306f\u601d\u3044\u51fa',
    goalNeedsChests: '\u3042\u3068{count}\u500b\u3001\u5b9d\u7bb1\u3092\u958b\u3051\u3088\u3046\uff01',
    goalReadyWithChests: '\u5b9d\u7bb1\u30923\u3064\u958b\u3051\u305f\uff01GOAL\u3078\uff01',
    chestProgressLabel: '\u5b9d\u7bb1',
    treasureTitle: '\u96c6\u3081\u305f\u6587\u5b57',
    treasureEmpty: '\u307e\u3060\u306a\u3057',
    treasureHint: 'X\u9577\u62bc\u3057\u3067\u597d\u304d\u306a\u6587\u5b57\u3092\u96c6\u3081\u3089\u308c\u308b',
    treasureHold: '\u6587\u5b57\u3092\u63b2\u3052\u305f\uff01 3\u79d2\u5b88\u308d\u3046\uff01',
    treasurePlaced: '\u6587\u5b57\u3092\u305d\u306e\u5834\u306b\u7f6e\u3044\u305f\uff01',
    treasureStored: '\u300c{char}\u300d\u3092\u5b88\u308b\u6587\u5b57\u306e\u76ee\u6a19\u306b\u523b\u3093\u3060\uff01',
    treasureNoLetter: '\u8db3\u5143\u306b\u5b88\u308b\u6587\u5b57\u304c\u306a\u3044\uff01',
    treasureResult: '\u3042\u306a\u305f\u304c\u5b88\u308a\u305f\u304b\u3063\u305f\u300c{word}\u300d\u3092\u3001\u5b88\u308a\u307e\u3057\u305f\u3002',
    placedLetterBreak: '\u7f6e\u3044\u305f\u6587\u5b57\u3092\u5d29\u3057\u305f\uff01',
    playerDamage: '\u30c0\u30e1\u30fc\u30b8\uff01\u76fe\u3067\u9632\u3054\u3046\uff01',
    gameOverTitle: 'GAME OVER',
    retry: '\u3082\u3046\u4e00\u56de',
    gameOverCritical: '\u5408\u8a00\u8449\u306e\u6587\u5b57\u304c\u5931\u308f\u308c\u305f\u3002',
    gameOverLife: '\u30e9\u30a4\u30d5\u304c\u306a\u304f\u306a\u3063\u305f\u3002',
    gameOverHint: '\u4f55\u5ea6\u3067\u3082\u6311\u6226\u3067\u304d\u308b\u3002\u6587\u5b57\u3092\u5b88\u3063\u3066\u3001\u3082\u3046\u4e00\u5ea6\uff01',
    goalBlocked: '\u5b88\u308b\u6587\u5b57\u3092\u5931\u3063\u305f\u306e\u3067\u30af\u30ea\u30a2\u3067\u304d\u306a\u3044\uff01',
    missileParry: '\u30df\u30b5\u30a4\u30eb\u3092\u5f3e\u304d\u8fd4\u3057\u305f\uff01',
    bossMissileWarn: '\u4e2d\u30dc\u30b9\u304c\u30df\u30b5\u30a4\u30eb\u3092\u69cb\u3048\u305f\uff01',
    shieldHint: 'Shift\u3067\u76fe\uff01\u30df\u30b5\u30a4\u30eb\u3092\u53d7\u3051\u6b62\u3081\u308b\uff01',
    returnRoute: '\u4e0a\u3078\u623b\u308b',
    returnRouteHint: '\u4e0a\u306e\u6bb5\u3078\u623b\u3063\u305f\uff01',
    lockOn: '\u30ed\u30c3\u30af\u30aa\u30f3\uff01',
    lockHint: 'T / Tab\u3067\u6575\u3092\u30ed\u30c3\u30af\u30aa\u30f3\uff01',
    lockLost: '\u30ed\u30c3\u30af\u304c\u5916\u308c\u305f\uff01',
    noEnemy: '\u72d9\u3046\u6575\u304c\u3044\u306a\u3044\uff01',
    noFootWord: '\u8db3\u5143\u306b\u6295\u3052\u308b\u6587\u5b57\u304c\u306a\u3044\uff01',
    wordHold: '\u8db3\u5143\u306e\u6587\u5b57\u3092\u6301\u3063\u305f\uff01',
    wordThrow: '\u8a00\u8449\u3092\u6295\u3052\u305f\uff01',
    actionFallback: '\u3053\u3053\u3082\u52d5\u304f',
    actionHop: '\u3059\u3053\u3057\u9003\u3052\u305f\uff01',
    accordionOpen: '\u4ed5\u639b\u3051\u304c\u958b\u3044\u305f\uff01',
    accordionClose: '\u4ed5\u639b\u3051\u304c\u9589\u3058\u305f\uff01',
    brighten: '\u5c11\u3057\u30da\u30fc\u30b8\u304c\u660e\u308b\u304f\u306a\u3063\u305f\uff01',
    runnerBreak: '\u30c9\u30c3\u30c8\u306e\u5b50\u304c\u6587\u5b57\u3092\u304f\u3060\u3044\u305f\uff01',
    playerHint: 'Space/W/\u2191\u3067\u30b8\u30e3\u30f3\u30d7\u3001J/Z\u3067\u653b\u6483\u3001K/X\u3067\u6295\u3052/\u5b88\u308b\u3001L/Shift\u3067\u76fe\uff01',
    miss: '\u7a7a\u3092\u305f\u305f\u3044\u305f\uff01',
    chargeReady: '\u529b\u304c\u305f\u307e\u3063\u305f\uff01',
    chargeFull: '\u5927\u632f\u308a\u306e\u4e00\u6483\uff01',
    missionTitle: 'QUEST BOARD',
    missionReachGoal: '\u30da\u30fc\u30b8\u4e0b\u90e8\u306eGOAL\u30b2\u30fc\u30c8\u3078',
    missionProtect: '\u6575\u304b\u3089\u6587\u5b57\u3092\u5b88\u308b',
    goalReady: '\u30b4\u30fc\u30eb\u30b2\u30fc\u30c8\u304c\u958b\u3044\u305f\uff01',
    goalGate: 'GOAL',
    goalNext: '\u6b21\u306e\u30da\u30fc\u30b8\u3078',
    goalEnd: '\u30a8\u30f3\u30c9\u30ed\u30fc\u30eb',
    stageClear: '\u30b9\u30c6\u30fc\u30b8\u30af\u30ea\u30a2\uff01',
    stageClearBurst: '\u30af\u30ea\u30a2\uff01\u6575\u304c\u3071\u3063\u3068\u5f3e\u3051\u305f\uff01',
    protectedLabel: '\u5b88\u3063\u305f',
    brokenLabel: '\u5d29\u3057\u305f',
    lostLabel: '\u524a\u3089\u308c\u305f',
    defeatedLabel: '\u6483\u9000',
    progressLabel: '\u9032\u884c',
    summaryTitle: '\u30da\u30fc\u30b8\u306e\u8981\u7d04',
    endRollTitle: '\u30da\u30fc\u30b8\u306e\u8a18\u61b6',
    endRollClose: '\u623b\u308b',
    rewardTitle: '\u30af\u30ea\u30a2\u7279\u5178',
    rewardLoading: '\u7279\u5178\u3092\u958b\u3044\u3066\u3044\u307e\u3059...',
    rewardUnavailable: '\u7279\u5178\u306f\u307e\u3060\u958b\u3051\u307e\u305b\u3093\u3002',
    rewardCoupon: '\u30af\u30fc\u30dd\u30f3\u30b3\u30fc\u30c9',
    rewardLink: '\u7279\u5178\u30da\u30fc\u30b8\u3078',
    enemyDamage: '\u5b88\u308b\u6587\u5b57\u304c\u524a\u3089\u308c\u305f\uff01',
    bgmOn: 'BGM',
    bgmOff: 'BGM',
    controlsToggle: 'CTRL',
    mapToggle: 'MAP',
    controlsClose: '\u9589\u3058\u308b',
    controlGuideTitle: 'QUICK MENU',
    controlGuideKeys: 'CTRL\u3067\u64cd\u4f5c\u8868\u793a / J\u653b\u6483 K\u30fbX\u6587\u5b57 Space\u30b8\u30e3\u30f3\u30d7 L\u76fe',
    controlGuidePad: '\u30b2\u30fc\u30e0\u30d1\u30c3\u30c9\u3082OK',
    introTitle: '\u30da\u30fc\u30b8\u3092\u8db3\u5834\u306b\u3057\u3066\u9032\u3082\u3046',
    introLead: '\u6587\u5b57\u306b\u7740\u5730\u3057\u3066\u3001\u753b\u50cf\u3084\u30dc\u30bf\u30f3\u3092\u6e21\u308a\u306a\u304c\u3089\u4e0b\u3078\u3002\u5b9d\u7bb1\u30923\u3064\u958b\u3051\u308b\u3068GOAL\u304c\u8fd1\u3065\u304d\u307e\u3059\u3002',
    introKeys: 'J: \u653b\u6483 / K\u30fbX: \u6587\u5b57\u3092\u6301\u3064\u30fb\u6295\u3052\u308b / L: \u76fe / Space: \u30b8\u30e3\u30f3\u30d7',
    introPad: '\u30b2\u30fc\u30e0\u30d1\u30c3\u30c9\u3082\u4f7f\u3048\u307e\u3059',
    introStart: 'START',
    introDrop: '\u4e0a\u304b\u3089\u3044\u304f\u3088\uff01',
    chestAppear: '\u5b9d\u7bb1\u304c\u304d\u3089\u3063\u3068\u73fe\u308c\u305f\uff01',
    chestOpen: '\u5b9d\u7bb1\u304c\u958b\u3044\u305f\uff01',
    chestReady: '\u5b9d\u7bb1\u304c3\u3064\u305d\u308d\u3063\u305f\uff01GOAL\u3078\uff01',
    itemHeal: '\u30cf\u30fc\u30c8\u304c\u56de\u5fa9\uff01',
    itemShield: '\u3057\u3070\u3089\u304f\u76fe\u304c\u5f37\u304f\u306a\u3063\u305f\uff01',
    itemHammer: '\u30cf\u30f3\u30de\u30fc\u304c\u5f37\u304f\u306a\u3063\u305f\uff01',
    itemHint: '\u5b88\u308b\u6587\u5b57\u306e\u30d2\u30f3\u30c8\u300c{char}\u300d\u304c\u5149\u3063\u305f\uff01',
    itemJewel: '\u30b9\u30b3\u30a2\u30b8\u30e5\u30a8\u30eb +1\uff01',
};

const UI_TEXT = localizedUiText(UI_TEXT_EN, {
    ja: UI_TEXT_JA,
});

const RUNNER_WIDTH = 52;
const RUNNER_HEIGHT = 58;
const RUNNER_FOOT_WIDTH = 48;
const ENEMY_WIDTH = 44;
const ENEMY_HEIGHT = 42;
const BOSS_WIDTH = 78;
const BOSS_HEIGHT = 70;
const WORD_THROW_SIZE = 24;
const WORD_THROW_HITBOX = 40;
const WORD_THROW_SPEED = 960;
const WORD_THROW_LIFETIME = 1500;
const CHARGE_READY_MS = 520;
const CHARGE_FULL_MS = 1180;
const CHARGE_MAX_MS = 1500;
const GOAL_REVEAL_PROGRESS = 0.92;
const ROOM_HEIGHT_RATIO = 0.85;
const ROOM_OVERLAP_PX = 160;
const ROOM_MIN_HEIGHT = 360;
const ROOM_DROP_MARGIN = 42;
const ROOM_TRANSITION_MIN_MS = 540;
const ROOM_TRANSITION_MAX_MS = 980;
const ROOM_DROP_NEXT_MIN_AHEAD_PX = 420;
const ROOM_DROP_TARGET_MIN_Y = 220;
const ROOM_DROP_TARGET_MAX_BOTTOM_GAP = 210;
const ROOM_DROP_LANDING_SEARCH_PX = 520;
const ROOM_SCREEN_DROP_GATE_GAP = 86;
const ROOM_TEXT_LINE_TOLERANCE = 8;
const ROOM_TEXT_BRIDGE_GAP_CHARS = 2.8;
const CAMERA_FOLLOW_START_RATIO = 0.78;
const CAMERA_FOLLOW_TARGET_RATIO = 0.7;
const CAMERA_FOLLOW_MAX_SPEED = 1180;
const CAMERA_FOLLOW_SPRING = 3.1;
const CAMERA_FOLLOW_EASE = 8.2;
const LINK_GATE_DWELL_MS = 980;
const LINK_GATE_STILL_SPEED = 54;
const LINK_GATE_MAX_VERTICAL_SPEED = 90;
const CHEST_WIDTH = 48;
const CHEST_HEIGHT = 38;
const CHEST_REVEAL_PROGRESS = 0.18;
const CHEST_MIN_INTERVAL = 8500;
const CHEST_MAX_INTERVAL = 14500;
const CHEST_ITEM_TYPES = ['heal', 'shield', 'hammer', 'hint', 'jewel'];
const ITEM_EFFECT_DURATION_MS = 12000;
const HUD_GATE_SAFE_MARGIN = 12;
const ENEMY_MISSILE_SPEED = 270;
const ENEMY_MISSILE_LIFETIME = 3600;
const RETURN_ROUTE_REVEAL_PROGRESS = 0.58;
const PLAYER_MAX_LIFE = 3;
const GOAL_REQUIRED_LETTERS = 3;
const GOAL_REQUIRED_CHESTS = 3;
const THROW_HOLD_MS = 400;
const TREASURE_STORE_DELAY_MS = 3000;
const BOSS_MISSILE_WARNING_MS = 560;
const BOSS_MISSILE_MIN_INTERVAL = 7000;
const BOSS_MISSILE_MAX_INTERVAL = 11000;
const INTRO_SEEN_KEY = 'gaming_web_intro_seen_v1';
const INTRO_DROP_START_Y = -92;
const RUNNER_CONTROL_DEFS = [
    { control: 'left', label: '\u2190', keys: 'A / \u2190' },
    { control: 'jump', label: '\u2191', keys: 'Space/W/\u2191' },
    { control: 'right', label: '\u2192', keys: 'D / \u2192' },
    { control: 'shield', label: '\u76fe', keys: 'L/Shift' },
    { control: 'lock', label: '\u30ed\u30c3\u30af', keys: 'T / Tab' },
    { control: 'throw', label: '\u6295\u3052/\u5b88\u308b', keys: 'K/X\u9577\u62bc\u3057' },
    { control: 'attack', label: '\u653b\u6483', keys: 'J/Z' },
];

export class StageOverlay {
    constructor(options = {}) {
        this.characterName = options.characterName || UI_TEXT.defaultCharacter;
        this.messages = options.messages || {};
        this.importantWords = Array.isArray(options.importantWords) ? options.importantWords : [];
        this.hasReward = Boolean(options.hasReward);
        this.visualStyle = normalizeVisualStyle(options.visualStyle || 'auto');
        this.themeTokens = normalizeThemeTokens(options.themeTokens || {});
        this.reducedMotion = Boolean(options.reducedMotion);
        this.onExit = options.onExit || (() => {});
        this.onRetry = options.onRetry || (() => {});
        this.onInventoryOpen = options.onInventoryOpen || (() => {});
        this.onBgmToggle = options.onBgmToggle || (() => {});
        this.onStageClear = options.onStageClear || (() => {});
        this.onTreasureCollect = options.onTreasureCollect || (() => {});
        this.onWorldMapOpen = options.onWorldMapOpen || (() => {});
        this.onNavigate = options.onNavigate || ((href) => {
            window.location.href = href;
        });
        this.onRunnerSound = options.onRunnerSound || (() => {});
        this.bgmEnabled = Boolean(options.bgmEnabled);
        this.worldMapEnabled = Boolean(options.worldMapEnabled);
        this.worldMapAfterClear = Boolean(options.worldMapAfterClear);
        this.textBreaker = options.textBreaker || null;
        this.imageBreaker = options.imageBreaker || null;
        this.root = null;
        this.effectLayer = null;
        this.speech = null;
        this.inventoryList = null;
        this.inventoryToggle = null;
        this.bgmToggle = null;
        this.worldMapToggle = null;
        this.inventoryPanel = null;
        this.missionHud = null;
        this.missionGoal = null;
        this.missionTreasure = null;
        this.missionProgress = null;
        this.missionStats = null;
        this.goalGate = null;
        this.gameOverPanel = null;
        this.endRoll = null;
        this.clearRewardPromise = null;
        this.runner = null;
        this.runnerRaf = 0;
        this.runnerTargets = [];
        this.runnerState = null;
        this.runnerOnHit = null;
        this.runnerControls = null;
        this.runnerControlsToggle = null;
        this.controlGuide = null;
        this.introModal = null;
        this.runnerInputBound = false;
        this.controlsVisible = false;
        this.runnerOnImageHit = null;
        this.runnerOnGateHit = null;
        this.runnerOnEnemyHit = null;
        this.runnerKeys = new Set();
        this.runnerGamepadKeys = new Set();
        this.runnerGamepadButtons = new Set();
        this.runnerLastTime = 0;
        this.runnerScrollFollowUntil = 0;
        this.cameraScrollVelocity = 0;
        this.previousRootScrollBehavior = '';
        this.rooms = [];
        this.roomIndex = 0;
        this.roomCollisionCache = null;
        this.roomTransition = null;
        this.lastAttackTapAt = 0;
        this.attackCharge = null;
        this.throwHold = null;
        this.treasureStoreTimer = 0;
        this.treasureStoreHeldId = '';
        this.stageStats = createStageStats();
        this.lastMissionUpdateAt = 0;
        this.stageCleared = false;
        this.stageFailed = false;
        this.playerLife = PLAYER_MAX_LIFE;
        this.criticalWord = '';
        this.criticalWordLost = false;
        this.goalRevealed = false;
        this.nextGoalHref = '';
        this.endRollItems = [];
        this.endRollSummary = '';
        this.brickLayer = null;
        this.gateLayer = null;
        this.linkGates = [];
        this.gateCooldownUntil = 0;
        this.linkGateCharge = null;
        this.linkGateGauge = null;
        this.enemyLayer = null;
        this.enemies = [];
        this.enemySequence = 0;
        this.enemyMissiles = [];
        this.enemyMissileSequence = 0;
        this.enemyWaveStarted = false;
        this.bossSpawned = false;
        this.lastEnemySpawnAt = 0;
        this.projectileLayer = null;
        this.projectiles = [];
        this.chestLayer = null;
        this.chests = [];
        this.chestSequence = 0;
        this.nextChestAt = 0;
        this.itemEffects = createItemEffects();
        this.scoreJewels = 0;
        this.lockedEnemyId = null;
        this.lockedEnemyManual = false;
        this.heldLetter = null;
        this.heldLetterSequence = 0;
        this.placedLetters = [];
        this.missionTreasure = null;
        this.treasureLetters = [];
        this.returnRoute = null;
        this.returnRouteCooldownUntil = 0;
        this.playBounds = null;
        this.handleViewportResize = this.handleViewportResize.bind(this);
        this.handleWindowScroll = this.handleWindowScroll.bind(this);
        this.handleGameWheel = this.handleGameWheel.bind(this);
        this.handleGameTouchMove = this.handleGameTouchMove.bind(this);
        this.handleRunnerKeyDown = this.handleRunnerKeyDown.bind(this);
        this.handleRunnerKeyUp = this.handleRunnerKeyUp.bind(this);
        this.timers = new Set();
    }

    mount() {
        this.root = document.createElement('div');
        this.root.className = `gw-stage${this.reducedMotion ? ' gw-stage--reduced' : ''}`;
        this.root.setAttribute('data-gaming-web-stage', 'active');
        this.root.dataset.gwVisualStyle = this.visualStyle;
        applyThemeTokens(this.root, this.themeTokens);

        this.effectLayer = document.createElement('div');
        this.effectLayer.className = 'gw-effect-layer';
        this.effectLayer.setAttribute('aria-hidden', 'true');

        const controls = document.createElement('div');
        controls.className = 'gw-controls';

        this.runnerControlsToggle = document.createElement('button');
        this.runnerControlsToggle.type = 'button';
        this.runnerControlsToggle.className = 'gw-controls-toggle';
        this.runnerControlsToggle.textContent = UI_TEXT.controlsToggle;
        this.runnerControlsToggle.setAttribute('aria-pressed', 'false');
        this.runnerControlsToggle.addEventListener('click', (event) => {
            event.preventDefault();
            this.toggleRunnerControls();
        });

        const exitButton = document.createElement('button');
        exitButton.type = 'button';
        exitButton.className = 'gw-exit-button';
        exitButton.textContent = UI_TEXT.exit;
        exitButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.onExit();
        });

        this.inventoryToggle = document.createElement('button');
        this.inventoryToggle.type = 'button';
        this.inventoryToggle.className = 'gw-inventory-toggle';
        this.inventoryToggle.textContent = `${UI_TEXT.inventoryPrefix} 0`;
        this.inventoryToggle.addEventListener('click', (event) => {
            event.preventDefault();
            this.toggleInventory();
        });

        this.bgmToggle = document.createElement('button');
        this.bgmToggle.type = 'button';
        this.bgmToggle.className = 'gw-bgm-toggle';
        this.setBgmEnabled(this.bgmEnabled);
        this.bgmToggle.addEventListener('click', (event) => {
            event.preventDefault();
            this.onBgmToggle(!this.bgmEnabled);
        });

        this.worldMapToggle = document.createElement('button');
        this.worldMapToggle.type = 'button';
        this.worldMapToggle.className = 'gw-world-map-toggle';
        this.worldMapToggle.textContent = UI_TEXT.mapToggle;
        this.worldMapToggle.hidden = !this.worldMapEnabled;
        this.worldMapToggle.addEventListener('click', (event) => {
            event.preventDefault();
            this.onWorldMapOpen();
        });

        this.inventoryPanel = document.createElement('div');
        this.inventoryPanel.className = 'gw-inventory-panel';
        this.inventoryPanel.hidden = true;

        const inventoryTitle = document.createElement('div');
        inventoryTitle.className = 'gw-inventory-title';
        inventoryTitle.textContent = UI_TEXT.inventoryTitle;

        this.inventoryList = document.createElement('ul');
        this.inventoryList.className = 'gw-inventory-list';

        this.inventoryPanel.append(inventoryTitle, this.inventoryList);
        controls.append(this.runnerControlsToggle, this.worldMapToggle, this.inventoryToggle, this.bgmToggle, exitButton, this.inventoryPanel);

        this.speech = document.createElement('div');
        this.speech.className = 'gw-speech';
        this.speech.setAttribute('aria-live', 'polite');

        this.root.append(this.effectLayer, controls, this.speech);
        document.body.appendChild(this.root);

        this.mountMissionHud();
        this.setInventory([]);
        this.showMessage(this.messages.start || UI_TEXT.start);
    }

    destroy() {
        this.stopRunner();

        for (const timer of this.timers) {
            window.clearTimeout(timer);
        }

        this.timers.clear();
        this.root?.remove();
        this.root = null;
        this.effectLayer = null;
        this.chestLayer = null;
        this.worldMapToggle = null;
        this.missionHud = null;
        this.missionGoal = null;
        this.missionTreasure = null;
        this.missionProgress = null;
        this.missionStats = null;
        this.runnerControlsToggle = null;
        this.controlGuide = null;
        this.introModal = null;
        this.goalGate = null;
        this.gameOverPanel = null;
        this.endRoll = null;
        document.body.classList.remove('gw-screen-shake', 'gw-screen-shake--soft', 'gw-screen-shake--medium', 'gw-screen-shake--hard');
    }

    owns(node) {
        return Boolean(this.root && node instanceof Node && this.root.contains(node));
    }

    showMessage(message, duration = 2600) {
        if (!this.speech) {
            return;
        }

        this.speech.textContent = message;
        this.speech.classList.add('gw-speech--visible');

        const timer = window.setTimeout(() => {
            this.speech?.classList.remove('gw-speech--visible');
            this.timers.delete(timer);
        }, duration);

        this.timers.add(timer);
    }

    setInventory(words) {
        if (!this.inventoryList || !this.inventoryToggle) {
            return;
        }

        this.inventoryToggle.textContent = `${UI_TEXT.inventoryPrefix} ${words.length}`;
        this.inventoryList.replaceChildren();

        if (words.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'gw-inventory-empty';
            empty.textContent = UI_TEXT.emptyInventory;
            this.inventoryList.appendChild(empty);
            return;
        }

        for (const word of words) {
            const item = document.createElement('li');
            item.textContent = word;
            this.inventoryList.appendChild(item);
        }
    }

    toggleInventory() {
        if (!this.inventoryPanel) {
            return;
        }

        this.inventoryPanel.hidden = !this.inventoryPanel.hidden;

        if (!this.inventoryPanel.hidden) {
            this.onInventoryOpen();
        }
    }

    setBgmEnabled(enabled) {
        this.bgmEnabled = Boolean(enabled);

        if (!this.bgmToggle) {
            return;
        }

        this.bgmToggle.textContent = this.bgmEnabled ? UI_TEXT.bgmOn : UI_TEXT.bgmOff;
        this.bgmToggle.setAttribute('aria-pressed', this.bgmEnabled ? 'true' : 'false');
        this.bgmToggle.classList.toggle('gw-bgm-toggle--on', this.bgmEnabled);
    }

    mountMissionHud() {
        this.missionHud?.remove();
        this.missionHud = document.createElement('aside');
        this.missionHud.className = 'gw-mission-hud';
        this.missionHud.setAttribute('aria-live', 'polite');
        this.missionHud.innerHTML = `
            <div class="gw-mission-hud__bar"><span></span></div>
            <div class="gw-mission-hud__goal"></div>
            <div class="gw-mission-hud__treasure"></div>
            <dl class="gw-mission-hud__stats"></dl>
        `;
        this.missionGoal = this.missionHud.querySelector('.gw-mission-hud__goal');
        this.missionTreasure = this.missionHud.querySelector('.gw-mission-hud__treasure');
        this.missionProgress = this.missionHud.querySelector('.gw-mission-hud__bar span');
        this.missionStats = this.missionHud.querySelector('.gw-mission-hud__stats');
        this.root?.appendChild(this.missionHud);
        this.updateMissionHud(true);
    }

    updateMissionHud(force = false) {
        if (!this.missionHud) {
            return;
        }

        const now = currentTime();
        if (!force && now - this.lastMissionUpdateAt < 180) {
            return;
        }

        this.lastMissionUpdateAt = now;
        const progress = Math.round(pageScrollProgress() * 100);
        const protectedCount = this.protectedCharCount();

        if (this.missionGoal) {
            if (this.stageFailed) {
                this.missionGoal.textContent = this.criticalWordLost ? UI_TEXT.stageFailed : UI_TEXT.gameOverLife;
            } else {
                const critical = this.criticalWord
                    ? ` / ${UI_TEXT.criticalGuard}\u300c${this.criticalWord}\u300d`
                    : '';
                const opened = this.openedChestCount();
                const collection = this.hasGoalChests()
                    ? UI_TEXT.goalReadyWithChests
                    : `${UI_TEXT.collectMission} (${Math.min(opened, GOAL_REQUIRED_CHESTS)}/${GOAL_REQUIRED_CHESTS})`;
                this.missionGoal.textContent = this.goalRevealed
                    ? `${collection}${critical}`
                    : `${collection} / ${UI_TEXT.missionProtect}${critical}`;
            }
        }

        if (this.missionProgress) {
            this.missionProgress.style.width = `${progress}%`;
        }

        if (this.missionTreasure) {
            const letters = this.normalizedTreasureLetters();
            const letterLabel = letters.length
                ? letters.join('\u30fb')
                : UI_TEXT.treasureEmpty;
            this.missionTreasure.innerHTML = `
                <strong>${UI_TEXT.treasureTitle}</strong>
                <span>${escapeHtml(letterLabel)}</span>
            `;
        }

        if (this.missionStats) {
            this.missionStats.innerHTML = `
                <div><dt>${UI_TEXT.lifeLabel}</dt><dd class="gw-life-hearts" aria-label="${this.playerLife} / ${PLAYER_MAX_LIFE}">${renderLifeHearts(this.playerLife)}</dd></div>
                <div><dt>${UI_TEXT.progressLabel}</dt><dd>${progress}</dd></div>
                <div><dt>${UI_TEXT.protectedLabel}</dt><dd>${protectedCount}</dd></div>
                <div><dt>${UI_TEXT.brokenLabel}</dt><dd>${this.stageStats.playerBroken}</dd></div>
                <div><dt>${UI_TEXT.defeatedLabel}</dt><dd>${this.stageStats.enemiesDefeated}</dd></div>
            `;
        }
    }

    protectedCharCount() {
        return Math.max(0, this.stageStats.totalChars - this.stageStats.enemyBroken);
    }

    collectedLetterCount() {
        return this.normalizedTreasureLetters().length;
    }

    openedChestCount() {
        return Math.max(0, this.stageStats.chestsOpened || 0);
    }

    hasGoalChests() {
        return this.openedChestCount() >= GOAL_REQUIRED_CHESTS;
    }

    treasureWord() {
        return this.normalizedTreasureLetters().join('');
    }

    treasureLettersLabel() {
        const letters = this.normalizedTreasureLetters();
        if (letters.length === 0) {
            return UI_TEXT.treasureEmpty;
        }

        return letters.join('\u30fb');
    }

    normalizedTreasureLetters() {
        return this.treasureLetters
            .flatMap((letter) => treasureCharsFrom(letter));
    }

    bumpStageStat(key, amount = 1) {
        if (!Number.isFinite(amount) || amount <= 0 || !(key in this.stageStats)) {
            return;
        }

        this.stageStats[key] += amount;
        this.updateMissionHud(true);
    }

    startRunner(targets, onHit, onTextBreak, onImageHit, onGateHit, onEnemyHit) {
        this.runnerTargets = targets
            .filter((target) => ['heading', 'paragraph', 'action', 'accordion', 'image', 'icon', 'platform'].includes(target.type))
            .filter((target) => isPlayableContentElement(target.element));
        this.runnerOnHit = onHit;
        this.runnerOnTextBreak = onTextBreak || (() => {});
        this.runnerOnImageHit = onImageHit || (() => {});
        this.runnerOnGateHit = onGateHit || (() => {});
        this.runnerOnEnemyHit = onEnemyHit || (() => {});
        this.playBounds = this.calculatePlayBounds();
        this.rooms = this.buildRooms();
        this.roomIndex = this.findRoomIndexForDocY(window.scrollY);
        this.roomCollisionCache = null;
        this.roomTransition = null;
        this.stageStats = createStageStats(this.textBreaker?.countTotalChars?.() || 0);
        this.treasureLetters = [];
        this.chests = [];
        this.chestSequence = 0;
        this.nextChestAt = currentTime() + randomBetween(3600, 6400);
        this.itemEffects = createItemEffects();
        this.scoreJewels = 0;
        this.root?.classList.remove('gw-stage--shield-boost', 'gw-stage--hammer-boost');
        this.endRollItems = this.buildEndRollItems(targets);
        this.endRollSummary = this.buildPageSummary(targets);
        const critical = this.textBreaker?.markImportantChars?.([this.buildCriticalWord(targets)]);
        this.criticalWord = critical?.count > 0 ? critical.word : '';
        this.criticalWordLost = false;
        this.nextGoalHref = '';
        this.stageCleared = false;
        this.stageFailed = false;
        this.playerLife = PLAYER_MAX_LIFE;
        this.goalRevealed = false;
        this.updateMissionHud(true);

        if (!this.effectLayer) {
            return;
        }

        this.mountBrickRails();
        this.mountLinkGates(targets);
        this.mountEnemyLayer();
        this.mountProjectileLayer();
        this.mountChestLayer();
        this.mountGoalGate();
        this.mountReturnRoute();
        this.runner = document.createElement('div');
        this.runner.className = 'gw-pixel-runner';
        this.runner.innerHTML = `
            <div class="gw-pixel-runner__sprite">
                <span class="gw-pixel-runner__pack"></span>
                <span class="gw-pixel-runner__head"></span>
                <span class="gw-pixel-runner__hair"></span>
                <span class="gw-pixel-runner__brow"></span>
                <span class="gw-pixel-runner__eye gw-pixel-runner__eye--left"></span>
                <span class="gw-pixel-runner__eye gw-pixel-runner__eye--right"></span>
                <span class="gw-pixel-runner__nose"></span>
                <span class="gw-pixel-runner__mouth"></span>
                <span class="gw-pixel-runner__body"></span>
                <span class="gw-pixel-runner__scarf"></span>
                <span class="gw-pixel-runner__belt"></span>
                <span class="gw-pixel-runner__arm gw-pixel-runner__arm--front"></span>
                <span class="gw-pixel-runner__arm gw-pixel-runner__arm--back"></span>
                <span class="gw-pixel-runner__leg gw-pixel-runner__leg--front"></span>
                <span class="gw-pixel-runner__leg gw-pixel-runner__leg--back"></span>
                <span class="gw-pixel-runner__boot gw-pixel-runner__boot--front"></span>
                <span class="gw-pixel-runner__boot gw-pixel-runner__boot--back"></span>
                <span class="gw-pixel-runner__hammer"></span>
            </div>
            <span class="gw-pixel-runner__facing"></span>
        `;
        this.effectLayer.appendChild(this.runner);
        const initialRect = this.initialRunnerRect();
        const initialDocX = typeof initialRect.docX === 'number' ? initialRect.docX : initialRect.x + window.scrollX;
        const initialDocY = typeof initialRect.docY === 'number' ? initialRect.docY : initialRect.y + window.scrollY;

        this.runnerState = {
            x: initialRect.x,
            y: initialRect.y,
            docX: initialDocX,
            docY: initialDocY,
            vx: 0,
            vy: Number.isFinite(initialRect.vy) ? initialRect.vy : 0,
            direction: 1,
            grounded: Boolean(initialRect.grounded),
            attackLockedUntil: 0,
            lastDustAt: 0,
            lastFallTrailAt: 0,
            lastLandAt: 0,
            fallStartY: initialDocY,
            fallSoundPlayed: false,
            scrollPinned: false,
            roomIndex: this.findRoomIndexForDocY(initialDocY + RUNNER_HEIGHT),
            cameraMode: 'room',
            transitioning: false,
            cachedPlatforms: null,
        };
        this.roomIndex = this.runnerState.roomIndex;
        this.rebuildRoomCollisionCache();
        this.cameraScrollVelocity = 0;
        this.previousRootScrollBehavior = document.documentElement.style.scrollBehavior || '';
        document.documentElement.style.scrollBehavior = 'auto';

        this.gateCooldownUntil = currentTime() + 1200;
        this.lastEnemySpawnAt = currentTime();

        this.mountRunnerControls();
        this.setRunnerControlsVisible(false);
        window.addEventListener('resize', this.handleViewportResize);
        window.addEventListener('scroll', this.handleWindowScroll, { passive: true });
        window.addEventListener('wheel', this.handleGameWheel, { passive: false, capture: true });
        window.addEventListener('touchmove', this.handleGameTouchMove, { passive: false, capture: true });
        this.renderRunner();

        if (this.shouldShowIntroModal()) {
            this.runner.classList.add('gw-pixel-runner--intro-wait');
            this.showIntroModal(() => {
                this.markIntroSeen();
                this.beginRunnerPlay({ showGuide: false, fromIntro: true });
            });
            return;
        }

        this.beginRunnerPlay({ showGuide: true });
    }

    initialRunnerRect() {
        const target = this.initialRunnerTarget();
        const bounds = this.currentPlayBounds();

        if (!target) {
            const x = this.initialRunnerX(bounds);
            const y = this.initialRunnerDropY();
            return {
                x,
                y,
                docX: x + window.scrollX,
                docY: y + window.scrollY,
                grounded: false,
                vy: this.reducedMotion ? 0 : 70,
            };
        }

        const rect = liveRectForTarget(target);
        const x = this.initialRunnerX(bounds, rect);
        const y = this.initialRunnerDropY(rect);

        return {
            x,
            y,
            docX: x + window.scrollX,
            docY: y + window.scrollY,
            grounded: false,
            vy: this.reducedMotion ? 0 : 70,
        };
    }

    initialRunnerDropY(targetRect = null) {
        if (!this.reducedMotion) {
            return INTRO_DROP_START_Y;
        }

        const targetTop = targetRect?.top || runnerGroundY();
        return clamp(
            Math.min(46, targetTop - RUNNER_HEIGHT - 18),
            24,
            Math.max(28, runnerGroundY() - RUNNER_HEIGHT - 12)
        );
    }

    initialRunnerX(bounds = this.currentPlayBounds(), targetRect = null) {
        if (targetRect && targetRect.width > 18) {
            const targetCenter = targetRect.width > 140
                ? targetRect.left + Math.min(84, Math.max(34, targetRect.width * 0.12))
                : targetRect.left + targetRect.width / 2;
            return clamp(targetCenter - RUNNER_WIDTH / 2, bounds.left, bounds.right - RUNNER_WIDTH);
        }

        const leftInset = window.innerWidth < 640 ? 28 : 72;
        const preferred = Math.max(bounds.left + 72, leftInset);
        return clamp(preferred, bounds.left, bounds.right - RUNNER_WIDTH);
    }

    initialRunnerTarget() {
        const candidates = this.visibleRunnerTargets()
            .filter((target) => ['heading', 'paragraph'].includes(target.type))
            .filter((target) => normalizeText(target.text || target.element?.textContent || '').length > 0)
            .map((target) => ({
                target,
                rect: liveRectForTarget(target),
                priority: initialRunnerTargetPriority(target),
            }))
            .filter((candidate) => candidate.rect.width > 16 && candidate.rect.height > 8);

        candidates.sort((a, b) => (
            b.priority - a.priority
            || a.rect.top - b.rect.top
            || a.rect.left - b.rect.left
        ));

        return candidates[0]?.target || null;
    }

    shouldShowIntroModal() {
        return !localStorageFlag(INTRO_SEEN_KEY);
    }

    markIntroSeen() {
        setLocalStorageFlag(INTRO_SEEN_KEY);
    }

    showIntroModal(onStart) {
        this.introModal?.remove();
        this.introModal = document.createElement('div');
        this.introModal.className = 'gw-intro-modal';
        this.introModal.setAttribute('role', 'dialog');
        this.introModal.setAttribute('aria-modal', 'true');
        this.introModal.setAttribute('aria-labelledby', 'gw-intro-title');
        this.introModal.innerHTML = `
            <div class="gw-intro-modal__panel">
                <span class="gw-intro-modal__badge">MISSION START</span>
                <h2 id="gw-intro-title">${UI_TEXT.introTitle}</h2>
                <p>${UI_TEXT.introLead}</p>
                <div class="gw-intro-modal__keys">${UI_TEXT.introKeys}</div>
                <small>${UI_TEXT.introPad}</small>
                <button type="button" class="gw-intro-modal__start" data-gw-intro-start>${UI_TEXT.introStart}</button>
            </div>
        `;
        this.root?.appendChild(this.introModal);

        const startButton = this.introModal.querySelector('[data-gw-intro-start]');
        const start = (event) => {
            event?.preventDefault?.();
            if (!this.introModal) {
                return;
            }

            if (startButton) {
                startButton.disabled = true;
            }
            this.introModal.classList.add('gw-intro-modal--leaving');
            this.onRunnerSound('uiMove', { volume: 0.11, rate: 1.04 });
            const timer = window.setTimeout(() => {
                this.introModal?.remove();
                this.introModal = null;
                this.timers.delete(timer);
                onStart?.();
            }, this.reducedMotion ? 20 : 160);
            this.timers.add(timer);
        };

        startButton?.addEventListener('click', start);

        const focusTimer = window.setTimeout(() => {
            startButton?.focus?.({ preventScroll: true });
            this.timers.delete(focusTimer);
        }, 40);
        this.timers.add(focusTimer);
    }

    beginRunnerPlay(options = {}) {
        if (!this.runner || !this.runnerState || this.runnerRaf) {
            return;
        }

        this.runner.classList.remove('gw-pixel-runner--intro-wait');
        this.runner.classList.add('gw-pixel-runner--intro-drop');
        const dropTimer = window.setTimeout(() => {
            this.runner?.classList.remove('gw-pixel-runner--intro-drop');
            this.timers.delete(dropTimer);
        }, this.reducedMotion ? 120 : 920);
        this.timers.add(dropTimer);

        if (!this.runnerInputBound) {
            document.addEventListener('keydown', this.handleRunnerKeyDown, true);
            document.addEventListener('keyup', this.handleRunnerKeyUp, true);
            this.runnerInputBound = true;
        }

        if (options.showGuide) {
            this.showControlGuide();
        }

        this.showMessage(options.fromIntro ? UI_TEXT.introDrop : UI_TEXT.playerHint, options.fromIntro ? 1500 : 1900);
        this.runnerLastTime = 0;
        this.runnerRaf = requestFrame((time) => this.updateRunner(time));
    }

    buildEndRollItems(targets = []) {
        const items = [];

        for (const target of targets) {
            if (!['heading', 'paragraph'].includes(target.type)) {
                continue;
            }

            const text = normalizeText(target.text || target.element?.textContent || '');
            if (!text || items.includes(text)) {
                continue;
            }

            items.push(text.slice(0, target.type === 'heading' ? 42 : 76));
            if (items.length >= 12) {
                break;
            }
        }

        return items;
    }

    buildPageSummary(targets = []) {
        const headings = [];
        const sentences = [];

        for (const target of targets) {
            const text = normalizeText(target.text || target.element?.textContent || '');
            if (!text) {
                continue;
            }

            if (target.type === 'heading' && headings.length < 2 && !headings.includes(text)) {
                headings.push(text.slice(0, 42));
                continue;
            }

            if (target.type !== 'paragraph') {
                continue;
            }

            for (const sentence of splitSummarySentences(text)) {
                if (sentence.length < 12 || sentence.length > 110 || sentences.includes(sentence)) {
                    continue;
                }

                sentences.push(sentence);
                if (sentences.length >= 4) {
                    break;
                }
            }

            if (sentences.length >= 4) {
                break;
            }
        }

        const lines = [];
        const title = headings[0] || normalizeText(document.title || '');
        if (title) {
            lines.push(`\u3053\u306e\u30da\u30fc\u30b8\u306f\u300c${title}\u300d\u3092\u4e2d\u5fc3\u306b\u3057\u305f\u30b9\u30c6\u30fc\u30b8\u3067\u3059\u3002`);
        }

        lines.push(...sentences.slice(0, 3));

        if (lines.length === 0) {
            return normalizeText(document.title || UI_TEXT.endRollTitle);
        }

        return lines.join('\n');
    }

    buildCriticalWord(targets = []) {
        const configured = this.importantWords
            .map((word) => normalizeText(word).replace(/\s+/g, ''))
            .find((word) => Array.from(word).length >= 2);

        if (configured) {
            return Array.from(configured).slice(0, GOAL_REQUIRED_LETTERS).join('');
        }

        const heading = targets.find((target) => target.type === 'heading' && normalizeText(target.text || target.element?.textContent || ''));
        const headingText = normalizeText(heading?.text || heading?.element?.textContent || '').replace(/\s+/g, '');
        if (headingText) {
            return Array.from(headingText).slice(0, GOAL_REQUIRED_LETTERS).join('');
        }

        return '';
    }

    stopRunner() {
        if (this.runnerRaf) {
            cancelFrame(this.runnerRaf);
        }

        this.runnerRaf = 0;
        this.runner?.remove();
        this.unmountRunnerControls();
        document.removeEventListener('keydown', this.handleRunnerKeyDown, true);
        document.removeEventListener('keyup', this.handleRunnerKeyUp, true);
        this.runnerInputBound = false;
        this.introModal?.remove();
        this.introModal = null;
        this.runnerKeys.clear();
        this.runnerGamepadKeys.clear();
        this.runnerGamepadButtons.clear();
        this.clearAttackCharge();
        this.clearThrowHold();
        this.clearTreasureStoreTimer();
        document.documentElement.style.scrollBehavior = this.previousRootScrollBehavior || '';
        this.previousRootScrollBehavior = '';
        window.removeEventListener('resize', this.handleViewportResize);
        window.removeEventListener('scroll', this.handleWindowScroll);
        window.removeEventListener('wheel', this.handleGameWheel, true);
        window.removeEventListener('touchmove', this.handleGameTouchMove, true);
        this.brickLayer?.remove();
        this.brickLayer = null;
        this.gateLayer?.remove();
        this.gateLayer = null;
        this.linkGates = [];
        this.resetLinkGateCharge();
        this.linkGateGauge?.remove();
        this.linkGateGauge = null;
        this.enemyLayer?.remove();
        this.enemyLayer = null;
        this.enemies = [];
        for (const projectile of this.projectiles) {
            projectile.element.remove();
        }

        for (const placed of this.placedLetters) {
            placed.element?.remove();
        }
        this.placedLetters = [];
        this.dropHeldLetter();
        this.projectileLayer?.remove();
        this.projectileLayer = null;
        this.goalGate?.remove();
        this.goalGate = null;
        this.gameOverPanel?.remove();
        this.gameOverPanel = null;
        this.returnRoute?.remove();
        this.returnRoute = null;
        this.treasureLetters = [];
        this.endRoll?.remove();
        this.endRoll = null;
        this.clearRewardPromise = null;
        for (const missile of this.enemyMissiles) {
            missile.element.remove();
        }
        this.projectiles = [];
        this.enemyMissiles = [];
        this.lockedEnemyId = null;
        this.lockedEnemyManual = false;
        this.playBounds = null;
        this.rooms = [];
        this.roomIndex = 0;
        this.roomCollisionCache = null;
        this.roomTransition = null;
        this.cameraScrollVelocity = 0;
        this.stageCleared = false;
        this.stageFailed = false;
        this.playerLife = PLAYER_MAX_LIFE;
        this.criticalWord = '';
        this.criticalWordLost = false;
        this.goalRevealed = false;
        this.nextGoalHref = '';
        this.endRollItems = [];
        this.endRollSummary = '';
        this.runner = null;
        this.runnerState = null;
        this.controlGuide?.remove();
        this.controlGuide = null;
        this.controlsVisible = false;
        this.runnerTargets = [];
        this.runnerOnHit = null;
        this.runnerOnTextBreak = null;
        this.runnerOnImageHit = null;
        this.runnerOnGateHit = null;
        this.runnerOnEnemyHit = null;
        this.lastAttackTapAt = 0;
    }

    handleViewportResize() {
        this.playBounds = this.calculatePlayBounds();
        this.rooms = this.buildRooms();
        if (this.runnerState) {
            this.roomIndex = this.findRoomIndexForDocY(this.runnerState.docY + RUNNER_HEIGHT);
            this.runnerState.roomIndex = this.roomIndex;
            this.rebuildRoomCollisionCache();
        }
        this.updateBrickRails();
        this.updateLinkGates();
        this.updateGoalGate(true);
        this.updateReturnRoute(true);
        this.syncPlacedLettersToScroll();

        if (this.runnerState) {
            const bounds = this.currentPlayBounds();
            this.ensureRunnerDocumentState();
            this.runnerState.docX = clamp(this.runnerState.docX, bounds.left + window.scrollX, bounds.right + window.scrollX - RUNNER_WIDTH);
            this.syncRunnerScreenPosition();
        }
    }

    handleWindowScroll() {
        if (!this.runnerState) {
            return;
        }

        this.playBounds = this.calculatePlayBounds();
        this.updateBrickRails();
        this.updateLinkGates();
        this.updateGoalGate(true);
        this.updateReturnRoute(true);
        this.syncPlacedLettersToScroll();
        this.ensureRunnerDocumentState();
        this.runnerState.docX = clamp(
            this.runnerState.docX,
            this.currentPlayBounds().left + window.scrollX,
            this.currentPlayBounds().right + window.scrollX - RUNNER_WIDTH
        );
        this.syncRunnerScreenPosition();
    }

    handleGameWheel(event) {
        if (!this.runnerState) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
    }

    handleGameTouchMove(event) {
        if (!this.runnerState) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
    }

    releaseScrollPin() {
        if (this.runnerState) {
            this.runnerState.scrollPinned = false;
        }
    }

    updateRunner(time) {
        if (!this.runner || !this.runnerState) {
            return;
        }

        const delta = this.runnerLastTime ? Math.min((time - this.runnerLastTime) / 1000, 0.05) : 0.016;
        this.runnerLastTime = time;

        try {
            if (this.roomTransition) {
                this.updateRoomDropTransition(time);
                this.renderRunner(time);
                this.updateMissionHud();
                this.runnerRaf = requestFrame((nextTime) => this.updateRunner(nextTime));
                return;
            }

            this.updateGamepadControls();
            this.updateRunnerPhysics(delta);
            if (this.roomTransition) {
                this.renderRunner(time);
                this.updateMissionHud();
                this.runnerRaf = requestFrame((nextTime) => this.updateRunner(nextTime));
                return;
            }
            this.maybeSpawnEnemies(time);
            this.maybeSpawnChests(time);
            this.updateEnemies(delta, time);
            this.updateChests(delta, time);
            this.syncLockedEnemy();
            this.updateProjectiles(delta);
            this.updateEnemyMissiles(delta, time);
            this.renderRunner(time);
            this.updateMissionHud();
            this.updateGoalGate();
            this.updateReturnRoute();
            this.checkGateEntry();
            this.checkGoalEntry();
            this.checkReturnRouteEntry();
        } catch (error) {
            window.__GamingWebRunnerError = {
                message: error?.message || String(error),
                stack: error?.stack || '',
            };

            if (this.config?.debug && window.console && typeof window.console.error === 'function') {
                window.console.error('[Gaming Web] Runner loop recovered.', error);
            }
        }

        if (this.runner && this.runnerState) {
            this.runnerRaf = requestFrame((nextTime) => this.updateRunner(nextTime));
        }
    }

    visibleRunnerTargets() {
        return this.runnerTargets.filter((target) => {
            const rect = liveRectForTarget(target);
            return rect.width > 12
                && rect.height > 12
                && rect.bottom > 48
                && rect.top < window.innerHeight - 52
                && rect.right > 0
                && rect.left < window.innerWidth;
        });
    }

    calculatePlayBounds() {
        const usableRects = this.runnerTargets
            .map((target) => liveRectForTarget(target))
            .filter((rect) => rect.width > 8 && rect.height > 8 && rect.right > 0 && rect.left < window.innerWidth);

        if (usableRects.length === 0) {
            return {
                left: 12,
                right: Math.max(12 + RUNNER_WIDTH, window.innerWidth - 12),
            };
        }

        const padding = window.innerWidth < 640 ? 8 : 12;
        const minWidth = Math.min(window.innerWidth - 24, 260);
        let left = Math.max(12, Math.min(...usableRects.map((rect) => rect.left)) - padding);
        let right = Math.min(window.innerWidth - 12, Math.max(...usableRects.map((rect) => rect.right)) + padding);

        if (right - left < minWidth) {
            const center = (left + right) / 2;
            left = Math.max(12, center - minWidth / 2);
            right = Math.min(window.innerWidth - 12, left + minWidth);
            left = Math.max(12, right - minWidth);
        }

        return {
            left,
            right: Math.max(right, left + RUNNER_WIDTH + 16),
        };
    }

    currentPlayBounds() {
        return this.playBounds || {
            left: 12,
            right: Math.max(12 + RUNNER_WIDTH, window.innerWidth - 12),
        };
    }

    buildRooms() {
        const pageBottom = pageEndGroundDocY();
        const maxRoomHeight = Math.max(ROOM_MIN_HEIGHT, Math.round(window.innerHeight * ROOM_HEIGHT_RATIO));
        const roomSelector = [
            'main section',
            'main article',
            'main .elementor-section',
            'main .e-con',
            '.entry-content > section',
            '.entry-content > article',
            '.elementor-section',
            '.e-con',
        ].join(',');
        const rawElements = Array.from(document.querySelectorAll(roomSelector))
            .filter((element) => element instanceof Element && !isGameIgnoredElement(element));
        const topLevelElements = rawElements.filter((element) => !element.parentElement?.closest(roomSelector));
        const roomElements = topLevelElements.length ? topLevelElements : rawElements;
        const candidates = roomElements
            .filter((element) => element instanceof Element && !isGameIgnoredElement(element))
            .map((element) => rectToDocumentObject(element.getBoundingClientRect()))
            .filter((rect) => rect.width > 80 && rect.height > 120 && rect.bottom > 0 && rect.top < pageBottom)
            .sort((a, b) => a.top - b.top || b.height - a.height);

        const rooms = [];
        const addSplitRooms = (top, bottom, source = 'chunk') => {
            let start = clamp(Math.floor(top), 0, pageBottom);
            const end = clamp(Math.ceil(bottom), 0, pageBottom);
            if (end - start < 120) {
                return;
            }

            while (end - start > maxRoomHeight * 1.18) {
                const roomBottom = Math.min(end, start + maxRoomHeight);
                rooms.push({
                    top: start,
                    bottom: roomBottom,
                    source,
                });
                start = Math.max(start + 120, roomBottom - ROOM_OVERLAP_PX);
            }

            rooms.push({
                top: start,
                bottom: end,
                source,
            });
        };

        if (candidates.length) {
            let coveredUntil = 0;
            for (const rect of candidates) {
                const top = Math.max(0, rect.top - 48);
                const bottom = Math.min(pageBottom, rect.bottom + 88);
                if (top - coveredUntil > maxRoomHeight * 0.55) {
                    addSplitRooms(coveredUntil, top + ROOM_OVERLAP_PX, 'gap');
                }
                addSplitRooms(top, bottom, 'section');
                coveredUntil = Math.max(coveredUntil, bottom - ROOM_OVERLAP_PX);
            }

            if (pageBottom - coveredUntil > 180) {
                addSplitRooms(coveredUntil, pageBottom, 'tail');
            }
        }

        if (rooms.length === 0) {
            for (let start = 0; start < pageBottom - 80;) {
                const bottom = Math.min(pageBottom, start + maxRoomHeight);
                rooms.push({
                    top: start,
                    bottom,
                    source: 'fallback',
                });
                if (bottom >= pageBottom) {
                    break;
                }
                start = Math.max(start + 120, bottom - ROOM_OVERLAP_PX);
            }
        }

        return normalizeRooms(rooms, pageBottom).map((room, index) => ({
            ...room,
            index,
        }));
    }

    findRoomIndexForDocY(docY) {
        const rooms = this.rooms?.length ? this.rooms : [{ top: 0, bottom: pageEndGroundDocY(), index: 0 }];
        const y = Number.isFinite(docY) ? docY : window.scrollY;
        const direct = rooms.find((room) => y >= room.top - 4 && y <= room.bottom + 4);
        if (direct) {
            return direct.index || 0;
        }

        let bestIndex = 0;
        let bestDistance = Infinity;
        for (const room of rooms) {
            const distance = y < room.top ? room.top - y : y - room.bottom;
            if (distance < bestDistance) {
                bestDistance = distance;
                bestIndex = room.index || 0;
            }
        }

        return bestIndex;
    }

    currentRoom() {
        if (!this.rooms?.length) {
            return { top: 0, bottom: pageEndGroundDocY(), index: 0 };
        }

        return this.rooms[clamp(this.roomIndex, 0, this.rooms.length - 1)] || this.rooms[0];
    }

    rebuildRoomCollisionCache() {
        const room = this.currentRoom();
        this.roomCollisionCache = this.collisionCacheForRoom(room);

        if (this.runnerState) {
            this.runnerState.cachedPlatforms = this.roomCollisionCache;
        }
    }

    collisionCacheForRoom(room = this.currentRoom()) {
        const textRects = this.textBreaker?.charPlatformRectsForRoom?.(room) || [];
        const imageRects = this.imageBreaker?.platformRectsForRoom?.(room) || [];
        const placedRects = this.placedLetters
            .map((placed) => {
                const rect = this.placedLetterDocRect(placed);
                return rect ? { rect, surfaceY: rect.top, placed, type: 'placed' } : null;
            })
            .filter(Boolean)
            .filter((item) => item.rect.bottom >= room.top - 64 && item.rect.top <= room.bottom + 64);

        return {
            roomIndex: room.index || 0,
            room,
            textRects,
            imageRects,
            placedRects,
        };
    }

    ensureRoomCollisionCache() {
        const room = this.currentRoom();
        if (!this.roomCollisionCache || this.roomCollisionCache.roomIndex !== (room.index || 0)) {
            this.rebuildRoomCollisionCache();
        }

        return this.roomCollisionCache;
    }

    previewLandingDocYForRoom(room) {
        if (!this.runnerState || !room) {
            return null;
        }

        const cache = this.collisionCacheForRoom(room);
        const rect = this.runnerDocPhysicsRect();
        const accepts = (surfaceY) => surfaceY >= room.top - ROOM_OVERLAP_PX && surfaceY <= room.bottom + ROOM_DROP_LANDING_SEARCH_PX;
        const textLandingY = cachedTextSurfaceY(cache.textRects || [], rect, accepts);
        const imageLandingY = cachedRectSurfaceY(cache.imageRects || [], rect, accepts);
        const placedLandingY = cachedRectSurfaceY(cache.placedRects || [], rect, accepts);
        return firstLandingY(textLandingY, imageLandingY, placedLandingY);
    }

    mountBrickRails() {
        this.brickLayer?.remove();
        this.brickLayer = document.createElement('div');
        this.brickLayer.className = 'gw-brick-rails';
        this.brickLayer.innerHTML = `
            <span class="gw-brick-wall gw-brick-wall--left" aria-hidden="true"></span>
            <span class="gw-brick-wall gw-brick-wall--right" aria-hidden="true"></span>
        `;
        this.effectLayer?.prepend(this.brickLayer);
        this.updateBrickRails();
    }

    updateBrickRails() {
        if (!this.brickLayer) {
            return;
        }

        const bounds = this.currentPlayBounds();
        const leftWall = this.brickLayer.querySelector('.gw-brick-wall--left');
        const rightWall = this.brickLayer.querySelector('.gw-brick-wall--right');
        const leftWidth = Math.max(0, bounds.left);
        const rightWidth = Math.max(0, window.innerWidth - bounds.right);

        if (leftWall) {
            leftWall.style.left = '0px';
            leftWall.style.top = '0px';
            leftWall.style.width = `${leftWidth}px`;
            leftWall.style.height = `${window.innerHeight}px`;
            leftWall.hidden = leftWidth < 10;
        }

        if (rightWall) {
            rightWall.style.left = `${bounds.right}px`;
            rightWall.style.top = '0px';
            rightWall.style.width = `${rightWidth}px`;
            rightWall.style.height = `${window.innerHeight}px`;
            rightWall.hidden = rightWidth < 10;
        }
    }

    mountLinkGates(targets) {
        this.gateLayer?.remove();
        this.linkGates = [];

        const gateTargets = targets
            .filter((target) => target.type === 'action' && target.element instanceof HTMLAnchorElement)
            .filter((target) => isPlayableContentElement(target.element))
            .filter((target) => isInternalLinkGate(target.element));

        if (gateTargets.length === 0 || !this.effectLayer) {
            return;
        }

        this.gateLayer = document.createElement('div');
        this.gateLayer.className = 'gw-link-gates';
        this.effectLayer.appendChild(this.gateLayer);

        for (const target of gateTargets) {
            const gateElement = document.createElement('span');
            gateElement.className = 'gw-link-gate';
            gateElement.setAttribute('aria-hidden', 'true');
            const gateText = (target.text || '\u30b2\u30fc\u30c8').slice(0, 18);
            gateElement.innerHTML = `
                <span class="gw-link-gate__label">${escapeHtml(gateText)}</span>
                <span class="gw-link-gate__meter" aria-hidden="true"></span>
            `;
            this.gateLayer.appendChild(gateElement);

            this.linkGates.push({
                target,
                element: gateElement,
                meter: gateElement.querySelector('.gw-link-gate__meter'),
                href: target.element.href,
                destroyed: false,
            });
        }

        this.updateLinkGates();
    }

    updateLinkGates() {
        for (const gate of this.linkGates) {
            if (gate.destroyed || !gate.target.element.isConnected) {
                continue;
            }

            const rect = liveRectForTarget(gate.target);
            const visible = rect.width > 8
                && rect.height > 8
                && rect.bottom > 0
                && rect.top < window.innerHeight
                && rect.right > 0
                && rect.left < window.innerWidth
                && !this.linkGateOverlapsHud(rect);

            gate.element.hidden = !visible;
            if (!visible) {
                if (this.linkGateCharge?.gate === gate) {
                    this.resetLinkGateCharge();
                }
                continue;
            }

            gate.element.style.left = `${rect.left}px`;
            gate.element.style.top = `${rect.top}px`;
            gate.element.style.width = `${Math.max(rect.width, 72)}px`;
            gate.element.style.height = `${Math.max(rect.height, 42)}px`;
        }
    }

    linkGateOverlapsHud(rect) {
        if (!this.missionHud) {
            return false;
        }

        const hudRect = this.missionHud.getBoundingClientRect();
        const safeRect = {
            left: hudRect.left - HUD_GATE_SAFE_MARGIN,
            top: hudRect.top - HUD_GATE_SAFE_MARGIN,
            right: hudRect.right + HUD_GATE_SAFE_MARGIN,
            bottom: hudRect.bottom + HUD_GATE_SAFE_MARGIN,
        };

        return rect.right > safeRect.left
            && rect.left < safeRect.right
            && rect.bottom > safeRect.top
            && rect.top < safeRect.bottom;
    }

    mountEnemyLayer() {
        this.enemyLayer?.remove();
        this.enemyLayer = document.createElement('div');
        this.enemyLayer.className = 'gw-enemy-layer';
        this.effectLayer?.appendChild(this.enemyLayer);
    }

    mountProjectileLayer() {
        this.projectileLayer?.remove();
        this.projectileLayer = document.createElement('div');
        this.projectileLayer.className = 'gw-projectile-layer';
        this.effectLayer?.appendChild(this.projectileLayer);
    }

    mountChestLayer() {
        this.chestLayer?.remove();
        this.chestLayer = document.createElement('div');
        this.chestLayer.className = 'gw-chest-layer';
        this.chestLayer.setAttribute('aria-hidden', 'true');
        this.effectLayer?.appendChild(this.chestLayer);
    }

    maybeSpawnChests(time) {
        if (!this.chestLayer || this.stageCleared || this.stageFailed || this.roomTransition) {
            return;
        }

        const progress = pageScrollProgress();
        if (progress < CHEST_REVEAL_PROGRESS || time < this.nextChestAt) {
            return;
        }

        const activeCount = this.chests.filter((chest) => !chest.opened && chest.element?.isConnected).length;
        const maxActive = progress > 0.62 ? 3 : (progress > 0.34 ? 2 : 1);
        if (activeCount >= maxActive) {
            return;
        }

        this.spawnChest();
        this.nextChestAt = time + randomBetween(CHEST_MIN_INTERVAL, CHEST_MAX_INTERVAL);
    }

    spawnChest() {
        const bounds = this.currentPlayBounds();
        const width = CHEST_WIDTH;
        const height = CHEST_HEIGHT;
        const leftLimit = Math.max(18, bounds.left + 18);
        const rightLimit = Math.min(window.innerWidth - width - 18, bounds.right - width - 18);
        const x = clamp(randomBetween(leftLimit, Math.max(leftLimit, rightLimit)), 18, window.innerWidth - width - 18);
        const minY = Math.max(116, window.innerHeight * 0.36);
        const maxY = Math.max(minY, window.innerHeight - height - 132);
        const y = clamp(randomBetween(minY, maxY), 96, window.innerHeight - height - 86);
        const itemType = this.pickChestItem();
        const element = document.createElement('div');
        element.className = `gw-treasure-chest gw-treasure-chest--${itemType}`;
        element.innerHTML = `
            <span class="gw-treasure-chest__glow"></span>
            <span class="gw-treasure-chest__lid"></span>
            <span class="gw-treasure-chest__body"></span>
            <span class="gw-treasure-chest__lock"></span>
        `;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        this.chestLayer?.appendChild(element);

        this.chests.push({
            id: `chest-${++this.chestSequence}`,
            itemType,
            element,
            opened: false,
            width,
            height,
        });

        this.showMessage(UI_TEXT.chestAppear, 1500);
    }

    pickChestItem() {
        const weighted = CHEST_ITEM_TYPES.slice();
        if (this.playerLife < PLAYER_MAX_LIFE) {
            weighted.push('heal', 'heal');
        }
        if (!this.shieldBoostActive()) {
            weighted.push('shield');
        }
        if (!this.hammerBoostActive()) {
            weighted.push('hammer');
        }
        if (this.collectedLetterCount() < GOAL_REQUIRED_LETTERS) {
            weighted.push('hint', 'hint');
        }

        return weighted[Math.floor(Math.random() * weighted.length)] || 'jewel';
    }

    updateChests() {
        const before = this.chests.length;
        this.chests = this.chests.filter((chest) => chest.element?.isConnected);
        if (before !== this.chests.length) {
            this.nextChestAt = Math.max(this.nextChestAt, currentTime() + 3000);
        }

        this.root?.classList.toggle('gw-stage--shield-boost', this.shieldBoostActive());
        this.root?.classList.toggle('gw-stage--hammer-boost', this.hammerBoostActive());
    }

    hitChestAtRect(rect, options = {}) {
        let bestChest = null;
        let bestOverlap = 0;

        for (const chest of this.chests) {
            if (chest.opened || !chest.element?.isConnected) {
                continue;
            }

            const chestRect = chest.element.getBoundingClientRect();
            const overlap = rectOverlapArea(rect, chestRect);
            if (overlap > bestOverlap) {
                bestOverlap = overlap;
                bestChest = chest;
            }
        }

        if (!bestChest || bestOverlap < 18) {
            return null;
        }

        const chestRect = bestChest.element.getBoundingClientRect();
        this.openChest(bestChest, {
            charged: Boolean(options.charged),
            rect: chestRect,
        });

        return {
            count: 1,
            item_type: bestChest.itemType,
            rect: chestRect,
        };
    }

    openChest(chest, options = {}) {
        if (!chest || chest.opened) {
            return;
        }

        chest.opened = true;
        chest.element.classList.add('gw-treasure-chest--open');
        this.bumpStageStat('chestsOpened', 1);
        this.impactBurstAt(options.rect || chest.element.getBoundingClientRect(), options.charged ? 'hard' : 'medium');
        this.spawnItemBurst(options.rect || chest.element.getBoundingClientRect(), chest.itemType);
        this.grantChestItem(chest.itemType);
        this.updateGoalGate(true);
        if (this.openedChestCount() === GOAL_REQUIRED_CHESTS) {
            const timer = window.setTimeout(() => {
                this.showMessage(UI_TEXT.chestReady, 1800);
                this.onRunnerSound('cheer', { volume: 0.11, rate: 1.06 });
                this.timers.delete(timer);
            }, 520);
            this.timers.add(timer);
        }
        this.shakeScreen(options.charged ? 'medium' : 'soft');
        this.onRunnerSound('collect', { volume: 0.12, rate: 1.05 });
        this.removeLater(chest.element, 900);
    }

    grantChestItem(itemType) {
        const now = currentTime();

        if (itemType === 'heal') {
            this.playerLife = Math.min(PLAYER_MAX_LIFE, this.playerLife + 1);
            this.showMessage(UI_TEXT.itemHeal, 1400);
            this.updateMissionHud(true);
            return;
        }

        if (itemType === 'shield') {
            this.itemEffects.shieldUntil = now + ITEM_EFFECT_DURATION_MS;
            this.root?.classList.add('gw-stage--shield-boost');
            this.showMessage(UI_TEXT.itemShield, 1700);
            return;
        }

        if (itemType === 'hammer') {
            this.itemEffects.hammerUntil = now + ITEM_EFFECT_DURATION_MS;
            this.root?.classList.add('gw-stage--hammer-boost');
            this.showMessage(UI_TEXT.itemHammer, 1700);
            return;
        }

        if (itemType === 'hint') {
            const char = this.pickHintChar();
            this.showHintLetter(char);
            this.showMessage(UI_TEXT.itemHint.replace('{char}', char || '?'), 2100);
            return;
        }

        this.scoreJewels += 1;
        this.bumpStageStat('scoreJewels', 1);
        this.showMessage(UI_TEXT.itemJewel, 1400);
    }

    shieldBoostActive() {
        return currentTime() < (this.itemEffects?.shieldUntil || 0);
    }

    hammerBoostActive() {
        return currentTime() < (this.itemEffects?.hammerUntil || 0);
    }

    pickHintChar() {
        const treasure = this.normalizedTreasureLetters();
        const importantChars = this.importantWords
            .flatMap((word) => treasureCharsFrom(word))
            .filter(Boolean);
        const unusedImportant = importantChars.find((char) => !treasure.includes(char));
        if (unusedImportant) {
            return unusedImportant;
        }

        const candidate = this.textBreaker?.findLetterNearRect?.(this.runnerPickupRect?.(), { preserve: true });
        if (candidate?.char) {
            return candidate.char;
        }

        const titleChars = treasureCharsFrom(document.title || UI_TEXT.treasureTitle);
        return titleChars.find((char) => !treasure.includes(char)) || titleChars[0] || '?';
    }

    showHintLetter(char) {
        const rect = this.runnerPhysicsRect();
        const hint = document.createElement('span');
        hint.className = 'gw-item-hint-letter';
        hint.textContent = char || '?';
        hint.style.left = `${rect.left + rect.width / 2}px`;
        hint.style.top = `${Math.max(64, rect.top - 18)}px`;
        this.addTemporaryEffect(hint, 1600);
    }

    spawnItemBurst(rect, itemType = 'jewel') {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const burst = document.createElement('span');
        burst.className = `gw-item-burst gw-item-burst--${itemType}`;
        burst.textContent = itemGlyph(itemType);
        burst.style.left = `${centerX}px`;
        burst.style.top = `${centerY}px`;
        this.addTemporaryEffect(burst, 860);

        for (let index = 0; index < 10; index += 1) {
            const chip = document.createElement('span');
            chip.className = `gw-jewel-chip gw-jewel-chip--${itemType}`;
            chip.style.left = `${centerX + randomBetween(-12, 12)}px`;
            chip.style.top = `${centerY + randomBetween(-10, 10)}px`;
            chip.style.setProperty('--gw-x', `${randomBetween(-96, 96)}px`);
            chip.style.setProperty('--gw-y', `${randomBetween(-96, 46)}px`);
            chip.style.setProperty('--gw-r', `${randomBetween(-160, 160)}deg`);
            chip.style.setProperty('--gw-d', `${randomBetween(0, 80)}ms`);
            this.addTemporaryEffect(chip, 760);
        }
    }

    mountReturnRoute() {
        this.returnRoute?.remove();
        this.returnRoute = document.createElement('div');
        this.returnRoute.className = 'gw-return-route';
        this.returnRoute.setAttribute('aria-hidden', 'true');
        this.returnRoute.hidden = true;
        this.returnRoute.innerHTML = `<span>\u2191</span><small>${UI_TEXT.returnRoute}</small>`;
        this.effectLayer?.appendChild(this.returnRoute);
        this.updateReturnRoute(true);
    }

    updateReturnRoute(force = false) {
        if (!this.returnRoute) {
            return;
        }

        const visible = !this.stageCleared
            && !this.stageFailed
            && pageScrollProgress() >= RETURN_ROUTE_REVEAL_PROGRESS
            && window.scrollY > window.innerHeight * 0.45;
        this.returnRoute.hidden = !visible;
        if (!visible) {
            return;
        }

        const bounds = this.currentPlayBounds();
        const left = clamp(bounds.left + 18, 12, Math.max(12, bounds.right - 92));
        this.returnRoute.style.left = `${left}px`;
        this.returnRoute.style.top = `${Math.max(96, window.innerHeight - 176)}px`;

        if (force) {
            this.returnRoute.classList.remove('gw-return-route--active');
        }
    }

    checkReturnRouteEntry() {
        if (!this.runnerState || !this.returnRoute || this.returnRoute.hidden || currentTime() < this.returnRouteCooldownUntil) {
            return;
        }

        const routeRect = this.returnRoute.getBoundingClientRect();
        const runnerRect = this.runnerPhysicsRect();
        const overlap = rectOverlapArea(routeRect, runnerRect);
        if (overlap < Math.min(420, routeRect.width * routeRect.height * 0.2)) {
            return;
        }

        this.returnRouteCooldownUntil = currentTime() + 1600;
        this.returnRoute.classList.add('gw-return-route--active');
        const targetY = Math.max(0, window.scrollY - window.innerHeight * 0.86);
        const targetScreenY = Math.max(92, Math.min(this.runnerState.y, window.innerHeight * 0.52));
        this.runnerScrollFollowUntil = currentTime() + 420;
        window.scrollTo({ top: targetY, behavior: this.reducedMotion ? 'auto' : 'smooth' });
        this.ensureRunnerDocumentState();
        this.runnerState.docY = targetY + targetScreenY;
        this.roomIndex = this.findRoomIndexForDocY(this.runnerState.docY + RUNNER_HEIGHT);
        this.runnerState.roomIndex = this.roomIndex;
        this.rebuildRoomCollisionCache();
        this.runnerState.vy = -120;
        this.runnerState.grounded = false;
        this.syncRunnerScreenPosition();
        this.onRunnerSound('warp', { volume: 0.12, rate: 1.08 });
        this.showMessage(UI_TEXT.returnRouteHint, 1400);
    }

    maybeSpawnEnemies(time) {
        if (!this.enemyLayer || this.stageCleared || this.stageFailed) {
            return;
        }

        const progress = pageScrollProgress();
        const activeEnemies = this.enemies.filter((enemy) => !enemy.defeated);

        if (progress > 0.28 && !this.enemyWaveStarted) {
            this.enemyWaveStarted = true;
            this.spawnEnemy('minion');
            this.showMessage(UI_TEXT.enemyAppear, 2400);
        }

        if (progress > 0.44 && activeEnemies.filter((enemy) => enemy.type === 'minion').length < 2 && time - this.lastEnemySpawnAt > 7200) {
            this.spawnEnemy('minion');
            this.lastEnemySpawnAt = time;
        }

        if (progress > 0.66 && !this.bossSpawned) {
            this.bossSpawned = true;
            this.spawnEnemy('boss');
            this.showMessage(UI_TEXT.bossAppear, 3200);
            this.shakeScreen('medium');
        }
    }

    spawnEnemy(type = 'minion') {
        const boss = type === 'boss';
        const variant = boss ? 'guardian' : `bug-${Math.floor(Math.random() * 3) + 1}`;
        const element = document.createElement('div');
        element.className = `gw-enemy gw-enemy--${type} gw-enemy--${variant}`;
        element.innerHTML = `
            <span class="gw-enemy__shadow"></span>
            <span class="gw-enemy__body"></span>
            <span class="gw-enemy__eye gw-enemy__eye--left"></span>
            <span class="gw-enemy__eye gw-enemy__eye--right"></span>
            <span class="gw-enemy__hand gw-enemy__hand--left"></span>
            <span class="gw-enemy__hand gw-enemy__hand--right"></span>
            <span class="gw-enemy__hp"><span></span></span>
        `;
        this.enemyLayer?.appendChild(element);

        const width = boss ? BOSS_WIDTH : ENEMY_WIDTH;
        const height = boss ? BOSS_HEIGHT : ENEMY_HEIGHT;
        const fromRight = Math.random() > 0.5;
        const y = clamp(randomBetween(118, window.innerHeight - height - 124), 74, window.innerHeight - height - 84);
        const enemy = {
            id: `enemy-${++this.enemySequence}`,
            type,
            element,
            width,
            height,
            x: fromRight ? window.innerWidth - width - 30 : 30,
            y,
            vx: fromRight ? -38 : 38,
            vy: 0,
            hp: boss ? 8 : 3,
            maxHp: boss ? 8 : 3,
            defeated: false,
            countedDefeat: false,
            hitUntil: 0,
            nextAttackAt: currentTime() + (boss ? 1050 : 1250),
            nextMissileAt: boss ? currentTime() + randomBetween(BOSS_MISSILE_MIN_INTERVAL, BOSS_MISSILE_MAX_INTERVAL) : Infinity,
            nextTargetPickAt: 0,
            targetRect: null,
            roamUntil: 0,
            variant,
        };

        this.enemies.push(enemy);
        this.renderEnemy(enemy);
    }

    updateEnemies(delta, time) {
        if (this.stageCleared || this.stageFailed) {
            return;
        }

        for (const enemy of this.enemies) {
            if (enemy.defeated) {
                continue;
            }

            this.updateEnemyTarget(enemy, time);
            const target = enemy.targetRect || this.enemyFallbackTarget(enemy);
            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2;
            const targetCenterX = target.left + target.width / 2;
            const targetCenterY = target.top + Math.min(target.height / 2, 80);
            const speed = enemy.type === 'boss' ? 62 : 86;
            const dx = targetCenterX - enemyCenterX;
            const dy = targetCenterY - enemyCenterY;
            const distance = Math.max(1, Math.hypot(dx, dy));

            enemy.vx = lerp(enemy.vx, (dx / distance) * speed, 0.04);
            enemy.vy = lerp(enemy.vy, (dy / distance) * speed, 0.035);
            enemy.x = clamp(enemy.x + enemy.vx * delta, 12, window.innerWidth - enemy.width - 12);
            enemy.y = clamp(enemy.y + enemy.vy * delta, 58, window.innerHeight - enemy.height - 76);

            if (distance < (enemy.type === 'boss' ? 96 : 72) && time > enemy.nextAttackAt) {
                this.enemyAttackPage(enemy);
                enemy.nextAttackAt = time + (enemy.type === 'boss' ? 1450 : 1850);
                enemy.targetRect = this.enemyRoamTarget(enemy);
                enemy.nextTargetPickAt = time + randomBetween(900, 1600);
                enemy.roamUntil = time + randomBetween(900, 1500);
            }

            if (enemy.type === 'boss' && !this.stageCleared && !this.stageFailed && time > enemy.nextMissileAt) {
                this.warnAndFireBossMissile(enemy);
                enemy.nextMissileAt = time + randomBetween(BOSS_MISSILE_MIN_INTERVAL, BOSS_MISSILE_MAX_INTERVAL);
            }

            this.renderEnemy(enemy);
        }

        this.enemies = this.enemies.filter((enemy) => enemy.element.isConnected || !enemy.defeated);
    }

    activeEnemies() {
        return this.enemies.filter((enemy) => !enemy.defeated && enemy.element.isConnected);
    }

    visibleActiveEnemies() {
        return this.activeEnemies().filter((enemy) => {
            const rect = this.enemyRect(enemy);
            return rect.right > -20
                && rect.left < window.innerWidth + 20
                && rect.bottom > -20
                && rect.top < window.innerHeight + 20;
        });
    }

    lockedEnemy() {
        if (!this.lockedEnemyId) {
            return null;
        }

        return this.activeEnemies().find((enemy) => enemy.id === this.lockedEnemyId) || null;
    }

    syncLockedEnemy() {
        if (!this.lockedEnemyId) {
            return;
        }

        if (this.lockedEnemy()) {
            return;
        }

        this.lockedEnemyId = null;
        this.lockedEnemyManual = false;
        this.showMessage(UI_TEXT.lockLost, 900);
    }

    cycleLockOn() {
        const enemies = this.visibleActiveEnemies();

        if (enemies.length === 0) {
            this.lockedEnemyId = null;
            this.lockedEnemyManual = false;
            this.showMessage(UI_TEXT.noEnemy, 900);
            return;
        }

        const handRect = this.runnerHandRect();
        const handX = handRect.left + handRect.width / 2;
        const handY = handRect.top + handRect.height / 2;
        const facing = this.runnerState?.direction || 1;
        enemies.sort((a, b) => {
            const aRect = this.enemyRect(a);
            const bRect = this.enemyRect(b);
            return enemyAimScore(a, handX, handY, facing) - enemyAimScore(b, handX, handY, facing)
                || (aRect.left + aRect.width / 2) - (bRect.left + bRect.width / 2);
        });

        const currentIndex = enemies.findIndex((enemy) => enemy.id === this.lockedEnemyId);
        const nextEnemy = enemies[(currentIndex + 1) % enemies.length];
        this.lockedEnemyId = nextEnemy.id;
        this.lockedEnemyManual = true;
        this.renderEnemy(nextEnemy);
        this.impactBurstAt(this.enemyRect(nextEnemy), 'soft');
        this.onRunnerSound('lock', { volume: 0.24 });
        this.showMessage(UI_TEXT.lockOn, 950);
    }

    autoLockNearestEnemy() {
        if (this.lockedEnemy()) {
            return this.lockedEnemy();
        }

        const handRect = this.runnerHandRect();
        const enemy = this.nearestEnemyFromPoint(
            handRect.left + handRect.width / 2,
            handRect.top + handRect.height / 2,
            this.runnerState?.direction || 1
        );

        if (!enemy) {
            return null;
        }

        this.lockedEnemyId = enemy.id;
        this.lockedEnemyManual = false;
        this.renderEnemy(enemy);
            this.onRunnerSound('lock', { volume: 0.14 });
        return enemy;
    }

    pickAndThrowAtLock(options = {}) {
        const enemy = options.autoLock ? this.autoLockNearestEnemy() : this.lockedEnemy();

        if (!enemy) {
            this.showMessage(options.autoLock ? UI_TEXT.noEnemy : UI_TEXT.lockHint, 1300);
            this.impactBurstAt(this.runnerHandRect(), 'soft');
            return true;
        }

        if (this.heldLetter) {
            return this.launchWordProjectile();
        }

        const pickupRect = this.runnerPickupRect();
        const picked = this.textBreaker?.pickCharAtRect(pickupRect, {
            centerX: this.runnerState.x + RUNNER_WIDTH / 2,
            centerY: this.runnerState.y + RUNNER_HEIGHT,
        });

        if (!picked?.char) {
            this.showMessage(UI_TEXT.noFootWord, 1100);
            this.impactBurstAt(pickupRect, 'soft');
            this.shakeScreen('soft');
            return true;
        }

        if (this.criticalDestroyed(picked)) {
            this.bumpStageStat('playerBroken', 1);
            this.impactBurstAt(picked.rect, 'char');
            this.shakeScreen('hard');
            this.failStage('critical_player_pickup');
            return true;
        }

        this.rebuildRoomCollisionCache();
        this.holdLetter(picked);
        const timer = window.setTimeout(() => {
            this.timers.delete(timer);
            if (this.heldLetter && this.lockedEnemy()) {
                this.launchWordProjectile();
            }
        }, this.reducedMotion ? 40 : 150);
        this.timers.add(timer);

        return true;
    }

    pickAndThrowAtChest(chest) {
        if (!chest || chest.opened || !chest.element?.isConnected) {
            return false;
        }

        if (this.heldLetter) {
            return this.launchWordProjectile({
                targetChestId: chest.id,
                preferChest: true,
            });
        }

        const pickupRect = this.runnerPickupRect();
        const picked = this.textBreaker?.pickCharAtRect(pickupRect, {
            centerX: this.runnerState.x + RUNNER_WIDTH / 2,
            centerY: this.runnerState.y + RUNNER_HEIGHT,
        });

        if (!picked?.char) {
            this.showMessage(UI_TEXT.noFootWord, 1100);
            this.impactBurstAt(pickupRect, 'soft');
            this.shakeScreen('soft');
            return true;
        }

        if (this.criticalDestroyed(picked)) {
            this.bumpStageStat('playerBroken', 1);
            this.impactBurstAt(picked.rect, 'char');
            this.shakeScreen('hard');
            this.failStage('critical_player_pickup');
            return true;
        }

        this.rebuildRoomCollisionCache();
        this.holdLetter(picked);
        const targetChestId = chest.id;
        const timer = window.setTimeout(() => {
            this.timers.delete(timer);
            if (this.heldLetter) {
                this.launchWordProjectile({
                    targetChestId,
                    preferChest: true,
                });
            }
        }, this.reducedMotion ? 40 : 120);
        this.timers.add(timer);

        return true;
    }

    collectTreasureLetter() {
        if (!this.runnerState) {
            return false;
        }

        let picked = null;
        let impactRect = this.runnerHandRect();

        if (this.heldLetter) {
            this.showMessage(UI_TEXT.treasureHold, 1200);
            this.impactBurstAt(impactRect, 'soft');
            this.scheduleTreasureStore(this.heldLetter.id);
            return true;
        } else {
            const pickupRect = this.runnerPickupRect();
            picked = this.pickPlacedLetterAtRect(pickupRect)
                || this.textBreaker?.pickCharAtRect(pickupRect, {
                    centerX: this.runnerState.x + RUNNER_WIDTH / 2,
                    centerY: this.runnerState.y + RUNNER_HEIGHT,
                });
            impactRect = picked?.rect || pickupRect;
        }

        if (!picked?.char) {
            this.showMessage(UI_TEXT.treasureNoLetter, 1100);
            this.impactBurstAt(impactRect, 'soft');
            this.shakeScreen('soft');
            this.onRunnerSound('uiCancel', { volume: 0.08, rate: 1.05 });
            return true;
        }

        this.rebuildRoomCollisionCache();
        this.holdLetter(picked, {
            message: UI_TEXT.treasureHold,
            messageDuration: 620,
        });

        this.scheduleTreasureStore(this.heldLetter?.id || '');
        return true;
    }

    pickPlacedLetterAtRect(rect) {
        this.syncPlacedLettersToScroll();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const candidates = [];
        const remaining = [];

        for (const placed of this.placedLetters) {
            if (!placed.element?.isConnected) {
                continue;
            }

            const placedRect = placed.element.getBoundingClientRect();
            const overlap = rectOverlapArea(rect, placedRect);
            if (overlap <= 0) {
                remaining.push(placed);
                continue;
            }

            const placedCenterX = placedRect.left + placedRect.width / 2;
            const placedCenterY = placedRect.top + placedRect.height / 2;
            candidates.push({
                placed,
                rect: rectFromDom(placedRect),
                distance: Math.hypot(centerX - placedCenterX, (centerY - placedCenterY) * 1.4),
                overlap,
            });
        }

        candidates.sort((a, b) => a.distance - b.distance || b.overlap - a.overlap);
        const picked = candidates[0];

        if (!picked) {
            this.placedLetters = remaining;
            return null;
        }

        this.placedLetters = remaining.concat(candidates.slice(1).map((candidate) => candidate.placed));
        picked.placed.element.remove();
        this.rebuildRoomCollisionCache();

        return {
            char: picked.placed.char,
            rect: picked.rect,
            style: picked.placed.style || {},
            target: null,
        };
    }

    destroyPlacedLettersAtRect(rect, options = {}) {
        this.syncPlacedLettersToScroll();

        const limit = options.limit || 1;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const candidates = [];
        const remaining = [];

        for (const placed of this.placedLetters) {
            if (!placed.element?.isConnected) {
                continue;
            }

            const placedRect = placed.element.getBoundingClientRect();
            const overlap = rectOverlapArea(rect, placedRect);
            if (overlap <= 0) {
                remaining.push(placed);
                continue;
            }

            const placedCenterX = placedRect.left + placedRect.width / 2;
            const placedCenterY = placedRect.top + placedRect.height / 2;
            candidates.push({
                placed,
                rect: rectFromDom(placedRect),
                distance: Math.hypot(centerX - placedCenterX, (centerY - placedCenterY) * 1.25),
                overlap,
            });
        }

        candidates.sort((a, b) => a.distance - b.distance || b.overlap - a.overlap);
        const destroyed = candidates.slice(0, limit);
        const survivors = candidates.slice(limit).map((candidate) => candidate.placed);

        this.placedLetters = remaining.concat(survivors);

        for (const item of destroyed) {
            item.placed.element.classList.remove('gw-held-letter--placed');
            item.placed.element.classList.add('gw-held-letter--breaking');
            this.removeLater(item.placed.element, 220);
        }

        if (destroyed.length === 0) {
            return null;
        }

        this.rebuildRoomCollisionCache();

        return {
            count: destroyed.length,
            chars: destroyed.map((item) => item.placed.char),
            items: destroyed.map((item) => ({
                char: item.placed.char,
                rect: item.rect,
                target: null,
                critical: false,
                criticalWord: '',
            })),
            critical: false,
            criticalWord: '',
            target: null,
            rect: unionRects(destroyed.map((item) => item.rect)) || rect,
        };
    }

    scheduleTreasureStore(heldId = '') {
        if (!heldId || !this.heldLetter || this.heldLetter.id !== heldId) {
            return false;
        }

        this.clearTreasureStoreTimer();
        const timer = window.setTimeout(() => {
            this.timers.delete(timer);
            this.treasureStoreTimer = 0;
            this.treasureStoreHeldId = '';
            if (!this.heldLetter || this.heldLetter.id !== heldId) {
                return;
            }

            this.storeHeldLetterToTreasure();
        }, this.reducedMotion ? Math.min(TREASURE_STORE_DELAY_MS, 160) : TREASURE_STORE_DELAY_MS);

        this.treasureStoreTimer = timer;
        this.treasureStoreHeldId = heldId;
        this.timers.add(timer);
        return true;
    }

    clearTreasureStoreTimer() {
        if (this.treasureStoreTimer) {
            window.clearTimeout(this.treasureStoreTimer);
            this.timers.delete(this.treasureStoreTimer);
        }

        this.treasureStoreTimer = 0;
        this.treasureStoreHeldId = '';
    }

    placeHeldLetterAtFeet() {
        if (!this.heldLetter || !this.runnerState) {
            return false;
        }

        this.clearTreasureStoreTimer();
        const held = this.heldLetter;
        const element = held.element;
        this.ensureRunnerDocumentState();
        const docX = this.runnerState.docX + RUNNER_WIDTH / 2;
        const docY = this.runnerState.docY + RUNNER_HEIGHT - Math.max(6, held.height / 2);

        this.heldLetter = null;
        this.runner?.classList.remove('gw-pixel-runner--holding');

        if (!element) {
            return false;
        }

        element.classList.remove('gw-held-letter--drop', 'gw-held-letter--treasure-store');
        element.classList.add('gw-held-letter--placed');
        const placed = {
            char: held.char,
            element,
            style: held.style || {},
            width: held.width,
            height: held.height,
            docX,
            docY,
        };
        this.placedLetters.push(placed);
        this.positionPlacedLetter(placed);
        this.rebuildRoomCollisionCache();

        while (this.placedLetters.length > 12) {
            const old = this.placedLetters.shift();
            old?.element?.remove();
        }

        this.impactBurstAt(this.runnerPickupRect(), 'soft');
        this.onRunnerSound('uiMove', { volume: 0.08, rate: 0.96 });
        this.showMessage(UI_TEXT.treasurePlaced, 900);
        return true;
    }

    positionPlacedLetter(placed) {
        if (!placed?.element) {
            return;
        }

        const docX = typeof placed.docX === 'number'
            ? placed.docX
            : (placed.element.getBoundingClientRect().left + placed.element.getBoundingClientRect().width / 2 + window.scrollX);
        const docY = typeof placed.docY === 'number'
            ? placed.docY
            : (placed.element.getBoundingClientRect().top + placed.element.getBoundingClientRect().height / 2 + window.scrollY);

        placed.docX = docX;
        placed.docY = docY;
        placed.element.style.left = `${docX - window.scrollX}px`;
        placed.element.style.top = `${docY - window.scrollY}px`;
        placed.element.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    }

    syncPlacedLettersToScroll() {
        if (!this.placedLetters.length) {
            return;
        }

        const alive = [];
        for (const placed of this.placedLetters) {
            if (!placed.element?.isConnected) {
                continue;
            }

            this.positionPlacedLetter(placed);
            alive.push(placed);
        }

        this.placedLetters = alive;
    }

    findPlacedLetterSupportDocY(runnerRect) {
        let supportY = null;
        const feet = runnerRect.bottom;

        for (const placed of this.placedLetters) {
            const rect = this.placedLetterDocRect(placed);
            if (!rect || horizontalOverlap(runnerRect, rect) < Math.min(20, RUNNER_FOOT_WIDTH * 0.46)) {
                continue;
            }

            if (rect.top >= feet - 7 && rect.top <= feet + 9) {
                supportY = supportY === null ? rect.top : Math.min(supportY, rect.top);
            }
        }

        return supportY;
    }

    findPlacedLetterLandingDocY(runnerRect, previousBottom, nextBottom) {
        let landingY = null;

        for (const placed of this.placedLetters) {
            const rect = this.placedLetterDocRect(placed);
            if (!rect || horizontalOverlap(runnerRect, rect) < Math.min(20, RUNNER_FOOT_WIDTH * 0.46)) {
                continue;
            }

            if (rect.top >= previousBottom - 5 && rect.top <= nextBottom + 12) {
                landingY = landingY === null ? rect.top : Math.min(landingY, rect.top);
            }
        }

        return landingY;
    }

    placedLetterDocRect(placed) {
        if (!placed?.element?.isConnected) {
            return null;
        }

        const width = Math.max(placed.width || placed.element.getBoundingClientRect().width || 8, 8);
        const height = Math.max(placed.height || placed.element.getBoundingClientRect().height || 12, 12);
        const left = placed.docX - width / 2;
        const top = placed.docY - height / 2;
        return {
            left,
            top,
            right: left + width,
            bottom: top + height,
            width,
            height,
        };
    }

    storeHeldLetterToTreasure() {
        if (!this.heldLetter) {
            return false;
        }

        const held = this.heldLetter;
        const char = held.char;
        const element = held.element;
        const targetRect = this.missionTreasure?.getBoundingClientRect?.();
        const impactRect = targetRect || this.runnerHandRect();

        this.heldLetter = null;
        this.runner?.classList.remove('gw-pixel-runner--holding');

        if (element && targetRect && !this.reducedMotion) {
            element.classList.add('gw-held-letter--treasure-store');
            element.style.left = `${targetRect.left + targetRect.width / 2}px`;
            element.style.top = `${targetRect.top + targetRect.height / 2}px`;
            element.style.transform = 'translate(-50%, -50%) scale(0.58) rotate(0deg)';
            this.removeLater(element, 380);
        } else {
            element?.remove();
        }

        return this.storeTreasureLetter(char, impactRect);
    }

    storeTreasureLetter(char, impactRect = this.runnerHandRect()) {
        const treasureChar = firstTreasureChar(char);
        this.treasureLetters = this.normalizedTreasureLetters();

        if (!treasureChar) {
            return false;
        }

        this.treasureLetters.push(treasureChar);
        this.treasureLetters = this.normalizedTreasureLetters();
        this.stageStats.lettersCollected = this.collectedLetterCount();
        this.updateGoalGate(true);
        this.updateMissionHud(true);
        this.impactBurstAt(impactRect, 'char');
        this.shakeScreen('soft');
        this.onRunnerSound('collect', { volume: 0.13, rate: 1.08 });
        this.onTreasureCollect({
            word: treasureChar,
            treasure_letters: this.treasureWord(),
            letters_collected: this.collectedLetterCount(),
            letters_required: GOAL_REQUIRED_LETTERS,
        });
        this.showMessage(UI_TEXT.treasureStored.replace('{char}', treasureChar), 1300);
        return true;
    }

    holdLetter(picked, options = {}) {
        this.dropHeldLetter(true);

        const element = document.createElement('span');
        element.className = 'gw-held-letter';
        element.textContent = picked.char;
        this.applyPageLetterStyle(element, picked);
        element.style.left = `${picked.rect.left + picked.rect.width / 2}px`;
        element.style.top = `${picked.rect.top + picked.rect.height / 2}px`;
        this.projectileLayer?.appendChild(element);

        this.heldLetter = {
            id: `held-letter-${++this.heldLetterSequence}`,
            char: picked.char,
            element,
            style: picked.style || {},
            width: Math.max(picked.rect.width, WORD_THROW_SIZE),
            height: Math.max(picked.rect.height, WORD_THROW_SIZE),
        };

        if (options.countBreak !== false) {
            this.bumpStageStat('playerBroken', 1);
        }
        this.runner?.classList.add('gw-pixel-runner--holding');
        this.impactBurstAt(picked.rect, 'char');
        this.shakeScreen('soft');
        this.onRunnerSound('pickupLetter', { volume: 0.28, rate: 1.05 });
        this.showMessage(options.message || UI_TEXT.wordHold, options.messageDuration || 720);
        this.renderHeldLetter();
    }

    dropHeldLetter(immediate = false) {
        if (!this.heldLetter) {
            return;
        }

        this.clearTreasureStoreTimer();
        const element = this.heldLetter.element;
        this.heldLetter = null;
        this.runner?.classList.remove('gw-pixel-runner--holding');

        if (immediate) {
            element.remove();
            return;
        }

        element.classList.add('gw-held-letter--drop');
        this.removeLater(element, 220);
    }

    renderHeldLetter() {
        if (!this.heldLetter || !this.runnerState) {
            return;
        }

        const handRect = this.runnerHandRect();
        const x = handRect.left + handRect.width / 2 + this.runnerState.direction * 6;
        const y = handRect.top + 1;
        this.heldLetter.element.style.left = `${x}px`;
        this.heldLetter.element.style.top = `${y}px`;
        this.heldLetter.element.style.transform = `translate(-50%, -50%) rotate(${this.runnerState.direction > 0 ? -8 : 8}deg)`;
    }

    applyPageLetterStyle(element, picked) {
        const style = picked.style || {};
        for (const property of ['color', 'fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'letterSpacing', 'lineHeight', 'textShadow']) {
            if (style[property]) {
                element.style[property] = style[property];
            }
        }

        element.style.width = `${Math.max(picked.rect?.width || WORD_THROW_SIZE, WORD_THROW_SIZE)}px`;
        element.style.height = `${Math.max(picked.rect?.height || WORD_THROW_SIZE, WORD_THROW_SIZE)}px`;
    }

    launchWordProjectile(options = {}) {
        if (!this.runnerState || !this.projectileLayer || !this.heldLetter) {
            return false;
        }

        const held = this.heldLetter;
        const power = wordPowerForHeldLetter(held);
        this.clearTreasureStoreTimer();
        const handRect = this.runnerHandRect();
        const startX = handRect.left + handRect.width / 2;
        const startY = handRect.top + handRect.height / 2;
        const forcedChest = options.targetChestId
            ? this.chests.find((chest) => chest.id === options.targetChestId && !chest.opened && chest.element?.isConnected)
            : null;
        const manualEnemy = !options.preferChest && this.lockedEnemyManual ? this.lockedEnemy() : null;
        const enemy = manualEnemy;
        const chest = forcedChest || (enemy ? null : this.nearestChestFromPoint(startX, startY, this.runnerState.direction));
        const fallbackEnemy = !chest && !enemy && !options.preferChest ? this.lockedEnemy() : null;
        const targetEnemy = enemy || fallbackEnemy;
        const targetRect = enemy
            ? this.enemyRect(enemy)
            : (targetEnemy ? this.enemyRect(targetEnemy) : null)
            || (chest ? chest.element.getBoundingClientRect() : null);
        const targetX = targetRect
            ? targetRect.left + targetRect.width / 2
            : startX + this.runnerState.direction * 560;
        const targetY = targetRect
            ? targetRect.top + targetRect.height / 2
            : startY - 22;
        const dx = targetX - startX;
        const dy = targetY - startY;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const speed = this.reducedMotion ? WORD_THROW_SPEED * 1.2 : WORD_THROW_SPEED;
        const element = held.element;
        element.className = `gw-word-shot gw-word-shot--page-letter gw-word-shot--power-${power.name}`;
        element.textContent = held.char;
        element.style.left = `${startX}px`;
        element.style.top = `${startY}px`;
        element.style.transform = `translate(-50%, -50%) rotate(${Math.atan2(dy, dx) * 180 / Math.PI}deg)`;
        this.heldLetter = null;
        this.runner?.classList.remove('gw-pixel-runner--holding');

        this.projectiles.push({
            element,
            x: startX,
            y: startY,
            vx: (dx / distance) * speed,
            vy: (dy / distance) * speed,
            age: 0,
            targetId: targetEnemy?.id || chest?.id || '',
            targetType: targetEnemy ? 'enemy' : (chest ? 'chest' : 'free'),
            direction: this.runnerState.direction,
            char: held.char,
            damage: power.damage,
            intensity: power.intensity,
            power: power.name,
            hitbox: clamp(Math.max(held.width, held.height) + power.hitboxBonus, power.hitboxMin, 116),
        });

        this.impactBurstAt(handRect, 'soft');
        this.onRunnerSound('throwWord', { volume: power.throwVolume, rate: power.rate });
        this.showMessage(UI_TEXT.wordThrow, 900);
        return true;
    }

    nearestChestFromPoint(x, y, direction = 1) {
        let bestChest = null;
        let bestScore = Infinity;
        const facing = direction >= 0 ? 1 : -1;

        for (const chest of this.chests) {
            if (chest.opened || !chest.element?.isConnected) {
                continue;
            }

            const rect = chest.element.getBoundingClientRect();
            if (rect.bottom < -20 || rect.top > window.innerHeight + 20) {
                continue;
            }

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = centerX - x;
            if (dx * facing < -18) {
                continue;
            }

            const dy = centerY - y;
            const score = Math.hypot(dx, dy) + Math.abs(dy) * 0.32;
            if (score < bestScore) {
                bestScore = score;
                bestChest = chest;
            }
        }

        return bestChest;
    }

    nearestChestFromRunner() {
        if (!this.runnerState) {
            return null;
        }

        const handRect = this.runnerHandRect();
        return this.nearestChestFromPoint(
            handRect.left + handRect.width / 2,
            handRect.top + handRect.height / 2,
            this.runnerState.direction
        );
    }

    updateProjectiles(delta) {
        if (this.projectiles.length === 0) {
            return;
        }

        const remaining = [];

        for (const projectile of this.projectiles) {
            projectile.age += delta * 1000;
            let target = null;
            let targetRect = null;
            if (projectile.targetType === 'chest') {
                target = this.chests.find((chest) => chest.id === projectile.targetId && !chest.opened && chest.element?.isConnected)
                    || this.nearestChestFromPoint(projectile.x, projectile.y, projectile.direction);
                targetRect = target?.element?.getBoundingClientRect?.() || null;
            } else {
                target = this.enemies.find((enemy) => enemy.id === projectile.targetId && !enemy.defeated)
                    || this.nearestEnemyFromPoint(projectile.x, projectile.y, projectile.direction);
                targetRect = target ? this.enemyRect(target) : null;
            }

            if (targetRect) {
                const targetX = targetRect.left + targetRect.width / 2;
                const targetY = targetRect.top + targetRect.height / 2;
                const dx = targetX - projectile.x;
                const dy = targetY - projectile.y;
                const distance = Math.max(1, Math.hypot(dx, dy));
                projectile.vx = lerp(projectile.vx, (dx / distance) * WORD_THROW_SPEED, 0.26);
                projectile.vy = lerp(projectile.vy, (dy / distance) * WORD_THROW_SPEED, 0.26);
            }

            projectile.x += projectile.vx * delta;
            projectile.y += projectile.vy * delta;
            const angle = Math.atan2(projectile.vy, projectile.vx) * 180 / Math.PI;
            projectile.element.style.left = `${projectile.x}px`;
            projectile.element.style.top = `${projectile.y}px`;
            projectile.element.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

            const hitbox = projectile.hitbox || WORD_THROW_HITBOX;
            const shotRect = {
                left: projectile.x - hitbox / 2,
                top: projectile.y - hitbox / 2,
                width: hitbox,
                height: hitbox,
                right: projectile.x + hitbox / 2,
                bottom: projectile.y + hitbox / 2,
            };
            const chestHit = this.hitChestAtRect(shotRect, {
                projectile: true,
                charged: (projectile.damage || 1) > 1,
            });

            if (chestHit) {
                projectile.element.classList.add('gw-word-shot--hit');
                this.removeLater(projectile.element, 180);
                continue;
            }

            const hitEnemy = this.enemyAtRect(shotRect, 10);

            if (hitEnemy) {
                const hit = this.damageEnemy(hitEnemy, {
                    projectile: true,
                    damage: projectile.damage || 1,
                    intensity: projectile.intensity || 'medium',
                    knockbackDirection: Math.sign(projectile.vx) || projectile.direction || 1,
                    impactRect: shotRect,
                });
                hit.word = projectile.char;
                hit.damage = projectile.damage || 1;
                hit.power = projectile.power || 'small';
                projectile.element.classList.add('gw-word-shot--hit');
                this.removeLater(projectile.element, 180);
                this.runnerOnEnemyHit?.(hit);
                continue;
            }

            const outOfView = projectile.x < -60
                || projectile.x > window.innerWidth + 60
                || projectile.y < -80
                || projectile.y > window.innerHeight + 80;

            if (projectile.age > WORD_THROW_LIFETIME || outOfView) {
                projectile.element.remove();
                continue;
            }

            remaining.push(projectile);
        }

        this.projectiles = remaining;
    }

    warnAndFireBossMissile(enemy) {
        if (!enemy || enemy.type !== 'boss' || enemy.defeated || this.enemyMissiles.length > 0) {
            return;
        }

        enemy.element?.classList.add('gw-enemy--missile-ready');
        this.showMessage(UI_TEXT.bossMissileWarn, 1200);
        this.onRunnerSound('chargeReady', { volume: 0.07, rate: 0.88 });

        const timer = window.setTimeout(() => {
            this.timers.delete(timer);
            enemy.element?.classList.remove('gw-enemy--missile-ready');
            if (!this.stageCleared && !this.stageFailed && !enemy.defeated && this.enemyMissiles.length === 0) {
                this.fireEnemyMissile(enemy);
            }
        }, this.reducedMotion ? Math.min(BOSS_MISSILE_WARNING_MS, 160) : BOSS_MISSILE_WARNING_MS);
        this.timers.add(timer);
    }

    fireEnemyMissile(enemy) {
        if (!this.projectileLayer || !enemy?.element?.isConnected || enemy.type !== 'boss' || this.enemyMissiles.length > 0) {
            return;
        }

        const enemyRect = this.enemyRect(enemy);
        const criticalRect = this.textBreaker?.criticalRect?.();
        const useCritical = criticalRect
            && criticalRect.bottom > 0
            && criticalRect.top < window.innerHeight
            && Math.random() < 0.45;
        const targetX = useCritical && criticalRect
            ? criticalRect.left + criticalRect.width / 2
            : (this.runnerState?.x || window.innerWidth / 2) + RUNNER_WIDTH / 2;
        const targetY = useCritical && criticalRect
            ? criticalRect.top + criticalRect.height / 2
            : (this.runnerState?.y || window.innerHeight / 2) + RUNNER_HEIGHT / 2;
        const startX = enemyRect.left + enemyRect.width / 2;
        const startY = enemyRect.top + enemyRect.height / 2;
        const dx = targetX - startX;
        const dy = targetY - startY;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const element = document.createElement('span');
        element.className = `gw-enemy-missile${enemy.type === 'boss' ? ' gw-enemy-missile--boss' : ''}`;
        element.style.left = `${startX}px`;
        element.style.top = `${startY}px`;
        this.projectileLayer.appendChild(element);

        this.enemyMissiles.push({
            id: `missile-${++this.enemyMissileSequence}`,
            ownerId: enemy.id,
            element,
            x: startX,
            y: startY,
            vx: (dx / distance) * ENEMY_MISSILE_SPEED,
            vy: (dy / distance) * ENEMY_MISSILE_SPEED,
            age: 0,
            parried: false,
            targetX,
            targetY,
            targetCritical: Boolean(useCritical),
        });

        this.onRunnerSound('throwWord', { volume: 0.1, rate: 0.86 });
    }

    updateEnemyMissiles(delta, time) {
        if (this.enemyMissiles.length === 0) {
            return;
        }

        const remaining = [];
        const runnerRect = this.runnerPhysicsRect();
        const shieldRect = this.runnerShieldRect();
        const meleeRect = this.runnerMeleeRect();
        const shielding = this.controlHeld('shield');
        const striking = Boolean(this.runner?.classList.contains('gw-pixel-runner--strike'));

        for (const missile of this.enemyMissiles) {
            missile.age += delta * 1000;

            if (missile.parried) {
                const target = this.enemies.find((enemy) => enemy.id === missile.ownerId && !enemy.defeated)
                    || this.nearestEnemyFromPoint(missile.x, missile.y, missile.vx >= 0 ? 1 : -1);
                if (target) {
                    const targetRect = this.enemyRect(target);
                    const targetX = targetRect.left + targetRect.width / 2;
                    const targetY = targetRect.top + targetRect.height / 2;
                    const dx = targetX - missile.x;
                    const dy = targetY - missile.y;
                    const distance = Math.max(1, Math.hypot(dx, dy));
                    missile.vx = lerp(missile.vx, (dx / distance) * (ENEMY_MISSILE_SPEED * 1.35), 0.24);
                    missile.vy = lerp(missile.vy, (dy / distance) * (ENEMY_MISSILE_SPEED * 1.35), 0.24);

                    if (rectOverlapArea(this.missileRect(missile), targetRect) > 18) {
                        const hit = this.damageEnemy(target, {
                            projectile: true,
                            damage: 2,
                            intensity: target.type === 'boss' ? 'hard' : 'medium',
                            impactRect: this.missileRect(missile),
                        });
                        this.runnerOnEnemyHit?.(hit);
                        missile.element.classList.add('gw-enemy-missile--pop');
                        this.removeLater(missile.element, 180);
                        continue;
                    }
                }
            }

            missile.x += missile.vx * delta;
            missile.y += missile.vy * delta;
            const angle = Math.atan2(missile.vy, missile.vx) * 180 / Math.PI;
            missile.element.style.left = `${missile.x}px`;
            missile.element.style.top = `${missile.y}px`;
            missile.element.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
            const missileRect = this.missileRect(missile);

            if (!missile.parried && ((shielding && rectOverlapArea(missileRect, shieldRect) > 6) || (striking && rectOverlapArea(missileRect, meleeRect) > 8))) {
                this.parryMissile(missile);
                remaining.push(missile);
                continue;
            }

            if (!missile.parried && rectOverlapArea(missileRect, runnerRect) > 12) {
                this.impactBurstAt(missileRect, 'soft');
                this.shakeScreen('soft');
                this.damagePlayer(1, 'missile');
                missile.element.classList.add('gw-enemy-missile--pop');
                this.removeLater(missile.element, 180);
                continue;
            }

            if (!missile.parried && Math.hypot(missile.x - missile.targetX, missile.y - missile.targetY) < 22) {
                const textHit = this.textBreaker?.destroyAtRect(missileRect, { limit: 1, source: 'enemy_missile' });
                if (textHit?.count > 0) {
                    this.rebuildRoomCollisionCache();
                    this.bumpStageStat('enemyBroken', textHit.count);
                    this.impactBurstAt(textHit.rect, textHit.chars?.some(Boolean) ? 'medium' : 'soft');
                    if (this.criticalDestroyed(textHit)) {
                        this.failStage('critical_missile');
                    }
                } else {
                    this.impactBurstAt(missileRect, 'soft');
                }
                missile.element.classList.add('gw-enemy-missile--pop');
                this.removeLater(missile.element, 180);
                continue;
            }

            const outOfView = missile.x < -80
                || missile.x > window.innerWidth + 80
                || missile.y < -90
                || missile.y > window.innerHeight + 90;
            if (missile.age > ENEMY_MISSILE_LIFETIME || outOfView || this.stageCleared || this.stageFailed) {
                missile.element.remove();
                continue;
            }

            remaining.push(missile);
        }

        this.enemyMissiles = remaining;
    }

    parryMissile(missile) {
        if (missile.parried) {
            return;
        }

        missile.parried = true;
        missile.element.classList.add('gw-enemy-missile--parried');
        missile.vx *= -1.28;
        missile.vy = Math.min(missile.vy * -0.72, -90);
        this.impactBurstAt(this.missileRect(missile), 'medium');
        this.shakeScreen('soft');
        this.onRunnerSound('lock', { volume: 0.14, rate: 1.18 });
        this.showMessage(UI_TEXT.missileParry, 1100);
    }

    missileRect(missile) {
        const size = missile.element.classList.contains('gw-enemy-missile--boss') ? 34 : 26;
        return {
            left: missile.x - size / 2,
            top: missile.y - size / 2,
            width: size,
            height: size,
            right: missile.x + size / 2,
            bottom: missile.y + size / 2,
        };
    }

    nearestEnemyFromPoint(x, y, facing = 1) {
        let bestEnemy = null;
        let bestScore = Infinity;

        for (const enemy of this.activeEnemies()) {
            const rect = this.enemyRect(enemy);
            if (rect.right < -20 || rect.left > window.innerWidth + 20 || rect.bottom < -20 || rect.top > window.innerHeight + 20) {
                continue;
            }

            const score = enemyAimScore(enemy, x, y, facing);

            if (score < bestScore) {
                bestScore = score;
                bestEnemy = enemy;
            }
        }

        return bestEnemy;
    }

    updateEnemyTarget(enemy, time) {
        if (time < enemy.nextTargetPickAt && enemy.targetRect) {
            return;
        }

        enemy.nextTargetPickAt = time + randomBetween(760, 1500);
        const candidates = this.runnerTargets
            .filter((target) => target.type !== 'action')
            .map((target) => liveRectForTarget(target))
            .filter((rect) => rect.width > 16 && rect.height > 12 && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth);

        if (candidates.length === 0) {
            enemy.targetRect = this.enemyRoamTarget(enemy);
            return;
        }

        const enemyCenterX = enemy.x + enemy.width / 2;
        const enemyCenterY = enemy.y + enemy.height / 2;
        const farCandidates = candidates.filter((rect) => Math.hypot((rect.left + rect.width / 2) - enemyCenterX, (rect.top + rect.height / 2) - enemyCenterY) > 120);
        const pool = farCandidates.length > 0 ? farCandidates : candidates;
        const picked = pool[Math.floor(Math.random() * pool.length)];
        const jitterX = randomBetween(-80, 80);
        const jitterY = randomBetween(-54, 54);

        enemy.targetRect = {
            left: clamp(picked.left + jitterX, 24, window.innerWidth - 120),
            top: clamp(picked.top + jitterY, 70, window.innerHeight - 150),
            width: Math.min(140, Math.max(80, picked.width)),
            height: Math.min(90, Math.max(52, picked.height)),
            right: clamp(picked.left + jitterX, 24, window.innerWidth - 120) + Math.min(140, Math.max(80, picked.width)),
            bottom: clamp(picked.top + jitterY, 70, window.innerHeight - 150) + Math.min(90, Math.max(52, picked.height)),
        };
    }

    enemyFallbackTarget(enemy) {
        return this.enemyRoamTarget(enemy);
    }

    enemyRoamTarget(enemy) {
        const awayX = enemy.x < window.innerWidth / 2 ? randomBetween(window.innerWidth * 0.48, window.innerWidth - 150) : randomBetween(40, window.innerWidth * 0.52);
        const awayY = enemy.y < window.innerHeight / 2 ? randomBetween(window.innerHeight * 0.46, window.innerHeight - 150) : randomBetween(74, window.innerHeight * 0.54);

        return {
            left: clamp(awayX, 40, window.innerWidth - 160),
            top: clamp(awayY, 90, window.innerHeight - 160),
            width: 120,
            height: 80,
            right: clamp(awayX, 40, window.innerWidth - 160) + 120,
            bottom: clamp(awayY, 90, window.innerHeight - 160) + 80,
        };
    }

    enemyAttackPage(enemy) {
        const attackRect = this.enemyAttackRect(enemy);
        enemy.element.classList.add('gw-enemy--attack');
        const timer = window.setTimeout(() => {
            enemy.element?.classList.remove('gw-enemy--attack');
            this.timers.delete(timer);
        }, 360);
        this.timers.add(timer);

        if (this.runnerState && rectOverlapArea(attackRect, this.runnerPhysicsRect()) > 18) {
            this.damagePlayer(enemy.type === 'boss' ? 2 : 1, 'enemy_attack');
            return;
        }

        const textHit = this.textBreaker?.destroyAtRect(attackRect, { limit: enemy.type === 'boss' ? 2 : 1, source: 'enemy' });
        if (textHit?.count > 0) {
            this.rebuildRoomCollisionCache();
            this.bumpStageStat('enemyBroken', textHit.count);
            this.impactBurstAt(textHit.rect, enemy.type === 'boss' ? 'hard' : 'medium');
            this.shakeScreen(enemy.type === 'boss' ? 'medium' : 'soft');
            if (this.criticalDestroyed(textHit)) {
                this.failStage('critical_enemy_attack');
                return;
            }
            this.showMessage(UI_TEXT.enemyDamage, 1500);
            return;
        }

        const imageHit = this.imageBreaker?.hitAtRect(attackRect, { direction: enemy.vx >= 0 ? 1 : -1 });
        if (imageHit?.count > 0) {
            this.rebuildRoomCollisionCache();
            this.bumpStageStat('imagesDamaged', 1);
            this.impactBurstAt(imageHit.rect, enemy.type === 'boss' ? 'hard' : 'medium');
            this.spawnImageChips(imageHit.rect, enemy.vx >= 0 ? 1 : -1, Boolean(imageHit.destroyed));
            this.shakeScreen('medium');
            this.showMessage(UI_TEXT.enemyAttack, 1500);
        }
    }

    enemyAttackRect(enemy) {
        const direction = enemy.vx >= 0 ? 1 : -1;
        const left = direction > 0 ? enemy.x + enemy.width - 4 : enemy.x - 44;
        const top = enemy.y + enemy.height * 0.2;
        const width = enemy.type === 'boss' ? 78 : 52;
        const height = enemy.type === 'boss' ? 62 : 42;

        return {
            left,
            top,
            width,
            height,
            right: left + width,
            bottom: top + height,
        };
    }

    renderEnemy(enemy) {
        enemy.element.style.left = `${enemy.x}px`;
        enemy.element.style.top = `${enemy.y}px`;
        enemy.element.classList.toggle('gw-enemy--left', enemy.vx < 0);
        enemy.element.classList.toggle('gw-enemy--hit', currentTime() < enemy.hitUntil);
        enemy.element.classList.toggle('gw-enemy--locked', enemy.id === this.lockedEnemyId);
        const hpFill = enemy.element.querySelector('.gw-enemy__hp span');
        if (hpFill) {
            hpFill.style.width = `${Math.max(0, enemy.hp / enemy.maxHp) * 100}%`;
        }
    }

    hitEnemyAtRect(rect, options = {}) {
        const bestEnemy = this.enemyAtRect(rect, options.minOverlap || 18);

        if (!bestEnemy) {
            return null;
        }

        return this.damageEnemy(bestEnemy, {
            knockbackDirection: this.runnerState?.direction || (bestEnemy.vx >= 0 ? 1 : -1),
            damage: options.damage || 1,
            intensity: options.intensity || 'medium',
            impactRect: options.impactRect,
            charged: Boolean(options.charged),
        });
    }

    enemyAtRect(rect, minOverlap = 12) {
        let bestEnemy = null;
        let bestOverlap = 0;

        for (const enemy of this.enemies) {
            if (enemy.defeated) {
                continue;
            }

            const overlap = rectOverlapArea(rect, this.enemyRect(enemy));
            if (overlap > bestOverlap) {
                bestOverlap = overlap;
                bestEnemy = enemy;
            }
        }

        if (!bestEnemy || bestOverlap < minOverlap) {
            return null;
        }

        return bestEnemy;
    }

    damageEnemy(enemy, options = {}) {
        const direction = options.knockbackDirection || this.runnerState?.direction || (enemy.vx >= 0 ? 1 : -1);
        const baseDamage = options.damage || 1;
        const projectile = Boolean(options.projectile);
        const charged = Boolean(options.charged);
        const damage = baseDamage + (!projectile && this.hammerBoostActive() ? 1 : 0);
        const impactRect = options.impactRect || this.enemyRect(enemy);
        const intensity = options.intensity || (enemy.type === 'boss' ? 'hard' : 'medium');
        const shake = options.shake || (charged || intensity === 'hard' ? 'medium' : (intensity === 'medium' ? 'soft' : 'soft'));

        enemy.hp -= damage;
        enemy.hitUntil = currentTime() + (projectile ? 250 + damage * 72 : (charged ? 390 : 280));
        enemy.vx += direction * (projectile ? 78 + damage * 42 : (charged ? 210 + damage * 32 : 150));
        enemy.vy -= projectile ? 28 + damage * 16 : (charged ? 58 : 35);
        this.impactBurstAt(impactRect, intensity);
        this.shakeScreen(shake);

        if (enemy.hp <= 0) {
            enemy.defeated = true;
            enemy.element.classList.add('gw-enemy--defeated');
            if (this.lockedEnemyId === enemy.id) {
                this.lockedEnemyId = null;
                this.lockedEnemyManual = false;
            }
            if (!enemy.countedDefeat) {
                enemy.countedDefeat = true;
                this.bumpStageStat('enemiesDefeated', 1);
            }
            this.removeLater(enemy.element, 720);
            this.showMessage(enemy.type === 'boss' ? UI_TEXT.bossDefeat : UI_TEXT.enemyDefeat, 2100);
        } else {
            this.showMessage(UI_TEXT.enemyHit, 900);
        }

        return {
            count: 1,
            enemy_type: enemy.type,
            enemy_id: enemy.id,
            defeated: enemy.defeated,
            hp: Math.max(0, enemy.hp),
            damage,
            source: projectile ? 'word_throw' : (charged ? 'charged_melee' : 'melee'),
            rect: this.enemyRect(enemy),
        };
    }

    enemyRect(enemy) {
        return {
            left: enemy.x,
            top: enemy.y,
            width: enemy.width,
            height: enemy.height,
            right: enemy.x + enemy.width,
            bottom: enemy.y + enemy.height,
        };
    }

    hitLinkGateAtRect(rect) {
        let bestGate = null;
        let bestOverlap = 0;

        for (const gate of this.linkGates) {
            if (gate.destroyed || gate.element.hidden) {
                continue;
            }

            const gateRect = gate.element.getBoundingClientRect();
            const overlap = rectOverlapArea(rect, gateRect);
            if (overlap > bestOverlap) {
                bestOverlap = overlap;
                bestGate = gate;
            }
        }

        if (!bestGate || bestOverlap < 16) {
            return null;
        }

        const gateRect = bestGate.element.getBoundingClientRect();
        if (this.textBreaker?.hasUnbrokenText(bestGate.target.element)) {
            return {
                count: 0,
                blocked: true,
                href: bestGate.href,
                selector: bestGate.target.selector,
                text: bestGate.target.text,
                rect: gateRect,
            };
        }

        bestGate.destroyed = true;
        if (this.linkGateCharge?.gate === bestGate) {
            this.resetLinkGateCharge();
        }
        bestGate.element.classList.add('gw-link-gate--broken');
        this.removeLater(bestGate.element, 620);

        return {
            count: 1,
            href: bestGate.href,
            selector: bestGate.target.selector,
            text: bestGate.target.text,
            rect: gateRect,
        };
    }

    hitAccordionAtRect(rect, options = {}) {
        let bestTarget = null;
        let bestRect = null;
        let bestScore = 0;

        for (const target of this.visibleRunnerTargets()) {
            if (target.type !== 'accordion') {
                continue;
            }

            const targetRect = liveRectForTarget(target);
            const overlap = rectOverlapArea(rect, targetRect);
            if (overlap <= 0) {
                continue;
            }

            const centerDistance = Math.abs(
                (targetRect.left + targetRect.width / 2) - (rect.left + rect.width / 2)
            );
            const score = overlap - centerDistance * 0.2;
            if (score > bestScore) {
                bestTarget = target;
                bestRect = targetRect;
                bestScore = score;
            }
        }

        if (!bestTarget || bestScore < 12) {
            return null;
        }

        const toggled = this.toggleAccordionTarget(bestTarget, options);
        return {
            count: 1,
            target: bestTarget,
            selector: bestTarget.selector,
            text: bestTarget.text,
            rect: bestRect || liveRectForTarget(bestTarget),
            opened: toggled.opened,
        };
    }

    criticalDestroyed(textHit) {
        if (!textHit) {
            return false;
        }

        const destroyedCritical = Boolean(textHit.critical)
            || Boolean(textHit.items?.some((item) => item.critical))
            || Boolean(textHit.criticalWord);
        if (!destroyedCritical) {
            return false;
        }

        this.criticalWordLost = true;
        return true;
    }

    checkGateEntry() {
        if (!this.runnerState || currentTime() < this.gateCooldownUntil) {
            this.resetLinkGateCharge();
            return;
        }

        const runnerRect = {
            left: this.runnerState.x + 8,
            top: this.runnerState.y + 8,
            right: this.runnerState.x + RUNNER_WIDTH - 8,
            bottom: this.runnerState.y + RUNNER_HEIGHT - 3,
            width: RUNNER_WIDTH - 16,
            height: RUNNER_HEIGHT - 11,
        };

        let activeGate = null;
        let activeGateRect = null;
        for (const gate of this.linkGates) {
            if (gate.destroyed || gate.element.hidden) {
                continue;
            }

            const gateRect = gate.element.getBoundingClientRect();
            const overlap = rectOverlapArea(runnerRect, gateRect);
            if (overlap < Math.min(420, gateRect.width * gateRect.height * 0.22)) {
                continue;
            }

            activeGate = gate;
            activeGateRect = gateRect;
            break;
        }

        if (!activeGate) {
            this.resetLinkGateCharge();
            return;
        }

        const horizontalSpeed = Math.abs(this.runnerState.vx);
        const verticalSpeed = Math.abs(this.runnerState.vy);
        if (horizontalSpeed > LINK_GATE_STILL_SPEED || verticalSpeed > LINK_GATE_MAX_VERTICAL_SPEED) {
            this.resetLinkGateCharge(activeGate);
            return;
        }

        const now = currentTime();
        if (!this.linkGateCharge || this.linkGateCharge.gate !== activeGate) {
            this.resetLinkGateCharge();
            this.linkGateCharge = {
                gate: activeGate,
                startedAt: now,
                messageShown: false,
            };
            activeGate.element.classList.add('gw-link-gate--charging');
        }

        const progress = clamp((now - this.linkGateCharge.startedAt) / LINK_GATE_DWELL_MS, 0, 1);
        this.updateLinkGateCharge(activeGate, activeGateRect, progress);
        if (!this.linkGateCharge.messageShown && progress > 0.22) {
            this.linkGateCharge.messageShown = true;
            this.showMessage(UI_TEXT.gateCharge, 900);
            this.onRunnerSound('uiMove', { volume: 0.06, rate: 1.12 });
        }

        if (progress >= 1) {
            this.enterLinkGate(activeGate);
        }
    }

    enterLinkGate(gate) {
        this.gateCooldownUntil = currentTime() + 1800;
        this.resetLinkGateCharge(gate);
        gate.element.classList.add('gw-link-gate--enter');
        this.showMessage(UI_TEXT.gateReady, 1100);
        this.onRunnerSound('warp', { volume: 0.11, rate: 1.02 });

        const timer = window.setTimeout(() => {
            this.onNavigate(gate.href);
            this.timers.delete(timer);
        }, 260);

        this.timers.add(timer);
    }

    updateLinkGateCharge(gate, gateRect, progress) {
        gate.element.style.setProperty('--gw-gate-charge', `${Math.round(progress * 100)}%`);
        gate.meter?.style.setProperty('--gw-gate-charge', `${Math.round(progress * 100)}%`);

        const gauge = this.ensureLinkGateGauge();
        if (!gauge || !this.runnerState) {
            return;
        }

        const centerX = this.runnerState.x + RUNNER_WIDTH / 2;
        const centerY = this.runnerState.y + RUNNER_HEIGHT / 2;
        gauge.hidden = false;
        gauge.style.left = `${centerX}px`;
        gauge.style.top = `${centerY}px`;
        gauge.style.setProperty('--gw-gate-charge', `${Math.round(progress * 100)}%`);
        gauge.style.setProperty('--gw-gate-width', `${Math.max(58, Math.min(96, gateRect.width * 0.72))}px`);
    }

    ensureLinkGateGauge() {
        if (this.linkGateGauge?.isConnected) {
            return this.linkGateGauge;
        }

        if (!this.effectLayer) {
            return null;
        }

        this.linkGateGauge = document.createElement('span');
        this.linkGateGauge.className = 'gw-link-gate-charge';
        this.linkGateGauge.setAttribute('aria-hidden', 'true');
        this.linkGateGauge.hidden = true;
        this.effectLayer.appendChild(this.linkGateGauge);
        return this.linkGateGauge;
    }

    resetLinkGateCharge(nextGate = null) {
        if (this.linkGateCharge?.gate && this.linkGateCharge.gate !== nextGate) {
            this.linkGateCharge.gate.element.classList.remove('gw-link-gate--charging');
            this.linkGateCharge.gate.element.style.removeProperty('--gw-gate-charge');
            this.linkGateCharge.gate.meter?.style.removeProperty('--gw-gate-charge');
        }

        if (!nextGate) {
            this.linkGateCharge = null;
            if (this.linkGateGauge) {
                this.linkGateGauge.hidden = true;
                this.linkGateGauge.style.removeProperty('--gw-gate-charge');
            }
            return;
        }

        this.linkGateCharge = null;
        nextGate.element.classList.remove('gw-link-gate--charging');
        nextGate.element.style.removeProperty('--gw-gate-charge');
        nextGate.meter?.style.removeProperty('--gw-gate-charge');
        if (this.linkGateGauge) {
            this.linkGateGauge.hidden = true;
            this.linkGateGauge.style.removeProperty('--gw-gate-charge');
        }
    }

    mountGoalGate() {
        this.goalGate?.remove();
        this.goalGate = document.createElement('div');
        this.goalGate.className = 'gw-goal-gate';
        this.goalGate.setAttribute('aria-hidden', 'true');
        this.goalGate.hidden = true;
        this.goalGate.innerHTML = `<span>${UI_TEXT.goalGate}</span><small>${UI_TEXT.goalEnd}</small>`;
        this.effectLayer?.appendChild(this.goalGate);
        this.updateGoalGate(true);
    }

    updateGoalGate(force = false) {
        if (!this.goalGate || this.stageCleared) {
            return;
        }

        const progress = pageScrollProgress();
        const reveal = progress >= GOAL_REVEAL_PROGRESS || isNearPageBottom();
        if (!reveal) {
            this.goalGate.hidden = true;
            this.goalRevealed = false;
            return;
        }

        const wasHidden = this.goalGate.hidden;
        this.goalGate.hidden = false;
        this.goalRevealed = true;
        this.nextGoalHref = this.currentGoalHref();
        const hasChests = this.hasGoalChests();
        const opened = Math.min(this.openedChestCount(), GOAL_REQUIRED_CHESTS);
        const label = hasChests
            ? (this.nextGoalHref ? UI_TEXT.goalNext : UI_TEXT.goalEnd)
            : `${UI_TEXT.chestProgressLabel} ${opened}/${GOAL_REQUIRED_CHESTS}`;
        this.goalGate.innerHTML = `<span>${UI_TEXT.goalGate}</span><small>${label}</small>`;

        const bounds = this.currentPlayBounds();
        const width = Math.min(180, Math.max(132, bounds.right - bounds.left - 24));
        const left = clamp((bounds.left + bounds.right) / 2 - width / 2, 12, window.innerWidth - width - 12);
        this.goalGate.style.left = `${left}px`;
        this.goalGate.style.top = `${Math.max(86, window.innerHeight - 148)}px`;
        this.goalGate.style.width = `${width}px`;

        if ((wasHidden || force) && wasHidden) {
            this.showMessage(hasChests ? UI_TEXT.goalReady : UI_TEXT.collectMission, 2200);
            this.onRunnerSound('cheer', { volume: 0.12, rate: 1.04 });
        }

        this.updateMissionHud(force || wasHidden);
    }

    checkGoalEntry() {
        if (!this.runnerState || !this.goalGate || this.goalGate.hidden || this.stageCleared || currentTime() < this.gateCooldownUntil) {
            return;
        }

        if (this.stageFailed) {
            this.showMessage(UI_TEXT.goalBlocked, 1300);
            return;
        }

        const runnerRect = {
            left: this.runnerState.x + 6,
            top: this.runnerState.y + 6,
            right: this.runnerState.x + RUNNER_WIDTH - 6,
            bottom: this.runnerState.y + RUNNER_HEIGHT - 2,
            width: RUNNER_WIDTH - 12,
            height: RUNNER_HEIGHT - 8,
        };
        const goalRect = this.goalGate.getBoundingClientRect();
        const overlap = rectOverlapArea(runnerRect, goalRect);
        if (overlap < Math.min(520, goalRect.width * goalRect.height * 0.18)) {
            return;
        }

        if (!this.hasGoalChests()) {
            const remaining = GOAL_REQUIRED_CHESTS - Math.min(this.openedChestCount(), GOAL_REQUIRED_CHESTS);
            this.gateCooldownUntil = currentTime() + 1000;
            this.showMessage(UI_TEXT.goalNeedsChests.replace('{count}', String(remaining)), 1300);
            this.onRunnerSound('uiCancel', { volume: 0.08, rate: 1.05 });
            return;
        }

        this.finishStage('goal_gate');
    }

    damagePlayer(amount = 1, reason = 'damage') {
        if (!this.runnerState || this.stageCleared || this.stageFailed) {
            return;
        }

        const incoming = Math.max(1, Math.round(amount));
        const damage = this.shieldBoostActive() ? Math.max(0, incoming - 1) : incoming;
        if (damage <= 0) {
            this.impactBurstAt(this.runnerPhysicsRect(), 'soft');
            this.showMessage(UI_TEXT.itemShield, 900);
            this.onRunnerSound('uiMove', { volume: 0.08, rate: 1.1 });
            return;
        }

        this.playerLife = Math.max(0, this.playerLife - damage);
        const rect = this.runnerPhysicsRect();
        this.runner?.classList.add('gw-pixel-runner--damage');
        const timer = window.setTimeout(() => {
            this.runner?.classList.remove('gw-pixel-runner--damage');
            this.timers.delete(timer);
        }, 420);
        this.timers.add(timer);

        this.impactBurstAt(rect, damage >= 2 ? 'medium' : 'soft');
        this.shakeScreen(damage >= 2 ? 'medium' : 'soft');
        this.onRunnerSound('hitMedium', { volume: damage >= 2 ? 0.15 : 0.1, rate: damage >= 2 ? 0.92 : 1.08 });
        this.updateMissionHud(true);

        if (this.playerLife <= 0) {
            this.failStage(`life_zero_${reason}`);
            return;
        }

        this.showMessage(UI_TEXT.playerDamage, 1300);
    }

    failStage(reason = 'critical_lost') {
        if (this.stageCleared || this.stageFailed) {
            return;
        }

        const reasonText = String(reason || '');
        const criticalLost = reasonText.includes('critical');
        this.stageFailed = true;
        this.criticalWordLost = criticalLost;
        this.gateCooldownUntil = currentTime() + 3000;
        this.goalGate?.classList.add('gw-goal-gate--failed');
        this.missionHud?.classList.add('gw-mission-hud--danger');
        this.clearAttackCharge();
        this.dropHeldLetter();
        for (const missile of this.enemyMissiles) {
            missile.element.classList.add('gw-enemy-missile--pop');
            this.removeLater(missile.element, 160);
        }
        this.enemyMissiles = [];
        this.showMessage(criticalLost ? UI_TEXT.stageFailed : UI_TEXT.gameOverLife, 2800);
        this.shakeScreen('hard');
        this.onRunnerSound('enemyExplode', { volume: 0.16, rate: 0.92 });
        this.clearRewardPromise = null;
        this.onStageClear(this.stageResult(reason));
        this.updateMissionHud(true);
        this.showGameOver(reason);
    }

    showGameOver(reason = '') {
        this.gameOverPanel?.remove();
        this.gameOverPanel = document.createElement('section');
        this.gameOverPanel.className = 'gw-game-over';
        this.gameOverPanel.setAttribute('role', 'dialog');
        this.gameOverPanel.setAttribute('aria-modal', 'true');
        this.gameOverPanel.setAttribute('aria-label', UI_TEXT.gameOverTitle);

        const reasonText = String(reason || '');
        const message = reasonText.includes('life') ? UI_TEXT.gameOverLife : UI_TEXT.gameOverCritical;
        this.gameOverPanel.innerHTML = `
            <div class="gw-game-over__panel">
                <h2>${UI_TEXT.gameOverTitle}</h2>
                <p>${message}</p>
                <p>${UI_TEXT.gameOverHint}</p>
                <div class="gw-game-over__actions">
                    <button type="button" class="gw-game-over__retry">${UI_TEXT.retry}</button>
                    <button type="button" class="gw-game-over__exit">${UI_TEXT.exit}</button>
                </div>
            </div>
        `;

        this.root?.appendChild(this.gameOverPanel);
        this.gameOverPanel.querySelector('.gw-game-over__retry')?.addEventListener('click', (event) => {
            event.preventDefault();
            this.onRetry();
        });
        this.gameOverPanel.querySelector('.gw-game-over__exit')?.addEventListener('click', (event) => {
            event.preventDefault();
            this.onExit();
        });
        this.gameOverPanel.querySelector('.gw-game-over__retry')?.focus({ preventScroll: true });
    }

    finishStage(reason = 'goal_gate') {
        if (this.stageCleared || this.stageFailed) {
            return;
        }

        this.stageCleared = true;
        this.gateCooldownUntil = currentTime() + 3000;
        this.goalGate?.classList.add('gw-goal-gate--clear');
        const burstCount = this.explodeEnemiesForStageClear();
        this.showMessage(burstCount > 0 ? UI_TEXT.stageClearBurst : UI_TEXT.stageClear, 2400);
        this.shakeScreen(burstCount > 0 ? 'hard' : 'medium');
        this.onRunnerSound('stageClear', { volume: 0.075, cheerVolume: 0.06, fadeMs: 620, rate: 1 });
        this.clearRewardPromise = Promise.resolve(this.onStageClear(this.stageResult(reason))).catch(() => null);

        const timer = window.setTimeout(() => {
            this.showEndRoll();
            this.timers.delete(timer);
        }, this.reducedMotion ? 120 : (burstCount > 0 ? 1280 : 720));
        this.timers.add(timer);
    }

    explodeEnemiesForStageClear() {
        const enemies = this.activeEnemies();
        if (enemies.length === 0) {
            return 0;
        }

        enemies.forEach((enemy, index) => {
            enemy.defeated = true;
            enemy.stageClearPending = true;
            enemy.hp = 0;
            enemy.vx = 0;
            enemy.vy = 0;
            if (!enemy.countedDefeat) {
                enemy.countedDefeat = true;
                this.bumpStageStat('enemiesDefeated', 1);
            }
            if (this.lockedEnemyId === enemy.id) {
                this.lockedEnemyId = null;
                this.lockedEnemyManual = false;
            }

            const delay = this.reducedMotion ? 0 : index * 140;
            const timer = window.setTimeout(() => {
                this.explodeEnemyForStageClear(enemy, index);
                this.timers.delete(timer);
            }, delay);
            this.timers.add(timer);
        });

        return enemies.length;
    }

    explodeEnemyForStageClear(enemy, index = 0) {
        if (!enemy || !enemy.element?.isConnected || (enemy.defeated && !enemy.stageClearPending)) {
            return;
        }

        const rect = this.enemyRect(enemy);
        enemy.stageClearPending = false;
        enemy.defeated = true;
        enemy.hp = 0;
        enemy.vx = 0;
        enemy.vy = 0;
        if (!enemy.countedDefeat) {
            enemy.countedDefeat = true;
            this.bumpStageStat('enemiesDefeated', 1);
        }

        if (this.lockedEnemyId === enemy.id) {
            this.lockedEnemyId = null;
            this.lockedEnemyManual = false;
        }

        enemy.element.classList.remove('gw-enemy--hit', 'gw-enemy--attack', 'gw-enemy--locked');
        enemy.element.classList.add('gw-enemy--goal-explode');
        enemy.element.style.setProperty('--gw-pop-x', `${randomBetween(-18, 18)}px`);
        enemy.element.style.setProperty('--gw-pop-y', `${randomBetween(-28, -12)}px`);
        this.renderEnemy(enemy);
        this.spawnEnemyBlast(rect, enemy.type === 'boss');
        this.impactBurstAt(rect, enemy.type === 'boss' ? 'hard' : 'medium');
        this.shakeScreen(enemy.type === 'boss' ? 'hard' : 'medium');
        this.onRunnerSound('enemyExplode', {
            volume: enemy.type === 'boss' ? 0.2 : 0.13,
            rate: enemy.type === 'boss' ? 0.86 : 0.96 + index * 0.04,
        });
        this.removeLater(enemy.element, enemy.type === 'boss' ? 1050 : 860);
    }

    spawnEnemyBlast(rect, boss = false) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const blast = document.createElement('span');
        blast.className = `gw-enemy-blast${boss ? ' gw-enemy-blast--boss' : ''}`;
        blast.style.left = `${centerX}px`;
        blast.style.top = `${centerY}px`;
        this.addTemporaryEffect(blast, boss ? 820 : 680);

        const smokeCount = boss ? 8 : 5;
        for (let index = 0; index < smokeCount; index += 1) {
            const smoke = document.createElement('span');
            smoke.className = 'gw-enemy-smoke';
            smoke.style.left = `${centerX + randomBetween(-18, 18)}px`;
            smoke.style.top = `${centerY + randomBetween(-18, 18)}px`;
            smoke.style.setProperty('--gw-x', `${randomBetween(-80, 80)}px`);
            smoke.style.setProperty('--gw-y', `${randomBetween(-74, 46)}px`);
            smoke.style.setProperty('--gw-s', `${randomBetween(0.72, boss ? 1.5 : 1.1)}`);
            smoke.style.setProperty('--gw-d', `${randomBetween(0, 70)}ms`);
            this.addTemporaryEffect(smoke, boss ? 980 : 820);
        }
    }

    currentGoalHref() {
        const currentUrl = normalizeUrl(window.location.href);
        const gate = this.linkGates.find((item) => !item.destroyed
            && item.href
            && normalizeUrl(item.href) !== currentUrl);
        return gate?.href || '';
    }

    stageResult(reason = '') {
        return {
            reason,
            stage_name: window.GamingWebConfig?.stageName || '',
            total_chars: this.stageStats.totalChars,
            protected_count: this.protectedCharCount(),
            player_broken_count: this.stageStats.playerBroken,
            enemy_broken_count: this.stageStats.enemyBroken,
            enemy_defeated_count: this.stageStats.enemiesDefeated,
            gates_broken: this.stageStats.gatesBroken,
            images_damaged: this.stageStats.imagesDamaged,
            goal_condition: 'chests_opened',
            letters_collected: this.collectedLetterCount(),
            letters_required: GOAL_REQUIRED_LETTERS,
            treasure_letters: this.treasureLetters.slice(),
            treasure_word: this.treasureWord(),
            critical_word: this.criticalWord || '',
            critical_lost: Boolean(this.criticalWordLost),
            chests_opened: this.stageStats.chestsOpened,
            chests_required: GOAL_REQUIRED_CHESTS,
            score_jewels: this.scoreJewels,
            player_life: this.playerLife,
            failed: Boolean(this.stageFailed),
            next_href: this.nextGoalHref || '',
        };
    }

    showEndRoll() {
        this.endRoll?.remove();
        this.endRoll = document.createElement('section');
        this.endRoll.className = 'gw-end-roll';
        this.endRoll.setAttribute('role', 'dialog');
        this.endRoll.setAttribute('aria-modal', 'true');
        this.endRoll.setAttribute('aria-label', UI_TEXT.stageClear);

        const stats = this.stageResult('end_roll');
        const nextButton = this.nextGoalHref
            ? `<button type="button" class="gw-end-roll__next">${UI_TEXT.goalNext}</button>`
            : '';
        const mapButton = this.worldMapAfterClear
            ? `<button type="button" class="gw-end-roll__map">${UI_TEXT.mapToggle}</button>`
            : '';
        const memoryItems = this.endRollItems.length > 0
            ? this.endRollItems.map((item) => `<p>${escapeHtml(item)}</p>`).join('')
            : `<p>${escapeHtml(document.title || UI_TEXT.endRollTitle)}</p>`;
        const summaryText = this.endRollSummary || normalizeText(document.title || UI_TEXT.endRollTitle);
        const summaryItems = summaryText.split('\n')
            .filter(Boolean)
            .map((line) => `<p>${escapeHtml(line)}</p>`)
            .join('');
        const treasureWord = stats.treasure_word || '';
        const treasureResult = treasureWord
            ? UI_TEXT.treasureResult.replace('{word}', escapeHtml(treasureWord))
            : '';

        this.endRoll.innerHTML = `
            <div class="gw-end-roll__panel">
                <h2>${UI_TEXT.stageClear}</h2>
                <dl class="gw-end-roll__stats">
                    <div><dt>${UI_TEXT.protectedLabel}</dt><dd>${stats.protected_count}</dd></div>
                    <div><dt>${UI_TEXT.chestProgressLabel}</dt><dd>${Math.min(stats.chests_opened, stats.chests_required)}/${stats.chests_required}</dd></div>
                    <div><dt>${UI_TEXT.collectedLabel}</dt><dd>${escapeHtml(treasureWord || UI_TEXT.treasureEmpty)}</dd></div>
                    <div><dt>${UI_TEXT.brokenLabel}</dt><dd>${stats.player_broken_count}</dd></div>
                    <div><dt>${UI_TEXT.lostLabel}</dt><dd>${stats.enemy_broken_count}</dd></div>
                    <div><dt>${UI_TEXT.defeatedLabel}</dt><dd>${stats.enemy_defeated_count}</dd></div>
                </dl>
                ${treasureResult ? `<p class="gw-end-roll__treasure">${treasureResult}</p>` : ''}
                ${this.hasReward ? `
                    <section class="gw-end-roll__reward" data-gw-clear-reward>
                        <h3>${UI_TEXT.rewardTitle}</h3>
                        <p>${UI_TEXT.rewardLoading}</p>
                    </section>
                ` : ''}
                <section class="gw-end-roll__summary">
                    <h3>${UI_TEXT.summaryTitle}</h3>
                    ${summaryItems}
                </section>
                <div class="gw-end-roll__viewport">
                    <div class="gw-end-roll__content">
                        <h3>${UI_TEXT.endRollTitle}</h3>
                        ${memoryItems}
                    </div>
                </div>
                <div class="gw-end-roll__actions">
                    ${mapButton}
                    ${nextButton}
                    <button type="button" class="gw-end-roll__close">${UI_TEXT.endRollClose}</button>
                </div>
            </div>
        `;

        this.root?.appendChild(this.endRoll);
        this.resolveClearReward();
        this.endRoll.querySelector('.gw-end-roll__close')?.addEventListener('click', (event) => {
            event.preventDefault();
            this.endRoll?.remove();
            this.endRoll = null;
            this.goalGate?.classList.add('gw-goal-gate--clear');
        });
        this.endRoll.querySelector('.gw-end-roll__next')?.addEventListener('click', (event) => {
            event.preventDefault();
            if (this.nextGoalHref) {
                this.onNavigate(this.nextGoalHref);
            }
        });
        this.endRoll.querySelector('.gw-end-roll__map')?.addEventListener('click', (event) => {
            event.preventDefault();
            this.onWorldMapOpen();
        });
    }

    resolveClearReward() {
        const rewardNode = this.endRoll?.querySelector('[data-gw-clear-reward]');
        if (!rewardNode) {
            return;
        }

        const rewardPromise = this.clearRewardPromise || Promise.resolve(null);
        rewardPromise.then((response) => {
            if (!rewardNode.isConnected) {
                return;
            }

            const reward = response?.reward_unlocked ? response.reward : null;
            if (!reward) {
                rewardNode.innerHTML = `
                    <h3>${UI_TEXT.rewardTitle}</h3>
                    <p>${UI_TEXT.rewardUnavailable}</p>
                `;
                return;
            }

            const title = reward.title || UI_TEXT.rewardTitle;
            const message = reward.message || '';
            const coupon = reward.coupon_code || '';
            const rewardUrl = safeRewardUrl(reward.reward_url || '');
            rewardNode.innerHTML = `
                <h3>${escapeHtml(title)}</h3>
                ${message ? `<p>${escapeHtml(message)}</p>` : ''}
                ${coupon ? `<div class="gw-end-roll__coupon"><span>${UI_TEXT.rewardCoupon}</span><code>${escapeHtml(coupon)}</code></div>` : ''}
                ${rewardUrl ? `<a class="gw-end-roll__reward-link" href="${escapeHtml(rewardUrl)}" target="_blank" rel="noopener">${UI_TEXT.rewardLink}</a>` : ''}
            `;
            this.onRunnerSound('collect', { volume: 0.12, rate: 1.08 });
        }).catch(() => {
            if (!rewardNode.isConnected) {
                return;
            }

            rewardNode.innerHTML = `
                <h3>${UI_TEXT.rewardTitle}</h3>
                <p>${UI_TEXT.rewardUnavailable}</p>
            `;
        });
    }

    updateRunnerPhysics(delta) {
        this.ensureRunnerDocumentState();
        this.syncRunnerScreenPosition();
        this.setRunnerPhysicsState('falling');

        if (this.runnerState.scrollPinned) {
            this.runnerState.scrollPinned = false;
        }

        const left = this.controlHeld('left');
        const right = this.controlHeld('right');
        const jump = this.controlHeld('jump');
        const shielding = this.controlHeld('shield');
        const runSpeed = shielding ? 145 : 250;
        const friction = this.runnerState.grounded ? 0.74 : 0.9;
        const gravity = 860;
        const maxFallSpeed = 540;
        const previousDocY = this.runnerState.docY;
        const wasGrounded = this.runnerState.grounded;
        const bounds = this.currentPlayBounds();
        const docBounds = this.runnerDocumentBounds(bounds);
        const oldBottom = this.runnerState.docY + RUNNER_HEIGHT;

        if (left && !right) {
            this.runnerState.vx = -runSpeed;
            this.runnerState.direction = -1;
        } else if (right && !left) {
            this.runnerState.vx = runSpeed;
            this.runnerState.direction = 1;
        } else {
            this.runnerState.vx *= friction;
            if (Math.abs(this.runnerState.vx) < 8) {
                this.runnerState.vx = 0;
            }
        }

        this.runnerState.docX = clamp(
            this.runnerState.docX + this.runnerState.vx * delta,
            docBounds.left,
            docBounds.right - RUNNER_WIDTH
        );
        this.syncRunnerScreenPosition();

        if (jump && this.runnerState.grounded) {
            this.runnerState.vy = -560;
            this.runnerState.grounded = false;
            this.runnerState.fallStartY = this.runnerState.docY;
            this.runnerState.fallSoundPlayed = false;
            this.onRunnerSound('jump', { volume: 0.14, rate: 1.04 });
        }

        if (this.runnerState.grounded && !jump) {
            const supportY = this.currentRunnerSupportDocY(this.runnerDocPhysicsRect());
            if (supportY !== null) {
                this.setRunnerPhysicsState('support-steady');
                this.runnerState.docY = supportY - RUNNER_HEIGHT;
                this.runnerState.vy = 0;
                this.syncRunnerScreenPosition();
                this.updateRunnerCamera(delta);
                return;
            }

            const worldGroundY = pageEndGroundDocY();
            if (this.runnerState.docY + RUNNER_HEIGHT >= worldGroundY - 2) {
                this.setRunnerPhysicsState('world-ground');
                this.runnerState.docY = worldGroundY - RUNNER_HEIGHT;
                this.runnerState.vy = 0;
                this.syncRunnerScreenPosition();
                this.updateRunnerCamera(delta);
                return;
            }

            this.setRunnerPhysicsState('lost-support');
            this.runnerState.grounded = false;
            this.runnerState.fallStartY = this.runnerState.docY;
            this.runnerState.fallSoundPlayed = false;
        }

        this.runnerState.vy = Math.min(this.runnerState.vy + gravity * delta, maxFallSpeed);
        this.runnerState.docY += this.runnerState.vy * delta;
        this.syncRunnerScreenPosition();
        const runnerRect = this.runnerPhysicsRect();

        if (wasGrounded && !jump && this.runnerAtSideWall(runnerRect)) {
            this.setRunnerPhysicsState('side-wall-stop');
            this.runnerState.docY = previousDocY;
            this.runnerState.vy = 0;
            this.runnerState.grounded = true;
            this.syncRunnerScreenPosition();
            return;
        }

        if (this.runnerState.vy >= 0) {
            const landingY = this.findRunnerLandingDocY(this.runnerDocPhysicsRect(), oldBottom, this.runnerState.docY + RUNNER_HEIGHT);
            if (landingY !== null) {
                this.setRunnerPhysicsState('land-surface');
                this.landRunnerAt(landingY, this.runnerState.vy);
                this.updateRunnerCamera(delta);
                return;
            }
        }

        const worldGroundY = pageEndGroundDocY();
        if (this.runnerState.docY + RUNNER_HEIGHT >= worldGroundY) {
            this.setRunnerPhysicsState('world-ground');
            this.landRunnerAt(worldGroundY, this.runnerState.vy);
            this.updateRunnerCamera(delta);
            return;
        }

        this.updateRunnerCamera(delta);
        this.maybePlayFallSound();
    }

    currentRunnerSupportY(rect) {
        const textSupportY = this.textBreaker?.findSupportY(rect);
        const imageSupportY = this.imageBreaker?.findSupportY(rect);
        return firstLandingY(textSupportY, imageSupportY);
    }

    currentRunnerSupportDocY(rect) {
        const cache = this.ensureRoomCollisionCache();
        const feet = rect.bottom;
        const accepts = (surfaceY) => surfaceY >= feet - 7 && surfaceY <= feet + 9;
        const textSupportY = cachedTextSurfaceY(cache?.textRects || [], rect, accepts);
        const imageSupportY = cachedRectSurfaceY(cache?.imageRects || [], rect, accepts);
        const placedSupportY = cachedRectSurfaceY(cache?.placedRects || [], rect, accepts);
        const cachedSupportY = firstLandingY(textSupportY, imageSupportY, placedSupportY);
        if (cachedSupportY !== null) {
            return cachedSupportY;
        }

        const liveTextSupportY = this.textBreaker?.findSupportDocY?.(rect);
        const liveImageSupportY = this.imageBreaker?.findSupportDocY?.(rect);
        return firstLandingY(liveTextSupportY, liveImageSupportY);
    }

    findRunnerLandingDocY(runnerRect, previousBottom, nextBottom) {
        const cache = this.ensureRoomCollisionCache();
        const accepts = (surfaceY) => surfaceY >= previousBottom - 5 && surfaceY <= nextBottom + 12;
        const textLandingY = cachedTextSurfaceY(cache?.textRects || [], runnerRect, accepts);
        const imageLandingY = cachedRectSurfaceY(cache?.imageRects || [], runnerRect, accepts);
        const placedLandingY = cachedRectSurfaceY(cache?.placedRects || [], runnerRect, accepts);
        const cachedLandingY = firstLandingY(textLandingY, imageLandingY, placedLandingY);
        if (cachedLandingY !== null) {
            return cachedLandingY;
        }

        const liveTextLandingY = this.textBreaker?.findLandingDocY?.(runnerRect, previousBottom, nextBottom);
        const liveImageLandingY = this.imageBreaker?.findLandingDocY?.(runnerRect, previousBottom, nextBottom);
        return firstLandingY(liveTextLandingY, liveImageLandingY);
    }

    shouldDropBeforeLanding(landingY) {
        if (!this.runnerState || this.runnerState.grounded || this.runnerState.vy < 0 || this.roomIndex >= this.rooms.length - 1) {
            return false;
        }

        const room = this.currentRoom();
        const landingScreenY = landingY - window.scrollY;
        return landingScreenY >= window.innerHeight - ROOM_SCREEN_DROP_GATE_GAP
            || landingY >= room.bottom - ROOM_DROP_MARGIN;
    }

    setRunnerPhysicsState(label) {
        if (this.runnerState) {
            this.runnerState.lastPhysics = label;
        }
    }

    shouldFollowToLowerText() {
        if (!this.runnerState || maxPageScrollY() - window.scrollY <= 1) {
            return false;
        }

        return this.shouldFallTowardLowerText();
    }

    shouldFallTowardLowerText() {
        return this.lowerTextSurfaceY() !== null;
    }

    lowerTextSurfaceY() {
        if (!this.runnerState) {
            return null;
        }

        return this.textBreaker?.findSupportBelowDocY?.(this.runnerDocPhysicsRect()) ?? null;
    }

    followRunnerFall(delta, options = {}) {
        if (!this.runnerState || this.runnerState.grounded) {
            return false;
        }

        return this.updateRunnerCamera(delta, { force: Boolean(options.force) });
    }

    landOnSurfaceAfterCameraScroll(actualScroll, delta) {
        if (!this.runnerState || actualScroll <= 0 || this.runnerState.vy < 0) {
            return false;
        }

        const runnerRect = this.runnerDocPhysicsRect();
        const previousBottom = runnerRect.bottom - Math.max(28, actualScroll + Math.max(this.runnerState.vy, 260) * delta);
        const landingY = this.findRunnerLandingDocY(runnerRect, previousBottom, runnerRect.bottom + 18);
        if (landingY === null) {
            return false;
        }

        this.setRunnerPhysicsState('camera-scroll-land-surface');
        this.landRunnerAt(landingY, this.runnerState.vy);
        return true;
    }

    updateRunnerCamera(delta, options = {}) {
        if (!this.runnerState) {
            return false;
        }

        this.ensureRunnerDocumentState();
        this.syncRunnerScreenPosition();
        if (this.runnerState.grounded) {
            this.cameraScrollVelocity *= 0.72;
            this.syncRoomToRunner();
            return false;
        }

        const runnerBottom = this.runnerState.docY + RUNNER_HEIGHT;
        const runnerScreenBottom = runnerBottom - window.scrollY;
        const followStartY = window.innerHeight * CAMERA_FOLLOW_START_RATIO;
        const followTargetY = window.innerHeight * CAMERA_FOLLOW_TARGET_RATIO;
        const desiredScrollY = runnerScreenBottom > followStartY
            ? runnerBottom - followTargetY
            : window.scrollY;
        const maxScroll = maxPageScrollY();
        const targetScrollY = clamp(desiredScrollY, 0, maxScroll);
        const distance = targetScrollY - window.scrollY;

        this.syncRoomToRunner();

        if (Math.abs(distance) < 0.5) {
            this.cameraScrollVelocity *= 0.82;
            return false;
        }

        const maxSpeed = CAMERA_FOLLOW_MAX_SPEED + Math.max(0, this.runnerState.vy || 0) * 0.45;
        const desiredVelocity = clamp(distance * CAMERA_FOLLOW_SPRING, -maxSpeed, maxSpeed);
        const ease = clamp(delta * CAMERA_FOLLOW_EASE, 0, 1);
        this.cameraScrollVelocity = lerp(this.cameraScrollVelocity, desiredVelocity, ease);
        const step = clamp(this.cameraScrollVelocity * delta, -Math.abs(distance), Math.abs(distance));
        const previousScrollY = window.scrollY;
        window.scrollTo(0, clamp(previousScrollY + step, 0, maxScroll));
        const actualScroll = window.scrollY - previousScrollY;
        if (Math.abs(actualScroll) < 0.5) {
            return false;
        }

        this.playBounds = this.calculatePlayBounds();
        this.syncRunnerScreenPosition();
        this.syncRoomToRunner();
        this.updateBrickRails();
        this.updateLinkGates();
        this.updateGoalGate(true);
        this.updateReturnRoute(true);
        this.syncPlacedLettersToScroll();
        return true;
    }

    syncRoomToRunner() {
        if (!this.runnerState || !this.rooms?.length) {
            return;
        }

        const nextRoomIndex = this.findRoomIndexForDocY(this.runnerState.docY + RUNNER_HEIGHT);
        if (nextRoomIndex === this.roomIndex && this.roomCollisionCache) {
            return;
        }

        this.roomIndex = nextRoomIndex;
        this.runnerState.roomIndex = nextRoomIndex;
        this.rebuildRoomCollisionCache();
    }

    hasVisibleLandingBeforeDropGate() {
        if (!this.runnerState || this.runnerState.vy < 0) {
            return false;
        }

        const rect = this.runnerDocPhysicsRect();
        const runnerBottom = this.runnerState.docY + RUNNER_HEIGHT;
        const landingY = this.findRunnerLandingDocY(rect, runnerBottom - 8, runnerBottom + 190);
        if (landingY === null) {
            return false;
        }

        const landingScreenY = landingY - window.scrollY;
        return landingScreenY < window.innerHeight - ROOM_SCREEN_DROP_GATE_GAP;
    }

    nextRoomIndexForDrop() {
        if (!this.runnerState || !this.rooms?.length) {
            return this.roomIndex + 1;
        }

        const minUsefulBottom = this.runnerState.docY + RUNNER_HEIGHT + Math.max(ROOM_MIN_HEIGHT, ROOM_DROP_NEXT_MIN_AHEAD_PX);
        for (let index = this.roomIndex + 1; index < this.rooms.length; index += 1) {
            if (this.rooms[index].bottom > minUsefulBottom) {
                return index;
            }
        }

        return Math.min(this.rooms.length - 1, this.roomIndex + 1);
    }

    startRoomDropTransition(nextIndex = this.roomIndex + 1) {
        if (!this.runnerState || this.roomTransition || nextIndex >= this.rooms.length) {
            return false;
        }

        const nextRoom = this.rooms[nextIndex];
        const fromScrollY = window.scrollY;
        const previewLandingY = this.previewLandingDocYForRoom(nextRoom);
        const targetLandingScreenY = clamp(window.innerHeight - 190, 330, Math.max(340, window.innerHeight - 96));
        const desiredScrollY = Number.isFinite(previewLandingY)
            ? previewLandingY - targetLandingScreenY
            : nextRoom.top;
        const toScrollY = clamp(Math.max(fromScrollY + 80, desiredScrollY), 0, maxPageScrollY());
        const distance = Math.abs(toScrollY - fromScrollY);

        if (distance < 2) {
            this.roomIndex = nextIndex;
            this.runnerState.roomIndex = nextIndex;
            this.rebuildRoomCollisionCache();
            return false;
        }

        this.clearAttackCharge();
        this.clearThrowHold();
        this.runnerState.transitioning = true;
        this.runnerState.cameraMode = 'room-transition';
        this.runnerState.grounded = false;
        this.runnerState.vy = Math.max(this.runnerState.vy, 380);
        this.runnerState.fallStartY = this.runnerState.docY;
        this.runnerState.fallSoundPlayed = false;
        this.setRunnerPhysicsState('room-drop');

        this.roomTransition = {
            fromScrollY,
            toScrollY,
            nextIndex,
            startedAt: currentTime(),
            duration: clamp(distance * 0.82, ROOM_TRANSITION_MIN_MS, ROOM_TRANSITION_MAX_MS),
            screenX: this.runnerState.x,
            fromScreenY: this.runnerState.y,
            toScreenY: clamp(ROOM_DROP_TARGET_MIN_Y, 180, Math.max(180, window.innerHeight - ROOM_DROP_TARGET_MAX_BOTTOM_GAP)),
        };

        this.runnerScrollFollowUntil = currentTime() + this.roomTransition.duration + 120;
        this.showMessage('DROP!', 720);
        this.onRunnerSound('fall', { volume: 0.08, rate: 1.02 });
        this.shakeScreen('soft');
        return true;
    }

    updateRoomDropTransition(time = currentTime()) {
        if (!this.runnerState || !this.roomTransition) {
            return false;
        }

        const transition = this.roomTransition;
        const progress = clamp((time - transition.startedAt) / transition.duration, 0, 1);
        const eased = easeInOut(progress);
        const nextScrollY = lerp(transition.fromScrollY, transition.toScrollY, eased);
        window.scrollTo(0, nextScrollY);
        this.playBounds = this.calculatePlayBounds();

        const screenY = lerp(transition.fromScreenY, transition.toScreenY, eased)
            + Math.sin(progress * Math.PI) * 34;
        const bounds = this.currentPlayBounds();
        const screenX = clamp(transition.screenX, bounds.left, bounds.right - RUNNER_WIDTH);
        this.runnerState.docX = window.scrollX + screenX;
        this.runnerState.docY = window.scrollY + screenY;
        this.runnerState.vy = Math.max(this.runnerState.vy, 360);
        this.syncRunnerScreenPosition();
        this.updateBrickRails();
        this.updateLinkGates();
        this.updateGoalGate(true);
        this.updateReturnRoute(true);
        this.syncPlacedLettersToScroll();

        if (progress >= 1) {
            this.finishRoomDropTransition();
        }

        return true;
    }

    finishRoomDropTransition() {
        if (!this.runnerState || !this.roomTransition) {
            return;
        }

        const nextIndex = this.roomTransition.nextIndex;
        this.roomTransition = null;
        this.roomIndex = nextIndex;
        this.runnerState.roomIndex = nextIndex;
        this.runnerState.transitioning = false;
        this.runnerState.cameraMode = 'room';
        this.runnerState.vy = 300;
        this.runnerState.grounded = false;
        this.playBounds = this.calculatePlayBounds();
        this.rebuildRoomCollisionCache();

        const rect = this.runnerDocPhysicsRect();
        const landingY = this.findRunnerLandingDocY(rect, rect.bottom - 18, rect.bottom + ROOM_DROP_LANDING_SEARCH_PX);
        const hudBottom = this.missionHud?.getBoundingClientRect?.().bottom || 0;
        const minLandingScreenY = Math.max(190, hudBottom + RUNNER_HEIGHT + 14);
        const landingScreenY = landingY === null ? Infinity : landingY - window.scrollY;
        if (landingY !== null && landingScreenY >= minLandingScreenY && landingScreenY < window.innerHeight - 86) {
            this.landRunnerAt(landingY, 430);
        } else {
            this.syncRunnerScreenPosition();
        }

        this.updateBrickRails();
        this.updateLinkGates();
        this.updateGoalGate(true);
        this.updateReturnRoute(true);
        this.syncPlacedLettersToScroll();
    }

    landRunnerAt(surfaceY, velocity) {
        const now = currentTime();
        const wasAirborne = !this.runnerState.grounded;
        const fallDistance = Math.max(0, (this.runnerState.docY || 0) - (this.runnerState.fallStartY || this.runnerState.docY || 0));

        this.runnerState.docY = surfaceY - RUNNER_HEIGHT;
        this.runnerState.vy = 0;
        this.runnerState.grounded = true;
        this.runnerState.fallSoundPlayed = false;
        this.runnerState.fallStartY = this.runnerState.docY;
        this.syncRunnerScreenPosition();

        if (wasAirborne && now - this.runnerState.lastLandAt > 140) {
            const heavy = velocity > 390 || fallDistance > 150;
            this.runnerState.lastLandAt = now;
            this.onRunnerSound(heavy ? 'landHeavy' : 'land', {
                volume: heavy ? 0.09 : 0.055,
                rate: heavy ? 0.94 : 1.04,
            });

            if (heavy) {
                this.shakeScreen('soft');
            }

            if (!this.reducedMotion) {
                this.spawnLandingDust(heavy);
            }
        }
    }

    maybePlayFallSound() {
        if (this.runnerState.grounded || this.runnerState.fallSoundPlayed || this.runnerState.vy < 210) {
            return;
        }

        const fallDistance = this.runnerState.docY - (this.runnerState.fallStartY || this.runnerState.docY);
        if (fallDistance < 34) {
            return;
        }

        this.runnerState.fallSoundPlayed = true;
        this.onRunnerSound('fall', { volume: 0.075, rate: 1.08 });
    }

    controlHeld(control) {
        return this.runnerKeys.has(control) || this.runnerGamepadKeys.has(control);
    }

    updateGamepadControls() {
        if (!navigator.getGamepads) {
            return;
        }

        const pads = Array.from(navigator.getGamepads()).filter(Boolean);
        const pad = pads.find((gamepad) => gamepad.connected !== false);

        if (!pad) {
            if (this.throwHold?.source === 'gamepad') {
                this.clearThrowHold();
            }
            this.runnerGamepadKeys.clear();
            this.runnerGamepadButtons.clear();
            return;
        }

        const axisX = Number(pad.axes?.[0] || 0);
        this.setGamepadHeld('left', axisX < -0.35 || Boolean(pad.buttons?.[14]?.pressed));
        this.setGamepadHeld('right', axisX > 0.35 || Boolean(pad.buttons?.[15]?.pressed));
        this.setGamepadHeld('jump', Boolean(pad.buttons?.[0]?.pressed || pad.buttons?.[12]?.pressed));
        this.setGamepadHeld('shield', Boolean(pad.buttons?.[6]?.pressed || pad.buttons?.[7]?.pressed));
        this.handleGamepadChargeButton('attack', Boolean(pad.buttons?.[1]?.pressed));
        this.handleGamepadThrowButton(Boolean(pad.buttons?.[2]?.pressed || pad.buttons?.[5]?.pressed));
        this.handleGamepadButton('lock', Boolean(pad.buttons?.[3]?.pressed || pad.buttons?.[4]?.pressed), () => this.cycleLockOn());
    }

    setGamepadHeld(control, pressed) {
        if (pressed) {
            this.runnerGamepadKeys.add(control);
            this.releaseScrollPin();
            return;
        }

        this.runnerGamepadKeys.delete(control);
    }

    handleGamepadButton(control, pressed, callback) {
        if (!pressed) {
            this.runnerGamepadButtons.delete(control);
            return;
        }

        if (this.runnerGamepadButtons.has(control)) {
            return;
        }

        this.runnerGamepadButtons.add(control);
        this.releaseScrollPin();
        callback();
    }

    handleGamepadThrowButton(pressed) {
        if (pressed) {
            if (this.runnerGamepadButtons.has('throw')) {
                return;
            }

            this.runnerGamepadButtons.add('throw');
            this.releaseScrollPin();
            this.startThrowHold('gamepad');
            return;
        }

        if (!this.runnerGamepadButtons.has('throw')) {
            return;
        }

        this.runnerGamepadButtons.delete('throw');
        this.finishThrowHold();
    }

    handleGamepadChargeButton(control, pressed) {
        if (pressed) {
            if (this.runnerGamepadButtons.has(control)) {
                return;
            }

            this.runnerGamepadButtons.add(control);
            this.releaseScrollPin();
            this.startAttackCharge('gamepad');
            return;
        }

        if (!this.runnerGamepadButtons.has(control)) {
            return;
        }

        this.runnerGamepadButtons.delete(control);
        this.finishAttackCharge();
    }

    runnerPhysicsRect() {
        this.syncRunnerScreenPosition();
        const footLeft = this.runnerState.x + (RUNNER_WIDTH - RUNNER_FOOT_WIDTH) / 2;

        return {
            left: footLeft,
            top: this.runnerState.y,
            right: footLeft + RUNNER_FOOT_WIDTH,
            bottom: this.runnerState.y + RUNNER_HEIGHT,
            width: RUNNER_FOOT_WIDTH,
            height: RUNNER_HEIGHT,
        };
    }

    runnerDocPhysicsRect() {
        this.ensureRunnerDocumentState();
        const footLeft = this.runnerState.docX + (RUNNER_WIDTH - RUNNER_FOOT_WIDTH) / 2;

        return {
            left: footLeft,
            top: this.runnerState.docY,
            right: footLeft + RUNNER_FOOT_WIDTH,
            bottom: this.runnerState.docY + RUNNER_HEIGHT,
            width: RUNNER_FOOT_WIDTH,
            height: RUNNER_HEIGHT,
        };
    }

    ensureRunnerDocumentState() {
        if (!this.runnerState) {
            return;
        }

        if (typeof this.runnerState.docX !== 'number') {
            this.runnerState.docX = (this.runnerState.x || 0) + window.scrollX;
        }

        if (typeof this.runnerState.docY !== 'number') {
            this.runnerState.docY = (this.runnerState.y || 0) + window.scrollY;
        }
    }

    syncRunnerScreenPosition() {
        if (!this.runnerState) {
            return;
        }

        this.ensureRunnerDocumentState();
        this.runnerState.x = this.runnerState.docX - window.scrollX;
        this.runnerState.y = this.runnerState.docY - window.scrollY;
    }

    runnerDocumentBounds(bounds = this.currentPlayBounds()) {
        return {
            left: bounds.left + window.scrollX,
            right: bounds.right + window.scrollX,
        };
    }

    runnerAtSideWall(rect = this.runnerPhysicsRect()) {
        const bounds = this.currentPlayBounds();
        const margin = Math.max(18, RUNNER_FOOT_WIDTH * 0.5);
        return rect.left <= bounds.left + margin || rect.right >= bounds.right - margin;
    }

    renderRunner(time = currentTime()) {
        this.syncRunnerScreenPosition();
        this.runner.style.left = `${this.runnerState.x}px`;
        this.runner.style.top = `${this.runnerState.y}px`;
        this.runner.dataset.gwPhysics = this.runnerState.lastPhysics || '';
        this.runner.classList.toggle('gw-pixel-runner--left', this.runnerState.direction < 0);
        const running = Math.abs(this.runnerState.vx) > 16;
        const falling = !this.runnerState.grounded && this.runnerState.vy > 150;
        const fastFalling = !this.runnerState.grounded && this.runnerState.vy > 355;
        this.runner.classList.toggle('gw-pixel-runner--running', running);
        this.runner.classList.toggle('gw-pixel-runner--jumping', !this.runnerState.grounded);
        this.runner.classList.toggle('gw-pixel-runner--falling', falling);
        this.runner.classList.toggle('gw-pixel-runner--fastfall', fastFalling);
        this.runner.classList.toggle('gw-pixel-runner--shielding', this.controlHeld('shield'));

        if (running && this.runnerState.grounded && !this.reducedMotion) {
            this.spawnRunnerDust(time);
        }

        if (falling && !this.reducedMotion) {
            this.spawnFallTrail(time, fastFalling);
        }

        this.renderHeldLetter();
    }

    spawnRunnerDust(time) {
        if (time - this.runnerState.lastDustAt < 115) {
            return;
        }

        this.runnerState.lastDustAt = time;
        const dust = document.createElement('span');
        dust.className = 'gw-run-dust';
        const behindX = this.runnerState.direction > 0
            ? this.runnerState.x + 10
            : this.runnerState.x + RUNNER_WIDTH - 10;
        dust.style.left = `${behindX}px`;
        dust.style.top = `${this.runnerState.y + RUNNER_HEIGHT - 6}px`;
        dust.style.setProperty('--gw-dust-x', `${this.runnerState.direction > 0 ? -24 : 24}px`);
        this.addTemporaryEffect(dust, 360);
    }

    spawnFallTrail(time, fastFalling = false) {
        const interval = fastFalling ? 72 : 118;
        if (time - this.runnerState.lastFallTrailAt < interval) {
            return;
        }

        this.runnerState.lastFallTrailAt = time;
        const streak = document.createElement('span');
        streak.className = `gw-fall-streak${fastFalling ? ' gw-fall-streak--fast' : ''}`;
        const drift = (Math.random() - 0.5) * 18;
        const x = this.runnerState.x + RUNNER_WIDTH / 2 + drift;
        const y = this.runnerState.y + 12 + Math.random() * 24;
        streak.style.left = `${x}px`;
        streak.style.top = `${y}px`;
        streak.style.setProperty('--gw-fall-drift', `${-drift * 0.6}px`);
        this.addTemporaryEffect(streak, fastFalling ? 380 : 460);
    }

    spawnLandingDust(heavy = false) {
        if (!this.runnerState) {
            return;
        }

        const count = heavy ? 5 : 3;
        for (let i = 0; i < count; i += 1) {
            const dust = document.createElement('span');
            dust.className = `gw-run-dust gw-run-dust--landing${heavy ? ' gw-run-dust--heavy' : ''}`;
            const side = i % 2 === 0 ? -1 : 1;
            const offset = (8 + i * 5) * side;
            dust.style.left = `${this.runnerState.x + RUNNER_WIDTH / 2 + offset * 0.18}px`;
            dust.style.top = `${this.runnerState.y + RUNNER_HEIGHT - 5}px`;
            dust.style.setProperty('--gw-dust-x', `${offset}px`);
            this.addTemporaryEffect(dust, heavy ? 460 : 340);
        }
    }

    playRunnerStrike(options = {}) {
        if (!this.runner) {
            return;
        }

        this.runner.classList.add('gw-pixel-runner--strike');
        this.runner.classList.toggle('gw-pixel-runner--charged-strike', Boolean(options.charged));
        const timer = window.setTimeout(() => {
            this.runner?.classList.remove('gw-pixel-runner--strike');
            this.runner?.classList.remove('gw-pixel-runner--charged-strike');
            this.timers.delete(timer);
        }, options.charged ? 470 : 360);
        this.timers.add(timer);
    }

    startAttackCharge(source = 'manual') {
        if (!this.runnerState || this.attackCharge) {
            return false;
        }

        const now = currentTime();
        if (now < this.runnerState.attackLockedUntil) {
            return false;
        }

        const readyTimer = window.setTimeout(() => {
            if (!this.attackCharge) {
                return;
            }

            this.runner?.classList.add('gw-pixel-runner--charge-ready');
            this.setAttackControlCharging(true, true);
            this.onRunnerSound('chargeReady', { volume: 0.12 });
            this.showMessage(UI_TEXT.chargeReady, 900);
            this.timers.delete(readyTimer);
        }, CHARGE_READY_MS);

        const fullTimer = window.setTimeout(() => {
            if (!this.attackCharge) {
                return;
            }

            this.runner?.classList.add('gw-pixel-runner--charge-full');
            this.onRunnerSound('chargeFull', { volume: 0.14 });
            this.showMessage(UI_TEXT.chargeFull, 900);
            this.timers.delete(fullTimer);
        }, CHARGE_FULL_MS);

        this.timers.add(readyTimer);
        this.timers.add(fullTimer);
        this.attackCharge = {
            startedAt: now,
            source,
            readyTimer,
            fullTimer,
        };
        this.runner?.classList.add('gw-pixel-runner--charging');
        this.setAttackControlCharging(true, false);
        this.onRunnerSound('chargeStart', { volume: 0.055 });
        return true;
    }

    finishAttackCharge(options = {}) {
        if (!this.attackCharge) {
            return false;
        }

        const charge = this.attackCharge;
        const duration = Math.min(currentTime() - charge.startedAt, CHARGE_MAX_MS);
        this.clearAttackCharge();

        if (options.cancel) {
            return false;
        }

        if (duration >= CHARGE_READY_MS) {
            this.runnerChargedAttack(duration);
        } else {
            this.runnerAttack();
        }

        return true;
    }

    clearAttackCharge() {
        const hadCharge = Boolean(this.attackCharge);

        if (this.attackCharge) {
            window.clearTimeout(this.attackCharge.readyTimer);
            window.clearTimeout(this.attackCharge.fullTimer);
            this.timers.delete(this.attackCharge.readyTimer);
            this.timers.delete(this.attackCharge.fullTimer);
        }

        this.attackCharge = null;
        this.runner?.classList.remove(
            'gw-pixel-runner--charging',
            'gw-pixel-runner--charge-ready',
            'gw-pixel-runner--charge-full'
        );
        this.setAttackControlCharging(false, false);

        if (hadCharge) {
            this.onRunnerSound('chargeStop');
        }
    }

    setAttackControlCharging(charging, ready = false) {
        const button = this.runnerControls?.querySelector('[data-gw-control="attack"]');
        if (!button) {
            return;
        }

        button.classList.toggle('gw-player-control--charging', Boolean(charging));
        button.classList.toggle('gw-player-control--charge-ready', Boolean(ready));
    }

    startThrowHold(source = 'manual') {
        if (!this.runnerState || this.throwHold) {
            return false;
        }

        const timer = window.setTimeout(() => {
            if (!this.throwHold) {
                return;
            }

            this.throwHold.triggered = true;
            this.setThrowControlCharging(true, true);
            this.collectTreasureLetter();
            this.timers.delete(timer);
        }, THROW_HOLD_MS);

        this.throwHold = {
            source,
            timer,
            triggered: false,
        };
        this.timers.add(timer);
        this.setThrowControlCharging(true, false);
        return true;
    }

    finishThrowHold() {
        if (!this.throwHold) {
            return false;
        }

        const hold = this.throwHold;
        window.clearTimeout(hold.timer);
        this.timers.delete(hold.timer);
        this.throwHold = null;
        this.setThrowControlCharging(false, false);

        if (hold.triggered) {
            if (this.treasureStoreTimer && this.heldLetter?.id === this.treasureStoreHeldId) {
                this.placeHeldLetterAtFeet();
            }
            return true;
        }

        this.runnerThrow();
        return true;
    }

    clearThrowHold() {
        if (this.throwHold) {
            window.clearTimeout(this.throwHold.timer);
            this.timers.delete(this.throwHold.timer);
        }

        this.throwHold = null;
        this.setThrowControlCharging(false, false);
    }

    setThrowControlCharging(charging, ready = false) {
        const button = this.runnerControls?.querySelector('[data-gw-control="throw"]');
        if (!button) {
            return;
        }

        button.classList.toggle('gw-player-control--charging', Boolean(charging));
        button.classList.toggle('gw-player-control--charge-ready', Boolean(ready));
    }

    runnerAttack() {
        if (!this.runnerState) {
            return;
        }

        const now = currentTime();
        if (now < this.runnerState.attackLockedUntil) {
            return;
        }

        this.runnerState.attackLockedUntil = now + 280;
        this.playRunnerStrike();

        const attackRect = this.runnerAttackRect();
        const meleeRect = this.runnerMeleeRect();
        const enemyHit = this.hitEnemyAtRect(meleeRect, {
            minOverlap: 12,
            damage: 1,
            intensity: 'medium',
        });
        if (enemyHit?.count > 0) {
            this.runnerOnEnemyHit?.(enemyHit);
            return;
        }

        const chestHit = this.hitChestAtRect(attackRect);
        if (chestHit?.count > 0) {
            return;
        }

        const placedBreak = this.destroyPlacedLettersAtRect(attackRect, { limit: 1 });
        if (placedBreak?.count > 0) {
            this.bumpStageStat('playerBroken', placedBreak.count);
            this.impactBurstAt(placedBreak.rect, 'char');
            this.shakeScreen('medium');
            this.runnerOnTextBreak?.(placedBreak);
            this.showMessage(UI_TEXT.placedLetterBreak, 1200);
            return;
        }

        const accordionHit = this.hitAccordionAtRect(attackRect, { trigger: 'player_control' });
        if (accordionHit?.count > 0) {
            this.runnerOnHit?.(accordionHit.target, 'accordion_attack');
            return;
        }

        const charBreak = this.textBreaker?.destroyAtRect(attackRect, { limit: 1, source: 'player' });
        if (charBreak?.count > 0) {
            this.rebuildRoomCollisionCache();
            this.bumpStageStat('playerBroken', charBreak.count);
            this.impactBurstAt(charBreak.rect, 'char');
            this.shakeScreen('medium');
            this.runnerOnTextBreak?.(charBreak);
            if (this.criticalDestroyed(charBreak)) {
                this.failStage('critical_player_attack');
                return;
            }

            this.showMessage(UI_TEXT.runnerBreak, 1800);
            return;
        }

        const gateHit = this.hitLinkGateAtRect(attackRect);
        if (gateHit?.blocked) {
            this.impactBurstAt(gateHit.rect, 'soft');
            this.showMessage(UI_TEXT.gateNeedsTextBreak, 1300);
            return;
        }

        if (gateHit?.count > 0) {
            this.bumpStageStat('gatesBroken', 1);
            this.impactBurstAt(gateHit.rect, 'medium');
            this.shakeScreen('medium');
            this.showMessage(UI_TEXT.gateBreak, 1500);
            this.runnerOnGateHit?.(gateHit);
            return;
        }

        const imageHit = this.imageBreaker?.hitAtRect(attackRect, { direction: this.runnerState.direction });
        if (imageHit?.count > 0) {
            this.rebuildRoomCollisionCache();
            this.bumpStageStat('imagesDamaged', 1);
            this.impactBurstAt(imageHit.rect, imageHit.destroyed ? 'hard' : 'medium');
            this.spawnImageChips(imageHit.rect, this.runnerState.direction, imageHit.destroyed);
            this.shakeScreen(imageHit.destroyed ? 'hard' : 'medium');
            this.showMessage(this.imageHitMessage(imageHit, false), 1800);
            this.runnerOnImageHit?.(imageHit);
            return;
        }

        this.impactBurstAt(this.runnerHandRect(), 'soft');
        this.shakeScreen('soft');
        this.onRunnerSound('swing', { volume: 0.16, rate: 1.06 });
        this.showMessage(UI_TEXT.miss, 1200);
    }

    runnerChargedAttack(duration) {
        if (!this.runnerState) {
            return;
        }

        const now = currentTime();
        if (now < this.runnerState.attackLockedUntil) {
            return;
        }

        const full = duration >= CHARGE_FULL_MS;
        const damage = full ? 3 : 2;
        const intensity = full ? 'hard' : 'medium';
        this.runnerState.attackLockedUntil = now + (full ? 540 : 430);
        this.playRunnerStrike({ charged: true });

        const chargedRect = this.runnerChargedAttackRect(full);
        const enemyHit = this.hitEnemyAtRect(chargedRect, {
            minOverlap: 10,
            damage,
            intensity,
            charged: true,
        });
        if (enemyHit?.count > 0) {
            this.runnerOnEnemyHit?.(enemyHit);
            return;
        }

        const chestHit = this.hitChestAtRect(chargedRect, { charged: full });
        if (chestHit?.count > 0) {
            return;
        }

        const placedBreak = this.destroyPlacedLettersAtRect(chargedRect, { limit: full ? 4 : 2 });
        if (placedBreak?.count > 0) {
            this.bumpStageStat('playerBroken', placedBreak.count);
            this.impactBurstAt(placedBreak.rect, intensity);
            this.shakeScreen(full ? 'hard' : 'medium');
            this.runnerOnTextBreak?.(placedBreak);
            this.showMessage(UI_TEXT.placedLetterBreak, 1200);
            return;
        }

        const charBreak = this.textBreaker?.destroyAtRect(chargedRect, { limit: full ? 4 : 2, source: 'player' });
        if (charBreak?.count > 0) {
            this.rebuildRoomCollisionCache();
            this.bumpStageStat('playerBroken', charBreak.count);
            this.impactBurstAt(charBreak.rect, intensity);
            this.shakeScreen(full ? 'hard' : 'medium');
            this.runnerOnTextBreak?.(charBreak);
            if (this.criticalDestroyed(charBreak)) {
                this.failStage('critical_player_attack');
                return;
            }

            this.showMessage(UI_TEXT.chargeFull, 1400);
            return;
        }

        const gateHit = this.hitLinkGateAtRect(chargedRect);
        if (gateHit?.blocked) {
            this.impactBurstAt(gateHit.rect, 'soft');
            this.showMessage(UI_TEXT.gateNeedsTextBreak, 1300);
            return;
        }

        if (gateHit?.count > 0) {
            this.bumpStageStat('gatesBroken', 1);
            this.impactBurstAt(gateHit.rect, intensity);
            this.shakeScreen(full ? 'hard' : 'medium');
            this.showMessage(UI_TEXT.gateBreak, 1500);
            this.runnerOnGateHit?.(gateHit);
            return;
        }

        const accordionHit = this.hitAccordionAtRect(chargedRect, { trigger: full ? 'charged_attack_full' : 'charged_attack' });
        if (accordionHit?.count > 0) {
            this.runnerOnHit?.(accordionHit.target, 'accordion_attack');
            return;
        }

        const imageHit = this.imageBreaker?.hitAtRect(chargedRect, { direction: this.runnerState.direction });
        if (imageHit?.count > 0) {
            this.rebuildRoomCollisionCache();
            this.bumpStageStat('imagesDamaged', 1);
            this.impactBurstAt(imageHit.rect, imageHit.destroyed || full ? 'hard' : 'medium');
            this.spawnImageChips(imageHit.rect, this.runnerState.direction, imageHit.destroyed || full);
            this.shakeScreen(full ? 'hard' : 'medium');
            this.showMessage(this.imageHitMessage(imageHit, false), 1800);
            this.runnerOnImageHit?.(imageHit);
            return;
        }

        this.impactBurstAt(this.runnerHandRect(), full ? 'medium' : 'soft');
        this.shakeScreen(full ? 'medium' : 'soft');
        this.onRunnerSound('swing', { volume: full ? 0.22 : 0.18, rate: full ? 0.9 : 0.98 });
        this.showMessage(UI_TEXT.miss, 1200);
    }

    runnerThrow() {
        if (!this.runnerState) {
            return;
        }

        const now = currentTime();
        if (now < this.runnerState.attackLockedUntil) {
            return;
        }

        this.runnerState.attackLockedUntil = now + 250;
        this.playRunnerStrike();

        if (this.heldLetter) {
            this.launchWordProjectile();
            return;
        }

        if (!this.lockedEnemy()) {
            const chest = this.nearestChestFromRunner();
            if (chest && this.pickAndThrowAtChest(chest)) {
                return;
            }
        }

        if (this.activeEnemies().length > 0 && this.pickAndThrowAtLock({ autoLock: true })) {
            return;
        }

        const chest = this.nearestChestFromRunner();
        if (chest && this.pickAndThrowAtChest(chest)) {
            return;
        }

        this.impactBurstAt(this.runnerHandRect(), 'soft');
        this.onRunnerSound('swing', { volume: 0.12, rate: 1.08 });
        this.showMessage(UI_TEXT.noEnemy, 1000);
    }

    runnerAttackRect() {
        const frontLeft = this.runnerState.direction > 0
            ? this.runnerState.x + RUNNER_WIDTH + 2
            : this.runnerState.x - 38;
        const top = this.runnerState.y + RUNNER_HEIGHT - 10;

        return {
            left: frontLeft,
            top,
            width: 36,
            height: 52,
            right: frontLeft + 36,
            bottom: top + 52,
        };
    }

    runnerMeleeRect() {
        const reach = 62;
        const left = this.runnerState.direction > 0
            ? this.runnerState.x + RUNNER_WIDTH - 8
            : this.runnerState.x - reach + 8;
        const top = this.runnerState.y + 7;

        return {
            left,
            top,
            width: reach,
            height: RUNNER_HEIGHT - 2,
            right: left + reach,
            bottom: top + RUNNER_HEIGHT - 2,
        };
    }

    runnerChargedAttackRect(full = false) {
        const width = full ? 112 : 88;
        const left = this.runnerState.direction > 0
            ? this.runnerState.x + RUNNER_WIDTH - 12
            : this.runnerState.x - width + 12;
        const top = this.runnerState.y - (full ? 4 : 0);
        const height = RUNNER_HEIGHT + (full ? 20 : 10);

        return {
            left,
            top,
            width,
            height,
            right: left + width,
            bottom: top + height,
        };
    }

    runnerHandRect() {
        const left = this.runnerState.direction > 0
            ? this.runnerState.x + RUNNER_WIDTH - 6
            : this.runnerState.x - 20;
        const top = this.runnerState.y + 16;

        return {
            left,
            top,
            width: 28,
            height: 28,
            right: left + 28,
            bottom: top + 28,
        };
    }

    runnerShieldRect() {
        const width = 34;
        const left = this.runnerState.direction > 0
            ? this.runnerState.x + RUNNER_WIDTH - 3
            : this.runnerState.x - width + 3;
        const top = this.runnerState.y + 4;

        return {
            left,
            top,
            width,
            height: RUNNER_HEIGHT - 4,
            right: left + width,
            bottom: top + RUNNER_HEIGHT - 4,
        };
    }

    runnerPickupRect() {
        const runnerRect = this.runnerPhysicsRect();
        const left = runnerRect.left - 8;
        const top = runnerRect.bottom - 16;
        const width = runnerRect.width + 16;
        const height = 34;

        return {
            left,
            top,
            width,
            height,
            right: left + width,
            bottom: top + height,
        };
    }

    findRunnerStrikeTarget() {
        const attackRect = this.runnerAttackRect();
        let bestTarget = null;
        let bestScore = 0;

        for (const target of this.visibleRunnerTargets()) {
            const rect = liveRectForTarget(target);
            const overlap = rectOverlapArea(attackRect, rect);
            if (overlap <= 0) {
                continue;
            }

            const centerDistance = Math.abs((rect.left + rect.width / 2) - (attackRect.left + attackRect.width / 2));
            const score = overlap - centerDistance * 0.35 + runnerTargetPriority(target);

            if (score > bestScore) {
                bestScore = score;
                bestTarget = target;
            }
        }

        return bestTarget;
    }

    mountRunnerControls() {
        this.runnerControls = document.createElement('div');
        this.runnerControls.className = 'gw-player-controls gw-player-controls--hidden';
        this.runnerControls.setAttribute('role', 'group');
        this.runnerControls.setAttribute('aria-label', 'Player controls');

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'gw-player-controls__close';
        closeButton.textContent = UI_TEXT.controlsClose;
        closeButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.setRunnerControlsVisible(false);
        });
        this.runnerControls.appendChild(closeButton);

        for (const { control, label, keys } of RUNNER_CONTROL_DEFS) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `gw-player-control gw-player-control--${control}`;
            button.dataset.gwControl = control;
            button.setAttribute('aria-label', `${label}: ${keys}`);
            button.title = `${label}: ${keys}`;
            button.innerHTML = `
                <span class="gw-player-control__label">${label}</span>
                <kbd class="gw-player-control__keys">${keys}</kbd>
            `;
            this.bindRunnerControlButton(button, control);
            this.runnerControls.appendChild(button);
        }

        this.root?.appendChild(this.runnerControls);
    }

    setRunnerControlsVisible(visible) {
        this.controlsVisible = Boolean(visible);
        this.runnerControls?.classList.toggle('gw-player-controls--hidden', !this.controlsVisible);
        this.runnerControlsToggle?.setAttribute('aria-pressed', this.controlsVisible ? 'true' : 'false');
        this.runnerControlsToggle?.classList.toggle('gw-controls-toggle--active', this.controlsVisible);
    }

    toggleRunnerControls() {
        this.setRunnerControlsVisible(!this.controlsVisible);
    }

    showControlGuide() {
        this.controlGuide?.remove();
        this.controlGuide = document.createElement('div');
        this.controlGuide.className = 'gw-control-guide';
        this.controlGuide.innerHTML = `
            <strong>${UI_TEXT.controlGuideTitle}</strong>
            <span>${UI_TEXT.controlGuideKeys}</span>
            <small>${UI_TEXT.controlGuidePad}</small>
        `;
        this.root?.appendChild(this.controlGuide);

        const timer = window.setTimeout(() => {
            this.controlGuide?.classList.add('gw-control-guide--leaving');
            const removeTimer = window.setTimeout(() => {
                this.controlGuide?.remove();
                this.controlGuide = null;
                this.timers.delete(removeTimer);
            }, 360);
            this.timers.add(removeTimer);
            this.timers.delete(timer);
        }, 5600);
        this.timers.add(timer);
    }

    unmountRunnerControls() {
        this.runnerControls?.remove();
        this.runnerControls = null;
        this.controlGuide?.remove();
        this.controlGuide = null;
        this.controlsVisible = false;
        this.runnerControlsToggle?.setAttribute('aria-pressed', 'false');
        this.runnerControlsToggle?.classList.remove('gw-controls-toggle--active');
    }

    bindRunnerControlButton(button, control) {
        const activate = (event) => {
            event.preventDefault();
            button.classList.add('gw-player-control--active');
            this.releaseScrollPin();

            if (control === 'lock') {
                this.cycleLockOn();
                return;
            }

            if (control === 'throw') {
                this.startThrowHold('touch');
                return;
            }

            if (control === 'attack') {
                const now = currentTime();
                if (now - this.lastAttackTapAt < 340) {
                    this.lastAttackTapAt = 0;
                    this.finishAttackCharge({ cancel: true });
                    this.runnerThrow();
                    return;
                }

                this.lastAttackTapAt = now;
                this.startAttackCharge('touch');
                return;
            }

            this.runnerKeys.add(control);
        };

        const release = (event) => {
            event.preventDefault();
            button.classList.remove('gw-player-control--active');

            if (control === 'attack') {
                this.finishAttackCharge();
                return;
            }

            if (control === 'throw') {
                this.finishThrowHold();
                return;
            }

            if (control !== 'throw' && control !== 'lock') {
                this.runnerKeys.delete(control);
            }
        };

        button.addEventListener('pointerdown', activate);
        button.addEventListener('pointerup', release);
        button.addEventListener('pointercancel', release);
        button.addEventListener('pointerleave', release);
        button.addEventListener('click', (event) => event.preventDefault());
    }

    handleRunnerKeyDown(event) {
        if (this.isTypingTarget(event.target)) {
            return;
        }

        if (isBlockedDownKey(event.key)) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        const control = keyToRunnerControl(event.key);
        if (!control) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        this.releaseScrollPin();

        if (control === 'lock') {
            this.cycleLockOn();
            return;
        }

        if (control === 'throw') {
            if (!event.repeat) {
                this.startThrowHold('keyboard');
            }
            return;
        }

        if (control === 'attack') {
            if (!event.repeat) {
                this.startAttackCharge('keyboard');
            }
            return;
        }

        this.runnerKeys.add(control);
    }

    handleRunnerKeyUp(event) {
        if (isBlockedDownKey(event.key)) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        const control = keyToRunnerControl(event.key);
        if (!control) {
            return;
        }

        event.preventDefault();

        if (control === 'attack') {
            event.stopPropagation();
            this.finishAttackCharge();
            return;
        }

        if (control === 'throw') {
            event.stopPropagation();
            this.finishThrowHold();
            return;
        }

        if (control === 'lock') {
            return;
        }

        this.runnerKeys.delete(control);
    }

    isTypingTarget(target) {
        return target instanceof HTMLInputElement
            || target instanceof HTMLTextAreaElement
            || target instanceof HTMLSelectElement
            || (target instanceof HTMLElement && target.isContentEditable);
    }

    runnerStrikeText(target) {
        this.shatterText(target, { runner: true });
        this.impactBurstAt(liveRectForTarget(target), 'hard');
        this.shakeScreen('hard');
        this.showMessage(UI_TEXT.runnerBreak, 2200);
    }

    shakeHeading(target) {
        const rect = liveRectForTarget(target);
        const sourceStyle = window.getComputedStyle(target.element);
        const echo = document.createElement('div');
        echo.className = 'gw-heading-echo';
        echo.textContent = target.text || target.element.textContent || UI_TEXT.headingFallback;
        placeBox(echo, rect);
        echo.style.font = sourceStyle.font;
        echo.style.letterSpacing = sourceStyle.letterSpacing;
        echo.style.color = sourceStyle.color;
        echo.style.textAlign = sourceStyle.textAlign;
        this.addTemporaryEffect(echo, 800);
        this.shatterText(target, { soft: true });
        this.impactBurstAt(rect, 'medium');
        this.shakeScreen('soft');
        this.showMessage(UI_TEXT.headingShake);
    }

    shatterText(target, options = {}) {
        const rect = liveRectForTarget(target);
        const sourceStyle = window.getComputedStyle(target.element);
        const text = normalizeText(target.text || target.element.textContent || '');

        if (!text || rect.width < 8 || rect.height < 8) {
            return;
        }

        const burst = document.createElement('div');
        burst.className = `gw-text-burst${options.runner ? ' gw-text-burst--runner' : ''}${options.soft ? ' gw-text-burst--soft' : ''}`;
        placeBox(burst, rect);
        burst.style.font = sourceStyle.font;
        burst.style.lineHeight = sourceStyle.lineHeight;
        burst.style.letterSpacing = sourceStyle.letterSpacing;
        burst.style.color = sourceStyle.color;
        burst.style.textAlign = sourceStyle.textAlign;

        const chars = Array.from(text.slice(0, target.type === 'paragraph' ? 140 : 84));
        for (const char of chars) {
            const shard = document.createElement('span');
            shard.className = 'gw-text-shard';
            shard.textContent = char === ' ' ? '\u00a0' : char;
            shard.style.setProperty('--gw-x', `${randomBetween(-86, 86)}px`);
            shard.style.setProperty('--gw-y', `${randomBetween(-132, 64)}px`);
            shard.style.setProperty('--gw-r', `${randomBetween(-48, 48)}deg`);
            shard.style.setProperty('--gw-d', `${randomBetween(0, 120)}ms`);
            burst.appendChild(shard);
        }

        this.addTemporaryEffect(burst, options.runner ? 1350 : 1050);
    }

    impactBurstAt(rect, intensity = 'medium') {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + Math.min(rect.height / 2, 64);
        const ring = document.createElement('span');
        ring.className = `gw-impact-ring gw-impact-ring--${intensity}`;
        ring.style.left = `${centerX}px`;
        ring.style.top = `${centerY}px`;
        this.addTemporaryEffect(ring, 620);

        const debrisCount = intensity === 'hard' ? 22 : (intensity === 'char' ? 8 : 12);
        for (let index = 0; index < debrisCount; index += 1) {
            const debris = document.createElement('span');
            debris.className = `gw-pixel-debris gw-pixel-debris--${index % 3}`;
            debris.style.left = `${centerX + randomBetween(-16, 16)}px`;
            debris.style.top = `${centerY + randomBetween(-14, 14)}px`;
            debris.style.setProperty('--gw-x', `${randomBetween(-150, 150)}px`);
            debris.style.setProperty('--gw-y', `${randomBetween(-130, 78)}px`);
            debris.style.setProperty('--gw-r', `${randomBetween(-180, 180)}deg`);
            debris.style.setProperty('--gw-d', `${randomBetween(0, 80)}ms`);
            this.addTemporaryEffect(debris, 780);
        }

        if (intensity === 'hard') {
            const flash = document.createElement('span');
            flash.className = 'gw-impact-flash';
            this.addTemporaryEffect(flash, 180);
        }
    }

    shakeScreen(strength = 'medium') {
        if (this.reducedMotion) {
            return;
        }

        const strengthClass = `gw-screen-shake--${strength}`;
        document.body.classList.remove('gw-screen-shake', 'gw-screen-shake--soft', 'gw-screen-shake--medium', 'gw-screen-shake--hard');
        document.body.classList.add('gw-screen-shake', strengthClass);

        const timer = window.setTimeout(() => {
            document.body.classList.remove('gw-screen-shake', strengthClass);
            this.timers.delete(timer);
        }, strength === 'hard' ? 390 : 260);

        this.timers.add(timer);
    }

    crackImage(target) {
        const imageHit = this.imageBreaker?.hitTarget(target, { direction: Math.random() > 0.5 ? 1 : -1 });
        const rect = imageHit?.rect || liveRectForTarget(target);
        const field = document.createElement('div');
        field.className = 'gw-crack-field';
        placeBox(field, rect);

        for (let index = 0; index < 7; index += 1) {
            const line = document.createElement('span');
            line.className = 'gw-crack-line';
            line.style.left = `${20 + Math.random() * 60}%`;
            line.style.top = `${18 + Math.random() * 58}%`;
            line.style.width = `${24 + Math.random() * 68}px`;
            line.style.transform = `rotate(${Math.random() * 140 - 70}deg)`;
            field.appendChild(line);
        }

        for (let index = 0; index < 12; index += 1) {
            const particle = document.createElement('span');
            particle.className = 'gw-spark-particle';
            particle.style.left = `${35 + Math.random() * 30}%`;
            particle.style.top = `${35 + Math.random() * 30}%`;
            particle.style.setProperty('--gw-x', `${Math.random() * 90 - 45}px`);
            particle.style.setProperty('--gw-y', `${Math.random() * 90 - 45}px`);
            field.appendChild(particle);
        }

        this.addTemporaryEffect(field, 900);
        this.impactBurstAt(rect, imageHit?.destroyed ? 'hard' : 'medium');
        this.spawnImageChips(rect, imageHit?.target ? (imageHit.stage % 2 === 0 ? -1 : 1) : 1, Boolean(imageHit?.destroyed));
        this.shakeScreen(imageHit?.destroyed ? 'hard' : 'medium');
        this.showMessage(this.imageHitMessage(imageHit, true));
    }

    imageHitMessage(imageHit, crack = false) {
        if (imageHit?.type === 'icon') {
            return imageHit?.destroyed ? UI_TEXT.iconBreak : UI_TEXT.iconSpin;
        }

        if (crack) {
            return imageHit?.destroyed ? UI_TEXT.imageBreak : UI_TEXT.imageCrack;
        }

        return imageHit?.destroyed ? UI_TEXT.imageBreak : UI_TEXT.imageSpin;
    }

    spawnImageChips(rect, direction = 1, destroyed = false) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const chipCount = destroyed ? 18 : 9;

        for (let index = 0; index < chipCount; index += 1) {
            const chip = document.createElement('span');
            chip.className = `gw-image-chip gw-image-chip--${index % 4}`;
            chip.style.left = `${centerX + randomBetween(-rect.width * 0.18, rect.width * 0.18)}px`;
            chip.style.top = `${centerY + randomBetween(-rect.height * 0.18, rect.height * 0.18)}px`;
            chip.style.setProperty('--gw-x', `${direction * randomBetween(28, 120) + randomBetween(-42, 42)}px`);
            chip.style.setProperty('--gw-y', `${randomBetween(-110, 76)}px`);
            chip.style.setProperty('--gw-r', `${randomBetween(-210, 210)}deg`);
            chip.style.setProperty('--gw-d', `${randomBetween(0, 90)}ms`);
            this.addTemporaryEffect(chip, destroyed ? 940 : 720);
        }
    }

    spawnWordFragments(words, target, onCollect) {
        const rect = liveRectForTarget(target);
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + Math.min(rect.height / 2, 80);

        this.shatterText(target, { soft: true });
        this.impactBurstAt(rect, 'soft');

        words.forEach((word, index) => {
            const fragment = document.createElement('button');
            fragment.type = 'button';
            fragment.className = 'gw-word-fragment';
            fragment.textContent = word;
            fragment.style.left = `${centerX + (Math.random() * 120 - 60)}px`;
            fragment.style.top = `${centerY + (index * 12) + (Math.random() * 24 - 12)}px`;
            fragment.style.setProperty('--gw-float-x', `${Math.random() * 120 - 60}px`);
            fragment.style.setProperty('--gw-float-y', `${-50 - Math.random() * 70}px`);
            fragment.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                onCollect(word);
                fragment.classList.add('gw-word-fragment--collected');
                this.removeLater(fragment, 260);
            });
            this.effectLayer?.appendChild(fragment);
            this.removeLater(fragment, 7600);
        });

        this.showMessage(this.messages.hint || UI_TEXT.hint);
    }

    bumpAction(target) {
        const rect = liveRectForTarget(target);
        const label = document.createElement('div');
        label.className = 'gw-action-echo';
        label.textContent = target.text || UI_TEXT.actionFallback;
        label.style.left = `${rect.left + rect.width / 2}px`;
        label.style.top = `${rect.top + rect.height / 2}px`;
        this.addTemporaryEffect(label, 700);
        this.shatterText(target, { soft: true });
        this.impactBurstAt(rect, 'medium');
        this.shakeScreen('soft');
        this.showMessage(UI_TEXT.actionHop);
    }

    toggleAccordionTarget(target, options = {}) {
        const rect = liveRectForTarget(target);
        const wasOpen = accordionIsOpen(target.element);
        const opened = !wasOpen;
        const label = document.createElement('div');
        label.className = 'gw-action-echo gw-accordion-echo';
        label.textContent = opened ? 'OPEN' : 'CLOSE';
        label.style.left = `${rect.left + rect.width / 2}px`;
        label.style.top = `${rect.top + rect.height / 2}px`;
        this.addTemporaryEffect(label, 680);

        target.element.classList.add('gw-accordion-hit');
        const clearTimer = window.setTimeout(() => {
            target.element.classList.remove('gw-accordion-hit');
            this.timers.delete(clearTimer);
        }, 520);
        this.timers.add(clearTimer);

        this.passThroughNativeAccordionClick(target.element, opened, wasOpen);
        this.rebuildRoomCollisionCache();
        this.impactBurstAt(rect, options.charged ? 'medium' : 'soft');
        this.shakeScreen('soft');
        this.showMessage(opened ? UI_TEXT.accordionOpen : UI_TEXT.accordionClose, 1200);

        return {
            opened,
            rect,
        };
    }

    passThroughNativeAccordionClick(element, desiredOpen, previousOpen) {
        window.__GamingWebAllowNativeClickUntil = performance.now() + 260;

        if (typeof element.click === 'function') {
            element.click();
        }

        const timer = window.setTimeout(() => {
            if (accordionIsOpen(element) === previousOpen) {
                setAccordionOpen(element, desiredOpen);
            }

            this.rebuildRoomCollisionCache();

            if (performance.now() >= window.__GamingWebAllowNativeClickUntil) {
                window.__GamingWebAllowNativeClickUntil = 0;
            }

            this.timers.delete(timer);
        }, 80);
        this.timers.add(timer);
    }

    brighten(target) {
        const rect = liveRectForTarget(target);
        const glow = document.createElement('div');
        glow.className = 'gw-soft-glow';
        placeBox(glow, rect);
        this.addTemporaryEffect(glow, 850);
        this.impactBurstAt(rect, 'soft');
        this.showMessage(UI_TEXT.brighten);
    }

    addTemporaryEffect(element, lifetime) {
        this.effectLayer?.appendChild(element);
        this.removeLater(element, this.reducedMotion ? Math.min(lifetime, 260) : lifetime);
    }

    removeLater(element, lifetime) {
        const timer = window.setTimeout(() => {
            element.remove();
            this.timers.delete(timer);
        }, lifetime);

        this.timers.add(timer);
    }
}

function placeBox(element, rect) {
    element.style.left = `${rect.left}px`;
    element.style.top = `${rect.top}px`;
    element.style.width = `${rect.width}px`;
    element.style.height = `${rect.height}px`;
}

function rectFromDom(rect) {
    return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
    };
}

function rectToDocumentObject(rect) {
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        right: rect.right + window.scrollX,
        bottom: rect.bottom + window.scrollY,
        width: rect.width,
        height: rect.height,
    };
}

function unionRects(rects = []) {
    const usable = rects.filter(Boolean);
    if (usable.length === 0) {
        return null;
    }

    const left = Math.min(...usable.map((rect) => rect.left));
    const top = Math.min(...usable.map((rect) => rect.top));
    const right = Math.max(...usable.map((rect) => rect.right));
    const bottom = Math.max(...usable.map((rect) => rect.bottom));

    return {
        left,
        top,
        right,
        bottom,
        width: right - left,
        height: bottom - top,
    };
}

function normalizeRooms(rooms = [], pageBottom = pageEndGroundDocY()) {
    const sorted = rooms
        .map((room) => ({
            top: clamp(Math.floor(room.top), 0, pageBottom),
            bottom: clamp(Math.ceil(room.bottom), 0, pageBottom),
            source: room.source || 'room',
        }))
        .filter((room) => room.bottom - room.top >= 120)
        .sort((a, b) => a.top - b.top || a.bottom - b.bottom);

    if (sorted.length === 0) {
        return [{ top: 0, bottom: pageBottom, source: 'fallback' }];
    }

    const normalized = [];
    for (const room of sorted) {
        const previous = normalized[normalized.length - 1];
        if (previous && Math.abs(previous.top - room.top) < 12 && Math.abs(previous.bottom - room.bottom) < 24) {
            continue;
        }

        if (previous && room.bottom <= previous.bottom + 80) {
            continue;
        }

        normalized.push(room);
    }

    if (normalized[0].top > 0) {
        normalized.unshift({
            top: 0,
            bottom: Math.max(normalized[0].top + ROOM_OVERLAP_PX, Math.min(pageBottom, window.innerHeight * ROOM_HEIGHT_RATIO)),
            source: 'head',
        });
    }

    const last = normalized[normalized.length - 1];
    if (last.bottom < pageBottom - 40) {
        normalized.push({
            top: Math.max(0, last.bottom - ROOM_OVERLAP_PX),
            bottom: pageBottom,
            source: 'tail',
        });
    }

    return normalized;
}

function cachedTextSurfaceY(entries = [], runnerRect, acceptsSurface) {
    const rects = [];

    for (const entry of entries) {
        if (!entry?.span?.isConnected || entry.span.dataset.gwBroken === '1') {
            continue;
        }

        const rect = entry.rect;
        if (!rect || rect.width < 1 || rect.height < 1 || !acceptsSurface(rect.top)) {
            continue;
        }

        rects.push(rect);
    }

    let surfaceY = null;
    for (const line of groupCachedRectsByLine(rects)) {
        if (!cachedLineSupportsRunner(line, runnerRect)) {
            continue;
        }

        const top = Math.min(...line.map((rect) => rect.top));
        surfaceY = surfaceY === null ? top : Math.min(surfaceY, top);
    }

    return surfaceY;
}

function cachedRectSurfaceY(entries = [], runnerRect, acceptsSurface) {
    let surfaceY = null;
    const minOverlap = Math.min(22, runnerRect.width * 0.48);

    for (const entry of entries) {
        if (entry?.record && (!entry.record.element?.isConnected || (entry.record.stage >= 5 && entry.record.supportUntil <= performance.now()))) {
            continue;
        }

        if (entry?.placed && !entry.placed.element?.isConnected) {
            continue;
        }

        const rect = entry?.rect;
        const y = entry?.surfaceY ?? rect?.top;
        if (!rect || !Number.isFinite(y) || !acceptsSurface(y)) {
            continue;
        }

        if (horizontalOverlap(runnerRect, rect) < minOverlap) {
            continue;
        }

        surfaceY = surfaceY === null ? y : Math.min(surfaceY, y);
    }

    return surfaceY;
}

function groupCachedRectsByLine(rects = []) {
    const sorted = [...rects].sort((a, b) => a.top - b.top || a.left - b.left);
    const lines = [];

    for (const rect of sorted) {
        const line = lines.find((candidate) => Math.abs(candidate.top - rect.top) <= ROOM_TEXT_LINE_TOLERANCE);
        if (line) {
            line.rects.push(rect);
            line.top = Math.min(line.top, rect.top);
            continue;
        }

        lines.push({
            top: rect.top,
            rects: [rect],
        });
    }

    return lines.map((line) => line.rects);
}

function cachedLineSupportsRunner(line, runnerRect) {
    if (!line.length) {
        return false;
    }

    const sorted = [...line].sort((a, b) => a.left - b.left);
    const charWidth = median(sorted.map((rect) => rect.width).filter((width) => width > 1)) || 10;
    const bridgeGap = Math.max(18, charWidth * ROOM_TEXT_BRIDGE_GAP_CHARS);
    const merged = [];

    for (const rect of sorted) {
        const last = merged[merged.length - 1];
        if (!last || rect.left - last.right > bridgeGap) {
            merged.push({ ...rect });
            continue;
        }

        last.right = Math.max(last.right, rect.right);
        last.left = Math.min(last.left, rect.left);
        last.width = last.right - last.left;
        last.top = Math.min(last.top, rect.top);
        last.bottom = Math.max(last.bottom, rect.bottom);
        last.height = last.bottom - last.top;
    }

    const centerX = runnerRect.left + runnerRect.width / 2;
    return merged.some((rect) => {
        if (centerX >= rect.left - 2 && centerX <= rect.right + 2) {
            return true;
        }

        return horizontalOverlap(runnerRect, rect) >= Math.min(22, runnerRect.width * 0.48);
    });
}

function median(values = []) {
    if (values.length === 0) {
        return null;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
}

function normalizeText(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
}

function localStorageFlag(key) {
    try {
        return window.localStorage?.getItem(key) === '1';
    } catch (error) {
        return false;
    }
}

function setLocalStorageFlag(key) {
    try {
        window.localStorage?.setItem(key, '1');
    } catch (error) {
        // Storage can be unavailable in private or embedded contexts.
    }
}

function localizedUiText(defaults, dictionaries = {}) {
    const locale = frontendLocale().toLowerCase().replace('_', '-');
    const language = locale.split('-')[0];
    const dictionary = dictionaries[locale] || dictionaries[language] || {};

    return {
        ...defaults,
        ...dictionary,
    };
}

function frontendLocale() {
    const config = frontendConfigFromDom();
    return String(
        config.locale
        || document.documentElement.getAttribute('lang')
        || navigator.language
        || 'en'
    );
}

function frontendConfigFromDom() {
    const configScript = document.getElementById('gaming-web-config');
    if (!configScript) {
        return {};
    }

    try {
        const parsed = JSON.parse(configScript.textContent || '{}');
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
        return {};
    }
}

function splitSummarySentences(text) {
    const normalized = normalizeText(text);
    if (!normalized) {
        return [];
    }

    const matches = normalized.match(/[^\u3002\uff01!?]+[\u3002\uff01!?]?/g) || [normalized];
    return matches
        .map((sentence) => normalizeText(sentence).slice(0, 120))
        .filter(Boolean);
}

function createStageStats(totalChars = 0) {
    return {
        totalChars,
        playerBroken: 0,
        enemyBroken: 0,
        enemiesDefeated: 0,
        gatesBroken: 0,
        imagesDamaged: 0,
        lettersCollected: 0,
        chestsOpened: 0,
        scoreJewels: 0,
    };
}

function createItemEffects() {
    return {
        shieldUntil: 0,
        hammerUntil: 0,
    };
}

function itemGlyph(itemType) {
    if (itemType === 'heal') {
        return '\u2665';
    }
    if (itemType === 'shield') {
        return '\u25c6';
    }
    if (itemType === 'hammer') {
        return '\u2736';
    }
    if (itemType === 'hint') {
        return '?';
    }

    return '\u25c6';
}

function renderLifeHearts(life = 0) {
    const filled = Math.max(0, Math.min(PLAYER_MAX_LIFE, Math.round(life)));
    const empty = Math.max(0, PLAYER_MAX_LIFE - filled);
    return `${'\u2665'.repeat(filled)}${'\u2661'.repeat(empty)}`;
}

function goalLetterTargetLabel() {
    return `${GOAL_REQUIRED_LETTERS}+`;
}

function normalizeVisualStyle(value) {
    const style = String(value || 'auto').toLowerCase();
    return ['auto', 'soft', 'pastel', 'neon', 'dark'].includes(style) ? style : 'auto';
}

function normalizeThemeTokens(tokens) {
    return tokens && typeof tokens === 'object' ? tokens : {};
}

function applyThemeTokens(root, tokens = {}) {
    if (!root) {
        return;
    }

    const map = {
        accent: '--gw-theme-accent',
        accentRgb: '--gw-theme-accent-rgb',
        accentSoft: '--gw-theme-accent-soft',
        gold: '--gw-theme-gold',
        goldRgb: '--gw-theme-gold-rgb',
        danger: '--gw-theme-danger',
        dangerRgb: '--gw-theme-danger-rgb',
        panel: '--gw-theme-panel',
        panelText: '--gw-theme-panel-text',
        panelTextRgb: '--gw-theme-panel-text-rgb',
        radius: '--gw-theme-radius',
        glowStrength: '--gw-theme-glow',
        shadow: '--gw-theme-shadow',
    };

    Object.entries(map).forEach(([key, cssVar]) => {
        const value = String(tokens[key] || '').trim();
        if (!value || !isSafeCssToken(value)) {
            return;
        }

        root.style.setProperty(cssVar, value);
    });
}

function isSafeCssToken(value) {
    return /^[#a-zA-Z0-9(),.%\s-]+$/.test(value);
}

function runnerGroundY() {
    return Math.max(72, window.innerHeight - 118);
}

function pageEndGroundDocY() {
    return maxPageScrollY() + runnerGroundY();
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function horizontalOverlap(first, second) {
    return Math.max(0, Math.min(first.right, second.right) - Math.max(first.left, second.left));
}

function lerp(start, end, progress) {
    return start + (end - start) * progress;
}

function easeInOut(value) {
    return value < 0.5
        ? 4 * value * value * value
        : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function isNearPageBottom() {
    const scrollMax = Math.max(1, maxPageScrollY());

    return window.scrollY >= scrollMax - 120;
}

function maxPageScrollY() {
    return Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
        document.body.scrollHeight - window.innerHeight
    );
}

function normalizeUrl(url) {
    try {
        const parsed = new URL(url, window.location.href);
        parsed.hash = '';
        parsed.searchParams.delete('gwv');
        return parsed.href.replace(/\/$/, '');
    } catch (error) {
        return String(url || '').split('#')[0].replace(/\/$/, '');
    }
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function safeRewardUrl(value) {
    try {
        const url = new URL(String(value || ''), window.location.href);
        if (!['http:', 'https:'].includes(url.protocol)) {
            return '';
        }

        return url.href;
    } catch (error) {
        return '';
    }
}

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function currentTime() {
    if (window.performance && typeof window.performance.now === 'function') {
        return window.performance.now();
    }

    return Date.now();
}

function requestFrame(callback) {
    if (typeof window.requestAnimationFrame === 'function' && typeof window.setTimeout === 'function') {
        let settled = false;
        let rafId = 0;
        const timerId = window.setTimeout(() => {
            if (settled) {
                return;
            }

            settled = true;
            if (rafId && typeof window.cancelAnimationFrame === 'function') {
                window.cancelAnimationFrame(rafId);
            }
            callback(currentTime());
        }, 48);

        rafId = window.requestAnimationFrame((time) => {
            if (settled) {
                return;
            }

            settled = true;
            window.clearTimeout(timerId);
            callback(time || currentTime());
        });

        return {
            type: 'hybrid',
            rafId,
            timerId,
        };
    }

    if (typeof window.requestAnimationFrame === 'function') {
        return {
            type: 'raf',
            id: window.requestAnimationFrame(callback),
        };
    }

    return {
        type: 'timer',
        id: window.setTimeout(() => callback(currentTime()), 16),
    };
}

function cancelFrame(frame) {
    if (!frame) {
        return;
    }

    if (frame.type === 'hybrid') {
        if (frame.rafId && typeof window.cancelAnimationFrame === 'function') {
            window.cancelAnimationFrame(frame.rafId);
        }
        window.clearTimeout(frame.timerId);
        return;
    }

    if (frame.type === 'raf' && typeof window.cancelAnimationFrame === 'function') {
        window.cancelAnimationFrame(frame.id);
        return;
    }

    window.clearTimeout(frame.id);
}

function pageScrollProgress() {
    const scrollMax = Math.max(1, maxPageScrollY());

    return clamp(window.scrollY / scrollMax, 0, 1);
}

function firstLandingY(...values) {
    const usable = values.filter((value) => value !== null && value !== undefined);
    if (usable.length === 0) {
        return null;
    }

    return Math.min(...usable);
}

function keyToRunnerControl(key) {
    const normalized = String(key || '').toLowerCase();

    if (normalized === 'arrowleft' || normalized === 'a') {
        return 'left';
    }

    if (normalized === 'arrowright' || normalized === 'd') {
        return 'right';
    }

    if (normalized === 'arrowup' || normalized === 'w' || normalized === ' ' || normalized === 'spacebar') {
        return 'jump';
    }

    if (normalized === 'tab' || normalized === 't') {
        return 'lock';
    }

    if (normalized === 'shift' || normalized === 'e' || normalized === 'l') {
        return 'shield';
    }

    if (normalized === 'x' || normalized === 'k') {
        return 'throw';
    }

    if (normalized === 'z' || normalized === 'j' || normalized === 'enter') {
        return 'attack';
    }

    return '';
}

function treasureCharsFrom(value) {
    return Array.from(String(value || ''))
        .map((char) => char.trim())
        .filter(Boolean);
}

function firstTreasureChar(value) {
    return treasureCharsFrom(value)[0] || '';
}

function isBlockedDownKey(key) {
    const normalized = String(key || '').toLowerCase();
    return normalized === 'arrowdown' || normalized === 's';
}

function rectOverlapArea(first, second) {
    const left = Math.max(first.left, second.left);
    const right = Math.min(first.right, second.right);
    const top = Math.max(first.top, second.top);
    const bottom = Math.min(first.bottom, second.bottom);

    if (right <= left || bottom <= top) {
        return 0;
    }

    return (right - left) * (bottom - top);
}

function enemyAimScore(enemy, x, y, facing = 1) {
    const rect = {
        left: enemy.x,
        top: enemy.y,
        width: enemy.width,
        height: enemy.height,
        right: enemy.x + enemy.width,
        bottom: enemy.y + enemy.height,
    };
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const behindPenalty = (centerX - x) * facing < -16 ? 620 : 0;
    const bossBonus = enemy.type === 'boss' ? -80 : 0;

    return Math.hypot(centerX - x, centerY - y) + behindPenalty + bossBonus;
}

function wordPowerForHeldLetter(held) {
    const fontSize = parseFloat(held.style?.fontSize || '') || 16;
    const visualSize = Math.max(fontSize, held.width || 0, held.height || 0);

    if (visualSize >= 48) {
        return {
            name: 'large',
            damage: 3,
            intensity: 'hard',
            hitboxBonus: 32,
            hitboxMin: 58,
            throwVolume: 0.34,
            rate: 0.94,
        };
    }

    if (visualSize >= 28) {
        return {
            name: 'medium',
            damage: 2,
            intensity: 'medium',
            hitboxBonus: 24,
            hitboxMin: 44,
            throwVolume: 0.28,
            rate: 1,
        };
    }

    return {
        name: 'small',
        damage: 1,
        intensity: 'soft',
        hitboxBonus: 16,
        hitboxMin: 30,
        throwVolume: 0.22,
        rate: 1.08,
    };
}

function runnerTargetPriority(target) {
    if (target.type === 'heading') {
        return 90000;
    }

    if (target.type === 'paragraph') {
        return 70000;
    }

    if (target.type === 'action') {
        return 32000;
    }

    if (target.type === 'accordion') {
        return 36000;
    }

    return 0;
}

function accordionIsOpen(element) {
    if (!(element instanceof Element)) {
        return false;
    }

    const details = element.closest('details');
    if (details instanceof HTMLDetailsElement) {
        return details.open;
    }

    const ariaExpanded = element.getAttribute('aria-expanded');
    if (ariaExpanded === 'true') {
        return true;
    }

    if (ariaExpanded === 'false') {
        return false;
    }

    if (element.classList.contains('elementor-active')
        || element.classList.contains('active')
        || element.classList.contains('show')) {
        return true;
    }

    return accordionControlledPanels(element).some((panel) => {
        const style = window.getComputedStyle(panel);
        return !panel.hidden
            && style.display !== 'none'
            && style.visibility !== 'hidden'
            && panel.getBoundingClientRect().height > 1;
    });
}

function setAccordionOpen(element, open) {
    if (!(element instanceof Element)) {
        return;
    }

    const details = element.closest('details');
    if (details instanceof HTMLDetailsElement) {
        details.open = open;
        return;
    }

    element.setAttribute('aria-expanded', open ? 'true' : 'false');
    element.classList.toggle('elementor-active', open);
    element.classList.toggle('active', open);
    element.classList.toggle('collapsed', !open);

    for (const panel of accordionControlledPanels(element)) {
        panel.hidden = !open;
        panel.setAttribute('aria-hidden', open ? 'false' : 'true');
        panel.classList.toggle('elementor-active', open);
        panel.classList.toggle('active', open);
        panel.classList.toggle('show', open);
        panel.style.display = open ? 'block' : 'none';
    }
}

function accordionControlledPanels(element) {
    const panels = [];
    const addPanel = (panel) => {
        if (panel instanceof Element && !panels.includes(panel)) {
            panels.push(panel);
        }
    };

    const controls = (element.getAttribute('aria-controls') || '').split(/\s+/).filter(Boolean);
    controls.forEach((id) => addPanel(document.getElementById(id)));

    const titleId = element.id || '';
    if (titleId.includes('elementor-tab-title')) {
        addPanel(document.getElementById(titleId.replace('elementor-tab-title', 'elementor-tab-content')));
    }

    const dataTab = element.getAttribute('data-tab');
    if (dataTab) {
        const container = element.closest('.elementor-accordion,.elementor-toggle,.elementor-widget-container') || document;
        addPanel(container.querySelector(`.elementor-tab-content[data-tab="${cssEscape(dataTab)}"]`));
    }

    addPanel(element.closest('.accordion-item,.elementor-accordion-item,.elementor-toggle-item')?.querySelector('.accordion-collapse,.elementor-tab-content'));
    return panels;
}

function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') {
        return window.CSS.escape(String(value));
    }

    return String(value).replace(/["\\]/g, '\\$&');
}

function initialRunnerTargetPriority(target) {
    const tag = target.element?.tagName?.toLowerCase() || '';

    if (tag === 'h1') {
        return 120000;
    }

    if (/^h[2-6]$/.test(tag)) {
        return 112000 - Number(tag.slice(1)) * 1000;
    }

    if (target.type === 'heading') {
        return 102000;
    }

    if (target.type === 'paragraph') {
        return 70000;
    }

    return runnerTargetPriority(target);
}

function isInternalLinkGate(element) {
    if (!(element instanceof HTMLAnchorElement) || !element.href) {
        return false;
    }

    const url = new URL(element.href, window.location.href);
    if (url.origin !== window.location.origin) {
        return false;
    }

    if (url.href === window.location.href || url.href === `${window.location.href}#`) {
        return false;
    }

    return true;
}

function isPlayableContentElement(element) {
    if (!(element instanceof Element)) {
        return false;
    }

    if (isGameIgnoredElement(element)) {
        return false;
    }

    return Boolean(element.closest('.gw-demo-content,.entry-content,main,article,.elementor,.elementor-element,.elementor-widget-container,.e-con'));
}



