import React from 'react'
import { FolderOpen } from 'lucide-react'
import Button from './Button'

export default function EmptyState({
  title = 'No items found',
  description = 'There is no data to display right now.',
  icon: Icon = FolderOpen,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-10 text-center bg-white rounded-2xl border border-dashed border-slate-200 ${className}`}
    >
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 mb-4">
        <Icon className="w-8 h-8" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-500 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
