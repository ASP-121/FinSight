
import { request, USE_MOCK } from '../utils/apiClient'
import { mockInsights } from '../data/mockInsights'
import { mockPredictions } from '../data/mockPredictions'

// ------------------------------------------
// AI INSIGHTS
// ------------------------------------------

export const getAIInsights = async () => {
  if (!USE_MOCK) {
    return request('/api/insights')
  }

  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockInsights
}

// ------------------------------------------
// AI PREDICTIONS
// ------------------------------------------

export async function getPredictions() {
  if (!USE_MOCK) {
    return request('/api/ai/predictions')
  }

  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockPredictions
}

// ------------------------------------------
// TRANSACTION CATEGORIZATION
// ------------------------------------------

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

  if (
    ['swiggy', 'zomato', 'dinner', 'lunch', 'cafe',
      'restaurant', 'burger', 'pizza', 'tea', 'coffee'].some(
      (word) => desc.includes(word)
    )
  ) {
    return { category: 'Food', confidence: 96 }
  }

  if (
    ['uber', 'ola', 'metro', 'fuel', 'petrol', 'diesel',
      'rapido', 'taxi'].some((word) => desc.includes(word))
  ) {
    return { category: 'Transport', confidence: 94 }
  }

  if (
    ['amazon', 'flipkart', 'myntra', 'clothes', 'shoes',
      'electronics', 'shopping'].some((word) => desc.includes(word))
  ) {
    return { category: 'Shopping', confidence: 92 }
  }

  if (
    ['blinkit', 'instamart', 'zepto', 'grocery',
      'supermarket', 'bigbasket', 'milk'].some(
      (word) => desc.includes(word)
    )
  ) {
    return { category: 'Groceries', confidence: 95 }
  }

  if (
    ['bescom', 'electricity', 'wifi', 'broadband', 'water',
      'rent', 'bill', 'gas', 'recharge'].some(
      (word) => desc.includes(word)
    )
  ) {
    return { category: 'Bills', confidence: 98 }
  }

  if (
    ['netflix', 'prime', 'spotify', 'movie', 'cinema',
      'game', 'hotstar'].some((word) => desc.includes(word))
  ) {
    return { category: 'Entertainment', confidence: 97 }
  }

  if (
    ['apollo', 'pharmacy', 'doctor', 'clinic', 'medicine',
      'hospital', 'dental'].some((word) => desc.includes(word))
  ) {
    return { category: 'Healthcare', confidence: 93 }
  }

  if (
    ['course', 'coursera', 'udemy', 'books',
      'tuition', 'college'].some((word) => desc.includes(word))
  ) {
    return { category: 'Education', confidence: 91 }
  }

  if (
    ['salary', 'payroll', 'stipend', 'wage'].some(
      (word) => desc.includes(word)
    )
  ) {
    return { category: 'Salary', confidence: 99 }
  }

  if (
    ['freelance', 'consulting', 'upwork', 'fiverr'].some(
      (word) => desc.includes(word)
    )
  ) {
    return { category: 'Freelance', confidence: 90 }
  }

  return { category: 'Other', confidence: 60 }
}

// ------------------------------------------
// AI ASSISTANT
// ------------------------------------------


export async function sendAIMessage(message, history = []) {
  if (!message || !message.trim()) {
    throw new Error('Message cannot be empty')
  }

  const conversationHistory = history
    .filter((item) => item.sender === 'user' || item.sender === 'ai')
    .map((item) => ({
      role: item.sender === 'ai' ? 'assistant' : 'user',
      content: item.text,
    }))
    .slice(-10)

  const response = await request('/api/assistant/chat', {
    method: 'POST',
    body: JSON.stringify({
      message: message.trim(),
      history: conversationHistory,
    }),
  })

  return {
    text: response.reply,
    suggestions: [],
  }
}

