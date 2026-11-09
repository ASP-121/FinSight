import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Button from '../common/Button'

const DEFAULT_CATEGORIES = [
  'Food',
  'Shopping',
  'Transport',
  'Entertainment',
  'Bills',
  'Groceries',
  'Healthcare',
  'Education',
  'Travel',
  'Other',
]

const COLOR_PALETTE = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#6366f1', // indigo
  '#f43f5e', // rose
]

const getCurrentMonth = () =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date())

export default function BudgetModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isEditing = false,
}) {
  const [formData, setFormData] = useState({
    category: 'Food',
    allocated: '',
    color: '#3b82f6',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        category: initialData.category || 'Food',
        allocated: initialData.allocated || '',
        color: initialData.color || '#3b82f6',
      })
    } else {
      setFormData({
        category: 'Food',
        allocated: '',
        color: '#3b82f6',
      })
    }
    setError('')
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.allocated || Number(formData.allocated) <= 0) {
      setError('Please enter a valid monthly limit')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
      ...formData,
      allocated: Number(formData.allocated),
      month: initialData?.month || getCurrentMonth(),
      icon: initialData?.icon || 'Wallet',
    })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save budget')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isEditing ? 'Edit Budget' : 'Set Monthly Budget'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Control your monthly expenses by category
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              disabled={isEditing}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 cursor-pointer"
            >
              {DEFAULT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Monthly Limit (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold">
                ₹
              </div>
              <input
                type="number"
                min="100"
                step="100"
                placeholder="5000"
                value={formData.allocated}
                onChange={(e) => setFormData({ ...formData, allocated: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Color Tag
            </label>
            <div className="flex items-center gap-2.5">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: c })}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    formData.color === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isEditing ? 'Save Changes' : 'Create Budget'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
