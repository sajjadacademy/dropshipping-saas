import os
import secrets

def get_input(prompt, required=True):
    val = input(f"{prompt}: ").strip()
    while required and not val:
        print("Value is required.")
        val = input(f"{prompt}: ").strip()
    return val

def update_env_file(filepath, updates):
    lines = []
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            lines = f.readlines()
            
    new_lines = []
    processed_keys = set()
    
    for line in lines:
        if '=' in line:
            key = line.split('=')[0].strip()
            if key in updates:
                new_lines.append(f"{key}={updates[key]}\n")
                processed_keys.add(key)
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)
            
    for key, val in updates.items():
        if key not in processed_keys:
            if new_lines and not new_lines[-1].endswith('\n'):
                new_lines.append('\n')
            new_lines.append(f"{key}={val}\n")
            
    with open(filepath, 'w') as f:
        f.writelines(new_lines)
    print(f"Updated {filepath}")

def main():
    print("\n--- Zelvyra Deployment Security Wizard ---")
    print("This script will securely update your environment variables.")
    print("Press Enter to skip any value you don't want to change.\n")

    # Frontend Keys
    print("[Frontend Credentials]")
    clerk_pub = get_input("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (pk_live_...)", required=False)
    # Clerk Secret is usually backend, but often kept in same file for mono-repos or nextjs middleware
    clerk_secret = get_input("CLERK_SECRET_KEY (sk_live_...)", required=False)
    api_url = get_input("NEXT_PUBLIC_API_URL (Deployment URL)", required=False)

    frontend_updates = {}
    if clerk_pub: frontend_updates["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"] = clerk_pub
    if clerk_secret: frontend_updates["CLERK_SECRET_KEY"] = clerk_secret
    if api_url: frontend_updates["NEXT_PUBLIC_API_URL"] = api_url

    if frontend_updates:
        update_env_file(os.path.join("frontend", ".env.local"), frontend_updates)

    # Backend Keys
    print("\n[Backend Credentials]")
    stripe_key = get_input("Stripe Secret Key (sk_live_...)", required=False)
    stripe_wh = get_input("Stripe Webhook Secret (whsec_...)", required=False)
    shopify_key = get_input("Shopify API Key", required=False)
    shopify_secret = get_input("Shopify API Secret", required=False)
    sentry_dsn = get_input("Sentry DSN", required=False)
    
    # Generate a strong secret key if one doesn't exist or user wants to rotate
    rotate_secret = get_input("Generate new Backend SECRET_KEY? (y/n)", required=False).lower() == 'y'
    
    backend_updates = {}
    if stripe_key: backend_updates["STRIPE_API_KEY"] = stripe_key
    if stripe_wh: backend_updates["STRIPE_WEBHOOK_SECRET"] = stripe_wh
    if shopify_key: backend_updates["SHOPIFY_API_KEY"] = shopify_key
    if shopify_secret: backend_updates["SHOPIFY_API_SECRET"] = shopify_secret
    if sentry_dsn: backend_updates["SENTRY_DSN"] = sentry_dsn
    if rotate_secret:
        backend_updates["SECRET_KEY"] = secrets.token_urlsafe(32)

    if backend_updates:
        update_env_file(os.path.join("backend", ".env"), backend_updates)
        
    print("\nSUCCESS: Credentials updated.")
    print("Please restart your application for changes to take effect.")

if __name__ == "__main__":
    main()
