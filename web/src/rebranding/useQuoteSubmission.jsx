import { useCallback, useEffect, useRef, useState } from 'react';
import { track } from '../lib/analytics';
import { collectQuoteErrors, createQuoteRequestSession, quoteErrorMessage } from './quote-request.mjs';

export function trackQuoteStep(event, livesCount, moreLives, intent) {
  track(event, { livesCount, moreLives, pathname: window.location.pathname, ...(intent ? { intent } : {}) });
}

export function useQuoteSubmission() {
  const session = useRef(null), mounted = useRef(true);
  if (session.current === null) { session.current = createQuoteRequestSession(); }
  const [status, setStatus] = useState('idle'), [errorMessage, setErrorMessage] = useState('');
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const resetSubmission = useCallback(() => { session.current.reset(); setStatus('idle'); setErrorMessage(''); }, []);
  const submitQuote = async input => {
    if (session.current.pending) return { status: 'busy' };
    const errors = collectQuoteErrors(input);
    if (Object.keys(errors).length) return { status: 'error', errors };
    setStatus('submitting'); setErrorMessage('');
    const properties = { livesCount: input.lives, moreLives: Boolean(input.more), pathname: window.location.pathname, ...(input.intent ? { intent: input.intent } : {}) };
    track('cotacao_submit_started', properties);
    const result = await session.current.submit({ ...input, pageUrl: window.location.href, referrer: document.referrer || undefined });
    if (mounted.current) {
      setStatus(result.status);
      setErrorMessage(result.status === 'error' ? quoteErrorMessage(result.code) : '');
    }
    track(result.status === 'success' ? 'cotacao_submit_success' : 'cotacao_submit_error', { ...properties, ...(result.code ? { error: result.code } : {}) });
    return result;
  };
  return { status, errorMessage, submitQuote, resetSubmission };
}
