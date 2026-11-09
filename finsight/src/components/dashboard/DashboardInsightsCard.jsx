import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../common/Card'
import { Sparkles, ArrowRight, AlertTriangle, CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react'

const TYPE_CONFIG = {
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200/60',
  },
  good: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200/60',
  },
  attention: {
    icon: AlertCircle,
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200/60',
  },
  opportunity: {
    icon: Lightbulb,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200/60',
  },
}

export default function DashboardInsightsCard({ insights = [] }) {
  return (
    <Card hover className="flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">AI Insights</h3>
            <p className="text-xs text-slate-500">Autonomous spending intelligence</p>
          </div>
        </div>
        <Link
          to="/insights"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {insights.map((item) => {
          const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.opportunity
          const Icon = cfg.icon

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border ${cfg.border} ${cfg.bg} flex items-start gap-3 transition-transform hover:scale-[1.01]`}
            >
              <div className="p-1 rounded-lg bg-white/80 shrink-0 mt-0.5">
                <Icon className={`w-3.5 h-3.5 ${cfg.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {item.message}
                </p>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{item.category}</span>
                  {item.actionText && item.actionRoute && (
                    <Link
                      to={item.actionRoute}
                      className="font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      {item.actionText} →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
