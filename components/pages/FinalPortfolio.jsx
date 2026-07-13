"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { usePortfolioState, usePortfolioDispatch } from "@/context/PortfolioContext";
import { TEMPLATES } from "@/lib/templates";
import { generateLayoutFromPrompt } from "@/lib/mockAI";
import { publishPortfolio } from "@/lib/api";
import BackButton from "@/components/BackButton";

function initials(name) {
  return (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function slugify(name) {
  return (
    (name || "draft")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "draft"
  );
}

function pctFor(skill, i) {
  let seed = i * 17;
  for (let c = 0; c < skill.length; c++) seed += skill.charCodeAt(c);
  return 60 + (seed % 36);
}

function normalizeUrl(url) {
  if (!url) return "";
  return url.match(/^https?:\/\//i) ? url : `https://${url}`;
}

const DEFAULT_ORDER = ["hero", "about", "skills", "projects", "contact"];

function Photo({ d, className }) {
  return (
    <div className={`hero-photo-circle ${className || ""}`}>
      {d.photoUrl ? <img src={d.photoUrl} alt={d.name || "Profile photo"} /> : initials(d.name)}
    </div>
  );
}

function SocialRow({ d, light }) {
  if (!d.github && !d.linkedin && !d.email) return null;
  return (
    <div className={`hero-social-row ${light ? "light" : ""}`}>
      {d.github && <span className="hero-social-badge">GH</span>}
      {d.linkedin && <span className="hero-social-badge">in</span>}
      {d.email && <span className="hero-social-badge">@</span>}
    </div>
  );
}

/* ---- Inline icon set (no external icon package installed) ---- */
const IconMail = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);
const IconGithub = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2-.2 4-1 4-4.5 0-1-.4-2-1-2.7.1-.3.4-1.4-.1-2.8 0 0-.9-.3-3 1a10 10 0 0 0-5.4 0c-2.1-1.3-3-1-3-1-.5 1.4-.2 2.5-.1 2.8-.6.7-1 1.7-1 2.7 0 3.5 2 4.3 4 4.5-.4.4-.5.8-.5 1.5V19" />
  </svg>
);
const IconLinkedin = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M7.5 10.5v6M7.5 7.5v.01M12 16.5V13c0-1.5 1-2.5 2.3-2.5s2.2 1 2.2 2.5v3.5" />
  </svg>
);
const IconFacebook = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M15 8h-2a2 2 0 0 0-2 2v2H9v3h2v6h3v-6h2.2l.8-3H14v-1.5c0-.6.3-1 1-1h1.5V8Z" />
  </svg>
);
const IconMonitor = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4" />
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="7" y="2" width="10" height="20" rx="2" />
    <path d="M11 18h2" />
  </svg>
);
const IconCloud = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M7 18a4 4 0 0 1-.5-7.97A5 5 0 0 1 16 8a4.5 4.5 0 0 1 1 8.9" />
  </svg>
);
const SERVICE_ICONS = [IconMonitor, IconPhone, IconCloud];

const IconArrowDown = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 4v16M5 13l7 7 7-7" />
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
const IconGraduationCap = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M22 10L12 5 2 10l10 5 10-5Z" />
    <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
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

function FooterSocials({ d }) {
  const items = [
    d.email && { icon: <IconMail />, href: `mailto:${d.email}`, label: "Email" },
    d.github && { icon: <IconGithub />, href: normalizeUrl(d.github), label: "GitHub" },
    d.linkedin && { icon: <IconLinkedin />, href: normalizeUrl(d.linkedin), label: "LinkedIn" },
    d.facebook && { icon: <IconFacebook />, href: normalizeUrl(d.facebook), label: "Facebook" },
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <div className="p-footer-socials">
      {items.map((it, i) => (
        <a  
          key={i}
          href={it.href}
          target={it.label === "Email" ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={it.label}
          className="p-social-icon"
        >
          {it.icon}
        </a>
      ))}
    </div>
  );
}

function GlassContactForm() {
  const [sent, setSent] = useState(false);
  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  }
  return (
    <form className="glass-contact-form" onSubmit={handleSubmit}>
      <div className="gcf-field">
        <label>Name</label>
        <input type="text" placeholder="Your name" required />
      </div>
      <div className="gcf-field">
        <label>Email</label>
        <input type="email" placeholder="you@example.com" required />
      </div>
      <div className="gcf-field">
        <label>Message</label>
        <textarea placeholder="Tell me about your project" rows={3} required />
      </div>
      <button type="submit" className="hero-btn primary">
        {sent ? "Sent ✓" : "Submit"}
      </button>
    </form>
  );
}

/* ================= AlexDev flavor (Developer / Terminal Green) ================= */

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

  return text;
}

function AlexDevHero({ d, c }) {
  const roles = [d.role, ...d.skills.slice(0, 3)].filter(Boolean);
  const typed = useTypedRole(roles.length ? roles : ["Developer"]);

  const socials = [
    d.github && { href: normalizeUrl(d.github), label: "GitHub", Icon: IconGithub },
    d.linkedin && { href: normalizeUrl(d.linkedin), label: "LinkedIn", Icon: IconLinkedin },
    d.facebook && { href: normalizeUrl(d.facebook), label: "Facebook", Icon: IconFacebook },
    d.email && { href: `mailto:${d.email}`, label: "Email", Icon: IconMail },
  ].filter(Boolean);

  return (
    <div className="alexdev-hero">
      <div className="alexdev-hero-glow a" />
      <div className="alexdev-hero-glow b" />
      <div className="alexdev-hero-grid">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="alexdev-glass alexdev-badge"
          >
            <IconSparkles /> Available for freelance &amp; full-time roles
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
            className="alexdev-h1"
          >
            Hi, I&rsquo;m <span className="alexdev-gradient-text">{d.name || "Your Name"}</span>
            <br />
            <span className="alexdev-muted-line">I build the web,</span>
            <br />
            beautifully.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            className="alexdev-lead"
          >
            I&rsquo;m a{" "}
            <span className="alexdev-typed">
              {typed}
              <span className="alexdev-caret" />
            </span>{" "}
            {c.heroText}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
            className="alexdev-cta-row"
          >
            <a href="#p-contact" className="alexdev-btn primary">Hire Me</a>
            <a href="#p-about" className="alexdev-btn glass"><IconDownload /> My Resume</a>
          </motion.div>

          {socials.length > 0 && (
            <motion.ul
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.35 }}
              className="alexdev-social-row"
            >
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a href={href} target={label === "Email" ? undefined : "_blank"} rel="noopener noreferrer" aria-label={label} className="alexdev-social-btn">
                    <Icon />
                  </a>
                </li>
              ))}
            </motion.ul>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="alexdev-portrait-wrap"
        >
          <div className="alexdev-portrait-glow" />
          <div className="alexdev-portrait-card">
            {d.photoUrl ? (
              <img src={d.photoUrl} alt={d.name || "Portrait"} />
            ) : (
              <div className="alexdev-portrait-empty">{initials(d.name)}</div>
            )}
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

      <motion.a
        href="#p-about" aria-label="Scroll to about"
        initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1 }, y: { duration: 2, repeat: Infinity } }}
        className="alexdev-scroll-hint"
      >
        <IconArrowDown />
      </motion.a>
    </div>
  );
}

function AlexDevAbout({ d, c }) {
  const stats = [
    { label: "Projects Shipped", value: d.stats?.projects || `${d.projects.length}+` },
    { label: "Years Experience", value: d.stats?.years || "—" },
    { label: "Technologies", value: `${d.skills.length}+` },
    { label: "Client Satisfaction", value: d.stats?.satisfaction || "—" },
  ];
  const timeline = d.education.map((ed) => ({
    title: ed.degree || "Degree",
    org: ed.institution || "Institution",
    period: ed.year || "",
  }));
  const interests = d.skills.slice(0, 6);

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} className="alexdev-section-intro">
        <p className="alexdev-eyebrow">About</p>
        <h2 className="alexdev-h2">A developer who cares about <span className="alexdev-gradient-text">craft</span>.</h2>
        <p className="alexdev-body">{c.aboutMe}</p>
      </motion.div>

      <motion.ul
        initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="alexdev-stats-grid"
      >
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
              {timeline.map((item, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <span className="alexdev-timeline-dot"><IconGraduationCap /></span>
                  <div className="alexdev-glass alexdev-timeline-card">
                    <div className="alexdev-timeline-head">
                      <h4>{item.title}</h4>
                      <span>{item.period}</span>
                    </div>
                    <p className="alexdev-timeline-org">{item.org}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          ) : (
            <p style={{ color: "var(--p-muted)", fontSize: 13 }}>No education added yet.</p>
          )}
        </div>

        {interests.length > 0 && (
          <motion.aside initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} className="alexdev-glass alexdev-interests">
            <h3><IconHeart /> Focus areas</h3>
            <p>The skills I reach for most often.</p>
            <ul>
              {interests.map((i) => (<li key={i}>{i}</li>))}
            </ul>
          </motion.aside>
        )}
      </div>
    </>
  );
}

function AlexDevSkills({ d, c }) {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} className="alexdev-section-intro">
        <p className="alexdev-eyebrow">Skills</p>
        <h2 className="alexdev-h2">Tools I use to <span className="alexdev-gradient-text">ship</span>.</h2>
        <p className="alexdev-body">{c.skillsDescription}</p>
      </motion.div>
      <ul className="alexdev-skills-grid">
        {d.skills.map((s, i) => {
          const pct = pctFor(s, i);
          return (
            <motion.li key={s} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.04 }} className="alexdev-skill-card">
              <div className="alexdev-skill-top">
                <span className="alexdev-skill-dot" />
                <span>{s}</span>
              </div>
              <div className="alexdev-skill-track">
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.1 + i * 0.04 }} className="alexdev-skill-fill" />
              </div>
              <div className="alexdev-skill-pct">{pct}%</div>
            </motion.li>
          );
        })}
      </ul>
    </>
  );
}

function AlexDevProjects({ mergedProjects, d }) {
  return (
    <>
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
      <ul className="alexdev-projects-grid">
        {mergedProjects.length ? mergedProjects.map((p, i) => (
          <motion.li key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: i * 0.06 }} className="alexdev-glass alexdev-proj-card">
            <div className={`alexdev-proj-media ${!p.image ? "empty" : ""}`} style={p.image ? { backgroundImage: `url(${p.image})` } : undefined}>
              {!p.image && <span>{initials(p.title)}</span>}
            </div>
            <div className="alexdev-proj-body">
              <h4>{p.title}</h4>
              <p>{p.description}</p>
              {p.techStack?.length > 0 && (
                <ul className="alexdev-proj-chips">
                  {p.techStack.map((t, ti) => <li key={ti}>{t}</li>)}
                </ul>
              )}
              <div className="alexdev-proj-actions">
                {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="alexdev-btn primary small"><IconExternalLink /> Live Demo</a>}
                {d.github && <a href={normalizeUrl(d.github)} target="_blank" rel="noopener noreferrer" className="alexdev-btn glass small"><IconGithub /> GitHub</a>}
              </div>
            </div>
          </motion.li>
        )) : <p style={{ color: "var(--p-muted)", fontSize: 13 }}>No projects yet.</p>}
      </ul>
    </>
  );
}

function AlexDevContact({ d }) {
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
    <>
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
    </>
  );
}

/* ================= end AlexDev flavor ================= */

function renderHero(flavor, d, c) {
  const skillsCount = d.skills.length;
  const projectsCount = d.projects.length;

  switch (flavor) {
    case "alexdev":
      return <AlexDevHero d={d} c={c} />;

    case "minimal":
      return (
        <div className="p-hero-flavor p-hero-minimal">
          <div className="hero-min-text">
            <div className="p-eyebrow">HELLO, I&rsquo;M {(d.name || "").split(" ")[0] || "THERE"}</div>
            <h1>{d.role || "Creator"}</h1>
            <p>{c.heroText}</p>
            <a className="hero-btn primary" href="#p-contact">Resume</a>
          </div>
          <div className="hero-min-photo">
            <div className="hero-photo-circle deco">
              {d.photoUrl ? <img src={d.photoUrl} alt={d.name || "Profile photo"} /> : initials(d.name)}
              <span className="deco-plus p1">+</span>
              <span className="deco-plus p2">+</span>
              <span className="deco-dash" />
            </div>
          </div>
        </div>
      );

    case "glass":
      return (
        <div className="p-hero-flavor p-hero-glassref">
          <div className="hero-glassref-left">
            <div className="hero-glassref-hello">
              Hello<span className="dot">.</span>
            </div>
            <div className="hero-glassref-im">
              <span className="rule" />
              <span>I&rsquo;m {(d.name || "").split(" ")[0] || "there"}</span>
            </div>
            <h1>{d.role || "Software Developer"}</h1>
            <div className="hero-cta-row">
              <a className="hero-btn primary" href="#p-contact">Got a project?</a>
              <a className="hero-btn ghost" href="#p-about">My resume</a>
            </div>
          </div>
          <div className="hero-glassref-right">
            <span className="hero-glassref-arrow left">‹</span>
            <div className="hero-glassref-photo">
              <Photo d={d} className="glassref" />
            </div>
            <span className="hero-glassref-arrow right">›</span>
          </div>
        </div>
      );

    case "creative":
      return (
        <div className="p-hero-flavor p-hero-creative">
          <div className="hero-creative-left">
            <div className="p-eyebrow">HI, I AM</div>
            <h1>{d.name || "Your Name"}</h1>
            <div className="hero-dev-role">{d.role || "Creative"}</div>
          </div>
          <div className="hero-creative-right">
            <Photo d={d} className="creative" />
            <SocialRow d={d} light />
          </div>
        </div>
      );

    case "editorial":
      return (
        <div className="p-hero-flavor p-hero-editorial">
          <div className="hero-ed-mark">{initials(d.name)}</div>
          <div className="p-eyebrow" style={{ justifyContent: "center", display: "flex" }}>WELCOME TO MY SITE</div>
          <h1>
            Hi, I&rsquo;m {(d.name || "").split(" ")[0] || "there"}, a{" "}
            <span className="hero-ed-accent">{d.role || "creator"}</span>.
          </h1>
          <p>{c.heroText}</p>
          <div className="hero-cta-row">
            <a className="hero-btn primary" href="#p-contact">Hire me!</a>
            <a className="hero-btn ghost" href="#p-projects">See My Project</a>
          </div>
        </div>
      );

    case "brutalist":
    default:
      return (
        <div className="p-hero-flavor p-hero-brutalist">
          <div className="p-eyebrow">{d.name ? d.name.toUpperCase() : "YOUR NAME"} →</div>
          <h1>{d.role || "Builder"}</h1>
          <p>{c.heroText}</p>
          <a className="hero-btn primary brutal" href="#p-projects">Let&rsquo;s get started →</a>
          <div className="hero-stats-row brutal">
            <div className="hero-stat"><b>{skillsCount}+</b><span>Skills</span></div>
            <div className="hero-stat"><b>{projectsCount}+</b><span>Projects</span></div>
          </div>
        </div>
      );
  }
}

export default function FinalPortfolio() {
  const state = usePortfolioState();
  const dispatch = usePortfolioDispatch();
  const [publishing, setPublishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const d = state.data;
  const c = state.content;

  if (!c) {
    return (
      <div className="wrap">
        <div className="page-back-row">
          <BackButton label="← Back to form" />
        </div>
        <p style={{ color: "var(--muted)" }}>Nothing to preview yet — go back and fill out the form.</p>
      </div>
    );
  }

  let layout, extraClass, flavor;
  if (state.mode === "template") {
    const t = TEMPLATES.find((t) => t.id === state.selectedTemplate) || TEMPLATES[0];
    layout = t.layout;
    extraClass = t.cls;
    flavor = t.flavor;
  } else {
    layout = state.layoutJson || generateLayoutFromPrompt("minimal");
    extraClass = "tmpl-ailayout";
    flavor = "editorial";
  }

  const isGlass = flavor === "glass";
  const isAlexDev = flavor === "alexdev";
  const order = layout.order || DEFAULT_ORDER;
  const theme = layout.theme;
  const frameStyle = {
    "--p-bg": theme.primaryColor,
    "--p-surface": theme.mode === "dark" ? `color-mix(in srgb, ${theme.primaryColor} 80%, white 8%)` : "#FFFFFF",
    "--p-text": theme.mode === "dark" ? "#EAF2FB" : "#241F16",
    "--p-muted": theme.mode === "dark" ? "#8CA3C2" : "#8B8270",
    "--p-accent": theme.accentColor,
    "--p-accent-2": theme.accentColor2 || theme.accentColor,
    "--p-font": theme.font,
  };

  const slugBase = slugify(d.name);
  const previewUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/portfolio/${slugBase}`;

  async function publish() {
    if (!state.portfolioId) {
      setErrorMsg("No saved draft found — go back a step so it can be saved first.");
      return;
    }
    setPublishing(true);
    setErrorMsg("");
    try {
      const res = await publishPortfolio(state.portfolioId, slugBase, {
        mode: state.mode,
        selectedTemplate: state.selectedTemplate,
        layoutJson: state.layoutJson,
      });
      dispatch({ type: "PUBLISH", slug: res.slug });
      dispatch({ type: "GO_TO", page: "published" });
    } catch (err) {
      console.error("Publish failed:", err);
      setErrorMsg("Couldn't publish — check the server is running and try again.");
    } finally {
      setPublishing(false);
    }
  }

  const mergedProjects = (c.projectDescriptions || []).map((p, i) => {
    const raw = d.projects[i] || {};
    return {
      title: p.title,
      description: p.description,
      techStack: p.techStack,
      image: raw.image || "",
      link: normalizeUrl(raw.link || ""),
    };
  });

  const sections = {
    hero: (
      <div className={`p-section ${isAlexDev ? "alexdev-hero-section" : ""}`} id="p-home" key="hero">
        {renderHero(flavor, d, c)}
      </div>
    ),

    about: isAlexDev ? (
      <div className="p-section" id="p-about" key="about">
        <AlexDevAbout d={d} c={c} />
      </div>
    ) : isGlass ? (
      <div className="p-section p-about-glassref" id="p-about" key="about">
        <div className="p-eyebrow">ABOUT</div>
        <div className="glassref-about-grid">
          <div className="glassref-services">
            {d.services?.length ? (
              d.services.map((s, i) => {
                const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
                return (
                  <div className="glassref-service-item" key={i}>
                    <span className="gsi-icon"><Icon /></span>
                    <span>{s.title || "Service"}</span>
                  </div>
                );
              })
            ) : (
              <p style={{ color: "var(--p-muted)", fontSize: 13 }}>No services added yet.</p>
            )}
          </div>
          <div className="glassref-about-text">
            <h3>About me</h3>
            <p>{c.aboutMe}</p>
            {(d.stats?.projects || d.stats?.satisfaction || d.stats?.years) && (
              <div className="glassref-stats-row">
                {d.stats?.projects && (
                  <div className="glassref-stat"><b>{d.stats.projects}</b><span>Completed Projects</span></div>
                )}
                {d.stats?.satisfaction && (
                  <div className="glassref-stat"><b>{d.stats.satisfaction}</b><span>Client satisfaction</span></div>
                )}
                {d.stats?.years && (
                  <div className="glassref-stat"><b>{d.stats.years}</b><span>Years of experience</span></div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    ) : (
      <div className={`p-section p-about ${layout.about}`} id="p-about" key="about">
        <div
          className="img-box"
          style={
            d.photoUrl
              ? { backgroundImage: `url(${d.photoUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : undefined
          }
        />
        <div>
          <div className="p-eyebrow">ABOUT</div>
          <p>{c.aboutMe}</p>
        </div>
      </div>
    ),

    projects: isAlexDev ? (
      <div className="p-section" id="p-projects" key="projects">
        <AlexDevProjects mergedProjects={mergedProjects} d={d} />
      </div>
    ) : (
      <div className="p-section" id="p-projects" key="projects">
        <div className="p-eyebrow">PROJECTS</div>
        {layout.projects === "rows" ? (
          <div className="p-projects-rows">
            {mergedProjects.length ? (
              mergedProjects.map((p, i) => (
                <div className={`p-proj-row ${i % 2 === 1 ? "reverse" : ""}`} key={i}>
                  <div
                    className={`p-proj-row-media ${!p.image ? "empty" : ""}`}
                    style={p.image ? { backgroundImage: `url(${p.image})` } : undefined}
                  >
                    {!p.image && <span>{initials(p.title || "Project")}</span>}
                  </div>
                  <div className="p-proj-row-body">
                    <h4>{p.title}</h4>
                    {p.techStack?.length > 0 && (
                      <div className="chips">
                        {p.techStack.map((t, ti) => (
                          <span key={ti}>{t}</span>
                        ))}
                      </div>
                    )}
                    <p>{p.description}</p>
                    <div className="p-proj-row-actions">
                      {d.github && (
                        <a href={normalizeUrl(d.github)} target="_blank" rel="noopener noreferrer" className="hero-btn primary small">
                          View Github
                        </a>
                      )}
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="p-proj-link mono">
                          View project <span className="arrow">→</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "var(--p-muted)", fontSize: 13 }}>No projects yet.</p>
            )}
          </div>
        ) : (
          <div className={`p-projects ${layout.projects}`}>
            {mergedProjects.length ? (
              mergedProjects.map((p, i) => {
                const CardTag = p.link ? "a" : "div";
                const cardProps = p.link
                  ? { href: p.link, target: "_blank", rel: "noopener noreferrer" }
                  : {};
                return (
                  <CardTag className="p-proj" key={i} {...cardProps}>
                    <div
                      className={`p-proj-img ${!p.image ? "empty" : ""}`}
                      style={p.image ? { backgroundImage: `url(${p.image})` } : undefined}
                    >
                      {!p.image && <span>{initials(p.title || "Project")}</span>}
                    </div>
                    <div className="p-proj-body">
                      <h4>{p.title}</h4>
                      <p>{p.description}</p>
                      {p.techStack?.length > 0 && (
                        <div className="chips">
                          {p.techStack.map((t, ti) => (
                            <span key={ti}>{t}</span>
                          ))}
                        </div>
                      )}
                      {p.link && (
                        <span className="p-proj-link mono">
                          View live <span className="arrow">→</span>
                        </span>
                      )}
                    </div>
                  </CardTag>
                );
              })
            ) : (
              <p style={{ color: "var(--p-muted)", fontSize: 13 }}>No projects yet.</p>
            )}
          </div>
        )}
      </div>
    ),

    skills: isAlexDev ? (
      <div className="p-section" id="p-skills" key="skills">
        <AlexDevSkills d={d} c={c} />
      </div>
    ) : (
      <div className="p-section" id="p-skills" key="skills">
        {!isGlass && <div className="p-eyebrow">SKILLS</div>}
        {!isGlass && (
          <p style={{ color: "var(--p-muted)", fontSize: 13.5, maxWidth: 560, marginBottom: 22 }}>
            {c.skillsDescription}
          </p>
        )}
        {layout.skills === "cards" && (
          <div className="p-skills cards">
            {d.skills.map((s, i) => (
              <div className="sk" key={i}>{s}</div>
            ))}
          </div>
        )}
        {layout.skills === "bars" && (
          <div className="p-skills bars">
            {d.skills.map((s, i) => (
              <div className="bar-row" key={i}>
                <div className="lbl">{s}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${60 + ((i * 13) % 35)}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
        {layout.skills === "tags" && (
          <div className="p-skills tags">
            {d.skills.map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
        )}
        {layout.skills === "percent" && (
          <div className="p-skills percent">
            {d.skills.map((s, i) => {
              const pct = pctFor(s, i);
              return (
                <div className="sk-percent" key={i}>
                  <div className="ring" style={{ "--pct": pct }}>
                    <span>{pct}%</span>
                  </div>
                  <div className="lbl">{s}</div>
                </div>
              );
            })}
          </div>
        )}
        {layout.skills === "strip" && (
          <div className="p-skills strip">
            {d.skills.map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
        )}
      </div>
    ),

    contact: isAlexDev ? (
      <div className="p-section" id="p-contact" key="contact">
        <AlexDevContact d={d} />
      </div>
    ) : isGlass ? (
      <div className="p-section p-contact-glassref" id="p-contact" key="contact">
        <div className="p-eyebrow">CONTACTS</div>
        <div className="glassref-contact-grid">
          <div className="glassref-contact-heading">
            <h3>Have a project?<br />Let&rsquo;s talk!</h3>
          </div>
          <GlassContactForm />
        </div>
      </div>
    ) : (
      <div className="p-contact" id="p-contact" key="contact">
        <div className="p-eyebrow" style={{ justifyContent: "center", display: "flex" }}>GET IN TOUCH</div>
        <div className="links">
          {d.email && <a href={`mailto:${d.email}`}>{d.email}</a>}
          {d.github && <a href={normalizeUrl(d.github)} target="_blank" rel="noopener noreferrer">{d.github}</a>}
          {d.linkedin && <a href={normalizeUrl(d.linkedin)} target="_blank" rel="noopener noreferrer">{d.linkedin}</a>}
        </div>
        <FooterSocials d={d} />
      </div>
    ),
  };

  return (
    <div className="wrap" style={{ maxWidth: 1040 }}>
      <div className="page-back-row">
        <BackButton label={state.mode === "template" ? "← Back to templates" : "← Back to AI layout"} />
      </div>
      <div className="eyebrow">PHASE 04 — PREVIEW &amp; PUBLISH</div>
      <div className="portfolio-toolbar">
        <h2 style={{ fontSize: 24 }}>Your portfolio is ready</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn ghost small" onClick={() => dispatch({ type: "GO_TO", page: "preview" })}>
            ← Edit content
          </button>
          <button className="btn small" onClick={publish} disabled={publishing}>
            {publishing ? "Publishing…" : "Publish & get link →"}
          </button>
        </div>
      </div>

      {errorMsg && (
        <p style={{ color: "var(--danger)", fontSize: 12.5, fontFamily: "var(--font-mono)", marginBottom: 14 }}>
          {errorMsg}
        </p>
      )}

      <div className="portfolio-frame-outer">
        <div className="pf-browser-bar">
          <span></span><span></span><span></span>
          <div className="pf-browser-url mono">{previewUrl}</div>
        </div>

        <div className={`portfolio-frame ${extraClass}`} style={frameStyle}>
          <nav className="p-nav">
            <div className="p-nav-mark">{initials(d.name)}</div>
            <div className="p-nav-name">{d.name || "Your Name"}</div>
            <div className="p-nav-links">
              <a href="#p-about">About</a>
              <a href="#p-skills">Skills</a>
              <a href="#p-projects">Projects</a>
              <a href="#p-contact">Contact</a>
            </div>
          </nav>

          {order.map((key) => sections[key] || null)}

          <footer className="p-footer">
            <div className="p-footer-top">
              <div className="p-footer-brand">
                <div className="p-footer-name">{d.name || "Your Name"}</div>
                <div className="p-footer-tag">{c.tagline}</div>
                <FooterSocials d={d} />
              </div>
              <div className="p-footer-col">
                <div className="p-footer-heading">Navigation</div>
                <a href="#p-about">About</a>
                <a href="#p-skills">Skills</a>
                <a href="#p-projects">Projects</a>
              </div>
              <div className="p-footer-col">
                <div className="p-footer-heading">Contact</div>
                {d.email && <a href={`mailto:${d.email}`}>{d.email}</a>}
                {d.github && <a href={normalizeUrl(d.github)} target="_blank" rel="noopener noreferrer">{d.github}</a>}
                {d.linkedin && <a href={normalizeUrl(d.linkedin)} target="_blank" rel="noopener noreferrer">{d.linkedin}</a>}
              </div>
            </div>
            <div className="p-footer-bottom">
              © {new Date().getFullYear()} {d.name || "Your Name"} — built with Blueprint
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}