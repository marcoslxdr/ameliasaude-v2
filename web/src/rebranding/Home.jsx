import React from 'react';
import { StackedCards } from './StackedCards.jsx';
import { StorySection } from './StorySection.jsx';
import { HospitalSection } from './HospitalSection.jsx';
import { NetworkSection } from './NetworkSection.jsx';
import './home-layout.css';
import { ArrowRight, ArrowUpRight, Check, Headphones, Layers, Megaphone, Phone } from 'lucide-react';
import { SiteLink } from './App.jsx';

const benefits=[
  {title:'Ampla cobertura',body:'Planos com cobertura completa para consultas, exames, internações e cirurgias',image:'ampla-cobertura.jpeg'},
  {title:'Atendimento ágil',body:'Eficiente, resolutivo e sem burocracia, para cuidar da sua saúde com excelência.',image:'doctor-patient-consultation.jpg'},
  {title:'Preços competitivos',body:'O melhor custo-benefício para cuidar da sua saúde, com preços que cabem no seu orçamento',image:'precos.jpg'},
];
const channels=[
  {title:'Central de Atendimento',body:'Agendamentos, autorizações e suporte ao beneficiário.',action:'Ligar agora',href:'tel:08000210777',icon:Headphones},
  {title:'Ouvidoria',body:'Críticas, sugestões e reclamações com canal dedicado.',action:'Enviar e-mail',href:'mailto:ouvidoria@ameliasaude.com.br',icon:Megaphone},
  {title:'Prestador',body:'Canal exclusivo para rede credenciada e prestadores de serviço.',action:'Acessar portal',href:'https://planodesaude.ameliasaude.com.br/PlanodeSaude/',icon:Layers},
  {title:'Assessoria de Imprensa',body:'Informações, press releases e contato para a mídia.',action:'Falar com assessoria',href:'mailto:imprensa@ameliasaude.com.br',icon:Phone},
];

export function Home({navigate,openQuote}) {
  return <div className="home-page">
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero-person" src="/assets/maria-padilha-frente-bracos-cruzados.webp" width="960" height="1639" alt="Maria Padilha de frente e de braços cruzados, Amélia Saúde" fetchPriority="high"/>
      <span className="hero-person-name"><span>Maria Padilha</span><span className="hero-person-role">ATRIZ</span></span>
      <div className="hero-content"><h1 id="hero-title">O plano de saúde com gestão moderna, tecnologia inteligente e cuidado humanizado.</h1><div className="hero-bottom"><div className="hero-signature"><p>Amélia saúde!</p><p>Planos feitos para cuidar de você de verdade.</p></div><div className="hero-actions"><button className="button hero-button" onClick={openQuote}>Quero meu plano <ArrowRight size={21} strokeWidth={1.4}/></button><SiteLink href="/#origem" navigate={navigate} className="button hero-button hero-button-outline">Conheça a Amélia <ArrowRight size={21} strokeWidth={1.4}/></SiteLink></div></div></div>
    </section>
    <section className="benefit-grid stacked-benefits-home" aria-label="Benefícios dos planos Amélia Saúde"><StackedCards items={benefits} headingLevel="h2" /></section>
    <StorySection />
    <NetworkSection navigate={navigate} />
    <HospitalSection navigate={navigate} />
    <section id="telemedicina" className="telemedicine-section section-space"><div className="telemedicine-shell"><div className="telemedicine-copy"><span className="eyebrow">Telemedicina</span><h2>Tenha um especialista Amélia disponível <span>a qualquer momento.</span></h2><p>Seja atendido em até 7 minutos por teleconsulta, com praticidade e comodidade, sem necessidade de deslocamentos.</p><a href="https://paciente.conexasaude.com.br/login/ameliasaude" target="_blank" rel="noopener noreferrer" className="button button-white">Acessar plataforma <ArrowUpRight size={19} strokeWidth={1.5}/></a></div><div className="telemedicine-visual"><img src="/assets/telemedicina-1.webp" width="1536" height="2752" alt="Consulta de telemedicina com Dra. Ana Silva" loading="lazy"/><span className="telemedicine-chip chip-top">Clínico Geral 24h</span><span className="telemedicine-chip chip-bottom">Pediatra 24h</span></div><ul className="telemedicine-list">{[['Pronto atendimento digital 24h','Atendimento médico digital imediato, sem burocracias.'],['94% de resolutividade na primeira consulta','A maioria dos casos resolvidos já no primeiro atendimento.'],['Prescrição eletrônica completa','Medicamentos, exames e atestados emitidos digitalmente.']].map(([title,body])=><li key={title}><Check size={22} strokeWidth={1.4}/><div><h3>{title}</h3><p>{body}</p></div></li>)}</ul></div></section>
    <section id="contato" className="contact-section section-space"><div className="section-heading"><span className="eyebrow">Contato</span><h2>Precisa falar com a Amélia?</h2><p>Entre em contato através de um de nossos canais abaixo.</p></div><ul className="contact-grid" aria-label="Canais de atendimento">{channels.map(channel=>{const Icon=channel.icon;return <li key={channel.title}><a href={channel.href} {...(channel.href.startsWith('https')?{target:'_blank',rel:'noopener noreferrer'}:{})} className="contact-card"><Icon size={28} strokeWidth={1.2}/><h3>{channel.title}</h3><p>{channel.body}</p><span className="contact-action">{channel.action}<ArrowUpRight size={19} strokeWidth={1.4}/></span></a></li>;})}</ul></section>
  </div>;
}
