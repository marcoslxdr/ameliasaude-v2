import { request } from "/Users/marcosalexandre/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { readFile, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";

// Synthetic LOCAL_QA only. Verify config is loopback before forwarding a quote.
const config = await readFile(new URL("../../web/.env.local", import.meta.url), "utf8");
const configuredEndpoint = config.match(/^CRM_LEADS_ENDPOINT=(.*)$/m)[1].trim().replace(/^['"]|['"]$/g, "");
const endpoint = new URL(configuredEndpoint);
assert.ok(["127.0.0.1", "localhost"].includes(endpoint.hostname));
assert.equal(endpoint.port, "3410");
const seed = await readFile("/Users/marcosalexandre/.codex/worktrees/crm-brand-department/crmamelia/.context/plans/chat-brand-department/seed-qa.mjs", "utf8");
const password = seed.match(/bcrypt\.hash\('([^']+)'/)[1];
const client = await request.newContext();
try {
  const requestId = "b737c615-1398-4390-b6f4-3cd9860c36a3";
  const quote = await client.post("http://127.0.0.1:3411/api/cotacao", { data: { requestId, brand: "six", name: "QaAmeliaCotacaoMarca", city: "Rio de Janeiro", email: "qa-cotacao@example.invalid", whatsapp: "21900000005", livesCount: 1, ages: [30], consent: true, consentAt: new Date().toISOString(), source: { pageUrl: "http://127.0.0.1:3411/cotacao" } } });
  assert.equal(quote.status(), 202);
  const login = await client.post("http://127.0.0.1:3410/api/auth/login", { data: { email: "qa-admin@example.invalid", password } });
  assert.equal(login.status(), 200);
  const listed = await client.get("http://127.0.0.1:3410/api/crm/deals?search=QaAmeliaCotacaoMarca&pageSize=100");
  assert.equal(listed.status(), 200);
  const data = await listed.json();
  const rows = Array.isArray(data) ? data : data.data ?? data.deals;
  assert.ok(Array.isArray(rows), "Deal list must provide rows");
  const deal = rows.find(row => row.title === "Cotação pelo site - QaAmeliaCotacaoMarca" || row.title?.includes("QaAmeliaCotacaoMarca"));
  assert.ok(deal, "Synthetic quote must persist as Amélia opportunity");
  assert.equal(deal.brand, "amelia");
  assert.equal(deal.department, "sales");
  const result = { scope: "LOCAL_QA", quoteStatus: quote.status(), attemptedVisitorBrand: "six", persistedBrand: deal.brand, department: deal.department, dealId: deal.id, requestId };
  await writeFile(new URL("./cotacao-brand-summary.json", import.meta.url), JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify(result));
} finally { await client.dispose(); }
