"use client";

import { createContext, useContext, useReducer } from "react";
import { generateContent } from "@/lib/mockAI";
import { clearPersistedState } from "@/lib/navigation";

const initialState = {
  page: "landing",
  theme: "dark",
  data: {
    name: "",
    role: "",
    bio: "",
    photoUrl: "",
    photoFile: null,
    skills: [],
    projects: [],
    education: [],
    services: [],
    stats: { projects: "", satisfaction: "", years: "" },
    email: "",
    github: "",
    linkedin: "",
    facebook: "",
  },
  content: null,
  mode: null,
  selectedTemplate: null,
  layoutJson: null,
  published: false,
  slug: "",
  portfolioId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "GO_TO":
      return { ...state, page: action.page };

    case "RESTORE": {
      const p = action.payload || {};
      return {
        ...state,
        page: p.page ?? state.page,
        theme: p.theme ?? state.theme,
        data: p.data ? { ...state.data, ...p.data, photoFile: null } : state.data,
        content: p.content ?? state.content,
        mode: p.mode ?? state.mode,
        selectedTemplate: p.selectedTemplate ?? state.selectedTemplate,
        layoutJson: p.layoutJson ?? state.layoutJson,
        published: p.published ?? state.published,
        slug: p.slug ?? state.slug,
        portfolioId: p.portfolioId ?? state.portfolioId,
      };
    }

    case "TOGGLE_THEME":
      return { ...state, theme: state.theme === "dark" ? "light" : "dark" };

    case "SET_FIELD":
      return { ...state, data: { ...state.data, [action.field]: action.value } };

    case "ADD_SKILL":
      if (!action.value.trim()) return state;
      return { ...state, data: { ...state.data, skills: [...state.data.skills, action.value.trim()] } };

    case "REMOVE_SKILL": {
      const skills = state.data.skills.filter((_, i) => i !== action.index);
      return { ...state, data: { ...state.data, skills } };
    }

    case "ADD_PROJECT":
      return {
        ...state,
        data: { ...state.data, projects: [...state.data.projects, { name: "", description: "", tech: "", link: "", image: "" }] },
      };

    case "UPDATE_PROJECT": {
      const projects = state.data.projects.map((p, i) =>
        i === action.index ? { ...p, [action.field]: action.value } : p
      );
      return { ...state, data: { ...state.data, projects } };
    }

    case "REMOVE_PROJECT": {
      const projects = state.data.projects.filter((_, i) => i !== action.index);
      return { ...state, data: { ...state.data, projects } };
    }

    case "ADD_EDU":
      return {
        ...state,
        data: { ...state.data, education: [...state.data.education, { degree: "", institution: "", year: "" }] },
      };

    case "UPDATE_EDU": {
      const education = state.data.education.map((e, i) =>
        i === action.index ? { ...e, [action.field]: action.value } : e
      );
      return { ...state, data: { ...state.data, education } };
    }

    case "REMOVE_EDU": {
      const education = state.data.education.filter((_, i) => i !== action.index);
      return { ...state, data: { ...state.data, education } };
    }

    case "ADD_SERVICE":
      return { ...state, data: { ...state.data, services: [...state.data.services, { title: "" }] } };

    case "UPDATE_SERVICE": {
      const services = state.data.services.map((s, i) =>
        i === action.index ? { ...s, title: action.value } : s
      );
      return { ...state, data: { ...state.data, services } };
    }

    case "REMOVE_SERVICE": {
      const services = state.data.services.filter((_, i) => i !== action.index);
      return { ...state, data: { ...state.data, services } };
    }

    case "SET_STAT":
      return { ...state, data: { ...state.data, stats: { ...state.data.stats, [action.field]: action.value } } };

    case "SET_CONTENT":
      return { ...state, content: action.content };

    case "SET_PORTFOLIO_ID":
      return { ...state, portfolioId: action.id };

    case "UPDATE_CONTENT_FIELD":
      return { ...state, content: { ...state.content, [action.field]: action.value } };

    case "UPDATE_PROJECT_DESC": {
      const projectDescriptions = state.content.projectDescriptions.map((p, i) =>
        i === action.index ? { ...p, description: action.value } : p
      );
      return { ...state, content: { ...state.content, projectDescriptions } };
    }

    case "REGENERATE_FIELD": {
      const fresh = generateContent(state.data);
      if (action.field === "projectDescriptions") {
        return { ...state, content: { ...state.content, projectDescriptions: fresh.projectDescriptions } };
      }
      return { ...state, content: { ...state.content, [action.field]: fresh[action.field] } };
    }

    case "SET_MODE":
      return { ...state, mode: action.mode };

    case "SET_TEMPLATE":
      return { ...state, selectedTemplate: action.id };

    case "SET_LAYOUT":
      return { ...state, layoutJson: action.layout };

    case "PUBLISH":
      return { ...state, published: true, slug: action.slug };

    case "RESET":
      clearPersistedState();
      return { ...initialState, theme: state.theme };

    default:
      return state;
  }
}

const PortfolioStateContext = createContext(null);
const PortfolioDispatchContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <PortfolioStateContext.Provider value={state}>
      <PortfolioDispatchContext.Provider value={dispatch}>{children}</PortfolioDispatchContext.Provider>
    </PortfolioStateContext.Provider>
  );
}

export function usePortfolioState() {
  const ctx = useContext(PortfolioStateContext);
  if (!ctx) throw new Error("usePortfolioState must be used inside PortfolioProvider");
  return ctx;
}

export function usePortfolioDispatch() {
  const ctx = useContext(PortfolioDispatchContext);
  if (!ctx) throw new Error("usePortfolioDispatch must be used inside PortfolioProvider");
  return ctx;
}