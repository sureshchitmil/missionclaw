import { NextResponse } from "next/server";
import { useAppStore } from "@/stores/useAppStore";

// Team routing based on project type
const getTeamForProject = (projectType: string): string | null => {
  const type = projectType.toLowerCase();
  
  // Digital Marketing
  if (type.includes("marketing") || type.includes("digital") || type.includes("social") || 
      type.includes("seo") || type.includes("ads") || type.includes("campaign") || 
      type.includes("content") || type.includes("brand")) {
    return "Marketing";
  }
  
  // Development
  if (type.includes("development") || type.includes("web") || type.includes("next.js") || 
      type.includes("mobile") || type.includes("app") || type.includes("software") || type.includes("code") || 
      type.includes("frontend") || type.includes("backend") || type.includes("api") ||
      type.includes("database") || type.includes("devops") || type.includes("cloud") ||
      type.includes("react") || type.includes("node") || type.includes("python")) {
    return "Developer";
  }
  
  // Creative
  if (type.includes("design") || type.includes("creative") || type.includes("graphic") || 
      type.includes("video") || type.includes("animation") || type.includes("ui") || 
      type.includes("ux") || type.includes("logo") || type.includes("branding") || type.includes("media")) {
    return "Creative";
  }
  
  // Sales
  if (type.includes("sales") || type.includes("crm") || type.includes("leads") || 
      type.includes("client") || type.includes("customer")) {
    return "Sales";
  }
  
  // Support
  if (type.includes("support") || type.includes("help") || type.includes("ticket") || 
      type.includes("issue") || type.includes("bug")) {
    return "Support";
  }
  
  // Operations
  if (type.includes("operations") || type.includes("workflow") || type.includes("process") || 
      type.includes("automation") || type.includes("integration")) {
    return "Operations";
  }
  
  return null; // No specific team
};

// Generate tasks based on project description
const generateTasks = (projectName: string, description: string): string[] => {
  const desc = description.toLowerCase();
  const tasks: string[] = [];
  let taskType = "";
  
  // Determine primary task type (priority order)
  if (desc.includes("mobile") || desc.includes("app") || desc.includes("ios") || desc.includes("android") || desc.includes("react native")) {
    taskType = "mobile";
  } else if (desc.includes("website") || desc.includes("web") || desc.includes("landing") || desc.includes("next.js") || desc.includes("react")) {
    taskType = "website";
  } else if (desc.includes("marketing") || desc.includes("campaign") || desc.includes("ads")) {
    taskType = "marketing";
  } else if (desc.includes("content") || desc.includes("blog") || desc.includes("social")) {
    taskType = "content";
  } else if (desc.includes("design") || desc.includes("logo") || desc.includes("brand")) {
    taskType = "design";
  }
  
  // Generate tasks based on type
  if (taskType === "mobile") {
    tasks.push("Create mobile app wireframes");
    tasks.push("Design app UI/UX");
    tasks.push("Develop mobile features");
    tasks.push("Test on devices");
    tasks.push("Submit to stores");
  } else if (taskType === "website") {
    tasks.push("Create website wireframes");
    tasks.push("Design UI/UX mockups");
    tasks.push("Develop frontend components");
    tasks.push("Set up backend API");
    tasks.push("Deploy and test");
  } else if (taskType === "marketing") {
    tasks.push("Create marketing strategy");
    tasks.push("Design ad creatives");
    tasks.push("Set up campaigns");
    tasks.push("Monitor and optimize");
    tasks.push("Generate performance report");
  } else if (taskType === "content") {
    tasks.push("Research topics and keywords");
    tasks.push("Write content drafts");
    tasks.push("Create visual assets");
    tasks.push("Schedule posts");
    tasks.push("Engage with audience");
  } else if (taskType === "design") {
    tasks.push("Create mood board");
    tasks.push("Design logo concepts");
    tasks.push("Create brand guidelines");
    tasks.push("Design collateral materials");
    tasks.push("Finalize assets");
  } else {
    // Default tasks if nothing specific
    tasks.push("Analyze requirements");
    tasks.push("Plan project timeline");
    tasks.push("Execute initial phase");
    tasks.push("Review and iterate");
    tasks.push("Deliver final result");
  }
  
  return tasks;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectName, shortDescription, tech, author, fullPRD, projectType, priority, deadline } = body;
    
    if (!projectName) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }
    
    // Determine team based on project type
    const team = getTeamForProject(projectType || shortDescription || fullPRD || tech || projectName);
    
    // Generate tasks from project
    const taskNames = generateTasks(projectName, shortDescription || fullPRD || "");
    
    // Create project in store
    const projectId = `project-${Date.now()}`;
    const store = useAppStore.getState();
    
    store.addProject({
      id: projectId,
      name: projectName,
      shortDescription,
      tech,
      author,
      fullPRD,
      path: shortDescription || "", // Store short desc as path for reference
      createdAt: new Date(),
    });
    store.setActiveProject(projectId);
    
    // Get agents filtered by team (if applicable)
    const teamAgents = team 
      ? store.agents.filter(a => a.team === team)
      : store.agents;
    
    // Create tasks and distribute to agents
    const assignedTasks: { task: string; agent: string | null }[] = [];
    
    taskNames.forEach((taskName, index) => {
      const taskId = `task-${Date.now()}-${index}`;
      
      // Round-robin assignment to available agents
      const assignedAgent = teamAgents.length > 0 
        ? teamAgents[index % teamAgents.length].id 
        : undefined;
      
      store.addTask({
        id: taskId,
        title: taskName,
        description: `From project: ${projectName}`,
        status: "todo",
        projectId,
        assignedAgent,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      assignedTasks.push({ 
        task: taskName, 
        agent: assignedAgent 
          ? store.agents.find(a => a.id === assignedAgent)?.name || "Unassigned"
          : "Unassigned" 
      });
    });
    
    // Get all tasks for this project
    const projectTasks = store.tasks.filter(t => t.projectId === projectId);
    const completedTasks = projectTasks.filter(t => t.status === "done").length;
    
    const response = {
      success: true,
      project: {
        id: projectId,
        name: projectName,
        shortDescription,
        tech,
        author,
        fullPRD,
        type: projectType,
        team,
        priority,
        deadline,
        createdAt: new Date().toISOString(),
      },
      tasksCreated: taskNames.length,
      assignedTasks,
      teamAgents: teamAgents.map(a => ({ name: a.name, role: a.role })),
      message: team 
        ? `Project assigned to ${team} Department`
        : `Project created - no specific team identified`,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

// Get project status and tasks
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const action = searchParams.get("action");
  
  const store = useAppStore.getState();
  
  // Get single project details
  if (projectId && !action) {
    const project = store.projects.find(p => p.id === projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    const projectTasks = store.tasks.filter(t => t.projectId === projectId);
    return NextResponse.json({
      ...project,
      tasks: projectTasks,
      taskCount: projectTasks.length,
      completedCount: projectTasks.filter(t => t.status === "done").length,
    });
  }
  
  if (action === "report" && projectId) {
    // Generate report for Velo
    const project = store.projects.find(p => p.id === projectId);
    const projectTasks = store.tasks.filter(t => t.projectId === projectId);
    
    const completedTasks = projectTasks.filter(t => t.status === "done");
    const inProgressTasks = projectTasks.filter(t => t.status === "in_progress");
    const pendingTasks = projectTasks.filter(t => t.status === "todo" || t.status === "backlog");
    
    const report = {
      projectId,
      projectName: project?.name || "Unknown",
      summary: {
        total: projectTasks.length,
        completed: completedTasks.length,
        inProgress: inProgressTasks.length,
        pending: pendingTasks.length,
        progress: projectTasks.length > 0 
          ? Math.round((completedTasks.length / projectTasks.length) * 100) 
          : 0,
      },
      tasks: {
        completed: completedTasks.map(t => ({ title: t.title, status: t.status })),
        inProgress: inProgressTasks.map(t => ({ title: t.title, status: t.status })),
        pending: pendingTasks.map(t => ({ title: t.title, status: t.status })),
      },
      agents: store.agents.map(a => ({
        name: a.name,
        role: a.role,
        team: a.team,
        activeTasks: projectTasks.filter(t => t.assignedAgent === a.id && t.status === "in_progress").length,
      })),
      readyForReview: completedTasks.length === projectTasks.length && projectTasks.length > 0,
    };
    
    return NextResponse.json(report);
  }
  
  // List all projects
  return NextResponse.json({
    projects: store.projects.map(p => ({
      id: p.id,
      name: p.name,
      createdAt: p.createdAt,
      taskCount: store.tasks.filter(t => t.projectId === p.id).length,
      completedCount: store.tasks.filter(t => t.projectId === p.id && t.status === "done").length,
    })),
  });
}

// Update project
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    
    if (!projectId) {
      return NextResponse.json({ error: "Project ID required" }, { status: 400 });
    }
    
    const body = await request.json();
    const store = useAppStore.getState();
    
    const projectIndex = store.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    // Update project fields
    store.updateProject(projectId, {
      name: body.name,
      shortDescription: body.shortDescription,
      tech: body.tech,
      author: body.author,
      fullPRD: body.fullPRD,
      priority: body.priority,
    });
    
    return NextResponse.json({ success: true, message: "Project updated" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// Delete project
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    
    if (!projectId) {
      return NextResponse.json({ error: "Project ID required" }, { status: 400 });
    }
    
    const store = useAppStore.getState();
    store.removeProject(projectId);
    
    // Also remove associated tasks
    const tasksToRemove = store.tasks.filter(t => t.projectId === projectId);
    tasksToRemove.forEach(t => store.removeTask(t.id));
    
    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}