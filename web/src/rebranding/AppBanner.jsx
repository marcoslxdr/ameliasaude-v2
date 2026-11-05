import { CreditCard, FileText, MapPin, RefreshCw, UserRound } from 'lucide-react';
import './app-banner.css';

const features = [
  { label: 'Carteirinha digital', Icon: CreditCard },
  { label: 'Rede credenciada', Icon: MapPin },
  { label: 'Solicitação de reembolso', Icon: RefreshCw },
  { label: 'Atualização cadastral', Icon: UserRound },
  { label: 'Extrato de utilização', Icon: FileText },
];

export function AppBanner() {
  return <section className="app-banner" aria-labelledby="app-banner-title">
    <div className="app-banner-copy">
      <span className="app-banner-eyebrow">Aplicativo Amélia Saúde</span>
      <h2 id="app-banner-title">Seu plano na palma da mão.</h2>
      <ul>{features.map(({ label, Icon }) => <li key={label}><Icon size={22} aria-hidden="true" />{label}</li>)}</ul>
    </div>
    <div className="app-banner-art" aria-hidden="true">
      <div className="app-device">
        <img className="app-device-screen" src="/assets/app-servicos-previa.jpg"
          alt="" width="720" height="1600" loading="lazy" />
      </div>
    </div>
  </section>;
}
