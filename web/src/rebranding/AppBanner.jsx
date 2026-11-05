import { CreditCard, Expand, FileCheck, MapPin, MessageCircle, ShieldCheck, UserRound } from 'lucide-react';
import './app-banner.css';

const features = [
  { label: 'Carteirinha virtual', Icon: CreditCard },
  { label: 'Rede credenciada', Icon: MapPin },
  { label: 'Solicitação de reembolso', Icon: FileCheck },
  { label: 'Atualização cadastral', Icon: UserRound },
  { label: 'Garantia de atendimento', Icon: ShieldCheck },
  { label: 'Atendimento via Chat', Icon: MessageCircle },
];

export function AppBanner() {
  return <section id="aplicativo" className="app-banner" aria-labelledby="app-banner-title">
    <div className="app-banner-copy">
      <h2 id="app-banner-title">Seu plano na palma da mão.</h2>
      <p>Baixe o aplicativo Amélia Saúde e tenha acesso a diversas funcionalidades com praticidade e segurança 24h.</p>
      <ul>{features.map(({ label, Icon }) => <li key={label}><Icon size={22} aria-hidden="true" />{label}</li>)}</ul>
      <p>E MUITO MAIS!</p>
      <div className="app-banner-stores">
        <a href="https://apps.apple.com/br/app/id6822854228">
          <img src="/assets/app-store-pt-br.svg" width="120" height="40" alt="Baixar na App Store" />
        </a>
        <a href="https://play.google.com/store/apps/details?id=br.com.mobilesaude.ameliasaude">
          <img src="/assets/google-play-pt-br.png" width="478" height="142" alt="Baixar no Google Play" />
        </a>
      </div>
    </div>
    <div className="app-banner-art">
      <div className="app-device-pair">
        {[
          { name: 'Início', src: '/assets/app-inicio-previa.jpg' },
          { name: 'Serviços', src: '/assets/app-servicos-previa.jpg' },
        ].map(({name, src}) => (
          <a key={name} className="app-device-view" href={src} target="_blank" rel="noopener noreferrer"
            aria-label={`Ampliar tela de ${name.toLowerCase()} em uma nova aba`}>
            <span className="app-device">
              <img className="app-device-screen" src={src} alt="" loading="lazy" />
            </span>
            <span className="app-device-caption">{name}<Expand size={13} aria-hidden="true" /></span>
          </a>
        ))}
      </div>
    </div>
  </section>;
}
