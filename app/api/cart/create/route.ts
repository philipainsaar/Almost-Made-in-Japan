import { NextRequest, NextResponse } from 'next/server';
import { createCart } from '@/lib/shopify';

export async function POST(req: NextRequest) {
  try {
    const { merchandiseId, quantity = 1 } = await req.json();
    if (!merchandiseId) return NextResponse.json({ error: 'Missing merchandiseId' }, { status: 400 });
    const buyerIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const cart = await createCart(merchandiseId, Number(quantity) || 1, buyerIp);
    return NextResponse.json({ cart });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Cart create failed' }, { status: 500 });
  }
}
