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
- **Vídeos / Mídia**: Arquivos de vídeo adicionados a `web/public/` devem ser comprimidos (ex: via `ffmpeg`) para ficarem abaixo do limite de 100MB do GitHub e otimizar o carregamento no site.
  - Exemplo de compressão: `ffmpeg -i input.mp4 -vcodec libx264 -crf 24 -preset medium -acodec aac -b:a 128k output.mp4`
- **Hero mobile (`Hero.tsx`)**: PNG `maria-padilha-hero.png` tem canvas transparente largo — imagem mobile usa `width: 148vw` + `object-[78%_bottom]`. Texto precisa `max-lg:pr-[40vw]` (ajustar por breakpoint) para não sobrepor o rosto; não remover sem testar em 360–412px.
- **Scroll mobile (`globals.css`)**: Nunca reativar `scroll-snap-type` / `scroll-snap-align` global nem `min-height: 100svh` em toda `section` — trava momentum no touch. Preferir `overflow-x: clip` (não `hidden`) e `scroll-behavior: smooth` só em `@media (hover: hover) and (pointer: fine)`.
- **Favicon**: Ícones em `web/public/` (`favicon.svg`, `favicon-32.png`, `favicon.ico`, `apple-touch-icon.png`) + `metadata.icons` em `layout.tsx` com `?v=N` pra cache-bust. Evitar `app/favicon.ico` — Next injeta na frente e browser cacheia forte; hard refresh / aba anônima se localhost não atualizar.
- **Órbita (`CoverageOrbital.tsx`)**: Label lateral (`MARKER_LABEL_RIGHT`) = texto `absolute` no avatar + label de baixo `invisible` (reserva altura). Não usar `flex-row` no marcador — desloca o círculo da órbita.
