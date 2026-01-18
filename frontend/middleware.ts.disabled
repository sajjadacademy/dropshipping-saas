import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes
const isPublicRoute = createRouteMatcher([
    "/", // Landing Page
    "/api/webhooks(.*)", // Webhooks
    "/sign-in(.*)",
    "/sign-up(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
    try {
        if (!isPublicRoute(req)) {
            const { userId, redirectToSignIn } = await auth();
            if (!userId) {
                return redirectToSignIn();
            }
        }
    } catch (error) {
        console.error("Middleware execution failed:", error);
        // Fallback: Safely redirect to sign-in page instead of crashing
        return Response.redirect(new URL('/sign-in', req.url));
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
