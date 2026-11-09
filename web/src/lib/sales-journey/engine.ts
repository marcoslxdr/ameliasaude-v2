/** One deterministic sales script for the bot and approval simulator. */
import {
  DUE_DAYS,
  MUNICIPALITIES,
  PRODUCTS,
  TOPICS,
  simulateReceivedPrices,
  waitingPeriodReference,
  type PreviousPlanDuration,
  type ProductId,
  type Coparticipation,
} from "./materials.ts";
export { MUNICIPALITIES, TOPICS } from "./materials.ts";
export const JOURNEY_VERSION = "amelia-commercial-2026-11-09.3";
export type JourneyQualification = {
  interest?: "personal" | "business";
  cnpj?: string;
  city?: string;
  lives?: number;
  ages?: number[];
  modality?: "empresarial" | "adesao" | "indefinido";
  product?: ProductId;
  coparticipation?: Coparticipation;
  previous_plan?: "yes" | "no" | "unknown";
  previous_plan_duration?: PreviousPlanDuration;
  preferred_due_day?: number;
  desired_start_date?: string;
};
export type JourneyOption = { label: string; value: string };
export type TopicId = (typeof TOPICS)[number]["id"];
export type JourneyStep =
  | "interest"
  | "cnpj"
  | "city"
  | "lives"
  | "ages"
  | "previous_plan"
  | "previous_plan_duration"
  | "topics"
  | "due_preference"
  | "start_preference"
  | "summary"
  | "quote_product"
  | "quote_coparticipation"
  | "price_simulation"
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
  quoteFlow?: boolean;
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
    q.product &&
      `Produto: ${PRODUCTS.find((product) => product.id === q.product)?.label ?? "a confirmar"}`,
    q.coparticipation && `Coparticipação: ${q.coparticipation === "com" ? "em terapias" : "sem"}`,
    q.previous_plan &&
      `Plano anterior: ${{ yes: "sim", no: "não", unknown: "a confirmar" }[q.previous_plan]}`,
    q.previous_plan === "yes" &&
      q.previous_plan_duration &&
      `Tempo de plano anterior: ${{ under_6_months: "menos de 6 meses", "6_to_12_months": "de 6 a 12 meses", above_12_months: "acima de 12 meses", unknown: "a confirmar" }[q.previous_plan_duration]}`,
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
      ...(state.qualification.previous_plan === "yes"
        ? [option("Tempo do plano anterior", "edit:previous_plan_duration")]
        : []),
      option("Produto / modalidade", "edit:quote_product"),
      ...(!!state.qualification.product
        ? [option("Coparticipação", "edit:quote_coparticipation")]
        : []),
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
    if (topic.id === "waiting" && !context.topicAnswers?.waiting)
      text += `\n\n${waitingPeriodReference(state.qualification.previous_plan, state.qualification.previous_plan_duration)}`;
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
      case "previous_plan_duration":
        text =
          "Há quanto tempo as pessoas têm o plano anterior? Isso permite explicar a coluna da matriz recebida, sem confirmar aproveitamento. Se houver tempos diferentes, escolha a confirmar.";
        options = [
          option("Menos de 6 meses", "duration:under_six"),
          option("De 6 a 12 meses", "duration:six_to_twelve"),
          option("Acima de 12 meses", "duration:above_twelve"),
          option("Preciso confirmar", "duration:unknown"),
        ];
        break;
      case "due_preference":
        text =
          "A tabela apresenta vencimento nos dias 01, 05, 10, 15 e 20. Qual você prefere? A escolha não confirma a contratação.";
        options = [
          ...DUE_DAYS.map((day) => ({
            label: `Dia ${String(day).padStart(2, "0")}`,
            value: String(day),
          })),
          option("Definir depois", "skip"),
        ];
        break;
      case "start_preference":
        text =
          "Quando gostaria de iniciar? Informe DD/MM/AAAA. A tabela mostra os dias 01, 05, 10, 15 e 20; a data desejada depende da conclusão da entrevista médica e das condições de implantação, sem ativação automática.";
        options = [option("Definir depois", "skip")];
        break;
      case "summary":
        text = `${journeySummary(state.qualification)}\n\nAssuntos apresentados: ${state.visited.map((id) => TOPICS.find((t) => t.id === id)?.title).join(", ") || "nenhum"}.\nCondições pendentes de validação serão confirmadas antes da proposta. Como deseja continuar?`;
        options = [
          option("Simular valores recebidos", "quote"),
          option("Solicitar proposta", "proposal"),
          option("Encerrar", "close"),
        ];
        break;
      case "quote_product":
        text =
          "Qual produto deseja consultar? Interesse pessoal ou empresarial não define sozinho a modalidade contratual. A elegibilidade depende dos vínculos e condições do produto.";
        options = PRODUCTS.map((product) => option(product.label, `product:${product.id}`));
        break;
      case "quote_coparticipation":
        text =
          state.qualification.product === "carioca_10_pme"
            ? "A tabela PME recebida tem somente a opção com coparticipação em terapias. Deseja simular essa opção? Unidade de cobrança e limites das terapias precisam ser confirmados."
            : "Para o Carioca 10 Adesão, qual opção deseja simular? A unidade de cobrança e os limites das terapias precisam ser confirmados.";
        options = [
          option("Coparticipação em terapias", "copart:com"),
          ...(state.qualification.product === "carioca_10_pme"
            ? []
            : [option("Sem coparticipação", "copart:sem")]),
        ];
        break;
      case "price_simulation":
        text = simulateReceivedPrices(state.qualification).text;
        options = [
          option("Solicitar proposta", "proposal"),
          option("Consultar condições vigentes", "approved_quote"),
          option("Encerrar", "close"),
        ];
        break;
      case "proposal_requested": {
        const requested = state.proposalRequest?.qualification;
        const changed = requested && !sameQualification(requested, state.qualification);
        text = changed
          ? `Você corrigiu os dados depois de solicitar a proposta. Confira as informações atuais e confirme a atualização do pedido:\n${journeySummary(state.qualification)}\n\nO pedido anterior permanece registrado até sua confirmação. Nenhuma contratação ou cobertura foi confirmada.`
          : `Seu pedido de proposta está registrado para estes dados:\n${journeySummary(requested ?? state.qualification)}\n\nUma proposta formal depende de condições comerciais aprovadas e da etapa de contratação. Este pedido não é um contrato, não confirma preço, elegibilidade, início de vigência ou cobertura. As informações ainda não aprovadas continuam pendentes. O treinamento exige entrevista médica concluída antes da vigência; o pedido no chat não agenda essa entrevista nem emite proposta formal. Você pode simular valores recebidos, tirar dúvidas ou corrigir dados aqui; o atendimento continua automático.`;
        options = [
          ...(changed ? [option("Confirmar atualização do pedido", "proposal")] : []),
          option("Simular valores recebidos", "quote"),
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
  "product",
  "coparticipation",
  "previous_plan",
  "previous_plan_duration",
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
  const beginSimulation = (): JourneyResult => {
    const missing = firstMissing(state.qualification);
    state.step =
      missing !== "topics"
        ? missing
        : !state.qualification.product
          ? "quote_product"
          : !state.qualification.coparticipation
            ? "quote_coparticipation"
            : "price_simulation";
    state.quoteFlow = state.step !== "price_simulation";
    delete state.menu;
    delete state.inspecting;
    delete state.editMenu;
    return done();
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
        "previous_plan_duration",
        "due_preference",
        "start_preference",
        "quote_product",
        "quote_coparticipation",
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
    delete state.quoteFlow;
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
  if (value === "sales:quote") return beginSimulation();
  if (value === "sales:approved_quote") {
    const missing = firstMissing(state.qualification);
    if (missing !== "topics") {
      state.step = missing;
      return done();
    }
    return done(
      "Vou consultar as condições aprovadas e vigentes, separadamente da simulação dos materiais recebidos. Se faltarem produto, modalidade ou fonte validada, manteremos a pendência explícita, sem inventar valores ou transferir automaticamente.",
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
    case "quote_product": {
      const selected = PRODUCTS.find(
        (product) =>
          value === `sales:product:${product.id}` ||
          value === normalize(product.label) ||
          value === product.modality ||
          (product.id === "carioca_10_pme" && value === "pme"),
      );
      if (!selected)
        return done(
          "Escolha Carioca 10 Adesão ou Carioca 10 PME. Não utilizamos a tabela de uma modalidade para a outra.",
        );
      q.product = selected.id;
      q.modality = selected.modality;
      if (selected.id === "carioca_10_pme" && q.coparticipation === "sem") delete q.coparticipation;
      if (state.editing) {
        if (!q.coparticipation) {
          state.step = "quote_coparticipation";
          return done();
        }
        state.step = state.resumeStep ?? "summary";
        delete state.editing;
        delete state.resumeStep;
        return done();
      }
      return beginSimulation();
    }
    case "quote_coparticipation":
      if (
        ["sales:copart:com", "com", "com coparticipacao", "coparticipacao em terapias"].includes(
          value,
        )
      )
        q.coparticipation = "com";
      else if (["sales:copart:sem", "sem", "sem coparticipacao"].includes(value))
        q.coparticipation = "sem";
      else return done("Escolha com coparticipação em terapias ou sem coparticipação.");
      if (state.editing) {
        state.step = state.resumeStep ?? "summary";
        delete state.editing;
        delete state.resumeStep;
        return done();
      }
      return beginSimulation();
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
    case "previous_plan_duration": {
      const durations: Record<string, PreviousPlanDuration> = {
        "sales:duration:under_six": "under_6_months",
        "sales:duration:six_to_twelve": "6_to_12_months",
        "sales:duration:above_twelve": "above_12_months",
        "sales:duration:unknown": "unknown",
        "nao sei": "unknown",
      };
      const months = /^(\d{1,4})(?: meses)?$/.exec(value);
      const selected =
        durations[value] ??
        (months && Number(months[1]) >= 1
          ? Number(months[1]) < 6
            ? "under_6_months"
            : Number(months[1]) <= 12
              ? "6_to_12_months"
              : "above_12_months"
          : undefined);
      if (!selected)
        return done("Escolha menos de 6 meses, de 6 a 12, acima de 12 ou preciso confirmar.");
      q.previous_plan_duration = selected;
      break;
    }
    case "previous_plan":
      if (["sales:previous:yes", "sim"].includes(value)) q.previous_plan = "yes";
      else if (["sales:previous:no", "nao"].includes(value)) q.previous_plan = "no";
      else if (["sales:previous:unknown", "nao sei"].includes(value)) q.previous_plan = "unknown";
      else return done("Selecione sim, não ou preciso confirmar.");
      if (q.previous_plan === "yes") {
        state.step = "previous_plan_duration";
        return done();
      }
      delete q.previous_plan_duration;
      break;
    case "due_preference":
      if (value !== "sales:skip") {
        if (!/^\d{1,2}$/.test(raw) || !DUE_DAYS.some((day) => day === Number(raw)))
          return done(
            "Escolha um dos dias apresentados na tabela: 01, 05, 10, 15 ou 20, ou defina depois.",
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
    case "price_simulation":
      return done(undefined, "question");
  }
  const next = firstMissing(q);
  if (next === "topics" && state.quoteFlow && !state.editing) return beginSimulation();
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
    "sales:duration:under_six": "Menos de 6 meses de plano anterior",
    "sales:duration:six_to_twelve": "De 6 a 12 meses de plano anterior",
    "sales:duration:above_twelve": "Acima de 12 meses de plano anterior",
    "sales:duration:unknown": "Tempo de plano anterior a confirmar",
    "sales:resume": "Retomar jornada",
    "sales:next": "Continuar",
    "sales:handoff": "Falar com vendedor",
    "sales:close": "Encerrar",
    "sales:quote": "Simular valores recebidos",
    "sales:approved_quote": "Consultar condições vigentes",
    "sales:product:carioca_10_adesao": "Carioca 10 Adesão",
    "sales:product:carioca_10_pme": "Carioca 10 PME",
    "sales:copart:com": "Coparticipação em terapias",
    "sales:copart:sem": "Sem coparticipação",
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
    previous_plan_duration: "tempo do plano anterior",
    quote_product: "produto / modalidade",
    quote_coparticipation: "coparticipação",
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
