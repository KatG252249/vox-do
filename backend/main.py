import os
import shutil
import tempfile
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi.responses import FileResponse

from agent import run_voxdo_pipeline

load_dotenv()

app = FastAPI(
    title="VoxDo Agent API",
    description="Autonomous Voice Journal & Workspace Action Dispatcher",
    version="1.0.0"
)

# Configure CORS for local development and production frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"  # Open for hackathon evaluation; restrict in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    """Health check endpoint for Google Cloud Run container readiness."""
    return {
        "status": "healthy",
        "service": "VoxDo Backend",
        "model": "gemini-2.5-flash"
    }


@app.post("/api/process-voice", status_code=status.HTTP_200_OK)
async def process_voice_endpoint(
    audio: UploadFile = File(...),
    user_time_context: Optional[str] = Form(None)
):
    """
    Receives an audio stream/file from the frontend, securely buffers it
    to a temporary file on disk, invokes the Gemini agent pipeline,
    and cleans up temporary resources.
    """
    # 1. Validate file format / content
    if not audio.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must have a valid filename."
        )

    # Extract original extension or default to .webm / .wav
    _, ext = os.path.splitext(audio.filename)
    if not ext:
        ext = ".webm"

    temp_audio_path = None

    try:
        # 2. Write uploaded audio stream to a safe temporary file on disk
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_file:
            shutil.copyfileobj(audio.file, temp_file)
            temp_audio_path = temp_file.name

        # 3. Trigger the VoxDo Agent Pipeline
        pipeline_output = run_voxdo_pipeline(
            audio_file_path=temp_audio_path,
            user_time_context=user_time_context
        )

        return pipeline_output

    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Configuration error: {str(ve)}"
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process voice pipeline: {str(e)}"
        )
    finally:
        # 4. Guarantee cleanup of temporary disk storage
        if temp_audio_path and os.path.exists(temp_audio_path):
            try:
                os.remove(temp_audio_path)
            except OSError:
                pass
        await audio.close()


if __name__ == "__main__":
    import uvicorn
    # Use PORT environment variable required by Google Cloud Run
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
 
    
@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join("generated_files", filename)
    if os.path.exists(file_path):
        return FileResponse(
            path=file_path,
            filename=filename,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation"
        )
    raise HTTPException(status_code=404, detail="File not found")