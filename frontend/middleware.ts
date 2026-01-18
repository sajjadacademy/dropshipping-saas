import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes
const isPublicRoute = createRouteMatcher([
    "/", // Landing Page
    "/api/webhooks(.*)", // Webhooks
    "/sign-in(.*)",
    "/sign-up(.*)"
]);

export default clerkMiddleware((auth, req) => {
    if (!isPublicRoute(req)) {
        auth().protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|.*\\..*).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
