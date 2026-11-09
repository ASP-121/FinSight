import React from 'react'
import Card from '../common/Card'
import ProgressBar from '../common/ProgressBar'
import Button from '../common/Button'
import { formatINR } from '../../utils/formatters'
import {
  Laptop,
  ShieldCheck,
  Palmtree,
  Bike,
  Target,
  Edit2,
  Trash2,
  PlusCircle,
  Calendar,
} from 'lucide-react'

const GOAL_ICONS = {
  Laptop,
  ShieldCheck,
  Palmtree,
  Bike,
  Target,
}

export default function GoalCard({
  goal,
  onEdit,
  onDelete,
  onContribute,
}) {
  const Icon = GOAL_ICONS[goal.icon] || Target
  const percentage = Math.min(
    100,
    Math.round((goal.currentAmount / goal.targetAmount) * 100)
  )
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount)

  return (
    <Card hover className="flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-xl text-white shadow-xs"
              style={{ backgroundColor: goal.color }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900">{goal.title}</h4>
              <p className="text-xs text-slate-500">{goal.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(goal)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Edit Goal"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(goal)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete Goal"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {goal.description && (
          <p className="mt-3 text-xs text-slate-500 line-clamp-2">
            {goal.description}
          </p>
        )}

        {/* Progress Metrics */}
        <div className="mt-5 flex items-baseline justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Saved</span>
            <p className="text-xl font-bold text-slate-900">
              {formatINR(goal.currentAmount)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">Target</span>
            <p className="text-sm font-semibold text-slate-700">
              {formatINR(goal.targetAmount)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <ProgressBar
            value={goal.currentAmount}
            max={goal.targetAmount}
            color={goal.color}
            height="h-2.5"
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-indigo-600">{percentage}% completed</span>
          <span>{formatINR(remaining)} to go</span>
        </div>
      </div>

      {/* Target date & Quick Contribute */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{goal.targetDateDisplay || goal.targetDate}</span>
        </div>

        {onContribute && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onContribute(goal)}
            icon={PlusCircle}
            className="text-xs py-1.5 px-3"
          >
            Add Funds
          </Button>
        )}
      </div>
    </Card>
  )
}
