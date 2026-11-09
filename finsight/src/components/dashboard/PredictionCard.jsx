
import React from 'react'
import Card from '../common/Card'
import { formatINR } from '../../utils/formatters'
import { Sparkles, Info } from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

export default function PredictionCard({ prediction }) {
  if (!prediction) {
    return (
      <Card>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-base text-slate-900">
            Predicted Expenses — Next Month
          </h3>
        </div>
        <p className="mt-3 text-sm text-slate-500">
          Expense prediction is currently unavailable. Please try refreshing
          the dashboard.
        </p>
      </Card>
    )
  }

  const trendData = (prediction.trendData || []).map((item) => ({
    ...item,
    displayAmount:
      item.actual !== null && item.actual !== undefined
        ? item.actual
        : item.predicted,
  }))

  const hasForecast =
    prediction.predictedAmount !== null &&
    prediction.predictedAmount !== undefined

  const isInsufficient = prediction.status === 'INSUFFICIENT_DATA'
  const isProvisional = prediction.status === 'PROVISIONAL'

  const statusLabel = isInsufficient
    ? 'Insufficient data'
    : isProvisional
      ? 'Provisional estimate'
      : 'Forecast available'

  const statusClass = isInsufficient
    ? 'bg-amber-50 border-amber-200 text-amber-700'
    : isProvisional
      ? 'bg-amber-50 border-amber-200 text-amber-700'
      : 'bg-emerald-50 border-emerald-200 text-emerald-700'

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null

    const item = payload[0].payload

    if (item.displayAmount === null || item.displayAmount === undefined) {
      return null
    }

    const isPredicted = item.type === 'predicted'

    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg space-y-1">
        <p className="font-semibold text-slate-300">{item.month}</p>
        <p className="font-bold text-sm">
          {formatINR(item.displayAmount)}
        </p>
        <p
          className={`text-[10px] ${
            isPredicted
              ? 'text-purple-300 font-semibold'
              : 'text-slate-400'
          }`}
        >
          {isPredicted ? 'Forecast' : 'Recorded expenses'}
        </p>
      </div>
    )
  }

  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Predicted Expenses — Next Month
            </h3>
            <p className="text-xs text-slate-500">
              Forecast for {prediction.nextMonth}
            </p>
          </div>
        </div>

        <span
          className={`self-start sm:self-auto px-2.5 py-1 rounded-full border font-bold text-xs ${statusClass}`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Forecast summary */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Forecasted Total
          </span>

          <h2 className="mt-1 text-3xl font-extrabold text-slate-900">
            {hasForecast ? formatINR(prediction.predictedAmount) : '—'}
          </h2>

          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            {prediction.explanation}
          </p>

          {prediction.observedMonths !== null &&
            prediction.observedMonths !== undefined && (
              <p className="mt-3 text-xs text-slate-500">
                Recorded months used: {prediction.observedMonths} of 6
              </p>
            )}

          {prediction.movingAveragePrediction !== null &&
            prediction.movingAveragePrediction !== undefined && (
              <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3">
                <p className="text-xs text-slate-500">
                  Moving-average benchmark
                </p>
                <p className="mt-1 font-bold text-slate-800">
                  {formatINR(prediction.movingAveragePrediction)}
                </p>
              </div>
            )}

          {prediction.mae !== null && prediction.mae !== undefined && (
            <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3">
              <p className="text-xs text-slate-500">
                Historical mean absolute error (MAE)
              </p>
              <p className="mt-1 font-bold text-slate-800">
                {formatINR(prediction.mae)}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Lower is better. This measures historical forecast errors,
                not a guaranteed error range for next month.
              </p>
            </div>
          )}

          {prediction.missingMonths?.length > 0 && (
            <div className="mt-3 text-xs text-amber-700">
              <p className="font-semibold">Months without recorded expenses</p>
              <p className="mt-1">
                {prediction.missingMonths.join(', ')}
              </p>
            </div>
          )}

          <div className="mt-4 flex items-start gap-1.5 text-[11px] text-slate-400">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              Estimates depend on the completeness of your recorded
              transactions and may differ from actual spending.
            </span>
          </div>
        </div>

        {/* Historical spending and forecast chart */}
        <div className="md:col-span-2 h-56 sm:h-64 w-full">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="actualGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="predGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) =>
                    `₹${Number(value) / 1000}k`
                  }
                />

                <Tooltip content={<CustomTooltip />} />

                <Area
                  type="monotone"
                  dataKey="displayAmount"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#actualGradient)"
                  connectNulls={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-slate-400">
              No historical chart data available.
            </div>
          )}
        </div>
      </div>

      {/* Category estimates */}
      {prediction.drivers?.length > 0 && hasForecast && (
        <div className="mt-6 border-t border-slate-100 pt-4">
          <h4 className="font-bold text-sm text-slate-900">
            Estimated spending breakdown
          </h4>
          <p className="mt-1 text-xs text-slate-500">
            Category estimates are based on historical category proportions,
            not separate category-level machine-learning forecasts.
          </p>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {prediction.drivers.map((driver) => (
              <div
                key={driver.factor}
                className="rounded-xl border border-slate-100 p-3"
              >
                <p className="text-xs text-slate-500">{driver.factor}</p>
                <p className="mt-1 font-bold text-slate-800">
                  {formatINR(driver.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isInsufficient && (
        <p className="mt-4 text-sm text-amber-700">
          Add more months of transaction history to enable a forecast.
        </p>
      )}
    </Card>
  )
}
