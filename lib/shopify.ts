import { normalizeHandle } from './format';
import { SITE_ASSETS } from './site-assets';

export type MoneyV2 = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable?: number | null;
  price: MoneyV2;
  selectedOptions?: { name: string; value: string }[];
  image?: ShopifyImage | null;
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description?: string;
  availableForSale: boolean;
  featuredImage?: ShopifyImage | null;
  priceRange: { minVariantPrice: MoneyV2 };
  variants: ShopifyVariant[];
};

export type ShopifyCollection = {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: ShopifyImage | null;
  products?: ShopifyProduct[];
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: MoneyV2;
    image?: ShopifyImage | null;
    product: Pick<ShopifyProduct, 'title' | 'handle'> & { featuredImage?: ShopifyImage | null };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: MoneyV2;
    totalAmount: MoneyV2;
  };
  lines: CartLine[];
};

type ShopifyGraphQLError = { message: string };

type ShopifyResponse<T> = {
  data?: T;
  errors?: ShopifyGraphQLError[];
};

const DEFAULT_VERSION = '2026-07';
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const version = process.env.SHOPIFY_STOREFRONT_API_VERSION || DEFAULT_VERSION;
const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
const publicToken = process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN;
const activeToken = privateToken || publicToken;
const isConfigured = Boolean(domain && activeToken);

function endpoint() {
  return `https://${domain}/api/${version}/graphql.json`;
}

function headers(buyerIp?: string) {
  const base: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (privateToken) {
    base['Shopify-Storefront-Private-Token'] = privateToken;
    if (buyerIp) base['Shopify-Storefront-Buyer-IP'] = buyerIp;
  } else if (publicToken) {
    base['X-Shopify-Storefront-Access-Token'] = publicToken;
  }

  return base;
}

export async function shopifyFetch<T>({
  query,
  variables,
  buyerIp,
  cache = 'no-store'
}: {
  query: string;
  variables?: Record<string, unknown>;
  buyerIp?: string;
  cache?: RequestCache;
}): Promise<T> {
  if (!isConfigured) {
    throw new Error('Shopify is not configured. Add SHOPIFY_STORE_DOMAIN and a Storefront token.');
  }

  const res = await fetch(endpoint(), {
    method: 'POST',
    headers: headers(buyerIp),
    body: JSON.stringify({ query, variables }),
    cache
  });

  const json = (await res.json()) as ShopifyResponse<T>;

  if (!res.ok || json.errors?.length) {
    const detail = json.errors?.map((error) => error.message).join('\n') || res.statusText;
    throw new Error(detail);
  }

  if (!json.data) {
    throw new Error('Shopify returned no data.');
  }

  return json.data;
}

const productFragment = `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    availableForSale
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 20) {
      nodes {
        id
        title
        availableForSale
        quantityAvailable
        price {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        image {
          url
          altText
          width
          height
        }
      }
    }
  }
`;

function mapProduct(product: any): ShopifyProduct {
  return {
    ...product,
    variants: product.variants?.nodes || []
  };
}

function mapCollection(collection: any): ShopifyCollection | null {
  if (!collection) return null;
  return {
    id: collection.id,
    title: collection.title,
    handle: collection.handle,
    description: collection.description,
    image: collection.image,
    products: collection.products?.nodes?.map(mapProduct) || []
  };
}

export async function getCollectionProducts(handle: string, first = 12) {
  if (!isConfigured) return demoProducts();
  const data = await shopifyFetch<any>({
    query: `
      ${productFragment}
      query CollectionProducts($handle: String!, $first: Int!, $country: CountryCode) @inContext(country: $country) {
        collection(handle: $handle) {
          products(first: $first, sortKey: CREATED, reverse: true) {
            nodes { ...ProductFields }
          }
        }
      }
    `,
    variables: {
      handle,
      first,
      country: process.env.SHOPIFY_COUNTRY_CODE || null
    },
    cache: 'no-store'
  });
  return data.collection?.products?.nodes?.map(mapProduct) || demoProducts();
}

export async function getProduct(handle: string) {
  if (!isConfigured) return demoProducts().find((p) => p.handle === handle) || demoProducts()[0];
  const data = await shopifyFetch<any>({
    query: `
      ${productFragment}
      query ProductByHandle($handle: String!, $country: CountryCode) @inContext(country: $country) {
        product(handle: $handle) { ...ProductFields }
      }
    `,
    variables: { handle, country: process.env.SHOPIFY_COUNTRY_CODE || null },
    cache: 'no-store'
  });
  return data.product ? mapProduct(data.product) : null;
}

export async function getCollection(handle: string, first = 1) {
  if (!isConfigured) return demoCollection(handle);
  const data = await shopifyFetch<any>({
    query: `
      ${productFragment}
      query CollectionByHandle($handle: String!, $first: Int!, $country: CountryCode) @inContext(country: $country) {
        collection(handle: $handle) {
          id
          title
          handle
          description
          image { url altText width height }
          products(first: $first) { nodes { ...ProductFields } }
        }
      }
    `,
    variables: { handle, first, country: process.env.SHOPIFY_COUNTRY_CODE || null },
    cache: 'no-store'
  });
  return mapCollection(data.collection) || demoCollection(handle);
}

export async function getCollectionsByHandles(handles: string[]) {
  return Promise.all(handles.map((handle) => getCollection(handle)));
}

const cartFragment = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            image { url altText width height }
            product {
              title
              handle
              featuredImage { url altText width height }
            }
          }
        }
      }
    }
  }
`;

function mapCart(cart: any): Cart {
  return {
    ...cart,
    lines: cart.lines?.nodes || []
  };
}

function userErrorMessage(userErrors?: { field?: string[]; message: string }[]) {
  return userErrors?.length ? userErrors.map((e) => e.message).join('\n') : null;
}

export async function createCart(merchandiseId: string, quantity = 1, buyerIp?: string) {
  if (!isConfigured) return demoCart(merchandiseId, quantity);
  const data = await shopifyFetch<any>({
    query: `
      ${cartFragment}
      mutation CartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }
    `,
    variables: { input: { lines: [{ merchandiseId, quantity }] } },
    buyerIp
  });
  const error = userErrorMessage(data.cartCreate?.userErrors);
  if (error) throw new Error(error);
  return mapCart(data.cartCreate.cart);
}

export async function addLine(cartId: string, merchandiseId: string, quantity = 1, buyerIp?: string) {
  if (!isConfigured) return demoCart(merchandiseId, quantity);
  const data = await shopifyFetch<any>({
    query: `
      ${cartFragment}
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }
    `,
    variables: { cartId, lines: [{ merchandiseId, quantity }] },
    buyerIp
  });
  const error = userErrorMessage(data.cartLinesAdd?.userErrors);
  if (error) throw new Error(error);
  return mapCart(data.cartLinesAdd.cart);
}

export async function updateLine(cartId: string, lineId: string, quantity: number, buyerIp?: string) {
  if (!isConfigured) return demoCart('demo-variant', quantity);
  const data = await shopifyFetch<any>({
    query: `
      ${cartFragment}
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }
    `,
    variables: { cartId, lines: [{ id: lineId, quantity }] },
    buyerIp
  });
  const error = userErrorMessage(data.cartLinesUpdate?.userErrors);
  if (error) throw new Error(error);
  return mapCart(data.cartLinesUpdate.cart);
}

export async function removeLine(cartId: string, lineId: string, buyerIp?: string) {
  if (!isConfigured) return { ...demoCart('demo-variant', 1), lines: [], totalQuantity: 0 };
  const data = await shopifyFetch<any>({
    query: `
      ${cartFragment}
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }
    `,
    variables: { cartId, lineIds: [lineId] },
    buyerIp
  });
  const error = userErrorMessage(data.cartLinesRemove?.userErrors);
  if (error) throw new Error(error);
  return mapCart(data.cartLinesRemove.cart);
}

export function getEnvHandles(value: string | undefined, fallback: string[]) {
  return (value || fallback.join(','))
    .split(',')
    .map((item) => normalizeHandle(item))
    .filter(Boolean);
}

function demoProducts(): ShopifyProduct[] {
  const names = [
    ['Infinite Summer', '1638.00', 'infinite-summer'],
    ['Marine Aura', '795.00', 'marine-aura'],
    ['Mermaid Tears', '123.00', 'mermaid-tears'],
    ['Silent Love', '978.00', 'silent-love'],
    ['Moon Pearl', '444.00', 'moon-pearl'],
    ['Cyber Flower', '666.00', 'cyber-flower']
  ];
  return names.map(([title, amount, handle], index) => ({
    id: `demo-product-${index}`,
    title,
    handle,
    description: 'Demo jewelry product. Connect Shopify to replace this with your real Admin products.',
    availableForSale: index !== 2,
    featuredImage: { url: SITE_ASSETS.demoProduct, altText: title },
    priceRange: { minVariantPrice: { amount, currencyCode: 'SEK' } },
    variants: [
      {
        id: `demo-variant-${index}`,
        title: 'Default Title',
        availableForSale: index !== 2,
        quantityAvailable: index === 2 ? 0 : 9,
        price: { amount, currencyCode: 'SEK' },
        image: { url: SITE_ASSETS.demoProduct, altText: title },
        selectedOptions: []
      }
    ]
  }));
}

function demoCollection(handle: string): ShopifyCollection {
  const title = handle
    .split('-')
    .map((chunk) => chunk[0]?.toUpperCase() + chunk.slice(1))
    .join(' ');
  return {
    id: `demo-collection-${handle}`,
    title,
    handle,
    description: 'Demo collection. Replace through Shopify collection data.',
    image: null,
    products: demoProducts().slice(0, 2)
  };
}

function demoCart(merchandiseId: string, quantity: number): Cart {
  const product = demoProducts()[0];
  return {
    id: 'demo-cart',
    checkoutUrl: '#shopify-checkout-url-will-appear-here',
    totalQuantity: quantity,
    cost: {
      subtotalAmount: product.priceRange.minVariantPrice,
      totalAmount: product.priceRange.minVariantPrice
    },
    lines: [
      {
        id: `demo-line-${merchandiseId}`,
        quantity,
        merchandise: {
          id: merchandiseId,
          title: 'Default Title',
          price: product.priceRange.minVariantPrice,
          image: product.featuredImage,
          product: {
            title: product.title,
            handle: product.handle,
            featuredImage: product.featuredImage
          }
        }
      }
    ]
  };
}
