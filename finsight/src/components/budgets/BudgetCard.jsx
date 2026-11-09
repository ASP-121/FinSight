import React from 'react'
import Card from '../common/Card'
import ProgressBar from '../common/ProgressBar'
import { formatINR } from '../../utils/formatters'
import {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Film,
  HeartPulse,
  GraduationCap,
  ShoppingBasket,
  MoreVertical,
  Edit2,
  Trash2,
  AlertCircle,
} from 'lucide-react'

const ICONS = {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Film,
  HeartPulse,
  GraduationCap,
  ShoppingBasket,
}

export default function BudgetCard({
  budget,
  onEdit,
  onDelete,
}) {
  const Icon = ICONS[budget.icon] || ShoppingBag
  const remaining = budget.allocated - budget.spent
  const isOver = remaining < 0
  const percentage = Math.round((budget.spent / budget.allocated) * 100)

  return (
    <Card hover className="relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-xl text-white shadow-xs"
              style={{ backgroundColor: budget.color }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900">{budget.category}</h4>
              <p className="text-xs text-slate-500">{budget.month || 'Monthly'}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(budget)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Edit Budget"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(budget)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete Budget"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Amount details */}
        <div className="mt-5 flex items-baseline justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Spent: </span>
            <span className="text-lg font-bold text-slate-900">
              {formatINR(budget.spent)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">Budget: </span>
            <span className="text-sm font-semibold text-slate-700">
              {formatINR(budget.allocated)}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <ProgressBar
            value={budget.spent}
            max={budget.allocated}
            color={budget.color}
            height="h-2.5"
          />
        </div>
      </div>

      {/* Footer status */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-500">{percentage}% utilized</span>
        <span
          className={
            isOver
              ? 'text-rose-600 font-bold flex items-center gap-1'
              : 'text-emerald-600'
          }
        >
          {isOver ? (
            <>
              <AlertCircle className="w-3.5 h-3.5" />
              Over by {formatINR(Math.abs(remaining))}
            </>
          ) : (
            `Remaining: ${formatINR(remaining)}`
          )}
        </span>
      </div>
    </Card>
  )
}
