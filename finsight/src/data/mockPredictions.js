export const mockPredictions = {
  predictedAmount: 22700,
  confidence: 87,
  nextMonth: 'November 2026',
  explanation: 'Based on your historical spending patterns, recurring commitments, and seasonal spending variance over the last 6 months.',
  drivers: [
    { factor: 'Recurring subscriptions & utilities', amount: 4700, trend: 'stable' },
    { factor: 'Predicted dining & groceries', amount: 8200, trend: 'increasing' },
    { factor: 'Discretionary shopping & leisure', amount: 5100, trend: 'decreasing' },
    { factor: 'Commute & travel buffer', amount: 2700, trend: 'stable' },
    { factor: 'Contingency / Health', amount: 2000, trend: 'buffer' }
  ],
  trendData: [
    { month: 'May 2026', actual: 19800, predicted: null, type: 'actual' },
    { month: 'Jun 2026', actual: 20400, predicted: null, type: 'actual' },
    { month: 'Jul 2026', actual: 21100, predicted: null, type: 'actual' },
    { month: 'Aug 2026', actual: 20900, predicted: null, type: 'actual' },
    { month: 'Sep 2026', actual: 21800, predicted: null, type: 'actual' },
    { month: 'Oct 2026', actual: 21400, predicted: null, type: 'actual' },
    { month: 'Nov 2026', actual: null, predicted: 22700, type: 'predicted' }
  ]
}
