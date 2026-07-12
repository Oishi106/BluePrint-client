// Client-side "AI" mocks — no server, no API key needed.
// Swap the bodies of these two functions for real fetch() calls to
// OpenAI/Gemini later without touching any component code.

const ADJ = [
  "thoughtful",
  "precise",
  "bold",
  "human-centered",
  "detail-driven",
  "curious",
  "pragmatic",
  "considered",
];
const NOUN_MAKE = ["products", "experiences", "interfaces", "systems", "tools"];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateContent(data) {
  const name = data.name || "This person";
  const first = name.split(" ")[0] || name;
  const role = data.role || "creator";
  const skillsStr = data.skills.length ? data.skills.join(", ") : "a range of tools";

  return {
    tagline: `${role} crafting ${pick(ADJ)} work.`,
    heroText: `Hi, I'm ${name} — a ${role.toLowerCase()} who turns ideas into ${pick(
      NOUN_MAKE
    )}.`,
    aboutMe:
      (data.bio ? data.bio + " " : `${name} is a ${role} focused on building things that matter. `) +
      `With hands-on experience in ${skillsStr}, ${first} approaches every project with a ${pick(
        ADJ
      )} mindset — starting from the problem, not the tool.`,
    skillsDescription: `Comfortable across ${skillsStr}, with a habit of reaching for the simplest tool that solves the real problem.`,
    projectDescriptions: data.projects.map((p) => ({
      title: p.name || "Untitled project",
      description: p.description || `A ${pick(ADJ)} project exploring ${p.name || "a new idea"}.`,
      techStack: (p.tech || "").split(",").map((t) => t.trim()).filter(Boolean),
      link: p.link || "",
    })),
  };
}

export function generateLayoutFromPrompt(prompt) {
  const s = prompt.toLowerCase();
  let theme = { mode: "dark", primaryColor: "#0A1628", accentColor: "#F2A65A", font: "var(--font-display)" };
  let hero = "center",
    about = "left-image",
    projects = "grid",
    skills = "cards";

  if (/neon|futuristic|cyber|tech/.test(s)) {
    theme = { mode: "dark", primaryColor: "#0B0F19", accentColor: "#7CFFCB", font: "var(--font-display)" };
    hero = "full-bleed";
    projects = "carousel";
    skills = "bars";
    about = "right-image";
  } else if (/minimal|apple|clean|simple/.test(s)) {
    theme = { mode: "light", primaryColor: "#FAFAFA", accentColor: "#1F1F1F", font: "var(--font-body)" };
    hero = "center";
    about = "centered-text";
    projects = "grid";
    skills = "tags";
  } else if (/glass|frosted|dream/.test(s)) {
    theme = { mode: "dark", primaryColor: "#151A2E", accentColor: "#9AA7FF", font: "var(--font-display)" };
    hero = "left-image";
    projects = "masonry";
    skills = "cards";
    about = "right-image";
  } else if (/warm|earth|clay|terracotta/.test(s)) {
    theme = { mode: "light", primaryColor: "#F6F1E7", accentColor: "#C1571F", font: "var(--font-body)" };
    about = "right-image";
    skills = "tags";
    hero = "center";
  } else if (/bold|colorful|creative|masonry/.test(s)) {
    theme = { mode: "light", primaryColor: "#FDF6EC", accentColor: "#E85D3E", font: "var(--font-display)" };
    hero = "full-bleed";
    projects = "masonry";
    skills = "bars";
  }

  return { hero, about, projects, skills, theme };
}
