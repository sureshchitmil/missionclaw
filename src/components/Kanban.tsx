"use client";

import { useState } from "react";
import { useAppStore, Task } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";
import { Plus, MoreHorizontal, Trash2, Edit, GripVertical, User, Flag, Calendar, X, Check } from "lucide-react";

const columns: { id: Task["status"]; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "review", label: "Review" },
  { id: "done", label: "Done" },
];

const priorities = [
  { id: "low", label: "Low", color: "bg-blue-500" },
  { id: "medium", label: "Medium", color: "bg-amber-500" },
  { id: "high", label: "High", color: "bg-orange-500" },
  { id: "urgent", label: "Urgent", color: "bg-red-500" },
];

export default function Kanban() {
  const { tasks, activeProjectId, addTask, updateTask, moveTask, removeTask, agents } = useAppStore();
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [showAddTask, setShowAddTask] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    assignedAgent: "",
  });
  const [editTask, setEditTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    assignedAgent: "",
  });

  const projectTasks = tasks.filter((t) => t.projectId === activeProjectId);

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: Task["status"]) => {
    if (draggedTask) {
      moveTask(draggedTask, status);
      setDraggedTask(null);
    }
  };

  const handleAddTask = (status: Task["status"]) => {
    if (!newTask.title.trim() || !activeProjectId) return;
    addTask({
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status,
      projectId: activeProjectId,
      priority: newTask.priority,
      assignedAgent: newTask.assignedAgent || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setNewTask({ title: "", description: "", priority: "medium", assignedAgent: "" });
    setShowAddTask(null);
  };

  const handleUpdateTask = (taskId: string) => {
    updateTask(taskId, {
      title: editTask.title,
      description: editTask.description,
      priority: editTask.priority,
      assignedAgent: editTask.assignedAgent || undefined,
    });
    setEditingTask(null);
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "backlog": return "bg-muted-foreground/30";
      case "todo": return "bg-amber-500/30";
      case "in_progress": return "bg-primary/30";
      case "review": return "bg-purple-500/30";
      case "done": return "bg-green-500/30";
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-amber-500 text-white";
      case "low": return "bg-blue-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityLabel = (priority?: string) => {
    switch (priority) {
      case "urgent": return "Urgent";
      case "high": return "High";
      case "medium": return "Medium";
      case "low": return "Low";
      default: return "No Priority";
    }
  };

  const assignedAgents = agents.filter(a => a.status !== "error");

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Kanban Board</h2>
          <p className="text-muted-foreground">Drag tasks between columns to update status</p>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnTasks = projectTasks.filter((t) => t.status === column.id);
          return (
            <div
              key={column.id}
              className="flex-shrink-0 w-80 flex flex-col bg-secondary/30 rounded-xl"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              <div className="p-3 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", getStatusColor(column.id))} />
                  <span className="font-medium text-sm">{column.label}</span>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowAddTask(column.id)}
                  className="p-1 hover:bg-secondary rounded transition-colors"
                >
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)]">
                {showAddTask === column.id && (
                  <div className="bg-card border border-border rounded-lg p-3 space-y-3">
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Task title..."
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                      autoFocus
                    />
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Description (optional)..."
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none h-16"
                    />
                    
                    {/* Priority Selection */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Priority</label>
                      <div className="flex gap-1">
                        {priorities.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setNewTask({ ...newTask, priority: p.id as any })}
                            className={cn(
                              "flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors",
                              newTask.priority === p.id ? p.color + " text-white" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                            )}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Agent Selection */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Assign Agent</label>
                      <select
                        value={newTask.assignedAgent}
                        onChange={(e) => setNewTask({ ...newTask, assignedAgent: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                      >
                        <option value="">Select an agent...</option>
                        {assignedAgents.map((agent) => (
                          <option key={agent.id} value={agent.name}>
                            {agent.name} ({agent.team})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddTask(column.id)}
                        className="flex-1 px-3 py-2 bg-primary text-primary-foreground text-sm rounded-lg font-medium"
                      >
                        Add Task
                      </button>
                      <button
                        onClick={() => { setShowAddTask(null); setNewTask({ title: "", description: "", priority: "medium", assignedAgent: "" }); }}
                        className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    className="bg-card border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors group"
                  >
                    {editingTask === task.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editTask.title}
                          onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                          className="w-full bg-secondary border border-border rounded px-2 py-1 text-sm outline-none"
                        />
                        <textarea
                          value={editTask.description}
                          onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                          className="w-full bg-secondary border border-border rounded px-2 py-1 text-sm resize-none h-16"
                        />
                        <select
                          value={editTask.priority}
                          onChange={(e) => setEditTask({ ...editTask, priority: e.target.value as any })}
                          className="w-full bg-secondary border border-border rounded px-2 py-1 text-sm"
                        >
                          {priorities.map((p) => (
                            <option key={p.id} value={p.id}>{p.label}</option>
                          ))}
                        </select>
                        <select
                          value={editTask.assignedAgent}
                          onChange={(e) => setEditTask({ ...editTask, assignedAgent: e.target.value })}
                          className="w-full bg-secondary border border-border rounded px-2 py-1 text-sm"
                        >
                          <option value="">Unassigned</option>
                          {assignedAgents.map((agent) => (
                            <option key={agent.id} value={agent.name}>{agent.name} ({agent.team})</option>
                          ))}
                        </select>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateTask(task.id)}
                            className="flex-1 px-2 py-1 bg-green-500 text-white text-xs rounded flex items-center justify-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Save
                          </button>
                          <button
                            onClick={() => setEditingTask(null)}
                            className="px-2 py-1 bg-secondary text-xs rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium flex-1">{task.title}</p>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingTask(task.id);
                                setEditTask({
                                  title: task.title,
                                  description: task.description || "",
                                  priority: task.priority || "medium",
                                  assignedAgent: task.assignedAgent || "",
                                });
                              }}
                              className="p-1 hover:bg-secondary rounded"
                            >
                              <Edit className="w-3 h-3 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => removeTask(task.id)}
                              className="p-1 hover:bg-secondary rounded"
                            >
                              <Trash2 className="w-3 h-3 text-muted-foreground hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            {task.priority && (
                              <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", getPriorityColor(task.priority))}>
                                {getPriorityLabel(task.priority)}
                              </span>
                            )}
                          </div>
                          {task.assignedAgent && (
                            <div className="flex items-center gap-1">
                              {agents.find(a => a.name === task.assignedAgent)?.avatar && (
                                <img 
                                  src={agents.find(a => a.name === task.assignedAgent)?.avatar} 
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                              )}
                              <span className="text-xs text-muted-foreground">{task.assignedAgent}</span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {columnTasks.length === 0 && !showAddTask && (
                  <p className="text-xs text-muted-foreground text-center py-4">No tasks</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
