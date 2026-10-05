# Evidências do chat Amélia Saúde

## Produção pública — 2026-10-05

URL efetiva: https://www.ameliasaude.com.br/ (HTTP 200). Release promovido pelo coordenador: `dpl_4Mm5pcaoZb6o8iM7xk2P42EFvorH`, fonte `a14930e`, origem https://ameliasaude-v2-ggbbywj41-atriahub.vercel.app.

Runner real `e2e-production-public.mjs`; execução `jmedddeelb`. Sem mocks/interceptação, sem CPF de clientes, sem sessão de operador e sem mensagens WhatsApp. Inputs e capturas contêm apenas dados sintéticos identificados como QA.

Contagem exata desta execução:

| Prova | Quantidade e resultado |
| --- | --- |
| Departamentos com consentimento, `crmSynced=true` e fila humana | 2/2: Vendas e Atendimento |
| Combinações departamento/viewport | 4/4: cada departamento em 1440×900 e 360×800 |
| Capturas PNG inspecionadas | 5: quatro filas e um encerramento |
| Sessões por departamento | 1 start de Vendas e 1 start de Atendimento; tokens distintos |
| Segurança de marca | 1/1: body/header Six continuam retornando Amélia |
| Segurança de departamento | 1/1: token Vendas no Atendimento rejeitado com HTTP 400 |
| Retomada sem novo start | 1/1: Vendas preservada após visitar Atendimento |
| Encerramento e pesquisa de Vendas | 1/1: finalizar → nota 5 → comentário 0 → fechamento; Atendimento não foi encerrado |
| Sessão terminal de Vendas | 1/1: poll HTTP 410 `session_closed`, input bloqueado |
| Reset explícito de Vendas | 1/1: HTTP 200, nova sessão Vendas, `crmSynced=false` |
| Respostas humanas de operador em produção | 0; não testadas sem sessão autenticada |

Arquivos: `production-public-jmedddeelb/summary.json`, `amelia-{sales,service}-queue-{desktop,mobile}.png` e `amelia-sales-closed-desktop.png`. JSON registra apenas metadados; tokens, cookies e credenciais ficam fora dos artefatos. O navegador foi fechado após a execução.

`crmSynced=true` confirma o contrato público do backend. O coordenador confirmou a persistência independentemente no banco: Vendas `1098e73a…` está `closed` com uma oportunidade; Atendimento `0c21e40b-2661-4a04-b66c-8e092b82ca15` está `active/human_queue` com caso de atendimento aberto. Marcadores sintéticos: `Qa Amelia Vendas jmedddeelb` e `Qa Amelia Atendimento jmedddeelb`.

Pendência de limpeza: o Atendimento QA permanece na fila e deve ser encerrado por operador autorizado. O runner fechou o navegador e terminou; nenhum token ou sessão do visitante ficou retido para retomada. Não foi feita alteração direta no banco nem reconstrução de token para encerrar essa conversa.

Observação visual menor: a linha de acompanhamento de resposta humana permanece junto ao aviso explícito de encerramento. O campo e polling ficam bloqueados corretamente. Não houve mudança de código do produto nesta rodada de documentação.

Execução só após confirmar release e aliases:

```sh
AMELIA_PRODUCTION_QA_APPROVED=yes AMELIA_PRODUCTION_SITE=https://www.ameliasaude.com.br node .context/chat-qa/e2e-production-public.mjs
```

## Validação local e operador pendente

`e2e-integrated.mjs` e `integrated-final-summary.json`: banco e operadores QA locais, dois departamentos com respostas reais de operador, desktop/mobile. Isso não comprova resposta humana de produção.

`e2e-error-resume.mjs`: CRM local real com falhas 503/410 de transporte explicitamente injetadas; sessão preservada e reset explícito. `cotacao-brand.mjs`: cotação local real persistiu Amélia/Vendas mesmo com marca Six forjada.

O runner completo de produção preparado em `e2e-production.mjs` exige estado autenticado de operador em arquivo privado 0600. Nunca usa usuários/senhas do seed local em produção. Ainda não foi executado.

Código antes do release: 10/10 testes de contrato; build 51 páginas; TypeScript e lint sem erros (12 warnings preexistentes). Gate B enforce não cobre paths deste repositório porque resolve somente a raiz do Segundo Cérebro; advisory passou e a limitação foi registrada.
