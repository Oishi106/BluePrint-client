"use client";

import { useState } from "react";
import { usePortfolioState, usePortfolioDispatch } from "@/context/PortfolioContext";
import BackButton from "@/components/BackButton";

const STEP_LABELS = ["Basics", "Skills", "Projects", "Education", "Extras", "Contact"];
const TOTAL_STEPS = 6;

export default function FormWizard() {
  const state = usePortfolioState();
  const dispatch = usePortfolioDispatch();
  const [step, setStep] = useState(1);
  const [skillInput, setSkillInput] = useState("");
  const [errorFlash, setErrorFlash] = useState("");

  const d = state.data;

  function setField(field, value) {
    dispatch({ type: "SET_FIELD", field, value });
  }

function handlePhotoChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    // base64 data URL — works for instant preview AND can be sent to the server as-is
    setField("photoUrl", reader.result);
  };
  reader.readAsDataURL(file);
}

 function handleProjectImageChange(index, e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    dispatch({ type: "UPDATE_PROJECT", index, field: "image", value: reader.result });
  };
  reader.readAsDataURL(file);
}

function handleCertificateImageChange(index, e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    dispatch({ type: "UPDATE_CERTIFICATE", index, field: "image", value: reader.result });
  };
  reader.readAsDataURL(file);
}

  function validateStep(s) {
    if (s === 1 && (!d.name.trim() || !d.role.trim())) {
      setErrorFlash("Name and role are required.");
      setTimeout(() => setErrorFlash(""), 1400);
      return false;
    }
    return true;
  }

  function stepNav(dir) {
    if (dir === 1 && !validateStep(step)) return;
    const next = step + dir;
    if (next < 1) return;
    if (next > TOTAL_STEPS) {
      submitForm();
      return;
    }
    setStep(next);
  }

  function submitForm() {
    dispatch({ type: "GO_TO", page: "generating" });
  }

  function addSkill() {
    if (!skillInput.trim()) return;
    dispatch({ type: "ADD_SKILL", value: skillInput });
    setSkillInput("");
  }

  return (
    <div className="wrap" style={{ maxWidth: 720 }}>
      <div className="page-back-row">
        <BackButton label="← Back to start" />
      </div>
      <div className="eyebrow">PHASE 01 — INPUT</div>
      <h2 style={{ fontSize: 28, marginBottom: 36 }}>Tell us about you</h2>

      <div className="progress-rail">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const cls = `progress-step ${n < step ? "done" : ""} ${n === step ? "active" : ""}`;
          return (
            <div className={cls} key={label}>
              <div className="circle mono">{n < step ? "✓" : n}</div>
              <span className="lbl">{label.toUpperCase()}</span>
              {n < STEP_LABELS.length && <div className="bar" />}
            </div>
          );
        })}
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {step === 1 && (
          <div className="form-step">
            <div className="field-group">
              <label>Profile photo</label>
              <div className="photo-upload-row">
                {d.photoUrl ? (
                  <img src={d.photoUrl} alt="Profile preview" className="photo-preview" />
                ) : (
                  <div className="photo-preview photo-preview-empty">No photo</div>
                )}
                <label className="btn ghost small photo-upload-btn">
                  {d.photoUrl ? "Change photo" : "Upload photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
              <div className="hint">Square image works best (e.g. 400×400px).</div>
            </div>
            <div className="field-group">
              <label>Full name</label>
              <input
                type="text"
                placeholder="e.g. Ayesha Rahman"
                value={d.name}
                onChange={(e) => setField("name", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Role / profession</label>
              <input
                type="text"
                placeholder="e.g. Frontend Developer"
                value={d.role}
                onChange={(e) => setField("role", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Short bio</label>
              <textarea
                placeholder="A couple of sentences about what you do and care about."
                value={d.bio}
                onChange={(e) => setField("bio", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <div className="field-group">
              <label>Skills</label>
              <div className="tag-input-box">
                {d.skills.map((s, i) => (
                  <div className="tag-pill" key={i}>
                    <span>{s}</span>
                    <button type="button" onClick={() => dispatch({ type: "REMOVE_SKILL", index: i })}>
                      ×
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  placeholder="Type a skill and press Enter…"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
              </div>
              <div className="hint">e.g. React, Node.js, Figma, Python</div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--muted)",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Projects
            </label>

            {d.projects.map((p, i) => (
              <div className="repeat-card" key={i}>
                <button
                  type="button"
                  className="rm-btn"
                  onClick={() => dispatch({ type: "REMOVE_PROJECT", index: i })}
                >
                  ×
                </button>

                <div className="field-group">
                  <label>Project image</label>
                  <div className="photo-upload-row">
                    {p.image ? (
                      <img src={p.image} alt={`${p.name || "Project"} preview`} className="photo-preview" />
                    ) : (
                      <div className="photo-preview photo-preview-empty">No image</div>
                    )}
                    <label className="btn ghost small photo-upload-btn">
                      {p.image ? "Change image" : "Upload image"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProjectImageChange(i, e)}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                </div>

                <div className="two-col">
                  <div className="field-group">
                    <label>Project name</label>
                    <input
                      type="text"
                      placeholder="e.g. E-commerce Dashboard"
                      value={p.name}
                      onChange={(e) =>
                        dispatch({ type: "UPDATE_PROJECT", index: i, field: "name", value: e.target.value })
                      }
                    />
                  </div>
                  <div className="field-group">
                    <label>Live link</label>
                    <input
                      type="text"
                      placeholder="https://…"
                      value={p.link}
                      onChange={(e) =>
                        dispatch({ type: "UPDATE_PROJECT", index: i, field: "link", value: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label>Description</label>
                  <textarea
                    placeholder="What does this project do?"
                    value={p.description}
                    onChange={(e) =>
                      dispatch({ type: "UPDATE_PROJECT", index: i, field: "description", value: e.target.value })
                    }
                  />
                </div>

                <div className="field-group">
                  <label>Tech stack (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, MongoDB"
                    value={p.tech}
                    onChange={(e) =>
                      dispatch({ type: "UPDATE_PROJECT", index: i, field: "tech", value: e.target.value })
                    }
                  />
                </div>
              </div>
            ))}

            <button type="button" className="add-row-btn" onClick={() => dispatch({ type: "ADD_PROJECT" })}>
              + Add project
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="form-step">
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--muted)",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Education
            </label>
            {d.education.map((ed, i) => (
              <div className="repeat-card" key={i}>
                <button
                  type="button"
                  className="rm-btn"
                  onClick={() => dispatch({ type: "REMOVE_EDU", index: i })}
                >
                  ×
                </button>
                <div className="two-col">
                  <div className="field-group">
                    <label>Degree</label>
                    <input
                      type="text"
                      value={ed.degree}
                      onChange={(e) =>
                        dispatch({ type: "UPDATE_EDU", index: i, field: "degree", value: e.target.value })
                      }
                    />
                  </div>
                  <div className="field-group">
                    <label>Year</label>
                    <input
                      type="text"
                      value={ed.year}
                      onChange={(e) =>
                        dispatch({ type: "UPDATE_EDU", index: i, field: "year", value: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="field-group">
                  <label>Institution</label>
                  <input
                    type="text"
                    value={ed.institution}
                    onChange={(e) =>
                      dispatch({ type: "UPDATE_EDU", index: i, field: "institution", value: e.target.value })
                    }
                  />
                </div>
              </div>
            ))}
            <button type="button" className="add-row-btn" onClick={() => dispatch({ type: "ADD_EDU" })}>
              + Add education
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="form-step">
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--muted)",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Services
            </label>
            <div className="hint" style={{ marginBottom: 16 }}>
              Used only by the Glassmorphism templates. Add as many or as few as you like — e.g. Website Development, App Development, Website Hosting.
            </div>

            {d.services.map((s, i) => (
              <div className="repeat-card" key={i} style={{ padding: 14 }}>
                <button
                  type="button"
                  className="rm-btn"
                  onClick={() => dispatch({ type: "REMOVE_SERVICE", index: i })}
                >
                  ×
                </button>
                <div className="field-group" style={{ marginBottom: 0 }}>
                  <label>Service {i + 1}</label>
                  <input
                    type="text"
                    placeholder="e.g. Website Development"
                    value={s.title}
                    onChange={(e) =>
                      dispatch({ type: "UPDATE_SERVICE", index: i, value: e.target.value })
                    }
                  />
                </div>
              </div>
            ))}
            <button type="button" className="add-row-btn" onClick={() => dispatch({ type: "ADD_SERVICE" })}>
              + Add service
            </button>

            <label
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--muted)",
                textTransform: "uppercase",
                margin: "30px 0 12px",
              }}
            >
              Stats
            </label>
            <div className="two-col">
              <div className="field-group">
                <label>Completed projects</label>
                <input
                  type="text"
                  placeholder="e.g. 120+"
                  value={d.stats.projects}
                  onChange={(e) => dispatch({ type: "SET_STAT", field: "projects", value: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Client satisfaction</label>
                <input
                  type="text"
                  placeholder="e.g. 95%"
                  value={d.stats.satisfaction}
                  onChange={(e) => dispatch({ type: "SET_STAT", field: "satisfaction", value: e.target.value })}
                />
              </div>
            </div>
            <div className="field-group">
              <label>Years of experience</label>
              <input
                type="text"
                placeholder="e.g. 10+"
                value={d.stats.years}
                onChange={(e) => dispatch({ type: "SET_STAT", field: "years", value: e.target.value })}
              />
            </div>

            {/* NEW: optional — Certificates */}
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--muted)",
                textTransform: "uppercase",
                margin: "30px 0 4px",
              }}
            >
              Certificates
            </label>
            <div className="hint" style={{ marginBottom: 16 }}>
              Optional — skip if you don&apos;t have any yet. Only shown on your portfolio if you add at least one.
            </div>
            {d.certificates.map((c, i) => (
              <div className="repeat-card" key={i}>
                <button
                  type="button"
                  className="rm-btn"
                  onClick={() => dispatch({ type: "REMOVE_CERTIFICATE", index: i })}
                >
                  ×
                </button>

                <div className="field-group">
                  <label>Certificate image</label>
                  <div className="photo-upload-row">
                    {c.image ? (
                      <img src={c.image} alt={`${c.title || "Certificate"} preview`} className="photo-preview" />
                    ) : (
                      <div className="photo-preview photo-preview-empty">No image</div>
                    )}
                    <label className="btn ghost small photo-upload-btn">
                      {c.image ? "Change image" : "Upload image"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCertificateImageChange(i, e)}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                </div>

                <div className="two-col">
                  <div className="field-group">
                    <label>Title</label>
                    <input
                      type="text"
                      placeholder="e.g. AWS Cloud Practitioner"
                      value={c.title}
                      onChange={(e) =>
                        dispatch({ type: "UPDATE_CERTIFICATE", index: i, field: "title", value: e.target.value })
                      }
                    />
                  </div>
                  <div className="field-group">
                    <label>Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 2025"
                      value={c.year}
                      onChange={(e) =>
                        dispatch({ type: "UPDATE_CERTIFICATE", index: i, field: "year", value: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="two-col">
                  <div className="field-group">
                    <label>Issuer</label>
                    <input
                      type="text"
                      placeholder="e.g. Amazon Web Services"
                      value={c.issuer}
                      onChange={(e) =>
                        dispatch({ type: "UPDATE_CERTIFICATE", index: i, field: "issuer", value: e.target.value })
                      }
                    />
                  </div>
                  <div className="field-group">
                    <label>Credential link</label>
                    <input
                      type="text"
                      placeholder="https://…"
                      value={c.link}
                      onChange={(e) =>
                        dispatch({ type: "UPDATE_CERTIFICATE", index: i, field: "link", value: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="add-row-btn" onClick={() => dispatch({ type: "ADD_CERTIFICATE" })}>
              + Add certificate
            </button>

            {/* NEW: optional — Achievements */}
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--muted)",
                textTransform: "uppercase",
                margin: "30px 0 4px",
              }}
            >
              Achievements
            </label>
            <div className="hint" style={{ marginBottom: 16 }}>
              Optional — e.g. hackathon wins, competition results, awards.
            </div>
            {d.achievements.map((a, i) => (
              <div className="repeat-card" key={i} style={{ padding: 14 }}>
                <button
                  type="button"
                  className="rm-btn"
                  onClick={() => dispatch({ type: "REMOVE_ACHIEVEMENT", index: i })}
                >
                  ×
                </button>
                <div className="two-col">
                  <div className="field-group">
                    <label>Title</label>
                    <input
                      type="text"
                      placeholder="e.g. 1st Place — University Hackathon"
                      value={a.title}
                      onChange={(e) =>
                        dispatch({ type: "UPDATE_ACHIEVEMENT", index: i, field: "title", value: e.target.value })
                      }
                    />
                  </div>
                  <div className="field-group">
                    <label>Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 2025"
                      value={a.year}
                      onChange={(e) =>
                        dispatch({ type: "UPDATE_ACHIEVEMENT", index: i, field: "year", value: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="field-group">
                  <label>Description</label>
                  <textarea
                    placeholder="A sentence or two about it."
                    value={a.description}
                    onChange={(e) =>
                      dispatch({ type: "UPDATE_ACHIEVEMENT", index: i, field: "description", value: e.target.value })
                    }
                  />
                </div>
              </div>
            ))}
            <button type="button" className="add-row-btn" onClick={() => dispatch({ type: "ADD_ACHIEVEMENT" })}>
              + Add achievement
            </button>

            {/* NEW: optional — Internships */}
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--muted)",
                textTransform: "uppercase",
                margin: "30px 0 4px",
              }}
            >
              Internships
            </label>
            <div className="hint" style={{ marginBottom: 16 }}>
              Optional — skip if you haven&apos;t interned anywhere yet.
            </div>
            {d.internships.map((it, i) => (
              <div className="repeat-card" key={i}>
                <button
                  type="button"
                  className="rm-btn"
                  onClick={() => dispatch({ type: "REMOVE_INTERNSHIP", index: i })}
                >
                  ×
                </button>
                <div className="two-col">
                  <div className="field-group">
                    <label>Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Frontend Intern"
                      value={it.role}
                      onChange={(e) =>
                        dispatch({ type: "UPDATE_INTERNSHIP", index: i, field: "role", value: e.target.value })
                      }
                    />
                  </div>
                  <div className="field-group">
                    <label>Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. Jun 2025 – Aug 2025"
                      value={it.duration}
                      onChange={(e) =>
                        dispatch({ type: "UPDATE_INTERNSHIP", index: i, field: "duration", value: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="field-group">
                  <label>Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Pathao"
                    value={it.company}
                    onChange={(e) =>
                      dispatch({ type: "UPDATE_INTERNSHIP", index: i, field: "company", value: e.target.value })
                    }
                  />
                </div>
                <div className="field-group">
                  <label>Description</label>
                  <textarea
                    placeholder="What did you work on?"
                    value={it.description}
                    onChange={(e) =>
                      dispatch({ type: "UPDATE_INTERNSHIP", index: i, field: "description", value: e.target.value })
                    }
                  />
                </div>
              </div>
            ))}
            <button type="button" className="add-row-btn" onClick={() => dispatch({ type: "ADD_INTERNSHIP" })}>
              + Add internship
            </button>
          </div>
        )}

        {step === 6 && (
          <div className="form-step">
            <div className="field-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={d.email}
                onChange={(e) => setField("email", e.target.value)}
              />
            </div>
            <div className="two-col">
              <div className="field-group">
                <label>GitHub</label>
                <input
                  type="text"
                  placeholder="github.com/username"
                  value={d.github}
                  onChange={(e) => setField("github", e.target.value)}
                />
              </div>
              <div className="field-group">
                <label>LinkedIn</label>
                <input
                  type="text"
                  placeholder="linkedin.com/in/username"
                  value={d.linkedin}
                  onChange={(e) => setField("linkedin", e.target.value)}
                />
              </div>
            </div>
            <div className="field-group">
              <label>Facebook</label>
              <input
                type="text"
                placeholder="facebook.com/username"
                value={d.facebook}
                onChange={(e) => setField("facebook", e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="form-nav">
          <button type="button" className="btn ghost small" disabled={step === 1} onClick={() => stepNav(-1)}>
            ← Back
          </button>
          <button
            type="button"
            className="btn small"
            style={errorFlash ? { borderColor: "var(--danger)" } : undefined}
            onClick={() => stepNav(1)}
          >
            {errorFlash ? errorFlash : step === TOTAL_STEPS ? "Generate portfolio →" : "Continue →"}
          </button>
        </div>
      </form>
    </div>
  );
}