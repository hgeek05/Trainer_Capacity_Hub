'use client'

import React from 'react'
import { Bot, Send, User, X } from 'lucide-react'

export interface Message {
  id: number
  sender: 'bot' | 'user'
  text: string
  timestamp: string
}

interface ChatbotWindowProps {
  botTitle: string
  botActive: string
  botPlaceholder: string
  messages: Message[]
  input: string
  setInput: (val: string) => void
  onSendMessage: (e: React.FormEvent) => void
  onClose: () => void
  chatEndRef: React.RefObject<HTMLDivElement | null>
}

export function ChatbotWindow({
  botTitle,
  botActive,
  botPlaceholder,
  messages,
  input,
  setInput,
  onSendMessage,
  onClose,
  chatEndRef,
}: ChatbotWindowProps) {
  return (
    <div className="w-80 sm:w-96 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
      <div className="bg-purple-600 text-white p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-white/20">
            <Bot className="size-4.5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-xs leading-tight">{botTitle}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-purple-100 font-medium">{botActive}</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="p-3.5 h-72 overflow-y-auto space-y-3 bg-secondary/30 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-purple-600/10 text-purple-600 mt-1">
                <Bot className="size-3.5" />
              </div>
            )}
            <div
              className={`max-w-[82%] p-3 rounded-xl leading-relaxed whitespace-pre-line text-xs ${
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none shadow-xs'
                  : 'bg-card text-foreground border border-border/80 rounded-bl-none shadow-2xs font-medium'
              }`}
            >
              {msg.text}
              <span
                className={`block text-[9px] mt-1 font-mono ${
                  msg.sender === 'user' ? 'text-purple-200 text-right' : 'text-muted-foreground'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
            {msg.sender === 'user' && (
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-1">
                <User className="size-3.5" />
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={onSendMessage} className="p-2.5 bg-card border-t border-border flex gap-2">
        <input
          type="text"
          placeholder={botPlaceholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 h-9 px-3 rounded-lg border border-border bg-secondary/50 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-600/20"
        />
        <button
          type="submit"
          className="flex h-9 items-center justify-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
        >
          <Send className="size-3.5" />
        </button>
      </form>
    </div>
  )
}
