import React from 'react'
import { TrendingUp, Sparkles } from 'lucide-react'

export default function Logo({ size = 'default', showTagline = false, className = '' }) {
  const iconSizes = {
    small: 'w-5 h-5',
    default: 'w-6 h-6',
    large: 'w-8 h-8',
  }

  const textSizes = {
    small: 'text-lg',
    default: 'text-xl',
    large: 'text-2xl',
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-2.5">
        <div className="relative flex items-center justify-center p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-200">
          <TrendingUp className={iconSizes[size] || iconSizes.default} strokeWidth={2.5} />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
        <div className="flex flex-col">
          <span className={`font-bold tracking-tight text-slate-900 ${textSizes[size] || textSizes.default}`}>
            Fin<span className="text-indigo-600">Sight</span>
          </span>
        </div>
      </div>
      {showTagline && (
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Understand your money. Improve your future.
        </p>
      )}
    </div>
  )
}
