import React from 'react'
import Card from './Card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatINR } from '../../utils/formatters'

export default function StatCard({
  title,
  amount,
  changePercentage,
  isPositive = true,
  comparisonLabel = 'vs last month',
  icon: Icon,
  iconColor = 'text-indigo-600 bg-indigo-50',
  className = '',
}) {
  const isNeutral = changePercentage === 0 || changePercentage === undefined

  return (
    <Card hover className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {title}
          </p>
          <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {formatINR(amount)}
          </h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div
          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-semibold ${
            isNeutral
              ? 'bg-slate-100 text-slate-600'
              : isPositive
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-rose-50 text-rose-700'
          }`}
        >
          {isNeutral ? (
            <Minus className="w-3 h-3" />
          ) : isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>
            {changePercentage !== undefined
              ? `${Math.abs(changePercentage)}%`
              : '0%'}
          </span>
        </div>
        <span className="text-xs text-slate-500 font-medium">{comparisonLabel}</span>
      </div>
    </Card>
  )
}
