import React from 'react';
import { SiteLink } from './App.jsx';

export function Footer({navigate}) {
  return <footer id="rodape" className="site-footer" aria-label="Rodapé — Amélia Saúde">
    <div className="footer-main">
      <div className="footer-brand"><SiteLink href="/" navigate={navigate} aria-label="Amélia Saúde — voltar ao início"><img src="/assets/logo-amelia-site-branca.png" alt="Amélia Saúde" width="174" height="71"/></SiteLink><p>Operadora de planos de saúde com rede credenciada no Rio de Janeiro e Grande Rio — simples e sem burocracias.</p><p className="footer-address">Baseada no Rio de Janeiro · Grande RJ — endereço para correspondência disponível pelos canais de atendimento.</p><a className="footer-social" href="https://www.instagram.com/ameliasauderj/" aria-label="Amélia Saúde no Instagram" target="_blank" rel="noopener noreferrer">Instagram</a></div>
      <nav aria-label="Navegação do site"><h2>Navegação</h2>{[['Sobre nós','/#origem'],['Planos','/planos'],['Rede','/rede-credenciada'],['Telemedicina','/#telemedicina'],['Fale conosco','/#contato']].map(([label,href])=><SiteLink key={href} href={href} navigate={navigate}>{label}</SiteLink>)}</nav>
      <nav aria-label="Informações legais"><h2>Legal</h2>{[['Termos de Uso','/termos'],['Política de Cookies','/cookies'],['LGPD','/lgpd'],['Política de Privacidade','/privacidade']].map(([label,href])=><SiteLink key={href} href={href} navigate={navigate}>{label}</SiteLink>)}</nav>
      <div className="footer-certifications"><h2>Certificações</h2><img src="/assets/faixa-registro-ans.png" alt="Agência Nacional de Saúde Suplementar" width="230" height="68" loading="lazy"/><div className="reclame-aqui"><span>Reclame Aqui</span><img src="/assets/reclame-aqui.jpeg" alt="Amélia Saúde no Reclame Aqui" width="50" height="49" loading="lazy"/></div></div>
    </div>
    <div className="footer-bottom"><p>© 2026 Amelia Operadora de Planos de Saude S.A. Todos os direitos reservados.</p><div><span>CNPJ: 57.395.677/0001-93</span><span className="ans-registration" role="img" aria-label="Registro ANS da Amélia Saúde, número 42.427-7"><img src="/assets/ans-registro-amelia.png" alt="" width="127" height="68"/></span><SiteLink href="/privacidade" navigate={navigate}>Política de Privacidade</SiteLink></div></div>
  </footer>;
}
