export const mockAnalytics = {
  summary: {
    totalIncome: 30000,
    totalExpenses: 21400,
    netSavings: 8600,
    savingsRate: 28.7,
    dailyAverage: 690,
    essentialRatio: 65.4,
    discretionaryRatio: 34.6
  },
  spendingTrends: {
    week: [
      { label: 'Mon', current: 420, previous: 380 },
      { label: 'Tue', current: 650, previous: 510 },
      { label: 'Wed', current: 310, previous: 440 },
      { label: 'Thu', current: 890, previous: 620 },
      { label: 'Fri', current: 1450, previous: 1200 },
      { label: 'Sat', current: 2100, previous: 1850 },
      { label: 'Sun', current: 1680, previous: 1420 }
    ],
    month: [
      { label: 'Oct 1-5', current: 5200, previous: 4800 },
      { label: 'Oct 6-10', current: 4400, previous: 4100 },
      { label: 'Oct 11-15', current: 3900, previous: 4300 },
      { label: 'Oct 16-20', current: 3600, previous: 3700 },
      { label: 'Oct 21-25', current: 2800, previous: 2900 },
      { label: 'Oct 26-31', current: 1500, previous: 2000 }
    ],
    year: [
      { label: 'Jan', income: 28000, expenses: 19500, savings: 8500 },
      { label: 'Feb', income: 28000, expenses: 19800, savings: 8200 },
      { label: 'Mar', income: 29000, expenses: 20200, savings: 8800 },
      { label: 'Apr', income: 29000, expenses: 20500, savings: 8500 },
      { label: 'May', income: 29500, expenses: 19800, savings: 9700 },
      { label: 'Jun', income: 30000, expenses: 20400, savings: 9600 },
      { label: 'Jul', income: 30000, expenses: 21100, savings: 8900 },
      { label: 'Aug', income: 30000, expenses: 20900, savings: 9100 },
      { label: 'Sep', income: 35500, expenses: 21800, savings: 13700 },
      { label: 'Oct', income: 30000, expenses: 21400, savings: 8600 }
    ]
  },
  categoryDistribution: [
    { name: 'Food', amount: 4900, percentage: 22.9, color: '#3b82f6' },
    { name: 'Shopping', amount: 3800, percentage: 17.8, color: '#f43f5e' },
    { name: 'Groceries', amount: 3200, percentage: 15.0, color: '#10b981' },
    { name: 'Bills', amount: 2850, percentage: 13.3, color: '#f59e0b' },
    { name: 'Transport', amount: 2400, percentage: 11.2, color: '#06b6d4' },
    { name: 'Education', amount: 1750, percentage: 8.2, color: '#6366f1' },
    { name: 'Entertainment', amount: 1300, percentage: 6.1, color: '#a855f7' },
    { name: 'Healthcare', amount: 1200, percentage: 5.6, color: '#ec4899' }
  ],
  essentialVsDiscretionary: [
    { name: 'Essential (Needs)', value: 14000, percentage: 65.4, color: '#0ea5e9' },
    { name: 'Discretionary (Wants)', value: 7400, percentage: 34.6, color: '#8b5cf6' }
  ],
  weekdayVsWeekend: [
    { dayType: 'Weekday (Mon-Fri)', totalSpend: 13200, avgPerDay: 2640, percentage: 61.7 },
    { dayType: 'Weekend (Sat-Sun)', totalSpend: 8200, avgPerDay: 4100, percentage: 38.3 }
  ],
  spendingPatterns: [
    { insight: 'Peak spending occurs on Saturdays between 6:00 PM and 10:00 PM' },
    { insight: 'Average grocery shopping basket is ₹1,600 twice per week' },
    { insight: 'Digital UPI payments represent 74% of all transaction volume' },
    { insight: 'Utility bills consistently clear in the first week of every month' }
  ]
}
