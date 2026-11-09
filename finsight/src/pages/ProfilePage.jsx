import React from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Calendar, ShieldCheck, Wallet, Target, Sparkles, Settings } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useAuth } from '../context/AuthContext'
import { formatINR } from '../utils/formatters'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          User Profile
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your personal FinSight identity and financial baseline
        </p>
      </div>

      {/* Main Profile Card */}
      <Card hover>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
          <div
             className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200
             flex items-center justify-center text-slate-500"
             aria-label="No profile picture">
  <User className="w-10 h-10" />
</div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
              <span className="inline-flex self-center sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {user?.accountTier}
              </span>
            </div>

            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user?.email}</span>
            </p>

            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Member since {user?.memberSince || 2024}</span>
            </p>
          </div>

          <Link to="/settings">
            <Button variant="secondary" size="sm" icon={Settings}>
              Edit Profile
            </Button>
          </Link>
        </div>

        {/* Financial Snapshot */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Monthly Inflow
            </span>
            <p className="text-xl font-extrabold text-slate-900">
              {formatINR(user?.monthlyIncome)}
            </p>
            <p className="text-[11px] text-slate-500">Baseline salary deposit</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Savings Target
            </span>
            <p className="text-xl font-extrabold text-emerald-600">
              {formatINR(user?.monthlySavingsTarget)}
            </p>
            <p className="text-[11px] text-slate-500"></p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Currency Standard
            </span>
            <p className="text-xl font-extrabold text-slate-900">
              {user?.currency || 'INR'} (₹)
            </p>
            <p className="text-[11px] text-slate-500">Indian Numbering System</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
