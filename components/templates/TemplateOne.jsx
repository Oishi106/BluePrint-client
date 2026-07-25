"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

function initials(name) {
  return (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function normalizeUrl(url) {
  if (!url) return "";
  return url.match(/^https?:\/\//i) ? url : `https://${url}`;
}

/* Brand mark uses the person's own name as-is: if there's just one
   name, show it (colorful) with nothing added; if there are multiple
   words, the leading words stay plain and only the last word is
   colorful — no separators or fallback suffix are invented. */
function brandParts(name) {
  const words = (name || "Your Name").trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) {
    return { lead: "", highlight: words[0] || "Your Name" };
  }
  return { lead: words.slice(0, -1).join(" ") + " ", highlight: words[words.length - 1] };
}

function resumeHref(d) {
  return normalizeUrl(d.resumeUrl || d.resume || d.cvUrl || "") || "";
}

/* Robust resume download: fetches the file and forces a save-as via a
   blob link. Falls back to opening the file in a new tab if the fetch
   is blocked (e.g. cross-origin host without CORS headers). */
async function downloadResume(url, filename) {
  if (!url) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("fetch failed");
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename || "resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);
  } catch (err) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

function pctFor(skill, i) {
  let seed = i * 17;
  for (let c = 0; c < skill.length; c++) seed += skill.charCodeAt(c);
  return 60 + (seed % 36);
}

/* ---- skill auto-categorizer (FormWizard only collects a flat list) ---- */
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

const CAT_ICONS = {
  Frontend: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 4 3 12l5 8M16 4l5 8-5 8" />
    </svg>
  ),
  Backend: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="7" rx="1.5" /><rect x="3" y="13" width="18" height="7" rx="1.5" />
      <circle cx="7" cy="7.5" r="1" fill="currentColor" stroke="none" /><circle cx="7" cy="16.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  Database: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </svg>
  ),
  Tools: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4L21 6l-3-3-3.3 3.3Z" />
    </svg>
  ),
  Other: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
    </svg>
  ),
};

/* ---- Inline icons ---- */
const IconMail = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
  </svg>
);
const IconGithub = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2-.2 4-1 4-4.5 0-1-.4-2-1-2.7.1-.3.4-1.4-.1-2.8 0 0-.9-.3-3 1a10 10 0 0 0-5.4 0c-2.1-1.3-3-1-3-1-.5 1.4-.2 2.5-.1 2.8-.6.7-1 1.7-1 2.7 0 3.5 2 4.3 4 4.5-.4.4-.5.8-.5 1.5V19" />
  </svg>
);
const IconLinkedin = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7.5 10.5v6M7.5 7.5v.01M12 16.5V13c0-1.5 1-2.5 2.3-2.5s2.2 1 2.2 2.5v3.5" />
  </svg>
);
const IconFacebook = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M15 8h-2a2 2 0 0 0-2 2v2H9v3h2v6h3v-6h2.2l.8-3H14v-1.5c0-.6.3-1 1-1h1.5V8Z" />
  </svg>
);
const IconDownload = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" />
  </svg>
);
const IconSparkles = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2Z" />
  </svg>
);
const IconArrowDown = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 4v16M5 13l7 7 7-7" />
  </svg>
);
const IconArrowUp = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 20V4M5 11l7-7 7 7" />
  </svg>
);
const IconGraduationCap = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M22 10L12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
  </svg>
);
const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const IconAward = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="6" /><path d="M8.7 13.7 7 22l5-3 5 3-1.7-8.3" />
  </svg>
);
const IconHeart = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 21s-7-4.5-9.3-9C1 8.5 2.5 4.5 6.5 4.2 8.8 4 11 5.2 12 7c1-1.8 3.2-3 5.5-2.8 4 .3 5.5 4.3 3.8 7.8-2.3 4.5-9.3 9-9.3 9Z" />
  </svg>
);
const IconExternalLink = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M14 4h6v6M20 4l-9 9M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" />
  </svg>
);
const IconSend = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7Z" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IconMenu = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconCode = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M8 4 3 12l5 8M16 4l5 8-5 8" />
  </svg>
);

/* ---- per-skill icons ---- */
const IconFileCode = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M10 13l-2 2 2 2M14 13l2 2-2 2" />
  </svg>
);
const IconPalette = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2a10 10 0 1 0 0 20c1.4 0 2-1 2-2 0-.6-.3-1-.6-1.3-.3-.4-.6-.8-.6-1.4 0-1 1-2 2-2h2.4A4.2 4.2 0 0 0 22 11 9 9 0 0 0 12 2Z" />
  </svg>
);
const IconBraces = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M8 3a3 3 0 0 0-3 3v3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v3a3 3 0 0 0 3 3M16 3a3 3 0 0 1 3 3v3a2 2 0 0 0 2 2 2 2 0 0 0-2 2v3a3 3 0 0 1-3 3" />
  </svg>
);
const IconAtom = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <ellipse cx="12" cy="12" rx="10" ry="4.2" /><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
  </svg>
);
const IconTriangle = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 3 2 20h20L12 3Z" />
  </svg>
);
const IconServer = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="7" rx="1.5" /><rect x="3" y="13" width="18" height="7" rx="1.5" />
    <circle cx="7" cy="7.5" r="1" fill="currentColor" stroke="none" /><circle cx="7" cy="16.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconNetwork = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="4" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="19" cy="18" r="2" />
    <path d="M12 6v6M12 12 6 16.5M12 12l6 4.5" />
  </svg>
);
const IconGitBranch = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="6" cy="6" r="2.2" /><circle cx="6" cy="18" r="2.2" /><circle cx="18" cy="9" r="2.2" />
    <path d="M6 8.2V15.8M18 11.2V13a4 4 0 0 1-4 4H8" />
  </svg>
);
const IconMonitorPlay = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="4" width="20" height="13" rx="2" /><path d="M9 20h6M12 17v3" /><path d="m10.5 8.5 4 2-4 2Z" fill="currentColor" stroke="none" />
  </svg>
);
const IconFigma = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M8 2h4v6H8a3 3 0 1 1 0-6ZM8 8h4v6H8a3 3 0 1 1 0-6ZM12 2h3.5a3 3 0 1 1 0 6H12V2ZM8 14h4v6a3 3 0 1 1-4-2.8V14Z" />
    <circle cx="15" cy="17" r="3" />
  </svg>
);

const SKILL_ICON_MAP = [
  { match: /^html$/i, Icon: IconFileCode },
  { match: /^css$/i, Icon: IconPalette },
  { match: /tailwind/i, Icon: IconCode },
  { match: /javascript|^js$/i, Icon: IconBraces },
  { match: /^react$/i, Icon: IconAtom },
  { match: /next\.?js/i, Icon: IconTriangle },
  { match: /^node/i, Icon: IconServer },
  { match: /express/i, Icon: IconNetwork },
  { match: /mongo/i, Icon: CAT_ICONS.Database },
  { match: /^git$/i, Icon: IconGitBranch },
  { match: /github/i, Icon: IconGithub },
  { match: /vs\s?code/i, Icon: IconMonitorPlay },
  { match: /figma/i, Icon: IconFigma },
  { match: /postman/i, Icon: IconSend },
];

function getSkillIcon(name, categoryLabel) {
  const found = SKILL_ICON_MAP.find((m) => m.match.test(name));
  if (found) return found.Icon;
  return CAT_ICONS[categoryLabel] || CAT_ICONS.Other;
}

/* ---- shared social icon button (hover driven by React state, not CSS,
   so Hero and Footer always look and behave identically) ---- */
function SocialLink({ href, label, Icon, size = 38 }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target={label === "Email" ? undefined : "_blank"}
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "50%",
        border: `1px solid ${hover ? "var(--p-accent)" : "rgba(255,255,255,.12)"}`,
        color: hover ? "var(--p-text)" : "var(--p-muted)",
        textDecoration: "none",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.2s ease",
      }}
    >
      <Icon />
    </a>
  );
}

/* ---- typed-role hook (Hero) ---- */
function useTypedRole(words) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) return;
    const current = words[index % words.length];
    const speed = deleting ? 40 : 80;
    const timeout = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) setTimeout(() => setDeleting(true), 1300);
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setIndex((i) => (i + 1) % words.length);
        }
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, index, words]);

  return { text, index: words.length ? index % words.length : 0 };
}

/* ================= Navbar ================= */

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

function T1Navbar({ d, showCertificates }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  const links = showCertificates
    ? [...NAV_LINKS.slice(0, 4), { href: "#certificates", label: "Certificates" }, NAV_LINKS[4]]
    : NAV_LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCertificates]);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`t1nav ${scrolled ? "scrolled" : ""}`}
    >
      <nav className="t1nav-inner">
        <a href="#home" className="t1nav-brand">
          <span className="t1nav-mark"><IconCode /></span>
          <span>{brandParts(d.name).lead}<span className="grad">{brandParts(d.name).highlight}</span></span>
        </a>

        <ul className="t1nav-links">
          {links.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <li key={l.href}>
                <a href={l.href} className={isActive ? "active" : ""}>
                  {l.label}
                  {isActive && <motion.span layoutId="t1-nav-active" className="t1nav-underline" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                </a>
              </li>
            );
          })}
        </ul>

        {resumeHref(d) ? (
          <a
            href={resumeHref(d)}
            onClick={(e) => { e.preventDefault(); downloadResume(resumeHref(d), `${(d.name || "resume").replace(/\s+/g, "-")}-resume.pdf`); }}
            className="t1nav-cta"
          >
            <IconDownload /> Resume
          </a>
        ) : (
          <a href="#contact" className="t1nav-cta">
            <IconDownload /> Resume
          </a>
        )}

        <button type="button" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)} className="t1nav-burger">
          {open ? <IconX /> : <IconMenu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="t1nav-mobile">
            <ul>
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)} className={active === l.href.slice(1) ? "active" : ""}>
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                {resumeHref(d) ? (
                  <a
                    href={resumeHref(d)}
                    onClick={(e) => { e.preventDefault(); setOpen(false); downloadResume(resumeHref(d), `${(d.name || "resume").replace(/\s+/g, "-")}-resume.pdf`); }}
                    className="t1nav-cta full"
                  >
                    <IconDownload /> Resume
                  </a>
                ) : (
                  <a href="#contact" onClick={() => setOpen(false)} className="t1nav-cta full">
                    <IconDownload /> Resume
                  </a>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .t1nav { position: sticky; top: 0; z-index: 20; width: 100%; background: transparent; transition: all 0.3s ease; }
        .t1nav.scrolled { background: color-mix(in srgb, var(--p-bg) 82%, transparent); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,.08); }
        .t1nav-inner { display: flex; align-items: center; justify-content: space-between; padding: 16px 40px; gap: 20px; }
        .t1nav-brand { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 16px; text-decoration: none; color: var(--p-text); }
        .t1nav-mark { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); color: var(--p-bg); }
        .grad { background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .t1nav-links { display: none; align-items: center; gap: 4px; list-style: none; }
        .t1nav-links a { position: relative; display: block; padding: 8px 12px; font-size: 13.5px; color: var(--p-muted); text-decoration: none; transition: color 0.15s; }
        .t1nav-links a:hover, .t1nav-links a.active { color: var(--p-text); }
        .t1nav-underline { position: absolute; left: 10px; right: 10px; bottom: 2px; height: 2px; border-radius: 2px; background: linear-gradient(90deg, var(--p-accent), var(--p-accent-2)); }
        .t1nav-cta { display: none; align-items: center; gap: 8px; padding: 9px 18px; border-radius: 999px; background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); color: var(--p-bg); text-decoration: none; font-size: 13px; font-weight: 600; transition: transform 0.2s; }
        .t1nav-cta:hover { transform: translateY(-2px); }
        .t1nav-burger { background: none; border: none; color: var(--p-text); padding: 4px; }
        .t1nav-mobile { overflow: hidden; background: color-mix(in srgb, var(--p-bg) 92%, transparent); backdrop-filter: blur(10px); border-top: 1px solid rgba(255,255,255,.08); }
        .t1nav-mobile ul { list-style: none; display: flex; flex-direction: column; gap: 2px; padding: 14px 20px; }
        .t1nav-mobile a { display: block; padding: 10px 12px; border-radius: 8px; color: var(--p-muted); text-decoration: none; font-size: 14px; }
        .t1nav-mobile a.active { background: rgba(255,255,255,.06); color: var(--p-text); }
        .t1nav-cta.full { display: flex; justify-content: center; margin-top: 8px; color: var(--p-bg); }
        @media (min-width: 860px) { .t1nav-links, .t1nav-cta { display: flex; } .t1nav-burger { display: none; } }
      `}</style>
    </motion.header>
  );
}

/* ================= Footer ================= */

function T1Footer({ d, c }) {
  const scrollTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socials = [
    d.github && { href: normalizeUrl(d.github), label: "GitHub", Icon: IconGithub },
    d.linkedin && { href: normalizeUrl(d.linkedin), label: "LinkedIn", Icon: IconLinkedin },
    d.facebook && { href: normalizeUrl(d.facebook), label: "Facebook", Icon: IconFacebook },
    d.email && { href: `mailto:${d.email}`, label: "Email", Icon: IconMail },
  ].filter(Boolean);

  return (
    <footer className="t1foot">
      <div className="t1foot-inner">
        <div className="t1foot-grid">
          <div>
            <a href="#home" className="t1foot-brand">
              <span className="t1foot-mark"><IconCode /></span>
              {brandParts(d.name).lead}<span className="grad">{brandParts(d.name).highlight}</span>
            </a>
            <p className="t1foot-tag">{c?.tagline || "Full-stack developer crafting fast, elegant web experiences."}</p>
          </div>

          <nav>
            <h4>Navigate</h4>
            <ul className="t1foot-nav-list">
              {NAV_LINKS.map((l) => (
                <li key={l.href}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </nav>

          <div>
            <h4>Elsewhere</h4>
            <div style={{ display: "flex", gap: 8, listStyle: "none", padding: 0 }}>
              {socials.map(({ href, label, Icon }) => (
                <SocialLink key={label} href={href} label={label} Icon={Icon} size={34} />
              ))}
            </div>
          </div>
        </div>

        <div className="t1foot-bottom">
          <p>© {new Date().getFullYear()} Blueprint. All rights reserved.</p>
          <p>Built with React, Tailwind CSS &amp; Motion.</p>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={scrollTop}
        aria-label="Back to top"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        whileHover={{ scale: 1.12, y: -3 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="t1foot-top-btn"
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          zIndex: 5,
          width: 46,
          height: 46,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          cursor: "pointer",
          background: "linear-gradient(135deg, var(--p-accent), var(--p-accent-2))",
          color: "var(--p-bg)",
          boxShadow: "0 10px 30px -10px rgba(0,0,0,.45)",
        }}
      >
        <IconArrowUp />
      </motion.button>

      <style jsx>{`
        .t1foot { position: relative; margin-top: 30px; border-top: 1px solid rgba(255,255,255,.08); }
        .t1foot-inner { max-width: 1180px; margin: 0 auto; padding: 48px 40px 30px; }
        .t1foot-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 32px; }
        .t1foot-brand { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 16px; text-decoration: none; color: var(--p-text); }
        .t1foot-mark { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); color: var(--p-bg); }
        .grad { background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .t1foot-tag { color: var(--p-muted); font-size: 13px; margin-top: 10px; max-width: 280px; line-height: 1.6; }
        .t1foot-grid h4 { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--p-muted); margin-bottom: 12px; }
        .t1foot-nav-list { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .t1foot-nav-list a { color: var(--p-muted); text-decoration: none; font-size: 13px; transition: color 0.15s; }
        .t1foot-nav-list a:hover { color: var(--p-text); }
        .t1foot-bottom { margin-top: 36px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,.08); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-size: 11.5px; color: var(--p-muted); }
        .t1foot-top-btn { position: fixed; bottom: 24px; right: 24px; z-index: 30; width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); color: var(--p-bg); box-shadow: 0 10px 30px -10px color-mix(in srgb, var(--p-accent) 60%, transparent); }
        .t1foot-top-btn:hover { box-shadow: 0 14px 36px -8px color-mix(in srgb, var(--p-accent) 70%, transparent); }
        @media (max-width: 720px) { .t1foot-grid { grid-template-columns: 1fr; } }
      `}</style>
    </footer>
  );
}

/* ================= sections ================= */

function Hero({ d, c }) {
  const roleItems = [
    { label: d.role, prefix: "I\u2019m a" },
    ...d.skills.slice(0, 3).map((s) => ({ label: s, prefix: "I build with" })),
  ].filter((r) => r.label);
  const safeItems = roleItems.length ? roleItems : [{ label: "Developer", prefix: "I\u2019m a" }];
  const { text: typed, index: typedIndex } = useTypedRole(safeItems.map((r) => r.label));
  const typedPrefix = safeItems[typedIndex]?.prefix || "I\u2019m a";

  const socials = [
    d.github && { href: normalizeUrl(d.github), label: "GitHub", Icon: IconGithub },
    d.linkedin && { href: normalizeUrl(d.linkedin), label: "LinkedIn", Icon: IconLinkedin },
    d.facebook && { href: normalizeUrl(d.facebook), label: "Facebook", Icon: IconFacebook },
    d.email && { href: `mailto:${d.email}`, label: "Email", Icon: IconMail },
  ].filter(Boolean);

  return (
    <div className="p-section alexdev-hero-section" id="home">
      <div className="alexdev-hero">
        <div className="alexdev-hero-glow a" />
        <div className="alexdev-hero-glow b" />
        <div className="alexdev-hero-grid">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="alexdev-glass alexdev-badge">
              <IconSparkles /> Available for freelance &amp; full-time roles
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }} className="alexdev-h1">
              Hi, I&rsquo;m <span className="alexdev-gradient-text">{d.name || "Your Name"}</span>
              <br />
              <span className="alexdev-muted-line">I build the web,</span>
              <br />
              beautifully.
            </motion.h1>

            {/* typed role — a short standalone line, NOT concatenated with heroText (avoids duplicate intro) */}
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }} className="alexdev-typed-line">
              {typedPrefix}{" "}
              <span className="alexdev-typed">
                {typed}
                <span className="alexdev-caret" />
              </span>
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.18 }} className="alexdev-lead">
              {c?.heroText || d.bio}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }} className="alexdev-cta-row">
              <a href="#contact" className="alexdev-btn primary">Hire Me</a>
              {resumeHref(d) ? (
                <a
                  href={resumeHref(d)}
                  onClick={(e) => { e.preventDefault(); downloadResume(resumeHref(d), `${(d.name || "resume").replace(/\s+/g, "-")}-resume.pdf`); }}
                  className="alexdev-btn glass"
                >
                  <IconDownload /> My Resume
                </a>
              ) : (
                <a href="#contact" className="alexdev-btn glass"><IconDownload /> My Resume</a>
              )}
            </motion.div>

            {socials.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 26,
                  listStyle: "none",
                  padding: 0,
                }}
              >
                {socials.map(({ href, label, Icon }) => (
                  <SocialLink key={label} href={href} label={label} Icon={Icon} size={38} />
                ))}
              </motion.div>
            )}
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="alexdev-portrait-wrap">
            <div className="alexdev-portrait-glow" />
            <div className="alexdev-portrait-card">
              {d.photoUrl ? <img src={d.photoUrl} alt={d.name || "Portrait"} /> : <div className="alexdev-portrait-empty">{initials(d.name)}</div>}
            </div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="alexdev-glass alexdev-float-badge bl">
              <div className="fb-label">Currently</div>
              <div className="fb-value">Building something new ✨</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="alexdev-glass alexdev-float-badge tr">
              <div className="fb-label">Response time</div>
              <div className="fb-value">&lt; 24 hours</div>
            </motion.div>
          </motion.div>
        </div>

        <motion.a href="#about" aria-label="Scroll to about" initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 8, 0] }} transition={{ opacity: { delay: 1 }, y: { duration: 2, repeat: Infinity } }} className="alexdev-scroll-hint">
          <IconArrowDown />
        </motion.a>
      </div>

      <style jsx>{`
        .alexdev-typed-line { font-size: 15px; color: var(--p-text); margin-top: 20px; }
      `}</style>
    </div>
  );
}

function About({ d, c }) {
   const stats = [
    { label: "Projects Shipped", value: `${d.projects.length}+` },
    d.stats?.years && { label: "Years Experience", value: d.stats.years },
    { label: "Technologies", value: `${d.skills.length}+` },
    d.stats?.satisfaction && { label: "Client Satisfaction", value: d.stats.satisfaction },
  ].filter(Boolean);

  const timeline = [
    ...d.education.map((ed) => ({ icon: IconGraduationCap, title: ed.degree || "Degree", org: ed.institution || "Institution", period: ed.year || "" })),
    ...(d.internships || []).map((it) => ({ icon: IconBriefcase, title: it.role || "Internship", org: it.company || "Company", period: it.duration || "", desc: it.description })),
  ];

  const interests = d.skills.slice(0, 6);

  return (
    <div className="p-section" id="about">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} className="alexdev-section-intro">
        <p className="alexdev-eyebrow">About</p>
        <h2 className="alexdev-h2">A developer who cares about <span className="alexdev-gradient-text">craft</span>.</h2>
        <p className="alexdev-body">{c?.aboutMe || d.bio}</p>
      </motion.div>

      <motion.ul initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} className="alexdev-stats-grid">
        {stats.map((s) => (
          <motion.li key={s.label} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} className="alexdev-glass alexdev-stat-card">
            <div className="alexdev-stat-value alexdev-gradient-text">{s.value}</div>
            <div className="alexdev-stat-label">{s.label}</div>
          </motion.li>
        ))}
      </motion.ul>

      <div className="alexdev-about-cols">
        <div>
          <h3 className="alexdev-h3">Experience &amp; Education</h3>
          {timeline.length ? (
            <ol className="alexdev-timeline">
              {timeline.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.li key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                    <span className="alexdev-timeline-dot"><Icon /></span>
                    <div className="alexdev-glass alexdev-timeline-card">
                      <div className="alexdev-timeline-head">
                        <h4>{item.title}</h4>
                        <span>{item.period}</span>
                      </div>
                      <p className="alexdev-timeline-org">{item.org}</p>
                      {item.desc && <p style={{ fontSize: 12.5, color: "var(--p-muted)", marginTop: 6 }}>{item.desc}</p>}
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          ) : (
            <p style={{ color: "var(--p-muted)", fontSize: 13 }}>No education or internships added yet.</p>
          )}
        </div>

        {interests.length > 0 && (
          <motion.aside initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} className="alexdev-glass alexdev-interests">
            <h3><IconHeart /> Focus areas</h3>
            <p>The skills I reach for most often.</p>
            <ul>{interests.map((i) => (<li key={i}>{i}</li>))}</ul>

            {d.achievements?.length > 0 && (
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px dashed rgba(255,255,255,.1)" }}>
                <h3 style={{ marginBottom: 12 }}><IconAward /> Achievements</h3>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {d.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: 12.5 }}>
                      <div style={{ fontWeight: 600, color: "var(--p-text)" }}>{a.title} {a.year && <span style={{ color: "var(--p-muted)", fontWeight: 400 }}>· {a.year}</span>}</div>
                      {a.description && <div style={{ color: "var(--p-muted)", marginTop: 2 }}>{a.description}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.aside>
        )}
      </div>

      <style jsx>{`
        .alexdev-stat-card { transition: transform 0.2s ease; }
        .alexdev-stat-card:hover { transform: translateY(-4px); }
        .alexdev-timeline-card { transition: border-color 0.2s ease; }
        .alexdev-timeline-card:hover { border-color: var(--p-accent) !important; }
        .alexdev-interests li { transition: all 0.2s ease; cursor: default; }
        .alexdev-interests li:hover { border-color: var(--p-accent); color: var(--p-accent); transform: translateY(-2px); }
      `}</style>
    </div>
  );
}

function Skills({ d, c }) {
  const groups = categorizeSkills(d.skills);

  return (
    <div className="p-section" id="skills">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} className="alexdev-section-intro">
        <p className="alexdev-eyebrow">Skills</p>
        <h2 className="alexdev-h2">Tools I use to <span className="alexdev-gradient-text">ship</span>.</h2>
        <p className="alexdev-body">{c?.skillsDescription}</p>
      </motion.div>

      <div
        className="t1skills-groups"
        style={{ display: "grid", gridTemplateColumns: groups.length > 1 ? "1fr 1fr" : "1fr", gap: 20, marginTop: 40 }}
      >
        {groups.map((group, gi) => {
          const CatIcon = CAT_ICONS[group.label] || CAT_ICONS.Other;
          return (
            <motion.div key={group.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: gi * 0.1 }} className="alexdev-glass t1skill-group">
              <div className="t1skill-group-glow" />
              <h3 className="t1skill-group-title" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <span className="t1skill-group-icon" style={{ width: 30, height: 30, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, var(--p-accent), var(--p-accent-2))", color: "var(--p-bg)", flexShrink: 0 }}>
                  <CatIcon />
                </span>
                <span>{group.label}</span>
                <span className="t1skill-group-count" style={{ marginLeft: "auto", fontSize: 11, fontWeight: 500, color: "var(--p-muted)", background: "rgba(255,255,255,.06)", borderRadius: 999, padding: "2px 9px" }}>
                  {group.skills.length}
                </span>
              </h3>
              <div
                className="t1skills-grid"
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}
              >
                {group.skills.map((s, i) => {
                  const pct = pctFor(s, i);
                  const SkillIcon = getSkillIcon(s, group.label);
                  return (
                    <motion.div
                      key={s}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                      whileHover={{ y: -4 }}
                      className="t1skill-card"
                      style={{ padding: "13px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,.08)", background: "color-mix(in srgb, var(--p-surface) 55%, transparent)", cursor: "default" }}
                    >
                      <div className="t1skill-top" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 500, color: "var(--p-text)", marginBottom: 10 }}>
                        <span className="t1skill-icon" style={{ width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", background: "color-mix(in srgb, var(--p-accent) 15%, transparent)", color: "var(--p-accent)", flexShrink: 0 }}>
                          <SkillIcon />
                        </span>
                        <span className="t1skill-name" style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s}</span>
                        <span className="t1skill-pct-badge" style={{ fontSize: 10.5, fontWeight: 600, color: "var(--p-accent)" }}>{pct}%</span>
                      </div>
                      <div className="alexdev-skill-track" style={{ height: 5, borderRadius: 999, background: "rgba(255,255,255,.08)", overflow: "hidden" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.1 + i * 0.04, ease: "easeOut" }}
                          className="alexdev-skill-fill"
                          style={{ height: "100%", borderRadius: 999, background: "linear-gradient(90deg, var(--p-accent), var(--p-accent-2))" }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
        {!groups.length && <p style={{ color: "var(--p-muted)", fontSize: 13 }}>No skills added yet.</p>}
      </div>

      <style jsx>{`
        .t1skills-groups { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 40px; }
        .t1skill-group { position: relative; padding: 24px; overflow: hidden; transition: border-color 0.25s ease, transform 0.25s ease; }
        .t1skill-group:hover { border-color: var(--p-accent); transform: translateY(-3px); }
        .t1skill-group-glow { position: absolute; top: -60px; right: -60px; width: 160px; height: 160px; border-radius: 50%; background: radial-gradient(circle, color-mix(in srgb, var(--p-accent) 30%, transparent), transparent 70%); pointer-events: none; }
        .t1skill-group-title { position: relative; display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; letter-spacing: .02em; color: var(--p-text); margin-bottom: 18px; }
        .t1skill-group-icon { width: 30px; height: 30px; border-radius: 9px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--p-accent), var(--p-accent-2)); color: var(--p-bg); flex-shrink: 0; }
        .t1skill-group-count { margin-left: auto; font-size: 11px; font-weight: 500; color: var(--p-muted); background: rgba(255,255,255,.06); border-radius: 999px; padding: 2px 9px; }
        .t1skills-grid { position: relative; list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }
        .t1skill-card { padding: 13px 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,.08); background: color-mix(in srgb, var(--p-surface) 55%, transparent); transition: border-color 0.2s ease, box-shadow 0.2s ease; cursor: default; }
        .t1skill-card:hover { border-color: var(--p-accent); box-shadow: 0 10px 24px -14px color-mix(in srgb, var(--p-accent) 60%, transparent); }
        .t1skill-top { display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 500; color: var(--p-text); margin-bottom: 10px; }
        .t1skill-icon { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; background: color-mix(in srgb, var(--p-accent) 15%, transparent); color: var(--p-accent); flex-shrink: 0; transition: transform 0.2s ease; }
        .t1skill-card:hover .t1skill-icon { transform: scale(1.12) rotate(-4deg); }
        .t1skill-name { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .t1skill-pct-badge { font-size: 10.5px; font-weight: 600; color: var(--p-accent); }
        .alexdev-skill-track { height: 5px; border-radius: 999px; background: rgba(255,255,255,.08); overflow: hidden; }
        .alexdev-skill-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--p-accent), var(--p-accent-2)); }
        @media (max-width: 720px) { .t1skills-groups { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function Projects({ mergedProjects, d }) {
  return (
    <div className="p-section" id="projects">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} className="alexdev-projects-head">
        <div>
          <p className="alexdev-eyebrow">Projects</p>
          <h2 className="alexdev-h2">Selected <span className="alexdev-gradient-text">work</span>.</h2>
        </div>
        {d.github && (
          <a href={normalizeUrl(d.github)} target="_blank" rel="noopener noreferrer" className="alexdev-btn glass small">
            <IconGithub /> View all on GitHub
          </a>
        )}
      </motion.div>
      <ul
        className="alexdev-projects-grid t1projects-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        {mergedProjects.length ? mergedProjects.map((p, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            style={{ transition: "box-shadow 0.25s ease", width: "100%" }}
            className="alexdev-glass alexdev-proj-card"
          >
            <motion.div
              className={`alexdev-proj-media ${!p.image ? "empty" : ""}`}
              style={{
                ...(p.image ? { backgroundImage: `url(${p.image})`, backgroundSize: "cover", backgroundPosition: "center" } : {}),
                height: 190,
                width: "100%",
              }}
              whileHover={p.image ? { scale: 1.06 } : undefined}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {!p.image && <span>{initials(p.title)}</span>}
            </motion.div>
            <div className="alexdev-proj-body">
              <h4>{p.title}</h4>
              <p>{p.description}</p>
              {p.techStack?.length > 0 && (
                <ul className="alexdev-proj-chips">{p.techStack.map((t, ti) => <li key={ti}>{t}</li>)}</ul>
              )}
              <div className="alexdev-proj-actions">
                {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="alexdev-btn primary small"><IconExternalLink /> Live Demo</a>}
                {d.github && <a href={normalizeUrl(d.github)} target="_blank" rel="noopener noreferrer" className="alexdev-btn glass small"><IconGithub /> GitHub</a>}
              </div>
            </div>
          </motion.li>
        )) : <p style={{ color: "var(--p-muted)", fontSize: 13 }}>No projects yet.</p>}
      </ul>

      <style jsx>{`
        @media (max-width: 980px) { .t1projects-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) { .t1projects-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function Certificates({ d }) {
  if (!d.certificates?.length) return null;
  return (
    <div className="p-section" id="certificates">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} className="alexdev-section-intro">
        <p className="alexdev-eyebrow">Certificates</p>
        <h2 className="alexdev-h2">Credentials &amp; <span className="alexdev-gradient-text">courses</span>.</h2>
      </motion.div>
      <ul
        className="alexdev-projects-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 360px))",
          justifyContent: "start",
          gap: 20,
        }}
      >
        {d.certificates.map((cert, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            style={{ transition: "box-shadow 0.25s ease", width: "100%", maxWidth: 360 }}
            className="alexdev-glass alexdev-proj-card"
          >
            <motion.div
              className={`alexdev-proj-media ${!cert.image ? "empty" : ""}`}
              style={{
                ...(cert.image ? { backgroundImage: `url(${cert.image})`, backgroundSize: "cover", backgroundPosition: "center" } : {}),
                height: 190,
                width: "100%",
              }}
              whileHover={cert.image ? { scale: 1.06 } : undefined}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {!cert.image && <span><IconAward /></span>}
            </motion.div>
            <div className="alexdev-proj-body">
              <h4>{cert.title}</h4>
              <p>{cert.issuer}{cert.year ? ` · ${cert.year}` : ""}</p>
              {cert.link && (
                <div className="alexdev-proj-actions">
                  <a href={normalizeUrl(cert.link)} target="_blank" rel="noopener noreferrer" className="alexdev-btn glass small">
                    <IconExternalLink /> View credential
                  </a>
                </div>
              )}
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function Contact({ d }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      e.target.reset();
      setTimeout(() => setSent(false), 3500);
    }, 900);
  }

  const info = [
    d.email && { Icon: IconMail, label: "Email", value: d.email, href: `mailto:${d.email}` },
    d.github && { Icon: IconGithub, label: "GitHub", value: d.github, href: normalizeUrl(d.github) },
    d.linkedin && { Icon: IconLinkedin, label: "LinkedIn", value: d.linkedin, href: normalizeUrl(d.linkedin) },
  ].filter(Boolean);

  return (
    <div className="p-section" id="contact">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} className="alexdev-section-intro">
        <p className="alexdev-eyebrow">Contact</p>
        <h2 className="alexdev-h2">Let&rsquo;s build something <span className="alexdev-gradient-text">great</span>.</h2>
      </motion.div>
      <div className="alexdev-contact-grid">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }} className="alexdev-glass alexdev-contact-info">
          <h3>Get in touch</h3>
          <p>Prefer email? Any of these channels work — I usually reply within a day.</p>
          <ul>
            {info.map(({ Icon, label, value, href }) => (
              <li key={label}>
                <a href={href} target={label === "Email" ? undefined : "_blank"} rel="noopener noreferrer">
                  <span className="alexdev-contact-icon"><Icon /></span>
                  <div>
                    <div className="ci-label">{label}</div>
                    <div className="ci-value">{value}</div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.form onSubmit={onSubmit} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.1 }} className="alexdev-glass alexdev-contact-form">
          <div className="alexdev-form-row">
            <div className="alexdev-field"><label>Name</label><input type="text" placeholder="Your full name" required /></div>
            <div className="alexdev-field"><label>Email</label><input type="email" placeholder="you@email.com" required /></div>
          </div>
          <div className="alexdev-field"><label>Subject</label><input type="text" placeholder="What's this about?" required /></div>
          <div className="alexdev-field"><label>Message</label><textarea rows={5} placeholder="Tell me a little about your project..." required /></div>
          <button type="submit" disabled={loading || sent} className="alexdev-btn primary">
            {loading ? "Sending..." : sent ? (<><IconCheck /> Sent</>) : (<><IconSend /> Send Message</>)}
          </button>
          <AnimatePresence>
            {sent && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="alexdev-sent-note">
                <IconCheck /> Thanks — your message has been sent.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </div>
  );
}

/* ================= main export ================= */
export default function TemplateOne({ data }) {
  const d = data || {};
  const c = data?.content;
  const theme = data?.theme || { primaryColor: "#17151F", accentColor: "#A78BFA", accentColor2: "#4FD1C5", mode: "dark", font: "var(--font-display)" };

  const frameStyle = {
    position: "relative",
    "--p-bg": theme.primaryColor,
    "--p-surface": theme.mode === "dark" ? `color-mix(in srgb, ${theme.primaryColor} 80%, white 8%)` : "#FFFFFF",
    "--p-text": theme.mode === "dark" ? "#EAF2FB" : "#241F16",
    "--p-muted": theme.mode === "dark" ? "#8CA3C2" : "#8B8270",
    "--p-accent": theme.accentColor,
    "--p-accent-2": theme.accentColor2 || theme.accentColor,
    "--p-font": theme.font,
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
    <div className="portfolio-frame tmpl-developer" style={frameStyle}>
      <T1Navbar d={d} showCertificates={d.certificates?.length > 0} />

      <Hero d={d} c={c} />
      <About d={d} c={c} />
      <Skills d={d} c={c} />
      <Projects mergedProjects={mergedProjects} d={d} />
      <Certificates d={d} />
      <Contact d={d} />

      <T1Footer d={d} c={c} />
    </div>
  );
}