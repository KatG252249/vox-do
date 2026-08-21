# 🎙️ Vox-Do: Autonomous Voice Journal & Workspace Agent
Vox-Do is an autonomous voice journal and workspace agent that turns unstructured speech into structured personal logs and zero-touch Google Workspace actions (Docs, Slides, Calendar, Tasks) using Gemini, the Google Agent Framework, and Google Cloud Run.

> **Turn unstructured stream-of-consciousness voice dumps into structured personal journals and automated, zero-touch actions across your Google Workspace ecosystem.**

---

## 🚀 Overview

Students and professionals often face **context switching fatigue**—manually jumping between audio recorders, task trackers, calendars, slide creators, and note-taking apps. 

**Vox-Do** reconceptualizes the voice journal:
1. **Multimodal Audio Ingestion:** Capture raw, natural speech directly from the browser.
2. **Intent Parsing & Emotional Archiving:** Process emotional tone, personal reflections, and introspective logs into a clean diary view.
3. **Autonomous Tool Dispatching:** Identify actionable items, calculate relative deadlines (e.g., *"next Tuesday"*), and autonomously trigger Google Workspace APIs to draft slide decks, create calendar invites, populate task lists, and track academic/professional milestones.

---

## 🛠️ Google Tech Stack & Hackathon Requirements

This project meets the Google Global Hackathon criteria across all required layers:

| Layer | Technology | Role / Purpose |
| :--- | :--- | :--- |
| **Multimodal Model** | **Gemini 2.5 Flash / Pro** | Direct audio processing, contextual intent extraction, semantic understanding, and slide/doc generation. |
| **Agent Framework** | **Google Antigravity SDK / GenAI SDK** | Orchestrates tool definitions, function calling, execution loops, and parallel dispatching. |
| **Cloud Infrastructure** | **Google Cloud Run + Cloud Firestore** | Serverless, containerized FastAPI backend runtime and real-time database for journal entries and tasks. |

---

## 🏗️ Architecture Pipeline

```text
[ User Voice Dump (Web Audio) ]
               │
               ▼
[ FastAPI Backend on Google Cloud Run ]
               │
               ▼
[ Gemini Engine + Google Agent Framework (Antigravity SDK) ]
               │
               ├──► 1. Journal & Sentiment Logger ──► Cloud Firestore Database
               ├──► 2. Assignment / Task Tracker   ──► Google Tasks / Firestore
               ├──► 3. Slide Deck Builder          ──► Google Slides / PPTX Generator
               └──► 4. Calendar Scheduler          ──► Google Calendar API
               │
               ▼
[ Live Dashboard: Journal Card + Real-Time Execution Deliverables ]
```

---

## 📂 Project Structure

```text
voice-journal-agent/
├── backend/
│   ├── main.py                 # FastAPI backend & audio ingestion endpoint
│   ├── agent.py                # Gemini & Agent framework orchestrator
│   ├── tools/
│   │   ├── google_workspace.py # Slides, Docs, Calendar, and Tasks integrations
│   │   └── firestore_db.py     # Firestore database helper
│   ├── requirements.txt        # Python dependencies
│   └── Dockerfile              # Container configuration for Google Cloud Run
├── frontend/
│   ├── src/ (or app/)
│   │   ├── components/
│   │   │   ├── AudioRecorder.tsx # Voice capture interface
│   │   │   └── ActionFeed.tsx    # Live generated actions and journal display
│   │   └── page.tsx
│   ├── package.json
│   └── tailwind.config.js
└── README.md
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
gcloud run deploy echoflow-backend \
  --source ./backend \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 👥 Team & Submission Details

- **Hackathon:** Google Global Hackathon
- **Name:** Katherine Gozum (Solo Build)
- **Demo Video:** [Loom / YouTube Link]
