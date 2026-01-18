import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes
const isPublicRoute = createRouteMatcher([
    "/", // Landing Page
    "/api/webhooks(.*)", // Webhooks
    "/sign-in(.*)",
    "/sign-up(.*)"
]);

console.log("Middleware: Loaded");

export default clerkMiddleware(async (auth, req) => {
    console.log("Middleware: Processing request", req.url);
    if (!isPublicRoute(req)) {
        console.log("Middleware: Protected Route, Checking Auth");
        await auth.protect();
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
