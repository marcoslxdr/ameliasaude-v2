# Post de exemplo SEO/AEO — Amélia Saúde

**Data do pacote:** 2026-07-26  
**Slug canônico no código:** `/blog/plano-de-saude-por-adesao-como-funciona-rj`  
**publishAt:** `2026-07-27T08:00:00-03:00` (só entra em listagem, sitemap e rota após esse horário)  
**Fonte de estratégia:** pesquisa SEO/AEO do second brain Amélia Saúde (2026-07-21)

Este documento fixa o **modelo editorial** (post), o **gate comercial/regulatório** e a **medição** (Search Console + PostHog). Use-o para revisar novos posts antes de mudar `publishAt` para o passado.

---

## 1. Post de exemplo (pronto para o data layer)

### Metadados

| Campo | Valor |
|---|---|
| **Title (SERP)** | Plano de saúde por adesão: como funciona e quem pode contratar no RJ |
| **H1** | igual ao title |
| **Description** | Entenda o que é o plano coletivo por adesão, quem pode contratar via entidade de classe, o que conferir antes de assinar e como a Amélia Saúde orienta no Rio de Janeiro. |
| **Categoria** | Coletivo por adesão |
| **Tags** | plano por adesão, coletivo por adesão, Rio de Janeiro, contratação |
| **CTA** | Verifique sua elegibilidade → `/#contato` · evento PostHog `blog_cta_elegibilidade` |
| **Autor** | Equipe Amélia Saúde |
| **Revisor** | Validação comercial e regulatória pendente (bloqueante até assinar) |
| **Fontes** | ANS (`gov.br/ans`) + site Amélia |

### Estrutura AEO (visível no HTML)

1. **Resposta direta** (40–80 palavras) logo após o H1  
2. Definição simples da modalidade  
3. Quem pode contratar (sem inventar lista de entidades)  
4. Passos numerados de contratação  
5. Documentos (genéricos + “confirme lista oficial”)  
6. Carência com ponte para ANS  
7. Comparativo adesão × individual × empresarial  
8. Quando vale a pena  
9. FAQ em prosa  
10. Próximo passo + CTA proporcional  
11. Bloco **Fontes e transparência** + disclaimer de operadora  

### Texto integral (espelho do `web/src/data/blog.ts`)

#### Resposta direta

O plano de saúde coletivo por adesão é uma modalidade em que a contratação acontece por meio de vínculo com sindicato, conselho, associação profissional ou entidade de classe aceita no produto. No Rio de Janeiro, a elegibilidade, a rede, a carência e o preço dependem do produto e da proposta vigentes — não de uma regra universal. Confirme sempre no contrato e no canal oficial da operadora.

#### O que significa coletivo por adesão?

Na prática, você não contrata um plano individual aberto a qualquer pessoa: a adesão exige um vínculo com a entidade prevista no produto. A entidade intermedia a relação coletiva; a cobertura, a rede e as condições de uso ficam definidas no contrato do plano. Isso difere do individual/familiar e do empresarial, que seguem outras regras de elegibilidade e contratação.

#### Quem pode contratar?

Pode contratar quem comprovar o vínculo aceito pela entidade e pelo produto. Dependentes só entram se o contrato permitir e se a documentação for aceita. A lista de entidades e categorias elegíveis da Amélia Saúde deve ser confirmada no atendimento comercial vigente — não publique nem aceite uma lista antiga como garantia.

#### Como funciona a contratação?

1. Verifique se sua categoria ou entidade é elegível no produto.  
2. Reúna documentos de identificação, vínculo e, se houver, de dependentes.  
3. Analise proposta, rede, segmentação, carências e reajuste por escrito.  
4. Confirme cobertura e prestadores na consulta oficial de rede.  
5. Só assine após alinhar proposta e contrato.

#### Existe carência?

Pode existir. Carência, cobertura parcial temporária e portabilidade seguem regras do produto e da regulamentação da ANS. Não assuma “sem carência” com base em conversa informal. Confira prazos no contrato e, em troca de plano, avalie portabilidade com base no Guia da ANS e na análise da operadora.

#### Próximo passo

Se você está no Rio de Janeiro e quer saber se pode contratar por adesão, fale com a Amélia Saúde para confirmar elegibilidade, rede e condições atuais — sem promessa genérica no lugar da proposta.

### Implementação técnica no repositório

| Peça | Onde |
|---|---|
| Dados + `publishAt` | `web/src/data/blog.ts` |
| Gating listagem/home/sitemap/slug | `getPublishedPosts` / `getPostBySlug` / `isPostPublished` |
| Metadata + OG + Article + breadcrumb | `web/src/app/blog/[slug]/page.tsx` |
| Layout listing `/blog` | `web/src/app/blog/layout.tsx` |
| CTA + PostHog | `web/src/components/blog/BlogCta.tsx` → `track()` em `web/src/lib/analytics.ts` |
| Sitemap só posts publicados | `web/src/app/sitemap.ts` |

---

## 2. Checklist comercial e regulatório (YMYL)

Preencher **antes** de colocar `publishAt` no passado (ou de anunciar o post).

### 2.1 Comercial (Amélia / Insightfy)

- [ ] Modalidade citada no post existe no portfólio vigente  
- [ ] Nenhuma entidade de classe listada sem autorização escrita  
- [ ] Nenhum preço, tabela, “a partir de”, número mínimo de vidas ou carência comercial sem proposta vigente  
- [ ] Rede/municípios citados batem com consulta oficial do produto  
- [ ] CTA leva a canal real (`/#contato`, `/#rede`, WhatsApp validado)  
- [ ] Copy não usa superlativos não comprovados (“melhor”, “mais barato”, “garantido”, “sem carência”)  
- [ ] Diferença clara entre **informação institucional** e **condição contratual**  
- [ ] Revisor comercial assinou (`reviewer` deixa de ser “pendente”)

### 2.2 Regulatório / ANS

- [ ] Afirmações sobre carência, portabilidade, reajuste, cobertura e modalidades citam ANS ou contrato  
- [ ] Link para fonte oficial (`https://www.gov.br/ans/pt-br` ou página específica)  
- [ ] Não há orientação médica, diagnóstico ou tratamento  
- [ ] Não há promessa de cobertura de procedimento específico sem lastro de segmentação/rol/contrato  
- [ ] Disclaimer de conteúdo educativo de operadora está visível  
- [ ] Data de atualização (`updatedAt`) preenchida  
- [ ] Revisor regulatório assinou quando o tema for carência/portabilidade/reajuste/cobertura

### 2.3 SEO / AEO (qualidade da página)

- [ ] Resposta direta nas primeiras linhas  
- [ ] H2 em formato de pergunta real de busca  
- [ ] FAQ ou checklist legível (não só schema)  
- [ ] `title` ≤ ~60 caracteres úteis; `description` ≤ ~155  
- [ ] Canonical `/blog/<slug>`  
- [ ] Open Graph `type: article` + imagem  
- [ ] JSON-LD `Article` + `BreadcrumbList` coerentes com HTML  
- [ ] Links internos para home/âncoras reais (contato, rede, origem)  
- [ ] Post **só** no sitemap após `publishAt`  
- [ ] Sem canibalização com outro slug do mesmo cluster (mesmo H1/intenção)

### 2.4 Gate de publicação

| Estado | Ação |
|---|---|
| Rascunho / validação pendente | manter `publishAt` no futuro |
| Aprovado comercial + regulatório | atualizar `reviewer`, `updatedAt`, então `publishAt` ≤ agora |
| Correção urgente pós-go-live | editar conteúdo, atualizar `updatedAt`, re-submeter URL no Search Console |

---

## 3. Medição — Search Console e PostHog

### 3.1 Google Search Console (semanal)

**Pré-requisitos:** propriedade `https://www.ameliasaude.com.br` verificada; sitemap `https://www.ameliasaude.com.br/sitemap.xml` enviado.

| Métrica | Como olhar | Alvo operacional 30 dias |
|---|---|---|
| Indexação do slug | Inspeção de URL + relatório de páginas | URL descoberta; idealmente indexada |
| Impressões | Desempenho → filtrar página `/blog/...` | > 0 em long-tails do cluster |
| Cliques orgânicos | mesmo relatório | tendência de alta após 2–6 sem. |
| Consultas | Desempenho → consultas | novas queries de adesão/carência/RJ |
| CTR | cliques/impressões | baseline; ajustar title/description se CTR baixo com pos. ≤ 15 |
| Canibalização | 2 URLs competindo pela mesma query | consolidar ou diferenciar H1/intenção |

**Rotina pós-publish (D0–D7):**

1. Confirmar que o post aparece no sitemap **somente** se `publishAt` já passou.  
2. Search Console → Inspeção de URL → “Solicitar indexação”.  
3. Anotar data de solicitação e data da primeira impressão.  
4. Não alterar slug após indexação (criar novo slug se mudar radicalmente a intenção).

**Consultas-alvo deste exemplo (monitorar):**

- plano de saúde por adesão como funciona  
- plano de saúde coletivo por adesão  
- plano de saúde por adesão vale a pena  
- plano de saúde por adesão Rio de Janeiro  
- quem pode contratar plano por adesão  

### 3.2 PostHog (contínuo)

**Pré-requisitos:** `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` + `NEXT_PUBLIC_POSTHOG_HOST` no ambiente (local e Vercel). Client em `web/src/instrumentation-client.ts`.

| Evento | Origem | Propriedades | Uso |
|---|---|---|---|
| `$pageview` (autocapture) | PostHog default | `pathname` | tráfego por slug |
| `blog_cta_elegibilidade` | `BlogCta` neste post | `post_slug`, `source=blog`, `cta_label`, `href` | conversão informacional → contato |
| Outros `blog_cta_*` | CTAs dos demais posts | idem | funil por cluster |
| `cta_click` / `contact_channel_click` | home/contato | canal, href, page | comparar blog vs home |

**Insights recomendados:**

1. **Funil blog → CTA:** `$pageview` onde `pathname` contém `/blog/plano-de-saude-por-adesao` → evento `blog_cta_elegibilidade`.  
2. **Ranking de CTAs:** breakdown de eventos `blog_cta_*` por `post_slug`.  
3. **Sessões com scroll/recording** (já habilitado no projeto) para ver abandono antes do CTA.  
4. **UTM Meta:** se o artigo for usado em ads, exigir `utm_source=meta&utm_medium=paid_social&utm_campaign=branding_lancamento&utm_content=adesao-guia`.

**Não medir como sucesso isolado:** só pageviews. Sucesso = impressão orgânica + clique + CTA (e, depois, lead no CRM/WhatsApp).

### 3.3 Cadência de relatório (operacional)

| Horizonte | Entrega |
|---|---|
| Semanal | URLs publicadas, indexação, impressões, top queries, CTAs PostHog |
| Mensal | cliques orgânicos por cluster, taxa visita→CTA, leads assistidos |
| 90 dias | 5–10 long-tails em top 10 (alvo, não garantia) + revisão editorial |

---

## 4. Calendário já no código (`publishAt`)

Ordem de liberação (America/Sao_Paulo):

| Quando | Slug |
|---|---|
| 27 Jul 2026 08:00 | `plano-de-saude-por-adesao-como-funciona-rj` |
| 27 Jul 2026 10:00 | `plano-saude-familia-o-que-avaliar-antes-de-incluir-dependentes` |
| 27 Jul 2026 18:00 | `beneficiario-e-dependente-plano-de-saude-perguntas` |
| 28–31 Jul 2026 | reajuste, cobertura, RJ/Grande Rio, marca Amélia, rede, PME, contrato, FAQ |

Até o horário de cada `publishAt`, o post **não** deve aparecer em:

- `/blog`  
- home (`sections/Blog.tsx`)  
- `/sitemap.xml`  
- `generateStaticParams` / `getPostBySlug` (rota = 404)

---

## 5. Critérios de aceite deste pacote no repositório

- [x] Gating por `publishAt` em listagem, home, sitemap e página do post  
- [x] Post pilar de adesão no data layer com estrutura AEO  
- [x] Metadata OG/Twitter/canonical + JSON-LD Article/Breadcrumb  
- [x] CTA com evento PostHog tipado via `track()`  
- [x] Doc de exemplo + checklist + medição (este arquivo)  
- [ ] Validação comercial/regulatória humana (ainda pendente nos `reviewer`)  
- [ ] Deploy + solicitação de indexação no Search Console (fora do escopo deste commit local)  
- [ ] Confirmação de eventos no projeto PostHog em produção  

**Fora de escopo desta execução:** `git commit`, `git push`, `vercel deploy`.
