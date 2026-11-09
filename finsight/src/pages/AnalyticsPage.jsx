import React, { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import LoadingSkeleton from '../components/common/LoadingSkeleton'
import ErrorState from '../components/common/ErrorState'
import { formatINR } from '../utils/formatters'
import {
  Calendar,
  TrendingUp,
  PieChart as PieIcon,
  Layers,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import * as analyticsService from '../services/analyticsService'

export default function AnalyticsPage() {
  const [range, setRange] = useState('month') // 'month' | 'quarter' | 'year'
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await analyticsService.getAnalytics(range)
      setData(res)
    } catch (err) {
      console.error(err)
      setError('Unable to load financial analytics. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [range])

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="cards" count={3} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton type="chart" />
          <LoadingSkeleton type="chart" />
          
        </div>
      </div>
    )
  }

  if (error && !data) {
    return <ErrorState message={error} onRetry={fetchAnalytics} />
  }

  const {
    summary = {},
    spendingTrends = {},
    categoryDistribution = [],
    essentialVsDiscretionary = [],
    weekdayVsWeekend = [],
    spendingPatterns = [],
  } = data || {}

  const trendData = spendingTrends[range] || spendingTrends.month || []
  const savingsRate = Number(summary?.savingsRate ?? 0);

const savingsRatioStatus =
  summary?.totalIncome == null || Number(summary.totalIncome) <= 0
    ? 'Not enough data'
    : savingsRate >= 20
      ? 'Healthy / Excellent'
      : savingsRate >= 15
        ? 'Good'
        : savingsRate >= 10
          ? 'Average / Moderate'
          : savingsRate >= 5
            ? 'Fair'
            : savingsRate >= 0
              ? 'Poor / Struggling'
              : 'Spending exceeds income';

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header & Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Financial Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Comprehensive breakdown of cash flows, category habits, and behavior
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl shadow-xs self-start sm:self-auto">
          {['month', 'year'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                range === r
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r === 'month' ? 'Current Month' : 'Annual View'}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Top High-Level KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card hover>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Savings Ratio
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {savingsRate.toFixed(1)}%
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              {savingsRatioStatus}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {formatINR(summary.savings ?? 0)} retained from {formatINR(summary.totalIncome ?? 0)} income
          </p>
        </Card>

        <Card hover>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Essential Needs Ratio
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {summary.essentialRatio == null ? '—' : `${summary.essentialRatio}%`}
            </h3>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
              50/30/20 Rule
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Covers groceries, utilities, transit and health
          </p>
        </Card>

        <Card hover>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Daily Burn Rate
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {formatINR(summary.dailyAverage)}
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              Avg / Day
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Actual expenses per elapsed day in the selected period
          </p>
        </Card>
      </div>

      {/* 2. Spending Trend (Line/Bar) */}
      <Card hover>
        <div className="border-b border-slate-100 pb-4 mb-4">
          <h3 className="font-bold text-base text-slate-900">1. Spending Trend</h3>
          <p className="text-xs text-slate-500">
            Daily expenditure trajectory compared against previous periods
          </p>
        </div>
        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                formatter={(val) => [formatINR(val), 'Spend']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }} />
              {range === 'year' ? (
                <>
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </>
              ) : (
                <>
                  <Bar dataKey="current" name="Current (October)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="previous" name="Previous (September)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 3. Category Distribution & Top Spending */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <Card hover className="h-full flex flex-col justify-between">
            <div className="border-b border-slate-100 pb-4 mb-4">
              <h3 className="font-bold text-base text-slate-900">2. Category Distribution</h3>
              <p className="text-xs text-slate-500">Relative allocation of total outflow</p>
            </div>
            <div className="h-64 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {categoryDistribution.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatINR(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
              {categoryDistribution.slice(0, 6).map((c) => (
                <div key={c.name} className="flex items-center justify-between p-1">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </span>
                  <span className="font-bold text-slate-900">{c.percentage}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      
{/* 4. Top Spending Categories */}
<div className="lg:col-span-6">
  <Card hover className="h-full">
    <div className="border-b border-slate-100 pb-4 mb-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900">
            3. Top Spending Categories
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Where your money goes
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 rounded-full px-3 py-1">
          {categoryDistribution.length} categories
        </span>
      </div>
    </div>

    {categoryDistribution.length === 0 ? (
      <div className="py-10 text-center">
        <p className="text-sm font-semibold text-slate-700">
          No spending data yet
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Add expense transactions to see your category breakdown.
        </p>
      </div>
    ) : (
      <div className="space-y-5">
        {categoryDistribution
          .slice()
          .sort((a, b) => Number(b.amount) - Number(a.amount))
          .map((cat, rank) => {
            const percentage = Math.min(
              100,
              Math.max(0, Number(cat.percentage) || 0)
            );

            return (
              <div key={cat.name} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold ${
                        rank === 0
                          ? 'bg-amber-100 text-amber-700'
                          : rank === 1
                            ? 'bg-slate-200 text-slate-700'
                            : rank === 2
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-slate-50 text-slate-500'
                      }`}
                    >
                      #{rank + 1}
                    </span>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {cat.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {percentage.toFixed(1)}% of expenses
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-slate-900 shrink-0">
                    {formatINR(cat.amount)}
                  </p>
                </div>

                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      rank === 0
                        ? 'bg-amber-500'
                        : rank === 1
                          ? 'bg-indigo-500'
                          : rank === 2
                            ? 'bg-emerald-500'
                            : 'bg-sky-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    )}
  </Card>
</div>
</div>


      {/* 5. Essential vs Discretionary & Weekday vs Weekend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Essential vs Discretionary */}
        <Card hover>
          <div className="border-b border-slate-100 pb-4 mb-4">
            <h3 className="font-bold text-base text-slate-900">
              4. Essential vs Discretionary Spending
            </h3>
            <p className="text-xs text-slate-500">
              Needs (Groceries, Bills, Medicine) vs Wants (Shopping, Dining, Leisure)
            </p>
          </div>

          <div className="space-y-4">
            {essentialVsDiscretionary.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{item.name}</span>
                  <span className="text-slate-900">
                    {formatINR(item.value)} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3.5 rounded-xl bg-sky-50 border border-sky-100 text-xs text-sky-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-sky-600 mt-0.5" />
            <span>
              {summary.essentialRatio == null ? (
  <p>Add transactions to calculate your essential needs ratio.</p>
) : summary.totalExpenses === 0 ? (
  <p>No expenses recorded for this period yet.</p>
) : summary.essentialRatio < 50 ? (
  <p>Your essential spending is relatively low. Keep reviewing your budget to ensure your needs are covered.</p>
) : summary.essentialRatio < 70 ? (
  <p>Your essential ratio is within the target range. Keep monitoring your spending.</p>
) : (
  <p>A large share of your expenses goes toward essentials. Review your budget to see where you can save.</p>
)}
            </span>
          </div>
        </Card>

        {/* Weekday vs Weekend */}
        <Card hover>
          <div className="border-b border-slate-100 pb-4 mb-4">
            <h3 className="font-bold text-base text-slate-900">
              5. Weekday vs Weekend Spending
            </h3>
            <p className="text-xs text-slate-500">
              Comparison between regular workdays and weekend leisure
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {weekdayVsWeekend.map((w) => (
              <div
                key={w.dayType}
                className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1"
              >
                <p className="text-xs font-semibold text-slate-500">{w.dayType}</p>
                <p className="text-xl font-extrabold text-slate-900">
                  {formatINR(w.totalSpend)}
                </p>
                <p className="text-[11px] text-indigo-600 font-semibold">
                  Avg {formatINR(w.avgPerDay)} / day
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3.5 rounded-xl bg-purple-50 border border-purple-100 text-xs text-purple-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-purple-600 mt-0.5" />
            <span>
             {(() => {
  const weekday = weekdayVsWeekend.find(
    (item) => item.dayType === 'Weekday'
  );
  const weekend = weekdayVsWeekend.find(
    (item) => item.dayType === 'Weekend'
  );

  if (!weekday || !weekend) {
    return 'Not enough data to compare weekday and weekend spending yet.';
  }

  if (weekday.avgPerDay === 0 && weekend.avgPerDay === 0) {
    return 'No expenses recorded in this period yet.';
  }

  if (weekday.avgPerDay === 0) {
    return 'You have spending recorded on weekends, but none on weekdays in this period.';
  }

  const difference =
    ((weekend.avgPerDay - weekday.avgPerDay) /
      weekday.avgPerDay) * 100;

  if (Math.abs(difference) < 1) {
    return 'Your average daily spending is almost the same on weekdays and weekends.';
  }

  if (difference > 0) {
    return `Average weekend daily spending is ${difference.toFixed(1)}% higher than weekdays.`;
  }

  return `Average weekend daily spending is ${Math.abs(difference).toFixed(1)}% lower than weekdays.`;
})()}
            </span>
          </div>
        </Card>
      </div>

      {/* 8. Spending Patterns Highlights */}
      <Card hover>
        <div className="border-b border-slate-100 pb-4 mb-4">
          <h3 className="font-bold text-base text-slate-900">6. Behavioral Spending Patterns</h3>
          <p className="text-xs text-slate-500">Discovered recurring trends across your financial timeline</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {spendingPatterns.map((pat, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {pat.insight}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
