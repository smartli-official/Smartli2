'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// NOTE: intentionally CSS-only (no framer-motion, no blur filter).
// The old version animated `filter: blur()` on every navigation, which forces
// expensive repaints and pulled framer-motion into the critical path of every
// page. Opacity + translateY are GPU-composited and paint-free, same feel.
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    // Two rAFs so the enter-transition runs after the new page mounts.
    const raf1 = requestAnimationFrame(() =>
      requestAnimationFrame(() => setVisible(true)),
    );
    return () => cancelAnimationFrame(raf1);
  }, [pathname]);

  return (
    <div
      className="template-enter"
      data-visible={visible ? 'true' : 'false'}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
      }}
    >
      {children}
    </div>
  );
}
