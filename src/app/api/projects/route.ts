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
      autoShortDesc = `Create a modern, responsive website for ${projectName} with engaging UI/UX`;
    } else if (name.includes("app") || name.includes("mobile")) {
      autoShortDesc = `Build a feature-rich mobile application for ${projectName}`;
    } else if (name.includes("marketing") || name.includes("seo") || name.includes("ads")) {
      autoShortDesc = `Comprehensive digital marketing campaign to grow ${projectName}'s online presence`;
    } else {
      autoShortDesc = `Professional project development for ${projectName}`;
    }
  }
  
  // Auto-detect tech stack
  let autoTech = tech;
  if (!autoTech) {
    const techs: string[] = [];
    if (name.includes("next") || name.includes("website") || name.includes("landing") || name.includes("web")) {
      techs.push("Next.js 16", "React 19", "Tailwind CSS", "TypeScript", "Framer Motion");
    }
    if (name.includes("mobile") || name.includes("app") || name.includes("ios") || name.includes("android")) {
      techs.push("React Native", "Expo", "TypeScript");
    }
    if (name.includes("api") || name.includes("backend")) {
      techs.push("Node.js", "Express", "Prisma");
    }
    if (name.includes("database") || name.includes("data")) {
      techs.push("PostgreSQL", "Supabase", "Redis");
    }
    if (name.includes("marketing") || name.includes("seo")) {
      techs.push("Google Analytics 4", "Search Console", "Ahrefs", "SEMrush");
    }
    if (techs.length === 0) {
      techs.push("Next.js 16", "React 19", "Tailwind CSS", "TypeScript");
    }
    autoTech = techs.join(", ");
  }
  
  // Auto-generate FULL detailed PRD if not provided
  let autoFullPRD = fullPRD;
  if (!autoFullPRD) {
    const prdSections: string[] = [];
    
    if (name.includes("landing") || name.includes("website")) {
      prdSections.push("## Project Overview");
      prdSections.push(`Create a professional landing page/website for ${projectName}. The website should be modern, responsive, and optimized for conversions.`);
      prdSections.push("");
      prdSections.push("## Pages/Sections Required");
      prdSections.push("1. **Hero Section** - Eye-catching headline, subheadline, CTA buttons, hero image/video");
      prdSections.push("2. **About Us** - Company story, mission, vision, team introduction");
      prdSections.push("3. **Services/Features** - Detailed breakdown of services offered with icons");
      prdSections.push("4. **Portfolio/Work** - Showcasing past projects or case studies");
      prdSections.push("5. **Testimonials** - Client reviews and success stories");
      prdSections.push("6. **Pricing** - Service packages and pricing tiers (if applicable)");
      prdSections.push("7. **FAQ** - Frequently asked questions");
      prdSections.push("8. **Contact Form** - Full contact form with name, email, phone, message");
      prdSections.push("9. **Footer** - Social links, quick links, newsletter signup");
      prdSections.push("");
      prdSections.push("## Technical Requirements");
      prdSections.push("- Responsive design (Mobile, Tablet, Desktop)");
      prdSections.push("- SEO optimized (meta tags, semantic HTML, fast loading)");
      prdSections.push("- Accessible (WCAG compliant)");
      prdSections.push("- Fast loading speed (<3s)");
      prdSections.push("- Contact form with email notifications");
      prdSections.push("- Social media integration");
      prdSections.push("");
      prdSections.push("## Design Guidelines");
      prdSections.push("- Modern, clean aesthetic");
      prdSections.push("- Professional color scheme matching brand");
      prdSections.push("- Consistent typography");
      prdSections.push("- Smooth animations and transitions");
      prdSections.push("- High-quality images and icons");
      
    } else if (name.includes("app") || name.includes("mobile")) {
      prdSections.push("## Project Overview");
      prdSections.push(`Build a comprehensive mobile application for ${projectName}. The app should be intuitive, performant, and provide excellent user experience.`);
      prdSections.push("");
      prdSections.push("## Core Features");
      prdSections.push("1. **User Authentication** - Sign up, Login, Password reset, Social login");
      prdSections.push("2. **Dashboard** - Main screen with key metrics and quick actions");
      prdSections.push("3. **User Profile** - View and edit profile information");
      prdSections.push("4. **Settings** - App preferences, notifications, privacy settings");
      prdSections.push("5. **Push Notifications** - Real-time notifications for important updates");
      prdSections.push("6. **Offline Support** - Core features work without internet");
      prdSections.push("");
      prdSections.push("## Technical Requirements");
      prdSections.push("- Cross-platform (iOS and Android)");
      prdSections.push("- Native-like performance");
      prdSections.push("- Secure data storage");
      prdSections.push("- API integration with backend");
      prdSections.push("- App store ready (iOS App Store, Google Play)");
      prdSections.push("");
      prdSections.push("## UI/UX Guidelines");
      prdSections.push("- Intuitive navigation");
      prdSections.push("- Consistent design language");
      prdSections.push("- Accessibility features");
      prdSections.push("- Smooth animations");
      
    } else if (name.includes("marketing") || name.includes("seo") || name.includes("ads")) {
      prdSections.push("## Project Overview");
      prdSections.push(`Execute comprehensive digital marketing strategy for ${projectName} to increase online visibility, drive traffic, and generate leads.`);
      prdSections.push("");
      prdSections.push("## Marketing Channels");
      prdSections.push("1. **Search Engine Optimization (SEO)**");
      prdSections.push("   - Technical SEO audit and fixes");
      prdSections.push("   - On-page SEO optimization");
      prdSections.push("   - Content optimization");
      prdSections.push("   - Link building strategy");
      prdSections.push("");
      prdSections.push("2. **Pay-Per-Click Advertising (PPC)**");
      prdSections.push("   - Google Ads campaign setup");
      prdSections.push("   - Ad copy creation");
      prdSections.push("   - Landing page optimization");
      prdSections.push("   - A/B testing");
      prdSections.push("");
      prdSections.push("3. **Social Media Marketing**");
      prdSections.push("   - Content calendar creation");
      prdSections.push("   - Post scheduling and management");
      prdSections.push("   - Engagement strategy");
      prdSections.push("   - Influencer outreach");
      prdSections.push("");
      prdSections.push("4. **Content Marketing**");
      prdSections.push("   - Blog posts and articles");
      prdSections.push("   - Infographics creation");
      prdSections.push("   - Video content");
      prdSections.push("   - Email newsletters");
      prdSections.push("");
      prdSections.push("## Deliverables");
      prdSections.push("- Monthly performance reports");
      prdSections.push("- SEO ranking improvements");
      prdSections.push("- Increased organic traffic");
      prdSections.push("- Lead generation metrics");
      prdSections.push("- ROI analysis");
      
    } else {
      // Default detailed PRD
      prdSections.push("## Project Overview");
      prdSections.push(`Comprehensive development project for ${projectName}. This document outlines all requirements, features, and technical specifications.`);
      prdSections.push("");
      prdSections.push("## Objectives");
      prdSections.push("- Deliver a high-quality product");
      prdSections.push("- Meet all functional requirements");
      prdSections.push("- Ensure scalability and maintainability");
      prdSections.push("- Provide excellent user experience");
      prdSections.push("");
      prdSections.push("## Scope of Work");
      prdSections.push("1. Requirements gathering and analysis");
      prdSections.push("2. UI/UX design and prototyping");
      prdSections.push("3. Frontend development");
      prdSections.push("4. Backend development");
      prdSections.push("5. Testing (Unit, Integration, E2E)");
      prdSections.push("6. Deployment to production");
      prdSections.push("7. Documentation and training");
      prdSections.push("8. Post-launch support and maintenance");
      prdSections.push("");
      prdSections.push("## Technical Stack");
      prdSections.push("- Frontend: Modern JavaScript framework");
      prdSections.push("- Backend: Node.js or suitable backend technology");
      prdSections.push("- Database: PostgreSQL or alternative");
      prdSections.push("- Deployment: Cloud platform (AWS/Vercel/Netlify)");
      prdSections.push("");
      prdSections.push("## Timeline");
      prdSections.push("- Phase 1: Planning (1 week)");
      prdSections.push("- Phase 2: Design (2 weeks)");
      prdSections.push("- Phase 3: Development (4 weeks)");
      prdSections.push("- Phase 4: Testing (1 week)");
      prdSections.push("- Phase 5: Deployment (1 week)");
      prdSections.push("");
      prdSections.push("## Success Metrics");
      prdSections.push("- All features working as specified");
      prdSections.push("- No critical bugs");
      prdSections.push("- Performance targets met");
      prdSections.push("- Client approval on deliverables");
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
      author: "suresh chitmil",
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
  
  // List all projects - return all fields
  return NextResponse.json({
    projects: store.projects.map(p => ({
      id: p.id,
      name: p.name,
      shortDescription: p.shortDescription || "",
      tech: p.tech || "",
      author: p.author || "",
      fullPRD: p.fullPRD || "",
      priority: p.priority || "medium",
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