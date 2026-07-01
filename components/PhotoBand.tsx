import { SITE_ASSETS, SHOP_COPY } from '@/lib/site-assets';
import { MarqueeStrip } from './MarqueeStrip';

export function PhotoBand({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`photo-band ${compact ? 'compact' : ''}`}>
      {!compact && <MarqueeStrip tone="pink">{SHOP_COPY.photosMarquee}</MarqueeStrip>}
      <div className="photo-row">
        {SITE_ASSETS.photoImages.map((src) => <img key={src} src={src} alt="Customer wearing jewelry" />)}
        {SITE_ASSETS.heroImages.map((src) => <img key={src} src={src} alt="AMIJ jewelry style" />)}
      </div>
    </section>
  );
}
