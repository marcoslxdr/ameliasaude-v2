import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import hospitalHighlights from './data/hospital-highlights.json';
import './story-hospitals.css';

const { units, source } = hospitalHighlights;
const municipalities = [...new Set(units.map(unit => unit.city))].sort((a, b) => {
  const countDifference = units.filter(unit => unit.city === b).length - units.filter(unit => unit.city === a).length;
  return countDifference || a.localeCompare(b, 'pt-BR');
});
const serviceLabels = { 'PRONTO SOCORRO': 'Pronto socorro', 'INTERNAÇÃO': 'Internação' };

function placeLabel(value) {
  return value.toLocaleLowerCase('pt-BR').split(' ').map((word, index) =>
    index > 0 && ['de', 'da', 'do', 'das', 'dos', 'e'].includes(word) ? word : word.charAt(0).toLocaleUpperCase('pt-BR') + word.slice(1)
  ).join(' ');
}

function networkLabel(value) {
  if (value.endsWith('SEM COPART')) return 'Sem coparticipação';
  if (value.endsWith('COM COPART')) return 'Com coparticipação';
  return value;
}

export function HospitalSection({ navigate, id = 'hospitais' }) {
  const [city, setCity] = useState('');
  const [galleryControls, setGalleryControls] = useState({ previous: false, next: true });
  const gridRef = useRef(null);
  const visibleUnits = city ? units.filter(unit => unit.city === city) : units;

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    grid.scrollLeft = 0;
    const cards = [...grid.children].filter(item => !item.hidden).map(item => item.querySelector('.hs-card'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer;

    function updateControls() {
      const previous = grid.scrollLeft > 2;
      const next = grid.scrollWidth - grid.clientWidth - grid.scrollLeft > 2;
      setGalleryControls(current => current.previous === previous && current.next === next ? current : { previous, next });
    }

    function updateReveal() {
      observer?.disconnect();
      if (reducedMotion.matches || !('IntersectionObserver' in window)) {
        grid.dataset.reveal = 'static';
        cards.forEach(card => { card.dataset.revealed = 'true'; });
        return;
      }

      observer = new window.IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.revealed = 'true';
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.01, rootMargin: '0px 0px -24px 0px' });
      grid.dataset.reveal = 'ready';
      cards.forEach((card, index) => {
        card.style.setProperty('--hs-reveal-delay', `${(index % 3) * 35}ms`);
        if (card.dataset.revealed !== 'true') observer.observe(card);
      });
    }

    updateReveal();
    updateControls();
    grid.addEventListener('scroll', updateControls, { passive: true });
    window.addEventListener('resize', updateControls, { passive: true });
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateControls);
    resizeObserver?.observe(grid);
    reducedMotion.addEventListener('change', updateReveal);
    return () => {
      observer?.disconnect();
      resizeObserver?.disconnect();
      grid.removeEventListener('scroll', updateControls);
      window.removeEventListener('resize', updateControls);
      reducedMotion.removeEventListener('change', updateReveal);
      delete grid.dataset.reveal;
    };
  }, [city]);

  function scrollGallery(direction) {
    const grid = gridRef.current;
    if (!grid) return;
    const firstItem = [...grid.children].find(item => !item.hidden);
    if (!firstItem) return;
    const gap = parseFloat(window.getComputedStyle(grid).columnGap) || 0;
    const distance = firstItem.getBoundingClientRect().width + gap;
    grid.scrollBy({ left: direction * distance, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  function handleGalleryKey(event) {
    if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      scrollGallery(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const grid = gridRef.current;
      grid?.scrollTo({ left: event.key === 'Home' ? 0 : grid.scrollWidth - grid.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  }

  function openNetwork(event) {
    if (navigate && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      navigate('/rede-credenciada');
    }
  }

  return <section id={id} className="hospital-section" aria-labelledby={`${id}-heading`}>
    <div className="hs-shell">
      <div className="hs-intro">
        <div><span className="hs-eyebrow">Rio e Grande Rio</span><h2 id={`${id}-heading`}>Hospitais em <span>destaque</span></h2></div>
        <div className="hs-intro-detail"><p className="hs-total"><strong>{units.length}</strong> unidades em <strong>{municipalities.length}</strong> municípios</p><p>Consulte os prestadores disponíveis para o seu plano por serviço, especialidade e município no Rio e Grande Rio.</p></div>
      </div>
      <div className="hs-filter-bar"><span className="hs-filter-label">Município</span><div className="hs-filters" role="group" aria-label="Filtrar hospitais por município"><button type="button" aria-pressed={city === ''} onClick={() => setCity('')}>Todos</button>{municipalities.map(municipality => <button key={municipality} type="button" aria-pressed={city === municipality} onClick={() => setCity(municipality)}>{placeLabel(municipality)}</button>)}</div></div>
      <div className="hs-footer"><div><p className="hs-coverage-note">A cobertura depende do plano e do serviço. Confira a disponibilidade no guia da rede credenciada.</p><p className="hs-source-note">Guia da rede atualizado em <time dateTime={source.updatedAt}>{source.updatedLabel}</time>.</p></div><a className="hs-network-link" href="/rede-credenciada" onClick={openNetwork}>Ver rede credenciada <ArrowRight size={19} strokeWidth={1.4} aria-hidden="true" /></a></div>
      <div className="hs-gallery-toolbar"><p className="hs-result-count" role="status" aria-live="polite" aria-atomic="true">{visibleUnits.length} {visibleUnits.length === 1 ? 'unidade' : 'unidades'}{city ? ` em ${placeLabel(city)}` : ' em destaque'}</p><div className="hs-gallery-controls"><button type="button" className="hs-gallery-arrow" aria-label="Hospital anterior" aria-controls={`${id}-gallery`} disabled={!galleryControls.previous || visibleUnits.length < 2} onClick={() => scrollGallery(-1)}><ChevronLeft size={21} strokeWidth={1.5} aria-hidden="true" /></button><button type="button" className="hs-gallery-arrow" aria-label="Próximo hospital" aria-controls={`${id}-gallery`} disabled={!galleryControls.next || visibleUnits.length < 2} onClick={() => scrollGallery(1)}><ChevronRight size={21} strokeWidth={1.5} aria-hidden="true" /></button></div></div>
      <ul ref={gridRef} id={`${id}-gallery`} className="hs-grid hs-gallery" aria-label="Unidades hospitalares" tabIndex={0} onKeyDown={handleGalleryKey}>
        {units.map(unit => <li key={`${unit.name}|${unit.city}`} hidden={Boolean(city && unit.city !== city)}>
          <article className={`hs-card${unit.photo?.src ? ' hs-card-with-photo' : ''}`}>
            {unit.photo?.src && <figure className="hs-card-photo"><img src={unit.photo.src} alt={unit.photo.alt || unit.displayName} width={unit.photo.width || 1200} height={unit.photo.height || 750} style={{objectPosition:unit.photo.objectPosition || 'center'}} loading="lazy" decoding="async" />{unit.photo.credit && <figcaption className="hs-photo-credit">{unit.photo.sourceUrl ? <a href={unit.photo.sourceUrl} target="_blank" rel="noopener noreferrer">{unit.photo.credit}</a> : <span>{unit.photo.credit}</span>}</figcaption>}</figure>}
            <div className="hs-card-top"><span className="hs-card-city">{placeLabel(unit.city)}</span><span className="hs-card-number" aria-hidden="true">{String(units.indexOf(unit) + 1).padStart(2, '0')}</span></div>
            <h3>{unit.displayName}</h3>
            {unit.services.length > 0 && <ul className="hs-services" aria-label="Serviços registrados">{unit.services.map(service => <li key={service}>{serviceLabels[service] || service}</li>)}</ul>}
            {unit.specialties.length > 0 && <ul className="hs-specialties" aria-label="Especialidades registradas">{unit.specialties.map(specialty => <li key={specialty}>{placeLabel(specialty)}</li>)}</ul>}
            <div className="hs-card-plan">{unit.coverageVerified === false ? <span className="hs-product">Disponibilidade sob consulta</span> : <><span className="hs-product">{placeLabel(unit.product)}</span><ul className="hs-networks" aria-label="Redes disponíveis">{unit.networks.map(network => <li key={network}>{networkLabel(network)}</li>)}</ul></>}</div>
          </article>
        </li>)}
      </ul>
    </div>
  </section>;
}
