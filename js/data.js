/**
 * 美食節電子場刊 — 資料結構
 * 啟航 1331 · 美食節
 *
 * 使用說明：
 *   - 修改此檔案即可更新所有內容
 *   - 所有文字同時提供 zh（中文）與 en（英文）
 *   - 攤位和節目 id 必須唯一
 */

// ════════════════════════════════════════════════════════════
// 場地基本資訊
// ════════════════════════════════════════════════════════════
const VENUE = {
  /**
   * 底圖（與 SVG viewBox 320×200 百分比對齊；攤位以 mapPoint 或 mapPos 中心畫圓點）
   * ✅ 目前使用：海濱校區手繪導覽（含 A/B 區標註）
   */
  floorPlan: {
    src: 'assets/map-seaside-campus-ab.png'
  },
  zh: {
    name: '美食節',
    subtitle: '啟航 1331',
    tagline: '香港九龍啟德',
    address: '香港九龍啟德承豐道 1331 號'
  },
  en: {
    name: 'Food Festival',
    subtitle: 'Runway 1331',
    tagline: 'Kai Tak, Kowloon, HK',
    address: '1331 Shing Fung Road, Kai Tak, Kowloon, HK'
  },
  // GPS 中心點（實測場地）
  gps: [22.30498255945153, 114.21651532553452],
  // 外部地圖連結
  maps: {
    google: 'https://maps.google.com/?q=22.30498255945153,114.21651532553452',
    apple: 'https://maps.apple.com/?ll=22.30498255945153,114.21651532553452&q=Runway+1331',
    waze: 'https://waze.com/ul?ll=22.30498255945153,114.21651532553452'
  },
  // 開放時間
  hours: {
    zh: '星期一至日 12:00 – 22:00',
    en: 'Mon–Sun 12:00 – 22:00'
  }
};

// ════════════════════════════════════════════════════════════
// 區域定義
// ════════════════════════════════════════════════════════════
const ZONES = [
  {
    id: 'a',
    label: { zh: 'A 區', en: 'Zone A' },
    type: 'stage',        // stage | food | park
    color: '#FF6B35',      // 地圖上的顏色
    icon: '🎤',
    desc: {
      zh: '大舞台 · 演出區',
      en: 'Main Stage · Performance'
    },
    // 地圖概略框（相對容器百分比；與手繪圖紅字 A 區／東南格狀區對齊）
    mapPos: { x: 70, y: 48, w: 28, h: 44 },
    /** 手繪圖紅字 A 位置：海濱道以西偏中右側 */
    pin: { x: 88, y: 58 }
  },
  {
    id: 'b',
    label: { zh: 'B 區', en: 'Zone B' },
    type: 'food',
    color: '#4ECDC4',
    icon: '🍜',
    desc: {
      zh: '美食攤位區',
      en: 'Food Stalls'
    },
    mapPos: { x: 50, y: 8, w: 46, h: 42 },
    /** 手繪圖紅字 B 位置：右上方留白處 */
    pin: { x: 82, y: 28 }
  }
];

// ════════════════════════════════════════════════════════════
// 攤位資料
// ════════════════════════════════════════════════════════════
//
// zone    : 'a' | 'b'
// category : 'food' | 'drink' | 'handcraft' | 'facility'
// status   : 'open' | 'coming' | 'closed'
//
// mapPos   : 可選百分比矩形；熱區圓點取矩形中心（無 mapPoint 時）
// mapPoint : { x, y } 百分比，直接指定圓點（優先；與海濱手繪圖對齊）
//
const STALLS = [
  // ──────────────────────────────────────────────────────────
  // B 區 · 美食攤位（手繪圖右上紅字 B／綠地旁格狀區，兩排示意）
  // ──────────────────────────────────────────────────────────

  {
    id: 'B-01',
    zone: 'b',
    category: 'food',
    status: 'open',
    mapPoint: { x: 58, y: 24 },
    zh: {
      name: '港式魚蛋檔',
      desc: '街頭人氣小食，咖喱汁魚蛋、咖喱魷魚，懷舊風味。',
      tags: ['港式', '小食', '街頭']
    },
    en: {
      name: 'HK Fish Ball Stall',
      desc: 'Popular street food with curry fish balls and curry squid.',
      tags: ['HK Style', 'Street Food', 'Curry']
    }
  },
  {
    id: 'B-02',
    zone: 'b',
    category: 'food',
    status: 'open',
    mapPoint: { x: 62, y: 24 },
    zh: {
      name: '台灣夜市',
      desc: '鹽酥雞、珍奶、臭豆腐，一個攤位遊走寶島夜市。',
      tags: ['台灣', '夜市', '鹽酥雞']
    },
    en: {
      name: 'Taiwan Night Market',
      desc: 'Popcorn chicken, bubble tea, stinky tofu. All the night market vibes.',
      tags: ['Taiwanese', 'Night Market', 'BBQ']
    }
  },
  {
    id: 'B-03',
    zone: 'b',
    category: 'food',
    status: 'open',
    mapPoint: { x: 66, y: 24 },
    zh: {
      name: '日式串燒',
      desc: '炭火串燒配清酒，師傅現場燒製，串串用心。',
      tags: ['日式', '串燒', '炭火']
    },
    en: {
      name: 'Japanese Yakitori',
      desc: 'Charcoal-grilled skewers with sake. Chef on site, made with care.',
      tags: ['Japanese', 'Yakitori', 'Charcoal']
    }
  },
  {
    id: 'B-04',
    zone: 'b',
    category: 'drink',
    status: 'open',
    mapPoint: { x: 70, y: 24 },
    zh: {
      name: '手工啤酒吧',
      desc: '本地精釀啤酒，多款限定口味，配搭小食。',
      tags: ['本地', '精釀', '啤酒']
    },
    en: {
      name: 'Craft Beer Bar',
      desc: 'Local craft beer with seasonal specials. Pair with snacks.',
      tags: ['Local', 'Craft Beer', 'Tap']
    }
  },
  {
    id: 'B-05',
    zone: 'b',
    category: 'drink',
    status: 'open',
    mapPoint: { x: 74, y: 24 },
    zh: {
      name: '精品咖啡車',
      desc: '單一產地咖啡豆，手沖及冷萃，由專業咖啡師調製。',
      tags: ['咖啡', '手沖', '精品']
    },
    en: {
      name: 'Specialty Coffee Cart',
      desc: 'Single-origin beans, pour over & cold brew by a professional barista.',
      tags: ['Coffee', 'Pour Over', 'Specialty']
    }
  },
  {
    id: 'B-06',
    zone: 'b',
    category: 'food',
    status: 'open',
    mapPoint: { x: 78, y: 24 },
    zh: {
      name: '泰式船麵',
      desc: '正宗泰式船麵，牛腱、豬肉丸配特製湯底，微辣醒神。',
      tags: ['泰式', '麵食', '東南亞']
    },
    en: {
      name: 'Thai Boat Noodles',
      desc: 'Authentic Thai boat noodles with beef tendon & pork balls in rich broth.',
      tags: ['Thai', 'Noodles', 'Southeast Asian']
    }
  },
  {
    id: 'B-07',
    zone: 'b',
    category: 'food',
    status: 'open',
    mapPoint: { x: 82, y: 24 },
    zh: {
      name: '美式漢堡車',
      desc: '手打牛肉漢堡，配脆薯條及手工醬汁，大份滿足。',
      tags: ['美式', '漢堡', '街頭']
    },
    en: {
      name: 'USA Smash Burger',
      desc: 'Hand-smashed beef patty burgers with crispy fries and house sauce.',
      tags: ['American', 'Burger', 'Street']
    }
  },
  {
    id: 'B-08',
    zone: 'b',
    category: 'food',
    status: 'open',
    mapPoint: { x: 86, y: 24 },
    zh: {
      name: '西班牙小食',
      desc: '傳統西班牙火腿、香蒜大蝦、Tapas 拼盤，配桑格利亞酒。',
      tags: ['西班牙', 'Tapas', '小食']
    },
    en: {
      name: 'Spanish Tapas',
      desc: 'Iberico ham, garlic prawns, tapas platter with sangria.',
      tags: ['Spanish', 'Tapas', 'Wine']
    }
  },

  // ──────────────────────────────────────────────────────────
  // B 區 · 第二排
  // ──────────────────────────────────────────────────────────

  {
    id: 'B-09',
    zone: 'b',
    category: 'food',
    status: 'open',
    mapPoint: { x: 60, y: 34 },
    zh: {
      name: '雞蛋仔專門店',
      desc: '香港街頭經典，創新口味如抹茶、芝士、朱古力。',
      tags: ['港式', '雞蛋仔', '甜品']
    },
    en: {
      name: 'Egg Waffle Shop',
      desc: 'HK classic with creative flavors: matcha, cheese, chocolate.',
      tags: ['HK Style', 'Egg Waffle', 'Dessert']
    }
  },
  {
    id: 'B-10',
    zone: 'b',
    category: 'food',
    status: 'open',
    mapPoint: { x: 64, y: 34 },
    zh: {
      name: '意大利雪糕',
      desc: '意式手作雪糕，每日新鮮製造，逾十款口味。',
      tags: ['意式', '雪糕', '甜品']
    },
    en: {
      name: 'Gelato',
      desc: 'Italian artisan gelato, freshly made daily with 10+ flavors.',
      tags: ['Italian', 'Gelato', 'Dessert']
    }
  },
  {
    id: 'B-11',
    zone: 'b',
    category: 'food',
    status: 'open',
    mapPoint: { x: 68, y: 34 },
    zh: {
      name: '燒烤天地',
      desc: '炭火燒烤肉串，羊肉、牛肉、雞翼，配冰凍啤酒。',
      tags: ['燒烤', '肉食', '啤酒']
    },
    en: {
      name: 'BBQ Grill',
      desc: 'Charcoal BBQ skewers — lamb, beef, chicken wings. Goes great with beer.',
      tags: ['BBQ', 'Meat', 'Beer']
    }
  },
  {
    id: 'B-12',
    zone: 'b',
    category: 'food',
    status: 'open',
    mapPoint: { x: 72, y: 34 },
    zh: {
      name: '日式刨冰',
      desc: '日式冰品，抹茶、士多啤梨、芒果口味，夏季消暑首選。',
      tags: ['日式', '刨冰', '消暑']
    },
    en: {
      name: 'Japanese Shave Ice',
      desc: 'Japanese shaved ice — matcha, strawberry, mango. Perfect for summer.',
      tags: ['Japanese', 'Shave Ice', 'Summer']
    }
  },
  {
    id: 'B-13',
    zone: 'b',
    category: 'food',
    status: 'coming',
    mapPoint: { x: 76, y: 34 },
    zh: {
      name: '川味麻辣燙',
      desc: '四川麻辣燙，多款食材自選，即燙即食，辣度可調。',
      tags: ['川式', '麻辣', '辣食']
    },
    en: {
      name: 'Sichuan Mala Hot Pot',
      desc: 'Sichuan-style mala hot pot. Choose your ingredients, adjust the spice.',
      tags: ['Sichuan', 'Mala', 'Spicy']
    }
  },
  {
    id: 'B-14',
    zone: 'b',
    category: 'food',
    status: 'coming',
    mapPoint: { x: 80, y: 34 },
    zh: {
      name: '蔬食工場',
      desc: '創意素食料理，全植物性食材，環保又健康。',
      tags: ['素食', '健康', '環保']
    },
    en: {
      name: 'Plant Kitchen',
      desc: 'Creative plant-based eats. Healthy, sustainable and delicious.',
      tags: ['Vegan', 'Healthy', 'Eco']
    }
  },
  {
    id: 'B-15',
    zone: 'b',
    category: 'food',
    status: 'coming',
    mapPoint: { x: 84, y: 34 },
    zh: {
      name: '東南亞冰品',
      desc: '泰式羅惹、越南椰皇、馬來喇沙，一秒置身東南亞。',
      tags: ['東南亞', '冰品', '熱帶']
    },
    en: {
      name: 'SEA Desserts',
      desc: 'Thai rojak, Vietnamese coconut, Malaysian laksa. Tropical vibes only.',
      tags: ['Southeast Asian', 'Dessert', 'Tropical']
    }
  },

  // ──────────────────────────────────────────────────────────
  // B 區 · 設施攤位
  // ──────────────────────────────────────────────────────────

  {
    id: 'B-ENT',
    zone: 'b',
    category: 'facility',
    status: 'open',
    mapPoint: { x: 42, y: 10 },
    isFacility: true,
    zh: {
      name: 'B區入口',
      desc: '手繪圖北面承繼路一帶主要進出方向（請以現場指示牌為準）',
      tags: ['入口', '設施']
    },
    en: {
      name: 'Zone B Entrance',
      desc: 'Main approach from Chengji Road (north on the hand-drawn map); follow on-site signs.',
      tags: ['Entrance', 'Facility']
    }
  },
  {
    id: 'B-WC',
    zone: 'b',
    category: 'facility',
    status: 'open',
    mapPoint: { x: 78, y: 36 },
    isFacility: true,
    zh: {
      name: '洗手間',
      desc: '洗手間及育嬰室（B 區格狀建築一帶示意位置）',
      tags: ['設施', '洗手間']
    },
    en: {
      name: 'Restroom',
      desc: 'Restroom & baby care room (indicative spot in Zone B blocks).',
      tags: ['Facility', 'Restroom']
    }
  },
  {
    id: 'B-INFO',
    zone: 'b',
    category: 'facility',
    status: 'open',
    mapPoint: { x: 48, y: 32 },
    isFacility: true,
    zh: {
      name: '旅舍接待處／服務台',
      desc: '活動資訊、失物認領；對應手繪圖圖例「旅舍接待處」星形標示一帶',
      tags: ['服務', '資訊']
    },
    en: {
      name: 'Hostel Reception / Info',
      desc: 'Event info & lost & found. Near the star icon (Hostel Reception) in the map legend.',
      tags: ['Service', 'Info']
    }
  },

  // ──────────────────────────────────────────────────────────
  // A 區 · 舞台及設施
  // ──────────────────────────────────────────────────────────

  {
    id: 'A-STAGE',
    zone: 'a',
    category: 'facility',
    status: 'open',
    mapPoint: { x: 84, y: 60 },
    isFacility: true,
    zh: {
      name: '美食節主舞台',
      desc: '手繪圖東南面紅字 A 區格狀建築群內，室外演出及現場表演示意位置。',
      tags: ['舞台', '表演', '演出']
    },
    en: {
      name: 'Main Stage',
      desc: 'Indicative spot inside red “Zone A” blocks (southeast on the hand-drawn map).',
      tags: ['Stage', 'Performance', 'Show']
    }
  },
  {
    id: 'A-SEAT',
    zone: 'a',
    category: 'facility',
    status: 'open',
    mapPoint: { x: 86, y: 74 },
    isFacility: true,
    zh: {
      name: '觀眾席',
      desc: 'A 區靠體育道／水岸一側觀眾席示意位置，設有無障礙座位',
      tags: ['座位', '觀眾席']
    },
    en: {
      name: 'Audience Seating',
      desc: 'Indicative seating toward Sports Road / waterfront in Zone A; accessible seats available.',
      tags: ['Seating', 'Accessible']
    }
  },
  {
    id: 'A-ENT',
    zone: 'a',
    category: 'facility',
    status: 'open',
    mapPoint: { x: 72, y: 66 },
    isFacility: true,
    zh: {
      name: 'A區入口',
      desc: 'A 區演出區主入口（鄰近啟航大道／內園動線一帶示意）',
      tags: ['入口', '設施']
    },
    en: {
      name: 'Zone A Entrance',
      desc: 'Main entrance to Zone A (indicative, near internal paths / Qihang Avenue).',
      tags: ['Entrance', 'Facility']
    }
  }
];

// ════════════════════════════════════════════════════════════
// 節目表
// ════════════════════════════════════════════════════════════
//
// zone         : 'a' | 'b'
// ticketRequired: true | false
// ticketUrl    : 外部票務連結（可為空字串）
// ticketPrice  : 票價描述，如 '免費' / 'Free'
//
const EVENTS = [
  {
    id: 'E-01',
    zone: 'a',
    date: '2025-10-25',
    time: '15:00',
    endTime: '16:30',
    ticketRequired: true,
    ticketUrl: 'https://www.eventbrite.com/example',
    ticketPrice: { zh: '免費入場', en: 'Free Entry' },
    zh: {
      name: '開幕儀式',
      desc: '美食節正式開幕，邀請嘉賓及表演嘉賓出席，現場抽出首批幸運兒。',
      venue: 'A區主舞台',
      tags: ['開幕', '儀式']
    },
    en: {
      name: 'Opening Ceremony',
      desc: 'Official opening of the Food Festival with guest performances and lucky draws.',
      venue: 'Zone A Main Stage',
      tags: ['Opening', 'Ceremony']
    }
  },
  {
    id: 'E-02',
    zone: 'a',
    date: '2025-10-25',
    time: '17:00',
    endTime: '18:30',
    ticketRequired: false,
    ticketUrl: '',
    ticketPrice: { zh: '免費觀賞', en: 'Free' },
    zh: {
      name: '街頭音樂表演',
      desc: '本地街頭音樂人現場演出，流行曲、爵士、民謠，氣氛一流。',
      venue: 'A區主舞台',
      tags: ['音樂', '現場', '免費']
    },
    en: {
      name: 'Busking Live Music',
      desc: 'Local street musicians performing pop, jazz and folk. Great atmosphere.',
      venue: 'Zone A Main Stage',
      tags: ['Music', 'Live', 'Free']
    }
  },
  {
    id: 'E-03',
    zone: 'a',
    date: '2025-10-25',
    time: '19:30',
    endTime: '21:30',
    ticketRequired: true,
    ticketUrl: 'https://www.eventbrite.com/example',
    ticketPrice: { zh: '$150', en: '$150' },
    zh: {
      name: '獨立樂隊音樂夜',
      desc: '四支本地獨立樂隊聯合演出，搖滾、另類、電子風格多元呈現。',
      venue: 'A區主舞台',
      tags: ['音樂節', '樂隊', '搖滾']
    },
    en: {
      name: 'Indie Band Night',
      desc: 'Four local indie bands on one stage. Rock, alternative, electronic — diversity guaranteed.',
      venue: 'Zone A Main Stage',
      tags: ['Music Festival', 'Band', 'Rock']
    }
  },
  {
    id: 'E-04',
    zone: 'b',
    date: '2025-10-26',
    time: '12:00',
    endTime: '13:30',
    ticketRequired: false,
    ticketUrl: '',
    ticketPrice: { zh: '免費參與', en: 'Free' },
    zh: {
      name: '廚師烹飪示範',
      desc: '星級廚師即席烹飪示範，分享特色菜式製作心得，試食環節。',
      venue: 'B區美食區',
      tags: ['廚師', '烹飪', '示範']
    },
    en: {
      name: 'Chef Cooking Demo',
      desc: 'Celebrity chef live cooking demo with tasting session.',
      venue: 'Zone B Food Area',
      tags: ['Chef', 'Cooking', 'Demo']
    }
  },
  {
    id: 'E-05',
    zone: 'a',
    date: '2025-10-26',
    time: '15:00',
    endTime: '17:00',
    ticketRequired: true,
    ticketUrl: 'https://www.eventbrite.com/example',
    ticketPrice: { zh: '免費觀賞', en: 'Free' },
    zh: {
      name: '舞蹈表演',
      desc: 'Hip Hop、Street Dance、Jazz Dance，多支舞團輪番演出。',
      venue: 'A區主舞台',
      tags: ['舞蹈', '街舞', '演出']
    },
    en: {
      name: 'Dance Performance',
      desc: 'Hip Hop, Street Dance, Jazz — multiple crews taking the stage.',
      venue: 'Zone A Main Stage',
      tags: ['Dance', 'Street Dance', 'Show']
    }
  },
  {
    id: 'E-06',
    zone: 'a',
    date: '2025-10-26',
    time: '18:00',
    endTime: '20:00',
    ticketRequired: false,
    ticketUrl: '',
    ticketPrice: { zh: '免費觀賞', en: 'Free' },
    zh: {
      name: '閉幕 DJ 派對',
      desc: '本地 DJ 打碟，電子舞曲混合本地流行，美食節壓軸派對。',
      venue: 'A區主舞台',
      tags: ['DJ', '派對', '電音']
    },
    en: {
      name: 'Closing DJ Party',
      desc: "Local DJs spinning electronic and C-pop. The festival's closing party.",
      venue: 'Zone A Main Stage',
      tags: ['DJ', 'Party', 'Electronic']
    }
  }
];

// ════════════════════════════════════════════════════════════
// 交通指引
// ════════════════════════════════════════════════════════════
const TRANSPORT = [
  {
    type: 'mtr',
    icon: '🚇',
    zh: {
      title: '港鐵',
      lines: [
        '觀塘線：啟德站 C 出口，步行約 12 分鐘',
        '觀塘線：九龍灣站 B 出口，轉乘巴士直達'
      ]
    },
    en: {
      title: 'MTR',
      lines: [
        'Kwun Tong Line: Kai Tak Station Exit C, ~12 min walk',
        'Kwun Tong Line: Kowloon Bay Station Exit B, bus transfer'
      ]
    }
  },
  {
    type: 'bus',
    icon: '🚌',
    zh: {
      title: '巴士',
      lines: [
        '九巴 2E：觀塘 ↔ 啟德，直達園區東側',
        '城巴 619：中環 ↔ 啟德',
        '小巴 86：九龍灣 ↔ 啟德'
      ]
    },
    en: {
      title: 'Bus',
      lines: [
        'KMB 2E: Kwun Tong ↔ Kai Tak, direct to East Gate',
        'Citybus 619: Central ↔ Kai Tak',
        'Minibus 86: Kowloon Bay ↔ Kai Tak'
      ]
    }
  },
  {
    type: 'ferry',
    icon: '⛴️',
    zh: {
      title: '渡輪',
      lines: ['觀塘碼頭 → 啟德碼頭，約 8 分鐘（特定時段行駛）']
    },
    en: {
      title: 'Ferry',
      lines: ['Kwun Tong Pier → Kai Tak Pier, ~8 min (selected hours)']
    }
  },
  {
    type: 'taxi',
    icon: '🚕',
    zh: {
      title: '的士',
      lines: [
        '告知司機：「啟德承豐道 1331 號」或「啟航 1331」',
        '導航至「承豐道」，東側入口即達'
      ]
    },
    en: {
      title: 'Taxi',
      lines: [
        'Tell driver: "Shing Fung Road 1331, Kai Tak" or "Runway 1331"',
        'Navigate to Shing Fung Rd — East Gate'
      ]
    }
  }
];

// ════════════════════════════════════════════════════════════
// 公告
// ════════════════════════════════════════════════════════════
const NOTICES = [
  {
    id: 'N-01',
    type: 'info',
    zh: '美食節開放時間：每日上午 12:00 至晚上 10:00',
    en: 'Festival open daily: 12:00 – 22:00'
  },
  {
    id: 'N-02',
    type: 'info',
    zh: 'A區舞台部分節目需另行購票，請留意節目表',
    en: 'Some Zone A shows require separate tickets — check the schedule'
  },
  {
    id: 'N-03',
    type: 'warning',
    zh: '園區範圍內全面禁菸（吸菸區設於入口外）',
    en: 'Smoking is prohibited throughout the venue (designated area outside entrance)'
  }
];

// ════════════════════════════════════════════════════════════
// 實用工具函數
// ════════════════════════════════════════════════════════════

/**
 * 根據語言取得文字
 * @param {string} lang - 'zh' | 'en'
 * @param {string} key - 文字鍵（可用 dot notation）
 * @returns {string}
 */
function t(key, lang = CURRENT_LANG) {
  return key.split('.').reduce((obj, k) => obj && obj[k], window[lang]);
}

/**
 * 依 ID 取得攤位
 */
function getStallById(id) {
  return STALLS.find(s => s.id === id);
}

/**
 * 依 ID 取得活動
 */
function getEventById(id) {
  return EVENTS.find(e => e.id === id);
}

/**
 * 依區域取得所有攤位
 */
function getStallsByZone(zoneId) {
  return STALLS.filter(s => s.zone === zoneId);
}

/**
 * 依日期取得所有活動
 */
function getEventsByDate(dateStr) {
  return EVENTS.filter(e => e.date === dateStr);
}

/**
 * 格式化日期顯示
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @param {string} lang - 'zh' | 'en'
 */
function formatDate(dateStr, lang = CURRENT_LANG) {
  const d = new Date(dateStr);
  if (lang === 'zh') {
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * 格式化時間顯示
 * @param {string} timeStr - 'HH:MM'
 */
function formatTime(timeStr) {
  const [h, m] = timeStr.split(':');
  return `${h}:${m}`;
}

/**
 * 取得所有不重複的活動日期
 */
function getEventDates() {
  return [...new Set(EVENTS.map(e => e.date))].sort();
}

/**
 * 取得攤位分類的中英文名稱
 */
function getCategoryLabel(category, lang = CURRENT_LANG) {
  const map = {
    food:      { zh: '美食',    en: 'Food' },
    drink:     { zh: '飲品',    en: 'Drinks' },
    handcraft: { zh: '手作',    en: 'Handcraft' },
    facility:  { zh: '設施',    en: 'Facility' }
  };
  return map[category]?.[lang] || category;
}

/**
 * 取得狀態標籤
 */
function getStatusLabel(status, lang = CURRENT_LANG) {
  const map = {
    open:   { zh: '營業中', en: 'Open' },
    coming: { zh: '即將開業', en: 'Coming' },
    closed: { zh: '休息中', en: 'Closed' }
  };
  return map[status]?.[lang] || status;
}
