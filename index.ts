import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-telegram-init-data",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return json({ ok: true });
  }

  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    if (request.method === "GET" && pathname.endsWith("/api/health")) {
      return json({ ok: true });
    }

    if (request.method === "GET" && pathname.endsWith("/api/bootstrap")) {
      return json(await bootstrap(url));
    }

    if (request.method === "POST" && pathname.endsWith("/api/actions")) {
      const action = await request.json();
      await handleAction(action);
      return json({ ok: true });
    }

    return json({ error: "Not found" }, 404);
  } catch (error) {
    return json({ error: errorMessage(error) }, 500);
  }
});

async function bootstrap(url: URL) {
  const currentUser = await ensureCurrentUser(url);
  const [employees, orders, props, programs, acceptedOrders, reports, bonuses, promoCodes, ambassadorWithdrawals] = await Promise.all([
    selectEmployees(),
    safeSelect("orders", "*", "date"),
    safeSelect("props", "id, name, status, place, kit", "name"),
    safeSelect("programs", "*", "title"),
    safeSelect("accepted_orders", "order_id, actor_id, name, accepted_at", "order_id"),
    safeSelect("reports", "id, actor_id, text, route, created_at", "created_at"),
    selectBonuses(),
    selectPromoCodes(),
    selectAmbassadorWithdrawals(),
  ]);

  return {
    currentUser,
    employees,
    orders: orders.map(mapOrder),
    props,
    programs: programs.map(mapProgram),
    acceptedOrders: Object.fromEntries(
      acceptedOrders.map((row) => [
        row.order_id,
        { actorId: row.actor_id, name: row.name, acceptedAt: row.accepted_at },
      ])
    ),
    reports: reports.map((report) => ({
      ...report,
      actorName: `Сотрудник #${report.actor_id ?? ""}`,
      createdAt: report.created_at,
    })),
    bonuses: bonuses.map((bonus) => ({
      id: bonus.id,
      employeeId: bonus.employee_id,
      employeeName: bonus.employee_name,
      amount: Number(bonus.amount ?? 0),
      comment: bonus.comment,
      createdById: bonus.created_by_id,
      createdByName: bonus.created_by_name,
      createdAt: bonus.created_at,
    })),
    promoCodes: promoCodes.map((promo) => ({
      id: promo.id,
      code: promo.code,
      discount: Number(promo.discount ?? 0),
      description: promo.description ?? "",
      createdById: promo.created_by_id,
      createdByName: promo.created_by_name,
      createdAt: promo.created_at,
      isActive: promo.is_active !== false,
    })),
    ambassadorWithdrawals: ambassadorWithdrawals.map((item) => ({
      id: item.id,
      ambassadorId: item.ambassador_id,
      ambassadorName: item.ambassador_name,
      amount: Number(item.amount ?? 0),
      status: item.status,
      createdAt: item.created_at,
    })),
  };
}

async function selectEmployees() {
  try {
    return await select("employees", "id, telegram_id, name, username, role, is_active, efficiency, accepted, late, rating, ambassador_code, bunny_balance, bunny_pending", "name", { is_active: true });
  } catch (error) {
    console.warn(`Failed to select active employees: ${errorMessage(error)}`);
    return await safeSelect("employees", "id, telegram_id, name, username, role, efficiency, accepted, late, rating", "name");
  }
}

async function selectBonuses() {
  try {
    return await select("bonuses", "id, employee_id, employee_name, amount, comment, created_by_id, created_by_name, created_at", "created_at");
  } catch (error) {
    console.warn(`Failed to select bonuses with author: ${errorMessage(error)}`);
    return await safeSelect("bonuses", "id, employee_id, employee_name, amount, comment, created_at", "created_at");
  }
}

async function selectPromoCodes() {
  return await safeSelect("promo_codes", "id, code, discount, description, created_by_id, created_by_name, created_at, is_active", "created_at", { is_active: true });
}

async function selectAmbassadorWithdrawals() {
  return await safeSelect("ambassador_withdrawals", "id, ambassador_id, ambassador_name, amount, status, created_at", "created_at");
}

async function safeSelect(table: string, columns = "*", order?: string, equals: Record<string, unknown> = {}) {
  try {
    return await select(table, columns, order, equals);
  } catch (error) {
    console.warn(`Failed to select ${table}: ${errorMessage(error)}`);
    return [];
  }
}

async function ensureCurrentUser(url: URL) {
  const telegramId = Number(url.searchParams.get("telegram_id") || 0);
  const name = url.searchParams.get("name") || "Актер";
  const username = url.searchParams.get("username") || "";

  if (!telegramId) {
    return { id: 101, telegramId: 101, name, username, role: "actor", isActive: true };
  }

  const normalizedUsername = username.replace(/^@/, "");
  let existingResult = await supabase
    .from("employees")
    .select("id, telegram_id, name, username, role, is_active, efficiency, accepted, late, rating, ambassador_code, bunny_balance, bunny_pending")
    .eq("telegram_id", telegramId)
    .maybeSingle();
  if (existingResult.error?.code === "42703") {
    existingResult = await supabase
      .from("employees")
      .select("id, telegram_id, name, username, role, efficiency, accepted, late, rating")
      .eq("telegram_id", telegramId)
      .maybeSingle();
  }
  let { data: existing, error: existingError } = existingResult;
  if (existingError) throw existingError;

  if (!existing && normalizedUsername) {
    const byUsername = await supabase
      .from("employees")
      .select("id, telegram_id, name, username, role, is_active, efficiency, accepted, late, rating, ambassador_code, bunny_balance, bunny_pending")
      .in("username", [normalizedUsername, `@${normalizedUsername}`])
      .maybeSingle();
    if (byUsername.error?.code === "42703") {
      const fallback = await supabase
        .from("employees")
        .select("id, telegram_id, name, username, role, efficiency, accepted, late, rating")
        .in("username", [normalizedUsername, `@${normalizedUsername}`])
        .maybeSingle();
      existing = fallback.data;
      existingError = fallback.error;
    } else {
      existing = byUsername.data;
      existingError = byUsername.error;
    }
    if (existingError) throw existingError;
    if (existing && !existing.telegram_id) {
      await supabase.from("employees").update({ telegram_id: telegramId }).eq("id", existing.id);
      existing.telegram_id = telegramId;
    }
  }

  if (existing) {
    return {
      id: existing.id,
      telegramId: existing.telegram_id,
      name: existing.name,
      username: existing.username,
      role: existing.role,
      isActive: existing.is_active !== false,
      efficiency: existing.efficiency,
      accepted: existing.accepted,
      rating: existing.rating,
      ambassadorCode: existing.ambassador_code ?? "",
      bunnyBalance: Number(existing.bunny_balance ?? 0),
      bunnyPending: Number(existing.bunny_pending ?? 0),
    };
  }

  return {
    id: telegramId,
    telegramId,
    name,
    username,
    role: "actor",
    isActive: false,
    efficiency: 0,
    accepted: 0,
    rating: 0,
  };
}

async function select(table: string, columns = "*", order?: string, equals: Record<string, unknown> = {}) {
  let query = supabase.from(table).select(columns);
  for (const [key, value] of Object.entries(equals)) {
    query = query.eq(key, value);
  }
  if (order) query = query.order(order);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

async function handleAction(action: any) {
  const payload = action.payload ?? {};

  await supabase.from("actions").upsert({
    id: action.id,
    type: action.type,
    payload,
    created_at: action.createdAt ?? new Date().toISOString(),
    status: "received",
  });

  if (action.type === "accept-order") {
    const employee = await getEmployee(payload.actorId);
    const order = await getOrder(payload.orderId);
    await supabase.from("accepted_orders").upsert({
      order_id: payload.orderId,
      actor_id: payload.actorId,
      name: employee?.name ?? "Актер",
      accepted_at: new Date().toISOString(),
    });
    await supabase
      .from("employees")
      .update({
        accepted: Number(employee?.accepted ?? 0) + 1,
        efficiency: Math.min(100, Number(employee?.efficiency ?? 0) + 5),
      })
      .eq("id", payload.actorId);
    await notifyAdmins(`✅ ${employee?.name ?? "Актер"} принял заказ: ${order?.title ?? `#${payload.orderId}`}\n${order?.date ?? ""} ${order?.time ?? ""}`.trim());
  }

  if (action.type === "decline-order") {
    const employee = await getEmployee(payload.actorId);
    await supabase
      .from("accepted_orders")
      .delete()
      .eq("order_id", payload.orderId)
      .eq("actor_id", payload.actorId);
    await supabase
      .from("employees")
      .update({
        accepted: Math.max(0, Number(employee?.accepted ?? 0) - 1),
        efficiency: Math.max(0, Number(employee?.efficiency ?? 0) - 5),
      })
      .eq("id", payload.actorId);
  }

  if (action.type === "take-prop") {
    const employee = await getEmployee(payload.actorId);
    const prop = await getProp(payload.propId);
    await supabase
      .from("props")
      .update({ status: "mine", place: `У ${employee?.name ?? "актера"}` })
      .eq("id", payload.propId);
    await notifyAdmins(`📦 ${employee?.name ?? "Актер"} взял реквизит: ${prop?.name ?? `#${payload.propId}`}`);
  }

  if (action.type === "take-kit") {
    const employee = await getEmployee(payload.actorId);
    const order = payload.orderId ? await getOrder(payload.orderId) : null;
    const propIds = Array.isArray(payload.propIds) ? payload.propIds : [];
    if (propIds.length) {
      await supabase
        .from("props")
        .update({ status: "mine", place: `У ${employee?.name ?? "актера"}` })
        .in("id", propIds);
    }
    if (payload.orderId) {
      await supabase
        .from("orders")
        .update({ kit_status: `Комплект у ${employee?.name ?? "актера"}` })
        .eq("id", payload.orderId);
    }
    await notifyAdmins(`📦 ${employee?.name ?? "Актер"} взял комплект${order?.title ? ` для заказа: ${order.title}` : ""}`);
  }

  if (action.type === "return-prop") {
    await supabase
      .from("props")
      .update({ status: "available", place: "Склад" })
      .eq("id", payload.propId);
  }

  if (action.type === "report") {
    const employee = await getEmployee(payload.actorId);
    await supabase.from("reports").insert({
      actor_id: payload.actorId,
      text: payload.text ?? "",
      route: payload.route ?? "",
      created_at: new Date().toISOString(),
    });
    await notifyAdmins(`⚠️ Новая ошибка от ${employee?.name ?? "сотрудника"}:\n${payload.text ?? ""}`);
  }

  if (action.type === "create-order") {
    const order = payload.order ?? {};
    const record: Record<string, unknown> = {
      title: order.title ?? payload.title ?? "Новый заказ",
      date: order.date ?? payload.date ?? "",
      time: order.time ?? payload.start ?? "",
      address: order.address ?? payload.address ?? "",
      role: order.role ?? payload.package ?? "",
      actors: order.actors ?? [],
      promo_code: order.promoCode ?? payload.promoCode ?? "",
      ambassador_code: order.ambassadorCode ?? payload.ambassadorCode ?? "",
      ambassador_bunny: Number(order.ambassadorBunny ?? 0),
      status: order.status ?? "Новый",
      kit_status: order.kitStatus ?? "Комплект не взят",
      available: order.available ?? "Проверяется",
    };
    record.total = Number(order.total ?? 0);
    record.actor_pay = Number(order.actorPay ?? 0);
    if (order.id) record.id = order.id;
    let { error } = await supabase.from("orders").insert(record);
    if (error?.code === "42703") {
      delete record.total;
      delete record.actor_pay;
      delete record.promo_code;
      delete record.ambassador_code;
      delete record.ambassador_bunny;
      const retry = await supabase.from("orders").insert(record);
      error = retry.error;
    }
    if (error) throw error;
    if (order.ambassadorCode && Number(order.ambassadorBunny ?? 0) > 0) {
      await creditAmbassador(order.ambassadorCode, Number(order.ambassadorBunny ?? 0));
    }
    await notifyActors(`🎉 Новый заказ: ${record.title}\n${record.date} ${record.time}\n${record.address || ""}`.trim());
  }

  if (action.type === "create-employee") {
    const record: Record<string, unknown> = {
      id: Date.now(),
      name: payload.name,
      username: String(payload.username ?? "").replace(/^@/, ""),
      role: payload.role ?? "actor",
      is_active: true,
      ambassador_code: payload.ambassadorCode ?? "",
      bunny_balance: 0,
      bunny_pending: 0,
    };
    let { error } = await supabase.from("employees").insert(record);
    if (error?.code === "42703") {
      delete record.is_active;
      delete record.ambassador_code;
      delete record.bunny_balance;
      delete record.bunny_pending;
      const retry = await supabase.from("employees").insert(record);
      error = retry.error;
    }
    if (error) throw error;
  }

  if (action.type === "create-promo") {
    await supabase.from("promo_codes").upsert({
      id: payload.id,
      code: String(payload.code ?? "").toUpperCase(),
      discount: Number(payload.discount ?? 0),
      description: payload.description ?? "",
      created_by_id: payload.createdById,
      created_by_name: payload.createdByName ?? "",
      created_at: payload.createdAt ?? new Date().toISOString(),
      is_active: payload.isActive !== false,
    });
  }

  if (action.type === "withdraw-bunny") {
    await supabase.from("ambassador_withdrawals").insert({
      id: payload.id,
      ambassador_id: payload.ambassadorId,
      ambassador_name: payload.ambassadorName ?? "",
      amount: Number(payload.amount ?? 0),
      status: payload.status ?? "sent",
      created_at: payload.createdAt ?? new Date().toISOString(),
    });
    await supabase
      .from("employees")
      .update({ bunny_balance: 0, bunny_pending: Number(payload.amount ?? 0) })
      .eq("id", payload.ambassadorId);
    await notifyAdmins(`💰 ${payload.ambassadorName ?? "Амбассадор"} отправил заявку на вывод: ${Number(payload.amount ?? 0)} банни`);
  }

  if (action.type === "create-program") {
    const record: Record<string, unknown> = {
      title: payload.title,
      age: payload.age ?? "",
      duration: payload.duration ?? "",
      drive_url: payload.driveUrl ?? "",
      script: payload.script ?? "",
      price_per_hour: Number(payload.pricePerHour ?? 0),
      actor_pay_per_hour: Number(payload.actorPayPerHour ?? 0),
      tracks: [],
    };
    if (payload.id) record.id = payload.id;
    await supabase.from("programs").insert(record);
    await notifyActors(`🎭 Новая программа: ${payload.title}`);
  }

  if (action.type === "update-program") {
    await supabase
      .from("programs")
      .update({
        title: payload.title ?? "",
        age: payload.age ?? "",
        duration: payload.duration ?? "",
        drive_url: payload.driveUrl ?? "",
        script: payload.script ?? "",
      })
      .eq("id", payload.id);
  }

  if (action.type === "create-prop") {
    await supabase.from("props").insert({
      name: payload.name,
      status: payload.status ?? "available",
      place: payload.place ?? "Склад",
      kit: Boolean(payload.kit ?? true),
    });
  }

  if (action.type === "create-bonus") {
    const record: Record<string, unknown> = {
      id: payload.id,
      employee_id: payload.employeeId,
      employee_name: payload.employeeName ?? "",
      amount: Number(payload.amount ?? 0),
      comment: payload.comment ?? "",
      created_by_id: payload.createdById,
      created_by_name: payload.createdByName ?? "",
      created_at: new Date().toISOString(),
    };
    let { error } = await supabase.from("bonuses").insert(record);
    if (error?.code === "42703") {
      delete record.created_by_id;
      delete record.created_by_name;
      const retry = await supabase.from("bonuses").insert(record);
      error = retry.error;
    }
    if (error) throw error;
  }

  if (action.type === "update-bonus") {
    await supabase.from("bonuses").update({ amount: Number(payload.amount ?? 0) }).eq("id", payload.id);
  }

  if (action.type === "delete-bonus") {
    await supabase.from("bonuses").delete().eq("id", payload.id);
  }

  if (action.type === "update-order-pay") {
    await supabase.from("orders").update({ actor_pay: Number(payload.actorPay ?? 0) }).eq("id", payload.orderId);
  }

  if (action.type === "delete-order-pay") {
    await supabase.from("orders").update({ actor_pay: 0 }).eq("id", payload.orderId);
  }

  if (action.type === "update-employee-stats") {
    const employee = await getEmployee(payload.employeeId);
    await supabase
      .from("employees")
      .update({
        accepted: Math.max(0, Number(employee?.accepted ?? 0) + Number(payload.delta ?? 0)),
        efficiency: Math.max(0, Math.min(100, Number(employee?.efficiency ?? 0) + Number(payload.delta ?? 0) * 5)),
      })
      .eq("id", payload.employeeId);
  }

  if (action.type === "delete-employee") {
    await supabase.from("employees").update({ is_active: false }).eq("id", payload.id);
  }

  if (action.type === "delete-order") {
    await supabase.from("orders").delete().eq("id", payload.id);
    await supabase.from("accepted_orders").delete().eq("order_id", payload.id);
  }

  if (action.type === "delete-program") {
    await supabase.from("programs").delete().eq("id", payload.id);
  }

  if (action.type === "delete-prop") {
    await supabase.from("props").delete().eq("id", payload.id);
  }

  if (action.type === "delete-report") {
    await supabase.from("reports").delete().eq("id", payload.id);
  }
}

async function getEmployee(id: number) {
  const { data, error } = await supabase.from("employees").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

async function getOrder(id: number) {
  if (!id) return null;
  const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.warn(`Failed to get order ${id}: ${errorMessage(error)}`);
    return null;
  }
  return data;
}

async function creditAmbassador(code: string, amount: number) {
  if (!code || amount <= 0) return;
  try {
    const { data, error } = await supabase
      .from("employees")
      .select("id, name, bunny_balance")
      .eq("ambassador_code", code)
      .eq("role", "ambassador")
      .maybeSingle();
    if (error || !data) return;
    await supabase
      .from("employees")
      .update({ bunny_balance: Number(data.bunny_balance ?? 0) + amount })
      .eq("id", data.id);
    await notifyAdmins(`🐰 Амбассадору ${data.name} начислено ${amount} банни по коду ${code}`);
  } catch (error) {
    console.warn(`Failed to credit ambassador: ${errorMessage(error)}`);
  }
}

async function getProp(id: number) {
  if (!id) return null;
  const { data, error } = await supabase.from("props").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.warn(`Failed to get prop ${id}: ${errorMessage(error)}`);
    return null;
  }
  return data;
}

async function notifyActors(text: string) {
  await notifyEmployees(["actor", "admin"], text);
}

async function notifyAdmins(text: string) {
  await notifyEmployees(["admin"], text);
}

async function notifyEmployees(roles: string[], text: string) {
  if (!TELEGRAM_BOT_TOKEN || !text.trim()) return;

  try {
    const { data, error } = await supabase
      .from("employees")
      .select("telegram_id, role, is_active")
      .in("role", roles)
      .not("telegram_id", "is", null);
    if (error) throw error;

    const recipients = [...new Set((data ?? []).filter((employee) => employee.is_active !== false).map((employee) => employee.telegram_id).filter(Boolean))];
    await Promise.all(recipients.map((chatId) => sendTelegramMessage(chatId, text)));
  } catch (error) {
    console.warn(`Telegram notify failed: ${errorMessage(error)}`);
  }
}

async function sendTelegramMessage(chatId: number | string, text: string) {
  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });
  if (!response.ok) {
    console.warn(`Telegram sendMessage failed ${response.status}: ${await response.text()}`);
  }
}

function mapOrder(row: any) {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    time: row.time,
    address: row.address,
    role: row.role,
    actors: row.actors ?? [],
    status: row.status,
    kitStatus: row.kit_status,
    available: row.available,
    total: row.total,
    actorPay: row.actor_pay,
    promoCode: row.promo_code,
    ambassadorCode: row.ambassador_code,
    ambassadorBunny: row.ambassador_bunny,
  };
}

function mapProgram(row: any) {
  return {
    id: row.id,
    title: row.title,
    age: row.age,
    duration: row.duration,
    driveUrl: row.drive_url,
    script: row.script,
    pricePerHour: row.price_per_hour,
    actorPayPerHour: row.actor_pay_per_hour,
    tracks: row.tracks ?? [],
  };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
