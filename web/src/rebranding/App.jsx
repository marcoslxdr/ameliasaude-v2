'use client';

import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Home } from './Home.jsx';
import { QuoteForm } from './QuoteForm.jsx';
import { Footer } from './Footer.jsx';
import { ClosingStack } from './ClosingStack.jsx';
import { LandingPage } from './LandingPage.jsx';
import { AmeliaChatWidget } from '@/components/chat/AmeliaChatWidget';
import './styles.css';

const InteriorPage = lazy(() => import('./InteriorPages.jsx').then(module => ({ default: module.InteriorPage })));
const landingNavLinks = [['Planos','/landing#lp-planos'],['Hospitais','/landing#lp-hospitais'],['Dúvidas','/landing#lp-duvidas']];
const navLinks = [['Sobre nós','/#origem'],['Rede credenciada','/rede-credenciada'],['Telemedicina','/#telemedicina'],['Fale conosco','/#contato']];

function visitSection(fragment) {
  const section = document.getElementById(fragment);
  if (!section) return;
  section.scrollIntoView({behavior:'auto'});
  const focusTarget = section.querySelector('h1, h2') || section;
  if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex','-1');
  focusTarget.focus({preventScroll:true});
}

export function SiteLink({ href, navigate, children, onClick, ...props }) {
  return <a href={href} {...props} onClick={event => {
    onClick?.(event);
    if (!event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0 && new URL(href,window.location.href).origin===window.location.origin && !props.target) { event.preventDefault(); navigate(href); }
  }}>{children}</a>;
}

function Dialog({ children, label, onClose, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement, previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const element = ref.current;
    const background = [...element.parentElement.parentElement.children].filter(node => node !== element.parentElement).map(node => [node, node.inert]);
    background.forEach(([node]) => { node.inert = true; });
    element.querySelector('button, a, input, select')?.focus();
    function handleKey(event) {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const controls = [...element.querySelectorAll('a[href], button, input, select, textarea, [tabindex="0"]')].filter(control => !control.disabled && control.getClientRects().length);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {event.preventDefault();last?.focus();}
      else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first?.focus();}
    }
    document.addEventListener('keydown', handleKey);
    return () => { background.forEach(([node, wasInert]) => { node.inert = wasInert; }); document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', handleKey); previous?.focus(); };
  }, [onClose]);
  return <div className={`dialog-backdrop ${className}`} onClick={event=>{if(event.target===event.currentTarget)onClose();}}><div ref={ref} role="dialog" aria-modal="true" aria-label={label} className="dialog-panel">{children}</div></div>;
}

export function App({initialPath = '/'}) {
  const [path, setPath] = useState(initialPath);
  const mainRef = useRef(null), previousPathRef = useRef(path);
  const chatRef = useRef(null), headerQuoteRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false), [quoteOpen, setQuoteOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMenu = useCallback(()=>setMenuOpen(false),[]), closeQuote = useCallback(()=>setQuoteOpen(false),[]);
  const openQuote = useCallback(()=>{setMenuOpen(false);setQuoteOpen(true);},[]);
  const openSalesChat = useCallback(event=>{
    const trigger = event?.currentTarget;
    setMenuOpen(false);setQuoteOpen(false);
    requestAnimationFrame(()=>chatRef.current?.open(trigger?.isConnected ? trigger : headerQuoteRef.current));
  },[]);
  const navigate = useCallback(href=>{
    const destination = new URL(href,window.location.origin);
    const routeChanged = destination.pathname!==window.location.pathname;
    if(routeChanged){window.location.assign(destination.pathname+destination.search+destination.hash);return;}
    if(destination.href!==window.location.href)window.history.pushState({},'',destination.pathname+destination.search+destination.hash);
    setPath(destination.pathname + destination.search);setMenuOpen(false);setQuoteOpen(false);
    if(destination.hash)requestAnimationFrame(()=>requestAnimationFrame(()=>visitSection(destination.hash.slice(1))));
    else if(routeChanged)window.scrollTo({top:0,behavior:'auto'});
  },[]);
  useEffect(()=>{
    const onPop=()=>{setPath(window.location.pathname + window.location.search);setMenuOpen(false);setQuoteOpen(false);};
    const onScroll=()=>setScrolled(window.scrollY>40);
    onPop();onScroll();
    window.addEventListener('popstate',onPop);window.addEventListener('scroll',onScroll,{passive:true});
    return()=>{window.removeEventListener('popstate',onPop);window.removeEventListener('scroll',onScroll);};
  },[]);
  useEffect(()=>{
    const routeChanged = previousPathRef.current !== path;
    previousPathRef.current = path;
    const fragment = window.location.hash.slice(1);
    const frame = requestAnimationFrame(()=>{
      if(fragment) visitSection(fragment);
      else if(routeChanged) mainRef.current?.focus({preventScroll:true});
    });
    return()=>cancelAnimationFrame(frame);
  },[path]);
  useEffect(()=>{
    const titles={'/':'Amélia Saúde — Planos empresariais e por adesão','/landing':'Planos feitos para cuidar de você de verdade | Amélia Saúde','/planos':'Planos de saúde | Amélia Saúde','/planos/empresarial':'Plano empresarial | Amélia Saúde','/planos/adesao':'Plano por adesão | Amélia Saúde','/rede-credenciada':'Rede credenciada | Amélia Saúde','/blog':'Blog | Amélia Saúde','/cotacao':'Simule seu plano | Amélia Saúde','/termos':'Termos de Uso | Amélia Saúde','/cookies':'Política de Cookies | Amélia Saúde','/lgpd':'LGPD | Amélia Saúde','/privacidade':'Política de Privacidade | Amélia Saúde'};
    const currentRoute = path.split('?')[0].replace(/\/$/,'') || '/';
    if(titles[currentRoute]) document.title=titles[currentRoute];
    else if(!currentRoute.startsWith('/blog/')) document.title='Amélia Saúde';
  },[path]);
  const route=path.split('?')[0].replace(/\/$/,'') || '/';
  const isHome=route==='/'||route==='/desenvolvimento';
  const isLanding=route==='/landing';
  const isHeroHeader=isHome&&!scrolled;
  const pageNavLinks=isLanding?landingNavLinks:navLinks;
  const pageQuoteAction=isLanding?()=>navigate('/landing#lp-cotacao'):openQuote;
  return <>
    <a href="#main-content" className="skip-link">Ir para o conteúdo</a>
    <header className={`site-header ${isHeroHeader?'header-on-hero':'header-solid'}`}>
      <div className="header-brand"><button className="menu-toggle icon-button" aria-label="Abrir menu" aria-expanded={menuOpen} onClick={()=>setMenuOpen(true)}><Menu size={22} strokeWidth={1.4}/></button><SiteLink href="/" navigate={navigate} className="logo-link" aria-label="Amélia Saúde — início"><img src={isHeroHeader?'/assets/logo-amelia-site-branca.png':'/assets/logo-amelia-site.png'} width="132" height="54" alt="Amélia Saúde"/></SiteLink></div>
      <nav aria-label="Menu principal" className="desktop-navigation">{pageNavLinks.map(([label,href])=><SiteLink key={href} href={href} navigate={navigate} aria-current={href===path?'page':undefined}>{label}</SiteLink>)}</nav>
      <button ref={headerQuoteRef} type="button" className="button button-purple header-quote" onClick={isLanding?pageQuoteAction:openSalesChat}>{isLanding?'Solicitar cotação':'Quero meu plano'} <ArrowRight size={17} strokeWidth={1.5}/></button>
    </header>
    <ClosingStack enabled={isHome}>
    <main ref={mainRef} id="main-content" tabIndex={-1}>
      {isHome?<Home navigate={navigate} openSalesChat={openSalesChat}/>:isLanding?<LandingPage navigate={navigate} openQuote={pageQuoteAction}/>:route==='/cotacao'?<section className="quote-page"><div className="quote-page-intro"><span className="eyebrow">Simule seu plano</span><h1>Planos feitos para cuidar de você de verdade.</h1><p>Planos de saúde feitos para você</p><img src="/assets/familia-bg.webp" alt="Família reunida"/></div><div className="quote-page-form"><QuoteForm navigate={navigate}/></div></section>:<Suspense fallback={<div className="page-loading" role="status">Carregando…</div>}><InteriorPage path={path} navigate={navigate} openQuote={openQuote}/></Suspense>}
    </main>
    {isHome?<div className="closing-card closing-stack-footer" data-closing-card><Footer navigate={navigate}/></div>:<Footer navigate={navigate}/>}
    </ClosingStack>
    {menuOpen?<Dialog label="Menu de navegação" onClose={closeMenu} className="menu-dialog"><div className="menu-top"><img src="/assets/logo-amelia-site-branca.png" width="150" height="61" alt="Amélia Saúde"/><button className="icon-button" aria-label="Fechar menu" onClick={closeMenu}><X size={28} strokeWidth={1.4}/></button></div><nav aria-label="Menu completo"><SiteLink href="/" navigate={navigate}>Início <ArrowRight/></SiteLink>{pageNavLinks.map(([label,href])=><SiteLink key={href} href={href} navigate={navigate}>{label}<ArrowRight/></SiteLink>)}{!isLanding&&<><SiteLink href="/landing" navigate={navigate}>Simule seu plano <ArrowRight/></SiteLink><SiteLink href="/blog" navigate={navigate}>Blog <ArrowRight/></SiteLink></>}</nav>{!isLanding&&<div className="menu-service-links"><a href="tel:08000210777">Central de Atendimento <ArrowRight size={16}/></a><a href="https://planodesaude.ameliasaude.com.br/PlanodeSaude/" target="_blank" rel="noopener noreferrer">Prestador <ArrowRight size={16}/></a></div>}<div className="menu-bottom"><button type="button" className="button button-white" onClick={isLanding?pageQuoteAction:openSalesChat}>{isLanding?'Solicitar cotação':'Quero meu plano'} <ArrowRight size={20}/></button><a href="https://www.instagram.com/ameliasauderj/" target="_blank" rel="noopener noreferrer" aria-label="Amélia Saúde no Instagram">Instagram</a></div></Dialog>:null}
    {quoteOpen?<Dialog label="Simule seu plano" onClose={closeQuote} className="quote-dialog"><div className="quote-dialog-top"><span className="eyebrow">Simule seu plano</span><button className="icon-button" aria-label="Fechar cotação" onClick={closeQuote}><X size={23}/></button></div><QuoteForm navigate={navigate}/></Dialog>:null}
    <AmeliaChatWidget ref={chatRef} hideLauncher initialDepartment="sales" />
  </>;
}
