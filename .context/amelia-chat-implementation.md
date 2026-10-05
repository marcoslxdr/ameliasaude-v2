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
