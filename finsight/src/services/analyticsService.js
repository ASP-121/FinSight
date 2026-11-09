
import { request, USE_MOCK } from '../utils/apiClient'
import { mockAnalytics } from '../data/mockAnalytics'

const CATEGORY_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#6366f1',
  '#f43f5e',
]

export async function getAnalytics(range = 'month') {
  if (!USE_MOCK) {
    const response = await request(
      `/api/analytics?range=${encodeURIComponent(range)}`
    )

    const totalIncome = Number(response.summary?.totalIncome ?? 0)
    const totalExpenses = Number(response.summary?.totalExpenses ?? 0)
    const savings = Number(response.summary?.savings ?? 0)

    const categoryDistribution = (response.categoryBreakdown ?? [])
  .map((category) => ({
    name: category.category,
    amount: Number(category.amount ?? 0),
    percentage: Number(category.percentage ?? 0),
  }))
  .sort((a, b) => b.amount - a.amount)
  .map((category, index) => ({
    ...category,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }))

    const spendingTrends = {
      [range]: (response.spendingTrend ?? []).map((point) => ({
        label: point.label,
        income: Number(point.income ?? 0),
        expenses: Number(point.expenses ?? 0),
        current: Number(point.expenses ?? 0),
        previous: 0,
      })),
    }

    const daysElapsed = Math.max(response.spendingTrend?.length ?? 0, 1)

    return {
      activeRange: response.activeRange ?? range,

      summary: {
        totalIncome,
        totalExpenses,
        savings,
        savingsRate: totalIncome > 0
          ? Number(((savings / totalIncome) * 100).toFixed(1))
          : 0,
        dailyAverage: Number((totalExpenses / daysElapsed).toFixed(2)),
        essentialRatio: Number(response.summary?.essentialRatio ?? 0),
      },

      spendingTrends,
      categoryDistribution,

      essentialVsDiscretionary: (
  response.essentialVsDiscretionary ?? []
).map((item, index) => ({
  name: item.name,
  value: Number(item.value ?? 0),
  percentage: Number(item.percentage ?? 0),
  color: index === 0 ? '#10b981' : '#f59e0b',
})),
      weekdayVsWeekend: (
  response.weekdayVsWeekend ?? []
).map((item) => ({
  dayType: item.dayType,
  totalSpend: Number(item.totalSpend ?? 0),
  avgPerDay: Number(item.avgPerDay ?? 0),
})),
      spendingPatterns: (response.spendingPatterns ?? []).map((item) => ({
  insight: item.insight,
})),
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    ...mockAnalytics,
    activeRange: range,
  }
}
