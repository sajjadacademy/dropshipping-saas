import stripe
import os
from fastapi import Request, HTTPException

STRIPE_API_KEY = os.getenv("STRIPE_API_KEY", "mock_stripe_key")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "mock_wh_secret")

stripe.api_key = STRIPE_API_KEY

class StripeService:
    async def handle_webhook(self, request: Request):
        payload = await request.body()
        sig_header = request.headers.get("stripe-signature")
        event = None

        try:
            if STRIPE_API_KEY == "mock_stripe_key":
                # Mock parsing for dev/test
                import json
                event = json.loads(payload)
            else:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, STRIPE_WEBHOOK_SECRET
                )
        except ValueError as e:
            # Invalid payload
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            raise HTTPException(status_code=400, detail="Invalid signature")

        # Handle the event
        if event["type"] == "invoice.paid":
            self.handle_invoice_paid(event["data"]["object"])
        elif event["type"] == "customer.subscription.deleted":
            self.handle_subscription_deleted(event["data"]["object"])
        
        return {"status": "success"}

    def handle_invoice_paid(self, invoice):
        customer_id = invoice.get("customer")
        # Logic to find user by stripe_customer_id and set is_premium=True
        print(f"[Revenue Engine] Invoice paid for customer {customer_id}. User status set to PREMIUM.")
        # In real app: db.query(User).filter(...).update(...)

    def handle_subscription_deleted(self, subscription):
        customer_id = subscription.get("customer")
        # Logic to revoke premium
        print(f"[Revenue Engine] Subscription deleted for customer {customer_id}. User status REVOKED.")
