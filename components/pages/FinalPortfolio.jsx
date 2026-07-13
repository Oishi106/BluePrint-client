"use client";

import { usePortfolioState, usePortfolioDispatch } from "@/context/PortfolioContext";
import { TEMPLATES } from "@/lib/templates";
import { generateLayoutFromPrompt } from "@/lib/mockAI";
import { useMemo, useCallback, useState } from "react";

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


function normalizeUrl(url) {
  if (!url) return "";
  return url.match(/^https?:\/\//i) ? url : `https://${url}`;
}

const DEFAULT_ORDER = ["hero", "about", "skills", "projects", "contact"];

function Photo({ d, className }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className={`hero-photo-circle ${className || ""}`}>
      {d.photoUrl && !imgError ? <img src={d.photoUrl} alt={d.name || "Profile photo"} onError={() => setImgError(true)} /> : initials(d.name)}
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

/* ---- Minimal, generic (non-brand-logo) icon set for footer ---- */
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
          style={{ minWidth: 44, minHeight: 44, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
        >
          {it.icon}
        </a>
      ))}
    </div>
  );
}

function renderHero(flavor, d, c) {
  const skillsCount = d.skills?.length || 0;
  const projectsCount = d.projects?.length || 0;

  switch (flavor) {
    case "developer":
      return (
        <div className="p-hero-flavor p-hero-developer">
          <div>
            <h1>{d.name || "Your Name"}</h1>
            <div className="hero-dev-role">{d.role || "Developer"}</div>
            <p className="hero-dev-text">{c.heroText}</p>
            <div className="hero-cta-row">
              <a className="hero-btn primary" href="#p-projects">View Work</a>
              <a className="hero-btn ghost" href="#p-contact">Get in Touch</a>
            </div>
            <SocialRow d={d} />
            <div className="hero-stats-row">
              <div className="hero-stat"><b>{skillsCount}+</b><span>Skills</span></div>
              <div className="hero-stat"><b>{projectsCount}+</b><span>Projects</span></div>
              <div className="hero-stat"><b>{d.education?.length || 0}</b><span>Education</span></div>
            </div>
          </div>
          <div className="hero-dev-right">
            <div className="hero-photo-glow">
              <Photo d={d} className="dev" />
            </div>
          </div>
        </div>
      );

    case "minimal":
      return (
        <div className="p-hero-flavor p-hero-minimal">
          <div className="hero-min-text">
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
        <div className="p-hero-flavor p-hero-glass">
          <div className="hero-glass-card">
            <Photo d={d} className="glass" />
            <h1>{d.name || "Your Name"}</h1>
            <p>{c.heroText}</p>
            <a className="hero-btn primary" href="#p-projects">Let&rsquo;s get started →</a>
            {skillsCount > 0 && (
              <div className="hero-glass-worked">
                <span>Skills</span>
                <div className="hero-glass-chip-row">
                  {(d.skills || []).slice(0, 5).map((s, i) => (
                    <span key={i}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );

    case "creative":
      return (
        <div className="p-hero-flavor p-hero-creative">
          <div className="hero-creative-left">
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
  const d = state.data;
  const c = state.content;

  if (!c) {
    return (
      <div className="wrap">
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

  const slugBase = useMemo(() => slugify(d.name), [d.name]);

  const publish = useCallback(() => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    dispatch({ type: "PUBLISH", slug: `${slugBase}-${rand}` });
    dispatch({ type: "GO_TO", page: "published" });
  }, [dispatch, slugBase]);

  const mergedProjects = useMemo(() => {
    return (c.projectDescriptions || []).map((p, i) => {
      const raw = d.projects?.[i] || {};
      return {
        title: p.title,
        description: p.description,
        techStack: p.techStack,
        image: raw.image || "",
        link: normalizeUrl(raw.link || ""),
      };
    });
  }, [c.projectDescriptions, d.projects]);

  const sections = {
    hero: (
      <section className="p-section" id="p-home" key="hero">
        {renderHero(flavor, d, c)}
      </section>
    ),
    about: c.aboutMe ? (
      <section className={`p-section p-about ${layout.about}`} id="p-about" key="about">
        <div className="img-box" style={{ overflow: "hidden" }}>
          {d.photoUrl && (
            <img 
              src={d.photoUrl} 
              alt="About me" 
              loading="lazy" 
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
            />
          )}
        </div>
        <div>
          <h2>About</h2>
          <p>{c.aboutMe}</p>
        </div>
      </section>
    ) : null,
    projects: (
      <section className="p-section" id="p-projects" key="projects">
        <h2>Projects</h2>
        <div className={`p-projects ${layout.projects}`}>
          {mergedProjects.length ? (
            mergedProjects.map((p, i) => {
              const CardTag = p.link ? "a" : "div";
              const cardProps = p.link
                ? { href: p.link, target: "_blank", rel: "noopener noreferrer" }
                : {};
              return (
                <CardTag className="p-proj" key={i} {...cardProps}>
                  <div className={`p-proj-img ${!p.image ? "empty" : ""}`} style={{ overflow: "hidden" }}>
                    {p.image ? (
                      <img 
                        src={p.image} 
                        alt={p.title || "Project preview"} 
                        loading="lazy" 
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
                      />
                    ) : (
                      <span>{initials(p.title || "Project")}</span>
                    )}
                  </div>
                  <div className="p-proj-body">
                    <h3>{p.title}</h3>
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
            <p style={{ color: "var(--p-muted)", fontSize: "1rem" }}>No projects yet.</p>
          )}
        </div>
      </section>
    ),
    skills: (d.skills && d.skills.length > 0) ? (
      <section className="p-section" id="p-skills" key="skills">
        <h2>Skills</h2>
        <p style={{ color: "var(--p-muted)", fontSize: "1rem", maxWidth: "65ch", marginBottom: "1.5rem", lineHeight: 1.6 }}>
          {c.skillsDescription}
        </p>
        {layout.skills === "cards" && (
          <div className="p-skills cards">
            {d.skills.map((s, i) => (
              <div className="sk" key={i}>{s}</div>
            ))}
          </div>
        )}
        {["bars", "tags", "percent"].includes(layout.skills) && (
          <div className="p-skills tags">
            {d.skills.map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
        )}
      </section>
    ) : null,
    contact: (
      <section className="p-contact" id="p-contact" key="contact">
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Get in Touch</h2>
        <div className="links">
          {d.email && <a href={`mailto:${d.email}`}>{d.email}</a>}
          {d.github && <a href={normalizeUrl(d.github)} target="_blank" rel="noopener noreferrer">{d.github}</a>}
          {d.linkedin && <a href={normalizeUrl(d.linkedin)} target="_blank" rel="noopener noreferrer">{d.linkedin}</a>}
        </div>
        <FooterSocials d={d} />
      </section>
    ),
  };

  return (
    <div className="wrap" style={{ maxWidth: 1040 }}>
      <div className="eyebrow">PHASE 04 — PREVIEW &amp; PUBLISH</div>
      <div className="portfolio-toolbar">
        <h2 style={{ fontSize: 24 }}>Your portfolio is ready</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn ghost small" onClick={() => dispatch({ type: "GO_TO", page: "preview" })}>
            ← Edit content
          </button>
          <button className="btn small" onClick={publish}>Publish &amp; get link →</button>
        </div>
      </div>

      <div className="portfolio-frame-outer">
        <div className="pf-browser-bar">
          <span></span><span></span><span></span>
          <div className="pf-browser-url mono">blueprint.site/portfolio/{slugBase}</div>
        </div>

        <div className={`portfolio-frame ${extraClass}`} style={frameStyle}>
          <nav className="p-nav">
            <div className="p-nav-mark">{initials(d.name)}</div>
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