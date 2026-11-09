import React, { useState } from 'react';
import { StackedCards } from './StackedCards.jsx';
import { ArrowRight, ArrowUpRight, Building2, Check, MapPin, ShieldCheck, Users, Wallet, Zap } from 'lucide-react';
import { MUNICIPALITIES, NETWORK_HIGHLIGHTS, DUE_DAYS } from '../lib/sales-journey/materials';
import { LandingQuoteForm } from './LandingQuoteForm.jsx';
import './landing.css';

const landingPlans = [
  {
    id: 'empresarial', badge: 'Carioca 10 · Coletivo empresarial', title: 'Cuide de quem faz sua empresa acontecer.',
    body: 'O Carioca 10 PME é apresentado no treinamento para contratação coletiva empresarial. Conte sobre sua empresa e conheça as regras do produto no chat.', image: 'empresarial.jpg', href: '/planos/empresarial', Icon: Building2,
    bullets: ['Treinamento: grupos de 2 a 29 vidas', 'Vínculo com a pessoa jurídica a comprovar', 'Quarto coletivo e abrangência regional'],
    note: 'A tabela PME com coparticipação permite simular valores por idade. Elegibilidade, documentação e validade comercial precisam ser conferidas antes da proposta formal.',
    cta: 'Cotar para minha empresa',
  },
  {
    id: 'adesao', badge: 'Carioca 10 · Coletivo por adesão', title: 'Cuidado para você e sua família, por adesão.',
    body: 'O material apresenta Adesão para profissionais liberais e servidores públicos, conforme vínculo e documentação elegíveis. Conheça as duas opções da tabela recebida.', image: 'adesao.jpg', href: '/planos/adesao', Icon: Users,
    bullets: ['Opção com coparticipação em terapias', 'Opção sem coparticipação', 'Simulação por faixa etária no chat'],
    note: 'A simulação usa os preços impressos e não confirma periodicidade, vigência ou elegibilidade. A lista de profissões/entidades e as condições finais precisam ser confirmadas.',
    cta: 'Cotar um plano por adesão',
  },
];
const landingBenefits = [
  { title: 'Cuidado para sua rotina', body: 'Conheça as coberturas do produto e confira suas condições antes de contratar.', image: 'ampla-cobertura.jpeg', Icon: ShieldCheck },
  { title: 'Cotação para seu perfil', body: 'Quantidade de pessoas, idades e elegibilidade orientam sua proposta.', image: 'precos.jpg', Icon: Wallet },
  { title: 'Conversa com continuidade', body: 'Conheça o plano, tire dúvidas e solicite sua proposta no próprio chat.', image: 'doctor-patient-consultation.jpg', Icon: Zap },
];
const digitalBenefits = [
  ['Pronto atendimento digital 24h', 'Benefício apresentado no material comercial; consulte as condições de utilização.'],
  ['Especialidades com agendamento', 'O treinamento apresenta telemedicina com diversas especialidades.'],
  ['Cuidado com informação clara', 'Cobertura, rede e condições devem ser conferidas antes da contratação.'],
];
const questions = [
  { question: '01. O que o plano cobre?', answer: 'O treinamento apresenta segmentação ambulatorial e hospitalar com obstetrícia: consultas, exames e internações conforme as condições do produto. O material também anuncia pronto atendimento digital 24h; isso não significa pronto-socorro hospitalar 24h em toda a rede. Procedimentos, exclusões e limites devem ser conferidos antes de contratar.', source: 'Treinamento comercial, páginas 5 e 7; campanhas Adesão e PME.' },
  { question: '02. Qual é a acomodação?', answer: 'Quarto coletivo, conforme o treinamento e a Tabela Comercial 2026. Essa é a acomodação apresentada para os produtos Carioca 10 nos materiais recebidos.', source: 'Treinamento, página 7; Tabela Comercial 2026, página 1.' },
  { question: '03. Qual é a abrangência geográfica?', answer: `A tabela apresenta grupo de municípios: ${MUNICIPALITIES.join(', ')}. A lista não garante qualquer serviço em toda a região. Confirme o atendimento do seu produto e as condições fora da área.`, source: 'Tabela Comercial 2026, página 1.' },
  { question: '04. Como consultar hospitais e laboratórios?', answer: 'Veja os destaques da tabela nesta página e consulte a rede completa por plano, serviço e município. Os destaques são uma referência do material comercial; prestadores, procedimentos e disponibilidade devem ser conferidos para o produto da sua proposta.', source: 'Tabela Comercial 2026, página 2.', link: '/rede-credenciada', linkLabel: 'Consultar rede credenciada' },
  { question: '05. Como funcionam as carências?', answer: 'A matriz recebida diferencia os prazos contratuais das condições para quem não tem plano e para quem tem plano anterior de 6 a 12 meses ou acima de 12 meses. Consultas eletivas, exceto Psicologia, e os exames do grupo 1 aparecem com redução para 24 horas; terapias permanecem em 180 dias, parto a termo em 300 dias e CPT em 24 meses. Outros procedimentos variam conforme o grupo. Confira a matriz no chat: aplicação ao produto, aproveitamento do plano anterior e validade ainda precisam ser confirmados.', source: 'Matriz de carências recebida em PDF e planilha em 09/11/2026, às 11:03; aplicação sujeita às condições da proposta.' },
  { question: '06. Posso escolher o vencimento?', answer: `A tabela apresenta os dias ${DUE_DAYS.map(day => String(day).padStart(2, '0')).join(', ')}, com vigência e vencimento no mesmo dia indicado. Registre sua preferência no chat. A escolha não confirma implantação, primeiro pagamento ou alteração contratual.`, source: 'Tabela Comercial 2026, página 1.' },
  { question: '07. Quando começa a vigência?', answer: 'A entrevista médica é obrigatória em todas as vendas, conforme o treinamento, e deve ser concluída para efetivar a vigência. A entrevista é online, por videoconferência gravada. Se não terminar no prazo, a vigência passa à próxima data disponível no mesmo mês; se não terminar no mês da contratação, a proposta deve ser refeita. A data desejada no chat não confirma ativação; emissão, assinatura e pagamento seguem o processo de contratação.', source: 'Treinamento, página 10; Tabela Comercial 2026, página 1.' },
];

function LandingLink({ href, navigate, children, ...props }) {
  return <a href={href} {...props} onClick={event => {
    if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0 && !props.target && href.startsWith('/')) {
      event.preventDefault(); navigate(href);
    }
  }}>{children}</a>;
}
function LandingQuoteButton({ children = 'Solicitar cotação', requestQuote, intent, className = '' }) {
  return <button type="button" className={`lp-button ${className}`} onClick={() => requestQuote(intent)}>{children}<ArrowUpRight size={18} strokeWidth={1.4} aria-hidden="true" /></button>;
}
function LandingChecks({ items }) {
  return <ul className="lp-checks">{items.map(item => <li key={item}><Check size={17} strokeWidth={1.5} aria-hidden="true" /><span>{item}</span></li>)}</ul>;
}

export function LandingPage({ navigate, openQuote, onStartChat }) {
  const [intent, setIntent] = useState('');
  function requestQuote(requestedIntent) {
    if (requestedIntent) setIntent(requestedIntent);
    openQuote();
  }
  return <div className="landing-page">
    <section className="lp-shell lp-hero-panel" aria-labelledby="lp-hero-title">
      <div className="lp-hero-intro">
        <div className="lp-hero-copy">
          <span className="lp-eyebrow"><MapPin size={14} strokeWidth={1.5} aria-hidden="true" /> Rio de Janeiro e Grande Rio</span>
          <h1 id="lp-hero-title">Seu plano de saúde no Rio e Grande Rio.</h1>
          <p>Planos empresariais ou coletivos por adesão, com cuidado humanizado, rede local e atendimento digital.</p>
          <ul className="lp-hero-eligibility"><li><Building2 size={18} strokeWidth={1.4} aria-hidden="true" /><span><strong>Empresa:</strong> informe o CNPJ e quem deseja incluir.</span></li><li><Users size={18} strokeWidth={1.4} aria-hidden="true" /><span><strong>Você / família:</strong> conheça as opções e confirme sua elegibilidade.</span></li></ul>
          <LandingQuoteButton requestQuote={requestQuote} />
          <LandingLink href="/landing#lp-planos" navigate={navigate} className="lp-text-link lp-hero-secondary">Ver modalidades<ArrowRight size={16} strokeWidth={1.4} aria-hidden="true" /></LandingLink>
        </div>
        <div className="lp-hero-photo"><img src="/assets/plan-adesao-hero.webp" width="1000" height="1500" alt="Família reunida" fetchPriority="high" /><span className="lp-photo-caption">Planos feitos para cuidar de você de verdade.</span></div>
      </div>
      <aside id="lp-cotacao" className="lp-hero-form" aria-label="Iniciar cotação"><LandingQuoteForm intent={intent} onIntentChange={setIntent} onStartChat={onStartChat} /></aside>
    </section>

    <div className="lp-shell lp-brand-strip" aria-label="Amélia Saúde"><img className="lp-brand-logo" src="/assets/logo-amelia-site.png" width="132" height="54" alt="Amélia Saúde" /><div className="lp-strip-benefits">{landingBenefits.map(({ title, Icon }) => <span key={title}><Icon size={20} strokeWidth={1.3} aria-hidden="true" />{title}</span>)}</div><img className="lp-strip-ans" src="/assets/faixa-registro-ans.png" width="210" height="62" alt="Agência Nacional de Saúde Suplementar" loading="lazy" /></div>

    <section id="lp-planos" className="lp-shell lp-plans-section" aria-labelledby="lp-planos-title">
      <div className="lp-section-heading"><span className="lp-eyebrow">Dois caminhos para contratar</span><h2 id="lp-planos-title">Qual plano faz sentido para você?</h2><p>Conheça os produtos apresentados no treinamento comercial e as duas opções Adesão da Tabela Comercial 2026. Interesse pessoal e modalidade de contratação são escolhas diferentes.</p></div>
      <div className="lp-plan-grid">{landingPlans.map(({ id, badge, title, body, image, Icon, bullets, note, cta }) => <article className="lp-plan-card" key={id}>
        <div className="lp-plan-photo"><img src={`/assets/${image}`} alt={id === 'empresarial' ? 'Equipe em uma reunião de trabalho' : 'Profissionais em uma reunião'} width="1000" height="700" loading="lazy" /></div>
        <div className="lp-plan-card-copy"><span className="lp-plan-badge"><Icon size={19} strokeWidth={1.4} aria-hidden="true" />{badge}</span><h3>{title}</h3><p>{body}</p><LandingChecks items={bullets} /><p className="lp-plan-note">{note}</p><LandingQuoteButton requestQuote={requestQuote} intent={id}>{cta}</LandingQuoteButton><span className="lp-source-note">Fonte: treinamento comercial, págs. 7–9; tabela recebida em 09/11/2026.</span></div>
      </article>)}</div>
      <aside className="lp-campaign-note" aria-label="Condição promocional apresentada"><span className="lp-eyebrow">Campanha apresentada pela Amélia</span><h3>50% na primeira mensalidade bancária.</h3><p>As peças de Adesão e PME anunciam essa condição entre 20/10 e 20/11, sem informar o ano. A validade, os requisitos e a definição da cobrança precisam ser confirmados. O desconto não é aplicado automaticamente à simulação nem vale para todas as parcelas.</p></aside>
    </section>

    <section id="lp-rede" className="lp-shell lp-coverage-band" aria-labelledby="lp-rede-title"><div><span className="lp-eyebrow">Abrangência regional</span><h2 id="lp-rede-title">O cuidado começa perto de você.</h2><p>A Tabela Comercial 2026 apresenta estes dez municípios. Confira a abrangência e os serviços do produto antes de contratar.</p><ul className="lp-city-list" aria-label="Municípios indicados na tabela">{MUNICIPALITIES.map(city => <li key={city}>{city}</li>)}</ul></div><div id="lp-hospitais" className="lp-network-guide"><span className="lp-eyebrow">Hospitais e laboratórios</span><h3>Consulte a rede do seu produto.</h3><p>Busque por plano, serviço, especialidade e município. Antes de contratar, confirme os prestadores e a disponibilidade para a sua proposta.</p><LandingLink href="/rede-credenciada" navigate={navigate} className="lp-text-link">Abrir guia da rede credenciada<ArrowUpRight size={17} aria-hidden="true" /></LandingLink></div></section>
    <section className="lp-shell lp-received-network" aria-labelledby="lp-received-network-title"><div className="lp-section-heading"><span className="lp-eyebrow">Destaques da Tabela Comercial 2026</span><h2 id="lp-received-network-title">Conheça a rede apresentada.</h2><p>Referência do material recebido em 09/11/2026. A lista não substitui a consulta completa por produto, unidade e serviço.</p></div><div className="lp-network-groups">{NETWORK_HIGHLIGHTS.map(group => <details key={group.region}><summary>{group.region}<span aria-hidden="true">+</span></summary><ul>{group.names.map(name => <li key={name}>{name}</li>)}</ul></details>)}</div><p className="lp-source-note">Fonte: TABELA IMPRESSÃO (4).pdf, página 2. Os grupos preservam a classificação do material; não indicam o município exato de cada estabelecimento.</p></section>
    <div className="lp-shell lp-network-cta"><p>Quer ajuda para entender a rede e a abrangência?</p><LandingQuoteButton requestQuote={requestQuote} /></div>

    <section className="lp-shell lp-dark-panel" aria-labelledby="lp-telemedicine-title"><div className="lp-telemedicine-copy"><span className="lp-eyebrow">Telemedicina</span><h2 id="lp-telemedicine-title">Cuidado também <span>onde você estiver.</span></h2><p>Os materiais apresentam pronto atendimento digital 24h e telemedicina com especialidades agendadas. Confira as condições de utilização do seu produto.</p><LandingQuoteButton requestQuote={requestQuote} className="lp-button-white" /></div><div className="lp-telemedicine-photo"><img src="/assets/telemedicina-1.webp" alt="Consulta de telemedicina" width="1536" height="2752" loading="lazy" /><span className="lp-telemedicine-chip lp-chip-top">Atendimento digital</span><span className="lp-telemedicine-chip lp-chip-bottom">Consulte a disponibilidade</span></div><ul className="lp-digital-benefits">{digitalBenefits.map(([title, body]) => <li key={title}><Check size={19} strokeWidth={1.4} aria-hidden="true" /><div><h3>{title}</h3><p>{body}</p></div></li>)}</ul></section>

    <section id="lp-duvidas" className="lp-shell lp-faq-section" aria-labelledby="lp-duvidas-title"><div><span className="lp-eyebrow">Antes de escolher</span><h2 id="lp-duvidas-title">Suas dúvidas, com clareza.</h2><p>Sete pontos para conhecer o plano e tomar sua decisão com clareza.</p><LandingQuoteButton requestQuote={requestQuote} /></div><div className="lp-faq-list">{questions.map(({ question, answer, source, link, linkLabel }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}<span className="lp-source-note">Fonte: {source}</span>{link && <><br /><LandingLink href={link} navigate={navigate} className="lp-text-link">{linkLabel}<ArrowRight size={15} aria-hidden="true" /></LandingLink></>}</p></details>)}</div></section>

    <section id="lp-beneficios" className="lp-benefits-section stacked-benefits-landing" aria-labelledby="lp-beneficios-title"><div className="lp-shell"><div className="lp-section-heading"><span className="lp-eyebrow">O jeito Amélia de cuidar</span><h2 id="lp-beneficios-title">Cuidado que acompanha sua rotina.</h2></div><StackedCards items={landingBenefits} headingLevel="h3" /></div></section>

    <section className="lp-shell lp-final-panel" aria-labelledby="lp-final-title"><div className="lp-final-heading"><span className="lp-eyebrow">Seu próximo passo</span><h2 id="lp-final-title">Vamos encontrar o plano para o seu perfil?</h2><p>Conte para quem é o plano. Conheça as condições e solicite sua proposta no próprio chat. A entrevista médica é obrigatória antes da vigência. Você pode pedir um vendedor quando desejar.</p></div><ol className="lp-quote-steps">{['Conte quem precisa do plano', 'Conheça o produto e tire dúvidas', 'Solicite sua proposta pelo chat'].map((title, i) => <li key={title}><span className="lp-step-number">0{i + 1}</span><h3>{title}</h3></li>)}</ol><div className="lp-final-actions"><LandingQuoteButton requestQuote={requestQuote} /><LandingLink href="/landing#lp-planos" navigate={navigate} className="lp-text-link">Rever modalidades<ArrowRight size={18} strokeWidth={1.4} aria-hidden="true" /></LandingLink></div></section>
  </div>;
}
