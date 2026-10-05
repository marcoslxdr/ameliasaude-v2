import { chromium } from "/Users/marcosalexandre/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { readFile, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

// Local QA only: synthetic operators, synthetic customer inputs, local CRM DB.
const site = "http://127.0.0.1:3411";
const crm = "http://127.0.0.1:3410";
const out = fileURLToPath(new URL("./", import.meta.url));
const seed = await readFile("/Users/marcosalexandre/.codex/worktrees/crm-brand-department/crmamelia/.context/plans/chat-brand-department/seed-qa.mjs", "utf8");
const password = seed.match(/bcrypt\.hash\('([^']+)'/)[1];
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const phases = [];
try {
  const visitor = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const operator = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  visitor.setDefaultTimeout(90_000);
  operator.setDefaultTimeout(90_000);
  const metadata = [];
  visitor.on("response", async response => {
    if (!response.url().endsWith("/api/chat")) return;
    try {
      const data = await response.json();
      metadata.push({ status: response.status(), brand: data.brand, department: data.department, crmSynced: data.crmSynced, handoff: data.handoff, error: data.error });
    } catch { /* Never log response payloads or session tokens. */ }
  });
  await visitor.goto(site, { waitUntil: "domcontentloaded" });
  await visitor.getByRole("button", { name: "Fale com a Amélia" }).click();
  // Authenticate the browser's context against the real local QA endpoint.
  // Assignment and replies below are performed through the CRM interface.
  const authResponse = await operator.request.post(`${crm}/api/auth/login`, { data: { email: "qa-admin@example.invalid", password }, timeout: 90_000 });
  console.log(JSON.stringify({ stage: "local_qa_login", status: authResponse.status() }));
  assert.equal(authResponse.status(), 200, "Local QA operator login must succeed before testing human replies");
  await operator.goto(`${crm}/crm/dashboard`, { waitUntil: "domcontentloaded" });

  for (const [department, label, button, name] of [
    ["sales", "Vendas", "Quero contratar Conhecer os planos e falar com vendas.", "QaAmeliaVendas"],
    ["service", "Atendimento", "Preciso de atendimento Ajuda com meu plano Amélia Saúde.", "QaAmeliaAtendimento"],
  ]) {
    await visitor.bringToFront();
    await visitor.getByRole("button", { name: button, exact: true }).click();
    const input = visitor.getByRole("textbox", { name: `Mensagem para ${label}` });
    const send = async text => {
      await input.fill(text);
      const pending = visitor.waitForResponse(response => response.url().endsWith("/api/chat") && response.request().method() === "POST" && response.request().postDataJSON().action === "message" && response.request().postDataJSON().input === text);
      await visitor.getByRole("button", { name: "Enviar mensagem", exact: true }).click();
      const response = await pending;
      assert.equal(response.status(), 200);
    };
    await send(name);
    await visitor.getByRole("button", { name: "Confirmar", exact: true }).click();
    const consentResponse = visitor.waitForResponse(response => response.url().endsWith("/api/chat") && response.request().postDataJSON().action === "message" && response.request().postDataJSON().input === "sim");
    await visitor.getByRole("button", { name: "Sim, estou de acordo", exact: true }).click();
    const consent = await (await consentResponse).json();
    assert.equal(consent.brand, "amelia");
    assert.equal(consent.department, department);
    assert.equal(consent.crmSynced, true);
    if (department === "sales") {
      await send("qa-amelia@example.invalid");
      await send("21900000001");
    } else {
      await send("[QA Amélia] Preciso de orientação sobre meu plano.");
    }
    await visitor.getByText("Acompanhe a resposta da equipe aqui neste chat.", { exact: true }).waitFor();
    await operator.bringToFront();
    await operator.goto(`${crm}/crm/conversations?brand=amelia&department=${department}`, { waitUntil: "domcontentloaded" });
    await operator.getByRole("button", { name: new RegExp(name, "i") }).first().click();
    await operator.getByRole("button", { name: "Atribuir", exact: true }).click();
    await operator.getByRole("button", { name: "Assumir conversa", exact: true }).click();
    const reply = `[QA Amélia] Resposta humana ${department} recebida no chat Amélia.`;
    const message = operator.getByPlaceholder("Digite sua mensagem... (/ para respostas rápidas)");
    await message.fill(reply);
    const sent = operator.waitForResponse(response => response.url().includes("/messages") && response.request().method() === "POST");
    await message.press("Enter");
    assert.equal((await sent).status(), 201);
    await visitor.bringToFront();
    await visitor.getByText(reply, { exact: true }).waitFor();
    await visitor.screenshot({ path: `${out}amelia-${department}-human-final-desktop.png` });
    await visitor.setViewportSize({ width: 360, height: 800 });
    await visitor.waitForFunction(expected => {
      const message = [...document.querySelectorAll('[role="log"] p')].find(item => item.textContent === expected);
      const log = message?.closest('[role="log"]');
      if (!message || !log) return false;
      const text = message.getBoundingClientRect();
      const bounds = log.getBoundingClientRect();
      return text.top >= bounds.top && text.bottom <= bounds.bottom;
    }, reply);
    assert.equal(await visitor.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await visitor.screenshot({ path: `${out}amelia-${department}-human-final-mobile.png` });
    phases.push({ department, consented: true, crmSynced: true, humanReply: true, desktop: true, mobile: true, horizontalOverflow: false });
    await visitor.getByRole("button", { name: "Escolher vendas ou atendimento", exact: true }).click();
    await visitor.setViewportSize({ width: 1440, height: 900 });
  }
  const conversations = await operator.evaluate(async () => {
    const response = await fetch("/api/crm/conversations?brand=amelia&limit=100");
    const data = await response.json();
    return data.data.filter(row => /^QaAmelia(?:Vendas|Atendimento)$/i.test(row.contact?.name ?? "")).map(row => ({ id: row.id, brand: row.brand, department: row.department, channel: row.channel, channelAccountId: row.channelAccountId }));
  });
  assert.ok(conversations.some(row => row.department === "sales"));
  assert.ok(conversations.some(row => row.department === "service"));
  assert.ok(conversations.every(row => row.brand === "amelia" && row.channelAccountId === "amelia-webchat"));
  assert.equal(new Set(conversations.map(row => row.id)).size, conversations.length);
  // The API orders by latest activity. Prior anonymous QA sessions can remain
  // after reruns; retain the latest conversation for each tested department.
  const latest = new Map();
  for (const row of conversations) if (!latest.has(row.department)) latest.set(row.department, row);
  const testedConversations = [...latest.values()];
  await writeFile(`${out}integrated-final-summary.json`, JSON.stringify({ scope: "LOCAL_QA", phases, conversations: testedConversations, anonymousSessionsObserved: conversations.length, metadata: [...new Map(metadata.map(row => [JSON.stringify(row), row])).values()] }, null, 2) + "\n");
  console.log(JSON.stringify({ scope: "LOCAL_QA", phases, conversations: testedConversations, success: true }));
} finally {
  await browser.close();
}
