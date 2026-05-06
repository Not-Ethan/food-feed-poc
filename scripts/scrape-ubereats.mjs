import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const outPath = path.join(rootDir, 'src', 'data', 'feed.json')

const STORE_URLS = [
  'https://www.ubereats.com/store/public-service-restaurant/tMuTaACHSfawFsigHEFVYA',
  'https://www.ubereats.com/store/the-public-kitchen-&-bar/D6Z6jZyEWjCiBTTtX2Gy3Q',
]

function decodeUnicodeEscapes(value) {
  return value.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
}

function decodeHtmlEntities(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function cleanText(value = '') {
  return decodeHtmlEntities(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/%5C/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatPrice(cents) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format((Number(cents) || 0) / 100)
}

function extractJsonLd(html) {
  const matches = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  const objects = []

  for (const match of matches) {
    try {
      objects.push(JSON.parse(decodeUnicodeEscapes(match[1])))
    } catch {
      // ignore malformed blocks
    }
  }

  return objects
}

function extractReactQueryRaw(html) {
  const match = html.match(/<script[^>]*id="__REACT_QUERY_STATE__"[^>]*>([\s\S]*?)<\/script>/)
  return match?.[1] || ''
}

function extractBalancedObject(raw, marker) {
  const start = raw.indexOf(marker)
  if (start < 0) return ''

  const braceStart = raw.indexOf('{', start + marker.length)
  if (braceStart < 0) return ''

  let depth = 0

  for (let i = braceStart; i < raw.length; i += 1) {
    const char = raw[i]
    if (char === '{') depth += 1
    if (char === '}') {
      depth -= 1
      if (depth === 0) {
        return raw.slice(braceStart, i + 1)
      }
    }
  }

  return ''
}

function extractEtaText(raw) {
  const match = raw.match(/estimated in ([^\\]+?)\\u0022/)
  return match ? cleanText(match[1]) : null
}

function extractCatalogSections(decodedCatalogMap) {
  const sectionRegex = /"standardItemsPayload":\{"title":\{"text":"([^"]+)"\}[\s\S]*?"catalogItems":\[(.*?)\],"sectionUUID"/g
  const itemRegex = /"uuid":"([^"]+)","title":"([^"]+)","itemDescription":"([^"]*)","price":(\d+)/g
  const items = []

  for (const sectionMatch of decodedCatalogMap.matchAll(sectionRegex)) {
    const sectionTitle = cleanText(sectionMatch[1])
    const itemBlock = sectionMatch[2]

    for (const itemMatch of itemBlock.matchAll(itemRegex)) {
      items.push({
        id: itemMatch[1],
        title: cleanText(itemMatch[2]),
        description: cleanText(itemMatch[3]),
        priceCents: Number(itemMatch[4]),
        price: formatPrice(itemMatch[4]),
        sectionTitle,
      })
    }
  }

  return items
}

async function scrapeStore(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'accept-language': 'en-US,en;q=0.9',
    },
  })

  if (!response.ok) {
    throw new Error(`Fetch failed for ${url}: ${response.status}`)
  }

  const html = await response.text()
  const jsonLd = extractJsonLd(html)
  const restaurantLd = jsonLd.find((entry) => entry['@type'] === 'Restaurant') || {}
  const breadcrumbLd = jsonLd.find((entry) => entry['@type'] === 'BreadcrumbList') || {}

  const reactStateRaw = extractReactQueryRaw(html)
  const catalogMapRaw = extractBalancedObject(reactStateRaw, 'catalogSectionsMap\\u0022:')
  const decodedCatalogMap = decodeUnicodeEscapes(catalogMapRaw)
  const catalogItems = extractCatalogSections(decodedCatalogMap)

  const breadcrumbItems = Array.isArray(breadcrumbLd.itemListElement) ? breadcrumbLd.itemListElement : []
  const city = breadcrumbItems.at(-2)?.name || 'Unknown city'
  const cuisine = Array.isArray(restaurantLd.servesCuisine) ? restaurantLd.servesCuisine[0] : 'Food'
  const heroImage = Array.isArray(restaurantLd.image) ? restaurantLd.image[0] : null

  return {
    restaurant: cleanText(restaurantLd.name || 'Unknown restaurant'),
    city: cleanText(city),
    cuisine: cleanText(cuisine),
    orderUrl: url,
    heroImage,
    etaText: extractEtaText(reactStateRaw),
    itemCount: catalogItems.length,
    items: catalogItems,
  }
}

async function main() {
  const stores = []

  for (const url of STORE_URLS) {
    console.log(`Scraping ${url}`)
    try {
      stores.push(await scrapeStore(url))
    } catch (error) {
      console.error(`Failed: ${url}`)
      console.error(error)
    }
  }

  const feedItems = stores
    .flatMap((store, storeIndex) =>
      store.items.map((item, itemIndex) => ({
        id: `${storeIndex + 1}-${item.id}`,
        platform: 'Uber Eats',
        restaurant: store.restaurant,
        city: store.city,
        cuisine: store.cuisine,
        title: item.title,
        description: item.description || `Popular item from ${store.restaurant}`,
        price: item.price,
        priceCents: item.priceCents,
        sectionTitle: item.sectionTitle,
        etaText: store.etaText || 'Fast delivery',
        image: store.heroImage,
        orderUrl: store.orderUrl,
        sortScore: storeIndex * 1000 + itemIndex,
      })),
    )
    .sort((a, b) => a.priceCents - b.priceCents)

  const payload = {
    generatedAt: new Date().toISOString(),
    platform: 'Uber Eats',
    sourceStores: stores.map(({ restaurant, city, orderUrl, itemCount }) => ({
      restaurant,
      city,
      orderUrl,
      itemCount,
    })),
    items: feedItems,
  }

  await fs.mkdir(path.dirname(outPath), { recursive: true })
  await fs.writeFile(outPath, JSON.stringify(payload, null, 2))

  console.log(`Wrote ${feedItems.length} items to ${outPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
