# 🚀 MissionClaw - AI Agent Orchestration Platform

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.2.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/Next.js-16.2-black.svg" alt="Next.js">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/Platform-macOS%20%7C%20Linux-orange.svg" alt="Platform">
</p>

<p align="center">
  <strong>One-Command Project Management & AI Orchestration for OpenClaw</strong>
</p>

---

## ✨ What is MissionClaw?

MissionClaw is a beginner-friendly, high-performance web dashboard designed to manage autonomous AI agents via the OpenClaw framework. It transforms complex terminal configurations into a visual "Mission Control" for orchestrating AI agents across your projects.

Think of it as **Air Traffic Control for your AI Agents** 🛫

---

## 🎯 Key Features

### 1. 🗂️ Project-Scoped Workspace
- Dropdown project selector in the navigation bar
- Automatic filtering: Kanban, Scheduler, and Org Chart adapt to selected project
- Full project isolation for multi-team environments

### 2. 🤖 Agent Forge (Multi-Model Routing)
- **OpenClaw Native** - Uses Gateway's internal orchestration
- **Ollama (Local)** - Run models locally (Llama 3.2, Qwen 2.5)
- **Cloud API** - OpenAI, Anthropic Claude, Google Gemini
- **Visual Avatar Selection** - Choose from 23 unique agent avatars
- **Personality Editors** - Edit SOUL.md and IDENTITY.md with visual markdown

### 3. 📋 Full-Featured Kanban Board
- **5 Columns**: Backlog → To Do → In Progress → Review → Done
- **Drag & Drop** - Move tasks between columns visually
- **Agent Assignment** - Assign tasks directly to any agent
- **Priority Levels**: Low, Medium, High, Urgent
- **Task Descriptions** - Add detailed descriptions to tasks

### 4. ⏰ Task Scheduler (Heartbeat)
- Cron-based scheduling for repetitive tasks
- Project-linked schedules
- One-click "Run Now" manual override
- Automatic agent task execution

### 5. 🏢 Visual Org Chart
- **Team-Based Hierarchy**: Mission Control → Teams → Agents
- **Real-Time Status**: Active/Idle/Error indicators
- **Expand/Collapse**: Navigate complex hierarchies
- **Agent Details Panel**: View SOUL, IDENTITY, and stats

### 6. ⚙️ System Dashboard
- OpenClaw Gateway status
- Ollama connection check
- System resource monitoring

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     MissionClaw UI                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐  │
│  │Dashboard│ │ Kanban  │ │Scheduler│ │ Org Chart       │  │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────────┬────────┘  │
│       └───────────┴───────────┴────────────────┘           │
│                         │                                   │
│                    ┌────▼────┐                             │
│                    │ Zustand │ (State Management)          │
│                    └────┬────┘                             │
└─────────────────────────┼──────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │ Ollama  │    │ OpenClaw│    │ Cloud   │
    │ (Local) │    │Gateway  │    │ APIs    │
    └─────────┘    └─────────┘    └─────────┘
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+
- **macOS** or **Linux**
- **Ollama** (optional, for local models)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/sureshchitmil/missionclaw.git
cd missionclaw

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Run with PM2 (Production)

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start npm --name missionclaw -- run start

# Check status
pm2 status

# View logs
pm2 logs missionclaw
```

---

## 📖 How to Use

### Step 1: Dashboard Overview
The dashboard shows:
- Active projects count
- Total agents and their status
- Task statistics by status
- Quick action buttons

### Step 2: Create Agents
1. Go to **Agent Forge** in the sidebar
2. Click **New Agent**
3. Fill in details:
   - Agent Name
   - Role (e.g., Developer, QA, Reviewer)
   - Team (Marketing, Developer, etc.)
   - Type (OpenClaw, Ollama, Cloud)
   - Model selection
   - Avatar selection
4. Click **Create Agent**

### Step 3: Create Tasks
1. Go to **Kanban** board
2. Click **+** on any column
3. Enter:
   - Task title
   - Description (optional)
   - Priority (Low/Medium/High/Urgent)
   - Assign to agent
4. Click **Add Task**

### Step 4: Manage Organization
1. Go to **Org Chart**
2. Click on teams to expand
3. Click on agents to view:
   - Full profile
   - SOUL.md (ethical guidelines)
   - IDENTITY.md (personality)
4. Assign tasks directly from the panel

### Step 5: Schedule Tasks
1. Go to **Scheduler**
2. Create schedules with cron expressions
3. Agents will automatically pick up scheduled tasks

---

## 🔌 OpenClaw Integration

MissionClaw comes with a built-in **OpenClaw Skill** for seamless AI orchestration.

### Installation

The skill is automatically included in OpenClaw. If missing, install via:

```bash
# Using ClawHub
clawhub install missionclaw

# Or manually
cp -r missionclaw ~/.openclaw/skills/
```

### Usage with Velo

When running OpenClaw with Velo, you can:
- Create projects via voice or chat
- Assign tasks to agents
- Check project status
- View organization hierarchy

```bash
# Start MissionClaw first
pm2 start missionclaw

# Then run OpenClaw
openclaw start
```

Open http://localhost:3000 to access the visual interface.



## 📦 Default Agents

MissionClaw comes pre-configured with teams:

### 🏢 Marketing Team
| Agent | Role |
|-------|------|
| 🤖 SEO Specialist | SEO Expert |
| 🧠 Content Writer | Content Creator |
| 🎨 Ad Manager | PPC Specialist |
| 🛠️ Social Media Bot | Social Manager |
| ✨ Email Marketer | Campaign Manager |

### 💻 Developer Team
| Agent | Role |
|-------|------|
| 🧭 Frontend Dev | UI Developer |
| 📚 Backend Dev | API Developer |
| 📊 QA Tester | Quality Assurance |
| 🧑‍🔬 DevOps Engineer | Infrastructure |
| 👻 Code Reviewer | PR Reviewer |

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# OpenClaw Gateway
OPENCLAW_URL=http://localhost:3000

# Ollama (Local Models)
OLLAMA_URL=http://localhost:11434

# Cloud APIs (Optional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...
```

### Turbopack Root Warning

If you see the lockfile warning, add to `next.config.ts`:

```typescript
export default defineNextConfig({
  turbopack: {
    root: __dirname,
  },
});
```

---

## 🛠️ Troubleshooting

### App Won't Start

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Port Already in Use

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Ollama Not Connecting

```bash
# Check if Ollama is running
ollama list

# Start Ollama
ollama serve
```

### Clear Local Storage

```bash
# Clear MissionClaw data
# Open browser DevTools → Application → Local Storage → Clear
```

---

## 📈 Benefits

| Benefit | Description |
|---------|-------------|
| 🚀 **Speed** | Visual interface 10x faster than CLI |
| 👥 **Team Collaboration** | Multiple teams, clear hierarchy |
| 🎯 **Task Management** | Full Kanban with priorities |
| 🤖 **Agent Control** | One-click agent assignment |
| 📊 **Visibility** | Real-time status dashboards |
| 🔒 **Privacy** | Local-first, data stays on machine |
| 🎨 **Beautiful UI** | Dark/Light themes, professional design |

---

## 📝 License

MIT License - See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Lucide React](https://lucide.dev) - Icons
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [OpenClaw](https://github.com/openclaw/openclaw) - Agent framework

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/sureshchitmil">Suresh Chitmil</a>
</p>

<p align="center">
  <a href="https://github.com/sureshchitmil/missionclaw">
    <img src="https://img.shields.io/github/stars/sureshchitmil/missionclaw?style=social" alt="GitHub Stars">
  </a>
</p>
