'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Leaf, MoreHorizontal } from 'lucide-react'
import { useCarbonStore } from '@/stores/carbon-store'
import { sanitizeInput } from '@/lib/sanitize'
import { canSendMessage } from '@/lib/api/rate-limit'
import { toast } from 'sonner'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID())
  
  const currentRecord = useCarbonStore((state) => state.currentRecord)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    const safeMsg = sanitizeInput(userMsg)
    
    if (!canSendMessage()) {
      toast.error('Rate limit exceeded. Please wait a minute.')
      return
    }

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: safeMsg }])
    setIsLoading(true)

    try {
      const res = await fetch('http://localhost:8000/api/v1/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: safeMsg,
          carbon_data: currentRecord || {}
        }),
      })

      if (!res.ok) throw new Error('Failed to get response')
      
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }])
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev, 
        { role: 'assistant', content: "I'm having trouble connecting to the server right now. Please try again later." }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] max-w-4xl mx-auto w-full bg-card border border-border rounded-2xl shadow-sm overflow-hidden relative">
      
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-border bg-green-50/50 dark:bg-green-950/20">
        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 mr-4">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">EcoCoach</h2>
          <p className="text-xs text-muted-foreground flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            Online — Ready to help you go green
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-background/50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-70">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-2">
              <Leaf className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-foreground">Ask me anything about reducing your carbon footprint 🌱</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              I can analyze your data, suggest actionable steps, and help you find greener alternatives for your daily habits.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-primary text-primary-foreground ml-3' : 'bg-green-100 dark:bg-green-900/50 text-green-600 mr-3'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                
                <div className={`px-4 py-3 rounded-2xl whitespace-pre-wrap text-sm sm:text-base shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-green-600 text-white rounded-tr-none' 
                    : 'bg-muted text-foreground border border-border rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex flex-row max-w-[85%] sm:max-w-[75%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/50 text-green-600 mr-3">
                <Bot className="w-5 h-5" />
              </div>
              <div className="px-5 py-4 rounded-2xl bg-muted border border-border rounded-tl-none flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="w-full pl-4 pr-14 py-4 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-shadow shadow-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 disabled:bg-muted disabled:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {isLoading ? <MoreHorizontal className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5 ml-0.5" />}
          </button>
        </form>
      </div>
      
    </div>
  )
}
