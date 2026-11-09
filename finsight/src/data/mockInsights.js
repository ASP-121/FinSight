export const mockInsights = {
  healthScore: 78,
  previousHealthScore: 74,
  breakdown: [
    { label: 'Savings Rate', score: 84, description: '28.6% of income saved this month' },
    { label: 'Budget Adherence', score: 72, description: '7 of 8 category budgets within limits' },
    { label: 'Spending Control', score: 79, description: 'Discretionary ratio at 34%' },
    { label: 'Expense Growth', score: 68, description: 'Total outflow +4.2% vs previous month' },
    { label: 'Goal Progress', score: 87, description: 'On track to meet Q2 targets' }
  ],
  items: [
    {
      id: 'ins_001',
      type: 'warning', // Warning
      category: 'Food & Dining',
      title: 'Food spending elevated',
      message: 'Your food spending is 23% higher than your 3-month average.',
      explanation: 'In the last 30 days, 14 food delivery orders via Swiggy and Zomato totaled ₹4,900 compared to your rolling average of ₹3,980. Weekend evening deliveries account for 68% of this spike.',
      actionText: 'View Food Breakdown',
      actionRoute: '/transactions?category=Food',
      date: '2026-10-08',
      impact: '-₹920 variance'
    },
    {
      id: 'ins_002',
      type: 'good', // Good
      category: 'Savings Target',
      title: 'Strong Savings Pace',
      message: 'You are on track to save ₹8,600 this month.',
      explanation: 'Assuming your current daily burn rate of ~₹713 continues for the remainder of October, your projected monthly expenditure will cap at ₹21,400, leaving ₹8,600 untouched.',
      actionText: 'Allocate to Goals',
      actionRoute: '/goals',
      date: '2026-10-08',
      impact: '+₹8,600 reserve'
    },
    {
      id: 'ins_003',
      type: 'attention', // Attention
      category: 'Shopping Budget',
      title: 'Shopping target breach',
      message: 'Shopping spending exceeded your target by ₹800.',
      explanation: 'An Amazon electronics purchase of ₹8,500 along with recurring retail transactions caused your shopping category to reach ₹3,800 against your monthly target of ₹3,000.',
      actionText: 'Review Budget',
      actionRoute: '/budgets',
      date: '2026-10-07',
      impact: '127% of limit'
    },
    {
      id: 'ins_004',
      type: 'opportunity', // Opportunity
      category: 'Optimization Tip',
      title: 'Delivery Optimization Potential',
      message: 'You could potentially save ₹1,200 next month by reducing food delivery expenses.',
      explanation: 'Consolidating deliveries to 2 days per week or substituting takeout with meal-prep could comfortably retain ₹1,200/mo without lifestyle friction.',
      actionText: 'Adjust Target',
      actionRoute: '/budgets',
      date: '2026-10-06',
      impact: '+₹1,200 potential'
    }
  ]
}
