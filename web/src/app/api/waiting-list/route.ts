import { NextRequest, NextResponse } from "next/server";

/* ─── Tipos ─────────────────────────────────────────────────────────────── */

interface WaitingListPayload {
  nome: string;
  email: string;
  telefone?: string;
  interesse?: "individual" | "familiar" | "empresarial" | "";
}

/* ─── Validação ─────────────────────────────────────────────────────────── */

function validate(payload: unknown): {
  data: WaitingListPayload | null;
  error: string | null;
} {
  if (!payload || typeof payload !== "object") {
    return { data: null, error: "Payload inválido." };
  }

  const p = payload as Record<string, unknown>;

  if (!p.nome || typeof p.nome !== "string" || p.nome.trim().length < 2) {
    return { data: null, error: "Nome deve ter pelo menos 2 caracteres." };
  }

  if (!p.email || typeof p.email !== "string") {
    return { data: null, error: "Email é obrigatório." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(p.email)) {
    return { data: null, error: "Email inválido." };
  }

  const interesse = (p.interesse as string) || "";
  if (interesse && !["individual", "familiar", "empresarial"].includes(interesse)) {
    return { data: null, error: "Opção de interesse inválida." };
  }

  return {
    data: {
      nome: p.nome.trim(),
      email: p.email.trim().toLowerCase(),
      telefone: typeof p.telefone === "string" ? p.telefone.trim() : undefined,
      interesse: interesse as WaitingListPayload["interesse"],
    },
    error: null,
  };
}

/* ─── PostHog server-side tracking ─────────────────────────────────────── */

async function trackPosthog(data: WaitingListPayload) {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!token) return;

  const distinctId = `waiting-list:${data.email}`;

  try {
    await fetch("https://us.i.posthog.com/capture/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: token,
        event: "waiting_list_submitted",
        distinctId,
        properties: {
          nome: data.nome,
          email: data.email,
          telefone: data.telefone || null,
          interesse: data.interesse || null,
          source: "site",
          timestamp: new Date().toISOString(),
        },
      }),
    });
  } catch {
    // analytics nunca quebra UX
  }
}

/* ─── Notificação via webhook (Discord/Slack/Make) ──────────────────────── */

async function notifyWebhook(data: WaitingListPayload) {
  const webhookUrl = process.env.WAITING_LIST_WEBHOOK_URL;
  if (!webhookUrl) return;

  const embed = {
    embeds: [
      {
        title: "📋 Nova inscrição na Lista de Espera",
        color: 0x7b6db2, // amelia-purple
        fields: [
          { name: "Nome", value: data.nome, inline: true },
          { name: "Email", value: data.email, inline: true },
          {
            name: "Telefone",
            value: data.telefone || "(não informado)",
            inline: true,
          },
          {
            name: "Interesse",
            value:
              data.interesse === "individual"
                ? "Individual"
                : data.interesse === "familiar"
                  ? "Familiar"
                  : data.interesse === "empresarial"
                    ? "Empresarial"
                    : "Não especificado",
            inline: true,
          },
        ],
        footer: { text: "Amélia Saúde — Lista de Espera" },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed),
    });

    if (!res.ok) {
      console.warn(
        `[waiting-list] Webhook respondeu ${res.status}: ${await res.text().catch(() => "n/a")}`,
      );
    }
  } catch (err) {
    console.warn("[waiting-list] Webhook error:", err);
  }
}

/* ─── POST handler ──────────────────────────────────────────────────────── */

export async function POST(request: NextRequest) {
  try {
    const payload: unknown = await request.json();

    const { data, error } = validate(payload);
    if (error || !data) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    // Dispara notificações em paralelo (não bloqueiam resposta)
    Promise.all([trackPosthog(data), notifyWebhook(data)]).catch(() => {});

    return NextResponse.json(
      {
        success: true,
        message:
          "Recebemos sua inscrição! Entraremos em contato quando houver novidades.",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[waiting-list] Erro interno:", err);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}
