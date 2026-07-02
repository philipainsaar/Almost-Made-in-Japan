// components/AmijHome.tsx
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { MarqueeStrip } from './MarqueeStrip';
import { CategoryGrid } from './CategoryGrid';
import { CollectionsGrid } from './CollectionsGrid';
import { FeaturedProduct } from './FeaturedProduct';
import { ProductRail } from './ProductRail';
import { PhotoBand } from './PhotoBand';
import { NewsletterFooter } from './NewsletterFooter';
import { FloatingMascot } from './FloatingMascot';
import { CenteredImageScroller } from './CenteredImageScroller';
import { SITE_ASSETS, SHOP_COPY } from '@/lib/site-assets';
import type { ShopifyCollection, ShopifyProduct } from '@/lib/shopify';

export function AmijHome({
  products,
  categories,
  collections
}: {
  products: ShopifyProduct[];
  categories: ShopifyCollection[];
  collections: ShopifyCollection[];
}) {
  const featured = products[0];

  return (
    <main>
      <AnnouncementBar />
      <Header />

      <MarqueeStrip>{SHOP_COPY.heroMarquee}</MarqueeStrip>

      <CenteredImageScroller
        className="hero-slice"
        images={[SITE_ASSETS.heroMain, SITE_ASSETS.heroCloseup]}
        ariaLabel="Almost Made in Japan campaign images"
        alt="Almost Made in Japan campaign"
      />

      <MarqueeStrip>{SHOP_COPY.heroMarquee}</MarqueeStrip>

      <CategoryGrid categories={categories} />
      <CollectionsGrid collections={collections} />

      <CenteredImageScroller
        className="split-photo"
        images={[SITE_ASSETS.heroCloseup]}
        ariaLabel="Latest campaign split image"
        alt="Campaign jewelry detail"
      />

      <MarqueeStrip tone="pink">{SHOP_COPY.latestMarquee}</MarqueeStrip>

      {featured && <FeaturedProduct product={featured} />}

      <PhotoBand images={SITE_ASSETS.photoImages} />

      <ProductRail products={products} />

      <PhotoBand images={[SITE_ASSETS.heroExamples]} compact />

      <NewsletterFooter />
      <FloatingMascot />
    </main>
  );
}
