# app/services/memory_store.py
import uuid
from datetime import datetime
from typing import Optional

# In-memory storage
_records: dict[str, dict] = {}          # record_id -> CarbonResult dict
_recommendations: dict[str, list] = {}  # user_id -> list of recommendations
_chat_history: dict[str, list] = {}     # session_id -> list of messages

def save_record(record: dict) -> str:
    """Save a carbon record, return its ID."""
    record_id = str(uuid.uuid4())
    _records[record_id] = {**record, "saved_at": datetime.utcnow().isoformat()}
    return record_id

def get_record(record_id: str) -> Optional[dict]:
    """Get a record by ID."""
    return _records.get(record_id)

def get_all_records() -> list[dict]:
    """Get all records (simulates user history)."""
    return list(_records.values())

def save_chat_message(session_id: str, role: str, content: str):
    """Append a message to chat history."""
    if session_id not in _chat_history:
        _chat_history[session_id] = []
    _chat_history[session_id].append({
        "role": role,
        "content": content,
        "timestamp": datetime.utcnow().isoformat()
    })

def get_chat_history(session_id: str) -> list[dict]:
    """Get chat history for a session."""
    return _chat_history.get(session_id, [])

def clear_chat_history(session_id: str):
    """Clear chat history for a session."""
    _chat_history[session_id] = []
