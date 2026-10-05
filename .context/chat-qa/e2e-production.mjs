import { chromium } from "/Users/marcosalexandre/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import assert from "node:assert/strict";

// Run only after the coordinator confirms both exact deployments READY and
// the production migration/token pairing. This creates marked synthetic CRM
// conversations and sends human replies only into their Amélia website chat.
assert.equal(process.env.AMELIA_PRODUCTION_QA_APPROVED, "yes", "Coordinator READY approval is required");
const siteUrl = new URL(process.env.AMELIA_PRODUCTION_SITE ?? "https://www.ameliasaude.com.br");
const crmUrl = new URL(process.env.AMELIA_PRODUCTION_CRM ?? "");
for (const url of [siteUrl, crmUrl]) {
  assert.equal(url.protocol, "https:");
  assert.ok(!url.username && !url.password && !url.search && !url.hash);
  assert.equal(url.pathname, "/");
}
assert.ok(["www.ameliasaude.com.br", "ameliasaude.com.br"].includes(siteUrl.hostname));
const storagePath = process.env.AMELIA_OPERATOR_STORAGE_STATE;
assert.ok(storagePath?.startsWith("/"), "Provide a private absolute operator storage-state path");
assert.equal((await stat(storagePath)).mode & 0o077, 0, "Operator session file must be private (0600)");
const storage = JSON.parse(await readFile(storagePath, "utf8"));
assert.ok(Array.isArray(storage.cookies) && storage.cookies.length > 0);
assert.ok(storage.cookies.some(cookie => crmUrl.hostname === cookie.domain.replace(/^\./, "") || crmUrl.hostname.endsWith(cookie.domain)));
const site = siteUrl.origin;
const crm = crmUrl.origin;
const run = randomBytes(5).toString("hex").replace(/[0-9]/g, digit => String.fromCharCode(103 + Number(digit)));
const names = { sales: `Qa Amelia Vendas ${run}`, service: `Qa Amelia Atendimento ${run}` };
const out = new URL(`./production-${run}/`, import.meta.url);
await mkdir(out, { recursive: true });
const result = { scope: "PRODUCTION_SYNTHETIC_QA", run, site, crm, phases: [], conversations: [], metadata: [], success: false };
let stage = "operator-auth";
const browser = await chromium.launch({ headless: true, channel: "chrome" });
try {
  const visitorContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const operatorContext = await browser.newContext({ storageState: storage, viewport: { width: 1440, height: 900 } });
  const visitor = await visitorContext.newPage();
  const operator = await operatorContext.newPage();
  visitor.setDefaultTimeout(90_000);
  operator.setDefaultTimeout(90_000);
  const authenticated = await operator.request.get(`${crm}/api/auth/me`);
  assert.equal(authenticated.status(), 200, "A real production operator session is required before visitor consent");
  const startCounts = { sales: 0, service: 0 };
  visitor.on("request", request => {
    if (request.url() === `${site}/api/chat` && request.postDataJSON()?.action === "start") startCounts[request.postDataJSON().department] += 1;
  });
  visitor.on("response", async response => {
    if (response.url() !== `${site}/api/chat`) return;
    try {
      const data = await response.json();
      result.metadata.push({ status: response.status(), brand: data.brand, department: data.department, crmSynced: data.crmSynced, handoff: data.handoff, error: data.error });
    } catch { /* Never log payloads, session tokens, operator cookies or PII. */ }
  });
  stage = "visitor-open";
  await visitor.goto(site, { waitUntil: "domcontentloaded" });
  await visitor.getByRole("button", { name: "Fale com a Amélia" }).click();
  const dialog = visitor.getByRole("dialog");
  for (const [department, label, button] of [
    ["sales", "Vendas", "Quero contratar Conhecer os planos e falar com vendas."],
    ["service", "Atendimento", "Preciso de atendimento Ajuda com meu plano Amélia Saúde."],
  ]) {
    stage = `${department}-consent`;
    await dialog.getByRole("button", { name: button, exact: true }).click();
    const input = dialog.getByRole("textbox", { name: `Mensagem para ${label}` });
    const send = async text => {
      await input.fill(text);
      const pending = visitor.waitForResponse(response => response.url() === `${site}/api/chat` && response.request().postDataJSON()?.action === "message" && response.request().postDataJSON()?.input === text);
      await dialog.getByRole("button", { name: "Enviar mensagem", exact: true }).click();
      const response = await pending;
      assert.equal(response.status(), 200);
      const data = await response.json();
      assert.equal(data.brand, "amelia");
      assert.equal(data.department, department);
      return data;
    };
    await send(names[department]);
    await dialog.getByRole("button", { name: "Confirmar", exact: true }).click();
    const consentPending = visitor.waitForResponse(response => response.url() === `${site}/api/chat` && response.request().postDataJSON()?.input === "sim");
    await dialog.getByRole("button", { name: "Sim, estou de acordo", exact: true }).click();
    const consentResponse = await consentPending;
    assert.equal(consentResponse.status(), 200);
    const consent = await consentResponse.json();
    assert.equal(consent.brand, "amelia");
    assert.equal(consent.department, department);
    assert.equal(consent.crmSynced, true);
    stage = `${department}-handoff`;
    const handoff = department === "sales"
      ? (await send(`qa-amelia-${run}@example.invalid`), await send("21900000001"))
      : await send(`[QA Amélia ${run}] Teste de atendimento, sem dados de cliente.`);
    assert.equal(handoff.handoff, true);
    await dialog.getByText("Acompanhe a resposta da equipe aqui neste chat.", { exact: true }).waitFor();
    stage = `${department}-human-reply`;
    await operator.goto(`${crm}/crm/conversations?brand=amelia&department=${department}`, { waitUntil: "domcontentloaded" });
    await operator.getByRole("button", { name: new RegExp(names[department], "i") }).first().click();
    await operator.getByRole("button", { name: "Atribuir", exact: true }).click();
    await operator.getByRole("button", { name: "Assumir conversa", exact: true }).click();
    const reply = `[QA Amélia ${run}] Resposta humana de ${label} recebida no chat Amélia.`;
    const message = operator.getByPlaceholder("Digite sua mensagem... (/ para respostas rápidas)");
    await message.fill(reply);
    const sent = operator.waitForResponse(response => response.url().startsWith(`${crm}/api/crm/conversations/`) && response.url().endsWith("/messages") && response.request().method() === "POST");
    await message.press("Enter");
    assert.equal((await sent).status(), 201);
    await dialog.getByText(reply, { exact: true }).waitFor();
    await dialog.getByRole("alert").waitFor({ state: "hidden" });
    stage = `${department}-desktop-mobile`;
    await visitor.screenshot({ path: new URL(`amelia-${department}-desktop.png`, out).pathname });
    await visitor.setViewportSize({ width: 360, height: 800 });
    await visitor.waitForFunction(expected => {
      const message = [...document.querySelectorAll('#amelia-chat [role="log"] p')].find(item => item.textContent === expected);
      const log = message?.closest('[role="log"]');
      if (!message || !log) return false;
      const bounds = log.getBoundingClientRect();
      const text = message.getBoundingClientRect();
      return text.top >= bounds.top && text.bottom <= bounds.bottom;
    }, reply);
    assert.equal(await visitor.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await visitor.screenshot({ path: new URL(`amelia-${department}-mobile.png`, out).pathname });
    result.phases.push({ department, consented: true, crmSynced: true, handoff: true, humanReply: true, desktop: true, mobile: true, horizontalOverflow: false });
    console.log(JSON.stringify({ scope: result.scope, run, stage: `${department}-passed` }));
    await dialog.getByRole("button", { name: "Escolher vendas ou atendimento", exact: true }).click();
    await visitor.setViewportSize({ width: 1440, height: 900 });
  }
  stage = "persistence-separation";
  const listed = await operator.request.get(`${crm}/api/crm/conversations?brand=amelia&limit=100`);
  assert.equal(listed.status(), 200);
  const rows = (await listed.json()).data.filter(row => Object.values(names).includes(row.contact?.name));
  result.conversations = rows.map(row => ({ id: row.id, brand: row.brand, department: row.department, channel: row.channel, channelAccountId: row.channelAccountId }));
  assert.equal(rows.length, 2);
  assert.equal(new Set(rows.map(row => row.id)).size, 2);
  assert.ok(result.conversations.every(row => row.brand === "amelia" && row.channel === "webchat" && row.channelAccountId === "amelia-webchat"));
  assert.deepEqual(new Set(result.conversations.map(row => row.department)), new Set(["sales", "service"]));
  assert.deepEqual(startCounts, { sales: 1, service: 1 });
  result.success = true;
} catch (error) {
  result.failure = { stage, type: error.name };
} finally {
  result.metadata = [...new Map(result.metadata.map(row => [JSON.stringify(row), row])).values()];
  await writeFile(new URL("summary.json", out), JSON.stringify(result, null, 2) + "\n");
  await browser.close();
}
console.log(JSON.stringify({ scope: result.scope, run, success: result.success, phases: result.phases, conversations: result.conversations, failure: result.failure, evidenceDirectory: out.pathname }));
if (!result.success) process.exitCode = 1;
