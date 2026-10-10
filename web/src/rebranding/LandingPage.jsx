import React, { useState } from 'react';
import { StackedCards } from './StackedCards.jsx';
import { HospitalSection } from './HospitalSection.jsx';
import { ArrowRight, ArrowUpRight, Building2, Check, MapPin, ShieldCheck, Users, Wallet, Zap } from 'lucide-react';
import { LandingQuoteForm } from './LandingQuoteForm.jsx';
import { planDetailCopy, products } from './data/plans';
import './landing.css';

const landingPlans = [
  {
    id: 'empresarial', badge: 'Para empresas com CNPJ', title: 'Cuide de quem faz sua empresa acontecer.',
    body: products[0].description, image: 'empresarial.jpg', href: '/planos/empresarial', Icon: Building2,
    bullets: ['A partir de 2 beneficiários', 'MEI, micro, pequenas e médias empresas', 'Dependentes conforme as regras do contrato'],
    note: 'Para empresas de médio e grande porte, condições especiais em contratos a partir de 100 beneficiários.',
    cta: 'Cotar para minha empresa',
  },
  {
    id: 'adesao', badge: 'Por entidade de classe', title: 'Cuidado para você e sua família, por adesão.',
    body: products[1].description, image: 'adesao.jpg', href: '/planos/adesao', Icon: Users,
    bullets: ['Vínculo com sindicato, conselho ou associação', 'Elegibilidade conforme a entidade e o produto', 'Dependentes conforme as regras do contrato'],
    note: 'Sem necessidade de CNPJ próprio. A contratação depende de um vínculo aceito pela entidade.',
    cta: 'Cotar um plano por adesão',
  },
];
const landingBenefits = [
  { title: 'Ampla cobertura', body: 'Planos com cobertura completa para consultas, exames, internações e cirurgias', image: 'ampla-cobertura.jpeg', Icon: ShieldCheck },
  { title: 'Preços competitivos', body: 'O melhor custo-benefício para cuidar da sua saúde, com preços que cabem no seu orçamento', image: 'precos.jpg', Icon: Wallet },
  { title: 'Atendimento ágil', body: 'Eficiente, resolutivo e sem burocracia, para cuidar da sua saúde com excelência.', image: 'doctor-patient-consultation.jpg', Icon: Zap },
];
const cities = ['Rio de Janeiro', 'Nova Iguaçu', 'Nilópolis', 'Belford Roxo', 'São Gonçalo', 'Niterói', 'São João de Meriti', 'Duque de Caxias', 'Magé', 'Mesquita'];
const digitalBenefits = [
  ['Pronto atendimento digital 24h', 'Atendimento médico digital imediato, sem burocracias.'],
  ['94% de resolutividade na primeira consulta', 'A maioria dos casos resolvidos já no primeiro atendimento.'],
  ['Prescrição eletrônica completa', 'Medicamentos, exames e atestados emitidos digitalmente.'],
];
const questions = [
  { question: 'Tenho MEI. Posso avaliar um plano empresarial?', answer: planDetailCopy.empresarial.faqs[1].a },
  { question: 'O que preciso para contratar por adesão?', answer: 'É necessário ter vínculo aceito com sindicato, conselho, associação ou entidade homologada. A elegibilidade, a documentação e o mínimo de vidas dependem da entidade e do produto.' },
  { question: 'Posso incluir minha família?', answer: 'No empresarial ou no coletivo por adesão, dependentes podem ser incluídos conforme as regras do contrato. A adesão depende do vínculo do titular com a entidade de classe.' },
  { question: 'Todos os hospitais atendem qualquer plano?', answer: 'A cobertura depende do plano, da rede e do serviço. Confira os prestadores no guia da rede credenciada e confirme a disponibilidade na proposta.' },
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

export function LandingPage({ navigate, openQuote }) {
  const [intent, setIntent] = useState(''), [quoteEpoch, setQuoteEpoch] = useState(0);
  function requestQuote(requestedIntent) {
    if (requestedIntent) { setIntent(requestedIntent); setQuoteEpoch(epoch => epoch + 1); }
    openQuote();
  }
  return <div className="landing-page">
    <section className="lp-shell lp-hero-panel" aria-labelledby="lp-hero-title">
      <div className="lp-hero-intro">
        <div className="lp-hero-copy">
          <span className="lp-eyebrow"><MapPin size={14} strokeWidth={1.5} aria-hidden="true" /> Rio de Janeiro e Grande Rio</span>
          <h1 id="lp-hero-title">Seu plano de saúde no Rio e Grande Rio.</h1>
          <p>Planos empresariais ou coletivos por adesão, com cuidado humanizado, rede local e atendimento digital.</p>
          <ul className="lp-hero-eligibility"><li><Building2 size={18} strokeWidth={1.4} aria-hidden="true" /><span><strong>Empresa:</strong> CNPJ, a partir de 2 vidas.</span></li><li><Users size={18} strokeWidth={1.4} aria-hidden="true" /><span><strong>Adesão:</strong> vínculo com entidade de classe.</span></li></ul>
          <LandingQuoteButton requestQuote={requestQuote} />
          <LandingLink href="/landing#lp-planos" navigate={navigate} className="lp-text-link lp-hero-secondary">Ver modalidades<ArrowRight size={16} strokeWidth={1.4} aria-hidden="true" /></LandingLink>
        </div>
        <div className="lp-hero-photo"><img src="/assets/plan-adesao-hero.webp" width="1000" height="1500" alt="Família reunida" fetchPriority="high" /><span className="lp-photo-caption">Planos feitos para cuidar de você de verdade.</span></div>
      </div>
      <aside id="lp-cotacao" className="lp-hero-form" aria-label="Simulação de cotação"><LandingQuoteForm key={quoteEpoch} intent={intent} onIntentChange={setIntent} /></aside>
    </section>

    <div className="lp-shell lp-brand-strip" aria-label="Amélia Saúde"><img className="lp-brand-logo" src="/assets/logo-amelia-site.png" width="132" height="54" alt="Amélia Saúde" /><div className="lp-strip-benefits">{landingBenefits.map(({ title, Icon }) => <span key={title}><Icon size={20} strokeWidth={1.3} aria-hidden="true" />{title}</span>)}</div><img className="lp-strip-ans" src="/assets/faixa-registro-ans.png" width="210" height="62" alt="Agência Nacional de Saúde Suplementar" loading="lazy" /></div>

    <section id="lp-planos" className="lp-shell lp-plans-section" aria-labelledby="lp-planos-title">
      <div className="lp-section-heading"><span className="lp-eyebrow">Dois caminhos para contratar</span><h2 id="lp-planos-title">Qual plano faz sentido para você?</h2><p>A modalidade depende de como você contrata. Cobertura e condições são confirmadas na proposta.</p></div>
      <div className="lp-plan-grid">{landingPlans.map(({ id, badge, title, body, image, href, Icon, bullets, note, cta }) => <article className="lp-plan-card" key={id}>
        <div className="lp-plan-photo"><img src={`/assets/${image}`} alt={id === 'empresarial' ? 'Equipe em uma reunião de trabalho' : 'Profissionais em uma reunião'} width="1000" height="700" loading="lazy" /></div>
        <div className="lp-plan-card-copy"><span className="lp-plan-badge"><Icon size={19} strokeWidth={1.4} aria-hidden="true" />{badge}</span><h3>{title}</h3><p>{body}</p><LandingChecks items={bullets} /><p className="lp-plan-note">{note}</p><LandingQuoteButton requestQuote={requestQuote} intent={id}>{cta}</LandingQuoteButton><LandingLink href={href} navigate={navigate} className="lp-text-link">Ver detalhes da modalidade<ArrowRight size={16} strokeWidth={1.3} aria-hidden="true" /></LandingLink></div>
      </article>)}</div>
    </section>

    <section id="lp-rede" className="lp-shell lp-coverage-band" aria-labelledby="lp-rede-title"><div><span className="lp-eyebrow">Cobertura local</span><h2 id="lp-rede-title">Uma rede perto da sua rotina.</h2><p>Consulte os prestadores por plano, serviço, especialidade e município.</p></div><ul className="lp-city-list" aria-label="Municípios">{cities.map(city => <li key={city}>{city}</li>)}</ul></section>
    <HospitalSection id="lp-hospitais" navigate={navigate} />
    <div className="lp-shell lp-network-cta"><p>Confirme a rede para o seu plano na cotação.</p><LandingQuoteButton requestQuote={requestQuote} /></div>

    <section className="lp-shell lp-dark-panel" aria-labelledby="lp-telemedicine-title"><div className="lp-telemedicine-copy"><span className="lp-eyebrow">Telemedicina</span><h2 id="lp-telemedicine-title">Cuidado também <span>onde você estiver.</span></h2><p>Seja atendido em até 7 minutos por teleconsulta, com praticidade e comodidade, sem necessidade de deslocamentos.</p><LandingQuoteButton requestQuote={requestQuote} className="lp-button-white" /></div><div className="lp-telemedicine-photo"><img src="/assets/telemedicina-1.webp" alt="Consulta de telemedicina" width="1536" height="2752" loading="lazy" /><span className="lp-telemedicine-chip lp-chip-top">Clínico Geral 24h</span><span className="lp-telemedicine-chip lp-chip-bottom">Pediatra 24h</span></div><ul className="lp-digital-benefits">{digitalBenefits.map(([title, body]) => <li key={title}><Check size={19} strokeWidth={1.4} aria-hidden="true" /><div><h3>{title}</h3><p>{body}</p></div></li>)}</ul></section>

    <section id="lp-duvidas" className="lp-shell lp-faq-section" aria-labelledby="lp-duvidas-title"><div><span className="lp-eyebrow">Antes de escolher</span><h2 id="lp-duvidas-title">Suas dúvidas, com clareza.</h2><p>Entenda a contratação antes de pedir a proposta.</p><LandingQuoteButton requestQuote={requestQuote} /></div><div className="lp-faq-list">{questions.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

    <section id="lp-beneficios" className="lp-benefits-section stacked-benefits-landing" aria-labelledby="lp-beneficios-title"><div className="lp-shell"><div className="lp-section-heading"><span className="lp-eyebrow">O jeito Amélia de cuidar</span><h2 id="lp-beneficios-title">Cuidado que acompanha sua rotina.</h2></div><StackedCards items={landingBenefits} headingLevel="h3" /></div></section>

    <section className="lp-shell lp-final-panel" aria-labelledby="lp-final-title"><div className="lp-final-heading"><span className="lp-eyebrow">Seu próximo passo</span><h2 id="lp-final-title">Vamos encontrar o plano para o seu perfil?</h2><p>Comece pela modalidade e pela quantidade de pessoas que você quer cuidar.</p></div><ol className="lp-quote-steps">{['Modalidade e número de vidas', 'Idades dos beneficiários', 'Simulação de contato'].map((title, i) => <li key={title}><span className="lp-step-number">0{i + 1}</span><h3>{title}</h3></li>)}</ol><div className="lp-final-actions"><LandingQuoteButton requestQuote={requestQuote} /><LandingLink href="/landing#lp-planos" navigate={navigate} className="lp-text-link">Rever modalidades<ArrowRight size={18} strokeWidth={1.4} aria-hidden="true" /></LandingLink></div></section>
  </div>;
}
