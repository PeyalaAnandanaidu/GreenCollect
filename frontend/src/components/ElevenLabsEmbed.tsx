import { useEffect, useRef } from 'react';

interface ElevenLabsEmbedProps {
  isLoggedIn: boolean;
}

const SCRIPT_SRC = 'https://unpkg.com/@elevenlabs/convai-widget-embed';

const ElevenLabsEmbed = ({ isLoggedIn }: ElevenLabsEmbedProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    let cancelled = false;

    const ensureScriptLoaded = (): Promise<void> => {
      return new Promise((resolve) => {
        // If script already present, resolve
        const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
        if (existing) return resolve();

        const s = document.createElement('script');
        s.src = SCRIPT_SRC;
        s.async = true;
        s.type = 'text/javascript';
        s.onload = () => resolve();
        document.head.appendChild(s);
      });
    };

    const waitForCustomElement = (): Promise<void> => {
      return new Promise((resolve) => {
        const check = () => {
          if ((window as any).customElements && (window as any).customElements.get('elevenlabs-convai')) {
            resolve();
          } else {
            setTimeout(check, 300);
          }
        };
        check();
      });
    };

    (async () => {
      await ensureScriptLoaded();
      await waitForCustomElement();
      if (cancelled) return;

      // Create and append the custom element once available
      if (containerRef.current && !containerRef.current.querySelector('elevenlabs-convai')) {
        const el = document.createElement('elevenlabs-convai');
        el.setAttribute('agent-id', 'agent_1101k7eje7wtetj8739rv2bx2ezz');
        containerRef.current.appendChild(el);
      }
    })();

    return () => { cancelled = true; };
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  return (
    <>
      <div ref={containerRef} style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1051 }} />
      <style>{`
        elevenlabs-convai { position: fixed !important; bottom: 30px !important; right: 30px !important; z-index: 1051 !important; }
        elevenlabs-convai button, elevenlabs-convai [role="button"] { background: linear-gradient(135deg, #ffcc00 0%, #ffaa00 100%) !important; border-radius: 50% !important; width: 70px !important; height: 70px !important; box-shadow: 0 8px 25px rgba(255, 204, 0, 0.3) !important; }
      `}</style>
    </>
  );
};

export default ElevenLabsEmbed;
