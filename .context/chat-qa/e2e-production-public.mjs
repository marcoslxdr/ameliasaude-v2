import { chromium } from "/Users/marcosalexandre/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import assert from "node:assert/strict";

// Real published site only. No mocked/intercepted responses, operator session,
// customer CPF, or WhatsApp messages. Run after coordinator confirms aliases.
assert.equal(process.env.AMELIA_PRODUCTION_QA_APPROVED, "yes", "Coordinator READY approval is required");
const url = new URL(process.env.AMELIA_PRODUCTION_SITE ?? "https://www.ameliasaude.com.br");
assert.equal(url.protocol, "https:");
assert.ok(["www.ameliasaude.com.br", "ameliasaude.com.br"].includes(url.hostname));
assert.ok(!url.username && !url.password && !url.search && !url.hash && url.pathname === "/");
const site = url.origin;
const run = randomBytes(5).toString("hex").replace(/[0-9]/g, digit => String.fromCharCode(103 + Number(digit)));
const names = { sales: `Qa Amelia Vendas ${run}`, service: `Qa Amelia Atendimento ${run}` };
const out = new URL(`./production-public-${run}/`, import.meta.url);
await mkdir(out, { recursive: true });
const result = { scope: "PRODUCTION_PUBLIC_SYNTHETIC_QA", run, site, phases: [], metadata: [], humanReplyTested: false, success: false };
const tokens = new Map(); // Memory only: never write session tokens to artifacts.
const starts = { sales: 0, service: 0 };
let stage = "visitor-open";
const browser = await chromium.launch({ headless: true, channel: "chrome" });
try {
  const visitor = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  visitor.setDefaultTimeout(90_000);
  visitor.on("request", request => {
    if (request.url() === `${site}/api/chat` && request.postDataJSON()?.action === "start") starts[request.postDataJSON().department] += 1;
  });
  visitor.on("response", async response => {
    if (response.url() !== `${site}/api/chat`) return;
    try {
      const data = await response.json();
      if (data.token && data.department) tokens.set(data.department, data.token);
      result.metadata.push({ status: response.status(), brand: data.brand, department: data.department, crmSynced: data.crmSynced, handoff: data.handoff, error: data.error });
    } catch { /* Never log full responses, tokens or customer data. */ }
  });
  await visitor.goto(site, { waitUntil: "domcontentloaded" });
  await visitor.getByRole("button", { name: "Fale com a Amélia" }).click();
  const dialog = visitor.getByRole("dialog");
  const send = async (label, text) => {
    const input = dialog.getByRole("textbox", { name: `Mensagem para ${label}` });
    await input.fill(text);
    const pending = visitor.waitForResponse(response => response.url() === `${site}/api/chat` && response.request().postDataJSON()?.action === "message" && response.request().postDataJSON()?.input === text);
    await dialog.getByRole("button", { name: "Enviar mensagem", exact: true }).click();
    const response = await pending;
    assert.equal(response.status(), 200);
    const data = await response.json();
    assert.equal(data.brand, "amelia");
    return data;
  };
  for (const [department, label, button] of [
    ["sales", "Vendas", "Quero contratar Conhecer os planos e falar com vendas."],
    ["service", "Atendimento", "Preciso de atendimento Ajuda com meu plano Amélia Saúde."],
  ]) {
    stage = `${department}-consent`;
    await dialog.getByRole("button", { name: button, exact: true }).click();
    await send(label, names[department]);
    await dialog.getByRole("button", { name: "Confirmar", exact: true }).click();
    const consentPending = visitor.waitForResponse(response => response.url() === `${site}/api/chat` && response.request().postDataJSON()?.input === "sim");
    await dialog.getByRole("button", { name: "Sim, estou de acordo", exact: true }).click();
    const response = await consentPending;
    assert.equal(response.status(), 200);
    const consent = await response.json();
    assert.equal(consent.brand, "amelia");
    assert.equal(consent.department, department);
    assert.equal(consent.crmSynced, true);
    stage = `${department}-human-queue`;
    const handoff = department === "sales"
      ? (await send(label, `qa-amelia-${run}@example.invalid`), await send(label, "21900000001"))
      : await send(label, `[QA Amélia ${run}] Teste de atendimento, sem dados de cliente.`);
    assert.equal(handoff.handoff, true);
    assert.equal(handoff.department, department);
    await dialog.getByText("Acompanhe a resposta da equipe aqui neste chat.", { exact: true }).waitFor();
    await dialog.getByRole("alert").waitFor({ state: "hidden" });
    stage = `${department}-desktop-mobile`;
    await visitor.screenshot({ path: new URL(`amelia-${department}-queue-desktop.png`, out).pathname });
    await visitor.setViewportSize({ width: 360, height: 800 });
    await visitor.waitForFunction(() => {
      const dialog = document.querySelector("#amelia-chat");
      const bounds = dialog?.getBoundingClientRect();
      return bounds && bounds.left >= 0 && bounds.right <= innerWidth && bounds.top >= 0 && bounds.bottom <= innerHeight;
    });
    assert.equal(await visitor.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await visitor.screenshot({ path: new URL(`amelia-${department}-queue-mobile.png`, out).pathname });
    result.phases.push({ department, consented: true, crmSynced: true, humanQueue: true, desktop: true, mobile: true, horizontalOverflow: false });
    console.log(JSON.stringify({ scope: result.scope, run, stage: `${department}-passed`, qaMarker: names[department] }));
    await dialog.getByRole("button", { name: "Escolher vendas ou atendimento", exact: true }).click();
    await visitor.setViewportSize({ width: 1440, height: 900 });
  }
  stage = "brand-and-department-boundary";
  assert.ok(tokens.get("sales") && tokens.get("service"));
  assert.notEqual(tokens.get("sales"), tokens.get("service"));
  const forged = await visitor.request.post(`${site}/api/chat`, { headers: { Origin: site, "x-webchat-brand": "six" }, data: { action: "poll", department: "sales", token: tokens.get("sales"), brand: "six" } });
  assert.equal(forged.status(), 200);
  const imposed = await forged.json();
  assert.equal(imposed.brand, "amelia");
  assert.equal(imposed.department, "sales");
  result.serverImposesAmeliaDespiteForgedBrand = true;
  const crossed = await visitor.request.post(`${site}/api/chat`, { headers: { Origin: site }, data: { action: "poll", department: "service", token: tokens.get("sales") } });
  assert.ok([400, 409].includes(crossed.status()));
  result.crossDepartmentTokenRejected = crossed.status();
  stage = "resume-sales";
  await dialog.getByRole("button", { name: "Quero contratar Conhecer os planos e falar com vendas.", exact: true }).click();
  await dialog.getByText("Acompanhe a resposta da equipe aqui neste chat.", { exact: true }).waitFor();
  assert.deepEqual(starts, { sales: 1, service: 1 });
  stage = "public-closure-survey";
  const survey = await send("Vendas", "finalizar");
  assert.ok(survey.messages.some(message => /De 1 a 5/.test(message.text)));
  await send("Vendas", "5");
  const closing = await send("Vendas", "0");
  assert.equal(closing.input.kind, "none");
  assert.ok(closing.messages.some(message => /Até logo|Obrigado por entrar em contato/.test(message.text)));
  stage = "closed-410";
  await dialog.getByRole("alert").getByText(/Esta conversa foi encerrada/).waitFor();
  assert.ok(result.metadata.some(item => item.status === 410 && item.error === "session_closed"));
  assert.equal(await dialog.getByRole("textbox").count(), 0);
  await visitor.screenshot({ path: new URL("amelia-sales-closed-desktop.png", out).pathname });
  stage = "explicit-reset";
  const resetPending = visitor.waitForResponse(response => response.url() === `${site}/api/chat` && response.request().postDataJSON()?.action === "reset");
  await dialog.getByRole("button", { name: "Iniciar nova conversa", exact: true }).click();
  const resetResponse = await resetPending;
  assert.equal(resetResponse.status(), 200);
  const reset = await resetResponse.json();
  assert.equal(reset.brand, "amelia");
  assert.equal(reset.department, "sales");
  assert.equal(reset.crmSynced, false);
  await dialog.getByRole("textbox", { name: "Mensagem para Vendas" }).waitFor();
  await dialog.getByRole("alert").waitFor({ state: "hidden" });
  result.publicClosure = { survey: true, closing: true, terminalHttp410: true, inputBlocked: true, explicitReset: true };
  result.success = true;
} catch (error) {
  result.failure = { stage, type: error.name };
} finally {
  result.metadata = [...new Map(result.metadata.map(row => [JSON.stringify(row), row])).values()];
  await writeFile(new URL("summary.json", out), JSON.stringify(result, null, 2) + "\n");
  await browser.close();
}
console.log(JSON.stringify({ scope: result.scope, run, success: result.success, phases: result.phases, publicClosure: result.publicClosure, humanReplyTested: false, failure: result.failure, evidenceDirectory: out.pathname }));
if (!result.success) process.exitCode = 1;
