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
