import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_API = "https://api.telegram.org";

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&");
}

function formatDate(dateStr: string): string {
  const parsed = new Date(dateStr);
  if (!Number.isNaN(parsed.getTime())) {
    return new Intl.DateTimeFormat("ru-RU", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(parsed);
  }
  return dateStr;
}

function buildOrderMessage(body: OrderPayload): string {
  const lines: string[] = [];

  lines.push("🛒 *Новый заказ*");
  lines.push("");
  lines.push(`👤 *Имя:* ${escapeMarkdown(body.customer.firstName)}`);
  lines.push(`📞 *Телефон:* ${escapeMarkdown(body.customer.phone)}`);

  if (body.customer.social) {
    lines.push(`💬 *Мессенджер:* ${escapeMarkdown(body.customer.social)}`);
  }

  const addressParts = [
    body.customer.city,
    body.customer.street,
    body.customer.house ? `д. ${body.customer.house}` : null,
    body.customer.apartment ? `кв. ${body.customer.apartment}` : null,
    body.customer.floor ? `эт. ${body.customer.floor}` : null,
    body.customer.intercom ? `домофон ${body.customer.intercom}` : null,
  ].filter(Boolean);

  if (addressParts.length > 0) {
    lines.push(`📍 *Адрес:* ${escapeMarkdown(addressParts.join(", "))}`);
  }

  lines.push("");
  lines.push("📦 *Состав заказа:*");

  for (const item of body.items) {
    const itemTotal = item.pricePerDay * item.selectedDays.length;
    lines.push(
      `  • ${escapeMarkdown(item.rationName ?? `Рацион ${item.calories} ккал`)} — ${item.selectedDays.length} дн\\. — *${itemTotal} BYN*`,
    );
    if (item.selectedDays.length > 0) {
      const daysFormatted = item.selectedDays.map(formatDate).join(", ");
      lines.push(`    📅 ${escapeMarkdown(daysFormatted)}`);
    }
  }

  lines.push("");
  lines.push(`💰 *Итого: ${escapeMarkdown(String(body.totalPrice))} BYN*`);

  return lines.join("\n");
}

function buildContactMessage(body: ContactPayload): string {
  const lines: string[] = [];

  lines.push("📩 *Заявка с сайта*");
  lines.push("");
  lines.push(`👤 *Имя:* ${escapeMarkdown(body.name)}`);
  lines.push(`📞 *Телефон:* ${escapeMarkdown(body.phone)}`);

  if (body.hasBasket) {
    lines.push("");
    lines.push(
      "🛒 Клиент оформил заказ через корзину \\(см\\. раздел Заказы\\)",
    );
  } else {
    lines.push("");
    lines.push("ℹ️ Клиент хочет *консультацию* — корзина была пустой");
  }

  return lines.join("\n");
}

type OrderItem = {
  calories: string;
  rationName?: string;
  pricePerDay: number;
  selectedDays: string[];
};

type OrderPayload = {
  type: "order";
  customer: {
    firstName: string;
    phone: string;
    social: string;
    city: string;
    street: string;
    house: string;
    apartment: string;
    floor: string;
    intercom: string;
  };
  items: OrderItem[];
  totalPrice: number;
};

type ContactPayload = {
  type: "contact";
  name: string;
  phone: string;
  hasBasket: boolean;
};

type Payload = OrderPayload | ContactPayload;

async function sendTelegramMessage(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set");
  }

  const url = `${TELEGRAM_API}/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "MarkdownV2",
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Telegram API error ${res.status}: ${errorBody}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Payload;

    let message: string;

    if (body.type === "order") {
      message = buildOrderMessage(body);
    } else if (body.type === "contact") {
      message = buildContactMessage(body);
    } else {
      return NextResponse.json({ error: "Unknown type" }, { status: 400 });
    }

    await sendTelegramMessage(message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[telegram/route] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
