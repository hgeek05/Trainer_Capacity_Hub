'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Bot, MessageSquare, Send, Sparkles, User, X } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

interface Message {
  id: number
  sender: 'bot' | 'user'
  text: string
  timestamp: string
}

export function ManagerChatbot() {
  const { t, lang } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

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

  const chatEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userText = input.trim()
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      timestamp: now,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')

    // Intelligence conversationnelle basée sur le contexte du Trainer Capacity Hub
    setTimeout(() => {
      let botReply = lang === 'en'
        ? "I did not understand your request. You can ask about 'overloaded', 'available', 'center', or 'target'."
        : "Je n'ai pas bien compris votre demande. Vous pouvez demander 'surchargé', 'disponible', 'centre' ou 'cible'."

      const query = userText.toLowerCase()

      if (query.includes('surchargé') || query.includes('surcharge') || query.includes('alerte') || query.includes('overload') || query.includes('critical')) {
        botReply = lang === 'en'
          ? "⚠️ **Workload Overload Audit**: 2 trainers currently exceed the 107d target:\n• **Nadia Amrani** (135d / +28d in Khouribga)\n• **Fatima Zahra El Idrissi** (120d / +13d in Safi).\n👉 Use the *⚡ What-If Simulation* module to rebalance their load."
          : "⚠️ **Audit de Surcharge** : 2 formateurs dépassent actuellement la cible de 107j :\n• **Nadia Amrani** (135j / +28j à Khouribga)\n• **Fatima Zahra El Idrissi** (120j / +13j à Safi).\n👉 Vous pouvez utiliser le module *⚡ Simulation What-If* pour rééquilibrer leur charge."
      } else if (query.includes('disponible') || query.includes('libre') || query.includes('affectation') || query.includes('available') || query.includes('free')) {
        botReply = lang === 'en'
          ? "🟢 **Available Trainers**:\n• **Omar Chraibi** (51d / Ben Guerir)\n• **Karim Tazi** (64d / Jorf Lasfar)\n• **Youssef Benali** (82d / Ben Guerir).\nTheir workload is balanced and ready for new training sessions."
          : "🟢 **Formateurs Disponibles** :\n• **Omar Chraibi** (51j / Ben Guerir)\n• **Karim Tazi** (64j / Jorf Lasfar)\n• **Youssef Benali** (82j / Ben Guerir).\nLeur charge est conforme et prête pour de nouvelles sessions."
      } else if (query.includes('centre') || query.includes('périmètre') || query.includes('location')) {
        botReply = lang === 'en'
          ? "📍 **Active Network Centers**:\n1. Ben Guerir (Headquarters / UM6P)\n2. Safi\n3. Jorf Lasfar\n4. Khouribga."
          : "📍 **Centres Réseau Actifs** :\n1. Ben Guerir (Siège / UM6P)\n2. Safi\n3. Jorf Lasfar\n4. Khouribga."
      } else if (query.includes('cible') || query.includes('107') || query.includes('règle') || query.includes('target') || query.includes('rule')) {
        botReply = lang === 'en'
          ? "🎯 **Tutor Business Rule**: The optimal training target is **107 days / year** per trainer. The net global capacity is **189 days** after neutralizing 83 blocked window days."
          : "🎯 **Règle Métier Tuteur** : La cible optimale d'animation est de **107 jours / an** par formateur. La capacité globale nette s'élève à **189 jours** après neutralisation de 83 jours de fenêtres bloquées."
      } else if (query.includes('férié') || query.includes('fete') || query.includes('congé') || query.includes('aid') || query.includes('holiday')) {
        botReply = lang === 'en'
          ? "📅 **Official Neutralized Days (Morocco 2026)**:\n• Amazigh New Year (Jan 14)\n• Eid al-Fitr (Mar 20-22)\n• Labor Day (May 01)\n• Eid al-Adha (May 27-28)\n• Throne Day (Jul 30)\n• Summer Closure (Jul 01 — Aug 31)."
          : "📅 **Jours Neutralisés Officiels (Maroc 2026)** :\n• Nouvel An Amazigh (14 Jan)\n• Aïd al-Fitr (20-22 Mar)\n• Fête du Travail (01 Mai)\n• Aïd al-Adha (27-28 Mai)\n• Fête du Trône (30 Jul)\n• Fermeture Estivale (01 Jul — 31 Août)."
      }

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
          className="group flex items-center gap-2 rounded-full bg-purple-600 px-4 py-3.5 text-xs font-bold text-white shadow-xl transition-all duration-200 hover:bg-purple-700 hover:scale-105 cursor-pointer"
          title={t.botName}
        >
          <Sparkles className="size-4 animate-pulse text-amber-300" />
          <span className="font-semibold">{t.botName}</span>
          <span className="flex size-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      ) : (
        <div className="w-80 sm:w-96 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
          {/* En-tête du Chat */}
          <div className="bg-purple-600 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-white/20">
                <Bot className="size-4.5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-xs leading-tight">{t.botTitle}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-purple-100 font-medium">{t.botActive}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Corps des messages */}
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

          {/* Formulaire de saisie */}
          <form onSubmit={handleSendMessage} className="p-2.5 bg-card border-t border-border flex gap-2">
            <input
              type="text"
              placeholder={t.botPlaceholder}
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
      )}
    </div>
  )
}
