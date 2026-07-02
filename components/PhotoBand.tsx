import { SITE_ASSETS } from '@/lib/site-assets';

export function PhotoBand({
  compact = false,
  images = SITE_ASSETS.photoImages
}: {
  compact?: boolean;
  images?: string[];
}) {
  return (
    <section
      className={`photo-band${compact ? ' compact' : ''}`}
      aria-label="Almost Made in Japan photo gallery"
    >
      <div className="photo-row">
        {images.map((src) => (
          <img key={src} src={src} alt="Almost Made in Japan styling" />
        ))}
      </div>
    </section>
  );
}
