import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/api/webhooks(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  // Marketing / first-paint pages skip the Clerk auth round-trip entirely.
  "/",
  "/pricing",
  "/plan",
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    return;
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    '/__clerk/:path*',
  ],
};
