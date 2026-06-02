const tg = window.Telegram?.WebApp;

if (tg) {
  document.body.classList.add("telegram-runtime");
  tg.ready();
  tg.expand();
  tg.setHeaderColor?.("#ff8a22");
  tg.setBackgroundColor?.("#ff8a22");
}

const API_BASE = window.TOCHKA_API_URL || localStorage.getItem("tochkaApiUrl") || "";
const APP_VERSION = "2026.06.02-13";
const releaseNotes = [
  "Декоративная рамка возвращена на корпус приложения, чтобы экран не уезжал вбок.",
  "Фото сотрудника осталось круглым с золотистой переливающейся рамкой.",
  "В заказах первым идет фильтр Актуальные.",
  "Выбор даты открывает выбор времени, а интервал виден под календарем.",
  "Назад из добавления заказа для админа возвращает в админку.",
];

const telegramUser = tg?.initDataUnsafe?.user;

const mockUser = {
  id: telegramUser?.id ?? 101,
  firstName: tg?.initDataUnsafe?.user?.first_name ?? "Даша",
  username: telegramUser?.username ?? "local_user",
  photoUrl: telegramUser?.photo_url ?? "",
  role: "actor",
  hasAccess: true,
};

let employees = [
  { id: 101, name: "Даша", efficiency: 86, accepted: 12, late: 1, rating: 4.8 },
  { id: 102, name: "Илья", efficiency: 74, accepted: 8, late: 2, rating: 4.4 },
  { id: 103, name: "Маша", efficiency: 92, accepted: 16, late: 0, rating: 4.9 },
];

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
  user: mockUser,
  syncQueue: readStorage("syncQueue", []),
  saved: readStorage("savedForTrip", []),
  deletedEntities: readStorage("deletedEntities", { orders: [], props: [], programs: [], employees: [] }),
  activeOrderId: 1,
  activeProgramId: 1,
  activeEmployeeId: 101,
  filter: "all",
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
    date: "2026-06-05",
    start: "16:00",
    end: "18:00",
    duration: 2,
    programId: 1,
    actors: 2,
    package: "2 актера, до 20 человек",
    extras: [],
  },
  newEmployee: { name: "", username: "", isAdmin: false },
  newProgram: { title: "", driveUrl: "", script: "", age: "", duration: "", pricePerHour: 0, actorPayPerHour: 0 },
  newBonus: { employeeId: "", amount: "", comment: "" },
  orderEditMode: false,
  orderDetailEditMode: false,
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

let programs = [
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

programs = readStorage("programs", programs);

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
  localStorage.setItem("savedForTrip", JSON.stringify(state.saved));
  localStorage.setItem("acceptedOrders", JSON.stringify(state.acceptedOrders));
  localStorage.setItem("deletedEntities", JSON.stringify(state.deletedEntities));
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("programs", JSON.stringify(programs));
  localStorage.setItem("editableExtras", JSON.stringify(editableExtras));
  localStorage.setItem("bonuses", JSON.stringify(state.bonuses));
  localStorage.setItem("programKits", JSON.stringify(state.programKits));
}

function ensureCurrentEmployee() {
  if (!state.user?.id || !state.user.hasAccess) return;
  const existing = employees.find((employee) => Number(employee.id) === Number(state.user.id));
  const record = {
    id: state.user.id,
    name: state.user.firstName,
    username: state.user.username,
    role: state.user.role,
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
    throw new Error(`API ${response.status}`);
  }

  return response.json();
}

async function loadRemoteData() {
  if (!API_BASE) return;

  try {
    const data = await apiFetch(`/api/bootstrap?telegram_id=${encodeURIComponent(state.user.id)}&name=${encodeURIComponent(state.user.firstName)}&username=${encodeURIComponent(state.user.username)}`);
    if (!data) return;

    employees = withoutDeleted(data.employees || employees, "employees");
    orders = mergeQueuedOrders(withoutDeleted(data.orders || [], "orders"));
    props = withoutDeleted(data.props || props, "props");
    programs = withoutDeleted(data.programs || programs, "programs");
    state.acceptedOrders = data.acceptedOrders || state.acceptedOrders;
    state.bonuses = data.bonuses || state.bonuses;
    reports = data.reports || reports;
    applyCurrentUserAccess(data.currentUser);
    saveState();
    render();
  } catch (error) {
    console.warn("Bootstrap failed", error);
  }
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
    state.syncQueue = state.syncQueue.filter((item) => item.id !== action.id);
    saveState();
    render();
  } catch (error) {
    action.status = "offline";
    saveState();
  }
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
    state.user.hasAccess = true;
    ensureCurrentEmployee();
    return;
  }

  if (currentUser.isActive === false) {
    state.user.hasAccess = false;
    if (state.route !== "auth-confirm") state.route = "denied";
    return;
  }

  state.user.id = currentUser.id ?? state.user.id;
  state.user.firstName = currentUser.name || state.user.firstName;
  state.user.username = currentUser.username || state.user.username;
  state.user.role = currentUser.role === "admin" ? "admin" : "actor";
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
  state.toast = role === "admin" ? "Режим администратора" : "Режим актера";
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
    "update-order-pay": "Зарплата скорректирована",
    "delete-order-pay": "Зарплата удалена",
    "annul-order": "Принятие заказа аннулировано",
    report: "Ошибка отправлена",
  }[type] || "Действие сохранено";
}

function addEmployee() {
  const name = state.newEmployee.name.trim();
  if (!name) return;
  const role = state.newEmployee.isAdmin ? "admin" : "actor";
  employees = [
    ...employees,
    {
      id: Date.now(),
      name,
      role,
      efficiency: 0,
      accepted: 0,
      late: 0,
      rating: 0,
    },
  ];
  queueAction("create-employee", { ...state.newEmployee, role });
  state.newEmployee = { name: "", username: "", isAdmin: false };
  setRoute("profile");
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
  employees = employees.filter((employee) => employee.id !== id);
  rememberDeleted("employees", id);
  queueAction("delete-employee", { id });
}

function deleteOrder(id) {
  orders = orders.filter((order) => order.id !== id);
  delete state.acceptedOrders[id];
  rememberDeleted("orders", id);
  queueAction("delete-order", { id });
  setRoute("orders");
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
    status: "Новый",
    kitStatus: "Комплект не взят",
    available: "Проверяется",
  };
  order.total = calc.orderTotal;
  order.actorPay = calc.actorTotal;
  orders = [order, ...orders];
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
  setRoute("profile");
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
  return programs.find((program) => program.id === Number(state.booking.programId)) || programs[0];
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
  const discount = Number(state.booking.discount || 0);
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
    <main class="phone ${state.user.role === "admin" ? "admin-mode" : ""}">
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

function openBookingTimePicker(key = "start") {
  window.setTimeout(() => {
    const input = document.querySelector(`.time-editor [data-booking="${key}"]`);
    input?.focus?.();
    input?.showPicker?.();
    input?.click?.();
  }, 80);
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
  return `<div class="sync-cluster"><button class="status-pill sync-pill-button ${pending ? "glow" : ""}" data-action="refresh-data">${text}</button><button class="version-pill ${state.versionGlow ? "glow" : ""}" data-route="version">v${APP_VERSION}</button></div>`;
}

function money(value) {
  return `${Number(value).toLocaleString("ru-RU")} ₽`;
}

function checkingScreen() {
  setTimeout(() => {
    if (state.route === "checking") {
      setRoute(state.user.hasAccess ? "home" : "denied", { justAuthorized: state.user.hasAccess });
    }
  }, 900);

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
      ${syncPill()}
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
  state.previousRoute = state.route === "version" ? "home" : state.route;
  setRoute("version");
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
    <span class="role-pill hero-role">${state.user.role === "admin" ? "админ" : "актер"}</span>

    <p class="section-label">Ближайшие заказы</p>
    <div class="orders-stack">
      ${
        orders.length
          ? orders
              .slice(0, 3)
              .map(
                (order) => `
                  <button class="order-row" data-route="order" data-order-id="${order.id}">
                    <span><strong>${order.title}</strong><span>${order.date} ${order.time}</span></span>
                    <span class="row-icon" aria-label="Открыть">›</span>
                  </button>
                `
              )
              .join("")
          : `<div class="empty-state">Заказов пока нет</div>`
      }
    </div>
    <button class="more-button" data-route="orders">Все заказы</button>

    <div class="quick-scroll">
      ${
        state.user.role === "admin"
          ? `<button class="quick-card add-order-card" data-route="admin"><strong>Админ</strong><span>+</span></button>`
          : ""
      }
      <button class="quick-card" data-route="orders">
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
    </div>

    <div class="bottom-actions">
      <button class="secondary-button" data-route="profile">Профиль</button>
      <button class="secondary-button" data-action="report">Сообщить<br>об ошибке</button>
    </div>
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
      ${state.user.role === "admin" ? `<button class="primary-button" data-route="new-order">Добавить заказ</button>` : ""}
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
                        <span><strong>${order.title}</strong><span>${order.date} ${order.time} · ${order.status}</span></span>
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
      <button class="icon-button" data-route="${state.user.role === "admin" ? "admin" : "home"}">‹</button>
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
          <input class="booking-input" data-booking="discount" type="number" min="0" placeholder="Код/скидка в ₽" value="${state.booking.discount}" />
          <button class="secondary-button" data-action="apply-discount">Применить</button>
        </div>
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
            ? `<div class="time-editor">
                <label>
                  <span>Начало</span>
                  <input class="booking-input" type="time" data-booking="start" value="${state.booking.start}" />
                </label>
                <label>
                  <span>Окончание</span>
                  <input class="booking-input" type="time" data-booking="end" value="${state.booking.end}" />
                </label>
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
          ${programs
            .map(
              (program) => `
                <option value="${program.id}" ${Number(state.booking.programId) === program.id ? "selected" : ""}>
                  ${program.title}
                </option>
              `
            )
            .join("")}
        </select>
        <p class="small-text" style="margin-top: 10px">Длительность заказа: ${calc.durationMinutes} мин · ${calc.program.age || ""}</p>
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
        <div class="summary-line"><span>ЗП актеров</span><strong>${money(calc.actorTotal)}</strong></div>
        <div class="summary-line"><span>Остаток агентства</span><strong>${money(calc.agencyTotal)}</strong></div>
      </section>

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
  const list = props.filter((item) => state.filter === "all" || item.status === state.filter);
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Реквизит</h1>
    <div class="content-stack">
      <input class="search-input" placeholder="Найти реквизит" />
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
        ${list
          .map(
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
          .join("")}
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
            : `<div class="notice">Пока ничего не сохранено. Откройте заказ и нажмите “Для выезда”.</div>`
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
          <div class="detail-line"><span>Роль</span><strong>${state.user.role === "admin" ? "админ" : "актер"}</strong></div>
          <div class="detail-line"><span>Очередь</span><strong>${state.syncQueue.length}</strong></div>
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
        state.user.role === "actor"
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
                        <span><strong>${employee.name} ${employee.role === "admin" ? `<em class="role-mark">(админ)</em>` : ""}</strong><small>Принято за месяц: ${monthlyAcceptedCount(employee.id)}</small></span>
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
      </section>
      <button class="primary-button" data-action="create-employee">Добавить сотрудника</button>
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
      <section class="panel">
        <h2 class="panel-title">Список</h2>
        <div class="employee-list">
          ${employees
            .map(
              (employee) => `
                <div class="employee-row">
                  <div class="mini-ring" style="--value: ${employee.efficiency}">${employee.efficiency}%</div>
                  <button class="employee-name-button" data-route="admin-employee-detail" data-employee-id="${employee.id}">
                    <span><strong>${employee.name} ${employee.role === "admin" ? `<em class="role-mark">(админ)</em>` : ""}</strong><small>${employee.role === "admin" ? "админ" : "актер"} · принято за месяц ${monthlyAcceptedCount(employee.id)}</small></span>
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
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">‹</button>
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
  const previousScrollTop = document.querySelector(".screen")?.scrollTop || 0;
  const screens = {
    "auth-confirm": authConfirmScreen,
    avatar: avatarScreen,
    checking: checkingScreen,
    denied: deniedScreen,
    home: homeScreen,
    admin: adminScreen,
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
    report: reportScreen,
    "admin-employees": adminEmployeesScreen,
    "admin-program": adminProgramScreen,
    "admin-prop": adminPropScreen,
    "admin-reports": adminReportsScreen,
  };

  document.querySelector("#app").innerHTML = (screens[state.route] || homeScreen)();
  if (previousRoute === state.route) {
    const screen = document.querySelector(".screen");
    if (screen) screen.scrollTop = previousScrollTop;
  }
  render.previousRoute = state.route;
}

document.addEventListener("click", (event) => {
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
      openVersionScreen();
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
    loadRemoteData();
    syncPendingActions();
  }

  if (action === "toggle-time-editor") {
    state.timeEditorOpen = true;
    render();
    openBookingTimePicker("start");
  }

  if (action === "toggle-bonus-form") {
    state.bonusFormOpen = !state.bonusFormOpen;
    render();
  }

  if (action === "close-version") {
    state.versionGlow = false;
    localStorage.setItem("versionSeen", APP_VERSION);
    setRoute(state.previousRoute || "home");
  }

  if (action === "toggle-order-edit") {
    state.orderEditMode = !state.orderEditMode;
    render();
  }

  if (action === "toggle-order-detail-edit") {
    state.orderDetailEditMode = !state.orderDetailEditMode;
    render();
  }

  if (action === "toggle-program-edit") {
    state.programEditMode = !state.programEditMode;
    render();
  }

  if (action === "apply-discount") {
    state.toast = "Скидка применена";
    render();
    clearToastLater();
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
    if (!confirmDelete("сотрудника")) return;
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

  const input = event.target.closest("[data-booking]");
  if (!input) return;

  const key = input.dataset.booking;
  state.booking[key] = input.type === "number" || input.tagName === "SELECT" ? Number(input.value) : input.value;
});

document.addEventListener("input", (event) => {
  const input = event.target.closest("[data-admin-field]");
  if (!input) return;

  const [group, key] = input.dataset.adminField.split(".");
  state[group][key] = input.type === "checkbox" ? input.checked : group === "newBonus" && key === "amount" ? input.value : input.type === "number" ? Number(input.value) : input.value;
});

document.addEventListener("change", (event) => {
  const bookingInput = event.target.closest("[data-booking]");
  if (bookingInput) {
    const key = bookingInput.dataset.booking;
    state.booking[key] = bookingInput.type === "number" || bookingInput.tagName === "SELECT" ? Number(bookingInput.value) : bookingInput.value;
    if (key === "start" && bookingInput.closest(".time-editor")) {
      const endInput = document.querySelector('.time-editor [data-booking="end"]');
      window.setTimeout(() => {
        endInput?.focus?.();
        endInput?.showPicker?.();
        endInput?.click?.();
      }, 120);
    }
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
  openBookingTimePicker("start");
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
