/** Received documents are evidence for an identified simulation, never an approved catalog. */
export type ProductId = "carioca_10_adesao" | "carioca_10_pme";
export type Coparticipation = "com" | "sem";
export const PRODUCTS = [
  { id: "carioca_10_adesao", label: "Carioca 10 Adesão", modality: "adesao" },
  { id: "carioca_10_pme", label: "Carioca 10 PME", modality: "empresarial" },
] as const;
export const COMMERCIAL_SOURCES = [
  {
    id: "D1",
    title: "Treinamento comercial Amélia + SIX",
    file: "TREINAMENTO COMERCIAL AMÉLIA + SIX (4).pdf",
    sha256: "b59b607539b124eb723081099a465fd908e92ec88a177bf009524b477aae62b7",
    version: "Outubro/2026; criação do arquivo em 20/10/2026",
    receivedAt: "2026-11-09T10:50:00-03:00",
    status: "received",
    approvedBy: null,
    validFrom: null,
    validUntil: null,
  },
  {
    id: "D2",
    title: "Tabela Comercial 2026",
    file: "TABELA IMPRESSÃO (4).pdf",
    sha256: "07bbc08aa0a13d7b99710a7c4ae753f1258735a699d830c6452a496da134290e",
    version: "2026; criação do arquivo em 29/10/2026",
    receivedAt: "2026-11-09T10:50:00-03:00",
    status: "received",
    approvedBy: null,
    validFrom: null,
    validUntil: null,
  },
  {
    id: "D3",
    title: "Campanha Carioca 10 Adesão",
    file: "IMG_1293.PNG",
    sha256: "5e67cf2dca59a368984ae0d7239a79dd7a0fa07fa030dab5cc091bb633baeb64",
    version: "Sem versão ou ano da promoção impressos",
    receivedAt: "2026-11-09T10:50:00-03:00",
    status: "received",
    approvedBy: null,
    validFrom: null,
    validUntil: null,
  },
  {
    id: "D4",
    title: "Campanha Carioca 10 PME",
    file: "IMG_1294.PNG",
    sha256: "cc0a24427b124632b4fc6dd15f9fb39548ef9628df3888710443542fdf8ecdf5",
    version: "Sem versão ou ano da promoção impressos",
    receivedAt: "2026-11-09T10:50:00-03:00",
    status: "received",
    approvedBy: null,
    validFrom: null,
    validUntil: null,
  },
  {
    id: "D5",
    title: "Tabela Comercial 2026 — Adesão e PME",
    file: "TABELA COMERCIAL 2026 (5).pdf",
    sha256: "9f0bc48c7aa317f8be120bf073674b9daeb0c4ac5e97e56a95b5d49d265c0c98",
    version: "2026; criação em 20/10/2026",
    receivedAt: "2026-11-09T11:05:00-03:00",
    status: "received",
    approvedBy: null,
    validFrom: null,
    validUntil: null,
  },
  {
    file: "aditivo atualizado para validação.pdf",
    sha256: "e9eefd7ab4e0d40ff35f689f4a99de06ac91d0efedcdab1f74dd2637b6c54c13",
    page: 1,
    pageCount: 1,
    status: "received",
    approvedBy: null,
    validFrom: null,
    validUntil: null,
    id: "D6",
    title: "Aditivo de carências recebido",
    version: "Arquivo para validação; sem versão datada impressa",
    receivedAt: "2026-11-09T11:03:00-03:00",
  },
  {
    id: "D7",
    file: "Aditivo de carências_AmeliaSaude - validado 05.10.26.xlsx",
    sha256: "6b734367d26859fb3d86a8ee9226754ad2c1af729c543e3c0655eda8764946e4",
    sheet: "Planilha1",
    range: "A1:H10",
    status: "received",
    approvedBy: null,
    validFrom: null,
    validUntil: null,
    title: "Planilha de carências recebida",
    version: "Nome do arquivo: validado 05.10.26; não comprova aprovação ou vigência",
    receivedAt: "2026-11-09T11:03:00-03:00",
  },
] as const;
export const RECEIVED_PRICE_TABLE = [
  {
    product: "carioca_10_adesao",
    coparticipation: "com",
    ans: "507.538/26-6",
    ageBand: "00-18",
    ageMin: 0,
    ageMax: 18,
    unitCents: 18146,
    sourceId: "D2",
  },
  {
    product: "carioca_10_adesao",
    coparticipation: "com",
    ans: "507.538/26-6",
    ageBand: "19-23",
    ageMin: 19,
    ageMax: 23,
    unitCents: 20879,
    sourceId: "D2",
  },
  {
    product: "carioca_10_adesao",
    coparticipation: "com",
    ans: "507.538/26-6",
    ageBand: "24-28",
    ageMin: 24,
    ageMax: 28,
    unitCents: 22968,
    sourceId: "D2",
  },
  {
    product: "carioca_10_adesao",
    coparticipation: "com",
    ans: "507.538/26-6",
    ageBand: "29-33",
    ageMin: 29,
    ageMax: 33,
    unitCents: 25034,
    sourceId: "D2",
  },
  {
    product: "carioca_10_adesao",
    coparticipation: "com",
    ans: "507.538/26-6",
    ageBand: "34-38",
    ageMin: 34,
    ageMax: 38,
    unitCents: 25408,
    sourceId: "D2",
  },
  {
    product: "carioca_10_adesao",
    coparticipation: "com",
    ans: "507.538/26-6",
    ageBand: "39-43",
    ageMin: 39,
    ageMax: 43,
    unitCents: 26680,
    sourceId: "D2",
  },
  {
    product: "carioca_10_adesao",
    coparticipation: "com",
    ans: "507.538/26-6",
    ageBand: "44-48",
    ageMin: 44,
    ageMax: 48,
    unitCents: 44512,
    sourceId: "D2",
  },
  {
    product: "carioca_10_adesao",
    coparticipation: "com",
    ans: "507.538/26-6",
    ageBand: "49-53",
    ageMin: 49,
    ageMax: 53,
    unitCents: 60103,
    sourceId: "D2",
  },
  {
    product: "carioca_10_adesao",
    coparticipation: "com",
    ans: "507.538/26-6",
    ageBand: "54-58",
    ageMin: 54,
    ageMax: 58,
    unitCents: 72125,
    sourceId: "D2",
  },
  {
    product: "carioca_10_adesao",
    coparticipation: "com",
    ans: "507.538/26-6",
    ageBand: "59 ou +",
    ageMin: 59,
    ageMax: null,
    unitCents: 108877,
    sourceId: "D2",
  },
  {
    product: "carioca_10_adesao",
    coparticipation: "sem",
    ans: "507.539/26-4",
    ageBand: "00-18",
    ageMin: 0,
    ageMax: 18,
    unitCents: 23243,
    sourceId: "D2",
  },
  {
    product: "carioca_10_adesao",
    coparticipation: "sem",
    ans: "507.539/26-4",
    ageBand: "19-23",
    ageMin: 19,
    ageMax: 23,
    unitCents: 26730,
    sourceId: "D2",
  },
  {
    product: "carioca_10_adesao",
    coparticipation: "sem",
    ans: "507.539/26-4",
    ageBand: "24-28",
    ageMin: 24,
    ageMax: 28,
    unitCents: 30738,
    sourceId: "D2",
  },
  {
    product: "carioca_10_adesao",
    coparticipation: "sem",
    ans: "507.539/26-4",
    ageBand: "29-33",
    ageMin: 29,
    ageMax: 33,
    unitCents: 30738,
    sourceId: "D2",
  },
  {
    product: "carioca_10_adesao",
    coparticipation: "sem",
    ans: "507.539/26-4",
    ageBand: "34-38",
    ageMin: 34,
    ageMax: 38,
    unitCents: 35349,
    sourceId: "D2",
  },
  {
    product: "carioca_10_adesao",
    coparticipation: "sem",
    ans: "507.539/26-4",
    ageBand: "39-43",
    ageMin: 39,
    ageMax: 43,
    unitCents: 39557,
    sourceId: "D2",
  },
  {
    product: "carioca_10_adesao",
    coparticipation: "sem",
    ans: "507.539/26-4",
    ageBand: "44-48",
    ageMin: 44,
    ageMax: 48,
    unitCents: 58437,
    sourceId: "D2",
  },
  {
    product: "carioca_10_adesao",
    coparticipation: "sem",
    ans: "507.539/26-4",
    ageBand: "49-53",
    ageMin: 49,
    ageMax: 53,
    unitCents: 73047,
    sourceId: "D2",
  },
  {
    product: "carioca_10_adesao",
    coparticipation: "sem",
    ans: "507.539/26-4",
    ageBand: "54-58",
    ageMin: 54,
    ageMax: 58,
    unitCents: 94961,
    sourceId: "D2",
  },
  {
    product: "carioca_10_adesao",
    coparticipation: "sem",
    ans: "507.539/26-4",
    ageBand: "59 ou +",
    ageMin: 59,
    ageMax: null,
    unitCents: 128197,
    sourceId: "D2",
  },
  {
    product: "carioca_10_pme",
    coparticipation: "com",
    ans: "508.991/26-3",
    ageBand: "00-18",
    ageMin: 0,
    ageMax: 18,
    unitCents: 12726,
    sourceId: "D5",
  },
  {
    product: "carioca_10_pme",
    coparticipation: "com",
    ans: "508.991/26-3",
    ageBand: "19-23",
    ageMin: 19,
    ageMax: 23,
    unitCents: 17155,
    sourceId: "D5",
  },
  {
    product: "carioca_10_pme",
    coparticipation: "com",
    ans: "508.991/26-3",
    ageBand: "24-28",
    ageMin: 24,
    ageMax: 28,
    unitCents: 19283,
    sourceId: "D5",
  },
  {
    product: "carioca_10_pme",
    coparticipation: "com",
    ans: "508.991/26-3",
    ageBand: "29-33",
    ageMin: 29,
    ageMax: 33,
    unitCents: 20479,
    sourceId: "D5",
  },
  {
    product: "carioca_10_pme",
    coparticipation: "com",
    ans: "508.991/26-3",
    ageBand: "34-38",
    ageMin: 34,
    ageMax: 38,
    unitCents: 21278,
    sourceId: "D5",
  },
  {
    product: "carioca_10_pme",
    coparticipation: "com",
    ans: "508.991/26-3",
    ageBand: "39-43",
    ageMin: 39,
    ageMax: 43,
    unitCents: 22342,
    sourceId: "D5",
  },
  {
    product: "carioca_10_pme",
    coparticipation: "com",
    ans: "508.991/26-3",
    ageBand: "44-48",
    ageMin: 44,
    ageMax: 48,
    unitCents: 30251,
    sourceId: "D5",
  },
  {
    product: "carioca_10_pme",
    coparticipation: "com",
    ans: "508.991/26-3",
    ageBand: "49-53",
    ageMin: 49,
    ageMax: 53,
    unitCents: 37300,
    sourceId: "D5",
  },
  {
    product: "carioca_10_pme",
    coparticipation: "com",
    ans: "508.991/26-3",
    ageBand: "54-58",
    ageMin: 54,
    ageMax: 58,
    unitCents: 45318,
    sourceId: "D5",
  },
  {
    product: "carioca_10_pme",
    coparticipation: "com",
    ans: "508.991/26-3",
    ageBand: "59 ou +",
    ageMin: 59,
    ageMax: null,
    unitCents: 71468,
    sourceId: "D5",
  },
] as const;
export const WAITING_PERIOD_ROWS = [
  {
    item: 1,
    event: "Consultas de urgência",
    procedures: "Atendimento de urgência e emergência",
    contractual: "24 horas",
    without_previous_plan: "24 horas",
    previous_plan_6_to_12_months: "24 horas",
    previous_plan_above_12_months: "24 horas",
    xlsx: {
      tasyCode: 8,
      event: "Consultas de urgência",
      procedures: "Atendimento de urgência e emergência",
      range: "A2:H2",
    },
  },
  {
    item: 2,
    event: "Consultas eletivas",
    procedures: "Todas as especialidades reconhecidas pelo CFM, exceto Psicologia.",
    contractual: "180 dias",
    without_previous_plan: "24 horas",
    previous_plan_6_to_12_months: "24 horas",
    previous_plan_above_12_months: "24 horas",
    xlsx: {
      tasyCode: 9,
      event: "Consultas eletivas",
      procedures:
        "Todas as especialidades reconhecidas pelo Conselho Federal de Medicina - CFM, exceto Psicologia.",
      range: "A3:H3",
    },
  },
  {
    item: 3,
    event: "Exames complementares 1",
    procedures:
      "Exames laboratoriais simples, radiografias, ultrassonografias, mamografias, radiologias contrastadas, exames de anatomia patológica e citopatologia, ecocardiogramas uni e bidimensional.",
    contractual: "180 dias",
    without_previous_plan: "24 horas",
    previous_plan_6_to_12_months: "24 horas",
    previous_plan_above_12_months: "24 horas",
    xlsx: {
      tasyCode: 10,
      event: "Exames complementares 1",
      procedures:
        "Exames laboratoriais simples, radiografias, ultrassonagrafias, mamografias, radiologias contrastadas, exames de anatomia patológica e citopatologia, ecocardiogramas uni e bidimensional",
      range: "A4:H4",
    },
  },
  {
    item: 4,
    event: "Exames complementares 2",
    procedures:
      "Endoscopias digestivas, ressonância magnética, USG com doppler, eletromiografias, provas ergométricas, exames de medicina nuclear, provas de função respiratória e todos os exames que não estejam listados nos exames complementares 1.",
    contractual: "180 dias",
    without_previous_plan: "180 dias",
    previous_plan_6_to_12_months: "60 dias",
    previous_plan_above_12_months: "24 horas",
    xlsx: {
      tasyCode: 11,
      event: "Exames complementares 2",
      procedures:
        "Endoscopias digestivas, ressonância magnética, USG com doppler, eletromiografias, provas ergométricas, exames de medicina nuclear, provas de função respiratória e todos os exames que não estejam listados nos exames complementares 1",
      range: "A5:H5",
    },
  },
  {
    item: 5,
    event: "Serviços auxiliares multiprofissionais",
    procedures:
      "Terapias em geral: fisioterapias motora ou respiratórias, psicologia, terapias multidisciplinares como fonoaudiólogo, sessões de terapia ocupacional, psicoterapia etc.",
    contractual: "180 dias",
    without_previous_plan: "180 dias",
    previous_plan_6_to_12_months: "180 dias",
    previous_plan_above_12_months: "180 dias",
    xlsx: {
      tasyCode: 12,
      event: "Serviços auxiliares multiprofissionais",
      procedures:
        "Terapias em geral como: fisioterapias motora ou respiratórias, psicologia, terapias multidisciplinares como fonoaudiológo, sessões de terapia ocupacional, psicoterapia, etc",
      range: "A6:H6",
    },
  },
  {
    item: 6,
    event: "Casos clínicos cirúrgicos",
    procedures:
      "Cirurgias do sistema cardiovascular, neurocirurgias (incluindo coluna), bucomaxilofacia, tratamentos cirúrgicos para obesidade, hemoterapia, hemodiálise, diálise peritoneal, implante coclear, quimioterapia, radioterapia e transplantes previstos no anexo da RN nº 465/2021.",
    contractual: "180 dias",
    without_previous_plan: "180 dias",
    previous_plan_6_to_12_months: "180 dias",
    previous_plan_above_12_months: "180 dias",
    xlsx: {
      tasyCode: 13,
      event: "Grupo de procedimentos 1",
      procedures:
        "Cirurgias do sistema cardiovascular, neurocirurgias (incluindo coluna), bucomaxilofacia, tratamentos cirúrgicos para obesidade, hemoterapia, hemodiálise, diálise peritoneal, implante coclear, quimioterapia, radioterapia e transplantes previstos no anexo da RN nº 465/2021.",
      range: "A7:H7",
    },
  },
  {
    item: 7,
    event: "Casos clínicos cirúrgicos não relacionados ao item anterior",
    procedures: "Internações clínicas e cirúrgicas.",
    contractual: "180 dias",
    without_previous_plan: "180 dias",
    previous_plan_6_to_12_months: "90 dias",
    previous_plan_above_12_months: "60 dias",
    xlsx: {
      tasyCode: 16,
      event: "Demais grupos procedimentos não relacionados ao item anterior",
      procedures: "Internações clínicas e cirúrgicas",
      range: "A8:H8",
    },
  },
  {
    item: 8,
    event: "Obstetrícia",
    procedures: "Parto a termo.",
    contractual: "300 dias",
    without_previous_plan: "300 dias",
    previous_plan_6_to_12_months: "300 dias",
    previous_plan_above_12_months: "300 dias",
    xlsx: {
      tasyCode: 17,
      event: "Obstetrícia",
      procedures: "Parto a termo",
      range: "A9:H9",
    },
  },
  {
    item: 9,
    event: "CPT",
    procedures: "Cobertura Parcial Temporária (relacionadas a doenças preexistentes).",
    contractual: "24 meses",
    without_previous_plan: "24 meses",
    previous_plan_6_to_12_months: "24 meses",
    previous_plan_above_12_months: "24 meses",
    xlsx: {
      tasyCode: 18,
      event: "CPT",
      procedures: "Cobertura Parcial Temporária (relacionadas a doenças preexistentes)",
      range: "A10:H10",
    },
  },
] as const;
export const WAITING_PERIOD_COLUMNS = [
  { key: "contractual", label: "Contratual" },
  { key: "without_previous_plan", label: "Sem plano anterior" },
  { key: "previous_plan_6_to_12_months", label: "Plano anterior de 6 a 12 meses" },
  { key: "previous_plan_above_12_months", label: "Plano anterior acima de 12 meses" },
] as const;
export const WAITING_PERIOD_NOTICE =
  "Referência documental recebida (D6 e D7): prazos coincidem nos dois arquivos. Produto, validade, critérios de aproveitamento e aprovação ainda precisam ser confirmados. Menos de 6 meses de plano anterior não tem regra fornecida. Não confirma redução ou cobertura para uma pessoa específica.";
export const DUE_DAYS = [1, 5, 10, 15, 20] as const;
export const MUNICIPALITIES = [
  "Rio de Janeiro",
  "Belford Roxo",
  "Duque de Caxias",
  "Mesquita",
  "Nilópolis",
  "Niterói",
  "Nova Iguaçu",
  "São Gonçalo",
  "São João de Meriti",
  "Magé",
] as const;
export const NETWORK_HIGHLIGHTS = [
  {
    region: "Rio de Janeiro e Niterói",
    names: [
      "Hospital Quali Ipanema",
      "Policlínica de Botafogo",
      "Hospital NotreCare",
      "Casa de Saúde e Maternidade Santa Martha",
      "Hospital Irajá",
      "Hospital de Clínicas São Matheus",
      "Hospital Intermédica Jacarepágua",
      "PROCEM Centro de Especialidades Médicas",
      "Casa de Saúde Saint Roman",
      "Clínica Total Kids",
      "Clínica São Carlos",
      "Unidade Avançada Cidade Nova",
    ],
  },
  {
    region: "Baixada Fluminense",
    names: [
      "Hospital do Coração Duque de Caxias",
      "Hospital Daniel Lipp",
      "Casa de Saúde e Maternidade Terezinha de Jesus",
      "UGP Hospital Geral Prontonil",
    ],
  },
  { region: "Laboratórios", names: ["Eliel Figueiredo", "RioLabor", "Dimagem"] },
] as const;
export const MEDICAL_INTERVIEW =
  "O treinamento exige entrevista médica em 100% das vendas, por videoconferência gravada. Ela precisa ser concluída para efetivar a vigência. Se não terminar no prazo, a vigência passa à próxima data disponível no mesmo mês; se não terminar no mês da contratação, a proposta deve ser refeita. Agendamento, pré-agendamento ou ordem de chegada dependem do fluxo oficial; o link e os cortes não foram fornecidos.";
export const PROMOTION_NOTICE =
  "As campanhas anunciam 50% na primeira mensalidade bancária de Adesão e PME, de 20/10 a 20/11, sem ano impresso. Ano, elegibilidade e base da cobrança aguardam confirmação: desconto não aplicado nesta simulação.";
export const TOPICS = [
  {
    id: "coverage",
    title: "Cobertura",
    summary: "Ambulatorial + hospitalar com obstetrícia",
    answer:
      "O Carioca 10 é apresentado no treinamento com segmentação ambulatorial + hospitalar com obstetrícia. O material também apresenta pronto atendimento DIGITAL 24h e telemedicina com especialidades agendadas. Isso não confirma todo procedimento nem pronto-socorro hospitalar 24h em toda a rede; condições gerais e exclusões precisam ser conferidas por produto.",
    source: "Treinamento comercial Amélia + SIX, outubro/2026, páginas 3, 5 e 7 (D1)",
    sourceIds: ["D1"],
    status: "received",
  },
  {
    id: "accommodation",
    title: "Acomodação",
    summary: "Quarto coletivo",
    answer:
      "Os materiais recebidos apresentam acomodação em quarto coletivo para os produtos Carioca 10. A tabela de Adesão distingue a opção com coparticipação em terapias da opção sem coparticipação. A escolha do produto deve preservar essa distinção.",
    source: "Treinamento p7 (D1); Tabela Comercial 2026 p1 (D2)",
    sourceIds: ["D1", "D2"],
    status: "received",
  },
  {
    id: "area",
    title: "Abrangência geográfica",
    summary: "Grupo de dez municípios na tabela",
    answer: `A tabela de Adesão apresenta grupo de municípios: ${MUNICIPALITIES.join(", ")}. O treinamento fala em mais de dez municípios sem listar outros. Não ampliamos a lista nem confirmamos atendimento fora dela; a rede e a abrangência precisam corresponder ao produto.`,
    source: "Tabela Comercial 2026 p1 (D2); treinamento p3 e p7 (D1)",
    sourceIds: ["D2", "D1"],
    status: "received",
  },
  {
    id: "network",
    title: "Rede de atendimento",
    summary: "Hospitais e laboratórios destacados",
    answer:
      "Entre os destaques recebidos estão Hospital Quali Ipanema, Policlínica de Botafogo, Hospital Daniel Lipp e Casa de Saúde e Maternidade Santa Martha; laboratórios Eliel Figueiredo, RioLabor e Dimagem. Destaques não garantem qualquer procedimento em todos os produtos. Consulte a rede completa e o produto em https://www.ameliasaude.com.br/rede-credenciada.",
    source: "Tabela Comercial 2026 p2 (D2); treinamento p4 (D1)",
    sourceIds: ["D2", "D1"],
    status: "received",
  },
  {
    id: "waiting",
    title: "Carências",
    summary: "Matriz de carências recebida; aplicação a confirmar",
    answer:
      "Recebemos matriz e planilha de carências com 9 grupos e colunas contratual, sem plano anterior, plano de 6–12 meses e acima de 12 meses. Exemplos documentais: urgência/emergência 24h em todas as colunas; parto a termo 300 dias; terapias 180 dias. Exames e internações têm diferenças conforme grupo e tempo do plano anterior. A aplicação depende do produto, validade e critérios de aproveitamento ainda não fornecidos; não confirmo redução individual. Podemos consultar a referência completa e continuar por aqui.",
    source:
      "Aditivo recebido (D6), p1; planilha recebida (D7), Planilha1 A1:H10; 36/36 prazos iguais",
    sourceIds: ["D6", "D7"],
    status: "received",
  },
  {
    id: "due",
    title: "Vencimentos",
    summary: "Dias 01, 05, 10, 15 e 20",
    answer:
      "A tabela apresenta os dias 01, 05, 10, 15 e 20, cada vigência acompanhada do vencimento no mesmo dia do mês. Posso guardar sua preferência entre essas opções. A escolha não confirma contrato, primeira cobrança ou ativação; os cortes e as condições de implantação não foram detalhados.",
    source: "Tabela Comercial 2026 p1 (D2)",
    sourceIds: ["D2"],
    status: "received",
  },
  {
    id: "start",
    title: "Início do contrato",
    summary: "Vigência condicionada à entrevista médica",
    answer: `Os dias apresentados para vigência são 01, 05, 10, 15 e 20. A data desejada não ativa a cobertura. ${MEDICAL_INTERVIEW}`,
    source: "Tabela Comercial 2026 p1 (D2); treinamento p10 (D1)",
    sourceIds: ["D2", "D1"],
    status: "received",
  },
] as const;

export type ReceivedPriceInput = {
  product?: ProductId;
  coparticipation?: Coparticipation;
  modality?: "adesao" | "empresarial" | "indefinido";
  city?: string;
  lives?: number;
  ages?: number[];
};
export type ReceivedPriceLine = {
  ageBand: string;
  people: number;
  unitCents: number;
  totalCents: number;
};
export type ReceivedPriceResult = {
  kind: "document_simulation";
  status: "available" | "needs_details" | "pending";
  text: string;
  sourceId: "D2" | "D5";
  approved: false;
  discountApplied: false;
  missing?: (keyof ReceivedPriceInput)[];
  lines?: ReceivedPriceLine[];
  totalCents?: number;
};
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
export const formatReceivedPrice = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

export function simulateReceivedPrices(input: ReceivedPriceInput): ReceivedPriceResult {
  const result = (
    status: ReceivedPriceResult["status"],
    text: string,
    extra: Partial<ReceivedPriceResult> = {},
  ): ReceivedPriceResult => ({
    kind: "document_simulation",
    status,
    text,
    sourceId: input.product === "carioca_10_pme" ? "D5" : "D2",
    approved: false,
    discountApplied: false,
    ...extra,
  });
  if (!input.product)
    return result(
      "needs_details",
      "Qual produto deseja consultar? Interesse pessoal ou empresarial não define sozinho a modalidade contratual.",
      { missing: ["product"] },
    );
  if (!PRODUCTS.some((product) => product.id === input.product))
    return result(
      "pending",
      "Produto não identificado nos documentos recebidos. Você pode corrigir a escolha e continuar por aqui.",
    );
  const expectedModality = input.product === "carioca_10_adesao" ? "adesao" : "empresarial";
  if (input.modality && input.modality !== "indefinido" && input.modality !== expectedModality)
    return result(
      "pending",
      "Produto e modalidade estão divergentes. Corrija a escolha antes de simular; nenhum valor foi calculado.",
    );
  if (!input.coparticipation)
    return result(
      "needs_details",
      input.product === "carioca_10_pme"
        ? "A tabela PME recebida tem somente a opção com coparticipação em terapias. Deseja simular essa opção?"
        : "Para o Carioca 10 Adesão, deseja comparar a opção com coparticipação em terapias ou a opção sem coparticipação?",
      { missing: ["coparticipation"] },
    );
  if (!["com", "sem"].includes(input.coparticipation))
    return result(
      "pending",
      "Opção de coparticipação não identificada na tabela recebida. Selecione uma das duas opções disponíveis.",
    );
  if (input.product === "carioca_10_pme" && input.coparticipation === "sem")
    return result(
      "pending",
      "Não recebemos preço PME sem coparticipação. A tabela empresarial recebida apresenta somente coparticipação em terapias. Não utilizo a tabela Adesão sem coparticipação para PME. Você pode escolher a opção documentada ou registrar seu pedido e continuar por aqui.",
    );
  const missing: (keyof ReceivedPriceInput)[] = [];
  if (!input.city?.trim()) missing.push("city");
  if (!Number.isInteger(input.lives) || !input.lives || input.lives < 1 || input.lives > 1000)
    missing.push("lives");
  if (
    !input.ages?.length ||
    input.ages.length !== input.lives ||
    input.ages.some((age) => !Number.isInteger(age) || age < 0 || age > 120)
  )
    missing.push("ages");
  if (missing.length)
    return result(
      "needs_details",
      "Para simular, confira município, quantidade de pessoas e uma idade válida por pessoa.",
      { missing },
    );
  if (input.product === "carioca_10_pme" && (input.lives! < 2 || input.lives! > 29))
    return result(
      "pending",
      "O treinamento descreve PME de 2 a 29 vidas. Para essa quantidade, a condição comercial precisa ser esclarecida; não extrapolo a tabela. Você pode corrigir a quantidade ou registrar seu interesse sem transferência obrigatória.",
    );
  if (!MUNICIPALITIES.some((city) => normalize(city) === normalize(input.city!)))
    return result(
      "pending",
      "O município informado não consta nos dez municípios da tabela recebida. A disponibilidade precisa ser confirmada; não calculo um preço que possa sugerir cobertura nessa localidade. Você pode corrigir o município ou registrar seu interesse e continuar automaticamente.",
    );
  if (input.ages!.some((age) => age < 12 || age > 69) || !input.ages!.some((age) => age >= 18))
    return result(
      "pending",
      "O treinamento apresenta titular de 18 a 69 anos e dependentes de 12 a 69 anos. A tabela tem faixas mais amplas, mas isso não confirma elegibilidade fora dessas regras. Como há idades a esclarecer, não calculo o total agora. Podemos corrigir os dados ou registrar o pedido de proposta sem transferência obrigatória.",
    );
  const rows = RECEIVED_PRICE_TABLE.filter(
    (row) => row.product === input.product && row.coparticipation === input.coparticipation,
  );
  const lines: ReceivedPriceLine[] = [];
  for (const row of rows) {
    const people = input.ages!.filter(
      (age) => age >= row.ageMin && (row.ageMax === null || age <= row.ageMax),
    ).length;
    if (people)
      lines.push({
        ageBand: row.ageBand,
        people,
        unitCents: row.unitCents,
        totalCents: people * row.unitCents,
      });
  }
  const totalCents = lines.reduce((total, line) => total + line.totalCents, 0);
  const copart =
    input.coparticipation === "com" ? "com coparticipação em terapias" : "sem coparticipação";
  const text = [
    `Simulação documental — ${input.product === "carioca_10_pme" ? "Carioca 10 PME" : "Carioca 10 Adesão"} ${copart}.`,
    ...lines.map(
      (line) =>
        `${line.people} pessoa(s), faixa ${line.ageBand}: ${formatReceivedPrice(line.unitCents)} por pessoa = ${formatReceivedPrice(line.totalCents)}.`,
    ),
    `Soma dos preços impressos: ${formatReceivedPrice(totalCents)}. A periodicidade não está especificada na peça; este valor não é uma mensalidade ou cotação aprovada.`,
    input.product === "carioca_10_pme"
      ? "Fonte: Tabela Comercial 2026 — Adesão e PME, página 1 (D5), recebida em 09/11/2026, produto PME ANS 508.991/26-3 com coparticipação em terapias. Vigência comercial, elegibilidade e vínculo aguardam confirmação. Não confirma cobertura, contrato ou ativação."
      : "Fonte: Tabela Comercial 2026, página 1 (D2), recebida em 09/11/2026. Vigência comercial, elegibilidade, vínculo e correspondência dos registros ANS aguardam confirmação: treinamento/D5 507.583/26-6; D2 507.538/26-6 (terapias) e 507.539/26-4 (sem). Não confirma cobertura, contrato ou ativação.",
    PROMOTION_NOTICE,
    input.coparticipation === "com"
      ? "A tabela também informa valores fixos de R$ 150,00 para terapias especiais e R$ 42,47 para demais terapias; a unidade de cobrança e os limites não estão detalhados. Esses valores não foram somados ao total."
      : "Nenhuma coparticipação foi acrescentada à opção sem coparticipação.",
    "Você pode corrigir os dados, consultar condições vigentes ou registrar seu pedido de proposta e continuar por aqui.",
  ].join("\n\n");
  return result("available", text, { lines, totalCents });
}

/** Context for explanations only. Arithmetic stays in simulateReceivedPrices; no approval is implied. */
export function receivedMaterialsContext(): string {
  return [
    "MATERIAIS RECEBIDOS, NÃO CATÁLOGO APROVADO: use os fatos abaixo para explicar o produto, sempre conservando fonte e limites. Não invente validade, aprovador, preço ausente da variante ou regra de aproveitamento de carência. Não calcule preços pelo modelo: a simulação determinística do roteiro é a responsável pelos valores de Adesão e PME.",
    ...COMMERCIAL_SOURCES.map(
      (source) =>
        `${source.id}: ${source.title}; versão ${source.version}; arquivo ${source.file}; SHA256 ${source.sha256}; recebido em ${source.receivedAt}; aprovação e vigência não confirmadas.`,
    ),
    ...TOPICS.map((topic) => `${topic.title}: ${topic.answer} Fonte: ${topic.source}.`),
    "Elegibilidade descrita no treinamento p8–9: titular 18–69 e dependentes 12–69. Adesão: profissional liberal/servidor público, vínculo/documentos e lista de profissões a conferir. PME: 2–29 vidas, vínculo empregatício/estatutário, documentos contrato social ou MEI, CNPJ, FGTS/endereço. Essas regras são documentais, não decisão automática de elegibilidade; exceções e listas pendentes.",
    "Conflito ANS: treinamento Adesão 507.583/26-6; tabela 507.538/26-6 (terapias) e 507.539/26-4 (sem). Empresarial 508.991/26-3. Não autocorrija nem misture os preços das modalidades.",
    WAITING_PERIOD_NOTICE,
    ...WAITING_PERIOD_ROWS.map(
      (row) =>
        row.event +
        ": " +
        row.procedures +
        " Prazos da referência: " +
        WAITING_PERIOD_COLUMNS.map((column) => column.label + "=" + row[column.key]).join("; ") +
        ". Fonte D6/D7, item " +
        row.item +
        ".",
    ),
    PROMOTION_NOTICE,
    "O pedido de proposta pode ser registrado automaticamente sem transferência obrigatória. Não equivale a proposta formal, contrato ou vigência. Não sugira humano como resposta padrão à falta de documento; ofereça continuidade, correção e registro do interesse. Consulta ao catálogo aprovado continua independente dos materiais recebidos.",
  ].join("\n\n");
}

export type PreviousPlanDuration =
  "under_6_months" | "6_to_12_months" | "above_12_months" | "unknown";
export function waitingPeriodReference(
  previousPlan?: "yes" | "no" | "unknown",
  duration?: PreviousPlanDuration,
): string {
  const selected =
    previousPlan === "no"
      ? "without_previous_plan"
      : previousPlan === "yes" && duration === "6_to_12_months"
        ? "previous_plan_6_to_12_months"
        : previousPlan === "yes" && duration === "above_12_months"
          ? "previous_plan_above_12_months"
          : undefined;
  const intro =
    previousPlan === "yes" && duration === "under_6_months"
      ? "Você informou menos de 6 meses de plano anterior. Os documentos não fornecem regra de aproveitamento para essa situação; não aplico outra coluna por suposição."
      : selected
        ? `Coluna de referência correspondente à informação: ${WAITING_PERIOD_COLUMNS.find((column) => column.key === selected)?.label}. O enquadramento comercial ainda não está confirmado.`
        : "Ainda não há informação suficiente para selecionar uma coluna promocional; a matriz abaixo mostra as referências recebidas para comparação, sem aplicação automática.";
  return [
    intro,
    ...WAITING_PERIOD_ROWS.map(
      (row) =>
        `${row.item}. ${row.event} — ${row.procedures} ${selected ? row[selected] : WAITING_PERIOD_COLUMNS.map((column) => `${column.label}: ${row[column.key]}`).join("; ")}.`,
    ),
    WAITING_PERIOD_NOTICE,
  ].join("\n\n");
}
