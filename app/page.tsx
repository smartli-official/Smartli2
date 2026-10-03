'use client';

import { useEffect, useRef } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import "./landing.css";

type CSSVars = React.CSSProperties & Record<string, string | number>;

export default function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let cancelled = false;
    const cleanups: Array<() => void> = [];

    const reduceMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    /* theme: paper light by default, classic violet dark on toggle */
    const themeBtn = root.querySelector<HTMLButtonElement>("#themeToggle");
    const setTheme = (dark: boolean, save: boolean) => {
      root.classList.toggle("dark", dark);
      themeBtn?.setAttribute(
        "aria-label",
        dark ? "Switch to light mode" : "Switch to dark mode"
      );
      if (save) {
        try {
          localStorage.setItem(
            "smartli-landing-theme",
            dark ? "dark" : "light"
          );
        } catch {
          /* storage unavailable */
        }
      }
    };
    let savedTheme: string | null = null;
    try {
      savedTheme = localStorage.getItem("smartli-landing-theme");
    } catch {
      /* storage unavailable */
    }
    setTheme(savedTheme === "dark", false);
    const onThemeClick = () => {
      root.classList.add("switching");
      setTheme(!root.classList.contains("dark"), true);
      window.setTimeout(() => root.classList.remove("switching"), 320);
    };
    themeBtn?.addEventListener("click", onThemeClick);
    cleanups.push(() => themeBtn?.removeEventListener("click", onThemeClick));

    /* nav shadow */
    const nav = root.querySelector("#nav");
    const onScroll = () => {
      nav?.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    /* mobile menu */
    const menuToggle = root.querySelector<HTMLButtonElement>("#navToggle");
    const menu = root.querySelector("#mobileMenu");
    const onMenuClick = () => {
      const open = menu?.classList.toggle("open") ?? false;
      menuToggle?.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle?.setAttribute(
        "aria-label",
        open ? "Close menu" : "Open menu"
      );
    };
    menuToggle?.addEventListener("click", onMenuClick);
    const menuLinks = Array.from(
      menu?.querySelectorAll("a") ?? []
    ) as HTMLAnchorElement[];
    const onMenuLink = () => menu?.classList.remove("open");
    menuLinks.forEach((a) => a.addEventListener("click", onMenuLink));
    cleanups.push(() => {
      menuToggle?.removeEventListener("click", onMenuClick);
      menuLinks.forEach((a) => a.removeEventListener("click", onMenuLink));
    });

    /* scroll reveal */
    const revealEls = Array.from(root.querySelectorAll(".reveal"));
    if ("IntersectionObserver" in window && !reduceMotion) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    } else {
      revealEls.forEach((el) => el.classList.add("in"));
    }

    /* product tabs */
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>(".tab"));
    const panels = Array.from(root.querySelectorAll(".panel"));
    const indicator = root.querySelector<HTMLElement>("#tabIndicator");
    const moveIndicator = (btn: HTMLElement) => {
      if (!indicator) return;
      indicator.style.width = `${btn.offsetWidth}px`;
      indicator.style.transform = `translateX(${btn.offsetLeft - 5}px)`;
    };
    const activate = (name: string | null) => {
      tabs.forEach((t) => {
        const on = t.getAttribute("data-tab") === name;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
        if (on) moveIndicator(t);
      });
      panels.forEach((p) =>
        p.classList.toggle("active", p.getAttribute("data-panel") === name)
      );
    };
    const tabHandlers = tabs.map((t) => {
      const h = () => activate(t.getAttribute("data-tab"));
      t.addEventListener("click", h);
      return { t, h };
    });
    const onResize = () => {
      const active = root.querySelector<HTMLElement>(".tab.active");
      if (active) moveIndicator(active);
    };
    window.addEventListener("resize", onResize);
    const raf = requestAnimationFrame(() => {
      if (cancelled) return;
      const first = root.querySelector<HTMLElement>(".tab.active");
      if (first) moveIndicator(first);
    });
    cleanups.push(() => {
      tabHandlers.forEach(({ t, h }) => t.removeEventListener("click", h));
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    });

    /* hero typing loop (decorative) */
    const typingEl = root.querySelector("#typing");
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(id);
    };
    const lines = [
      "Great question \u2014 think of it as updating beliefs with evidence\u2026",
      "P(A|B) = P(B|A)\u00b7P(A) / P(B). Let\u2019s plug in your example\u2026",
      "In short: priors + new data = smarter hunch. Quiz me \u2192",
    ];
    if (typingEl && !reduceMotion) {
      let li = 0;
      let ci = 0;
      let deleting = false;
      const tick = () => {
        if (!typingEl || cancelled) return;
        const full = lines[li];
        if (!deleting) {
          ci += 1;
          typingEl.textContent = full.slice(0, ci);
          if (ci >= full.length) {
            deleting = true;
            later(tick, 1600);
            return;
          }
          later(tick, 22 + Math.random() * 30);
        } else {
          ci -= 3;
          if (ci <= 0) {
            ci = 0;
            deleting = false;
            li = (li + 1) % lines.length;
            later(tick, 400);
            return;
          }
          typingEl.textContent = full.slice(0, ci);
          later(tick, 14);
        }
      };
      later(tick, 900);
    } else if (typingEl) {
      typingEl.textContent = lines[1];
    }
    cleanups.push(() => timers.forEach((t) => clearTimeout(t)));

    /* mouse glow: decorative, dark mode + desktop + motion-ok only */
    const glow = root.querySelector<HTMLElement>("#mouseGlow");
    let glowRaf = 0;
    if (glow && finePointer && !reduceMotion) {
      let gx = -600;
      let gy = -600;
      let tx = gx;
      let ty = gy;
      let shown = false;
      const onMove = (e: MouseEvent) => {
        if (!root.classList.contains("dark")) {
          shown = false;
          if (glow) glow.style.opacity = "0";
          return;
        }
        tx = e.clientX;
        ty = e.clientY;
        if (!shown) {
          shown = true;
          if (glow) glow.style.opacity = "1";
          gx = tx;
          gy = ty;
        }
      };
      document.addEventListener("mousemove", onMove, { passive: true });
      const loop = () => {
        if (cancelled || !glow) return;
        gx += (tx - gx) * 0.08;
        gy += (ty - gy) * 0.08;
        glow.style.transform = `translate3d(${gx - 260}px, ${gy - 260}px, 0)`;
        glowRaf = requestAnimationFrame(loop);
      };
      glowRaf = requestAnimationFrame(loop);
      cleanups.push(() => {
        document.removeEventListener("mousemove", onMove);
        cancelAnimationFrame(glowRaf);
      });
    }

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap"
        rel="stylesheet"
      />
      <div ref={rootRef} className="lnd">
      <div className="bg" aria-hidden="true">
          <div className="orb orb-a"></div>
          <div className="orb orb-b"></div>
          <div className="orb orb-c"></div>
          <div className="grid-overlay"></div>
          <div className="noise"></div>
          <div className="mouse-glow" id="mouseGlow"></div>
        </div>


        <header className="nav" id="nav">
          <div className="container nav-inner">
            <a className="brand" href="#top" aria-label="Smartli home">
              <span className="brand-mark">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#1F5C3D"/><path d="M10 20.5c1.2 1.6 3 2.5 5 2.5 2.8 0 4.5-1.5 4.5-3.5 0-4.8-9.5-3-9.5-8.2 0-1.9 1.7-3.3 4.2-3.3 1.7 0 3.2.7 4.3 1.9" stroke="#F5F1E8" strokeWidth="2.4" strokeLinecap="round"/></svg>
              </span>
              <span className="brand-name">Smartli</span>
              <span className="brand-tag">studio</span>
            </a>
            <nav className="nav-links" aria-label="Primary">
              <a href="#features">Features</a>
              <a href="#how">How it works</a>
              <a href="#product">Product</a>
              <a href="#pricing">Pricing</a>
            </nav>
            <div className="nav-actions">
              <button className="theme-toggle" id="themeToggle" aria-label="Switch to dark mode">
                <svg className="icon-moon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                <svg className="icon-sun" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
              </button>
              <SignedOut>
                <a className="btn btn-ghost" href="/sign-in">Sign in</a>
                <a className="btn btn-primary btn-sm" href="/sign-in">
                  Open app
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </a>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
                <a className="btn btn-primary btn-sm" href="/studio">
                  Open app
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </a>
              </SignedIn>
              <button className="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>
          <div className="mobile-menu" id="mobileMenu">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#product">Product</a>
            <a href="#pricing">Pricing</a>
            <SignedOut>
              <a className="btn btn-primary" href="/sign-in">Open app</a>
            </SignedOut>
            <SignedIn>
              <a className="btn btn-primary" href="/studio">Open app</a>
            </SignedIn>
          </div>
        </header>

        <main id="top">

          <section className="hero container">
            <div className="hero-copy">
              <h1 className="hero-anim" style={{ "--d": "70ms" } as CSSVars}>
                Study smarter,<br />
                <span className="marker">not longer.</span>
              </h1>
              <p className="lede hero-anim" style={{ "--d": "140ms" } as CSSVars}>
                Smartli is your calm AI study companion — it explains anything clearly,
                turns notes into quizzes, and holds your focus with a deep-work timer.
                One studio, zero tab-switching.
              </p>
              <div className="cta-row hero-anim" style={{ "--d": "210ms" } as CSSVars}>
                <a className="btn btn-primary btn-lg" href="/sign-up">
                  Start learning free
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </a>
                <a className="btn btn-secondary btn-lg" href="#product">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>
                  See it in action
                </a>
              </div>
            </div>


            <div className="hero-visual hero-anim" style={{ "--d": "200ms" } as CSSVars} aria-hidden="true">
              <div className="mock">
                <div className="mock-bar">
                  <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                  <span className="mock-url">smartli.app/studio</span>
                  <span className="live"><i></i>live</span>
                </div>
                <div className="mock-body">
                  <div className="chat">
                    <div className="bubble q">Explain Bayes' theorem like I'm 15 ⚡</div>
                    <div className="bubble a">
                      <span className="typing" id="typing"></span><span className="caret"></span>
                    </div>
                    <div className="chips">
                      <span>Make a quiz</span><span>Simplify</span><span>Give example</span>
                    </div>
                  </div>
                  <div className="side">
                    <div className="timer-card">
                      <div className="ring-wrap">
                        <svg className="ring" viewBox="0 0 120 120" aria-hidden="true">
                          <circle cx="60" cy="60" r="52" className="ring-bg"/>
                          <circle cx="60" cy="60" r="52" className="ring-fg"/>
                        </svg>
                        <b>24:59</b>
                      </div>
                      <span>Deep focus · Rain sounds</span>
                    </div>
                    <div className="streak-card">
                      <div><b>12-day</b><span>streak 🔥</span></div>
                      <div className="mini-bar"><i style={{ width: "82%" }}></i></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="float-chip fc-1">✓ Quiz generated · 10 questions</div>
              <div className="float-chip fc-2">+2h deep work logged</div>
            </div>
          </section>


          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              <span>AI Explainer</span><i>✦</i><span>Quiz Generator</span><i>✦</i><span>Focus Hub</span><i>✦</i><span>Active Recall</span><i>✦</i><span>Streaks</span><i>✦</i><span>Ambient Sound</span><i>✦</i>
              <span>AI Explainer</span><i>✦</i><span>Quiz Generator</span><i>✦</i><span>Focus Hub</span><i>✦</i><span>Active Recall</span><i>✦</i><span>Streaks</span><i>✦</i><span>Ambient Sound</span><i>✦</i>
            </div>
          </div>


          <section className="section container" id="features">
            <p className="eyebrow reveal">Everything in one studio</p>
            <h2 className="reveal">Three tools that compound.<br /><span className="dim">Zero context-switching.</span></h2>
            <p className="sub reveal">Learn it, test yourself on it, then actually focus on it — without leaving Smartli.</p>

            <div className="bento">
              <article className="card span-7 reveal">
                <div className="card-top">
                  <span className="icon vio">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/></svg>
                  </span>
                  <h3>AI Explainer</h3>
                  <p>Deep-dives with pedagogical precision. Math renders beautifully, follow-ups stay on topic, and every answer can become a quiz in one click.</p>
                </div>
                <div className="code">
                  <span className="c-dim">you ›</span> why does the chain rule work?<br />
                  <span className="c-dim">smartli ›</span> Think of nested machines… <span className="c-acc">each derivative is a gear ratio ⚙</span>
                </div>
              </article>

              <article className="card span-5 reveal" style={{ "--rd": "70ms" } as CSSVars}>
                <div className="card-top">
                  <span className="icon grn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h9"/></svg>
                  </span>
                  <h3>Quiz Generator</h3>
                  <p>Paste notes, get active-recall assessments. Timed runs, instant grading, spaced review.</p>
                </div>
                <div className="quiz-mini">
                  <div className="qm-row"><span>Q3 · Mitochondria is…</span><b className="ok">+10</b></div>
                  <div className="qm-bar"><i style={{ width: "74%" }}></i></div>
                  <span className="qm-note">74% mastery · review in 2 days</span>
                </div>
              </article>

              <article className="card span-4 reveal">
                <div className="card-top">
                  <span className="icon amb">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                  </span>
                  <h3>Focus Hub</h3>
                  <p>Pomodoro timer with rain, café &amp; white-noise soundscapes. Every session syncs to your stats.</p>
                </div>
              </article>

              <article className="card span-4 reveal" style={{ "--rd": "70ms" } as CSSVars}>
                <div className="card-top">
                  <span className="icon cyn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>
                  </span>
                  <h3>Analytics</h3>
                  <p>Hours, streaks and AI quota — live from your actual sessions, not vanity metrics.</p>
                </div>
              </article>

              <article className="card span-4 reveal" style={{ "--rd": "140ms" } as CSSVars}>
                <div className="card-top">
                  <span className="icon pnk">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>
                  </span>
                  <h3>Tasks &amp; Plans</h3>
                  <p>Rolling study plans that adapt when life happens. Small steps, kept streaks.</p>
                </div>
              </article>
            </div>
          </section>


          <section className="section container" id="how">
            <p className="eyebrow reveal">How it works</p>
            <h2 className="reveal">From confused to confident<br /><span className="dim">in three moves.</span></h2>
            <div className="steps">
              <article className="step reveal">
                <span className="step-n">01</span>
                <h3>Ask anything</h3>
                <p>Drop a concept, photo of your notes, or a past paper. Smartli explains it at your level — with real math, not mush.</p>
              </article>
              <article className="step reveal" style={{ "--rd": "80ms" } as CSSVars}>
                <span className="step-n">02</span>
                <h3>Practice actively</h3>
                <p>One click turns any explanation into a timed quiz. Wrong answers loop back until they stick.</p>
              </article>
              <article className="step reveal" style={{ "--rd": "160ms" } as CSSVars}>
                <span className="step-n">03</span>
                <h3>Lock in &amp; focus</h3>
                <p>Start a 25-minute session with ambient sound. Hours, streaks and progress update automatically.</p>
              </article>
            </div>
          </section>


          <section className="section container" id="product">
            <p className="eyebrow reveal">Take the tour</p>
            <h2 className="reveal">Designed to feel calm<br /><span className="dim">when exams don't.</span></h2>

            <div className="tabs reveal" role="tablist" aria-label="Product tour">
              <button className="tab active" role="tab" aria-selected="true" data-tab="ai">AI Chat</button>
              <button className="tab" role="tab" aria-selected="false" data-tab="quiz">Quiz Mode</button>
              <button className="tab" role="tab" aria-selected="false" data-tab="focus">Focus Timer</button>
              <span className="tab-indicator" id="tabIndicator"></span>
            </div>

            <div className="panels reveal">
              <div className="panel active" data-panel="ai">
                <div className="panel-copy">
                  <h3>An explainer with patience of a tutor</h3>
                  <ul>
                    <li>✓ Step-by-step math &amp; diagrams</li>
                    <li>✓ “Simplify” / “Harder example” in one tap</li>
                    <li>✓ Every answer → quiz, flashcards, summary</li>
                  </ul>
                  <a className="link" href="/ai">Try the AI suite →</a>
                </div>
                <div className="panel-mock">
                  <div className="pm-line"><span className="who">You</span><p>Integral of x·eˣ — I keep messing up the parts.</p></div>
                  <div className="pm-line"><span className="who ai">Smartli</span><p>Let u = x, dv = eˣdx. Then du = dx, v = eˣ — so ∫x·eˣ = <b>xeˣ − eˣ + C</b>. Want 3 practice versions?</p></div>
                </div>
              </div>
              <div className="panel" data-panel="quiz">
                <div className="panel-copy">
                  <h3>Quizzes that find your gaps</h3>
                  <ul>
                    <li>✓ Generated from your own notes</li>
                    <li>✓ Timer, instant grading, retry loop</li>
                    <li>✓ Mastery % + spaced review dates</li>
                  </ul>
                  <a className="link" href="/ai?mode=quiz">Generate a quiz →</a>
                </div>
                <div className="panel-mock">
                  <div className="pm-quiz"><p><b>Q2/10</b> — Powerhouse of the cell?</p><div className="opts"><span className="opt right">Mitochondria ✓</span><span className="opt">Ribosome</span><span className="opt">Nucleus</span></div></div>
                </div>
              </div>
              <div className="panel" data-panel="focus">
                <div className="panel-copy">
                  <h3>Focus that keeps score for you</h3>
                  <ul>
                    <li>✓ 25/50-min sessions, gentle breaks</li>
                    <li>✓ Rain, café, brown-noise soundscapes</li>
                    <li>✓ Auto-logged hours + streak credit</li>
                  </ul>
                  <a className="link" href="/focus">Start focusing →</a>
                </div>
                <div className="panel-mock center">
                  <div className="big-timer">24:59</div>
                  <span className="muted">Session 2 of 4 · Rain 🌧</span>
                </div>
              </div>
            </div>
          </section>


          <section className="section container">
            <p className="eyebrow reveal">Wall of love</p>
            <h2 className="reveal">Learners who stopped<br /><span className="dim">doom-scrolling notes.</span></h2>
            <div className="quotes">
              <figure className="quote reveal"><blockquote>“I asked Smartli one thermodynamics thing at 1am. It explained it better than 3 lectures. Then quizzed me until I actually knew it.”</blockquote><figcaption><b>Ananya K.</b><span>Engineering, Year 2</span></figcaption></figure>
              <figure className="quote reveal" style={{ "--rd": "80ms" } as CSSVars}><blockquote>“The focus timer + streaks got me. 12 days straight of deep work — my GPA noticed before I did.”</blockquote><figcaption><b>Rohan S.</b><span>NEET aspirant</span></figcaption></figure>
              <figure className="quote reveal" style={{ "--rd": "160ms" } as CSSVars}><blockquote>“Quiz mode from my own PDFs is unfair advantage territory. Revision takes half the time now.”</blockquote><figcaption><b>Maria J.</b><span>Med school</span></figcaption></figure>
            </div>
          </section>


          <section className="section container" id="pricing">
            <p className="eyebrow reveal">Pricing</p>
            <h2 className="reveal">Free to start.<br /><span className="dim">Pro when you're serious.</span></h2>
            <div className="plans">
              <article className="plan reveal">
                <h3>Starter</h3>
                <p className="price">₹0 <span>/ forever</span></p>
                <ul><li>✓ 30 AI messages / day</li><li>✓ 5 quizzes / month</li><li>✓ Focus timer + 3 soundscapes</li><li>✓ Streaks &amp; basic stats</li></ul>
                <a className="btn btn-secondary" href="/sign-up">Get started</a>
              </article>
              <article className="plan pro reveal" style={{ "--rd": "90ms" } as CSSVars}>
                <span className="pro-badge">Most popular</span>
                <h3>Pro</h3>
                <p className="price">₹99 <span>/ month</span></p>
                <ul><li>✓ Unlimited AI messages</li><li>✓ Unlimited quizzes + PDFs</li><li>✓ All soundscapes + analytics</li><li>✓ Priority models &amp; support</li></ul>
                <a className="btn btn-primary" href="/plan">Go Pro</a>
              </article>
            </div>
            <p className="fine reveal">Prices in INR. Cancel anytime — your notes and streaks stay yours.</p>
          </section>


          <section className="section container">
            <div className="final reveal">
              <h2>Your next study session<br />could actually stick.</h2>
              <p>Join Smartli free. Explain one hard thing, quiz yourself once, focus for 25 minutes.</p>
              <div className="cta-row center">
                <a className="btn btn-primary btn-lg" href="/sign-up">Start learning free</a>
                <SignedOut>
                  <a className="btn btn-secondary btn-lg" href="/sign-in">Open the studio</a>
                </SignedOut>
                <SignedIn>
                  <a className="btn btn-secondary btn-lg" href="/studio">Open the studio</a>
                </SignedIn>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="container footer-inner">
            <div className="brand">
              <span className="brand-mark">
                <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#1F5C3D"/><path d="M10 20.5c1.2 1.6 3 2.5 5 2.5 2.8 0 4.5-1.5 4.5-3.5 0-4.8-9.5-3-9.5-8.2 0-1.9 1.7-3.3 4.2-3.3 1.7 0 3.2.7 4.3 1.9" stroke="#F5F1E8" strokeWidth="2.4" strokeLinecap="round"/></svg>
              </span>
              <span>Smartli · AI Study Companion</span>
            </div>
            <nav aria-label="Footer">
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <SignedOut>
                <a href="/sign-in">Sign in</a>
                <a href="/sign-in">Open app</a>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
                <a href="/studio">Open app</a>
              </SignedIn>
            </nav>
            <span className="copy">© <span id="year"></span> Smartli. Study smarter.</span>
          </div>
        </footer>
      </div>
    </>
  );
}
