'use client';

import dynamic from 'next/dynamic';

const AmijJewelryCanvas = dynamic(() => import('./AmijJewelryCanvas'), {
  ssr: false,
  loading: () => <div className="visual-canvas-wrap visual-canvas-placeholder" aria-hidden="true" />
});

export function AmijWorldSlot({ title = 'Almost Made in Japan', className = '' }: { title?: string; className?: string }) {
  return (
    <div className={`amij-world-slot ${className}`} aria-hidden="true">
      <AmijJewelryCanvas title={title} />
    </div>
  );
}
