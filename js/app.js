/**
 * 美食節電子場刊 — 主程式
 * 啟航 1331 · 美食節
 *
 * 模組：
 *   - 插畫式地圖（SVG + 漸層／陰影）
 *   - 語言切換
 *   - 攤位渲染 + 篩選
 *   - 節目渲染
 *   - 底部滑出面板
 *   - QR Code 生成
 *   - 底部導航
 */

// ══════════════════════════════════════════════════════════════
// 全域狀態
// ══════════════════════════════════════════════════════════════
let CURRENT_LANG = 'zh';
let ACTIVE_PAGE = 'map';
let ACTIVE_FILTER = 'all';
let ACTIVE_DATE = '';
let SELECTED_STALL = null;
let SELECTED_EVENT = null;
/** 從地圖區域標進入攤位頁時僅顯示該區攤位；改篩選或搜尋時清除 */
let STALL_ZONE_FILTER = null;

// 語言文字映射（HTML 元素用）
const I18N = {
  // Header
  'brand-name': {
    zh: '美食節',
    en: 'Food Festival'
  },
  'brand-sub': {
    zh: '啟航 1331 · Kai Tak',
    en: 'Runway 1331 · 啟航'
  },
  // Page titles
  'map-page-title':    { zh: '場地地圖',         en: 'Venue Map' },
  'stalls-page-title':  { zh: '美食攤位',          en: 'Food Stalls' },
  'events-page-title': { zh: '節目表',             en: 'Event Schedule' },
  'transport-page-title': { zh: '交通指引',         en: 'Transport' },
  // Nav
  'nav-map':    { zh: '地圖',    en: 'Map' },
  'nav-stalls': { zh: '攤位',    en: 'Stalls' },
  'nav-events': { zh: '節目',    en: 'Events' },
  // Map
  'transport-btn-text': { zh: '🚇 交通指引',        en: '🚇 Transport' },
  'map-hint': {
    zh: '點擊氣球標可前往該區攤位列表（A 區舞台／B 區美食）',
    en: 'Tap a pin to open that zone’s stall list (A stage / B food).'
  },
  'map-window-title': {
    zh: '啟航 1331 · 數字地圖',
    en: 'Runway 1331 · Digital Map'
  },
  'map-search-placeholder': {
    zh: '搜尋攤位或地點…',
    en: 'Search stalls or places…'
  },
  // Stalls
  'search-placeholder': { zh: '搜尋攤位...',          en: 'Search stalls...' },
  'filter-all':     { zh: '全部 ALL',   en: '全部 ALL' },
  'filter-food':   { zh: '🍜 美食',    en: '🍜 Food' },
  'filter-drink':  { zh: '🥤 飲品',    en: '🥤 Drinks' },
  'filter-facility':{ zh: '🏪 設施',   en: '🏪 Facilities' },
  'filter-coming':  { zh: '⏳ 即將',    en: '⏳ Coming' },
  // Event
  'event-free':    { zh: '免費',          en: 'Free' },
  'event-ticket':  { zh: '立即購票 →',    en: 'Buy Ticket →' },
  // Detail panel
  'panel-venue':   { zh: '📍 區域',        en: '📍 Zone' },
  'panel-navigate':{ zh: '📍 開始導航',    en: '📍 Navigate' },
  'panel-all-stalls': { zh: '查看全部攤位', en: 'All Stalls' },
  // Notice
  'notice-default': {
    zh: '🎉 美食節火熱進行中！A區舞台精彩演出，B區美食等緊你！',
    en: '🎉 Food Festival is LIVE! Zone A stage shows & Zone B food stalls await!'
  },
  // Empty state
  'empty-stalls': {
    zh: '冇搵到相關攤位 😢\n試下其他關鍵詞？',
    en: 'No stalls found 😢\nTry a different keyword?'
  },
  // Back button
  'back-to-map': {
    zh: '← 返回地圖',
    en: '← Back to Map'
  },
  // QR
  'qr-title': {
    zh: '掃碼分享',
    en: 'Share / Scan'
  },
  'qr-url-label': {
    zh: '或複製以下網址',
    en: 'Or copy this URL'
  },
  'qr-close': {
    zh: '關閉',
    en: 'Close'
  },
  // Transport
  'transport-external': {
    zh: '外部地圖 · EXTERNAL MAP',
    en: 'External Maps · 外部地圖'
  },
  // Map legend
  'legend-zone-a':   { zh: 'A 區', en: 'Zone A' },
  'legend-zone-b':   { zh: 'B 區', en: 'Zone B' },
  'legend-facility':{ zh: '設施', en: 'Facility' },
  'legend-coming':   { zh: '即將開業', en: 'Coming Soon' }
};

// 攤位圖標映射
const STALL_ICONS = {
  food:      '🍜',
  drink:     '🥤',
  handcraft: '🎨',
  facility:  '🏪'
};

/** 淺色頁面下的像素地圖配色（SVG 內聯，與白底對比清晰） */
const MAP_PIXEL = {
  frame: '#dde5d8',
  dot: '#9aad92',
  lawn: '#c2e8a8',
  grass: '#7cbd5c',
  aZoneFill: '#fff4ed',
  aStroke: '#d94a32',
  stageFill: '#fff8f4',
  audienceFill: '#ffd8c4',
  gold: '#b86f00',
  bWalk: '#aee5d8',
  bWalkDeep: '#8fd4c4',
  bStroke: '#1a7d72',
  bLabel: '#0d5c54',
  signGreen: '#2a8f4a',
  stallFill: '#ffffff',
  stallStroke: '#1a7d72',
  comingFill: '#e8ecf2',
  comingStroke: '#6b7a94',
  /** 手繪示意配色 */
  sketchBRed: '#f2c4bc',
  sketchBRedStroke: '#b83228',
  sketchAYellow: '#fff3c4',
  sketchAYellowStroke: '#b8860b',
  sketchOutlineGreen: '#2e8b36',
  sketchBoothBlue: '#2f6fad',
  sketchStair: '#1e1e1e',
  sketchBrown: '#9a7b3c',
  sketchBlackBar: '#121212',
  sketchAirLawn: '#c8e8b8'
};

// ══════════════════════════════════════════════════════════════
// 初始化
// ══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // 從 localStorage 讀取語言
  const savedLang = localStorage.getItem('food-festival-lang');
  if (savedLang) {
    CURRENT_LANG = savedLang;
    updateLangUI();
  }

  initUI();
  applyLang();
  initNav();
  initLangSwitch();
  initMap();
  initStalls();
  initEvents();
  initPanel();
  initQR();
  initNotice();
  initMapMetaClock();
  initMapSearch();
  initMapTools();
});

// ══════════════════════════════════════════════════════════════
// UI 初始化
// ══════════════════════════════════════════════════════════════
function initUI() {
  // 返回地圖按鈕
  document.getElementById('back-to-map').addEventListener('click', () => {
    navigateTo('map');
  });

  // 交通入口按鈕
  document.getElementById('go-transport').addEventListener('click', () => {
    navigateTo('transport');
  });
}

// ══════════════════════════════════════════════════════════════
// 語言切換
// ══════════════════════════════════════════════════════════════
function initLangSwitch() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang === CURRENT_LANG) return;
      CURRENT_LANG = lang;
      localStorage.setItem('food-festival-lang', lang);
      updateLangUI();
      applyLang();
      // 重新渲染動態內容
      renderStallGrid();
      renderEventList();
      renderTransport();
      renderMap();
      initNotice();
      refreshMapMetaTime();
      updatePanel();
    });
  });
}

function updateLangUI() {
  document.getElementById('lang-zh').classList.toggle('active', CURRENT_LANG === 'zh');
  document.getElementById('lang-en').classList.toggle('active', CURRENT_LANG === 'en');
}

function applyLang() {
  // HTML lang 屬性
  document.documentElement.lang = CURRENT_LANG;

  // 頁面標題
  document.title = CURRENT_LANG === 'zh'
    ? '美食節 · 啟航 1331'
    : 'Food Festival · Runway 1331';

  // 所有可翻譯元素
  Object.keys(I18N).forEach(key => {
    const el = document.getElementById(key);
    if (el) {
      el.textContent = I18N[key][CURRENT_LANG] || I18N[key].zh;
    }
  });

  const mapSearchInp = document.getElementById('map-quick-search');
  if (mapSearchInp && I18N['map-search-placeholder']) {
    mapSearchInp.placeholder = I18N['map-search-placeholder'][CURRENT_LANG];
  }
  const transportLbl = document.getElementById('transport-external-label');
  if (transportLbl && I18N['transport-external']) {
    transportLbl.textContent = I18N['transport-external'][CURRENT_LANG];
  }

  // 搜尋框 placeholder
  document.getElementById('stall-search').placeholder =
    CURRENT_LANG === 'zh' ? '搜尋攤位...' : 'Search stalls...';

  // 圖例（僅 A / B 區）
  document.querySelectorAll('.legend-item span').forEach((el, i) => {
    const keys = ['legend-zone-a', 'legend-zone-b'];
    if (keys[i] && I18N[keys[i]]) {
      el.textContent = I18N[keys[i]][CURRENT_LANG] || el.textContent;
    }
  });
}

// ══════════════════════════════════════════════════════════════
// 底部導航
// ══════════════════════════════════════════════════════════════
function initNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      navigateTo(page);
    });
  });
}

function navigateTo(page) {
  ACTIVE_PAGE = page;

  // 更新 Nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  // 更新 Page
  document.querySelectorAll('.page').forEach(p => {
    p.classList.toggle('active', p.id === `page-${page}`);
  });

  // 滾動到頂部
  document.querySelectorAll('.page').forEach(p => p.scrollTop = 0);
  const activePage = document.getElementById(`page-${page}`);
  if (activePage) activePage.scrollTop = 0;

  // 交通頁初始化（lazy render）
  if (page === 'transport') {
    renderTransport();
  }
}

// ══════════════════════════════════════════════════════════════
// 公告
// ══════════════════════════════════════════════════════════════
function initNotice() {
  const el = document.getElementById('notice-text');
  if (NOTICES && NOTICES.length > 0) {
    const notice = NOTICES[0];
    el.textContent = CURRENT_LANG === 'zh' ? notice.zh : notice.en;
  } else {
    el.textContent = I18N['notice-default'][CURRENT_LANG];
  }
}

function refreshMapMetaTime() {
  const el = document.getElementById('map-window-meta');
  if (!el) return;
  const now = new Date();
  const locale = CURRENT_LANG === 'zh' ? 'zh-HK' : 'en-US';
  el.textContent = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}

function initMapMetaClock() {
  refreshMapMetaTime();
  setInterval(refreshMapMetaTime, 60000);
}

function initMapSearch() {
  const inp = document.getElementById('map-quick-search');
  if (!inp) return;
  inp.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const q = inp.value.trim();
    STALL_ZONE_FILTER = null;
    navigateTo('stalls');
    const stallSearch = document.getElementById('stall-search');
    if (stallSearch) stallSearch.value = q;
    renderStallGrid(q);
  });
}

function initMapTools() {
  document.getElementById('map-tool-zones')?.addEventListener('click', () => {
    document.getElementById('map-legend')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  document.getElementById('map-fab-nav')?.addEventListener('click', () => {
    if (VENUE?.maps?.google) window.open(VENUE.maps.google, '_blank');
  });
}

// ══════════════════════════════════════════════════════════════
// 像素地圖
// ══════════════════════════════════════════════════════════════
function initMap() {
  renderMap();

  const mapEl = document.getElementById('map-container');
  const svgEl = document.getElementById('pixel-map');
  let scale = 1;
  mapEl?.addEventListener('wheel', (e) => {
    e.preventDefault();
    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(0.55, scale), 2.2);
    if (svgEl) svgEl.style.transform = `scale(${scale})`;
  });
}

/** 平面圖底圖 + 座標點式熱區（優先 mapPoint；否則 mapPos 矩形中心；VENUE.floorPlan.src） */
function renderMap() {
  const svg = document.getElementById('pixel-map');
  if (!svg) return;
  const lang = CURRENT_LANG;
  const NS = 'http://www.w3.org/2000/svg';
  const planSrc = (typeof VENUE !== 'undefined' && VENUE.floorPlan && VENUE.floorPlan.src)
    ? VENUE.floorPlan.src
    : 'assets/map-option-official-plan.png';

  svg.innerHTML = '';
  svg.style.transform = '';
  illuMapDefs(svg, NS);

  illuRRect(svg, NS, 0, 0, 320, 200, { fill: '#e8eaed', rx: 0 });

  const img = document.createElementNS(NS, 'image');
  img.setAttribute('width', '320');
  img.setAttribute('height', '200');
  img.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  img.setAttribute('href', planSrc);
  img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', planSrc);
  img.addEventListener('error', () => {
    illuLabel(svg, NS, lang === 'zh' ? '請將平面圖放於 assets/' : 'Add map image under assets/', 160, 100, {
      size: 7,
      color: '#666',
      weight: '600'
    });
  });
  svg.appendChild(img);

  if (typeof ZONES !== 'undefined' && Array.isArray(ZONES)) {
    const order = ZONES.slice().sort((z1, z2) => (z1.id === 'a' ? 1 : -1));
    order.forEach(zone => drawZoneBalloonPin(svg, NS, zone));
  }
}

/**
 * 區域導航氣球標（尖端為座標點，風格近似地圖 App 圖釘）
 */
function drawZoneBalloonPin(svg, NS, zone) {
  let px = zone.pin && typeof zone.pin.x === 'number' ? zone.pin.x : null;
  let py = zone.pin && typeof zone.pin.y === 'number' ? zone.pin.y : null;
  if (px == null && zone.mapPos) {
    px = zone.mapPos.x + (zone.mapPos.w != null ? zone.mapPos.w / 2 : 0);
    py = zone.mapPos.y + (zone.mapPos.h != null ? zone.mapPos.h / 2 : 0);
  }
  if (px == null || py == null) return;

  const tipX = Math.round((px / 100) * 320);
  const tipY = Math.round((py / 100) * 200);
  const fill = zone.color || '#ff6b00';
  const letter = zone.id === 'a' ? 'A' : zone.id === 'b' ? 'B' : String(zone.id || '?').charAt(0).toUpperCase();

  const g = document.createElementNS(NS, 'g');
  g.setAttribute('class', 'map-zone-balloon');
  g.setAttribute('transform', `translate(${tipX},${tipY}) scale(0.62) translate(-12,-31)`);

  const pinPath = document.createElementNS(NS, 'path');
  pinPath.setAttribute(
    'd',
    'M12 31 L4 10.5 A8.5 8.5 0 0 1 20 10.5 Z'
  );
  pinPath.setAttribute('fill', fill);
  pinPath.setAttribute('stroke', '#ffffff');
  pinPath.setAttribute('stroke-width', '2.25');
  pinPath.setAttribute('stroke-linejoin', 'round');
  pinPath.setAttribute('filter', 'url(#illu-drop-soft)');
  pinPath.setAttribute('pointer-events', 'none');

  const lbl = document.createElementNS(NS, 'text');
  lbl.setAttribute('x', '12');
  lbl.setAttribute('y', '12');
  lbl.setAttribute('text-anchor', 'middle');
  lbl.setAttribute('dominant-baseline', 'middle');
  lbl.setAttribute('font-family', "'Noto Sans TC', system-ui, sans-serif");
  lbl.setAttribute('font-size', '10');
  lbl.setAttribute('font-weight', '800');
  lbl.setAttribute('fill', '#ffffff');
  lbl.setAttribute('pointer-events', 'none');
  lbl.textContent = letter;

  g.appendChild(pinPath);
  g.appendChild(lbl);
  svg.appendChild(g);

  const hit = document.createElementNS(NS, 'circle');
  hit.setAttribute('cx', String(tipX));
  hit.setAttribute('cy', String(tipY - 10));
  hit.setAttribute('r', '24');
  hit.setAttribute('fill', 'transparent');
  hit.setAttribute('cursor', 'pointer');
  hit.classList.add('map-hit', 'map-hit-zone');
  hit.dataset.zoneId = zone.id;
  const go = () => openZoneFromMap(zone.id);
  hit.addEventListener('click', go);
  hit.addEventListener('touchend', e => {
    e.preventDefault();
    go();
  });
  svg.appendChild(hit);
}

function openZoneFromMap(zoneId) {
  STALL_ZONE_FILTER = zoneId;
  ACTIVE_FILTER = 'all';
  updateFilterUI();
  const stallSearch = document.getElementById('stall-search');
  if (stallSearch) stallSearch.value = '';
  navigateTo('stalls');
  renderStallGrid('');
}

function illuMapDefs(svg, NS) {
  const defs = document.createElementNS(NS, 'defs');

  const drop = document.createElementNS(NS, 'filter');
  drop.setAttribute('id', 'illu-drop');
  drop.setAttribute('x', '-15%');
  drop.setAttribute('y', '-15%');
  drop.setAttribute('width', '130%');
  drop.setAttribute('height', '130%');
  const fe = document.createElementNS(NS, 'feDropShadow');
  fe.setAttribute('dx', '0');
  fe.setAttribute('dy', '2');
  fe.setAttribute('stdDeviation', '2.5');
  fe.setAttribute('flood-opacity', '0.18');
  drop.appendChild(fe);
  defs.appendChild(drop);

  const dropSoft = document.createElementNS(NS, 'filter');
  dropSoft.setAttribute('id', 'illu-drop-soft');
  dropSoft.setAttribute('x', '-10%');
  dropSoft.setAttribute('y', '-10%');
  dropSoft.setAttribute('width', '120%');
  dropSoft.setAttribute('height', '120%');
  const fe2 = document.createElementNS(NS, 'feDropShadow');
  fe2.setAttribute('dx', '0');
  fe2.setAttribute('dy', '1');
  fe2.setAttribute('stdDeviation', '1.2');
  fe2.setAttribute('flood-opacity', '0.12');
  dropSoft.appendChild(fe2);
  defs.appendChild(dropSoft);

  svg.appendChild(defs);
}

function illuRRect(svg, NS, x, y, w, h, opts = {}) {
  const r = document.createElementNS(NS, 'rect');
  r.setAttribute('x', x);
  r.setAttribute('y', y);
  r.setAttribute('width', w);
  r.setAttribute('height', h);
  if (opts.rx != null) r.setAttribute('rx', opts.rx);
  r.setAttribute('fill', opts.fill ?? '#ccc');
  if (opts.stroke) {
    r.setAttribute('stroke', opts.stroke);
    r.setAttribute('stroke-width', opts.strokeWidth ?? 1);
  }
  if (opts.filter) r.setAttribute('filter', opts.filter);
  if (opts.opacity != null) r.setAttribute('opacity', opts.opacity);
  svg.appendChild(r);
  return r;
}

function illuLabel(svg, NS, text, x, y, opts = {}) {
  const t = document.createElementNS(NS, 'text');
  t.setAttribute('x', x);
  t.setAttribute('y', y);
  t.setAttribute('fill', opts.color ?? '#333');
  t.setAttribute('font-family', "'Noto Sans TC', system-ui, -apple-system, sans-serif");
  t.setAttribute('font-size', opts.size ?? 8);
  t.setAttribute('font-weight', opts.weight ?? '600');
  t.setAttribute('text-anchor', opts.anchor ?? 'middle');
  t.setAttribute('dominant-baseline', opts.baseline ?? 'middle');
  if (opts.stroke) {
    t.setAttribute('stroke', opts.stroke);
    t.setAttribute('stroke-width', opts.strokeWidth ?? '0.4');
    t.setAttribute('paint-order', 'stroke fill');
    t.setAttribute('stroke-linejoin', 'round');
  }
  t.textContent = text;
  svg.appendChild(t);
}

// ══════════════════════════════════════════════════════════════
// SVG 像素繪圖輔助函數
// ══════════════════════════════════════════════════════════════

/** 像素矩形（帶鋸齒邊緣效果） */
function drawPixelRect(svg, NS, x, y, w, h, fill, stroke, strokeW = 2) {
  // 外框
  const rect = document.createElementNS(NS, 'rect');
  rect.setAttribute('x', x);
  rect.setAttribute('y', y);
  rect.setAttribute('width', w);
  rect.setAttribute('height', h);
  rect.setAttribute('fill', fill);
  if (stroke) {
    rect.setAttribute('stroke', stroke);
    rect.setAttribute('stroke-width', strokeW);
  }
  svg.appendChild(rect);
  return rect;
}

/** 像素文字 */
function drawPixelText(svg, NS, text, x, y, color, fontSize, anchor = 'start') {
  const t = document.createElementNS(NS, 'text');
  t.setAttribute('x', x);
  t.setAttribute('y', y);
  t.setAttribute('fill', color);
  t.setAttribute('font-family', "'Press Start 2P', monospace");
  t.setAttribute('font-size', fontSize);
  t.setAttribute('text-anchor', anchor);
  t.setAttribute('dominant-baseline', 'middle');
  t.textContent = text;
  svg.appendChild(t);
  return t;
}

/** 像素小人（8-bit 風格） */
function drawPixelPerson(svg, NS, x, y, color) {
  // 頭
  const head = document.createElementNS(NS, 'rect');
  head.setAttribute('x', x);
  head.setAttribute('y', y);
  head.setAttribute('width', 4);
  head.setAttribute('height', 4);
  head.setAttribute('fill', color);
  svg.appendChild(head);
  // 身體
  const body = document.createElementNS(NS, 'rect');
  body.setAttribute('x', x);
  body.setAttribute('y', y + 5);
  body.setAttribute('width', 4);
  body.setAttribute('height', 6);
  body.setAttribute('fill', color);
  svg.appendChild(body);
}

/** 像素連接箭頭 */
function drawPixelArrow(svg, NS, x, y, color) {
  // 豎線
  const line = document.createElementNS(NS, 'rect');
  line.setAttribute('x', x - 1);
  line.setAttribute('y', y - 10);
  line.setAttribute('width', 2);
  line.setAttribute('height', 20);
  line.setAttribute('fill', color);
  line.setAttribute('opacity', '0.5');
  svg.appendChild(line);
}

/** 地圖攤位標記 */
function createMapMarker(svg, NS, stall, x, y, color, lang) {
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('cursor', 'pointer');

  // 閃爍方塊
  const box = document.createElementNS(NS, 'rect');
  box.setAttribute('x', x);
  box.setAttribute('y', y);
  box.setAttribute('width', 8);
  box.setAttribute('height', 8);
  box.setAttribute('fill', color);
  box.setAttribute('class', 'map-marker');
  box.style.animation = 'pixel-bounce 1s ease-in-out infinite';

  const text = document.createElementNS(NS, 'text');
  text.setAttribute('x', x + 4);
  text.setAttribute('y', y - 4);
  text.setAttribute('fill', color);
  text.setAttribute('font-family', "'Press Start 2P', monospace");
  text.setAttribute('font-size', 4);
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('dominant-baseline', 'middle');
  text.textContent = lang === 'zh' ? stall.zh.name.substring(0, 3) : stall.en.name.substring(0, 3);

  g.appendChild(box);
  g.appendChild(text);
  return g;
}

// ══════════════════════════════════════════════════════════════
// 攤位頁
// ══════════════════════════════════════════════════════════════
function initStalls() {
  // 篩選器
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      STALL_ZONE_FILTER = null;
      ACTIVE_FILTER = chip.dataset.filter;
      updateFilterUI();
      renderStallGrid();
    });
  });

  // 搜尋
  const searchInput = document.getElementById('stall-search');
  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim()) STALL_ZONE_FILTER = null;
    renderStallGrid(searchInput.value);
  });

  renderStallGrid();
}

function updateFilterUI() {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.filter === ACTIVE_FILTER);
  });
}

function renderStallGrid(query = '') {
  const grid = document.getElementById('stall-grid');
  const lang = CURRENT_LANG;
  const queryLower = query.toLowerCase().trim();

  // 過濾
  let filtered = STALLS.filter(s => {
    if (s.isFacility) return false; // 不顯示設施在攤位頁
    if (STALL_ZONE_FILTER && s.zone !== STALL_ZONE_FILTER) return false;
    if (ACTIVE_FILTER === 'all') return true;
    if (ACTIVE_FILTER === 'coming') return s.status === 'coming';
    return s.category === ACTIVE_FILTER;
  });

  // 搜尋
  if (queryLower) {
    filtered = filtered.filter(s => {
      const name = (lang === 'zh' ? s.zh.name : s.en.name).toLowerCase();
      const desc = (lang === 'zh' ? s.zh.desc : s.en.desc).toLowerCase();
      const tags = (lang === 'zh' ? s.zh.tags.join(' ') : s.en.tags.join(' ')).toLowerCase();
      return name.includes(queryLower) || desc.includes(queryLower) || tags.includes(queryLower);
    });
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <span class="empty-icon">🔍</span>
        <p class="empty-text">${lang === 'zh' ? '冇搵到相關攤位 😢\n試下其他關鍵詞？' : 'No stalls found 😢\nTry a different keyword?'}</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(stall => {
    const name = lang === 'zh' ? stall.zh.name : stall.en.name;
    const icon = STALL_ICONS[stall.category] || '📍';
    const statusLabel = getStatusLabel(stall.status, lang);
    const catLabel = getCategoryLabel(stall.category, lang);
    const isSelected = SELECTED_STALL === stall.id;

    return `
      <div class="stall-card ${isSelected ? 'selected' : ''}" data-stall-id="${stall.id}">
        <span class="stall-status ${stall.status}">${statusLabel}</span>
        <span class="stall-icon">${icon}</span>
        <div class="stall-id">${stall.id}</div>
        <div class="stall-name">${name}</div>
        <span class="stall-cat-tag">${catLabel}</span>
      </div>
    `;
  }).join('');

  // 綁定點擊
  grid.querySelectorAll('.stall-card').forEach(card => {
    card.addEventListener('click', () => {
      openStallPanel(card.dataset.stallId);
    });
  });
}

// ══════════════════════════════════════════════════════════════
// 節目頁
// ══════════════════════════════════════════════════════════════
function initEvents() {
  renderEventList();
}

function renderEventList() {
  const lang = CURRENT_LANG;
  const dates = getEventDates();
  const tabsEl = document.getElementById('date-tabs');
  const listEl = document.getElementById('event-list');

  // 默認選第一個日期
  if (!ACTIVE_DATE && dates.length > 0) {
    ACTIVE_DATE = dates[0];
  }

  // 日期標籤
  tabsEl.innerHTML = dates.map(date => {
    const label = formatDate(date, lang);
    const isActive = date === ACTIVE_DATE ? 'active' : '';
    return `<button class="date-tab ${isActive}" data-date="${date}">${label}</button>`;
  }).join('');

  // 綁定日期切換
  tabsEl.querySelectorAll('.date-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      ACTIVE_DATE = tab.dataset.date;
      tabsEl.querySelectorAll('.date-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderEventsForDate();
    });
  });

  renderEventsForDate();
}

function renderEventsForDate() {
  const lang = CURRENT_LANG;
  const listEl = document.getElementById('event-list');
  const events = EVENTS.filter(e => e.date === ACTIVE_DATE).sort((a, b) => a.time.localeCompare(b.time));

  if (events.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🎤</span>
        <p class="empty-text">${lang === 'zh' ? '呢日冇節目安排 🎵' : 'No events on this day 🎵'}</p>
      </div>`;
    return;
  }

  listEl.innerHTML = events.map(event => {
    const name = lang === 'zh' ? event.zh.name : event.en.name;
    const desc = lang === 'zh' ? event.zh.desc : event.en.desc;
    const venue = lang === 'zh' ? event.zh.venue : event.en.venue;
    const tags = lang === 'zh' ? event.zh.tags : event.en.tags;
    const price = lang === 'zh' ? event.ticketPrice.zh : event.ticketPrice.en;
    const isFree = !event.ticketRequired;
    const zoneTag = event.zone === 'a'
      ? `<span class="event-zone-tag zone-a">A ${lang === 'zh' ? '區' : ''}</span>`
      : `<span class="event-zone-tag zone-b">B ${lang === 'zh' ? '區' : ''}</span>`;

    const ticketBtn = event.ticketUrl
      ? `<button class="px-btn ticket" onclick="window.open('${event.ticketUrl}', '_blank')">🎟 ${lang === 'zh' ? '購票' : 'Buy Ticket'}</button>`
      : '';

    return `
      <div class="event-card" data-event-id="${event.id}">
        <div class="event-header">
          ${zoneTag}
          <div class="event-time">
            ${formatTime(event.time)} – ${formatTime(event.endTime)}
            <div class="end-time">${lang === 'zh' ? '至' : 'to'} ${formatTime(event.endTime)}</div>
          </div>
        </div>
        <div class="event-body">
          <div class="event-name">${name}</div>
          <div class="event-desc">${desc}</div>
          <div class="event-venue">📍 ${venue}</div>
          <div class="event-tags">
            ${tags.map(t => `<span class="event-tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="event-footer">
          <span class="event-price ${isFree ? 'free' : ''}">${isFree ? (lang === 'zh' ? '免費 Free' : 'Free') : price}</span>
          ${ticketBtn}
        </div>
      </div>
    `;
  }).join('');
}

// ══════════════════════════════════════════════════════════════
// 交通頁
// ══════════════════════════════════════════════════════════════
function renderTransport() {
  const lang = CURRENT_LANG;
  const listEl = document.getElementById('transport-list');

  listEl.innerHTML = TRANSPORT.map(t => {
    const title = lang === 'zh' ? t.zh.title : t.en.title;
    const lines = lang === 'zh' ? t.zh.lines : t.en.lines;

    return `
      <div class="transport-card">
        <span class="transport-icon">${t.icon}</span>
        <div class="transport-title">${title}</div>
        <ul class="transport-lines">
          ${lines.map(line => `<li>${line}</li>`).join('')}
        </ul>
      </div>
    `;
  }).join('');
}

// ══════════════════════════════════════════════════════════════
// 底部滑出面板
// ══════════════════════════════════════════════════════════════
function initPanel() {
  const overlay = document.getElementById('panel-overlay');
  const panel = document.getElementById('detail-panel');
  const closeBtn = document.getElementById('panel-close');

  const close = () => {
    panel.classList.remove('open');
    overlay.classList.remove('open');
    SELECTED_STALL = null;
    SELECTED_EVENT = null;
    renderStallGrid(); // 清除選中狀態
  };

  overlay.addEventListener('click', close);
  closeBtn.addEventListener('click', close);

  // 滑動關閉（觸摸設備）
  let startY = 0;
  panel.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
  });
  panel.addEventListener('touchmove', (e) => {
    const deltaY = e.touches[0].clientY - startY;
    if (deltaY > 50) close();
  });
}

function openStallPanel(stallId) {
  const stall = getStallById(stallId);
  if (!stall) return;

  SELECTED_STALL = stallId;
  const lang = CURRENT_LANG;

  // 更新面板內容
  document.getElementById('panel-id').textContent = stall.id;
  document.getElementById('panel-name').textContent = lang === 'zh' ? stall.zh.name : stall.en.name;
  document.getElementById('panel-zone').textContent = stall.zone === 'a'
    ? (lang === 'zh' ? 'A 區' : 'Zone A')
    : (lang === 'zh' ? 'B 區' : 'Zone B');
  document.getElementById('panel-category').textContent = getCategoryLabel(stall.category, lang);
  document.getElementById('panel-desc').textContent = lang === 'zh' ? stall.zh.desc : stall.en.desc;

  // 狀態
  const statusEl = document.getElementById('panel-status');
  statusEl.textContent = getStatusLabel(stall.status, lang);
  statusEl.className = `stall-status ${stall.status}`;

  // 標籤
  const tags = lang === 'zh' ? stall.zh.tags : stall.en.tags;
  document.getElementById('panel-tags').innerHTML = tags.map(t => `<span class="panel-tag">${t}</span>`).join('');

  // 操作按鈕
  const actionsEl = document.getElementById('panel-actions');
  let actionsHTML = '';

  // 地圖連結
  if (VENUE.maps.google) {
    actionsHTML += `
      <button class="px-icon-btn" onclick="window.open('${VENUE.maps.google}', '_blank')">
        🌐 ${lang === 'zh' ? '開啟地圖' : 'Open Map'}
      </button>`;
  }

  // 如果是舞台，顯示演出頁
  if (stall.id === 'A-STAGE' || stall.zone === 'a') {
    actionsHTML += `
      <button class="px-btn" onclick="document.getElementById('panel-close').click(); navigateTo('events');">
        🎤 ${lang === 'zh' ? '查看節目' : 'View Events'}
      </button>`;
  }

  // 如果是美食攤位，顯示全部攤位連結
  if (stall.zone === 'b' && !stall.isFacility) {
    actionsHTML += `
      <button class="px-btn" onclick="document.getElementById('panel-close').click(); navigateTo('stalls');">
        🍜 ${lang === 'zh' ? '全部攤位' : 'All Stalls'}
      </button>`;
  }

  actionsEl.innerHTML = actionsHTML;

  // 更新選中狀態
  renderStallGrid();
  document.querySelectorAll('.stall-card').forEach(card => {
    if (card.dataset.stallId === stallId) {
      card.classList.add('selected');
    }
  });

  // 開啟面板
  document.getElementById('panel-overlay').classList.add('open');
  document.getElementById('detail-panel').classList.add('open');
}

function updatePanel() {
  // 語言切換時如有面板打開則更新
  if (SELECTED_STALL) {
    openStallPanel(SELECTED_STALL);
  }
}

// ══════════════════════════════════════════════════════════════
// QR Code
// ══════════════════════════════════════════════════════════════
function initQR() {
  const qrBtn = document.getElementById('qr-btn');
  const modal = document.getElementById('qr-modal');
  const closeBtn = document.getElementById('qr-modal-close');
  const canvas = document.getElementById('qr-canvas');
  const urlEl = document.getElementById('qr-url');

  qrBtn.addEventListener('click', async () => {
    const url = window.location.href.split('?')[0]; // 取乾淨 URL
    urlEl.textContent = url;

    // 生成 QR Code
    try {
      canvas.getContext('2d').clearRect(0, 0, 160, 160);
      await QRCode.toCanvas(canvas, url, {
        width: 160,
        margin: 0,
        color: {
          dark: '#1e1a24',
          light: '#ffffff'
        }
      });
    } catch (err) {
      console.warn('QR generation failed:', err);
    }

    modal.classList.add('open');
  });

  closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });
}
