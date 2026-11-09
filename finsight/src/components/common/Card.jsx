import React from 'react'

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'default',
  ...props
}) {
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs ${
        hover ? 'transition-all duration-200 hover:shadow-md hover:border-slate-300' : ''
      } ${paddings[padding] || paddings.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
