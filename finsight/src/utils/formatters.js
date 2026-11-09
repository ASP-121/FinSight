/**
 * Currency & Number Formatters for FinSight
 * Adheres to Indian Numbering System (Lakhs & Crores)
 */

export const formatINR = (amount, includeSymbol = true) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return includeSymbol ? '₹0' : '0'
  }

  const num = Number(amount)
  const isNegative = num < 0
  const absNum = Math.abs(num)

  // Standard Indian numbering formatting
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(absNum)

  const prefix = isNegative ? '-₹' : '₹'
  return includeSymbol ? `${prefix}${formatted}` : (isNegative ? `-${formatted}` : formatted)
}

export const formatINRCompact = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0'
  const abs = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''

  if (abs >= 10000000) {
    return `${sign}₹${(abs / 10000000).toFixed(1)} Cr`
  } else if (abs >= 100000) {
    return `${sign}₹${(abs / 100000).toFixed(1)} L`
  } else if (abs >= 1000) {
    return `${sign}₹${(abs / 1000).toFixed(1)}k`
  }
  return `${sign}₹${abs}`
}

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString

  const defaultOptions = {
    month: 'short',
    day: '2-digit',
    ...options
  }

  return new Intl.DateTimeFormat('en-IN', defaultOptions).format(date)
}

export const formatFullDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}
