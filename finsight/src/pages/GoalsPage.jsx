import React, { useState, useEffect } from 'react'
import { Plus, Target, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import GoalCard from '../components/goals/GoalCard'
import GoalModal from '../components/goals/GoalModal'
import ContributeModal from '../components/goals/ContributeModal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import LoadingSkeleton from '../components/common/LoadingSkeleton'
import ErrorState from '../components/common/ErrorState'
import EmptyState from '../components/common/EmptyState'
import { formatINR } from '../utils/formatters'
import * as goalService from '../services/goalService'

export default function GoalsPage() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [deletingGoal, setDeletingGoal] = useState(null)
  const [contributingGoal, setContributingGoal] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchGoals = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await goalService.getGoals()
      setGoals(data)
    } catch (err) {
      console.error(err)
      setError('Unable to load savings goals. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  const handleCreate = async (formData) => {
    await goalService.createGoal(formData)
    await fetchGoals()
  }

  const handleUpdate = async (formData) => {
    if (editingGoal) {
      await goalService.updateGoal(editingGoal.id, formData)
      setEditingGoal(null)
      await fetchGoals()
    }
  }

  const handleDelete = async () => {
    if (deletingGoal) {
      setActionLoading(true)
      try {
        await goalService.deleteGoal(deletingGoal.id)
        setDeletingGoal(null)
        await fetchGoals()
      } finally {
        setActionLoading(false)
      }
    }
  }

  const handleContribute = async (goalId, amount) => {
    await goalService.contributeToGoal(goalId, amount)
    await fetchGoals()
  }

  // Aggregate stats
  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0)
  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0)
  const overallPercentage = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Savings Goals
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Automate milestones for big-ticket purchases and peace of mind
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          icon={Plus}
          size="md"
          className="shadow-sm shadow-indigo-100"
        >
          New Goal
        </Button>
      </div>

      {/* Aggregate KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card hover>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Target
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {formatINR(totalTarget)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Combined sum across {goals.length} target funds
          </p>
        </Card>

        <Card hover>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Saved
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
            {formatINR(totalSaved)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Currently locked in high-yield reserves
          </p>
        </Card>

        <Card hover>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Overall Completion
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
              {overallPercentage}%
            </p>
            <span className="text-xs font-semibold text-slate-500">
              {formatINR(totalTarget - totalSaved)} left
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <LoadingSkeleton type="cards" count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchGoals} />
      ) : goals.length === 0 ? (
        <EmptyState
          title="No savings goals yet"
          description="Create your first goal to begin accumulating dedicated savings for tech, travel, or emergencies."
          actionLabel="+ New Goal"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={(g) => setEditingGoal(g)}
              onDelete={(g) => setDeletingGoal(g)}
              onContribute={(g) => setContributingGoal(g)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <GoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreate}
      />

      <GoalModal
        isOpen={!!editingGoal}
        isEditing={true}
        initialData={editingGoal}
        onClose={() => setEditingGoal(null)}
        onSubmit={handleUpdate}
      />

      <ContributeModal
        isOpen={!!contributingGoal}
        goal={contributingGoal}
        onClose={() => setContributingGoal(null)}
        onContribute={handleContribute}
      />

      <ConfirmDialog
        isOpen={!!deletingGoal}
        title="Delete Savings Goal"
        message={`Are you sure you want to delete the goal "${deletingGoal?.title}"?`}
        confirmText="Delete"
        loading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeletingGoal(null)}
      />
    </div>
  )
}
