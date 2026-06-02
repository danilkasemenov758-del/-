const tg = window.Telegram?.WebApp;

if (tg) {
  document.body.classList.add("telegram-runtime");
  tg.ready();
  tg.expand();
  tg.setHeaderColor?.("#ff8a22");
  tg.setBackgroundColor?.("#ff8a22");
}

const API_BASE = window.TOCHKA_API_URL || localStorage.getItem("tochkaApiUrl") || "";

const telegramUser = tg?.initDataUnsafe?.user;

const mockUser = {
  id: telegramUser?.id ?? 101,
  firstName: tg?.initDataUnsafe?.user?.first_name ?? "Даша",
  username: telegramUser?.username ?? "local_user",
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
  filter: "all",
  orderFilter: "mine",
  toast: "",
  reportText: "",
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
  newBonus: { employeeId: "", amount: 0, comment: "" },
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
  if (!currentUser || currentUser.isActive === false) {
    state.user.hasAccess = false;
    if (state.route !== "auth-confirm") state.route = "denied";
    return;
  }

  state.user.id = currentUser.id ?? state.user.id;
  state.user.firstName = currentUser.name || state.user.firstName;
  state.user.username = currentUser.username || state.user.username;
  state.user.role = currentUser.role === "admin" ? "admin" : "actor";
  state.user.hasAccess = true;
}

function rememberDeleted(type, id) {
  const current = new Set((state.deletedEntities[type] || []).map(String));
  current.add(String(id));
  state.deletedEntities[type] = [...current];
  saveState();
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

function returnProp(propId) {
  props = props.map((item) => (item.id === propId ? { ...item, status: "available", place: "Склад" } : item));
  queueAction("return-prop", { propId, actorId: state.user.id });
}

function acceptOrder(orderId) {
  state.acceptedOrders[orderId] = {
    actorId: state.user.id,
    name: state.user.firstName,
    acceptedAt: new Date().toISOString(),
  };
  queueAction("accept-order", { orderId, actorId: state.user.id });
  state.toast = "Заказ принят";
  saveState();
  render();
  clearToastLater();
}

function declineOrder(orderId) {
  delete state.acceptedOrders[orderId];
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
    "create-bonus": "Премия начислена",
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
  programs = [
    ...programs,
    {
      id: Date.now(),
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
  queueAction("create-program", { ...state.newProgram });
  state.newProgram = { title: "", driveUrl: "", script: "", age: "", duration: "", pricePerHour: 0, actorPayPerHour: 0 };
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

function addBonus() {
  if (!state.newBonus.employeeId || Number(state.newBonus.amount || 0) <= 0) return;
  const employee = employees.find((item) => String(item.id) === String(state.newBonus.employeeId));
  queueAction("create-bonus", {
    employeeId: Number(state.newBonus.employeeId),
    employeeName: employee?.name || "",
    amount: Number(state.newBonus.amount || 0),
    comment: state.newBonus.comment,
  });
  state.newBonus = { employeeId: "", amount: 0, comment: "" };
  setRoute("admin-employees");
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

function deleteProgram(id) {
  programs = programs.filter((program) => program.id !== id);
  rememberDeleted("programs", id);
  queueAction("delete-program", { id });
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
    status: "Новый",
    kitStatus: "Комплект не взят",
    available: "Проверяется",
  };
  orders = [order, ...orders];
  state.orderFilter = "month";
  queueAction("create-order", { ...state.booking, order, actorId: state.user.id });
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
  const extrasTotal = (state.booking.extras?.length || 0) * 1200;
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

function filteredOrders() {
  const now = new Date();
  const maxDays = state.orderFilter === "week" ? 7 : state.orderFilter === "month" ? 31 : null;

  return orders.filter((order) => {
    if (state.orderFilter === "mine" && !order.actors?.includes(state.user.firstName)) {
      return state.user.role === "admin";
    }

    if (!maxDays) return true;

    const date = parseUiDate(order.date);
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

function tabbar() {
  const tabs = [
    ["home", "Сегодня"],
    ["orders", "Заказы"],
    ["props", "Реквизит"],
    ["programs", "Программы"],
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
  return `<span class="status-pill">${text}</span>`;
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
      <div class="actor-avatar" aria-label="Фото актера">${state.user.firstName.slice(0, 1)}</div>
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
          ? `<button class="quick-card add-order-card" data-route="new-order">
              <strong>Добавить заказ</strong>
              <img src="./assets/hero-triangle.svg" alt="" />
              <span>+</span>
            </button>`
          : ""
      }
      ${
        state.user.role === "admin"
          ? `<button class="quick-card admin-card" data-route="admin-employees"><strong>Сотрудник</strong><span>+</span></button>
             <button class="quick-card admin-card" data-route="admin-program"><strong>Программа</strong><span>+</span></button>
             <button class="quick-card admin-card" data-route="admin-prop"><strong>Реквизит</strong><span>+</span></button>
             <button class="quick-card admin-card" data-route="admin-reports"><strong>Ошибки</strong><span>!</span></button>`
          : ""
      }
      <button class="quick-card" data-route="orders">
        <strong>Заказы</strong>
        <img src="./assets/orders.svg" alt="" />
      </button>
      <button class="quick-card" data-route="props">
        <strong>Реквизит</strong>
        <img src="./assets/props.svg" alt="" />
      </button>
      <button class="quick-card dark" data-route="programs">
        <strong>Программы</strong>
        <img src="./assets/programs.svg" alt="" />
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
      <input class="search-input" placeholder="Найти заказ" />
      <div class="chips">
        <button class="chip ${state.orderFilter === "mine" ? "active" : ""}" data-order-filter="mine">Мои</button>
        <button class="chip ${state.orderFilter === "week" ? "active" : ""}" data-order-filter="week">Неделя</button>
        <button class="chip ${state.orderFilter === "month" ? "active" : ""}" data-order-filter="month">Месяц</button>
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
                        state.user.role === "admin"
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

function newOrderScreen() {
  const calc = calculateBooking();
  const selectedDate = new Date(`${state.booking.date}T00:00:00`);
  const calendarDays = buildCalendarDays(selectedDate);
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">‹</button>
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
        <h2 class="panel-title">Календарь</h2>
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
      </section>

      <section class="panel">
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
        <p class="small-text" style="margin-top: 10px">${calc.program.duration} · ${calc.program.age}</p>
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
        <h2 class="panel-title">Шоу программы</h2>
        <div class="option-list">
          ${showPrograms.map((item) => checkboxLine(item, "show")).join("")}
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-title">Дополнительно</h2>
        <div class="option-list">
          ${extras.map((item) => checkboxLine(item, "extra")).join("")}
        </div>
      </section>

      <section class="panel long-list-panel">
        <h2 class="panel-title">Анимационные программы</h2>
        <div class="option-list">
          ${animationPrograms.map((item) => checkboxLine(item, "animation")).join("")}
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-title">Экспресс-поздравления</h2>
        <div class="option-list">
          ${expressPrograms.map((item) => checkboxLine(item, "express")).join("")}
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-title">Мастер-класс</h2>
        <div class="option-list">
          ${masterClasses.map((item) => checkboxLine(item, "master")).join("")}
        </div>
      </section>

      <section class="panel summary-panel">
        <h2 class="panel-title">Расчет</h2>
        <div class="summary-line"><span>Состав</span><strong>${calc.selectedPackage.label}</strong></div>
        <div class="summary-line"><span>Тариф / 5 мин</span><strong>${money(calc.ratePerFive)}</strong></div>
        <div class="summary-line"><span>Длительность</span><strong>${calc.durationMinutes} мин</strong></div>
        <div class="summary-line"><span>Сумма заказа</span><strong>${money(calc.orderTotal)}</strong></div>
        <div class="summary-line"><span>ЗП актеров</span><strong>${money(calc.actorTotal)}</strong></div>
        <div class="summary-line"><span>Остаток агентства</span><strong>${money(calc.agencyTotal)}</strong></div>
      </section>

      <button class="primary-button" data-action="create-order">Создать заказ</button>
    </div>
  `, true);
}

function checkboxLine(label, group) {
  const value = `${group}:${label}`;
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
  const accepted = state.acceptedOrders[order.id];
  const acceptedByMe = accepted?.actorId === state.user.id;

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
          <div class="detail-line"><span>Принял</span><strong>${accepted ? accepted.name : "Пока никто"}</strong></div>
        </div>
        ${
          state.user.role === "admin"
            ? `<button class="secondary-button danger-button" style="margin-top: 12px" data-action="delete-order" data-order-id="${order.id}">Удалить заказ</button>`
            : ""
        }
      </section>

      ${
        state.user.role === "actor"
          ? `<section class="panel">
              <h2 class="panel-title">Подтверждение</h2>
              <p class="small-text">${accepted ? `Заказ принял: ${accepted.name}` : "Можно принять заказ. Если нет сети, отметка сохранится и отправится позже."}</p>
              ${
                acceptedByMe
                  ? `<button class="primary-button accepted-button" style="margin-top: 12px" disabled>Заказ принят</button>
                     <button class="secondary-button danger-button" style="margin-top: 8px" data-action="decline-order" data-order-id="${order.id}">Отказаться</button>`
                  : `<button class="primary-button" style="margin-top: 12px" data-action="accept-order" data-order-id="${order.id}" ${accepted ? "disabled" : ""}>
                      ${accepted ? "Занято другим актером" : "Принять заказ"}
                    </button>`
              }
            </section>`
          : `<section class="panel">
              <h2 class="panel-title">Кто принял заказ</h2>
              <p class="small-text">${accepted ? `${accepted.name} · ожидает синхронизации/сохранено` : "Пока никто не принял заказ."}</p>
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
                  state.user.role === "admin"
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
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="order">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Комплект</h1>
    <div class="content-stack">
      <section class="panel">
        <h2 class="panel-title">Челлендж Пати Влада А4</h2>
        <p class="small-text">14 из 16 предметов доступны. Заняты: баннер и микрофон.</p>
        <button class="primary-button" style="margin-top: 12px" data-action="take-kit">Взять комплект</button>
      </section>
      <div class="orders-stack">
        ${props
          .filter((item) => item.kit)
          .map(
            (item) => `
              <button class="prop-row" data-action="${item.status === "mine" ? "return-prop" : "take-prop"}" data-prop-id="${item.id}">
                <span><strong>${item.name}</strong><span>${statusText(item.status)} · ${item.place}</span></span>
                <span class="row-icon ${item.status === "mine" ? "return" : ""}" aria-label="${item.status === "mine" ? "Вернуть" : "Взять"}">
                  ${item.status === "mine" ? "↩" : "+"}
                </span>
              </button>
            `
          )
          .join("")}
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
                state.user.role === "admin"
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
        <h2 class="panel-title">${program.title}</h2>
        <div class="detail-grid">
          <div class="detail-line"><span>Возраст</span><strong>${program.age}</strong></div>
          <div class="detail-line"><span>Длительность</span><strong>${program.duration}</strong></div>
        </div>
        ${
          program.driveUrl
            ? `<button class="secondary-button" style="margin-top: 12px" data-open-url="${program.driveUrl}">Открыть диск</button>`
            : ""
        }
      </section>
      <section class="panel">
        <h2 class="panel-title">Музыка</h2>
        <div class="orders-stack">
          ${program.tracks
            .map(
              (track) => `
                <button class="track-row">
                  <span><strong>${track}</strong><span>трек сохранится для выезда</span></span>
                  <span class="row-icon" aria-label="Пуск">▶</span>
                </button>
              `
            )
            .join("")}
        </div>
      </section>
      <section class="panel">
        <h2 class="panel-title">Сценарий</h2>
        <p class="small-text script-text">${program.script || "Сценарий пока не добавлен."}</p>
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
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">‹</button>
      ${syncPill()}
    </div>
    <h1 class="page-title">Профиль</h1>
    <div class="content-stack">
      <section class="panel">
        <div class="detail-grid">
          <div class="detail-line"><span>Имя</span><strong>${state.user.firstName}</strong></div>
          <div class="detail-line"><span>Telegram</span><strong>@${state.user.username}</strong></div>
          <div class="detail-line"><span>Роль</span><strong>${state.user.role === "admin" ? "админ" : "актер"}</strong></div>
          <div class="detail-line"><span>Очередь</span><strong>${state.syncQueue.length}</strong></div>
        </div>
      </section>
      ${
        state.user.role === "actor"
          ? `<section class="panel efficiency-panel">
              <h2 class="panel-title">Эффективность</h2>
              <div class="efficiency-wrap">
                <div class="efficiency-ring" style="--value: ${currentEmployee.efficiency}">
                  <strong>${currentEmployee.efficiency}%</strong>
                </div>
                <div class="efficiency-stats">
                  <div><span>Принято</span><strong>${currentEmployee.accepted}</strong></div>
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
                      <div class="employee-row">
                        <div class="mini-ring" style="--value: ${employee.efficiency}">${employee.efficiency}%</div>
                        <span><strong>${employee.name}</strong><small>Принято: ${employee.accepted}</small></span>
                        <b>${employee.rating}</b>
                      </div>
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

function adminEmployeesScreen() {
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">‹</button>
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
        <h2 class="panel-title">Начислить премию</h2>
        <select class="booking-input" data-admin-field="newBonus.employeeId">
          <option value="">Выберите сотрудника</option>
          ${employees
            .map((employee) => `<option value="${employee.id}" ${String(state.newBonus.employeeId) === String(employee.id) ? "selected" : ""}>${employee.name}</option>`)
            .join("")}
        </select>
        <input class="booking-input" data-admin-field="newBonus.amount" type="number" min="0" placeholder="Сумма премии" value="${state.newBonus.amount}" style="margin-top: 8px" />
        <textarea class="booking-input booking-textarea" data-admin-field="newBonus.comment" placeholder="Комментарий">${state.newBonus.comment}</textarea>
        <button class="primary-button" data-action="create-bonus" style="margin-top: 8px">Начислить</button>
      </section>
      <section class="panel">
        <h2 class="panel-title">Список</h2>
        <div class="employee-list">
          ${employees
            .map(
              (employee) => `
                <div class="employee-row">
                  <div class="mini-ring" style="--value: ${employee.efficiency}">${employee.efficiency}%</div>
                  <span><strong>${employee.name}</strong><small>${employee.role === "admin" ? "админ" : "актер"} · оценка ${employee.rating}</small></span>
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
      <button class="icon-button" data-route="home">‹</button>
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
      <button class="primary-button" data-action="create-program">Добавить программу</button>
    </div>
  `, true);
}

function adminPropScreen() {
  return appFrame(`
    <div class="top-row">
      <button class="icon-button" data-route="home">‹</button>
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
      <section class="panel">
        <h2 class="panel-title">Удалить реквизит</h2>
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
                        <button class="mini-delete-button" data-action="delete-prop" data-prop-id="${item.id}" aria-label="Удалить реквизит">×</button>
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
      <button class="icon-button" data-route="home">‹</button>
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
  const screens = {
    "auth-confirm": authConfirmScreen,
    checking: checkingScreen,
    denied: deniedScreen,
    home: homeScreen,
    orders: ordersScreen,
    order: orderScreen,
    "new-order": newOrderScreen,
    props: propsScreen,
    kit: kitScreen,
    programs: programsScreen,
    "program-detail": programDetailScreen,
    saved: savedScreen,
    profile: profileScreen,
    report: reportScreen,
    "admin-employees": adminEmployeesScreen,
    "admin-program": adminProgramScreen,
    "admin-prop": adminPropScreen,
    "admin-reports": adminReportsScreen,
  };

  document.querySelector("#app").innerHTML = (screens[state.route] || homeScreen)();
}

document.addEventListener("click", (event) => {
  const routeButton = event.target.closest("[data-route]");
  const actionButton = event.target.closest("[data-action]");
  const urlButton = event.target.closest("[data-open-url]");
  const filterButton = event.target.closest("[data-filter]");
  const orderFilterButton = event.target.closest("[data-order-filter]");
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

  if (urlButton) {
    const url = urlButton.dataset.openUrl;
    tg?.openLink?.(url);
    if (!tg) window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  if (routeButton) {
    const options = {};
    if (routeButton.dataset.orderId) options.activeOrderId = Number(routeButton.dataset.orderId);
    if (routeButton.dataset.programId) options.activeProgramId = Number(routeButton.dataset.programId);
    setRoute(routeButton.dataset.route, options);
    return;
  }

  if (!actionButton) return;

  const action = actionButton.dataset.action;
  const orderId = Number(actionButton.dataset.orderId || state.activeOrderId);

  if (action === "take-kit") {
    queueAction("take-kit", { orderId, actorId: state.user.id });
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

  if (action === "create-prop") {
    addProp();
  }

  if (action === "create-bonus") {
    addBonus();
  }

  if (action === "delete-employee") {
    deleteEmployee(Number(actionButton.dataset.employeeId));
  }

  if (action === "delete-order") {
    deleteOrder(Number(actionButton.dataset.orderId));
  }

  if (action === "delete-program") {
    deleteProgram(Number(actionButton.dataset.programId));
  }

  if (action === "delete-prop") {
    deleteProp(Number(actionButton.dataset.propId));
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
  state[group][key] = input.type === "checkbox" ? input.checked : input.type === "number" ? Number(input.value) : input.value;
});

document.addEventListener("change", (event) => {
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
