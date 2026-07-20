"use client";

import { useState } from "react";
import { motion } from "motion/react";

function initials(name) {
  return (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
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

function renderHero(flavor, d, c) {                     
  const skillsCount = d.skills.length;
  const projectsCount = d.projects.length;                        

  switch (flavor) {
    case "developer":
  return (
    <div className="p-hero-flavor p-hero-devpro">
      <div className="devpro-badge">
        <span className="devpro-badge-dot" />
        Available for freelance &amp; full-time roles
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Hi, I&rsquo;m <span className="devpro-gradient">{d.name || "Your Name"}</span>
        <br />
        <span className="devpro-muted">{d.role || "Developer"}</span>
      </motion.h1>

      <motion.p
        className="hero-dev-text"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {c.heroText}
      </motion.p>

      <motion.div
        className="hero-cta-row"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <a className="hero-btn primary" href="#p-contact">Hire Me</a>
        <a className="hero-btn ghost" href="#p-projects">View Work</a>
      </motion.div>

      <SocialRow d={d} />

      <motion.div
        className="hero-dev-right devpro-photo-wrap"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        <div className="hero-photo-glow">
          <Photo d={d} className="dev" />
        </div>
        <motion.div
          className="devpro-float devpro-float-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="devpro-float-label">Skills</div>
          <div className="devpro-float-value">{skillsCount}+ tools</div>
        </motion.div>
        <motion.div
          className="devpro-float devpro-float-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="devpro-float-label">Projects</div>
          <div className="devpro-float-value">{projectsCount}+ shipped</div>
        </motion.div>
      </motion.div>
    </div>
   );

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

// d = data, c = content, layout = { hero, about, projects, skills, order, theme }, flavor = template flavor id, frameClass = tmpl-* class
export default function PortfolioRenderer({ d, c, layout, flavor, frameClass }) {
  const isGlass = flavor === "glass";
  const order = layout.order || DEFAULT_ORDER;
  const theme = layout.theme;
  const frameStyle = {
    "--p-bg": theme.primaryColor,
    "--p-surface": theme.mode === "dark" ? `color-mix(in srgb, ${theme.primaryColor} 80%, white 8%)` : "#FFFFFF",
    "--p-text": theme.mode === "dark" ? "#EAF2FB" : "#241F16",
    "--p-muted": theme.mode === "dark" ? "#8CA3C2" : "#8B8270",
    "--p-accent": theme.accentColor,
    "--p-font": theme.font,
  };

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
      <div className="p-section" id="p-home" key="hero">
        {renderHero(flavor, d, c)}
      </div>
    ),

   

    projects: (
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

    skills: (
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

    contact: isGlass ? (
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
    <div className={`portfolio-frame ${frameClass}`} style={frameStyle}>
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
  );
}