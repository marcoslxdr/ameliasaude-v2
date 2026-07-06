# Amélia Saúde — Guia de Design (Design System)

Documentação de referência para manter consistência visual, de conteúdo e de motion no site institucional one-page.

---

## 1. Filosofia visual

**Tese:** editorial de luxo em saúde — muito branco, tipografia serif de display, acentos em ameixa (`#7B6BB2` / `#5E4985`), poucos elementos decorativos, hierarquia por escala e espaço em branco.

**Referências de tom:** precisão e calma (Apple), sofisticação sem ruído (editoriais de moda/lifestyle), clareza clínica sem frieza.

**O que evitar:** grids genéricos de “SaaS”, muitas cores competindo, gradientes decorativos sem função, copy genérica de marketing.

---

## 2. Tokens de cor

| Token / variável | Hex / valor | Uso |
|------------------|-------------|-----|
| `--amelia-white` | `#FFFFFF` | Fundo principal |
| `--amelia-surface` | `#F8F7FF` | Fundos alternados, hover suave em cards |
| `--amelia-purple` | `#7B6BB2` | Accent principal: links, bordas, CTAs primários, detalhes |
| `--amelia-deep` | `#5E4985` | Hover de botões, seção escura (Especialistas 24h) |
| `--amelia-ink` | `#1A1A1A` | Texto principal |
| `--amelia-muted` | `#8A8A8A` | Texto secundário |
| `--amelia-line` | `rgba(123,107,178,0.15)` | Divisores e bordas sutis |

**Contraste:** texto `#1A1A1A` sobre `#FFFFFF` e `#F8F7FF` atende WCAG AA. Em fundo `#5E4985`, usar texto branco ou branco com opacidade controlada para hierarquia.

---

## 3. Tipografia

| Função | Família | Pesos | Onde |
|--------|---------|-------|------|
| Display / headlines | **Cormorant Garamond** (`--font-cormorant`) | 300–700, itálico | `h1`, `h2`, `h3`, números grandes (stats) |
| UI / corpo | **DM Sans** (`--font-dm-sans`) | 300, 400, 500 | Parágrafos, navegação, botões, labels |

**Classes utilitárias** (definidas em `globals.css`):

- `.text-hero` — headline principal do hero
- `.text-display` — títulos de seção
- `.text-headline` — subtítulos fortes
- `.text-stat` — números grandes (8+, 80%, etc.)

**Regras:**

- Um único `h1` na página (hero), alinhado ao briefing de produto.
- Cada seção principal usa `h2` semântico.
- Não misturar mais de duas famílias além de monoespaçada para dados técnicos (se um dia for necessário).

---

## 4. Grid e espaçamento

- **Largura máxima de conteúdo:** `1440px` centralizado.
- **Padding horizontal:** `clamp(1.5rem, 6vw, 7rem)` (variável `--section-px`).
- **Padding vertical de seção:** `clamp(5rem, 10vh, 8rem)` (`--section-py`).
- **Seções fullscreen:** classe `.section-full` — `min-height: 100svh` com flex para centralizar conteúdo quando fizer sentido.

---

## 5. Motion (Framer Motion)

Arquivo central: [`src/lib/motion.ts`](src/lib/motion.ts).

| Variante | Uso |
|----------|-----|
| `fadeUp` | Entrada de blocos (opacity + translateY) |
| `fadeUpFast` | Elementos menores |
| `fadeIn` | Seções inteiras (opacity) |
| `staggerContainer(delay, delayChildren)` | Lista de filhos com atraso escalonado |
| `slideLeft` / `slideRight` | Entrada lateral |
| `scaleUp` | Destaques pontuais |
| `revealLine` | Linha que cresce em X |
| `viewportConfig` | `once: true`, `margin: "-80px"` para `whileInView` |

**Princípios:**

1. Uma sequência de entrada clara por seção (stagger leve, não carnaval).
2. Parallax só onde reforça profundidade (ex.: hero).
3. Botões: `whileHover` / `whileTap` com escala sutil (ver [`Button.tsx`](src/components/ui/Button.tsx)).

---

## 6. Componentes UI

| Componente | Arquivo | Função |
|------------|---------|--------|
| `Button` | `components/ui/Button.tsx` | CTAs pill (`rounded-full`). Variantes em `lib/button-styles.ts` |
| `AnimatedText` | `components/ui/AnimatedText.tsx` | Wrapper com `fadeUp` ou stagger para texto |
| `SectionWrapper` | `components/ui/SectionWrapper.tsx` | Seção fullscreen com fade-in opcional |
| `Logo` | `components/ui/Logo.tsx` | Placeholder SVG; substituir por `public/logo.svg` quando houver marca oficial |

### Botões (padrão: CTA "Quero meu plano")

**Config central:** [`src/lib/button-styles.ts`](src/lib/button-styles.ts)  
**Componente:** [`src/components/ui/Button.tsx`](src/components/ui/Button.tsx)

| Variante | Uso |
|----------|-----|
| `primary` (default) | CTA principal — fundo `--amelia-deep`, pill, sombra |
| `purple` | CTA alternativo — fundo `--amelia-purple` |
| `outline` | Secundário com borda roxa |
| `ghost-white` | Sobre fundos escuros |
| `ghost-purple` | Link sublinhado roxo |
| `ghost-link` | Link textual com seta (ex.: "Conheça a Amélia") |
| `pagination` / `pagination-active` | Navegação blog (pill) |

| Tamanho | Uso |
|---------|-----|
| `sm` | Hero e CTAs compactos |
| `md` (default) | Seções e páginas |

**Regra:** todo botão de ação usa `rounded-full` (pill). Não usar `rounded-lg` / `rounded-2xl` em CTAs.

---

## 7. Estrutura da página

| ID âncora | Seção |
|-----------|--------|
| `#hero` | Hero + proposta de valor |
| `#planos` | Planos (pessoa, família, empresa) |
| `#rede` | Rede credenciada RJ |
| `#especialistas` | Especialistas 24h (fundo escuro) |
| `#telemedicina` | Telemedicina + métrica 80% |
| `#empresas` | Coletivos por adesão + PME |
| `#contato` | Contato + rodapé |

Navegação: [`Navigation.tsx`](src/components/Navigation.tsx) — blur após scroll, links âncora, CTA “Fale Conosco”.

---

## 8. Acessibilidade

- Landmarks: `header`, `main` (`id="main-content"`), `footer` dentro de contato.
- Foco visível: botões e links com `focus-visible:outline` onde aplicável.
- CTAs repetidos: usar `aria-label` quando o texto visível for idêntico em contextos diferentes.
- Números de telefone: `tel:` com DDI/DDD corretos em produção (hoje placeholders conforme documentação de produto).
- Não depender só de cor para estado; combinar com tipografia/peso/borda.

---

## 9. Como adicionar uma nova seção

1. Criar `components/sections/NovaSecao.tsx` como client component se usar motion.
2. Importar variantes de `@/lib/motion` e `viewportConfig` para `whileInView`.
3. Usar `id` único e âncora em kebab-case.
4. Registrar o link em `Navigation.tsx` se for primário.
5. Incluir a seção em `app/page.tsx` na ordem narrativa desejada.
6. Atualizar este guia na tabela de âncoras.

---

## 10. Conteúdo e compliance

Copy oficial e lacunas estão em [`DOCUMENTACAO-SITE-AMELIA-SAUDE.md`](../DOCUMENTACAO-SITE-AMELIA-SAUDE.md) na raiz do repositório. Não inventar listas de municípios, hospitais ou especialidades sem fonte; substituir telefones placeholder antes do go-live.

---

*Última revisão alinhada ao one-page institucional Amélia Saúde (Next.js App Router).*
