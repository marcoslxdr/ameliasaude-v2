import React, { useEffect, useRef } from 'react';
import { getStackScale } from './StackedCards.jsx';
import './closing-stack.css';

export function ClosingStack({ enabled, children }) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    const cards = [...root.querySelectorAll('[data-closing-card]')];
    const surfaces = cards.map(card => card.firstElementChild);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shortViewport = window.matchMedia('(max-height: 640px)');
    const scales = cards.map(() => 1);
    let frame = 0;
    let previousTime = 0;
    let keyboardFocus = false;

    function requestFrame() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    function update(now) {
      frame = 0;
      const disabled = reducedMotion.matches || shortViewport.matches || keyboardFocus;
      root.dataset.closingMotion = disabled ? 'static' : 'scroll';
      const viewportHeight = window.innerHeight;
      const headerTop = viewportHeight <= 640 ? 0 : window.innerWidth <= 640 ? 88 : 104;
      const heights = surfaces.map(surface => surface.offsetHeight);
      // Reserve the footer's space in main, then let its sibling occupy it.
      // The footer remains a top-level landmark, outside main.
      root.style.setProperty('--closing-footer-height', `${heights.at(-1)}px`);
      cards.forEach((card, index) => {
        // Tall mobile panels scroll fully before their bottom edge sticks.
        card.style.setProperty('--closing-top', `${Math.min(headerTop, viewportHeight - heights[index] - 16)}px`);
      });
      const tops = cards.map(card => card.getBoundingClientRect().top);
      const delta = previousTime ? Math.min(64, now - previousTime) : 1000 / 60;
      let unsettled = false;
      surfaces.forEach((surface, index) => {
        const target = !disabled && index < cards.length - 1
          ? getStackScale(tops[index + 1], viewportHeight, headerTop) : 1;
        scales[index] += (target - scales[index]) * (1 - Math.exp(-delta / 160));
        if (Math.abs(target - scales[index]) < .00001 || disabled) scales[index] = target;
        else unsettled = true;
        surface.style.setProperty('--closing-scale', scales[index].toFixed(5));
      });
      previousTime = unsettled ? now : 0;
      if (unsettled) requestFrame();
    }

    function onFocus(event) {
      keyboardFocus = !!event.target.closest('[data-closing-card]') && event.target.matches(':focus-visible');
      requestFrame();
      if (keyboardFocus) requestAnimationFrame(() => event.target.scrollIntoView({ block: 'center', behavior: 'instant' }));
    }

    function onBlur(event) {
      if (event.relatedTarget?.closest('[data-closing-card]')) return;
      keyboardFocus = false;
      requestFrame();
    }

    const observer = new ResizeObserver(requestFrame);
    surfaces.forEach(surface => observer.observe(surface));
    window.addEventListener('scroll', requestFrame, { passive: true });
    window.addEventListener('resize', requestFrame, { passive: true });
    reducedMotion.addEventListener('change', requestFrame);
    shortViewport.addEventListener('change', requestFrame);
    root.addEventListener('focusin', onFocus);
    root.addEventListener('focusout', onBlur);
    requestFrame();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', requestFrame);
      window.removeEventListener('resize', requestFrame);
      reducedMotion.removeEventListener('change', requestFrame);
      shortViewport.removeEventListener('change', requestFrame);
      root.removeEventListener('focusin', onFocus);
      root.removeEventListener('focusout', onBlur);
    };
  }, [enabled]);

  return <div ref={rootRef} className={enabled ? 'home-closing-stack' : undefined} data-closing-motion="static">{children}</div>;
}
