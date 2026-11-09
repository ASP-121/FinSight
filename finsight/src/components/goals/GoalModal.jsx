import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Button from '../common/Button'

const CATEGORIES = ['Technology', 'Safety Net', 'Travel', 'Vehicle', 'Home', 'Education', 'Investment']
const ICONS = [
  { id: 'Laptop', label: 'Laptop' },
  { id: 'ShieldCheck', label: 'Emergency' },
  { id: 'Palmtree', label: 'Vacation' },
  { id: 'Bike', label: 'Vehicle' },
  { id: 'Target', label: 'Target' },
]

export default function GoalModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isEditing = false,
}) {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '0',
    targetDate: '2027-06-30',
    monthlyContribution: '1000',
    targetDateDisplay: 'June 2027',
    category: 'Technology',
    icon: 'Laptop',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        targetAmount: initialData.targetAmount || '',
        currentAmount: initialData.currentAmount || 0,
        targetDate: initialData.targetDate || '2027-06-30',
        targetDateDisplay: initialData.targetDateDisplay || '',
        category: initialData.category || 'Technology',
        icon: initialData.icon || 'Target',
        description: initialData.description || '',
        monthlyContribution: initialData.monthlyContribution ?? 1000,
      })
    } else {
      setFormData({
        title: '',
        targetAmount: '',
        currentAmount: '0',
        targetDate: '2027-06-30',
        targetDateDisplay: 'June 2027',
        category: 'Technology',
        icon: 'Target',
        description: '',
        monthlyContribution: '1000',
      })
    }
    setError('')
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim()) {
      setError('Please provide a goal title')
      return
    }
    if (!formData.targetAmount || Number(formData.targetAmount) <= 0) {
      setError('Please provide a valid target amount')
      return
    }


    setIsSubmitting(true)
    try {
      await onSubmit({
        ...formData,
        targetAmount: Number(formData.targetAmount),
        currentAmount: Number(formData.currentAmount || 0),
        monthlyContribution: Number(formData.monthlyContribution || 0),
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save goal')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isEditing ? 'Edit Savings Goal' : 'Create New Goal'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Set milestones and track progress for future purchases
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Goal Name
            </label>
            <input
              type="text"
              placeholder="e.g. New Laptop, Emergency Fund, Bali Vacation"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Amount (₹)
              </label>
              <input
                type="number"
                min="1000"
                step="500"
                placeholder="80000"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Currently Saved (₹)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                placeholder="0"
                value={formData.currentAmount}
                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          
<div>
  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
    Monthly Contribution (₹)
  </label>
  <input
    type="number"
    min="0"
    step="100"
    value={formData.monthlyContribution}
    onChange={(e) =>
      setFormData({
        ...formData,
        monthlyContribution: e.target.value,
      })
    }
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
    required
  />
</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Date
              </label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => {
                  const date = new Date(e.target.value)
                  const display = !isNaN(date.getTime())
                    ? date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : ''
                  setFormData({
                    ...formData,
                    targetDate: e.target.value,
                    targetDateDisplay: display,
                  })
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Icon Type
            </label>
            <div className="grid grid-cols-5 gap-2">
              {ICONS.map((ic) => (
                <button
                  key={ic.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: ic.id })}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-medium border transition-all ${
                    formData.icon === ic.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {ic.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Notes / Description (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="Why this goal matters or target specs"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isEditing ? 'Save Changes' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
