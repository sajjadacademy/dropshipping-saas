# Security & Credential Audit Report

## 🔒 Required Credentials
The following environment variables are currently using mock values or are missing. You must update these in your production environment before launch.

### Backend (`backend/.env`)
| Variable | Status | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | ✅ Configured | Connection string for PostgreSQL. |
| `SECRET_KEY` | ⚠️ Default | Change this to a random 32-char string for crypto checks. |
| `SHOPIFY_API_KEY` | ❌ MOCK | Your Shopify App API Key. |
| `SHOPIFY_API_SECRET` | ❌ MOCK | Your Shopify App Secret. |
| `STRIPE_API_KEY` | ❌ MOCK | Stripe Secret Key (`sk_live_...`). |
| `STRIPE_WEBHOOK_SECRET`| ❌ MOCK | Stripe Webhook Secret (`whsec_...`). |
| `SENTRY_DSN` | ❌ MISSING | Sentry DSN for error tracking. |

### Frontend (`frontend/.env.local`)
*File currently missing. Create one with the following:*

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Publishable Key (`pk_test_...`). |
| `CLERK_SECRET_KEY` | Clerk Secret Key (`sk_test_...`). |
| `NEXT_PUBLIC_API_URL` | Backend URL (e.g., `https://your-backend.render.com`). |

## 🛡️ Security Headers Audit
- **X-Frame-Options**: `DENY` (Recommended to prevent clickjacking).
- **Content-Security-Policy**: Implement to restrict script sources.
- **Strict-Transport-Security**: Ensure HTTPS is enforced in production (Render/Vercel handles this).

## 🚀 Action Items
1. Copy the variables above.
2. Create/Update `.env` files in `backend/` and `frontend/`.
3. Restart the servers to apply changes.
