import stripe
import os
from fastapi import Request, HTTPException

# Configuration
STRIPE_API_KEY = os.getenv("STRIPE_API_KEY", "mock_stripe_key")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "mock_wh_secret")

stripe.api_key = STRIPE_API_KEY

class StripeService:
    def __init__(self):
        self.is_mock = (STRIPE_API_KEY == "mock_stripe_key")

    async def create_checkout_session(self, price_id: str, success_url: str, cancel_url: str):
        """
        Creates a Stripe Checkout Session or returns a Mock URL.
        """
        if self.is_mock:
            print(f"[Payment Mock] Creating Checkout Session for {price_id}")
            # Simulate a successful redirect immediately
            return {"url": f"{success_url}?session_id=mock_session_123"}
        
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price': price_id,
                    'quantity': 1,
                }],
                mode='subscription',
                success_url=success_url + '?session_id={CHECKOUT_SESSION_ID}',
                cancel_url=cancel_url,
            )
            return {"url": session.url}
        except Exception as e:
            print(f"[Payment Error] {e}")
            raise HTTPException(status_code=400, detail=str(e))

    async def create_portal_session(self, customer_id: str, return_url: str):
        """
        Creates a Billing Portal session.
        """
        if self.is_mock:
             return {"url": return_url} # Just return to dashboard
        
        try:
            session = stripe.billing_portal.Session.create(
                customer=customer_id,
                return_url=return_url,
            )
            return {"url": session.url}
        except Exception as e:
             raise HTTPException(status_code=400, detail=str(e))

    async def handle_webhook(self, request: Request):
        payload = await request.body()
        sig_header = request.headers.get("stripe-signature")
        event = None

        try:
            if self.is_mock:
                # Mock parsing for dev/test
                import json
                event = json.loads(payload)
            else:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, STRIPE_WEBHOOK_SECRET
                )
        except ValueError as e:
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError as e:
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

    def handle_subscription_deleted(self, subscription):
        customer_id = subscription.get("customer")
        # Logic to revoke premium
        print(f"[Revenue Engine] Subscription deleted for customer {customer_id}. User status REVOKED.")
