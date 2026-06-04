const tg = window.Telegram?.WebApp;

if (tg) {
  document.body.classList.add("telegram-runtime");
  tg.ready();
  tg.expand();
  tg.setHeaderColor?.("#ff8a22");
  tg.setBackgroundColor?.("#ff8a22");
}

const API_BASE = window.TOCHKA_API_URL || localStorage.getItem("tochkaApiUrl") || "";
const APP_VERSION = "2026.06.04-03";
const COMPANY_SITE_URL = "https://bunnybon57.ru/";
const COMPANY_VK_URL = "https://vk.com/bunnybon57";
const releaseNotes = [
  "Добавлен админский экран редактирования амбассадоров: код, заработанные банни и сумма на выводе.",
  "У амбассадора скрыты разделы заказов, программ, реквизита и сохраненного.",
  "В добавлении заказа у амбассадора снова отображается его личный код.",
  "Редактирование амбассадора теперь синхронизируется с Supabase.",
  "Код амбассадора теперь задается только при выдаче прав амбассадора.",
  "Поле кода амбассадора убрано из создания заказа.",
  "Исправлена проверка доступа после синхронизации.",
  "Telegram ID и ID сотрудника теперь хранятся отдельно.",
  "Добавлен экран очереди синхронизации с отменой операций.",
  "Зависшие операции теперь можно удалить вручную.",
  "На экране доступа показывается Telegram ID и username для проверки сотрудника.",
  "Исправлена зависшая очередь синхронизации.",
  "Ошибки API теперь отображаются понятнее.",
  "Исправлена выдача доступа новым сотрудникам.",
  "Исправлена синхронизация сотрудников без кода амбассадора.",
  "Проверка доступа теперь ждет ответ базы.",
  "Кнопка обновления доступа корректно перепроверяет сотрудника.",
  "Экран обращения к админу возвращает на экран доступа.",
  "Добавлена роль амбассадора.",
  "Админ может добавлять промокоды.",
  "Доступ в приложение выдает только администратор.",
  "У амбассадора появились личный код, банни и заявка на вывод.",
  "Починен поиск по реквизиту.",
  "Добавлен фильтр реквизита по номеру ячейки.",
  "Поиск теперь смотрит название и место хранения.",
  "Фильтр статуса, поиск и ячейка работают вместе.",
  "Список ячеек собирается автоматически из реквизита.",
];

const telegramUser = tg?.initDataUnsafe?.user;
const initialTelegramId = telegramUser?.id ?? 101;

const mockUser = {
  id: initialTelegramId,
  telegramId: initialTelegramId,
  firstName: tg?.initDataUnsafe?.user?.first_name ?? "Даша",
  username: telegramUser?.username ?? "local_user",
  photoUrl: telegramUser?.photo_url ?? "",
  role: "actor",
  hasAccess: !API_BASE,
};

let employees = readStorage("employees", [
  { id: 101, name: "Даша", efficiency: 86, accepted: 12, late: 1, rating: 4.8 },
  { id: 102, name: "Илья", efficiency: 74, accepted: 8, late: 2, rating: 4.4 },
  { id: 103, name: "Маша", efficiency: 92, accepted: 16, late: 0, rating: 4.9 },
]);

let reports = [
  { id: 1, actorName: "Даша", text: "Не открылась музыка в программе", createdAt: "01.06.2026 14:20", status: "new" },
  { id: 2, actorName: "Илья", text: "Нет баннера в комплекте", createdAt: "01.06.2026 15:05", status: "new" },
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
    package: "2 актера, до 20 человек",
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
  newProp: { name: "", place: "Склад", status: "available", kit: true },
};

let orders = [
  {
    id: 1,
    title: "Челлендж Пати Влада А4",
    date: "01.06.2026",
    time: "18:00",
    address: "ул. Солнечная, 14",
    role: "Ведущая",
    actors: ["Даша", "Илья"],
    status: "Подтвержден",
    kitStatus: "Комплект не взят",
    available: "14 из 16 доступно",
  },
  {
    id: 2,
    title: "Челлендж Пати Влада А4",
    date: "02.06.2026",
    time: "18:00",
    address: "пр-т Мира, 8",
    role: "Актер",
    actors: ["Даша"],
    status: "Новый",
    kitStatus: "Комплект не взят",
    available: "16 из 16 доступно",
  },
  {
    id: 3,
    title: "Челлендж Пати Влада А4",
    date: "03.06.2026",
    time: "18:00",
    address: "ул. Парковая, 2",
    role: "Ведущая",
    actors: ["Даша", "Маша"],
    status: "Подтвержден",
    kitStatus: "Комплект у вас",
    available: "16 из 16 доступно",
  },
];

orders = readStorage("orders", []);

let props = [
  { id: 1, name: "Колонка JBL #1", status: "available", place: "Склад", kit: true },
  { id: 2, name: "Микрофон #2", status: "mine", place: "У Даши", kit: true },
  { id: 3, name: "Карточки заданий А4", status: "available", place: "Склад", kit: true },
  { id: 4, name: "Баннер челлендж", status: "busy", place: "У Ильи", kit: true },
  { id: 5, name: "Реквизитный ящик", status: "available", place: "Склад", kit: true },
  { id: 6, name: "Кнопка ответа", status: "repair", place: "На проверке", kit: false },
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
    title: "Челлендж Пати Влада А4",
    age: "7-12 лет",
    duration: "120 минут",
    pricePerHour: 4500,
    actorPayPerHour: 1600,
    tracks: ["Выход ведущего", "Конкурс 1", "Финал"],
  },
  {
    id: 2,
    title: "Крио-шоу",
    age: "5-12 лет",
    duration: "60 минут",
    pricePerHour: 6200,
    actorPayPerHour: 1900,
    tracks: ["Старт шоу", "Эксперимент", "Финал"],
  },
];

let programs = readStorage("programs", defaultPrograms);

const packageOptions = [
  { label: "Шоу программа", actors: 1, multiplier: 1 },
  { label: "1 актер до 10 человек", actors: 1, multiplier: 1 },
  { label: "2 актера, до 20 человек", actors: 2, multiplier: 1.35 },
  { label: "2 актера, до 30 человек", actors: 2, multiplier: 1.55 },
  { label: "3 актера, до 35 человек", actors: 3, multiplier: 1.9 },
];

const packageRates = [0, 416.67, 500, 666.67, 833.33];

const showPrograms = ["Научное шоу", "Шоу мыльных пузырей", "Бумажное шоу"];

const extras = [
  "Генератор мыльных пузырей",
  "Няня для детей",
  "Аквагрим",
  "Оформление фото зоны",
  "Шоу красок Холли",
  "Попкорн",
];

let editableExtras = readStorage("editableExtras", extras).map((item) =>
  typeof item === "string" ? { title: item, price: 0 } : { title: item.title, price: Number(item.price || 0) }
);

const animationPrograms = [
  "Уэнсдей и Энид",
  "Барби и Кен",
  "Холодное сердце",
  "Вечеринка Влада А4",
  "Три Кота",
  "Бременские музыканты",
  "Пижамная вечеринка",
  "Вечер настольных игр",
  "Кулинарное шоу",
  "Вечеринка в цирке",
  "Последний герой",
  "Мишки МО и МИ",
  "Приключение Гарри Поттера и Гермионы",
  "Уэнсдей",
  "Барби",
  "Человек паук",
  "Коралина в стране кошмаров",
  "Игра в кальмара 2",
  "Шпион (по мотивам амонг ас)",
  "Леон (по мотивам бравл Старс)",
  "Симка и Нолик",
  "Леди баг и супер кот",
  "Мафия",
  "Зомби-апокалипсис",
];

const expressPrograms = [
  "Экспресс-поздравление панды Яши",
  "Экспресс-поздравление гуся Витали",
  "Экспресс-поздравление мишки Лео",
  "Экспресс-поздравление Зайки Лии",
  "Экспресс-поздравление динозавра Эрика",
  "Экспресс-поздравление Ути Пути",
];

const masterClasses = [
  "Мастер-класс слайм",
  "Мастер-класс по росписи пряников",
  "Мастер-класс таба лапка",
  "Мастер-класс по рисованию картин",
  "Мастер-класс украшение из эпоксидной смолы",
];

function saveState() {
  localStorage.setItem("syncQueue", JSON.stringify(state.syncQueue));
  localStorage.setItem("employees", JSON.stringify(employees));
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
    admin: "админ",
    ambassador: "амбассадор",
    actor: "актер",
  }[role] || "актер";
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

    employees = mergeQueuedEmployees(withoutDeleted(data.employees || employees, "employees").map(normalizeEmployee));
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
      state.toast = "Не удалось проверить доступ";
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
    state.toast = `Ошибка синхронизации: ${action.error}`;
    action.status = "offline";
    saveState();
    render();
    clearToastLater();
  }
}

function shortError(message = "") {
  const text = String(message);
  if (text.includes("ambassador_code") || text.includes("BUNNY-")) return "Код амбассадора уже есть в базе";
  if (text.includes("duplicate key")) return "Такая запись уже есть в базе";
  if (text.includes("violates unique constraint")) return "Нарушена уникальность записи";
  return text.length > 120 ? `${text.slice(0, 120)}...` : text;
}

function cancelSyncAction(id) {
  state.syncQueue = state.syncQueue.filter((action) => Number(action.id) !== Number(id));
  saveState();
  state.toast = "Операция отменена";
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

function mergeQueuedEmployees(remoteEmployees) {
  const remoteIds = new Set(remoteEmployees.map((employee) => String(employee.id)));
  const deleted = new Set((state.deletedEntities.employees || []).map(String));
  const localEmployees = employees
    .map(normalizeEmployee)
    .filter((employee) => Number(employee.id) > 1000000000000 && !remoteIds.has(String(employee.id)) && !deleted.has(String(employee.id)));
  const queuedEmployees = state.syncQueue
    .filter((action) => action.type === "create-employee" && action.payload)
    .map((action) => normalizeEmployee(action.payload))
    .filter((employee) => employee.id && !remoteIds.has(String(employee.id)) && !deleted.has(String(employee.id)));

  const merged = [...queuedEmployees, ...localEmployees, ...remoteEmployees];
  const seen = new Set();
  return merged.filter((employee) => {
    const id = String(employee.id);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
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

function confirmDelete(label = "элемент") {
  return window.confirm(`Точно удалить ${label}? Это действие нельзя отменить.`);
}

function setRoute(route, options = {}) {
  Object.assign(state, options);
  state.route = route;
  render();
}

function setRole(role) {
  state.user.role = role;
  state.themeBurst = true;
  state.toast = `Режим: ${roleLabel(role)}`;
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
  props = props.map((item) => (item.id === propId ? { ...item, status: "mine", place: `У ${state.user.firstName}` } : item));
  queueAction("take-prop", { propId, actorId: state.user.id });
}

function takeKit(orderId = state.activeOrderId) {
  const order = orders.find((item) => Number(item.id) === Number(orderId)) || getActiveOrder();
  const program = getProgramForOrder(order);
  const kitIds = new Set((state.programKits[String(program?.id)] || []).map(Number));
  const targetIds = kitIds.size ? kitIds : new Set(props.filter((item) => item.kit).map((item) => Number(item.id)));
  props = props.map((item) =>
    targetIds.has(Number(item.id)) ? { ...item, status: "mine", place: `У ${state.user.firstName}` } : item
  );
  orders = orders.map((item) =>
    Number(item.id) === Number(orderId) ? { ...item, kitStatus: `Комплект у ${state.user.firstName}` } : item
  );
  queueAction("take-kit", { orderId, actorId: state.user.id, propIds: [...targetIds] });
  state.toast = `Комплект у ${state.user.firstName}`;
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
  const match = String(order?.role || "").match(/(\d+)\s*актер/i);
  return match ? Number(match[1]) : 1;
}

function returnProp(propId) {
  props = props.map((item) => (item.id === propId ? { ...item, status: "available", place: "Склад" } : item));
  queueAction("return-prop", { propId, actorId: state.user.id });
}

function acceptOrder(orderId) {
  const order = orders.find((item) => Number(item.id) === Number(orderId));
  const current = acceptedListForOrder(orderId);
  if (current.some((accepted) => Number(accepted.actorId) === Number(state.user.id))) return;
  if (current.length >= orderActorLimit(order)) {
    state.toast = "Все места актеров уже заняты";
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
  state.toast = "Заказ принят";
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
  state.toast = "Вы отказались от заказа";
  saveState();
  render();
  clearToastLater();
}

function actionToast(type) {
  return {
    "take-kit": "Комплект добавлен в очередь",
    "take-prop": "Реквизит у вас",
    "return-prop": "Реквизит возвращен",
    "accept-order": "Заказ принят",
    "decline-order": "Отказ от заказа сохранен",
    "create-order": "Заказ добавлен",
    "create-bonus": "Дополнительная выплата начислена",
    "create-promo": "Промокод добавлен",
    "withdraw-bunny": "Заявка на вывод отправлена",
    "update-ambassador": "Амбассадор обновлен",
    "update-employee-access": "Права сотрудника обновлены",
    "update-order-pay": "Зарплата скорректирована",
    "delete-order-pay": "Зарплата удалена",
    "annul-order": "Принятие заказа аннулировано",
    report: "Ошибка отправлена",
  }[type] || "Действие сохранено";
}

function addEmployee() {
  const name = state.newEmployee.name.trim();
  if (!name) return;
  const role = state.newEmployee.isAdmin ? "admin" : state.newEmployee.isAmbassador ? "ambassador" : "actor";
  const ambassadorCode = role === "ambassador" ? (state.newEmployee.ambassadorCode.trim() || makeAmbassadorCode(state.newEmployee.username || name)) : "";
  const id = Date.now();
  const employee = {
    id,
    name,
    role,
    username: state.newEmployee.username,
    telegramId: null,
    isActive: true,
    ambassadorCode,
    bunnyBalance: 0,
    bunnyPending: 0,
    efficiency: 0,
    accepted: 0,
    late: 0,
    rating: 0,
  };
  employees = [
    ...employees,
    employee,
  ];
  queueAction("create-employee", { ...employee, isAdmin: role === "admin", isAmbassador: role === "ambassador" });
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
  state.toast = "Промокод добавлен";
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
    state.toast = "Промокод не найден";
    render();
    clearToastLater();
    return;
  }
  state.booking.discount = Number(promo.discount || 0);
  state.toast = `Скидка ${money(state.booking.discount)}`;
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
    state.toast = "Баллов пока нет";
    render();
    clearToastLater();
    return;
  }
  if (!canWithdrawBunny()) {
    state.toast = "Вывод доступен 30/31 числа";
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
  state.toast = "Заявка на вывод отправлена";
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
      place: state.newProp.place || "Склад",
      kit: Boolean(state.newProp.kit),
    },
  ];
  queueAction("create-prop", { ...state.newProp });
  state.newProp = { name: "", place: "Склад", status: "available", kit: true };
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
  state.toast = "Комплект программы сохранен";
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
  if (Number(id) === Number(state.user.id)) {
    state.toast = "Нельзя удалить свой аккаунт";
    render();
    clearToastLater();
    return;
  }
  employees = employees.filter((employee) => employee.id !== id);
  rememberDeleted("employees", id);
  queueAction("delete-employee", { id });
}

function updateEmployeeAccess(id, field, value) {
  let shouldRender = false;
  employees = employees.map((employee) => {
    if (Number(employee.id) !== Number(id)) return employee;
    const next = { ...employee };
    if (field === "role") {
      next.role = value;
      shouldRender = true;
      if (value !== "ambassador") {
        next.ambassadorCode = "";
        next.bunnyBalance = 0;
        next.bunnyPending = 0;
      } else if (!next.ambassadorCode) {
        next.ambassadorCode = makeAmbassadorCode(next.username || next.name);
      }
    } else if (field === "ambassadorCode") {
      next.ambassadorCode = value;
    }
    return next;
  });
  saveState();
  if (shouldRender) render();
}

function saveEmployeeAccess(id) {
  const employee = employees.find((item) => Number(item.id) === Number(id));
  if (!employee) return;
  queueAction("update-employee-access", {
    id: employee.id,
    name: employee.name,
    username: employee.username || "",
    role: employee.role || "actor",
    ambassadorCode: employee.role === "ambassador" ? String(employee.ambassadorCode || "").trim() : "",
    bunnyBalance: Number(employee.bunnyBalance || 0),
    bunnyPending: Number(employee.bunnyPending || 0),
  });
}

function deleteOrder(id) {
  orders = orders.filter((order) => order.id !== id);
  delete state.acceptedOrders[id];
  rememberDeleted("orders", id);
  queueAction("delete-order", { id });
  setRoute(state.user.role === "ambassador" ? "home" : "orders");
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
  state.toast = "Принятие заказа аннулировано";
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
  state.toast = "Зарплата по заказу удалена";
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
  state.toast = "Программа обновлена";
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
    state.toast = "Сначала добавьте программу";
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
    address: state.booking.address || "Адрес не указан",
    role: state.booking.package,
    actors: [state.user.firstName],
    programId: calc.program.id,
    end: state.booking.end,
    durationMinutes: calc.durationMinutes,
    promoCode: state.booking.promoCode || "",
    ambassadorCode: state.user.role === "ambassador" ? (state.booking.ambassadorCode || currentAmbassadorCode()) : "",
    status: "Новый",
    kitStatus: "Комплект не взят",
    available: "Проверяется",
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
  state.toast = "Заказ добавлен";
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
  state.toast = "Сохранено для выезда";
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

function orderCalculationSummary(order) {
  const parts = [];
  if (Number(order?.total || 0) > 0) parts.push(`Сумма: ${money(order.total)}`);
  if (Number(order?.actorPay || 0) > 0) parts.push(`ЗП: ${money(order.actorPay)}`);
  if (Number(order?.ambassadorBunny || 0) > 0) parts.push(`Банни: ${Number(order.ambassadorBunny)} Б`);
  return parts.length ? parts.join(" · ") : "Расчет появится после обновления заказа";
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
    comment: "Корректировка общей суммы",
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
  const match = String(item.place || "").match(/ячейка\s*([^\s,.;]+)/i);
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
          ["home", "Сегодня"],
          ["admin", "Админ"],
          ["orders", "Заказы"],
          ["programs", "Программы"],
          ["props", "Реквизит"],
          ["saved", "Сохранено"],
        ]
      : state.user.role === "ambassador"
        ? [
            ["home", "Сегодня"],
            ["new-order", "Заказ"],
            ["profile", "Профиль"],
            ["company", "О компании"],
          ]
        : [
          ["home", "Сегодня"],
          ["orders", "Заказы"],
          ["programs", "Программы"],
          ["props", "Реквизит"],
          ["saved", "Сохранено"],
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
  const text = pending ? `к отправке: ${pending}` : "все синхронизировано";
  return `<div class="sync-cluster"><button class="status-pill sync-pill-button ${pending ? "glow" : ""}" data-route="sync">${text}</button><button class="version-pill ${state.versionGlow ? "glow" : ""}" data-route="version">v${APP_VERSION}</button><button class="help-pill glow" data-route="help">Как пользоваться</button></div>`;
}

function money(value) {
  return `${Number(value).toLocaleString("ru-RU")} ₽`;
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
      <img class="brand-logo" src="./assets/logo.svg" alt="Точка праздника" />
      <div class="loading-ring"></div>
    </div>
    <p class="loading-note">Проверяем доступ...</p>
  `);
}

function authConfirmScreen() {
  return appFrame(`
    <div class="auth-card">
      <img class="brand-logo auth-logo" src="./assets/logo.svg" alt="Точка праздника" />
      <div class="auth-telegram">TG</div>
      <h1 class="page-title">Подтвердите вход</h1>
      <p class="small-text">Приложение получит ваше имя, Telegram ID и username, чтобы проверить доступ сотрудника.</p>
      <button class="primary-button" data-action="confirm-auth">Разрешить и войти</button>
      <button class="ghost-link" data-action="deny-auth">Отмена</button>
    </div>
  `);
}

function deniedScreen() {
  return appFrame(`
    <div class="tiny-pill access-code">404</div>
    <div class="access-card">
      <img class="asset asset-cross" src="./assets/access-cross.svg" alt="" />
      <h1 class="page-title">Доступ не найден</h1>
      <p class="small-text">Вас пока нет в списке сотрудников. Обратитесь к администратору.</p>
      <div class="notice" style="margin-top: 10px">
        Telegram ID: ${state.user.telegramId || telegramUser?.id || state.user.id}<br>
        Username: @${state.user.username || "не указан"}
      </div>
      <button class="primary-button" data-action="contact-admin">Написать администратору</button>
      <button class="ghost-link" data-route="checking">Обновить доступ</button>
    </div>
    <div class="footer-brand">Точка праздника<span>проект Банни Бон</span></div>
  `);
}

function versionScreen() {
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-action="close-version">‹</button>
      <span class="version-pill static-version-pill">v${APP_VERSION}</span>
    </div>
    <h1 class="page-title">Версия</h1>
    <div class="content-stack">
      <section class="panel version-panel">
        <h2 class="panel-title">v${APP_VERSION}</h2>
        <p class="small-text">История последних изменений приложения.</p>
      </section>
      <section class="panel">
        <h2 class="panel-title">Что изменилось</h2>
        <div class="orders-stack">
          ${releaseNotes.map((note) => `<div class="notice">${note}</div>`).join("")}
        </div>
      </section>
      <button class="primary-button" data-action="close-version">Закрыть</button>
    </div>
  `, true);
}

function openVersionScreen() {
  state.previousRoute = state.route === "version" ? state.previousRoute || "home" : state.route;
  setRoute("version");
}

function helpScreen() {
  const actorGuide = [
    ["Принять заказ", "Откройте Заказы, выберите актуальный заказ и нажмите Принять. Если мест уже нет, кнопка принятия станет недоступной."],
    ["Отказаться от заказа", "Откройте принятый заказ и нажмите Отказаться. Заказ уйдет из ваших принятых, а начисление по нему пересчитается."],
    ["Взять реквизит", "Перейдите в Реквизит или откройте комплект программы. Нажмите Взять, и реквизит сразу закрепится за вами, даже если вы офлайн."],
    ["Вернуть реквизит", "Откройте Реквизит, найдите предмет со статусом У меня и нажмите Вернуть. После синхронизации отметка уйдет в базу."],
    ["Программы", "Во вкладке Программы откройте нужную программу, смотрите сценарий, ссылку на диск и комплект реквизита."],
    ["Профиль", "В профиле видны принятые заказы, заработок за период, эффективность и реквизит, закрепленный за вами."],
    ["Ошибка", "Если что-то работает не так, нажмите Сообщить об ошибке. Сообщение сохранится и попадет админу после синхронизации."],
  ];
  const adminGuide = [
    ["Добавить заказ", "Во вкладке Админ нажмите Добавить заказ: выберите клиента, дату, время, программу, состав, дополнительные пункты и создайте заказ."],
    ["Сотрудники", "Во вкладке Админ добавьте сотрудника. По умолчанию он актер, а переключатель дает дополнительные функции администратора."],
    ["Принятие заказов", "Админ тоже может принимать заказы. В карточке заказа видно, кто уже принял заказ и сколько мест осталось."],
    ["Программы", "Добавляйте программу, ссылку на диск и полный сценарий. Через Собрать комплект закрепляйте нужный реквизит за программой."],
    ["Реквизит", "Добавляйте реквизит и редактируйте список. Удаление доступно только после режима Изменить и подтверждения."],
    ["Ошибки", "Во вкладке Админ откройте Ошибки, чтобы посмотреть сообщения пользователей и очистить обработанные."],
    ["Выплаты", "В профиле сотрудника можно смотреть эффективность, принятые заказы, выплаты и корректировать общую сумму при необходимости."],
  ];
  const ambassadorGuide = [
    ["Добавить заказ", "Откройте Заказы и нажмите Добавить заказ. В заказе укажите код амбассадора, чтобы начислились банни."],
    ["Личный код", "В профиле отображается ваш код амбассадора. Передавайте его клиентам или указывайте при создании заказа."],
    ["Банни", "За заказ по вашему коду начисляется внутренняя валюта: например, заказ на 5000 рублей дает 500 банни."],
    ["Вывод", "Кнопка Вывести валюту доступна в конце месяца. После нажатия заявка уходит администраторам."],
    ["О компании", "В профиле есть кнопка О компании со ссылками на сайт и группу ВК."],
  ];
  const guide = state.user.role === "admin" ? adminGuide : state.user.role === "ambassador" ? ambassadorGuide : actorGuide;
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-action="close-help">‹</button>
      <span class="help-pill static-version-pill">Как пользоваться</span>
    </div>
    <h1 class="page-title">Инструкция</h1>
    <div class="content-stack">
      <section class="panel version-panel">
        <h2 class="panel-title">${state.user.role === "admin" ? "Для администратора" : state.user.role === "ambassador" ? "Для амбассадора" : "Для актера"}</h2>
        <p class="small-text">Короткая памятка по основным действиям в приложении.</p>
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
              <h2 class="panel-title">Что видит актер</h2>
              <p class="small-text">Актеры работают с заказами, программами, реквизитом, сохраненным и профилем. Админские кнопки им не показываются.</p>
            </section>`
          : `<section class="panel help-section">
              <h2 class="panel-title">Синхронизация</h2>
              <p class="small-text">Если интернета нет, действия сохраняются локально. Когда сеть появится, приложение отправит изменения в базу.</p>
            </section>`
      }
      <button class="primary-button" data-action="close-help">Закрыть</button>
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
      <button class="icon-button" data-route="home">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Это вы!</h1>
    <div class="content-stack">
      <section class="panel avatar-view-panel">
        <div class="confetti-burst">${confetti}</div>
        <div class="avatar-view">
          ${state.user.photoUrl ? `<img src="${state.user.photoUrl}" alt="" />` : state.user.firstName.slice(0, 1)}
        </div>
        <h2 class="panel-title">Это вы! И это здорово!</h2>
        <div class="detail-grid avatar-stats">
          <div class="detail-line"><span>Заказы</span><strong>${completed}</strong></div>
          <div class="detail-line"><span>Получено</span><strong>${money(earned)}</strong></div>
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
      <strong>Точка праздника</strong>
      <span>проект Банни Бон</span>
    </div>
    <div class="hero-row">
      <h1 class="hero-title">Сегодня,<br>${firstName}</h1>
      <button class="actor-avatar" data-route="avatar" aria-label="Фото актера">
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
    <p class="section-label">Ближайшие заказы</p>
    <div class="orders-stack">
      ${
        orders.length
          ? orders
              .slice(0, 3)
              .map(
                (order) => `
                  <button class="order-row" data-route="order" data-order-id="${order.id}">
                    <span><strong>${order.title}</strong><span>${order.date} ${order.time} · ${orderCalculationSummary(order)}</span></span>
                    <span class="row-icon" aria-label="Открыть">›</span>
                  </button>
                `
              )
              .join("")
          : `<div class="empty-state">Заказов пока нет</div>`
      }
    </div>
    <button class="more-button" data-route="orders">Все заказы</button>
        `
    }

    <div class="quick-scroll">
      ${
        state.user.role === "admin"
          ? `<button class="quick-card add-order-card" data-route="admin"><strong>Админ</strong><span>+</span></button>`
          : ""
      }
      ${
        state.user.role === "ambassador"
          ? `<button class="quick-card add-order-card" data-route="new-order"><strong>Добавить заказ</strong><span>+</span></button>`
          : ""
      }
      ${
        state.user.role === "ambassador"
          ? `<button class="quick-card dark" data-route="company"><strong>О компании</strong></button>`
          : `      <button class="quick-card" data-route="orders">
        <strong>Заказы</strong>
        <img src="./assets/orders.svg" alt="" />
      </button>
      <button class="quick-card dark" data-route="programs">
        <strong>Программы</strong>
        <img src="./assets/programs.svg" alt="" />
      </button>
      <button class="quick-card" data-route="props">
        <strong>Реквизит</strong>
        <img src="./assets/props.svg" alt="" />
      </button>
      <button class="quick-card" data-route="saved"><strong>Сохранено</strong><span>✓</span></button>
          `
      }    </div>

    ${state.user.role === "ambassador" ? "" : `
    <div class="bottom-actions">
      <button class="secondary-button" data-route="profile">Профиль</button>
      <button class="secondary-button" data-action="report">Сообщить<br>об ошибке</button>
    </div>
    `}
  `, true);
}

function ordersScreen() {
  const list = filteredOrders();
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Заказы</h1>
    <div class="content-stack">
      ${canAddOrder() ? `<button class="primary-button" data-route="new-order">Добавить заказ</button>` : ""}
      ${state.user.role === "admin" ? `<button class="secondary-button" data-action="toggle-order-edit">${state.orderEditMode ? "Готово" : "Изменить"}</button>` : ""}
      <input class="search-input" placeholder="Найти заказ" />
      <div class="chips">
        <button class="chip ${state.orderFilter === "active" ? "active" : ""}" data-order-filter="active">Актуальные</button>
        <button class="chip ${state.orderFilter === "mine" ? "active" : ""}" data-order-filter="mine">Мои</button>
        <button class="chip ${state.orderFilter === "week" ? "active" : ""}" data-order-filter="week">Неделя</button>
        <button class="chip ${state.orderFilter === "month" ? "active" : ""}" data-order-filter="month">Месяц</button>
        <button class="chip ${state.orderFilter === "past" ? "active" : ""}" data-order-filter="past">Прошедшие</button>
      </div>
      <div class="orders-stack">
        ${
          list.length
            ? list
                .map(
                  (order) => `
                    <div class="managed-row inline-managed-row">
                      <button class="order-row" data-route="order" data-order-id="${order.id}">
                        <span><strong>${order.title}</strong><span>${order.date} ${order.time} · ${order.status}<br>${orderCalculationSummary(order)}</span></span>
                        <span class="row-icon" aria-label="Открыть">›</span>
                      </button>
                      ${
                        state.user.role === "admin" && state.orderEditMode
                          ? `<button class="mini-delete-button" data-action="delete-order" data-order-id="${order.id}" aria-label="Удалить заказ">×</button>`
                          : ""
                      }
                    </div>
                  `
                )
                .join("")
            : `<div class="empty-state">Заказов по фильтру нет</div>`
        }
      </div>
    </div>
  `, true);
}

function adminScreen() {
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Админ</h1>
    <div class="content-stack">
      <button class="quick-card admin-action-card" data-route="new-order"><strong>Добавить заказ</strong><span>+</span></button>
      <button class="quick-card admin-action-card" data-route="admin-employees"><strong>Добавить сотрудника</strong><span>+</span></button>
      <button class="quick-card admin-action-card" data-route="admin-ambassadors"><strong>Амбассадоры</strong><span>★</span></button>
      <button class="quick-card admin-action-card" data-route="admin-promos"><strong>Добавить промокод</strong><span>%</span></button>
      <button class="quick-card admin-action-card" data-route="admin-program"><strong>Добавить программу</strong><span>+</span></button>
      <button class="quick-card admin-action-card" data-route="admin-prop"><strong>Добавить реквизит</strong><span>+</span></button>
      <button class="quick-card admin-action-card" data-route="admin-reports"><strong>Ошибки</strong><span>!</span></button>
    </div>
  `, true);
}

function newOrderScreen() {
  const calc = calculateBooking();
  const selectedDate = new Date(`${state.booking.date}T00:00:00`);
  const calendarDays = buildCalendarDays(selectedDate);
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="${state.user.role === "admin" ? "admin" : state.user.role === "ambassador" ? "home" : "orders"}">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Новый заказ</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">Клиент</h2>
        <div class="booking-grid">
          <label>
            <span>Имя</span>
            <input class="booking-input" data-booking="firstName" value="${state.booking.firstName}" />
          </label>
          <label>
            <span>Фамилия</span>
            <input class="booking-input" data-booking="lastName" value="${state.booking.lastName}" />
          </label>
        </div>
        <input class="booking-input" data-booking="phone" placeholder="Телефон" value="${state.booking.phone}" style="margin-top: 8px" />
        <input class="booking-input" data-booking="address" placeholder="Адрес" value="${state.booking.address}" style="margin-top: 8px" />
        <textarea class="booking-input booking-textarea" data-booking="comment" placeholder="Комментарий">${state.booking.comment}</textarea>
        <div class="discount-row">
          <input class="booking-input" data-booking="promoCode" placeholder="Промокод" value="${state.booking.promoCode}" />
          <button class="secondary-button" data-action="apply-discount">Применить</button>
        </div>
        ${
          state.user.role === "ambassador"
            ? `<input class="booking-input" data-booking="ambassadorCode" placeholder="Код амбассадора" value="${state.booking.ambassadorCode || currentAmbassadorCode()}" readonly style="margin-top: 8px" />`
            : ""
        }
      </section>

      <section class="panel">
        <h2 class="panel-title">Дата и время</h2>
        <div class="calendar-head">
          <button class="icon-button" data-action="calendar-prev">‹</button>
          <strong>${monthName(selectedDate)} ${selectedDate.getFullYear()}</strong>
          <button class="icon-button" data-action="calendar-next">›</button>
        </div>
        <div class="calendar-week">
          <span>ПН</span><span>ВТ</span><span>СР</span><span>ЧТ</span><span>ПТ</span><span>СБ</span><span>ВС</span>
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
          <span>Выбранное время</span>
          <strong>${state.booking.start} — ${state.booking.end}</strong>
        </button>
        ${
          state.timeEditorOpen
            ? `<div class="time-stepper">
                <div class="time-stepper-row">
                  <span>Начало</span>
                  <div class="time-stepper-control">
                    <button type="button" data-action="adjust-booking-time" data-time-field="start" data-time-delta="-15">−</button>
                    <button type="button" class="time-value-button" data-action="open-native-time" data-time-field="start">${state.booking.start}</button>
                    <input class="native-time-input" type="time" data-native-time="start" value="${state.booking.start}" />
                    <button type="button" data-action="adjust-booking-time" data-time-field="start" data-time-delta="15">+</button>
                  </div>
                </div>
                <div class="time-stepper-row">
                  <span>Окончание</span>
                  <div class="time-stepper-control">
                    <button type="button" data-action="adjust-booking-time" data-time-field="end" data-time-delta="-15">−</button>
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
        <h2 class="panel-title">Время</h2>
        <div class="booking-grid time-grid">
          <label>
            <span>Начало</span>
            <input class="booking-input" type="time" data-booking="start" value="${state.booking.start}" />
          </label>
          <label>
            <span>Окончание</span>
            <input class="booking-input" type="time" data-booking="end" value="${state.booking.end}" />
          </label>
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-title">Программа</h2>
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
              : `<option value="">Сначала добавьте программу</option>`
          }
        </select>
        <p class="small-text" style="margin-top: 10px">Длительность заказа: ${calc.durationMinutes} мин · ${calc.program?.age || ""}</p>
      </section>

      <section class="panel">
        <h2 class="panel-title">Составляющая</h2>
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
        <h2 class="panel-title">Дополнительно</h2>
        <button class="secondary-button" data-action="toggle-extra-edit">${state.extraEditMode ? "Готово" : "Изменить"}</button>
        <div class="option-list">
          ${editableExtras
            .map(
              (item) => `
                <div class="editable-extra-row">
                  ${checkboxLine(`${item.title} · ${money(item.price)}`, "extra", item.title)}
                  ${
                    state.extraEditMode
                      ? `<input class="booking-input extra-price-input" type="number" min="0" data-extra-price="${item.title}" value="${item.price}" />
                         <button class="mini-delete-button" data-action="delete-extra" data-extra-title="${item.title}">×</button>`
                      : ""
                  }
                </div>
              `
            )
            .join("")}
        </div>
        <div class="discount-row" style="margin-top: 8px">
          <input class="booking-input" data-extra-draft placeholder="Добавить пункт" value="${state.extraDraft}" />
          <input class="booking-input" data-extra-draft-price type="number" min="0" placeholder="₽" value="${state.extraDraftPrice}" />
          <button class="secondary-button" data-action="add-extra">Добавить</button>
        </div>
      </section>

      <section class="panel summary-panel">
        <h2 class="panel-title">Расчет</h2>
        <div class="summary-line"><span>Состав</span><strong>${calc.selectedPackage.label}</strong></div>
        <div class="summary-line"><span>Длительность</span><strong>${calc.durationMinutes} мин</strong></div>
        <div class="summary-line"><span>Сумма заказа</span><strong>${money(calc.orderTotal)}</strong></div>
        ${state.user.role === "ambassador" ? `<div class="summary-line"><span>Банни амбассадора</span><strong>${ambassadorPointsForOrder(calc.orderTotal)}</strong></div>` : ""}
        <div class="summary-line"><span>ЗП актеров</span><strong>${money(calc.actorTotal)}</strong></div>
        <div class="summary-line"><span>Остаток агентства</span><strong>${money(calc.agencyTotal)}</strong></div>
      </section>

      ${state.user.role === "admin" ? `
      <section class="panel">
        <button class="panel-toggle" data-action="toggle-bonus-form">Начислить дополнительную выплату</button>
        ${
          state.bonusFormOpen
            ? `<select class="booking-input" data-admin-field="newBonus.employeeId">
                <option value="">Выберите сотрудника</option>
                ${employeeOptions()}
              </select>
              <input class="booking-input" data-admin-field="newBonus.amount" type="number" min="0" placeholder="Сумма выплаты" value="${state.newBonus.amount}" style="margin-top: 8px" />
              <textarea class="booking-input booking-textarea" data-admin-field="newBonus.comment" placeholder="За что начислена выплата">${state.newBonus.comment}</textarea>`
            : ""
        }
      </section>
      ` : ""}

      <button class="primary-button" data-action="create-order">Создать заказ</button>
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
        <button class="icon-button" data-route="orders">‹</button>
        ${syncPill()}
      </div>
      <h1 class="page-title">Заказ</h1>
      <div class="content-stack"><div class="empty-state">Заказ не найден</div></div>
    `, true);
  }
  const isSaved = state.saved.includes(order.id);
  const acceptedList = acceptedListForOrder(order.id);
  const acceptedByMe = acceptedByMeForOrder(order.id);
  const acceptedNames = acceptedList.map((accepted) => accepted.name).join(", ");
  const isFull = acceptedList.length >= orderActorLimit(order);

  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Заказ</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">${order.title}</h2>
        <div class="detail-grid">
          <div class="detail-line"><span>Дата</span><strong>${order.date}, ${order.time}</strong></div>
          <div class="detail-line"><span>Адрес</span><strong>${order.address}</strong></div>
          <div class="detail-line"><span>Роль</span><strong>${order.role}</strong></div>
          <div class="detail-line"><span>Расчет</span><strong>${orderCalculationSummary(order)}</strong></div>
          <div class="detail-line"><span>Актеры</span><strong>${order.actors.join(", ")}</strong></div>
          <div class="detail-line"><span>Приняли</span><strong>${acceptedNames || "Пока никто"}</strong></div>
        </div>
        ${
          state.user.role === "admin"
            ? `<button class="secondary-button" style="margin-top: 12px" data-action="toggle-order-detail-edit">${state.orderDetailEditMode ? "Готово" : "Изменить"}</button>
               ${
                 state.orderDetailEditMode
                   ? `<button class="secondary-button danger-button" style="margin-top: 8px" data-action="delete-order" data-order-id="${order.id}">Удалить заказ</button>`
                   : ""
               }`
            : ""
        }
      </section>

      ${
        true
          ? `<section class="panel">
              <h2 class="panel-title">Подтверждение</h2>
              <p class="small-text">${acceptedList.length ? `Приняли: ${acceptedNames}` : "Можно принять заказ. Если нет сети, отметка сохранится и отправится позже."}</p>
              ${
                acceptedByMe
                  ? `<button class="primary-button accepted-button" style="margin-top: 12px" disabled>Заказ принят</button>
                     <button class="secondary-button danger-button" style="margin-top: 8px" data-action="decline-order" data-order-id="${order.id}">Отказаться</button>`
                  : `<button class="primary-button" style="margin-top: 12px" data-action="accept-order" data-order-id="${order.id}" ${isFull ? "disabled" : ""}>
                      ${isFull ? "Места актеров заняты" : "Принять заказ"}
                    </button>`
              }
            </section>`
          : `<section class="panel">
              <h2 class="panel-title">Кто принял заказ</h2>
              <p class="small-text">${acceptedNames || "Пока никто не принял заказ."}</p>
            </section>`
      }

      <section class="panel">
        <h2 class="panel-title">Комплект</h2>
        <p class="small-text">${order.available}. ${order.kitStatus}</p>
        <div class="action-grid" style="margin-top: 12px">
          <button class="primary-button" data-action="take-kit" data-order-id="${order.id}">Взять комплект</button>
          <button class="secondary-button" data-route="kit">Открыть комплект</button>
          <button class="secondary-button" data-action="save-trip" data-order-id="${order.id}">
            ${isSaved ? "Сохранено" : "Для выезда"}
          </button>
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-title">Программа</h2>
        <p class="small-text">Сценарий, музыка и тайминг для выезда.</p>
        <button class="primary-button" style="margin-top: 12px" data-route="program-detail">Открыть программу</button>
      </section>
    </div>
  `, true);
}

function propsScreen() {
  const list = filteredProps();
  const cells = propCellOptions();
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Реквизит</h1>
    <div class="content-stack">
      <input class="search-input" data-prop-search placeholder="Найти реквизит" value="${state.propSearch}" />
      <select class="booking-input" data-prop-cell-filter>
        <option value="all" ${state.propCellFilter === "all" ? "selected" : ""}>Все ячейки</option>
        ${cells.map((cell) => `<option value="${cell}" ${state.propCellFilter === cell ? "selected" : ""}>Ячейка ${cell}</option>`).join("")}
      </select>
      ${
        state.user.role === "admin"
          ? `<button class="secondary-button" data-action="toggle-prop-edit">${state.propEditMode ? "Готово" : "Изменить"}</button>`
          : ""
      }
      <div class="chips">
        ${[
          ["all", "Все"],
          ["available", "Доступно"],
          ["mine", "У меня"],
          ["busy", "Занято"],
          ["repair", "Проверка"],
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
                  <span><strong>${item.name}</strong><span>${statusText(item.status)} · ${item.place}</span></span>
                  <span class="row-icon ${item.status === "mine" ? "return" : ""}" aria-label="${item.status === "mine" ? "Вернуть" : "Взять"}">
                    ${item.status === "mine" ? "↩" : "+"}
                  </span>
                </button>
                ${
                  state.user.role === "admin" && state.propEditMode
                    ? `<button class="delete-row-button" data-action="delete-prop" data-prop-id="${item.id}">Удалить</button>`
                    : ""
                }
              </div>
            `
              )
              .join("")
            : `<div class="empty-state">Реквизит не найден</div>`
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
      <button class="icon-button" data-route="order">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Комплект</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">${program?.title || "Комплект программы"}</h2>
        <p class="small-text">${availableCount} из ${kitProps.length} предметов доступны. ${kitIds.size ? "Показан сохраненный комплект этой программы." : "Комплект пока не собран, показан базовый реквизит."}</p>
        <button class="primary-button" style="margin-top: 12px" data-action="take-kit">Взять комплект</button>
      </section>
      <div class="orders-stack">
        ${
          kitProps.length
            ? kitProps.map(
                (item) => `
              <button class="prop-row" data-action="${item.status === "mine" ? "return-prop" : "take-prop"}" data-prop-id="${item.id}">
                <span><strong>${item.name}</strong><span>${statusText(item.status)} · ${item.place}</span></span>
                <span class="row-icon ${item.status === "mine" ? "return" : ""}" aria-label="${item.status === "mine" ? "Вернуть" : "Взять"}">
                  ${item.status === "mine" ? "↩" : "+"}
                </span>
              </button>
            `
              )
              .join("")
            : `<div class="empty-state">В комплекте пока нет реквизита</div>`
        }
      </div>
    </div>
  `, true);
}

function programsScreen() {
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Программы</h1>
    <div class="content-stack">
      ${state.user.role === "admin" ? `<button class="secondary-button" data-action="toggle-program-edit">${state.programEditMode ? "Готово" : "Изменить"}</button>` : ""}
      <input class="search-input" placeholder="Найти программу" />
      ${programs
          .map(
            (program) => `
            <div class="managed-row">
              <button class="order-row" data-route="program-detail" data-program-id="${program.id}">
                <span><strong>${program.title}</strong><span>${program.age} · ${program.duration}</span></span>
                <span class="row-icon" aria-label="Открыть">›</span>
              </button>
              ${
                state.user.role === "admin" && state.programEditMode
                  ? `<button class="delete-row-button" data-action="delete-program" data-program-id="${program.id}">Удалить</button>`
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
      <button class="icon-button" data-route="programs">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Программа</h1>
    <div class="content-stack">
      <section class="panel">
        ${
          state.user.role === "admin"
            ? `<button class="secondary-button" data-action="toggle-program-edit">${state.programEditMode ? "Готово" : "Изменить"}</button>`
            : ""
        }
        ${
          state.programEditMode && state.user.role === "admin"
            ? `<input class="booking-input" data-program-field="title" data-program-id="${program.id}" value="${program.title}" style="margin-top: 10px" />
               <input class="booking-input" data-program-field="age" data-program-id="${program.id}" value="${program.age || ""}" placeholder="Возраст" style="margin-top: 8px" />
               <input class="booking-input" data-program-field="duration" data-program-id="${program.id}" value="${program.duration || ""}" placeholder="Длительность" style="margin-top: 8px" />
               <input class="booking-input" data-program-field="driveUrl" data-program-id="${program.id}" value="${program.driveUrl || ""}" placeholder="Ссылка на диск" style="margin-top: 8px" />`
            : `<h2 class="panel-title">${program.title}</h2>
               <div class="detail-grid">
                 <div class="detail-line"><span>Возраст</span><strong>${program.age}</strong></div>
                 <div class="detail-line"><span>Длительность</span><strong>${program.duration}</strong></div>
               </div>`
        }
        ${
          program.driveUrl
            ? `<button class="secondary-button" style="margin-top: 12px" data-open-url="${program.driveUrl}">Открыть диск</button>`
            : ""
        }
        ${state.user.role === "admin" && state.programEditMode ? `<button class="secondary-button" style="margin-top: 8px" data-action="program-kit-builder">Изменить комплект</button>` : ""}
        ${state.user.role === "admin" && state.programEditMode ? `<button class="primary-button" style="margin-top: 8px" data-action="save-program" data-program-id="${program.id}">Сохранить изменения</button>` : ""}
      </section>
      <section class="panel">
        <h2 class="panel-title">Сценарий</h2>
        ${
          state.programEditMode && state.user.role === "admin"
            ? `<textarea class="booking-input booking-textarea" data-program-field="script" data-program-id="${program.id}" placeholder="Сценарий программы целиком">${program.script || ""}</textarea>`
            : `<p class="small-text script-text">${program.script || "Сценарий пока не добавлен."}</p>`
        }
      </section>
      <button class="primary-button" data-action="save-trip" data-order-id="1">Сохранить для выезда</button>
    </div>
  `, true);
}

function savedScreen() {
  const savedOrders = orders.filter((order) => state.saved.includes(order.id));
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Сохранено</h1>
    <div class="content-stack">
      <div class="notice">
        ${savedOrders.length} заказ(а) доступны офлайн. ${state.syncQueue.length ? `Есть ${state.syncQueue.length} действие(й) к отправке.` : "Все действия отправлены."}
      </div>
      <div class="orders-stack">
        ${
          savedOrders.length
            ? savedOrders
                .map(
                  (order) => `
                    <button class="order-row" data-route="order" data-order-id="${order.id}">
                      <span><strong>${order.title}</strong><span>${order.date} ${order.time} · сценарий, музыка, реквизит</span></span>
                      <span class="row-icon done" aria-label="Готово">✓</span>
                    </button>
                  `
                )
                .join("")
            : `<div class="notice">Пока ничего не сохранено. Откройте заказ и нажмите «Для выезда».</div>`
        }
      </div>
    </div>
  `, true);
}

function ambassadorProfileScreen() {
  const employee = currentEmployee() || {};
  const code = currentAmbassadorCode();
  const balance = Number(employee.bunnyBalance || state.user.bunnyBalance || 0);
  const pending = Number(employee.bunnyPending || state.user.bunnyPending || 0);
  const myWithdrawals = state.ambassadorWithdrawals.filter((item) => Number(item.ambassadorId) === Number(state.user.id));
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Профиль</h1>
    <div class="content-stack">
      <section class="panel">
        <button class="profile-avatar-row" data-route="avatar">
          <span class="profile-avatar">
            ${state.user.photoUrl ? `<img src="${state.user.photoUrl}" alt="" />` : state.user.firstName.slice(0, 1)}
          </span>
          <strong>${state.user.firstName}</strong>
        </button>
        <div class="detail-grid">
          <div class="detail-line"><span>Роль</span><strong>амбассадор</strong></div>
          <div class="detail-line"><span>Telegram</span><strong>@${state.user.username}</strong></div>
          <div class="detail-line"><span>Личный код</span><strong>${code}</strong></div>
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-title">Банни</h2>
        <div class="summary-line"><span>Доступно</span><strong>${balance} Б</strong></div>
        <div class="summary-line"><span>На выводе</span><strong>${pending} Б</strong></div>
        <div class="summary-line"><span>Курс</span><strong>1 Б = 1 ₽</strong></div>
        <p class="small-text" style="margin-top: 8px">
          За заказ по вашему коду начисляется 10% от суммы заказа: например, 5000 ₽ = 500 банни.
        </p>
        <button class="primary-button" data-action="withdraw-bunny" style="margin-top: 12px">
          Вывести валюту
        </button>
        <p class="small-text" style="margin-top: 8px">
          Вывод доступен 30/31 числа. После заявки банни переходят в статус «на выводе», а администратор получает сообщение.
        </p>
      </section>

      <section class="panel">
        <h2 class="panel-title">Заявки на вывод</h2>
        <div class="orders-stack">
          ${
            myWithdrawals.length
              ? myWithdrawals
                  .map(
                    (item) => `
                      <div class="notice">
                        <strong>${item.amount} Б</strong><br>
                        ${new Date(item.createdAt).toLocaleDateString("ru-RU")} · отправлено на выведение
                      </div>
                    `
                  )
                  .join("")
              : `<div class="empty-state">Заявок на вывод пока нет</div>`
          }
        </div>
      </section>

      <button class="secondary-button" data-route="company">О компании</button>
      <button class="primary-button" data-action="refresh-data">Обновить данные</button>
    </div>
  `, true);
}

function profileScreen() {
  if (state.user.role === "ambassador") return ambassadorProfileScreen();
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
      <button class="icon-button" data-route="home">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Профиль</h1>
    <div class="content-stack">
      <section class="panel">
        <button class="profile-avatar-row" data-route="avatar">
          <span class="profile-avatar">
            ${state.user.photoUrl ? `<img src="${state.user.photoUrl}" alt="" />` : state.user.firstName.slice(0, 1)}
          </span>
          <strong>${state.user.firstName}</strong>
        </button>
        <div class="detail-grid">
          <div class="detail-line"><span>Имя</span><strong>${state.user.firstName}</strong></div>
          <div class="detail-line"><span>Telegram</span><strong>@${state.user.username}</strong></div>
          <div class="detail-line"><span>Роль</span><strong>${roleLabel()}</strong></div>
          <div class="detail-line"><span>Очередь</span><strong>${state.syncQueue.length}</strong></div>
          ${
            state.user.role === "ambassador"
              ? `<div class="detail-line"><span>Код</span><strong>${currentAmbassadorCode()}</strong></div>`
              : ""
          }
        </div>
      </section>
      ${
        state.user.role === "ambassador"
          ? `<section class="panel">
              <h2 class="panel-title">Банни</h2>
              <div class="summary-line"><span>Доступно</span><strong>${Number(currentEmployee()?.bunnyBalance || state.user.bunnyBalance || 0)} Б</strong></div>
              <div class="summary-line"><span>На выводе</span><strong>${Number(currentEmployee()?.bunnyPending || state.user.bunnyPending || 0)} Б</strong></div>
              <button class="primary-button" data-action="withdraw-bunny" style="margin-top: 10px">Вывести валюту</button>
              <p class="small-text" style="margin-top: 8px">Вывод доступен 30/31 числа. 1 банни = 1 рубль.</p>
            </section>
            <button class="secondary-button" data-route="company">О компании</button>`
          : ""
      }
      <section class="panel">
        <h2 class="panel-title">Оформление</h2>
        <div class="theme-choice">
          <button class="${state.appTheme === "dark" ? "active" : ""}" data-action="set-app-theme" data-app-theme="dark">Темное</button>
          <button class="${state.appTheme === "light" ? "active" : ""}" data-action="set-app-theme" data-app-theme="light">Светлое</button>
        </div>
      </section>
      <section class="panel">
        <h2 class="panel-title">Заработок</h2>
        <div class="chips">
          <button class="chip ${state.earningsPeriod === "week" ? "active" : ""}" data-earnings-period="week">Неделя</button>
          <button class="chip ${state.earningsPeriod === "month" ? "active" : ""}" data-earnings-period="month">Месяц</button>
          <button class="chip ${state.earningsPeriod === "year" ? "active" : ""}" data-earnings-period="year">Год</button>
        </div>
        <div class="summary-line" style="margin-top: 10px"><span>Начислено</span><strong>${money(earnings)}</strong></div>
      </section>
      <section class="panel">
        <h2 class="panel-title">Принятые заказы</h2>
        <div class="orders-stack">
          ${
            acceptedList.length
              ? acceptedList
                  .map(
                    (order) => `
                      <button class="order-row" data-route="order" data-order-id="${order.id}">
                        <span><strong>${order.title}</strong><span>${order.date} ${order.time} · ${money(order.actorPay || 0)}</span></span>
                        <span class="row-icon" aria-label="Открыть">›</span>
                      </button>
                    `
                  )
                  .join("")
              : `<div class="empty-state">Принятых заказов пока нет</div>`
          }
        </div>
      </section>
      <section class="panel">
        <h2 class="panel-title">Реквизит у вас</h2>
        <div class="orders-stack">
          ${
            myProps.length
              ? myProps
                  .map(
                    (item) => `
                      <button class="prop-row" data-route="props">
                        <span><strong>${item.name}</strong><span>${item.place}</span></span>
                        <span class="row-icon return" aria-label="У вас">↩</span>
                      </button>
                    `
                  )
                  .join("")
              : `<div class="empty-state">За вами пока нет реквизита</div>`
          }
        </div>
      </section>
      ${
        state.user.role === "admin"
          ? `<section class="panel">
              <h2 class="panel-title">Выплаты</h2>
              <div class="orders-stack">
                ${
                  state.bonuses.length
                    ? state.bonuses
                        .map(
                          (bonus) => `
                            <div class="managed-row bonus-row">
                              <div class="detail-grid">
                                <div class="detail-line"><span>Кому</span><strong>${bonus.employeeName || `#${bonus.employeeId}`}</strong></div>
                                <div class="detail-line"><span>Когда</span><strong>${new Date(bonus.createdAt).toLocaleDateString("ru-RU")}</strong></div>
                                <div class="detail-line"><span>За что</span><strong>${bonus.comment || "Без комментария"}</strong></div>
                                <div class="detail-line"><span>Начислил</span><strong>${bonus.createdByName || state.user.firstName}</strong></div>
                              </div>
                              <div class="bonus-edit-row">
                                <input class="booking-input" type="number" min="0" data-bonus-amount="${bonus.id}" value="${bonus.amount}" />
                                <button class="mini-delete-button" data-action="delete-bonus" data-bonus-id="${bonus.id}">×</button>
                              </div>
                            </div>
                          `
                        )
                        .join("")
                    : `<div class="empty-state">Дополнительных выплат пока нет</div>`
                }
              </div>
            </section>`
          : ""
      }
      ${
        state.user.role !== "admin"
          ? `<section class="panel efficiency-panel">
              <h2 class="panel-title">Эффективность</h2>
              <div class="efficiency-wrap">
                <div class="efficiency-ring" style="--value: ${currentEmployee.efficiency}">
                  <strong>${currentEmployee.efficiency}%</strong>
                </div>
                <div class="efficiency-stats">
                  <div><span>Принято за месяц</span><strong>${currentMonthlyAccepted}</strong></div>
                  <div><span>Оценка</span><strong>${currentEmployee.rating}</strong></div>
                </div>
              </div>
            </section>`
          : `<section class="panel">
              <h2 class="panel-title">Оценка сотрудников</h2>
              <div class="employee-list">
                ${employees
                  .map(
                    (employee) => `
                      <button class="employee-row employee-button" data-route="admin-employee-detail" data-employee-id="${employee.id}">
                        <div class="mini-ring" style="--value: ${employee.efficiency}">${employee.efficiency}%</div>
                        <span><strong>${employee.name} ${employee.role !== "actor" ? `<em class="role-mark">(${roleLabel(employee.role)})</em>` : ""}</strong><small>Принято за месяц: ${monthlyAcceptedCount(employee.id)}</small></span>
                        <b>${employee.rating}</b>
                      </button>
                    `
                  )
                  .join("")}
              </div>
            </section>`
      }
      <button class="primary-button" data-action="refresh-data">Обновить данные</button>
      <button class="secondary-button" data-action="report">Сообщить об ошибке</button>
    </div>
  `, true);
}

function adminEmployeeDetailScreen() {
  const employee = employees.find((item) => Number(item.id) === Number(state.activeEmployeeId)) || employees[0];
  if (!employee) {
    return appFrame(`
      <div class="top-row">
        <button class="icon-button" data-route="profile">‹</button>
        ${syncPill()}
      </div>
      <h1 class="page-title">Сотрудник</h1>
      <div class="content-stack"><div class="empty-state">Сотрудник не найден</div></div>
    `, true);
  }
  const employeeOrders = acceptedOrdersForEmployee(employee.id);
  const employeeBonuses = bonusesForEmployee(employee.id);
  const total = employeeEarnings(employee.id);
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="profile">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">${employee.name}</h1>
    <div class="content-stack">
      <section class="panel efficiency-panel">
        <h2 class="panel-title">Эффективность</h2>
        <div class="efficiency-wrap">
          <div class="efficiency-ring" style="--value: ${employee.efficiency || 0}">
            <strong>${employee.efficiency || 0}%</strong>
          </div>
          <div class="efficiency-stats">
            <div><span>Принято за месяц</span><strong>${monthlyAcceptedCount(employee.id)}</strong></div>
            <div><span>Оценка</span><strong>${employee.rating || 0}</strong></div>
          </div>
        </div>
        <div class="counter-actions" style="margin-top: 10px">
          <button class="secondary-button" data-action="decrease-accepted" data-employee-id="${employee.id}">− заказ</button>
          <button class="secondary-button" data-action="increase-accepted" data-employee-id="${employee.id}">+ заказ</button>
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-title">Финансы</h2>
        <div class="summary-line"><span>Общая сумма</span><strong>${money(total)}</strong></div>
        <input class="booking-input" type="number" min="0" data-employee-total="${employee.id}" value="${total}" style="margin-top: 10px" />
        <p class="small-text" style="margin-top: 8px">Если изменить сумму, приложение добавит корректировку выплатой.</p>
      </section>

      <section class="panel">
        <h2 class="panel-title">Права доступа</h2>
        <select class="booking-input" data-employee-access-field="role" data-employee-id="${employee.id}">
          <option value="actor" ${employee.role === "actor" ? "selected" : ""}>Актер</option>
          <option value="admin" ${employee.role === "admin" ? "selected" : ""}>Админ</option>
          <option value="ambassador" ${employee.role === "ambassador" ? "selected" : ""}>Амбассадор</option>
        </select>
        ${
          employee.role === "ambassador"
            ? `<input class="booking-input" data-employee-access-field="ambassadorCode" data-employee-id="${employee.id}" value="${employee.ambassadorCode || ""}" placeholder="Код амбассадора" style="margin-top: 8px" />`
            : ""
        }
        <button class="primary-button" data-action="save-employee-access" data-employee-id="${employee.id}" style="margin-top: 10px">Сохранить права</button>
        <button class="secondary-button danger-button" data-action="delete-employee" data-employee-id="${employee.id}" style="margin-top: 8px">Удалить аккаунт навсегда</button>
      </section>

      <section class="panel">
        <h2 class="panel-title">Принятые заказы</h2>
        <div class="orders-stack">
          ${
            employeeOrders.length
              ? employeeOrders
                  .map(
                    (order) => `
                      <div class="managed-row bonus-row">
                        <button class="order-row" data-route="order" data-order-id="${order.id}">
                          <span><strong>${order.title}</strong><span>${order.date} ${order.time} · ${money(order.actorPay || 0)}</span></span>
                          <span class="row-icon" aria-label="Открыть">›</span>
                        </button>
                        <input class="booking-input" type="number" min="0" data-order-pay="${order.id}" value="${order.actorPay || 0}" />
                        <div class="action-grid compact-actions">
                          <button class="secondary-button" data-action="annul-order" data-order-id="${order.id}">Аннулировать</button>
                          <button class="secondary-button danger-button" data-action="delete-order-pay" data-order-id="${order.id}">Удалить ЗП</button>
                        </div>
                      </div>
                    `
                  )
                  .join("")
              : `<div class="empty-state">Принятых заказов пока нет</div>`
          }
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-title">Выплаты</h2>
        <div class="orders-stack">
          ${
            employeeBonuses.length
              ? employeeBonuses
                  .map(
                    (bonus) => `
                      <div class="managed-row bonus-row">
                        <div class="detail-grid">
                          <div class="detail-line"><span>Когда</span><strong>${new Date(bonus.createdAt).toLocaleDateString("ru-RU")}</strong></div>
                          <div class="detail-line"><span>За что</span><strong>${bonus.comment || "Без комментария"}</strong></div>
                          <div class="detail-line"><span>Начислил</span><strong>${bonus.createdByName || state.user.firstName}</strong></div>
                        </div>
                        <div class="bonus-edit-row">
                          <input class="booking-input" type="number" data-bonus-amount="${bonus.id}" value="${bonus.amount}" />
                          <button class="mini-delete-button" data-action="delete-bonus" data-bonus-id="${bonus.id}">×</button>
                        </div>
                      </div>
                    `
                  )
                  .join("")
              : `<div class="empty-state">Выплат пока нет</div>`
          }
        </div>
      </section>
    </div>
  `, true);
}

function companyScreen() {
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="${state.user.role === "ambassador" ? "home" : "profile"}">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">О компании</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">Точка праздника</h2>
        <p class="small-text">Проект Банни Бон. Ссылки для амбассадоров и сотрудников.</p>
      </section>
      <button class="primary-button" data-open-url="${COMPANY_SITE_URL}">Сайт</button>
      <button class="secondary-button" data-open-url="${COMPANY_VK_URL}">Группа ВК</button>
    </div>
  `, true);
}

function adminPromosScreen() {
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="admin">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Промокоды</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">Добавить промокод</h2>
        <input class="booking-input" data-admin-field="newPromo.code" placeholder="Код" value="${state.newPromo.code}" />
        <input class="booking-input" data-admin-field="newPromo.discount" type="number" min="0" placeholder="Скидка в ₽" value="${state.newPromo.discount}" style="margin-top: 8px" />
        <input class="booking-input" data-admin-field="newPromo.description" placeholder="Комментарий" value="${state.newPromo.description}" style="margin-top: 8px" />
      </section>
      <button class="primary-button" data-action="create-promo">Добавить промокод</button>
      <section class="panel">
        <h2 class="panel-title">Активные</h2>
        <div class="orders-stack">
          ${
            state.promoCodes.length
              ? state.promoCodes
                  .map(
                    (promo) => `
                      <div class="notice">
                        <strong>${promo.code}</strong><br>
                        ${money(promo.discount)} ${promo.description ? `· ${promo.description}` : ""}
                      </div>
                    `
                  )
                  .join("")
              : `<div class="empty-state">Промокодов пока нет</div>`
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
      <button class="icon-button" data-route="admin">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Сотрудник</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">Добавить сотрудника</h2>
        <input class="booking-input" data-admin-field="newEmployee.name" placeholder="Имя" value="${state.newEmployee.name}" />
        <input class="booking-input" data-admin-field="newEmployee.username" placeholder="Telegram username" value="${state.newEmployee.username}" style="margin-top: 8px" />
        <label class="check-line admin-check-line" style="margin-top: 8px">
          <input type="checkbox" data-admin-field="newEmployee.isAdmin" ${state.newEmployee.isAdmin ? "checked" : ""} />
          <span>Дополнительно дать функции админа</span>
        </label>
        <label class="check-line admin-check-line" style="margin-top: 8px">
          <input type="checkbox" data-admin-field="newEmployee.isAmbassador" ${state.newEmployee.isAmbassador ? "checked" : ""} />
          <span>Дать права амбассадора</span>
        </label>
        ${
          state.newEmployee.isAmbassador
            ? `<div class="notice" style="margin-top: 8px">
                <strong>Код амбассадора</strong>
                <input class="booking-input" data-admin-field="newEmployee.ambassadorCode" placeholder="Код амбассадора" value="${suggestedEmployeeAmbassadorCode()}" style="margin-top: 8px" />
                <p class="small-text" style="margin-top: 8px">Этот код закрепится за сотрудником после добавления.</p>
              </div>`
            : ""
        }
      </section>
      <button class="primary-button" data-action="create-employee">Добавить сотрудника</button>
      ${state.user.role === "admin" ? `
      <section class="panel">
        <button class="panel-toggle" data-action="toggle-bonus-form">Начислить дополнительную выплату</button>
        ${
          state.bonusFormOpen
            ? `<select class="booking-input" data-admin-field="newBonus.employeeId">
                <option value="">Выберите сотрудника</option>
                ${employees
                  .map((employee) => `<option value="${employee.id}" ${String(state.newBonus.employeeId) === String(employee.id) ? "selected" : ""}>${employee.name}</option>`)
                  .join("")}
              </select>
              <input class="booking-input" data-admin-field="newBonus.amount" type="number" min="0" placeholder="Сумма выплаты" value="${state.newBonus.amount}" style="margin-top: 8px" />
              <textarea class="booking-input booking-textarea" data-admin-field="newBonus.comment" placeholder="За что начислена выплата">${state.newBonus.comment}</textarea>
              <button class="primary-button" data-action="create-bonus" style="margin-top: 8px">Начислить</button>`
            : ""
        }
      </section>
      ` : ""}
      <section class="panel">
        <h2 class="panel-title">Список</h2>
        <div class="employee-list">
          ${employees
            .map(
              (employee) => `
                <div class="employee-row">
                  <div class="mini-ring" style="--value: ${employee.efficiency}">${employee.efficiency}%</div>
                  <button class="employee-name-button" data-route="admin-employee-detail" data-employee-id="${employee.id}">
                    <span><strong>${employee.name} ${employee.role !== "actor" ? `<em class="role-mark">(${roleLabel(employee.role)})</em>` : ""}</strong><small>${roleLabel(employee.role)} · принято за месяц ${monthlyAcceptedCount(employee.id)}</small></span>
                  </button>
                  <div class="counter-actions">
                    <button class="mini-delete-button" data-action="decrease-accepted" data-employee-id="${employee.id}">−</button>
                    <button class="mini-delete-button" data-action="increase-accepted" data-employee-id="${employee.id}">+</button>
                  </div>
                  <button class="mini-delete-button" data-action="delete-employee" data-employee-id="${employee.id}">×</button>
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
      <button class="icon-button" data-route="admin">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Программа</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">Добавить программу</h2>
        <input class="booking-input" data-admin-field="newProgram.title" placeholder="Название" value="${state.newProgram.title}" />
        <input class="booking-input" data-admin-field="newProgram.driveUrl" placeholder="Ссылка на диск" value="${state.newProgram.driveUrl}" style="margin-top: 8px" />
        <input class="booking-input" data-admin-field="newProgram.age" placeholder="Возраст" value="${state.newProgram.age}" style="margin-top: 8px" />
        <input class="booking-input" data-admin-field="newProgram.duration" placeholder="Длительность" value="${state.newProgram.duration}" style="margin-top: 8px" />
        <input class="booking-input" data-admin-field="newProgram.pricePerHour" type="number" placeholder="Цена за час" value="${state.newProgram.pricePerHour}" style="margin-top: 8px" />
        <input class="booking-input" data-admin-field="newProgram.actorPayPerHour" type="number" placeholder="ЗП актера за час" value="${state.newProgram.actorPayPerHour}" style="margin-top: 8px" />
        <textarea class="booking-input booking-textarea" data-admin-field="newProgram.script" placeholder="Сценарий программы целиком">${state.newProgram.script}</textarea>
      </section>
      <button class="secondary-button" data-action="program-kit-builder">Собрать комплект для программы</button>
      <button class="primary-button" data-action="create-program">Добавить программу</button>
    </div>
  `, true);
}

function adminPropScreen() {
  const kitKey = currentKitKey();
  const kitMode = Boolean(state.kitBuilderProgramId);
  const selectedKitProps = new Set((state.programKits[kitKey] || []).map(Number));
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="admin">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Реквизит</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">Добавить реквизит</h2>
        <input class="booking-input" data-admin-field="newProp.name" placeholder="Название" value="${state.newProp.name}" />
        <input class="booking-input" data-admin-field="newProp.place" placeholder="Место хранения" value="${state.newProp.place}" style="margin-top: 8px" />
        <select class="booking-input" data-admin-field="newProp.status" style="margin-top: 8px">
          <option value="available" ${state.newProp.status === "available" ? "selected" : ""}>Доступно</option>
          <option value="busy" ${state.newProp.status === "busy" ? "selected" : ""}>Занято</option>
          <option value="repair" ${state.newProp.status === "repair" ? "selected" : ""}>Проверка</option>
        </select>
      </section>
      <button class="primary-button" data-action="create-prop">Добавить реквизит</button>
      ${
        kitMode
          ? `<section class="panel kit-builder-panel">
              <h2 class="panel-title">Комплект программы</h2>
              <p class="small-text">Выберите реквизит для этой программы. Выбор сохраняется локально и отправится в очередь синхронизации.</p>
              <button class="primary-button" style="margin-top: 10px" data-action="save-program-kit">Сохранить комплект</button>
            </section>`
          : ""
      }
      <section class="panel">
        <h2 class="panel-title">Реквизит</h2>
        <button class="secondary-button" data-action="toggle-prop-edit">${state.propEditMode ? "Готово" : "Изменить"}</button>
        <div class="orders-stack">
          ${
            props.length
              ? props
                  .map(
                    (item) => `
                      <div class="managed-row inline-managed-row">
                        <div class="prop-row">
                          <span><strong>${item.name}</strong><span>${statusText(item.status)} · ${item.place}</span></span>
                          <span class="row-icon ${item.status === "mine" ? "return" : ""}" aria-label="${statusText(item.status)}">${item.status === "mine" ? "↩" : "+"}</span>
                        </div>
                        ${
                          kitMode
                            ? `<button class="secondary-button kit-toggle-button ${selectedKitProps.has(Number(item.id)) ? "active" : ""}" data-action="toggle-program-kit-prop" data-prop-id="${item.id}">
                                ${selectedKitProps.has(Number(item.id)) ? "В комплекте" : "В комплект"}
                              </button>`
                            : state.propEditMode
                              ? `<button class="mini-delete-button" data-action="delete-prop" data-prop-id="${item.id}" aria-label="Удалить реквизит">×</button>`
                              : ""
                        }
                      </div>
                    `
                  )
                  .join("")
              : `<div class="empty-state">Реквизита пока нет</div>`
          }
        </div>
      </section>
    </div>
  `, true);
}

function adminReportsScreen() {
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="admin">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Ошибки</h1>
    <div class="content-stack">
      ${
        reports.length
          ? reports
              .map(
                (report) => `
                  <section class="panel">
                    <h2 class="panel-title">${report.actorName || `Сотрудник #${report.actor_id || ""}`}</h2>
                    <p class="small-text">${report.text}</p>
                    <p class="small-text" style="margin-top: 8px">${report.createdAt || report.created_at || ""}</p>
                    <button class="secondary-button danger-button" style="margin-top: 8px" data-action="delete-report" data-report-id="${report.id}">Очистить</button>
                  </section>
                `
              )
              .join("")
          : `<div class="empty-state">Ошибок пока нет</div>`
      }
    </div>
  `, true);
}

function reportScreen() {
  const backRoute = state.user.hasAccess ? "home" : "denied";
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="${backRoute}">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Ошибка</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">Что случилось?</h2>
        <textarea class="booking-input booking-textarea" data-report-text placeholder="Опишите проблему">${state.reportText}</textarea>
        <p class="small-text" style="margin-top: 10px">Сообщение сохранится и отправится администратору при синхронизации.</p>
      </section>
      <button class="primary-button" data-action="send-report">Отправить</button>
    </div>
  `, true);
}

function actionTitle(action) {
  const payload = action.payload || {};
  return {
    "create-employee": `Добавить сотрудника: ${payload.name || ""}`,
    "create-order": `Добавить заказ: ${payload.order?.title || payload.title || ""}`,
    "create-promo": `Добавить промокод: ${payload.code || ""}`,
    "withdraw-bunny": `Вывод банни: ${payload.amount || 0}`,
    "update-ambassador": `Обновить амбассадора: ${payload.name || payload.ambassadorCode || ""}`,
    "update-employee-access": `Обновить права: ${payload.name || payload.id || ""}`,
    report: "Сообщить об ошибке",
    "take-prop": `Взять реквизит #${payload.propId || ""}`,
    "return-prop": `Вернуть реквизит #${payload.propId || ""}`,
    "take-kit": "Взять комплект",
    "accept-order": `Принять заказ #${payload.orderId || ""}`,
    "decline-order": `Отказаться от заказа #${payload.orderId || ""}`,
    "delete-order": `Удалить заказ #${payload.id || ""}`,
    "delete-employee": `Удалить сотрудника #${payload.id || ""}`,
    "create-program": `Добавить программу: ${payload.title || ""}`,
    "create-prop": `Добавить реквизит: ${payload.name || ""}`,
  }[action.type] || actionToast(action.type);
}

function syncScreen() {
  const queue = state.syncQueue.filter((action) => action.status !== "synced");
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="${state.user.hasAccess ? "home" : "denied"}">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Синхронизация</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">К отправке: ${queue.length}</h2>
        <p class="small-text">Здесь можно повторить отправку или отменить зависшую операцию.</p>
      </section>
      <button class="primary-button" data-action="sync-queue">Повторить отправку</button>
      <button class="secondary-button" data-action="refresh-data">Обновить доступ и данные</button>
      <div class="orders-stack">
        ${
          queue.length
            ? queue
                .map(
                  (action) => `
                    <section class="panel">
                      <h2 class="panel-title">${actionTitle(action)}</h2>
                      <div class="detail-grid">
                        <div class="detail-line"><span>Статус</span><strong>${action.status || "ready"}</strong></div>
                        <div class="detail-line"><span>Создано</span><strong>${new Date(action.createdAt).toLocaleString("ru-RU")}</strong></div>
                      </div>
                      ${action.error ? `<p class="small-text" style="margin-top: 8px">${action.error}</p>` : ""}
                      <button class="secondary-button danger-button" style="margin-top: 10px" data-action="cancel-sync-action" data-sync-id="${action.id}">Отменить операцию</button>
                    </section>
                  `
                )
                .join("")
            : `<div class="empty-state">Очередь пуста</div>`
        }
      </div>
    </div>
  `, true);
}

function statusText(status) {
  return {
    available: "Доступно",
    mine: "У меня",
    busy: "Занято",
    repair: "Проверка",
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
    const restoreScroll = () => {
      const screen = document.querySelector(".screen");
      if (screen) screen.scrollTop = previousScrollTop;
    };
    restoreScroll();
    requestAnimationFrame(restoreScroll);
    window.setTimeout(restoreScroll, 0);
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
    state.toast = "Синхронизируем...";
    render();
    await Promise.all(pendingActions().map((item) => sendAction(item)));
    const hasAccess = await loadRemoteData({ renderAfter: false });
    state.toast = hasAccess ? "Доступ обновлен" : "Доступ не найден";
    setRoute(hasAccess ? state.route : "denied");
    clearToastLater();
  }

  if (action === "sync-queue") {
    state.toast = "Отправляем очередь...";
    render();
    await Promise.all(pendingActions().map((item) => sendAction(item)));
    state.toast = pendingActions().length ? "Часть операций осталась в очереди" : "Все отправлено";
    render();
    clearToastLater();
  }

  if (action === "cancel-sync-action") {
    if (!confirmDelete("операцию из очереди")) return;
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
    state.toast = "Выберите реквизит для комплекта программы";
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
    if (!confirmDelete("начисленную зарплату")) return;
    deleteOrderPay(orderId);
  }

  if (action === "save-employee-access") {
    saveEmployeeAccess(Number(actionButton.dataset.employeeId));
  }

  if (action === "increase-accepted") {
    adjustEmployeeAccepted(Number(actionButton.dataset.employeeId), 1);
  }

  if (action === "decrease-accepted") {
    adjustEmployeeAccepted(Number(actionButton.dataset.employeeId), -1);
  }

  if (action === "delete-bonus") {
    if (!confirmDelete("дополнительную выплату")) return;
    deleteBonus(Number(actionButton.dataset.bonusId));
  }

  if (action === "delete-employee") {
    if (!window.confirm("Удалить аккаунт сотрудника навсегда? Он пропадет из базы и потеряет доступ к приложению.")) return;
    deleteEmployee(Number(actionButton.dataset.employeeId));
  }

  if (action === "delete-order") {
    if (!confirmDelete("заказ")) return;
    deleteOrder(Number(actionButton.dataset.orderId));
  }

  if (action === "delete-program") {
    if (!confirmDelete("программу")) return;
    deleteProgram(Number(actionButton.dataset.programId));
  }

  if (action === "delete-prop") {
    if (!confirmDelete("реквизит")) return;
    deleteProp(Number(actionButton.dataset.propId));
  }

  if (action === "delete-report") {
    if (!confirmDelete("сообщение об ошибке")) return;
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
    state.toast = "Вход отменен";
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

  const employeeAccessInput = event.target.closest("[data-employee-access-field]");
  if (employeeAccessInput) {
    updateEmployeeAccess(Number(employeeAccessInput.dataset.employeeId), employeeAccessInput.dataset.employeeAccessField, employeeAccessInput.value);
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

