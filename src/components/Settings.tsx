"use client";

import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";
import { Settings, Palette, Database, Key, HardDrive, Trash2, Download, Upload } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme, projects, tasks, agents, schedules, addProject } = useAppStore();

  const handleAddProject = () => {
    const name = prompt("Enter project name:");
    if (!name) return;
    const path = prompt("Enter project path (e.g., /Users/suresh/projects/myapp):");
    if (!path) return;
    addProject({
      id: `project-${Date.now()}`,
      name,
      path,
      createdAt: new Date(),
    });
  };

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Configure MissionClaw preferences</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Appearance */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-secondary rounded-lg">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium">Appearance</h3>
              <p className="text-sm text-muted-foreground">Customize the look and feel</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setTheme("dark")}
              className={cn(
                "flex-1 p-3 rounded-lg border transition-colors",
                theme === "dark" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              )}
            >
              <div className="w-full h-8 rounded bg-[#0D1117] mb-2" />
              <span className="text-sm">Dark (Obsidian)</span>
            </button>
            <button
              onClick={() => setTheme("light")}
              className={cn(
                "flex-1 p-3 rounded-lg border transition-colors",
                theme === "light" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              )}
            >
              <div className="w-full h-8 rounded bg-[#F8FAFC] mb-2 border border-border" />
              <span className="text-sm">Light (Clean)</span>
            </button>
          </div>
        </div>

        {/* Projects */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium">Projects</h3>
                <p className="text-sm text-muted-foreground">Manage project workspaces</p>
              </div>
            </div>
            <button
              onClick={handleAddProject}
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
            >
              Add Project
            </button>
          </div>
          <div className="space-y-2">
            {projects.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No projects added yet</p>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{project.name}</p>
                    <p className="text-xs text-muted-foreground">{project.path}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-secondary rounded-lg">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium">Data Management</h3>
              <p className="text-sm text-muted-foreground">Storage and export options</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 p-3 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors">
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <button className="flex items-center justify-center gap-2 p-3 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors">
              <Upload className="w-4 h-4" />
              Import Data
            </button>
          </div>
        </div>

        {/* API Keys (Placeholder) */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-secondary rounded-lg">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium">API Keys</h3>
              <p className="text-sm text-muted-foreground">Configure external service keys</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm">OpenAI API Key</span>
              <span className="text-xs text-muted-foreground">Not configured</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm">Anthropic API Key</span>
              <span className="text-xs text-muted-foreground">Not configured</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm">Google Gemini API Key</span>
              <span className="text-xs text-muted-foreground">Not configured</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            API keys are stored in <code className="bg-secondary px-1 rounded">.env</code> and never exposed to the frontend.
          </p>
        </div>

        {/* Danger Zone */}
        <div className="bg-card border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-medium text-red-500">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">Irreversible actions</p>
            </div>
          </div>
          <button
            onClick={clearAllData}
            className="w-full flex items-center justify-center gap-2 p-3 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Data
          </button>
        </div>

        {/* Stats */}
        <div className="text-center text-sm text-muted-foreground py-4">
          <p>MissionClaw v1.2 • {projects.length} projects • {tasks.length} tasks • {agents.length} agents • {schedules.length} schedules</p>
        </div>
      </div>
    </div>
  );
}