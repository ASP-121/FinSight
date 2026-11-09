export const mockAlerts = [
  {
    id: 'alt_001',
    type: 'anomaly',
    severity: 'high',
    title: 'Unusual transaction detected',
    description: '₹8,500 — Amazon. This transaction is significantly higher than your usual shopping expenses.',
    timestamp: '2 hours ago',
    date: '2026-10-07',
    read: false,
    actionText: 'Review Transaction',
    actionRoute: '/transactions?id=tx_004'
  },
  {
    id: 'alt_002',
    type: 'budget',
    severity: 'medium',
    title: 'Shopping budget exceeded by ₹800',
    description: 'You have spent ₹3,800 out of your ₹3,000 monthly limit for Shopping.',
    timestamp: '1 day ago',
    date: '2026-10-07',
    read: false,
    actionText: 'Manage Budgets',
    actionRoute: '/budgets'
  },
  {
    id: 'alt_003',
    type: 'spike',
    severity: 'medium',
    title: 'Food spending spike',
    description: 'Your food expenses increased 31% this week, trending 23% above your monthly average.',
    timestamp: '2 days ago',
    date: '2026-10-06',
    read: true,
    actionText: 'View Food Spending',
    actionRoute: '/transactions?category=Food'
  },
  {
    id: 'alt_004',
    type: 'goal',
    severity: 'low',
    title: 'Laptop goal on track',
    description: 'You are at 56% of your ₹80,000 target for the new laptop goal.',
    timestamp: '4 days ago',
    date: '2026-10-04',
    read: true,
    actionText: 'View Goal',
    actionRoute: '/goals'
  }
]
