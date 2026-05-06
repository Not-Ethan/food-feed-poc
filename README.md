# Food Feed POC

A proof-of-concept web app for a TikTok-style food discovery feed.

## What it does

- scrapes **public Uber Eats store pages**
- extracts menu items into a normalized JSON feed
- renders those items in a vertical scroll UI
- deep-links users out to Uber Eats for actual ordering

This MVP intentionally **does not** touch:
- checkout
- payments
- carts
- order placement

It is a discovery + routing layer.

## Stack

- React
- Vite
- Plain CSS
- Node scraping script using built-in `fetch`

## Scraping flow

The scraper currently targets Uber Eats public store pages and writes normalized feed data to:

```bash
src/data/feed.json
```

Run it with:

```bash
npm run scrape:ubereats
```

## Run locally

```bash
npm install --include=dev
npm run dev
```

## Build

```bash
npm run build
```

## Current limitations

- item images are currently store-level hero images reused per card when item-level media is unavailable
- store URLs are seeded in the scraper script right now
- no location-aware ETA filtering yet
- no backend or persistent database yet

## Next obvious steps

- support more Uber Eats stores / neighborhoods
- add a tiny backend + stored scraped inventory
- dedupe and rank items better
- add saved items / basic personalization
- eventually swap scraping for cleaner integrations where possible
