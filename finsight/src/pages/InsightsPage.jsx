import React, { useState, useEffect } from 'react'
import { Sparkles, ShieldCheck, TrendingUp, Info, Filter } from 'lucide-react'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import InsightCard from '../components/insights/InsightCard'
import LoadingSkeleton from '../components/common/LoadingSkeleton'
import ErrorState from '../components/common/ErrorState'
import * as aiService from '../services/aiService'

const FILTER_TABS = ['all', 'warning', 'good', 'attention', 'opportunity']

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
          <span>Prepared for future Spring Boot ML backend</span>
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
            <p className="mt-3 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Strong Financial Footing
            </p>
          </div>

          {/* Breakdown Bars */}
          <div className="lg:col-span-8 space-y-3.5">
            <h4 className="text-sm font-bold text-slate-900">
              Health Metric Breakdown
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {breakdown.map((b) => (
                <div
                  key={b.label}
                  className="p-3 rounded-xl bg-white border border-slate-100 shadow-xs space-y-1.5"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">{b.label}</span>
                    <span className="font-bold text-slate-900">{b.score} / 100</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                      style={{ width: `${b.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{b.description}</p>
                </div>
              ))}
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
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl capitalize transition-all shrink-0 ${
              activeFilter === tab
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {tab === 'all' ? 'All Insights' : tab}
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
