"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";

function initials(name) {
  return (name || "?").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}
function normalizeUrl(url) {
  if (!url) return "";
  return url.match(/^https?:\/\//i) ? url : `https://${url}`;
}
function pctFor(skill, i) {
  let seed = i * 17;
  for (let c = 0; c < skill.length; c++) seed += skill.charCodeAt(c);
  return 60 + (seed % 36);
}
function hexToRgb(hex) {
  const h = (hex || "#f7dc6f").replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

const SKILL_CATEGORIES = [
  { key: "frontend", label: "Frontend", match: /html|css|tailwind|sass|scss|javascript|^js$|typescript|^ts$|react|next|vue|angular|svelte|bootstrap|redux/i },
  { key: "backend", label: "Backend", match: /node|express|django|flask|laravel|spring|nestjs|php|python|java(?!script)|graphql|api/i },
  { key: "database", label: "Database", match: /mongo|firebase|mysql|postgres|sqlite|redis|supabase|prisma|sql/i },
  { key: "tools", label: "Tools", match: /git(hub)?|vs\s?code|figma|postman|docker|aws|vercel|render|linux|jira|npm/i },
];
function categorizeSkills(skills) {
  const groups = {};
  skills.forEach((s) => {
    const cat = SKILL_CATEGORIES.find((c) => c.match.test(s));
    const key = cat ? cat.key : "other";
    const label = cat ? cat.label : "Other";
    if (!groups[key]) groups[key] = { label, skills: [] };
    groups[key].skills.push(s);
  });
  const order = ["frontend", "backend", "database", "tools", "other"];
  return order.filter((k) => groups[k]).map((k) => groups[k]);
}

/* ---- icons ---- */
const IconMail = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>;
const IconGithub = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2-.2 4-1 4-4.5 0-1-.4-2-1-2.7.1-.3.4-1.4-.1-2.8 0 0-.9-.3-3 1a10 10 0 0 0-5.4 0c-2.1-1.3-3-1-3-1-.5 1.4-.2 2.5-.1 2.8-.6.7-1 1.7-1 2.7 0 3.5 2 4.3 4 4.5-.4.4-.5.8-.5 1.5V19" /></svg>;
const IconLinkedin = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7.5 10.5v6M7.5 7.5v.01M12 16.5V13c0-1.5 1-2.5 2.3-2.5s2.2 1 2.2 2.5v3.5" /></svg>;
const IconFacebook = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 8h-2a2 2 0 0 0-2 2v2H9v3h2v6h3v-6h2.2l.8-3H14v-1.5c0-.6.3-1 1-1h1.5V8Z" /></svg>;
const IconDownload = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" /></svg>;
const IconSparkles = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2Z" /></svg>;
const IconArrowDown = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 4v16M5 13l7 7 7-7" /></svg>;
const IconArrowUp = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20V4M5 11l7-7 7 7" /></svg>;
const IconGraduationCap = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 10L12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></svg>;
const IconBriefcase = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
const IconStar = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8l-6.2 3.3 1.2-6.9-5-4.9 6.9-1L12 2Z" /></svg>;
const IconAward = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="6" /><path d="M8.7 13.7 7 22l5-3 5 3-1.7-8.3" /></svg>;
const IconExternalLink = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 4h6v6M20 4l-9 9M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" /></svg>;
const IconSend = () => <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7Z" /></svg>;
const IconCheck = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>;
const IconMenu = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18M3 12h18M3 18h18" /></svg>;
const IconX = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 6 6 18M6 6l12 12" /></svg>;
const IconTarget = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" fill="currentColor" /></svg>;
const IconHeart = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-7-4.5-9.3-9C1 8.5 2.5 4.5 6.5 4.2 8.8 4 11 5.2 12 7c1-1.8 3.2-3 5.5-2.8 4 .3 5.5 4.3 3.8 7.8-2.3 4.5-9.3 9-9.3 9Z" /></svg>;

const CAT_ICONS = {
  Frontend: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 4 3 12l5 8M16 4l5 8-5 8" /></svg>,
  Backend: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="7" rx="1.5" /><rect x="3" y="13" width="18" height="7" rx="1.5" /></svg>,
  Database: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /></svg>,
  Tools: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4L21 6l-3-3-3.3 3.3Z" /></svg>,
  Other: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /></svg>,
};

/* ================= shared primitives ================= */
function Reveal({ children, delay = 0, className }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }) {
  const words = title.split(" ");
  return (
    <Reveal className="t3-heading">
      <span className="t3-eyebrow">{eyebrow}</span>
      <h2 className="t3-h2">
        {words.map((w, i) => (i === words.length - 1 ? <span key={i} className="t3-grad">{w}</span> : <span key={i}>{w} </span>))}
      </h2>
      {subtitle && <p className="t3-subtitle">{subtitle}</p>}
      <style jsx>{`
        .t3-heading { max-width: 640px; margin: 0 auto; text-align: center; display: flex; flex-direction: column; align-items: center; }
        .t3-eyebrow { display: inline-block; border-radius: 999px; border: 1px solid rgba(255,255,255,.12); background: color-mix(in srgb, var(--p-surface) 50%, transparent); backdrop-filter: blur(10px); padding: 6px 16px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .16em; color: var(--p-accent); }
        .t3-h2 { margin-top: 18px; font-size: clamp(26px, 4.2vw, 42px); font-weight: 700; color: var(--p-text); line-height: 1.2; text-align: center; }
        .t3-grad { background: linear-gradient(135deg, var(--p-text), var(--p-accent) 60%, var(--p-accent-2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .t3-subtitle { margin-top: 14px; color: var(--p-muted); font-size: 14.5px; line-height: 1.7; text-align: center; max-width: 520px; }
      `}</style>
    </Reveal>
  );
}

function GlassCard({ children, className = "", hover = true, style }) {
  return (
    <div className={`t3-glass-card ${hover ? "t3-hover" : ""} ${className}`} style={style}>
      {children}
      <style jsx>{`
        .t3-glass-card { border-radius: 24px; border: 1px solid rgba(255,255,255,.1); background: color-mix(in srgb, var(--p-surface) 45%, transparent); backdrop-filter: blur(14px); padding: 28px; transition: all 0.3s ease; box-shadow: 0 10px 40px -12px rgba(0,0,0,.35); box-sizing: border-box; }
        .t3-hover:hover { transform: translateY(-6px); border-color: color-mix(in srgb, var(--p-accent) 50%, transparent); box-shadow: 0 0 50px -12px color-mix(in srgb, var(--p-accent) 45%, transparent); }
      `}</style>
    </div>
  );
}

function Counter({ value, suffix = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = value;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          let start = null;
          const dur = 1400;
          const step = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * target).toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.disconnect();
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, suffix]);
  return <span ref={ref} className="t3-counter">0{suffix}</span>;
}

/* ================= Cursor + Background ================= */
function CursorBubble({ accent }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);
  const canvasRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const { r, g, b } = hexToRgb(accent);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !canvasRef.current) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my, gx = mx, gy = my;
    let hovering = false, pressed = false, angle = 0, idCounter = 0;
    const trail = [];
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      const t = e.target;
      const interactive = t?.closest?.('a, button, [role="button"], input, textarea');
      hovering = !!interactive;
      trail.push({ x: mx, y: my, life: 1, id: idCounter++ });
      if (trail.length > 24) trail.shift();
    };
    const onDown = () => (pressed = true);
    const onUp = () => (pressed = false);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.classList.add("t3-cursor-on");

    let raf = 0;
    const tick = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      gx += (mx - gx) * 0.08; gy += (my - gy) * 0.08;
      angle += 0.012;
      const scale = pressed ? 0.7 : hovering ? 2.2 : 1;
      const ringScale = pressed ? 0.6 : hovering ? 1.9 : 1;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%) scale(${scale})`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) rotate(${angle * 60}deg) scale(${ringScale})`;
      if (glowRef.current) glowRef.current.style.transform = `translate3d(${gx}px, ${gy}px, 0) translate(-50%, -50%)`;

      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        p.life *= 0.9;
        const rad = 10 * p.life;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.55 * p.life})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = trail.length - 1; i >= 0; i--) if (trail[i].life < 0.05) trail.splice(i, 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("t3-cursor-on");
    };
  }, [enabled, r, g, b]);

  if (!enabled) return null;
  return (
    <>
      <canvas ref={canvasRef} aria-hidden style={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: 99 }} />
      <div ref={glowRef} aria-hidden style={{ pointerEvents: "none", position: "fixed", left: 0, top: 0, zIndex: 99, width: 128, height: 128, borderRadius: "50%", filter: "blur(6px)", background: `radial-gradient(circle, rgba(${r},${g},${b},0.28) 0%, rgba(${r},${g},${b},0.08) 40%, transparent 70%)` }} />
      <div ref={ringRef} aria-hidden style={{ pointerEvents: "none", position: "fixed", left: 0, top: 0, zIndex: 100, width: 44, height: 44, borderRadius: "50%", border: `1.5px dashed rgba(${r},${g},${b},0.85)`, boxShadow: `0 0 18px rgba(${r},${g},${b},0.35)` }} />
      <div ref={dotRef} aria-hidden style={{ pointerEvents: "none", position: "fixed", left: 0, top: 0, zIndex: 101, width: 10, height: 10, borderRadius: "50%", background: accent, boxShadow: `0 0 14px rgba(${r},${g},${b},0.95), 0 0 30px rgba(${r},${g},${b},0.5)` }} />
      <style jsx global>{`.t3-cursor-on, .t3-cursor-on * { cursor: none !important; }`}</style>
    </>
  );
}

function Background() {
  return (
    <div style={{ pointerEvents: "none", position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
      <div className="t3-orb t3-orb-a" />
      <div className="t3-orb t3-orb-b" />
      <div className="t3-orb t3-orb-c" />
      <style jsx>{`
        .t3-orb { position: absolute; border-radius: 50%; filter: blur(110px); }
        .t3-orb-a { top: -10%; left: -10%; width: 32rem; height: 32rem; background: color-mix(in srgb, var(--p-accent) 25%, transparent); animation: t3float 9s ease-in-out infinite; }
        .t3-orb-b { top: 18%; right: -12%; width: 28rem; height: 28rem; background: color-mix(in srgb, var(--p-accent-2) 20%, transparent); animation: t3float 11s ease-in-out infinite reverse; }
        .t3-orb-c { bottom: -12%; left: 28%; width: 26rem; height: 26rem; background: color-mix(in srgb, var(--p-accent) 15%, transparent); animation: t3float 13s ease-in-out infinite; }
        @keyframes t3float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
      `}</style>
    </div>
  );
}

/* ================= Navbar ================= */
const NAV_LINKS = [
  { href: "#home", label: "Home" }, { href: "#about", label: "About" }, { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" }, { href: "#contact", label: "Contact" },
];

function T3Navbar({ d, showCertificates }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const links = showCertificates ? [...NAV_LINKS.slice(0, 4), { href: "#certificates", label: "Certificates" }, NAV_LINKS[4]] : NAV_LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCertificates]);

  const go = (href) => { setOpen(false); document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <>
      <motion.div className="t3-progress" style={{ scaleX: progress }} />
      <header className={`t3-nav ${scrolled ? "scrolled" : ""}`}>
        <nav className="t3-nav-inner">
          <button onClick={() => go("#home")} className="t3-brand">
            <span className="t3-brand-mark"><IconSparkles /></span>
            <span>{(d.name || "Your").split(" ")[0]}<span className="grad">.dev</span></span>
          </button>
          <div className="t3-links">
            {links.map((l) => (
              <button key={l.href} onClick={() => go(l.href)} className={`t3-link ${active === l.href.slice(1) ? "active" : ""}`}>
                {active === l.href.slice(1) && <motion.span layoutId="t3-pill" className="t3-pill" transition={{ type: "spring", stiffness: 350, damping: 30 }} />}
                <span style={{ position: "relative" }}>{l.label}</span>
              </button>
            ))}
          </div>
          <div className="t3-nav-actions">
            <button onClick={() => go("#contact")} className="t3-hire-btn">Hire Me</button>
            <button onClick={() => setOpen((o) => !o)} aria-label="Menu" className="t3-burger">{open ? <IconX /> : <IconMenu />}</button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="t3-drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.div className="t3-drawer" initial={{ opacity: 0, scale: 0.9, y: -12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -12 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}>
              {links.map((l) => (
                <button key={l.href} onClick={() => go(l.href)} className={`t3-drawer-link ${active === l.href.slice(1) ? "active" : ""}`}>{l.label}</button>
              ))}
              <button onClick={() => go("#contact")} className="t3-drawer-cta">Hire Me</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .t3-progress { position: fixed; left: 0; right: 0; top: 0; z-index: 60; height: 4px; transform-origin: left; background: linear-gradient(90deg, var(--p-accent), var(--p-accent-2)); }
        .t3-nav { position: sticky; top: 4px; z-index: 50; padding: 16px 0; transition: padding 0.3s ease; }
        .t3-nav.scrolled { padding: 8px 0; }
        .t3-nav-inner { margin: 0 auto; max-width: 1120px; width: calc(100% - 48px); display: flex; align-items: center; justify-content: space-between; gap: 16px; border-radius: 18px; padding: 10px 20px; border: 1px solid transparent; transition: all 0.3s ease; box-sizing: border-box; }
        .t3-nav.scrolled .t3-nav-inner { background: color-mix(in srgb, var(--p-bg) 75%, transparent); backdrop-filter: blur(14px); border-color: rgba(255,255,255,.1); box-shadow: 0 10px 40px -12px rgba(0,0,0,.4); }
        .t3-brand { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 16px; background: none; border: none; color: var(--p-text); cursor: pointer; flex-shrink: 0; }
        .t3-brand-mark { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); color: var(--p-bg); box-shadow: 0 0 24px -6px color-mix(in srgb, var(--p-accent) 60%, transparent); flex-shrink: 0; }
        .grad { background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .t3-links { display: none; align-items: center; gap: 2px; }
        .t3-link { position: relative; display: flex; align-items: center; background: none; border: none; padding: 9px 16px; border-radius: 999px; font-size: 13.5px; font-weight: 500; color: var(--p-muted); cursor: pointer; white-space: nowrap; }
        .t3-link.active { color: var(--p-text); }
        .t3-pill { position: absolute; inset: 0; border-radius: 999px; background: color-mix(in srgb, var(--p-surface) 60%, transparent); border: 1px solid rgba(255,255,255,.1); z-index: -1; }
        .t3-nav-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .t3-hire-btn { display: none; border: none; border-radius: 12px; padding: 10px 20px; font-size: 13px; font-weight: 600; background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); color: var(--p-bg); cursor: pointer; transition: transform 0.2s; box-shadow: 0 0 24px -6px color-mix(in srgb, var(--p-accent) 60%, transparent); white-space: nowrap; }
        .t3-hire-btn:hover { transform: scale(1.05); }
        .t3-burger { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 12px; border: 1px solid rgba(255,255,255,.1); background: color-mix(in srgb, var(--p-surface) 45%, transparent); color: var(--p-text); flex-shrink: 0; }
        .t3-drawer-backdrop { position: fixed; inset: 0; z-index: 40; background: rgba(0,0,0,.55); backdrop-filter: blur(3px); }
        .t3-drawer { position: fixed; right: 16px; top: 84px; z-index: 50; width: min(280px, calc(100% - 32px)); border-radius: 22px; padding: 14px; display: flex; flex-direction: column; gap: 4px; background: color-mix(in srgb, var(--p-bg) 85%, transparent); backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,.1); box-shadow: 0 20px 50px -12px rgba(0,0,0,.5); }
        .t3-drawer-link { text-align: left; background: none; border: none; padding: 12px 14px; border-radius: 12px; font-size: 14px; color: var(--p-muted); }
        .t3-drawer-link.active { background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); color: var(--p-bg); font-weight: 600; }
        .t3-drawer-cta { margin-top: 6px; border: none; border-radius: 12px; padding: 12px; font-size: 13px; font-weight: 600; background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); color: var(--p-bg); }
        @media (min-width: 900px) { .t3-links, .t3-hire-btn { display: flex; } .t3-burger { display: none; } }
      `}</style>
    </>
  );
}

/* ================= Hero ================= */
function Hero({ d, c }) {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const socials = [
    d.github && { href: normalizeUrl(d.github), label: "GitHub", Icon: IconGithub },
    d.linkedin && { href: normalizeUrl(d.linkedin), label: "LinkedIn", Icon: IconLinkedin },
    d.facebook && { href: normalizeUrl(d.facebook), label: "Facebook", Icon: IconFacebook },
    d.email && { href: `mailto:${d.email}`, label: "Email", Icon: IconMail },
  ].filter(Boolean);

  return (
    <section id="home" className="t3-hero">
      <div className="t3-hero-grid">
        <motion.div className="t3-hero-copy" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <span className="t3-badge"><IconSparkles /> Available for freelance &amp; full-time roles</span>
          <h1 className="t3-h1">
            I&rsquo;m <span className="t3-grad">{d.name || "Your Name"}</span>, a{" "}
            <span className="t3-accent">{d.role || "Developer"}</span>.
          </h1>
          <p className="t3-lead">{c?.heroText || d.bio}</p>
          <div className="t3-cta-row">
            <a href="#contact" onClick={(e) => { e.preventDefault(); go("contact"); }} className="t3-btn-outline"><IconDownload /> Download Resume</a>
            <button onClick={() => go("projects")} className="t3-btn-primary">View My Work</button>
          </div>
          {socials.length > 0 && (
            <div className="t3-social-row">
              {socials.map(({ href, label, Icon }) => (
                <a key={label} href={href} target={label === "Email" ? undefined : "_blank"} rel="noopener noreferrer" aria-label={label} className="t3-social-btn"><Icon /></a>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div className="t3-portrait-wrap" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
          <div className="t3-portrait-inner">
            <div className="t3-portrait-glow" />
            <div className="t3-portrait-ring" />
            <div className="t3-portrait-static-ring" />
            <div className="t3-portrait-photo">
              {d.photoUrl ? <img src={d.photoUrl} alt={d.name || "Portrait"} /> : <div className="t3-portrait-empty">{initials(d.name)}</div>}
            </div>
            <motion.div className="t3-float-badge" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <p className="val">{d.projects.length || 0}+</p>
              <p className="lbl">Projects</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <button onClick={() => go("about")} aria-label="Scroll down" className="t3-scroll-hint"><IconArrowDown /></button>

      <style jsx>{`
        .t3-hero { position: relative; min-height: 100vh; display: flex; align-items: center; padding: 128px 0 72px; box-sizing: border-box; }
        .t3-hero-grid { margin: 0 auto; width: 100%; max-width: 1120px; padding: 0 24px; box-sizing: border-box; display: grid; gap: 56px; align-items: center; grid-template-columns: 1.1fr 0.9fr; }
        .t3-hero-copy { display: flex; flex-direction: column; align-items: flex-start; }
        .t3-badge { display: inline-flex; align-items: center; gap: 8px; border-radius: 999px; border: 1px solid rgba(255,255,255,.12); background: color-mix(in srgb, var(--p-surface) 50%, transparent); backdrop-filter: blur(10px); padding: 6px 16px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .16em; color: var(--p-accent); }
        .t3-h1 { margin-top: 24px; font-size: clamp(32px, 5.5vw, 56px); line-height: 1.12; font-weight: 800; color: var(--p-text); }
        .t3-grad { background: linear-gradient(135deg, var(--p-text), var(--p-accent) 60%, var(--p-accent-2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .t3-accent { color: var(--p-accent); }
        .t3-lead { margin-top: 20px; max-width: 520px; color: var(--p-muted); font-size: 15.5px; line-height: 1.75; }
        .t3-cta-row { margin-top: 32px; display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
        .t3-btn-outline { display: inline-flex; align-items: center; gap: 8px; border-radius: 16px; border: 2px solid var(--p-accent); color: var(--p-accent); padding: 13px 24px; font-size: 13.5px; font-weight: 600; text-decoration: none; transition: all 0.2s; line-height: 1; }
        .t3-btn-outline:hover { transform: translateY(-2px); background: color-mix(in srgb, var(--p-accent) 12%, transparent); }
        .t3-btn-primary { display: inline-flex; align-items: center; border: none; border-radius: 16px; padding: 13px 24px; font-size: 13.5px; font-weight: 600; background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); color: var(--p-bg); cursor: pointer; box-shadow: 0 0 40px -8px color-mix(in srgb, var(--p-accent) 65%, transparent); transition: transform 0.2s; line-height: 1; }
        .t3-btn-primary:hover { transform: scale(1.05); }
        .t3-social-row { margin-top: 30px; display: flex; align-items: center; gap: 10px; }
        .t3-social-btn { display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; border-radius: 14px; border: 1px solid rgba(255,255,255,.12); background: color-mix(in srgb, var(--p-surface) 45%, transparent); backdrop-filter: blur(10px); color: var(--p-muted); text-decoration: none; transition: all 0.2s; flex-shrink: 0; }
        .t3-social-btn:hover { transform: translateY(-3px); border-color: color-mix(in srgb, var(--p-accent) 55%, transparent); color: var(--p-accent); }
        .t3-portrait-wrap { display: flex; align-items: center; justify-content: center; width: 100%; }
        .t3-portrait-inner { position: relative; aspect-ratio: 1; width: 100%; max-width: 380px; display: flex; align-items: center; justify-content: center; }
        .t3-portrait-glow { position: absolute; inset: 24px; border-radius: 50%; background: color-mix(in srgb, var(--p-accent) 25%, transparent); filter: blur(60px); animation: t3glow 3.5s ease-in-out infinite; }
        @keyframes t3glow { 0%, 100% { opacity: 0.8; transform: scale(1); } 50% { opacity: 1; transform: scale(1.06); } }
        .t3-portrait-ring { position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(from 0deg, transparent 0deg, transparent 260deg, color-mix(in srgb, var(--p-accent) 15%, transparent) 300deg, var(--p-accent) 350deg, var(--p-text) 360deg); animation: t3spin 7s linear infinite; -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 6px)); mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 6px)); }
        @keyframes t3spin { to { transform: rotate(360deg); } }
        .t3-portrait-static-ring { position: absolute; inset: 0; border-radius: 50%; border: 1px solid color-mix(in srgb, var(--p-accent) 25%, transparent); }
        .t3-portrait-photo { position: absolute; inset: 7%; border-radius: 50%; overflow: hidden; border: 2px solid color-mix(in srgb, var(--p-accent) 40%, transparent); box-shadow: 0 0 60px -10px color-mix(in srgb, var(--p-accent) 45%, transparent); display: flex; align-items: center; justify-content: center; }
        .t3-portrait-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .t3-portrait-empty { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--p-surface); color: var(--p-accent); font-size: 42px; font-weight: 700; }
        .t3-float-badge { position: absolute; bottom: 4%; left: -6%; border-radius: 16px; padding: 12px 18px; background: color-mix(in srgb, var(--p-surface) 70%, transparent); backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,.12); box-shadow: 0 10px 30px -10px rgba(0,0,0,.4); text-align: center; }
        .t3-float-badge .val { font-size: 22px; font-weight: 700; line-height: 1.2; background: linear-gradient(135deg, var(--p-text), var(--p-accent)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .t3-float-badge .lbl { font-size: 11px; color: var(--p-muted); margin-top: 2px; }
        .t3-scroll-hint { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); display: none; align-items: center; justify-content: center; background: none; border: none; color: var(--p-accent); animation: t3bounce 2s infinite; }
        @keyframes t3bounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
        @media (min-width: 768px) { .t3-scroll-hint { display: flex; } }
        @media (max-width: 860px) { .t3-hero-grid { grid-template-columns: 1fr; text-align: center; } .t3-hero-copy { align-items: center; } .t3-lead { margin-left: auto; margin-right: auto; } .t3-portrait-wrap { order: -1; } .t3-float-badge { left: 50%; transform: translateX(-50%); bottom: -6%; } }
      `}</style>
    </section>
  );
}

/* ================= About ================= */
function About({ d, c }) {
  const infoCards = [
    { icon: IconTarget, label: "Career Objective", text: c?.aboutMe ? c.aboutMe.slice(0, 110) + (c.aboutMe.length > 110 ? "…" : "") : "Building thoughtful, high-craft products end to end." },
  ];
  const statCards = [
    d.stats?.years && { label: "Experience", value: `${d.stats.years}` },
    d.role && { label: "Focus", value: d.role },
    d.stats?.satisfaction && { label: "Satisfaction", value: d.stats.satisfaction },
    d.projects.length > 0 && { label: "Projects", value: `${d.projects.length}+` },
  ].filter(Boolean);
  const interests = d.skills.slice(0, 6);

  return (
    <section id="about" className="t3-section">
      <div className="t3-container">
        <SectionHeading eyebrow="About Me" title="Turning ideas into products" subtitle="A quick look at who I am, what drives me, and how I work." />
        <div className="t3-about-grid">
          <Reveal>
            <GlassCard hover={false} className="t3-about-main">
              <p className="t3-about-text">{c?.aboutMe || d.bio}</p>
              <div className="t3-about-info-row">
                {infoCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.label} className="t3-info-card">
                      <div className="t3-info-head"><Icon /><h4>{card.label}</h4></div>
                      <p>{card.text}</p>
                    </div>
                  );
                })}
              </div>
              {interests.length > 0 && (
                <div className="t3-interests">
                  <div className="t3-info-head"><IconHeart /><h4>Interests</h4></div>
                  <div className="t3-interests-tags">
                    {interests.map((i) => <span key={i} className="t3-tag">{i}</span>)}
                  </div>
                </div>
              )}
            </GlassCard>
          </Reveal>

          {statCards.length > 0 && (
            <div className="t3-about-stats">
              {statCards.map((card, i) => (
                <Reveal key={card.label} delay={i * 0.08}>
                  <GlassCard className="t3-stat-mini">
                    <p className="val">{card.value}</p>
                    <p className="lbl">{card.label}</p>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .t3-about-grid { margin-top: 56px; display: grid; gap: 24px; grid-template-columns: 1.4fr 1fr; align-items: start; }
        :global(.t3-about-main) { height: 100%; box-sizing: border-box; }
        .t3-about-text { color: var(--p-muted); font-size: 14.5px; line-height: 1.8; }
        .t3-about-info-row { margin-top: 24px; display: grid; gap: 16px; grid-template-columns: 1fr; }
        .t3-info-card { border-radius: 16px; border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.03); padding: 18px; box-sizing: border-box; }
        .t3-info-head { display: flex; align-items: center; gap: 8px; color: var(--p-accent); }
        .t3-info-head h4 { font-size: 14px; font-weight: 600; color: var(--p-text); line-height: 1; }
        .t3-info-card p { margin-top: 8px; font-size: 12.5px; color: var(--p-muted); line-height: 1.6; }
        .t3-interests { margin-top: 24px; }
        .t3-interests-tags { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 8px; }
        .t3-tag { display: inline-flex; align-items: center; border-radius: 999px; border: 1px solid rgba(255,255,255,.1); background: color-mix(in srgb, var(--p-surface) 50%, transparent); padding: 6px 14px; font-size: 11.5px; font-weight: 500; color: var(--p-muted); transition: all 0.2s ease; }
        .t3-tag:hover { border-color: var(--p-accent); color: var(--p-accent); transform: translateY(-2px); }
        .t3-about-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 16px; align-content: start; height: 100%; }
        :global(.t3-stat-mini) { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; height: 100%; min-height: 108px; box-sizing: border-box; }
        :global(.t3-stat-mini) .val { font-size: 20px; font-weight: 700; line-height: 1.2; background: linear-gradient(135deg, var(--p-text), var(--p-accent)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        :global(.t3-stat-mini) .lbl { margin-top: 6px; font-size: 10.5px; text-transform: uppercase; letter-spacing: .06em; color: var(--p-muted); }
        @media (max-width: 860px) { .t3-about-grid { grid-template-columns: 1fr; } .t3-about-stats { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); } }
      `}</style>
    </section>
  );
}

/* ================= Stats ================= */
function Stats({ d }) {
  const items = [
    d.projects.length > 0 && { label: "Projects Shipped", value: d.projects.length, suffix: "+" },
    d.stats?.years && { label: "Years Experience", value: parseInt(d.stats.years) || 0, suffix: "+" },
    d.skills.length > 0 && { label: "Technologies", value: d.skills.length, suffix: "+" },
    d.stats?.satisfaction && { label: "Client Satisfaction", value: parseInt(d.stats.satisfaction) || 0, suffix: "%" },
  ].filter(Boolean);
  if (!items.length) return null;
  return (
    <section className="t3-section" style={{ paddingTop: 24, paddingBottom: 24 }}>
      <div className="t3-container">
        <Reveal>
          <div className="t3-stats-panel">
            {items.map((s) => (
              <div key={s.label} className="t3-stat-item">
                <Counter value={s.value} suffix={s.suffix} />
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      <style jsx>{`
        .t3-stats-panel { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; justify-items: center; border-radius: 28px; border: 1px solid rgba(255,255,255,.1); background: color-mix(in srgb, var(--p-surface) 55%, transparent); backdrop-filter: blur(14px); padding: 32px 24px; box-shadow: 0 10px 40px -12px rgba(0,0,0,.35); box-sizing: border-box; }
        .t3-stat-item { text-align: center; }
        .t3-stat-item :global(.t3-counter) { font-size: clamp(24px, 3.4vw, 40px); font-weight: 800; line-height: 1.2; background: linear-gradient(135deg, var(--p-text), var(--p-accent)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .t3-stat-item p { margin-top: 8px; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--p-muted); }
      `}</style>
    </section>
  );
}

/* ================= Skills ================= */
function Skills({ d, c }) {
  const groups = categorizeSkills(d.skills);
  return (
    <section id="skills" className="t3-section">
      <div className="t3-container">
        <SectionHeading eyebrow="Skills" title="My technical toolkit" subtitle="A blend of frontend polish, backend depth, and everything in between." />
        <div className="t3-skills-grid" data-count={groups.length}>
          {groups.map((group, gi) => {
            const CatIcon = CAT_ICONS[group.label] || CAT_ICONS.Other;
            return (
              <Reveal key={group.label} delay={(gi % 4) * 0.08}>
                <GlassCard className="t3-skill-card">
                  <div className="t3-skill-head">
                    <span className="t3-skill-icon"><CatIcon /></span>
                    <h3>{group.label}</h3>
                  </div>
                  <div className="t3-skill-list">
                    {group.skills.map((s, i) => {
                      const pct = pctFor(s, i);
                      return (
                        <div key={s} className="t3-skill-row">
                          <div className="t3-skill-row-top"><span>{s}</span><span className="pct">{pct}%</span></div>
                          <div className="t3-skill-track">
                            <motion.div className="t3-skill-fill" initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </Reveal>
            );
          })}
          {!groups.length && <p style={{ color: "var(--p-muted)", fontSize: 13, textAlign: "center" }}>No skills added yet.</p>}
        </div>
      </div>
      <style jsx>{`
        .t3-skills-grid { margin-top: 56px; display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); justify-content: center; }
        :global(.t3-skill-card) { height: 100%; box-sizing: border-box; display: flex; flex-direction: column; }
        .t3-skill-head { display: flex; align-items: center; gap: 12px; }
        .t3-skill-icon { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); color: var(--p-bg); box-shadow: 0 0 24px -6px color-mix(in srgb, var(--p-accent) 60%, transparent); flex-shrink: 0; }
        .t3-skill-head h3 { font-size: 16px; font-weight: 700; color: var(--p-text); line-height: 1; }
        .t3-skill-list { margin-top: 20px; display: flex; flex-direction: column; gap: 16px; flex: 1; }
        .t3-skill-row-top { display: flex; justify-content: space-between; align-items: baseline; font-size: 13px; color: var(--p-text); }
        .t3-skill-row-top .pct { color: var(--p-muted); font-variant-numeric: tabular-nums; }
        .t3-skill-track { margin-top: 8px; height: 8px; border-radius: 999px; background: rgba(255,255,255,.08); overflow: hidden; }
        .t3-skill-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--p-accent), var(--p-accent-2)); }
        @media (max-width: 640px) { .t3-skills-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

/* ================= Projects ================= */
function Projects({ mergedProjects, d }) {
  return (
    <section id="projects" className="t3-section">
      <div className="t3-container">
        <SectionHeading eyebrow="Projects" title="Selected recent work" subtitle="A few products I'm proud of." />
        <div className="t3-projects-grid">
          {mergedProjects.length ? mergedProjects.map((p, i) => (
            <Reveal key={i} delay={(i % 3) * 0.1}>
              <motion.article whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="t3-proj-card">
                <div className="t3-proj-media" style={p.image ? { backgroundImage: `url(${p.image})` } : undefined}>
                  {!p.image && <span>{initials(p.title)}</span>}
                </div>
                <div className="t3-proj-body">
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  {p.techStack?.length > 0 && (
                    <div className="t3-proj-chips">{p.techStack.map((t, ti) => <span key={ti}>{t}</span>)}</div>
                  )}
                  <div className="t3-proj-actions">
                    {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="t3-proj-live"><IconExternalLink /> Live Demo</a>}
                    {d.github && <a href={normalizeUrl(d.github)} target="_blank" rel="noopener noreferrer" className="t3-proj-code"><IconGithub /> Code</a>}
                  </div>
                </div>
              </motion.article>
            </Reveal>
          )) : <p style={{ color: "var(--p-muted)", fontSize: 13, textAlign: "center", gridColumn: "1 / -1" }}>No projects yet.</p>}
        </div>
      </div>
      <style jsx>{`
        .t3-projects-grid { margin-top: 56px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
        .t3-proj-card { display: flex; flex-direction: column; overflow: hidden; border-radius: 24px; border: 1px solid rgba(255,255,255,.1); background: color-mix(in srgb, var(--p-surface) 45%, transparent); backdrop-filter: blur(14px); transition: border-color 0.2s ease; box-shadow: 0 10px 40px -12px rgba(0,0,0,.35); height: 100%; box-sizing: border-box; }
        .t3-proj-card:hover { border-color: color-mix(in srgb, var(--p-accent) 45%, transparent); }
        .t3-proj-media { position: relative; aspect-ratio: 16/10; background-size: cover; background-position: center; background-color: color-mix(in srgb, var(--p-accent) 12%, transparent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .t3-proj-media span { font-size: 30px; color: color-mix(in srgb, var(--p-accent) 60%, var(--p-muted)); }
        .t3-proj-body { flex: 1; display: flex; flex-direction: column; padding: 22px; }
        .t3-proj-body h3 { font-size: 17px; font-weight: 700; color: var(--p-text); line-height: 1.3; }
        .t3-proj-body p { margin-top: 8px; font-size: 12.5px; color: var(--p-muted); line-height: 1.6; flex: 1; }
        .t3-proj-chips { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 6px; }
        .t3-proj-chips span { border-radius: 999px; border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.04); padding: 3px 10px; font-size: 10.5px; color: var(--p-muted); }
        .t3-proj-actions { margin-top: 18px; display: flex; gap: 10px; }
        .t3-proj-live, .t3-proj-code { display: inline-flex; flex: 1; align-items: center; justify-content: center; gap: 6px; border-radius: 12px; padding: 10px; font-size: 11.5px; font-weight: 600; text-decoration: none; transition: transform 0.2s; box-sizing: border-box; }
        .t3-proj-live { background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); color: var(--p-bg); }
        .t3-proj-code { border: 1px solid rgba(255,255,255,.12); color: var(--p-text); }
        .t3-proj-live:hover, .t3-proj-code:hover { transform: scale(1.03); }
      `}</style>
    </section>
  );
}

/* ================= Certificates (modal) ================= */
function Certificates({ d }) {
  const [selected, setSelected] = useState(null);
  if (!d.certificates?.length) return null;
  return (
    <section id="certificates" className="t3-section">
      <div className="t3-container">
        <SectionHeading eyebrow="Certificates" title="Credentials &amp; achievements" subtitle="Continuous learning is part of the craft." />
        <div className="t3-cert-grid">
          {d.certificates.map((cert, i) => (
            <Reveal key={i} delay={(i % 4) * 0.08}>
              <div role="button" tabIndex={0} onClick={() => setSelected(cert)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(cert)} className="t3-cert-card">
                <div className="t3-cert-top">
                  <span className="t3-cert-icon">{cert.image ? <img src={cert.image} alt="" /> : <IconAward />}</span>
                  <IconExternalLink />
                </div>
                <h3>{cert.title}</h3>
                <p className="issuer">{cert.issuer}</p>
                <p className="date">{cert.year}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="t3-modal-backdrop" onClick={() => setSelected(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} onClick={(e) => e.stopPropagation()} className="t3-modal">
              <button aria-label="Close" onClick={() => setSelected(null)} className="t3-modal-close"><IconX /></button>
              <div className="t3-modal-head">
                <span className="t3-cert-icon lg">{selected.image ? <img src={selected.image} alt="" /> : <IconAward />}</span>
                <div>
                  <h3>{selected.title}</h3>
                  <p className="issuer">{selected.issuer}</p>
                  <p className="date">{selected.year}</p>
                </div>
              </div>
              {selected.image && <div className="t3-modal-img"><img src={selected.image} alt={selected.title} /></div>}
              {selected.link && <a href={normalizeUrl(selected.link)} target="_blank" rel="noopener noreferrer" className="t3-modal-link"><IconExternalLink /> View credential</a>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .t3-cert-grid { margin-top: 56px; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
        .t3-cert-card { cursor: pointer; display: flex; flex-direction: column; height: 100%; border-radius: 24px; border: 1px solid rgba(255,255,255,.1); background: color-mix(in srgb, var(--p-surface) 45%, transparent); backdrop-filter: blur(14px); padding: 22px; transition: all 0.25s ease; box-sizing: border-box; }
        .t3-cert-card:hover { transform: translateY(-6px); border-color: color-mix(in srgb, var(--p-accent) 45%, transparent); }
        .t3-cert-top { display: flex; align-items: flex-start; justify-content: space-between; color: var(--p-muted); }
        .t3-cert-icon { display: flex; align-items: center; justify-content: center; width: 46px; height: 46px; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); color: var(--p-bg); flex-shrink: 0; }
        .t3-cert-icon img { width: 100%; height: 100%; object-fit: cover; }
        .t3-cert-icon.lg { width: 64px; height: 64px; flex-shrink: 0; }
        .t3-cert-card h3 { margin-top: 18px; font-size: 14.5px; font-weight: 600; color: var(--p-text); line-height: 1.4; }
        .t3-cert-card .issuer { margin-top: 4px; font-size: 12.5px; background: linear-gradient(135deg, var(--p-text), var(--p-accent)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .t3-cert-card .date { margin-top: auto; padding-top: 14px; font-size: 11px; color: var(--p-muted); }
        .t3-modal-backdrop { position: fixed; inset: 0; z-index: 200; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(0,0,0,.7); backdrop-filter: blur(4px); }
        .t3-modal { position: relative; width: 100%; max-width: 480px; border-radius: 26px; padding: 28px; background: color-mix(in srgb, var(--p-bg) 92%, transparent); border: 1px solid rgba(255,255,255,.12); box-shadow: 0 30px 80px -20px rgba(0,0,0,.6); box-sizing: border-box; }
        .t3-modal-close { position: absolute; right: 16px; top: 16px; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,.06); border: none; color: var(--p-muted); }
        .t3-modal-head { display: flex; align-items: center; gap: 16px; }
        .t3-modal-head h3 { font-size: 16px; font-weight: 600; color: var(--p-text); line-height: 1.35; }
        .t3-modal-img { margin-top: 22px; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,.1); }
        .t3-modal-img img { width: 100%; object-fit: cover; display: block; }
        .t3-modal-link { margin-top: 18px; display: inline-flex; align-items: center; gap: 6px; color: var(--p-accent); text-decoration: none; font-size: 13px; font-weight: 600; }
        @media (max-width: 560px) { .t3-cert-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

/* ================= Timeline (education + internships + achievements) ================= */
function TimelineSection({ d }) {
  const items = [
    ...d.education.map((ed) => ({ type: "education", title: ed.degree || "Degree", detail: `${ed.institution || "Institution"}`, year: ed.year || "" })),
    ...(d.internships || []).map((it) => ({ type: "career", title: it.role || "Internship", detail: `${it.company || "Company"}${it.description ? " — " + it.description : ""}`, year: it.duration || "" })),
    ...(d.achievements || []).map((a) => ({ type: "milestone", title: a.title || "Achievement", detail: a.description || "", year: a.year || "" })),
  ];
  if (!items.length) return null;
  const ICONS = { education: IconGraduationCap, career: IconBriefcase, milestone: IconStar };

  return (
    <section id="journey" className="t3-section">
      <div className="t3-container t3-container-narrow">
        <SectionHeading eyebrow="Timeline" title="My journey so far" subtitle="Education, experience, and milestones that shaped my path." />
        <div className="t3-timeline">
          <div className="t3-timeline-rail" />
          <div className="t3-timeline-items">
            {items.map((item, i) => {
              const Icon = ICONS[item.type];
              return (
                <Reveal key={i} delay={i * 0.05}>
                  <div className="t3-timeline-row">
                    <span className="t3-timeline-dot"><Icon /></span>
                    <div className="t3-timeline-card">
                      <div className="t3-timeline-top">
                        {item.year && <span className="t3-timeline-year">{item.year}</span>}
                        <h3>{item.title}</h3>
                      </div>
                      {item.detail && <p>{item.detail}</p>}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
      <style jsx>{`
        .t3-container-narrow { max-width: 760px; }
        .t3-timeline { position: relative; margin-top: 56px; padding-left: 32px; box-sizing: border-box; }
        .t3-timeline-rail { position: absolute; left: 0; top: 8px; bottom: 8px; width: 1px; background: linear-gradient(to bottom, var(--p-accent), var(--p-accent-2)); }
        .t3-timeline-items { display: flex; flex-direction: column; gap: 32px; }
        .t3-timeline-row { position: relative; }
        .t3-timeline-dot { position: absolute; left: -32px; top: 4px; transform: translateX(-50%); display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: color-mix(in srgb, var(--p-surface) 60%, transparent); border: 1px solid rgba(255,255,255,.1); color: var(--p-accent); flex-shrink: 0; }
        .t3-timeline-card { border-radius: 18px; border: 1px solid rgba(255,255,255,.1); background: color-mix(in srgb, var(--p-surface) 45%, transparent); backdrop-filter: blur(10px); padding: 18px 20px; transition: border-color 0.2s ease; box-sizing: border-box; }
        .t3-timeline-card:hover { border-color: color-mix(in srgb, var(--p-accent) 40%, transparent); }
        .t3-timeline-top { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
        .t3-timeline-year { display: inline-flex; align-items: center; border-radius: 999px; background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); color: var(--p-bg); padding: 3px 12px; font-size: 11px; font-weight: 700; line-height: 1.4; }
        .t3-timeline-top h3 { font-size: 15px; font-weight: 600; color: var(--p-text); line-height: 1.4; }
        .t3-timeline-card p { margin-top: 8px; font-size: 12.5px; color: var(--p-muted); line-height: 1.6; }
      `}</style>
    </section>
  );
}

/* ================= Contact ================= */
function FloatingField({ id, label, value, onChange, error, type = "text", textarea = false }) {
  return (
    <div className="t3-field">
      {textarea ? (
        <textarea id={id} rows={4} placeholder={label} value={value} onChange={(e) => onChange(e.target.value)} className={`t3-input ${error ? "err" : ""}`} />
      ) : (
        <input id={id} type={type} placeholder={label} value={value} onChange={(e) => onChange(e.target.value)} className={`t3-input ${error ? "err" : ""}`} />
      )}
      <label htmlFor={id}>{label}</label>
      {error && <p className="t3-field-err">{error}</p>}
      <style jsx>{`
        .t3-field { position: relative; }
        .t3-input { width: 100%; box-sizing: border-box; border-radius: 16px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.03); padding: 22px 16px 8px; font-size: 13.5px; color: var(--p-text); outline: none; transition: border-color 0.2s; font-family: inherit; resize: vertical; }
        .t3-input.err { border-color: #ef4444; }
        .t3-input:focus { border-color: var(--p-accent); }
        label { position: absolute; left: 16px; top: 15px; font-size: 12.5px; color: var(--p-muted); pointer-events: none; transition: all 0.15s; }
        .t3-input:focus + label, .t3-input:not(:placeholder-shown) + label { top: 7px; font-size: 10px; color: var(--p-accent); }
        .t3-field-err { margin-top: 6px; padding-left: 4px; font-size: 11px; color: #ef4444; }
      `}</style>
    </div>
  );
}

function Contact({ d }) {
  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const set = (k) => (v) => { setFields((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validate = () => {
    const e = {};
    if (!fields.name.trim()) e.name = "Please enter your name.";
    if (!emailRe.test(fields.email.trim())) e.email = "Enter a valid email address.";
    if (fields.message.trim().length < 10) e.message = "Message should be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const onSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSent(true);
    setFields({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  const info = [
    d.email && { Icon: IconMail, label: "Email", value: d.email, href: `mailto:${d.email}` },
    d.github && { Icon: IconGithub, label: "GitHub", value: d.github, href: normalizeUrl(d.github) },
    d.linkedin && { Icon: IconLinkedin, label: "LinkedIn", value: d.linkedin, href: normalizeUrl(d.linkedin) },
  ].filter(Boolean);

  return (
    <section id="contact" className="t3-section">
      <div className="t3-container">
        <SectionHeading eyebrow="Contact" title="Let's build something great" subtitle="Have a project in mind or just want to say hi? Drop me a message." />
        <div className="t3-contact-grid">
          <Reveal>
            <div className="t3-contact-info-col">
              {info.map(({ Icon, label, value, href }) => (
                <a key={label} href={href} target={label === "Email" ? undefined : "_blank"} rel="noopener noreferrer" className="t3-contact-info-item">
                  <span className="t3-contact-icon"><Icon /></span>
                  <div className="t3-contact-info-text"><p className="lbl">{label}</p><p className="val">{value}</p></div>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <GlassCard hover={false}>
              <form onSubmit={onSubmit} className="t3-form" noValidate>
                <div className="t3-form-row">
                  <FloatingField id="t3-name" label="Your name" value={fields.name} onChange={set("name")} error={errors.name} />
                  <FloatingField id="t3-email" label="Email address" type="email" value={fields.email} onChange={set("email")} error={errors.email} />
                </div>
                <FloatingField id="t3-message" label="Your message" textarea value={fields.message} onChange={set("message")} error={errors.message} />
                <motion.button type="submit" whileTap={{ scale: 0.97 }} className={`t3-submit ${sent ? "sent" : ""}`}>
                  {sent ? (<><IconCheck /> Message sent!</>) : (<><IconSend /> Send Message</>)}
                </motion.button>
                <p className="t3-form-note"><IconMail /> I usually reply within 24 hours.</p>
              </form>
            </GlassCard>
          </Reveal>
        </div>
      </div>
      <style jsx>{`
        .t3-contact-grid { margin-top: 56px; display: grid; gap: 24px; grid-template-columns: 1fr 1.3fr; align-items: stretch; }
        .t3-contact-info-col { display: flex; flex-direction: column; gap: 14px; height: 100%; }
        .t3-contact-info-item { display: flex; align-items: center; gap: 16px; border-radius: 18px; border: 1px solid rgba(255,255,255,.1); background: color-mix(in srgb, var(--p-surface) 45%, transparent); backdrop-filter: blur(10px); padding: 18px; text-decoration: none; transition: all 0.2s ease; box-sizing: border-box; flex: 1; }
        .t3-contact-info-item:hover { transform: translateY(-3px); border-color: color-mix(in srgb, var(--p-accent) 45%, transparent); }
        .t3-contact-icon { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); color: var(--p-bg); flex-shrink: 0; }
        .t3-contact-info-text { min-width: 0; }
        .t3-contact-info-item .lbl { font-size: 10.5px; text-transform: uppercase; letter-spacing: .06em; color: var(--p-muted); }
        .t3-contact-info-item .val { margin-top: 3px; font-size: 13.5px; font-weight: 500; color: var(--p-text); overflow-wrap: anywhere; }
        .t3-form { display: flex; flex-direction: column; gap: 18px; }
        .t3-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .t3-submit { display: flex; align-items: center; justify-content: center; gap: 8px; border: none; border-radius: 16px; padding: 14px; font-size: 13.5px; font-weight: 600; color: var(--p-bg); background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); box-shadow: 0 0 40px -8px color-mix(in srgb, var(--p-accent) 60%, transparent); cursor: pointer; transition: transform 0.15s; }
        .t3-submit.sent { background: #22c55e; }
        .t3-submit:hover { transform: scale(1.01); }
        .t3-form-note { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 11.5px; color: var(--p-muted); }
        @media (max-width: 860px) { .t3-contact-grid { grid-template-columns: 1fr; } .t3-form-row { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

/* ================= Footer ================= */
function T3Footer({ d, c }) {
  const socials = [
    d.github && { href: normalizeUrl(d.github), label: "GitHub", Icon: IconGithub },
    d.linkedin && { href: normalizeUrl(d.linkedin), label: "LinkedIn", Icon: IconLinkedin },
    d.facebook && { href: normalizeUrl(d.facebook), label: "Facebook", Icon: IconFacebook },
    d.email && { href: `mailto:${d.email}`, label: "Email", Icon: IconMail },
  ].filter(Boolean);
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="t3-footer">
      <div className="t3-container">
        <div className="t3-footer-grid">
          <div className="t3-footer-about">
            <button onClick={() => go("home")} className="t3-footer-brand">
              <span className="t3-footer-mark"><IconSparkles /></span>
              {(d.name || "Your").split(" ")[0]}<span className="grad">.dev</span>
            </button>
            <p className="t3-footer-tag">{c?.tagline || "Crafting premium, production-ready products."}</p>
          </div>
          <div className="t3-footer-col">
            <h4>Navigation</h4>
            <div className="t3-footer-nav">
              {NAV_LINKS.map((l) => (
                <motion.button key={l.href} onClick={() => go(l.href.slice(1))} whileHover={{ x: 4 }} className="t3-footer-link">{l.label}</motion.button>
              ))}
            </div>
          </div>
          <div className="t3-footer-col">
            <h4>Connect</h4>
            <div className="t3-footer-socials">
              {socials.map(({ href, label, Icon }) => (
                <motion.a key={label} href={href} target={label === "Email" ? undefined : "_blank"} rel="noopener noreferrer" aria-label={label} whileHover={{ y: -4, scale: 1.1 }} whileTap={{ scale: 0.92 }} className="t3-footer-social">
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        <div className="t3-footer-bottom">
          <p>© {new Date().getFullYear()} {d.name || "Your Name"}. All rights reserved.</p>
          <motion.button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.96 }} className="t3-footer-top">
            Back to top <IconArrowUp />
          </motion.button>
        </div>
      </div>
      <style jsx>{`
        .t3-footer { position: relative; border-top: 1px solid rgba(255,255,255,.08); padding: 56px 0; }
        .t3-footer-grid { display: grid; gap: 40px; grid-template-columns: 1.4fr 1fr 1fr; }
        .t3-footer-brand { display: inline-flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 700; background: none; border: none; color: var(--p-text); cursor: pointer; }
        .t3-footer-mark { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); color: var(--p-bg); flex-shrink: 0; }
        .grad { background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .t3-footer-tag { margin-top: 14px; max-width: 300px; font-size: 13px; color: var(--p-muted); line-height: 1.6; }
        .t3-footer-grid h4 { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--p-text); }
        .t3-footer-nav { margin-top: 14px; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
        .t3-footer-link { text-align: left; background: none; border: none; color: var(--p-muted); font-size: 13px; cursor: pointer; padding: 0; }
        .t3-footer-link:hover { color: var(--p-accent); }
        .t3-footer-socials { margin-top: 14px; display: flex; gap: 10px; }
        .t3-footer-social { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 14px; border: 1px solid rgba(255,255,255,.1); background: color-mix(in srgb, var(--p-surface) 45%, transparent); color: var(--p-muted); text-decoration: none; flex-shrink: 0; }
        .t3-footer-social:hover { color: var(--p-bg); background: var(--p-accent); border-color: var(--p-accent); }
        .t3-footer-bottom { margin-top: 48px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,.08); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; }
        .t3-footer-bottom p { font-size: 12.5px; color: var(--p-muted); }
        .t3-footer-top { display: inline-flex; align-items: center; gap: 8px; border-radius: 14px; border: 1px solid rgba(255,255,255,.1); background: color-mix(in srgb, var(--p-surface) 45%, transparent); padding: 9px 18px; font-size: 13px; font-weight: 500; color: var(--p-text); cursor: pointer; }
        .t3-footer-top:hover { border-color: var(--p-accent); }
        @media (max-width: 720px) { .t3-footer-grid { grid-template-columns: 1fr; text-align: center; } .t3-footer-about { display: flex; flex-direction: column; align-items: center; } .t3-footer-col { display: flex; flex-direction: column; align-items: center; } .t3-footer-nav { align-items: center; } .t3-footer-bottom { justify-content: center; text-align: center; } }
      `}</style>
    </footer>
  );
}

/* ================= Scroll to top ================= */
function ScrollToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top" initial={{ opacity: 0, scale: 0.6, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.6, y: 20 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }} className="t3-scrolltop">
          <IconArrowUp />
          <style jsx>{`
            .t3-scrolltop { position: fixed; bottom: 24px; right: 24px; z-index: 60; display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 18px; border: none; cursor: pointer; background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); color: var(--p-bg); box-shadow: 0 12px 34px -10px color-mix(in srgb, var(--p-accent) 65%, transparent); }
          `}</style>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ================= main export ================= */
export default function TemplateThree({ data }) {
  const d = data || {};
  const c = data?.content;
  const theme = data?.theme || { primaryColor: "#2c3e50", accentColor: "#f7dc6f", accentColor2: "#f0c94a", mode: "dark", font: "var(--font-display)" };

  const frameStyle = {
    position: "relative",
    "--p-bg": theme.primaryColor,
    "--p-surface": theme.mode === "dark" ? `color-mix(in srgb, ${theme.primaryColor} 78%, white 10%)` : "#FFFFFF",
    "--p-text": theme.mode === "dark" ? "#FDFEFE" : "#241F16",
    "--p-muted": theme.mode === "dark" ? "#C3CCD4" : "#5B6B7A",
    "--p-accent": theme.accentColor,
    "--p-accent-2": theme.accentColor2 || theme.accentColor,
    "--p-font": theme.font,
    background: theme.primaryColor,
    color: theme.mode === "dark" ? "#FDFEFE" : "#241F16",
    overflow: "hidden",
    fontFamily: "var(--p-font)",
  };

  const mergedProjects = (c?.projectDescriptions || d.projects || []).map((p, i) => {
    const raw = d.projects?.[i] || {};
    return {
      title: p.title || raw.name,
      description: p.description || raw.description,
      techStack: p.techStack || (raw.tech ? raw.tech.split(",").map((t) => t.trim()) : []),
      image: raw.image || "",
      link: normalizeUrl(raw.link || ""),
    };
  });

  return (
    <div className="portfolio-frame tmpl-glass" style={frameStyle}>
      <CursorBubble accent={theme.accentColor} />
      <Background />
      <T3Navbar d={d} showCertificates={d.certificates?.length > 0} />

      <Hero d={d} c={c} />
      <Stats d={d} />
      <About d={d} c={c} />                 
      <Skills d={d} c={c} />                        
      <Projects mergedProjects={mergedProjects} d={d} />
      <Certificates d={d} />
      <TimelineSection d={d} />
      <Contact d={d} />            

      <T3Footer d={d} c={c} />          
      <ScrollToTop />           

      <style jsx>{`
        .t3-section :global(.t3-container) { position: relative; z-index: 1; max-width: 1120px; margin: 0 auto; padding: 0 24px; box-sizing: border-box; }
      `}</style>
      <style jsx global>{`
        .portfolio-frame.tmpl-glass * { box-sizing: border-box; }
        .portfolio-frame.tmpl-glass .t3-section { position: relative; padding: 96px 0; }
        .portfolio-frame.tmpl-glass button { font-family: inherit; }
      `}</style>     
    </div>    
  );
}