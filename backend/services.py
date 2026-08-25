import firebase_admin
from firebase_admin import credentials, firestore
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import datetime

# --- 1. FIRESTORE SETUP ---
# You will need to download your serviceAccountKey.json from Firebase Console
try:
    if not firebase_admin._apps:
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    print(f"Firebase init error (Make sure serviceAccountKey.json exists): {e}")
    db = None

def save_to_firestore(collection_name, data):
    if not db:
        return None
    doc_ref = db.collection(collection_name).document()
    data['id'] = doc_ref.id # Attach the generated ID
    doc_ref.set(data)
    return doc_ref.id

# --- 2. GOOGLE WORKSPACE SETUP ---
def get_google_service(access_token, api_name, api_version):
    """Builds a Google API client using the user's NextAuth token."""
    creds = Credentials(token=access_token)
    return build(api_name, api_version, credentials=creds)

def create_google_doc(access_token, title, content):
    """Creates a Google Doc and inserts the generated summary."""
    try:
        service = get_google_service(access_token, 'docs', 'v1')
        doc = service.documents().create(body={'title': title}).execute()
        document_id = doc.get('documentId')
        
        # Insert text into the new document
        requests = [{'insertText': {'location': {'index': 1}, 'text': content}}]
        service.documents().batchUpdate(
            documentId=document_id, 
            body={'requests': requests}
        ).execute()
        
        return f"https://docs.google.com/document/d/{document_id}/edit"
    except Exception as e:
        print(f"Error creating Google Doc: {e}")
        return None

def create_calendar_event(access_token, title, date_str):
    """Adds a task to Google Calendar as an all-day event."""
    try:
        service = get_google_service(access_token, 'calendar', 'v3')
        event = {
            'summary': f"VoxDo Task: {title}",
            'start': {'date': date_str}, # Format: YYYY-MM-DD
            'end': {'date': date_str}
        }
        created_event = service.events().insert(calendarId='primary', body=event).execute()
        return created_event.get('htmlLink')
    except Exception as e:
        print(f"Error creating Calendar Event: {e}")
        return None