import Link from 'next/link';

import { SITE_ASSETS } from '@/lib/site-assets';
import type { ShopifyCollection } from '@/lib/shopify';

function imageFor(collection: ShopifyCollection) {
  const fallback =
    SITE_ASSETS.categoryFallbacks[
      collection.handle as keyof typeof SITE_ASSETS.categoryFallbacks
    ];

  return (
    collection.image?.url ||
    fallback ||
    collection.products?.[0]?.featuredImage?.url ||
    SITE_ASSETS.demoProduct
  );
}

export function CategoryGrid({ categories }: { categories: ShopifyCollection[] }) {
  return (
    <section className="category-section page-pad">
      <h2>JEWELLERY</h2>

      <div className="tile-grid">
        {categories.map((collection) => (
          <Link
            className="category-tile"
            key={collection.handle}
            href={`/collections/${collection.handle}`}
          >
            <img src={imageFor(collection)} alt={collection.title} />
            <span>{collection.title.toUpperCase()} →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
