import { SITE_ASSETS, SHOP_COPY } from '@/lib/site-assets';
import { MarqueeStrip } from './MarqueeStrip';

export function PhotoBand({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`photo-band ${compact ? 'compact' : ''}`}>
      {!compact && <MarqueeStrip tone="pink">{SHOP_COPY.photosMarquee}</MarqueeStrip>}
<div className="photo-row">
  {SITE_ASSETS.photoImages.map((src) => (
    <img key={src} src={src} alt="Almost made in Japan jewelry styling" />
  ))}
</div>
    </section>
  );
}
