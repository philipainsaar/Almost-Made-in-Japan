// components/CenteredImageScroller.tsx
'use client';

import { useEffect, useMemo, useRef } from 'react';

export function CenteredImageScroller({
  images,
  className,
  compact = false,
  ariaLabel,
  alt = 'Almost Made in Japan image'
}: {
  images: string[];
  className: string;
  compact?: boolean;
  ariaLabel: string;
  alt?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const imageKey = useMemo(() => images.join('|'), [images]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let frame = 0;

    const centerFirstImage = () => {
      const firstImage = scroller.querySelector('img');

      if (!firstImage) {
        scroller.scrollLeft = Math.max(0, (scroller.scrollWidth - scroller.clientWidth) / 2);
        return;
      }

      const imageCenter = firstImage.offsetLeft + firstImage.clientWidth / 2;
      scroller.scrollLeft = Math.max(0, imageCenter - scroller.clientWidth / 2);
    };

    const requestCenter = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(centerFirstImage);
    };

    requestCenter();

    const imagesInside = Array.from(scroller.querySelectorAll('img'));

    imagesInside.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', requestCenter, { once: true });
      }
    });

    const resizeObserver = new ResizeObserver(requestCenter);
    resizeObserver.observe(scroller);
    imagesInside.forEach((img) => resizeObserver.observe(img));

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      imagesInside.forEach((img) => {
        img.removeEventListener('load', requestCenter);
      });
    };
  }, [imageKey]);

  return (
    <section
      className={`${className}${compact ? ' compact' : ''}`}
      aria-label={ariaLabel}
    >
      <div className="centered-swipe-row" ref={scrollerRef}>
        {images.map((src) => (
          <img key={src} src={src} alt={alt} />
        ))}
      </div>
    </section>
  );
}
