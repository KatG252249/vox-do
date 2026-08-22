import os
from datetime import datetime
from typing import Dict, Any

try:
    from google.cloud import firestore
    # Initialize Firestore client (uses GOOGLE_APPLICATION_CREDENTIALS env var)
    db = firestore.Client(database="vox-do-app")
    FIRESTORE_AVAILABLE = True
except Exception as e:
    print(f"[*] Note: Running Firestore in local mock mode (Cloud credentials not detected): {e}")
    db = None
    FIRESTORE_AVAILABLE = False


def save_to_firestore(collection_name: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Saves structured workspace data (journals, tasks, milestones) to Google Cloud Firestore.
    """
    payload = {
        **data,
        "created_at": datetime.utcnow().isoformat(),
        "source": "VoxDo Executive Agent"
    }

    if not FIRESTORE_AVAILABLE or db is None:
        # Fallback local log so you can test smoothly without active GCP keys yet
        print(f" [Cloud Storage - Mock Firestore] Collection '{collection_name}': {payload}")
        return {"status": "mock_saved", "collection": collection_name, "data": payload}

    try:
        doc_ref = db.collection(collection_name).document()
        doc_ref.set(payload)
        print(f" [Cloud Storage - Firestore] Successfully stored in '{collection_name}' [ID: {doc_ref.id}]")
        return {"status": "success", "firestore_id": doc_ref.id, "collection": collection_name}
    except Exception as e:
        print(f" [Cloud Storage Error] Failed to write to Firestore: {e}")
        return {"status": "error", "message": str(e)}