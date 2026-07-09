<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Agentes (obrigatório)

- Regras: `.cursor/rules/mandatory-agent-skills.mdc`, `context-mode-repo.mdc`
- Toda sessão: skills **context-mode** + **caveman** (`Read` nos `SKILL.md`); terminal/build/git read → MCP `ctx_*`
- App: `web/`

## Gotchas & Convenções

- **Deploy Vercel**: projeto linkado `insightfy/amelia-saude-v2`, `rootDirectory: web`. Prod: `vercel deploy --prod --yes` na raiz. Domínio: https://www.ameliasaude.com.br
- **Limite 100MB no upload CLI**: assets grandes na raiz (ex. `amelia video.mp4` 133MB) quebram deploy. Manter exclusões em `.vercelignore` (só raiz — **não** ignorar `web/public/*.mp4` usados no site).
- **Vídeos / Mídia**: Arquivos em `web/public/` devem ser comprimidos (abaixo de 100MB GitHub + load web). Originais grandes → `backups/videos/` (gitignored).
  - Institucional (`BrandOrigin`): `web/public/amelia video.mp4` — 720p CRF 28 AAC 96k (~3.6MB). Backup: `backups/videos/amelia-video-original.mp4` (133MB).
  - Exemplo: `ffmpeg -i input.mp4 -vf scale=720:-2 -c:v libx264 -crf 28 -preset medium -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart output.mp4`
- **Hero mobile (`Hero.tsx`)**: PNG `maria-padilha-hero.png` tem canvas transparente largo — imagem mobile usa `width: 148vw` + `object-[78%_bottom]`. Texto precisa `max-lg:pr-[40vw]` (ajustar por breakpoint) para não sobrepor o rosto; não remover sem testar em 360–412px.
- **Scroll mobile (`globals.css`)**: Nunca reativar `scroll-snap-type` / `scroll-snap-align` global nem `min-height: 100svh` em toda `section` — trava momentum no touch. Preferir `overflow-x: clip` (não `hidden`) e `scroll-behavior: smooth` só em `@media (hover: hover) and (pointer: fine)`.
- **Favicon**: Ícones em `web/public/` (`favicon.svg`, `favicon-32.png`, `favicon.ico`, `apple-touch-icon.png`) + `metadata.icons` em `layout.tsx` com `?v=N` pra cache-bust. Evitar `app/favicon.ico` — Next injeta na frente e browser cacheia forte; hard refresh / aba anônima se localhost não atualizar.
- **Órbita (`CoverageOrbital.tsx`)**: Marcador = box do avatar com `-translate-x/y-1/2` (tamanho explícito). Label sempre `absolute`. Nunca `translate(-50%)` num pai com `width:0` (vira 0 no X e empurra o círculo pra direita — quebra espelho L↔R no mobile).
