
import { getBudgets } from './budgetService'
import { request, USE_MOCK } from '../utils/apiClient'
import { mockTransactions } from '../data/mockTransactions'
import { mockBudgets } from '../data/mockBudgets'
import { mockInsights } from '../data/mockInsights'
import { mockPredictions } from '../data/mockPredictions'
import { mockAnalytics } from '../data/mockAnalytics'

export async function getDashboardData() {
  if (!USE_MOCK) {
    const [dashboard, budgets, prediction] = await Promise.all([
      request('/api/dashboard'),
      getBudgets(),
      request('/api/predictions').catch((error) => {
        // Prediction failure should not take down the whole dashboard.
        console.error('Unable to load expense prediction:', error)
        return null
      }),
    ])

    return {
      ...dashboard,
      budgets,
      aiInsights: mockInsights.items.slice(0, 3),
      prediction,
    }
  }

  // Mock mode for frontend development only.
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    period: 'October 2026',
    summary: {
      totalBalance: {
        amount: 18600,
        changePercentage: 6.4,
        isPositive: true,
        label: 'vs last month',
      },
      monthlyIncome: {
        amount: 30000,
        changePercentage: 0,
        isPositive: true,
        label: 'Stable vs Sep',
      },
      monthlyExpenses: {
        amount: 21400,
        changePercentage: -1.8,
        isPositive: true,
        label: '-1.8% vs last month',
      },
      savings: {
        amount: 8600,
        changePercentage: 12.5,
        isPositive: true,
        label: '28.7% savings rate',
      },
    },
    spendingTrend: mockAnalytics.spendingTrends,
    categorySpending: mockAnalytics.categoryDistribution,
    budgets: mockBudgets,
    recentTransactions: mockTransactions.slice(0, 5),
    aiInsights: mockInsights.items.slice(0, 3),
    prediction: mockPredictions,
  }
}
