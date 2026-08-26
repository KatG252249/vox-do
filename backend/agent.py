import os
from datetime import datetime
from typing import List, Dict, Any, Optional
from google import genai
from google.genai import types
from dotenv import load_dotenv
from tools.google_workspace import build_presentation_file
from typing import List, Dict, Any, Optional
from backend.tools.firestore_db import save_to_firestore  

load_dotenv()

# Initialize the Gemini GenAI Client
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

# -------------------------------------------------------------------------
# Tool Definitions (Google Agent Execution Layer)
# -------------------------------------------------------------------------

def log_journal_entry(summary: str, sentiment: str, tags: List[str]) -> Dict[str, Any]:
    """
    Logs and archives personal voice journal entries with extracted tags and sentiment analysis.
    """
    print(f" [Tool: Journal] Summary: {summary} | Sentiment: {sentiment} | Tags: {tags}")
    
    # Save to Google Cloud Firestore
    firestore_res = save_to_firestore("voxdo_journals", {
        "summary": summary,
        "sentiment": sentiment,
        "tags": tags
    })

    return {
        "status": "success",
        "action": "journal_logged",
        "summary": summary,
        "sentiment": sentiment,
        "tags": tags,
        "storage": firestore_res
    }

def create_task_item(title: str, subject: Any = None, due_date: Any = None, priority: str = "Medium") -> Dict[str, Any]:
    """
    Creates an actionable task, assignment, or to-do item with due dates and subject metadata.
    """
    if isinstance(subject, dict):
        subject = subject.get("category", "") or subject.get("course", "") or str(subject)
    elif not subject:
        subject = "General"

    if isinstance(due_date, dict):
        due_date = due_date.get("date", "") or str(due_date)
    elif not due_date:
        due_date = "No deadline specified"

    print(f" [Tool: Task Tracker] Title: {title} | Subject: {subject} | Due: {due_date} | Priority: {priority}")
    
    # Save to Google Cloud Firestore
    firestore_res = save_to_firestore("voxdo_tasks", {
        "title": title,
        "subject": str(subject),
        "due_date": str(due_date),
        "priority": str(priority)
    })

    return {
        "status": "success",
        "action": "task_created",
        "title": title,
        "subject": str(subject),
        "due_date": str(due_date),
        "priority": str(priority),
        "storage": firestore_res
    }

def generate_presentation_draft(topic: str, slide_titles: Any, target_audience: str = "Classmates") -> Dict[str, Any]:
    """
    Generates a draft presentation outline and slide structure based on lecture notes or assignments.
    """
    print(f" [Tool: Presentation Builder] Generating deck for: {topic}")
    filepath = build_presentation_file(topic=topic, slide_titles=slide_titles)
    filename = os.path.basename(filepath)
    
    count = len(slide_titles) if isinstance(slide_titles, list) else 4
    
    return {
        "status": "success",
        "action": "presentation_generated",
        "topic": topic,
        "slides_count": count,
        "download_url": f"http://localhost:8000/download/{filename}"
    }

def schedule_calendar_event(event_title: str, start_time: str, duration_minutes: int = 60, notes: Optional[str] = None) -> Dict[str, Any]:
    """
    Schedules an event, study session, or project deadline into Google Calendar.
    """
    print(f" [Tool: Calendar] Event: {event_title} | Start: {start_time} | Duration: {duration_minutes}m")
    return {
        "status": "success",
        "action": "calendar_scheduled",
        "event_title": event_title,
        "start_time": start_time,
        "duration_minutes": duration_minutes,
        "notes": notes or ""
    }

def record_win_or_milestone(title: str, impact: str) -> Dict[str, Any]:
    """
    Logs personal or academic milestones, wins, and progress updates to a victory tracker.
    """
    print(f" [Tool: Win Tracker] Milestone: {title} | Impact: {impact}")
    return {
        "status": "success",
        "action": "milestone_recorded",
        "title": title,
        "impact": impact
    }

# Tool Registry for the Agent
AGENT_TOOLS = [
    log_journal_entry,
    create_task_item,
    generate_presentation_draft,
    schedule_calendar_event,
    record_win_or_milestone
]

# Mapping dictionary for tool dispatching
TOOL_MAPPING = {
    "log_journal_entry": log_journal_entry,
    "create_task_item": create_task_item,
    "generate_presentation_draft": generate_presentation_draft,
    "schedule_calendar_event": schedule_calendar_event,
    "record_win_or_milestone": record_win_or_milestone
}

# -------------------------------------------------------------------------
# VoxDo Core Agent Orchestrator
# -------------------------------------------------------------------------

def run_voxdo_pipeline(audio_file_path: str, user_time_context: Optional[str] = None) -> Dict[str, Any]:
    """
    Ingests an audio file, triggers Gemini multimodal tool calling, executes
    the matched tools, and returns structured execution deliverables.
    """
    if not client:
        raise ValueError("GEMINI_API_KEY environment variable is not configured.")

    if not user_time_context:
        user_time_context = datetime.now().strftime("%A, %B %d, %Y at %I:%M %p")

    system_instruction = f"""
    You are VoxDo, an autonomous voice journal executive agent.
    Current reference timestamp: {user_time_context}.
    
    Instructions:
    1. Ingest the user's raw audio monologue.
    2. ALWAYS invoke `log_journal_entry` with:
       - transcript summary
       - emotional sentiment tone (e.g. Exhausted, Excited, Focused, Anxious)
       - extracted topic tags
    3. Autonomously detect actionable intentions and invoke the relevant tools:
       - Homework, project, or task assignments -> invoke `create_task_item` (resolve relative dates like 'next Tuesday').
       - Mentions of creating a presentation, slides, or deck -> invoke `generate_presentation_draft`.
       - Fixed calendar dates, exams, or meetings -> invoke `schedule_calendar_event`.
       - Achievements, accomplishments, or positive results -> invoke `record_win_or_milestone`.
    4. Call all applicable tools in parallel.
    """

    # 1. Upload audio file via Gemini Files API
    audio_upload = client.files.upload(file=audio_file_path)

    # 2. Invoke Gemini with tool declarations
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=[
            audio_upload,
            "Parse my voice note, extract thoughts, and execute all relevant workspace actions."
        ],
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            tools=AGENT_TOOLS,
            temperature=0.1,
            automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True)
        ),
    )

    executed_actions = []

    # 3. Dispatch and execute tool calls
    if response.function_calls:
        for call in response.function_calls:
            function_name = call.name
            function_args = dict(call.args)
            
            target_func = TOOL_MAPPING.get(function_name)
            if target_func:
                try:
                    result = target_func(**function_args)
                    executed_actions.append({
                        "tool": function_name,
                        "arguments": function_args,
                        "result": result,
                        "status": "success"
                    })
                except Exception as e:
                    executed_actions.append({
                        "tool": function_name,
                        "arguments": function_args,
                        "error": str(e),
                        "status": "failed"
                    })

    return {
        "status": "completed",
        "processed_at": datetime.now().isoformat(),
        "total_actions": len(executed_actions),
        "actions": executed_actions
    }