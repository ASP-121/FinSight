import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../common/Card'
import ProgressBar from '../common/ProgressBar'
import { formatINR } from '../../utils/formatters'
import { ArrowRight, AlertCircle } from 'lucide-react'

export default function BudgetOverviewSection({ budgets = [] }) {
  // Show top 4 budgets on dashboard
  const displayBudgets = budgets.slice(0, 4)

  return (
    <Card hover>
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <h3 className="font-bold text-base text-slate-900">Budget Overview</h3>
          <p className="text-xs text-slate-500">Track monthly allocations and spending caps</p>
        </div>
        <Link
          to="/budgets"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <span>All Budgets</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-4">
        {displayBudgets.map((b) => {
          const isOver = b.spent > b.allocated
          return (
            <div key={b.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{b.category}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">
                    {formatINR(b.spent)}
                  </span>
                  <span className="text-slate-400">/ {formatINR(b.allocated)}</span>
                </div>
              </div>
              <ProgressBar
                value={b.spent}
                max={b.allocated}
                color={b.color}
                height="h-2"
              />
            </div>
          )
        })}
      </div>
    </Card>
  )
}
