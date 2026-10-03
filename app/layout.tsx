import './globals.css';
import 'katex/dist/katex.min.css';
import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import { ClerkProvider } from '@clerk/nextjs';

// Dock is pure client chrome (framer-motion + Clerk buttons). Defer it so it
// never blocks first paint / LCP of the actual page content.
const AppDock = dynamic(
  () => import('@/components/navigation/app-dock').then((m) => m.AppDock),
  { ssr: false },
);

export const metadata: Metadata = {
  title: 'Smartli | AI Study Companion',
  description: 'Elevate your learning with AI-powered study tools',
};

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Warm up Clerk + logo asset without blocking render. */}
        <link rel="dns-prefetch" href="https://img.clerk.com" />
        <link rel="preconnect" href="https://img.clerk.com" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/branding/logo.png" as="image" />
        {/* Apply saved theme before first paint to avoid a dark→light flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=JSON.parse(localStorage.getItem('smartli-settings-v1')||'{}');var t=s&&s.theme==='light'?'light':'dark';var r=document.documentElement;r.classList.remove('light','dark');r.classList.add(t);r.style.colorScheme=t;}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen relative">
        <ClerkProvider>
          <main>{children}</main>
          <AppDock />
        </ClerkProvider>
      </body>
    </html>
  );
}