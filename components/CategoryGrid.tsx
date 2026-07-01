import Link from 'next/link';
import { SITE_ASSETS } from '@/lib/site-assets';
import type { ShopifyCollection } from '@/lib/shopify';

function imageFor(collection: ShopifyCollection) {
  return collection.image?.url || collection.products?.[0]?.featuredImage?.url || SITE_ASSETS.categoryFallbacks[collection.handle as keyof typeof SITE_ASSETS.categoryFallbacks] || SITE_ASSETS.demoProduct;
}

export function CategoryGrid({ categories }: { categories: ShopifyCollection[] }) {
  return (
    <section className="page-pad category-section">
      <h2>JEWELLERY</h2>
      <div className="tile-grid">
        {categories.map((collection) => (
          <Link className="category-tile" href={`/collections/${collection.handle}`} key={collection.id}>
            <img src={imageFor(collection)} alt={collection.title} />
            <span>{collection.title.toUpperCase()} →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
