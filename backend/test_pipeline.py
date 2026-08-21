import os
import wave
import struct
import requests
import json

SERVER_URL = "http://localhost:8000/api/process-voice"
TEST_AUDIO_FILE = "sample_test.wav"


def create_dummy_wav(filename: str, duration_sec: int = 2):
    """Generates a minimal valid mono WAV file if no real recording is provided."""
    sample_rate = 16000
    num_samples = sample_rate * duration_sec

    with wave.open(filename, "wb") as wav:
        wav.setnchannels(1)        # Mono
        wav.setsampwidth(2)        # 16-bit
        wav.setframerate(sample_rate)
        
        # Write silence/flat waveform
        data = struct.pack(f"<{num_samples}h", *([0] * num_samples))
        wav.writeframes(data)
    print(f"Created temporary dummy audio file: {filename}")


def test_endpoint(audio_path: str):
    if not os.path.exists(audio_path):
        create_dummy_wav(audio_path)

    print(f"\nSending '{audio_path}' to {SERVER_URL}...")

    try:
        with open(audio_path, "rb") as f:
            files = {"audio": (os.path.basename(audio_path), f, "audio/wav")}
            data = {"user_time_context": "Tuesday, August 25, 2026 at 02:00 PM"}
            
            response = requests.post(SERVER_URL, files=files, data=data)

        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("\nPipeline Result:")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"Error Response: {response.text}")

    except requests.exceptions.ConnectionError:
        print("\nCould not connect to FastAPI server. Make sure `uvicorn main:app --reload` is running!")


if __name__ == "__main__":
    # Ensure requests is installed: pip install requests
    test_endpoint(TEST_AUDIO_FILE)