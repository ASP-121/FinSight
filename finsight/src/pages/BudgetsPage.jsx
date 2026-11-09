import React, { useState, useEffect } from 'react'
import { Plus, PieChart as PieIcon, AlertTriangle, CheckCircle, Wallet } from 'lucide-react'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import BudgetCard from '../components/budgets/BudgetCard'
import BudgetModal from '../components/budgets/BudgetModal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import LoadingSkeleton from '../components/common/LoadingSkeleton'
import ErrorState from '../components/common/ErrorState'
import EmptyState from '../components/common/EmptyState'
import { formatINR } from '../utils/formatters'
import * as budgetService from '../services/budgetService'

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [deletingBudget, setDeletingBudget] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchBudgets = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await budgetService.getBudgets()
      setBudgets(data)
    } catch (err) {
      console.error(err)
      setError('Unable to load budget categories. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBudgets()
  }, [])

  const handleCreate = async (formData) => {
    await budgetService.createBudget(formData)
    await fetchBudgets()
  }

  const handleUpdate = async (formData) => {
    if (editingBudget) {
      await budgetService.updateBudget(editingBudget.id, formData)
      setEditingBudget(null)
      await fetchBudgets()
    }
  }

  const handleDelete = async () => {
    if (deletingBudget) {
      setActionLoading(true)
      try {
        await budgetService.deleteBudget(deletingBudget.id)
        setDeletingBudget(null)
        await fetchBudgets()
      } finally {
        setActionLoading(false)
      }
    }
  }

  // Aggregate metrics
  const totalAllocated = budgets.reduce((acc, b) => acc + b.allocated, 0)
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0)
  const totalRemaining = totalAllocated - totalSpent
  const overBudgetCount = budgets.filter((b) => b.spent > b.allocated).length

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Monthly Budgets
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Set spending limits to keep monthly cash flows under control
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          icon={Plus}
          size="md"
          className="shadow-sm shadow-indigo-100"
        >
          Add Budget
        </Button>
      </div>

      {/* Aggregate KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover padding="sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Allocated
          </span>
          <p className="text-xl font-extrabold text-slate-900 mt-1">
            {formatINR(totalAllocated)}
          </p>
          <span className="text-xs text-slate-500">{budgets.length} active categories</span>
        </Card>

        <Card hover padding="sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Spent
          </span>
          <p className="text-xl font-extrabold text-slate-900 mt-1">
            {formatINR(totalSpent)}
          </p>
          <span className="text-xs text-slate-500">
            {totalAllocated > 0 ? `${Math.round((totalSpent / totalAllocated) * 100)}% of limit` : '0%'}
          </span>
        </Card>

        <Card hover padding="sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Remaining Buffer
          </span>
          <p
            className={`text-xl font-extrabold mt-1 ${
              totalRemaining >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {formatINR(totalRemaining)}
          </p>
          <span className="text-xs text-slate-500">For remainder of October</span>
        </Card>

        <Card hover padding="sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Budget Health
          </span>
          <div className="mt-1 flex items-center gap-2">
            {overBudgetCount > 0 ? (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-bold text-amber-700">
                  {overBudgetCount} Over limit
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-bold text-emerald-700">
                  All within budget
                </span>
              </>
            )}
          </div>
          <span className="text-xs text-slate-500">Auto monitored daily</span>
        </Card>
      </div>

      {/* Main Budget Grid */}
      {loading ? (
        <LoadingSkeleton type="cards" count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchBudgets} />
      ) : budgets.length === 0 ? (
        <EmptyState
          title="No budgets created yet"
          description="Create your first budget limit to gain real-time visibility over discretionary spending."
          actionLabel="+ Add Budget"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {budgets.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              onEdit={(bgt) => setEditingBudget(bgt)}
              onDelete={(bgt) => setDeletingBudget(bgt)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <BudgetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreate}
      />

      <BudgetModal
        isOpen={!!editingBudget}
        isEditing={true}
        initialData={editingBudget}
        onClose={() => setEditingBudget(null)}
        onSubmit={handleUpdate}
      />

      <ConfirmDialog
        isOpen={!!deletingBudget}
        title="Delete Budget"
        message={`Are you sure you want to remove the budget for ${deletingBudget?.category}?`}
        confirmText="Delete"
        loading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeletingBudget(null)}
      />
    </div>
  )
}
