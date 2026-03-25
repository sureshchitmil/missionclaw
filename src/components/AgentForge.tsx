"use client";

import { useState, useEffect } from "react";
import { useAppStore, Agent } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";
import { Bot, Plus, Trash2, Edit, Save, X, Cpu, Cloud, Laptop, AlertTriangle, RefreshCw, Zap, Users } from "lucide-react";

const ollamaDefaultUrl = "http://localhost:11434";

interface OpenClawModel {
  id: string;
  name: string;
}

export default function AgentForge() {
  const { agents, addAgent, updateAgent, removeAgent, teams, addTeam, removeTeam } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [ollamaUrl, setOllamaUrl] = useState(ollamaDefaultUrl);
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [ollamaStatus, setOllamaStatus] = useState<"checking" | "available" | "unavailable">("checking");
  const [openclawModels, setOpenclawModels] = useState<OpenClawModel[]>([]);
  const [openclawStatus, setOpenclawStatus] = useState<"checking" | "available" | "unavailable">("checking");
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    name: "",
    role: "",
    team: "",
    persona: "",
    type: "ollama",
    model: "",
    status: "idle",
    avatar: "",
  });

  // Default avatar options - image avatars
  const defaultAvatars = [
    { id: "1", name: "Artboard 1", src: "/avatars/Artboard 1@4x.png" },
    { id: "2", name: "Artboard 2", src: "/avatars/Artboard 1_1@4x.png" },
    { id: "3", name: "Artboard 3", src: "/avatars/Artboard 1_2@4x.png" },
    { id: "4", name: "Artboard 4", src: "/avatars/Artboard 1_3@4x.png" },
    { id: "5", name: "Artboard 5", src: "/avatars/Artboard 1_4@4x.png" },
    { id: "6", name: "Artboard 6", src: "/avatars/Artboard 1_5@4x.png" },
    { id: "7", name: "Artboard 7", src: "/avatars/Artboard 1_6@4x.png" },
    { id: "8", name: "Artboard 8", src: "/avatars/Artboard 1_7@4x.png" },
    { id: "9", name: "Artboard 9", src: "/avatars/Artboard 1_8@4x.png" },
    { id: "10", name: "Artboard 10", src: "/avatars/Artboard 1_9@4x.png" },
    { id: "11", name: "Artboard 11", src: "/avatars/Artboard 1_10@4x.png" },
    { id: "12", name: "Artboard 12", src: "/avatars/Artboard 1_11@4x.png" },
    { id: "13", name: "Artboard 13", src: "/avatars/Artboard 1_12@4x.png" },
    { id: "14", name: "Artboard 14", src: "/avatars/Artboard 1_13@4x.png" },
    { id: "15", name: "Artboard 15", src: "/avatars/Artboard 1_14@4x.png" },
    { id: "16", name: "Artboard 16", src: "/avatars/Artboard 1_15@4x.png" },
    { id: "17", name: "Artboard 17", src: "/avatars/Artboard 1_16@4x.png" },
    { id: "18", name: "Artboard 18", src: "/avatars/Artboard 1_17@4x.png" },
    { id: "19", name: "Artboard 19", src: "/avatars/Artboard 1_18@4x.png" },
    { id: "20", name: "Artboard 20", src: "/avatars/Artboard 1_19@4x.png" },
    { id: "21", name: "Artboard 21", src: "/avatars/Artboard 1_20@4x.png" },
    { id: "22", name: "Artboard 22", src: "/avatars/Artboard 1_21@4x.png" },
    { id: "23", name: "Artboard 23", src: "/avatars/Artboard 1_22@4x.png" },
  ];
  const [editPersonality, setEditPersonality] = useState<{ id: string; type: "soul" | "identity"; content: string } | null>(null);

  // Check availability on mount
  useEffect(() => {
    checkOllama();
    checkOpenClaw();
  }, []);

  const checkOllama = async (url = ollamaUrl) => {
    setOllamaStatus("checking");
    try {
      const res = await fetch("/api/ollama?url=" + encodeURIComponent(url));
      const data = await res.json();
      if (data.available) {
        setOllamaModels(data.models);
        setOllamaStatus("available");
      } else {
        setOllamaModels([]);
        setOllamaStatus("unavailable");
      }
    } catch {
      setOllamaStatus("unavailable");
      setOllamaModels([]);
    }
  };

  const checkOpenClaw = async () => {
    setOpenclawStatus("checking");
    try {
      const res = await fetch("/api/openclaw-models");
      const data = await res.json();
      if (data.available && data.models) {
        setOpenclawModels(data.models);
        setOpenclawStatus("available");
      } else {
        setOpenclawModels([]);
        setOpenclawStatus("unavailable");
      }
    } catch {
      setOpenclawStatus("unavailable");
      setOpenclawModels([]);
    }
  };

  const handleAdd = () => {
    if (!newAgent.name || !newAgent.type) return;
    addAgent({
      id: `agent-${Date.now()}`,
      name: newAgent.name,
      role: newAgent.role,
      team: newAgent.team,
      persona: newAgent.persona,
      type: newAgent.type as Agent["type"],
      model: newAgent.model,
      status: "idle",
      avatar: newAgent.avatar,
    });
    setNewAgent({ name: "", role: "", team: "", persona: "", type: "ollama", model: "", status: "idle", avatar: "" });
    setShowAdd(false);
  };

  const savePersonality = () => {
    if (!editPersonality) return;
    const agent = agents.find((a) => a.id === editPersonality.id);
    if (!agent) return;
    updateAgent(editPersonality.id, {
      personality: {
        ...agent.personality,
        [editPersonality.type]: editPersonality.content,
      },
    });
    setEditPersonality(null);
  };

  const getModelsForType = (type: string) => {
    switch (type) {
      case "ollama":
        return ollamaModels.length > 0 ? ollamaModels : ["No models found - Pull with: ollama pull <name>"];
      case "openclaw":
        return openclawModels.length > 0 ? openclawModels.map(m => m.id) : ["kilocode minimax (default)"];
      case "cloud":
        return ["gpt-4o", "gpt-4o-mini", "claude-3-5-sonnet", "claude-3-haiku", "gemini-1.5-pro", "gemini-1.5-flash"];
      default:
        return [];
    }
  };

  const getModelLabelForType = (type: string) => {
    switch (type) {
      case "ollama": return "Local Models";
      case "openclaw": return "Kilocode Models";
      case "cloud": return "API Models";
      default: return "Model";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Agent Forge</h2>
          <p className="text-muted-foreground">Configure agent brains and personalities</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTeams(!showTeams)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <Users className="w-4 h-4" />
            Manage Teams
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Agent
          </button>
        </div>
      </div>

      {/* Team Management */}
      {showTeams && (
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <h3 className="font-medium mb-4">Manage Teams</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {teams.map((team) => (
              <div key={team} className="flex items-center gap-1 bg-secondary px-3 py-1.5 rounded-lg text-sm">
                <span>{team} Department</span>
                <button
                  onClick={() => removeTeam(team)}
                  className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="New team name..."
              className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              onKeyDown={(e) => e.key === "Enter" && newTeamName && addTeam(newTeamName) && setNewTeamName("")}
            />
            <button
              onClick={() => newTeamName && addTeam(newTeamName) && setNewTeamName("")}
              disabled={!newTeamName}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Team
            </button>
          </div>
        </div>
      )}

      {/* Connection Status Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Ollama */}
        <div className="p-3 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Ollama</span>
            </div>
            <button onClick={() => checkOllama(ollamaUrl)} className="p-1 hover:bg-secondary rounded">
              <RefreshCw className={cn("w-3 h-3", ollamaStatus === "checking" && "animate-spin")} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {ollamaStatus === "checking" ? "Checking..." : 
             ollamaStatus === "available" ? `${ollamaModels.length} models` : "Not connected"}
          </p>
          {ollamaModels.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {ollamaModels.slice(0, 3).map((m) => (
                <span key={m} className="text-xs bg-secondary px-1.5 py-0.5 rounded">{m.split(":")[0]}</span>
              ))}
              {ollamaModels.length > 3 && <span className="text-xs text-muted-foreground">+{ollamaModels.length - 3}</span>}
            </div>
          )}
        </div>

        {/* OpenClaw / Kilocode */}
        <div className="p-3 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Kilocode</span>
            </div>
            <button onClick={checkOpenClaw} className="p-1 hover:bg-secondary rounded">
              <RefreshCw className={cn("w-3 h-3", openclawStatus === "checking" && "animate-spin")} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {openclawStatus === "checking" ? "Checking..." : 
             openclawStatus === "available" ? `${openclawModels.length} models` : "Not connected"}
          </p>
          {openclawModels.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {openclawModels.slice(0, 3).map((m) => (
                <span key={m.id} className="text-xs bg-secondary px-1.5 py-0.5 rounded">{m.name.split(" ")[0]}</span>
              ))}
              {openclawModels.length > 3 && <span className="text-xs text-muted-foreground">+{openclawModels.length - 3}</span>}
            </div>
          )}
        </div>

        {/* Cloud */}
        <div className="p-3 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Cloud API</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">GPT-4o, Claude, Gemini</p>
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="text-xs bg-secondary px-1.5 py-0.5 rounded">GPT</span>
            <span className="text-xs bg-secondary px-1.5 py-0.5 rounded">Claude</span>
            <span className="text-xs bg-secondary px-1.5 py-0.5 rounded">Gemini</span>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <h3 className="font-medium mb-4">Create New Agent</h3>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Agent Name</label>
              <input
                type="text"
                value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                placeholder="e.g., frontend-developer"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Role</label>
              <input
                type="text"
                value={newAgent.role}
                onChange={(e) => setNewAgent({ ...newAgent, role: e.target.value })}
                placeholder="e.g., Developer, QA, Reviewer"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Team</label>
              <select
                value={newAgent.team}
                onChange={(e) => setNewAgent({ ...newAgent, team: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">No Team</option>
                {teams.map((team) => (
                  <option key={team} value={team}>{team} Department</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Type</label>
              <select
                value={newAgent.type}
                onChange={(e) => setNewAgent({ ...newAgent, type: e.target.value as Agent["type"], model: "" })}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value="ollama">Ollama (Local)</option>
                <option value="openclaw">Kilocode (OpenClaw)</option>
                <option value="cloud">Cloud API</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">{getModelLabelForType(newAgent.type || "")}</label>
              <select
                value={newAgent.model}
                onChange={(e) => setNewAgent({ ...newAgent, model: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select model...</option>
                {getModelsForType(newAgent.type || "").map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm text-muted-foreground mb-2 block">Avatar</label>
            <div className="flex flex-wrap gap-2">
              {defaultAvatars.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setNewAgent({ ...newAgent, avatar: avatar.src })}
                  className={cn(
                    "w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden transition-all border-2",
                    newAgent.avatar === avatar.src 
                      ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background" 
                      : "border-transparent hover:border-border"
                  )}
                >
                  <img src={avatar.src} alt={avatar.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm text-muted-foreground mb-1 block">Persona Profile</label>
            <textarea
              value={newAgent.persona}
              onChange={(e) => setNewAgent({ ...newAgent, persona: e.target.value })}
              placeholder="Describe the agent's personality, communication style, expertise..."
              className="w-full h-24 bg-secondary border border-border rounded-lg px-3 py-2 text-sm resize-none"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
            >
              Create Agent
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {editPersonality && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium capitalize">{editPersonality.type === "soul" ? "SOUL.md (Ethics)" : "IDENTITY.md (Tone)"}</h3>
              <button onClick={() => setEditPersonality(null)} className="p-1 hover:bg-secondary rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={editPersonality.content}
              onChange={(e) => setEditPersonality({ ...editPersonality, content: e.target.value })}
              className="w-full h-64 bg-secondary border border-border rounded-lg px-4 py-3 text-sm font-mono"
              placeholder={editPersonality.type === "soul" 
                ? "Enter ethical guidelines, boundaries,价值观..." 
                : "Enter personality traits, tone, speaking style..."
              }
            />
            <div className="flex gap-2 mt-4">
              <button onClick={savePersonality} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                <Save className="w-4 h-4" />
                Save
              </button>
              <button onClick={() => setEditPersonality(null)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {agents.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No agents configured yet</p>
            <p className="text-sm text-muted-foreground mt-1">Create your first agent to get started</p>
          </div>
        ) : (
          agents.map((agent) => {
            const Icon = agent.type === "ollama" ? Laptop : agent.type === "openclaw" ? Zap : Cloud;
            const isImageAvatar = agent.avatar && agent.avatar.startsWith("/avatars/");
            return (
              <div key={agent.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {agent.avatar ? (
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-secondary">
                        <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={cn(
                        "p-3 rounded-lg",
                        agent.status === "active" ? "bg-green-500/10" : agent.status === "error" ? "bg-red-500/10" : "bg-secondary"
                      )}>
                        <Icon className={cn(
                          "w-6 h-6",
                          agent.status === "active" ? "text-green-500" : agent.status === "error" ? "text-red-500" : "text-muted-foreground"
                        )} />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{agent.name}</p>
                        {agent.team && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500">
                            {agent.team}
                          </span>
                        )}
                        {agent.role && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                            {agent.role}
                          </span>
                        )}
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          agent.status === "active" ? "bg-green-500/10 text-green-500" : agent.status === "error" ? "bg-red-500/10 text-red-500" : "bg-secondary text-muted-foreground"
                        )}>
                          {agent.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {agent.type === "ollama" ? "Ollama (Local)" : agent.type === "openclaw" ? "Kilocode (OpenClaw)" : "Cloud API"}
                      </p>
                      {agent.model && <p className="text-sm text-muted-foreground">Model: {agent.model}</p>}
                      {agent.persona && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{agent.persona}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditPersonality({ id: agent.id, type: "soul", content: agent.personality?.soul || "" })}
                      className="px-3 py-1.5 bg-secondary rounded-lg text-sm hover:bg-secondary/80"
                    >
                      Edit SOUL
                    </button>
                    <button
                      onClick={() => setEditPersonality({ id: agent.id, type: "identity", content: agent.personality?.identity || "" })}
                      className="px-3 py-1.5 bg-secondary rounded-lg text-sm hover:bg-secondary/80"
                    >
                      Edit ID
                    </button>
                    <button
                      onClick={() => removeAgent(agent.id)}
                      className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {agent.type === "ollama" && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-amber-500 bg-amber-500/10 px-3 py-2 rounded-lg">
                    <AlertTriangle className="w-4 h-4" />
                    <span>RAM usage warning: 16GB M4 may struggle with models {'>'}7B parameters</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}