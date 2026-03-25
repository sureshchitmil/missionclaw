# PRD: MissionClaw Mission Control
Version: 1.2

## Project Name: MissionClaw

**Tagline:** One-Command Project Management & AI Orchestration for OpenClaw.

**Author:** Suresh Chitmil

**Target Hardware:** Optimized for MacBook M4 (16GB RAM).

---

## 1. Vision & Executive Summary

MissionClaw is a beginner-friendly, high-performance web dashboard designed to manage autonomous AI agents via the OpenClaw framework. It transforms complex terminal configurations into a visual "Mission Control" featuring a Project-scoped Kanban, an automated Task Scheduler, and a dynamic Org Chart.

---

## 2. Installation & Setup (Beginner-Friendly)

### 2.1 One-Command Install
```bash
curl -sSL https://missionclaw.ai/install.sh | bash
```
Action: Detects Node.js, Docker, and Ollama; clones the repo; sets up .env; and launches the UI on localhost:3000.

### 2.2 Docker Orchestration
- missionclaw-ui: Next.js frontend and Node.js backend.
- missionclaw-db: SQLite or PostgreSQL for persistent tasks/notes.
- openclaw-gateway: Automatically bridges to local agent processes.

---

## 3. Core Functional Modules

### 3.1 Project-Scoped Workspace (The "Active Context")
- Project Selection: A dropdown in the top navigation bar.
- Isolation: When a project is selected, the Kanban, Scheduler, and Org Chart filter automatically.

### 3.2 The Agent Forge (Multi-Model Routing)
- OpenClaw Native: Uses the Gateway's internal orchestration.
- Ollama (Local): Dropdown of models (Llama 3.2, Qwen 2.5). RAM Pressure Warning for 16GB limits.
- Cloud (API): Integration for OpenAI, Anthropic, and Gemini.
- Personality Editors: Visual Markdown fields for SOUL.md and IDENTITY.md.

### 3.3 Project-Specific Kanban Board
- Columns: Backlog, To Do, In Progress, Review, Done.
- Agent Assignment: Drag an agent icon onto a Kanban card.
- Automated Movement: Agents can trigger API calls to move their own cards.

### 3.4 Task Scheduler (The "Heartbeat")
- Cron-based Logic: Schedule agents to perform repetitive tasks.
- Project Linkage: Schedules are tied to the active project folder.
- Manual Overrides: One-click "Run Now" button.

### 3.5 Visual Org Chart
- Hierarchy Mapping: Drag-and-drop tree view.
- Live Status: Lines between agents glow when data is being passed.

---

## 4. UI/UX Design Specifications

### 4.1 Theme & Vibe
**Dark Mode (Obsidian - Default):**
- Background: #0D1117
- Cards: #161B22
- Accents: #38BDF8 (Sky Blue)

**Light Mode (Clean):**
- Background: #F8FAFC
- Cards: #FFFFFF
- Accents: #0284C7 (Deep Blue)

### 4.2 Layout Architecture
- Top Navigation: Project Selector, System Health, M4 RAM usage gauge.
- Left Sidebar: Fast access to Kanban, Scheduler, Org Chart, Agent Forge.
- Center Canvas: The primary workspace.
- Right Sidebar (Inspector): Contextual details.

---

## 5. Technical Constraints
- Local-First: All data stored locally (SQLite).
- Performance: Use Zustand for state management.
- Security: API Keys in local .env, never exposed to frontend.

---

## 6. Advanced Future Features
- Hardware Kill-Switch: SIGKILL to all local LLM processes.
- Voice Mission Orders: macOS Dictation integration.
- Mobile Remote: PWA for monitoring.