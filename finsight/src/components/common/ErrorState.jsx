import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import Button from './Button'

export default function ErrorState({
  title = 'Something went wrong',
  message = 'Unable to fetch data from the service. Please try again.',
  onRetry,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 rounded-2xl border border-rose-100 ${className}`}
    >
      <div className="p-3 rounded-full bg-rose-100 text-rose-600 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-rose-900">{title}</h3>
      <p className="mt-1 text-xs text-rose-600 max-w-sm">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button
            onClick={onRetry}
            size="sm"
            variant="secondary"
            icon={RefreshCw}
            className="text-xs border-rose-200 hover:bg-rose-100/50"
          >
            Retry
          </Button>
        </div>
      )}
    </div>
  )
}
