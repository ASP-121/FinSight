import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'
import Button from '../components/common/Button'
import Logo from '../components/common/Logo'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 text-center">
      <div className="mb-6">
        <Logo size="large" />
      </div>

      <div className="p-4 rounded-3xl bg-indigo-50 text-indigo-600 mb-6">
        <Compass className="w-12 h-12" />
      </div>

      <h1 className="text-4xl font-black text-slate-900 tracking-tight">404</h1>
      <h2 className="mt-2 text-xl font-bold text-slate-800">Page Not Found</h2>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        The financial view or resource you are looking for does not exist or has been moved.
      </p>

      <div className="mt-6">
        <Link to="/dashboard">
          <Button icon={ArrowLeft}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
