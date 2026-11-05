import { CreditCard, Expand, FileCheck, MapPin, Phone } from 'lucide-react';
import './app-banner.css';

const features = [
  { label: 'Carteirinha digital', Icon: CreditCard },
  { label: 'Rede credenciada', Icon: MapPin },
  { label: 'Contatos úteis', Icon: Phone },
  { label: 'Acompanhamento de solicitações', Icon: FileCheck },
];

export function AppBanner() {
  return <section id="aplicativo" className="app-banner" aria-labelledby="app-banner-title">
    <div className="app-banner-copy">
      <span className="app-banner-eyebrow">Aplicativo Amélia Saúde</span>
      <h2 id="app-banner-title">Seu plano na palma da mão.</h2>
      <ul>{features.map(({ label, Icon }) => <li key={label}><Icon size={22} aria-hidden="true" />{label}</li>)}</ul>
      <div className="app-banner-stores">
        <a href="https://apps.apple.com/br/app/id6822854228">Baixar na App Store</a>
        <a href="https://play.google.com/store/apps/details?id=br.com.mobilesaude.ameliasaude">Baixar no Google Play</a>
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
