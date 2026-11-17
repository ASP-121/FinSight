import React, { useState, useEffect } from 'react'
import { Sparkles, ShieldCheck, TrendingUp, Info, Filter } from 'lucide-react'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import InsightCard from '../components/insights/InsightCard'
import LoadingSkeleton from '../components/common/LoadingSkeleton'
import ErrorState from '../components/common/ErrorState'
import * as aiService from '../services/aiService'

const FILTER_TABS = [
  'all',
  'warning',
  'good',
  'attention',
  'info',
  'opportunity'
]

export default function InsightsPage() {
  const [insightsData, setInsightsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')

  const fetchInsights = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await aiService.getAIInsights()
      setInsightsData(data)
    } catch (err) {
      console.error(err)
      setError('Unable to load AI Insights. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  if (loading && !insightsData) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="chart" />
        <LoadingSkeleton type="cards" count={3} />
      </div>
    )
  }

  if (error && !insightsData) {
    return <ErrorState message={error} onRetry={fetchInsights} />
  }

  const { healthScore = 78, breakdown = [], items = [] } = insightsData || {}

const availableMetrics = breakdown.filter(
  (metric) => metric.score !== null && metric.score !== undefined
).length

const totalMetrics = breakdown.length

const healthLabel =
  availableMetrics < totalMetrics
    ? 'Building Your Financial Profile'
    : healthScore >= 80
      ? 'Excellent Financial Health'
      : healthScore >= 65
        ? 'Good Financial Progress'
        : healthScore >= 50
          ? 'Needs Some Attention'
          : 'Needs Improvement'


  const filteredItems =
    activeFilter === 'all'
      ? items
      : items.filter((item) => item.type === activeFilter)

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              AI Insights
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Automated
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time pattern analysis, anomaly detections, and savings opportunities
          </p>
        </div>

        <div className="flex items-center gap-2 p-2 bg-purple-50/80 border border-purple-100 rounded-xl text-xs text-purple-800 self-start sm:self-auto">
          <Info className="w-4 h-4 text-purple-600 shrink-0" />
          <span>Live financial analysis</span>
        </div>
      </div>

      {/* Financial Health Score Hero Section */}
      <Card hover className="bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30 border-indigo-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Circular Score Gauge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 sm:border-r sm:border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Your Financial Health
            </span>
            <div className="relative mt-4 flex items-center justify-center">
              <div className="w-36 h-36 rounded-full border-8 border-slate-100 flex items-center justify-center relative">
                <div
                  className="absolute inset-0 rounded-full border-8 border-indigo-600 transition-all duration-1000"
                  style={{
                    clipPath: `polygon(50% 50%, -50% -50%, ${healthScore}% -50%, ${healthScore}% 150%, -50% 150%)`,
                  }}
                />
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-black text-slate-900">
                    {healthScore}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">/ 100</span>
                </div>
              </div>
            </div>
             <div className="mt-3 flex flex-col items-center gap-1">
  <p className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
    {healthLabel}
  </p>

  <span className="text-[11px] text-slate-400">
    Based on {availableMetrics} of {totalMetrics} metrics
  </span>
</div>
          </div>

          {/* Breakdown Bars */}
          <div className="lg:col-span-8 space-y-3.5">
            <h4 className="text-sm font-bold text-slate-900">
              Health Metric Breakdown
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
{breakdown.map((b) => {
  const hasScore = b.score !== null && b.score !== undefined
  const score = hasScore
    ? Math.min(100, Math.max(0, b.score))
    : 0

  return (
    <div
      key={b.label}
      className="p-3 rounded-xl bg-white border border-slate-100 shadow-xs space-y-1.5"
    >
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-slate-700">
          {b.label}
        </span>

        <span className="font-bold text-slate-900">
          {hasScore ? `${score} / 100` : 'N/A'}
        </span>
      </div>

      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            hasScore ? 'bg-indigo-600' : 'bg-transparent'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="text-[11px] text-slate-400">
        {b.description}
      </p>
    </div>
  )
})}

            </div>
          </div>
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            
className={`px-3.5 py-1.5 text-xs font-bold rounded-xl capitalize transition-all shrink-0 border ${
  activeFilter === tab
    ? {
        all: 'bg-slate-900 text-white border-slate-900 shadow-xs',
        warning: 'bg-amber-500 text-white border-amber-500 shadow-xs',
        good: 'bg-emerald-500 text-white border-emerald-500 shadow-xs',
        attention: 'bg-rose-500 text-white border-rose-500 shadow-xs',
        info: 'bg-blue-500 text-white border-blue-500 shadow-xs',
        opportunity: 'bg-purple-500 text-white border-purple-500 shadow-xs',
      }[tab]
    : {
        all: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
        warning: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
        good: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
        attention: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
        info: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
        opportunity: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      }[tab]
}`}

          >
            {tab === 'all'
  ? 'All Insights'
  : tab === 'info'
    ? 'Info'
    : tab}
          </button>
        ))}
      </div>

      {/* Insights Cards List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <InsightCard key={item.id} insight={item} />
        ))}
      </div>
    </div>
  )
}
