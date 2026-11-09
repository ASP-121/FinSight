import React, { useState, useEffect } from 'react'
import {
  X,
  Sparkles,
  Check,
  ChevronDown,
  Calendar,
  IndianRupee,
  Tag,
  FileText,
} from 'lucide-react'
import Button from '../common/Button'
import * as aiService from '../../services/aiService'

const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Education',
  'Groceries',
  'Salary',
  'Freelance',
  'Other',
]

export default function TransactionModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isEditing = false,
}) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    category: '',
    notes: '',
  })

  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [isDetectingCategory, setIsDetectingCategory] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount || '',
        description: initialData.description || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        type: initialData.type || 'expense',
        category: initialData.category || '',
        notes: initialData.notes || '',
      })
      setAiSuggestion(null)
    } else {
      setFormData({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        category: '',
        notes: '',
      })
      setAiSuggestion(null)
    }
    setError('')
  }, [initialData, isOpen])

  // Simulate AI categorization when user stops typing description
  useEffect(() => {
    if (isEditing || !formData.description || formData.description.length < 3) {
      return
    }

    const timer = setTimeout(async () => {
      setIsDetectingCategory(true)
      try {
        const result = await aiService.categorizeTransaction(formData.description)
        if (result && result.category) {
          setAiSuggestion(result)
          // Automatically set detected category if user hasn't explicitly selected one
          if (!formData.category || formData.category === 'AI will automatically detect category') {
            setFormData((prev) => ({ ...prev, category: result.category }))
          }
        }
      } catch (err) {
        console.error('AI categorization error', err)
      } finally {
        setIsDetectingCategory(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [formData.description, isEditing])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Please enter a valid amount greater than 0')
      return
    }
    if (!formData.description.trim()) {
      setError('Please enter a description for the transaction')
      return
    }
    if (!formData.category || formData.category === 'AI will automatically detect category') {
      setError('Please select or verify a category')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        ...formData,
        amount: Number(formData.amount),
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save transaction')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isEditing ? 'Edit Transaction' : 'Add Transaction'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Update your financial record'
                : 'Enter transaction details with AI-assisted categorization'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {error}
            </div>
          )}

          {/* Transaction Type Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  formData.type === 'expense'
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  formData.type === 'income'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Amount (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold">
                ₹
              </div>
              <input
                type="number"
                step="any"
                min="1"
                placeholder="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <input
              type="text"
              placeholder="e.g. Swiggy dinner, Uber commute, Monthly rent"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          {/* AI Categorization feedback */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Category
              </label>
              {isDetectingCategory && (
                <span className="flex items-center gap-1 text-[11px] text-indigo-600 font-medium">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  Analyzing description...
                </span>
              )}
            </div>

            {/* AI Suggested Banner */}
            {aiSuggestion && (
              <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-100 flex items-center justify-between text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-purple-100 text-purple-700">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-slate-500">AI Suggested Category: </span>
                    <span className="font-bold text-purple-900">
                      {aiSuggestion.category}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-full">
                  Confidence: {aiSuggestion.confidence}%
                </span>
              </div>
            )}

            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  {isDetectingCategory
                    ? 'AI is analyzing category...'
                    : 'Select or change category'}
                </option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Date & Optional Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="Payment mode or tags"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isEditing ? 'Save Changes' : 'Add Transaction'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
