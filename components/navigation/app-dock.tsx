'use client';

import { memo, useCallback, useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Home,
  Sparkles,
  Timer,
  ListChecks,
  TrendingUp,
  Wallet,
  Settings,
  LogIn,
  UserPlus,
  ChevronDown,
  ChevronUp,
  type LucideIcon,
} from 'lucide-react';
import { Dock, DockIcon, DockDivider } from '@/components/ui/dock';
import { cn } from '@/lib/utils';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const homeGroup: NavItem[] = [{ href: '/studio', label: 'Home', icon: Home }];

const workspaceGroup: NavItem[] = [
  { href: '/ai', label: 'AI', icon: Sparkles },
  { href: '/focus', label: 'Focus Hub', icon: Timer },
  { href: '/tasks', label: 'Tasks', icon: ListChecks },
  { href: '/analytics', label: 'Analytics', icon: TrendingUp },
];

const systemGroup: NavItem[] = [
  { href: '/plan', label: 'Plan', icon: Wallet },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function isPathActive(pathname: string, href: string) {
  if (href === '/studio') return pathname === '/studio';
  return pathname === href || pathname.startsWith(`${href}/`);
}

const PRESS_SPRING = { type: 'spring', stiffness: 400, damping: 30, mass: 1 } as const;

const AppDockIcon = memo(function AppDockIcon({ href, label, icon: Icon, isActive }: NavItem & { isActive: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  // Warm the route compiler + RSC payload on hover/focus so the first click
  // feels instant instead of compiling on demand.
  const prefetch = useCallback(() => {
    router.prefetch(href);
  }, [router, href]);

  const handleNavigate = (e: React.MouseEvent) => {
    // Let Next handle it as a normal Link navigation (prefetched, cached);
    // only wrap in a transition for the pending shimmer.
    e.preventDefault();
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <DockIcon
      onMouseEnter={() => { setHovered(true); prefetch(); }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => { setHovered(true); prefetch(); }}
      onBlur={() => setHovered(false)}
    >
      <Link
        href={href}
        prefetch
        onClick={handleNavigate}
        aria-label={label}
        aria-current={isActive ? 'page' : undefined}
        className="flex h-full w-full items-center justify-center"
      >
      <motion.div
        whileTap={
          shouldReduceMotion
            ? { opacity: 0.7 }
            : { scale: 0.9 }
        }
        transition={PRESS_SPRING}
        className={cn(
          "relative flex h-full w-full items-center justify-center cursor-pointer",
          isPending && "opacity-70"
        )}
      >
        {/* Plain conditional highlight — the old layoutId spring forced a
            layout pass across the whole dock on every navigation. */}
        {(isActive || isPending) && (
          <div className="absolute inset-0 rounded-full bg-foreground/10" />
        )}

        <div
          className={cn(
            'relative flex h-full w-full items-center justify-center rounded-full transition-colors duration-150',
            isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon size={20} strokeWidth={2} />
        </div>
      </motion.div>
      </Link>

      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.85, y: 4 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0.12 } }
                : {
                    opacity: 0,
                    scale: 0.96,
                    y: 2,
                    transition: { duration: 0.12, ease: [0.23, 1, 0.32, 1] },
                  }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0.15 }
                : { type: 'spring', duration: 0.32, bounce: 0.22 }
            }
            style={{ left: '50%', x: '-50%', transformOrigin: 'bottom center' }}
            className="pointer-events-none absolute bottom-[60px] z-20 whitespace-nowrap rounded-lg border border-border/60 bg-popover/95 px-2.5 py-1 text-xs font-semibold text-popover-foreground shadow-lg backdrop-blur-sm"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </DockIcon>
  );
});

function AuthDockItem() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (isSignedIn) {
    return (
      <DockIcon>
        <div className="flex h-full w-full items-center justify-center">
          <UserButton
            appearance={{
              elements: {
                rootBox: 'scale-[0.85]',
                userButtonOuterIdentifier: 'hidden',
              },
            }}
          />
        </div>
      </DockIcon>
    );
  }

  return (
    <>
      <DockIcon>
        <SignInButton mode="modal" fallbackRedirectUrl="/studio">
          <div className="relative flex h-full w-full items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer">
            <LogIn size={20} strokeWidth={2} />
          </div>
        </SignInButton>
      </DockIcon>
      <DockIcon>
        <SignUpButton mode="modal" fallbackRedirectUrl="/studio">
          <div className="relative flex h-full w-full items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer">
            <UserPlus size={20} strokeWidth={2} />
          </div>
        </SignUpButton>
      </DockIcon>
    </>
  );
}

const STORAGE_KEY = 'app-dock-collapsed';

/**
 * Fired when the user enters a focused activity (quiz builder, active quiz,
 * AI chat) so the dock gets out of the way. Same window-event convention
 * as `smartli-plan-change` in hooks/usePlanUsage.ts.
 */
export const DOCK_COLLAPSE_EVENT = 'smartli-dock-collapse';

export function collapseDock() {
  try {
    window.dispatchEvent(new Event(DOCK_COLLAPSE_EVENT));
  } catch {
    // SSR / no window — nothing to collapse
  }
}

export function AppDock() {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setCollapsed(window.localStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      // storage unavailable — keep expanded
    }
  }, []);

  // Prefetch all primary routes during idle so the FIRST click on any page
  // is a cache hit instead of an on-demand compile + RSC fetch.
  useEffect(() => {
    const routes = ['/studio', '/ai', '/focus', '/tasks', '/analytics', '/plan', '/settings'];
    const prefetchAll = () => {
      for (const href of routes) {
        if (href !== pathname) router.prefetch(href);
      }
    };
    if ('requestIdleCallback' in window) {
      const w = window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
      const id = w.requestIdleCallback(prefetchAll, { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = globalThis.setTimeout(prefetchAll, 1500);
    return () => globalThis.clearTimeout(t);
  }, [router, pathname]);

  const expand = useCallback(() => {
    setCollapsed(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, '0');
    } catch {
      // ignore
    }
  }, []);

  const collapse = useCallback(() => {
    setCollapsed(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  }, []);

  // Auto-collapse when focused activities (quiz builder, quiz, AI chat)
  // request the dock out of the way via collapseDock().
  useEffect(() => {
    window.addEventListener(DOCK_COLLAPSE_EVENT, collapse);
    return () => window.removeEventListener(DOCK_COLLAPSE_EVENT, collapse);
  }, [collapse]);

  if (pathname === '/' || pathname === '/auth' || pathname === '/sign-in' || pathname === '/sign-up') return null;

  // Ease-out tween: no bounce overshoot past resting position, and tweens
  // retarget cleanly if the toggle is spam-clicked. Gentle fade only when
  // reduced motion is preferred.
  const sheetTransition = shouldReduceMotion
    ? { duration: 0.15 }
    : { duration: 0.28, ease: [0.23, 1, 0.32, 1] } as const;
  const sheetExitTransition = shouldReduceMotion
    ? { duration: 0.15 }
    : { duration: 0.2, ease: [0.23, 1, 0.32, 1] } as const;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center px-4 pointer-events-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Expanded dock — collapse handle rides on its top edge */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="dock-sheet"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, transform: 'translateY(28px) scale(0.96)' }
            }
            animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0.15 } }
                : {
                    opacity: 0,
                    transform: 'translateY(28px) scale(0.96)',
                    transition: sheetExitTransition,
                  }
            }
            transition={sheetTransition}
            style={{ transformOrigin: 'bottom center' }}
            className="pointer-events-auto relative pb-6 pt-4"
          >
            <button
              type="button"
              onClick={collapse}
              aria-label="Collapse dock"
              aria-expanded={!collapsed}
              title="Collapse dock"
              style={{ marginLeft: -28 }}
              className="glass absolute -top-0.5 left-1/2 z-10 flex h-[18px] w-14 items-center justify-center rounded-full text-muted-foreground shadow-md transition-colors duration-150 hover:text-foreground active:scale-95"
            >
              <ChevronDown size={13} strokeWidth={2.5} />
            </button>

            <Dock
              direction="bottom"
              disableMagnification={Boolean(shouldReduceMotion)}
            >
              {homeGroup.map((item) => (
                <AppDockIcon key={item.href} {...item} isActive={isPathActive(pathname, item.href)} />
              ))}

              <DockDivider />

              {workspaceGroup.map((item) => (
                <AppDockIcon key={item.href} {...item} isActive={isPathActive(pathname, item.href)} />
              ))}

              <DockDivider />

              {systemGroup.map((item) => (
                <AppDockIcon key={item.href} {...item} isActive={isPathActive(pathname, item.href)} />
              ))}

              <DockDivider />

              <div className="flex gap-1">
                <AuthDockItem />
              </div>
            </Dock>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed state — small expand pill hugging the bottom edge */}
      <AnimatePresence initial={false}>
        {mounted && collapsed && (
          <motion.button
            key="dock-expand-pill"
            type="button"
            onClick={expand}
            aria-label="Expand dock"
            aria-expanded={!collapsed}
            title="Expand dock"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, transform: 'translateY(12px) scale(0.94)' }
            }
            animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0.12 } }
                : {
                    opacity: 0,
                    transform: 'translateY(12px) scale(0.94)',
                    transition: sheetExitTransition,
                  }
            }
            transition={sheetTransition}
            style={{ transformOrigin: 'bottom center', marginLeft: -32 }}
            whileTap={shouldReduceMotion ? { opacity: 0.7 } : { transform: 'translateY(1px) scale(0.94)' }}
            className="glass pointer-events-auto absolute bottom-3 left-1/2 flex h-7 w-16 items-center justify-center rounded-full text-muted-foreground shadow-lg transition-colors duration-150 hover:text-foreground"
          >
            <ChevronUp size={15} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </nav>
  );
}
