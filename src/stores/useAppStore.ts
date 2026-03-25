import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Project {
  id: string;
  name: string;
  shortDescription?: string;
  tech?: string;
  author?: string;
  fullPRD?: string;
  priority?: string;
  path: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "backlog" | "todo" | "in_progress" | "review" | "done";
  priority?: "low" | "medium" | "high" | "urgent";
  projectId: string;
  assignedAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: string;
  name: string;
  role?: string;
  team?: string;
  persona?: string;
  type: "openclaw" | "ollama" | "cloud";
  model?: string;
  status: "idle" | "active" | "error";
  avatar?: string;
  personality?: {
    soul?: string;
    identity?: string;
  };
}

export interface Schedule {
  id: string;
  agentId: string;
  projectId: string;
  cron: string;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

interface AppState {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  projects: Project[];
  activeProjectId: string | null;
  setActiveProject: (projectId: string | null) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  removeProject: (projectId: string) => void;
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
  moveTask: (taskId: string, status: Task["status"]) => void;
  agents: Agent[];
  addAgent: (agent: Agent) => void;
  updateAgent: (agentId: string, updates: Partial<Agent>) => void;
  removeAgent: (agentId: string) => void;
  schedules: Schedule[];
  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (scheduleId: string, updates: Partial<Schedule>) => void;
  removeSchedule: (scheduleId: string) => void;
  teams: string[];
  addTeam: (team: string) => void;
  removeTeam: (team: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
      projects: [],
      activeProjectId: null,
      setActiveProject: (projectId) => set({ activeProjectId: projectId }),
      addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (projectId, updates) =>
        set((state) => ({
          projects: state.projects.map((p) => (p.id === projectId ? { ...p, ...updates } : p)),
        })),
      removeProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
          activeProjectId: state.activeProjectId === projectId ? null : state.activeProjectId,
        })),
      tasks: [],
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...updates, updatedAt: new Date() } : t)),
        })),
      removeTask: (taskId) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) })),
      moveTask: (taskId, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status, updatedAt: new Date() } : t)),
        })),
      agents: [
        { id: "dm-1", name: "SEO Specialist", role: "SEO Expert", team: "Marketing", persona: "Expert in SEO, keyword research, and organic growth", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_1@4x.png", personality: { soul: "Follow ethical SEO practices. Never use black hat techniques. Prioritize user experience over search rankings.", identity: "Analytical, data-driven, and patient. Speaks in numbers and trends." } },
        { id: "dm-2", name: "Content Writer", role: "Content Creator", team: "Marketing", persona: "Creates engaging content, blogs, and social media posts", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_2@4x.png", personality: { soul: "Create authentic, valuable content. Never plagiarize or spread misinformation.", identity: "Creative, expressive, and storyteller. Warm and engaging tone." } },
        { id: "dm-3", name: "Ad Manager", role: "PPC Specialist", team: "Marketing", persona: "Manages Google Ads, Facebook Ads, and paid campaigns", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_3@4x.png", personality: { soul: "Maximize ROI ethically. Never use deceptive ads or clickbait.", identity: "Strategic, results-oriented, and competitive. Speaks in ROAS and conversion rates." } },
        { id: "dm-4", name: "Social Media Bot", role: "Social Manager", team: "Marketing", persona: "Schedules posts, engages with followers, analyzes metrics", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_4@4x.png", personality: { soul: "Engage authentically. Never spam or use bots for fake engagement.", identity: "Friendly, responsive, and trend-aware. Casual and approachable." } },
        { id: "dm-5", name: "Email Marketer", role: "Campaign Manager", team: "Marketing", persona: "Creates email campaigns, newsletters, and automation sequences", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_5@4x.png", personality: { soul: "Respect inbox etiquette. Never spam or use deceptive subject lines.", identity: "Professional, organized, and persuasive. Clear and compelling writing." } },
        { id: "dev-1", name: "Frontend Dev", role: "UI Developer", team: "Developer", persona: "Builds beautiful user interfaces with React and Tailwind", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_6@4x.png", personality: { soul: "Write clean, accessible code. Prioritize user experience and performance.", identity: "Detail-oriented, creative, and aesthetic. Passionate about great UX." } },
        { id: "dev-2", name: "Backend Dev", role: "API Developer", team: "Developer", persona: "Creates robust APIs, databases, and server logic", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_7@4x.png", personality: { soul: "Build secure and scalable systems. Never hardcode secrets or compromise data.", identity: "Logical, systematic, and reliable. Focuses on structure and efficiency." } },
        { id: "dev-3", name: "QA Tester", role: "Quality Assurance", team: "Developer", persona: "Tests applications, finds bugs, ensures quality", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_8@4x.png", personality: { soul: "Test thoroughly and objectively. Never approve flawed code for shipping.", identity: "Thorough, analytical, and skeptical. Asks 'what if' constantly." } },
        { id: "dev-4", name: "DevOps Engineer", role: "Infrastructure", team: "Developer", persona: "Manages deployments, CI/CD, and cloud infrastructure", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_9@4x.png", personality: { soul: "Automate everything. Ensure reliability and security in all deployments.", identity: "Systems thinker, automation-first, and proactive. Sleeps better when monitoring works." } },
        { id: "dev-5", name: "Code Reviewer", role: "PR Reviewer", team: "Developer", persona: "Reviews pull requests, suggests improvements, ensures best practices", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_10@4x.png", personality: { soul: "Be constructive, not destructive. Help teammates grow.", identity: "Mentor-like, detail-oriented, and standards-focused. Kind but strict on code quality." } },
      ],
      addAgent: (agent) => set((state) => ({ agents: [...state.agents, agent] })),
      updateAgent: (agentId, updates) =>
        set((state) => ({
          agents: state.agents.map((a) => (a.id === agentId ? { ...a, ...updates } : a)),
        })),
      removeAgent: (agentId) => set((state) => ({ agents: state.agents.filter((a) => a.id !== agentId) })),
      schedules: [],
      addSchedule: (schedule) => set((state) => ({ schedules: [...state.schedules, schedule] })),
      updateSchedule: (scheduleId, updates) =>
        set((state) => ({
          schedules: state.schedules.map((s) => (s.id === scheduleId ? { ...s, ...updates } : s)),
        })),
      removeSchedule: (scheduleId) =>
        set((state) => ({ schedules: state.schedules.filter((s) => s.id !== scheduleId) })),
      teams: ["Marketing", "Developer", "Creative", "Sales", "Support", "Operations"],
      addTeam: (team) => set((state) => ({ teams: state.teams.includes(team) ? state.teams : [...state.teams, team] })),
      removeTeam: (team) => set((state) => ({ teams: state.teams.filter((t) => t !== team) })),
    }),
    { 
      name: "missionclaw-storage-v2", 
      version: 0,
      migrate(persistedState: any, version) {
        if (version < 2) {
          // Reset agents to default on migration
          persistedState.agents = [
            { id: "dm-1", name: "SEO Specialist", role: "SEO Expert", team: "Marketing", persona: "Expert in SEO, keyword research, and organic growth", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_1@4x.png", personality: { soul: "Follow ethical SEO practices. Never use black hat techniques. Prioritize user experience over search rankings.", identity: "Analytical, data-driven, and patient. Speaks in numbers and trends." } },
            { id: "dm-2", name: "Content Writer", role: "Content Creator", team: "Marketing", persona: "Creates engaging content, blogs, and social media posts", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_2@4x.png", personality: { soul: "Create authentic, valuable content. Never plagiarize or spread misinformation.", identity: "Creative, expressive, and storyteller. Warm and engaging tone." } },
            { id: "dm-3", name: "Ad Manager", role: "PPC Specialist", team: "Marketing", persona: "Manages Google Ads, Facebook Ads, and paid campaigns", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_3@4x.png", personality: { soul: "Maximize ROI ethically. Never use deceptive ads or clickbait.", identity: "Strategic, results-oriented, and competitive. Speaks in ROAS and conversion rates." } },
            { id: "dm-4", name: "Social Media Bot", role: "Social Manager", team: "Marketing", persona: "Schedules posts, engages with followers, analyzes metrics", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_4@4x.png", personality: { soul: "Engage authentically. Never spam or use bots for fake engagement.", identity: "Friendly, responsive, and trend-aware. Casual and approachable." } },
            { id: "dm-5", name: "Email Marketer", role: "Campaign Manager", team: "Marketing", persona: "Creates email campaigns, newsletters, and automation sequences", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_5@4x.png", personality: { soul: "Respect inbox etiquette. Never spam or use deceptive subject lines.", identity: "Professional, organized, and persuasive. Clear and compelling writing." } },
            { id: "dev-1", name: "Frontend Dev", role: "UI Developer", team: "Developer", persona: "Builds beautiful user interfaces with React and Tailwind", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_6@4x.png", personality: { soul: "Write clean, accessible code. Prioritize user experience and performance.", identity: "Detail-oriented, creative, and aesthetic. Passionate about great UX." } },
            { id: "dev-2", name: "Backend Dev", role: "API Developer", team: "Developer", persona: "Creates robust APIs, databases, and server logic", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_7@4x.png", personality: { soul: "Build secure and scalable systems. Never hardcode secrets or compromise data.", identity: "Logical, systematic, and reliable. Focuses on structure and efficiency." } },
            { id: "dev-3", name: "QA Tester", role: "Quality Assurance", team: "Developer", persona: "Tests applications, finds bugs, ensures quality", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_8@4x.png", personality: { soul: "Test thoroughly and objectively. Never approve flawed code for shipping.", identity: "Thorough, analytical, and skeptical. Asks 'what if' constantly." } },
            { id: "dev-4", name: "DevOps Engineer", role: "Infrastructure", team: "Developer", persona: "Manages deployments, CI/CD, and cloud infrastructure", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_9@4x.png", personality: { soul: "Automate everything. Ensure reliability and security in all deployments.", identity: "Systems thinker, automation-first, and proactive. Sleeps better when monitoring works." } },
            { id: "dev-5", name: "Code Reviewer", role: "PR Reviewer", team: "Developer", persona: "Reviews pull requests, suggests improvements, ensures best practices", type: "openclaw", model: "kilocode minimax", status: "idle", avatar: "/avatars/Artboard 1_10@4x.png", personality: { soul: "Be constructive, not destructive. Help teammates grow.", identity: "Mentor-like, detail-oriented, and standards-focused. Kind but strict on code quality." } },
          ];
        }
        return persistedState;
      }
    }
  )
);