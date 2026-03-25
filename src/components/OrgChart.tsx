"use client";

import { useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";
import { Network, Bot, ChevronRight, ChevronDown, Plus, Minus, ArrowDownToLine, ArrowUpFromLine, Users, Code, Megaphone, Settings } from "lucide-react";

interface AgentNode {
  id: string;
  name: string;
  type: string;
  status: string;
  team?: string;
  role?: string;
  avatar?: string;
  children?: AgentNode[];
}

const teamIcons: Record<string, any> = {
  Marketing: Megaphone,
  Developer: Code,
  Creative: Bot,
  Sales: Users,
  Support: Settings,
  Operations: Settings,
};

export default function OrgChart() {
  const { agents } = useAppStore();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["root"]));
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Build hierarchy based on teams
  const teams = [...new Set(agents.map(a => a.team).filter(Boolean))] as string[];
  
  const rootNode: AgentNode = {
    id: "root",
    name: "Mission Control",
    type: "root",
    status: "active",
    children: teams.length > 0 ? teams.map((team) => ({
      id: `team-${team}`,
      name: `${team} Team`,
      type: "team",
      status: "active",
      team,
      children: agents.filter(a => a.team === team).map(a => ({
        id: a.id,
        name: a.name,
        type: a.type,
        status: a.status,
        team: a.team,
        role: a.role,
        avatar: a.avatar,
      }))
    })) : [
      { id: "demo-1", name: "Frontend Developer", type: "ollama", status: "idle", team: "Developer" },
      { id: "demo-2", name: "Backend Architect", type: "openclaw", status: "active", team: "Developer" },
    ],
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpanded(newExpanded);
  };

  const expandAll = () => {
    const allIds = new Set<string>(["root"]);
    teams.forEach(team => allIds.add(`team-${team}`));
    agents.forEach(a => allIds.add(a.id));
    setExpanded(allIds);
  };

  const renderNode = (node: AgentNode, level: number = 0, isLast: boolean = false) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded.has(node.id);
    const isTeam = node.type === "team";
    const TeamIcon = teamIcons[node.team || ""];

    return (
      <div key={node.id} className="relative">
        <div className="flex items-center gap-2">
          {level > 0 && (
            <div className="flex flex-col items-center">
              <div className="w-px h-4 bg-border" />
              <div className="w-8 h-px bg-border" />
            </div>
          )}
          <div
            onClick={() => {
              if (node.id !== "root") {
                setSelectedAgent(node.id);
                if (hasChildren) toggleExpand(node.id);
              }
            }}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors",
              selectedAgent === node.id ? "bg-primary/10 border border-primary/30" : "bg-card border border-border hover:border-primary/30",
              node.id === "root" && "bg-primary/5 border-none",
              isTeam && "bg-secondary/50 border-dashed"
            )}
          >
            {hasChildren && node.id !== "root" && (
              <button
                onClick={(e) => { e.stopPropagation(); toggleExpand(node.id); }}
                className="p-0.5 hover:bg-secondary rounded"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            )}
            {!hasChildren && node.id !== "root" && <div className="w-5" />}
            
            {node.id === "root" && (
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Network className="w-5 h-5 text-primary" />
              </div>
            )}

            {isTeam && !node.id.includes("root") && (
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                {TeamIcon ? <TeamIcon className="w-5 h-5 text-purple-500" /> : <Users className="w-5 h-5 text-purple-500" />}
              </div>
            )}

            {!isTeam && node.id !== "root" && (
              <>
                {node.avatar ? (
                  <img src={node.avatar} alt={node.name} className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    node.status === "active" ? "bg-green-500/10" : node.status === "error" ? "bg-red-500/10" : "bg-secondary"
                  )}>
                    <Bot className={cn(
                      "w-5 h-5",
                      node.status === "active" ? "text-green-500" : node.status === "error" ? "text-red-500" : "text-muted-foreground"
                    )} />
                  </div>
                )}
              </>
            )}
            
            <div>
              <p className="font-medium text-sm">{node.name}</p>
              {node.id !== "root" && !isTeam && (
                <p className="text-xs text-muted-foreground capitalize">{node.role || node.type} • {node.status}</p>
              )}
              {isTeam && (
                <p className="text-xs text-muted-foreground">{node.children?.length} agents</p>
              )}
            </div>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-4 mt-2 space-y-2">
            {node.children!.map((child, idx) => renderNode(child, level + 1, idx === node.children!.length - 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex gap-6">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Organization Chart</h2>
            <p className="text-muted-foreground">Agent hierarchy by team</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Expand All
            </button>
            <button
              onClick={() => setExpanded(new Set(["root"]))}
              className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors"
            >
              <Minus className="w-4 h-4" />
              Collapse All
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 overflow-auto max-h-[calc(100vh-220px)]">
          {renderNode(rootNode)}
        </div>
      </div>

      <div className="w-80">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-medium mb-4">Agent Details</h3>
          {selectedAgent ? (
            <div className="space-y-4">
              {(() => {
                const agent = agents.find((a) => a.id === selectedAgent);
                if (!agent) {
                  return <p className="text-sm text-muted-foreground">Select an agent to view details</p>;
                }
                return (
                  <>
                    <div className="flex items-center gap-3">
                      {agent.avatar ? (
                        <img src={agent.avatar} alt={agent.name} className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center">
                          <Bot className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground">{agent.role}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground">Team</label>
                        <p className="text-sm font-medium">{agent.team || "No Team"}</p>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Type</label>
                        <p className="text-sm font-medium capitalize">{agent.type}</p>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Model</label>
                        <p className="text-sm font-medium">{agent.model || "Default"}</p>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Status</label>
                        <p className={cn(
                          "text-sm font-medium capitalize",
                          agent.status === "active" && "text-green-500",
                          agent.status === "error" && "text-red-500",
                          agent.status === "idle" && "text-muted-foreground"
                        )}>{agent.status}</p>
                      </div>
                    </div>

                    {agent.personality && (
                      <div>
                        <label className="text-xs text-muted-foreground">SOUL</label>
                        <p className="text-sm bg-secondary p-2 rounded mt-1">{agent.personality.soul}</p>
                      </div>
                    )}

                    {agent.personality?.identity && (
                      <div>
                        <label className="text-xs text-muted-foreground">IDENTITY</label>
                        <p className="text-sm bg-secondary p-2 rounded mt-1">{agent.personality.identity}</p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-border flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90">
                        <ArrowDownToLine className="w-4 h-4" />
                        Assign Task
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Click on an agent node to view details</p>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-4 mt-4">
          <h3 className="font-medium mb-3">Teams</h3>
          <div className="space-y-2">
            {teams.map((team) => {
              const teamAgents = agents.filter(a => a.team === team);
              const activeCount = teamAgents.filter(a => a.status === "active").length;
              const TeamIcon = teamIcons[team];
              return (
                <div key={team} className="flex items-center justify-between p-2 hover:bg-secondary rounded-lg cursor-pointer" onClick={() => {
                  setExpanded(new Set(["root", `team-${team}`]));
                }}>
                  <div className="flex items-center gap-2">
                    {TeamIcon ? <TeamIcon className="w-4 h-4 text-purple-500" /> : <Users className="w-4 h-4 text-purple-500" />}
                    <span className="text-sm">{team}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{teamAgents.length}</span>
                    <div className={cn("w-2 h-2 rounded-full", activeCount > 0 ? "bg-green-500" : "bg-muted-foreground")} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 mt-4">
          <h3 className="font-medium mb-3">Status Legend</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Active - Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">Idle - Waiting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Error - Needs attention</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
