"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Kanban as KanbanIcon,
  Clock,
  Network,
  Bot,
  Settings,
  Sun,
  Moon,
  FolderOpen,
  FolderKanban,
  Plus,
  ChevronDown,
  Activity,
  HardDrive,
  Plug,
  Wifi,
  WifiOff,
  X,
  Pencil,
  Trash2,
} from "lucide-react";

import Dashboard from "./Dashboard";
import Kanban from "./Kanban";
import Scheduler from "./Scheduler";
import OrgChart from "./OrgChart";
import AgentForge from "./AgentForge";
import SettingsPage from "./Settings";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { name: "Projects", icon: FolderKanban, id: "projects" },
  { name: "Kanban", icon: KanbanIcon, id: "kanban" },
  { name: "Scheduler", icon: Clock, id: "scheduler" },
  { name: "Org Chart", icon: Network, id: "orgchart" },
  { name: "Agent Forge", icon: Bot, id: "agents" },
  { name: "Settings", icon: Settings, id: "settings" },
];

export default function RootLayout() {
  const { theme, setTheme, projects: storeProjects, activeProjectId, setActiveProject, addProject, tasks: storeTasks } = useAppStore();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>(storeProjects);
  const [tasks, setTasks] = useState<any[]>([]);
  const [newProject, setNewProject] = useState({
    name: "",
    shortDescription: "",
    tech: "",
    author: "",
    fullPRD: "",
    priority: "medium",
  });
  const [gatewayStatus, setGatewayStatus] = useState<{ connected: boolean; checking: boolean }>({ connected: false, checking: true });
  const [systemInfo, setSystemInfo] = useState<{ totalMemory: string; usedMemory: string; percentage: number } | null>(null);

  // Fetch projects from API on mount and add to store
  const { addTask } = useAppStore();
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.projects) {
          setProjects(data.projects);
          // Also fetch tasks for each project
          const allTasks: any[] = [];
          for (const p of data.projects) {
            const taskRes = await fetch(`/api/projects?projectId=${p.id}`);
            const taskData = await taskRes.json();
            if (taskData.tasks) {
              // Add tasks to store
              taskData.tasks.forEach((task: any) => {
                addTask(task);
              });
              allTasks.push(...taskData.tasks);
            }
          }
          setTasks(allTasks);
        }
      } catch (e) {
        console.error("Failed to fetch projects", e);
      }
    };
    fetchProjects();
  }, [addTask]);

  // Sync store projects to local state
  useEffect(() => {
    setProjects(storeProjects);
  }, [storeProjects]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const checkGateway = async () => {
      try {
        const res = await fetch("/api/gateway");
        const data = await res.json();
        setGatewayStatus({ connected: data.connected, checking: false });
      } catch {
        setGatewayStatus({ connected: false, checking: false });
      }
    };
    checkGateway();
    const interval = setInterval(checkGateway, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkSystem = async () => {
      try {
        const res = await fetch("/api/system");
        const data = await res.json();
        if (data.totalMemory) setSystemInfo(data);
      } catch {
        // fallback to defaults
      }
    };
    checkSystem();
    const interval = setInterval(checkSystem, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div className="h-screen bg-background" />;

  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <Activity className="w-6 h-6" />
            MissionClaw
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Mission Control v1.2</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeNav === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
          {/* Projects Section */}
          <div className="pt-4 mt-4 border-t border-border">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Projects</span>
              <button
                onClick={() => setShowCreateProject(true)}
                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            {projects.length === 0 ? (
              <p className="px-3 text-xs text-muted-foreground">No projects yet</p>
            ) : (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setActiveProject(project.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                      activeProjectId === project.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span className="truncate">{project.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
          <div className="relative">
            <button
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors"
            >
              <FolderOpen className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{activeProject?.name || "Select Project"}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
            {projectDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-popover border border-border rounded-lg shadow-lg z-50">
                <div className="p-2">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => { setActiveProject(project.id); setProjectDropdownOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary",
                        activeProjectId === project.id && "bg-primary/10 text-primary"
                      )}
                    >
                      <FolderOpen className="w-4 h-4" />
                      {project.name}
                    </button>
                  ))}
                  {projects.length > 0 && <div className="my-1 border-t border-border" />}
                  <button
                    onClick={() => {
                      const name = prompt("Project name:");
                      if (name) {
                        const path = prompt("Project path (e.g., ~/projects/myapp):");
                        addProject({
                          id: `project-${Date.now()}`,
                          name,
                          path: path || "",
                          createdAt: new Date(),
                        });
                      }
                      setProjectDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary rounded-md"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Gateway Connection Status */}
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm",
              gatewayStatus.checking ? "bg-secondary text-muted-foreground" : 
              gatewayStatus.connected ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
            )}>
              {gatewayStatus.checking ? (
                <Wifi className="w-4 h-4 animate-pulse" />
              ) : gatewayStatus.connected ? (
                <Wifi className="w-4 h-4" />
              ) : (
                <WifiOff className="w-4 h-4" />
              )}
              <span className="font-medium">
                {gatewayStatus.checking ? "Checking..." : gatewayStatus.connected ? "Gateway" : "Disconnected"}
              </span>
            </div>
            {/* System RAM */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <HardDrive className="w-4 h-4" />
              <span>RAM</span>
              {systemInfo ? (
                <>
                  <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all",
                        systemInfo.percentage > 80 ? "bg-red-500" : systemInfo.percentage > 60 ? "bg-amber-500" : "bg-primary"
                      )} 
                      style={{ width: `${systemInfo.percentage}%` }} 
                    />
                  </div>
                  <span className="text-xs">{systemInfo.usedMemory}/{systemInfo.totalMemory}GB</span>
                </>
              ) : (
                <>
                  <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-primary rounded-full" />
                  </div>
                  <span className="text-xs">8GB</span>
                </>
              )}
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {activeNav === "dashboard" && <Dashboard />}
          {activeNav === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Projects</h2>
                  <p className="text-muted-foreground">View and manage all projects</p>
                </div>
                <button
                  onClick={() => setShowCreateProject(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </button>
              </div>
              
              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No projects yet</p>
                  <button
                    onClick={() => setShowCreateProject(true)}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
                  >
                    Create your first project
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{project.name}</h3>
                            {project.priority && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                project.priority === "urgent" ? "bg-red-500/10 text-red-500" :
                                project.priority === "high" ? "bg-orange-500/10 text-orange-500" :
                                "bg-secondary text-muted-foreground"
                              }`}>
                                {project.priority}
                              </span>
                            )}
                          </div>
                          {project.shortDescription && (
                            <p className="text-sm text-muted-foreground mt-1">{project.shortDescription}</p>
                          )}
                          {project.tech && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.tech.split(",").map((t: string, i: number) => (
                                <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                  {t.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                          {project.author && (
                            <p className="text-xs text-muted-foreground mt-2">by {project.author}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingProject(project);
                              setNewProject({
                                name: project.name || "",
                                shortDescription: project.shortDescription || "",
                                tech: project.tech || "",
                                author: project.author || "",
                                fullPRD: project.fullPRD || "",
                                priority: project.priority || "medium",
                              });
                              setShowCreateProject(true);
                            }}
                            className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm("Delete this project?")) {
                                try {
                                  await fetch(`/api/projects?projectId=${project.id}`, { method: "DELETE" });
                                  setProjects(projects.filter(p => p.id !== project.id));
                                } catch (e) {
                                  console.error("Failed to delete", e);
                                }
                              }
                            }}
                            className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {project.fullPRD && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Full PRD</p>
                          <pre className="text-xs bg-secondary p-2 rounded max-h-32 overflow-y-auto whitespace-pre-wrap">
                            {project.fullPRD}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeNav === "kanban" && <Kanban />}
          {activeNav === "scheduler" && <Scheduler />}
          {activeNav === "orgchart" && <OrgChart />}
          {activeNav === "agents" && <AgentForge />}
          {activeNav === "settings" && <SettingsPage />}
        </main>
      </div>

      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">{editingProject ? "Edit Project" : "Create New Project"}</h3>
              <button onClick={() => { setShowCreateProject(false); setEditingProject(null); }} className="p-1 hover:bg-secondary rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Project Title *</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="e.g., E-commerce Platform"
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Short Description</label>
                <input
                  type="text"
                  value={newProject.shortDescription}
                  onChange={(e) => setNewProject({ ...newProject, shortDescription: e.target.value })}
                  placeholder="Brief overview of the project"
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Tech Stack</label>
                <input
                  type="text"
                  value={newProject.tech}
                  onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
                  placeholder="e.g., React, Node.js, PostgreSQL, AWS"
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Author / Owner</label>
                <input
                  type="text"
                  value={newProject.author}
                  onChange={(e) => setNewProject({ ...newProject, author: e.target.value })}
                  placeholder="Who is requesting this project"
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Full PRD (Product Requirements Document)</label>
                <textarea
                  value={newProject.fullPRD}
                  onChange={(e) => setNewProject({ ...newProject, fullPRD: e.target.value })}
                  placeholder="Detailed project requirements, features, goals, user stories, acceptance criteria..."
                  className="w-full h-40 bg-secondary border border-border rounded-lg px-3 py-2 text-sm resize-none"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Priority</label>
                <select
                  value={newProject.priority}
                  onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={async () => {
                  if (!newProject.name) return;
                  
                  if (editingProject) {
                    // Update existing project via API
                    try {
                      await fetch(`/api/projects?projectId=${editingProject.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          name: newProject.name,
                          shortDescription: newProject.shortDescription,
                          tech: newProject.tech,
                          author: newProject.author,
                          fullPRD: newProject.fullPRD,
                          priority: newProject.priority,
                        }),
                      });
                      // Refresh
                      const res = await fetch("/api/projects");
                      const data = await res.json();
                      if (data.projects) setProjects(data.projects);
                    } catch (e) {
                      console.error("Failed to update", e);
                    }
                  } else {
                    // Create new project via API
                    try {
                      const res = await fetch("/api/projects", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          projectName: newProject.name,
                          shortDescription: newProject.shortDescription,
                          tech: newProject.tech,
                          author: newProject.author,
                          fullPRD: newProject.fullPRD,
                          priority: newProject.priority,
                        }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        // Refresh projects list
                        const projRes = await fetch("/api/projects");
                        const projData = await projRes.json();
                        if (projData.projects) setProjects(projData.projects);
                      }
                    } catch (e) {
                      console.error("Failed to create project", e);
                    }
                  }
                  
                  setShowCreateProject(false);
                  setEditingProject(null);
                  setNewProject({ name: "", shortDescription: "", tech: "", author: "", fullPRD: "", priority: "medium" });
                }}
                disabled={!newProject.name}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {editingProject ? "Update Project" : "Create Project"}
              </button>
              <button
                onClick={() => {
                  setShowCreateProject(false);
                  setEditingProject(null);
                  setNewProject({ name: "", shortDescription: "", tech: "", author: "", fullPRD: "", priority: "medium" });
                }}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}