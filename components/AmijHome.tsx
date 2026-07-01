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
<section className="hero-slice" aria-label="Almost Made in Japan campaign image">
  <img src={SITE_ASSETS.heroMain} alt="Campaign image" />
</section>
      <MarqueeStrip>{SHOP_COPY.heroMarquee}</MarqueeStrip>

      <CategoryGrid categories={categories} />
      <CollectionsGrid collections={collections} />

<section className="split-photo" aria-label="Latest campaign split image">
  <img src={SITE_ASSETS.heroCloseup} alt="Campaign jewelry detail" />
  <img src={SITE_ASSETS.heroMain} alt="Campaign jewelry group" />
</section>
      <MarqueeStrip tone="pink">{SHOP_COPY.latestMarquee}</MarqueeStrip>

      {featured && <FeaturedProduct product={featured} />}
      <PhotoBand />
      <ProductRail products={products} />
      <PhotoBand compact />
      <NewsletterFooter />
      <FloatingMascot />
    </main>
  );
}
