"use client";

import { usePortfolioState, usePortfolioDispatch } from "@/context/PortfolioContext";
import { TEMPLATES } from "@/lib/templates";
import { generateLayoutFromPrompt } from "@/lib/mockAI";

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

function renderHero(flavor, d, c) {
  const skillsCount = d.skills.length;
  const projectsCount = d.projects.length;

  switch (flavor) {
    case "developer":
      return (
        <div className="p-hero-flavor p-hero-developer">
          <div>
            <div className="p-eyebrow">HI, I AM</div>
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
                  {d.skills.slice(0, 5).map((s, i) => (
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

  const slugBase = slugify(d.name);

  function publish() {
    const rand = Math.floor(1000 + Math.random() * 9000);
    dispatch({ type: "PUBLISH", slug: `${slugBase}-${rand}` });
    dispatch({ type: "GO_TO", page: "published" });
  }

  // Merge AI-generated copy (title/description/techStack) with the raw
  // form data (image/link) for each project, matched by index.
  const mergedProjects = (c.projectDescriptions || []).map((p, i) => {
    const raw = d.projects[i] || {};
    return {
      title: p.title,
      description: p.description,
      techStack: p.techStack,
      image: raw.image || "",
      link: raw.link || "",
    };
  });

  const sections = {
    hero: (
      <div className="p-section" id="p-home" key="hero">
        {renderHero(flavor, d, c)}
      </div>
    ),
    about: (
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
   projects: (
      <div className="p-section" id="p-projects" key="projects">
        <div className="p-eyebrow">PROJECTS</div>
        <div className={`p-projects ${layout.projects}`}>
          {mergedProjects.length ? (
            mergedProjects.map((p, i) => {
              const safeLink = p.link
                ? p.link.match(/^https?:\/\//i)
                  ? p.link
                  : `https://${p.link}`
                : "";
              const CardTag = safeLink ? "a" : "div";
              const cardProps = safeLink
                ? { href: safeLink, target: "_blank", rel: "noopener noreferrer" }
                : {};
              return (
                <CardTag className="p-proj" key={i} {...cardProps}>
                  {p.image ? (
                    <div
                      className="p-proj-img"
                      style={{
                        backgroundImage: `url(${p.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        width: "100%",
                        aspectRatio: "16 / 10",
                        borderRadius: 10,
                        marginBottom: 14,
                      }}
                    />
                  ) : null}
                  <h4>{p.title}</h4>
                  <p>{p.description}</p>
                  <div className="chips">
                    {p.techStack.map((t, ti) => (
                      <span key={ti}>{t}</span>
                    ))}
                  </div>
                  {safeLink && <span className="p-proj-link mono">View live →</span>}
                </CardTag>
              );
            })
          ) : (
            <p style={{ color: "var(--p-muted)", fontSize: 13 }}>No projects yet.</p>
          )}
        </div>
      </div>
    ),
    skills: (
      <div className="p-section" id="p-skills" key="skills">
        <div className="p-eyebrow">SKILLS</div>
        <p style={{ color: "var(--p-muted)", fontSize: 13.5, maxWidth: 560, marginBottom: 22 }}>
          {c.skillsDescription}
        </p>
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
      </div>
    ),
    contact: (
      <div className="p-contact" id="p-contact" key="contact">
        <div className="p-eyebrow" style={{ justifyContent: "center", display: "flex" }}>GET IN TOUCH</div>
        <div className="links">
          {d.email && <a href="#">{d.email}</a>}
          {d.github && <a href="#">{d.github}</a>}
          {d.linkedin && <a href="#">{d.linkedin}</a>}
        </div>
      </div>
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
              </div>
              <div className="p-footer-col">
                <div className="p-footer-heading">Navigation</div>
                <a href="#p-about">About</a>
                <a href="#p-skills">Skills</a>
                <a href="#p-projects">Projects</a>
              </div>
              <div className="p-footer-col">
                <div className="p-footer-heading">Contact</div>
                {d.email && <a href="#">{d.email}</a>}
                {d.github && <a href="#">{d.github}</a>}
                {d.linkedin && <a href="#">{d.linkedin}</a>}
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