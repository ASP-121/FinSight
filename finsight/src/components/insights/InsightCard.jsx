import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../common/Card'
import Badge from '../common/Badge'
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react'

const TYPE_CONFIG = {
  warning: {
    icon: AlertTriangle,
    badgeVariant: 'warning',
    badgeLabel: 'Warning',
    iconColor: 'bg-amber-100 text-amber-700',
    borderColor: 'border-amber-200/60',
  },
  good: {
    icon: CheckCircle2,
    badgeVariant: 'success',
    badgeLabel: 'Positive',
    iconColor: 'bg-emerald-100 text-emerald-700',
    borderColor: 'border-emerald-200/60',
  },
  attention: {
    icon: AlertCircle,
    badgeVariant: 'danger',
    badgeLabel: 'Attention',
    iconColor: 'bg-rose-100 text-rose-700',
    borderColor: 'border-rose-200/60',
  },
  opportunity: {
    icon: Lightbulb,
    badgeVariant: 'ai',
    badgeLabel: 'Opportunity',
    iconColor: 'bg-purple-100 text-purple-700',
    borderColor: 'border-purple-200/60',
  },
}

export default function InsightCard({
  insight,
  compact = false,
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const config = TYPE_CONFIG[insight.type] || TYPE_CONFIG.opportunity
  const Icon = config.icon

  return (
    <Card hover className={`relative transition-all ${config.borderColor}`}>
      <div className="flex items-start gap-3.5">
        <div className={`p-2.5 rounded-xl shrink-0 ${config.iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Badge variant={config.badgeVariant} size="xs">
                {config.badgeLabel}
              </Badge>
              {insight.category && (
                <span className="text-xs text-slate-400 font-medium">
                  {insight.category}
                </span>
              )}
            </div>
            {insight.impact && (
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                {insight.impact}
              </span>
            )}
          </div>

          <h4 className="mt-2 text-sm sm:text-base font-bold text-slate-900 leading-snug">
            {insight.message}
          </h4>

          {/* Expandable "Why am I seeing this?" */}
          {insight.explanation && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <span>Why am I seeing this?</span>
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {isExpanded && (
                <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed animate-in fade-in duration-150">
                  {insight.explanation}
                </div>
              )}
            </div>
          )}

          {/* Action button */}
          {insight.actionText && insight.actionRoute && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Generated from transaction history
              </span>
              <Link
                to={insight.actionRoute}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <span>{insight.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
