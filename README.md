# Food Feed POC

A quick proof-of-concept web app for a TikTok-style food discovery feed.

## Concept

Users scroll through a vertical feed of nearby dishes they can realistically get fast (roughly under 60 minutes). Each card is designed to feel more like short-form content than a static menu.

This POC focuses on:
- full-screen-ish vertical feed behavior
- dish-first discovery
- delivery ETA + price visibility
- easy handoff to ordering platforms

## Stack

- React
- Vite
- Plain CSS

## Run locally

```bash
npm install --include=dev
npm run dev
```

## Build

```bash
npm run build
```

## Notes

Right now the app uses mocked data and gradient-based visual placeholders instead of real restaurant media. The next obvious steps would be:
- real restaurant/menu ingestion
- Uber Eats / DoorDash / direct-order deep links
- location-aware feed ranking
- restaurant self-serve uploads
- sponsored placements / ads
