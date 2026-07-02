// components/PhotoBand.tsx
import { SITE_ASSETS } from '@/lib/site-assets';
import { CenteredImageScroller } from './CenteredImageScroller';

export function PhotoBand({
  compact = false,
  images = SITE_ASSETS.photoImages
}: {
  compact?: boolean;
  images?: string[];
}) {
  return (
    <CenteredImageScroller
      className="photo-band"
      compact={compact}
      images={images}
      ariaLabel="Almost Made in Japan photo gallery"
      alt="Almost Made in Japan styling"
    />
  );
}
