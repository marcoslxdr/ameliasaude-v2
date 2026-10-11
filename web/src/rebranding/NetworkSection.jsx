import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SiteLink } from './App.jsx';
import cities from './data/network-cities.json';
import './network-section.css';

export function NetworkSection({ navigate }) {
  return <section id="rede" className="nw-section" aria-labelledby="nw-title">
    <div className="nw-shell">
      <div className="nw-copy">
        <span className="nw-eyebrow">REDE</span>
        <h2 id="nw-title">Ampla rede credenciada pertinho de você</h2>
        <p className="nw-lead">Conheça os Hospitais, Clínicas e Laboratórios disponíveis por serviço, especialidade e município no Rio e Grande Rio</p>
        <SiteLink href="/rede-credenciada" navigate={navigate} className="nw-cta">
          Conheça nossa rede <ArrowRight size={20} strokeWidth={1.5} aria-hidden="true" />
        </SiteLink>
      </div>
      <ul className="nw-cities" aria-label="Municípios da rede credenciada">
        {cities.map(city => <li key={city.id} className="nw-city">
          <figure>
            <img src={city.image} width={city.width} height={city.height} alt={city.alt} loading="lazy" decoding="async" style={{ objectPosition: city.objectPosition }} />
            <figcaption>{city.name}</figcaption>
          </figure>
        </li>)}
      </ul>
      <details className="nw-credits">
        <summary>Créditos das fotos</summary>
        <p>Fotografias redimensionadas e recortadas para exibição.</p>
        <ul>{cities.map(city => <li key={city.id}>
          <a href={city.photograph.source} target="_blank" rel="noopener noreferrer">{city.name}: {city.photograph.author}</a>
          {' · '}<a href={city.photograph.licenseUrl} target="_blank" rel="noopener noreferrer">{city.photograph.license}</a>
        </li>)}</ul>
      </details>
    </div>
  </section>;
}
