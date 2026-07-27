export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  publishAt?: string;
  readTime: string;
  image: string;
  content: string[];
  tags: string[];
  author?: string;
  reviewer?: string;
  updatedAt?: string;
  sources?: { label: string; url: string }[];
  cta?: { label: string; href: string; event: string };
}

const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=82`;
const ans = { label: "Agência Nacional de Saúde Suplementar (ANS)", url: "https://www.gov.br/ans/pt-br" };
const amelia = { label: "Amélia Saúde", url: "https://www.ameliasaude.com.br/" };

const legacyPosts: BlogPost[] = [
  { slug: "5-dicas-nutricao-dia-a-dia", category: "Nutrição", title: "5 dicas práticas de nutrição para o dia a dia", excerpt: "Alimentar-se bem não precisa ser complicado. Veja como incluir hábitos saudáveis na sua rotina.", date: "15 Mar 2026", readTime: "5 min", image: image("photo-1490645935967-10de6ba17061"), content: ["Ter uma alimentação balanceada é o pilar fundamental para uma vida longa e saudável."], tags: ["nutrição", "hábitos", "saúde"] },
  { slug: "importancia-exercicio-fisico", category: "Exercícios", title: "A importância do exercício físico para a saúde mental", excerpt: "Descubra como movimentar o corpo pode reduzir o estresse e melhorar sua qualidade de vida.", date: "12 Mar 2026", readTime: "4 min", image: image("photo-1571019614242-c5c5dee9f50b"), content: ["A prática regular de exercícios vai muito além da estética. Ela é essencial para a saúde física e mental."], tags: ["exercícios", "saúde mental", "bem-estar"] },
  { slug: "sono-e-bem-estar", category: "Bem-estar", title: "Como uma boa noite de sono transforma o seu corpo", excerpt: "Dormir bem é tão importante quanto uma boa alimentação e a prática de exercícios físicos.", date: "08 Mar 2026", readTime: "6 min", image: image("photo-1541480601022-2308c0f02487"), content: ["O sono de qualidade é essencial para a reparação celular e o equilíbrio do organismo."], tags: ["sono", "bem-estar", "saúde"] },
  { slug: "hidratação-corporal", category: "Bem-estar", title: "A importância da hidratação para o organismo", excerpt: "A água é essencial para o funcionamento de todas as células do nosso corpo.", date: "05 Mar 2026", readTime: "3 min", image: image("photo-1548839140-29a749e1cf4d"), content: ["A hidratação adequada participa de inúmeras funções no organismo e deve fazer parte da rotina."], tags: ["hidratação", "bem-estar", "saúde"] },
  { slug: "meditação-reduzir-ansiedade", category: "Bem-estar", title: "Meditação: uma aliada contra a ansiedade", excerpt: "Práticas de mindfulness podem ajudar a criar pausas e mais presença no dia a dia.", date: "01 Mar 2026", readTime: "5 min", image: image("photo-1506126613408-eca07ce68773"), content: ["A meditação pode ser uma prática simples de autocuidado, sem substituir avaliação profissional quando necessária."], tags: ["meditação", "saúde mental", "ansiedade"] },
  { slug: "alimentos-anti-inflamatorios", category: "Nutrição", title: "Alimentos anti-inflamatórios que devem estar no seu prato", excerpt: "Conheça escolhas alimentares que podem compor uma rotina mais equilibrada.", date: "25 Fev 2026", readTime: "6 min", image: image("photo-1512621776951-a57141f2eefd"), content: ["Uma alimentação variada pode apoiar a saúde, mas não substitui diagnóstico ou tratamento individualizado."], tags: ["nutrição", "alimentação", "saúde"] },
  { slug: "yoga-iniciantes", category: "Exercícios", title: "Yoga para iniciantes: por onde começar", excerpt: "Se você quer começar a praticar yoga, veja como dar os primeiros passos com segurança.", date: "20 Fev 2026", readTime: "5 min", image: image("photo-1544367567-0f2fcb009e0b"), content: ["A yoga une movimento, respiração e atenção. Comece respeitando seus limites e procure orientação quando necessário."], tags: ["yoga", "exercícios", "bem-estar"] },
  { slug: "saúde-mental-trabalho", category: "Bem-estar", title: "Como cuidar da saúde mental no ambiente de trabalho", excerpt: "Dicas práticas para manter o equilíbrio emocional durante a jornada.", date: "15 Fev 2026", readTime: "4 min", image: image("photo-1499750310107-5fef28a66643"), content: ["Cuidar da saúde mental no trabalho envolve limites, pausas, apoio e atenção aos sinais persistentes de sofrimento."], tags: ["saúde mental", "trabalho", "bem-estar"] },
  { slug: "benefícios-caminhada", category: "Exercícios", title: "Os benefícios da caminhada para a saúde", excerpt: "A caminhada é acessível e pode fazer parte de uma rotina ativa.", date: "10 Fev 2026", readTime: "4 min", image: image("photo-1476480862126-209bfaa8edc8"), content: ["A caminhada é uma atividade física acessível. Ajuste intensidade e duração à sua condição e procure orientação se houver sintomas."], tags: ["caminhada", "exercícios", "saúde"] },
];

const scheduledPosts: BlogPost[] = [
  {
    slug: "plano-de-saude-por-adesao-como-funciona-rj",
    category: "Coletivo por adesão",
    title: "Plano de saúde por adesão: como funciona e quem pode contratar no RJ",
    excerpt:
      "Entenda o que é o plano coletivo por adesão, quem pode contratar via entidade de classe, o que conferir antes de assinar e como a Amélia Saúde orienta no Rio de Janeiro.",
    date: "27 Jul 2026",
    publishAt: "2026-07-27T08:00:00-03:00",
    readTime: "8 min",
    image: image("photo-1454165804606-c3d57bc86b40"),
    content: [
      "## Resposta direta",
      "O plano de saúde coletivo por adesão é uma modalidade em que a contratação acontece por meio de vínculo com sindicato, conselho, associação profissional ou entidade de classe aceita no produto. No Rio de Janeiro, a elegibilidade, a rede, a carência e o preço dependem do produto e da proposta vigentes — não de uma regra universal. Confirme sempre no contrato e no canal oficial da operadora.",
      "## O que significa coletivo por adesão?",
      "Na prática, você não contrata um plano individual aberto a qualquer pessoa: a adesão exige um vínculo com a entidade prevista no produto. A entidade intermedia a relação coletiva; a cobertura, a rede e as condições de uso ficam definidas no contrato do plano. Isso difere do individual/familiar e do empresarial, que seguem outras regras de elegibilidade e contratação.",
      "## Quem pode contratar?",
      "Pode contratar quem comprovar o vínculo aceito pela entidade e pelo produto (por exemplo, registro profissional, associação ativa ou categoria prevista). Dependentes só entram se o contrato permitir e se a documentação for aceita. A lista de entidades e categorias elegíveis da Amélia Saúde deve ser confirmada no atendimento comercial vigente — não publique nem aceite uma lista antiga como garantia.",
      "## Como funciona a contratação?",
      "1. Verifique se sua categoria ou entidade é elegível no produto.\n2. Reúna documentos de identificação, vínculo e, se houver, de dependentes.\n3. Analise proposta, rede, segmentação, carências e reajuste por escrito.\n4. Confirme cobertura e prestadores na consulta oficial de rede.\n5. Só assine após alinhar proposta e contrato.",
      "## Quais documentos costumam ser pedidos?",
      "Documentos variam por produto e entidade. Em geral, peçam identificação, comprovante de vínculo com a entidade ou categoria, dados de dependentes e formulários de adesão. Peça a lista oficial atualizada antes de iniciar o processo e guarde protocolos.",
      "## Existe carência?",
      "Pode existir. Carência, cobertura parcial temporária e portabilidade seguem regras do produto e da regulamentação da ANS. Não assuma “sem carência” com base em conversa informal. Confira prazos no contrato e, em troca de plano, avalie se há portabilidade de carências com base no Guia da ANS e na análise da operadora.",
      "## Adesão x individual x empresarial",
      "Adesão exige vínculo com entidade aceita. Individual/familiar tem regras próprias de contratação e reajuste. Empresarial depende de CNPJ, número de vidas e regras da empresa. Escolher “o mais barato” sem comparar modalidade, rede e carência costuma gerar frustração. Compare o custo total e a adequação ao seu perfil.",
      "## Quando vale a pena?",
      "Vale analisar o coletivo por adesão quando você tem vínculo elegível, precisa de rede na sua rotina no RJ/Grande Rio e quer condições coletivas sem abrir empresa. Só fecha sentido depois de confirmar elegibilidade, rede atualizada, carências e clareza contratual.",
      "## Perguntas frequentes",
      "Qualquer profissional pode aderir? Não — depende da entidade e do produto. A Amélia publica preço fixo no blog? Não; preço e condições saem da proposta vigente. Rede de um anúncio é garantia? Não; consulte o produto e o município no canal oficial. Posso incluir dependentes? Somente se o contrato permitir e a documentação for aceita.",
      "## Próximo passo",
      "Se você está no Rio de Janeiro e quer saber se pode contratar por adesão, fale com a Amélia Saúde para confirmar elegibilidade, rede e condições atuais — sem promessa genérica no lugar da proposta.",
    ],
    tags: ["plano por adesão", "coletivo por adesão", "Rio de Janeiro", "contratação"],
    author: "Equipe Amélia Saúde",
    reviewer: "Validação comercial e regulatória pendente",
    updatedAt: "27 Jul 2026",
    sources: [ans, amelia],
    cta: { label: "Verifique sua elegibilidade", href: "/#contato", event: "blog_cta_elegibilidade" },
  },
  {
    slug: "plano-saude-familia-o-que-avaliar-antes-de-incluir-dependentes",
    category: "Planos de saúde",
    title: "Plano de saúde para família: o que avaliar antes de incluir dependentes",
    excerpt: "Um roteiro prático para comparar regras, cobertura, rede e documentos antes de incluir familiares em um plano de saúde.",
    date: "27 Jul 2026", publishAt: "2026-07-27T10:00:00-03:00", readTime: "7 min",
    image: image("photo-1492724441997-5dc865305da7"),
    content: [
      "## Resposta direta",
      "Antes de incluir dependentes, confira quem pode ser incluído, quais documentos são exigidos, como funciona a cobertura, quais são as regras de carência e se a rede atende a rotina da família. Essas condições variam por produto e contrato; confirme a versão vigente diretamente com a operadora ou com o canal de orientação.",
      "## O que avaliar primeiro?",
      "Comece pela composição familiar e pela finalidade do plano. Uma família pode priorizar pediatria, acompanhamento de condições crônicas, acesso perto de casa ou previsibilidade de atendimento. Transforme essas prioridades em perguntas objetivas antes de comparar propostas.",
      "## Checklist de contratação",
      "- Quem pode entrar como titular e dependente?\n- Quais documentos comprovam o vínculo?\n- Há carência, cobertura parcial temporária ou regras específicas?\n- Como consultar a rede credenciada atualizada?\n- Qual canal confirma as condições do contrato?",
      "## Perguntas frequentes",
      "A inclusão de dependentes é automática? Não. Ela depende das regras do produto e da documentação exigida. É possível afirmar que um plano é melhor para toda família? Não sem conhecer necessidades, contrato e rede. A orientação segura é comparar condições por escrito e pedir esclarecimento antes da assinatura.",
      "## Próximo passo",
      "Se você está avaliando um plano no Rio de Janeiro, conheça a proposta da Amélia Saúde e confirme elegibilidade, rede e condições atuais antes de contratar.",
    ],
    tags: ["plano familiar", "dependentes", "contratação"], author: "Equipe Amélia Saúde", reviewer: "Validação comercial e regulatória pendente", updatedAt: "27 Jul 2026", sources: [ans, amelia], cta: { label: "Verifique sua elegibilidade", href: "/#contato", event: "blog_cta_elegibilidade" },
  },
  {
    slug: "beneficiario-e-dependente-plano-de-saude-perguntas",
    category: "Planos de saúde", title: "Beneficiário e dependente em plano de saúde: quais perguntas fazer?",
    excerpt: "Entenda a diferença prática entre titular, beneficiário e dependente e leve as perguntas certas para a contratação.",
    date: "27 Jul 2026", publishAt: "2026-07-27T18:00:00-03:00", readTime: "6 min", image: image("photo-1511895426328-dc8714191300"),
    content: ["## Resposta direta", "Titular é a pessoa que contrata ou integra o vínculo principal do plano; dependente é quem pode ser incluído conforme as regras do produto. Ambos são beneficiários quando têm cobertura ativa. A definição documental e os vínculos aceitos precisam ser confirmados no contrato e na proposta.", "## O que perguntar antes de assinar?", "Pergunte quais vínculos são aceitos, quais documentos comprovam a relação, quando a cobertura começa, como ocorre a inclusão e o que acontece em caso de alteração familiar. Peça respostas por escrito quando a informação influenciar a decisão.", "## Checklist rápido", "- Quem será o titular?\n- Quais dependentes são elegíveis?\n- Quais documentos e prazos valem?\n- Como funciona a exclusão ou inclusão?\n- Onde consultar contrato e rede atualizados?", "## Atenção", "Não use uma explicação genérica como confirmação de elegibilidade. Produto, modalidade e contrato podem mudar a resposta. A informação comercial vigente é a que deve orientar a contratação.", "## Próximo passo", "Use este roteiro para conversar com a Amélia Saúde e esclarecer a modalidade adequada ao seu caso."],
    tags: ["beneficiário", "dependente", "plano de saúde"], author: "Equipe Amélia Saúde", reviewer: "Validação comercial e regulatória pendente", updatedAt: "27 Jul 2026", sources: [ans, amelia], cta: { label: "Tire suas dúvidas", href: "/#contato", event: "blog_cta_duvidas" },
  },
  {
    slug: "reajuste-plano-de-saude-o-que-entender", category: "Regras e direitos", title: "Reajuste de plano de saúde: o que você precisa entender", excerpt: "Saiba quais perguntas fazer sobre reajuste e onde conferir a regra aplicável ao seu contrato.",
    date: "28 Jul 2026", publishAt: "2026-07-28T08:00:00-03:00", readTime: "7 min", image: image("photo-1450101499163-c8848c66ca85"),
    content: ["## Resposta direta", "Reajuste é a alteração do valor da mensalidade conforme regras aplicáveis à modalidade e ao contrato. Não existe uma resposta única para todos os planos: o índice, a periodicidade, a comunicação e a necessidade de autorização variam conforme o caso. Consulte a ANS e os documentos do seu produto.", "## O que muda conforme a modalidade?", "Planos individuais ou familiares e planos coletivos podem seguir regras diferentes. Por isso, identifique a modalidade, leia a cláusula de reajuste e confira a comunicação recebida. Se houver dúvida, solicite memória de cálculo ou explicação formal ao canal responsável.", "## Perguntas para conferir", "- Qual é a modalidade do contrato?\n- Qual regra e período de aplicação foram informados?\n- O percentual foi comunicado corretamente?\n- Há mais de um componente de alteração?\n- Onde registrar uma contestação ou pedido de esclarecimento?", "## O que evitar", "Não compare apenas percentuais de contratos diferentes e não tome uma publicação antiga como regra atual. Reajuste é tema regulatório: confira a fonte oficial e a versão vigente do contrato.", "## Próximo passo", "Acesse a fonte oficial da ANS e peça orientação sobre o seu contrato antes de concluir que um reajuste está correto ou incorreto."],
    tags: ["reajuste", "ANS", "direitos"], author: "Equipe Amélia Saúde", reviewer: "Validação regulatória pendente", updatedAt: "28 Jul 2026", sources: [ans], cta: { label: "Consulte as regras do plano", href: "https://www.gov.br/ans/pt-br", event: "blog_cta_regras" },
  },
  {
    slug: "cobertura-plano-de-saude-como-conferir", category: "Regras e direitos", title: "Cobertura de plano de saúde: como conferir antes de contratar", excerpt: "Um método simples para ler cobertura, segmentação assistencial, Rol da ANS e limitações contratuais.",
    date: "28 Jul 2026", publishAt: "2026-07-28T18:00:00-03:00", readTime: "8 min", image: image("photo-1576091160399-112ba8d25d1d"),
    content: ["## Resposta direta", "Para conferir a cobertura, leia a segmentação assistencial, o contrato, o rol de procedimentos da ANS e as condições específicas do produto. A existência de um procedimento no rol não significa que todo plano ofereça a mesma cobertura: a segmentação, o contrato e as regras vigentes precisam ser considerados em conjunto.", "## Como fazer a conferência", "Liste o atendimento que você realmente precisa, localize a seção correspondente no contrato e confirme rede, autorização, prazos e eventuais limitações. Depois, valide a informação em canal oficial. Guarde a resposta e a versão dos documentos consultados.", "## Checklist antes da contratação", "- Segmentação assistencial do produto\n- Procedimentos e condições de cobertura\n- Rede disponível para sua região\n- Regras de autorização e reembolso, se houver\n- Carências e cobertura parcial temporária\n- Canais para obter a versão atualizada", "## Perguntas frequentes", "A cobertura é igual em todos os planos? Não. Posso confiar apenas em uma conversa informal? Não para uma decisão contratual. A resposta segura é consultar o documento vigente e confirmar com a operadora.", "## Próximo passo", "Compare a documentação com calma e peça orientação à Amélia Saúde sobre o produto que pretende avaliar."],
    tags: ["cobertura", "Rol ANS", "contrato"], author: "Equipe Amélia Saúde", reviewer: "Validação regulatória pendente", updatedAt: "28 Jul 2026", sources: [ans, amelia], cta: { label: "Confira as condições", href: "/#contato", event: "blog_cta_cobertura" },
  },
  {
    slug: "plano-saude-rio-grande-rio-como-escolher", category: "Rede e território", title: "Plano de saúde no Rio e Grande Rio: como escolher uma opção perto de você", excerpt: "Veja como transformar localização, rotina e acesso em critérios objetivos para avaliar um plano de saúde.",
    date: "29 Jul 2026", publishAt: "2026-07-29T08:00:00-03:00", readTime: "7 min", image: image("photo-1519494026892-80bbd2d6fd0d"),
    content: ["## Resposta direta", "Escolher um plano no Rio e Grande Rio começa por mapear onde você mora, trabalha e costuma buscar atendimento. Em seguida, confira a rede credenciada atualizada, a segmentação do produto, os canais de acesso e as regras contratuais. A localização sozinha não confirma disponibilidade de um prestador.", "## Como montar seu mapa de necessidades", "Anote três pontos: residência, trabalho ou estudo e locais onde sua família costuma circular. Depois, priorize especialidades e serviços relevantes. Esse mapa ajuda a fazer perguntas melhores e evita escolher apenas pelo nome da operadora.", "## O que comparar", "- Municípios e regiões atendidos no produto\n- Hospitais, clínicas e laboratórios da rede vigente\n- Forma de consulta e autorização\n- Atendimento presencial e canais digitais\n- Regras de cobertura, carência e contrato", "## Cuidado com a rede", "A rede pode ser atualizada e um resultado de busca não substitui a consulta oficial. Confirme o prestador, o endereço, o produto e a data da informação antes de contar com aquele atendimento.", "## Próximo passo", "Conheça a atuação da Amélia Saúde no Rio de Janeiro e consulte a rede atualizada para sua necessidade."],
    tags: ["Rio de Janeiro", "Grande Rio", "rede credenciada"], author: "Equipe Amélia Saúde", reviewer: "Validação comercial pendente", updatedAt: "29 Jul 2026", sources: [amelia, ans], cta: { label: "Confira a rede", href: "/#rede", event: "blog_cta_rede" },
  },
  {
    slug: "amelia-saude-conheca-operadora-carioca", category: "Amélia Saúde", title: "Amélia Saúde: conheça a operadora carioca de planos de saúde", excerpt: "Conheça a proposta, o território e as modalidades de contratação da Amélia Saúde sem confundir informação institucional com promessa contratual.",
    date: "29 Jul 2026", publishAt: "2026-07-29T18:00:00-03:00", readTime: "6 min", image: image("photo-1517245386807-bb43f82c33c4"),
    content: ["## Resposta direta", "A Amélia Saúde é uma operadora de planos de saúde com atuação no Rio de Janeiro. A empresa apresenta modalidades voltadas a contratação coletiva por adesão e a planos empresariais, conforme o produto disponível. Elegibilidade, rede, cobertura e condições devem ser confirmadas na proposta e no contrato vigentes.", "## Qual é a proposta?", "A proposta institucional combina atendimento humanizado, tecnologia e orientação mais clara para quem está comparando opções. Isso não substitui a leitura das condições contratuais: o que vale para cada beneficiário é o produto efetivamente contratado.", "## Para quem está avaliando", "Quem busca um plano deve começar pela modalidade, pelo perfil de uso e pela região de atendimento. Em vez de escolher por uma promessa genérica, peça informações sobre elegibilidade, rede, cobertura, carências, canais de atendimento e documentação.", "## Perguntas frequentes", "A Amélia atende todo o Brasil? A presença e a rede devem ser confirmadas para o produto consultado. Qualquer pessoa pode contratar por adesão? A elegibilidade depende do vínculo aceito e das regras vigentes. Existe uma condição única para todos? Não; consulte a proposta específica.", "## Próximo passo", "Conheça a Amélia Saúde e converse com a equipe para entender qual modalidade faz sentido para o seu caso."],
    tags: ["Amélia Saúde", "operadora", "Rio de Janeiro"], author: "Equipe Amélia Saúde", reviewer: "Validação comercial pendente", updatedAt: "29 Jul 2026", sources: [amelia, ans], cta: { label: "Conheça a Amélia", href: "/#origem", event: "blog_cta_marca" },
  },
  {
    slug: "como-consultar-rede-credenciada-plano-saude", category: "Rede e território", title: "Como conferir a rede do seu plano de saúde antes de contratar", excerpt: "Aprenda a consultar a rede credenciada sem depender de listas antigas ou resultados fora do produto escolhido.",
    date: "30 Jul 2026", publishAt: "2026-07-30T08:00:00-03:00", readTime: "7 min", image: image("photo-1551076805-e1869033e561"),
    content: ["## Resposta direta", "Consulte a rede no canal oficial da operadora, selecione o produto correto, informe a região e confirme o prestador antes de contratar. Nome, endereço, especialidade e disponibilidade podem mudar; por isso, a data da consulta e a versão da lista importam.", "## Passo a passo", "1. Identifique o produto e a segmentação.\n2. Acesse o canal oficial de consulta.\n3. Filtre por município, especialidade ou tipo de serviço.\n4. Confirme endereço e vínculo com o produto.\n5. Salve a informação e peça confirmação quando a decisão depender dela.", "## O que perguntar", "Pergunte se o prestador atende o produto que está sendo ofertado, se é necessário autorização, quais horários e canais estão disponíveis e como a operadora comunica alterações. Não aceite uma lista sem identificação do produto ou da data.", "## Erro comum", "Encontrar um hospital em uma busca pública não prova que ele está disponível no seu plano. Rede credenciada é uma informação contextual: produto, local, especialidade e vigência precisam coincidir.", "## Próximo passo", "Consulte a rede atualizada da Amélia Saúde e tire dúvidas antes de tomar uma decisão."],
    tags: ["rede credenciada", "consulta", "contratação"], author: "Equipe Amélia Saúde", reviewer: "Validação comercial pendente", updatedAt: "30 Jul 2026", sources: [amelia, ans], cta: { label: "Consulte a rede", href: "/#rede", event: "blog_cta_rede" },
  },
  {
    slug: "plano-saude-pequenas-empresas-o-que-comparar", category: "Planos empresariais", title: "Plano de saúde para pequenas empresas: o que comparar antes de decidir", excerpt: "Um checklist para PME comparar elegibilidade, rede, cobertura, custos e suporte sem contratar no escuro.",
    date: "30 Jul 2026", publishAt: "2026-07-30T18:00:00-03:00", readTime: "8 min", image: image("photo-1556761175-b413da4baf72"),
    content: ["## Resposta direta", "Uma pequena empresa deve comparar a modalidade disponível, o número de beneficiários, as regras de inclusão, a rede, a cobertura, a carência, o reajuste e os canais de suporte. O preço é apenas um item: a proposta precisa ser lida junto com o contrato e com a necessidade real da equipe.", "## O que colocar lado a lado", "Organize uma tabela com produto, elegibilidade, faixa de vidas, rede por região, segmentação, coparticipação se houver, carências, reajuste, documentos e prazo de implantação. Isso revela diferenças que uma cotação resumida costuma esconder.", "## Perguntas para a empresa", "- Quem pode entrar como beneficiário?\n- Como dependentes são tratados?\n- Como ocorre movimentação cadastral?\n- Qual rede atende os municípios da equipe?\n- Quais canais resolvem dúvidas de implantação?", "## O que não presumir", "MEI, PME e empresa com poucos funcionários não têm necessariamente a mesma regra de contratação. Não publique ou aceite preço, quantidade mínima ou benefício sem validação da proposta atual.", "## Próximo passo", "Se sua empresa está no Rio de Janeiro, fale com a Amélia Saúde para confirmar as opções empresariais vigentes."],
    tags: ["PME", "plano empresarial", "empresa"], author: "Equipe Amélia Saúde", reviewer: "Validação comercial pendente", updatedAt: "30 Jul 2026", sources: [amelia, ans], cta: { label: "Fale com a Amélia", href: "/#contato", event: "blog_cta_empresarial" },
  },
  {
    slug: "como-ler-contrato-plano-saude-checklist", category: "Regras e direitos", title: "Como ler contrato de plano de saúde: checklist para não perder pontos importantes", excerpt: "Um guia de leitura para identificar modalidade, cobertura, rede, carência, reajuste, cancelamento e canais de atendimento.",
    date: "31 Jul 2026", publishAt: "2026-07-31T08:00:00-03:00", readTime: "9 min", image: image("photo-1450101499163-c8848c66ca85"),
    content: ["## Resposta direta", "Leia o contrato por blocos: modalidade, cobertura, rede, carência, reajuste, vigência, movimentação, cancelamento e atendimento. Marque termos que não entende e peça esclarecimento antes da assinatura. A proposta comercial e o contrato precisam ser coerentes.", "## Checklist de leitura", "- Quem é o contratante e quem são os beneficiários?\n- Qual é a segmentação e a abrangência?\n- Quais coberturas e exclusões estão descritas?\n- Como funcionam carências e autorizações?\n- Como a rede é consultada e atualizada?\n- Qual regra de reajuste se aplica?\n- Como pedir cancelamento ou alteração?", "## Como registrar dúvidas", "Faça uma lista numerada e solicite resposta pelo canal oficial. Guarde proposta, contrato, anexos, protocolos e data da consulta. Em temas regulatórios, compare a explicação com a fonte da ANS.", "## Sinais de alerta", "Desconfie de promessa verbal sem documento, urgência para assinar, preço sem validade, rede sem identificação do produto e respostas que misturam produtos diferentes. Esses atalhos custam caro depois.", "## Próximo passo", "Peça orientação à Amélia Saúde e só avance quando as condições relevantes estiverem claras."],
    tags: ["contrato", "checklist", "plano de saúde"], author: "Equipe Amélia Saúde", reviewer: "Validação comercial e regulatória pendente", updatedAt: "31 Jul 2026", sources: [ans, amelia], cta: { label: "Peça orientação", href: "/#contato", event: "blog_cta_orientacao" },
  },
  {
    slug: "amelia-saude-perguntas-frequentes-planos-rede-contratacao", category: "Amélia Saúde", title: "Amélia Saúde: perguntas frequentes sobre planos, rede e contratação", excerpt: "Respostas iniciais para as dúvidas mais comuns sobre modalidades, rede, cobertura e contratação na Amélia Saúde.",
    date: "31 Jul 2026", publishAt: "2026-07-31T18:00:00-03:00", readTime: "9 min", image: image("photo-1576091160550-2173dba999ef"),
    content: ["## Resposta direta", "A contratação depende do produto, da modalidade, da elegibilidade e das condições vigentes. Este FAQ ajuda a organizar perguntas, mas não substitui a proposta, o contrato, a consulta da rede ou a orientação oficial da Amélia Saúde e da ANS.", "## Quem pode contratar?", "Depende da modalidade. No coletivo por adesão, é necessário verificar o vínculo aceito com a entidade de classe ou categoria profissional. No empresarial, confira as regras para a empresa e os beneficiários. A resposta final deve vir do canal comercial oficial.", "## Como conferir a rede?", "Use o canal de consulta da operadora e filtre pelo produto e município. Confirme a informação antes de usar o serviço, pois rede, endereço e disponibilidade podem ser atualizados.", "## Como saber a cobertura?", "Leia a segmentação, o contrato e as condições do produto. Use a ANS como fonte regulatória e peça esclarecimentos sobre autorizações, carências e limitações antes da contratação.", "## A Amélia informa preço, carência e elegibilidade no blog?", "Não de forma universal. Esses dados dependem do produto e do perfil analisado. Publicar uma condição sem validação seria irresponsável; por isso, o blog explica critérios e direciona para o atendimento.", "## Próximo passo", "Conheça a Amélia Saúde e envie suas dúvidas para receber orientação sobre a opção adequada."],
    tags: ["Amélia Saúde", "FAQ", "contratação"], author: "Equipe Amélia Saúde", reviewer: "Validação comercial e regulatória pendente", updatedAt: "31 Jul 2026", sources: [amelia, ans], cta: { label: "Conheça a Amélia", href: "/#contato", event: "blog_cta_marca" },
  },
  {
    slug: "plano-saude-empresarial-como-funciona",
    category: "Planos empresariais",
    title: "Plano de saúde empresarial: como funciona, carências e quem pode contratar",
    excerpt: "Entenda como funciona o plano de saúde coletivo empresarial, quem pode contratar, as regras de carência e quem paga a mensalidade. Guia prático para MEI, micro e pequenas empresas.",
    date: "01 Aug 2026",
    readTime: "8 min",
    image: image("photo-1454165804606-c3d57bc86b40"),
    content: [
      "## Resposta direta",
      "O plano de saúde coletivo empresarial é um benefício contratado por uma empresa com CNPJ ativo para sócios e funcionários. A operadora exige um número mínimo de vidas — normalmente duas ou três, variando por produto. A empresa pode subsidiar parte ou toda a mensalidade, e em contratações com 30 ou mais vidas a carência pode ser integralmente isenta, conforme previsto nas regras da ANS.",

      "## O que é plano de saúde coletivo empresarial?",
      "É a modalidade em que uma empresa — pessoa jurídica com CNPJ ativo — contrata o plano de saúde para um grupo de beneficiários vinculados a ela: sócios, administradores e funcionários com vínculo empregatício. A operadora firma contrato com a empresa, não com cada beneficiário individualmente. Por isso, as condições, a rede e o reajuste são negociados no contrato coletivo, e não seguem as mesmas regras do plano individual ou familiar.",

      "## Quem pode contratar?",
      "Qualquer empresa com CNPJ ativo pode contratar plano empresarial. As regras de elegibilidade variam conforme a operadora e o produto:",

      "- **MEI (Microempreendedor Individual):** algumas operadoras aceitam a partir de 1 ou 2 vidas — o titular e, se houver, um dependente ou funcionário.",
      "- **Micro e pequenas empresas:** a partir de 2 ou 3 vidas, com mixes entre sócios e colaboradores.",
      "- **Médias e grandes empresas:** negociação ampla, com contratos customizados e pool de risco próprio.",

      "O essencial é que a empresa exista formalmente e que os beneficiários tenham vínculo comprovado com o CNPJ contratante.",

      "## Como funciona a contratação?",
      "O processo segue etapas definidas pela operadora e pela ANS:",

      "1. **Solicitação de proposta:** a empresa informa o perfil dos beneficiários (quantidade, faixa etária, tipo de cobertura desejada).",
      "2. **Análise e precificação:** a operadora avalia o risco da carteira e apresenta as condições comerciais — mensalidade, coparticipação, rede e carências aplicáveis.",
      "3. **Documentação da empresa:** contrato social, CNPJ, comprovante de endereço e, em alguns casos, comprovante de faturamento.",
      "4. **Documentação dos beneficiários:** RG, CPF e comprovante de vínculo com a empresa (pró-labore, holerite ou declaração).",
      "5. **Assinatura do contrato e início da vigência:** após aprovação da documentação e pagamento da primeira mensalidade.",

      "Todo o processo deve ser documentado. Guarde proposta, contrato, comprovantes e protocolos de comunicação com a operadora.",

      "## Plano empresarial tem carência?",
      "Depende do tamanho do grupo contratante e das condições negociadas. A regra geral da ANS para planos novos prevê:",

      "| Tipo de cobertura | Carência máxima |",
      "|---|---|",
      "| Urgência e emergência | 24 horas |",
      "| Consultas e exames simples | 180 dias |",
      "| Cirurgias e internações | 180 dias |",
      "| Parto | 300 dias |",

      "**Isenção possível:** se a empresa contratar com 30 ou mais beneficiários desde o início da vigência, a carência pode ser integralmente dispensada. Algumas operadoras estendem a isenção para grupos a partir de 10 vidas — é ponto de negociação contratual.",

      "Importante: doença ou lesão preexistente declarada pode ter carência específica de até 24 meses, conforme avaliação da operadora e regras da ANS.",

      "## Quem paga a mensalidade?",
      "A empresa é a contratante e a responsável financeira perante a operadora. Como o custo chega a cada beneficiário depende da política interna:",

      "- **Subsídio total:** a empresa paga 100% da mensalidade de todos os beneficiários.",
      "- **Subsídio parcial:** a empresa paga uma parte e o beneficiário complementa (modelo mais comum).",
      "- **Sem subsídio:** o beneficiário paga integralmente, mas o contrato segue em nome da empresa.",

      "No caso do MEI, é comum o titular arcar com o custo integral, descontando do pró-labore.",

      "## Checklist: documentos para contratar",
      "Antes de abrir uma proposta, organize:",

      "- CNPJ ativo e regular",
      "- Contrato social (ou certificado MEI)",
      "- Relação de beneficiários com nome, CPF e data de nascimento",
      "- Comprovante de vínculo de cada beneficiário com a empresa",
      "- Definição de quem será subsidiado e em qual proporção",
      "- Orçamento mensal disponível para o benefício",

      "## FAQ",
      "**MEI pode contratar plano empresarial com uma vida só?** Depende da operadora. Algumas aceitam 1 vida (o titular), outras exigem 2 ou mais. Consulte a condição vigente.",

      "**Tem carência para doença preexistente?** Sim. Doenças ou lesões declaradas no ato da contratação podem ter carência de até 24 meses, conforme avaliação da operadora.",

      "**Funcionário demitido perde o plano?** O ex-empregado tem direito de manter o plano por um período proporcional ao tempo de contribuição (Lei 9.656/98, art. 30 e 31), arcando com o custo integral.",

      "**Dá para incluir dependente no plano empresarial?** Sim. Cônjuge, filhos, enteados e, em alguns planos, pais. As regras e o custo adicional dependem do contrato.",

      "**Quanto tempo até começar a usar?** Após a assinatura e pagamento, a vigência começa na data contratada. As carências passam a contar da data de início da vigência.",

      "## Próximo passo",
      "Conheça as condições do plano empresarial da Amélia Saúde para o seu negócio."
    ],
    tags: ["plano empresarial", "carência", "MEI", "PME", "contratação"],
    author: "Equipe Amélia Saúde",
    reviewer: "Validação comercial e regulatória pendente",
    updatedAt: "01 Aug 2026",
    sources: [ans, amelia],
    cta: { label: "Fale com a Amélia", href: "/#contato", event: "blog_cta_empresarial" },
  },
  {
    slug: "plano-saude-empresarial-rj-precos-reajuste-comparar",
    category: "Planos empresariais",
    title: "Plano de saúde empresarial no RJ: preços, reajuste e como comparar propostas",
    excerpt: "Saiba como o preço do plano empresarial é formado, como funciona o reajuste e quais os 8 critérios para comparar propostas no Rio de Janeiro e Grande Rio.",
    date: "01 Aug 2026",
    readTime: "7 min",
    image: image("photo-1554224155-6726b3ff858f"),
    content: [
      "## Resposta direta",
      "O preço do plano empresarial no Rio de Janeiro depende de quatro fatores: número de vidas, faixa etária dos beneficiários, segmentação contratada (ambulatorial, hospitalar com ou sem obstetrícia) e rede credenciada. O reajuste anual é negociado entre a operadora e a empresa contratante — não segue o teto da ANS aplicável aos planos individuais. Comparar propostas exige olhar além da mensalidade e considerar carência, coparticipação, rede disponível e metodologia de reajuste.",

      "## Como o preço de um plano empresarial é formado?",
      "A precificação do plano empresarial segue a lógica de mutualismo: o risco é calculado sobre o grupo de beneficiários como um todo, não por pessoa. Os componentes principais são:",

      "- **Número de vidas:** quanto maior o grupo, mais o risco se dilui — o preço por vida tende a cair.",
      "- **Faixa etária:** a distribuição de idades do grupo impacta diretamente a sinistralidade esperada.",
      "- **Segmentação:** ambulatorial (consultas e exames), hospitalar sem obstetrícia e hospitalar com obstetrícia têm custos progressivos.",
      "- **Rede credenciada:** hospitais, clínicas e laboratórios incluídos — quanto mais abrangente, maior o custo.",
      "- **Coparticipação:** fator de desconto sobre a mensalidade em troca de pagamento por evento utilizado.",

      "A operadora cruza essas variáveis com a sinistralidade histórica da carteira para chegar ao valor final.",

      "## Quantas vidas mudam o preço?",
      "O número de vidas é o fator que mais altera o preço por beneficiário. Em termos práticos:",

      "| Faixa de vidas | Comportamento do preço |",
      "|---|---|",
      "| 2 a 9 vidas | Preço por vida mais alto. Risco concentrado. |",
      "| 10 a 29 vidas | Redução sensível. Diluição começa a operar. |",
      "| 30 a 99 vidas | Possibilidade de isenção de carência e desconto maior. |",
      "| 100+ vidas | Negociação corporativa. Contrato customizado. |",

      "A diferença entre uma empresa de 3 vidas e uma de 30 pode representar redução significativa no custo por beneficiário — é por isso que PMEs em crescimento renegociam o contrato quando a equipe aumenta.",

      "## Como funciona o reajuste no plano empresarial?",
      "Ao contrário do plano individual (cujo reajuste anual tem teto definido pela ANS), o plano empresarial tem reajuste negociado entre empresa e operadora. A metodologia padrão considera:",

      "- **Sinistralidade:** relação entre o valor pago em mensalidades e o custo dos serviços utilizados pelo grupo no período.",
      "- **Inflação médica (VCMH):** variação do custo dos procedimentos, materiais e serviços de saúde — historicamente acima da inflação geral.",
      "- **Faixa etária:** mudanças na pirâmide etária do grupo impactam o risco e o reajuste.",

      "O contrato deve especificar a metodologia de cálculo, a periodicidade e o índice de referência. Empresas com mais vidas têm mais poder de barganha para negociar tetos e condições de reajuste.",

      "## Coparticipação: reduz a mensalidade, mas exige atenção",
      "A coparticipação é um mecanismo em que o beneficiário paga um valor fixo ou um percentual por cada evento utilizado (consulta, exame, internação). Em troca, a mensalidade é reduzida.",

      "Exemplo conceitual: um plano com mensalidade de R$ 400 sem coparticipação pode custar R$ 280 com coparticipação de R$ 40 por consulta. Se o beneficiário faz 2 consultas/mês, o custo total sobe para R$ 360 — ainda abaixo do plano sem coparticipação. Mas se faz 5 consultas, o custo efetivo sobe para R$ 480.",

      "Antes de optar pela coparticipação, projete o uso esperado: quantas consultas, exames e procedimentos o grupo utiliza por mês?",

      "## Como comparar propostas de plano empresarial no RJ: 8 critérios",
      "Use este checklist ao avaliar propostas de operadoras diferentes:",

      "1. **Vidas mínimas:** qual o número exigido e ele se mantém? Se um funcionário sair e o grupo cair abaixo do mínimo, o contrato pode ser rescindido?",
      "2. **Carência:** há isenção? Em qual condição? Se não houver isenção, quais os prazos exatos?",
      "3. **Coparticipação:** valor fixo ou percentual? Há teto mensal ou anual de coparticipação?",
      "4. **Reajuste:** qual a metodologia? Há teto? O índice é composto (sinistralidade + VCMH) ou simples?",
      "5. **Rede no RJ e Grande Rio:** quantos hospitais, clínicas e laboratórios? Em quais bairros e municípios? A rede cobre deslocamentos rotineiros?",
      "6. **Segmentação:** ambulatorial, hospitalar sem obstetrícia ou hospitalar com obstetrícia? Qual atende o perfil do grupo?",
      "7. **Dependentes:** cônjuge, filhos, enteados e pais são aceitos? Qual o custo adicional por dependente?",
      "8. **Rescisão:** qual o prazo de aviso? Há multa? O contrato prevê portabilidade para os beneficiários?",

      "Compare as propostas lado a lado usando esses 8 critérios — a mensalidade é o ponto de partida, não o critério único.",

      "## FAQ",
      "**Plano empresarial é sempre mais barato que individual?** Não necessariamente. Grupos pequenos (2-3 vidas) podem ter custo próximo ao individual. A vantagem de preço aparece com 10+ vidas e na possibilidade de isenção de carência.",

      "**Dá para trocar de plano empresarial depois de contratar?** Sim, respeitando o prazo de aviso contratual. A portabilidade de carências pode ser exercida se os requisitos da ANS forem atendidos.",

      "**O que acontece com o preço se um funcionário sair?** A saída de um beneficiário reduz a receita do contrato, podendo impactar o reajuste no ciclo seguinte. Se o grupo cair abaixo do mínimo contratual, a operadora pode rescindir o contrato — verifique essa cláusula.",

      "**Reajuste por sinistralidade pode ser contestado?** Sim. A empresa tem direito de solicitar o demonstrativo de sinistralidade e auditar os números apresentados pela operadora.",

      "## Próximo passo",
      "Conheça as condições do plano empresarial da Amélia Saúde para o seu negócio no Rio de Janeiro."
    ],
    tags: ["plano empresarial", "preços", "reajuste", "Rio de Janeiro", "PME"],
    author: "Equipe Amélia Saúde",
    reviewer: "Validação comercial e regulatória pendente",
    updatedAt: "01 Aug 2026",
    sources: [ans, amelia],
    cta: { label: "Peça uma análise", href: "/#contato", event: "blog_cta_empresarial_precos" },
  },
  {
    slug: "plano-empresarial-ou-adesao-qual-escolher",
    category: "Planos empresariais",
    title: "Plano empresarial ou coletivo por adesão: qual faz sentido para sua empresa?",
    excerpt: "Comparação prática entre plano de saúde empresarial e coletivo por adesão. Entenda as diferenças de contratação, carência, reajuste e descubra qual faz sentido para o seu negócio.",
    date: "03 Aug 2026",
    readTime: "8 min",
    image: image("photo-1600880292203-757bb62b4baf"),
    content: [
      "## Resposta direta",
      "A escolha entre plano empresarial e coletivo por adesão depende do seu CNPJ. Se você tem empresa ativa com 2 ou mais vidas, o empresarial costuma ser o caminho mais direto — permite negociar carência, reajuste e subsídio da mensalidade. Se você é profissional autônomo sem CNPJ ou busca um custo mais previsível atrelado à sua categoria profissional, o plano por adesão pode ser a melhor alternativa. Abaixo, os critérios que decidem.",

      "## Tabela comparativa: empresarial x adesão",
      "| Critério | Empresarial | Coletivo por adesão |",
      "|---|---|---|",
      "| Quem contrata? | Pessoa jurídica (CNPJ ativo) | Pessoa física vinculada a entidade de classe |",
      "| Vínculo exigido | Trabalhista ou societário com a empresa | Associativo com sindicato, conselho ou associação |",
      "| Vidas mínimas | 2 a 3 (varia por operadora) | Normalmente 1 (o titular) |",
      "| Carência | Pode ser isenta com 30+ vidas | Segue regras padrão da ANS |",
      "| Reajuste | Negociado entre empresa e operadora | Regulado pela ANS (teto anual) |",
      "| Quem paga? | Empresa pode subsidiar parcial ou total | Beneficiário paga integralmente |",
      "| Portabilidade | Sim, respeitando prazos contratuais | Sim, com regras ANS facilitadas |",
      "| Coparticipação | Comum e negociável | Presente na maioria dos produtos |",
      "| Rede | Definida no contrato empresarial | Definida no contrato da entidade |",

      "## Quando o plano empresarial faz mais sentido",
      "O plano empresarial é vantajoso em cenários específicos:",

      "- **Retenção de talentos:** oferecer plano de saúde como benefício melhora a atratividade da empresa no mercado de trabalho.",
      "- **Subsídio flexível:** a empresa decide se paga 100%, 50% ou 0% da mensalidade de cada beneficiário — e pode variar por cargo ou tempo de casa.",
      "- **Isenção de carência:** com 30 ou mais vidas, a carência padrão pode ser dispensada — o grupo começa a usar o plano de imediato.",
      "- **Negociação direta:** reajuste, rede e coparticipação são negociados com a operadora, o que dá mais controle à empresa, especialmente a partir de 100 vidas.",
      "- **CNPJ ativo com 2+ pessoas:** se você já tem empresa com sócios ou funcionários, o empresarial é o encaixe natural.",

      "## Quando o coletivo por adesão é melhor",
      "O plano por adesão resolve situações que o empresarial não alcança:",

      "- **Autônomo sem CNPJ:** advogados, médicos, engenheiros e outros profissionais liberais que atuam como pessoa física podem contratar via OAB, CRM, CREA e outras entidades.",
      "- **Previsibilidade de reajuste:** o reajuste anual segue as regras da ANS, com teto regulado — previsível, sem surpresas de sinistralidade.",
      "- **Sem burocracia empresarial:** não exige contrato social, comprovante de faturamento ou vínculo trabalhista — basta ser associado à entidade.",
      "- **Portabilidade simplificada:** as regras de portabilidade para planos por adesão tendem a ser mais simples e com prazos mais curtos.",
      "- **Custo estável:** sem a variação de sinistralidade que impacta contratos empresariais pequenos, o custo tende a ser mais estável ano a ano.",

      "## MEI: pode escolher qualquer um?",
      "O MEI ocupa uma posição híbrida interessante. Por ter CNPJ, pode contratar o plano empresarial. Mas se tiver apenas 1 vida (o titular), nem toda operadora aceita. Nesse caso, o plano por adesão da categoria profissional é uma alternativa a considerar.",

      "A decisão do MEI passa por três perguntas:",
      "1. A operadora aceita MEI com 1 ou 2 vidas no empresarial?",
      "2. Minha categoria profissional tem entidade com plano por adesão vigente?",
      "3. Prefiro negociar reajuste direto com a operadora (empresarial) ou ter teto ANS (adesão)?",

      "## 5 perguntas para decidir",
      "Responda antes de abrir propostas:",

      "1. **Tenho CNPJ ativo e quantos beneficiários?** Se 2+ e todos têm vínculo comprovado, empresarial é a rota principal.",
      "2. **Quero subsidiar o custo para a equipe?** Se sim, empresarial. No plano por adesão, cada beneficiário paga o seu.",
      "3. **Minha categoria profissional tem entidade com plano vigente?** Se sim, peça a tabela e compare com o empresarial.",
      "4. **Prefiro negociar reajuste ou ter teto ANS?** Empresarial = negociação. Adesão = teto regulado.",
      "5. **A rede que me interessa está disponível em qual modalidade?** Confira a rede de cada produto antes de decidir — o hospital ou clínica que você prefere pode estar em um e não no outro.",

      "## FAQ",
      "**Posso migrar do empresarial para adesão depois?** Sim. A portabilidade de carências permite a migração entre modalidades, desde que atendidos os requisitos da ANS (prazo mínimo no plano atual, compatibilidade de segmentação e prazo de solicitação).",

      "**Qual costuma ter rede maior?** Não há regra fixa. A rede depende da operadora e do produto. Um plano empresarial premium pode ter rede maior que um plano por adesão básico, e vice-versa. Consulte a rede de cada proposta.",

      "**Empresarial sem carência é sempre possível?** Não. A isenção de carência exige 30+ vidas (regra ANS) ou condição negociada com a operadora. Grupos menores enfrentam as carências padrão.",

      "**Coparticipação existe nos dois?** Sim. Tanto planos empresariais quanto por adesão podem ter coparticipação. O percentual ou valor fixo depende do produto e da negociação.",

      "**Qual é mais barato?** Depende. Um empresarial de 2-3 vidas pode custar próximo de um plano por adesão. A diferença de preço aparece na escala: empresarial com 30+ vidas tende a ser mais barato por beneficiário, e o subsídio da empresa reduz o custo percebido por cada um.",

      "## Próximo passo",
      "Fale com a Amélia Saúde. Explique o perfil do seu negócio ou da sua categoria profissional e receba orientação sobre a modalidade mais adequada."
    ],
    tags: ["plano empresarial", "plano por adesão", "comparação", "MEI", "PME", "adesão"],
    author: "Equipe Amélia Saúde",
    reviewer: "Validação comercial e regulatória pendente",
    updatedAt: "03 Aug 2026",
    sources: [ans, amelia],
    cta: { label: "Fale com a Amélia", href: "/#contato", event: "blog_cta_empresarial_adesao" },
  },
  {
    slug: "plano-saude-empresarial-carencias-guia-completo",
    category: "Planos empresariais",
    title: "Plano de saúde empresarial: guia completo de carências, prazos e isenções",
    excerpt: "Entenda os prazos de carência no plano empresarial, quando a isenção é possível e como funciona a regra para doenças preexistentes. Guia atualizado com as normas da ANS.",
    date: "01 Aug 2026",
    readTime: "8 min",
    image: image("photo-1576091160399-112ba8d25d1d"),
    content: [
      "## Resposta direta",
      "No plano de saúde empresarial, os prazos máximos de carência são definidos pela ANS: 24 horas para urgência e emergência, 180 dias para consultas, exames e cirurgias, e 300 dias para parto. A grande vantagem do empresarial é que, em contratações com 30 ou mais vidas, a carência pode ser integralmente isenta. Em grupos menores, a isenção parcial pode ser negociada contratualmente. Já doenças preexistentes declaradas podem ter cobertura parcial temporária de até 24 meses.",

      "## O que é carência e por que ela existe?",
      "Carência é o período que o beneficiário precisa esperar após a contratação para usar determinadas coberturas. Ela existe para proteger o equilíbrio financeiro do plano: sem carência, pessoas contratariam o plano já doentes, usariam serviços caros e cancelariam em seguida — o que inviabilizaria o sistema de mutualismo.",

      "## Prazos máximos de carência (ANS)",
      "A Lei 9.656/98 e as resoluções da ANS estabelecem os prazos máximos. Nenhum plano pode exceder esses limites:",
      "",
      "| Cobertura | Prazo máximo |",
      "|---|---|",
      "| Urgência e emergência | 24 horas |",
      "| Consultas médicas | 180 dias |",
      "| Exames simples | 180 dias |",
      "| Internações clínicas e cirúrgicas | 180 dias |",
      "| Procedimentos de alta complexidade | 180 dias |",
      "| Parto | 300 dias |",
      "| Doenças preexistentes (CPT) | Até 24 meses |",

      "## Quando a carência pode ser isenta no empresarial?",
      "A isenção de carência no plano empresarial não é automática — depende de condições específicas:",
      "",
      "**Grupo com 30 ou mais vidas:** a ANS prevê isenção total de carências. A operadora é obrigada a dispensar os prazos se o contrato for firmado nessa condição.",
      "**Grupo entre 10 e 29 vidas:** a isenção total ou parcial pode ser negociada entre a empresa e a operadora. Depende da política comercial e do perfil do grupo.",
      "**Grupo com menos de 10 vidas:** a isenção é rara e geralmente limitada a consultas eletivas. O mais comum é cumprimento integral dos prazos.",
      "",
      "Importante: a isenção só vale para o grupo inicial. Novos beneficiários que entrarem depois podem ter que cumprir carência, a menos que o contrato preveja o contrário.",

      "## Carência para doenças e lesões preexistentes (DLP)",
      "Se o beneficiário declarar uma condição de saúde prévia na contratação, a operadora pode aplicar a Cobertura Parcial Temporária (CPT):",
      "",
      "- Prazo máximo: 24 meses",
      "- Durante a CPT, apenas procedimentos relacionados àquela condição específica ficam suspensos",
      "- Após os 24 meses, a cobertura passa a ser integral",
      "- A operadora não pode recusar o beneficiário — só aplicar a CPT",
      "",
      "Dica prática: nunca omita condição prévia na declaração de saúde. Fraude contratual pode levar à suspensão total da cobertura ou rescisão do contrato.",

      "## Portabilidade: como trocar de plano sem cumprir nova carência",
      "Se você já tem um plano de saúde há pelo menos 2 anos (ou 3 anos se tiver cumprido CPT), pode exercer a portabilidade de carências:",
      "",
      "- O novo plano não pode exigir novos prazos de carência",
      "- A portabilidade vale para planos compatíveis (mesma segmentação e faixa de preço)",
      "- É preciso estar em dia com a mensalidade e dentro do prazo de permanência mínima",
      "- O processo é regulado pela ANS e pode ser consultado no Guia ANS de Planos de Saúde",

      "## Checklist: o que perguntar sobre carência antes de contratar",
      "- Qual o prazo de carência para cada tipo de cobertura?",
      "- Existe isenção de carência? Em que condições?",
      "- Novos funcionários que entrarem depois terão que cumprir carência?",
      "- Como funciona a CPT para quem tem condição preexistente?",
      "- Se eu trocar de plano depois de 2 anos, consigo portar a carência?",
      "- O contrato tem cláusula de carência para rescisão e nova contratação?",

      "## FAQ",
      "**Plano empresarial sempre tem carência?** Não. Grupos com 30+ vidas têm isenção garantida pela ANS. Grupos menores podem negociar isenção parcial.",
      "**Carência conta a partir da assinatura ou da vigência?** A partir do início da vigência do contrato, que pode ser alguns dias após a assinatura.",
      "**Se eu sair da empresa e entrar em outra, cumpro carência de novo?** Sim, a menos que você exerça portabilidade de carências entre os planos.",
      "**Cirurgia de urgência durante a carência — é coberta?** Sim. Urgência e emergência têm carência máxima de 24 horas.",

      "## Próximo passo",
      "Fale com a Amélia Saúde para entender as condições de carência do plano empresarial adequado à sua empresa."
    ],
    tags: ["plano empresarial", "carência", "ANS", "isenção", "portabilidade"],
    author: "Equipe Amélia Saúde",
    reviewer: "Validação comercial e regulatória pendente",
    updatedAt: "01 Aug 2026",
    sources: [ans],
    cta: { label: "Fale com a Amélia", href: "/#contato", event: "blog_cta_carencia_empresarial" },
  },
  {
    slug: "plano-saude-mei-pequenas-empresas-rj",
    category: "Planos empresariais",
    title: "Plano de saúde para MEI e pequenas empresas no RJ: quantas vidas, preço e como contratar",
    excerpt: "Guia prático para MEI e pequenas empresas contratarem plano de saúde empresarial no Rio de Janeiro. Entenda quantas vidas são exigidas, como o preço é calculado e o passo a passo da contratação.",
    date: "01 Aug 2026",
    readTime: "8 min",
    image: image("photo-1556761175-b413da4baf72"),
    content: [
      "## Resposta direta",
      "MEIs e pequenas empresas com CNPJ ativo podem contratar plano de saúde empresarial a partir de 1 ou 2 vidas, dependendo da operadora. O MEI titular conta como 1 vida; se houver um funcionário registrado ou um dependente, fecha as 2 vidas exigidas por muitas operadoras. O preço segue a lógica do grupo: quanto mais vidas, menor o custo por beneficiário. A contratação exige CNPJ ativo, documento dos beneficiários e, em alguns casos, comprovação de faturamento.",

      "## MEI pode contratar plano empresarial com 1 vida só?",
      "Depende da operadora e do produto. Algumas aceitam MEI com apenas o titular (1 vida), especialmente em produtos voltados para o microempreendedor. Outras exigem no mínimo 2 vidas — o titular mais um dependente, sócio ou funcionário.",
      "",
      "Na prática:",
      "- **1 vida:** produtos específicos para MEI, com cobertura enxuta e rede regional. Disponibilidade menor.",
      "- **2 vidas:** o titular + cônjuge, filho(a) ou um funcionário registrado. Já abre um leque maior de operadoras.",
      "- **3 vidas ou mais:** acesso à maioria dos produtos empresariais do mercado, com melhores condições de preço e rede.",

      "## Quantas vidas são exigidas para cada porte?",
      "| Porte da empresa | Vidas mínimas típicas | Observação |",
      "|---|---|---|",
      "| MEI (1 pessoa) | 1 a 2 | Operadoras que aceitam 1 vida são minoria |",
      "| Microempresa (até 9 funcionários) | 2 a 3 | Com 3 vidas, acesso à maioria dos produtos |",
      "| Pequena empresa (10 a 49) | 3 a 5 | Negociação de isenção de carência possível |",
      "| Média empresa (50 a 99) | 5 a 10 | Pool de risco próprio, preços mais competitivos |",

      "## Como o preço é calculado para MEI e pequenas empresas?",
      "O preço por vida no plano empresarial segue uma lógica inversa ao número de beneficiários:",
      "",
      "- **2 a 9 vidas:** preço por vida mais alto. O risco é concentrado em poucas pessoas.",
      "- **10 a 29 vidas:** preço começa a cair. A diluição do risco melhora a condição.",
      "- **30 ou mais vidas:** preço mais competitivo + isenção de carência.",
      "",
      "Além do número de vidas, pesam no preço: faixa etária média do grupo, segmentação (ambulatorial, hospitalar, com/sem obstetrícia), coparticipação e rede credenciada.",

      "## Passo a passo para contratar",
      "1. **Reúna os documentos:** CNPJ ativo, contrato social (ou certificado MEI), comprovante de endereço da empresa, RG e CPF dos beneficiários.",
      "2. **Defina o perfil do grupo:** quantas vidas, faixas etárias, tipo de cobertura desejada.",
      "3. **Solicite propostas:** peça cotações para 2 ou 3 operadoras. Compare além do preço: carência, coparticipação, reajuste e rede.",
      "4. **Analise as condições:** confira rede credenciada no Rio de Janeiro e Grande Rio, regras de reajuste, carência e inclusão futura de dependentes.",
      "5. **Formalize o contrato:** a empresa assina como contratante. Cada beneficiário preenche a declaração de saúde individual.",
      "6. **Aguarde a vigência:** após análise e aprovação da operadora, o plano entra em vigor na data contratual.",

      "## Cuidados específicos para MEI",
      "- **Vínculo trabalhista não é obrigatório:** o MEI titular pode incluir a si mesmo como beneficiário sem ter funcionários.",
      "- **Dependentes contam como vidas:** cônjuge e filhos podem ser incluídos e contam para o número mínimo de vidas.",
      "- **Faturamento pode ser exigido:** algumas operadoras pedem comprovante dos últimos meses para validar a capacidade de pagamento.",
      "- **Pró-labore não é obrigatório:** você pode pagar o plano como despesa da empresa, não precisa ter pró-labore formal.",

      "## Checklist: o que comparar entre propostas",
      "- Número mínimo de vidas exigido",
      "- Carência: há isenção? Em que condição?",
      "- Coparticipação: valor por consulta/exame e teto mensal",
      "- Reajuste: metodologia (sinistralidade, VCMH, IPCA) e teto contratual",
      "- Rede no RJ: hospitais, laboratórios e clínicas na sua região",
      "- Inclusão de dependentes: regras, carência extra e custo adicional",
      "- Rescisão: prazo de aviso, multa e condições de saída",

      "## FAQ",
      "**MEI paga mais caro que empresa maior?** Em geral, sim — por vida. Grupos pequenos têm menos poder de negociação e o risco é mais concentrado.",
      "**Dá para contratar só para o sócio e não para os funcionários?** Não. Se a empresa tem funcionários, todos devem ser incluídos ou a operadora pode recusar. O plano é do grupo, não individual.",
      "**Posso trocar de operadora depois de contratado?** Sim, respeitando o prazo contratual de aviso prévio. Se tiver mais de 2 anos de plano, pode usar portabilidade de carências.",
      "**MEI sem faturamento consegue contratar?** Improvável. A operadora avalia risco de inadimplência.",

      "## Próximo passo",
      "Envie o perfil da sua empresa para a Amélia Saúde e receba orientação sobre as opções disponíveis para MEI e pequenas empresas no Rio de Janeiro."
    ],
    tags: ["MEI", "pequena empresa", "plano empresarial", "Rio de Janeiro", "contratação"],
    author: "Equipe Amélia Saúde",
    reviewer: "Validação comercial e regulatória pendente",
    updatedAt: "01 Aug 2026",
    sources: [ans, amelia],
    cta: { label: "Peça uma análise", href: "/#contato", event: "blog_cta_mei_pequenas" },
  },
];

export const blogPosts: BlogPost[] = [...legacyPosts, ...scheduledPosts];

const MONTH_MAP: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

/** Timestamp for sorting/sitemap — prefers publishAt, then human date field. */
export function getPostTimestamp(post: BlogPost): number {
  if (post.publishAt) return new Date(post.publishAt).getTime();
  const [day, mon, year] = post.date.split(" ");
  const month = MONTH_MAP[mon];
  if (day && month && year) {
    return new Date(`${year}-${month}-${day.padStart(2, "0")}T12:00:00-03:00`).getTime();
  }
  return 0;
}

export function getPostIsoDate(post: BlogPost): string {
  const ts = getPostTimestamp(post);
  return ts ? new Date(ts).toISOString() : new Date().toISOString();
}

export function isPostPublished(post: BlogPost, now = new Date()): boolean {
  return !post.publishAt || new Date(post.publishAt).getTime() <= now.getTime();
}

export function getPublishedPosts(now = new Date()): BlogPost[] {
  return blogPosts
    .filter((post) => isPostPublished(post, now))
    .sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a));
}

export function getPostBySlug(slug: string, now = new Date()): BlogPost | undefined {
  const post = blogPosts.find((item) => item.slug === slug);
  return post && isPostPublished(post, now) ? post : undefined;
}

export function getAllSlugs(now = new Date()): string[] {
  return getPublishedPosts(now).map((post) => post.slug);
}

export function getPostsByCategory(category: string, now = new Date()): BlogPost[] {
  return getPublishedPosts(now).filter((post) => post.category === category);
}

export function getPostsByTag(tag: string, now = new Date()): BlogPost[] {
  return getPublishedPosts(now).filter((post) => post.tags.includes(tag));
}

export function searchPosts(query: string, now = new Date()): BlogPost[] {
  const lowerQuery = query.toLowerCase();
  return getPublishedPosts(now).filter((post) => post.title.toLowerCase().includes(lowerQuery) || post.excerpt.toLowerCase().includes(lowerQuery) || post.content.some((p) => p.toLowerCase().includes(lowerQuery)));
}

export function getAllTags(now = new Date()): string[] {
  const tagsSet = new Set<string>();
  getPublishedPosts(now).forEach((post) => post.tags.forEach((tag) => tagsSet.add(tag)));
  return Array.from(tagsSet).sort();
}

export function getCategories(now = new Date()): { name: string; count: number }[] {
  const categories: Record<string, number> = {};
  getPublishedPosts(now).forEach((post) => { categories[post.category] = (categories[post.category] || 0) + 1; });
  return Object.entries(categories).map(([name, count]) => ({ name, count }));
}
