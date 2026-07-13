export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  content: string[];
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "5-dicas-nutricao-dia-a-dia",
    category: "Nutrição",
    title: "5 dicas práticas de nutrição para o dia a dia",
    excerpt:
      "Alimentar-se bem não precisa ser complicado. Veja como incluir hábitos saudáveis na sua rotina com pequenas mudanças que fazem diferença.",
    date: "15 Mar 2026",
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=600&fit=crop&q=80",
    content: [
      "Manter uma alimentação equilibrada é um dos pilares mais importantes para quem busca qualidade de vida. Mas entre a rotina de trabalho, compromissos familiares e imprevistos, pode parecer difícil acertar no cardápio todos os dias.",
      "A boa notícia é que uma nutrição de qualidade não depende de receitas complexas ou ingredientes caros. Pequenas escolhas, repetidas com consistência, geram resultados profundos na sua energia, disposição e saúde a longo prazo.",
      "## Comece o dia com um café da manhã equilibrado",
      "Pular o café da manhã é um dos erros mais comuns. Sem nutrientes pela manhã, o corpo opera em modo de economia, reduzindo o metabolismo e aumentando a compulsão por carboidratos simples no fim do dia.",
      "Um café da manhã ideal combina três elementos:",
      "### Proteína para saciedade prolongada",
      "Ovos, iogurte natural ou queijo branco são fontes de proteína que mantêm a saciedade até o almoço. Estudos mostram que um café da manhã proteico reduz em até 30% a ingestão calórica no almoço.",
      "### Carboidratos de qualidade para energia",
      "Opte por pães integrais, aveia ou frutas. Aveia com frutas vermelhas, por exemplo, fornece fibras solúveis que ajudam a controlar o colesterol e a glicemia.",
      "### Gorduras boas para o cérebro",
      "Abacate, castanhas ou sementes trazem gorduras monoinsaturadas que favorecem a saúde cognitiva. Um quarto de abacate já é suficiente.",
      "## Planeje suas refeições no domingo",
      "O planejamento semanal (meal prep) é a estratégia mais eficaz contra decisões impulsivas. Reserve uma hora no domingo para: lavar e picar verduras, cozinhar grãos (quinoa, arroz integral) e porcionar proteínas.",
      "Você não precisa cozinhar todas as refeições — apenas deixar ingredientes prontos para montagem rápida reduz significativamente a chance de pedir comida ultraprocessada.",
      "## Faça do almoço um prato colorido",
      "Um prato equilibrado visualmente também é equilibrado nutricionalmente. A regra prática recomendada por nutricionistas é: metade do prato com vegetais variados, um quarto com proteína magra e um quarto com carboidrato complexo.",
      "## Hidrate-se adequadamente ao longo do dia",
      "A sede é muitas vezes confundida com fome. Manter uma garrafa de água por perto e estabelecer metas simples — beber um copo ao acordar, outro antes do café e dois entre as refeições — ajuda a atingir a hidratação ideal sem esforço.",
      "## Não elimine grupos alimentares sem orientação",
      "Dietas restritivas da moda costumam eliminar carboidratos ou gorduras, mas a ciência da nutrição mostra que o equilíbrio é mais eficaz para resultados duradouros. Consulte sempre um nutricionista antes de fazer mudanças radicais.",
      "Pequenas mudanças, consistentes no tempo, transformam a saúde. Comece com uma dica hoje e adicione outra na próxima semana — o importante é começar.",
    ],
    tags: ["nutrição", "hábitos saudáveis", "alimentação balanceada", "qualidade de vida"],
  },
  {
    slug: "importancia-exercicio-fisico",
    category: "Exercícios",
    title: "A importância do exercício físico para a saúde mental",
    excerpt:
      "Descubra como movimentar o corpo pode reduzir o estresse e melhorar sua qualidade de vida. Os benefícios vão muito além da estética.",
    date: "12 Mar 2026",
    readTime: "5 min",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=600&fit=crop&q=80",
    content: [
      "Quando pensamos em exercício físico, é comum que a primeira imagem que venha à mente seja relacionada à estética ou ao condicionamento cardiovascular. No entanto, os benefícios mais profundos da atividade física regular estão na saúde mental.",
      "Diversos estudos científicos comprovam que o exercício é tão eficaz quanto medicamentos antidepressivos leves para quadros de ansiedade leve a moderada — com a vantagem de não ter efeitos colaterais químicos.",
      "## Como o exercício age no cérebro",
      "### Liberação de neurotransmissores essenciais",
      "Durante a atividade física, o cérebro libera endorfina, serotonina e dopamina — substâncias responsáveis pela sensação de bem-estar e prazer. Esse processo químico natural é um dos mecanismos mais eficazes para combater sintomas de depressão e ansiedade.",
      "### Redução do cortisol",
      "O cortisol, conhecido como o hormônio do estresse, tem seus níveis reduzidos significativamente após 30 a 45 minutos de atividade aeróbica moderada. Uma caminhada em ritmo acelerado já é suficiente para ativar essa resposta.",
      "### Neurogênese hipocampal",
      "A prática regular de exercícios estimula a produção de BDNF (fator neurotrófico derivado do cérebro), proteína fundamental para a criação de novos neurônios e conexões sinápticas. O hipocampo — região associada à memória e ao controle emocional — é uma das áreas mais beneficiadas.",
      "## Tipos de exercício e seus efeitos na saúde mental",
      "### Aeróbicos (caminhada, corrida, natação, bicicleta)",
      "Mais eficazes para redução de ansiedade e depressão. A recomendação é de pelo menos 150 minutos por semana de atividade moderada, ou 75 minutos de atividade intensa.",
      "### Treinamento de força (musculação, pilates, funcional)",
      "Melhora a autoestima e a imagem corporal. Também contribui para o controle da ansiedade, com benefícios adicionais para a qualidade do sono.",
      "### Práticas mente-corpo (yoga, tai chi, alongamento)",
      "Reduzem o cortisol e ativam o sistema nervoso parassimpático, responsável pelo relaxamento. Particularmente indicadas para pessoas com altos níveis de estresse crônico.",
      "## Como começar sem sobrecarga",
      "O erro mais comum de quem inicia a prática de exercícios é querer resultados rápidos com treinos intensos. Isso geralmente leva à desistência em poucas semanas. O caminho mais eficaz é começar com atividades prazerosas, de baixa intensidade, e aumentar gradualmente a frequência e a duração.",
      "Uma caminhada de 20 minutos, três vezes por semana, já produz efeitos mensuráveis na saúde mental após quatro semanas. O segredo é a consistência, não a intensidade.",
    ],
    tags: ["exercícios", "saúde mental", "bem-estar", "ansiedade", "atividade física"],
  },
  {
    slug: "sono-e-bem-estar",
    category: "Bem-estar",
    title: "Como uma boa noite de sono transforma o seu corpo",
    excerpt:
      "Dormir bem é tão importante quanto uma boa alimentação e a prática de exercícios para a saúde física e mental. Veja como otimizar seu sono.",
    date: "08 Mar 2026",
    readTime: "7 min",
    image:
      "https://images.unsplash.com/photo-1541480601022-2308c0f02487?w=1200&h=600&fit=crop&q=80",
    content: [
      "O sono de qualidade é um dos pilares mais subestimados da saúde. Dormir bem não é um luxo — é uma necessidade biológica fundamental para a reparação celular, o equilíbrio hormonal e a consolidação da memória.",
      "A ciência do sono mostra que uma noite mal dormida afeta desde o sistema imunológico até a capacidade de tomada de decisões. A longo prazo, a privação crônica de sono está associada a doenças cardiovasculares, obesidade e declínio cognitivo.",
      "## O que acontece durante o sono",
      "### Reparação celular e liberação de GH",
      "Durante o sono profundo (estágio N3), o corpo libera o hormônio do crescimento (GH), essencial para a reparação de tecidos, fortalecimento muscular e manutenção da densidade óssea. É também nessa fase que o sistema imunológico produz citocinas, proteínas que combatem infecções e inflamações.",
      "### Consolidação da memória",
      "O sono REM é o momento em que o cérebro processa e armazena as informações do dia. É por isso que uma boa noite de sono antes de uma prova ou apresentação melhora significativamente o desempenho cognitivo.",
      "### Regulação hormonal",
      "O sono insuficiente desregula a grelina e a leptina — hormônios que controlam a fome e a saciedade — levando a maior compulsão por alimentos calóricos. Dormir menos de 6 horas por noite aumenta em até 30% o risco de obesidade.",
      "## Quanto sono cada fase da vida exige",
      "Adultos jovens (18-25 anos): 7 a 9 horas. Adultos (26-64 anos): 7 a 9 horas. Acima de 65 anos: 7 a 8 horas, com qualidade mais relevante que quantidade.",
      "## Hábitos para melhorar a qualidade do sono",
      "### Higiene do sono — o que fazer",
      "Estabeleça horários fixos para dormir e acordar, mesmo nos fins de semana. Evite telas (celular, tablet, TV) pelo menos 1 hora antes de deitar — a luz azul inibe a produção de melatonina, hormônio do sono. Mantenha o quarto escuro, silencioso e com temperatura entre 18 e 22 graus.",
      "### O que evitar antes de dormir",
      "Refeições pesadas até 3 horas antes de deitar. Cafeína após as 16h. Álcool — embora ajude a adormecer, fragmenta o sono profundo e reduz a qualidade do descanso.",
      "### O papel dos exercícios na qualidade do sono",
      "A prática regular de atividade física é um dos gatilhos naturais mais poderosos para um sono profundo. A recomendação é fazer exercícios pela manhã ou à tarde — atividades muito próximas da hora de dormir podem ter efeito estimulante em algumas pessoas.",
    ],
    tags: ["sono", "bem-estar", "saúde", "higiene do sono", "insônia"],
  },
  {
    slug: "hidratacao-corporal",
    category: "Bem-estar",
    title: "A importância da hidratação para o organismo",
    excerpt:
      "A água é essencial para o funcionamento de todas as células do nosso corpo. Descubra os benefícios de se manter hidratado e quanto consumir por dia.",
    date: "05 Mar 2026",
    readTime: "5 min",
    image:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=1200&h=600&fit=crop&q=80",
    content: [
      "A água é o componente mais abundante do corpo humano — representa cerca de 60% do peso corporal de um adulto. Cada célula, tecido e órgão depende da hidratação adequada para funcionar corretamente.",
      "Apesar dessa importância fundamental, a maioria das pessoas não ingere água suficiente ao longo do dia. A desidratação crônica — mesmo que leve — está associada a fadiga, dores de cabeça, baixa concentração e até problemas digestivos.",
      "## Benefícios da hidratação adequada",
      "### Regulação da temperatura corporal",
      "Através da transpiração, a água mantém a temperatura do corpo estável, evitando hipertermia durante exercícios físicos ou dias quentes. Uma perda de apenas 1% do peso corporal em água já afeta a capacidade de regulação térmica.",
      "### Transporte de nutrientes e oxigênio",
      "A água é o principal componente do plasma sanguíneo, responsável por levar nutrientes, vitaminas e oxigênio para todas as células do corpo. Sem hidratação adequada, o sangue fica mais viscoso e o coração precisa trabalhar mais.",
      "### Eliminação de toxinas",
      "Os rins filtram cerca de 180 litros de sangue por dia para eliminar resíduos metabólicos através da urina. A hidratação insuficiente sobrecarrega os rins e pode levar à formação de cálculos renais.",
      "### Saúde da pele e articulações",
      "A pele hidratada mantém sua elasticidade e barreira protetora. O líquido sinovial, que lubrifica as articulações, é composto principalmente por água — articulações desidratadas são mais suscetíveis a atritos e lesões.",
      "## Quanto beber por dia",
      "A recomendação geral da Organização Mundial da Saúde é de 2 a 3 litros de água por dia para adultos. No entanto, essa necessidade varia conforme peso corporal, nível de atividade física e clima.",
      "### Dicas práticas",
      "Comece o dia com um copo de água ao acordar. Mantenha uma garrafa reutilizável por perto durante o trabalho. Use aplicativos ou alarmes no celular para lembrar de beber água. Prefira água pura a sucos industrializados e refrigerantes. Inclua alimentos ricos em água na dieta, como melancia, pepino, alface e tomate.",
      "A hidratação é um hábito simples, mas com impacto profundo na saúde. A diferença entre um corpo hidratado e um desidratado é sentida em todos os aspectos do bem-estar.",
    ],
    tags: ["hidratação", "água", "bem-estar", "saúde", "nutrição"],
  },
  {
    slug: "meditacao-reduzir-ansiedade",
    category: "Bem-estar",
    title: "Meditação: uma aliada contra a ansiedade",
    excerpt:
      "Práticas de mindfulness e meditação podem ajudar significativamente a reduzir os níveis de ansiedade no dia a dia. Aprenda como começar.",
    date: "01 Mar 2026",
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=600&fit=crop&q=80",
    content: [
      "A ansiedade é uma das condições de saúde mental mais comuns da atualidade. No Brasil, segundo a Organização Mundial da Saúde, cerca de 9% da população sofre de transtornos de ansiedade — o maior índice do mundo.",
      "Diante desse cenário, a meditação tem ganhado cada vez mais espaço como ferramenta complementar de cuidado. Estudos conduzidos por universidades como Harvard e Oxford mostram que oito semanas de prática regular de mindfulness são capazes de reduzir sintomas de ansiedade em até 60%.",
      "## O que a meditação faz no cérebro",
      "### Redução da atividade da amígdala",
      "A amígdala cerebral é a região responsável pelo processamento do medo e da resposta de luta ou fuga. A meditação regular reduz a atividade da amígdala e fortalece a conexão dela com o córtex pré-frontal — área associada ao raciocínio e ao controle emocional.",
      "### Aumento da massa cinzenta",
      "Pesquisas de neuroimagem da Universidade de Harvard demonstraram que oito semanas de meditação aumentam a densidade de massa cinzenta no hipocampo (aprendizado e memória) e reduzem a densidade na amígdala (estresse e ansiedade).",
      "### Regulação do sistema nervoso autônomo",
      "A meditação ativa o sistema nervoso parassimpático, responsável pelo relaxamento e pela recuperação. Com a prática regular, o corpo aprende a alternar mais facilmente entre o estado de alerta e o de descanso.",
      "## Tipos de meditação para iniciantes",
      "### Mindfulness (atenção plena)",
      "A técnica mais estudada cientificamente. Consiste em focar a atenção na respiração e observar os pensamentos sem julgamento, trazendo a mente de volta ao momento presente sempre que ela divagar.",
      "### Meditação guiada",
      "Ideal para iniciantes. Utiliza gravações de áudio com instruções passo a passo. Aplicativos como Headspace, Lojong e Medite.se oferecem sessões guiadas em português.",
      "### Body scan (varredura corporal)",
      "Técnica que consiste em percorrer mentalmente cada parte do corpo, observando sensações físicas sem tentar modificá-las. Particularmente eficaz para ansiedade somática (tensão muscular, aperto no peito).",
      "## Como começar — 5 minutos por dia",
      "Ao contrário do que muitos pensam, meditar não requer esforço sobre-humano ou horas de prática. Cinco minutos diários são suficientes para começar a colher benefícios. O mais importante é a consistência: melhor cinco minutos todos os dias do que uma hora uma vez por mês.",
      "Sente-se confortavelmente, feche os olhos e concentre-se na sensação da respiração. Quando a mente divagar (e ela vai divagar), simplesmente traga a atenção de volta, sem se julgar. É no treino da atenção — e não no silêncio absoluto — que está o verdadeiro benefício.",
    ],
    tags: ["meditação", "saúde mental", "ansiedade", "mindfulness", "bem-estar", "qualidade de vida"],
  },
  {
    slug: "alimentos-anti-inflamatorios",
    category: "Nutrição",
    title: "Alimentos anti-inflamatórios que devem estar no seu prato",
    excerpt:
      "Conheça os principais alimentos que ajudam a combater a inflamação no organismo e prevenir doenças crônicas através de uma alimentação inteligente.",
    date: "25 Fev 2026",
    readTime: "7 min",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&h=600&fit=crop&q=80",
    content: [
      "A inflamação crônica de baixo grau é um dos mecanismos silenciosos por trás das doenças mais prevalentes da atualidade: diabetes tipo 2, doenças cardiovasculares, síndrome metabólica, artrite reumatoide e até depressão.",
      "A boa notícia é que a alimentação exerce um papel central na regulação do processo inflamatório. Certos alimentos contêm compostos bioativos capazes de reduzir marcadores inflamatórios no sangue, como a proteína C-reativa e as citocinas pró-inflamatórias.",
      "## O que é inflamação crônica",
      "Diferente da inflamação aguda (como a que ocorre quando você se corta ou torce o pé), a inflamação crônica opera em baixa intensidade, sem sintomas óbvios, ao longo de meses ou anos. O estilo de vida moderno — alimentação ultraprocessada, sedentarismo, estresse e sono insuficiente — é o principal combustível desse processo.",
      "## Os alimentos mais anti-inflamatórios",
      "### Cúrcuma (açafrão-da-terra)",
      "A curcumina, princípio ativo da cúrcuma, é um dos compostos anti-inflamatórios mais potentes da natureza. Para melhor absorção, consuma com pimenta-preta (a piperina aumenta a biodisponibilidade em até 2000%).",
      "### Peixes ricos em ômega-3",
      "Salmão, sardinha, cavala e atum são fontes de EPA e DHA, ácidos graxos que reduzem a produção de moléculas inflamatórias. A recomendação é de duas porções de peixe por semana.",
      "### Frutas vermelhas e roxas",
      "Mirtilo, morango, amora e framboesa contêm antocianinas, flavonoides com potente ação antioxidante e anti-inflamatória. Estudos mostram que o consumo regular reduz marcadores de inflamação e estresse oxidativo.",
      "### Vegetais crucíferos",
      "Brócolis, couve-flor, couve-de-bruxelas e repolho são ricos em sulforafano e indol-3-carbinol, compostos que ativam genes desintoxicantes e reduzem inflamação celular.",
      "### Azeite de oliva extravirgem",
      "Rico em oleocantal, composto com ação anti-inflamatória comparável ao ibuprofeno em baixas doses. Prefira azeites extravirgens prensados a frio.",
      "## Alimentos que aumentam a inflamação",
      "Para potencializar os efeitos dos alimentos anti-inflamatórios, é igualmente importante reduzir: açúcar refinado e carboidratos simples, óleos vegetais refinados (soja, milho, girassol), gorduras trans, carnes processadas e álcool em excesso.",
      "## Cardápio anti-inflamatório — exemplo de um dia",
      "Café da manhã: aveia com mirtilos, castanhas e canela. Almoço: salada de folhas escuras com salmão grelhado, cúrcuma e azeite. Lanche: iogurte natural com morangos e sementes de chia. Jantar: frango ao curry com brócolis no vapor e quinoa. Uma alimentação anti-inflamatória não é restritiva — ela convida a escolhas mais conscientas, coloridas e nutritivas a cada refeição.",
    ],
    tags: ["nutrição", "anti-inflamatório", "alimentação saudável", "prevenção", "cúrcuma", "ômega-3"],
  },
  {
    slug: "yoga-iniciantes",
    category: "Exercícios",
    title: "Yoga para iniciantes: por onde começar",
    excerpt:
      "Se você quer começar a praticar yoga mas não sabe por onde começar, este guia apresenta os fundamentos, benefícios e primeiros passos de forma simples e acessível.",
    date: "25 Fev 2026",
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=600&fit=crop&q=80",
    content: [
      "O yoga é uma prática milenar que combina posturas físicas, técnicas de respiração e meditação. Nos últimos anos, ganhou popularidade no Ocidente não como uma prática esotérica, mas como uma ferramenta comprovada para melhorar a flexibilidade, reduzir o estresse e aumentar a consciência corporal.",
      "Se você nunca praticou yoga, pode sentir-se intimidado pelas imagens de posturas avançadas. A realidade é que o yoga é acessível a qualquer pessoa, independentemente da idade, condicionamento físico ou flexibilidade inicial.",
      "## Benefícios do yoga comprovados pela ciência",
      "### Flexibilidade e mobilidade articular",
      "Diferente dos alongamentos convencionais, o yoga trabalha a flexibilidade em conjunto com a força, o que reduz o risco de lesões e melhora a amplitude de movimento de forma progressiva e segura.",
      "### Redução do estresse e da ansiedade",
      "A combinação de movimento consciente com respiração controlada ativa o sistema nervoso parassimpático, reduzindo os níveis de cortisol. Estudos da Universidade Johns Hopkins mostram que o yoga é tão eficaz quanto meditação guiada para redução de ansiedade.",
      "### Fortalecimento muscular e postura",
      "As posturas de yoga (ásanas) exigem ativação constante do core e dos músculos estabilizadores. Com a prática regular, a postura melhora naturalmente, aliviando dores lombares e tensionais.",
      "## As posturas fundamentais para iniciantes",
      "### Postura da montanha (Tadasana)",
      "Postura básica de pé que ensina o alinhamento corporal. Pés juntos, coluna alongada, ombros relaxados. Aparentemente simples, mas essencial para construir a base de todas as outras posturas.",
      "### Cão olhando para baixo (Adho Mukha Svanasana)",
      "Uma das posturas mais reconhecidas. Fortalece braços e pernas enquanto alonga a coluna e os posteriores da coxa. Fundamental para transições suaves entre posturas.",
      "### Postura da criança (Balasana)",
      "Postura de descanso que alonga a coluna lombar e promove relaxamento. Excelente para pausas durante a prática ou para momentos de estresse.",
      "### Postura do guerreiro I e II (Virabhadrasana)",
      "Fortalece pernas, quadris e core. Ensina a manter a estabilidade enquanto os braços estão estendidos, desenvolvendo equilíbrio e concentração.",
      "## Como montar sua primeira prática — 20 minutos",
      "Comece com uma prática simples: 3 minutos de respiração consciente sentado, 5 minutos de aquecimento (pescoço, ombros e coluna), 10 minutos de posturas básicas (montanha, cão olhando para baixo, postura da criança, guerreiro) e 2 minutos de relaxamento final (Savasana).",
      "O mais importante no yoga iniciante não é executar a postura \"perfeita\", mas desenvolver a consciência do próprio corpo e respeitar seus limites. Com consistência — mesmo que 15 minutos por dia — o progresso vem naturalmente.",
    ],
    tags: ["yoga", "iniciantes", "bem-estar", "flexibilidade", "exercícios", "saúde mental"],
  },
];

export interface Category {
  name: string;
  count: number;
}

export function getCategories(): Category[] {
  const map = new Map<string, number>();
  blogPosts.forEach((p) => map.set(p.category, (map.get(p.category) || 0) + 1));
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

export function getAllTags(): string[] {
  return [...new Set(blogPosts.flatMap((p) => p.tags))];
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
