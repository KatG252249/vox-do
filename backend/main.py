from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import asyncio
import json
import os
import traceback

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

# Explicitly target modern Gemini 3.6 release requested by the API
ACTIVE_MODEL_NAME = "models/gemini-3.6-flash"
print(f"[+] Active Gemini Model set to: {ACTIVE_MODEL_NAME}")

STRUCTURE_PROMPT = """
You are VoxDo's core zero-touch student assistant. Analyze the provided audio recording.
Extract the key context and return a valid JSON object matching the exact schema below.

CRITICAL RULES:
1. If the user is just journaling, reporting progress, or summarizing without stating new action items, the "tasks" array MUST be empty []. Do NOT invent tasks.
2. If the user does not explicitly request or discuss creating a document, presentation, or spreadsheet, the "artifact" key MUST be null.

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
      "title": "Clear action item description (ONLY if an action is required)",
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

def call_gemini_sync(audio_bytes: bytes, mime_type: str):
    model = genai.GenerativeModel(ACTIVE_MODEL_NAME)
    response = model.generate_content([
        STRUCTURE_PROMPT,
        {"mime_type": mime_type, "data": audio_bytes}
    ], request_options={"timeout": 30})
    return response.text

@app.post("/api/process-audio")
async def process_audio(file: UploadFile = File(...)):
    print(f"\n[+] Ingesting audio upload: {file.filename}")
    try:
        audio_bytes = await file.read()
        print(f"[+] Audio payload size: {len(audio_bytes)} bytes")

        if len(audio_bytes) < 100:
            raise ValueError("Audio recording was too short or empty. Speak for 2-3 seconds.")

        mime_type = file.content_type or "audio/webm"
        if "octet-stream" in mime_type:
            mime_type = "audio/webm"

        raw_text = await asyncio.to_thread(call_gemini_sync, audio_bytes, mime_type)
        print("[+] Gemini 3.6 inference complete.")

        cleaned = raw_text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        elif cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]

        data = json.loads(cleaned.strip())
        return {"status": "success", "data": data}

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
def health():
    return {"status": "VoxDo API active", "model": ACTIVE_MODEL_NAME}