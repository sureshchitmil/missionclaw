"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";
import { Bot, FolderKanban, Clock, Activity, CheckCircle2, Clock3, PlayCircle, AlertCircle, Plus } from "lucide-react";

const statusConfig = {
  backlog: { label: "Backlog", color: "text-muted-foreground", icon: Clock3 },
  todo: { label: "To Do", color: "text-amber-500", icon: Clock3 },
  in_progress: { label: "In Progress", color: "text-primary", icon: PlayCircle },
  review: { label: "Review", color: "text-purple-500", icon: AlertCircle },
  done: { label: "Done", color: "text-green-500", icon: CheckCircle2 },
};

export default function Dashboard() {
  const { projects, activeProjectId, agents, tasks, schedules } = useAppStore();

  const activeProject = projects.find((p) => p.id === activeProjectId);
  
  // Calculate real stats from store
  const activeAgents = agents.filter(a => a.status === "active").length;
  const openTasks = tasks.filter(t => t.status !== "done").length;
  const scheduledCount = schedules.filter(s => s.enabled).length;
  const completedToday = tasks.filter(t => t.status === "done").length;
  
  const projectTasks = activeProjectId ? tasks.filter(t => t.projectId === activeProjectId) : [];
  const recentTasks = projectTasks.slice(-4).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mission Control</h2>
        <p className="text-muted-foreground">
          {activeProject ? `Working on ${activeProject.name}` : "Select a project to get started"}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Agents</p>
              <p className="text-2xl font-bold mt-1">{activeAgents}</p>
            </div>
            <Bot className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Open Tasks</p>
              <p className="text-2xl font-bold mt-1">{openTasks}</p>
            </div>
            <FolderKanban className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <p className="text-2xl font-bold mt-1">{scheduledCount}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold mt-1">{completedToday}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Project Details Section */}
      {activeProject && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">{activeProject.name}</h3>
            {activeProject.author && (
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                by {activeProject.author}
              </span>
            )}
          </div>
          
          {activeProject.shortDescription && (
            <p className="text-muted-foreground mb-4">{activeProject.shortDescription}</p>
          )}
          
          {activeProject.tech && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {activeProject.tech.split(",").map((t, i) => (
                  <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {activeProject.fullPRD && (
            <div>
              <p className="text-sm font-medium mb-2">Full PRD</p>
              <div className="bg-secondary rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-xs whitespace-pre-wrap font-mono">{activeProject.fullPRD}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Recent Tasks
          </h3>
          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => {
                const status = statusConfig[task.status as keyof typeof statusConfig];
                return (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      {task.assignedAgent && (
                        <p className="text-xs text-muted-foreground mt-0.5">@{task.assignedAgent}</p>
                      )}
                    </div>
                    <span className={cn("text-xs font-medium flex items-center gap-1", status.color)}>
                      <status.icon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No tasks yet</p>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            Agent Status
          </h3>
          {agents.length > 0 ? (
            <div className="space-y-3">
              {agents.slice(0, 6).map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    {agent.avatar && (
                      <img src={agent.avatar} alt={agent.name} className="w-6 h-6 rounded-full object-cover" />
                    )}
                    <div>
                      <span className="font-medium text-sm">{agent.name}</span>
                      {agent.team && <span className="text-xs text-muted-foreground ml-2">({agent.team})</span>}
                    </div>
                  </div>
                  <div className={cn("w-2 h-2 rounded-full", agent.status === "active" ? "bg-green-500" : agent.status === "error" ? "bg-red-500" : "bg-muted-foreground")} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No agents configured yet</p>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            + New Task
          </button>
          <button className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
            + Add Agent
          </button>
          <button className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
            + Create Schedule
          </button>
        </div>
      </div>
    </div>
  );
}