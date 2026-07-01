import Link from 'next/link';
import { SITE_ASSETS } from '@/lib/site-assets';
import type { ShopifyCollection } from '@/lib/shopify';

function imageFor(collection: ShopifyCollection) {
  return collection.image?.url || SITE_ASSETS.collectionImages[collection.handle as keyof typeof SITE_ASSETS.collectionImages] || SITE_ASSETS.footerHeart;
}

export function CollectionsGrid({ collections }: { collections: ShopifyCollection[] }) {
  return (
    <section className="page-pad collections-section">
      <h2>COLLECTIONS</h2>
      <div className="tile-grid collection-grid">
        {collections.map((collection) => (
          <Link className="collection-tile" href={`/collections/${collection.handle}`} key={collection.id}>
            <img src={imageFor(collection)} alt={collection.title} />
            <span>{collection.title.toUpperCase()} →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
