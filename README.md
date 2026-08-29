# 🎙️ Vox-Do: Autonomous Voice Journal & Workspace Agent
Vox-Do is an autonomous voice journal and workspace agent that turns unstructured speech into structured personal logs and zero-touch Google Workspace actions (Docs, Slides, Calendar, Tasks) using Gemini 3.5, the Google GenAI SDK, and Google Cloud Run.

> **Turn unstructured stream-of-consciousness voice dumps into structured personal journals and instantly generate foundational drafts across your Google Workspace ecosystem.**

---

## 🚀 Overview

Students and professionals often face **context switching fatigue**—manually jumping between audio recorders, task trackers, calendars, slide creators, and note-taking apps. 

**Vox-Do** reconceptualizes the voice journal:
1. **Multimodal Audio Ingestion:** Capture raw, natural speech directly from the browser using a Next.js web client.
2. **Intent Parsing & Emotional Archiving:** Process emotional tone, personal reflections, and introspective logs into a clean, Firestore-synced diary view.
3. **Autonomous Tool Dispatching:** Identify actionable items, calculate relative deadlines (e.g., *"next Tuesday"*), and autonomously trigger Google Workspace APIs to draft slide decks, create calendar invites, populate task lists, and track academic/professional milestones.

---

## 🛠️ Google Tech Stack & Hackathon Requirements

This project meets the Google Global Hackathon criteria across all required layers:

| Layer | Technology | Role / Purpose |
| :--- | :--- | :--- |
| **Multimodal Model** | Gemini 3.5 | Direct audio processing, contextual intent extraction, semantic understanding, and artifact generation. |
| **Agent Framework** | GenAI SDK | Orchestrates function calling, execution loops, and parses structured JSON instructions. |
| **Cloud Infrastructure** | Cloud Run + Firestore | Serverless FastAPI backend runtime and real-time database for journal entries and tasks. |

---

## 🏗️ Architecture Pipeline

```text
[ User Authentication (NextAuth + Google OAuth 2.0) ]
               │ (Grants Workspace & Drive Permissions)
               ▼
[ Next.js Frontend (Vercel): Web Audio Capture & Dashboard ]
               │ (Transmits Audio File + Access Token)
               ▼
[ FastAPI Backend on Google Cloud Run ]
               │
               ▼
[ Gemini 3.5 Engine + Google GenAI SDK ]
               │
               ├──► 1. Journal & Sentiment Logger ──► Cloud Firestore Database
               ├──► 2. Assignment / Task Tracker  ──► Cloud Firestore Database
               ├──► 3. Workspace Artifact Builder ──► Google Docs / Sheets / Slides API
               └──► 4. Calendar Scheduler         ──► Google Calendar API
               │
               ▼
[ Live Dashboard: Real-Time UI Syncs via Firestore ]
```

---

## 📂 Project Structure

```text
vox-do/
├── backend/
│   ├── tools/                  # Integration tools (Workspace, Firestore)
│   ├── generated_files/        # Output directory for local artifacts
│   ├── agent.py                # Gemini orchestration and intent parsing
│   ├── main.py                 # FastAPI backend & audio ingestion endpoint
│   ├── services.py             # Additional backend service logic
│   ├── test_pipeline.py        # Local testing and validation script
│   ├── Dockerfile              # Container configuration for Google Cloud Run
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Backend environment variables
│   └── serviceAccountKey.json  # Firebase/GCP credentials (Gitignored)
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/auth/[...nextauth]/route.ts # NextAuth & Google OAuth config
│   │   │   ├── login/page.tsx                  # Dedicated authentication route
│   │   │   ├── layout.tsx                      # Global Next.js layout
│   │   │   └── page.tsx                        # Main application entry point
│   │   ├── components/
│   │   │   ├── views/                          # Modular UI displays
│   │   │   │   ├── ActionsView.tsx
│   │   │   │   ├── ArtifactsView.tsx
│   │   │   │   ├── DashboardView.tsx
│   │   │   │   └── JournalView.tsx
│   │   │   ├── AudioRecorder.tsx               # Web Audio capture interface
│   │   │   ├── Navbar.tsx                      # Application navigation
│   │   │   └── Providers.tsx                   # Session & State providers
│   │   └── lib/
│   │       ├── firebase.ts                     # Frontend Firestore initialization
│   │       └── middleware.ts                   # Next.js route protection
│   ├── .env.local              # Frontend environment variables
│   ├── package.json            # Node.js dependencies
│   └── tailwind.config.ts      # Tailwind CSS styling configuration
└── README.md                   # Main project documentation
```

---

## ⚡ Quickstart & Local Development

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment variables
export GEMINI_API_KEY="your-gemini-api-key"
export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account.json"

# Run FastAPI server
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## ☁️ Deployment (Google Cloud Run)

Deploy the backend directly to Google Cloud Run:

```bash
gcloud run deploy voxdo-backend \
  --source ./backend \
  --region us-central1 \
  --allow-unauthenticated
```

---

### Reproducible Testing Instructions

To reproduce the workflow and verify the backend integration, follow these exact steps:
1. **Authenticate:** Navigate to the frontend URL and click "Log In".
2. **Grant Granular Permissions:** When the Google OAuth consent screen appears, manually check all boxes to grant Drive and Workspace access.
3. **Record Intent:** On the dashboard, click the microphone and record a structured prompt (e.g., "Create a spreadsheet master list for my IT students including their names and grades").
4. **Verify Processing:** Open the browser Developer Tools (Console) to monitor the frontend awaiting the session and successfully fetching the JSON payload.
5. **Confirm UI Update:** Check the dashboard to ensure the new tasks and artifacts instantly render without a page refresh.
6. **Validate Execution:** Open the connected Google Drive account to verify the autonomous creation of the requested Workspace artifact.

---

## 👥 Team & Submission Details

- **Hackathon:** All Things Agentic Hackathon
- **Name:** Katherine Gozum (Solo Build)
- **Demo Video:** [Loom / YouTube Link Placeholder]