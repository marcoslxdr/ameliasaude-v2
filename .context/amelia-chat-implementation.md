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
