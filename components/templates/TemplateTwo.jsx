"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

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
  return 55 + (seed % 40);
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
const COLOR_CYCLE = ["--p-accent", "--p-accent-2", "--p-accent-3"];

/* ---- icons ---- */
const IconMail = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>;
const IconGithub = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2-.2 4-1 4-4.5 0-1-.4-2-1-2.7.1-.3.4-1.4-.1-2.8 0 0-.9-.3-3 1a10 10 0 0 0-5.4 0c-2.1-1.3-3-1-3-1-.5 1.4-.2 2.5-.1 2.8-.6.7-1 1.7-1 2.7 0 3.5 2 4.3 4 4.5-.4.4-.5.8-.5 1.5V19" /></svg>;
const IconLinkedin = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7.5 10.5v6M7.5 7.5v.01M12 16.5V13c0-1.5 1-2.5 2.3-2.5s2.2 1 2.2 2.5v3.5" /></svg>;
const IconFacebook = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 8h-2a2 2 0 0 0-2 2v2H9v3h2v6h3v-6h2.2l.8-3H14v-1.5c0-.6.3-1 1-1h1.5V8Z" /></svg>;
const IconDownload = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" /></svg>;
const IconArrowDown = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v16M5 13l7 7 7-7" /></svg>;
const IconArrowUp = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 20V4M5 11l7-7 7 7" /></svg>;
const IconMenu = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>;
const IconX = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>;
const IconAward = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="8" r="6" /><path d="M8.7 13.7 7 22l5-3 5 3-1.7-8.3" /></svg>;
const IconExternalLink = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 4h6v6M20 4l-9 9M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" /></svg>;
const IconSend = () => <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7Z" /></svg>;
const IconCheck = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5" /></svg>;
const IconUser = () => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></svg>;
const IconMsg = () => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 4h16v12H8l-4 4V4Z" /></svg>;
const IconTrophy = () => <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M8 4H4v2a4 4 0 0 0 4 3.8M16 4h4v2a4 4 0 0 1-4 3.8M12 13v3M9 20h6M10 16h4v4h-4z" /></svg>;
const IconGraduationCap = () => <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 10L12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></svg>;
const IconBriefcase = () => <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
const IconFolder = () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" /></svg>;
const IconCpu = () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></svg>;
const IconTarget = () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" fill="currentColor" /></svg>;
const CAT_ICONS = {
  Frontend: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M8 4 3 12l5 8M16 4l5 8-5 8" /></svg>,
  Backend: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="7" rx="1.5" /><rect x="3" y="13" width="18" height="7" rx="1.5" /></svg>,
  Database: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2"><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /></svg>,
  Tools: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4L21 6l-3-3-3.3 3.3Z" /></svg>,
  Other: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9" /></svg>,
};

/* ================= Magnetic wrapper ================= */
function Magnetic({ children, strength = 0.25 }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = "translate(0,0)"; };
  return <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} style={{ display: "inline-block", transition: "transform 0.15s ease-out" }}>{children}</div>;
}

/* ================= Custom cursor ================= */
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my, raf = 0;
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      if (Math.random() < 0.25) spawnBubble(mx, my);
    };
    const spawnBubble = (x, y) => {
      const b = document.createElement("span");
      const size = 4 + Math.random() * 6;
      b.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px;height:${size}px;border-radius:50%;background:var(--p-accent);opacity:.5;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:opacity .6s ease, transform .6s ease;`;
      document.body.appendChild(b);
      requestAnimationFrame(() => {
        b.style.opacity = "0";
        b.style.transform = `translate(-50%,-50%) translate(${(Math.random() - 0.5) * 30}px, ${10 + Math.random() * 20}px) scale(0.4)`;
      });
      setTimeout(() => b.remove(), 650);
    };
    const ringLoop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(ringLoop);
    };
    raf = requestAnimationFrame(ringLoop);
    const onOver = (e) => { if (e.target?.closest?.('a, button, input, textarea')) ringRef.current?.classList.add("hovering"); };
    const onOut = (e) => { if (e.target?.closest?.('a, button, input, textarea')) ringRef.current?.classList.remove("hovering"); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    document.documentElement.classList.add("t2-cursor-on");
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      document.documentElement.classList.remove("t2-cursor-on");
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div ref={ringRef} className="t2-cursor-ring" />
      <div ref={dotRef} className="t2-cursor-dot" />
      <style jsx global>{`
        .t2-cursor-on, .t2-cursor-on a, .t2-cursor-on button { cursor: none !important; }
        .t2-cursor-ring { position: fixed; left: 0; top: 0; width: 34px; height: 34px; border: 2.5px solid var(--p-accent); border-radius: 50%; pointer-events: none; z-index: 9999; transition: width .2s ease, height .2s ease, border-color .2s ease; }
        .t2-cursor-ring.hovering { width: 54px; height: 54px; border-color: var(--p-accent-2); background: color-mix(in srgb, var(--p-accent) 12%, transparent); }
        .t2-cursor-dot { position: fixed; left: 0; top: 0; width: 8px; height: 8px; border-radius: 50%; background: var(--p-accent-3, var(--p-accent-2)); pointer-events: none; z-index: 9999; }
      `}</style>
    </>
  );
}

/* ================= Background ================= */
function Background() {
  return (
    <div style={{ pointerEvents: "none", position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
      <div className="t2-grid-bg" />
      <div className="t2-blob t2-blob-a" />
      <div className="t2-blob t2-blob-b" />
      <style jsx>{`
        .t2-grid-bg { position: absolute; inset: 0; opacity: 0.35; background-image: linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px); background-size: 60px 60px; }
        .t2-blob { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.22; animation: t2drift 18s ease-in-out infinite; }
        .t2-blob-a { top: -6rem; left: -6rem; width: 28rem; height: 28rem; background: var(--p-accent); }
        .t2-blob-b { bottom: -8rem; right: -8rem; width: 32rem; height: 32rem; background: var(--p-accent-2); animation-delay: 4s; }
        @keyframes t2drift { 0%, 100% { transform: translate(0,0) scale(1); } 33% { transform: translate(40px,-30px) scale(1.1); } 66% { transform: translate(-30px,20px) scale(0.95); } }
      `}</style>
    </div>
  );
}

/* ================= Navbar (sticky — fixed) ================= */
const NAV_LINKS = [
  { id: "home", label: "Home" }, { id: "about", label: "About" }, { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" }, { id: "certificates", label: "Certs" }, { id: "contact", label: "Contact" },
];
function T2Navbar({ d, showCertificates }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const links = showCertificates ? NAV_LINKS : NAV_LINKS.filter((l) => l.id !== "certificates");

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    links.forEach((l) => { const el = document.getElementById(l.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCertificates]);

  const go = (id) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <>
      <motion.header initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="t2-nav">
        <div className="t2-nav-inner">
          <Magnetic strength={0.2}>
            <button onClick={() => go("home")} className="t2-brand-btn">{(d.name || "A").charAt(0)}<span className="dot">.</span></button>
          </Magnetic>

          <div className="t2-links">
            {links.map((l) => {
              const isActive = active === l.id;
              return (
                <button key={l.id} onClick={() => go(l.id)} className={`t2-link ${isActive ? "active" : ""}`}>
                  <span className={`t2-link-dot ${isActive ? "active" : ""}`} />
                  {l.label}
                </button>
              );
            })}
          </div>

          <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" className="t2-burger">
            {open ? <IconX /> : <IconMenu />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 260, damping: 30 }} className="t2-drawer">
            {links.map((l, i) => (
              <motion.button key={l.id} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.05 * i }} onClick={() => go(l.id)} className={`t2-drawer-link ${active === l.id ? "active" : ""}`}>
                <span className="num">0{i + 1}</span>{l.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .t2-nav { position: sticky; top: 0; z-index: 30; padding: 16px 24px; }
        .t2-nav-inner { max-width: 1180px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 16px; background: color-mix(in srgb, var(--p-bg) 78%, transparent); backdrop-filter: blur(14px); border: 2px solid rgba(255,255,255,.15); border-radius: 10px; padding: 10px 16px; box-shadow: 4px 4px 0 0 var(--p-accent); }
        .t2-brand-btn { font-weight: 800; font-size: 17px; color: var(--p-text); background: none; border: none; cursor: pointer; }
        .t2-brand-btn .dot { color: var(--p-accent); }
        .t2-links { display: none; align-items: center; gap: 4px; }
        .t2-link { display: flex; align-items: center; gap: 8px; background: none; border: none; padding: 8px 12px; border-radius: 8px; font-size: 12.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: var(--p-muted); cursor: pointer; }
        .t2-link.active, .t2-link:hover { color: var(--p-text); }
        .t2-link-dot { width: 8px; height: 8px; border-radius: 50%; border: 2px solid rgba(255,255,255,.3); transition: all 0.2s; }
        .t2-link-dot.active { background: var(--p-accent); border-color: var(--p-accent); }
        .t2-burger { background: none; border: none; color: var(--p-text); padding: 6px; }
        .t2-drawer { position: fixed; top: 0; right: 0; bottom: 0; width: 280px; z-index: 55; background: var(--p-surface); border-left: 3px solid var(--p-text); display: flex; flex-direction: column; padding: 96px 24px 24px; gap: 4px; }
        .t2-drawer-link { text-align: left; background: none; border: none; border-bottom: 1px solid rgba(255,255,255,.1); padding: 12px 0; font-size: 17px; font-weight: 600; color: var(--p-text); }
        .t2-drawer-link.active { color: var(--p-accent); }
        .t2-drawer-link .num { font-size: 11px; color: var(--p-accent-2); margin-right: 8px; }
        @media (min-width: 900px) { .t2-links { display: flex; } .t2-burger { display: none; } }
      `}</style>
    </>
  );
}

/* ================= Hero ================= */
function useTyping(words, typeSpeed = 90, deleteSpeed = 45, pause = 1400) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    if (!words.length) return;
    const word = words[i % words.length];
    let t;
    if (!deleting && text === word) t = setTimeout(() => setDeleting(true), pause);
    else if (deleting && text === "") { setDeleting(false); setI((p) => p + 1); }
    else t = setTimeout(() => setText((prev) => (deleting ? word.slice(0, prev.length - 1) : word.slice(0, prev.length + 1))), deleting ? deleteSpeed : typeSpeed);
    return () => clearTimeout(t);
  }, [text, deleting, i, words, typeSpeed, deleteSpeed, pause]);
  return text;
}

function Hero({ d, c }) {
  const words = [d.role, ...d.skills.slice(0, 3)].filter(Boolean);
  const typed = useTyping(words.length ? words : ["Developer"]);
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const quickStats = [
    d.projects.length > 0 && ["accent", `${d.projects.length}+`, "Projects"],
    d.skills.length > 0 && ["accent-2", `${d.skills.length}+`, "Technologies"],
    d.stats?.satisfaction && ["accent-3", d.stats.satisfaction, "Satisfaction"],
  ].filter(Boolean);
  const firstName = (d.name || "Your Name").split(" ")[0];
  const restName = (d.name || "").split(" ").slice(1).join(" ");

  return (
    <section id="home" className="t2-hero">
      <div className="t2-hero-bg" />
      <div className="t2-hero-grid">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="t2-badge"><span className="t2-badge-dot" />Available for freelance &amp; internships</div>

          <h1 className="t2-h1">
            Hi, I&rsquo;m <span style={{ color: "var(--p-accent)" }}>{firstName}</span>
            {restName && <><br />{restName}</>}<span className="t2-h1-dot">.</span>
          </h1>

          <div className="t2-typed-row">
            <span className="t2-typed-prefix">I&rsquo;m a</span>
            <span className="t2-typed-word">{typed}</span>
            <span className="t2-caret" />
          </div>

          <p className="t2-lead">{c?.heroText || d.bio}</p>

          <div className="t2-cta-row">
            <Magnetic strength={0.2}>
              <a href="#contact" onClick={(e) => { e.preventDefault(); go("contact"); }} className="t2-btn">
                <IconDownload /> Download Resume
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <button onClick={() => go("contact")} className="t2-btn t2-btn-pink">
                <IconMail /> Contact Me
              </button>
            </Magnetic>
          </div>

          {quickStats.length > 0 && (
            <div className="t2-quick-stats">
              {quickStats.map(([color, val, label], i) => (
                <div key={label} className="t2-quick-stat">
                  {i > 0 && <span className="t2-quick-divider" />}
                  <div>
                    <div className="val" style={{ color: `var(--p-${color})` }}>{val}</div>
                    <div className="lbl">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => go("about")} className="t2-scroll-btn">
            <span>Scroll</span>
            <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><IconArrowDown /></motion.span>
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }} className="t2-portrait-wrap">
          <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} whileHover={{ scale: 1.03, rotate: 1 }} className="t2-portrait">
            {d.photoUrl ? <img src={d.photoUrl} alt={d.name || "Portrait"} /> : <div className="t2-portrait-empty">{initials(d.name)}</div>}
            <div className="t2-portrait-frame-accent" />
          </motion.div>
          <motion.div animate={{ opacity: [0.2, 0.4, 0.2], scale: [0.95, 1, 0.95] }} transition={{ duration: 4, repeat: Infinity }} className="t2-portrait-glow" />
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} className="t2-portrait-badge">
            👋 Say Hi!
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        .t2-hero { position: relative; min-height: 88vh; display: flex; align-items: center; padding: 64px 24px 90px; max-width: 1180px; margin: 0 auto; overflow: hidden; }
        .t2-hero-bg { position: absolute; top: -10%; left: 50%; transform: translateX(-50%); width: 90%; max-width: 900px; height: 420px; background: radial-gradient(ellipse at center, color-mix(in srgb, var(--p-accent) 10%, transparent), transparent 70%); pointer-events: none; z-index: 0; }
        .t2-hero-grid { position: relative; z-index: 1; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 64px; align-items: center; width: 100%; }

        .t2-badge { display: inline-flex; align-items: center; gap: 9px; border: 1.5px solid color-mix(in srgb, var(--p-accent) 45%, transparent); background: color-mix(in srgb, var(--p-accent) 8%, transparent); border-radius: 999px; padding: 8px 18px; margin-bottom: 28px; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--p-accent); }
        .t2-badge-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--p-accent); box-shadow: 0 0 8px var(--p-accent); animation: t2pulse 1.6s infinite; }
        @keyframes t2pulse { 50% { opacity: 0.4; } }

        .t2-h1 { font-size: clamp(36px, 5.6vw, 68px); font-weight: 800; line-height: 1.02; letter-spacing: -0.02em; color: var(--p-text); }
        .t2-h1-dot { color: var(--p-accent); }

        .t2-typed-row { margin-top: 22px; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; min-height: 40px; }
        .t2-typed-prefix { font-size: 15px; font-weight: 500; color: var(--p-muted); }
        .t2-typed-word { font-size: clamp(20px, 2.8vw, 28px); font-weight: 700; color: var(--p-text); }
        .t2-caret { display: inline-block; width: 3px; height: 24px; background: var(--p-accent); animation: t2blink 1s step-end infinite; }
        @keyframes t2blink { 50% { opacity: 0; } }

        .t2-lead { margin-top: 22px; max-width: 460px; color: var(--p-muted); font-size: 15px; line-height: 1.75; }

        .t2-cta-row { margin-top: 34px; display: flex; flex-wrap: wrap; gap: 16px; }
        .t2-btn { display: inline-flex; align-items: center; gap: 8px; border: 3px solid var(--p-text); background: var(--p-accent); color: var(--p-bg); font-weight: 700; font-size: 13.5px; border-radius: 8px; padding: 13px 24px; text-decoration: none; box-shadow: 6px 6px 0 0 var(--p-text); transition: transform 0.15s, box-shadow 0.15s; cursor: pointer; }
        .t2-btn:hover { transform: translate(-2px, -2px); box-shadow: 8px 8px 0 0 var(--p-text); }
        .t2-btn-pink { background: var(--p-accent-2); }

        .t2-quick-stats { margin-top: 48px; display: flex; align-items: center; }
        .t2-quick-stat { display: flex; align-items: center; }
        .t2-quick-divider { width: 1px; height: 32px; background: rgba(255,255,255,.14); margin: 0 26px; }
        .t2-quick-stats .val { font-size: 27px; font-weight: 800; line-height: 1; }
        .t2-quick-stats .lbl { font-size: 11px; color: var(--p-muted); margin-top: 6px; letter-spacing: .02em; }

        .t2-scroll-btn { margin-top: 46px; display: flex; align-items: center; gap: 8px; background: none; border: none; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--p-muted); cursor: pointer; transition: color 0.2s; }
        .t2-scroll-btn:hover { color: var(--p-accent); }

        .t2-portrait-wrap { position: relative; margin: 0 auto; width: 100%; max-width: 360px; }
        .t2-portrait { position: relative; aspect-ratio: 4/5; border-radius: 14px; overflow: hidden; border: 3px solid var(--p-text); box-shadow: 7px 7px 0 0 var(--p-accent); z-index: 1; }
        .t2-portrait img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .t2-portrait-empty { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--p-surface); color: var(--p-accent); font-size: 48px; font-weight: 800; }
        .t2-portrait-frame-accent { position: absolute; inset: 0; border-radius: 14px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.08); pointer-events: none; }
        .t2-portrait-glow { position: absolute; inset: -20px; z-index: 0; border-radius: 20px; background: color-mix(in srgb, var(--p-accent) 22%, transparent); filter: blur(56px); }
        .t2-portrait-badge { position: absolute; top: -16px; right: -16px; z-index: 2; font-size: 12.5px; font-weight: 700; color: var(--p-bg); background: var(--p-accent-3, var(--p-accent-2)); border: 3px solid var(--p-text); border-radius: 10px; padding: 8px 14px; box-shadow: 4px 4px 0 0 var(--p-text); }

        @media (max-width: 860px) {
          .t2-hero { min-height: auto; padding-top: 40px; }
          .t2-hero-grid { grid-template-columns: 1fr; gap: 40px; }
          .t2-portrait-wrap { max-width: 280px; }
        }
      `}</style>
    </section>
  );
}

/* ================= About (bento) ================= */
function StatTile({ label, value, suffix, Icon, colorVar, shadowVar }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const start = performance.now(), dur = 1300;
      const tick = (t) => {
        const p = Math.min(1, (t - start) / dur);
        setVal(Math.round((1 - Math.pow(1 - p, 3)) * value));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.disconnect();
    }, { threshold: 0.4 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);
  return (
    <motion.div ref={ref} whileHover={{ y: -6 }} className="t2-neo-card t2-stat-tile" style={{ boxShadow: `4px 4px 0 0 var(${shadowVar})` }}>
      <span style={{ color: `var(${colorVar})` }}><Icon /></span>
      <div>
        <div className="val">{val}<span style={{ color: `var(${colorVar})` }}>{suffix}</span></div>
        <div className="lbl">{label}</div>
      </div>
      <style jsx>{`
        .t2-stat-tile { padding: 20px; display: flex; flex-direction: column; justify-content: space-between; height: 100%; }
        .t2-stat-tile .val { font-size: 30px; font-weight: 800; color: var(--p-text); line-height: 1; }
        .t2-stat-tile .lbl { margin-top: 6px; font-size: 12px; color: var(--p-muted); }
      `}</style>
    </motion.div>
  );
}

function About({ d, c }) {
  const stats = [
    d.projects.length > 0 && { label: "Projects", value: d.projects.length, suffix: "+", Icon: IconFolder, colorVar: "--p-accent", shadowVar: "--p-accent" },
    d.skills.length > 0 && { label: "Technologies", value: d.skills.length, suffix: "+", Icon: IconCpu, colorVar: "--p-accent-2", shadowVar: "--p-accent-2" },
    d.stats?.years && { label: "Experience", value: parseInt(d.stats.years) || 0, suffix: " yrs", Icon: IconGraduationCap, colorVar: "--p-accent-3, --p-accent-2", shadowVar: "--p-accent-3, --p-accent-2" },
    d.stats?.satisfaction && { label: "Satisfaction", value: parseInt(d.stats.satisfaction) || 0, suffix: "%", Icon: IconTarget, colorVar: "--p-accent", shadowVar: "--p-accent" },
  ].filter(Boolean);

  return (
    <section id="about" className="t2-section">
      <div className="t2-container">
        <div className="t2-heading">
          <div className="t2-eyebrow-row"><span className="idx">01</span><span className="line" /><span className="tag">About Me</span></div>
          <h2 className="t2-h2">The person behind <span style={{ color: "var(--p-accent)" }}>the pixels.</span></h2>
        </div>

        <div className="t2-bento">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} className="t2-neo-card t2-bento-wide" style={{ boxShadow: "6px 6px 0 0 var(--p-accent)" }}>
            <span className="t2-tag-chip">Who I am</span>
            <p>{c?.aboutMe || d.bio}</p>
          </motion.div>

          {stats.map((s, i) => <StatTile key={s.label} {...s} />)}
        </div>
      </div>
      <style jsx>{`
        .t2-bento { margin-top: 40px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .t2-bento-wide { grid-column: span 4; padding: 28px 32px; display: flex; flex-direction: column; justify-content: center; }
        .t2-bento-wide p { margin-top: 12px; font-size: 16px; color: color-mix(in srgb, var(--p-text) 90%, transparent); line-height: 1.7; }
        @media (min-width: 860px) { .t2-bento-wide { grid-column: span 2; } }
        @media (max-width: 720px) { .t2-bento { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </section>
  );
}

/* ================= Skills (orbit — fixed positioning) ================= */
function orbitPos(i, total, radius) {
  const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
  return { left: `calc(50% + ${Math.cos(angle) * radius}%)`, top: `calc(50% + ${Math.sin(angle) * radius}%)` };
}
function Skills({ d, c }) {
  const groups = categorizeSkills(d.skills);
  const [active, setActive] = useState(0);
  if (!groups.length) return null;
  const cat = groups[Math.min(active, groups.length - 1)];
  const colorVar = COLOR_CYCLE[active % 3];

  return (
    <section id="skills" className="t2-section">
      <div className="t2-container">
        <div className="t2-heading">
          <div className="t2-eyebrow-row"><span className="idx">02</span><span className="line" /><span className="tag">Skills</span></div>
          <h2 className="t2-h2">Tools I <span style={{ color: "var(--p-accent-2)" }}>wield.</span></h2>
          <p className="t2-subtitle">Click an orbiting category to see what&rsquo;s inside.</p>
        </div>

        <div className="t2-skills-grid">
          <div className="t2-orbit">
            <div className="ring r1" /><div className="ring r2" />
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="t2-orbit-hub" style={{ borderColor: `var(${colorVar})`, boxShadow: `4px 4px 0 0 var(${colorVar})` }}>
              <IconCpu />
            </motion.div>
            {groups.map((g, i) => {
              const pos = orbitPos(i, groups.length, 40);
              const CatIcon = CAT_ICONS[g.label] || CAT_ICONS.Other;
              const isActive = i === active;
              const gv = COLOR_CYCLE[i % 3];
              return (
                <div key={g.label} style={{ position: "absolute", ...pos, transform: "translate(-50%, -50%)" }}>
                  <motion.button
                    onClick={() => setActive(i)}
                    animate={{ y: [0, i % 2 === 0 ? -12 : 12, 0] }}
                    transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    className="t2-orbit-node"
                  >
                    <span className={`icon ${isActive ? "active" : ""}`} style={isActive ? { borderColor: `var(${gv})`, color: `var(${gv})`, boxShadow: `0 0 0 4px color-mix(in srgb, var(${gv}) 20%, transparent)` } : undefined}><CatIcon /></span>
                    <span className="lbl" style={isActive ? { color: `var(${gv})` } : undefined}>{g.label}</span>
                  </motion.button>
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={cat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="t2-neo-card t2-skill-panel" style={{ boxShadow: `6px 6px 0 0 var(${colorVar})` }}>
              <div className="head"><h3>{cat.label}</h3><span className="count" style={{ color: `var(${colorVar})`, borderColor: `var(${colorVar})` }}>{cat.skills.length} skills</span></div>
              <div className="list">
                {cat.skills.map((s, i) => {
                  const pct = pctFor(s, i);
                  return (
                    <div key={s} className="row">
                      <div className="top"><span>{s}</span><span style={{ color: `var(${colorVar})` }}>{pct}%</span></div>
                      <div className="track"><motion.div className="fill" style={{ background: `var(${colorVar})` }} initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1 }} /></div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <style jsx>{`
        .t2-skills-grid { margin-top: 40px; display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 48px; align-items: center; }
        .t2-orbit { position: relative; margin: 0 auto; width: 100%; max-width: 380px; aspect-ratio: 1; }
        .ring { position: absolute; border-radius: 50%; border: 2px dashed rgba(255,255,255,.1); }
        .r1 { inset: 12%; } .r2 { inset: 38%; }
        .t2-orbit-hub { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); width: 92px; height: 92px; border-radius: 50%; display: grid; place-items: center; background: var(--p-surface); border: 3px solid; z-index: 2; }
        .t2-orbit-node { display: flex; flex-direction: column; align-items: center; gap: 6px; background: none; border: none; z-index: 1; }
        .t2-orbit-node .icon { display: grid; place-items: center; width: 56px; height: 56px; border-radius: 50%; border: 3px solid rgba(255,255,255,.25); background: var(--p-bg); color: color-mix(in srgb, var(--p-text) 60%, transparent); transition: all 0.2s; }
        .t2-orbit-node .icon.active { transform: scale(1.1); }
        .t2-orbit-node .lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--p-muted); }
        .t2-skill-panel { padding: 26px; }
        .t2-skill-panel .head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; }
        .t2-skill-panel h3 { font-size: 21px; font-weight: 800; color: var(--p-text); }
        .t2-skill-panel .count { font-size: 11px; font-weight: 700; border: 2px solid; border-radius: 999px; padding: 3px 12px; }
        .t2-skill-panel .list { display: flex; flex-direction: column; gap: 16px; }
        .t2-skill-panel .row .top { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; color: var(--p-text); margin-bottom: 8px; }
        .t2-skill-panel .track { height: 9px; border-radius: 999px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); overflow: hidden; }
        .t2-skill-panel .fill { height: 100%; border-radius: 999px; }
        @media (max-width: 900px) { .t2-skills-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

/* ================= Projects (horizontal scroll) ================= */
function Projects({ mergedProjects, d }) {
  const trackRef = useRef(null);
  const scrollBy = (dir) => trackRef.current?.scrollBy({ left: dir * 380, behavior: "smooth" });
  const SHADOWS = ["--p-accent-2", "--p-accent-3, --p-accent-2", "--p-accent"];

  return (
    <section id="projects" className="t2-section">
      <div className="t2-container">
        <div className="t2-heading" style={{ marginBottom: 28 }}>
          <div className="t2-eyebrow-row"><span className="idx">03</span><span className="line" /><span className="tag">Projects</span></div>
          <h2 className="t2-h2">Things I&rsquo;ve <span style={{ color: "var(--p-accent-3, var(--p-accent-2))" }}>built.</span></h2>
          <p className="t2-subtitle">Drag or scroll sideways.</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 16 }}>
          <button onClick={() => scrollBy(-1)} className="t2-scroll-arrow" aria-label="Scroll left">‹</button>
          <button onClick={() => scrollBy(1)} className="t2-scroll-arrow" aria-label="Scroll right">›</button>
        </div>
      </div>

      <div ref={trackRef} className="t2-proj-track">
        {mergedProjects.length ? mergedProjects.map((p, i) => (
          <motion.article key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} whileHover={{ y: -8 }} className="t2-neo-card t2-proj-card" style={{ boxShadow: `6px 6px 0 0 var(${SHADOWS[i % 3]})` }}>
            <div className="media" style={p.image ? { backgroundImage: `url(${p.image})` } : undefined}>
              {!p.image && <span>{initials(p.title)}</span>}
              <span className="num">0{i + 1}</span>
            </div>
            <div className="body">
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              {p.techStack?.length > 0 && <div className="chips">{p.techStack.map((t, ti) => <span key={ti}>{t}</span>)}</div>}
              <div className="actions">
                {d.github && <a href={normalizeUrl(d.github)} target="_blank" rel="noopener noreferrer" className="t2-btn t2-btn-sm"><IconGithub /> GitHub</a>}
                {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="t2-btn t2-btn-pink t2-btn-sm"><IconExternalLink /> Live</a>}
              </div>
            </div>
          </motion.article>
        )) : <p style={{ color: "var(--p-muted)", fontSize: 13, padding: "0 24px" }}>No projects yet.</p>}
      </div>

      <style jsx>{`
        .t2-scroll-arrow { width: 44px; height: 44px; border: 3px solid rgba(255,255,255,.2); border-radius: 8px; color: var(--p-text); background: none; font-size: 20px; cursor: pointer; }
        .t2-scroll-arrow:hover { border-color: var(--p-accent); color: var(--p-accent); }
        .t2-proj-track { display: flex; gap: 22px; overflow-x: auto; padding: 4px 24px 20px; scroll-snap-type: x mandatory; }
        .t2-proj-track::-webkit-scrollbar { display: none; }
        .t2-proj-card { flex-shrink: 0; width: 340px; scroll-snap-align: start; display: flex; flex-direction: column; overflow: hidden; padding: 0 !important; }
        .t2-proj-card .media { position: relative; aspect-ratio: 16/10; background-size: cover; background-position: center; background-color: color-mix(in srgb, var(--p-accent) 12%, transparent); border-bottom: 3px solid var(--p-text); display: flex; align-items: center; justify-content: center; }
        .t2-proj-card .media span:first-child { font-size: 26px; color: color-mix(in srgb, var(--p-accent) 60%, var(--p-muted)); }
        .t2-proj-card .num { position: absolute; bottom: 8px; right: 12px; font-size: 40px; font-weight: 800; color: rgba(255,255,255,.12); }
        .t2-proj-card .body { padding: 20px 22px; display: flex; flex-direction: column; flex: 1; }
        .t2-proj-card h3 { font-size: 19px; font-weight: 800; color: var(--p-text); }
        .t2-proj-card p { margin-top: 8px; font-size: 12.5px; color: var(--p-muted); line-height: 1.6; flex: 1; }
        .t2-proj-card .chips { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 6px; }
        .t2-proj-card .chips span { font-size: 10.5px; font-weight: 600; border: 1px solid rgba(255,255,255,.15); border-radius: 4px; padding: 3px 8px; color: color-mix(in srgb, var(--p-text) 80%, transparent); }
        .t2-proj-card .actions { margin-top: 16px; display: flex; gap: 10px; }
        .t2-btn-sm { flex: 1; justify-content: center; padding: 9px 14px; font-size: 12px; box-shadow: 3px 3px 0 0 var(--p-text) !important; }
      `}</style>
    </section>
  );
}

/* ================= Certificates ================= */
function Certificates({ d }) {
  if (!d.certificates?.length) return null;
  return (
    <section id="certificates" className="t2-section">
      <div className="t2-container">
        <div className="t2-heading">
          <div className="t2-eyebrow-row"><span className="idx">04</span><span className="line" /><span className="tag">Certificates</span></div>
          <h2 className="t2-h2">Credentials &amp; <span style={{ color: "var(--p-accent-3, var(--p-accent-2))" }}>certs.</span></h2>
        </div>
        <div className="t2-cert-grid">
          {d.certificates.map((c, i) => {
            const cv = COLOR_CYCLE[i % 3];
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30, rotate: -2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.06 }} whileHover={{ scale: 1.04, rotate: i % 2 === 0 ? 2 : -2 }} className="t2-neo-card t2-cert-card" style={{ boxShadow: `5px 5px 0 0 var(${cv})` }}>
                {c.image && <div className="img"><img src={c.image} alt="" /></div>}
                <div className="body">
                  <div className="top"><span className="icon" style={{ borderColor: `var(${cv})`, color: `var(${cv})` }}><IconAward /></span><span className="year" style={{ color: `var(${cv})` }}>{c.year}</span></div>
                  <h3>{c.title}</h3>
                  <p>{c.issuer}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        .t2-cert-grid { margin-top: 36px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .t2-cert-card { padding: 0 !important; overflow: hidden; }
        .t2-cert-card .img { aspect-ratio: 16/9; border-bottom: 3px solid var(--p-text); overflow: hidden; }
        .t2-cert-card .img img { width: 100%; height: 100%; object-fit: cover; }
        .t2-cert-card .body { padding: 22px; }
        .t2-cert-card .top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .t2-cert-card .icon { width: 44px; height: 44px; display: grid; place-items: center; border: 3px solid; border-radius: 8px; }
        .t2-cert-card .year { font-size: 13px; font-weight: 700; }
        .t2-cert-card h3 { font-size: 16px; font-weight: 800; color: var(--p-text); }
        .t2-cert-card p { margin-top: 6px; font-size: 12.5px; color: var(--p-muted); }
        @media (max-width: 900px) { .t2-cert-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .t2-cert-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

/* ================= Achievements ================= */
function Achievements({ d }) {
  if (!d.achievements?.length) return null;
  return (
    <section id="achievements" className="t2-section">
      <div className="t2-container">
        <div className="t2-heading">
          <div className="t2-eyebrow-row"><span className="idx">05</span><span className="line" /><span className="tag">Achievements</span></div>
          <h2 className="t2-h2">Wins worth <span style={{ color: "var(--p-accent)" }}>celebrating.</span></h2>
        </div>
        <div className="t2-ach-grid">
          {d.achievements.map((a, i) => {
            const cv = COLOR_CYCLE[i % 3];
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.08 }} whileHover={{ y: -6 }} className="t2-neo-card t2-ach-card" style={{ boxShadow: `5px 5px 0 0 var(${cv})` }}>
                <motion.div animate={{ y: [0, -8, 0], rotate: [0, 8, 0] }} transition={{ duration: 3 + i, repeat: Infinity }} className="icon" style={{ borderColor: `var(${cv})`, color: `var(${cv})` }}><IconTrophy /></motion.div>
                <h3>{a.title}</h3>
                {a.description && <p>{a.description}</p>}
                {a.year && <span className="year" style={{ color: `var(${cv})` }}>{a.year}</span>}
              </motion.div>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        .t2-ach-grid { margin-top: 36px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .t2-ach-card { padding: 26px; text-align: center; }
        .t2-ach-card .icon { display: inline-grid; place-items: center; width: 56px; height: 56px; border: 3px solid; border-radius: 8px; margin-bottom: 16px; }
        .t2-ach-card h3 { font-size: 15px; font-weight: 700; color: var(--p-text); }
        .t2-ach-card p { margin-top: 6px; font-size: 11.5px; color: var(--p-muted); line-height: 1.5; }
        .t2-ach-card .year { display: inline-block; margin-top: 10px; font-size: 11px; font-weight: 700; }
        @media (max-width: 900px) { .t2-ach-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </section>
  );
}

/* ================= Timeline (education + internships) ================= */
function TimelineSection({ d }) {
  const items = [
    ...d.education.map((ed) => ({ Icon: IconGraduationCap, title: ed.degree || "Degree", org: ed.institution || "Institution", period: ed.year || "", cv: "--p-accent" })),
    ...(d.internships || []).map((it) => ({ Icon: IconBriefcase, title: it.role || "Internship", org: it.company || "Company", detail: it.description, period: it.duration || "", cv: "--p-accent-2" })),
  ];
  if (!items.length) return null;
  return (
    <section id="journey" className="t2-section">
      <div className="t2-container" style={{ maxWidth: 760 }}>
        <div className="t2-heading">
          <div className="t2-eyebrow-row"><span className="idx">06</span><span className="line" /><span className="tag">Journey</span></div>
          <h2 className="t2-h2">My academic &amp; <span style={{ color: "var(--p-accent-2)" }}>career path.</span></h2>
        </div>
        <div className="t2-timeline">
          <div className="rail" />
          {items.map((item, i) => {
            const Icon = item.Icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * 0.08 }} className="t2-timeline-item">
                <div className="marker" style={{ borderColor: `var(${item.cv})`, color: `var(${item.cv})`, boxShadow: `3px 3px 0 0 var(${item.cv})` }}><Icon /></div>
                <div className="t2-neo-card card" style={{ boxShadow: `4px 4px 0 0 var(${item.cv})` }}>
                  <span className="period" style={{ color: `var(${item.cv})` }}>{item.period}</span>
                  <h3>{item.title}</h3>
                  <div className="org" style={{ color: `var(${item.cv})` }}>{item.org}</div>
                  {item.detail && <p>{item.detail}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        .t2-timeline { position: relative; margin-top: 40px; padding-left: 44px; }
        .rail { position: absolute; left: 14px; top: 4px; bottom: 4px; width: 2px; background: linear-gradient(to bottom, var(--p-accent), var(--p-accent-2)); }
        .t2-timeline-item { position: relative; margin-bottom: 28px; }
        .t2-timeline-item:last-child { margin-bottom: 0; }
        .marker { position: absolute; left: -44px; top: 2px; width: 34px; height: 34px; display: grid; place-items: center; background: var(--p-bg); border: 3px solid; border-radius: 50%; }
        .t2-timeline-item .card { padding: 20px 22px; }
        .period { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
        .card h3 { margin-top: 6px; font-size: 17px; font-weight: 800; color: var(--p-text); }
        .card .org { margin-top: 3px; font-size: 12.5px; font-weight: 600; }
        .card p { margin-top: 10px; font-size: 12.5px; color: var(--p-muted); line-height: 1.6; }
      `}</style>
    </section>
  );
}

/* ================= Contact ================= */
function Contact({ d }) {
  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState(null);
  const [status, setStatus] = useState("idle");
  const onSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => { setStatus("success"); setFields({ name: "", email: "", message: "" }); setTimeout(() => setStatus("idle"), 3500); }, 900);
  };
  const info = [
    d.email && { Icon: IconMail, label: "Email", value: d.email, href: `mailto:${d.email}`, cv: "--p-accent" },
    d.github && { Icon: IconGithub, label: "GitHub", value: d.github, href: normalizeUrl(d.github), cv: "--p-accent-2" },
    d.linkedin && { Icon: IconLinkedin, label: "LinkedIn", value: d.linkedin, href: normalizeUrl(d.linkedin), cv: "--p-accent-3, --p-accent-2" },
  ].filter(Boolean);

  return (
    <section id="contact" className="t2-section">
      <div className="t2-container">
        <div className="t2-heading">
          <div className="t2-eyebrow-row"><span className="idx">07</span><span className="line" /><span className="tag">Contact</span></div>
          <h2 className="t2-h2">Let&rsquo;s build <span style={{ color: "var(--p-accent-2)" }}>together.</span></h2>
        </div>
        <div className="t2-contact-grid">
          <div className="t2-contact-info">
            {info.map(({ Icon, label, value, href, cv }) => (
              <a key={label} href={href} target={label === "Email" ? undefined : "_blank"} rel="noopener noreferrer" className="t2-neo-card info-item" style={{ boxShadow: `4px 4px 0 0 var(${cv})` }}>
                <span className="icon" style={{ borderColor: `var(${cv})`, color: `var(${cv})` }}><Icon /></span>
                <div><div className="lbl">{label}</div><div className="val">{value}</div></div>
              </a>
            ))}
          </div>
          <form onSubmit={onSubmit} className="t2-neo-card t2-form" style={{ boxShadow: "6px 6px 0 0 var(--p-accent)" }}>
            <div>
              <label><IconUser /> Name</label>
              <input value={fields.name} onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} className={focused === "name" ? "on" : ""} placeholder="Jane Doe" required />
            </div>
            <div>
              <label><IconMail /> Email</label>
              <input type="email" value={fields.email} onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} className={focused === "email" ? "on pink" : ""} placeholder="jane@company.com" required />
            </div>
            <div>
              <label><IconMsg /> Message</label>
              <textarea rows={4} value={fields.message} onChange={(e) => setFields((f) => ({ ...f, message: e.target.value }))} onFocus={() => setFocused("msg")} onBlur={() => setFocused(null)} className={focused === "msg" ? "on yellow" : ""} placeholder="Tell me about the role or project…" required />
            </div>
            <button type="submit" disabled={status === "sending"} className="t2-btn" style={{ width: "100%", justifyContent: "center" }}>
              {status === "sending" ? "Sending…" : status === "success" ? (<><IconCheck /> Sent!</>) : (<><IconSend /> Send Message</>)}
            </button>
          </form>
        </div>
      </div>
      <style jsx>{`
        .t2-contact-grid { margin-top: 40px; display: grid; grid-template-columns: 2fr 3fr; gap: 24px; }
        .t2-contact-info { display: flex; flex-direction: column; gap: 16px; }
        .info-item { display: flex; align-items: center; gap: 16px; padding: 18px; text-decoration: none; }
        .info-item .icon { width: 44px; height: 44px; display: grid; place-items: center; border: 3px solid; border-radius: 8px; flex-shrink: 0; }
        .info-item .lbl { font-size: 10.5px; text-transform: uppercase; letter-spacing: .06em; color: var(--p-muted); }
        .info-item .val { margin-top: 2px; font-size: 13.5px; font-weight: 700; color: var(--p-text); word-break: break-all; }
        .t2-form { padding: 28px; display: flex; flex-direction: column; gap: 18px; }
        .t2-form label { display: flex; align-items: center; gap: 6px; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: var(--p-muted); margin-bottom: 8px; }
        .t2-form input, .t2-form textarea { width: 100%; background: transparent; border: 3px solid rgba(255,255,255,.15); border-radius: 8px; padding: 12px 14px; color: var(--p-text); font-size: 13.5px; outline: none; transition: border-color 0.15s; }
        .t2-form input.on, .t2-form textarea.on { border-color: var(--p-accent); }
        .t2-form input.on.pink { border-color: var(--p-accent-2); }
        .t2-form textarea.on.yellow { border-color: var(--p-accent-3, var(--p-accent-2)); }
        @media (max-width: 860px) { .t2-contact-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

/* ================= Footer ================= */
function T2Footer({ d, c }) {
  const socials = [
    d.github && { href: normalizeUrl(d.github), label: "GitHub", Icon: IconGithub, cv: "--p-accent" },
    d.linkedin && { href: normalizeUrl(d.linkedin), label: "LinkedIn", Icon: IconLinkedin, cv: "--p-accent-2" },
    d.facebook && { href: normalizeUrl(d.facebook), label: "Facebook", Icon: IconFacebook, cv: "--p-accent-3, --p-accent-2" },
    d.email && { href: `mailto:${d.email}`, label: "Email", Icon: IconMail, cv: "--p-accent-3, --p-accent-2" },
  ].filter(Boolean);
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="t2-footer">
      <div className="t2-container">
        <div className="t2-footer-grid">
          <div>
            <button onClick={() => go("home")} className="t2-footer-brand">{d.name || "Your Name"}<span style={{ color: "var(--p-accent)" }}>.</span></button>
            <p className="tag">{c?.tagline || "Building bold, fast, and accessible interfaces."}</p>
            <div className="socials">
              {socials.map(({ href, label, Icon, cv }) => (
                <a key={label} href={href} target={label === "Email" ? undefined : "_blank"} rel="noopener noreferrer" aria-label={label} className="s" style={{ "--hc": `var(${cv})` }}><Icon /></a>
              ))}
            </div>
          </div>
          <div>
            <h4>Navigate</h4>
            <ul>{NAV_LINKS.map((l) => <li key={l.id}><button onClick={() => go(l.id)}>{l.label}</button></li>)}</ul>
          </div>
          <div>
            <h4>Get in touch</h4>
            {d.email && <a href={`mailto:${d.email}`} className="email-link">{d.email}</a>}
            <div className="avail"><span className="dot" />Available</div>
          </div>
        </div>
        <div className="bottom">
          <p>© {new Date().getFullYear()} {d.name || "Your Name"}. All rights reserved.</p>
          <p>Built with Blueprint.</p>
        </div>
      </div>
      <style jsx>{`
        .t2-footer { position: relative; border-top: 3px solid rgba(255,255,255,.1); padding: 56px 0; }
        .t2-footer-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 40px; }
        .t2-footer-brand { background: none; border: none; font-size: 26px; font-weight: 800; color: var(--p-text); cursor: pointer; }
        .t2-footer-grid .tag { margin-top: 12px; max-width: 280px; font-size: 13px; color: var(--p-muted); }
        .socials { margin-top: 18px; display: flex; gap: 10px; }
        .socials .s { width: 40px; height: 40px; display: grid; place-items: center; border: 2px solid rgba(255,255,255,.2); border-radius: 8px; color: var(--p-muted); text-decoration: none; }
        .socials .s:hover { border-color: var(--hc); color: var(--hc); }
        .t2-footer-grid h4 { font-size: 15px; font-weight: 800; color: var(--p-text); margin-bottom: 14px; }
        .t2-footer-grid ul { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .t2-footer-grid ul button { background: none; border: none; font-size: 13px; color: var(--p-muted); cursor: pointer; }
        .t2-footer-grid ul button:hover { color: var(--p-accent); }
        .email-link { font-size: 13px; color: var(--p-muted); text-decoration: none; }
        .email-link:hover { color: var(--p-accent); }
        .avail { margin-top: 14px; display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; color: var(--p-accent); border: 2px solid color-mix(in srgb, var(--p-accent) 40%, transparent); border-radius: 999px; padding: 6px 12px; }
        .avail .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--p-accent); animation: t2pulse 1.6s infinite; }
        .bottom { margin-top: 44px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,.1); display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; font-size: 11.5px; color: var(--p-muted); }
        @media (max-width: 720px) { .t2-footer-grid { grid-template-columns: 1fr; } }
      `}</style>
    </footer>
  );
}

/* ================= BackToTop ================= */
function BackToTop() {
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
        <motion.button initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} whileHover={{ y: -3 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top" className="t2-backtotop">
          <IconArrowUp />
          <style jsx>{`
            .t2-backtotop { position: fixed; bottom: 24px; right: 24px; z-index: 60; width: 48px; height: 48px; display: grid; place-items: center; background: var(--p-accent); color: var(--p-bg); border: 3px solid var(--p-text); border-radius: 8px; box-shadow: 5px 5px 0 0 var(--p-accent-2); cursor: pointer; }
          `}</style>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ================= main export ================= */
export default function TemplateTwo({ data }) {
  const d = data || {};
  const c = data?.content;
  const theme = data?.theme || { primaryColor: "#0A0A0A", accentColor: "#00F5D4", accentColor2: "#F15BB5", accentColor3: "#FEE440", mode: "dark", font: "var(--font-display)" };

  const frameStyle = {
    position: "relative",
    "--p-bg": theme.primaryColor,
    "--p-surface": theme.mode === "dark" ? `color-mix(in srgb, ${theme.primaryColor} 65%, white 8%)` : "#FFFFFF",
    "--p-text": theme.mode === "dark" ? "#FFFFFF" : "#181818",
    "--p-muted": theme.mode === "dark" ? "#B3B3B3" : "#666666",
    "--p-accent": theme.accentColor,
    "--p-accent-2": theme.accentColor2 || theme.accentColor,
    "--p-accent-3": theme.accentColor3 || theme.accentColor2 || theme.accentColor,
    "--p-font": theme.font,
    background: theme.primaryColor,
    color: theme.mode === "dark" ? "#FFFFFF" : "#181818",
    overflow: "hidden",
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
    <div className="portfolio-frame tmpl-minimal" style={frameStyle}>
      <CustomCursor />
      <Background />
      <T2Navbar d={d} showCertificates={d.certificates?.length > 0} />

      <Hero d={d} c={c} />
      <About d={d} c={c} />
      <Skills d={d} c={c} />
      <Projects mergedProjects={mergedProjects} d={d} />
      <Certificates d={d} />
      <Achievements d={d} />
      <TimelineSection d={d} />
      <Contact d={d} />

      <T2Footer d={d} c={c} />
      <BackToTop />

      <style jsx global>{`
        .portfolio-frame.tmpl-minimal .t2-section { position: relative; z-index: 1; padding: 88px 0; }
        .portfolio-frame.tmpl-minimal .t2-container { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
        .portfolio-frame.tmpl-minimal .t2-neo-card { background: var(--p-surface); border: 3px solid var(--p-text); border-radius: 8px; }
        .portfolio-frame.tmpl-minimal .t2-heading { max-width: 640px; }
        .portfolio-frame.tmpl-minimal .t2-eyebrow-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .portfolio-frame.tmpl-minimal .t2-eyebrow-row .idx { font-size: 13px; font-weight: 800; color: var(--p-accent-2); }
        .portfolio-frame.tmpl-minimal .t2-eyebrow-row .line { width: 32px; height: 1px; background: var(--p-accent); }
        .portfolio-frame.tmpl-minimal .t2-eyebrow-row .tag { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--p-muted); }
        .portfolio-frame.tmpl-minimal .t2-h2 { font-size: clamp(30px, 4.6vw, 52px); font-weight: 800; line-height: 1.05; color: var(--p-text); letter-spacing: -0.01em; }
        .portfolio-frame.tmpl-minimal .t2-subtitle { margin-top: 14px; font-size: 14.5px; color: var(--p-muted); max-width: 480px; }
        .portfolio-frame.tmpl-minimal .t2-tag-chip { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--p-muted); border: 2px solid rgba(255,255,255,.15); border-radius: 999px; padding: 4px 12px; }
      `}</style>
    </div>
  );
}