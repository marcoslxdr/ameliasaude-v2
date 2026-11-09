import React, { useState } from 'react';
import { StackedCards } from './StackedCards.jsx';
import { ArrowRight, ArrowUpRight, Building2, Check, MapPin, ShieldCheck, Users, Wallet, Zap } from 'lucide-react';
import { LandingQuoteForm } from './LandingQuoteForm.jsx';
import './landing.css';

const landingPlans = [
  {
    id: 'empresarial', badge: 'Para empresas com CNPJ', title: 'Cuide de quem faz sua empresa acontecer.',
    body: 'Conte sobre sua empresa e as pessoas que deseja incluir. Consulte no chat as regras de elegibilidade e as opções aplicáveis ao seu perfil.', image: 'empresarial.jpg', href: '/planos/empresarial', Icon: Building2,
    bullets: ['Informe o CNPJ e o município', 'Inclua a quantidade de pessoas e suas idades', 'Confira a elegibilidade na proposta'],
    note: 'Quantidade mínima, inclusão de dependentes e condições comerciais dependem do produto e serão confirmadas na proposta.',
    cta: 'Cotar para minha empresa',
  },
  {
    id: 'adesao', badge: 'Por entidade de classe', title: 'Cuidado para você e sua família, por adesão.',
    body: 'Conheça a possibilidade de contratação coletiva por adesão. O chat apresenta o vínculo necessário e permite consultar as opções aplicáveis à sua família.', image: 'adesao.jpg', href: '/planos/adesao', Icon: Users,
    bullets: ['Informe quem você deseja incluir', 'Confira o vínculo aceito pela entidade', 'Verifique as condições para dependentes'],
    note: 'A contratação por adesão depende de vínculo aceito pela entidade e da elegibilidade para o produto. Interesse pessoal não significa plano individual.',
    cta: 'Cotar um plano por adesão',
  },
];
const landingBenefits = [
  { title: 'Cuidado para sua rotina', body: 'Conheça as coberturas do produto e confira suas condições antes de contratar.', image: 'ampla-cobertura.jpeg', Icon: ShieldCheck },
  { title: 'Cotação para seu perfil', body: 'Quantidade de pessoas, idades e elegibilidade orientam sua proposta.', image: 'precos.jpg', Icon: Wallet },
  { title: 'Conversa com continuidade', body: 'Conheça o plano, tire dúvidas e solicite sua proposta no próprio chat.', image: 'doctor-patient-consultation.jpg', Icon: Zap },
];
const digitalBenefits = [
  ['Conheça os serviços digitais', 'Consulte os canais de atendimento disponíveis para o seu produto.'],
  ['Entenda como acessar', 'Confira as condições de disponibilidade e utilização na proposta.'],
  ['Cuidado com informação clara', 'Cobertura, rede e condições devem ser conferidas antes da contratação.'],
];
const questions = [
  { question: '01. O que o plano cobre?', answer: 'Conheça as condições para consultas, exames, internações e atendimento de emergência 24h. A cobertura aplicável, os procedimentos e as limitações são confirmados no produto e nos documentos da proposta.' },
  { question: '02. Qual é a acomodação?', answer: 'A jornada comercial apresenta acomodação em quarto coletivo, sujeita à confirmação do produto escolhido e das condições da proposta.' },
  { question: '03. Qual é a abrangência geográfica?', answer: 'A proposta considera atendimento regional. Informe seu município e confirme a abrangência do produto escolhido, inclusive as condições para atendimento fora da região.' },
  { question: '04. Como consultar hospitais e laboratórios?', answer: 'Consulte o guia da rede por plano, serviço e município. Confira hospitais e laboratórios na rede aplicável ao produto da sua proposta; a disponibilidade varia conforme o plano e o serviço.', link: '/rede-credenciada', linkLabel: 'Consultar rede credenciada' },
  { question: '05. Como funcionam as carências?', answer: 'As condições de carência e de eventual redução promocional dependem do produto, da campanha vigente e do plano anterior. Peça as regras e o aditivo aplicável antes de contratar; a redução não é automática.' },
  { question: '06. Posso escolher o vencimento?', answer: 'Você pode informar sua preferência na conversa. As datas disponíveis seguem as condições oficiais do produto; registrar uma preferência não altera nem confirma o vencimento contratual.' },
  { question: '07. Quando começa a vigência?', answer: 'Informe a data em que deseja começar. O início efetivo depende das regras do produto e do cumprimento das condições de contratação, e será confirmado pela Amélia.' },
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
      <div className="lp-section-heading"><span className="lp-eyebrow">Dois caminhos para contratar</span><h2 id="lp-planos-title">Qual plano faz sentido para você?</h2><p>A modalidade depende de como você contrata. Cobertura e condições são confirmadas na proposta.</p></div>
      <div className="lp-plan-grid">{landingPlans.map(({ id, badge, title, body, image, href, Icon, bullets, note, cta }) => <article className="lp-plan-card" key={id}>
        <div className="lp-plan-photo"><img src={`/assets/${image}`} alt={id === 'empresarial' ? 'Equipe em uma reunião de trabalho' : 'Profissionais em uma reunião'} width="1000" height="700" loading="lazy" /></div>
        <div className="lp-plan-card-copy"><span className="lp-plan-badge"><Icon size={19} strokeWidth={1.4} aria-hidden="true" />{badge}</span><h3>{title}</h3><p>{body}</p><LandingChecks items={bullets} /><p className="lp-plan-note">{note}</p><LandingQuoteButton requestQuote={requestQuote} intent={id}>{cta}</LandingQuoteButton><LandingLink href={href} navigate={navigate} className="lp-text-link">Ver detalhes da modalidade<ArrowRight size={16} strokeWidth={1.3} aria-hidden="true" /></LandingLink></div>
      </article>)}</div>
    </section>

    <section id="lp-rede" className="lp-shell lp-coverage-band" aria-labelledby="lp-rede-title"><div><span className="lp-eyebrow">Abrangência regional</span><h2 id="lp-rede-title">O cuidado começa perto de você.</h2><p>Informe seu município para conhecer os produtos e confirmar a área de atendimento na sua proposta.</p></div><div id="lp-hospitais" className="lp-network-guide"><span className="lp-eyebrow">Hospitais e laboratórios</span><h3>Consulte a rede do seu produto.</h3><p>Busque por plano, serviço, especialidade e município. Antes de contratar, confirme os prestadores e a disponibilidade para a sua proposta.</p><LandingLink href="/rede-credenciada" navigate={navigate} className="lp-text-link">Abrir guia da rede credenciada<ArrowUpRight size={17} aria-hidden="true" /></LandingLink></div></section>
    <div className="lp-shell lp-network-cta"><p>Quer ajuda para entender a rede e a abrangência?</p><LandingQuoteButton requestQuote={requestQuote} /></div>

    <section className="lp-shell lp-dark-panel" aria-labelledby="lp-telemedicine-title"><div className="lp-telemedicine-copy"><span className="lp-eyebrow">Telemedicina</span><h2 id="lp-telemedicine-title">Cuidado também <span>onde você estiver.</span></h2><p>Conheça as opções de atendimento digital e confirme os serviços incluídos no produto da sua proposta.</p><LandingQuoteButton requestQuote={requestQuote} className="lp-button-white" /></div><div className="lp-telemedicine-photo"><img src="/assets/telemedicina-1.webp" alt="Consulta de telemedicina" width="1536" height="2752" loading="lazy" /><span className="lp-telemedicine-chip lp-chip-top">Atendimento digital</span><span className="lp-telemedicine-chip lp-chip-bottom">Consulte a disponibilidade</span></div><ul className="lp-digital-benefits">{digitalBenefits.map(([title, body]) => <li key={title}><Check size={19} strokeWidth={1.4} aria-hidden="true" /><div><h3>{title}</h3><p>{body}</p></div></li>)}</ul></section>

    <section id="lp-duvidas" className="lp-shell lp-faq-section" aria-labelledby="lp-duvidas-title"><div><span className="lp-eyebrow">Antes de escolher</span><h2 id="lp-duvidas-title">Suas dúvidas, com clareza.</h2><p>Sete pontos para conhecer o plano e tomar sua decisão com clareza.</p><LandingQuoteButton requestQuote={requestQuote} /></div><div className="lp-faq-list">{questions.map(({ question, answer, link, linkLabel }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}{link && <><br /><LandingLink href={link} navigate={navigate} className="lp-text-link">{linkLabel}<ArrowRight size={15} aria-hidden="true" /></LandingLink></>}</p></details>)}</div></section>

    <section id="lp-beneficios" className="lp-benefits-section stacked-benefits-landing" aria-labelledby="lp-beneficios-title"><div className="lp-shell"><div className="lp-section-heading"><span className="lp-eyebrow">O jeito Amélia de cuidar</span><h2 id="lp-beneficios-title">Cuidado que acompanha sua rotina.</h2></div><StackedCards items={landingBenefits} headingLevel="h3" /></div></section>

    <section className="lp-shell lp-final-panel" aria-labelledby="lp-final-title"><div className="lp-final-heading"><span className="lp-eyebrow">Seu próximo passo</span><h2 id="lp-final-title">Vamos encontrar o plano para o seu perfil?</h2><p>Conte para quem é o plano. Conheça as condições e solicite sua proposta no próprio chat. Você pode pedir um vendedor quando desejar.</p></div><ol className="lp-quote-steps">{['Conte quem precisa do plano', 'Conheça o produto e tire dúvidas', 'Solicite sua proposta pelo chat'].map((title, i) => <li key={title}><span className="lp-step-number">0{i + 1}</span><h3>{title}</h3></li>)}</ol><div className="lp-final-actions"><LandingQuoteButton requestQuote={requestQuote} /><LandingLink href="/landing#lp-planos" navigate={navigate} className="lp-text-link">Rever modalidades<ArrowRight size={18} strokeWidth={1.4} aria-hidden="true" /></LandingLink></div></section>
  </div>;
}
