import React from 'react';
import hospitalHighlights from './data/hospital-highlights.json';
import './story-hospitals.css';

export function HospitalSection({ id = 'hospitais' }) {
  return <section id={id} className="hospital-section" aria-labelledby={`${id}-heading`}>
    <div className="hs-shell">
      <div className="hs-intro">
        <h2 id={`${id}-heading`}>Hospitais, Clínicas e Laboratórios <span>em destaque</span></h2>
      </div>
      <ul id={`${id}-gallery`} className="hs-grid" aria-label="Fotografias dos prestadores em destaque">
        {hospitalHighlights.units.map(unit => <li key={unit.name}>
          <figure className="hs-card-photo">
            <img
              src={unit.photo.src}
              alt={unit.photo.alt}
              width={unit.photo.width}
              height={unit.photo.height}
              style={{ objectPosition: unit.photo.objectPosition || 'center' }}
              loading="lazy"
              decoding="async"
            />
            <figcaption>{unit.displayName}</figcaption>
          </figure>
        </li>)}
      </ul>
    </div>
  </section>;
}
