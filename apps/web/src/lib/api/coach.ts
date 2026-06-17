import { apiFetch } from "./client"
import { ChatMessage } from "@/types"

export async function sendMessage(session_id: string, message: string, carbon_data: object): Promise<{response: string, session_id: string}> {
  return apiFetch<{response: string, session_id: string}>("/api/v1/coach/chat", {
    method: "POST",
    body: JSON.stringify({ session_id, message, carbon_data }),
  })
}

export async function getChatHistory(session_id: string): Promise<{messages: ChatMessage[], session_id: string}> {
  return apiFetch<{messages: ChatMessage[], session_id: string}>(`/api/v1/coach/history/${session_id}`)
}
