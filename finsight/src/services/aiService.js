import { request, USE_MOCK } from '../utils/apiClient'
import { mockInsights } from '../data/mockInsights'
import { mockPredictions } from '../data/mockPredictions'

export async function getAIInsights() {
  if (!USE_MOCK) {
    return request('/api/ai/insights')
  }

  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockInsights
}

export async function getPredictions() {
  if (!USE_MOCK) {
    return request('/api/ai/predictions')
  }

  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockPredictions
}

/**
 * Simulates AI categorization based on transaction description
 * Future backend will call POST /api/ai/categorize
 */
export async function categorizeTransaction(description = '') {
  if (!USE_MOCK) {
    return request('/api/ai/categorize', {
      method: 'POST',
      body: JSON.stringify({ description }),
    })
  }

  await new Promise((resolve) => setTimeout(resolve, 200))

  const desc = description.toLowerCase().trim()
  if (!desc) {
    return { category: null, confidence: 0 }
  }

  if (desc.includes('swiggy') || desc.includes('zomato') || desc.includes('dinner') || desc.includes('lunch') || desc.includes('cafe') || desc.includes('restaurant') || desc.includes('burger') || desc.includes('pizza') || desc.includes('tea') || desc.includes('coffee')) {
    return { category: 'Food', confidence: 96 }
  }
  if (desc.includes('uber') || desc.includes('ola') || desc.includes('metro') || desc.includes('fuel') || desc.includes('petrol') || desc.includes('diesel') || desc.includes('rapido') || desc.includes('taxi')) {
    return { category: 'Transport', confidence: 94 }
  }
  if (desc.includes('amazon') || desc.includes('flipkart') || desc.includes('myntra') || desc.includes('clothes') || desc.includes('shoes') || desc.includes('electronics') || desc.includes('shopping')) {
    return { category: 'Shopping', confidence: 92 }
  }
  if (desc.includes('blinkit') || desc.includes('instamart') || desc.includes('zepto') || desc.includes('grocery') || desc.includes('supermarket') || desc.includes('bigbasket') || desc.includes('milk')) {
    return { category: 'Groceries', confidence: 95 }
  }
  if (desc.includes('bescom') || desc.includes('electricity') || desc.includes('wifi') || desc.includes('broadband') || desc.includes('water') || desc.includes('rent') || desc.includes('bill') || desc.includes('gas') || desc.includes('recharge')) {
    return { category: 'Bills', confidence: 98 }
  }
  if (desc.includes('netflix') || desc.includes('prime') || desc.includes('spotify') || desc.includes('movie') || desc.includes('cinema') || desc.includes('game') || desc.includes('hotstar')) {
    return { category: 'Entertainment', confidence: 97 }
  }
  if (desc.includes('apollo') || desc.includes('pharmacy') || desc.includes('doctor') || desc.includes('clinic') || desc.includes('medicine') || desc.includes('hospital') || desc.includes('dental')) {
    return { category: 'Healthcare', confidence: 93 }
  }
  if (desc.includes('course') || desc.includes('coursera') || desc.includes('udemy') || desc.includes('books') || desc.includes('tuition') || desc.includes('college')) {
    return { category: 'Education', confidence: 91 }
  }
  if (desc.includes('salary') || desc.includes('payroll') || desc.includes('stipend') || desc.includes('wage')) {
    return { category: 'Salary', confidence: 99 }
  }
  if (desc.includes('freelance') || desc.includes('consulting') || desc.includes('upwork') || desc.includes('fiverr')) {
    return { category: 'Freelance', confidence: 90 }
  }

  return { category: 'Other', confidence: 60 }
}

/**
 * Simulates conversational AI Assistant responses
 * Future backend will call POST /api/ai/chat
 */
export async function sendAIMessage(prompt, history = []) {
  if (!USE_MOCK) {
    return request('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message: prompt, history }),
    })
  }

  await new Promise((resolve) => setTimeout(resolve, 450))

  const text = prompt.toLowerCase()

  if (text.includes('food')) {
    return {
      text: 'You spent ₹4,900 on food this month, which is 23% higher than your 3-month average of ₹3,980. Ordering via Swiggy and Zomato accounted for ₹3,450 of this expenditure.',
      suggestions: [
        'How can I reduce food delivery spend?',
        'Show food transactions',
        'Compare food vs groceries'
      ]
    }
  }

  if (text.includes('overspending') || text.includes('over budget')) {
    return {
      text: 'You are currently over budget in Shopping (₹3,800 spent vs ₹3,000 limit, exceeding by ₹800). Additionally, Food is at 98% of its ₹5,000 limit with several days remaining in the billing cycle.',
      suggestions: [
        'Review Shopping budget',
        'Show anomaly transactions',
        'Adjust October budgets'
      ]
    }
  }

  if (text.includes('save') && (text.includes('5000') || text.includes('5,000') || text.includes('next month'))) {
    return {
      text: 'Yes! Based on your steady monthly income of ₹30,000 and projected baseline expenses of ₹21,400, your potential savings margin is ₹8,600. Even with a 10% unexpected expense buffer, saving ₹5,000 is comfortably achievable.',
      suggestions: [
        'Create a ₹5,000 savings goal',
        'Where can I trim ₹1,500 more?',
        'Forecast next month cash flow'
      ]
    }
  }

  if (text.includes('how much will i spend') || text.includes('predict') || text.includes('forecast')) {
    return {
      text: 'Our predictive model forecasts expenses of approximately ₹22,700 for November 2026 (87% confidence interval). This incorporates your fixed subscriptions (₹4,700) and historical festival-season shopping variances.',
      suggestions: [
        'View prediction breakdown',
        'What are the key cost drivers?',
        'How to maintain ₹20,000 ceiling'
      ]
    }
  }

  if (text.includes('category increased') || text.includes('increased the most')) {
    return {
      text: 'Food & Dining witnessed the sharpest rise (+23% month-over-month), followed by Shopping (+18% due to an electronics purchase of ₹8,500). On the positive side, Transport and Utilities decreased by 6%.',
      suggestions: [
        'View category breakdown',
        'Set budget limit for Food',
        'Show all recent spikes'
      ]
    }
  }

  // Default thoughtful fintech response
  return {
    text: `Based on your October financial records: You have recorded ₹30,000 in income, ₹21,400 in total expenditures, and an estimated savings surplus of ₹8,600 (28.7% savings rate). Your active emergency fund is 63% complete.`,
    suggestions: [
      'How much did I spend on food this month?',
      'Where am I overspending?',
      'Can I save ₹5,000 next month?'
    ]
  }
}
