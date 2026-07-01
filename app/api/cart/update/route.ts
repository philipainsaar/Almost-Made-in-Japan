import { NextRequest, NextResponse } from 'next/server';
import { updateLine } from '@/lib/shopify';

export async function POST(req: NextRequest) {
  try {
    const { cartId, lineId, quantity } = await req.json();
    if (!cartId || !lineId) return NextResponse.json({ error: 'Missing cartId or lineId' }, { status: 400 });
    const buyerIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const cart = await updateLine(cartId, lineId, Number(quantity) || 1, buyerIp);
    return NextResponse.json({ cart });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Cart update failed' }, { status: 500 });
  }
}
