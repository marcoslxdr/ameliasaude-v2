import { chromium } from "/Users/marcosalexandre/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { writeFile } from "node:fs/promises";
import assert from "node:assert/strict";

// LOCAL_QA: real CRM greeting/name turns; controlled transport errors are
// injected only to prove UI recovery. No consent or external messages sent.
const browser = await chromium.launch({ headless: true, channel: "chrome" });
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(60_000);
  const counts = { start: 0, reset: 0, message: 0, poll: 0 };
  let fault = null;
  await page.route("**/api/chat", async route => {
    const body = route.request().postDataJSON();
    counts[body.action] += 1;
    if (body.action === "message" && fault) {
      const status = fault;
      fault = null;
      return route.fulfill({ status, contentType: "application/json", body: JSON.stringify({ error: status === 410 ? "session_closed" : "chat_unavailable" }) });
    }
    await route.continue();
  });
  await page.goto("http://127.0.0.1:3411", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Fale com a Amélia" }).click();
  const selectSales = () => page.getByRole("button", { name: "Quero contratar Conhecer os planos e falar com vendas.", exact: true }).click();
  await selectSales();
  const input = page.getByRole("textbox", { name: "Mensagem para Vendas" });
  await input.waitFor();
  const send = async text => {
    await input.fill(text);
    await page.getByRole("button", { name: "Enviar mensagem", exact: true }).click();
  };
  fault = 503;
  await send("QaAmeliaRetomada");
  await page.getByRole("dialog").getByRole("alert").getByText(/Não foi possível conectar/).waitFor();
  const initialLog = await page.getByRole("log").innerText();
  await page.getByRole("button", { name: "Escolher vendas ou atendimento" }).click();
  await selectSales();
  await input.waitFor();
  assert.equal(counts.start, 1, "Reopening after a transient error must retain the established session");
  assert.equal(await page.getByRole("log").innerText(), initialLog);
  await send("QaAmeliaRetomada");
  const confirm = page.getByRole("button", { name: "Confirmar", exact: true });
  await confirm.waitFor();
  await page.getByRole("dialog").getByRole("alert").waitFor({ state: "hidden" });
  fault = 410;
  await confirm.click();
  await page.getByRole("dialog").getByRole("alert").getByText(/Esta conversa foi encerrada/).waitFor();
  assert.equal(await input.count(), 0, "Terminal session must not accept input");
  assert.equal(await confirm.isDisabled(), true);
  await page.getByRole("button", { name: "Escolher vendas ou atendimento" }).click();
  await selectSales();
  await page.getByRole("dialog").getByRole("alert").getByText(/Esta conversa foi encerrada/).waitFor();
  assert.equal(counts.start, 1, "Terminal session must only restart with explicit action");
  await page.getByRole("button", { name: "Iniciar nova conversa", exact: true }).click();
  await input.waitFor();
  await page.getByRole("dialog").getByRole("alert").waitFor({ state: "hidden" });
  assert.equal(counts.reset, 1);
  const result = { scope: "LOCAL_QA", faultInjection: [503, 410], realCrmGreeting: true, realCrmNameRetry: true, resumePreservesSession: true, terminalMessage: true, terminalInputBlocked: true, explicitReset: true, consentSubmitted: false, counts };
  await writeFile(new URL("./error-resume-summary.json", import.meta.url), JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify(result));
} finally { await browser.close(); }
