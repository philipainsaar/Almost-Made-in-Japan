import { AmijHome } from '@/components/AmijHome';
import { getCollectionProducts, getCollectionsByHandles, getEnvHandles } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await getCollectionProducts(process.env.SHOPIFY_JEWELRY_COLLECTION_HANDLE || 'jewelry', 14);
  const categoryHandles = getEnvHandles(process.env.SHOPIFY_CATEGORY_HANDLES, [
    'necklaces',
    'earrings',
    'hair-clips',
    'rings',
    'accessories',
    'sunglasses'
  ]);
  const collectionHandles = getEnvHandles(process.env.SHOPIFY_COLLECTION_HANDLES, ['dreamy', 'emo', 'nature', 'cyber']);
  const [categories, collections] = await Promise.all([
    getCollectionsByHandles(categoryHandles),
    getCollectionsByHandles(collectionHandles)
  ]);

  return <AmijHome products={products} categories={categories} collections={collections} />;
}
