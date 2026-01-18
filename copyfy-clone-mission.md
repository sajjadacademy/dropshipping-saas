---
name: zelvyra-copyfy-clone
version: 1.0.0
objective: Build a full-stack SaaS for tracking Shopify store sales and exporting winning products.
stack: [Next.js, FastAPI, PostgreSQL, Playwright, Stripe, Shopify API]
---

# 🚀 Mission: Build a Shopify Sales Tracking SaaS

## Phase 1: Foundation & Project Setup
1. **Initialize Project**: Create a monorepo with `frontend` (Next.js 14) and `backend` (FastAPI).
2. **Database Schema**: Setup PostgreSQL tables for:
    - `Users`: Subscription status and API keys.
    - `TrackedStores`: Shopify URLs and tracking frequency.
    - `SalesData`: Real-time entries of products sold.
3. **Verification**: Generate a `db_status_check` log to ensure the DB connects and tables are migrations are valid.

## Phase 2: The "Spy" Engine (Scraper)
1. **Shopify Detector**: Build a module that detects if a URL is a Shopify store and identifies its theme/apps.
2. **Sales Tracker Logic**:
    - Use Playwright to monitor `collections/all/products.json` or `products.json` endpoints.
    - Implement a "Diff-checking" algorithm: Compare stock levels every hour to calculate units sold.
3. **Verification**: The agent must successfully track 1 sample Shopify store for 3 hours and output a "Sales Report Artifact" (CSV) before moving on.

## Phase 3: Analytics & Dashboard
1. **Frontend Dashboard**: Build a luxury UI (Black & Gold theme) to display:
    - Estimated Monthly Revenue.
    - Top 5 Best-selling products with images.
    - Live sales feed.
2. **Backend API**: Create endpoints for `/get-store-analytics` and `/track-new-store`.
3. **Verification**: Run a Playwright test to ensure the dashboard loads real data from the database.

## Phase 4: One-Click Shopify Export
1. **Shopify Admin Integration**: Set up OAuth for users to connect their own stores.
2. **Import Logic**: Create a function that fetches a product from a tracked store (via Scraper) and pushes it to the user's store using the `shopify-python-api`.
3. **Verification**: Perform a "Mock Export" to a development store and verify the product appears with images and variants.

## Phase 5: SaaS Infrastructure
1. **Stripe Integration**: Set up 3 tiers (Starter, Standard, Pro).
2. **Authentication**: Implement Clerk or NextAuth with subscription gating.
3. **Verification**: Simulate a successful "Stripe Checkout" flow and confirm the user's `is_premium` flag updates in the database.

# 🛡️ Execution Instructions for Antigravity
- **Step-by-Step Locking**: DO NOT start a new Phase until the "Verification" task of the previous Phase returns a `SUCCESS` status.
- **Error Handling**: If a scraper gets blocked by Shopify's Cloudflare, automatically implement a 'Rotating Proxy' module and re-test.
- **Reporting**: After every completed step, show a "Progress Artifact" (Screenshot or Terminal Output).