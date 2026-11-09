import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  FileSpreadsheet,
} from 'lucide-react'
import Button from '../components/common/Button'
import TransactionTable from '../components/transactions/TransactionTable'
import TransactionModal from '../components/transactions/TransactionModal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingSkeleton from '../components/common/LoadingSkeleton'
import * as transactionService from '../services/transactionService'

const CATEGORIES = [
  'All',
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
]

const TYPES = ['All', 'Expense', 'Income']

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Date: Newest first' },
  { value: 'date-asc', label: 'Date: Oldest first' },
  { value: 'amount-desc', label: 'Amount: High to Low' },
  { value: 'amount-asc', label: 'Amount: Low to High' },
]

export default function TransactionsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'All'
  const initialSearch = searchParams.get('search') || ''

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter and Search states
  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState(initialCategory)
  const [type, setType] = useState('All')
  const [sortBy, setSortBy] = useState('date-desc')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [deletingTransaction, setDeletingTransaction] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchTransactions = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await transactionService.getTransactions({
        search,
        category,
        type,
        sortBy,
        startDate,
        endDate,
      })
      setTransactions(data)
    } catch (err) {
      console.error(err)
      setError('Unable to load your transactions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [category, type, sortBy, startDate, endDate])

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Pagination calculation
  const totalPages = Math.ceil(transactions.length / pageSize) || 1
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return transactions.slice(start, start + pageSize)
  }, [transactions, currentPage, pageSize])

  const handleAdd = async (formData) => {
    await transactionService.createTransaction(formData)
    await fetchTransactions()
  }

  const handleUpdate = async (formData) => {
    if (editingTransaction) {
      await transactionService.updateTransaction(editingTransaction.id, formData)
      setEditingTransaction(null)
      await fetchTransactions()
    }
  }

  const handleDelete = async () => {
    if (deletingTransaction) {
      setActionLoading(true)
      try {
        await transactionService.deleteTransaction(deletingTransaction.id)
        setDeletingTransaction(null)
        await fetchTransactions()
      } finally {
        setActionLoading(false)
      }
    }
  }

  const resetFilters = () => {
    setSearch('')
    setCategory('All')
    setType('All')
    setSortBy('date-desc')
    setStartDate('')
    setEndDate('')
    setCurrentPage(1)
    setSearchParams({})
  }

  const hasActiveFilters =
    search || category !== 'All' || type !== 'All' || startDate || endDate

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Transactions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            View, search, filter and manage all financial records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            icon={Plus}
            size="md"
            className="shadow-sm shadow-indigo-100"
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search description, merchant, note..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Type Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Types' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="lg:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset button if active filters */}
          {hasActiveFilters && (
            <div className="lg:col-span-1 flex justify-end">
              <button
                onClick={resetFilters}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors text-xs flex items-center gap-1 font-semibold"
                title="Reset filters"
              >
                <X className="w-4 h-4" />
                <span className="lg:hidden">Reset</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Table / Content Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        {loading ? (
          <LoadingSkeleton type="table" count={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchTransactions} />
        ) : transactions.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            description="Add your first transaction to start understanding your spending."
            actionLabel="+ Add Transaction"
            onAction={() => setIsAddModalOpen(true)}
          />
        ) : (
          <div className="space-y-4">
            <TransactionTable
              transactions={paginatedTransactions}
              onEdit={(tx) => setEditingTransaction(tx)}
              onDelete={(tx) => setDeletingTransaction(tx)}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <p>
                  Showing{' '}
                  <span className="font-semibold text-slate-800">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold text-slate-800">
                    {Math.min(currentPage * pageSize, transactions.length)}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-slate-800">
                    {transactions.length}
                  </span>{' '}
                  transactions
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    icon={ChevronLeft}
                  >
                    Previous
                  </Button>
                  <span className="px-2 font-semibold text-slate-700">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    icon={ChevronRight}
                    iconPosition="right"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAdd}
      />

      <TransactionModal
        isOpen={!!editingTransaction}
        isEditing={true}
        initialData={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSubmit={handleUpdate}
      />

      <ConfirmDialog
        isOpen={!!deletingTransaction}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${deletingTransaction?.description}"?`}
        confirmText="Delete"
        loading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeletingTransaction(null)}
      />
    </div>
  )
}
