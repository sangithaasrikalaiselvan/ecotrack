import anthropic
from app.core.config import settings
from app.services.memory_store import get_chat_history, save_chat_message
import logging

__all__ = ["build_user_context", "get_ai_response"]

logger = logging.getLogger(__name__)

# Use AsyncAnthropic to be compatible with async FastAPI routes without blocking
client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

SYSTEM_PROMPT = """
  You are EcoCoach, a sustainability advisor for EcoTrack AI.
  
  Your purpose is to help people understand their personal
  contribution to climate change and take concrete action.
  
  The user's data:
  - Monthly carbon footprint: {total_kg} kg CO₂
  - Transport: {transport_kg} kg | Electricity: {electricity_kg} kg
  - Food: {food_kg} kg | Waste: {waste_kg} kg
  - Green Score: {green_score}/100
  - Country average: {country_avg_kg} kg/month
  
  Response rules:
  1. Start with one sentence contextualizing their footprint
     vs country average. Be specific with numbers.
  2. Give exactly 3 recommendations, ordered by CO₂ impact
     (highest saving first).
  3. Each recommendation must include:
     - Specific action (not vague — "take bus on Monday and
       Wednesday" not "use public transport more")
     - Exact CO₂ saving in kg/month
     - One sentence on how to start today
  4. End with their potential green score if they follow
     all 3 recommendations.
  5. Keep total response under 250 words.
  6. Never be preachy. Never use the word "should".
     Use "could" or "would" instead.
  """

def build_user_context(carbon_data: dict) -> str:
    """Build context string from carbon data to inject into prompt."""
    return f"""
User's current monthly carbon footprint:
- Transport: {carbon_data.get('transport_kg', 0):.1f} kg CO₂
- Electricity: {carbon_data.get('electricity_kg', 0):.1f} kg CO₂
- Food: {carbon_data.get('food_kg', 0):.1f} kg CO₂
- Waste: {carbon_data.get('waste_kg', 0):.1f} kg CO₂
- TOTAL: {carbon_data.get('total_kg', 0):.1f} kg CO₂/month
- Green Score: {carbon_data.get('green_score', 0)}/100
- vs Country Average: {carbon_data.get('country_avg_kg', 300):.0f} kg/month
"""

async def get_ai_response(
    session_id: str,
    user_message: str,
    carbon_data: dict
) -> str:
    """
    Send message to Claude, return response string.
    - Prepend carbon context to first message of each session
    - Maintain last 10 messages of history for context window efficiency
    - Save both user message and assistant response to memory store
    - Raise ValueError with friendly message if API call fails
    """
    history = get_chat_history(session_id)
    
    # Prepend context to first message
    if not history:
        context = build_user_context(carbon_data)
        actual_message = f"{context}\n\nUser Message: {user_message}"
    else:
        actual_message = user_message
        
    save_chat_message(session_id, "user", actual_message)
    
    # Reload history to include the new user message
    updated_history = get_chat_history(session_id)
    
    # Anthropic API requires alternating user/assistant messages starting with 'user'.
    # Grab up to last 10 messages (5 pairs) safely.
    recent_history = updated_history[-10:]
    while recent_history and recent_history[0]["role"] != "user":
        recent_history.pop(0)
        
    # Format messages for Anthropic
    messages = [{"role": msg["role"], "content": msg["content"]} for msg in recent_history]
    
    try:
        # Use claude-3-5-sonnet which is the latest standard model
        response = await client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            system=SYSTEM_PROMPT,
            messages=messages
        )
        assistant_reply = response.content[0].text
        save_chat_message(session_id, "assistant", assistant_reply)
        return assistant_reply
    except Exception as e:
        logger.error(f"Anthropic API Error: {e}")
        raise ValueError("EcoCoach is currently unavailable due to an API error. Please try again later.")
