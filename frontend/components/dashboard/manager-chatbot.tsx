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
  const [userRole, setUserRole] = useState<string>('Manager')
  const [userName, setUserName] = useState<string>('Utilisateur')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('current_user') || '{}')
      if (u.role) setUserRole(u.role)
      if (u.name) setUserName(u.name)
    } catch (e) {
      console.warn(e)
    }
  }, [])

  const isTrainer = userRole === 'Formateur'

  const botTitle = isTrainer
    ? (lang === 'en' ? 'Trainer Assistant' : 'Assistant Formateur')
    : t.botTitle

  const botActive = isTrainer
    ? (lang === 'en' ? 'Personal Schedule & Activity' : 'Planning & Activité Personnelle')
    : t.botActive

  const botPlaceholder = isTrainer
    ? (lang === 'en' ? 'Ask about your schedule, past courses, quota...' : 'Posez une question sur votre planning, jours réalisés, quota...')
    : t.botPlaceholder

  const welcomeText = isTrainer
    ? (lang === 'en'
        ? `👋 Hello ${userName}! I am your dedicated Trainer Assistant. You can ask me questions about your upcoming training schedule, completed courses, annual days quota (82d/107d), or N+1 approvals.`
        : `👋 Bonjour ${userName} ! Je suis votre Assistant Formateur dédié. Posez-moi vos questions sur votre planning à venir, vos formations passées, votre quota annuel de jours (82j/107j), ou votre validation N+1.`)
    : t.botWelcome

  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }, [lang, isTrainer, userName, welcomeText])

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
      const botReply = getBotResponse(userText, lang, isTrainer, userName)
      const botMsg: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, botMsg])
    }, 450)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative flex size-11 items-center justify-center rounded-full bg-[#5b0dbc] hover:bg-[#4a0a9c] text-white shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer border border-white/20"
          title={isTrainer ? 'Assistant Formateur' : t.botName}
        >
          <Sparkles className="size-5 text-amber-300 animate-pulse" />
          <span className="absolute -top-0.5 -right-0.5 flex size-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="absolute -top-0.5 -right-0.5 flex size-2.5 rounded-full bg-emerald-500" />
        </button>
      ) : (
        <ChatbotWindow
          botTitle={botTitle}
          botActive={botActive}
          botPlaceholder={botPlaceholder}
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
