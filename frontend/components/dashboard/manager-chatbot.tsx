'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { getBotResponse } from '@/components/dashboard/chatbot/chatbot-rules'
import { ChatbotWindow, type Message } from '@/components/dashboard/chatbot/chatbot-window'
export function ManagerChatbot() {
  const { t, lang } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: t.botWelcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }, [lang, t])

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userText = input.trim()
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg: Message = { id: Date.now(), sender: 'user', text: userText, timestamp: now }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    setTimeout(() => {
      const botReply = getBotResponse(userText, lang)
      const botMsg: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, botMsg])
    }, 500)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative flex size-11 items-center justify-center rounded-full bg-[#5b0dbc] hover:bg-[#4a0a9c] text-white shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer border border-white/20"
          title={t.botName}
        >
          <Sparkles className="size-5 text-amber-300 animate-pulse" />
          <span className="absolute -top-0.5 -right-0.5 flex size-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="absolute -top-0.5 -right-0.5 flex size-2.5 rounded-full bg-emerald-500" />
        </button>
      ) : (
        <ChatbotWindow
          botTitle={t.botTitle}
          botActive={t.botActive}
          botPlaceholder={t.botPlaceholder}
          messages={messages}
          input={input}
          setInput={setInput}
          onSendMessage={handleSendMessage}
          onClose={() => setIsOpen(false)}
          chatEndRef={chatEndRef}
        />
      )}
    </div>
  )
}
