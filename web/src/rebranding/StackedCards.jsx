import React, { useEffect, useRef } from 'react';
import './stacked-cards.css';

const SCRUB_DURATION_MS = 800;
const SCALE_AMOUNT = 0.1;

function quadraticInOut(progress) {
  return progress < 0.5 ? 2 * progress * progress : 1 - ((-2 * progress + 2) ** 2) / 2;
}

// The header-safe sticky position replaces the reference's viewport-top endpoint.
export function getStackScale(nextCardTop, viewportHeight, stickyTop = 0) {
  const start = viewportHeight * 0.8;
  const progress = Math.min(1, Math.max(0, (start - nextCardTop) / Math.max(1, start - stickyTop)));
  return 1 - SCALE_AMOUNT * quadraticInOut(progress);
}

export function StackedCards({ items, headingLevel = 'h2', className = '' }) {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const surfaceRefs = useRef([]);
  const Heading = headingLevel;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length < 2) return;
    const cards = cardRefs.current.slice(0, items.length);
    const surfaces = surfaceRefs.current.slice(0, items.length);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shortViewport = window.matchMedia('(max-height: 640px)');
    const states = items.map(() => ({ value: 1, target: 1, startedAt: 0 }));
    let frame = 0;
    let lastFrameAt = 0;
    let needsMeasure = true;
    let disabled = false;

    function requestFrame() {
      if (!disabled && !frame) frame = window.requestAnimationFrame(animate);
    }

    function refresh() {
      needsMeasure = true;
      requestFrame();
    }

    function animate(now) {
      frame = 0;
      if (disabled) return;
      const deltaTime = lastFrameAt ? Math.min(64, now - lastFrameAt) : 1000 / 60;
      lastFrameAt = now;
      if (needsMeasure) {
        needsMeasure = false;
        const viewportHeight = window.innerHeight;
        const stickyTop = parseFloat(window.getComputedStyle(cards[0]).top) || 0;
        // Measure the untransformed sticky article. Only its inner surface scales.
        cards.forEach((card, index) => {
          const next = cards[index + 1];
          const target = next ? getStackScale(next.getBoundingClientRect().top, viewportHeight, stickyTop) : 1;
          const state = states[index];
          if (Math.abs(state.target - target) > 0.00001) {
            state.target = target;
            state.startedAt = now;
          }
        });
      }

      let unsettled = false;
      states.forEach((state, index) => {
        // A continuous response avoids restarting the easing ramp on every scroll event.
        const response = 1 - Math.exp(-deltaTime / (SCRUB_DURATION_MS / 5));
        state.value += (state.target - state.value) * response;
        if (now - state.startedAt >= SCRUB_DURATION_MS || Math.abs(state.target - state.value) <= 0.00001) state.value = state.target;
        surfaces[index].style.setProperty('--stack-scale', state.value.toFixed(5));
        if (Math.abs(state.target - state.value) > 0.00001) unsettled = true;
      });
      if (unsettled) requestFrame();
      else lastFrameAt = 0;
    }

    function updateMotionPreference() {
      disabled = reducedMotion.matches || shortViewport.matches;
      track.dataset.stackMotion = disabled ? 'static' : 'scroll';
      if (disabled) {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        lastFrameAt = 0;
        states.forEach(state => { state.value = 1; state.target = 1; state.startedAt = 0; });
        surfaces.forEach(surface => surface.style.removeProperty('--stack-scale'));
      } else {
        refresh();
      }
    }

    window.addEventListener('scroll', refresh, { passive: true });
    window.addEventListener('resize', refresh, { passive: true });
    reducedMotion.addEventListener('change', updateMotionPreference);
    shortViewport.addEventListener('change', updateMotionPreference);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(refresh);
    observer?.observe(track);
    updateMotionPreference();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', refresh);
      window.removeEventListener('resize', refresh);
      reducedMotion.removeEventListener('change', updateMotionPreference);
      shortViewport.removeEventListener('change', updateMotionPreference);
      observer?.disconnect();
      surfaces.forEach(surface => surface.style.removeProperty('--stack-scale'));
    };
  }, [items.length]);

  return <div ref={trackRef} className={`stacked-cards ${className}`} data-stack-motion="scroll">
    {items.map(({ title, body, image, Icon }, index) => <article
      key={title}
      ref={element => { cardRefs.current[index] = element; }}
      className="stacked-card"
      data-stack-card-index={index}
      style={{ '--stack-order': index + 1 }}
    >
      <div ref={element => { surfaceRefs.current[index] = element; }} className="stacked-card-surface">
        <div className="stacked-card-image"><img src={image.startsWith('/') ? image : `/assets/${image}`} alt={title} width="1200" height="700" loading="lazy" /></div>
        <div className="stacked-card-copy">{Icon && <span className="stacked-card-icon"><Icon size={28} strokeWidth={1.3} aria-hidden="true" /></span>}<Heading className="stacked-card-title">{title}</Heading><p className="stacked-card-body">{body}</p></div>
      </div>
    </article>)}
  </div>;
}
