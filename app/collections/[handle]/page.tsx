import Link from 'next/link';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { NewsletterFooter } from '@/components/NewsletterFooter';
import { FloatingMascot } from '@/components/FloatingMascot';
import { getCollection } from '@/lib/shopify';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ handle: string }> };

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const collection = await getCollection(handle, 24);
  if (!collection) notFound();

  return (
    <main>
      <Header />
      <section className="collection-page page-pad">
        <Link href="/" className="back-link">← Back</Link>
        <h1>{collection.title}</h1>
        <div className="product-grid-wide">
          {(collection.products || []).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <NewsletterFooter />
      <FloatingMascot />
    </main>
  );
}
