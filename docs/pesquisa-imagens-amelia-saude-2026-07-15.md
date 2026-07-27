# Pesquisa de Imagens — Amélia Saúde (Atualização de Seções)

> **Data:** 2026-07-15 | **Contexto:** Substituir imagens genéricas de Unsplash por fotos profissionais brasileiras.
> **Critérios:** Médicos brasileiros/latinos, corpo inteiro, jaleco branco, não genéricas, alinhadas ao contexto de cada bloco.
> **Design system:** Editorial de luxo em saúde — paleta ameixa (`#7B6BB2`/`#5E4985`), tipografia Cormorant Garamond + DM Sans.

---

## Resumo Executivo

| Bloco | Componente | Qtd. Imagens | Status Atual | Prioridade |
|-------|-----------|-------------|--------------|------------|
| **Hero** | `Hero.tsx` | 1 (maria-padilha-hero) | ✅ Local profissional | Manter |
| **Família** | `FamilyPlan.tsx` | 1 (familia-bg.webp) | ⚠️ Precisa revisão | 🟡 Média |
| **Especialistas** | `Specialists.tsx` | 8 cards (6 Unsplash + 2 locais) | 🔴 Maioria genérica | 🔴 Alta |
| **Planos/Experiência** | `HealthExperience.tsx` | 6 cards (todos Unsplash) | 🔴 Todos genéricos | 🔴 Alta |
| **Telemedicina** | `Telemedicine.tsx` | 1 (mockup celular) | ✅ Ilustrativo/UI | Manter |
| **Sobre/Origem** | `About.tsx` / `BrandOrigin.tsx` | 0 (ícones/vídeo) | ✅ OK | N/A |
| **Contato** | `Contact.tsx` | 0 (ícones SVG) | ✅ OK | N/A |

---

## 1. Banco de Imagens — Recomendações por Fonte

### 🟢 Gratuitos (sem custo)

| Banco | Qualidade BR | Full Body | Observação |
|-------|-------------|-----------|------------|
| **Pexels** | Média | ⚠️ Raro | Tem alguns médicos brasileiros (fotos em Parauapebas/PA, hospitais em Recife). Predomínio de retratos (plano médio). |
| **Unsplash** | Baixa | ⚠️ Raro | Dominado por Getty Images (modelos EUA/europeus). Pouquíssimos brasileiros. |
| **Freepik** | Média | ✅ | Boa variedade de "brazilian doctor", mas muitas são IA-generated (Premium). Filtro: "Photo" + "brazilian doctor white coat". |
| **Vecteezy** | Média | ⚠️ | Fotos gratuitas de "brazilian doctor woman" disponíveis (resolução até ~6K px). |

### 🔵 Pagos (qualidade superior)

| Banco | Qualidade BR | Full Body | Faixa de Preço |
|-------|-------------|-----------|----------------|
| **Shutterstock** | ✅ Alta | ✅ Sim | ~R$50-150/imagem (pacotes reduzem) |
| **Adobe Stock** | ✅ Alta | ✅ Sim | ~R$40-120/imagem |
| **iStock / Getty** | ✅ Alta | ✅ Sim | ~R$60-200/imagem |
| **Depositphotos** | ✅ Boa | ✅ Sim | ~R$30-80/imagem |
| **Dreamstime** | ✅ Boa | ✅ Sim | ~R$20-60/imagem |

> **Recomendação:** Shutterstock ou Depositphotos para a melhor relação custo-benefício em fotos de médicos brasileiros de corpo inteiro.

---

## 2. Pesquisa por Bloco

### 🔴 BLOCO 1: Especialistas (`Specialists.tsx`) — 8 imagens

**Contexto:** Grid de cards glass com foto de cada especialidade. Layout bento: 4 cards "hero" (2 colunas, landscape) + 4 cards "compact" (1 coluna, portrait). Fotos com `object-cover object-top`.

**O que cada card precisa:**
- Foto de médico brasileiro/latino, jaleco branco
- Retrato profissional (plano médio a corpo inteiro)
- Expressão confiante/acolhedora — alinhada ao tom "cuidado humanizado"
- Fundo neutro ou hospitalar/clínico (não genérico de estúdio)

#### Cards existentes e recomendações:

| # | Especialidade | Variant | Imagem Atual | Origem | Ação | Fonte Recomendada |
|---|--------------|---------|-------------|--------|------|-------------------|
| 1 | Clínico Geral | compact | `/clinico geral.jpg` | Local | ✅ Manter se for brasileiro | — |
| 2 | Pediatra | compact | Unsplash `1632052999447` | Unsplash | 🔴 Substituir | [Shutterstock: "brazilian pediatrician female"](https://www.shutterstock.com/search/brazilian-pediatrician-female?image_type=photo) |
| 3 | Cardiologista | hero | Unsplash `1460672985063` | Unsplash | 🔴 Substituir | [Shutterstock: "brazilian cardiologist"](https://www.shutterstock.com/search/brazilian-cardiologist) |
| 4 | Gastroenterologista | compact | Unsplash `1576091160399` | Unsplash | 🔴 Substituir | [Adobe Stock: "doctor latina gastroenterology"](https://stock.adobe.com/search?k=doctor+latina+gastroenterology) |
| 5 | Ginecologista | compact | Unsplash `1637059824899` | Unsplash | 🔴 Substituir | [Shutterstock: "brazilian gynecologist female"](https://www.shutterstock.com/search/brazilian-gynecologist-female) |
| 6 | Otorrinolaringologista | hero | Unsplash `1622253692010` | Unsplash | 🔴 Substituir | [Shutterstock: "brazilian doctor ent"](https://www.shutterstock.com/search/brazilian-doctor-ent) |
| 7 | Urologista | hero | `/urologista.jpg` | Local | ✅ Manter se for brasileiro | — |
| 8 | Ortopedista | hero | Unsplash `1597764690472` | Unsplash | 🔴 Substituir | [Shutterstock: "brazilian orthopedist"](https://www.shutterstock.com/search/brazilian-orthopedist) |

#### Links diretos de busca por especialidade:

| Especialidade | Shutterstock | Adobe Stock | Depositphotos | Freepik (gratuito/Premium) |
|--------------|-------------|-------------|---------------|---------------------------|
| Pediatra | [buscar](https://www.shutterstock.com/search/pediatrician-brazilian-female?image_type=photo&orientation=vertical) | [buscar](https://stock.adobe.com/search?k=latina+pediatrician+female+portrait) | [buscar](https://depositphotos.com/stock-photos/brazilian-pediatrician.html) | [buscar](https://www.freepik.com/search?format=search&query=brazilian+pediatrician+female+doctor) |
| Cardiologista | [buscar](https://www.shutterstock.com/search/latin-cardiologist?image_type=photo) | [buscar](https://stock.adobe.com/search?k=latina+cardiologist+doctor) | [buscar](https://depositphotos.com/stock-photos/latin-cardiologist.html) | [buscar](https://www.freepik.com/search?format=search&query=brazilian+cardiologist+doctor) |
| Gastroenterologista | [buscar](https://www.shutterstock.com/search/latin-gastroenterologist?image_type=photo) | [buscar](https://stock.adobe.com/search?k=latina+gastroenterologist) | [buscar](https://depositphotos.com/stock-photos/latin-gastroenterologist.html) | [buscar](https://www.freepik.com/search?format=search&query=brazilian+doctor+gastroenterology) |
| Ginecologista | [buscar](https://www.shutterstock.com/search/latin-gynecologist-female?image_type=photo&orientation=vertical) | [buscar](https://stock.adobe.com/search?k=latina+gynecologist+female) | [buscar](https://depositphotos.com/stock-photos/latin-gynecologist.html) | [buscar](https://www.freepik.com/search?format=search&query=brazilian+gynecologist+female) |
| Otorrino | [buscar](https://www.shutterstock.com/search/latin-otorhinolaryngologist?image_type=photo) | [buscar](https://stock.adobe.com/search?k=latina+otorhinolaryngologist) | [buscar](https://depositphotos.com/stock-photos/latin-otorhinolaryngologist.html) | [buscar](https://www.freepik.com/search?format=search&query=brazilian+otorhinolaryngologist) |
| Ortopedista | [buscar](https://www.shutterstock.com/search/latin-orthopedist?image_type=photo&people_gender=male) | [buscar](https://stock.adobe.com/search?k=latino+orthopedist+doctor) | [buscar](https://depositphotos.com/stock-photos/latin-orthopedist.html) | [buscar](https://www.freepik.com/search?format=search&query=brazilian+orthopedist+doctor) |

---

### 🔴 BLOCO 2: Planos de Saúde (`HealthExperience.tsx`) — 6 imagens

**Contexto:** Cards de experiência/planos. Cada card tem imagem `400×300` (landscape) + título + descrição. Imagens atuais são genéricas de Unsplash (cédulas, prédio corporativo, médica genérica).

**O que cada card precisa:**
- Contexto real de saúde brasileira: hospital, clínica, equipe, ou ambiente médico
- Preferência por fotos com pessoas (médicos/pacientes) em contexto autêntico
- Evitar fotos conceituais abstratas (ex: cédulas de dinheiro para "preços")

| # | Card | Imagem Atual (Unsplash) | Problema | Orientação de Busca |
|---|------|------------------------|----------|---------------------|
| 1 | Ampla cobertura | `photo-1631815588090` | Médico genérico | "brazilian hospital clinic wide shot" — recepção/ala hospitalar brasileira |
| 2 | Preços competitivos | `photo-1554224155` | Cédulas genéricas (ruim) | "brazilian doctor patient consultation" — médico atendendo paciente |
| 3 | Atendimento ágil | `photo-1576091160399` | Médico genérico | "brazilian healthcare team hospital" — equipe médica brasileira |
| 4 | Coletivo por adesão | `photo-1521737604893` | Escritório genérico | "brazilian medical group association" — grupo de profissionais de saúde |
| 5 | Planos empresariais | `photo-1551836022` | Escritório genérico | "brazilian clinic modern reception" — recepção de clínica brasileira |
| 6 | Planos corporativos | `photo-1486406146926` | Prédio corporativo | "brazilian hospital building exterior" — fachada de hospital brasileiro |

#### Links de busca:

| Card | Shutterstock | Adobe Stock | Freepik |
|------|-------------|-------------|---------|
| Ampla cobertura | [buscar](https://www.shutterstock.com/search/brazilian-hospital-clinic?image_type=photo) | [buscar](https://stock.adobe.com/search?k=brazilian+hospital+interior) | [buscar](https://www.freepik.com/search?format=search&query=brazilian+hospital+clinic) |
| Preços competitivos | [buscar](https://www.shutterstock.com/search/brazilian-doctor-patient-consultation?image_type=photo) | [buscar](https://stock.adobe.com/search?k=latina+doctor+patient+consultation) | [buscar](https://www.freepik.com/search?format=search&query=brazilian+doctor+patient) |
| Atendimento ágil | [buscar](https://www.shutterstock.com/search/brazilian-medical-team?image_type=photo) | [buscar](https://stock.adobe.com/search?k=latino+healthcare+team) | [buscar](https://www.freepik.com/search?format=search&query=brazilian+healthcare+team) |
| Coletivo por adesão | [buscar](https://www.shutterstock.com/search/brazilian-medical-professionals-group?image_type=photo) | [buscar](https://stock.adobe.com/search?k=latino+medical+group) | [buscar](https://www.freepik.com/search?format=search&query=brazilian+doctors+group) |
| Planos empresariais | [buscar](https://www.shutterstock.com/search/brazilian-clinic-reception?image_type=photo) | [buscar](https://stock.adobe.com/search?k=brazilian+clinic+reception) | [buscar](https://www.freepik.com/search?format=search&query=brazilian+clinic+reception) |
| Planos corporativos | [buscar](https://www.shutterstock.com/search/brazilian-hospital-building?image_type=photo) | [buscar](https://stock.adobe.com/search?k=brazilian+hospital+exterior) | [buscar](https://www.freepik.com/search?format=search&query=brazilian+hospital+building) |

---

### 🟡 BLOCO 3: Família (`FamilyPlan.tsx`) — 1 imagem

**Contexto:** Background full-bleed da seção "Cuidado de verdade para os cariocas" (Plano Carioca 10). Overlay roxo. A imagem atual é `/familia-bg.webp` (1.6MB) + `/familia-pexels.jpg` (4.1MB) como backup.

**O que precisa:**
- Família brasileira (preferência: multiétnica, carioca)
- Cena autêntica, não posada em estúdio
- Deve se integrar bem com overlay roxo `#7B6BB2`
- Resolução alta, boa luminosidade

#### Links de busca:

| Fonte | Link |
|-------|------|
| Shutterstock | [buscar: "brazilian family happy outdoor"](https://www.shutterstock.com/search/brazilian-family-happy-outdoor?image_type=photo) |
| Pexels (gratuito) | [buscar: "brazilian family"](https://www.pexels.com/search/brazilian%20family) |
| Adobe Stock | [buscar: "latin family brazil outdoors happy"](https://stock.adobe.com/search?k=latin+family+brazil+outdoors) |
| Depositphotos | [buscar: "brazilian family outdoors"](https://depositphotos.com/stock-photos/brazilian-family-outdoors.html) |

---

## 3. Plano de Ação Recomendado

### Prioridade 🔴 (Alta — impacta credibilidade):

1. **Especialistas (8 cards):** Substituir 6 imagens de Unsplash por fotos de médicos brasileiros.
   - **Shopping list:** 6 imagens (3 female + 3 male, variando idade/etnia)
   - **Orçamento estimado:** R$180-900 (dependendo do banco e se pegar pacote)
   - **Recomendação:** Pegar 1-2 imagens gratuitas de qualidade (Freepik/Pexels) para validar o fluxo, depois comprar um pacote no Shutterstock (25 imagens/mês ≈ R$150)

2. **Planos de Saúde (6 cards):** Substituir todas as imagens de Unsplash.
   - **Shopping list:** 6 imagens (variando entre ambiente hospitalar, equipe, consulta, recepção)
   - **Orçamento estimado:** R$180-600
   - **Recomendação:** Mesmo pacote Shutterstock cobre os 6

### Prioridade 🟡 (Média):

3. **Família:** Avaliar se a imagem atual atende, ou buscar uma foto de família brasileira mais autêntica.

### Custo Total Estimado:

| Banco | Plano Mensal | Imagens/mês | Custo p/ 12 imagens |
|-------|-------------|-------------|---------------------|
| **Shutterstock** | R$149/mês | 10/mês | R$149-298 (2 meses) |
| **Adobe Stock** | R$119/mês | 10/mês (3 assets) | R$119-357 (3 meses, 9 assets) |
| **Depositphotos** | R$69/mês | 30/dia (plano flex) | R$69 |
| **Freepik Premium** | R$59/mês | Ilimitado | R$59 |

> 💡 **Melhor custo-benefício:** Depositphotos plano flex (R$69 = 30 downloads/dia) ou Freepik Premium (R$59/mês — mas cuidado com IA-generated). Para qualidade garantida de médicos brasileiros: **Shutterstock**.

---

## 4. Checklist de Validação (Antes de Implementar)

Para cada imagem selecionada, validar:

- [ ] **Origem brasileira/latina** — a pessoa parece brasileira? (traços, contexto, ambiente)
- [ ] **Jaleco branco** — se for médico, está vestindo branco?
- [ ] **Corpo inteiro** — o enquadramento mostra pelo menos 70% do corpo?
- [ ] **Não genérica** — evita fundo infinito branco/cinza, pose forçada, sorriso de stock?
- [ ] **Contexto do bloco** — a imagem faz sentido com o texto ao redor?
- [ ] **Paleta de cores** — harmoniza com `#7B6BB2`/`#5E4985`/branco? (tons quentes, evitar azul frio)
- [ ] **Resolução** — mínimo 800×560px (hero variant) ou 400×480px (compact variant)?
- [ ] **Licença** — royalty-free para uso comercial, sem atribuição obrigatória?

---

## 5. Observações Técnicas

- **Imagens do Specialists usam `object-cover object-top`** — significa que o topo da imagem é priorizado. Médicos devem ter o rosto no terço superior da foto.
- **HealthExperience usa `object-cover` + scale on hover** — imagens precisam ter ponto focal central.
- **FamilyPlan usa `object-cover` full-bleed com overlay** — evitar imagens muito escuras (o overlay roxo já escurece).
- **Formato recomendado:** `.webp` com qualidade 85-90% (menor que `.jpg`, com transparência se necessário).
- **Todas as imagens devem ser salvas em `web/public/`** com nomes sem espaço (ex: `pediatra-brasileira.webp`).
- **Atualizar referências no código:** `Specialists.tsx` linha 18-61 (array `specialties`) e `HealthExperience.tsx` linha 11-43 (array `items`).
- **Após deploy, verificar Lighthouse:** imagens novas podem afetar LCP se não forem otimizadas.

---

*Pesquisa conduzida via web_search + análise do código-fonte. Links de busca são dinâmicos — os resultados variam conforme disponibilidade do banco no momento da consulta.*
