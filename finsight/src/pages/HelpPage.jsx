import React, { useState } from 'react'
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Mail,
  Sparkles,
  Layers,
  PieChart,
  Shield,
  Send,
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

const FAQS = [
  {
    q: 'How does FinSight work?',
    a: 'FinSight tracks your income, categorized expenses, and savings goals in a unified dashboard. It computes financial health metrics, tracks budget adherence, and applies predictive models to forecast next month expenses.',
  },
  {
    q: 'How does automated AI transaction categorization work?',
    a: 'When you enter a transaction description (such as "Swiggy dinner" or "Uber commute"), FinSight passes the string to an AI categorization engine that predicts the category with a confidence score. You always retain full control to override or refine the category.',
  },
  {
    q: 'How do budgets work and what happens when I exceed one?',
    a: 'Each category can have an allocated monthly limit. FinSight tracks real-time expenditure against that limit. If a category exceeds its allocation (like Shopping reaching ₹3,800 / ₹3,000), it highlights an "Over budget" badge and flags an attention anomaly alert.',
  },
  {
    q: 'Are the AI Insights real machine learning models in this preview?',
    a: 'In this frontend implementation phase, all AI insights, categorization heuristics, predictions, and assistant conversations are powered by a high-fidelity mock service layer. The application is architecturally designed so these mock services seamlessly swap with Spring Boot REST endpoints and ML models in the next phase.',
  },
  {
    q: 'What is the Indian Rupee (INR) numbering convention used?',
    a: 'FinSight formats all monetary amounts using Indian standard numbering (₹18,600, ₹1,25,000, 1 Lakh = ₹1,00,000, 1 Crore = ₹1,00,00,000) ensuring localized precision.',
  },
]

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState(0)
  const [supportMessage, setSupportMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSupportSubmit = (e) => {
    e.preventDefault()
    if (!supportMessage.trim()) return
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setSupportMessage('')
    }, 3000)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Help & Documentation
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Learn how to get the most out of your FinSight financial management tools
        </p>
      </div>

      {/* Architecture Notice Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-950 space-y-1">
          <p className="font-bold">Frontend Architecture Preview Mode</p>
          <p className="text-indigo-800 leading-relaxed">
            FinSight is running in standalone mock service mode. All dashboard metrics, predictions, transaction logs, and AI assistant chats operate via Promise-based services in <code className="font-mono bg-white/70 px-1 py-0.5 rounded">src/services/</code>, ready for Spring Boot REST API integration.
          </p>
        </div>
      </div>

      {/* Feature Walkthrough Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card hover padding="sm">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 w-fit mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">AI Intelligence</h4>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Real-time pattern analysis, automated categorization, and conversational assistant.
          </p>
        </Card>

        <Card hover padding="sm">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 w-fit mb-3">
            <PieChart className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Smart Budgets</h4>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Set category caps with visual progress bars and instant breach alerts.
          </p>
        </Card>

        <Card hover padding="sm">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 w-fit mb-3">
            <Shield className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Savings Goals</h4>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Track emergency reserves, tech purchases, and milestones with timeline targets.
          </p>
        </Card>
      </div>

      {/* FAQ Accordion */}
      <Card hover>
        <div className="border-b border-slate-100 pb-3 mb-4">
          <h3 className="font-bold text-base text-slate-900">Frequently Asked Questions</h3>
          <p className="text-xs text-slate-500">Everything you need to know about FinSight workflows</p>
        </div>

        <div className="divide-y divide-slate-100">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div key={idx} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between text-left gap-4"
                >
                  <span className="text-sm font-semibold text-slate-900">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Contact Support Placeholder */}
      <Card hover>
        <div className="border-b border-slate-100 pb-3 mb-4">
          <h3 className="font-bold text-base text-slate-900">Contact FinSight Support</h3>
          <p className="text-xs text-slate-500">Have questions or found a bug? Let our team know.</p>
        </div>

        {sent ? (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
            Thank you! Your inquiry has been submitted to the support queue.
          </div>
        ) : (
          <form onSubmit={handleSupportSubmit} className="space-y-3">
            <textarea
              rows="3"
              placeholder="Describe your question, feature request, or issue..."
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" icon={Send}>
                Send Message
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}
