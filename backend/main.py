from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import asyncio
import json
import os
import traceback
import datetime
from dotenv import load_dotenv 

load_dotenv()

# Import our new helper functions
import services 

app = FastAPI(title="VoxDo Audio & Workspace Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("CRITICAL: GEMINI_API_KEY is not set!")

genai.configure(api_key=api_key, transport="rest")
ACTIVE_MODEL_NAME = "models/gemini-3.6-flash"

STRUCTURE_PROMPT = """
You are VoxDo's core zero-touch student assistant. Analyze the provided audio recording.
Extract the key context and return a valid JSON object matching the exact schema below.

CRITICAL RULES:
1. If the user is just journaling, reporting progress, or summarizing without stating new action items, the "tasks" array MUST be empty []. Do NOT invent tasks.
2. If the user does not explicitly request or discuss creating a document, presentation, or spreadsheet, the "artifact" key MUST be null.
3. If generating a document, include a 'content' field in the JSON with the full requested text."
SCHEMA:
{
  "journal": {
    "title": "Short descriptive title of the entry",
    "tone": "Focused / Productive / Analytical / Urgent",
    "summary": "Concise synthesis of what was said in 2-3 sentences.",
    "tags": ["tag1", "tag2"]
  },
  "tasks": [
    {
      "title": "Clear action item description",
      "category": "Networking / HCI / General / Coding",
      "priority": "HIGH or NORMAL or ROUTINE",
      "status": "QUEUE",
      "due": "Today / Tomorrow / Friday / Next Week"
    }
  ],
  "artifact": {
    "type": "SHEET or PPTX or DOC or FORM or null",
    "name": "Suggested filename if requested, otherwise null",
    "course": "Associated course name or General",
    "summary": "Brief description of the document"
  }
}

Return ONLY raw JSON, with no markdown code fences or conversational text.
"""

def call_gemini_sync(audio_bytes: bytes, mime_type: str, prompt: str):
    model = genai.GenerativeModel(ACTIVE_MODEL_NAME)
    response = model.generate_content([
        prompt,
        {"mime_type": mime_type, "data": audio_bytes}
    ], request_options={"timeout": 120})
    return response.text

@app.post("/api/process-audio")
async def process_audio(
    file: UploadFile = File(...), 
    access_token: str = Form(None) # Accepts the Google token from Next.js
):
    print(f"\n[+] Ingesting audio upload: {file.filename}")
    try:
        audio_bytes = await file.read()
        mime_type = file.content_type or "audio/webm"
        if "octet-stream" in mime_type:
            mime_type = "audio/webm"
            
        today_str = datetime.datetime.now().strftime("%Y-%m-%d")
        
        dynamic_prompt = STRUCTURE_PROMPT + f"\nCRITICAL: Today's date is {today_str}. All 'due' fields in tasks MUST be formatted strictly as YYYY-MM-DD."

        # 1. Get JSON from Gemini
        raw_text = await asyncio.to_thread(call_gemini_sync, audio_bytes, mime_type, dynamic_prompt)
        cleaned = raw_text.strip()
        if cleaned.startswith("```json"): cleaned = cleaned[7:]
        elif cleaned.startswith("```"): cleaned = cleaned[3:]
        if cleaned.endswith("```"): cleaned = cleaned[:-3]

        data = json.loads(cleaned.strip())
        
        
        # 2. Save Journal to Firestore
        if data.get('journal') and data['journal'].get('title'):
            journal_entry = data['journal']
            journal_entry['date'] = today_str
            doc_id = services.save_to_firestore("journals", journal_entry)
            data['journal']['firestore_id'] = doc_id

        # 3. Save Tasks to Firestore & Google Calendar 
        if data.get('tasks'):
            for task in data['tasks']:
                task['calendar_url'] = None #Default
                
                # If authorized and a valid date exists, push to calendar
                if access_token and task.get('due'):
                    print(f"[+] Pushing task to Calendar: {task['title']}")
                    cal_url= services.create_calendar_event(
                        access_token,
                        title=task['title'],
                        date_str=task['due']
                    )
                    print(f"[DEBUG] Returned Calendar URL: {cal_url}")
                    
                    task['calendar_url'] = cal_url
                    
                print(f"[DEBUG] Task data about to be saved: {task}")
                
                task_id = services.save_to_firestore("tasks", task)
                task['firestore_id'] = task_id

        # 4. Handle Artifacts & Google Workspace
        if data.get('artifact') and data['artifact'].get('type'):
            artifact = data['artifact']
            artifact['url'] = None # Default
            
            print(f"[DEBUG] Recieved Artifact Type: {artifact.get('type')}")
            print(f"[DEBUG] Did we receive an Access Token?: {bool(access_token)}")
            
            # If the user logged in with Google, trigger the APIs
            if access_token:
                if artifact['type'].upper() == 'DOC':
                    print("[+] Requesting Google Docs API...")
                    doc_content = artifact.get('content', data.get('journal', {}).get('summary', ''))
                    doc_url = services.create_google_doc(
                        access_token,
                        title=artifact.get('name', 'VoxDo Generated Doc'),
                        content=doc_content 
                    )
                    artifact['url'] = doc_url
                    artifact['action'] = 'open' if doc_url else 'failed'
                elif artifact['type'].upper() == 'SHEET':
                    print("[+] Requesting Google Sheets API...")
                    # Default headers for an assignment tracker
                    headers = ["Task Name", "Course", "Priority", "Status", "Due Date", "Notes"]
                    
                    sheet_url = services.create_google_sheet(
                        access_token,
                        title=artifact.get('name', 'VoxDo Tracker'),
                        headers=headers
                    )
                    artifact['url'] = sheet_url
                    artifact['action'] = 'open' if sheet_url else 'failed'
            # Save the artifact record to Firestore
            services.save_to_firestore("artifacts", artifact)

        print("[+] Processing and database sync complete.")
        return {"status": "success", "data": data}

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
def health():
    return {"status": "VoxDo API active", "model": ACTIVE_MODEL_NAME}