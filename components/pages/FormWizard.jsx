"use client";

import { useState } from "react";
import { usePortfolioState, usePortfolioDispatch } from "@/context/PortfolioContext";

const STEP_LABELS = ["Basics", "Skills", "Projects", "Education", "Contact"];
const TOTAL_STEPS = 5;

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
    if (d.photoUrl) URL.revokeObjectURL(d.photoUrl);
    const url = URL.createObjectURL(file);
    setField("photoFile", file);
    setField("photoUrl", url);
  }

  function handleProjectImageChange(index, e) {
    const file = e.target.files[0];
    if (!file) return;
    const currentImage = d.projects[index]?.image;
    if (currentImage) URL.revokeObjectURL(currentImage);
    const url = URL.createObjectURL(file);
    dispatch({ type: "UPDATE_PROJECT", index, field: "imageFile", value: file });
    dispatch({ type: "UPDATE_PROJECT", index, field: "image", value: url });
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
              {n < 5 && <div className="bar" />}
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