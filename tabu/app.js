(() => {
'use strict';

/* ================= constants ================= */
const LANGS = ['en', 'tr', 'zh'];
const LANG_NAME = { en: 'English', tr: 'Türkçe', zh: '中文' };
const LANG_TAG = { en: 'EN', tr: 'TR', zh: '中文' };
const LOCALE = { en: 'en-GB', tr: 'tr-TR', zh: 'zh-CN' };
const LEVELS = ['A1', 'A2', 'B1', 'B2'];
const CATS = window.TABU_CATS;
const CARDS = window.TABU_CARDS.map(([id, cat, lvl, en, tr, zh, pinyin = []]) => ({ id, cat, lvl, en, tr, zh, pinyin }));
const BY_ID = Object.fromEntries(CARDS.map((c) => [c.id, c]));
const COLORS = ['#e63462', '#2f6fed', '#0e9f6e', '#8e5beb', '#e8590c', '#0b8a96', '#d6338a', '#5562d8'];
const JOKERS = ['double', 'extra', 'nopass', 'shield', 'one', 'statue'];
const JOKER_ICON = { double: '×2', extra: '+30', nopass: '🚫', shield: '🛡️', one: '☝️', statue: '🗿' };
const JOKER_CHANCE = [0, 0.25, 0.5];
const RES_ICON = { c: '✓', t: '✕', p: '↷', '-': '–' };
const NEXT_RES = { c: 't', t: 'p', p: '-', '-': 'c' };
const STEP = { time: [30, 180, 15], passes: [-1, 10, 1], correct: [1, 5, 1], taboo: [0, 5, 1], passCost: [0, 3, 1], target: [10, 200, 5], rounds: [1, 20, 1] };
const MIN_CARDS = 20;
const MAX_TEAMS = 6;
const EXTRA_SECONDS = 30;

/* ================= texts ================= */
const T = {
  tr: {
    tagline: 'Anlat, ama yasak kelimeleri söyleme!',
    newGame: 'Yeni Oyun', resumeGame: 'Oyuna Devam Et', stats: 'İstatistikler', howTo: 'Nasıl Oynanır?',
    deckInfo: '{n} kart · 3 dil',
    setup: 'Oyun Kurulumu', teams: 'Takımlar', team: 'Takım', addTeam: '+ Takım ekle',
    playLang: 'Oyun dili', levels: 'Kelime seviyesi', levelHint: 'A1–A2 kolay · B1 orta · B2 zor',
    helpers: 'Kartta çevirisini göster', available: '{n} kart uygun', tooFew: 'Bu seçimle yeterli kart yok (en az {n} lazım)',
    rules: 'Kurallar', time: 'Tur süresi', sec: 'sn', passes: 'Tur başına pas hakkı', unlimited: 'Sınırsız',
    pCorrect: 'Doğru bilme puanı', pTaboo: 'Tabu cezası', pPass: 'Pas cezası',
    winBy: 'Oyun nasıl biter?', winScore: 'Hedef puan', winRounds: 'Tur sayısı',
    target: 'Hedef puan', roundsEach: 'Takım başına tur', tabooWords: 'Karttaki yasak kelime sayısı',
    jokers: 'Joker turları', jOff: 'Kapalı', jRare: 'Seyrek', jOften: 'Sık',
    sound: 'Ses efektleri', noRepeat: 'Kartlar tekrar etmesin',
    cats: 'Kategoriler', all: 'Tümü', seenInfo: '{n} karttan {s} tanesi daha önce çıktı.', resetSeen: 'Sıfırla',
    start: 'Oyunu Başlat',
    round: 'Tur {n}', handPhone: 'Telefonu anlatıcıya verin', go: 'BAŞLA', toTarget: 'Hedef {n} puan', roundOf: 'Tur {a} / {b}', tiebreak: 'Beraberlik: uzatma turu',
    jokerTitle: 'Joker tur', menu: 'Menü', endGame: 'Oyunu bitir', home: 'Ana menü', close: 'Kapat',
    correct: 'DOĞRU', taboo: 'TABU', pass: 'PAS', paused: 'Duraklatıldı', cont: 'Devam et', endRound: 'Turu bitir', quit: 'Oyundan çık',
    timeUp: 'Süre doldu!', roundOver: 'Tur bitti', fixHint: 'Yanlış basıldıysa satıra dokunup düzeltin', noCards: 'Bu turda kart oynanmadı', next: 'Devam',
    winner: '{t} kazandı!', tie: 'Berabere!', again: 'Tekrar oyna',
    games: 'Oyun', cardsPlayed: 'Kart', accuracy: 'İsabet', recent: 'Son oyunlar', hardest: 'En çok yanan kartlar', noStats: 'Henüz bitmiş oyun yok.', resetStats: 'İstatistikleri sıfırla',
    yes: 'Evet', no: 'Vazgeç',
    askQuit: 'Oyundan çıkılsın mı? Bu tur sayılmaz, oyuna ana menüden devam edebilirsin.',
    askEnd: 'Oyun şimdi bitirilsin mi?', askResetStats: 'Tüm istatistikler silinsin mi?',
    askResetSeen: 'Çıkmış kartlar sıfırlansın mı? Kartlar yeniden gelmeye başlar.',
    credit: 'İngilizce seviyeleri yaklaşık A1–B2 düzeyindedir. Mevcut CEFR-J etiketleri korunmuş, yeni kartlar için tahmini seviyeler eklenmiştir.',
    how: [
      'Takımlara ayrılın. Sırası gelen takımdan bir kişi anlatıcı olur ve telefonu alır.',
      'Anlatıcı üstteki kelimeyi takımına anlatır; ama kelimenin kendisini ve alttaki yasak kelimeleri söyleyemez.',
      'Takım bilirse DOĞRU, yasak kelime söylenirse TABU, kelime atlanacaksa PAS tuşuna basılır.',
      'Rakip takımdan biri ekranı izleyip yasak kelimeleri kontrol eder.',
      'Süre bitince tur özeti gelir; yanlış basılan kartlar orada düzeltilebilir.',
      'Her takım kendi dilinde ve kendi seviyesinde oynar. Çeviri açıksa kelimenin diğer dillerdeki karşılığı da kartta görünür.',
    ],
    j: {
      double: ['Çift Puan', 'Bu tur her doğru iki kat puan.'], extra: ['Ek Süre', 'Bu tur 30 saniye daha uzun.'],
      nopass: ['Pas Yok', 'Bu tur pas geçilemez.'], shield: ['Kalkan', 'Bu tur tabu cezası yok.'],
      one: ['Tek Tahminci', 'Sadece bir takım arkadaşı tahmin edebilir.'], statue: ['Heykel', 'Anlatıcı ellerini ve vücudunu kullanamaz.'],
    },
    cat: { food: 'Yiyecek & İçecek', nature: 'Hayvanlar & Doğa', home: 'Ev & Eşyalar', places: 'Yerler & Seyahat', people: 'İnsanlar & Meslekler', body: 'Vücut & Sağlık', tech: 'Bilim & Teknoloji', fun: 'Spor & Eğlence', school: 'Okul & İş', actions: 'Eylemler & Duygular', daily: 'Günlük Hayat', world: 'Dünya & Kültür' },
  },
  en: {
    tagline: "Describe it, but don't say the taboo words!",
    newGame: 'New Game', resumeGame: 'Continue Game', stats: 'Statistics', howTo: 'How to Play',
    deckInfo: '{n} cards · 3 languages',
    setup: 'Game Setup', teams: 'Teams', team: 'Team', addTeam: '+ Add team',
    playLang: 'Play language', levels: 'Word level', levelHint: 'A1–A2 easy · B1 medium · B2 hard',
    helpers: 'Show translation on the card', available: '{n} cards available', tooFew: 'Not enough cards for this choice (need {n})',
    rules: 'Rules', time: 'Round time', sec: 's', passes: 'Passes per round', unlimited: 'Unlimited',
    pCorrect: 'Points per correct card', pTaboo: 'Taboo penalty', pPass: 'Pass penalty',
    winBy: 'How does the game end?', winScore: 'Target score', winRounds: 'Number of rounds',
    target: 'Target score', roundsEach: 'Rounds per team', tabooWords: 'Taboo words on a card',
    jokers: 'Joker rounds', jOff: 'Off', jRare: 'Rare', jOften: 'Often',
    sound: 'Sound effects', noRepeat: "Don't repeat cards",
    cats: 'Categories', all: 'All', seenInfo: '{s} of {n} cards have already come up.', resetSeen: 'Reset',
    start: 'Start Game',
    round: 'Round {n}', handPhone: 'Hand the phone to the describer', go: 'START', toTarget: 'First to {n}', roundOf: 'Round {a} / {b}', tiebreak: 'Tie: extra round',
    jokerTitle: 'Joker round', menu: 'Menu', endGame: 'End game', home: 'Main menu', close: 'Close',
    correct: 'CORRECT', taboo: 'TABOO', pass: 'PASS', paused: 'Paused', cont: 'Resume', endRound: 'End round', quit: 'Quit game',
    timeUp: "Time's up!", roundOver: 'Round over', fixHint: 'Pressed the wrong button? Tap a row to fix it', noCards: 'No cards were played this round', next: 'Continue',
    winner: '{t} wins!', tie: "It's a tie!", again: 'Play again',
    games: 'Games', cardsPlayed: 'Cards', accuracy: 'Accuracy', recent: 'Recent games', hardest: 'Most missed cards', noStats: 'No finished games yet.', resetStats: 'Reset statistics',
    yes: 'Yes', no: 'Cancel',
    askQuit: 'Quit the game? This round will not count. You can continue the game from the main menu.',
    askEnd: 'End the game now?', askResetStats: 'Delete all statistics?',
    askResetSeen: 'Reset the cards that have already come up? They will start appearing again.',
    credit: 'English levels are approximate A1–B2. Existing CEFR-J labels are retained; levels for new cards are estimates.',
    how: [
      'Split into teams. One player from the team whose turn it is becomes the describer and takes the phone.',
      'The describer explains the word at the top, but may not say the word itself or any of the taboo words under it.',
      'Press CORRECT when the team guesses it, TABOO when a forbidden word is said, PASS to skip the card.',
      'Someone from the other team watches the screen and checks the taboo words.',
      'When time is up you see a round summary; wrong button presses can be fixed there.',
      'Each team plays in its own language and level. With translation on, the word is also shown in the other languages.',
    ],
    j: {
      double: ['Double Points', 'Every correct card counts twice this round.'], extra: ['Extra Time', 'This round is 30 seconds longer.'],
      nopass: ['No Pass', 'You cannot pass this round.'], shield: ['Shield', 'No taboo penalty this round.'],
      one: ['One Guesser', 'Only one teammate may guess.'], statue: ['Statue', 'The describer may not use hands or body.'],
    },
    cat: { food: 'Food & Drink', nature: 'Animals & Nature', home: 'Home & Objects', places: 'Places & Travel', people: 'People & Jobs', body: 'Body & Health', tech: 'Science & Tech', fun: 'Sports & Fun', school: 'School & Work', actions: 'Actions & Feelings', daily: 'Everyday Life', world: 'World & Culture' },
  },
  zh: {
    tagline: '只能描述，不能说出禁词！',
    newGame: '新游戏', resumeGame: '继续游戏', stats: '统计', howTo: '怎么玩？',
    deckInfo: '{n} 张卡 · 3 种语言',
    setup: '游戏设置', teams: '队伍', team: '队伍', addTeam: '+ 添加队伍',
    playLang: '游戏语言', levels: '词汇等级', levelHint: 'A1–A2 简单 · B1 中等 · B2 较难',
    helpers: '在卡片上显示翻译', available: '可用 {n} 张卡', tooFew: '符合条件的卡片不够（至少需要 {n} 张）',
    rules: '规则', time: '每轮时间', sec: '秒', passes: '每轮可跳过次数', unlimited: '不限',
    pCorrect: '猜对得分', pTaboo: '说出禁词扣分', pPass: '跳过扣分',
    winBy: '游戏如何结束？', winScore: '目标分数', winRounds: '固定轮数',
    target: '目标分数', roundsEach: '每队轮数', tabooWords: '每张卡的禁词数',
    jokers: '特殊回合', jOff: '关闭', jRare: '偶尔', jOften: '经常',
    sound: '音效', noRepeat: '卡片不重复',
    cats: '类别', all: '全选', seenInfo: '{n} 张卡中已出现 {s} 张。', resetSeen: '重置',
    start: '开始游戏',
    round: '第 {n} 轮', handPhone: '请把手机交给描述的人', go: '开始', toTarget: '目标 {n} 分', roundOf: '第 {a} / {b} 轮', tiebreak: '平局：加赛一轮',
    jokerTitle: '特殊回合', menu: '菜单', endGame: '结束游戏', home: '主菜单', close: '关闭',
    correct: '答对', taboo: '禁词', pass: '跳过', paused: '已暂停', cont: '继续', endRound: '结束本轮', quit: '退出游戏',
    timeUp: '时间到！', roundOver: '本轮结束', fixHint: '按错了？点一下该行即可修改', noCards: '本轮没有出卡', next: '继续',
    winner: '{t} 获胜！', tie: '平局！', again: '再来一局',
    games: '局数', cardsPlayed: '卡片', accuracy: '正确率', recent: '最近的游戏', hardest: '最常失误的卡片', noStats: '还没有完成的游戏。', resetStats: '清除统计',
    yes: '确定', no: '取消',
    askQuit: '要退出游戏吗？本轮不计分，可以从主菜单继续游戏。',
    askEnd: '现在结束游戏吗？', askResetStats: '要清除所有统计吗？',
    askResetSeen: '要重置已出现的卡片吗？这些卡片会重新出现。',
    credit: '英语词汇等级约为 A1–B2。保留原有 CEFR-J 标签，新增卡片的等级为估计值。',
    how: [
      '分成几个队伍。轮到的队伍派一个人拿手机来描述。',
      '描述的人向队友解释最上面的词，但不能说出这个词本身，也不能说下面的禁词。',
      '队友猜对按“答对”，说了禁词按“禁词”，想跳过这张卡按“跳过”。',
      '对方队伍派一个人看着屏幕，检查有没有说禁词。',
      '时间到后会显示本轮总结，按错的卡片可以在那里修改。',
      '每个队伍用自己的语言和等级来玩。打开翻译后，卡片上还会显示这个词的其他语言。',
    ],
    j: {
      double: ['双倍得分', '本轮每猜对一张得双倍分。'], extra: ['加时', '本轮多 30 秒。'],
      nopass: ['不能跳过', '本轮不能跳过卡片。'], shield: ['护盾', '本轮说出禁词不扣分。'],
      one: ['单人猜', '只能由一位队友来猜。'], statue: ['雕像', '描述的人不能用手和身体做动作。'],
    },
    cat: { food: '饮食', nature: '动物与自然', home: '家居用品', places: '地点与旅行', people: '人物与职业', body: '身体与健康', tech: '科学与技术', fun: '运动与娱乐', school: '学习与工作', actions: '动作与情感', daily: '日常生活', world: '世界与文化' },
  },
};

/* ================= storage + state ================= */
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem('tabu1.' + key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem('tabu1.' + key, JSON.stringify(value)); } catch { /* storage unavailable: the game still works for this session */ }
  },
};

const browserLang = () => { const l = (navigator.language || 'en').toLowerCase(); return l.startsWith('tr') ? 'tr' : l.startsWith('zh') ? 'zh' : 'en'; };
let ui = store.get('ui', browserLang());
if (!LANGS.includes(ui)) ui = 'en';

const newTeam = (color) => ({ name: '', color, lang: ui, levels: [1, 1, 1, 1], helpers: [] });
const defaultSetup = () => ({
  teams: [newTeam(0), newTeam(1)],
  rules: { time: 60, passes: -1, correct: 1, taboo: 1, passCost: 0, win: 'score', target: 30, rounds: 5, tabooWords: 5, jokers: 1, sound: true, noRepeat: true },
  cats: CATS.map(() => true),
});
function loadSetup() {
  const def = defaultSetup();
  const saved = store.get('setup', null);
  if (!saved || !Array.isArray(saved.teams) || saved.teams.length < 2) return def;
  const s = { teams: saved.teams, rules: { ...def.rules, ...saved.rules }, cats: saved.cats };
  if (!Array.isArray(s.cats) || s.cats.length !== CATS.length) s.cats = def.cats;
  return s;
}

let setup = loadSetup();
let seen = store.get('seen', {});
let stats = store.get('stats', { games: [], cards: {} });
let game = store.get('game', null);
if (game && (game.over || !Array.isArray(game.teams))) game = null;
let round = null;      // the round being played or reviewed (never persisted)
let screen = 'home';
let modal = null;
let timer = null;

const app = document.getElementById('app');
const saveSetup = () => store.set('setup', setup);

/* ================= helpers ================= */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pinyinHtml = (card, index = 0) => card.pinyin[index] ? `<span class="pinyin" lang="zh-Latn">${esc(card.pinyin[index])}</span>` : '';
function t(key, lang, vars) {
  if (lang && typeof lang === 'object') { vars = lang; lang = null; }
  let s = (T[lang || ui] || T.en)[key];
  if (s == null) s = T.en[key];
  return vars && typeof s === 'string' ? s.replace(/\{(\w+)\}/g, (_, k) => vars[k]) : s;
}
const signed = (n) => (n > 0 ? '+' + n : n < 0 ? '−' + Math.abs(n) : '0');
const countFor = (tm, cats) => CARDS.reduce((n, c) => n + (cats[c.cat] && tm.levels[c.lvl] ? 1 : 0), 0);
const seenCount = () => Object.keys(seen).filter((id) => BY_ID[id]).length;

// Longest token of a head word, in "Latin capital letter" widths, so CSS can fit it on one line.
function wordWidth(w) {
  let max = 0;
  for (const token of w.split(/[\s-]+/)) {
    let n = 0;
    for (const ch of token) n += ch.codePointAt(0) > 0x2e7f ? 1.5 : 1;
    if (n > max) max = n;
  }
  return Math.max(4.2, max).toFixed(2);
}

/* ================= sound, wake lock, confetti ================= */
let actx = null;
const soundOn = () => (game && screen !== 'setup' && screen !== 'home' ? game.rules.sound : setup.rules.sound);
function audio() {
  if (!soundOn()) return null;
  if (!actx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    actx = new AC();
    // Without this, iOS mutes Web Audio whenever the ringer switch is on silent.
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch { /* not supported */ }
  }
  if (actx.state === 'suspended') actx.resume();
  return actx;
}
function tone(freq, at, dur, type = 'sine', vol = 0.2) {
  const a = audio();
  if (!a) return;
  const osc = a.createOscillator(), gain = a.createGain(), t0 = a.currentTime + at;
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}
const sfx = {
  start() { tone(523, 0, 0.1, 'triangle', 0.22); tone(784, 0.1, 0.16, 'triangle', 0.22); },
  correct() { tone(660, 0, 0.12, 'triangle', 0.26); tone(990, 0.1, 0.2, 'triangle', 0.26); },
  taboo() { tone(150, 0, 0.45, 'sawtooth', 0.3); tone(113, 0, 0.45, 'square', 0.14); },
  pass() { tone(440, 0, 0.08, 'sine', 0.22); tone(330, 0.07, 0.12, 'sine', 0.22); },
  tick() { tone(1100, 0, 0.045, 'square', 0.07); },
  end() { tone(196, 0, 0.28, 'sawtooth', 0.3); tone(147, 0.24, 0.7, 'sawtooth', 0.3); },
  win() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.13, 0.28, 'triangle', 0.25)); },
};

let wakeLock = null;
async function wakeOn() {
  try { if ('wakeLock' in navigator && !wakeLock) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); } } catch { /* denied or unsupported */ }
}
function wakeOff() { try { if (wakeLock) wakeLock.release(); } catch { /* already released */ } wakeLock = null; }

function confetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = document.createElement('canvas');
  cv.className = 'confetti';
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d'), W = (cv.width = innerWidth), H = (cv.height = innerHeight);
  const bits = Array.from({ length: 130 }, () => ({ x: Math.random() * W, y: -20 - Math.random() * H * 0.6, vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 4, s: 6 + Math.random() * 7, c: COLORS[Math.floor(Math.random() * COLORS.length)], r: Math.random() * 6 }));
  const t0 = performance.now();
  (function frame(now) {
    ctx.clearRect(0, 0, W, H);
    for (const p of bits) {
      p.x += p.vx; p.y += p.vy; p.r += 0.12;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); ctx.restore();
    }
    if (now - t0 < 4200) requestAnimationFrame(frame); else cv.remove();
  })(t0);
}

/* ================= game logic ================= */
function rollJoker(g) {
  return Math.random() < JOKER_CHANCE[g.rules.jokers] ? JOKERS[Math.floor(Math.random() * JOKERS.length)] : null;
}

function startGame() {
  game = {
    rules: { ...setup.rules },
    cats: [...setup.cats],
    teams: setup.teams.map((tm, i) => ({
      name: tm.name.trim() || `${t('team')} ${i + 1}`, color: tm.color, lang: tm.lang,
      levels: [...tm.levels], helpers: tm.helpers.filter((l) => l !== tm.lang),
      score: 0, turns: 0, c: 0, t: 0, p: 0,
    })),
    turn: 0, round: 1, joker: null, used: {}, tiebreak: false, over: false, winners: [],
  };
  game.joker = rollJoker(game);
  round = null;
  store.set('game', game);
  screen = 'ready';
}

// Picks a card for this team: right categories and levels, not used in this game, not seen before (if that rule is on).
function draw(tm) {
  const g = game;
  const fits = (c) => g.cats[c.cat] && tm.levels[c.lvl];
  let pool = CARDS.filter((c) => fits(c) && !g.used[c.id] && !(g.rules.noRepeat && seen[c.id]));
  if (!pool.length) { // this part of the deck is exhausted: forget what was seen and start it over
    for (const c of CARDS) if (fits(c)) delete seen[c.id];
    pool = CARDS.filter((c) => fits(c) && !g.used[c.id]);
  }
  if (!pool.length) { // even within this one game every matching card has come up
    for (const c of CARDS) if (fits(c)) delete g.used[c.id];
    pool = CARDS.filter(fits);
  }
  if (!pool.length) return null;
  const card = pool[Math.floor(Math.random() * pool.length)];
  g.used[card.id] = 1;
  seen[card.id] = 1;
  return card;
}

function roundScore(r, rules) {
  let s = 0;
  for (const c of r.cards) {
    if (c.res === 'c') s += rules.correct * (r.joker === 'double' ? 2 : 1);
    else if (c.res === 't') s -= r.joker === 'shield' ? 0 : rules.taboo;
    else if (c.res === 'p') s -= rules.passCost;
  }
  return s;
}

function stopTimer() { clearInterval(timer); timer = null; wakeOff(); }
function startTimer() { clearInterval(timer); timer = setInterval(tick, 100); wakeOn(); }

function beginRound() {
  const g = game, tm = g.teams[g.turn];
  const total = (g.rules.time + (g.joker === 'extra' ? EXTRA_SECONDS : 0)) * 1000;
  round = {
    team: g.turn, joker: g.joker, cards: [], cur: null, total,
    passesLeft: g.joker === 'nopass' ? 0 : g.rules.passes, // -1 means unlimited
    endAt: performance.now() + total, remaining: total, paused: false,
    lastTick: 0, lockUntil: 0, flash: null, deal: true, timeUp: false,
  };
  round.cur = draw(tm);
  if (!round.cur) return finishRound(false); // no card matches this team's filters at all
  screen = 'play';
  sfx.start();
  startTimer();
}

function mark(res) {
  const r = round, now = performance.now();
  if (!r || r.paused || !r.cur || now < r.lockUntil) return;
  if (res === 'p') {
    if (r.passesLeft === 0) return;
    if (r.passesLeft > 0) r.passesLeft--;
  }
  r.lockUntil = now + 250; // a double tap must not hit the next card
  r.cards.push({ id: r.cur.id, res });
  sfx[res === 'c' ? 'correct' : res === 't' ? 'taboo' : 'pass']();
  r.flash = res;
  r.deal = true;
  r.cur = draw(game.teams[r.team]);
  if (!r.cur) finishRound(false);
}

function tick() {
  const r = round;
  if (!r || r.paused || screen !== 'play') return;
  const left = r.endAt - performance.now();
  const sec = Math.max(0, Math.ceil(left / 1000));
  const el = document.getElementById('timer');
  if (el) { el.textContent = sec; el.classList.toggle('low', sec <= 10); }
  const bar = document.getElementById('bar');
  if (bar) bar.style.transform = `scaleX(${Math.max(0, left / r.total)})`;
  if (sec <= 10 && sec > 0 && sec !== r.lastTick) { r.lastTick = sec; sfx.tick(); }
  if (left <= 0) { finishRound(true); render(); }
}

function pauseRound() {
  const r = round;
  if (!r || r.paused) return;
  r.paused = true;
  r.remaining = r.endAt - performance.now();
  stopTimer();
}
function resumeRound() {
  const r = round;
  if (!r || !r.paused) return;
  r.paused = false;
  r.endAt = performance.now() + r.remaining;
  startTimer();
}

function finishRound(timeUp) {
  const r = round;
  if (!r) return;
  stopTimer();
  r.paused = false;
  r.timeUp = timeUp;
  if (r.cur) { r.cards.push({ id: r.cur.id, res: '-' }); r.cur = null; } // the card left in hand: no points either way
  if (timeUp) sfx.end();
  screen = 'summary';
}

function commitRound() {
  const g = game, r = round, tm = g.teams[r.team];
  tm.score += roundScore(r, g.rules);
  tm.turns++;
  for (const c of r.cards) {
    if (c.res === '-') continue;
    tm[c.res]++;
    const s = stats.cards[c.id] || (stats.cards[c.id] = { c: 0, t: 0, p: 0 });
    s[c.res]++;
  }
  store.set('stats', stats);
  store.set('seen', seen);
  round = null;
  g.turn = (g.turn + 1) % g.teams.length;
  if (g.turn === 0) { // every team has played the same number of rounds: only now can the game end
    const top = Math.max(...g.teams.map((x) => x.score));
    const leaders = g.teams.filter((x) => x.score === top).length;
    const reached = g.rules.win === 'score' ? top >= g.rules.target : g.round >= g.rules.rounds;
    if (reached && leaders === 1) return endGame();
    g.tiebreak = reached;
    g.round++;
    g.joker = rollJoker(g);
  }
  store.set('game', g);
  screen = 'ready';
}

function endGame() {
  const g = game;
  stopTimer();
  round = null;
  modal = null;
  g.over = true;
  const top = Math.max(...g.teams.map((x) => x.score));
  g.winners = g.teams.map((x, i) => (x.score === top ? i : -1)).filter((i) => i >= 0);
  if (g.teams.some((x) => x.turns > 0)) {
    stats.games.unshift({ d: Date.now(), teams: g.teams.map((x) => ({ n: x.name, k: x.color, s: x.score })), w: g.winners });
    stats.games.length = Math.min(stats.games.length, 50);
    store.set('stats', stats);
  }
  store.set('seen', seen);
  store.set('game', null);
  screen = 'over';
  sfx.win();
  confetti();
}

function ask(text, fn, lang) { modal = { text, fn, yes: t('yes', lang), no: t('no', lang) }; }

/* ================= views ================= */
const stepRow = (label, key, value) => `<div class="rrow"><span>${label}</span><div class="stepper"><button data-act="step" data-k="${key}" data-d="-1" aria-label="−">−</button><b>${value}</b><button data-act="step" data-k="${key}" data-d="1" aria-label="+">+</button></div></div>`;
const segRow = (label, key, options, current) => `<div class="rrow col"><span>${label}</span><div class="seg">${options.map(([v, text]) => `<button class="${v === current ? 'on' : ''}" data-act="seg" data-k="${key}" data-v="${v}">${text}</button>`).join('')}</div></div>`;
const switchRow = (label, key, on) => `<div class="rrow"><span>${label}</span><button class="switch ${on ? 'on' : ''}" data-act="toggle" data-k="${key}" role="switch" aria-checked="${on}" aria-label="${label}"></button></div>`;
const scoreChips = (teams, current) => teams.map((x, i) => `<div class="sc ${current.includes(i) ? 'cur' : ''}" style="--c:${COLORS[x.color ?? x.k]}"><i></i><span>${esc(x.name ?? x.n)}</span><b>${x.score ?? x.s}</b></div>`).join('');

function viewHome() {
  const canResume = game && !game.over;
  return `<section class="screen home">
    <div class="langs seg">${LANGS.map((l) => `<button class="${ui === l ? 'on' : ''}" data-act="lang" data-v="${l}">${LANG_NAME[l]}</button>`).join('')}</div>
    <div class="logo" role="img" aria-label="Tabu"><span>T</span><span>A</span><span>B</span><span>U</span></div>
    <p class="tagline">${t('tagline')}</p>
    <div class="menu">
      ${canResume ? `<button class="btn big primary" data-act="resumeGame">${t('resumeGame')}</button>` : ''}
      <button class="btn big ${canResume ? '' : 'primary'}" data-act="go" data-v="setup">${t('newGame')}</button>
      <button class="btn" data-act="go" data-v="stats">${t('stats')}</button>
      <button class="btn" data-act="go" data-v="howto">${t('howTo')}</button>
    </div>
    <p class="foot">${t('deckInfo', { n: CARDS.length })}</p>
  </section>`;
}

function viewSetup() {
  const s = setup, r = s.rules;
  const counts = s.teams.map((tm) => countFor(tm, s.cats));
  const ready = counts.every((n) => n >= MIN_CARDS);
  const seenN = seenCount();
  const teams = s.teams.map((tm, i) => `<div class="tcard" style="--team:${COLORS[tm.color]}">
      <div class="trow">
        <button class="dot" data-act="color" data-i="${i}" aria-label="${t('team')} ${i + 1}"></button>
        <input class="tname" data-i="${i}" value="${esc(tm.name)}" placeholder="${t('team')} ${i + 1}" maxlength="18" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="done">
        ${s.teams.length > 2 ? `<button class="x" data-act="delTeam" data-i="${i}" aria-label="✕">✕</button>` : ''}
      </div>
      <div class="field"><label>${t('playLang')}</label><div class="seg">${LANGS.map((l) => `<button class="${tm.lang === l ? 'on' : ''}" data-act="tlang" data-i="${i}" data-v="${l}">${LANG_NAME[l]}</button>`).join('')}</div></div>
      <div class="field"><label>${t('levels')} <small>· ${t('levelHint')}</small></label><div class="chips">${LEVELS.map((lv, k) => `<button class="chip ${tm.levels[k] ? 'on' : ''}" data-act="tlevel" data-i="${i}" data-v="${k}">${lv}</button>`).join('')}</div></div>
      <div class="field"><label>${t('helpers')}</label><div class="chips">${LANGS.filter((l) => l !== tm.lang).map((l) => `<button class="chip ${tm.helpers.includes(l) ? 'on' : ''}" data-act="thelp" data-i="${i}" data-v="${l}">${LANG_NAME[l]}</button>`).join('')}</div></div>
      <div class="avail ${counts[i] < MIN_CARDS ? 'bad' : ''}">${counts[i] < MIN_CARDS ? t('tooFew', { n: MIN_CARDS }) : t('available', { n: counts[i] })}</div>
    </div>`).join('');
  return `<section class="screen">
    <header class="top"><button class="back" data-act="go" data-v="home" aria-label="${t('home')}">‹</button><h1>${t('setup')}</h1><span></span></header>
    <div class="scroll">
      <h2>${t('teams')}</h2>
      ${teams}
      ${s.teams.length < MAX_TEAMS ? `<button class="btn ghost" data-act="addTeam">${t('addTeam')}</button>` : ''}
      <h2>${t('rules')}</h2>
      <div class="group">
        ${stepRow(t('time'), 'time', `${r.time} ${t('sec')}`)}
        ${stepRow(t('passes'), 'passes', r.passes < 0 ? t('unlimited') : r.passes)}
        ${stepRow(t('pCorrect'), 'correct', '+' + r.correct)}
        ${stepRow(t('pTaboo'), 'taboo', signed(-r.taboo))}
        ${stepRow(t('pPass'), 'passCost', signed(-r.passCost))}
        ${segRow(t('winBy'), 'win', [['score', t('winScore')], ['rounds', t('winRounds')]], r.win)}
        ${r.win === 'score' ? stepRow(t('target'), 'target', r.target) : stepRow(t('roundsEach'), 'rounds', r.rounds)}
        ${segRow(t('tabooWords'), 'tabooWords', [[3, '3'], [4, '4'], [5, '5']], r.tabooWords)}
        ${segRow(t('jokers'), 'jokers', [[0, t('jOff')], [1, t('jRare')], [2, t('jOften')]], r.jokers)}
        ${switchRow(t('sound'), 'sound', r.sound)}
        ${switchRow(t('noRepeat'), 'noRepeat', r.noRepeat)}
      </div>
      <h2>${t('cats')}</h2>
      <div class="chips">
        <button class="chip ${s.cats.every(Boolean) ? 'on' : ''}" data-act="catAll">${t('all')}</button>
        ${CATS.map((c, i) => `<button class="chip ${s.cats[i] ? 'on' : ''}" data-act="cat" data-i="${i}">${t('cat')[c]}</button>`).join('')}
      </div>
      <p class="note">${t('seenInfo', { n: CARDS.length, s: seenN })} ${seenN ? `<button class="link" data-act="resetSeen">${t('resetSeen')}</button>` : ''}</p>
    </div>
    <button class="btn primary big" data-act="start" ${ready ? '' : 'disabled'}>${t('start')}</button>
  </section>`;
}

function viewReady() {
  const g = game, tm = g.teams[g.turn], L = tm.lang, r = g.rules;
  const goal = g.tiebreak ? t('tiebreak', L) : r.win === 'score' ? t('toTarget', L, { n: r.target }) : t('roundOf', L, { a: g.round, b: r.rounds });
  const jk = g.joker ? t('j', L)[g.joker] : null;
  return `<section class="screen team ready">
    <header class="top"><button class="round-btn" data-act="menu" aria-label="${t('menu', L)}">☰</button><span class="goal">${goal}</span></header>
    <div class="mid">
      <p class="kicker">${t('round', L, { n: g.round })}</p>
      <h1 class="tname-big">${esc(tm.name)}</h1>
      <p class="badges"><span>${LANG_NAME[tm.lang]}</span><span>${LEVELS.filter((_, i) => tm.levels[i]).join(' · ')}</span></p>
      ${jk ? `<div class="joker"><span class="jicon">${JOKER_ICON[g.joker]}</span><div><small>${t('jokerTitle', L)}</small><b>${jk[0]}</b><p>${jk[1]}</p></div></div>` : ''}
      <p class="hand">${t('handPhone', L)}</p>
    </div>
    <div class="scores">${scoreChips(g.teams, [g.turn])}</div>
    <button class="btn white big" data-act="begin">${t('go', L)}</button>
  </section>`;
}

function viewPlay() {
  const g = game, r = round, tm = g.teams[r.team], L = tm.lang, c = r.cur;
  const left = r.paused ? r.remaining : r.endAt - performance.now();
  const sec = Math.max(0, Math.ceil(left / 1000));
  const words = c[L];
  const helpers = tm.helpers.map((h) => `<span lang="${LOCALE[h]}"><i>${LANG_TAG[h]}</i>${esc(c[h][0])}${h === 'zh' ? pinyinHtml(c) : ''}</span>`).join('');
  const jk = r.joker ? t('j', L)[r.joker] : null;
  return `<section class="screen team play ${r.flash ? 'flash-' + r.flash : ''}">
    <header class="pbar">
      <button class="round-btn" data-act="pause" aria-label="${t('paused', L)}">❚❚</button>
      <div class="pmid"><b>${esc(tm.name)}</b><span>${signed(roundScore(r, g.rules))}</span></div>
      <div id="timer" class="timer ${sec <= 10 ? 'low' : ''}">${sec}</div>
    </header>
    <div class="track"><i id="bar" style="transform:scaleX(${Math.max(0, left / r.total)})"></i></div>
    ${jk ? `<div class="jtag">${JOKER_ICON[r.joker]} ${jk[0]}</div>` : ''}
    <article class="card ${r.deal ? 'deal' : ''} ${r.paused ? 'blur' : ''}" lang="${LOCALE[L]}">
      <div class="card-top">
        <small>${t('cat', L)[CATS[c.cat]]} · ${LEVELS[c.lvl]}</small>
        <h1 class="word" style="--n:${wordWidth(words[0])}">${esc(words[0])}</h1>
        ${L === 'zh' ? pinyinHtml(c) : ''}
        ${helpers ? `<div class="helpers">${helpers}</div>` : ''}
      </div>
      <ul class="taboo-list">${words.slice(1, 1 + g.rules.tabooWords).map((w, i) => `<li>${esc(w)}${L === 'zh' ? pinyinHtml(c, i + 1) : ''}</li>`).join('')}</ul>
    </article>
    <footer class="dock">
      <button class="act taboo" data-act="mark" data-v="t"><i>✕</i>${t('taboo', L)}</button>
      <button class="act pass" data-act="mark" data-v="p" ${r.passesLeft === 0 ? 'disabled' : ''}><i>↷</i>${t('pass', L)}<small>${r.passesLeft < 0 ? '∞' : r.passesLeft}</small></button>
      <button class="act correct" data-act="mark" data-v="c"><i>✓</i>${t('correct', L)}</button>
    </footer>
    ${r.paused ? `<div class="overlay"><div class="sheet"><h3>${t('paused', L)}</h3>
      <button class="btn primary" data-act="resume">${t('cont', L)}</button>
      <button class="btn" data-act="endRound">${t('endRound', L)}</button>
      <button class="btn" data-act="quit">${t('quit', L)}</button></div></div>` : ''}
  </section>`;
}

function viewSummary() {
  const g = game, r = round, tm = g.teams[r.team], L = tm.lang;
  const n = { c: 0, t: 0, p: 0, '-': 0 };
  for (const c of r.cards) n[c.res]++;
  const rows = r.cards.map((c, i) => `<button class="srow res-${c.res === '-' ? 'n' : c.res}" data-act="fix" data-i="${i}"><span lang="${LOCALE[L]}">${esc(BY_ID[c.id][L][0])}${L === 'zh' ? pinyinHtml(BY_ID[c.id]) : ''}</span><em>${RES_ICON[c.res]}</em></button>`).join('');
  return `<section class="screen team summary">
    <header class="shead">
      <p>${t(r.timeUp ? 'timeUp' : 'roundOver', L)}</p>
      <h1>${esc(tm.name)}</h1>
      <div class="pts">${signed(roundScore(r, g.rules))}</div>
      <div class="tally"><span>✓ ${n.c}</span><span>✕ ${n.t}</span><span>↷ ${n.p}</span></div>
    </header>
    <div class="scroll panel">${rows || `<p class="empty">${t('noCards', L)}</p>`}</div>
    ${rows ? `<p class="hint">${t('fixHint', L)}</p>` : ''}
    <button class="btn white big" data-act="commit">${t('next', L)}</button>
  </section>`;
}

function viewOver() {
  const g = game;
  const order = g.teams.map((x) => x).sort((a, b) => b.score - a.score);
  const max = Math.max(1, ...order.map((x) => Math.abs(x.score)));
  const title = g.winners.length === 1 ? t('winner', { t: esc(g.teams[g.winners[0]].name) }) : t('tie');
  return `<section class="screen over">
    <div class="mid"><div class="trophy">🏆</div><h1>${title}</h1></div>
    <div class="rank">${order.map((x) => `<div class="rrank" style="--c:${COLORS[x.color]}">
      <span>${esc(x.name)}</span><b>${x.score}</b>
      <div class="barw"><i style="width:${Math.max(3, (Math.max(0, x.score) / max) * 100)}%"></i></div>
      <small>✓ ${x.c} · ✕ ${x.t} · ↷ ${x.p}</small></div>`).join('')}</div>
    <button class="btn primary big" data-act="again">${t('again')}</button>
    <button class="btn" data-act="go" data-v="home">${t('home')}</button>
  </section>`;
}

function viewStats() {
  const cards = Object.entries(stats.cards).filter(([id]) => BY_ID[id]);
  const tot = { c: 0, t: 0, p: 0 };
  for (const [, s] of cards) { tot.c += s.c; tot.t += s.t; tot.p += s.p; }
  const played = tot.c + tot.t + tot.p;
  const hard = cards.map(([id, s]) => ({ id, s, miss: s.t + s.p })).filter((x) => x.miss > 0).sort((a, b) => b.miss - a.miss || a.s.c - b.s.c).slice(0, 8);
  const fmt = new Intl.DateTimeFormat(LOCALE[ui], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const games = stats.games.slice(0, 10).map((gm) => `<div class="grow"><time>${fmt.format(new Date(gm.d))}</time><div class="scores">${scoreChips(gm.teams, gm.w)}</div></div>`).join('');
  return `<section class="screen">
    <header class="top"><button class="back" data-act="go" data-v="home" aria-label="${t('home')}">‹</button><h1>${t('stats')}</h1><span></span></header>
    <div class="scroll">
      <div class="tiles">
        <div class="tile"><b>${stats.games.length}</b><span>${t('games')}</span></div>
        <div class="tile"><b>${played}</b><span>${t('cardsPlayed')}</span></div>
        <div class="tile"><b>${played ? Math.round((tot.c / played) * 100) + '%' : '–'}</b><span>${t('accuracy')}</span></div>
      </div>
      <h2>${t('recent')}</h2>
      ${games || `<p class="note">${t('noStats')}</p>`}
      ${hard.length ? `<h2>${t('hardest')}</h2><div class="group">${hard.map((x) => `<div class="hrow"><span lang="${LOCALE[ui]}">${esc(BY_ID[x.id][ui][0])}${ui === 'zh' ? pinyinHtml(BY_ID[x.id]) : ''}</span><small>✓ ${x.s.c} · ✕ ${x.s.t} · ↷ ${x.s.p}</small></div>`).join('')}</div>` : ''}
      ${stats.games.length || played ? `<p class="note"><button class="link" data-act="resetStats">${t('resetStats')}</button></p>` : ''}
    </div>
  </section>`;
}

function viewHowto() {
  return `<section class="screen">
    <header class="top"><button class="back" data-act="go" data-v="home" aria-label="${t('home')}">‹</button><h1>${t('howTo')}</h1><span></span></header>
    <div class="scroll">
      <ol class="how">${t('how').map((line) => `<li>${line}</li>`).join('')}</ol>
      <h2>${t('jokers')}</h2>
      <div class="group">${JOKERS.map((j) => `<div class="hrow"><span>${JOKER_ICON[j]} ${t('j')[j][0]}</span><small style="white-space:normal;text-align:right">${t('j')[j][1]}</small></div>`).join('')}</div>
      <p class="credit">${t('credit')}</p>
    </div>
  </section>`;
}

function viewModal() {
  if (!modal) return '';
  if (modal.menu) {
    const L = modal.lang;
    return `<div class="overlay"><div class="sheet"><h3>${t('menu', L)}</h3>
      <button class="btn" data-act="askEnd">${t('endGame', L)}</button>
      <button class="btn" data-act="toHome">${t('home', L)}</button>
      <button class="btn primary" data-act="modalNo">${t('close', L)}</button></div></div>`;
  }
  return `<div class="overlay"><div class="sheet"><p>${modal.text}</p>
    <button class="btn primary" data-act="modalYes">${modal.yes}</button>
    <button class="btn" data-act="modalNo">${modal.no}</button></div></div>`;
}

const VIEWS = { home: viewHome, setup: viewSetup, ready: viewReady, play: viewPlay, summary: viewSummary, over: viewOver, stats: viewStats, howto: viewHowto };

function render() {
  const old = app.querySelector('.scroll');
  const top = old ? old.scrollTop : 0;
  const sameScreen = app.dataset.screen === screen;
  app.innerHTML = VIEWS[screen]() + viewModal();
  app.dataset.screen = screen;
  if (sameScreen) { const now = app.querySelector('.scroll'); if (now) now.scrollTop = top; }
  if (round) { round.flash = null; round.deal = false; }
  if (screen !== 'over') document.querySelectorAll('.confetti').forEach((el) => el.remove());

  // The whole screen takes the colour of the team whose turn it is.
  let color = '';
  if (game && screen === 'ready') color = COLORS[game.teams[game.turn].color];
  else if (game && round && (screen === 'play' || screen === 'summary')) color = COLORS[game.teams[round.team].color];
  document.documentElement.style.setProperty('--team', color || '#8e5beb');
  document.body.classList.toggle('teamed', !!color);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = color || '#15122a';
}

/* ================= actions ================= */
const ACTIONS = {
  lang(b) {
    ui = b.dataset.v;
    store.set('ui', ui);
    document.documentElement.lang = LOCALE[ui];
    // Until a setup has been saved, new teams simply follow the interface language.
    if (!store.get('setup', null)) setup.teams.forEach((tm) => { tm.lang = ui; tm.helpers = []; });
  },
  go(b) { screen = b.dataset.v; },
  resumeGame() { round = null; screen = 'ready'; },

  color(b) {
    const tm = setup.teams[+b.dataset.i], taken = setup.teams.filter((x) => x !== tm).map((x) => x.color);
    let c = tm.color;
    do { c = (c + 1) % COLORS.length; } while (taken.includes(c) && c !== tm.color);
    tm.color = c;
  },
  addTeam() {
    const taken = setup.teams.map((x) => x.color);
    const free = COLORS.findIndex((_, i) => !taken.includes(i));
    setup.teams.push(newTeam(free < 0 ? 0 : free));
  },
  delTeam(b) { if (setup.teams.length > 2) setup.teams.splice(+b.dataset.i, 1); },
  tlang(b) { const tm = setup.teams[+b.dataset.i]; tm.lang = b.dataset.v; tm.helpers = tm.helpers.filter((l) => l !== tm.lang); },
  tlevel(b) { const tm = setup.teams[+b.dataset.i], k = +b.dataset.v; tm.levels[k] = tm.levels[k] ? 0 : 1; if (!tm.levels.some(Boolean)) tm.levels[k] = 1; },
  thelp(b) { const tm = setup.teams[+b.dataset.i], l = b.dataset.v; tm.helpers = tm.helpers.includes(l) ? tm.helpers.filter((x) => x !== l) : [...tm.helpers, l]; },
  step(b) { const k = b.dataset.k, [min, max, by] = STEP[k]; setup.rules[k] = Math.min(max, Math.max(min, setup.rules[k] + by * +b.dataset.d)); },
  seg(b) { const k = b.dataset.k; setup.rules[k] = k === 'win' ? b.dataset.v : +b.dataset.v; },
  toggle(b) { const k = b.dataset.k; setup.rules[k] = !setup.rules[k]; },
  cat(b) { const i = +b.dataset.i; setup.cats[i] = !setup.cats[i]; if (!setup.cats.some(Boolean)) setup.cats[i] = true; },
  catAll() { const all = setup.cats.every(Boolean); setup.cats = setup.cats.map((_, i) => !all || i === 0); },
  resetSeen() { ask(t('askResetSeen'), () => { seen = {}; store.set('seen', seen); }); },
  start() { startGame(); },

  begin() { beginRound(); },
  mark(b) { mark(b.dataset.v); },
  pause() { pauseRound(); },
  resume() { resumeRound(); },
  endRound() { finishRound(false); },
  quit() { const L = game.teams[round.team].lang; ask(t('askQuit', L), () => { stopTimer(); round = null; screen = 'home'; }, L); },
  fix(b) { const c = round.cards[+b.dataset.i]; c.res = NEXT_RES[c.res]; },
  commit() { commitRound(); },

  menu() { modal = { menu: true, lang: game.teams[game.turn].lang }; },
  askEnd() { const L = modal.lang; ask(t('askEnd', L), endGame, L); },
  toHome() { modal = null; screen = 'home'; },
  modalYes() { const fn = modal.fn; modal = null; if (fn) fn(); },
  modalNo() { modal = null; },

  again() { startGame(); },
  resetStats() { ask(t('askResetStats'), () => { stats = { games: [], cards: {} }; store.set('stats', stats); }); },
};

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (!b || b.disabled || !ACTIONS[b.dataset.act]) return;
  ACTIONS[b.dataset.act](b);
  if (screen === 'setup') saveSetup();
  render();
});
document.addEventListener('input', (e) => {
  const el = e.target;
  if (!el.classList.contains('tname')) return;
  setup.teams[+el.dataset.i].name = el.value;
  saveSetup();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.classList.contains('tname')) e.target.blur(); });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { if (screen === 'play' && round && !round.paused) { pauseRound(); render(); } }
  else if (screen === 'play' && round && !round.paused) wakeOn();
});
// iOS standalone apps can still pinch-zoom; a party game on a shared phone should not.
document.addEventListener('gesturestart', (e) => e.preventDefault());
// iOS Safari only shows :active (pressed) styles when the page listens for touches.
document.addEventListener('touchstart', () => {}, { passive: true });

document.documentElement.lang = LOCALE[ui];
render();

if ('serviceWorker' in navigator && (location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname))) {
  navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is optional */ });
}
})();
