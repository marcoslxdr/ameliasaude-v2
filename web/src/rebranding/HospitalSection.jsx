import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import hospitalHighlights from './data/hospital-highlights.json';
import './story-hospitals.css';

export function HospitalSection({ id = 'hospitais' }) {
  const galleryRef = useRef(null);
  const [galleryControls, setGalleryControls] = useState({ previous: false, next: true });

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    function updateControls() {
      const previous = gallery.scrollLeft > 2;
      const next = gallery.scrollWidth - gallery.clientWidth - gallery.scrollLeft > 2;
      setGalleryControls(current => current.previous === previous && current.next === next ? current : { previous, next });
    }

    const initialFrame = window.requestAnimationFrame(updateControls);
    gallery.addEventListener('scroll', updateControls, { passive: true });
    window.addEventListener('resize', updateControls, { passive: true });
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateControls);
    observer?.observe(gallery);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      observer?.disconnect();
      gallery.removeEventListener('scroll', updateControls);
      window.removeEventListener('resize', updateControls);
    };
  }, []);

  function scrollGallery(direction) {
    const gallery = galleryRef.current;
    const firstItem = gallery?.firstElementChild;
    if (!firstItem) return;
    const gap = parseFloat(window.getComputedStyle(gallery).columnGap) || 0;
    gallery.scrollBy({
      left: direction * (firstItem.getBoundingClientRect().width + gap),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }

  function handleGalleryKey(event) {
    if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      scrollGallery(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const gallery = galleryRef.current;
      gallery?.scrollTo({
        left: event.key === 'Home' ? 0 : gallery.scrollWidth - gallery.clientWidth,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    }
  }

  return <section id={id} className="hospital-section" aria-labelledby={`${id}-heading`}>
    <div className="hs-shell">
      <div className="hs-intro">
        <h2 id={`${id}-heading`}>Hospitais, Clínicas e Laboratórios <span>em destaque</span></h2>
        <div className="hs-gallery-controls" role="group" aria-label="Navegar pelos prestadores em destaque">
          <button type="button" className="hs-gallery-arrow" aria-label="Prestador anterior" aria-controls={`${id}-gallery`} disabled={!galleryControls.previous} onClick={() => scrollGallery(-1)}>
            <ChevronLeft size={21} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button type="button" className="hs-gallery-arrow" aria-label="Próximo prestador" aria-controls={`${id}-gallery`} disabled={!galleryControls.next} onClick={() => scrollGallery(1)}>
            <ChevronRight size={21} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
      <ul ref={galleryRef} id={`${id}-gallery`} className="hs-grid hs-gallery" aria-label="Fotografias dos prestadores em destaque" tabIndex={0} onKeyDown={handleGalleryKey}>
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
