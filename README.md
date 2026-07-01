# AMIJ Next.js + Shopify storefront

This is the real storefront version for an Almost Made in Japan style jewelry shop.

It is built as:

- Next.js App Router frontend
- Shopify Storefront API product loading
- Shopify Cart API mutations
- Shopify checkout redirect through `cart.checkoutUrl`
- Developer-controlled WebGL/Three.js visual slot, not mounted by default and never shown as a public toggle
- AMIJ-style mobile layout matching the supplied screenshots: white header, centered round logo, hamburger/search/bag icons, cyan/pink marquee strips, 2-column category grids, collection hearts, floating mascot, featured product block, horizontal favourites rail, newsletter, country/language selectors, and payment badges.

## 1. Install

```bash
npm install
```

## 2. Add Shopify connection

Copy the env file:

```bash
cp .env.example .env.local
```

Fill in:

```bash
SHOPIFY_STORE_DOMAIN="your-store.myshopify.com"
SHOPIFY_STOREFRONT_API_VERSION="2026-07"
SHOPIFY_STOREFRONT_PRIVATE_TOKEN="your_private_storefront_token"
SHOPIFY_JEWELRY_COLLECTION_HANDLE="jewelry"
SHOPIFY_CATEGORY_HANDLES="necklaces,earrings,hair-clips,rings,accessories,sunglasses"
SHOPIFY_COLLECTION_HANDLES="dreamy,emo,nature,cyber"
SHOPIFY_COUNTRY_CODE="SE"
```

The project also supports `SHOPIFY_STOREFRONT_PUBLIC_TOKEN`, but the private token is better for this server-side Next.js setup.

## 3. Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 4. Add your AMIJ assets

Replace files in:

```text
public/assets/
```

The paths are configured in:

```text
lib/site-assets.ts
```

The product images are not hardcoded. They load from Shopify Admin products/collections.

## 5. Shopify Admin setup

Create these collections or adjust the handles in `.env.local`:

```text
jewelry
necklaces
earrings
hair-clips
rings
accessories
sunglasses
dreamy
emo
nature
cyber
```

For each Shopify product, make sure it is available to the Headless / Storefront sales channel, has a product image, price, variant, and inventory policy you want.

## 6. Developer-controlled visual layer

Three.js support is included, but it is not mounted on the storefront by default and there is no customer-facing toggle, label, or button. Add it only where you want it in the design.

To place the branded visual slot inside any page or component:

```tsx
import { AmijWorldSlot } from '@/components/AmijWorldSlot';

<AmijWorldSlot title="Infinite Summer" />
```

The slot renders as a normal branded visual area. Customers never see the words Three.js, 3D, viewer, ON, or OFF.

## 7. Deploy to Vercel

Add the same env vars in Vercel Project Settings → Environment Variables, then deploy.

## Important files

```text
app/page.tsx                         Home page data load
app/api/cart/*/route.ts              Shopify cart mutations
lib/shopify.ts                       Storefront API queries and cart code
lib/site-assets.ts                   Logo, mascot, campaign, collection image paths
components/AmijHome.tsx              Main homepage layout
components/Header.tsx                AMIJ-style header
components/AmijWorldSlot.tsx      Developer-only visual placement slot
components/AmijJewelryCanvas.tsx    Procedural jewelry canvas, replaceable with .glb models
app/globals.css                      Main visual style
```
