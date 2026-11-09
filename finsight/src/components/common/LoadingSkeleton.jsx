import React from 'react'

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded-lg ${className}`}
    />
  )
}

export function CardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex justify-between items-start">
            <div className="space-y-2 w-2/3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-28" />
            </div>
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
          <Skeleton className="h-4 w-32 mt-4" />
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-xs">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="space-y-1.5 text-right">
            <Skeleton className="h-4 w-20 ml-auto" />
            <Skeleton className="h-3 w-14 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-60" />
        </div>
        <Skeleton className="h-8 w-32 rounded-xl" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}

export default function LoadingSkeleton({ type = 'card', count = 1 }) {
  if (type === 'cards') return <CardSkeleton count={count} />
  if (type === 'table') return <TableSkeleton rows={count} />
  if (type === 'chart') return <ChartSkeleton />
  return <Skeleton className="h-32 w-full" />
}
