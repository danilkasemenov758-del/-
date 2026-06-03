const tg = window.Telegram?.WebApp;

if (tg) {
  document.body.classList.add("telegram-runtime");
  tg.ready();
  tg.expand();
  tg.setHeaderColor?.("#ff8a22");
  tg.setBackgroundColor?.("#ff8a22");
}

const API_BASE = window.TOCHKA_API_URL || localStorage.getItem("tochkaApiUrl") || "";
const APP_VERSION = "2026.06.03-11";
const COMPANY_SITE_URL = "https://bunny-bon.ru";
const COMPANY_VK_URL = "https://vk.com/bunnybon";
const releaseNotes = [
  "Добавлен админский экран редактирования амбассадоров: код, заработанные банни и сумма на выводе.",
  "У амбассадора скрыты разделы заказов, программ, реквизита и сохраненного.",
  "В добавлении заказа у амбассадора снова отображается его личный код.",
  "Редактирование амбассадора теперь синхронизируется с Supabase.",
  "РљРѕРґ Р°РјР±Р°СЃСЃР°РґРѕСЂР° С‚РµРїРµСЂСЊ Р·Р°РґР°РµС‚СЃСЏ С‚РѕР»СЊРєРѕ РїСЂРё РІС‹РґР°С‡Рµ РїСЂР°РІ Р°РјР±Р°СЃСЃР°РґРѕСЂР°.",
  "РџРѕР»Рµ РєРѕРґР° Р°РјР±Р°СЃСЃР°РґРѕСЂР° СѓР±СЂР°РЅРѕ РёР· СЃРѕР·РґР°РЅРёСЏ Р·Р°РєР°Р·Р°.",
  "РСЃРїСЂР°РІР»РµРЅР° РїСЂРѕРІРµСЂРєР° РґРѕСЃС‚СѓРїР° РїРѕСЃР»Рµ СЃРёРЅС…СЂРѕРЅРёР·Р°С†РёРё.",
  "Telegram ID Рё ID СЃРѕС‚СЂСѓРґРЅРёРєР° С‚РµРїРµСЂСЊ С…СЂР°РЅСЏС‚СЃСЏ РѕС‚РґРµР»СЊРЅРѕ.",
  "Р”РѕР±Р°РІР»РµРЅ СЌРєСЂР°РЅ РѕС‡РµСЂРµРґРё СЃРёРЅС…СЂРѕРЅРёР·Р°С†РёРё СЃ РѕС‚РјРµРЅРѕР№ РѕРїРµСЂР°С†РёР№.",
  "Р—Р°РІРёСЃС€РёРµ РѕРїРµСЂР°С†РёРё С‚РµРїРµСЂСЊ РјРѕР¶РЅРѕ СѓРґР°Р»РёС‚СЊ РІСЂСѓС‡РЅСѓСЋ.",
  "РќР° СЌРєСЂР°РЅРµ РґРѕСЃС‚СѓРїР° РїРѕРєР°Р·С‹РІР°РµС‚СЃСЏ Telegram ID Рё username РґР»СЏ РїСЂРѕРІРµСЂРєРё СЃРѕС‚СЂСѓРґРЅРёРєР°.",
  "РСЃРїСЂР°РІР»РµРЅР° Р·Р°РІРёСЃС€Р°СЏ РѕС‡РµСЂРµРґСЊ СЃРёРЅС…СЂРѕРЅРёР·Р°С†РёРё.",
  "РћС€РёР±РєРё API С‚РµРїРµСЂСЊ РѕС‚РѕР±СЂР°Р¶Р°СЋС‚СЃСЏ РїРѕРЅСЏС‚РЅРµРµ.",
  "РСЃРїСЂР°РІР»РµРЅР° РІС‹РґР°С‡Р° РґРѕСЃС‚СѓРїР° РЅРѕРІС‹Рј СЃРѕС‚СЂСѓРґРЅРёРєР°Рј.",
  "РСЃРїСЂР°РІР»РµРЅР° СЃРёРЅС…СЂРѕРЅРёР·Р°С†РёСЏ СЃРѕС‚СЂСѓРґРЅРёРєРѕРІ Р±РµР· РєРѕРґР° Р°РјР±Р°СЃСЃР°РґРѕСЂР°.",
  "РџСЂРѕРІРµСЂРєР° РґРѕСЃС‚СѓРїР° С‚РµРїРµСЂСЊ Р¶РґРµС‚ РѕС‚РІРµС‚ Р±Р°Р·С‹.",
  "РљРЅРѕРїРєР° РѕР±РЅРѕРІР»РµРЅРёСЏ РґРѕСЃС‚СѓРїР° РєРѕСЂСЂРµРєС‚РЅРѕ РїРµСЂРµРїСЂРѕРІРµСЂСЏРµС‚ СЃРѕС‚СЂСѓРґРЅРёРєР°.",
  "Р­РєСЂР°РЅ РѕР±СЂР°С‰РµРЅРёСЏ Рє Р°РґРјРёРЅСѓ РІРѕР·РІСЂР°С‰Р°РµС‚ РЅР° СЌРєСЂР°РЅ РґРѕСЃС‚СѓРїР°.",
  "Р”РѕР±Р°РІР»РµРЅР° СЂРѕР»СЊ Р°РјР±Р°СЃСЃР°РґРѕСЂР°.",
  "РђРґРјРёРЅ РјРѕР¶РµС‚ РґРѕР±Р°РІР»СЏС‚СЊ РїСЂРѕРјРѕРєРѕРґС‹.",
  "Р”РѕСЃС‚СѓРї РІ РїСЂРёР»РѕР¶РµРЅРёРµ РІС‹РґР°РµС‚ С‚РѕР»СЊРєРѕ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂ.",
  "РЈ Р°РјР±Р°СЃСЃР°РґРѕСЂР° РїРѕСЏРІРёР»РёСЃСЊ Р»РёС‡РЅС‹Р№ РєРѕРґ, Р±Р°РЅРЅРё Рё Р·Р°СЏРІРєР° РЅР° РІС‹РІРѕРґ.",
  "РџРѕС‡РёРЅРµРЅ РїРѕРёСЃРє РїРѕ СЂРµРєРІРёР·РёС‚Сѓ.",
  "Р”РѕР±Р°РІР»РµРЅ С„РёР»СЊС‚СЂ СЂРµРєРІРёР·РёС‚Р° РїРѕ РЅРѕРјРµСЂСѓ СЏС‡РµР№РєРё.",
  "РџРѕРёСЃРє С‚РµРїРµСЂСЊ СЃРјРѕС‚СЂРёС‚ РЅР°Р·РІР°РЅРёРµ Рё РјРµСЃС‚Рѕ С…СЂР°РЅРµРЅРёСЏ.",
  "Р¤РёР»СЊС‚СЂ СЃС‚Р°С‚СѓСЃР°, РїРѕРёСЃРє Рё СЏС‡РµР№РєР° СЂР°Р±РѕС‚Р°СЋС‚ РІРјРµСЃС‚Рµ.",
  "РЎРїРёСЃРѕРє СЏС‡РµРµРє СЃРѕР±РёСЂР°РµС‚СЃСЏ Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё РёР· СЂРµРєРІРёР·РёС‚Р°.",
];

const telegramUser = tg?.initDataUnsafe?.user;
const initialTelegramId = telegramUser?.id ?? 101;

const mockUser = {
  id: initialTelegramId,
  telegramId: initialTelegramId,
  firstName: tg?.initDataUnsafe?.user?.first_name ?? "Р”Р°С€Р°",
  username: telegramUser?.username ?? "local_user",
  photoUrl: telegramUser?.photo_url ?? "",
  role: "actor",
  hasAccess: !API_BASE,
};

let employees = [
  { id: 101, name: "Р”Р°С€Р°", efficiency: 86, accepted: 12, late: 1, rating: 4.8 },
  { id: 102, name: "РР»СЊСЏ", efficiency: 74, accepted: 8, late: 2, rating: 4.4 },
  { id: 103, name: "РњР°С€Р°", efficiency: 92, accepted: 16, late: 0, rating: 4.9 },
];

let reports = [
  { id: 1, actorName: "Р”Р°С€Р°", text: "РќРµ РѕС‚РєСЂС‹Р»Р°СЃСЊ РјСѓР·С‹РєР° РІ РїСЂРѕРіСЂР°РјРјРµ", createdAt: "01.06.2026 14:20", status: "new" },
  { id: 2, actorName: "РР»СЊСЏ", text: "РќРµС‚ Р±Р°РЅРЅРµСЂР° РІ РєРѕРјРїР»РµРєС‚Рµ", createdAt: "01.06.2026 15:05", status: "new" },
];

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (error) {
    return fallback;
  }
}

const state = {
  route: localStorage.getItem("authConfirmed") === "true" ? "checking" : "auth-confirm",
  justAuthorized: false,
  themeBurst: false,
  accessLoading: false,
  accessChecked: false,
  appTheme: localStorage.getItem("appTheme") || "dark",
  user: mockUser,
  syncQueue: readStorage("syncQueue", []),
  saved: readStorage("savedForTrip", []),
  deletedEntities: readStorage("deletedEntities", { orders: [], props: [], programs: [], employees: [] }),
  promoCodes: readStorage("promoCodes", []),
  ambassadorWithdrawals: readStorage("ambassadorWithdrawals", []),
  activeOrderId: 1,
  activeProgramId: 1,
  activeEmployeeId: 101,
  filter: "all",
  propSearch: "",
  propCellFilter: "all",
  orderFilter: "active",
  toast: "",
  reportText: "",
  versionGlow: localStorage.getItem("versionSeen") !== APP_VERSION,
  avatarOpen: false,
  timeEditorOpen: false,
  bonusFormOpen: false,
  acceptedOrders: JSON.parse(localStorage.getItem("acceptedOrders") || "{}"),
  booking: {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    comment: "",
    discount: "",
    promoCode: "",
    ambassadorCode: "",
    date: "2026-06-05",
    start: "16:00",
    end: "18:00",
    duration: 2,
    programId: 1,
    actors: 2,
    package: "2 Р°РєС‚РµСЂР°, РґРѕ 20 С‡РµР»РѕРІРµРє",
    extras: [],
  },
  newEmployee: { name: "", username: "", isAdmin: false, isAmbassador: false, ambassadorCode: "" },
  newPromo: { code: "", discount: "", description: "" },
  newProgram: { title: "", driveUrl: "", script: "", age: "", duration: "", pricePerHour: 0, actorPayPerHour: 0 },
  newBonus: { employeeId: "", amount: "", comment: "" },
  orderEditMode: false,
  orderDetailEditMode: false,
  ambassadorEditMode: false,
  programEditMode: false,
  propEditMode: false,
  earningsPeriod: "month",
  extraDraft: "",
  extraDraftPrice: "",
  extraEditMode: false,
  bonuses: readStorage("bonuses", []),
  programKits: readStorage("programKits", {}),
  kitBuilderProgramId: null,
  kitBuilderReturnRoute: "",
  newProp: { name: "", place: "РЎРєР»Р°Рґ", status: "available", kit: true },
};

let orders = [
  {
    id: 1,
    title: "Р§РµР»Р»РµРЅРґР¶ РџР°С‚Рё Р’Р»Р°РґР° Рђ4",
    date: "01.06.2026",
    time: "18:00",
    address: "СѓР». РЎРѕР»РЅРµС‡РЅР°СЏ, 14",
    role: "Р’РµРґСѓС‰Р°СЏ",
    actors: ["Р”Р°С€Р°", "РР»СЊСЏ"],
    status: "РџРѕРґС‚РІРµСЂР¶РґРµРЅ",
    kitStatus: "РљРѕРјРїР»РµРєС‚ РЅРµ РІР·СЏС‚",
    available: "14 РёР· 16 РґРѕСЃС‚СѓРїРЅРѕ",
  },
  {
    id: 2,
    title: "Р§РµР»Р»РµРЅРґР¶ РџР°С‚Рё Р’Р»Р°РґР° Рђ4",
    date: "02.06.2026",
    time: "18:00",
    address: "РїСЂ-С‚ РњРёСЂР°, 8",
    role: "РђРєС‚РµСЂ",
    actors: ["Р”Р°С€Р°"],
    status: "РќРѕРІС‹Р№",
    kitStatus: "РљРѕРјРїР»РµРєС‚ РЅРµ РІР·СЏС‚",
    available: "16 РёР· 16 РґРѕСЃС‚СѓРїРЅРѕ",
  },
  {
    id: 3,
    title: "Р§РµР»Р»РµРЅРґР¶ РџР°С‚Рё Р’Р»Р°РґР° Рђ4",
    date: "03.06.2026",
    time: "18:00",
    address: "СѓР». РџР°СЂРєРѕРІР°СЏ, 2",
    role: "Р’РµРґСѓС‰Р°СЏ",
    actors: ["Р”Р°С€Р°", "РњР°С€Р°"],
    status: "РџРѕРґС‚РІРµСЂР¶РґРµРЅ",
    kitStatus: "РљРѕРјРїР»РµРєС‚ Сѓ РІР°СЃ",
    available: "16 РёР· 16 РґРѕСЃС‚СѓРїРЅРѕ",
  },
];

orders = readStorage("orders", []);

let props = [
  { id: 1, name: "РљРѕР»РѕРЅРєР° JBL #1", status: "available", place: "РЎРєР»Р°Рґ", kit: true },
  { id: 2, name: "РњРёРєСЂРѕС„РѕРЅ #2", status: "mine", place: "РЈ Р”Р°С€Рё", kit: true },
  { id: 3, name: "РљР°СЂС‚РѕС‡РєРё Р·Р°РґР°РЅРёР№ Рђ4", status: "available", place: "РЎРєР»Р°Рґ", kit: true },
  { id: 4, name: "Р‘Р°РЅРЅРµСЂ С‡РµР»Р»РµРЅРґР¶", status: "busy", place: "РЈ РР»СЊРё", kit: true },
  { id: 5, name: "Р РµРєРІРёР·РёС‚РЅС‹Р№ СЏС‰РёРє", status: "available", place: "РЎРєР»Р°Рґ", kit: true },
  { id: 6, name: "РљРЅРѕРїРєР° РѕС‚РІРµС‚Р°", status: "repair", place: "РќР° РїСЂРѕРІРµСЂРєРµ", kit: false },
];

props = readStorage("props", window.TOCHKA_PROP_SEED || props);
if (Array.isArray(window.TOCHKA_PROP_SEED)) {
  const existingPropIds = new Set(props.map((item) => String(item.id)));
  const existingPropNames = new Set(props.map((item) => String(item.name || "").trim().toLowerCase()));
  props = [
    ...props,
    ...window.TOCHKA_PROP_SEED.filter(
      (item) => !existingPropIds.has(String(item.id)) && !existingPropNames.has(String(item.name || "").trim().toLowerCase())
    ),
  ];
}

const defaultPrograms = [
  {
    id: 1,
    title: "Р§РµР»Р»РµРЅРґР¶ РџР°С‚Рё Р’Р»Р°РґР° Рђ4",
    age: "7-12 Р»РµС‚",
    duration: "120 РјРёРЅСѓС‚",
    pricePerHour: 4500,
    actorPayPerHour: 1600,
    tracks: ["Р’С‹С…РѕРґ РІРµРґСѓС‰РµРіРѕ", "РљРѕРЅРєСѓСЂСЃ 1", "Р¤РёРЅР°Р»"],
  },
  {
    id: 2,
    title: "РљСЂРёРѕ-С€РѕСѓ",
    age: "5-12 Р»РµС‚",
    duration: "60 РјРёРЅСѓС‚",
    pricePerHour: 6200,
    actorPayPerHour: 1900,
    tracks: ["РЎС‚Р°СЂС‚ С€РѕСѓ", "Р­РєСЃРїРµСЂРёРјРµРЅС‚", "Р¤РёРЅР°Р»"],
  },
];

let programs = readStorage("programs", defaultPrograms);

const packageOptions = [
  { label: "РЁРѕСѓ РїСЂРѕРіСЂР°РјРјР°", actors: 1, multiplier: 1 },
  { label: "1 Р°РєС‚РµСЂ РґРѕ 10 С‡РµР»РѕРІРµРє", actors: 1, multiplier: 1 },
  { label: "2 Р°РєС‚РµСЂР°, РґРѕ 20 С‡РµР»РѕРІРµРє", actors: 2, multiplier: 1.35 },
  { label: "2 Р°РєС‚РµСЂР°, РґРѕ 30 С‡РµР»РѕРІРµРє", actors: 2, multiplier: 1.55 },
  { label: "3 Р°РєС‚РµСЂР°, РґРѕ 35 С‡РµР»РѕРІРµРє", actors: 3, multiplier: 1.9 },
];

const packageRates = [0, 416.67, 500, 666.67, 833.33];

const showPrograms = ["РќР°СѓС‡РЅРѕРµ С€РѕСѓ", "РЁРѕСѓ РјС‹Р»СЊРЅС‹С… РїСѓР·С‹СЂРµР№", "Р‘СѓРјР°Р¶РЅРѕРµ С€РѕСѓ"];

const extras = [
  "Р“РµРЅРµСЂР°С‚РѕСЂ РјС‹Р»СЊРЅС‹С… РїСѓР·С‹СЂРµР№",
  "РќСЏРЅСЏ РґР»СЏ РґРµС‚РµР№",
  "РђРєРІР°РіСЂРёРј",
  "РћС„РѕСЂРјР»РµРЅРёРµ С„РѕС‚Рѕ Р·РѕРЅС‹",
  "РЁРѕСѓ РєСЂР°СЃРѕРє РҐРѕР»Р»Рё",
  "РџРѕРїРєРѕСЂРЅ",
];

let editableExtras = readStorage("editableExtras", extras).map((item) =>
  typeof item === "string" ? { title: item, price: 0 } : { title: item.title, price: Number(item.price || 0) }
);

const animationPrograms = [
  "РЈСЌРЅСЃРґРµР№ Рё Р­РЅРёРґ",
  "Р‘Р°СЂР±Рё Рё РљРµРЅ",
  "РҐРѕР»РѕРґРЅРѕРµ СЃРµСЂРґС†Рµ",
  "Р’РµС‡РµСЂРёРЅРєР° Р’Р»Р°РґР° Рђ4",
  "РўСЂРё РљРѕС‚Р°",
  "Р‘СЂРµРјРµРЅСЃРєРёРµ РјСѓР·С‹РєР°РЅС‚С‹",
  "РџРёР¶Р°РјРЅР°СЏ РІРµС‡РµСЂРёРЅРєР°",
  "Р’РµС‡РµСЂ РЅР°СЃС‚РѕР»СЊРЅС‹С… РёРіСЂ",
  "РљСѓР»РёРЅР°СЂРЅРѕРµ С€РѕСѓ",
  "Р’РµС‡РµСЂРёРЅРєР° РІ С†РёСЂРєРµ",
  "РџРѕСЃР»РµРґРЅРёР№ РіРµСЂРѕР№",
  "РњРёС€РєРё РњРћ Рё РњР",
  "РџСЂРёРєР»СЋС‡РµРЅРёРµ Р“Р°СЂСЂРё РџРѕС‚С‚РµСЂР° Рё Р“РµСЂРјРёРѕРЅС‹",
  "РЈСЌРЅСЃРґРµР№",
  "Р‘Р°СЂР±Рё",
  "Р§РµР»РѕРІРµРє РїР°СѓРє",
  "РљРѕСЂР°Р»РёРЅР° РІ СЃС‚СЂР°РЅРµ РєРѕС€РјР°СЂРѕРІ",
  "РРіСЂР° РІ РєР°Р»СЊРјР°СЂР° 2",
  "РЁРїРёРѕРЅ (РїРѕ РјРѕС‚РёРІР°Рј Р°РјРѕРЅРі Р°СЃ)",
  "Р›РµРѕРЅ (РїРѕ РјРѕС‚РёРІР°Рј Р±СЂР°РІР» РЎС‚Р°СЂСЃ)",
  "РЎРёРјРєР° Рё РќРѕР»РёРє",
  "Р›РµРґРё Р±Р°Рі Рё СЃСѓРїРµСЂ РєРѕС‚",
  "РњР°С„РёСЏ",
  "Р—РѕРјР±Рё-Р°РїРѕРєР°Р»РёРїСЃРёСЃ",
];

const expressPrograms = [
  "Р­РєСЃРїСЂРµСЃСЃ-РїРѕР·РґСЂР°РІР»РµРЅРёРµ РїР°РЅРґС‹ РЇС€Рё",
  "Р­РєСЃРїСЂРµСЃСЃ-РїРѕР·РґСЂР°РІР»РµРЅРёРµ РіСѓСЃСЏ Р’РёС‚Р°Р»Рё",
  "Р­РєСЃРїСЂРµСЃСЃ-РїРѕР·РґСЂР°РІР»РµРЅРёРµ РјРёС€РєРё Р›РµРѕ",
  "Р­РєСЃРїСЂРµСЃСЃ-РїРѕР·РґСЂР°РІР»РµРЅРёРµ Р—Р°Р№РєРё Р›РёРё",
  "Р­РєСЃРїСЂРµСЃСЃ-РїРѕР·РґСЂР°РІР»РµРЅРёРµ РґРёРЅРѕР·Р°РІСЂР° Р­СЂРёРєР°",
  "Р­РєСЃРїСЂРµСЃСЃ-РїРѕР·РґСЂР°РІР»РµРЅРёРµ РЈС‚Рё РџСѓС‚Рё",
];

const masterClasses = [
  "РњР°СЃС‚РµСЂ-РєР»Р°СЃСЃ СЃР»Р°Р№Рј",
  "РњР°СЃС‚РµСЂ-РєР»Р°СЃСЃ РїРѕ СЂРѕСЃРїРёСЃРё РїСЂСЏРЅРёРєРѕРІ",
  "РњР°СЃС‚РµСЂ-РєР»Р°СЃСЃ С‚Р°Р±Р° Р»Р°РїРєР°",
  "РњР°СЃС‚РµСЂ-РєР»Р°СЃСЃ РїРѕ СЂРёСЃРѕРІР°РЅРёСЋ РєР°СЂС‚РёРЅ",
  "РњР°СЃС‚РµСЂ-РєР»Р°СЃСЃ СѓРєСЂР°С€РµРЅРёРµ РёР· СЌРїРѕРєСЃРёРґРЅРѕР№ СЃРјРѕР»С‹",
];

function saveState() {
  localStorage.setItem("syncQueue", JSON.stringify(state.syncQueue));
  localStorage.setItem("savedForTrip", JSON.stringify(state.saved));
  localStorage.setItem("acceptedOrders", JSON.stringify(state.acceptedOrders));
  localStorage.setItem("deletedEntities", JSON.stringify(state.deletedEntities));
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("props", JSON.stringify(props));
  localStorage.setItem("programs", JSON.stringify(programs));
  localStorage.setItem("editableExtras", JSON.stringify(editableExtras));
  localStorage.setItem("bonuses", JSON.stringify(state.bonuses));
  localStorage.setItem("programKits", JSON.stringify(state.programKits));
  localStorage.setItem("promoCodes", JSON.stringify(state.promoCodes));
  localStorage.setItem("ambassadorWithdrawals", JSON.stringify(state.ambassadorWithdrawals));
}

function roleLabel(role = state.user.role) {
  return {
    admin: "Р°РґРјРёРЅ",
    ambassador: "Р°РјР±Р°СЃСЃР°РґРѕСЂ",
    actor: "Р°РєС‚РµСЂ",
  }[role] || "Р°РєС‚РµСЂ";
}

function canAddOrder() {
  return ["admin", "ambassador"].includes(state.user.role);
}

function makeAmbassadorCode(seed = "") {
  const base = String(seed || state.user.username || state.user.firstName || Date.now())
    .replace(/^@/, "")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .slice(0, 10)
    .toUpperCase();
  return base ? `BUNNY-${base}` : `BUNNY-${Date.now().toString().slice(-5)}`;
}

function suggestedEmployeeAmbassadorCode() {
  return state.newEmployee.ambassadorCode || makeAmbassadorCode(state.newEmployee.username || state.newEmployee.name);
}

function ensureCurrentEmployee() {
  if (!state.user?.id || !state.user.hasAccess) return;
  const existing = employees.find((employee) => Number(employee.id) === Number(state.user.id));
  const record = {
    id: state.user.id,
    name: state.user.firstName,
    username: state.user.username,
    role: state.user.role,
    ambassadorCode: existing?.ambassadorCode || state.user.ambassadorCode || (state.user.role === "ambassador" ? makeAmbassadorCode() : ""),
    bunnyBalance: Number(existing?.bunnyBalance || state.user.bunnyBalance || 0),
    bunnyPending: Number(existing?.bunnyPending || state.user.bunnyPending || 0),
    efficiency: existing?.efficiency ?? 0,
    accepted: existing?.accepted ?? 0,
    late: existing?.late ?? 0,
    rating: existing?.rating ?? 0,
  };
  employees = existing
    ? employees.map((employee) => (Number(employee.id) === Number(state.user.id) ? { ...employee, ...record } : employee))
    : [record, ...employees];
}

async function apiFetch(path, options = {}) {
  if (!API_BASE) return null;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Telegram-Init-Data": tg?.initData || "",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `API ${response.status}`;
    try {
      const data = await response.json();
      message = data?.error || message;
    } catch (error) {
      try {
        message = await response.text();
      } catch {}
    }
    throw new Error(message);
  }

  return response.json();
}

async function loadRemoteData(options = {}) {
  if (!API_BASE) {
    state.user.hasAccess = true;
    ensureCurrentEmployee();
    return true;
  }

  try {
    const telegramId = state.user.telegramId || telegramUser?.id || state.user.id;
    const data = await apiFetch(`/api/bootstrap?telegram_id=${encodeURIComponent(telegramId)}&name=${encodeURIComponent(state.user.firstName)}&username=${encodeURIComponent(state.user.username)}`);
    if (!data) return;

    employees = withoutDeleted(data.employees || employees, "employees").map(normalizeEmployee);
    orders = mergeQueuedOrders(withoutDeleted(data.orders || [], "orders"));
    const remoteProps = withoutDeleted(data.props || [], "props");
    props = remoteProps.length ? remoteProps : props;
    const remotePrograms = withoutDeleted(data.programs || [], "programs");
    programs = remotePrograms.length ? remotePrograms : programs;
    state.acceptedOrders = data.acceptedOrders || state.acceptedOrders;
    state.bonuses = data.bonuses || state.bonuses;
    reports = data.reports || reports;
    state.promoCodes = data.promoCodes || state.promoCodes;
    state.ambassadorWithdrawals = data.ambassadorWithdrawals || state.ambassadorWithdrawals;
    applyCurrentUserAccess(data.currentUser);
    state.accessChecked = true;
    saveState();
    if (options.renderAfter !== false) render();
    return state.user.hasAccess;
  } catch (error) {
    console.warn("Bootstrap failed", error);
    state.accessChecked = true;
    const stillAllowed = Boolean(state.user.hasAccess);
    if (options.renderAfter !== false) {
      state.toast = "РќРµ СѓРґР°Р»РѕСЃСЊ РїСЂРѕРІРµСЂРёС‚СЊ РґРѕСЃС‚СѓРї";
      render();
      clearToastLater();
    }
    return stillAllowed;
  }
}

function normalizeEmployee(employee) {
  return {
    ...employee,
    telegramId: employee.telegramId ?? employee.telegram_id,
    isActive: employee.isActive ?? employee.is_active,
    ambassadorCode: employee.ambassadorCode ?? employee.ambassador_code ?? "",
    bunnyBalance: Number(employee.bunnyBalance ?? employee.bunny_balance ?? 0),
    bunnyPending: Number(employee.bunnyPending ?? employee.bunny_pending ?? 0),
  };
}

async function sendAction(action) {
  if (!API_BASE) {
    action.status = "local";
    saveState();
    return;
  }

  try {
    await apiFetch("/api/actions", {
      method: "POST",
      body: JSON.stringify(action),
    });
    action.status = "synced";
    delete action.error;
    state.syncQueue = state.syncQueue.filter((item) => item.id !== action.id);
    saveState();
    render();
  } catch (error) {
    console.warn("Action sync failed", action.type, error);
    action.error = shortError(error.message || "API");
    state.toast = `РћС€РёР±РєР° СЃРёРЅС…СЂРѕРЅРёР·Р°С†РёРё: ${action.error}`;
    action.status = "offline";
    saveState();
    render();
    clearToastLater();
  }
}

function shortError(message = "") {
  const text = String(message);
  if (text.includes("ambassador_code") || text.includes("BUNNY-")) return "РљРѕРґ Р°РјР±Р°СЃСЃР°РґРѕСЂР° СѓР¶Рµ РµСЃС‚СЊ РІ Р±Р°Р·Рµ";
  if (text.includes("duplicate key")) return "РўР°РєР°СЏ Р·Р°РїРёСЃСЊ СѓР¶Рµ РµСЃС‚СЊ РІ Р±Р°Р·Рµ";
  if (text.includes("violates unique constraint")) return "РќР°СЂСѓС€РµРЅР° СѓРЅРёРєР°Р»СЊРЅРѕСЃС‚СЊ Р·Р°РїРёСЃРё";
  return text.length > 120 ? `${text.slice(0, 120)}...` : text;
}

function cancelSyncAction(id) {
  state.syncQueue = state.syncQueue.filter((action) => Number(action.id) !== Number(id));
  saveState();
  state.toast = "РћРїРµСЂР°С†РёСЏ РѕС‚РјРµРЅРµРЅР°";
  render();
  clearToastLater();
}

function pendingActions() {
  return state.syncQueue.filter((action) => action.status !== "synced" && action.status !== "local");
}

function syncPendingActions() {
  if (!navigator.onLine || !API_BASE) return;
  pendingActions().forEach((action) => sendAction(action));
}

function withoutDeleted(items, type) {
  const deleted = new Set((state.deletedEntities[type] || []).map(String));
  return items.filter((item) => !deleted.has(String(item.id)));
}

function mergeQueuedOrders(remoteOrders) {
  const remoteIds = new Set(remoteOrders.map((order) => String(order.id)));
  const deleted = new Set((state.deletedEntities.orders || []).map(String));
  const queuedOrders = state.syncQueue
    .filter((action) => action.type === "create-order" && action.payload?.order)
    .map((action) => action.payload.order)
    .filter((order) => !remoteIds.has(String(order.id)) && !deleted.has(String(order.id)));

  return [...queuedOrders, ...remoteOrders];
}

function applyCurrentUserAccess(currentUser) {
  if (!currentUser) {
    state.user.hasAccess = false;
    if (state.route !== "auth-confirm") state.route = "denied";
    return;
  }

  if (currentUser.isActive === false) {
    state.user.hasAccess = false;
    if (state.route !== "auth-confirm") state.route = "denied";
    return;
  }

  state.user.id = currentUser.id ?? state.user.id;
  state.user.telegramId = currentUser.telegramId ?? state.user.telegramId ?? telegramUser?.id ?? state.user.id;
  state.user.firstName = currentUser.name || state.user.firstName;
  state.user.username = currentUser.username || state.user.username;
  state.user.role = ["admin", "ambassador"].includes(currentUser.role) ? currentUser.role : "actor";
  state.user.ambassadorCode = currentUser.ambassadorCode || "";
  state.user.bunnyBalance = Number(currentUser.bunnyBalance || 0);
  state.user.bunnyPending = Number(currentUser.bunnyPending || 0);
  state.user.hasAccess = true;
  ensureCurrentEmployee();
}

function rememberDeleted(type, id) {
  const current = new Set((state.deletedEntities[type] || []).map(String));
  current.add(String(id));
  state.deletedEntities[type] = [...current];
  saveState();
}

function confirmDelete(label = "СЌР»РµРјРµРЅС‚") {
  return window.confirm(`РўРѕС‡РЅРѕ СѓРґР°Р»РёС‚СЊ ${label}? Р­С‚Рѕ РґРµР№СЃС‚РІРёРµ РЅРµР»СЊР·СЏ РѕС‚РјРµРЅРёС‚СЊ.`);
}

function setRoute(route, options = {}) {
  Object.assign(state, options);
  state.route = route;
  render();
}

function setRole(role) {
  state.user.role = role;
  state.themeBurst = true;
  state.toast = `Р РµР¶РёРј: ${roleLabel(role)}`;
  render();
  window.setTimeout(() => {
    state.themeBurst = false;
    render();
  }, 900);
  clearToastLater();
}

function queueAction(type, payload) {
  const action = {
    id: Date.now(),
    type,
    payload,
    createdAt: new Date().toISOString(),
    status: navigator.onLine ? "ready" : "offline",
  };

  state.syncQueue.push(action);
  state.toast = actionToast(type);
  saveState();
  render();
  sendAction(action);
  clearToastLater();
}

function takeProp(propId) {
  props = props.map((item) => (item.id === propId ? { ...item, status: "mine", place: `РЈ ${state.user.firstName}` } : item));
  queueAction("take-prop", { propId, actorId: state.user.id });
}

function takeKit(orderId = state.activeOrderId) {
  const order = orders.find((item) => Number(item.id) === Number(orderId)) || getActiveOrder();
  const program = getProgramForOrder(order);
  const kitIds = new Set((state.programKits[String(program?.id)] || []).map(Number));
  const targetIds = kitIds.size ? kitIds : new Set(props.filter((item) => item.kit).map((item) => Number(item.id)));
  props = props.map((item) =>
    targetIds.has(Number(item.id)) ? { ...item, status: "mine", place: `РЈ ${state.user.firstName}` } : item
  );
  orders = orders.map((item) =>
    Number(item.id) === Number(orderId) ? { ...item, kitStatus: `РљРѕРјРїР»РµРєС‚ Сѓ ${state.user.firstName}` } : item
  );
  queueAction("take-kit", { orderId, actorId: state.user.id, propIds: [...targetIds] });
  state.toast = `РљРѕРјРїР»РµРєС‚ Сѓ ${state.user.firstName}`;
  saveState();
  render();
  clearToastLater();
}

function acceptedListForOrder(orderId) {
  const accepted = state.acceptedOrders[orderId];
  if (!accepted) return [];
  return Array.isArray(accepted) ? accepted : [accepted];
}

function acceptedByMeForOrder(orderId) {
  return acceptedListForOrder(orderId).some((accepted) => Number(accepted.actorId) === Number(state.user.id));
}

function orderActorLimit(order) {
  const match = String(order?.role || "").match(/(\d+)\s*Р°РєС‚РµСЂ/i);
  return match ? Number(match[1]) : 1;
}

function returnProp(propId) {
  props = props.map((item) => (item.id === propId ? { ...item, status: "available", place: "РЎРєР»Р°Рґ" } : item));
  queueAction("return-prop", { propId, actorId: state.user.id });
}

function acceptOrder(orderId) {
  const order = orders.find((item) => Number(item.id) === Number(orderId));
  const current = acceptedListForOrder(orderId);
  if (current.some((accepted) => Number(accepted.actorId) === Number(state.user.id))) return;
  if (current.length >= orderActorLimit(order)) {
    state.toast = "Р’СЃРµ РјРµСЃС‚Р° Р°РєС‚РµСЂРѕРІ СѓР¶Рµ Р·Р°РЅСЏС‚С‹";
    render();
    clearToastLater();
    return;
  }
  state.acceptedOrders[orderId] = [
    ...current,
    {
    actorId: state.user.id,
    name: state.user.firstName,
    acceptedAt: new Date().toISOString(),
    },
  ];
  employees = employees.map((employee) =>
    Number(employee.id) === Number(state.user.id)
      ? { ...employee, accepted: Number(employee.accepted || 0) + 1, efficiency: Math.min(100, Number(employee.efficiency || 0) + 5) }
      : employee
  );
  queueAction("accept-order", { orderId, actorId: state.user.id });
  state.toast = "Р—Р°РєР°Р· РїСЂРёРЅСЏС‚";
  saveState();
  render();
  clearToastLater();
}

function declineOrder(orderId) {
  const current = acceptedListForOrder(orderId);
  const wasAcceptedByMe = current.some((accepted) => Number(accepted.actorId) === Number(state.user.id));
  const next = current.filter((accepted) => Number(accepted.actorId) !== Number(state.user.id));
  if (next.length) {
    state.acceptedOrders[orderId] = next;
  } else {
    delete state.acceptedOrders[orderId];
  }
  if (wasAcceptedByMe) {
    employees = employees.map((employee) =>
      Number(employee.id) === Number(state.user.id)
        ? { ...employee, accepted: Math.max(0, Number(employee.accepted || 0) - 1), efficiency: Math.max(0, Number(employee.efficiency || 0) - 5) }
        : employee
    );
  }
  queueAction("decline-order", { orderId, actorId: state.user.id });
  state.toast = "Р’С‹ РѕС‚РєР°Р·Р°Р»РёСЃСЊ РѕС‚ Р·Р°РєР°Р·Р°";
  saveState();
  render();
  clearToastLater();
}

function actionToast(type) {
  return {
    "take-kit": "РљРѕРјРїР»РµРєС‚ РґРѕР±Р°РІР»РµРЅ РІ РѕС‡РµСЂРµРґСЊ",
    "take-prop": "Р РµРєРІРёР·РёС‚ Сѓ РІР°СЃ",
    "return-prop": "Р РµРєРІРёР·РёС‚ РІРѕР·РІСЂР°С‰РµРЅ",
    "accept-order": "Р—Р°РєР°Р· РїСЂРёРЅСЏС‚",
    "decline-order": "РћС‚РєР°Р· РѕС‚ Р·Р°РєР°Р·Р° СЃРѕС…СЂР°РЅРµРЅ",
    "create-order": "Р—Р°РєР°Р· РґРѕР±Р°РІР»РµРЅ",
    "create-bonus": "Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅР°СЏ РІС‹РїР»Р°С‚Р° РЅР°С‡РёСЃР»РµРЅР°",
    "create-promo": "РџСЂРѕРјРѕРєРѕРґ РґРѕР±Р°РІР»РµРЅ",
    "withdraw-bunny": "Р—Р°СЏРІРєР° РЅР° РІС‹РІРѕРґ РѕС‚РїСЂР°РІР»РµРЅР°",
    "update-ambassador": "Амбассадор обновлен",
    "update-order-pay": "Р—Р°СЂРїР»Р°С‚Р° СЃРєРѕСЂСЂРµРєС‚РёСЂРѕРІР°РЅР°",
    "delete-order-pay": "Р—Р°СЂРїР»Р°С‚Р° СѓРґР°Р»РµРЅР°",
    "annul-order": "РџСЂРёРЅСЏС‚РёРµ Р·Р°РєР°Р·Р° Р°РЅРЅСѓР»РёСЂРѕРІР°РЅРѕ",
    report: "РћС€РёР±РєР° РѕС‚РїСЂР°РІР»РµРЅР°",
  }[type] || "Р”РµР№СЃС‚РІРёРµ СЃРѕС…СЂР°РЅРµРЅРѕ";
}

function addEmployee() {
  const name = state.newEmployee.name.trim();
  if (!name) return;
  const role = state.newEmployee.isAdmin ? "admin" : state.newEmployee.isAmbassador ? "ambassador" : "actor";
  const ambassadorCode = role === "ambassador" ? (state.newEmployee.ambassadorCode.trim() || makeAmbassadorCode(state.newEmployee.username || name)) : "";
  employees = [
    ...employees,
    {
      id: Date.now(),
      name,
      role,
      username: state.newEmployee.username,
      ambassadorCode,
      bunnyBalance: 0,
      bunnyPending: 0,
      efficiency: 0,
      accepted: 0,
      late: 0,
      rating: 0,
    },
  ];
  queueAction("create-employee", { ...state.newEmployee, role, ambassadorCode });
  state.newEmployee = { name: "", username: "", isAdmin: false, isAmbassador: false, ambassadorCode: "" };
  setRoute("profile");
}

function addPromoCode() {
  const code = state.newPromo.code.trim().toUpperCase();
  const discount = Number(state.newPromo.discount || 0);
  if (!code || discount <= 0) return;
  const promo = {
    id: Date.now(),
    code,
    discount,
    description: state.newPromo.description.trim(),
    createdById: state.user.id,
    createdByName: state.user.firstName,
    createdAt: new Date().toISOString(),
    isActive: true,
  };
  state.promoCodes = [promo, ...state.promoCodes.filter((item) => item.code !== code)];
  queueAction("create-promo", promo);
  state.newPromo = { code: "", discount: "", description: "" };
  state.toast = "РџСЂРѕРјРѕРєРѕРґ РґРѕР±Р°РІР»РµРЅ";
  render();
  clearToastLater();
}

function findPromoCode(code) {
  const normalized = String(code || "").trim().toUpperCase();
  return state.promoCodes.find((item) => item.isActive !== false && String(item.code || "").toUpperCase() === normalized);
}

function applyDiscountCode() {
  const promo = findPromoCode(state.booking.promoCode);
  if (!promo) {
    state.toast = "РџСЂРѕРјРѕРєРѕРґ РЅРµ РЅР°Р№РґРµРЅ";
    render();
    clearToastLater();
    return;
  }
  state.booking.discount = Number(promo.discount || 0);
  state.toast = `РЎРєРёРґРєР° ${money(state.booking.discount)}`;
  render();
  clearToastLater();
}

function currentEmployee() {
  return employees.find((employee) => Number(employee.id) === Number(state.user.id));
}

function currentAmbassadorCode() {
  return state.user.ambassadorCode || currentEmployee()?.ambassadorCode || makeAmbassadorCode();
}

function ambassadorPointsForOrder(total) {
  return Math.round(Number(total || 0) / 10);
}

function canWithdrawBunny(date = new Date()) {
  const day = date.getDate();
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return day === 30 || day === 31 || day === lastDay;
}

function requestBunnyWithdraw() {
  const employee = currentEmployee();
  const balance = Number(employee?.bunnyBalance || state.user.bunnyBalance || 0);
  if (balance <= 0) {
    state.toast = "Р‘Р°Р»Р»РѕРІ РїРѕРєР° РЅРµС‚";
    render();
    clearToastLater();
    return;
  }
  if (!canWithdrawBunny()) {
    state.toast = "Р’С‹РІРѕРґ РґРѕСЃС‚СѓРїРµРЅ 30/31 С‡РёСЃР»Р°";
    render();
    clearToastLater();
    return;
  }
  const withdrawal = {
    id: Date.now(),
    ambassadorId: state.user.id,
    ambassadorName: state.user.firstName,
    amount: balance,
    status: "sent",
    createdAt: new Date().toISOString(),
  };
  state.ambassadorWithdrawals = [withdrawal, ...state.ambassadorWithdrawals];
  employees = employees.map((item) =>
    Number(item.id) === Number(state.user.id) ? { ...item, bunnyBalance: 0, bunnyPending: Number(item.bunnyPending || 0) + balance } : item
  );
  state.user.bunnyBalance = 0;
  state.user.bunnyPending = Number(state.user.bunnyPending || 0) + balance;
  queueAction("withdraw-bunny", withdrawal);
  state.toast = "Р—Р°СЏРІРєР° РЅР° РІС‹РІРѕРґ РѕС‚РїСЂР°РІР»РµРЅР°";
  render();
  clearToastLater();
}

function updateAmbassadorDraft(id, field, value) {
  employees = employees.map((employee) =>
    Number(employee.id) === Number(id)
      ? {
          ...employee,
          [field]: field === "bunnyBalance" || field === "bunnyPending" ? Number(value || 0) : value,
        }
      : employee
  );
}

function saveAmbassador(id) {
  const ambassador = employees.find((employee) => Number(employee.id) === Number(id));
  if (!ambassador) return;
  const payload = {
    id: ambassador.id,
    name: ambassador.name,
    username: ambassador.username || "",
    ambassadorCode: String(ambassador.ambassadorCode || "").trim(),
    bunnyBalance: Number(ambassador.bunnyBalance || 0),
    bunnyPending: Number(ambassador.bunnyPending || 0),
  };
  queueAction("update-ambassador", payload);
  if (Number(state.user.id) === Number(id)) {
    state.user.ambassadorCode = payload.ambassadorCode;
    state.user.bunnyBalance = payload.bunnyBalance;
    state.user.bunnyPending = payload.bunnyPending;
  }
  state.toast = "Амбассадор обновлен";
  render();
  clearToastLater();
}

function addProgram() {
  const title = state.newProgram.title.trim();
  if (!title) return;
  const id = Date.now();
  programs = [
    ...programs,
    {
      id,
      title,
      age: state.newProgram.age,
      duration: state.newProgram.duration,
      pricePerHour: Number(state.newProgram.pricePerHour || 0),
      actorPayPerHour: Number(state.newProgram.actorPayPerHour || 0),
      driveUrl: state.newProgram.driveUrl,
      script: state.newProgram.script,
      tracks: [],
    },
  ];
  if (state.programKits.draft?.length) {
    state.programKits[id] = state.programKits.draft;
    delete state.programKits.draft;
  }
  queueAction("create-program", { ...state.newProgram, id, kitPropIds: state.programKits[id] || [] });
  queueAction("save-program-kit", { programId: id, propIds: state.programKits[id] || [] });
  state.newProgram = { title: "", driveUrl: "", script: "", age: "", duration: "", pricePerHour: 0, actorPayPerHour: 0 };
  state.kitBuilderProgramId = null;
  setRoute("programs");
}

function addProp() {
  const name = state.newProp.name.trim();
  if (!name) return;
  props = [
    ...props,
    {
      id: Date.now(),
      name,
      status: state.newProp.status,
      place: state.newProp.place || "РЎРєР»Р°Рґ",
      kit: Boolean(state.newProp.kit),
    },
  ];
  queueAction("create-prop", { ...state.newProp });
  state.newProp = { name: "", place: "РЎРєР»Р°Рґ", status: "available", kit: true };
  setRoute("props");
}

function addBonus(options = {}) {
  if (!state.newBonus.employeeId || Number(state.newBonus.amount || 0) <= 0) return;
  const employee = employees.find((item) => String(item.id) === String(state.newBonus.employeeId));
  const bonus = {
    id: Date.now(),
    employeeId: Number(state.newBonus.employeeId),
    employeeName: employee?.name || "",
    amount: Number(state.newBonus.amount || 0),
    comment: state.newBonus.comment,
    createdById: state.user.id,
    createdByName: state.user.firstName,
    createdAt: new Date().toISOString(),
  };
  state.bonuses = [bonus, ...state.bonuses];
  queueAction("create-bonus", bonus);
  state.newBonus = { employeeId: "", amount: "", comment: "" };
  if (options.redirect !== false) setRoute("admin-employees");
}

function updateBonusAmount(id, amount) {
  state.bonuses = state.bonuses.map((bonus) => (Number(bonus.id) === Number(id) ? { ...bonus, amount: Number(amount || 0) } : bonus));
  saveState();
}

function deleteBonus(id) {
  state.bonuses = state.bonuses.filter((bonus) => Number(bonus.id) !== Number(id));
  queueAction("delete-bonus", { id });
}

function employeeOptions() {
  const list = employees.length ? employees : [{ id: state.user.id, name: state.user.firstName }];
  return list
    .map((employee) => `<option value="${employee.id}" ${String(state.newBonus.employeeId) === String(employee.id) ? "selected" : ""}>${employee.name}</option>`)
    .join("");
}

function addEditableExtra() {
  const title = state.extraDraft.trim();
  if (!title) return;
  const price = Number(state.extraDraftPrice || 0);
  editableExtras = [...editableExtras.filter((item) => item.title !== title), { title, price }];
  localStorage.setItem("editableExtras", JSON.stringify(editableExtras));
  state.extraDraft = "";
  state.extraDraftPrice = "";
  render();
}

function removeEditableExtra(title) {
  editableExtras = editableExtras.filter((item) => item.title !== title);
  state.booking.extras = state.booking.extras.filter((item) => item !== `extra:${title}`);
  localStorage.setItem("editableExtras", JSON.stringify(editableExtras));
  render();
}

function updateEditableExtraPrice(title, price) {
  editableExtras = editableExtras.map((item) => (item.title === title ? { ...item, price: Number(price || 0) } : item));
  localStorage.setItem("editableExtras", JSON.stringify(editableExtras));
}

function currentKitKey() {
  return String(state.kitBuilderProgramId || "draft");
}

function toggleProgramKitProp(propId) {
  const key = currentKitKey();
  const current = new Set((state.programKits[key] || []).map(Number));
  current.has(propId) ? current.delete(propId) : current.add(propId);
  state.programKits[key] = [...current];
  saveState();
  render();
}

function saveProgramKit() {
  const key = currentKitKey();
  queueAction("save-program-kit", { programId: key, propIds: state.programKits[key] || [] });
  state.toast = "РљРѕРјРїР»РµРєС‚ РїСЂРѕРіСЂР°РјРјС‹ СЃРѕС…СЂР°РЅРµРЅ";
  const returnRoute = state.kitBuilderReturnRoute;
  state.kitBuilderProgramId = null;
  state.kitBuilderReturnRoute = "";
  state.propEditMode = false;
  if (returnRoute) {
    setRoute(returnRoute);
  } else {
    render();
  }
  clearToastLater();
}

function deleteEmployee(id) {
  employees = employees.filter((employee) => employee.id !== id);
  rememberDeleted("employees", id);
  queueAction("delete-employee", { id });
}

function deleteOrder(id) {
  orders = orders.filter((order) => order.id !== id);
  delete state.acceptedOrders[id];
  rememberDeleted("orders", id);
  queueAction("delete-order", { id });
  setRoute(state.user.role === "ambassador" ? "profile" : "orders");
}

function annulOrder(orderId) {
  const accepted = state.acceptedOrders[orderId];
  if (!accepted) return;
  delete state.acceptedOrders[orderId];
  employees = employees.map((employee) =>
    Number(employee.id) === Number(accepted.actorId)
      ? { ...employee, accepted: Math.max(0, Number(employee.accepted || 0) - 1), efficiency: Math.max(0, Number(employee.efficiency || 0) - 5) }
      : employee
  );
  queueAction("decline-order", { orderId, actorId: accepted.actorId });
  state.toast = "РџСЂРёРЅСЏС‚РёРµ Р·Р°РєР°Р·Р° Р°РЅРЅСѓР»РёСЂРѕРІР°РЅРѕ";
  saveState();
  render();
  clearToastLater();
}

function updateOrderPay(orderId, value) {
  orders = orders.map((order) => (Number(order.id) === Number(orderId) ? { ...order, actorPay: Number(value || 0) } : order));
  saveState();
}

function deleteOrderPay(orderId) {
  updateOrderPay(orderId, 0);
  queueAction("delete-order-pay", { orderId });
  state.toast = "Р—Р°СЂРїР»Р°С‚Р° РїРѕ Р·Р°РєР°Р·Сѓ СѓРґР°Р»РµРЅР°";
  render();
  clearToastLater();
}

function adjustEmployeeAccepted(employeeId, delta) {
  employees = employees.map((employee) =>
    Number(employee.id) === Number(employeeId)
      ? { ...employee, accepted: Math.max(0, Number(employee.accepted || 0) + delta), efficiency: Math.max(0, Math.min(100, Number(employee.efficiency || 0) + delta * 5)) }
      : employee
  );
  queueAction("update-employee-stats", { employeeId, delta });
}

function deleteProgram(id) {
  programs = programs.filter((program) => program.id !== id);
  rememberDeleted("programs", id);
  queueAction("delete-program", { id });
}

function updateProgramField(programId, field, value) {
  programs = programs.map((program) => (Number(program.id) === Number(programId) ? { ...program, [field]: value } : program));
  saveState();
}

function saveProgramChanges(programId) {
  const program = programs.find((item) => Number(item.id) === Number(programId));
  if (!program) return;
  queueAction("update-program", program);
  state.toast = "РџСЂРѕРіСЂР°РјРјР° РѕР±РЅРѕРІР»РµРЅР°";
  render();
  clearToastLater();
}

function deleteProp(id) {
  props = props.filter((item) => item.id !== id);
  rememberDeleted("props", id);
  queueAction("delete-prop", { id });
}

function createOrder() {
  const calc = calculateBooking();
  if (!calc.program) {
    state.toast = "РЎРЅР°С‡Р°Р»Р° РґРѕР±Р°РІСЊС‚Рµ РїСЂРѕРіСЂР°РјРјСѓ";
    render();
    clearToastLater();
    return;
  }
  const id = Date.now();
  const order = {
    id,
    title: calc.program.title,
    date: formatUiDate(state.booking.date),
    time: state.booking.start,
    address: state.booking.address || "РђРґСЂРµСЃ РЅРµ СѓРєР°Р·Р°РЅ",
    role: state.booking.package,
    actors: [state.user.firstName],
    programId: calc.program.id,
    promoCode: state.booking.promoCode || "",
    ambassadorCode: state.user.role === "ambassador" ? (state.booking.ambassadorCode || currentAmbassadorCode()) : "",
    status: "РќРѕРІС‹Р№",
    kitStatus: "РљРѕРјРїР»РµРєС‚ РЅРµ РІР·СЏС‚",
    available: "РџСЂРѕРІРµСЂСЏРµС‚СЃСЏ",
  };
  order.total = calc.orderTotal;
  order.actorPay = calc.actorTotal;
  order.ambassadorBunny = order.ambassadorCode ? ambassadorPointsForOrder(order.total) : 0;
  orders = [order, ...orders];
  if (order.ambassadorBunny > 0) {
    const ambassadorCode = order.ambassadorCode;
    const ambassador = employees.find((employee) => String(employee.ambassadorCode || "").toUpperCase() === String(ambassadorCode).toUpperCase());
    employees = employees.map((employee) =>
      Number(employee.id) === Number(ambassador?.id || (state.user.role === "ambassador" ? state.user.id : 0))
        ? { ...employee, bunnyBalance: Number(employee.bunnyBalance || 0) + order.ambassadorBunny, ambassadorCode }
        : employee
    );
    if (state.user.role === "ambassador") {
      state.user.bunnyBalance = Number(state.user.bunnyBalance || 0) + order.ambassadorBunny;
      state.user.ambassadorCode = ambassadorCode;
    }
  }
  state.orderFilter = "month";
  queueAction("create-order", { ...state.booking, order, actorId: state.user.id });
  if (state.newBonus.employeeId && Number(state.newBonus.amount || 0) > 0) {
    addBonus({ redirect: false });
  }
  state.toast = "Р—Р°РєР°Р· РґРѕР±Р°РІР»РµРЅ";
  setRoute("orders");
  clearToastLater();
}

function formatUiDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}.${month}.${year}`;
}

function sendReport() {
  const text = state.reportText.trim();
  if (!text) return;
  const report = {
    id: Date.now(),
    actorName: state.user.firstName,
    text,
    createdAt: new Date().toLocaleString("ru-RU"),
    status: "new",
  };
  reports = [report, ...reports];
  queueAction("report", { text, actorId: state.user.id, actorName: state.user.firstName, route: state.route });
  state.reportText = "";
  setRoute(state.user.hasAccess ? "profile" : "denied");
}

function deleteReport(id) {
  reports = reports.filter((report) => String(report.id) !== String(id));
  queueAction("delete-report", { id });
}

function saveForTrip(orderId) {
  if (!state.saved.includes(orderId)) {
    state.saved.push(orderId);
    saveState();
  }
  state.toast = "РЎРѕС…СЂР°РЅРµРЅРѕ РґР»СЏ РІС‹РµР·РґР°";
  setRoute("saved");
  clearToastLater();
}

function getActiveOrder() {
  return orders.find((order) => order.id === state.activeOrderId) || orders[0];
}

function getProgramForOrder(order) {
  return programs.find((program) => Number(program.id) === Number(order?.programId)) || programs.find((program) => program.title === order?.title) || programs[0];
}

function getBookingProgram() {
  return programs.find((program) => program.id === Number(state.booking.programId)) || programs[0] || null;
}

function calculateBooking() {
  const program = getBookingProgram();
  const selectedPackage = packageOptions.find((item) => item.label === state.booking.package) || packageOptions[1];
  const packageIndex = Math.max(0, packageOptions.findIndex((item) => item.label === selectedPackage.label));
  const ratePerFive = packageRates[packageIndex] ?? 0;
  const durationMinutes = Math.max(0, timeToMinutes(state.booking.end) - timeToMinutes(state.booking.start));
  const billableSteps = Math.ceil(durationMinutes / 5);
  const actorHours = durationMinutes / 60;
  const extrasTotal = (state.booking.extras || []).reduce((sum, value) => {
    const title = String(value).replace(/^extra:/, "");
    const item = editableExtras.find((extra) => extra.title === title);
    return sum + Number(item?.price || 0);
  }, 0);
  const promo = findPromoCode(state.booking.promoCode);
  const discount = Number(state.booking.discount || promo?.discount || 0);
  const orderTotal = Math.max(0, Math.round(ratePerFive * billableSteps + extrasTotal - discount));
  const actorTotal = Math.round(actorHours * 1000 * Number(selectedPackage.actors || 0));
  return {
    program,
    selectedPackage,
    ratePerFive,
    durationMinutes,
    orderTotal,
    actorTotal,
    agencyTotal: orderTotal - actorTotal,
  };
}

function timeToMinutes(value) {
  const [hours, minutes] = String(value || "00:00").split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

function minutesToTime(value) {
  const normalized = Math.max(0, Math.min(23 * 60 + 45, value));
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function adjustBookingTime(field, delta) {
  const next = timeToMinutes(state.booking[field]) + delta;
  state.booking[field] = minutesToTime(next);

  const start = timeToMinutes(state.booking.start);
  const end = timeToMinutes(state.booking.end);
  if (field === "start" && start >= end) {
    state.booking.end = minutesToTime(start + 60);
  }
  if (field === "end" && end <= start) {
    state.booking.start = minutesToTime(end - 60);
  }
}

function employeeEarnings(employeeId, period = state.earningsPeriod) {
  const now = startOfDay(new Date());
  const maxDays = period === "week" ? 7 : period === "month" ? 31 : 366;
  const orderIncome = orders.reduce((sum, order) => {
    const byEmployee = acceptedListForOrder(order.id).some((accepted) => Number(accepted.actorId) === Number(employeeId));
    const date = parseUiDate(order.date);
    if (!byEmployee || !date) return sum;
    const diffDays = (startOfDay(date) - now) / 86400000;
    if (diffDays < -maxDays || diffDays > maxDays) return sum;
    return sum + Number(order.actorPay || 0);
  }, 0);
  const bonusIncome = state.bonuses.reduce((sum, bonus) => {
    if (Number(bonus.employeeId) !== Number(employeeId)) return sum;
    const date = bonus.createdAt ? new Date(bonus.createdAt) : now;
    const diffDays = (startOfDay(date) - now) / 86400000;
    if (diffDays < -maxDays || diffDays > maxDays) return sum;
    return sum + Number(bonus.amount || 0);
  }, 0);
  return orderIncome + bonusIncome;
}

function userEarnings(period = state.earningsPeriod) {
  return employeeEarnings(state.user.id, period);
}

function acceptedOrdersForCurrentUser() {
  return orders.filter((order) => acceptedListForOrder(order.id).some((accepted) => Number(accepted.actorId) === Number(state.user.id)));
}

function acceptedOrdersForEmployee(employeeId) {
  return orders.filter((order) => acceptedListForOrder(order.id).some((accepted) => Number(accepted.actorId) === Number(employeeId)));
}

function bonusesForEmployee(employeeId) {
  return state.bonuses.filter((bonus) => Number(bonus.employeeId) === Number(employeeId));
}

function setEmployeeTotal(employeeId, targetTotal) {
  const employee = employees.find((item) => Number(item.id) === Number(employeeId));
  const current = employeeEarnings(employeeId);
  const delta = Number(targetTotal || 0) - current;
  if (!employee || !delta) return;
  const bonus = {
    id: Date.now(),
    employeeId: Number(employeeId),
    employeeName: employee.name,
    amount: delta,
    comment: "РљРѕСЂСЂРµРєС‚РёСЂРѕРІРєР° РѕР±С‰РµР№ СЃСѓРјРјС‹",
    createdById: state.user.id,
    createdByName: state.user.firstName,
    createdAt: new Date().toISOString(),
  };
  state.bonuses = [bonus, ...state.bonuses];
  queueAction("create-bonus", bonus);
}

function monthlyAcceptedCount(employeeId) {
  const now = new Date();
  return Object.values(state.acceptedOrders).flatMap((accepted) => (Array.isArray(accepted) ? accepted : [accepted])).filter((accepted) => {
    if (Number(accepted.actorId) !== Number(employeeId)) return false;
    const date = accepted.acceptedAt ? new Date(accepted.acceptedAt) : null;
    return date && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;
}

function filteredOrders() {
  const now = new Date();
  const maxDays = state.orderFilter === "week" ? 7 : state.orderFilter === "month" ? 31 : null;

  return orders.filter((order) => {
    const date = parseUiDate(order.date);
    const isPast = date ? startOfDay(date) < startOfDay(now) : false;

    if (state.orderFilter === "past") return isPast;
    if (isPast) return false;

    if (state.orderFilter === "mine" && !order.actors?.includes(state.user.firstName)) {
      return state.user.role === "admin";
    }

    if (!maxDays) return true;

    if (!date) return true;
    const diffDays = (date - startOfDay(now)) / 86400000;
    return diffDays >= 0 && diffDays <= maxDays;
  });
}

function normalizeSearch(value) {
  return String(value || "").trim().toLowerCase();
}

function propCellNumber(item) {
  const match = String(item.place || "").match(/СЏС‡РµР№РєР°\s*([^\s,.;]+)/i);
  return match?.[1] || "";
}

function propCellOptions() {
  const cells = [...new Set(props.map(propCellNumber).filter(Boolean))];
  return cells.sort((a, b) => {
    const numberA = Number(a);
    const numberB = Number(b);
    if (!Number.isNaN(numberA) && !Number.isNaN(numberB)) return numberA - numberB;
    return a.localeCompare(b, "ru");
  });
}

function filteredProps() {
  const query = normalizeSearch(state.propSearch);
  return props.filter((item) => {
    const statusOk = state.filter === "all" || item.status === state.filter;
    const cell = propCellNumber(item);
    const cellOk = state.propCellFilter === "all" || cell === state.propCellFilter;
    const text = normalizeSearch(`${item.name} ${item.place}`);
    const searchOk = !query || text.includes(query);
    return statusOk && cellOk && searchOk;
  });
}

function parseUiDate(value) {
  if (!value) return null;
  if (value.includes("-")) return new Date(`${value}T00:00:00`);
  const [day, month, year] = value.split(".");
  if (!day || !month || !year) return null;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function appFrame(content, nav = false) {
  ensureCurrentEmployee();
  return `
    <main class="phone ${state.appTheme === "dark" ? "admin-mode dark-theme" : "actor-theme light-theme"}">
      <section class="screen${nav ? " with-nav" : ""}">
        ${content}
      </section>
      ${state.themeBurst ? `<div class="theme-burst"></div>` : ""}
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
      ${nav ? tabbar() : ""}
    </main>
  `;
}

function clearToastLater() {
  window.clearTimeout(clearToastLater.timer);
  clearToastLater.timer = window.setTimeout(() => {
    state.toast = "";
    render();
  }, 1500);
}

function tabbar() {
  const tabs =
    state.user.role === "admin"
      ? [
          ["home", "РЎРµРіРѕРґРЅСЏ"],
          ["admin", "РђРґРјРёРЅ"],
          ["orders", "Р—Р°РєР°Р·С‹"],
          ["programs", "РџСЂРѕРіСЂР°РјРјС‹"],
          ["props", "Р РµРєРІРёР·РёС‚"],
          ["saved", "РЎРѕС…СЂР°РЅРµРЅРѕ"],
        ]
      : state.user.role === "ambassador"
        ? [
            ["home", "РЎРµРіРѕРґРЅСЏ"],
            ["new-order", "Р—Р°РєР°Р·"],
            ["profile", "РџСЂРѕС„РёР»СЊ"],
          ]
        : [
          ["home", "РЎРµРіРѕРґРЅСЏ"],
          ["orders", "Р—Р°РєР°Р·С‹"],
          ["programs", "РџСЂРѕРіСЂР°РјРјС‹"],
          ["props", "Р РµРєРІРёР·РёС‚"],
          ["saved", "РЎРѕС…СЂР°РЅРµРЅРѕ"],
        ];

  return `
    <nav class="tabbar">
      ${tabs
        .map(
          ([route, label]) => `
            <button class="${state.route === route ? "active" : ""}" data-route="${route}">
              ${label}
            </button>
          `
        )
        .join("")}
    </nav>
  `;
}

function syncPill() {
  const pending = pendingActions().length;
  const text = pending ? `Рє РѕС‚РїСЂР°РІРєРµ: ${pending}` : "РІСЃРµ СЃРёРЅС…СЂРѕРЅРёР·РёСЂРѕРІР°РЅРѕ";
  return `<div class="sync-cluster"><button class="status-pill sync-pill-button ${pending ? "glow" : ""}" data-route="sync">${text}</button><button class="version-pill ${state.versionGlow ? "glow" : ""}" data-route="version">v${APP_VERSION}</button><button class="help-pill glow" data-route="help">РљР°Рє РїРѕР»СЊР·РѕРІР°С‚СЊСЃСЏ</button></div>`;
}

function money(value) {
  return `${Number(value).toLocaleString("ru-RU")} в‚Ѕ`;
}

function checkingScreen() {
  if (!state.accessLoading) {
    state.accessLoading = true;
    Promise.all([
      loadRemoteData({ renderAfter: false }),
      new Promise((resolve) => window.setTimeout(resolve, 700)),
    ]).then(([hasAccess]) => {
      state.accessLoading = false;
      if (state.route === "checking") {
        setRoute(hasAccess ? "home" : "denied", { justAuthorized: Boolean(hasAccess) });
      }
    });
  }

  return appFrame(`
    <div class="brand-card">
      <img class="asset asset-triangle" src="./assets/hero-triangle.svg" alt="" />
      <img class="brand-logo" src="./assets/logo.svg" alt="РўРѕС‡РєР° РїСЂР°Р·РґРЅРёРєР°" />
      <div class="loading-ring"></div>
    </div>
    <p class="loading-note">РџСЂРѕРІРµСЂСЏРµРј РґРѕСЃС‚СѓРї...</p>
  `);
}

function authConfirmScreen() {
  return appFrame(`
    <div class="auth-card">
      <img class="brand-logo auth-logo" src="./assets/logo.svg" alt="РўРѕС‡РєР° РїСЂР°Р·РґРЅРёРєР°" />
      <div class="auth-telegram">TG</div>
      <h1 class="page-title">РџРѕРґС‚РІРµСЂРґРёС‚Рµ РІС…РѕРґ</h1>
      <p class="small-text">РџСЂРёР»РѕР¶РµРЅРёРµ РїРѕР»СѓС‡РёС‚ РІР°С€Рµ РёРјСЏ, Telegram ID Рё username, С‡С‚РѕР±С‹ РїСЂРѕРІРµСЂРёС‚СЊ РґРѕСЃС‚СѓРї СЃРѕС‚СЂСѓРґРЅРёРєР°.</p>
      <button class="primary-button" data-action="confirm-auth">Р Р°Р·СЂРµС€РёС‚СЊ Рё РІРѕР№С‚Рё</button>
      <button class="ghost-link" data-action="deny-auth">РћС‚РјРµРЅР°</button>
    </div>
  `);
}

function deniedScreen() {
  return appFrame(`
    <div class="tiny-pill access-code">404</div>
    <div class="access-card">
      <img class="asset asset-cross" src="./assets/access-cross.svg" alt="" />
      <h1 class="page-title">Р”РѕСЃС‚СѓРї РЅРµ РЅР°Р№РґРµРЅ</h1>
      <p class="small-text">Р’Р°СЃ РїРѕРєР° РЅРµС‚ РІ СЃРїРёСЃРєРµ СЃРѕС‚СЂСѓРґРЅРёРєРѕРІ. РћР±СЂР°С‚РёС‚РµСЃСЊ Рє Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂСѓ.</p>
      <div class="notice" style="margin-top: 10px">
        Telegram ID: ${state.user.telegramId || telegramUser?.id || state.user.id}<br>
        Username: @${state.user.username || "РЅРµ СѓРєР°Р·Р°РЅ"}
      </div>
      <button class="primary-button" data-action="contact-admin">РќР°РїРёСЃР°С‚СЊ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂСѓ</button>
      <button class="ghost-link" data-route="checking">РћР±РЅРѕРІРёС‚СЊ РґРѕСЃС‚СѓРї</button>
    </div>
    <div class="footer-brand">РўРѕС‡РєР° РїСЂР°Р·РґРЅРёРєР°<span>РїСЂРѕРµРєС‚ Р‘Р°РЅРЅРё Р‘РѕРЅ</span></div>
  `);
}

function versionScreen() {
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-action="close-version">вЂ№</button>
      <span class="version-pill static-version-pill">v${APP_VERSION}</span>
    </div>
    <h1 class="page-title">Р’РµСЂСЃРёСЏ</h1>
    <div class="content-stack">
      <section class="panel version-panel">
        <h2 class="panel-title">v${APP_VERSION}</h2>
        <p class="small-text">РСЃС‚РѕСЂРёСЏ РїРѕСЃР»РµРґРЅРёС… РёР·РјРµРЅРµРЅРёР№ РїСЂРёР»РѕР¶РµРЅРёСЏ.</p>
      </section>
      <section class="panel">
        <h2 class="panel-title">Р§С‚Рѕ РёР·РјРµРЅРёР»РѕСЃСЊ</h2>
        <div class="orders-stack">
          ${releaseNotes.map((note) => `<div class="notice">${note}</div>`).join("")}
        </div>
      </section>
      <button class="primary-button" data-action="close-version">Р—Р°РєСЂС‹С‚СЊ</button>
    </div>
  `, true);
}

function openVersionScreen() {
  state.previousRoute = state.route === "version" ? state.previousRoute || "home" : state.route;
  setRoute("version");
}

function helpScreen() {
  const actorGuide = [
    ["РџСЂРёРЅСЏС‚СЊ Р·Р°РєР°Р·", "РћС‚РєСЂРѕР№С‚Рµ Р—Р°РєР°Р·С‹, РІС‹Р±РµСЂРёС‚Рµ Р°РєС‚СѓР°Р»СЊРЅС‹Р№ Р·Р°РєР°Р· Рё РЅР°Р¶РјРёС‚Рµ РџСЂРёРЅСЏС‚СЊ. Р•СЃР»Рё РјРµСЃС‚ СѓР¶Рµ РЅРµС‚, РєРЅРѕРїРєР° РїСЂРёРЅСЏС‚РёСЏ СЃС‚Р°РЅРµС‚ РЅРµРґРѕСЃС‚СѓРїРЅРѕР№."],
    ["РћС‚РєР°Р·Р°С‚СЊСЃСЏ РѕС‚ Р·Р°РєР°Р·Р°", "РћС‚РєСЂРѕР№С‚Рµ РїСЂРёРЅСЏС‚С‹Р№ Р·Р°РєР°Р· Рё РЅР°Р¶РјРёС‚Рµ РћС‚РєР°Р·Р°С‚СЊСЃСЏ. Р—Р°РєР°Р· СѓР№РґРµС‚ РёР· РІР°С€РёС… РїСЂРёРЅСЏС‚С‹С…, Р° РЅР°С‡РёСЃР»РµРЅРёРµ РїРѕ РЅРµРјСѓ РїРµСЂРµСЃС‡РёС‚Р°РµС‚СЃСЏ."],
    ["Р’Р·СЏС‚СЊ СЂРµРєРІРёР·РёС‚", "РџРµСЂРµР№РґРёС‚Рµ РІ Р РµРєРІРёР·РёС‚ РёР»Рё РѕС‚РєСЂРѕР№С‚Рµ РєРѕРјРїР»РµРєС‚ РїСЂРѕРіСЂР°РјРјС‹. РќР°Р¶РјРёС‚Рµ Р’Р·СЏС‚СЊ, Рё СЂРµРєРІРёР·РёС‚ СЃСЂР°Р·Сѓ Р·Р°РєСЂРµРїРёС‚СЃСЏ Р·Р° РІР°РјРё, РґР°Р¶Рµ РµСЃР»Рё РІС‹ РѕС„Р»Р°Р№РЅ."],
    ["Р’РµСЂРЅСѓС‚СЊ СЂРµРєРІРёР·РёС‚", "РћС‚РєСЂРѕР№С‚Рµ Р РµРєРІРёР·РёС‚, РЅР°Р№РґРёС‚Рµ РїСЂРµРґРјРµС‚ СЃРѕ СЃС‚Р°С‚СѓСЃРѕРј РЈ РјРµРЅСЏ Рё РЅР°Р¶РјРёС‚Рµ Р’РµСЂРЅСѓС‚СЊ. РџРѕСЃР»Рµ СЃРёРЅС…СЂРѕРЅРёР·Р°С†РёРё РѕС‚РјРµС‚РєР° СѓР№РґРµС‚ РІ Р±Р°Р·Сѓ."],
    ["РџСЂРѕРіСЂР°РјРјС‹", "Р’Рѕ РІРєР»Р°РґРєРµ РџСЂРѕРіСЂР°РјРјС‹ РѕС‚РєСЂРѕР№С‚Рµ РЅСѓР¶РЅСѓСЋ РїСЂРѕРіСЂР°РјРјСѓ, СЃРјРѕС‚СЂРёС‚Рµ СЃС†РµРЅР°СЂРёР№, СЃСЃС‹Р»РєСѓ РЅР° РґРёСЃРє Рё РєРѕРјРїР»РµРєС‚ СЂРµРєРІРёР·РёС‚Р°."],
    ["РџСЂРѕС„РёР»СЊ", "Р’ РїСЂРѕС„РёР»Рµ РІРёРґРЅС‹ РїСЂРёРЅСЏС‚С‹Рµ Р·Р°РєР°Р·С‹, Р·Р°СЂР°Р±РѕС‚РѕРє Р·Р° РїРµСЂРёРѕРґ, СЌС„С„РµРєС‚РёРІРЅРѕСЃС‚СЊ Рё СЂРµРєРІРёР·РёС‚, Р·Р°РєСЂРµРїР»РµРЅРЅС‹Р№ Р·Р° РІР°РјРё."],
    ["РћС€РёР±РєР°", "Р•СЃР»Рё С‡С‚Рѕ-С‚Рѕ СЂР°Р±РѕС‚Р°РµС‚ РЅРµ С‚Р°Рє, РЅР°Р¶РјРёС‚Рµ РЎРѕРѕР±С‰РёС‚СЊ РѕР± РѕС€РёР±РєРµ. РЎРѕРѕР±С‰РµРЅРёРµ СЃРѕС…СЂР°РЅРёС‚СЃСЏ Рё РїРѕРїР°РґРµС‚ Р°РґРјРёРЅСѓ РїРѕСЃР»Рµ СЃРёРЅС…СЂРѕРЅРёР·Р°С†РёРё."],
  ];
  const adminGuide = [
    ["Р”РѕР±Р°РІРёС‚СЊ Р·Р°РєР°Р·", "Р’Рѕ РІРєР»Р°РґРєРµ РђРґРјРёРЅ РЅР°Р¶РјРёС‚Рµ Р”РѕР±Р°РІРёС‚СЊ Р·Р°РєР°Р·: РІС‹Р±РµСЂРёС‚Рµ РєР»РёРµРЅС‚Р°, РґР°С‚Сѓ, РІСЂРµРјСЏ, РїСЂРѕРіСЂР°РјРјСѓ, СЃРѕСЃС‚Р°РІ, РґРѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹Рµ РїСѓРЅРєС‚С‹ Рё СЃРѕР·РґР°Р№С‚Рµ Р·Р°РєР°Р·."],
    ["РЎРѕС‚СЂСѓРґРЅРёРєРё", "Р’Рѕ РІРєР»Р°РґРєРµ РђРґРјРёРЅ РґРѕР±Р°РІСЊС‚Рµ СЃРѕС‚СЂСѓРґРЅРёРєР°. РџРѕ СѓРјРѕР»С‡Р°РЅРёСЋ РѕРЅ Р°РєС‚РµСЂ, Р° РїРµСЂРµРєР»СЋС‡Р°С‚РµР»СЊ РґР°РµС‚ РґРѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹Рµ С„СѓРЅРєС†РёРё Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂР°."],
    ["РџСЂРёРЅСЏС‚РёРµ Р·Р°РєР°Р·РѕРІ", "РђРґРјРёРЅ С‚РѕР¶Рµ РјРѕР¶РµС‚ РїСЂРёРЅРёРјР°С‚СЊ Р·Р°РєР°Р·С‹. Р’ РєР°СЂС‚РѕС‡РєРµ Р·Р°РєР°Р·Р° РІРёРґРЅРѕ, РєС‚Рѕ СѓР¶Рµ РїСЂРёРЅСЏР» Р·Р°РєР°Р· Рё СЃРєРѕР»СЊРєРѕ РјРµСЃС‚ РѕСЃС‚Р°Р»РѕСЃСЊ."],
    ["РџСЂРѕРіСЂР°РјРјС‹", "Р”РѕР±Р°РІР»СЏР№С‚Рµ РїСЂРѕРіСЂР°РјРјСѓ, СЃСЃС‹Р»РєСѓ РЅР° РґРёСЃРє Рё РїРѕР»РЅС‹Р№ СЃС†РµРЅР°СЂРёР№. Р§РµСЂРµР· РЎРѕР±СЂР°С‚СЊ РєРѕРјРїР»РµРєС‚ Р·Р°РєСЂРµРїР»СЏР№С‚Рµ РЅСѓР¶РЅС‹Р№ СЂРµРєРІРёР·РёС‚ Р·Р° РїСЂРѕРіСЂР°РјРјРѕР№."],
    ["Р РµРєРІРёР·РёС‚", "Р”РѕР±Р°РІР»СЏР№С‚Рµ СЂРµРєРІРёР·РёС‚ Рё СЂРµРґР°РєС‚РёСЂСѓР№С‚Рµ СЃРїРёСЃРѕРє. РЈРґР°Р»РµРЅРёРµ РґРѕСЃС‚СѓРїРЅРѕ С‚РѕР»СЊРєРѕ РїРѕСЃР»Рµ СЂРµР¶РёРјР° РР·РјРµРЅРёС‚СЊ Рё РїРѕРґС‚РІРµСЂР¶РґРµРЅРёСЏ."],
    ["РћС€РёР±РєРё", "Р’Рѕ РІРєР»Р°РґРєРµ РђРґРјРёРЅ РѕС‚РєСЂРѕР№С‚Рµ РћС€РёР±РєРё, С‡С‚РѕР±С‹ РїРѕСЃРјРѕС‚СЂРµС‚СЊ СЃРѕРѕР±С‰РµРЅРёСЏ РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№ Рё РѕС‡РёСЃС‚РёС‚СЊ РѕР±СЂР°Р±РѕС‚Р°РЅРЅС‹Рµ."],
    ["Р’С‹РїР»Р°С‚С‹", "Р’ РїСЂРѕС„РёР»Рµ СЃРѕС‚СЂСѓРґРЅРёРєР° РјРѕР¶РЅРѕ СЃРјРѕС‚СЂРµС‚СЊ СЌС„С„РµРєС‚РёРІРЅРѕСЃС‚СЊ, РїСЂРёРЅСЏС‚С‹Рµ Р·Р°РєР°Р·С‹, РІС‹РїР»Р°С‚С‹ Рё РєРѕСЂСЂРµРєС‚РёСЂРѕРІР°С‚СЊ РѕР±С‰СѓСЋ СЃСѓРјРјСѓ РїСЂРё РЅРµРѕР±С…РѕРґРёРјРѕСЃС‚Рё."],
  ];
  const ambassadorGuide = [
    ["Р”РѕР±Р°РІРёС‚СЊ Р·Р°РєР°Р·", "РћС‚РєСЂРѕР№С‚Рµ Р—Р°РєР°Р·С‹ Рё РЅР°Р¶РјРёС‚Рµ Р”РѕР±Р°РІРёС‚СЊ Р·Р°РєР°Р·. Р’ Р·Р°РєР°Р·Рµ СѓРєР°Р¶РёС‚Рµ РєРѕРґ Р°РјР±Р°СЃСЃР°РґРѕСЂР°, С‡С‚РѕР±С‹ РЅР°С‡РёСЃР»РёР»РёСЃСЊ Р±Р°РЅРЅРё."],
    ["Р›РёС‡РЅС‹Р№ РєРѕРґ", "Р’ РїСЂРѕС„РёР»Рµ РѕС‚РѕР±СЂР°Р¶Р°РµС‚СЃСЏ РІР°С€ РєРѕРґ Р°РјР±Р°СЃСЃР°РґРѕСЂР°. РџРµСЂРµРґР°РІР°Р№С‚Рµ РµРіРѕ РєР»РёРµРЅС‚Р°Рј РёР»Рё СѓРєР°Р·С‹РІР°Р№С‚Рµ РїСЂРё СЃРѕР·РґР°РЅРёРё Р·Р°РєР°Р·Р°."],
    ["Р‘Р°РЅРЅРё", "Р—Р° Р·Р°РєР°Р· РїРѕ РІР°С€РµРјСѓ РєРѕРґСѓ РЅР°С‡РёСЃР»СЏРµС‚СЃСЏ РІРЅСѓС‚СЂРµРЅРЅСЏСЏ РІР°Р»СЋС‚Р°: РЅР°РїСЂРёРјРµСЂ, Р·Р°РєР°Р· РЅР° 5000 СЂСѓР±Р»РµР№ РґР°РµС‚ 500 Р±Р°РЅРЅРё."],
    ["Р’С‹РІРѕРґ", "РљРЅРѕРїРєР° Р’С‹РІРµСЃС‚Рё РІР°Р»СЋС‚Сѓ РґРѕСЃС‚СѓРїРЅР° РІ РєРѕРЅС†Рµ РјРµСЃСЏС†Р°. РџРѕСЃР»Рµ РЅР°Р¶Р°С‚РёСЏ Р·Р°СЏРІРєР° СѓС…РѕРґРёС‚ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂР°Рј."],
    ["Рћ РєРѕРјРїР°РЅРёРё", "Р’ РїСЂРѕС„РёР»Рµ РµСЃС‚СЊ РєРЅРѕРїРєР° Рћ РєРѕРјРїР°РЅРёРё СЃРѕ СЃСЃС‹Р»РєР°РјРё РЅР° СЃР°Р№С‚ Рё РіСЂСѓРїРїСѓ Р’Рљ."],
  ];
  const guide = state.user.role === "admin" ? adminGuide : state.user.role === "ambassador" ? ambassadorGuide : actorGuide;
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-action="close-help">вЂ№</button>
      <span class="help-pill static-version-pill">РљР°Рє РїРѕР»СЊР·РѕРІР°С‚СЊСЃСЏ</span>
    </div>
    <h1 class="page-title">РРЅСЃС‚СЂСѓРєС†РёСЏ</h1>
    <div class="content-stack">
      <section class="panel version-panel">
        <h2 class="panel-title">${state.user.role === "admin" ? "Р”Р»СЏ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂР°" : state.user.role === "ambassador" ? "Р”Р»СЏ Р°РјР±Р°СЃСЃР°РґРѕСЂР°" : "Р”Р»СЏ Р°РєС‚РµСЂР°"}</h2>
        <p class="small-text">РљРѕСЂРѕС‚РєР°СЏ РїР°РјСЏС‚РєР° РїРѕ РѕСЃРЅРѕРІРЅС‹Рј РґРµР№СЃС‚РІРёСЏРј РІ РїСЂРёР»РѕР¶РµРЅРёРё.</p>
      </section>
      ${guide
        .map(
          ([title, text]) => `
            <section class="panel help-section">
              <h2 class="panel-title">${title}</h2>
              <p class="small-text">${text}</p>
            </section>
          `
        )
        .join("")}
      ${
        state.user.role === "admin"
          ? `<section class="panel help-section">
              <h2 class="panel-title">Р§С‚Рѕ РІРёРґРёС‚ Р°РєС‚РµСЂ</h2>
              <p class="small-text">РђРєС‚РµСЂС‹ СЂР°Р±РѕС‚Р°СЋС‚ СЃ Р·Р°РєР°Р·Р°РјРё, РїСЂРѕРіСЂР°РјРјР°РјРё, СЂРµРєРІРёР·РёС‚РѕРј, СЃРѕС…СЂР°РЅРµРЅРЅС‹Рј Рё РїСЂРѕС„РёР»РµРј. РђРґРјРёРЅСЃРєРёРµ РєРЅРѕРїРєРё РёРј РЅРµ РїРѕРєР°Р·С‹РІР°СЋС‚СЃСЏ.</p>
            </section>`
          : `<section class="panel help-section">
              <h2 class="panel-title">РЎРёРЅС…СЂРѕРЅРёР·Р°С†РёСЏ</h2>
              <p class="small-text">Р•СЃР»Рё РёРЅС‚РµСЂРЅРµС‚Р° РЅРµС‚, РґРµР№СЃС‚РІРёСЏ СЃРѕС…СЂР°РЅСЏСЋС‚СЃСЏ Р»РѕРєР°Р»СЊРЅРѕ. РљРѕРіРґР° СЃРµС‚СЊ РїРѕСЏРІРёС‚СЃСЏ, РїСЂРёР»РѕР¶РµРЅРёРµ РѕС‚РїСЂР°РІРёС‚ РёР·РјРµРЅРµРЅРёСЏ РІ Р±Р°Р·Сѓ.</p>
            </section>`
      }
      <button class="primary-button" data-action="close-help">Р—Р°РєСЂС‹С‚СЊ</button>
    </div>
  `, true);
}

function openHelpScreen() {
  state.previousRoute = state.route === "help" ? state.previousRoute || "home" : state.route;
  setRoute("help");
}

function avatarScreen() {
  const completed = acceptedOrdersForCurrentUser().length;
  const earned = userEarnings();
  const confetti = Array.from({ length: 18 }, () => "<i></i>").join("");
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Р­С‚Рѕ РІС‹!</h1>
    <div class="content-stack">
      <section class="panel avatar-view-panel">
        <div class="confetti-burst">${confetti}</div>
        <div class="avatar-view">
          ${state.user.photoUrl ? `<img src="${state.user.photoUrl}" alt="" />` : state.user.firstName.slice(0, 1)}
        </div>
        <h2 class="panel-title">Р­С‚Рѕ РІС‹! Р СЌС‚Рѕ Р·РґРѕСЂРѕРІРѕ!</h2>
        <div class="detail-grid avatar-stats">
          <div class="detail-line"><span>Р—Р°РєР°Р·С‹</span><strong>${completed}</strong></div>
          <div class="detail-line"><span>РџРѕР»СѓС‡РµРЅРѕ</span><strong>${money(earned)}</strong></div>
        </div>
      </section>
    </div>
  `, true);
}

function homeScreen() {
  const firstName = state.user.firstName.toUpperCase();
  const authClass = state.justAuthorized ? " authorized-entry" : "";
  if (state.justAuthorized) {
    window.setTimeout(() => {
      state.justAuthorized = false;
    }, 900);
  }
  return appFrame(`
    <div class="auth-burst${authClass}"></div>
    <div class="top-row">${syncPill()}</div>
    <div class="home-brand">
      <strong>РўРѕС‡РєР° РїСЂР°Р·РґРЅРёРєР°</strong>
      <span>РїСЂРѕРµРєС‚ Р‘Р°РЅРЅРё Р‘РѕРЅ</span>
    </div>
    <div class="hero-row">
      <h1 class="hero-title">РЎРµРіРѕРґРЅСЏ,<br>${firstName}</h1>
      <button class="actor-avatar" data-route="avatar" aria-label="Р¤РѕС‚Рѕ Р°РєС‚РµСЂР°">
        ${state.user.photoUrl ? `<img src="${state.user.photoUrl}" alt="" />` : state.user.firstName.slice(0, 1)}
      </button>
    </div>
    <span class="role-pill hero-role">${roleLabel()}</span>

    ${
      state.user.role === "ambassador"
        ? `<section class="panel">
            <h2 class="panel-title">Амбассадор</h2>
            <div class="detail-grid">
              <div class="detail-line"><span>Код</span><strong>${currentAmbassadorCode()}</strong></div>
              <div class="detail-line"><span>Банни</span><strong>${Number(currentEmployee()?.bunnyBalance || state.user.bunnyBalance || 0)} Б</strong></div>
            </div>
          </section>`
        : `
    <p class="section-label">Р‘Р»РёР¶Р°Р№С€РёРµ Р·Р°РєР°Р·С‹</p>
    <div class="orders-stack">
      ${
        orders.length
          ? orders
              .slice(0, 3)
              .map(
                (order) => `
                  <button class="order-row" data-route="order" data-order-id="${order.id}">
                    <span><strong>${order.title}</strong><span>${order.date} ${order.time}</span></span>
                    <span class="row-icon" aria-label="РћС‚РєСЂС‹С‚СЊ">вЂє</span>
                  </button>
                `
              )
              .join("")
          : `<div class="empty-state">Р—Р°РєР°Р·РѕРІ РїРѕРєР° РЅРµС‚</div>`
      }
    </div>
    <button class="more-button" data-route="orders">Р’СЃРµ Р·Р°РєР°Р·С‹</button>
        `
    }

    <div class="quick-scroll">
      ${
        state.user.role === "admin"
          ? `<button class="quick-card add-order-card" data-route="admin"><strong>РђРґРјРёРЅ</strong><span>+</span></button>`
          : ""
      }
      ${
        state.user.role === "ambassador"
          ? `<button class="quick-card add-order-card" data-route="new-order"><strong>Р”РѕР±Р°РІРёС‚СЊ Р·Р°РєР°Р·</strong><span>+</span></button>`
          : ""
      }
      ${
        state.user.role === "ambassador"
          ? `<button class="quick-card" data-route="profile"><strong>Профиль</strong><span>Б</span></button>
             <button class="quick-card dark" data-route="company"><strong>О компании</strong><span>i</span></button>`
          : `      <button class="quick-card" data-route="orders">
        <strong>Р—Р°РєР°Р·С‹</strong>
        <img src="./assets/orders.svg" alt="" />
      </button>
      <button class="quick-card dark" data-route="programs">
        <strong>РџСЂРѕРіСЂР°РјРјС‹</strong>
        <img src="./assets/programs.svg" alt="" />
      </button>
      <button class="quick-card" data-route="props">
        <strong>Р РµРєРІРёР·РёС‚</strong>
        <img src="./assets/props.svg" alt="" />
      </button>
      <button class="quick-card" data-route="saved"><strong>РЎРѕС…СЂР°РЅРµРЅРѕ</strong><span>вњ“</span></button>
          `
      }    </div>

    <div class="bottom-actions">
      <button class="secondary-button" data-route="profile">РџСЂРѕС„РёР»СЊ</button>
      <button class="secondary-button" data-action="report">РЎРѕРѕР±С‰РёС‚СЊ<br>РѕР± РѕС€РёР±РєРµ</button>
    </div>
  `, true);
}

function ordersScreen() {
  const list = filteredOrders();
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Р—Р°РєР°Р·С‹</h1>
    <div class="content-stack">
      ${canAddOrder() ? `<button class="primary-button" data-route="new-order">Р”РѕР±Р°РІРёС‚СЊ Р·Р°РєР°Р·</button>` : ""}
      ${state.user.role === "admin" ? `<button class="secondary-button" data-action="toggle-order-edit">${state.orderEditMode ? "Р“РѕС‚РѕРІРѕ" : "РР·РјРµРЅРёС‚СЊ"}</button>` : ""}
      <input class="search-input" placeholder="РќР°Р№С‚Рё Р·Р°РєР°Р·" />
      <div class="chips">
        <button class="chip ${state.orderFilter === "active" ? "active" : ""}" data-order-filter="active">РђРєС‚СѓР°Р»СЊРЅС‹Рµ</button>
        <button class="chip ${state.orderFilter === "mine" ? "active" : ""}" data-order-filter="mine">РњРѕРё</button>
        <button class="chip ${state.orderFilter === "week" ? "active" : ""}" data-order-filter="week">РќРµРґРµР»СЏ</button>
        <button class="chip ${state.orderFilter === "month" ? "active" : ""}" data-order-filter="month">РњРµСЃСЏС†</button>
        <button class="chip ${state.orderFilter === "past" ? "active" : ""}" data-order-filter="past">РџСЂРѕС€РµРґС€РёРµ</button>
      </div>
      <div class="orders-stack">
        ${
          list.length
            ? list
                .map(
                  (order) => `
                    <div class="managed-row inline-managed-row">
                      <button class="order-row" data-route="order" data-order-id="${order.id}">
                        <span><strong>${order.title}</strong><span>${order.date} ${order.time} В· ${order.status}</span></span>
                        <span class="row-icon" aria-label="РћС‚РєСЂС‹С‚СЊ">вЂє</span>
                      </button>
                      ${
                        state.user.role === "admin" && state.orderEditMode
                          ? `<button class="mini-delete-button" data-action="delete-order" data-order-id="${order.id}" aria-label="РЈРґР°Р»РёС‚СЊ Р·Р°РєР°Р·">Г—</button>`
                          : ""
                      }
                    </div>
                  `
                )
                .join("")
            : `<div class="empty-state">Р—Р°РєР°Р·РѕРІ РїРѕ С„РёР»СЊС‚СЂСѓ РЅРµС‚</div>`
        }
      </div>
    </div>
  `, true);
}

function adminScreen() {
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">РђРґРјРёРЅ</h1>
    <div class="content-stack">
      <button class="quick-card admin-action-card" data-route="new-order"><strong>Р”РѕР±Р°РІРёС‚СЊ Р·Р°РєР°Р·</strong><span>+</span></button>
      <button class="quick-card admin-action-card" data-route="admin-employees"><strong>Р”РѕР±Р°РІРёС‚СЊ СЃРѕС‚СЂСѓРґРЅРёРєР°</strong><span>+</span></button>
      <button class="quick-card admin-action-card" data-route="admin-ambassadors"><strong>Амбассадоры</strong><span>Б</span></button>
      <button class="quick-card admin-action-card" data-route="admin-promos"><strong>Р”РѕР±Р°РІРёС‚СЊ РїСЂРѕРјРѕРєРѕРґ</strong><span>%</span></button>
      <button class="quick-card admin-action-card" data-route="admin-program"><strong>Р”РѕР±Р°РІРёС‚СЊ РїСЂРѕРіСЂР°РјРјСѓ</strong><span>+</span></button>
      <button class="quick-card admin-action-card" data-route="admin-prop"><strong>Р”РѕР±Р°РІРёС‚СЊ СЂРµРєРІРёР·РёС‚</strong><span>+</span></button>
      <button class="quick-card admin-action-card" data-route="admin-reports"><strong>РћС€РёР±РєРё</strong><span>!</span></button>
    </div>
  `, true);
}

function newOrderScreen() {
  const calc = calculateBooking();
  const selectedDate = new Date(`${state.booking.date}T00:00:00`);
  const calendarDays = buildCalendarDays(selectedDate);
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="${state.user.role === "admin" ? "admin" : state.user.role === "ambassador" ? "home" : "orders"}">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">РќРѕРІС‹Р№ Р·Р°РєР°Р·</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">РљР»РёРµРЅС‚</h2>
        <div class="booking-grid">
          <label>
            <span>РРјСЏ</span>
            <input class="booking-input" data-booking="firstName" value="${state.booking.firstName}" />
          </label>
          <label>
            <span>Р¤Р°РјРёР»РёСЏ</span>
            <input class="booking-input" data-booking="lastName" value="${state.booking.lastName}" />
          </label>
        </div>
        <input class="booking-input" data-booking="phone" placeholder="РўРµР»РµС„РѕРЅ" value="${state.booking.phone}" style="margin-top: 8px" />
        <input class="booking-input" data-booking="address" placeholder="РђРґСЂРµСЃ" value="${state.booking.address}" style="margin-top: 8px" />
        <textarea class="booking-input booking-textarea" data-booking="comment" placeholder="РљРѕРјРјРµРЅС‚Р°СЂРёР№">${state.booking.comment}</textarea>
        <div class="discount-row">
          <input class="booking-input" data-booking="promoCode" placeholder="РџСЂРѕРјРѕРєРѕРґ" value="${state.booking.promoCode}" />
          <button class="secondary-button" data-action="apply-discount">РџСЂРёРјРµРЅРёС‚СЊ</button>
        </div>
        ${
          state.user.role === "ambassador"
            ? `<input class="booking-input" data-booking="ambassadorCode" placeholder="Код амбассадора" value="${state.booking.ambassadorCode || currentAmbassadorCode()}" readonly style="margin-top: 8px" />`
            : ""
        }
      </section>

      <section class="panel">
        <h2 class="panel-title">Р”Р°С‚Р° Рё РІСЂРµРјСЏ</h2>
        <div class="calendar-head">
          <button class="icon-button" data-action="calendar-prev">вЂ№</button>
          <strong>${monthName(selectedDate)} ${selectedDate.getFullYear()}</strong>
          <button class="icon-button" data-action="calendar-next">вЂє</button>
        </div>
        <div class="calendar-week">
          <span>РџРќ</span><span>Р’Рў</span><span>РЎР </span><span>Р§Рў</span><span>РџРў</span><span>РЎР‘</span><span>Р’РЎ</span>
        </div>
        <div class="calendar-grid">
          ${calendarDays
            .map(
              (day) => `
                <button class="${day.iso === state.booking.date ? "selected" : ""} ${day.otherMonth ? "muted-day" : ""}" data-date="${day.iso}">
                  <span>${day.label}</span>
                  <i></i>
                </button>
              `
            )
            .join("")}
        </div>
        <button class="time-summary-button" data-action="toggle-time-editor">
          <span>Р’С‹Р±СЂР°РЅРЅРѕРµ РІСЂРµРјСЏ</span>
          <strong>${state.booking.start} вЂ” ${state.booking.end}</strong>
        </button>
        ${
          state.timeEditorOpen
            ? `<div class="time-stepper">
                <div class="time-stepper-row">
                  <span>РќР°С‡Р°Р»Рѕ</span>
                  <div class="time-stepper-control">
                    <button type="button" data-action="adjust-booking-time" data-time-field="start" data-time-delta="-15">в€’</button>
                    <button type="button" class="time-value-button" data-action="open-native-time" data-time-field="start">${state.booking.start}</button>
                    <input class="native-time-input" type="time" data-native-time="start" value="${state.booking.start}" />
                    <button type="button" data-action="adjust-booking-time" data-time-field="start" data-time-delta="15">+</button>
                  </div>
                </div>
                <div class="time-stepper-row">
                  <span>РћРєРѕРЅС‡Р°РЅРёРµ</span>
                  <div class="time-stepper-control">
                    <button type="button" data-action="adjust-booking-time" data-time-field="end" data-time-delta="-15">в€’</button>
                    <button type="button" class="time-value-button" data-action="open-native-time" data-time-field="end">${state.booking.end}</button>
                    <input class="native-time-input" type="time" data-native-time="end" value="${state.booking.end}" />
                    <button type="button" data-action="adjust-booking-time" data-time-field="end" data-time-delta="15">+</button>
                  </div>
                </div>
              </div>`
            : ""
        }
      </section>

      <section class="panel legacy-time-panel">
        <h2 class="panel-title">Р’СЂРµРјСЏ</h2>
        <div class="booking-grid time-grid">
          <label>
            <span>РќР°С‡Р°Р»Рѕ</span>
            <input class="booking-input" type="time" data-booking="start" value="${state.booking.start}" />
          </label>
          <label>
            <span>РћРєРѕРЅС‡Р°РЅРёРµ</span>
            <input class="booking-input" type="time" data-booking="end" value="${state.booking.end}" />
          </label>
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-title">РџСЂРѕРіСЂР°РјРјР°</h2>
        <select class="booking-input" data-booking="programId">
          ${
            programs.length
              ? programs
                  .map(
                    (program) => `
                      <option value="${program.id}" ${Number(state.booking.programId) === program.id ? "selected" : ""}>
                        ${program.title}
                      </option>
                    `
                  )
                  .join("")
              : `<option value="">РЎРЅР°С‡Р°Р»Р° РґРѕР±Р°РІСЊС‚Рµ РїСЂРѕРіСЂР°РјРјСѓ</option>`
          }
        </select>
        <p class="small-text" style="margin-top: 10px">Р”Р»РёС‚РµР»СЊРЅРѕСЃС‚СЊ Р·Р°РєР°Р·Р°: ${calc.durationMinutes} РјРёРЅ В· ${calc.program?.age || ""}</p>
      </section>

      <section class="panel">
        <h2 class="panel-title">РЎРѕСЃС‚Р°РІР»СЏСЋС‰Р°СЏ</h2>
        <div class="option-list">
          ${packageOptions
            .map(
              (item) => `
                <label class="radio-line">
                  <input type="radio" name="package" value="${item.label}" ${state.booking.package === item.label ? "checked" : ""} />
                  <span>${item.label}</span>
                </label>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-title">Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅРѕ</h2>
        <button class="secondary-button" data-action="toggle-extra-edit">${state.extraEditMode ? "Р“РѕС‚РѕРІРѕ" : "РР·РјРµРЅРёС‚СЊ"}</button>
        <div class="option-list">
          ${editableExtras
            .map(
              (item) => `
                <div class="editable-extra-row">
                  ${checkboxLine(`${item.title} В· ${money(item.price)}`, "extra", item.title)}
                  ${
                    state.extraEditMode
                      ? `<input class="booking-input extra-price-input" type="number" min="0" data-extra-price="${item.title}" value="${item.price}" />
                         <button class="mini-delete-button" data-action="delete-extra" data-extra-title="${item.title}">Г—</button>`
                      : ""
                  }
                </div>
              `
            )
            .join("")}
        </div>
        <div class="discount-row" style="margin-top: 8px">
          <input class="booking-input" data-extra-draft placeholder="Р”РѕР±Р°РІРёС‚СЊ РїСѓРЅРєС‚" value="${state.extraDraft}" />
          <input class="booking-input" data-extra-draft-price type="number" min="0" placeholder="в‚Ѕ" value="${state.extraDraftPrice}" />
          <button class="secondary-button" data-action="add-extra">Р”РѕР±Р°РІРёС‚СЊ</button>
        </div>
      </section>

      <section class="panel summary-panel">
        <h2 class="panel-title">Р Р°СЃС‡РµС‚</h2>
        <div class="summary-line"><span>РЎРѕСЃС‚Р°РІ</span><strong>${calc.selectedPackage.label}</strong></div>
        <div class="summary-line"><span>Р”Р»РёС‚РµР»СЊРЅРѕСЃС‚СЊ</span><strong>${calc.durationMinutes} РјРёРЅ</strong></div>
        <div class="summary-line"><span>РЎСѓРјРјР° Р·Р°РєР°Р·Р°</span><strong>${money(calc.orderTotal)}</strong></div>
        ${state.user.role === "ambassador" ? `<div class="summary-line"><span>Р‘Р°РЅРЅРё Р°РјР±Р°СЃСЃР°РґРѕСЂР°</span><strong>${ambassadorPointsForOrder(calc.orderTotal)}</strong></div>` : ""}
        <div class="summary-line"><span>Р—Рџ Р°РєС‚РµСЂРѕРІ</span><strong>${money(calc.actorTotal)}</strong></div>
        <div class="summary-line"><span>РћСЃС‚Р°С‚РѕРє Р°РіРµРЅС‚СЃС‚РІР°</span><strong>${money(calc.agencyTotal)}</strong></div>
      </section>

      <section class="panel">
        <button class="panel-toggle" data-action="toggle-bonus-form">РќР°С‡РёСЃР»РёС‚СЊ РґРѕРїРѕР»РЅРёС‚РµР»СЊРЅСѓСЋ РІС‹РїР»Р°С‚Сѓ</button>
        ${
          state.bonusFormOpen
            ? `<select class="booking-input" data-admin-field="newBonus.employeeId">
                <option value="">Р’С‹Р±РµСЂРёС‚Рµ СЃРѕС‚СЂСѓРґРЅРёРєР°</option>
                ${employeeOptions()}
              </select>
              <input class="booking-input" data-admin-field="newBonus.amount" type="number" min="0" placeholder="РЎСѓРјРјР° РІС‹РїР»Р°С‚С‹" value="${state.newBonus.amount}" style="margin-top: 8px" />
              <textarea class="booking-input booking-textarea" data-admin-field="newBonus.comment" placeholder="Р—Р° С‡С‚Рѕ РЅР°С‡РёСЃР»РµРЅР° РІС‹РїР»Р°С‚Р°">${state.newBonus.comment}</textarea>`
            : ""
        }
      </section>

      <button class="primary-button" data-action="create-order">РЎРѕР·РґР°С‚СЊ Р·Р°РєР°Р·</button>
    </div>
  `, true);
}

function checkboxLine(label, group, rawValue = label) {
  const value = `${group}:${rawValue}`;
  return `
    <label class="check-line">
      <input type="checkbox" data-extra="${value}" ${state.booking.extras.includes(value) ? "checked" : ""} />
      <span>${label}</span>
    </label>
  `;
}

function monthName(date) {
  return date.toLocaleDateString("ru-RU", { month: "long" }).replace(/^./, (letter) => letter.toUpperCase());
}

function buildCalendarDays(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    const iso = localIsoDate(day);
    return {
      iso,
      label: day.getDate(),
      otherMonth: day.getMonth() !== month,
    };
  });
}

function localIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function orderScreen() {
  const order = getActiveOrder();
  if (!order) {
    return appFrame(`
      <div class="top-row">
        <button class="icon-button" data-route="orders">вЂ№</button>
        ${syncPill()}
      </div>
      <h1 class="page-title">Р—Р°РєР°Р·</h1>
      <div class="content-stack"><div class="empty-state">Р—Р°РєР°Р· РЅРµ РЅР°Р№РґРµРЅ</div></div>
    `, true);
  }
  const isSaved = state.saved.includes(order.id);
  const acceptedList = acceptedListForOrder(order.id);
  const acceptedByMe = acceptedByMeForOrder(order.id);
  const acceptedNames = acceptedList.map((accepted) => accepted.name).join(", ");
  const isFull = acceptedList.length >= orderActorLimit(order);

  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Р—Р°РєР°Р·</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">${order.title}</h2>
        <div class="detail-grid">
          <div class="detail-line"><span>Р”Р°С‚Р°</span><strong>${order.date}, ${order.time}</strong></div>
          <div class="detail-line"><span>РђРґСЂРµСЃ</span><strong>${order.address}</strong></div>
          <div class="detail-line"><span>Р РѕР»СЊ</span><strong>${order.role}</strong></div>
          <div class="detail-line"><span>РђРєС‚РµСЂС‹</span><strong>${order.actors.join(", ")}</strong></div>
          <div class="detail-line"><span>РџСЂРёРЅСЏР»Рё</span><strong>${acceptedNames || "РџРѕРєР° РЅРёРєС‚Рѕ"}</strong></div>
        </div>
        ${
          state.user.role === "admin"
            ? `<button class="secondary-button" style="margin-top: 12px" data-action="toggle-order-detail-edit">${state.orderDetailEditMode ? "Р“РѕС‚РѕРІРѕ" : "РР·РјРµРЅРёС‚СЊ"}</button>
               ${
                 state.orderDetailEditMode
                   ? `<button class="secondary-button danger-button" style="margin-top: 8px" data-action="delete-order" data-order-id="${order.id}">РЈРґР°Р»РёС‚СЊ Р·Р°РєР°Р·</button>`
                   : ""
               }`
            : ""
        }
      </section>

      ${
        true
          ? `<section class="panel">
              <h2 class="panel-title">РџРѕРґС‚РІРµСЂР¶РґРµРЅРёРµ</h2>
              <p class="small-text">${acceptedList.length ? `РџСЂРёРЅСЏР»Рё: ${acceptedNames}` : "РњРѕР¶РЅРѕ РїСЂРёРЅСЏС‚СЊ Р·Р°РєР°Р·. Р•СЃР»Рё РЅРµС‚ СЃРµС‚Рё, РѕС‚РјРµС‚РєР° СЃРѕС…СЂР°РЅРёС‚СЃСЏ Рё РѕС‚РїСЂР°РІРёС‚СЃСЏ РїРѕР·Р¶Рµ."}</p>
              ${
                acceptedByMe
                  ? `<button class="primary-button accepted-button" style="margin-top: 12px" disabled>Р—Р°РєР°Р· РїСЂРёРЅСЏС‚</button>
                     <button class="secondary-button danger-button" style="margin-top: 8px" data-action="decline-order" data-order-id="${order.id}">РћС‚РєР°Р·Р°С‚СЊСЃСЏ</button>`
                  : `<button class="primary-button" style="margin-top: 12px" data-action="accept-order" data-order-id="${order.id}" ${isFull ? "disabled" : ""}>
                      ${isFull ? "РњРµСЃС‚Р° Р°РєС‚РµСЂРѕРІ Р·Р°РЅСЏС‚С‹" : "РџСЂРёРЅСЏС‚СЊ Р·Р°РєР°Р·"}
                    </button>`
              }
            </section>`
          : `<section class="panel">
              <h2 class="panel-title">РљС‚Рѕ РїСЂРёРЅСЏР» Р·Р°РєР°Р·</h2>
              <p class="small-text">${acceptedNames || "РџРѕРєР° РЅРёРєС‚Рѕ РЅРµ РїСЂРёРЅСЏР» Р·Р°РєР°Р·."}</p>
            </section>`
      }

      <section class="panel">
        <h2 class="panel-title">РљРѕРјРїР»РµРєС‚</h2>
        <p class="small-text">${order.available}. ${order.kitStatus}</p>
        <div class="action-grid" style="margin-top: 12px">
          <button class="primary-button" data-action="take-kit" data-order-id="${order.id}">Р’Р·СЏС‚СЊ РєРѕРјРїР»РµРєС‚</button>
          <button class="secondary-button" data-route="kit">РћС‚РєСЂС‹С‚СЊ РєРѕРјРїР»РµРєС‚</button>
          <button class="secondary-button" data-action="save-trip" data-order-id="${order.id}">
            ${isSaved ? "РЎРѕС…СЂР°РЅРµРЅРѕ" : "Р”Р»СЏ РІС‹РµР·РґР°"}
          </button>
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-title">РџСЂРѕРіСЂР°РјРјР°</h2>
        <p class="small-text">РЎС†РµРЅР°СЂРёР№, РјСѓР·С‹РєР° Рё С‚Р°Р№РјРёРЅРі РґР»СЏ РІС‹РµР·РґР°.</p>
        <button class="primary-button" style="margin-top: 12px" data-route="program-detail">РћС‚РєСЂС‹С‚СЊ РїСЂРѕРіСЂР°РјРјСѓ</button>
      </section>
    </div>
  `, true);
}

function propsScreen() {
  const list = filteredProps();
  const cells = propCellOptions();
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Р РµРєРІРёР·РёС‚</h1>
    <div class="content-stack">
      <input class="search-input" data-prop-search placeholder="РќР°Р№С‚Рё СЂРµРєРІРёР·РёС‚" value="${state.propSearch}" />
      <select class="booking-input" data-prop-cell-filter>
        <option value="all" ${state.propCellFilter === "all" ? "selected" : ""}>Р’СЃРµ СЏС‡РµР№РєРё</option>
        ${cells.map((cell) => `<option value="${cell}" ${state.propCellFilter === cell ? "selected" : ""}>РЇС‡РµР№РєР° ${cell}</option>`).join("")}
      </select>
      ${
        state.user.role === "admin"
          ? `<button class="secondary-button" data-action="toggle-prop-edit">${state.propEditMode ? "Р“РѕС‚РѕРІРѕ" : "РР·РјРµРЅРёС‚СЊ"}</button>`
          : ""
      }
      <div class="chips">
        ${[
          ["all", "Р’СЃРµ"],
          ["available", "Р”РѕСЃС‚СѓРїРЅРѕ"],
          ["mine", "РЈ РјРµРЅСЏ"],
          ["busy", "Р—Р°РЅСЏС‚Рѕ"],
          ["repair", "РџСЂРѕРІРµСЂРєР°"],
        ]
          .map(([filter, label]) => `<button class="chip ${state.filter === filter ? "active" : ""}" data-filter="${filter}">${label}</button>`)
          .join("")}
      </div>
      <div class="orders-stack">
        ${
          list.length
            ? list.map(
                (item) => `
              <div class="managed-row">
                <button class="prop-row" data-action="${item.status === "mine" ? "return-prop" : "take-prop"}" data-prop-id="${item.id}">
                  <span><strong>${item.name}</strong><span>${statusText(item.status)} В· ${item.place}</span></span>
                  <span class="row-icon ${item.status === "mine" ? "return" : ""}" aria-label="${item.status === "mine" ? "Р’РµСЂРЅСѓС‚СЊ" : "Р’Р·СЏС‚СЊ"}">
                    ${item.status === "mine" ? "в†©" : "+"}
                  </span>
                </button>
                ${
                  state.user.role === "admin" && state.propEditMode
                    ? `<button class="delete-row-button" data-action="delete-prop" data-prop-id="${item.id}">РЈРґР°Р»РёС‚СЊ</button>`
                    : ""
                }
              </div>
            `
              )
              .join("")
            : `<div class="empty-state">Р РµРєРІРёР·РёС‚ РЅРµ РЅР°Р№РґРµРЅ</div>`
        }
      </div>
    </div>
  `, true);
}

function kitScreen() {
  const order = getActiveOrder();
  const program = getProgramForOrder(order);
  const kitIds = new Set((state.programKits[String(program?.id)] || []).map(Number));
  const kitProps = kitIds.size ? props.filter((item) => kitIds.has(Number(item.id))) : props.filter((item) => item.kit);
  const availableCount = kitProps.filter((item) => item.status === "available" || item.status === "mine").length;
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="order">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">РљРѕРјРїР»РµРєС‚</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">${program?.title || "РљРѕРјРїР»РµРєС‚ РїСЂРѕРіСЂР°РјРјС‹"}</h2>
        <p class="small-text">${availableCount} РёР· ${kitProps.length} РїСЂРµРґРјРµС‚РѕРІ РґРѕСЃС‚СѓРїРЅС‹. ${kitIds.size ? "РџРѕРєР°Р·Р°РЅ СЃРѕС…СЂР°РЅРµРЅРЅС‹Р№ РєРѕРјРїР»РµРєС‚ СЌС‚РѕР№ РїСЂРѕРіСЂР°РјРјС‹." : "РљРѕРјРїР»РµРєС‚ РїРѕРєР° РЅРµ СЃРѕР±СЂР°РЅ, РїРѕРєР°Р·Р°РЅ Р±Р°Р·РѕРІС‹Р№ СЂРµРєРІРёР·РёС‚."}</p>
        <button class="primary-button" style="margin-top: 12px" data-action="take-kit">Р’Р·СЏС‚СЊ РєРѕРјРїР»РµРєС‚</button>
      </section>
      <div class="orders-stack">
        ${
          kitProps.length
            ? kitProps.map(
                (item) => `
              <button class="prop-row" data-action="${item.status === "mine" ? "return-prop" : "take-prop"}" data-prop-id="${item.id}">
                <span><strong>${item.name}</strong><span>${statusText(item.status)} В· ${item.place}</span></span>
                <span class="row-icon ${item.status === "mine" ? "return" : ""}" aria-label="${item.status === "mine" ? "Р’РµСЂРЅСѓС‚СЊ" : "Р’Р·СЏС‚СЊ"}">
                  ${item.status === "mine" ? "в†©" : "+"}
                </span>
              </button>
            `
              )
              .join("")
            : `<div class="empty-state">Р’ РєРѕРјРїР»РµРєС‚Рµ РїРѕРєР° РЅРµС‚ СЂРµРєРІРёР·РёС‚Р°</div>`
        }
      </div>
    </div>
  `, true);
}

function programsScreen() {
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">РџСЂРѕРіСЂР°РјРјС‹</h1>
    <div class="content-stack">
      ${state.user.role === "admin" ? `<button class="secondary-button" data-action="toggle-program-edit">${state.programEditMode ? "Р“РѕС‚РѕРІРѕ" : "РР·РјРµРЅРёС‚СЊ"}</button>` : ""}
      <input class="search-input" placeholder="РќР°Р№С‚Рё РїСЂРѕРіСЂР°РјРјСѓ" />
      ${programs
          .map(
            (program) => `
            <div class="managed-row">
              <button class="order-row" data-route="program-detail" data-program-id="${program.id}">
                <span><strong>${program.title}</strong><span>${program.age} В· ${program.duration}</span></span>
                <span class="row-icon" aria-label="РћС‚РєСЂС‹С‚СЊ">вЂє</span>
              </button>
              ${
                state.user.role === "admin" && state.programEditMode
                  ? `<button class="delete-row-button" data-action="delete-program" data-program-id="${program.id}">РЈРґР°Р»РёС‚СЊ</button>`
                  : ""
              }
            </div>
          `
        )
        .join("")}
    </div>
  `, true);
}

function programDetailScreen() {
  const program = programs.find((item) => Number(item.id) === Number(state.activeProgramId)) || programs[0];
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="programs">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">РџСЂРѕРіСЂР°РјРјР°</h1>
    <div class="content-stack">
      <section class="panel">
        ${
          state.user.role === "admin"
            ? `<button class="secondary-button" data-action="toggle-program-edit">${state.programEditMode ? "Р“РѕС‚РѕРІРѕ" : "РР·РјРµРЅРёС‚СЊ"}</button>`
            : ""
        }
        ${
          state.programEditMode && state.user.role === "admin"
            ? `<input class="booking-input" data-program-field="title" data-program-id="${program.id}" value="${program.title}" style="margin-top: 10px" />
               <input class="booking-input" data-program-field="age" data-program-id="${program.id}" value="${program.age || ""}" placeholder="Р’РѕР·СЂР°СЃС‚" style="margin-top: 8px" />
               <input class="booking-input" data-program-field="duration" data-program-id="${program.id}" value="${program.duration || ""}" placeholder="Р”Р»РёС‚РµР»СЊРЅРѕСЃС‚СЊ" style="margin-top: 8px" />
               <input class="booking-input" data-program-field="driveUrl" data-program-id="${program.id}" value="${program.driveUrl || ""}" placeholder="РЎСЃС‹Р»РєР° РЅР° РґРёСЃРє" style="margin-top: 8px" />`
            : `<h2 class="panel-title">${program.title}</h2>
               <div class="detail-grid">
                 <div class="detail-line"><span>Р’РѕР·СЂР°СЃС‚</span><strong>${program.age}</strong></div>
                 <div class="detail-line"><span>Р”Р»РёС‚РµР»СЊРЅРѕСЃС‚СЊ</span><strong>${program.duration}</strong></div>
               </div>`
        }
        ${
          program.driveUrl
            ? `<button class="secondary-button" style="margin-top: 12px" data-open-url="${program.driveUrl}">РћС‚РєСЂС‹С‚СЊ РґРёСЃРє</button>`
            : ""
        }
        ${state.user.role === "admin" && state.programEditMode ? `<button class="secondary-button" style="margin-top: 8px" data-action="program-kit-builder">РР·РјРµРЅРёС‚СЊ РєРѕРјРїР»РµРєС‚</button>` : ""}
        ${state.user.role === "admin" && state.programEditMode ? `<button class="primary-button" style="margin-top: 8px" data-action="save-program" data-program-id="${program.id}">РЎРѕС…СЂР°РЅРёС‚СЊ РёР·РјРµРЅРµРЅРёСЏ</button>` : ""}
      </section>
      <section class="panel">
        <h2 class="panel-title">РЎС†РµРЅР°СЂРёР№</h2>
        ${
          state.programEditMode && state.user.role === "admin"
            ? `<textarea class="booking-input booking-textarea" data-program-field="script" data-program-id="${program.id}" placeholder="РЎС†РµРЅР°СЂРёР№ РїСЂРѕРіСЂР°РјРјС‹ С†РµР»РёРєРѕРј">${program.script || ""}</textarea>`
            : `<p class="small-text script-text">${program.script || "РЎС†РµРЅР°СЂРёР№ РїРѕРєР° РЅРµ РґРѕР±Р°РІР»РµРЅ."}</p>`
        }
      </section>
      <button class="primary-button" data-action="save-trip" data-order-id="1">РЎРѕС…СЂР°РЅРёС‚СЊ РґР»СЏ РІС‹РµР·РґР°</button>
    </div>
  `, true);
}

function savedScreen() {
  const savedOrders = orders.filter((order) => state.saved.includes(order.id));
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">РЎРѕС…СЂР°РЅРµРЅРѕ</h1>
    <div class="content-stack">
      <div class="notice">
        ${savedOrders.length} Р·Р°РєР°Р·(Р°) РґРѕСЃС‚СѓРїРЅС‹ РѕС„Р»Р°Р№РЅ. ${state.syncQueue.length ? `Р•СЃС‚СЊ ${state.syncQueue.length} РґРµР№СЃС‚РІРёРµ(Р№) Рє РѕС‚РїСЂР°РІРєРµ.` : "Р’СЃРµ РґРµР№СЃС‚РІРёСЏ РѕС‚РїСЂР°РІР»РµРЅС‹."}
      </div>
      <div class="orders-stack">
        ${
          savedOrders.length
            ? savedOrders
                .map(
                  (order) => `
                    <button class="order-row" data-route="order" data-order-id="${order.id}">
                      <span><strong>${order.title}</strong><span>${order.date} ${order.time} В· СЃС†РµРЅР°СЂРёР№, РјСѓР·С‹РєР°, СЂРµРєРІРёР·РёС‚</span></span>
                      <span class="row-icon done" aria-label="Р“РѕС‚РѕРІРѕ">вњ“</span>
                    </button>
                  `
                )
                .join("")
            : `<div class="notice">РџРѕРєР° РЅРёС‡РµРіРѕ РЅРµ СЃРѕС…СЂР°РЅРµРЅРѕ. РћС‚РєСЂРѕР№С‚Рµ Р·Р°РєР°Р· Рё РЅР°Р¶РјРёС‚Рµ вЂњР”Р»СЏ РІС‹РµР·РґР°вЂќ.</div>`
        }
      </div>
    </div>
  `, true);
}

function profileScreen() {
  const currentEmployee = employees.find((employee) => employee.id === state.user.id) || {
    name: state.user.firstName,
    efficiency: 0,
    accepted: 0,
    rating: 0,
  };
  const earnings = userEarnings();
  const acceptedList = acceptedOrdersForCurrentUser();
  const currentMonthlyAccepted = monthlyAcceptedCount(state.user.id);
  const myProps = props.filter((item) => item.status === "mine" && String(item.place || "").toLowerCase().includes(String(state.user.firstName).toLowerCase()));
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">РџСЂРѕС„РёР»СЊ</h1>
    <div class="content-stack">
      <section class="panel">
        <button class="profile-avatar-row" data-route="avatar">
          <span class="profile-avatar">
            ${state.user.photoUrl ? `<img src="${state.user.photoUrl}" alt="" />` : state.user.firstName.slice(0, 1)}
          </span>
          <strong>${state.user.firstName}</strong>
        </button>
        <div class="detail-grid">
          <div class="detail-line"><span>РРјСЏ</span><strong>${state.user.firstName}</strong></div>
          <div class="detail-line"><span>Telegram</span><strong>@${state.user.username}</strong></div>
          <div class="detail-line"><span>Р РѕР»СЊ</span><strong>${roleLabel()}</strong></div>
          <div class="detail-line"><span>РћС‡РµСЂРµРґСЊ</span><strong>${state.syncQueue.length}</strong></div>
          ${
            state.user.role === "ambassador"
              ? `<div class="detail-line"><span>РљРѕРґ</span><strong>${currentAmbassadorCode()}</strong></div>`
              : ""
          }
        </div>
      </section>
      ${
        state.user.role === "ambassador"
          ? `<section class="panel">
              <h2 class="panel-title">Р‘Р°РЅРЅРё</h2>
              <div class="summary-line"><span>Р”РѕСЃС‚СѓРїРЅРѕ</span><strong>${Number(currentEmployee()?.bunnyBalance || state.user.bunnyBalance || 0)} Р‘</strong></div>
              <div class="summary-line"><span>РќР° РІС‹РІРѕРґРµ</span><strong>${Number(currentEmployee()?.bunnyPending || state.user.bunnyPending || 0)} Р‘</strong></div>
              <button class="primary-button" data-action="withdraw-bunny" style="margin-top: 10px">Р’С‹РІРµСЃС‚Рё РІР°Р»СЋС‚Сѓ</button>
              <p class="small-text" style="margin-top: 8px">Р’С‹РІРѕРґ РґРѕСЃС‚СѓРїРµРЅ 30/31 С‡РёСЃР»Р°. 1 Р±Р°РЅРЅРё = 1 СЂСѓР±Р»СЊ.</p>
            </section>
            <button class="secondary-button" data-route="company">Рћ РєРѕРјРїР°РЅРёРё</button>`
          : ""
      }
      <section class="panel">
        <h2 class="panel-title">РћС„РѕСЂРјР»РµРЅРёРµ</h2>
        <div class="theme-choice">
          <button class="${state.appTheme === "dark" ? "active" : ""}" data-action="set-app-theme" data-app-theme="dark">РўРµРјРЅРѕРµ</button>
          <button class="${state.appTheme === "light" ? "active" : ""}" data-action="set-app-theme" data-app-theme="light">РЎРІРµС‚Р»РѕРµ</button>
        </div>
      </section>
      <section class="panel">
        <h2 class="panel-title">Р—Р°СЂР°Р±РѕС‚РѕРє</h2>
        <div class="chips">
          <button class="chip ${state.earningsPeriod === "week" ? "active" : ""}" data-earnings-period="week">РќРµРґРµР»СЏ</button>
          <button class="chip ${state.earningsPeriod === "month" ? "active" : ""}" data-earnings-period="month">РњРµСЃСЏС†</button>
          <button class="chip ${state.earningsPeriod === "year" ? "active" : ""}" data-earnings-period="year">Р“РѕРґ</button>
        </div>
        <div class="summary-line" style="margin-top: 10px"><span>РќР°С‡РёСЃР»РµРЅРѕ</span><strong>${money(earnings)}</strong></div>
      </section>
      <section class="panel">
        <h2 class="panel-title">РџСЂРёРЅСЏС‚С‹Рµ Р·Р°РєР°Р·С‹</h2>
        <div class="orders-stack">
          ${
            acceptedList.length
              ? acceptedList
                  .map(
                    (order) => `
                      <button class="order-row" data-route="order" data-order-id="${order.id}">
                        <span><strong>${order.title}</strong><span>${order.date} ${order.time} В· ${money(order.actorPay || 0)}</span></span>
                        <span class="row-icon" aria-label="РћС‚РєСЂС‹С‚СЊ">вЂє</span>
                      </button>
                    `
                  )
                  .join("")
              : `<div class="empty-state">РџСЂРёРЅСЏС‚С‹С… Р·Р°РєР°Р·РѕРІ РїРѕРєР° РЅРµС‚</div>`
          }
        </div>
      </section>
      <section class="panel">
        <h2 class="panel-title">Р РµРєРІРёР·РёС‚ Сѓ РІР°СЃ</h2>
        <div class="orders-stack">
          ${
            myProps.length
              ? myProps
                  .map(
                    (item) => `
                      <button class="prop-row" data-route="props">
                        <span><strong>${item.name}</strong><span>${item.place}</span></span>
                        <span class="row-icon return" aria-label="РЈ РІР°СЃ">в†©</span>
                      </button>
                    `
                  )
                  .join("")
              : `<div class="empty-state">Р—Р° РІР°РјРё РїРѕРєР° РЅРµС‚ СЂРµРєРІРёР·РёС‚Р°</div>`
          }
        </div>
      </section>
      ${
        state.user.role === "admin"
          ? `<section class="panel">
              <h2 class="panel-title">Р’С‹РїР»Р°С‚С‹</h2>
              <div class="orders-stack">
                ${
                  state.bonuses.length
                    ? state.bonuses
                        .map(
                          (bonus) => `
                            <div class="managed-row bonus-row">
                              <div class="detail-grid">
                                <div class="detail-line"><span>РљРѕРјСѓ</span><strong>${bonus.employeeName || `#${bonus.employeeId}`}</strong></div>
                                <div class="detail-line"><span>РљРѕРіРґР°</span><strong>${new Date(bonus.createdAt).toLocaleDateString("ru-RU")}</strong></div>
                                <div class="detail-line"><span>Р—Р° С‡С‚Рѕ</span><strong>${bonus.comment || "Р‘РµР· РєРѕРјРјРµРЅС‚Р°СЂРёСЏ"}</strong></div>
                                <div class="detail-line"><span>РќР°С‡РёСЃР»РёР»</span><strong>${bonus.createdByName || state.user.firstName}</strong></div>
                              </div>
                              <div class="bonus-edit-row">
                                <input class="booking-input" type="number" min="0" data-bonus-amount="${bonus.id}" value="${bonus.amount}" />
                                <button class="mini-delete-button" data-action="delete-bonus" data-bonus-id="${bonus.id}">Г—</button>
                              </div>
                            </div>
                          `
                        )
                        .join("")
                    : `<div class="empty-state">Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹С… РІС‹РїР»Р°С‚ РїРѕРєР° РЅРµС‚</div>`
                }
              </div>
            </section>`
          : ""
      }
      ${
        state.user.role !== "admin"
          ? `<section class="panel efficiency-panel">
              <h2 class="panel-title">Р­С„С„РµРєС‚РёРІРЅРѕСЃС‚СЊ</h2>
              <div class="efficiency-wrap">
                <div class="efficiency-ring" style="--value: ${currentEmployee.efficiency}">
                  <strong>${currentEmployee.efficiency}%</strong>
                </div>
                <div class="efficiency-stats">
                  <div><span>РџСЂРёРЅСЏС‚Рѕ Р·Р° РјРµСЃСЏС†</span><strong>${currentMonthlyAccepted}</strong></div>
                  <div><span>РћС†РµРЅРєР°</span><strong>${currentEmployee.rating}</strong></div>
                </div>
              </div>
            </section>`
          : `<section class="panel">
              <h2 class="panel-title">РћС†РµРЅРєР° СЃРѕС‚СЂСѓРґРЅРёРєРѕРІ</h2>
              <div class="employee-list">
                ${employees
                  .map(
                    (employee) => `
                      <button class="employee-row employee-button" data-route="admin-employee-detail" data-employee-id="${employee.id}">
                        <div class="mini-ring" style="--value: ${employee.efficiency}">${employee.efficiency}%</div>
                        <span><strong>${employee.name} ${employee.role !== "actor" ? `<em class="role-mark">(${roleLabel(employee.role)})</em>` : ""}</strong><small>РџСЂРёРЅСЏС‚Рѕ Р·Р° РјРµСЃСЏС†: ${monthlyAcceptedCount(employee.id)}</small></span>
                        <b>${employee.rating}</b>
                      </button>
                    `
                  )
                  .join("")}
              </div>
            </section>`
      }
      <button class="primary-button" data-action="refresh-data">РћР±РЅРѕРІРёС‚СЊ РґР°РЅРЅС‹Рµ</button>
      <button class="secondary-button" data-action="report">РЎРѕРѕР±С‰РёС‚СЊ РѕР± РѕС€РёР±РєРµ</button>
    </div>
  `, true);
}

function adminEmployeeDetailScreen() {
  const employee = employees.find((item) => Number(item.id) === Number(state.activeEmployeeId)) || employees[0];
  if (!employee) {
    return appFrame(`
      <div class="top-row">
        <button class="icon-button" data-route="profile">вЂ№</button>
        ${syncPill()}
      </div>
      <h1 class="page-title">РЎРѕС‚СЂСѓРґРЅРёРє</h1>
      <div class="content-stack"><div class="empty-state">РЎРѕС‚СЂСѓРґРЅРёРє РЅРµ РЅР°Р№РґРµРЅ</div></div>
    `, true);
  }
  const employeeOrders = acceptedOrdersForEmployee(employee.id);
  const employeeBonuses = bonusesForEmployee(employee.id);
  const total = employeeEarnings(employee.id);
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="profile">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">${employee.name}</h1>
    <div class="content-stack">
      <section class="panel efficiency-panel">
        <h2 class="panel-title">Р­С„С„РµРєС‚РёРІРЅРѕСЃС‚СЊ</h2>
        <div class="efficiency-wrap">
          <div class="efficiency-ring" style="--value: ${employee.efficiency || 0}">
            <strong>${employee.efficiency || 0}%</strong>
          </div>
          <div class="efficiency-stats">
            <div><span>РџСЂРёРЅСЏС‚Рѕ Р·Р° РјРµСЃСЏС†</span><strong>${monthlyAcceptedCount(employee.id)}</strong></div>
            <div><span>РћС†РµРЅРєР°</span><strong>${employee.rating || 0}</strong></div>
          </div>
        </div>
        <div class="counter-actions" style="margin-top: 10px">
          <button class="secondary-button" data-action="decrease-accepted" data-employee-id="${employee.id}">в€’ Р·Р°РєР°Р·</button>
          <button class="secondary-button" data-action="increase-accepted" data-employee-id="${employee.id}">+ Р·Р°РєР°Р·</button>
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-title">Р¤РёРЅР°РЅСЃС‹</h2>
        <div class="summary-line"><span>РћР±С‰Р°СЏ СЃСѓРјРјР°</span><strong>${money(total)}</strong></div>
        <input class="booking-input" type="number" min="0" data-employee-total="${employee.id}" value="${total}" style="margin-top: 10px" />
        <p class="small-text" style="margin-top: 8px">Р•СЃР»Рё РёР·РјРµРЅРёС‚СЊ СЃСѓРјРјСѓ, РїСЂРёР»РѕР¶РµРЅРёРµ РґРѕР±Р°РІРёС‚ РєРѕСЂСЂРµРєС‚РёСЂРѕРІРєСѓ РІС‹РїР»Р°С‚РѕР№.</p>
      </section>

      <section class="panel">
        <h2 class="panel-title">РџСЂРёРЅСЏС‚С‹Рµ Р·Р°РєР°Р·С‹</h2>
        <div class="orders-stack">
          ${
            employeeOrders.length
              ? employeeOrders
                  .map(
                    (order) => `
                      <div class="managed-row bonus-row">
                        <button class="order-row" data-route="order" data-order-id="${order.id}">
                          <span><strong>${order.title}</strong><span>${order.date} ${order.time} В· ${money(order.actorPay || 0)}</span></span>
                          <span class="row-icon" aria-label="РћС‚РєСЂС‹С‚СЊ">вЂє</span>
                        </button>
                        <input class="booking-input" type="number" min="0" data-order-pay="${order.id}" value="${order.actorPay || 0}" />
                        <div class="action-grid compact-actions">
                          <button class="secondary-button" data-action="annul-order" data-order-id="${order.id}">РђРЅРЅСѓР»РёСЂРѕРІР°С‚СЊ</button>
                          <button class="secondary-button danger-button" data-action="delete-order-pay" data-order-id="${order.id}">РЈРґР°Р»РёС‚СЊ Р—Рџ</button>
                        </div>
                      </div>
                    `
                  )
                  .join("")
              : `<div class="empty-state">РџСЂРёРЅСЏС‚С‹С… Р·Р°РєР°Р·РѕРІ РїРѕРєР° РЅРµС‚</div>`
          }
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-title">Р’С‹РїР»Р°С‚С‹</h2>
        <div class="orders-stack">
          ${
            employeeBonuses.length
              ? employeeBonuses
                  .map(
                    (bonus) => `
                      <div class="managed-row bonus-row">
                        <div class="detail-grid">
                          <div class="detail-line"><span>РљРѕРіРґР°</span><strong>${new Date(bonus.createdAt).toLocaleDateString("ru-RU")}</strong></div>
                          <div class="detail-line"><span>Р—Р° С‡С‚Рѕ</span><strong>${bonus.comment || "Р‘РµР· РєРѕРјРјРµРЅС‚Р°СЂРёСЏ"}</strong></div>
                          <div class="detail-line"><span>РќР°С‡РёСЃР»РёР»</span><strong>${bonus.createdByName || state.user.firstName}</strong></div>
                        </div>
                        <div class="bonus-edit-row">
                          <input class="booking-input" type="number" data-bonus-amount="${bonus.id}" value="${bonus.amount}" />
                          <button class="mini-delete-button" data-action="delete-bonus" data-bonus-id="${bonus.id}">Г—</button>
                        </div>
                      </div>
                    `
                  )
                  .join("")
              : `<div class="empty-state">Р’С‹РїР»Р°С‚ РїРѕРєР° РЅРµС‚</div>`
          }
        </div>
      </section>
    </div>
  `, true);
}

function companyScreen() {
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="profile">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Рћ РєРѕРјРїР°РЅРёРё</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">РўРѕС‡РєР° РїСЂР°Р·РґРЅРёРєР°</h2>
        <p class="small-text">РџСЂРѕРµРєС‚ Р‘Р°РЅРЅРё Р‘РѕРЅ. РЎСЃС‹Р»РєРё РґР»СЏ Р°РјР±Р°СЃСЃР°РґРѕСЂРѕРІ Рё СЃРѕС‚СЂСѓРґРЅРёРєРѕРІ.</p>
      </section>
      <button class="primary-button" data-open-url="${COMPANY_SITE_URL}">РЎР°Р№С‚</button>
      <button class="secondary-button" data-open-url="${COMPANY_VK_URL}">Р“СЂСѓРїРїР° Р’Рљ</button>
    </div>
  `, true);
}

function adminPromosScreen() {
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="admin">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">РџСЂРѕРјРѕРєРѕРґС‹</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">Р”РѕР±Р°РІРёС‚СЊ РїСЂРѕРјРѕРєРѕРґ</h2>
        <input class="booking-input" data-admin-field="newPromo.code" placeholder="РљРѕРґ" value="${state.newPromo.code}" />
        <input class="booking-input" data-admin-field="newPromo.discount" type="number" min="0" placeholder="РЎРєРёРґРєР° РІ в‚Ѕ" value="${state.newPromo.discount}" style="margin-top: 8px" />
        <input class="booking-input" data-admin-field="newPromo.description" placeholder="РљРѕРјРјРµРЅС‚Р°СЂРёР№" value="${state.newPromo.description}" style="margin-top: 8px" />
      </section>
      <button class="primary-button" data-action="create-promo">Р”РѕР±Р°РІРёС‚СЊ РїСЂРѕРјРѕРєРѕРґ</button>
      <section class="panel">
        <h2 class="panel-title">РђРєС‚РёРІРЅС‹Рµ</h2>
        <div class="orders-stack">
          ${
            state.promoCodes.length
              ? state.promoCodes
                  .map(
                    (promo) => `
                      <div class="notice">
                        <strong>${promo.code}</strong><br>
                        ${money(promo.discount)} ${promo.description ? `В· ${promo.description}` : ""}
                      </div>
                    `
                  )
                  .join("")
              : `<div class="empty-state">РџСЂРѕРјРѕРєРѕРґРѕРІ РїРѕРєР° РЅРµС‚</div>`
          }
        </div>
      </section>
    </div>
  `, true);
}

function adminAmbassadorsScreen() {
  const ambassadors = employees.filter((employee) => employee.role === "ambassador");
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="admin">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Амбассадоры</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">Редактирование</h2>
        <p class="small-text">Здесь можно поправить код амбассадора, доступные банни и сумму, которая уже отправлена на вывод.</p>
        <button class="secondary-button" data-action="toggle-ambassador-edit" style="margin-top: 10px">${state.ambassadorEditMode ? "Готово" : "Изменить"}</button>
      </section>
      <div class="orders-stack">
        ${
          ambassadors.length
            ? ambassadors
                .map(
                  (employee) => `
                    <section class="panel ambassador-admin-card">
                      <h2 class="panel-title">${employee.name}</h2>
                      <div class="detail-grid">
                        <div class="detail-line"><span>Telegram</span><strong>@${employee.username || "не указан"}</strong></div>
                        <div class="detail-line"><span>Код</span><strong>${employee.ambassadorCode || "не задан"}</strong></div>
                        <div class="detail-line"><span>Заработано</span><strong>${Number(employee.bunnyBalance || 0)} Б</strong></div>
                        <div class="detail-line"><span>На выводе</span><strong>${Number(employee.bunnyPending || 0)} Б</strong></div>
                      </div>
                      ${
                        state.ambassadorEditMode
                          ? `<div class="edit-stack" style="margin-top: 10px">
                              <input class="booking-input" data-ambassador-field="name" data-ambassador-id="${employee.id}" value="${employee.name || ""}" placeholder="Имя" />
                              <input class="booking-input" data-ambassador-field="username" data-ambassador-id="${employee.id}" value="${employee.username || ""}" placeholder="Telegram username" style="margin-top: 8px" />
                              <input class="booking-input" data-ambassador-field="ambassadorCode" data-ambassador-id="${employee.id}" value="${employee.ambassadorCode || ""}" placeholder="Код амбассадора" style="margin-top: 8px" />
                              <input class="booking-input" type="number" min="0" data-ambassador-field="bunnyBalance" data-ambassador-id="${employee.id}" value="${Number(employee.bunnyBalance || 0)}" placeholder="Заработанные банни" style="margin-top: 8px" />
                              <input class="booking-input" type="number" min="0" data-ambassador-field="bunnyPending" data-ambassador-id="${employee.id}" value="${Number(employee.bunnyPending || 0)}" placeholder="На выводе" style="margin-top: 8px" />
                              <button class="primary-button" data-action="save-ambassador" data-employee-id="${employee.id}" style="margin-top: 10px">Сохранить</button>
                            </div>`
                          : ""
                      }
                    </section>
                  `
                )
                .join("")
            : `<div class="empty-state">Амбассадоров пока нет</div>`
        }
      </div>
    </div>
  `, true);
}

function adminEmployeesScreen() {
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="admin">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">РЎРѕС‚СЂСѓРґРЅРёРє</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">Р”РѕР±Р°РІРёС‚СЊ СЃРѕС‚СЂСѓРґРЅРёРєР°</h2>
        <input class="booking-input" data-admin-field="newEmployee.name" placeholder="РРјСЏ" value="${state.newEmployee.name}" />
        <input class="booking-input" data-admin-field="newEmployee.username" placeholder="Telegram username" value="${state.newEmployee.username}" style="margin-top: 8px" />
        <label class="check-line admin-check-line" style="margin-top: 8px">
          <input type="checkbox" data-admin-field="newEmployee.isAdmin" ${state.newEmployee.isAdmin ? "checked" : ""} />
          <span>Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅРѕ РґР°С‚СЊ С„СѓРЅРєС†РёРё Р°РґРјРёРЅР°</span>
        </label>
        <label class="check-line admin-check-line" style="margin-top: 8px">
          <input type="checkbox" data-admin-field="newEmployee.isAmbassador" ${state.newEmployee.isAmbassador ? "checked" : ""} />
          <span>Р”Р°С‚СЊ РїСЂР°РІР° Р°РјР±Р°СЃСЃР°РґРѕСЂР°</span>
        </label>
        ${
          state.newEmployee.isAmbassador
            ? `<div class="notice" style="margin-top: 8px">
                <strong>РљРѕРґ Р°РјР±Р°СЃСЃР°РґРѕСЂР°</strong>
                <input class="booking-input" data-admin-field="newEmployee.ambassadorCode" placeholder="РљРѕРґ Р°РјР±Р°СЃСЃР°РґРѕСЂР°" value="${suggestedEmployeeAmbassadorCode()}" style="margin-top: 8px" />
                <p class="small-text" style="margin-top: 8px">Р­С‚РѕС‚ РєРѕРґ Р·Р°РєСЂРµРїРёС‚СЃСЏ Р·Р° СЃРѕС‚СЂСѓРґРЅРёРєРѕРј РїРѕСЃР»Рµ РґРѕР±Р°РІР»РµРЅРёСЏ.</p>
              </div>`
            : ""
        }
      </section>
      <button class="primary-button" data-action="create-employee">Р”РѕР±Р°РІРёС‚СЊ СЃРѕС‚СЂСѓРґРЅРёРєР°</button>
      <section class="panel">
        <button class="panel-toggle" data-action="toggle-bonus-form">РќР°С‡РёСЃР»РёС‚СЊ РґРѕРїРѕР»РЅРёС‚РµР»СЊРЅСѓСЋ РІС‹РїР»Р°С‚Сѓ</button>
        ${
          state.bonusFormOpen
            ? `<select class="booking-input" data-admin-field="newBonus.employeeId">
                <option value="">Р’С‹Р±РµСЂРёС‚Рµ СЃРѕС‚СЂСѓРґРЅРёРєР°</option>
                ${employees
                  .map((employee) => `<option value="${employee.id}" ${String(state.newBonus.employeeId) === String(employee.id) ? "selected" : ""}>${employee.name}</option>`)
                  .join("")}
              </select>
              <input class="booking-input" data-admin-field="newBonus.amount" type="number" min="0" placeholder="РЎСѓРјРјР° РІС‹РїР»Р°С‚С‹" value="${state.newBonus.amount}" style="margin-top: 8px" />
              <textarea class="booking-input booking-textarea" data-admin-field="newBonus.comment" placeholder="Р—Р° С‡С‚Рѕ РЅР°С‡РёСЃР»РµРЅР° РІС‹РїР»Р°С‚Р°">${state.newBonus.comment}</textarea>
              <button class="primary-button" data-action="create-bonus" style="margin-top: 8px">РќР°С‡РёСЃР»РёС‚СЊ</button>`
            : ""
        }
      </section>
      <section class="panel">
        <h2 class="panel-title">РЎРїРёСЃРѕРє</h2>
        <div class="employee-list">
          ${employees
            .map(
              (employee) => `
                <div class="employee-row">
                  <div class="mini-ring" style="--value: ${employee.efficiency}">${employee.efficiency}%</div>
                  <button class="employee-name-button" data-route="admin-employee-detail" data-employee-id="${employee.id}">
                    <span><strong>${employee.name} ${employee.role !== "actor" ? `<em class="role-mark">(${roleLabel(employee.role)})</em>` : ""}</strong><small>${roleLabel(employee.role)} В· РїСЂРёРЅСЏС‚Рѕ Р·Р° РјРµСЃСЏС† ${monthlyAcceptedCount(employee.id)}</small></span>
                  </button>
                  <div class="counter-actions">
                    <button class="mini-delete-button" data-action="decrease-accepted" data-employee-id="${employee.id}">в€’</button>
                    <button class="mini-delete-button" data-action="increase-accepted" data-employee-id="${employee.id}">+</button>
                  </div>
                  <button class="mini-delete-button" data-action="delete-employee" data-employee-id="${employee.id}">Г—</button>
                </div>
              `
            )
            .join("")}
        </div>
      </section>
    </div>
  `, true);
}

function adminProgramScreen() {
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="admin">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">РџСЂРѕРіСЂР°РјРјР°</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">Р”РѕР±Р°РІРёС‚СЊ РїСЂРѕРіСЂР°РјРјСѓ</h2>
        <input class="booking-input" data-admin-field="newProgram.title" placeholder="РќР°Р·РІР°РЅРёРµ" value="${state.newProgram.title}" />
        <input class="booking-input" data-admin-field="newProgram.driveUrl" placeholder="РЎСЃС‹Р»РєР° РЅР° РґРёСЃРє" value="${state.newProgram.driveUrl}" style="margin-top: 8px" />
        <input class="booking-input" data-admin-field="newProgram.age" placeholder="Р’РѕР·СЂР°СЃС‚" value="${state.newProgram.age}" style="margin-top: 8px" />
        <input class="booking-input" data-admin-field="newProgram.duration" placeholder="Р”Р»РёС‚РµР»СЊРЅРѕСЃС‚СЊ" value="${state.newProgram.duration}" style="margin-top: 8px" />
        <input class="booking-input" data-admin-field="newProgram.pricePerHour" type="number" placeholder="Р¦РµРЅР° Р·Р° С‡Р°СЃ" value="${state.newProgram.pricePerHour}" style="margin-top: 8px" />
        <input class="booking-input" data-admin-field="newProgram.actorPayPerHour" type="number" placeholder="Р—Рџ Р°РєС‚РµСЂР° Р·Р° С‡Р°СЃ" value="${state.newProgram.actorPayPerHour}" style="margin-top: 8px" />
        <textarea class="booking-input booking-textarea" data-admin-field="newProgram.script" placeholder="РЎС†РµРЅР°СЂРёР№ РїСЂРѕРіСЂР°РјРјС‹ С†РµР»РёРєРѕРј">${state.newProgram.script}</textarea>
      </section>
      <button class="secondary-button" data-action="program-kit-builder">РЎРѕР±СЂР°С‚СЊ РєРѕРјРїР»РµРєС‚ РґР»СЏ РїСЂРѕРіСЂР°РјРјС‹</button>
      <button class="primary-button" data-action="create-program">Р”РѕР±Р°РІРёС‚СЊ РїСЂРѕРіСЂР°РјРјСѓ</button>
    </div>
  `, true);
}

function adminPropScreen() {
  const kitKey = currentKitKey();
  const kitMode = Boolean(state.kitBuilderProgramId);
  const selectedKitProps = new Set((state.programKits[kitKey] || []).map(Number));
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="admin">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Р РµРєРІРёР·РёС‚</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">Р”РѕР±Р°РІРёС‚СЊ СЂРµРєРІРёР·РёС‚</h2>
        <input class="booking-input" data-admin-field="newProp.name" placeholder="РќР°Р·РІР°РЅРёРµ" value="${state.newProp.name}" />
        <input class="booking-input" data-admin-field="newProp.place" placeholder="РњРµСЃС‚Рѕ С…СЂР°РЅРµРЅРёСЏ" value="${state.newProp.place}" style="margin-top: 8px" />
        <select class="booking-input" data-admin-field="newProp.status" style="margin-top: 8px">
          <option value="available" ${state.newProp.status === "available" ? "selected" : ""}>Р”РѕСЃС‚СѓРїРЅРѕ</option>
          <option value="busy" ${state.newProp.status === "busy" ? "selected" : ""}>Р—Р°РЅСЏС‚Рѕ</option>
          <option value="repair" ${state.newProp.status === "repair" ? "selected" : ""}>РџСЂРѕРІРµСЂРєР°</option>
        </select>
      </section>
      <button class="primary-button" data-action="create-prop">Р”РѕР±Р°РІРёС‚СЊ СЂРµРєРІРёР·РёС‚</button>
      ${
        kitMode
          ? `<section class="panel kit-builder-panel">
              <h2 class="panel-title">РљРѕРјРїР»РµРєС‚ РїСЂРѕРіСЂР°РјРјС‹</h2>
              <p class="small-text">Р’С‹Р±РµСЂРёС‚Рµ СЂРµРєРІРёР·РёС‚ РґР»СЏ СЌС‚РѕР№ РїСЂРѕРіСЂР°РјРјС‹. Р’С‹Р±РѕСЂ СЃРѕС…СЂР°РЅСЏРµС‚СЃСЏ Р»РѕРєР°Р»СЊРЅРѕ Рё РѕС‚РїСЂР°РІРёС‚СЃСЏ РІ РѕС‡РµСЂРµРґСЊ СЃРёРЅС…СЂРѕРЅРёР·Р°С†РёРё.</p>
              <button class="primary-button" style="margin-top: 10px" data-action="save-program-kit">РЎРѕС…СЂР°РЅРёС‚СЊ РєРѕРјРїР»РµРєС‚</button>
            </section>`
          : ""
      }
      <section class="panel">
        <h2 class="panel-title">Р РµРєРІРёР·РёС‚</h2>
        <button class="secondary-button" data-action="toggle-prop-edit">${state.propEditMode ? "Р“РѕС‚РѕРІРѕ" : "РР·РјРµРЅРёС‚СЊ"}</button>
        <div class="orders-stack">
          ${
            props.length
              ? props
                  .map(
                    (item) => `
                      <div class="managed-row inline-managed-row">
                        <div class="prop-row">
                          <span><strong>${item.name}</strong><span>${statusText(item.status)} В· ${item.place}</span></span>
                          <span class="row-icon ${item.status === "mine" ? "return" : ""}" aria-label="${statusText(item.status)}">${item.status === "mine" ? "в†©" : "+"}</span>
                        </div>
                        ${
                          kitMode
                            ? `<button class="secondary-button kit-toggle-button ${selectedKitProps.has(Number(item.id)) ? "active" : ""}" data-action="toggle-program-kit-prop" data-prop-id="${item.id}">
                                ${selectedKitProps.has(Number(item.id)) ? "Р’ РєРѕРјРїР»РµРєС‚Рµ" : "Р’ РєРѕРјРїР»РµРєС‚"}
                              </button>`
                            : state.propEditMode
                              ? `<button class="mini-delete-button" data-action="delete-prop" data-prop-id="${item.id}" aria-label="РЈРґР°Р»РёС‚СЊ СЂРµРєРІРёР·РёС‚">Г—</button>`
                              : ""
                        }
                      </div>
                    `
                  )
                  .join("")
              : `<div class="empty-state">Р РµРєРІРёР·РёС‚Р° РїРѕРєР° РЅРµС‚</div>`
          }
        </div>
      </section>
    </div>
  `, true);
}

function adminReportsScreen() {
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="admin">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">РћС€РёР±РєРё</h1>
    <div class="content-stack">
      ${
        reports.length
          ? reports
              .map(
                (report) => `
                  <section class="panel">
                    <h2 class="panel-title">${report.actorName || `РЎРѕС‚СЂСѓРґРЅРёРє #${report.actor_id || ""}`}</h2>
                    <p class="small-text">${report.text}</p>
                    <p class="small-text" style="margin-top: 8px">${report.createdAt || report.created_at || ""}</p>
                    <button class="secondary-button danger-button" style="margin-top: 8px" data-action="delete-report" data-report-id="${report.id}">РћС‡РёСЃС‚РёС‚СЊ</button>
                  </section>
                `
              )
              .join("")
          : `<div class="empty-state">РћС€РёР±РѕРє РїРѕРєР° РЅРµС‚</div>`
      }
    </div>
  `, true);
}

function reportScreen() {
  const backRoute = state.user.hasAccess ? "home" : "denied";
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="${backRoute}">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">РћС€РёР±РєР°</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">Р§С‚Рѕ СЃР»СѓС‡РёР»РѕСЃСЊ?</h2>
        <textarea class="booking-input booking-textarea" data-report-text placeholder="РћРїРёС€РёС‚Рµ РїСЂРѕР±Р»РµРјСѓ">${state.reportText}</textarea>
        <p class="small-text" style="margin-top: 10px">РЎРѕРѕР±С‰РµРЅРёРµ СЃРѕС…СЂР°РЅРёС‚СЃСЏ Рё РѕС‚РїСЂР°РІРёС‚СЃСЏ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂСѓ РїСЂРё СЃРёРЅС…СЂРѕРЅРёР·Р°С†РёРё.</p>
      </section>
      <button class="primary-button" data-action="send-report">РћС‚РїСЂР°РІРёС‚СЊ</button>
    </div>
  `, true);
}

function actionTitle(action) {
  const payload = action.payload || {};
  return {
    "create-employee": `Р”РѕР±Р°РІРёС‚СЊ СЃРѕС‚СЂСѓРґРЅРёРєР°: ${payload.name || ""}`,
    "create-order": `Р”РѕР±Р°РІРёС‚СЊ Р·Р°РєР°Р·: ${payload.order?.title || payload.title || ""}`,
    "create-promo": `Р”РѕР±Р°РІРёС‚СЊ РїСЂРѕРјРѕРєРѕРґ: ${payload.code || ""}`,
    "withdraw-bunny": `Р’С‹РІРѕРґ Р±Р°РЅРЅРё: ${payload.amount || 0}`,
    "update-ambassador": `Обновить амбассадора: ${payload.name || payload.ambassadorCode || ""}`,
    report: "РЎРѕРѕР±С‰РёС‚СЊ РѕР± РѕС€РёР±РєРµ",
    "take-prop": `Р’Р·СЏС‚СЊ СЂРµРєРІРёР·РёС‚ #${payload.propId || ""}`,
    "return-prop": `Р’РµСЂРЅСѓС‚СЊ СЂРµРєРІРёР·РёС‚ #${payload.propId || ""}`,
    "take-kit": "Р’Р·СЏС‚СЊ РєРѕРјРїР»РµРєС‚",
    "accept-order": `РџСЂРёРЅСЏС‚СЊ Р·Р°РєР°Р· #${payload.orderId || ""}`,
    "decline-order": `РћС‚РєР°Р·Р°С‚СЊСЃСЏ РѕС‚ Р·Р°РєР°Р·Р° #${payload.orderId || ""}`,
    "delete-order": `РЈРґР°Р»РёС‚СЊ Р·Р°РєР°Р· #${payload.id || ""}`,
    "delete-employee": `РЈРґР°Р»РёС‚СЊ СЃРѕС‚СЂСѓРґРЅРёРєР° #${payload.id || ""}`,
    "create-program": `Р”РѕР±Р°РІРёС‚СЊ РїСЂРѕРіСЂР°РјРјСѓ: ${payload.title || ""}`,
    "create-prop": `Р”РѕР±Р°РІРёС‚СЊ СЂРµРєРІРёР·РёС‚: ${payload.name || ""}`,
  }[action.type] || actionToast(action.type);
}

function syncScreen() {
  const queue = state.syncQueue.filter((action) => action.status !== "synced");
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="${state.user.hasAccess ? "home" : "denied"}">вЂ№</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">РЎРёРЅС…СЂРѕРЅРёР·Р°С†РёСЏ</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">Рљ РѕС‚РїСЂР°РІРєРµ: ${queue.length}</h2>
        <p class="small-text">Р—РґРµСЃСЊ РјРѕР¶РЅРѕ РїРѕРІС‚РѕСЂРёС‚СЊ РѕС‚РїСЂР°РІРєСѓ РёР»Рё РѕС‚РјРµРЅРёС‚СЊ Р·Р°РІРёСЃС€СѓСЋ РѕРїРµСЂР°С†РёСЋ.</p>
      </section>
      <button class="primary-button" data-action="sync-queue">РџРѕРІС‚РѕСЂРёС‚СЊ РѕС‚РїСЂР°РІРєСѓ</button>
      <button class="secondary-button" data-action="refresh-data">РћР±РЅРѕРІРёС‚СЊ РґРѕСЃС‚СѓРї Рё РґР°РЅРЅС‹Рµ</button>
      <div class="orders-stack">
        ${
          queue.length
            ? queue
                .map(
                  (action) => `
                    <section class="panel">
                      <h2 class="panel-title">${actionTitle(action)}</h2>
                      <div class="detail-grid">
                        <div class="detail-line"><span>РЎС‚Р°С‚СѓСЃ</span><strong>${action.status || "ready"}</strong></div>
                        <div class="detail-line"><span>РЎРѕР·РґР°РЅРѕ</span><strong>${new Date(action.createdAt).toLocaleString("ru-RU")}</strong></div>
                      </div>
                      ${action.error ? `<p class="small-text" style="margin-top: 8px">${action.error}</p>` : ""}
                      <button class="secondary-button danger-button" style="margin-top: 10px" data-action="cancel-sync-action" data-sync-id="${action.id}">РћС‚РјРµРЅРёС‚СЊ РѕРїРµСЂР°С†РёСЋ</button>
                    </section>
                  `
                )
                .join("")
            : `<div class="empty-state">РћС‡РµСЂРµРґСЊ РїСѓСЃС‚Р°</div>`
        }
      </div>
    </div>
  `, true);
}

function statusText(status) {
  return {
    available: "Р”РѕСЃС‚СѓРїРЅРѕ",
    mine: "РЈ РјРµРЅСЏ",
    busy: "Р—Р°РЅСЏС‚Рѕ",
    repair: "РџСЂРѕРІРµСЂРєР°",
  }[status] || status;
}

function render() {
  const previousRoute = render.previousRoute;
  const previousScreen = document.querySelector(".screen");
  const previousScrollTop = previousScreen?.scrollTop || 0;
  const activeElement = document.activeElement;
  const restorePropSearch = activeElement?.matches?.("[data-prop-search]");
  const propSearchSelection = restorePropSearch ? activeElement.selectionStart : null;
  const screens = {
    "auth-confirm": authConfirmScreen,
    avatar: avatarScreen,
    checking: checkingScreen,
    denied: deniedScreen,
    home: homeScreen,
    admin: adminScreen,
    help: helpScreen,
    version: versionScreen,
    orders: ordersScreen,
    order: orderScreen,
    "new-order": newOrderScreen,
    props: propsScreen,
    kit: kitScreen,
    programs: programsScreen,
    "program-detail": programDetailScreen,
    saved: savedScreen,
    profile: profileScreen,
    "admin-employee-detail": adminEmployeeDetailScreen,
    company: companyScreen,
    report: reportScreen,
    sync: syncScreen,
    "admin-employees": adminEmployeesScreen,
    "admin-ambassadors": adminAmbassadorsScreen,
    "admin-promos": adminPromosScreen,
    "admin-program": adminProgramScreen,
    "admin-prop": adminPropScreen,
    "admin-reports": adminReportsScreen,
  };

  document.querySelector("#app").innerHTML = (screens[state.route] || homeScreen)();
  if (previousRoute === state.route) {
    const screen = document.querySelector(".screen");
    if (screen) screen.scrollTop = previousScrollTop;
  }
  if (restorePropSearch) {
    const input = document.querySelector("[data-prop-search]");
    input?.focus?.();
    if (input && propSearchSelection !== null) input.setSelectionRange(propSearchSelection, propSearchSelection);
  }
  render.previousRoute = state.route;
}

document.addEventListener("click", async (event) => {
  const routeButton = event.target.closest("[data-route]");
  const actionButton = event.target.closest("[data-action]");
  const urlButton = event.target.closest("[data-open-url]");
  const filterButton = event.target.closest("[data-filter]");
  const orderFilterButton = event.target.closest("[data-order-filter]");
  const earningsPeriodButton = event.target.closest("[data-earnings-period]");
  const roleButton = event.target.closest("[data-role]");

  if (roleButton) {
    setRole(roleButton.dataset.role);
    return;
  }

  if (filterButton) {
    state.filter = filterButton.dataset.filter;
    render();
    return;
  }

  if (orderFilterButton) {
    state.orderFilter = orderFilterButton.dataset.orderFilter;
    render();
    return;
  }

  if (earningsPeriodButton) {
    state.earningsPeriod = earningsPeriodButton.dataset.earningsPeriod;
    render();
    return;
  }

  if (urlButton) {
    const url = urlButton.dataset.openUrl;
    tg?.openLink?.(url);
    if (!tg) window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  if (routeButton) {
    if (routeButton.dataset.route === "version") {
      if (state.route === "version") return;
      openVersionScreen();
      return;
    }
    if (routeButton.dataset.route === "help") {
      if (state.route === "help") return;
      openHelpScreen();
      return;
    }
    const options = {};
    if (routeButton.dataset.orderId) options.activeOrderId = Number(routeButton.dataset.orderId);
    if (routeButton.dataset.programId) options.activeProgramId = Number(routeButton.dataset.programId);
    if (routeButton.dataset.employeeId) options.activeEmployeeId = Number(routeButton.dataset.employeeId);
    setRoute(routeButton.dataset.route, options);
    return;
  }

  if (!actionButton) return;

  const action = actionButton.dataset.action;
  const orderId = Number(actionButton.dataset.orderId || state.activeOrderId);

  if (action === "take-kit") {
    takeKit(orderId);
  }

  if (action === "take-prop") {
    takeProp(Number(actionButton.dataset.propId));
  }

  if (action === "accept-order") {
    acceptOrder(orderId);
  }

  if (action === "decline-order") {
    declineOrder(orderId);
  }

  if (action === "save-trip") {
    saveForTrip(orderId);
  }

  if (action === "refresh-data") {
    state.toast = "РЎРёРЅС…СЂРѕРЅРёР·РёСЂСѓРµРј...";
    render();
    await Promise.all(pendingActions().map((item) => sendAction(item)));
    const hasAccess = await loadRemoteData({ renderAfter: false });
    state.toast = hasAccess ? "Р”РѕСЃС‚СѓРї РѕР±РЅРѕРІР»РµРЅ" : "Р”РѕСЃС‚СѓРї РЅРµ РЅР°Р№РґРµРЅ";
    setRoute(hasAccess ? state.route : "denied");
    clearToastLater();
  }

  if (action === "sync-queue") {
    state.toast = "РћС‚РїСЂР°РІР»СЏРµРј РѕС‡РµСЂРµРґСЊ...";
    render();
    await Promise.all(pendingActions().map((item) => sendAction(item)));
    state.toast = pendingActions().length ? "Р§Р°СЃС‚СЊ РѕРїРµСЂР°С†РёР№ РѕСЃС‚Р°Р»Р°СЃСЊ РІ РѕС‡РµСЂРµРґРё" : "Р’СЃРµ РѕС‚РїСЂР°РІР»РµРЅРѕ";
    render();
    clearToastLater();
  }

  if (action === "cancel-sync-action") {
    if (!confirmDelete("РѕРїРµСЂР°С†РёСЋ РёР· РѕС‡РµСЂРµРґРё")) return;
    cancelSyncAction(Number(actionButton.dataset.syncId));
  }

  if (action === "toggle-time-editor") {
    state.timeEditorOpen = true;
    render();
  }

  if (action === "adjust-booking-time") {
    adjustBookingTime(actionButton.dataset.timeField, Number(actionButton.dataset.timeDelta || 0));
    render();
  }

  if (action === "set-app-theme") {
    state.appTheme = actionButton.dataset.appTheme || "dark";
    state.themeBurst = true;
    localStorage.setItem("appTheme", state.appTheme);
    render();
    window.setTimeout(() => {
      state.themeBurst = false;
      render();
    }, 850);
  }

  if (action === "open-native-time") {
    const input = document.querySelector(`[data-native-time="${actionButton.dataset.timeField}"]`);
    input?.focus?.();
    input?.showPicker?.();
    input?.click?.();
  }

  if (action === "toggle-bonus-form") {
    state.bonusFormOpen = !state.bonusFormOpen;
    render();
  }

  if (action === "close-version") {
    state.versionGlow = false;
    localStorage.setItem("versionSeen", APP_VERSION);
    const target = ["checking", "denied", "auth-confirm", "version"].includes(state.previousRoute) ? "home" : state.previousRoute || "home";
    setRoute(target);
  }

  if (action === "close-help") {
    const target = ["checking", "denied", "auth-confirm", "help"].includes(state.previousRoute) ? "home" : state.previousRoute || "home";
    setRoute(target);
  }

  if (action === "toggle-order-edit") {
    state.orderEditMode = !state.orderEditMode;
    render();
  }

  if (action === "toggle-order-detail-edit") {
    state.orderDetailEditMode = !state.orderDetailEditMode;
    render();
  }

  if (action === "toggle-ambassador-edit") {
    state.ambassadorEditMode = !state.ambassadorEditMode;
    render();
  }

  if (action === "save-ambassador") {
    saveAmbassador(Number(actionButton.dataset.employeeId));
  }

  if (action === "toggle-program-edit") {
    state.programEditMode = !state.programEditMode;
    render();
  }

  if (action === "apply-discount") {
    applyDiscountCode();
  }

  if (action === "calendar-prev" || action === "calendar-next") {
    const date = new Date(`${state.booking.date}T00:00:00`);
    date.setMonth(date.getMonth() + (action === "calendar-next" ? 1 : -1));
    state.booking.date = localIsoDate(date);
    render();
  }

  if (action === "create-order") {
    createOrder();
  }

  if (action === "create-employee") {
    addEmployee();
  }

  if (action === "create-promo") {
    addPromoCode();
  }

  if (action === "withdraw-bunny") {
    requestBunnyWithdraw();
  }

  if (action === "create-program") {
    addProgram();
  }

  if (action === "save-program") {
    saveProgramChanges(Number(actionButton.dataset.programId || state.activeProgramId));
  }

  if (action === "create-prop") {
    addProp();
  }

  if (action === "toggle-prop-edit") {
    state.propEditMode = !state.propEditMode;
    render();
  }

  if (action === "program-kit-builder") {
    state.kitBuilderProgramId = state.route === "admin-program" ? "draft" : state.activeProgramId || "draft";
    state.kitBuilderReturnRoute = state.route === "admin-program" ? "admin-program" : state.route === "program-detail" ? "program-detail" : "";
    state.propEditMode = true;
    state.toast = "Р’С‹Р±РµСЂРёС‚Рµ СЂРµРєРІРёР·РёС‚ РґР»СЏ РєРѕРјРїР»РµРєС‚Р° РїСЂРѕРіСЂР°РјРјС‹";
    setRoute("admin-prop");
    clearToastLater();
  }

  if (action === "toggle-program-kit-prop") {
    toggleProgramKitProp(Number(actionButton.dataset.propId));
  }

  if (action === "save-program-kit") {
    saveProgramKit();
  }

  if (action === "add-extra") {
    addEditableExtra();
  }

  if (action === "toggle-extra-edit") {
    state.extraEditMode = !state.extraEditMode;
    render();
  }

  if (action === "delete-extra") {
    removeEditableExtra(actionButton.dataset.extraTitle);
  }

  if (action === "create-bonus") {
    addBonus();
  }

  if (action === "annul-order") {
    annulOrder(orderId);
  }

  if (action === "delete-order-pay") {
    if (!confirmDelete("РЅР°С‡РёСЃР»РµРЅРЅСѓСЋ Р·Р°СЂРїР»Р°С‚Сѓ")) return;
    deleteOrderPay(orderId);
  }

  if (action === "increase-accepted") {
    adjustEmployeeAccepted(Number(actionButton.dataset.employeeId), 1);
  }

  if (action === "decrease-accepted") {
    adjustEmployeeAccepted(Number(actionButton.dataset.employeeId), -1);
  }

  if (action === "delete-bonus") {
    if (!confirmDelete("РґРѕРїРѕР»РЅРёС‚РµР»СЊРЅСѓСЋ РІС‹РїР»Р°С‚Сѓ")) return;
    deleteBonus(Number(actionButton.dataset.bonusId));
  }

  if (action === "delete-employee") {
    if (!confirmDelete("СЃРѕС‚СЂСѓРґРЅРёРєР°")) return;
    deleteEmployee(Number(actionButton.dataset.employeeId));
  }

  if (action === "delete-order") {
    if (!confirmDelete("Р·Р°РєР°Р·")) return;
    deleteOrder(Number(actionButton.dataset.orderId));
  }

  if (action === "delete-program") {
    if (!confirmDelete("РїСЂРѕРіСЂР°РјРјСѓ")) return;
    deleteProgram(Number(actionButton.dataset.programId));
  }

  if (action === "delete-prop") {
    if (!confirmDelete("СЂРµРєРІРёР·РёС‚")) return;
    deleteProp(Number(actionButton.dataset.propId));
  }

  if (action === "delete-report") {
    if (!confirmDelete("СЃРѕРѕР±С‰РµРЅРёРµ РѕР± РѕС€РёР±РєРµ")) return;
    deleteReport(Number(actionButton.dataset.reportId));
  }

  if (action === "return-prop") {
    returnProp(Number(actionButton.dataset.propId));
  }

  if (action === "confirm-auth") {
    localStorage.setItem("authConfirmed", "true");
    setRoute("checking");
  }

  if (action === "deny-auth") {
    state.toast = "Р’С…РѕРґ РѕС‚РјРµРЅРµРЅ";
    render();
    clearToastLater();
  }

  if (action === "report" || action === "contact-admin") {
    setRoute("report");
  }

  if (action === "send-report") {
    sendReport();
  }
});

document.addEventListener("input", (event) => {
  const extraDraftInput = event.target.closest("[data-extra-draft]");
  if (extraDraftInput) {
    state.extraDraft = extraDraftInput.value;
    return;
  }

  const extraDraftPriceInput = event.target.closest("[data-extra-draft-price]");
  if (extraDraftPriceInput) {
    state.extraDraftPrice = extraDraftPriceInput.value;
    return;
  }

  const extraPriceInput = event.target.closest("[data-extra-price]");
  if (extraPriceInput) {
    updateEditableExtraPrice(extraPriceInput.dataset.extraPrice, extraPriceInput.value);
    return;
  }

  const orderPayInput = event.target.closest("[data-order-pay]");
  if (orderPayInput) {
    updateOrderPay(Number(orderPayInput.dataset.orderPay), orderPayInput.value);
    return;
  }

  const bonusAmountInput = event.target.closest("[data-bonus-amount]");
  if (bonusAmountInput) {
    updateBonusAmount(Number(bonusAmountInput.dataset.bonusAmount), bonusAmountInput.value);
    return;
  }

  const programFieldInput = event.target.closest("[data-program-field]");
  if (programFieldInput) {
    updateProgramField(Number(programFieldInput.dataset.programId), programFieldInput.dataset.programField, programFieldInput.value);
    return;
  }

  const reportInput = event.target.closest("[data-report-text]");
  if (reportInput) {
    state.reportText = reportInput.value;
    return;
  }

  const ambassadorInput = event.target.closest("[data-ambassador-field]");
  if (ambassadorInput) {
    updateAmbassadorDraft(Number(ambassadorInput.dataset.ambassadorId), ambassadorInput.dataset.ambassadorField, ambassadorInput.value);
    return;
  }

  const input = event.target.closest("[data-booking]");
  if (!input) return;

  const key = input.dataset.booking;
  state.booking[key] = input.type === "number" || input.tagName === "SELECT" ? Number(input.value) : input.value;
});

document.addEventListener("input", (event) => {
  const propSearchInput = event.target.closest("[data-prop-search]");
  if (propSearchInput) {
    state.propSearch = propSearchInput.value;
    render();
    return;
  }

  const input = event.target.closest("[data-admin-field]");
  if (!input) return;

  const [group, key] = input.dataset.adminField.split(".");
  state[group][key] = input.type === "checkbox" ? input.checked : group === "newBonus" && key === "amount" ? input.value : input.type === "number" ? Number(input.value) : input.value;
});

document.addEventListener("change", (event) => {
  const propCellSelect = event.target.closest("[data-prop-cell-filter]");
  if (propCellSelect) {
    state.propCellFilter = propCellSelect.value;
    render();
    return;
  }

  const bookingInput = event.target.closest("[data-booking]");
  if (bookingInput) {
    const key = bookingInput.dataset.booking;
    state.booking[key] = bookingInput.type === "number" || bookingInput.tagName === "SELECT" ? Number(bookingInput.value) : bookingInput.value;
    render();
    return;
  }

  const nativeTimeInput = event.target.closest("[data-native-time]");
  if (nativeTimeInput) {
    state.booking[nativeTimeInput.dataset.nativeTime] = nativeTimeInput.value;
    const start = timeToMinutes(state.booking.start);
    const end = timeToMinutes(state.booking.end);
    if (end <= start) state.booking.end = minutesToTime(start + 60);
    render();
    return;
  }

  const orderPayInput = event.target.closest("[data-order-pay]");
  if (orderPayInput) {
    const orderId = Number(orderPayInput.dataset.orderPay);
    updateOrderPay(orderId, orderPayInput.value);
    queueAction("update-order-pay", { orderId, actorPay: Number(orderPayInput.value || 0) });
    return;
  }

  const bonusAmountInput = event.target.closest("[data-bonus-amount]");
  if (bonusAmountInput) {
    const id = Number(bonusAmountInput.dataset.bonusAmount);
    updateBonusAmount(id, bonusAmountInput.value);
    queueAction("update-bonus", { id, amount: Number(bonusAmountInput.value || 0) });
    return;
  }

  const employeeTotalInput = event.target.closest("[data-employee-total]");
  if (employeeTotalInput) {
    setEmployeeTotal(Number(employeeTotalInput.dataset.employeeTotal), employeeTotalInput.value);
    return;
  }

  const input = event.target.closest("[data-admin-field]");
  if (!input) return;

  const [group, key] = input.dataset.adminField.split(".");
  state[group][key] = input.type === "checkbox" ? input.checked : input.value;
  if (group === "newEmployee" && key === "isAmbassador") {
    if (input.checked) state.newEmployee.isAdmin = false;
    state.newEmployee.ambassadorCode = input.checked ? suggestedEmployeeAmbassadorCode() : "";
    render();
  }
  if (group === "newEmployee" && key === "isAdmin" && input.checked) {
    state.newEmployee.isAmbassador = false;
    state.newEmployee.ambassadorCode = "";
    render();
  }
});

document.addEventListener("change", (event) => {
  const packageInput = event.target.closest('input[name="package"]');
  const extraInput = event.target.closest("[data-extra]");

  if (packageInput) {
    state.booking.package = packageInput.value;
    render();
    return;
  }

  if (extraInput) {
    const value = extraInput.dataset.extra;
    state.booking.extras = extraInput.checked
      ? [...new Set([...state.booking.extras, value])]
      : state.booking.extras.filter((item) => item !== value);
    render();
  }
});

document.addEventListener("click", (event) => {
  const dateButton = event.target.closest("[data-date]");
  if (!dateButton) return;

  state.booking.date = dateButton.dataset.date;
  state.timeEditorOpen = true;
  render();
});

window.addEventListener("online", () => {
  syncPendingActions();
  render();
});
window.addEventListener("offline", render);
window.setInterval(syncPendingActions, 15000);

render();
loadRemoteData();
syncPendingActions();

