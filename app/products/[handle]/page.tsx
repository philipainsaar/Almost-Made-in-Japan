import { Header } from '@/components/Header';
import { MarqueeStrip } from '@/components/MarqueeStrip';
import { FloatingMascot } from '@/components/FloatingMascot';
import { ProductDetails } from '@/components/ProductDetails';
import { NewsletterFooter } from '@/components/NewsletterFooter';
import { getProduct } from '@/lib/shopify';
import { SHOP_COPY } from '@/lib/site-assets';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ handle: string }> };

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  return (
    <main>
      <Header />
      <ProductDetails product={product} />
      <MarqueeStrip tone="pink">{SHOP_COPY.footerMarquee}</MarqueeStrip>
      <NewsletterFooter />
      <FloatingMascot />
    </main>
  );
}
