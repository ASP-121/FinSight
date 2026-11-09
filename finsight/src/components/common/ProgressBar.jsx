import React from 'react'
import { formatINR } from '../../utils/formatters'

export default function ProgressBar({
  value,
  max,
  color = '#6366f1',
  height = 'h-2',
  showLabel = false,
  label,
  sublabel,
  className = '',
}) {
  const percentage = max > 0 ? (value / max) * 100 : 0
  const isExceeded = percentage > 100
  const visualPercentage = Math.min(percentage, 100)

  // Exceeded gets warning/danger color
  const barColor = isExceeded ? '#ef4444' : color

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
          <span className="text-slate-700 font-semibold">{label}</span>
          <span className="text-slate-500">
            {sublabel || `${formatINR(value)} / ${formatINR(max)}`}
          </span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${visualPercentage}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
      {isExceeded && (
        <div className="mt-1 flex items-center justify-between text-[11px] font-semibold text-rose-600">
          <span>Over budget</span>
          <span>+{formatINR(value - max)}</span>
        </div>
      )}
    </div>
  )
}
