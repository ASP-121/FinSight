import React, { useState } from 'react'
import Card from '../common/Card'
import { formatINR } from '../../utils/formatters'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'

export default function SpendingOverviewCard({ data }) {
  const [timeframe, setTimeframe] = useState('month') // 'week' | 'month' | 'year'

  if (!data) return null

  const chartData = data[timeframe] || data.month

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl text-xs shadow-xl space-y-1.5 border border-slate-800">
          <p className="font-bold text-slate-300">{label}</p>
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-300 capitalize">{entry.name}:</span>
              </span>
              <span className="font-bold">{formatINR(entry.value)}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card hover className="flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bold text-base text-slate-900">Spending Overview</h3>
          <p className="text-xs text-slate-500">
            Compare spending pace and historical trends
          </p>
        </div>

        {/* Timeframe selector: Week | Month | Year */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          {['week', 'month', 'year'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                timeframe === t
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={{ stroke: '#f1f5f9' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }}
              iconType="circle"
            />
            {timeframe === 'year' ? (
              <>
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              </>
            ) : (
              <>
                <Bar
                  dataKey="current"
                  name="Current Period"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="previous"
                  name="Previous Period"
                  fill="#cbd5e1"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
