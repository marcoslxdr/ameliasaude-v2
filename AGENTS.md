<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Agentes (obrigatório)

- Regras: `.cursor/rules/mandatory-agent-skills.mdc`, `context-mode-repo.mdc`
- Toda sessão: skills **context-mode** + **caveman** (`Read` nos `SKILL.md`); terminal/build/git read → MCP `ctx_*`
- App: `web/`

## Gotchas & Convenções

- **Deploy Vercel**: **dois projetos** no time `insightfy` — `ameliasaude-v2` (prod **www.ameliasaude.com.br**) e `amelia-saude-v2` (só `*.vercel.app`). `vercel link --project ameliasaude-v2` antes do deploy prod. `rootDirectory: web`. Comando: `vercel deploy --prod --yes --scope insightfy` na raiz.
- **Limite 100MB no upload CLI**: assets grandes na raiz (ex. `amelia video.mp4` 133MB) quebram deploy. Manter exclusões em `.vercelignore` (só raiz — **não** ignorar `web/public/*.mp4` usados no site).
- **Vídeos / Mídia**: Arquivos em `web/public/` devem ser comprimidos (abaixo de 100MB GitHub + load web). Originais grandes → `backups/videos/` (gitignored).
  - Institucional (`BrandOrigin`): `web/public/amelia-video.mp4` — **sem espaço no nome**, 720×1280 H.264 **Main@L4.0** CRF28 AAC faststart (~3.6MB). iPhone: não usar High@L5.0 nem `h`+`aspect-ratio`+`w-auto` (width vira 0 no Safari). Capa: `web/public/amelia-video-poster.jpg` via `poster` no `<video>`.
  - Layout vídeo: grid track do player = largura **definida em rem** (`lg:grid-cols-[24rem_…]`, não `minmax(0,24rem)`). `w-[min(100%,…)]` + `min-w-0` na coluna → largura cíclica → caixa **0×0** (MP4 200 OK, `<video>` some).
  - Exemplo: `ffmpeg -i input.mp4 -vf "scale='min(720,iw)':-2" -c:v libx264 -profile:v main -level 4.0 -crf 28 -preset medium -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart amelia-video.mp4`
  - Backup original com espaço: `web/public/amelia video.mp4` (High@L5.0, ~17MB) — não referenciar no código. Extrair capa: `ffmpeg -ss 2 -i input.mp4 -frames:v 1 -q:v 2 poster.jpg`
- **Hero mobile (`Hero.tsx`)**: foto LCP = `maria-padilha-hero.webp` (não PNG 1.7MB). Canvas transparente largo → mobile `width: 148vw`, `right-[-34vw]`, `object-[82%_bottom]` (tall `92%`). Texto `max-lg:pr-[44vw]` (sm `40vw` / md `36vw`). **Nunca** `initial={{ opacity: 0 }}` na foto hero — atrasa LCP no Lighthouse mobile. `sizes` mobile ≈ `100vw` (não `148vw`) pra não baixar imagem gigante.
- **SEO**: `web/src/app/robots.ts` + `sitemap.ts`; `metadataBase` + OG/canonical em `layout.tsx` (`https://www.ameliasaude.com.br`). Analytics/Speed Insights no root layout. Após mudança SEO: `npx lighthouse https://www.ameliasaude.com.br --only-categories=seo,performance`. Progresso loop: `LOOP_PROGRESS.md`.
- **PostHog**: client via `web/src/instrumentation-client.ts` (`posthog-js`). Env: `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` + `NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com` (local `.env.local` + Vercel). Projeto atual MCP: [Default project](https://us.posthog.com/project/300195) (org Odonto GPT). Docs: https://posthog.com/docs/libraries/next-js
- **Composio / Google Ads**: conta `googlesuper` ACTIVE (`ca_Z5Tvv7TmRpQ4`, word_id `googlesuper_drive-salver`, user `ameliasaude06@gmail.com`). Scope inclui `adwords`. OAuth OK (Calendar testado). **Ads API** ainda precisa **developer token** próprio — senão `DEVELOPER_TOKEN_PARAMETER_MISSING`. Docs: https://docs.composio.dev/toolkits/googleads.md · token: https://developers.google.com/google-ads/api/docs/api-policy/developer-token. Tools: `GOOGLESUPER_LIST_ACCESSIBLE_CUSTOMERS`, `GOOGLESUPER_SEARCH_STREAM_GAQL`, `GOOGLESUPER_MUTATE_*`.
- **Scroll mobile (`globals.css`)**: Nunca reativar `scroll-snap-type` / `scroll-snap-align` global nem `min-height: 100svh` em toda `section` — trava momentum no touch. Preferir `overflow-x: clip` (não `hidden`) e `scroll-behavior: smooth` só em `@media (hover: hover) and (pointer: fine)`.
- **Favicon**: Ícones em `web/public/` (`favicon.svg`, `favicon-32.png`, `favicon.ico`, `apple-touch-icon.png`) + `metadata.icons` em `layout.tsx` com `?v=N` pra cache-bust. Evitar `app/favicon.ico` — Next injeta na frente e browser cacheia forte; hard refresh / aba anônima se localhost não atualizar.
- **Órbita (`CoverageOrbital.tsx`)**: Marcador = box do avatar com `-translate-x/y-1/2` (tamanho explícito). Label sempre `absolute` embaixo. Quebra forçada via `MARKER_LABEL_LINES` (ex. São João / de Meriti). Nunca `translate(-50%)` num pai com `width:0` (vira 0 no X e empurra o círculo pra direita — quebra espelho L↔R).
- **Subtítulo de seção**: lead sob o `h2` = `font-sans font-light leading-relaxed text-[var(--amelia-body)]` + `fontSize: clamp(1.1rem, 1.9vw, 1.35rem)` (ref. `Network.tsx`). Não misturar com eyebrow (`text-[11px]` tracking) nem body de card.
