'use client';

import { useEffect } from 'react';

interface PageTearOverlayProps {
  onDone?: () => void;
}

export default function PageTearOverlay({ onDone }: PageTearOverlayProps) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 900);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
      animation: 'tear-fall 900ms cubic-bezier(.5,.1,.8,.6) forwards',
      zIndex: 5,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'var(--paper)',
        clipPath: 'polygon(0% 4%, 5% 1%, 10% 5%, 16% 0%, 22% 6%, 30% 2%, 38% 7%, 48% 1%, 58% 8%, 68% 2%, 78% 6%, 88% 1%, 96% 6%, 100% 2%, 100% 100%, 0 100%)',
        boxShadow: '0 18px 36px -10px rgba(0,0,0,0.3)',
        transformOrigin: 'top left',
        animation: 'tear-rot 900ms cubic-bezier(.5,.1,.8,.6) forwards',
      }} />
      <style>{`
        @keyframes tear-fall {
          0%   { transform: translateY(0) rotate(0); opacity: 1; }
          40%  { transform: translateY(40px) rotate(8deg); opacity: 1; }
          100% { transform: translateY(220px) rotate(-12deg); opacity: 0; }
        }
        @keyframes tear-rot {
          0%   { transform: rotate(0); }
          100% { transform: rotate(2deg); }
        }
      `}</style>
    </div>
  );
}
