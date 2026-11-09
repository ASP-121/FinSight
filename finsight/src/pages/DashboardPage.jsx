import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  Plus,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import StatCard from '../components/common/StatCard'
import Button from '../components/common/Button'
import LoadingSkeleton from '../components/common/LoadingSkeleton'
import ErrorState from '../components/common/ErrorState'
import SpendingOverviewCard from '../components/dashboard/SpendingOverviewCard'
import CategorySpendingCard from '../components/dashboard/CategorySpendingCard'
import BudgetOverviewSection from '../components/dashboard/BudgetOverviewSection'
import DashboardInsightsCard from '../components/dashboard/DashboardInsightsCard'
import PredictionCard from '../components/dashboard/PredictionCard'
import TransactionTable from '../components/transactions/TransactionTable'
import TransactionModal from '../components/transactions/TransactionModal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { useAuth } from '../context/AuthContext'
import * as dashboardService from '../services/dashboardService'
import * as transactionService from '../services/transactionService'

export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Transaction Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [deletingTransaction, setDeletingTransaction] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await dashboardService.getDashboardData()
      // ensure recent transactions are refreshed from storage
      const txs = await transactionService.getTransactions()
      setData({
        ...result,
        recentTransactions: txs.slice(0, 5),
      })
    } catch (err) {
      console.error(err)
      setError('Unable to load your financial dashboard. Please check service connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Create Transaction Handler
  const handleAddTransaction = async (formData) => {
    await transactionService.createTransaction(formData)
    await loadData()
  }

  // Update Transaction Handler
  const handleUpdateTransaction = async (formData) => {
    if (editingTransaction) {
      await transactionService.updateTransaction(editingTransaction.id, formData)
      setEditingTransaction(null)
      await loadData()
    }
  }

  // Delete Transaction Handler
  const handleDeleteTransaction = async () => {
    if (deletingTransaction) {
      setActionLoading(true)
      try {
        await transactionService.deleteTransaction(deletingTransaction.id)
        setDeletingTransaction(null)
        await loadData()
      } finally {
        setActionLoading(false)
      }
    }
  }

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const currentMonthName = new Intl.DateTimeFormat('en-IN', { month: 'long' }).format(new Date())

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200/80 rounded-lg animate-pulse" />
          <div className="h-4 w-48 bg-slate-200/60 rounded-lg animate-pulse" />
        </div>
        <LoadingSkeleton type="cards" count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton type="chart" />
          <LoadingSkeleton type="chart" />
        </div>
      </div>
    )
  }

  if (error && !data) {
    return <ErrorState title="Dashboard Unavailable" message={error} onRetry={loadData} />
  }

  const summary = data?.summary || {}

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome Header with prominent Add Transaction CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {getGreeting()}, {user?.firstName} 👋
          </h2>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Here's your financial overview for {currentMonthName}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            icon={Plus}
            size="md"
            className="shadow-sm shadow-indigo-100 font-semibold"
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Balance"
          amount={summary.totalBalance?.amount || 0}
          changePercentage={summary.totalBalance?.changePercentage ?? 6.4}
          isPositive={summary.totalBalance?.isPositive ?? true}
          comparisonLabel="vs last month"
          icon={Wallet}
          iconColor="text-indigo-600 bg-indigo-50"
        />

        <StatCard
          title="Monthly Income"
          amount={summary.monthlyIncome?.amount || 0}
          changePercentage={summary.monthlyIncome?.changePercentage ?? 0.0}
          isPositive={true}
          comparisonLabel="Stable vs Sep"
          icon={ArrowDownLeft}
          iconColor="text-emerald-600 bg-emerald-50"
        />

        <StatCard
          title="Monthly Expenses"
          amount={summary.monthlyExpenses?.amount || 0}
          changePercentage={summary.monthlyExpenses?.changePercentage ?? -1.8}
          isPositive={true}
          comparisonLabel="-1.8% vs last month"
          icon={ArrowUpRight}
          iconColor="text-rose-600 bg-rose-50"
        />

        <StatCard
  title="Savings"
  amount={summary.savings?.amount ?? 0}
  changePercentage={summary.savings?.changePercentage ?? 0}
  isPositive={(summary.savings?.amount ?? 0) >= 0}
  comparisonLabel={`${
    summary.monthlyIncome?.amount > 0
      ? (
          ((summary.savings?.amount ?? 0) /
            summary.monthlyIncome.amount) *
          100
        ).toFixed(1)
      : '—'
  }% savings rate`}
  icon={PiggyBank}
  iconColor="text-amber-600 bg-amber-50"
/>
      </div>

      {/* Primary Analytics Grid: Spending Trend + Category Spending */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <SpendingOverviewCard data={data?.spendingTrend} />
        </div>
        <div className="lg:col-span-5">
          <CategorySpendingCard categories={data?.categorySpending} />
        </div>
      </div>

      {/* Secondary Row: Budgets Overview & AI Insights Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <BudgetOverviewSection budgets={data?.budgets} />
        </div>
        <div className="lg:col-span-6">
          <DashboardInsightsCard insights={data?.aiInsights} />
        </div>
      </div>

      {/* Predictions Card */}
      <PredictionCard prediction={data?.prediction} />

      {/* Recent Transactions Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-500">Latest activity across all accounts</p>
          </div>
          <Link
            to="/transactions"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>View all transactions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <TransactionTable
          transactions={data?.recentTransactions || []}
          onEdit={(tx) => setEditingTransaction(tx)}
          onDelete={(tx) => setDeletingTransaction(tx)}
        />
      </div>

      {/* Add / Edit Transaction Modals */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTransaction}
      />

      <TransactionModal
        isOpen={!!editingTransaction}
        isEditing={true}
        initialData={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSubmit={handleUpdateTransaction}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingTransaction}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${deletingTransaction?.description}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={actionLoading}
        onConfirm={handleDeleteTransaction}
        onCancel={() => setDeletingTransaction(null)}
      />
    </div>
  )
}
