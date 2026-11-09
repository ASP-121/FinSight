import React from 'react'
import Card from '../common/Card'
import { formatINR } from '../../utils/formatters'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'

export default function CategorySpendingCard({ categories = [] }) {
  const totalAmount = categories.reduce((sum, item) => sum + item.amount, 0)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg space-y-0.5">
          <p className="font-semibold text-slate-300">{data.name}</p>
          <p className="font-bold text-sm">{formatINR(data.amount)}</p>
          <p className="text-[10px] text-slate-400">{data.percentage}% of total</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card hover className="flex flex-col justify-between">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="font-bold text-base text-slate-900">Category Spending</h3>
        <p className="text-xs text-slate-500">Distribution across major expense categories</p>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Donut Chart */}
        <div className="sm:col-span-5 h-48 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="amount"
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
            <span className="text-sm font-extrabold text-slate-900">
              {formatINR(totalAmount)}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="sm:col-span-7 space-y-2 max-h-48 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="font-medium text-slate-700 truncate">{cat.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-slate-900">{formatINR(cat.amount)}</span>
                <span className="text-slate-400 text-[11px] w-8 text-right font-medium">
                  {cat.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
