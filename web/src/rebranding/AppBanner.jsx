import { CreditCard, FileCheck, MapPin, MessageCircle, ShieldCheck, UserRound } from 'lucide-react';
import './app-banner.css';

const features = [
  { label: 'Carteirinha virtual', Icon: CreditCard },
  { label: 'Rede credenciada', Icon: MapPin },
  { label: 'Solicitação de reembolso', Icon: FileCheck },
  { label: 'Atualização cadastral', Icon: UserRound },
  { label: 'Garantia de atendimento', Icon: ShieldCheck },
  { label: 'Atendimento via Chat', Icon: MessageCircle },
];

const devices = [
  {
    model: 'iPhone', screen: 'Início', image: '/assets/app-inicio-previa.jpg',
    store: 'App Store', badge: '/assets/app-store-pt-br.svg',
    url: 'https://apps.apple.com/br/app/id6822854228',
  },
  {
    model: 'Android', screen: 'Serviços', image: '/assets/app-servicos-previa.jpg',
    store: 'Google Play', badge: '/assets/google-play-pt-br.png',
    url: 'https://play.google.com/store/apps/details?id=br.com.mobilesaude.ameliasaude',
  },
];

export function AppBanner() {
  return <section id="aplicativo" className="app-banner" aria-labelledby="app-banner-title">
    <div className="app-banner-copy">
      <h2 id="app-banner-title">Seu plano na palma da mão.</h2>
      <p>Baixe o aplicativo Amélia Saúde e tenha acesso a diversas funcionalidades com praticidade e segurança 24h.</p>
      <ul>{features.map(({ label, Icon }) => <li key={label}><Icon size={22} aria-hidden="true" />{label}</li>)}</ul>
      <p>E MUITO MAIS!</p>
    </div>
    <div className="app-banner-art">
      <div className="app-device-pair">
        {devices.map(({ model, screen, image, store, url, badge }) => (
          <div className="app-device-column" key={model}>
            <a className="app-device-view" href={image} target="_blank" rel="noopener noreferrer"
              aria-label={`Ampliar tela de ${screen.toLowerCase()} no ${model} em uma nova aba`}>
              <span className={`app-device app-device--${model.toLowerCase()}`}>
                <span className="app-device-viewport">
                  <img className="app-device-screen" src={image} alt="" loading="lazy" />
                </span>
              </span>
              <span className="app-device-caption">{model}</span>
            </a>
            <a className="app-store-badge" href={url}>
              <img src={badge} alt={store === 'App Store' ? 'Baixar na App Store' : 'Baixar no Google Play'} />
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>;
}
