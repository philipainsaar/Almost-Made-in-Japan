import { NextRequest, NextResponse } from 'next/server';
import { removeLine } from '@/lib/shopify';

export async function POST(req: NextRequest) {
  try {
    const { cartId, lineId } = await req.json();
    if (!cartId || !lineId) return NextResponse.json({ error: 'Missing cartId or lineId' }, { status: 400 });
    const buyerIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const cart = await removeLine(cartId, lineId, buyerIp);
    return NextResponse.json({ cart });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Cart remove failed' }, { status: 500 });
  }
}
