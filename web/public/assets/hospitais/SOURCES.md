# Fotografias dos destaques — revisão de 11/10/2026

As 13 imagens são fotografias reais. Oito arquivos da release anterior foram preservados; cinco fotografias foram baixadas de páginas institucionais e convertidas em WebP. Não foram usadas imagens geradas por IA nem fotografias de instituições semelhantes como substitutas.

O registro completo de fontes, URLs dos cinco originais, dimensões, tamanhos e SHA-256 está em `photo-sources-2026-10-11.json`. Crédito/fonte permanecem nos dados de proveniência, sem legendas ou links visíveis na galeria conforme o pedido de retirar textos e botões. A galeria mantém um `alt` descritivo por fotografia.

| Ordem | Instituição e identificação da foto | Fonte institucional |
| --- | --- | --- |
| 1 | Hospital Quali Ipanema — fachada/entrada de emergência | [Fundação Real Grandeza](https://www3.frg.com.br/quem-somos/comunicacao-e-informativos/noticias/salutem-e-salvus-novo-hospital-de-emergencia-credenciado-5767.html) |
| 2 | NotreCare Rio — fachada, Andaraí | [NotreDame Intermédica](https://www2.gndi.com.br/pt/hospitalnotrecarerio) |
| 3 | Hospital São Matheus — fachada, foto histórica publicada em 2017 | [Revista ASSIM Saúde, edição 16](https://assim.com.br/site/revista-assim/edicao-16/documents/edicao-16/pdf/full.pdf) |
| 4 | Hospital Irajá — entrada com letreiro da instituição | [Hospital Irajá](https://hospitaliraja.com.br/) |
| 5 | Hospital Geral Prontonil — fachada com ambulância | [Perfil institucional Prontonil](https://www.linkedin.com/company/prontonil) |
| 6 | Hospital Daniel Lipp — fachada vermelha, Duque de Caxias | [Hospital Daniel Lipp](https://www.daniellipp.com.br/) |
| 7 | Casa de Saúde e Maternidade Terezinha de Jesus — fachada, São João de Meriti | [Terezinha de Jesus](https://www.csmtj.com.br/frente-htj/) |
| 8 | Santa Martha — fachada, Niterói | [Hapvida](https://ri.hapvida.com.br/a-companhia/nossas-instalacoes/) |
| 9 | PROCEM — fachada com identificação da instituição, Ingá/Niterói | [PROCEM](https://clinicaprocem.com.br/) |
| 10 | Unidade Avançada Cidade Nova — vista externa, Rio de Janeiro | [NotreDame Intermédica](https://www2.gndi.com.br/pt/unidadeavancadacidadenova) |
| 11 | Total Kids — fachada da unidade Olaria | [Total Kids Olaria](https://www.clinicatotalkids.com.br/pediatra/rj/olaria/) |
| 12 | Riolabor — prédio com letreiro Riolabor na Taquara, fotografado pela Dimagem | [Dimagem: unidades](https://www.dimagem.net/unidades) |
| 13 | Dimagem — fachada da unidade Nova Iguaçu | [Dimagem: unidades](https://www.dimagem.net/unidades) |

## Identidade e limites

- “Santa Teresinha” foi confirmada diretamente como Terezinha de Jesus, em São João de Meriti, na revisão de 11/10. A fotografia e o `alt` usam a identidade institucional correta. A página original respondeu HTTP 406 na conferência atual; o arquivo já presente foi preservado.
- “Daniel Lipe” e “Santa Marta” foram normalizados para as grafias institucionais Daniel Lipp e Santa Martha. A grafia não cria uma nova instituição.
- A foto do São Matheus é histórica. Não se apresenta como fotografia recente da fachada.
- Total Kids e Riolabor foram solicitados sem unidade específica. Olaria é apenas a unidade fotografada da Total Kids. A foto do Riolabor foi publicada pela Dimagem, mostra seu letreiro no edifício da Taquara e não representa uma confirmação de cobertura dessa unidade nem de todas as filiais. Os dois itens não carregam produto, serviço ou rede presumidos.
- Dimagem foi identificada pelo site oficial `dimagem.net`, com unidades no Rio e Grande Rio. A foto selecionada é Nova Iguaçu. Dimagem não está na base pública de 710 registros consultada e permanece com `coverageVerified: false`, sem inclusão no guia médico.
- Irajá permanece com `coverageVerified: false`. A foto comprova identidade da instituição, sem afirmar disponibilidade por plano.
- Para os demais itens, o campo de cobertura registra correspondência com a base estática do guia, não validação por operadora em tempo real. As fotografias e a seleção editorial não alteram a base, os registros do guia nem as APIs.

## Apresentação e acessibilidade

Grade de três colunas em desktop e duas colunas até 800 px. Todas as 13 fotografias permanecem no fluxo da página; nenhuma depende de swipe, botão, foco ou carrossel para ser acessada. Lista semântica, título de seção associado por `aria-labelledby`, imagens com dimensões e `alt` não vazio. A seção contém somente o título solicitado como texto visível. A composição vale para home e `/landing`, que compartilham o componente.

As 22 regras de `.story-editorial` e seus valores foram comparadas com o Git original e preservadas, inclusive nos quatro breakpoints. ESLint no componente terminou sem erros, com o aviso já usado neste projeto sobre `<img>`; as cinco novas imagens foram otimizadas localmente e usam carregamento lazy.
