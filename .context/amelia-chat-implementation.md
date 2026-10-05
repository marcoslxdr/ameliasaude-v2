# Chat Amélia Saúde: vendas e atendimento

## Arquitetura

- O site mantém a marca `amelia` definida no servidor, independentemente do payload do navegador.
- O visitante escolhe `sales` (Vendas) ou `service` (Atendimento). Cada departamento mantém sua própria conversa em memória durante a visita.
- O widget chama `/api/chat`; o proxy encaminha somente ações e campos permitidos para `/api/agent/webchat/flow` no CRM.
- Autenticação servidor-servidor: `CRM_WEBCHAT_TOKEN` no site corresponde a `WEBCHAT_AMELIA_INGEST_TOKEN` no CRM. Nunca usar credenciais Six para esse canal.
- Endpoint: `CRM_WEBCHAT_FLOW_URL`, com fallback `CRM_WEBCHAT_URL`. Aceita HTTPS sem credenciais/query; HTTP loopback exclusivamente em desenvolvimento.
- O CRM precisa devolver `brand: amelia` e o mesmo `department`. Respostas diferentes são rejeitadas.
- Tokens opacos ficam apenas na memória do widget. Não há persistência de transcript ou token no localStorage. Recarregar a página inicia outra sessão.
- Um cookie HttpOnly curto identifica o navegador para gerar o HMAC de rate limit; não contém dados do cliente.
- Conversas persistidas no CRM recebem polling a cada 5 segundos quando abertas, inclusive antes de uma eventual tomada de controle pelo operador.
- Não há envio nem encaminhamento automático aos números de WhatsApp da Six.

## Interface e privacidade

O widget global usa as cores e tipografia existentes, `dialog` nativo (foco, Escape e isolamento de teclado), botões de seleção e área de mensagens com anúncio acessível. O texto do cliente só aparece como enviado após o backend confirmar a requisição. Falhas exibem estado real e preservam o texto para nova tentativa.

PostHog exclui o dialog de session recording com `blockSelector` e de autocapture com classes específicas. A política de privacidade está disponível na escolha de departamento. Consentimento e eventual coleta de identificação pertencem ao fluxo do CRM; não se deve executar consultas de beneficiário da Six neste canal.

A cotação existente continua separada e injeta `brand: amelia` no envio ao CRM. Não gera conversa artificial de chat.

## Validação

- `npm --prefix web run test:chat`: contrato obrigatório por departamento, limites, URL, isolamento de marca/departamento, filtragem da resposta, documentos seguros, erro real, mensagens humanas e HTTP loopback apenas dev.
- `npm --prefix web run lint`: zero erros; warnings já existentes documentados no relatório de execução.
- `npm --prefix web run build`: TypeScript e build de produção.
- Navegador local: seletor desktop/mobile, teclado/Escape, fluxo de cada departamento, mensagens humanas, falha de conexão e isolamento entre marcas.

As provas locais não substituem a publicação e a matriz integrada no CRM. Antes de publicar, configurar o token dedicado, endpoint correto e o roteamento Amélia no CRM. O projeto Vercel tem rootDirectory `web`; deploy deve partir da raiz do repositório e deve ser verificado no domínio servido.

## Execução integrada local em 2026-10-05

- Site: `127.0.0.1:3411`; CRM: `127.0.0.1:3410`; banco PGlite exclusivo de QA com operadores sintéticos.
- Navegador real: Vendas e Atendimento passaram por nome, confirmação e consentimento. Ambos responderam `brand=amelia`, departamento correto e `crmSynced=true` após consentimento.
- Vendas qualificou e-mail/telefone sintéticos e chegou à fila humana; Atendimento recebeu demanda sintética e chegou à fila humana. Nenhuma consulta Digital Saúde Six neste fluxo.
- API autenticada do CRM confirmou duas conversas distintas, `channel=webchat`, `channelAccountId=amelia-webchat`, uma por departamento.
- Operador assumiu Vendas e Atendimento pela interface do CRM, enviou mensagens de QA (HTTP 201), e o visitante recebeu as mesmas respostas pela sessão web. O reteste final autenticou o contexto pela API local e executou assunção/envio pela interface. O login visual também foi verificado na primeira rodada.
- Desktop 1440×900 e mobile 360×800 passaram em ambos os departamentos, sem overflow horizontal e com o texto humano inteiramente visível no log. Capturas finais: `chat-qa/amelia-{sales,service}-human-final-{desktop,mobile}.png`.
- O log agora acompanha redimensionamentos para manter a mensagem mais recente visível. O teste verifica o texto dentro da área visível, considerando o padding do log.
- Houve falhas transitórias durante build/reinício do CRM. O reteste final foi executado após estabilização do runtime QA; capturas anteriores com aviso de indisponibilidade são evidência desse estado anterior.
- Limites: não publicado; dados e operadores são sintéticos, em banco local dedicado. Sessões ficam apenas em memória durante a visita. O texto genérico de fila/atendente em Vendas foi encaminhado ao responsável do backend para revisão.

`chat-qa/e2e-integrated.mjs` reproduz a matriz final. `chat-qa/integrated-final-summary.json` registra apenas metadados e IDs locais, sem tokens, CPF ou transcript.

## Revisão complementar antes da publicação

- Corrigido descarte involuntário de sessão ao reabrir departamento depois de falha transitória. A conversa existente permanece; somente “Iniciar nova conversa” solicita reset.
- HTTP 410 do CRM preservado como `session_closed`. Encerramento/expiração mostram aviso específico e suspendem envio e polling até reinício explícito.
- `chat-qa/e2e-error-resume.mjs` validou em navegador a retomada da mesma sessão, retry real no CRM e reset real, com falhas 503/410 injetadas e identificadas como fixtures. Nenhum consentimento foi enviado nessa rodada.
- Contrato unitário: 10 testes aprovados. Lint sem erros (12 warnings preexistentes); TypeScript aprovado.
- Vercel inspecionado em leitura: `atriahub/ameliasaude-v2`, rootDirectory `web`, Node 24.x. Antes da configuração pelo coordenador, Preview/Production tinham `CRM_LEADS_ENDPOINT` e `CRM_INGEST_TOKEN`, mas não tinham `CRM_WEBCHAT_TOKEN` nem endpoint do fluxo. Nenhuma variável foi alterada nesta inspeção.
- A CLI ignora automaticamente `.env.local` e `.env.*.local`, conforme documentação oficial: https://vercel.com/docs/builds/build-features . A publicação deve usar as variáveis do projeto e não valores do banco QA.
- Limite operacional: identificar o navegador por cookie permite redefinir a chave de rate limit descartando o cookie. O backend continua exigindo token dedicado e vinculando sessão à chave HMAC; proteção contra abuso em escala demanda limite adicional na borda/IP. O limitador de cotação continua best-effort em memória, já existente.
- Cotação validada end-to-end no banco QA: visitante enviou `brand: six`, site respondeu HTTP 202 e a oportunidade persistiu com `brand: amelia`, `department: sales`. Script reexecutável com requestId fixo: `chat-qa/cotacao-brand.mjs`; evidência sem dados pessoais em `chat-qa/cotacao-brand-summary.json`.
- Build final após ajustes: 51 páginas geradas, rotas `/api/chat` e `/api/cotacao` dinâmicas, TypeScript aprovado.
- O Gate B `--enforce` foi tentado para os arquivos do app, mas o checker resolve paths exclusivamente a partir do Segundo Cérebro e retorna “path alterado não encontrado”. A validação advisory desse checker passou; não representa cobertura enforce deste repositório.

## Validação pública em produção em 2026-10-05

- Coordenador promoveu o deployment `dpl_4Mm5pcaoZb6o8iM7xk2P42EFvorH`, origem `https://ameliasaude-v2-ggbbywj41-atriahub.vercel.app`, fonte `a14930e` (commit de release sem mudança de código sobre `93943cb`).
- URL pública efetiva respondeu HTTP 200: `https://www.ameliasaude.com.br/`.
- `chat-qa/e2e-production-public.mjs` foi executado contra esse domínio com dados sintéticos identificados pelo marcador `jmedddeelb`, sem interceptação de rede, mocks, CPF ou sessão de operador.
- Vendas e Atendimento: nome/confirmar/LGPD, resposta `brand=amelia`, departamento correto, `crmSynced=true` e fila humana passaram. Capturas desktop 1440×900 e mobile 360×800 foram inspecionadas, sem overflow horizontal ou corte da interface.
- Tokens de sessão eram distintos. Token de Vendas usado no Atendimento foi rejeitado com HTTP 400. Body/header com marca Six enviados à API pública continuaram retornando Amélia, pois a marca é definida pelo servidor.
- Reabrir Vendas depois de navegar ao Atendimento preservou a sessão original: somente um start por departamento.
- Encerramento público real passou por `finalizar → nota 5 → comentário 0`, mensagens de fechamento, polling HTTP 410 `session_closed`, bloqueio do campo de envio e reset explícito HTTP 200 para nova sessão sem consentimento anterior.
- Evidência sanitizada: `chat-qa/production-public-jmedddeelb/summary.json` e cinco PNGs. Tokens, cookies, CPF e credenciais não foram gravados.
- Limite da prova pública: `crmSynced=true` é confirmação do contrato do backend; IDs/estado persistido devem ser reconciliados pelo coordenador. Sem credencial de operador, resposta humana real de produção não foi testada. O runner completo `chat-qa/e2e-production.mjs` aguarda essa sessão real; não faz login com usuário QA do banco local.
- Observação visual menor: a linha “Acompanhe a resposta da equipe aqui neste chat” permanece junto ao aviso explícito de encerramento. O input e polling ficam bloqueados corretamente; nenhum código adicional foi alterado após a publicação para tratar esse texto.
- Reconciliação independente informada pelo coordenador: Vendas `1098e73a…` está fechada e gerou uma oportunidade; Atendimento `0c21e40b-2661-4a04-b66c-8e092b82ca15` permanece `active/human_queue`, com caso de atendimento aberto. O teste de pesquisa/410/reset foi somente de Vendas. Atendimento QA requer limpeza por operador autorizado; o runner já terminou e não reteve sessão/token. Não foi realizada alteração direta no banco para essa limpeza.
