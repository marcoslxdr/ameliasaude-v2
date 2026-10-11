import React from 'react';
import { ArrowRight } from 'lucide-react';
import cities from './data/network-cities.json';
import './network-section.css';

const CITY_LABEL_LINES = {
  'sao-goncalo': ['São', 'Gonçalo'],
  'duque-de-caxias': ['Duque de', 'Caxias'],
  'nova-iguacu': ['Nova', 'Iguaçu'],
  'sao-joao-de-meriti': ['São João', 'de Meriti'],
  'belford-roxo': ['Belford', 'Roxo'],
};

export function NetworkSection({ openSalesChat }) {
  return <section id="rede" className="nw-section" aria-labelledby="nw-title">
    <div className="nw-shell">
      <figure className="nw-rio-photo">
        <img src="/assets/rio-de-janeiro-hero.jpeg" width="1600" height="839" alt="Vista do Rio de Janeiro com o Pão de Açúcar" loading="lazy" decoding="async" />
        <figcaption>Rio de Janeiro</figcaption>
      </figure>
      <div className="nw-copy">
        <span className="nw-eyebrow">REDE</span>
        <h2 id="nw-title">Ampla rede credenciada pertinho de você</h2>
        <p className="nw-lead">Conheça os Hospitais, Clínicas e Laboratórios disponíveis por serviço, especialidade e município no Rio e Grande Rio</p>
        <ul className="nw-cities" aria-label="Municípios da rede credenciada">
          {cities.map(city => {
            const labelLines = CITY_LABEL_LINES[city.id] || [city.name];
            return <li key={city.id} className="nw-city">
              <figure>
                <img src={city.image} width={city.width} height={city.height} alt={city.alt} loading="lazy" decoding="async" style={{ objectPosition: city.objectPosition }} />
                <figcaption>{labelLines.map((line, lineIndex) => <React.Fragment key={line}>{lineIndex > 0 && ' '}<span>{line}</span></React.Fragment>)}</figcaption>
              </figure>
            </li>;
          })}
        </ul>
        <button type="button" onClick={openSalesChat} className="nw-cta" aria-haspopup="dialog" aria-controls="amelia-chat">
          Conheça nossa rede <ArrowRight size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <details className="nw-credits">
          <summary>Créditos das fotos dos municípios</summary>
          <p>Fotografias redimensionadas e recortadas para exibição.</p>
          <ul>{cities.map(city => <li key={city.id}>
            <a href={city.photograph.source} target="_blank" rel="noopener noreferrer">{city.name}: {city.photograph.author}</a>
            {' · '}<a href={city.photograph.licenseUrl} target="_blank" rel="noopener noreferrer">{city.photograph.license}</a>
          </li>)}</ul>
        </details>
      </div>
    </div>
  </section>;
}
