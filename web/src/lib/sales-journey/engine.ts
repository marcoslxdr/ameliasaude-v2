/** One deterministic sales script for the bot and approval simulator. No commercial prices live here. */
export const JOURNEY_VERSION = "amelia-commercial-2026-11-09.2";
export type JourneyQualification = {
  interest?: "personal" | "business";
  cnpj?: string;
  city?: string;
  lives?: number;
  ages?: number[];
  modality?: "empresarial" | "adesao" | "indefinido";
  previous_plan?: "yes" | "no" | "unknown";
  preferred_due_day?: number;
  desired_start_date?: string;
};
export type JourneyOption = { label: string; value: string };
export const MUNICIPALITIES = [
  "Rio de Janeiro",
  "Nova Iguaçu",
  "Nilópolis",
  "Belford Roxo",
  "São Gonçalo",
  "Niterói",
  "São João de Meriti",
  "Duque de Caxias",
  "Magé",
  "Mesquita",
];
export const TOPICS = [
  {
    id: "coverage",
    title: "Cobertura",
    summary: "Consultas, exames, internações e emergência",
    answer:
      "Vamos conferir consultas, exames, internações e emergência 24h no produto escolhido. A cobertura e suas condições dependem do contrato aprovado; não há confirmação de cobertura individual neste modelo.",
    source: "Condições gerais do produto — aprovação pendente",
    status: "pending",
  },
  {
    id: "accommodation",
    title: "Acomodação",
    summary: "Quarto coletivo",
    answer:
      "A proposta apresentada para esta jornada considera quarto coletivo. A acomodação precisa ser confirmada nas condições oficiais do produto antes da contratação.",
    source: "Orientação de Marcelo em 09/11/2026; confirmação do produto pendente",
    status: "pending",
  },
  {
    id: "area",
    title: "Abrangência geográfica",
    summary: "Abrangência regional e municípios",
    answer: `A referência de abrangência regional reúne: ${MUNICIPALITIES.join(", ")}. A elegibilidade e o atendimento dependem do produto; a lista ainda precisa de confirmação comercial. Fora dessa referência, a disponibilidade fica pendente de uma fonte oficial; você pode continuar a consulta por aqui.`,
    source: "Materiais existentes da Amélia — confirmação de vigência pendente",
    status: "pending",
  },
  {
    id: "network",
    title: "Rede de atendimento",
    summary: "Hospitais e laboratórios do produto",
    answer:
      "A rede depende do produto e do município. Consulte a rede completa em https://www.ameliasaude.com.br/rede-credenciada e confira o produto selecionado. Os hospitais e laboratórios de destaque serão apresentados após confirmação da rede aplicável.",
    source: "Rede Amélia por produto; destaques pendentes de aprovação",
    status: "pending",
  },
  {
    id: "waiting",
    title: "Carências",
    summary: "Plano anterior e redução promocional",
    answer:
      "As condições de redução de carência podem variar para quem possui ou não plano anterior. A tabela e o aditivo promocional vigente ainda precisam ser validados; não posso confirmar prazos ou redução sem esses documentos.",
    source: "Tabela de carências e aditivo vigente — pendentes",
    status: "pending",
  },
  {
    id: "due",
    title: "Vencimentos",
    summary: "Preferência de vencimento",
    answer:
      "Posso registrar seu dia de vencimento preferido. As datas disponíveis dependem da tabela oficial aprovada; a preferência não representa alteração ou aprovação contratual.",
    source: "Datas comerciais disponíveis — pendentes",
    status: "pending",
  },
  {
    id: "start",
    title: "Início do contrato",
    summary: "Data desejada e vigência confirmada",
    answer:
      "Posso registrar quando você gostaria de iniciar. A vigência depende da análise e das condições oficiais da Amélia; uma data desejada não confirma ativação ou cobertura.",
    source: "Regras de início de vigência — pendentes",
    status: "pending",
  },
] as const;
export type TopicId = (typeof TOPICS)[number]["id"];
export type JourneyStep =
  | "interest"
  | "cnpj"
  | "city"
  | "lives"
  | "ages"
  | "previous_plan"
  | "topics"
  | "due_preference"
  | "start_preference"
  | "summary"
  | "proposal_requested"
  | "closed";
export type JourneyState = {
  version: string;
  step: JourneyStep;
  qualification: JourneyQualification;
  topicIndex: number;
  visited: TopicId[];
  editing?: boolean;
  editMenu?: boolean;
  resumeStep?: JourneyStep;
  menu?: boolean;
  inspecting?: TopicId;
  /** A request of interest, never an issued proposal, policy or completed sale. */
  proposalRequest?: {
    status: "requested";
    qualification: JourneyQualification;
    requestedOn?: string;
  };
};
export type JourneyResult = {
  state: JourneyState;
  text: string;
  options: JourneyOption[];
  effect?: "question" | "quote" | "proposal" | "handoff" | "close";
};
export type JourneyContext = { today?: string; topicAnswers?: Partial<Record<TopicId, string>> };
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
const option = (label: string, value: string): JourneyOption => ({
  label,
  value: `sales:${value}`,
});
export function isValidCnpj(input: string): boolean {
  if (/[^\d./\s-]/.test(input)) return false;
  const digits = input.replace(/\D/g, "");
  if (!/^\d{14}$/.test(digits) || /^(\d)\1+$/.test(digits)) return false;
  const check = (length: number) => {
    const weights =
      length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = weights.reduce((total, weight, index) => total + Number(digits[index]) * weight, 0);
    const rem = sum % 11;
    return Number(digits[length]) === (rem < 2 ? 0 : 11 - rem);
  };
  return check(12) && check(13);
}
export function isValidDesiredStartDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function isAdministrativeIntent(input: string): boolean {
  return /\b(segunda via|2a via|boleto|reembolso|cancelamento|cancelar meu plano|autorizacao de exame|carteirinha|carteira do plano|resultado de exame)\b/.test(
    normalize(input),
  );
}
export function createJourney(qualification: JourneyQualification = {}): JourneyState {
  return {
    version: JOURNEY_VERSION,
    step: firstMissing(qualification),
    qualification: { ...qualification },
    topicIndex: 0,
    visited: [],
  };
}
const firstMissing = (q: JourneyQualification): JourneyStep =>
  !q.interest
    ? "interest"
    : q.interest === "business" && !q.cnpj
      ? "cnpj"
      : !q.city
        ? "city"
        : !q.lives
          ? "lives"
          : !q.ages || q.ages.length !== q.lives
            ? "ages"
            : !q.previous_plan
              ? "previous_plan"
              : "topics";
export function journeySummary(q: JourneyQualification): string {
  return [
    q.interest === "business"
      ? "Interesse: empresa"
      : q.interest === "personal"
        ? "Interesse: você/família"
        : "Interesse: a informar",
    q.cnpj && `CNPJ: ${q.cnpj}`,
    q.city && `Município: ${q.city}`,
    q.lives && `Pessoas: ${q.lives}`,
    q.ages && `Idades: ${q.ages.join(", ")}`,
    q.modality && `Modalidade informada: ${q.modality} (sujeita à elegibilidade)`,
    q.previous_plan &&
      `Plano anterior: ${{ yes: "sim", no: "não", unknown: "a confirmar" }[q.previous_plan]}`,
    q.preferred_due_day && `Vencimento desejado: dia ${q.preferred_due_day} (a confirmar)`,
    q.desired_start_date && `Início desejado: ${q.desired_start_date} (a confirmar)`,
  ]
    .filter(Boolean)
    .join("\n");
}
export function journeyView(state: JourneyState, context: JourneyContext = {}) {
  const controls = [
    option("Menu de assuntos", "menu"),
    option("Corrigir dados", "edit"),
    option("Falar com vendedor", "handoff"),
  ];
  let text = "";
  let options: JourneyOption[] = [];
  if (state.editMenu) {
    text = "Qual informação deseja corrigir?";
    options = [
      option("Interesse", "edit:interest"),
      option("Município", "edit:city"),
      option("Pessoas", "edit:lives"),
      option("Idades", "edit:ages"),
      ...(state.qualification.interest === "business" ? [option("CNPJ", "edit:cnpj")] : []),
      option("Plano anterior", "edit:previous_plan"),
      option("Vencimento", "edit:due_preference"),
      option("Data de início", "edit:start_preference"),
      option("Retomar", "resume"),
    ];
  } else if (state.menu) {
    text = "Qual assunto você quer consultar? Você pode retomar de onde parou.";
    options = [
      ...TOPICS.map((t) => option(t.title, `topic:${t.id}`)),
      option("Retomar jornada", "resume"),
      ...controls.slice(1),
    ];
  } else if (state.inspecting || state.step === "topics") {
    const topic =
      TOPICS.find((t) => t.id === state.inspecting) ?? TOPICS[state.topicIndex] ?? TOPICS[0];
    text = `${topic.title}\n${context.topicAnswers?.[topic.id] ?? topic.answer}`;
    if (
      topic.id === "area" &&
      state.qualification.city &&
      !MUNICIPALITIES.some((city) => normalize(city) === normalize(state.qualification.city!))
    ) {
      text += `\n\nO município informado, ${state.qualification.city}, não consta nessa referência regional. A disponibilidade do produto e do atendimento nessa localidade continua pendente de uma fonte oficial. Você pode seguir a consulta e registrar seu interesse sem transferência automática.`;
    }
    options = [
      option(
        state.inspecting ? "Retomar jornada" : "Continuar",
        state.inspecting ? "resume" : "next",
      ),
      ...controls,
    ];
  } else {
    switch (state.step) {
      case "interest":
        text = "O plano é para você/sua família ou para sua empresa?";
        options = [
          option("Para mim / minha família", "interest:personal"),
          option("Para minha empresa", "interest:business"),
        ];
        break;
      case "cnpj":
        text = "Qual é o CNPJ da empresa? Informe os 14 números.";
        break;
      case "city":
        text = "Em qual município você precisa do plano?";
        break;
      case "lives":
        text = "Quantas pessoas entrarão no plano?";
        break;
      case "ages":
        text = `Quais são as idades das ${state.qualification.lives ?? ""} pessoas? Separe por vírgulas, por exemplo: 32, 29, 8.`;
        break;
      case "previous_plan":
        text =
          "As pessoas já têm plano de saúde? Isso ajuda a esclarecer as condições de carência.";
        options = [
          option("Sim", "previous:yes"),
          option("Não", "previous:no"),
          option("Preciso confirmar", "previous:unknown"),
        ];
        break;
      case "due_preference":
        text =
          "Qual dia do mês você prefere para o vencimento? Registraremos como preferência, sujeita às datas disponíveis.";
        options = [option("Definir depois", "skip")];
        break;
      case "start_preference":
        text =
          "Quando gostaria de iniciar? Informe DD/MM/AAAA. A data é apenas desejada; a vigência depende das condições oficiais.";
        options = [option("Definir depois", "skip")];
        break;
      case "summary":
        text = `${journeySummary(state.qualification)}\n\nAssuntos apresentados: ${state.visited.map((id) => TOPICS.find((t) => t.id === id)?.title).join(", ") || "nenhum"}.\nCondições pendentes de validação serão confirmadas antes da proposta. Como deseja continuar?`;
        options = [
          option("Consultar cotação", "quote"),
          option("Solicitar proposta", "proposal"),
          option("Encerrar", "close"),
        ];
        break;
      case "proposal_requested": {
        const requested = state.proposalRequest?.qualification;
        const changed = requested && !sameQualification(requested, state.qualification);
        text = changed
          ? `Você corrigiu os dados depois de solicitar a proposta. Confira as informações atuais e confirme a atualização do pedido:\n${journeySummary(state.qualification)}\n\nO pedido anterior permanece registrado até sua confirmação. Nenhuma contratação ou cobertura foi confirmada.`
          : `Seu pedido de proposta está registrado para estes dados:\n${journeySummary(requested ?? state.qualification)}\n\nUma proposta formal depende de condições comerciais aprovadas e da etapa de contratação. Este pedido não é um contrato, não confirma preço, elegibilidade, início de vigência ou cobertura. As informações ainda não aprovadas continuam pendentes. Você pode consultar a cotação, tirar dúvidas ou corrigir dados aqui; o atendimento continua automático.`;
        options = [
          ...(changed ? [option("Confirmar atualização do pedido", "proposal")] : []),
          option("Consultar cotação", "quote"),
          option("Encerrar", "close"),
        ];
        break;
      }
      case "closed":
        text = "Conversa encerrada. Obrigado pelo interesse na Amélia Saúde.";
        break;
    }
    if (state.step !== "closed") options.push(...controls);
  }
  return {
    version: state.version,
    step: state.step,
    qualification: state.qualification,
    text,
    options,
  };
}
const qualificationKeys: (keyof JourneyQualification)[] = [
  "interest",
  "cnpj",
  "city",
  "lives",
  "ages",
  "modality",
  "previous_plan",
  "preferred_due_day",
  "desired_start_date",
];
function sameQualification(a: JourneyQualification, b: JourneyQualification): boolean {
  return qualificationKeys.every((key) => JSON.stringify(a[key]) === JSON.stringify(b[key]));
}

export function advanceJourney(
  original: JourneyState,
  input: string,
  context: JourneyContext = {},
): JourneyResult {
  const state: JourneyState = {
    ...original,
    qualification: { ...original.qualification },
    visited: [...original.visited],
  };
  const done = (text?: string, effect?: JourneyResult["effect"]): JourneyResult => {
    const view = journeyView(state, context);
    return { state, text: text ?? view.text, options: view.options, ...(effect ? { effect } : {}) };
  };
  const raw = input.trim();
  const value = normalize(raw);
  if (
    value === "sales:handoff" ||
    /^(vendedor|atendente|falar com (um )?(vendedor|atendente|humano))$/.test(value)
  )
    return done(
      `Vou encaminhar seu interesse à equipe comercial.\n${journeySummary(state.qualification)}`,
      "handoff",
    );
  if (isAdministrativeIntent(raw))
    return done(
      "Essa solicitação é de atendimento ao beneficiário. Acesse os canais de atendimento em https://www.ameliasaude.com.br/ para suporte sobre seu plano. Posso retomar sua consulta comercial quando desejar.",
    );
  if (value === "sales:close") {
    state.step = "closed";
    delete state.editMenu;
    delete state.inspecting;
    delete state.menu;
    return done(undefined, "close");
  }
  if (state.step === "closed") return done();
  if (value === "sales:menu" || value === "menu") {
    state.menu = true;
    delete state.inspecting;
    return done();
  }
  if (value.startsWith("sales:topic:")) {
    const id = value.slice(12) as TopicId;
    if (TOPICS.some((t) => t.id === id)) {
      delete state.menu;
      state.inspecting = id;
      if (!state.visited.includes(id)) state.visited.push(id);
      return done();
    }
    return done("Escolha um dos assuntos do menu.");
  }
  if (value === "sales:resume") {
    delete state.menu;
    delete state.inspecting;
    delete state.editMenu;
    return done();
  }
  if (value === "sales:edit") {
    state.editMenu = true;
    return done();
  }
  if (value.startsWith("sales:edit:")) {
    const field = value.slice(11) as JourneyStep;
    if (
      [
        "interest",
        "city",
        "lives",
        "ages",
        "cnpj",
        "previous_plan",
        "due_preference",
        "start_preference",
      ].includes(field) &&
      (field !== "cnpj" || state.qualification.interest === "business")
    ) {
      state.resumeStep = state.resumeStep ?? state.step;
      state.step = field === "ages" && !state.qualification.lives ? "lives" : field;
      state.editing = true;
      delete state.editMenu;
      delete state.menu;
      delete state.inspecting;
      return done();
    }
    return done("Escolha um campo válido para corrigir.");
  }
  if (
    value === "sales:proposal" ||
    /^(quero (a |uma )?proposta|quero solicitar (a |uma )?proposta|solicitar proposta|quero contratar|quero contratar (o |um )?plano)[.!]?$/.test(
      value,
    )
  ) {
    const missing = firstMissing(state.qualification);
    if (missing !== "topics") {
      state.step = missing;
      delete state.menu;
      delete state.inspecting;
      delete state.editMenu;
      return done();
    }
    if (
      !state.proposalRequest ||
      !sameQualification(state.proposalRequest.qualification, state.qualification)
    ) {
      state.proposalRequest = {
        status: "requested",
        qualification: {
          ...state.qualification,
          ...(state.qualification.ages ? { ages: [...state.qualification.ages] } : {}),
        },
        ...(context.today ? { requestedOn: context.today } : {}),
      };
    }
    state.step = "proposal_requested";
    delete state.menu;
    delete state.inspecting;
    delete state.editMenu;
    delete state.editing;
    delete state.resumeStep;
    return done(undefined, "proposal");
  }
  if (
    /^(como (posso |faco para )?contratar|como (peco|solicito) (a |uma )?proposta)\??$/.test(value)
  ) {
    return {
      state,
      text: "Você pode conferir os dados e solicitar a proposta aqui no chat. O pedido será registrado sem transferir o atendimento. Uma proposta formal e a contratação dependem de condições oficiais aprovadas; solicitar não ativa o plano nem confirma cobertura.",
      options: [
        option("Solicitar proposta", "proposal"),
        ...journeyView(state, context).options.filter((item) => item.value !== "sales:proposal"),
      ],
    };
  }
  if (value === "sales:quote") {
    const missing = firstMissing(state.qualification);
    if (missing !== "topics") {
      state.step = missing;
      return done();
    }
    return done(
      "Vou consultar a tabela aprovada e vigente para os dados informados. Se faltarem produto, modalidade ou condições validadas, precisaremos confirmá-los antes de calcular qualquer valor.",
      "quote",
    );
  }
  if (
    state.menu ||
    state.inspecting ||
    state.editMenu ||
    (raw.includes("?") && !raw.startsWith("sales:"))
  )
    return done(undefined, "question");
  const q = state.qualification;
  switch (state.step) {
    case "interest":
      if (
        ["sales:interest:personal", "pessoal", "familia", "para mim", "pessoa", "1"].includes(value)
      ) {
        q.interest = "personal";
        delete q.cnpj;
      } else if (["sales:interest:business", "empresa", "empresarial", "2"].includes(value))
        q.interest = "business";
      else return done("Escolha se o plano é para você/sua família ou para sua empresa.");
      break;
    case "cnpj":
      if (!isValidCnpj(raw))
        return done("Esse CNPJ não passou na validação. Confira os 14 números e envie novamente.");
      q.cnpj = raw.replace(/\D/g, "");
      break;
    case "city":
      if (raw.length < 2 || raw.length > 100 || !/^[\p{L}\s.'-]+$/u.test(raw))
        return done("Informe o nome do município, por exemplo: Niterói.");
      q.city = raw;
      break;
    case "lives":
      if (!/^\d{1,4}$/.test(raw) || Number(raw) < 1 || Number(raw) > 1000)
        return done("Informe uma quantidade inteira entre 1 e 1.000 pessoas.");
      q.lives = Number(raw);
      if (q.ages?.length !== q.lives) delete q.ages;
      break;
    case "ages": {
      const ages = raw.split(/[,;\s]+/).map(Number);
      if (
        !/^\d+(?:[,;\s]+\d+)*$/.test(raw) ||
        ages.some((age) => !Number.isInteger(age) || age < 0 || age > 120) ||
        ages.length !== q.lives
      )
        return done(
          `Informe exatamente ${q.lives ?? "o total de"} idades, de 0 a 120 anos, separadas por vírgulas.`,
        );
      q.ages = ages;
      break;
    }
    case "previous_plan":
      if (["sales:previous:yes", "sim"].includes(value)) q.previous_plan = "yes";
      else if (["sales:previous:no", "nao"].includes(value)) q.previous_plan = "no";
      else if (["sales:previous:unknown", "nao sei"].includes(value)) q.previous_plan = "unknown";
      else return done("Selecione sim, não ou preciso confirmar.");
      break;
    case "due_preference":
      if (value !== "sales:skip") {
        if (!/^\d{1,2}$/.test(raw) || Number(raw) < 1 || Number(raw) > 31)
          return done(
            "Informe um dia de 1 a 31, ou escolha definir depois. A disponibilidade será confirmada.",
          );
        q.preferred_due_day = Number(raw);
      } else if (state.editing) delete q.preferred_due_day;
      state.step = state.editing ? (state.resumeStep ?? "summary") : "topics";
      if (!state.editing) state.topicIndex = 6;
      delete state.editing;
      delete state.resumeStep;
      return done();
    case "start_preference":
      if (value !== "sales:skip") {
        const date = raw.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, "$3-$2-$1");
        if (!isValidDesiredStartDate(date) || (context.today && date < context.today))
          return done(
            "Informe uma data válida, a partir de hoje, no formato DD/MM/AAAA, ou escolha definir depois.",
          );
        q.desired_start_date = date;
      } else if (state.editing) delete q.desired_start_date;
      state.step = state.editing ? (state.resumeStep ?? "summary") : "summary";
      delete state.editing;
      delete state.resumeStep;
      return done();
    case "topics":
      if (value === "sales:next" || value === "continuar") {
        const topic = TOPICS[state.topicIndex];
        if (topic && !state.visited.includes(topic.id)) state.visited.push(topic.id);
        if (state.topicIndex === 5) state.step = "due_preference";
        else if (state.topicIndex >= 6) state.step = "start_preference";
        else state.topicIndex++;
        return done();
      }
      return done(undefined, "question");
    case "summary":
    case "proposal_requested":
      return done(undefined, "question");
  }
  const next = firstMissing(q);
  state.step = state.editing && next === "topics" ? (state.resumeStep ?? "summary") : next;
  if (next === "topics") {
    delete state.editing;
    delete state.resumeStep;
  }
  return done();
}

/** Persist readable customer text while the request fingerprint keeps the original token. */
export function journeyInputLabel(_state: JourneyState, input: string): string {
  if (!input.startsWith("sales:")) return input;
  const commands: Record<string, string> = {
    "sales:interest:personal": "Para mim / minha família",
    "sales:interest:business": "Para minha empresa",
    "sales:previous:yes": "Já tenho plano",
    "sales:previous:no": "Não tenho plano",
    "sales:previous:unknown": "Plano anterior a confirmar",
    "sales:resume": "Retomar jornada",
    "sales:next": "Continuar",
    "sales:handoff": "Falar com vendedor",
    "sales:close": "Encerrar",
    "sales:quote": "Consultar cotação",
    "sales:proposal": "Solicitar proposta",
    "sales:skip": "Definir depois",
    "sales:menu": "Menu de assuntos",
    "sales:edit": "Corrigir dados",
  };
  const fields: Record<string, string> = {
    interest: "interesse",
    city: "município",
    lives: "pessoas",
    ages: "idades",
    cnpj: "CNPJ",
    previous_plan: "plano anterior",
    due_preference: "vencimento",
    start_preference: "data de início",
  };
  return (
    commands[input] ??
    TOPICS.find((topic) => input === `sales:topic:${topic.id}`)?.title ??
    (input.startsWith("sales:edit:") && fields[input.slice(11)]
      ? `Corrigir ${fields[input.slice(11)]}`
      : "Opção comercial")
  );
}
