"use client";

import { ClerkProvider } from "@clerk/nextjs";

export default function ClerkWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_Y2VydGFpbi1tdXNrcmF0LTk0LmNsZXJrLmFjY291bnRzLmRldiQ"}>
            {children}
        </ClerkProvider>
    );
}
