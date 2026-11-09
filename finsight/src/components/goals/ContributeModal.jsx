import React, { useState } from 'react'
import { X, ArrowUpRight } from 'lucide-react'
import Button from '../common/Button'
import { formatINR } from '../../utils/formatters'

export default function ContributeModal({
  isOpen,
  onClose,
  goal,
  onContribute,
}) {
  const [amount, setAmount] = useState('1000')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen || !goal) return null

  const quickAmounts = [500, 1000, 2500, 5000]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const val = Number(amount)
    if (!val || val <= 0) {
      setError('Please enter a valid amount')
      return
    }

    setIsSubmitting(true)
    try {
      await onContribute(goal.id, val)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to deposit')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Contribute to Goal
            </h3>
            <p className="text-xs text-slate-500 truncate max-w-xs">{goal.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2.5 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Deposit Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">
                ₹
              </span>
              <input
                type="number"
                min="100"
                step="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            {quickAmounts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setAmount(q.toString())}
                className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                +{formatINR(q, false)}
              </button>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex justify-between">
            <span>New Saved Balance:</span>
            <span className="font-bold text-slate-900">
              {formatINR(goal.currentAmount + (Number(amount) || 0))}
            </span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={isSubmitting} icon={ArrowUpRight}>
              Confirm Deposit
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
