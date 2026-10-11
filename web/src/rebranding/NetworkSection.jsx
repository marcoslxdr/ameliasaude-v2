import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SiteLink } from './App.jsx';
import cities from './data/network-cities.json';
import './network-section.css';

// Positions follow the source order: three inner cities, then six outer cities.
const CITY_POSITIONS = [
  { x: 50, y: 27 },
  { x: 69.92, y: 61.5 },
  { x: 30.08, y: 61.5 },
  { x: 69.5, y: 16.23, labelAbove: true },
  { x: 89, y: 50 },
  { x: 69.5, y: 83.77 },
  { x: 30.5, y: 83.77 },
  { x: 11, y: 50 },
  { x: 30.5, y: 16.23, labelAbove: true },
];

const CITY_LABEL_LINES = {
  'sao-goncalo': ['São', 'Gonçalo'],
  'duque-de-caxias': ['Duque de', 'Caxias'],
  'nova-iguacu': ['Nova', 'Iguaçu'],
  'sao-joao-de-meriti': ['São João', 'de Meriti'],
  'belford-roxo': ['Belford', 'Roxo'],
};

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
      <div className="nw-orbit">
        <svg className="nw-orbit-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <circle className="nw-orbit-track" cx="50" cy="50" r="23" vectorEffect="non-scaling-stroke" />
          <circle className="nw-orbit-track nw-orbit-track-outer" cx="50" cy="50" r="39" vectorEffect="non-scaling-stroke" />
          <circle className="nw-orbit-light nw-orbit-light-inner" cx="50" cy="50" r="23" pathLength="100" vectorEffect="non-scaling-stroke" />
          <circle className="nw-orbit-light nw-orbit-light-outer" cx="50" cy="50" r="39" pathLength="100" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="nw-hub">
          <img src="/assets/logo-amelia-site.png" width="132" height="54" alt="Amélia Saúde" loading="lazy" decoding="async" />
        </div>
        <ul className="nw-cities" aria-label="Municípios da rede credenciada">
          {cities.map((city, index) => {
            const position = CITY_POSITIONS[index];
            const labelLines = CITY_LABEL_LINES[city.id] || [city.name];
            return <li key={city.id} className={`nw-city${position.labelAbove ? ' nw-city-label-above' : ''}`} style={{ left: `${position.x}%`, top: `${position.y}%` }}>
              <figure>
                <img src={city.image} width={city.width} height={city.height} alt={city.alt} loading="lazy" decoding="async" style={{ objectPosition: city.objectPosition }} />
                <figcaption>{labelLines.map((line, lineIndex) => <React.Fragment key={line}>{lineIndex > 0 && ' '}<span>{line}</span></React.Fragment>)}</figcaption>
              </figure>
            </li>;
          })}
        </ul>
      </div>
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
