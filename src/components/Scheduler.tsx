"use client";

import { useState } from "react";
import { useAppStore, Schedule } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";
import { Plus, Play, Pause, Trash2, Clock, Calendar, Bot } from "lucide-react";

const cronPresets = [
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day at 6 PM", value: "0 18 * * *" },
  { label: "Every day at 9 AM", value: "0 9 * * *" },
  { label: "Every Monday", value: "0 9 * * 1" },
  { label: "Every Friday", value: "0 18 * * 5" },
];

export default function Scheduler() {
  const { schedules, activeProjectId, agents, addSchedule, updateSchedule, removeSchedule } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    agentId: "",
    cron: "0 9 * * *",
    name: "",
  });

  const projectSchedules = schedules.filter((s) => s.projectId === activeProjectId);

  const handleAdd = () => {
    if (!newSchedule.agentId || !newSchedule.cron || !activeProjectId) return;
    addSchedule({
      id: `schedule-${Date.now()}`,
      agentId: newSchedule.agentId,
      projectId: activeProjectId,
      cron: newSchedule.cron,
      enabled: true,
    });
    setNewSchedule({ agentId: "", cron: "0 9 * * *", name: "" });
    setShowAdd(false);
  };

  const toggleEnabled = (scheduleId: string, enabled: boolean) => {
    updateSchedule(scheduleId, { enabled });
  };

  const formatCron = (cron: string) => {
    const parts = cron.split(" ");
    if (parts.length !== 5) return cron;
    const [min, hour, , , day] = parts;
    if (day && day !== "*") {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return `Every ${days[parseInt(day)]} at ${hour}:${min.padStart(2, "0")}`;
    }
    if (hour !== "*") {
      return `Daily at ${hour}:${min.padStart(2, "0")}`;
    }
    if (min !== "*") {
      return `Every hour at :${min}`;
    }
    return cron;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Task Scheduler</h2>
          <p className="text-muted-foreground">Automate agent tasks with cron schedules</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Schedule
        </button>
      </div>

      {showAdd && (
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <h3 className="font-medium mb-4">Create New Schedule</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Agent</label>
              <select
                value={newSchedule.agentId}
                onChange={(e) => setNewSchedule({ ...newSchedule, agentId: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select agent...</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Schedule</label>
              <select
                value={newSchedule.cron}
                onChange={(e) => setNewSchedule({ ...newSchedule, cron: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              >
                {cronPresets.map((preset) => (
                  <option key={preset.value} value={preset.value}>{preset.label}</option>
                ))}
                <option value="custom">Custom...</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
            >
              Create Schedule
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

      <div className="grid gap-4">
        {projectSchedules.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No schedules yet</p>
            <p className="text-sm text-muted-foreground mt-1">Create a schedule to automate agent tasks</p>
          </div>
        ) : (
          projectSchedules.map((schedule) => {
            const agent = agents.find((a) => a.id === schedule.agentId);
            return (
              <div
                key={schedule.id}
                className="bg-card border border-border rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={cn("p-2 rounded-lg", schedule.enabled ? "bg-primary/10" : "bg-secondary")}>
                    <Bot className={cn("w-5 h-5", schedule.enabled ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <div>
                    <p className="font-medium">{agent?.name || "Unknown Agent"}</p>
                    <p className="text-sm text-muted-foreground">{formatCron(schedule.cron)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleEnabled(schedule.id, !schedule.enabled)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      schedule.enabled ? "bg-green-500/10 text-green-500" : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {schedule.enabled ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => removeSchedule(schedule.id)}
                    className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {projectSchedules.length > 0 && (
        <div className="mt-6 p-4 bg-secondary/30 rounded-xl">
          <h4 className="text-sm font-medium mb-2">Cron Format</h4>
          <p className="text-xs text-muted-foreground">
            Format: minute hour day-of-month month day-of-week<br />
            Example: <code className="bg-secondary px-1 rounded">0 9 * * 1</code> = Every Monday at 9 AM
          </p>
        </div>
      )}
    </div>
  );
}