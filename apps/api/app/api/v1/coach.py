from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

from app.services.ai_coach import get_ai_response
from app.services.memory_store import get_chat_history, clear_chat_history

router = APIRouter()

class ChatRequest(BaseModel):
    session_id: str
    message: str
    carbon_data: dict

from app.core.config import settings
import re

def sanitize_message(message: str) -> str:
    message = message.strip()
    if len(message) > settings.MAX_CHAT_MESSAGE_LENGTH:
        message = message[:settings.MAX_CHAT_MESSAGE_LENGTH]
    
    patterns = [
        r"ignore (previous|above|all) instructions",
        r"you are now",
        r"new system prompt",
        r"disregard your",
        r"forget everything",
    ]
    
    msg_lower = message.lower()
    for pattern in patterns:
        if re.search(pattern, msg_lower):
            raise HTTPException(status_code=400, detail="Invalid message content")
            
    return message

@router.post("/chat")
async def chat(request: ChatRequest):
    """Send a message to the AI EcoCoach."""
    if not settings.ANTHROPIC_API_KEY or settings.ANTHROPIC_API_KEY == "your_key_here":
        return {
            "response": "AI coach is not configured. Please add ANTHROPIC_API_KEY to .env",
            "session_id": request.session_id
        }
        
    try:
        safe_message = sanitize_message(request.message)
        response = await get_ai_response(
            session_id=request.session_id,
            user_message=safe_message,
            carbon_data=request.carbon_data
        )
        return {"response": response, "session_id": request.session_id}
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{session_id}")
async def get_history(session_id: str):
    """Fetch chat history for a session."""
    messages = get_chat_history(session_id)
    return {"messages": messages, "session_id": session_id}

@router.delete("/history/{session_id}")
async def clear_history(session_id: str):
    """Clear chat history for a session."""
    clear_chat_history(session_id)
    return {"cleared": True}
