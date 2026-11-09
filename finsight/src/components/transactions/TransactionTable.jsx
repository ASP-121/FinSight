import React from 'react'
import { formatINR, formatDate } from '../../utils/formatters'
import Badge from '../common/Badge'
import {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Film,
  HeartPulse,
  GraduationCap,
  ShoppingBasket,
  DollarSign,
  Briefcase,
  Layers,
  Edit2,
  Trash2,
  AlertTriangle,
} from 'lucide-react'

const CATEGORY_ICONS = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  Bills: Zap,
  Entertainment: Film,
  Healthcare: HeartPulse,
  Education: GraduationCap,
  Groceries: ShoppingBasket,
  Salary: DollarSign,
  Freelance: Briefcase,
}

export default function TransactionTable({
  transactions = [],
  onEdit,
  onDelete,
}) {
  return (
    <div className="w-full">
      {/* Desktop & Tablet Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
              <th className="py-3 px-4 rounded-l-xl">Date</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80 text-sm">
            {transactions.map((tx) => {
              const Icon = CATEGORY_ICONS[tx.category] || Layers
              const isExpense = tx.type === 'expense'

              return (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Date */}
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-500 whitespace-nowrap">
                    {formatDate(tx.date, { month: 'short', day: '2-digit' })}
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          isExpense ? 'bg-slate-100 text-slate-700' : 'bg-emerald-50 text-emerald-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 truncate">
                            {tx.description}
                          </p>
                          {tx.isAnomaly && (
                            <span
                              title="Unusual transaction flagged"
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200"
                            >
                              <AlertTriangle className="w-2.5 h-2.5" />
                              Spike
                            </span>
                          )}
                        </div>
                        {tx.notes && (
                          <p className="text-[11px] text-slate-400 truncate">
                            {tx.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {tx.category}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge variant={isExpense ? 'default' : 'success'} size="xs">
                      {isExpense ? 'Expense' : 'Income'}
                    </Badge>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span
                      className={`font-bold ${
                        isExpense ? 'text-slate-900' : 'text-emerald-600'
                      }`}
                    >
                      {isExpense ? '-' : '+'}
                      {formatINR(tx.amount)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {tx.status || 'Completed'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(tx)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(tx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {transactions.map((tx) => {
          const Icon = CATEGORY_ICONS[tx.category] || Layers
          const isExpense = tx.type === 'expense'

          return (
            <div
              key={tx.id}
              className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    isExpense ? 'bg-slate-100 text-slate-700' : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-900 truncate">
                    {tx.description}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                    <span>{formatDate(tx.date, { month: 'short', day: '2-digit' })}</span>
                    <span>•</span>
                    <span>{tx.category}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 flex flex-col items-end gap-1">
                <span
                  className={`text-sm font-bold ${
                    isExpense ? 'text-slate-900' : 'text-emerald-600'
                  }`}
                >
                  {isExpense ? '-' : '+'}
                  {formatINR(tx.amount)}
                </span>
                <div className="flex items-center gap-1">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(tx)}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(tx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
