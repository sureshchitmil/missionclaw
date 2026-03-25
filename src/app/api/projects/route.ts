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

// Auto-generate missing fields based on project name
const autoFillFields = (projectName: string, shortDescription?: string, tech?: string, fullPRD?: string, priority?: string, projectType?: string) => {
  const name = projectName.toLowerCase();
  const desc = (shortDescription || "").toLowerCase();
  
  // Auto-generate short description if not provided
  let autoShortDesc = shortDescription;
  if (!autoShortDesc) {
    if (name.includes("landing page") || name.includes("website")) {
      autoShortDesc = `Create a modern website for ${projectName}`;
    } else if (name.includes("app") || name.includes("mobile")) {
      autoShortDesc = `Build a mobile application - ${projectName}`;
    } else if (name.includes("marketing") || name.includes("seo") || name.includes("ads")) {
      autoShortDesc = `Digital marketing campaign for ${projectName}`;
    } else {
      autoShortDesc = `Project: ${projectName}`;
    }
  }
  
  // Auto-detect tech stack
  let autoTech = tech;
  if (!autoTech) {
    const techs: string[] = [];
    if (name.includes("next") || name.includes("website") || name.includes("landing") || name.includes("web")) {
      techs.push("Next.js", "React", "Tailwind CSS", "TypeScript");
    }
    if (name.includes("mobile") || name.includes("app") || name.includes("ios") || name.includes("android")) {
      techs.push("React Native", "Expo");
    }
    if (name.includes("api") || name.includes("backend")) {
      techs.push("Node.js", "Express");
    }
    if (name.includes("database") || name.includes("data")) {
      techs.push("PostgreSQL", "Supabase");
    }
    if (name.includes("marketing") || name.includes("seo")) {
      techs.push("Google Analytics", "Search Console");
    }
    if (techs.length === 0) {
      techs.push("Next.js", "React", "Tailwind CSS");
    }
    autoTech = techs.join(", ");
  }
  
  // Auto-generate full PRD if not provided
  let autoFullPRD = fullPRD;
  if (!autoFullPRD) {
    const prdSections: string[] = [];
    if (name.includes("landing") || name.includes("website")) {
      prdSections.push("1. Hero section with tagline and CTA");
      prdSections.push("2. Services/Features section");
      prdSections.push("3. About/Team section");
      prdSections.push("4. Portfolio/Case studies");
      prdSections.push("5. Testimonials");
      prdSections.push("6. Contact form");
      prdSections.push("7. Footer with links");
    } else if (name.includes("app") || name.includes("mobile")) {
      prdSections.push("1. User authentication");
      prdSections.push("2. Home/Dashboard screen");
      prdSections.push("3. Core features");
      prdSections.push("4. Settings screen");
      prdSections.push("5. Push notifications");
    } else if (name.includes("marketing") || name.includes("seo")) {
      prdSections.push("1. Keyword research");
      prdSections.push("2. Competitor analysis");
      prdSections.push("3. Content strategy");
      prdSections.push("4. On-page SEO optimization");
      prdSections.push("5. Backlink strategy");
      prdSections.push("6. Monthly performance reports");
    } else {
      prdSections.push("1. Requirements gathering");
      prdSections.push("2. Design phase");
      prdSections.push("3. Development");
      prdSections.push("4. Testing & QA");
      prdSections.push("5. Deployment");
      prdSections.push("6. Post-launch support");
    }
    autoFullPRD = prdSections.join("\n");
  }
  
  // Auto-set priority
  let autoPriority = priority;
  if (!autoPriority) {
    if (name.includes("urgent") || name.includes("asap") || name.includes("rush")) {
      autoPriority = "urgent";
    } else if (name.includes("important") || name.includes("priority")) {
      autoPriority = "high";
    } else {
      autoPriority = "medium";
    }
  }
  
  // Auto-detect project type
  let autoProjectType = projectType;
  if (!autoProjectType) {
    if (name.includes("marketing") || name.includes("seo") || name.includes("ads") || name.includes("social")) {
      autoProjectType = "digital marketing";
    } else if (name.includes("mobile") || name.includes("app") || name.includes("ios") || name.includes("android")) {
      autoProjectType = "mobile development";
    } else if (name.includes("website") || name.includes("landing") || name.includes("web")) {
      autoProjectType = "web development";
    } else {
      autoProjectType = "general";
    }
  }
  
  return {
    shortDescription: autoShortDesc,
    tech: autoTech,
    fullPRD: autoFullPRD,
    priority: autoPriority,
    projectType: autoProjectType
  };
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectName, shortDescription, tech, author, fullPRD, projectType, priority, deadline } = body;
    
    if (!projectName) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }
    
    // Auto-fill missing fields
    const autoFilled = autoFillFields(projectName, shortDescription, tech, fullPRD, priority, projectType);
    const finalShortDesc = shortDescription || autoFilled.shortDescription;
    const finalTech = tech || autoFilled.tech;
    const finalFullPRD = fullPRD || autoFilled.fullPRD;
    const finalPriority = priority || autoFilled.priority;
    const finalProjectType = projectType || autoFilled.projectType;
    
    // Determine team based on project type
    const team = getTeamForProject(finalProjectType || finalShortDesc || finalFullPRD || finalTech || projectName);
    
    // Generate tasks from project
    const taskNames = generateTasks(projectName, finalShortDesc || finalFullPRD || "");
    
    // Create project in store
    const projectId = `project-${Date.now()}`;
    const store = useAppStore.getState();
    
    store.addProject({
      id: projectId,
      name: projectName,
      shortDescription: finalShortDesc,
      tech: finalTech,
      author: author || "Velo",
      fullPRD: finalFullPRD,
      priority: finalPriority,
      path: finalShortDesc,
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