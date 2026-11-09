import React, { useState, useRef, useEffect } from 'react'
import {
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  CheckCircle,
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useAuth } from '../context/AuthContext'
import * as aiService from '../services/aiService'

const SUGGESTED_PROMPTS = [
  'How much did I spend on food this month?',
  'Where am I overspending?',
  'Can I save ₹5,000 next month?',
  'How much will I spend next month?',
  'What category increased the most?',
]

export default function AssistantPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    {
      id: 'msg_001',
      sender: 'ai',
      text: 'Hello Aarya! I am FinSight AI. Ask me anything about your October spending, budget limits, emergency goals, or upcoming expense forecasts.',
      time: 'Just now',
      suggestions: [
        'How much did I spend on food this month?',
        'Where am I overspending?',
        'Can I save ₹5,000 next month?',
      ],
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatBottomRef = useRef(null)

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputValue).trim()
    if (!text || isTyping) return

    const userMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      time: 'Just now',
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const response = await aiService.sendAIMessage(text, messages)
      const aiReply = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: response.text,
        time: 'Just now',
        suggestions: response.suggestions || [],
      }
      setMessages((prev) => [...prev, aiReply])
    } catch (err) {
      const errorReply = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        text: 'Sorry, I encountered an issue retrieving that analysis. Please try again.',
        time: 'Just now',
      }
      setMessages((prev) => [...prev, errorReply])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col space-y-4 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                FinSight AI
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                Online
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Ask questions about your spending, budgets and financial goals.
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: `reset_${Date.now()}`,
                sender: 'ai',
                text: 'Chat history cleared. What would you like to explore regarding your financial health?',
                time: 'Just now',
              },
            ])
          }
          className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 font-semibold p-1.5 rounded-lg hover:bg-slate-100"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user'

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-purple-100 text-purple-700'
                }`}
              >
                {isUser ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div className="space-y-2">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* AI Follow-up suggestions */}
                {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(s)}
                        className="text-[11px] font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-100 px-2.5 py-1 rounded-lg transition-colors text-left"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* AI Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 max-w-2xl mr-auto items-center text-xs text-slate-400">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Prompts Shelf */}
      {messages.length <= 2 && (
        <div className="space-y-1.5 pt-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Suggested prompts:
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {SUGGESTED_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="shrink-0 text-xs text-slate-700 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 px-3 py-1.5 rounded-xl transition-all shadow-xs"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="relative">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-xs focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all"
        >
          <input
            type="text"
            placeholder="Ask FinSight AI..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-3 py-2 text-xs sm:text-sm bg-transparent focus:outline-none text-slate-900 placeholder-slate-400"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            size="sm"
            icon={Send}
            className="rounded-xl px-3.5 py-2"
          >
            Send
          </Button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-1.5">
          Simulated AI responses grounded in FinSight test data. Ready for Spring Boot LLM API.
        </p>
      </div>
    </div>
  )
}
