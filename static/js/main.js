/* ═══════════════════════════════════════════════════
   Quran App – main.js
   Persistent player • Search • Filters • Favorites
   Repeat • Speed • Sleep timer • Tafsir • Share
   Download • Dark/Light • PWA
   ═══════════════════════════════════════════════════ */

"use strict";

const API_BASE = "https://api.alquran.cloud/v1";

/* ── Surah metadata: [number, name, englishName, type, ayahCount] ── */
const SURAHS = [
  [1,"الفاتحة","Al-Fatihah","Meccan",7],[2,"البقرة","Al-Baqarah","Medinan",286],
  [3,"آل عمران","Ali 'Imran","Medinan",200],[4,"النساء","An-Nisa","Medinan",176],
  [5,"المائدة","Al-Ma'idah","Medinan",120],[6,"الأنعام","Al-An'am","Meccan",165],
  [7,"الأعراف","Al-A'raf","Meccan",206],[8,"الأنفال","Al-Anfal","Medinan",75],
  [9,"التوبة","At-Tawbah","Medinan",129],[10,"يونس","Yunus","Meccan",109],
  [11,"هود","Hud","Meccan",123],[12,"يوسف","Yusuf","Meccan",111],
  [13,"الرعد","Ar-Ra'd","Medinan",43],[14,"إبراهيم","Ibrahim","Meccan",52],
  [15,"الحجر","Al-Hijr","Meccan",99],[16,"النحل","An-Nahl","Meccan",128],
  [17,"الإسراء","Al-Isra","Meccan",111],[18,"الكهف","Al-Kahf","Meccan",110],
  [19,"مريم","Maryam","Meccan",98],[20,"طه","Ta-Ha","Meccan",135],
  [21,"الأنبياء","Al-Anbiya","Meccan",112],[22,"الحج","Al-Hajj","Medinan",78],
  [23,"المؤمنون","Al-Mu'minun","Meccan",118],[24,"النور","An-Nur","Medinan",64],
  [25,"الفرقان","Al-Furqan","Meccan",77],[26,"الشعراء","Ash-Shu'ara","Meccan",227],
  [27,"النمل","An-Naml","Meccan",93],[28,"القصص","Al-Qasas","Meccan",88],
  [29,"العنكبوت","Al-'Ankabut","Meccan",69],[30,"الروم","Ar-Rum","Meccan",60],
  [31,"لقمان","Luqman","Meccan",34],[32,"السجدة","As-Sajdah","Meccan",30],
  [33,"الأحزاب","Al-Ahzab","Medinan",73],[34,"سبأ","Saba","Meccan",54],
  [35,"فاطر","Fatir","Meccan",45],[36,"يس","Ya-Sin","Meccan",83],
  [37,"الصافات","As-Saffat","Meccan",182],[38,"ص","Sad","Meccan",88],
  [39,"الزمر","Az-Zumar","Meccan",75],[40,"غافر","Ghafir","Meccan",85],
  [41,"فصلت","Fussilat","Meccan",54],[42,"الشورى","Ash-Shuraa","Meccan",53],
  [43,"الزخرف","Az-Zukhruf","Meccan",89],[44,"الدخان","Ad-Dukhan","Meccan",59],
  [45,"الجاثية","Al-Jathiyah","Meccan",37],[46,"الأحقاف","Al-Ahqaf","Meccan",35],
  [47,"محمد","Muhammad","Medinan",38],[48,"الفتح","Al-Fath","Medinan",29],
  [49,"الحجرات","Al-Hujurat","Medinan",18],[50,"ق","Qaf","Meccan",45],
  [51,"الذاريات","Adh-Dhariyat","Meccan",60],[52,"الطور","At-Tur","Meccan",49],
  [53,"النجم","An-Najm","Meccan",62],[54,"القمر","Al-Qamar","Meccan",55],
  [55,"الرحمن","Ar-Rahman","Medinan",78],[56,"الواقعة","Al-Waqi'ah","Meccan",96],
  [57,"الحديد","Al-Hadid","Medinan",29],[58,"المجادلة","Al-Mujadila","Medinan",22],
  [59,"الحشر","Al-Hashr","Medinan",24],[60,"الممتحنة","Al-Mumtahanah","Medinan",13],
  [61,"الصف","As-Saff","Medinan",14],[62,"الجمعة","Al-Jumu'ah","Medinan",11],
  [63,"المنافقون","Al-Munafiqun","Medinan",11],[64,"التغابن","At-Taghabun","Medinan",18],
  [65,"الطلاق","At-Talaq","Medinan",12],[66,"التحريم","At-Tahrim","Medinan",12],
  [67,"الملك","Al-Mulk","Meccan",30],[68,"القلم","Al-Qalam","Meccan",52],
  [69,"الحاقة","Al-Haqqah","Meccan",52],[70,"المعارج","Al-Ma'arij","Meccan",44],
  [71,"نوح","Nuh","Meccan",28],[72,"الجن","Al-Jinn","Meccan",28],
  [73,"المزمل","Al-Muzzammil","Meccan",20],[74,"المدثر","Al-Muddaththir","Meccan",56],
  [75,"القيامة","Al-Qiyamah","Meccan",40],[76,"الإنسان","Al-Insan","Medinan",31],
  [77,"المرسلات","Al-Mursalat","Meccan",50],[78,"النبأ","An-Naba","Meccan",40],
  [79,"النازعات","An-Nazi'at","Meccan",46],[80,"عبس","Abasa","Meccan",42],
  [81,"التكوير","At-Takwir","Meccan",29],[82,"الانفطار","Al-Infitar","Meccan",19],
  [83,"المطففين","Al-Mutaffifin","Meccan",36],[84,"الانشقاق","Al-Inshiqaq","Meccan",25],
  [85,"البروج","Al-Buruj","Meccan",22],[86,"الطارق","At-Tariq","Meccan",17],
  [87,"الأعلى","Al-A'la","Meccan",19],[88,"الغاشية","Al-Ghashiyah","Meccan",26],
  [89,"الفجر","Al-Fajr","Meccan",30],[90,"البلد","Al-Balad","Meccan",20],
  [91,"الشمس","Ash-Shams","Meccan",15],[92,"الليل","Al-Layl","Meccan",21],
  [93,"الضحى","Ad-Duhaa","Meccan",11],[94,"الشرح","Ash-Sharh","Meccan",8],
  [95,"التين","At-Tin","Meccan",8],[96,"العلق","Al-'Alaq","Meccan",19],
  [97,"القدر","Al-Qadr","Meccan",5],[98,"البينة","Al-Bayyinah","Medinan",8],
  [99,"الزلزلة","Az-Zalzalah","Medinan",8],[100,"العاديات","Al-'Adiyat","Meccan",11],
  [101,"القارعة","Al-Qari'ah","Meccan",11],[102,"التكاثر","At-Takathur","Meccan",8],
  [103,"العصر","Al-'Asr","Meccan",3],[104,"الهمزة","Al-Humazah","Meccan",9],
  [105,"الفيل","Al-Fil","Meccan",5],[106,"قريش","Quraysh","Meccan",4],
  [107,"الماعون","Al-Ma'un","Meccan",7],[108,"الكوثر","Al-Kawthar","Meccan",3],
  [109,"الكافرون","Al-Kafirun","Meccan",6],[110,"النصر","An-Nasr","Medinan",3],
  [111,"المسد","Al-Masad","Meccan",5],[112,"الإخلاص","Al-Ikhlas","Meccan",4],
  [113,"الفلق","Al-Falaq","Meccan",5],[114,"الناس","An-Nas","Meccan",6]
];

/* ── Juz' start positions [surah, ayah] ── */
const JUZ_STARTS = [
  [1,1],[2,142],[2,253],[3,93],[4,24],[4,148],[5,82],[6,111],[7,88],[8,41],
  [9,93],[11,6],[12,53],[15,1],[17,1],[18,75],[21,1],[23,1],[25,21],[27,56],
  [29,46],[33,31],[36,28],[39,32],[41,47],[46,1],[51,31],[58,1],[67,1],[78,1]
];

const FALLBACK_RECITERS = [
  { identifier: "ar.alafasy", name: "مشاري راشد العفاسي", englishName: "Alafasy" },
  { identifier: "ar.abdulbasitmurattal", name: "عبد الباسط عبد الصمد (مرتل)", englishName: "Abdul Basit" },
  { identifier: "ar.abdurrahmaansudais", name: "عبد الرحمن السديس", englishName: "As-Sudais" },
  { identifier: "ar.husary", name: "محمود خليل الحصري", englishName: "Husary" },
  { identifier: "ar.minshawi", name: "محمد صديق المنشاوي", englishName: "Minshawi" },
  { identifier: "ar.mahermuaiqly", name: "ماهر المعيقلي", englishName: "Maher Al Muaiqly" },
  { identifier: "ar.hudhaify", name: "علي بن عبدالرحمن الحذيفي", englishName: "Hudhaify" },
  { identifier: "ar.saoodshuraym", name: "سعود بن إبراهيم الشريم", englishName: "Shuraym" },
  { identifier: "ar.ahmedajamy", name: "أحمد بن علي العجمي", englishName: "Ajamy" }
];

/* URLs injected from Flask template (url_for) with safe fallbacks */
const APP_URLS = window.APP_URLS || {
  sw: "/sw.js",
  icons: { 192: "/static/icons/icon-192.png", 512: "/static/icons/icon-512.png" }
};

/* ══════════ Persistent store ══════════ */
const store = {
  theme: "dark",
  reciter: "ar.alafasy",
  volume: 0.8,
  rate: 1,
  repeat: "off",
  favSurahs: [],
  favReciters: [],
  recents: [],
  downloads: []
};

function loadStore() {
  try {
    const raw = localStorage.getItem("qm_store");
    if (raw) Object.assign(store, JSON.parse(raw));
  } catch (e) { /* ignore */ }
}
function saveStore() {
  try { localStorage.setItem("qm_store", JSON.stringify(store)); } catch (e) { /* ignore */ }
}
loadStore();

/* ══════════ DOM refs ══════════ */
const $ = (id) => document.getElementById(id);

const views = { home: $("view-home"), favorites: $("view-favorites"), listen: $("view-listen") };
const tabsRow = $("tabs-row");
const homeFilters = $("home-filters");
const typeChips = $("type-chips");
const juzFilter = $("juz-filter");
const surahGrid = $("surah-grid");
const gridEmpty = $("grid-empty");
const favCountBadge = $("fav-count-badge");

const recentsSection = $("recents-section");
const recentsList = $("recents-list");
const favSurahsSection = $("fav-surahs-section");
const favSurahGrid = $("fav-surah-grid");
const favRecitersSection = $("fav-reciters-section");
const favRecitersList = $("fav-reciters-list");
const favoritesEmpty = $("favorites-empty");

const surahHeader = $("surah-header");
const surahTitle = $("surah-title");
const surahMeta = $("surah-meta");
const surahBadge = $("surah-info-badge");
const bismillahLine = $("bismillah-line");
const surahPlayBtn = $("surah-play-btn");
const surahFavBtn = $("surah-fav-btn");
const surahShareBtn = $("surah-share-btn");
const surahDownloadBtn = $("surah-download-btn");
const backBtn = $("back-btn");
const ayahsContainer = $("ayahs-container");
const loadingSpinner = $("loading-spinner");
const placeholder = $("placeholder");

const audioEl = $("audio-element");
const playerBar = $("player-bar");
const playBtn = $("play-btn");
const playIcon = $("play-icon");
const pauseIcon = $("pause-icon");
const prevBtn = $("prev-ayah-btn");
const nextBtn = $("next-ayah-btn");
const nowPlaying = $("now-playing");
const nowPlayingWrap = $("now-playing-wrap");
const ayahCounter = $("ayah-counter");
const progressContainer = $("progress-container");
const progressBar = $("progress-bar");
const progressThumb = $("progress-thumb");
const volumeSlider = $("volume-slider");
const volumeValue = $("volume-value");
const repeatBtn = $("repeat-btn");
const repeatBadge = $("repeat-badge");
const speedBtn = $("speed-btn");
const speedLabel = $("speed-label");
const tafsirBtn = $("tafsir-btn");
const sleepBtn = $("sleep-btn");
const sleepBadge = $("sleep-badge");
const ayahShareBtn = $("ayah-share-btn");
const surahDlMini = $("surah-dl-mini");
const playerClose = $("player-close");
const speedMenu = $("speed-menu");
const repeatMenu = $("repeat-menu");
const sleepMenu = $("sleep-menu");
const playerInner = document.querySelector(".player-inner");

const reciterTrigger = $("reciter-trigger");
const reciterTriggerName = $("reciter-trigger-name");
const reciterModal = $("reciter-modal");
const reciterModalClose = $("reciter-modal-close");
const reciterSearch = $("reciter-search");
const reciterList = $("reciter-list");

const tafsirDrawer = $("tafsir-drawer");
const tafsirTitle = $("tafsir-title");
const tafsirClose = $("tafsir-close");
const tafsirBody = $("tafsir-body");
const tafsirAyahRef = $("tafsir-ayah-ref");
const tafsirText = $("tafsir-text");
const tafsirPrev = $("tafsir-prev");
const tafsirNext = $("tafsir-next");
const tafsirCounter = $("tafsir-counter");

const globalSearch = $("global-search");
const searchResults = $("search-results");
const themeToggle = $("theme-toggle");
const themeIconMoon = $("theme-icon-moon");
const themeIconSun = $("theme-icon-sun");
const installBtn = $("install-btn");
const brandHome = $("brand-home");
const toastWrap = $("toast-wrap");

/* ══════════ Runtime state ══════════ */
let currentSurah = null;        // API surah object (audio edition)
let currentAyahs = [];
let currentAyahIdx = 0;
let currentSurahNum = null;
let currentSurahName = "";
let isPlaying = false;
let loadedKey = null;           // "surah:reciter"
let currentView = "home";

let reciters = [];              // editions list
let recitersPromise = null;

const tafsirCache = new Map();  // surahNum -> {tafsir:[], translation:[]}
let tafsirAyahIdx = 0;
let tafsirTab = "tafsir";
let tafsirFollow = true;

const sleep = { mode: null, endsAt: 0, iv: null };
const prefetched = new Set();
let filterType = "all";
let filterJuz = "";
let deferredPrompt = null;
let pendingAutoplay = false;

/* ══════════ Helpers ══════════ */
function toArabicNumber(num) {
  const d = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];
  return String(num).split("").map(c => d[+c] || c).join("");
}

function fmtTime(sec) {
  if (!isFinite(sec)) return "--:--";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function normalizeAr(str) {
  return String(str)
    .replace(/[\u064B-\u0652\u0670\u0640\u06D6-\u06ED]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .toLowerCase()
    .trim();
}

function toast(msg, icon = "✓") {
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<span class="t-icon">${icon}</span><span></span>`;
  el.lastElementChild.textContent = msg;
  toastWrap.appendChild(el);
  setTimeout(() => {
    el.classList.add("out");
    setTimeout(() => el.remove(), 320);
  }, 2400);
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str == null ? "" : String(str);
  return d.innerHTML;
}

/* ── Juz' computation ── */
const surahJuzMap = (() => {
  const starts = [];
  let acc = 0;
  for (const s of SURAHS) { starts.push(acc + 1); acc += s[4]; }
  const juzGlobal = JUZ_STARTS.map(([s, a]) => starts[s - 1] + a - 1);
  const map = {};
  for (let i = 0; i < 114; i++) {
    const st = starts[i], en = st + SURAHS[i][4] - 1;
    const set = new Set();
    for (let k = 0; k < 30; k++) if (juzGlobal[k] >= st && juzGlobal[k] <= en) set.add(k + 1);
    for (let k = 29; k >= 0; k--) if (juzGlobal[k] <= st) { set.add(k + 1); break; }
    map[i + 1] = [...set].sort((a, b) => a - b);
  }
  return map;
})();

/* ══════════ Theme ══════════ */
function applyTheme(theme) {
  store.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  $("meta-theme").setAttribute("content", theme === "dark" ? "#0a0f1a" : "#f2efe6");
  themeIconMoon.classList.toggle("hidden", theme === "light");
  themeIconSun.classList.toggle("hidden", theme !== "light");
  saveStore();
}
themeToggle.addEventListener("click", () => {
  applyTheme(store.theme === "dark" ? "light" : "dark");
  toast(store.theme === "dark" ? "الوضع الليلي" : "الوضع النهاري", "🌙");
});

/* ══════════ Router (hash-based) ══════════ */
function parseHash() {
  const h = location.hash || "#/";
  const parts = h.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] === "listen" && parts[1]) {
    const n = parseInt(parts[1], 10);
    const r = parts[2] || store.reciter;
    const a = parts[3] ? parseInt(parts[3], 10) : null;
    if (n >= 1 && n <= 114) return { view: "listen", surah: n, reciter: r, ayah: a };
  }
  if (parts[0] === "favorites") return { view: "favorites" };
  return { view: "home" };
}

function goHome() { location.hash = "#/"; }
function goListen(n, r, a) {
  const target = `#/listen/${n}/${r}${a ? "/" + a : ""}`;
  if (location.hash === target) route();
  else location.hash = target;
}

function route() {
  const r = parseHash();
  Object.entries(views).forEach(([k, el]) => el.classList.toggle("hidden", k !== r.view));
  currentView = r.view;
  tabsRow.classList.toggle("hidden", r.view === "listen");
  document.querySelectorAll(".main-tabs .tab-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.tab === r.view));

  if (r.view === "home") { renderGrid(); window.scrollTo({ top: 0 }); }
  if (r.view === "favorites") { renderFavorites(); window.scrollTo({ top: 0 }); }
  if (r.view === "listen") showListen(r);
}

function showListen({ surah: n, reciter: r, ayah: a }) {
  const key = `${n}:${r}`;
  const auto = pendingAutoplay;
  pendingAutoplay = false;
  if (loadedKey === key) {
    if (a && currentAyahIdx !== a - 1) jumpToAyah(a - 1, { play: true, scroll: true });
    else if (auto && audioEl.paused) playCurrentAyah();
    return;
  }
  loadSurah(n, r, { ayahIdx: a ? a - 1 : 0, autoplay: auto });
}

/* ══════════ Surah grid & filters ══════════ */
function surahInJuz(n, juz) { return surahJuzMap[n].includes(juz); }

function filteredSurahs() {
  return SURAHS.filter(([, , , type, , num]) => {
    if (filterType !== "all" && type !== filterType) return false;
    if (filterJuz && !surahInJuz(num, +filterJuz)) return false;
    return true;
  });
}

function surahCard(s, idx) {
  const [num, name, en, type, ayas] = s;
  const card = document.createElement("article");
  card.className = "surah-card";
  card.dataset.n = num;
  card.style.animationDelay = `${Math.min(idx * 0.025, 0.5)}s`;

  const juzTxt = surahJuzMap[num].map(j => `جزء ${toArabicNumber(j)}`).join("، ");
  const dlBadge = store.downloads.includes(num) ? `<span class="mini-chip dl-badge">محمّلة ✓</span>` : "";
  card.innerHTML = `
    <div class="sc-num">${toArabicNumber(num)}</div>
    <div class="sc-main">
      <h3>${esc(name)}</h3>
      <p>${esc(en)} • ${toArabicNumber(ayas)} آية</p>
      <div class="sc-chips">
        <span class="mini-chip">${type === "Meccan" ? "مكية" : "مدنية"}</span>
        <span class="mini-chip gold">${juzTxt}</span>
        ${dlBadge}
      </div>
    </div>
    <button class="sc-fav ${store.favSurahs.includes(num) ? "active" : ""}" title="مفضلة" aria-label="إضافة للمفضلة">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 17.3l-6.2 3.3 1.2-6.9L2 8.9l7-1L12 1.5 15 7.9l7 1-5 4.8 1.2 6.9z"/></svg>
    </button>`;
  card.querySelector(".sc-fav").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavSurah(num);
  });
  card.addEventListener("click", () => {
    pendingAutoplay = true;
    goListen(num, store.reciter);
  });
  return card;
}

function renderGrid() {
  const list = filteredSurahs();
  surahGrid.innerHTML = "";
  gridEmpty.classList.toggle("hidden", list.length > 0);
  list.forEach((s, i) => surahGrid.appendChild(surahCard(s, i)));
}

function initJuzFilter() {
  for (let j = 1; j <= 30; j++) {
    const opt = document.createElement("option");
    opt.value = j;
    opt.textContent = `الجزء ${toArabicNumber(j)}`;
    juzFilter.appendChild(opt);
  }
}

typeChips.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  filterType = btn.dataset.type;
  typeChips.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === btn));
  renderGrid();
});
juzFilter.addEventListener("change", () => { filterJuz = juzFilter.value; renderGrid(); });

/* ── Tabs ── */
document.querySelectorAll(".main-tabs .tab-btn").forEach(btn =>
  btn.addEventListener("click", () => {
    location.hash = btn.dataset.tab === "favorites" ? "#/favorites" : "#/";
  })
);
brandHome.addEventListener("click", goHome);
backBtn.addEventListener("click", goHome);

/* ══════════ Favorites ══════════ */
function toggleFavSurah(n) {
  const i = store.favSurahs.indexOf(n);
  if (i >= 0) { store.favSurahs.splice(i, 1); toast(`أُزيلت سورة ${SURAHS[n - 1][1]} من المفضلة`, "☆"); }
  else { store.favSurahs.push(n); store.favSurahs.sort((a, b) => a - b); toast(`أُضيفت سورة ${SURAHS[n - 1][1]} إلى المفضلة`, "★"); }
  saveStore();
  refreshFavUI();
}

function toggleFavReciter(id) {
  const i = store.favReciters.indexOf(id);
  const name = reciterName(id);
  if (i >= 0) { store.favReciters.splice(i, 1); toast(`أُزيل ${name} من المفضلة`, "☆"); }
  else { store.favReciters.push(id); toast(`أُضيف ${name} إلى المفضلة`, "★"); }
  saveStore();
  refreshFavUI();
}

function refreshFavUI() {
  favCountBadge.textContent = store.favSurahs.length + store.favReciters.length;
  favCountBadge.classList.toggle("hidden", store.favSurahs.length + store.favReciters.length === 0);

  document.querySelectorAll(".sc-fav").forEach(b => {
    const n = +b.closest(".surah-card").dataset.n;
    b.classList.toggle("active", store.favSurahs.includes(n));
  });

  if (currentSurahNum) {
    const fav = store.favSurahs.includes(currentSurahNum);
    surahFavBtn.classList.toggle("faved", fav);
    surahFavBtn.querySelector("span").textContent = fav ? "محفوظة" : "مفضلة";
  }

  document.querySelectorAll(".ri-fav").forEach(b => {
    b.classList.toggle("active", store.favReciters.includes(b.dataset.id));
  });

  if (currentView === "favorites") renderFavorites();
}

function renderFavorites() {
  const hasRecents = store.recents.length > 0;
  const hasFavSurahs = store.favSurahs.length > 0;
  const hasFavReciters = store.favReciters.length > 0;

  recentsSection.classList.toggle("hidden", !hasRecents);
  favSurahsSection.classList.toggle("hidden", !hasFavSurahs);
  favRecitersSection.classList.toggle("hidden", !hasFavReciters);
  favoritesEmpty.classList.toggle("hidden", hasRecents || hasFavSurahs || hasFavReciters);

  if (hasRecents) {
    recentsList.innerHTML = "";
    store.recents.forEach(r => {
      const chip = document.createElement("button");
      chip.className = "recent-chip";
      chip.innerHTML = `<span>📖 ${esc(r.name)}</span><span class="rc-sub">${esc(reciterName(r.r))}</span>`;
      chip.addEventListener("click", () => goListen(r.n, r.r));
      recentsList.appendChild(chip);
    });
  }

  if (hasFavSurahs) {
    favSurahGrid.innerHTML = "";
    store.favSurahs.forEach((n, i) =>
      favSurahGrid.appendChild(surahCard(SURAHS[n - 1], i)));
  }

  if (hasFavReciters) {
    favRecitersList.innerHTML = "";
    store.favReciters.forEach(id => {
      const chip = document.createElement("button");
      chip.className = "reciter-chip";
      chip.innerHTML = `<span class="rc-star">★</span><span>${esc(reciterName(id))}</span>`;
      chip.title = "تشغيل بهذا القارئ";
      chip.addEventListener("click", () => setReciter(id, true));
      favRecitersList.appendChild(chip);
    });
  }
}

/* ══════════ Reciters ══════════ */
function reciterName(id) {
  const r = reciters.find(x => x.identifier === id) ||
    FALLBACK_RECITERS.find(x => x.identifier === id);
  return r ? r.name : id;
}

function ensureReciters() {
  if (recitersPromise) return recitersPromise;
  recitersPromise = fetch(`${API_BASE}/edition?format=audio&language=ar`)
    .then(res => res.json())
    .then(data => {
      if (data.code !== 200 || !Array.isArray(data.data)) throw new Error("bad api");
      // Keep only editions with verse-by-verse audio (needed for synced playback)
      reciters = data.data.filter(e => e.type === "versebyverse" || e.type === "translation");
      return reciters;
    })
    .catch(() => {
      reciters = FALLBACK_RECITERS.slice();
      return reciters;
    });
  return recitersPromise;
}

async function setReciter(id, fromFav = false) {
  store.reciter = id;
  saveStore();
  reciterTriggerName.textContent = reciterName(id);
  closeReciterModal();
  document.querySelectorAll(".reciter-item").forEach(el =>
    el.classList.toggle("selected", el.dataset.id === id));

  if (currentSurahNum && currentView === "listen") {
    const wasPlaying = isPlaying;
    const keepIdx = currentAyahIdx;
    await loadSurah(currentSurahNum, id, { ayahIdx: keepIdx, autoplay: wasPlaying, keepScroll: true });
  } else if (fromFav) {
    toast(`تم اختيار القارئ: ${reciterName(id)}`);
  }
  renderReciterList(reciterSearch.value);
}

function renderReciterList(query = "") {
  const q = normalizeAr(query);
  let list = reciters.slice();
  if (q) list = list.filter(r =>
    normalizeAr(r.name).includes(q) ||
    normalizeAr(r.englishName || "").includes(q) ||
    r.identifier.toLowerCase().includes(q));
  list.sort((a, b) => {
    const fa = store.favReciters.includes(a.identifier) ? 0 : 1;
    const fb = store.favReciters.includes(b.identifier) ? 0 : 1;
    return fa - fb;
  });

  reciterList.innerHTML = "";
  if (!list.length) {
    reciterList.innerHTML = `<p class="sr-empty">لا يوجد قارئ مطابق</p>`;
    return;
  }

  list.forEach(r => {
    const item = document.createElement("button");
    item.className = "reciter-item" + (r.identifier === store.reciter ? " selected" : "");
    item.dataset.id = r.identifier;
    item.innerHTML = `
      <span class="ri-avatar">
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M12 14c3.3 0 6-2.7 6-6V5c0-1.7-1.3-3-3-3H9C7.3 2 6 3.3 6 5v3c0 3.3 2.7 6 6 6zm7-4c0 3.5-2.6 6.4-6 6.9V20h3v2H8v-2h3v-3.1c-3.4-.5-6-3.4-6-6.9V8h2v2c0 2.8 2.2 5 5 5s5-2.2 5-5V8h2v2z"/></svg>
      </span>
      <span class="ri-main">
        <h4>${esc(r.name)}</h4>
        <p>${esc(r.identifier)}</p>
      </span>
      <span class="ri-fav ${store.favReciters.includes(r.identifier) ? "active" : ""}" data-id="${r.identifier}" title="مفضلة">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 17.3l-6.2 3.3 1.2-6.9L2 8.9l7-1L12 1.5 15 7.9l7 1-5 4.8 1.2 6.9z"/></svg>
      </span>
      ${r.identifier === store.reciter ? '<span class="ri-check">✓</span>' : ""}`;

    item.querySelector(".ri-fav").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavReciter(r.identifier);
    });
    item.addEventListener("click", () => setReciter(r.identifier));
    reciterList.appendChild(item);
  });
}

function openReciterModal() {
  reciterModal.classList.remove("hidden");
  renderReciterList(reciterSearch.value);
  setTimeout(() => reciterSearch.focus(), 60);
}
function closeReciterModal() { reciterModal.classList.add("hidden"); }

reciterTrigger.addEventListener("click", openReciterModal);
reciterModalClose.addEventListener("click", closeReciterModal);
reciterModal.addEventListener("click", (e) => { if (e.target === reciterModal) closeReciterModal(); });
reciterSearch.addEventListener("input", debounce(() => renderReciterList(reciterSearch.value), 120));

/* ══════════ Global search ══════════ */
let srItems = [];
let srSel = -1;

function searchAll(q) {
  const nq = normalizeAr(q);
  if (!nq) return { surahs: [], reciters: [] };
  const surahs = SURAHS.filter(([num, name, en]) =>
    normalizeAr(name).includes(nq) ||
    (en || "").toLowerCase().includes(nq) ||
    String(num) === q.trim()
  ).slice(0, 8);
  const recitersQ = reciters.length ? reciters : FALLBACK_RECITERS;
  const rcs = recitersQ.filter(r =>
    normalizeAr(r.name).includes(nq) ||
    normalizeAr(r.englishName || "").includes(nq) ||
    r.identifier.toLowerCase().includes(nq)
  ).slice(0, 6);
  return { surahs, reciters: rcs };
}

function renderSearchResults() {
  const q = globalSearch.value;
  const { surahs, reciters: rcs } = searchAll(q);
  searchResults.innerHTML = "";
  srItems = [];
  srSel = -1;

  if (!q.trim()) { searchResults.classList.add("hidden"); return; }
  if (!surahs.length && !rcs.length) {
    searchResults.innerHTML = `<p class="sr-empty">لا توجد نتائج لـ "${esc(q)}"</p>`;
    searchResults.classList.remove("hidden");
    return;
  }

  if (surahs.length) {
    const sec = document.createElement("div");
    sec.className = "sr-section";
    sec.innerHTML = `<p class="sr-label">السور</p>`;
    surahs.forEach(([num, name, en, type, ayas]) => {
      const b = document.createElement("button");
      b.className = "sr-item";
      b.innerHTML = `
        <span class="sr-num">${toArabicNumber(num)}</span>
        <span style="flex:1;text-align:right">سورة ${esc(name)}
          <span class="sr-sub"> — ${type === "Meccan" ? "مكية" : "مدنية"} • ${toArabicNumber(ayas)} آية</span>
        </span>`;
      b.addEventListener("click", () => { clearSearch(); goListen(num, store.reciter); });
      sec.appendChild(b);
      srItems.push({ el: b, type: "surah", n: num });
    });
    searchResults.appendChild(sec);
  }

  if (rcs.length) {
    const sec = document.createElement("div");
    sec.className = "sr-section";
    sec.innerHTML = `<p class="sr-label">القراء</p>`;
    rcs.forEach(r => {
      const b = document.createElement("button");
      b.className = "sr-item";
      b.innerHTML = `
        <span class="sr-num">🎙</span>
        <span style="flex:1;text-align:right">${esc(r.name)}
          <span class="sr-sub"> — ${esc(r.identifier)}</span>
        </span>`;
      b.addEventListener("click", () => { clearSearch(); setReciter(r.identifier); });
      sec.appendChild(b);
      srItems.push({ el: b, type: "reciter" });
    });
    searchResults.appendChild(sec);
  }

  searchResults.classList.remove("hidden");
}

function clearSearch() {
  globalSearch.value = "";
  searchResults.classList.add("hidden");
  srItems = [];
  srSel = -1;
}

globalSearch.addEventListener("input", debounce(renderSearchResults, 100));
globalSearch.addEventListener("focus", () => { if (globalSearch.value.trim()) renderSearchResults(); });
globalSearch.addEventListener("keydown", (e) => {
  if (!srItems.length) return;
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    srSel = (srSel + (e.key === "ArrowDown" ? 1 : -1) + srItems.length) % srItems.length;
    srItems.forEach((it, i) => it.el.classList.toggle("highlighted", i === srSel));
    srItems[srSel].el.scrollIntoView({ block: "nearest" });
  }
  if (e.key === "Enter") {
    const item = srItems[Math.max(srSel, 0)];
    item.el.click();
  }
  if (e.key === "Escape") clearSearch();
});
document.addEventListener("click", (e) => {
  if (!e.target.closest("#search-wrap")) searchResults.classList.add("hidden");
});

/* ══════════ Load & render surah ══════════ */
/* The API prefixes the first ayah with Basmalah (with Alef-Wasla + tashkeel).
   Strip it by comparing diacritics-free word forms. */
function stripBismillah(text) {
  const words = String(text).trim().split(/\s+/);
  if (words.length <= 4) return text;
  const bare = s => s.replace(/[\u064B-\u0652\u0670\u0640]/g, "").replace(/\u0671/g, "ا");
  const head = words.slice(0, 4).map(bare);
  if (head[0] === "بسم" && head[1] === "الله" &&
      head[2].startsWith("الرحمن") && head[3].startsWith("الرحيم")) {
    return words.slice(4).join(" ");
  }
  return text;
}

async function loadSurah(n, reciterId, opts = {}) {
  n = +n;
  placeholder.classList.add("hidden");
  loadingSpinner.classList.remove("hidden");
  surahHeader.classList.add("hidden");
  ayahsContainer.querySelectorAll(".ayah-block").forEach(b => b.remove());

  try {
    const res = await fetch(`${API_BASE}/surah/${n}/${reciterId}`);
    const data = await res.json();
    if (data.code !== 200) throw new Error("تعذر تحميل السورة من الخادم");

    currentSurah = data.data;
    currentAyahs = currentSurah.ayahs;
    currentSurahNum = n;
    currentSurahName = SURAHS[n - 1][1];
    currentAyahIdx = Math.min(Math.max(opts.ayahIdx || 0, 0), currentAyahs.length - 1);
    loadedKey = `${n}:${reciterId}`;

    renderSurahHeader();
    renderAyahs();
    setupPlayer(opts);

    addRecent(n, reciterId);

    if (currentView === "listen") {
      history.replaceState(null, "", `#/listen/${n}/${reciterId}`);
    }

    if (opts.autoplay) playCurrentAyah();
    else if (opts.ayahIdx > 0) highlightAyah(currentAyahIdx, false);
  } catch (e) {
    console.error(e);
    loadingSpinner.classList.add("hidden");
    ayahsContainer.innerHTML = `
      <div class="placeholder-card">
        <p class="text-red-400 text-lg">حدث خطأ أثناء تحميل السورة</p>
        <p class="text-dim text-sm mt-2">${esc(e.message)} — تحقق من اتصالك بالإنترنت</p>
      </div>`;
  }
}

function renderSurahHeader() {
  const n = currentSurahNum;
  const [, , en, type, ayas] = SURAHS[n - 1];
  surahTitle.textContent = `سورة ${currentSurahName}`;
  surahMeta.textContent = `${toArabicNumber(ayas)} آية • ${type === "Meccan" ? "مكية" : "مدنية"} • ${en}`;
  surahBadge.textContent = `السورة ${toArabicNumber(n)} • ${surahJuzMap[n].map(j => `الجزء ${toArabicNumber(j)}`).join("، ")}`;
  bismillahLine.classList.toggle("hidden", n === 1 || n === 9);

  const fav = store.favSurahs.includes(n);
  surahFavBtn.classList.toggle("faved", fav);
  surahFavBtn.querySelector("span").textContent = fav ? "محفوظة" : "مفضلة";

  updateDownloadButton();
  surahHeader.classList.remove("hidden");
}

/* ── Download surah (via same-origin proxy → native browser download) ── */
function downloadProxyUrl(n) {
  const name = `${n} - سورة ${SURAHS[n - 1][1]} - ${reciterName(store.reciter)}`;
  return `/api/download/${n}?reciter=${encodeURIComponent(store.reciter)}&name=${encodeURIComponent(name)}`;
}

function updateDownloadButton() {
  const n = currentSurahNum;
  if (!n) return;
  const url = downloadProxyUrl(n);
  surahDownloadBtn.href = url;
  surahDownloadBtn.setAttribute("download", `quran-${String(n).padStart(3, "0")}.mp3`);
  const done = store.downloads.includes(n);
  surahDownloadBtn.classList.toggle("faved", done);
  surahDownloadBtn.querySelector("span").textContent = done ? "محمّلة ✓" : "تحميل";
}

let downloadBusy = false;
surahDownloadBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (downloadBusy || !currentSurahNum) return;
  const n = currentSurahNum;
  const url = surahDownloadBtn.href;
  const filename = surahDownloadBtn.getAttribute("download");

  downloadBusy = true;
  toast("جاري تحضير التحميل...", "⬇");
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (!res.ok) {
      toast("التحميل غير متاح لهذا القارئ حالياً", "⚠");
      return;
    }
  } catch (err) { /* proceed anyway — let the browser try */ }

  triggerDownload(url, filename);
  if (!store.downloads.includes(n)) {
    store.downloads.push(n);
    saveStore();
  }
  updateDownloadButton();
  refreshDownloadBadges();
  toast("بدأ التحميل — تابع تقدمه من مدير التحميلات في متصفحك", "⬇");
});

function refreshDownloadBadges() {
  document.querySelectorAll(".surah-card").forEach(card => {
    const n = +card.dataset.n;
    let badge = card.querySelector(".dl-badge");
    if (store.downloads.includes(n)) {
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "mini-chip dl-badge";
        badge.textContent = "محمّلة ✓";
        card.querySelector(".sc-chips").prepend(badge);
      }
    } else if (badge) {
      badge.remove();
    }
  });
}

function triggerDownload(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function ayahActionsHTML() {
  return `
    <div class="ayah-actions">
      <button class="ayah-act" data-act="play" title="تشغيل من هذه الآية">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </button>
      <button class="ayah-act" data-act="tafsir" title="التفسير والترجمة">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 19.5A2.5 2.5 0 016.5 17H20V4H6.5A2.5 2.5 0 004 6.5v13zM4 19.5A2.5 2.5 0 006.5 22H20v-5"/></svg>
      </button>
      <button class="ayah-act" data-act="copy" title="نسخ الآية">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg>
      </button>
      <button class="ayah-act" data-act="share" title="مشاركة الآية">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>
      </button>
    </div>`;
}

function renderAyahs() {
  loadingSpinner.classList.add("hidden");
  ayahsContainer.querySelectorAll(".ayah-block").forEach(b => b.remove());

  currentAyahs.forEach((ayah, idx) => {
    const n = currentSurahNum;
    let text = ayah.text;
    if (idx === 0 && n !== 1 && n !== 9) text = stripBismillah(text) || text;

    const block = document.createElement("div");
    block.className = "ayah-block";
    block.dataset.index = idx;
    block.style.animationDelay = `${Math.min(idx * 0.02, 0.4)}s`;
    block.innerHTML = `
      <div class="ayah-top">
        <div class="ayah-number-badge">${toArabicNumber(ayah.numberInSurah)}</div>
        <p class="ayah-text">${esc(text)} <span class="ayah-end">﴿${toArabicNumber(ayah.numberInSurah)}﴾</span></p>
      </div>
      ${ayahActionsHTML()}`;

    block.querySelector('[data-act="play"]').addEventListener("click", (e) => {
      e.stopPropagation();
      jumpToAyah(idx, { play: true });
    });
    block.querySelector('[data-act="tafsir"]').addEventListener("click", (e) => {
      e.stopPropagation();
      openTafsir(idx);
    });
    block.querySelector('[data-act="copy"]').addEventListener("click", (e) => {
      e.stopPropagation();
      copyAyah(idx);
    });
    block.querySelector('[data-act="share"]').addEventListener("click", (e) => {
      e.stopPropagation();
      shareAyah(idx);
    });
    block.addEventListener("click", () => jumpToAyah(idx, { play: true }));

    ayahsContainer.appendChild(block);
  });
}

function addRecent(n, r) {
  store.recents = store.recents.filter(x => !(x.n === n && x.r === r));
  store.recents.unshift({ n, r, name: SURAHS[n - 1][1] });
  store.recents = store.recents.slice(0, 8);
  saveStore();
}

/* ══════════ Audio engine ══════════ */
function ayahAudioSrc(idx) {
  const a = currentAyahs[idx];
  return a && (a.audio || (a.audioSecondary && a.audioSecondary[0])) || "";
}

function setupPlayer(opts = {}) {
  playerBar.classList.remove("hidden");
  audioEl.volume = store.volume;
  volumeSlider.value = store.volume;
  volumeValue.textContent = Math.round(store.volume * 100) + "%";
  audioEl.playbackRate = store.rate;
  speedLabel.textContent = store.rate + "x";
  audioEl.src = ayahAudioSrc(currentAyahIdx);
  updateNowPlaying();
  updateMediaSession();
  if (opts.ayahIdx > 0 && !opts.keepScroll) highlightAyah(currentAyahIdx, false);
}

function jumpToAyah(idx, { play = false, scroll = true } = {}) {
  if (idx < 0 || idx >= currentAyahs.length) return;
  currentAyahIdx = idx;
  audioEl.src = ayahAudioSrc(idx);
  audioEl.playbackRate = store.rate;
  updateNowPlaying();
  highlightAyah(idx, scroll);
  updateMediaSession();
  if (play || isPlaying) playCurrentAyah();
}

function playCurrentAyah() {
  if (!currentAyahs.length) return;
  if (currentAyahIdx < 0 || currentAyahIdx >= currentAyahs.length) currentAyahIdx = 0;
  const src = ayahAudioSrc(currentAyahIdx);
  if (!src) return;
  if (!audioEl.src || !audioEl.src.endsWith(src.split("/").pop()) || audioEl.paused) {
    if (audioEl.src !== src) audioEl.src = src;
  }
  audioEl.playbackRate = store.rate;
  audioEl.play().then(() => {
    isPlaying = true;
    updatePlayPauseUI();
    highlightAyah(currentAyahIdx, true);
    updateNowPlaying();
    updateMediaSession(true);
    prefetchNext();
  }).catch(err => console.warn("Play blocked:", err));
}

function togglePlayPause() {
  if (!audioEl.src) {
    if (currentAyahs.length) playCurrentAyah();
    return;
  }
  if (audioEl.paused) {
    audioEl.play().catch(() => {});
    isPlaying = true;
  } else {
    audioEl.pause();
    isPlaying = false;
  }
  updatePlayPauseUI();
  updateMediaSession();
}

function updatePlayPauseUI() {
  playIcon.classList.toggle("hidden", isPlaying);
  pauseIcon.classList.toggle("hidden", !isPlaying);
}

function highlightAyah(idx, scroll = true) {
  document.querySelectorAll(".ayah-block").forEach(b => b.classList.remove("active-ayah"));
  const block = ayahsContainer.querySelector(`[data-index="${idx}"]`);
  if (block) {
    block.classList.add("active-ayah");
    if (scroll && currentView === "listen") {
      block.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}

function updateNowPlaying() {
  if (!currentAyahs.length || currentAyahIdx >= currentAyahs.length) return;
  const ayah = currentAyahs[currentAyahIdx];
  nowPlaying.textContent = `سورة ${currentSurahName} • ${reciterName(store.reciter)}`;
  ayahCounter.textContent = `الآية ${toArabicNumber(ayah.numberInSurah)} — ${currentAyahIdx + 1} / ${currentAyahs.length}`;
}

function prefetchNext() {
  const next = currentAyahIdx + 1;
  if (next >= currentAyahs.length) return;
  const url = ayahAudioSrc(next);
  if (!url || prefetched.has(url)) return;
  prefetched.add(url);
  fetch(url, { mode: "no-cors" }).catch(() => prefetched.delete(url));
}

/* ── Audio events ── */
audioEl.addEventListener("timeupdate", () => {
  if (!audioEl.duration || !isFinite(audioEl.duration)) return;
  const pct = (audioEl.currentTime / audioEl.duration) * 100;
  if (!progressContainer.classList.contains("dragging")) {
    progressBar.style.width = pct + "%";
    progressThumb.style.left = pct + "%";
  }
  updatePositionState();
});

audioEl.addEventListener("ended", () => {
  if (sleep.mode === "end") { stopSleep(); toast("توقفت الأصوات - مؤقت النوم", "🌙"); return; }
  if (store.repeat === "ayah") { audioEl.currentTime = 0; audioEl.play().catch(() => {}); return; }
  if (currentAyahIdx < currentAyahs.length - 1) {
    jumpToAyah(currentAyahIdx + 1, { play: true });
  } else if (store.repeat === "surah") {
    jumpToAyah(0, { play: true });
  } else {
    isPlaying = false;
    updatePlayPauseUI();
  }
});

audioEl.addEventListener("error", () => {
  if (audioEl.src) toast("تعذر تحميل الصوت — تحقق من الاتصال", "⚠");
});

/* ── Seek (pointer drag) ── */
let seeking = false;
function seekTo(e) {
  if (!audioEl.duration || !isFinite(audioEl.duration)) return;
  const rect = progressContainer.getBoundingClientRect();
  const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
  progressBar.style.width = pct * 100 + "%";
  progressThumb.style.left = pct * 100 + "%";
  audioEl.currentTime = pct * audioEl.duration;
}
progressContainer.addEventListener("pointerdown", (e) => {
  seeking = true;
  progressContainer.classList.add("dragging");
  progressContainer.setPointerCapture(e.pointerId);
  seekTo(e);
});
progressContainer.addEventListener("pointermove", (e) => { if (seeking) seekTo(e); });
progressContainer.addEventListener("pointerup", () => {
  seeking = false;
  progressContainer.classList.remove("dragging");
});

/* ── Volume ── */
volumeSlider.addEventListener("input", () => {
  audioEl.volume = parseFloat(volumeSlider.value);
  store.volume = audioEl.volume;
  volumeValue.textContent = Math.round(volumeSlider.value * 100) + "%";
  saveStore();
});

/* ── Prev / Next ── */
prevBtn.addEventListener("click", () => {
  if (audioEl.currentTime > 3) { audioEl.currentTime = 0; return; }
  if (currentAyahIdx > 0) jumpToAyah(currentAyahIdx - 1, { play: true });
});
nextBtn.addEventListener("click", () => {
  if (currentAyahIdx < currentAyahs.length - 1) jumpToAyah(currentAyahIdx + 1, { play: true });
});

playBtn.addEventListener("click", togglePlayPause);
surahPlayBtn.addEventListener("click", () => {
  if (currentView === "listen" && currentAyahs.length) playCurrentAyah();
});

/* ── Popover menus ── */
function positionMenu(menu, btn) {
  menu.classList.remove("hidden");
  const innerRect = playerInner.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  const mw = menu.offsetWidth;
  let right = innerRect.right - btnRect.right;
  right = Math.max(8, Math.min(right, window.innerWidth - mw - 8));
  menu.style.right = right + "px";
  menu.style.left = "auto";
}
function toggleMenu(menu, btn) {
  const open = !menu.classList.contains("hidden");
  closeMenus();
  if (!open) positionMenu(menu, btn);
}
function closeMenus() {
  [speedMenu, repeatMenu, sleepMenu].forEach(m => m.classList.add("hidden"));
}
document.addEventListener("click", (e) => {
  if (!e.target.closest(".pop-menu") && !e.target.closest("#speed-btn") &&
    !e.target.closest("#repeat-btn") && !e.target.closest("#sleep-btn")) closeMenus();
});

/* ── Speed ── */
speedBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleMenu(speedMenu, speedBtn); });
speedMenu.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-rate]");
  if (!btn) return;
  store.rate = parseFloat(btn.dataset.rate);
  audioEl.playbackRate = store.rate;
  speedLabel.textContent = store.rate + "x";
  speedMenu.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === btn));
  saveStore();
  closeMenus();
  toast(`سرعة التشغيل: ${store.rate}x`, "⏩");
});

/* ── Repeat ── */
function applyRepeatUI() {
  repeatBtn.classList.toggle("state-on", store.repeat !== "off");
  repeatBadge.classList.toggle("hidden", store.repeat !== "ayah");
  repeatBtn.title = store.repeat === "ayah" ? "التكرار: الآية" :
    store.repeat === "surah" ? "التكرار: السورة" : "التكرار: معطل";
  repeatMenu.querySelectorAll("[data-repeat]").forEach(b =>
    b.classList.toggle("active", b.dataset.repeat === store.repeat));
}
repeatBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleMenu(repeatMenu, repeatBtn); });
repeatMenu.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-repeat]");
  if (!btn) return;
  store.repeat = btn.dataset.repeat;
  applyRepeatUI();
  closeMenus();
  toast(store.repeat === "off" ? "أُلغي التكرار" :
    store.repeat === "ayah" ? "تكرار الآية — مفيد للحفظ" : "تكرار السورة", "🔁");
});

/* ── Sleep timer ── */
function stopSleep() {
  clearInterval(sleep.iv);
  sleep.iv = null;
  sleep.mode = null;
  sleepBadge.classList.add("hidden");
  sleepBtn.classList.remove("state-on", "gold");
  sleepBtn.title = "مؤقت النوم";
  sleepMenu.querySelectorAll("[data-sleep]").forEach(b =>
    b.classList.toggle("active", b.dataset.sleep === "off"));
}
function startSleep(mode) {
  stopSleep();
  sleep.mode = mode;
  sleepBtn.classList.add("state-on", "gold");
  sleepBadge.classList.remove("hidden");

  if (mode === "end") {
    sleepBadge.textContent = "♪";
    sleepBtn.title = "سيتوقف بعد نهاية السورة";
  } else {
    const mins = parseInt(mode, 10);
    sleep.endsAt = Date.now() + mins * 60000;
    const tick = () => {
      const remain = sleep.endsAt - Date.now();
      if (remain <= 0) {
        audioEl.pause();
        isPlaying = false;
        updatePlayPauseUI();
        stopSleep();
        toast("انتهى مؤقت النوم — تم إيقاف التشغيل", "🌙");
        return;
      }
      sleepBadge.textContent = fmtTime(remain / 1000);
    };
    tick();
    sleep.iv = setInterval(tick, 1000);
    sleepBtn.title = `سيتوقف التشغيل بعد ${mins} دقيقة`;
  }
  sleepMenu.querySelectorAll("[data-sleep]").forEach(b =>
    b.classList.toggle("active", b.dataset.sleep === String(mode)));
}
sleepBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleMenu(sleepMenu, sleepBtn); });
sleepMenu.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-sleep]");
  if (!btn) return;
  const v = btn.dataset.sleep;
  closeMenus();
  if (v === "off") { stopSleep(); toast("أُلغي مؤقت النوم", "🌙"); return; }
  startSleep(v);
  toast(v === "end" ? "سيتوقف التشغيل بعد نهاية السورة" : `سيتوقف التشغيل بعد ${v} دقيقة`, "🌙");
});

/* ── Player misc ── */
nowPlayingWrap.addEventListener("click", () => {
  if (currentSurahNum) goListen(currentSurahNum, store.reciter);
});
playerClose.addEventListener("click", () => {
  audioEl.pause();
  isPlaying = false;
  updatePlayPauseUI();
  playerBar.classList.add("hidden");
});
tafsirBtn.addEventListener("click", () => openTafsir(currentAyahIdx));
ayahShareBtn.addEventListener("click", () => shareAyah(currentAyahIdx));
surahDlMini.addEventListener("click", () => surahDownloadBtn.click());

/* ══════════ Share & Copy ══════════ */
function listenUrl(n, r, a) {
  return `${location.origin}${location.pathname}#/listen/${n}/${r}${a ? "/" + a : ""}`;
}

async function shareData(data) {
  if (navigator.share) {
    try { await navigator.share(data); return true; } catch (e) { if (e.name === "AbortError") return true; }
  }
  try {
    await navigator.clipboard.writeText(`${data.title}\n${data.text ? data.text + "\n" : ""}${data.url}`);
    toast("تم نسخ الرابط للحافظة", "🔗");
    return true;
  } catch (e) {
    toast("تعذر المشاركة", "⚠");
    return false;
  }
}

function shareSurah() {
  if (!currentSurahNum) return;
  shareData({
    title: `سورة ${currentSurahName}`,
    text: `سورة ${currentSurahName} بصوت ${reciterName(store.reciter)}`,
    url: listenUrl(currentSurahNum, store.reciter)
  });
}

function shareAyah(idx) {
  if (!currentAyahs[idx]) return;
  const ayah = currentAyahs[idx];
  const text = ayah.text.length > 200 ? ayah.text.slice(0, 200) + "…" : ayah.text;
  shareData({
    title: `سورة ${currentSurahName} - الآية ${ayah.numberInSurah}`,
    text: `${text}\n﴿ سورة ${currentSurahName} - الآية ${ayah.numberInSurah} ﴾`,
    url: listenUrl(currentSurahNum, store.reciter, idx + 1)
  });
}

async function copyAyah(idx) {
  if (!currentAyahs[idx]) return;
  const ayah = currentAyahs[idx];
  try {
    await navigator.clipboard.writeText(
      `${ayah.text}\n﴿${toArabicNumber(ayah.numberInSurah)}﴾ [سورة ${currentSurahName}]`
    );
    toast("تم نسخ الآية", "📋");
  } catch (e) {
    toast("تعذر النسخ", "⚠");
  }
}

surahShareBtn.addEventListener("click", shareSurah);
surahFavBtn.addEventListener("click", () => toggleFavSurah(currentSurahNum));

/* ══════════ Tafsir & Translation ══════════ */
async function fetchTafsirData(n) {
  if (tafsirCache.has(n)) return tafsirCache.get(n);
  const [tRes, trRes] = await Promise.allSettled([
    fetch(`${API_BASE}/surah/${n}/ar.muyassar`).then(r => r.json()),
    fetch(`${API_BASE}/surah/${n}/en.sahih`).then(r => r.json())
  ]);
  const out = {
    tafsir: tRes.status === "fulfilled" && tRes.value.code === 200
      ? tRes.value.data.ayahs.map(a => a.text) : null,
    translation: trRes.status === "fulfilled" && trRes.value.code === 200
      ? trRes.value.data.ayahs.map(a => a.text) : null
  };
  tafsirCache.set(n, out);
  return out;
}

async function openTafsir(idx) {
  if (!currentSurahNum || !currentAyahs[idx]) return;
  tafsirAyahIdx = idx;
  tafsirFollow = true;
  tafsirDrawer.classList.remove("hidden");
  renderTafsirLoading();
  try {
    const data = await fetchTafsirData(currentSurahNum);
    if (!data.tafsir && !data.translation) {
      tafsirText.textContent = "تعذر تحميل التفسير — تحقق من الاتصال";
      return;
    }
    renderTafsir();
  } catch (e) {
    tafsirText.textContent = "حدث خطأ أثناء تحميل التفسير";
  }
}

function renderTafsirLoading() {
  const ayah = currentAyahs[tafsirAyahIdx];
  tafsirTitle.textContent = `سورة ${currentSurahName}`;
  tafsirAyahRef.textContent = `الآية ${toArabicNumber(ayah.numberInSurah)}`;
  tafsirCounter.textContent = `${tafsirAyahIdx + 1} / ${currentAyahs.length}`;
  tafsirText.innerHTML = `<span class="spinner" style="margin:0"></span>`;
}

function renderTafsir() {
  const data = tafsirCache.get(currentSurahNum) || {};
  const ayah = currentAyahs[tafsirAyahIdx];
  tafsirTitle.textContent = `سورة ${currentSurahName}`;
  tafsirAyahRef.textContent = `الآية ${toArabicNumber(ayah.numberInSurah)}`;
  tafsirCounter.textContent = `${tafsirAyahIdx + 1} / ${currentAyahs.length}`;

  let txt;
  if (tafsirTab === "tafsir") {
    txt = data.tafsir ? data.tafsir[tafsirAyahIdx] : "التفسير غير متاح لهذه السورة";
  } else {
    txt = data.translation ? data.translation[tafsirAyahIdx] : "الترجمة غير متاحة";
    tafsirText.setAttribute("dir", "ltr");
  }
  if (tafsirTab === "tafsir") tafsirText.setAttribute("dir", "rtl");
  tafsirText.textContent = txt;
}

tafsirClose.addEventListener("click", () => tafsirDrawer.classList.add("hidden"));
document.querySelectorAll("[data-tafsir-tab]").forEach(btn =>
  btn.addEventListener("click", () => {
    tafsirTab = btn.dataset.tafsirTab;
    document.querySelectorAll("[data-tafsir-tab]").forEach(b =>
      b.classList.toggle("active", b === btn));
    renderTafsir();
  })
);
tafsirPrev.addEventListener("click", () => {
  if (tafsirAyahIdx > 0) { tafsirAyahIdx--; tafsirFollow = false; renderTafsir(); }
});
tafsirNext.addEventListener("click", () => {
  if (tafsirAyahIdx < currentAyahs.length - 1) { tafsirAyahIdx++; tafsirFollow = false; renderTafsir(); }
});

/* Follow playing ayah in tafsir */
audioEl.addEventListener("play", () => {
  if (!tafsirDrawer.classList.contains("hidden") && tafsirFollow && tafsirAyahIdx !== currentAyahIdx) {
    tafsirAyahIdx = currentAyahIdx;
    if (tafsirCache.has(currentSurahNum)) renderTafsir();
  }
});

/* ══════════ Media Session ══════════ */
function updateMediaSession(playing = isPlaying) {
  if (!("mediaSession" in navigator)) return;
  if (currentSurahNum && currentAyahs.length) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: `سورة ${currentSurahName} - الآية ${currentAyahs[currentAyahIdx]?.numberInSurah || ""}`,
      artist: reciterName(store.reciter),
      album: "القرآن المجيد",
      artwork: [
        { src: APP_URLS.icons[192], sizes: "192x192", type: "image/png" },
        { src: APP_URLS.icons[512], sizes: "512x512", type: "image/png" }
      ]
    });
  }
  navigator.mediaSession.playbackState = playing ? "playing" : "paused";
}

function updatePositionState() {
  if (!("mediaSession" in navigator) || !navigator.mediaSession.setPositionState) return;
  if (!audioEl.duration || !isFinite(audioEl.duration)) return;
  try {
    navigator.mediaSession.setPositionState({
      duration: audioEl.duration,
      playbackRate: audioEl.playbackRate,
      position: audioEl.currentTime
    });
  } catch (e) { /* ignore */ }
}

if ("mediaSession" in navigator) {
  try {
    navigator.mediaSession.setActionHandler("play", () => { playCurrentAyah(); });
    navigator.mediaSession.setActionHandler("pause", () => { audioEl.pause(); isPlaying = false; updatePlayPauseUI(); });
    navigator.mediaSession.setActionHandler("previoustrack", () => prevBtn.click());
    navigator.mediaSession.setActionHandler("nexttrack", () => nextBtn.click());
  } catch (e) { /* ignore */ }
}

/* ══════════ Keyboard shortcuts ══════════ */
document.addEventListener("keydown", (e) => {
  const tag = e.target.tagName;
  const typing = tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA";

  if (e.key === "/" && !typing) {
    e.preventDefault();
    globalSearch.focus();
    return;
  }
  if (e.key === "Escape") {
    closeMenus();
    closeReciterModal();
    tafsirDrawer.classList.add("hidden");
    clearSearch();
    return;
  }
  if (typing) return;

  if (e.code === "Space") { e.preventDefault(); togglePlayPause(); }
  if (e.code === "ArrowRight") { e.preventDefault(); prevBtn.click(); }
  if (e.code === "ArrowLeft") { e.preventDefault(); nextBtn.click(); }
  if (e.code === "ArrowUp") {
    e.preventDefault();
    volumeSlider.value = Math.min(1, audioEl.volume + 0.05);
    volumeSlider.dispatchEvent(new Event("input"));
  }
  if (e.code === "ArrowDown") {
    e.preventDefault();
    volumeSlider.value = Math.max(0, audioEl.volume - 0.05);
    volumeSlider.dispatchEvent(new Event("input"));
  }
});

/* ══════════ PWA ══════════ */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(APP_URLS.sw).catch(err =>
      console.warn("SW registration failed:", err));
  });
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove("hidden");
});
installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === "accepted") toast("تم تثبيت التطبيق على جهازك", "📲");
  deferredPrompt = null;
  installBtn.classList.add("hidden");
});
window.addEventListener("appinstalled", () => installBtn.classList.add("hidden"));

/* ══════════ Init ══════════ */
function init() {
  applyTheme(store.theme === "light" ? "light" : "dark");
  initJuzFilter();
  renderGrid();
  applyRepeatUI();
  reciterTriggerName.textContent = reciterName(store.reciter);

  window.addEventListener("hashchange", route);

  ensureReciters().then(list => {
    reciterTriggerName.textContent = reciterName(store.reciter);
    const valid = list.some(r => r.identifier === store.reciter);
    if (!valid && list.length) {
      store.reciter = "ar.alafasy";
      reciterTriggerName.textContent = reciterName(store.reciter);
    }
  });

  route();
}

init();
