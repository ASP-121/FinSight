import React, { useState } from 'react'
import {
  User,
  Shield,
  Sliders,
  Bell,
  Palette,
  Check,
  Save,
  Lock,
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useAuth } from '../context/AuthContext'

export default function SettingsPage() {
  const { user, updateProfile } = useAuth()

  const [activeTab, setActiveTab] = useState('profile')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name ,
    email: user?.email ,
    monthlyIncome: user?.monthlyIncome,
    monthlySavingsTarget: user?.monthlySavingsTarget,
  })

  // Security Form state
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Preferences Form state
  const [preferences, setPreferences] = useState({
    currency: 'INR (₹)',
    defaultCategory: 'Food',
    budgetAlerts: true,
    unusualSpendingAlerts: true,
    aiWeeklyDigest: true,
    goalMilestoneAlerts: true,
    theme: 'light',
  })

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateProfile(profileForm)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleSecuritySubmit = (e) => {
    e.preventDefault()
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert('New passwords do not match')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 400)
  }

  const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Financial Preferences', icon: Sliders },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ]

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Account Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your personal details, security parameters, and notification alerts
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Preferences updated successfully. Ready for backend persistence.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Settings Navigation Sidebar */}
        <div className="md:col-span-4 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-8">
          <Card hover>
            {/* 1. Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-base text-slate-900">Personal Profile</h3>
                  <p className="text-xs text-slate-500">Update your account name and baseline financial parameters</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Monthly Income (₹)
                      </label>
                      <input
                        type="number"
                        value={profileForm.monthlyIncome}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            monthlyIncome: Number(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Savings Goal (₹)
                      </label>
                      <input
                        type="number"
                        value={profileForm.monthlySavingsTarget}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            monthlySavingsTarget: Number(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <Button type="submit" loading={loading} icon={Save}>
                    Save Changes
                  </Button>
                </div>
              </form>
            )}

            {/* 2. Security Tab */}
            {activeTab === 'security' && (
              <form onSubmit={handleSecuritySubmit} className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-base text-slate-900">Security Credentials</h3>
                  <p className="text-xs text-slate-500">Change your password and manage login credentials</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={securityForm.currentPassword}
                      onChange={(e) =>
                        setSecurityForm({ ...securityForm, currentPassword: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={securityForm.newPassword}
                      onChange={(e) =>
                        setSecurityForm({ ...securityForm, newPassword: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={securityForm.confirmPassword}
                      onChange={(e) =>
                        setSecurityForm({ ...securityForm, confirmPassword: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <Button type="submit" loading={loading} icon={Lock}>
                    Update Password
                  </Button>
                </div>
              </form>
            )}

            {/* 3. Financial Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-base text-slate-900">Financial Preferences</h3>
                  <p className="text-xs text-slate-500">Configure default formats and categorization behavior</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Base Currency
                    </label>
                    <select
                      value={preferences.currency}
                      onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                      <option value="USD ($)">USD ($) - US Dollar</option>
                      <option value="EUR (€)">EUR (€) - Euro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Default Transaction Category
                    </label>
                    <select
                      value={preferences.defaultCategory}
                      onChange={(e) =>
                        setPreferences({ ...preferences, defaultCategory: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="Food">Food & Dining</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Transport">Transport</option>
                      <option value="Bills">Bills & Utilities</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <Button
                    onClick={() => {
                      setSaveSuccess(true)
                      setTimeout(() => setSaveSuccess(false), 2500)
                    }}
                    icon={Save}
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}

            {/* 4. Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-base text-slate-900">Notification Settings</h3>
                  <p className="text-xs text-slate-500">Configure proactive notifications and anomaly alerts</p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'budgetAlerts',
                      title: 'Budget Threshold Alerts',
                      desc: 'Notify when categories hit 80% and 100% of their monthly limit',
                    },
                    {
                      id: 'unusualSpendingAlerts',
                      title: 'Unusual Transaction Alerts',
                      desc: 'Flag spending spikes and abnormal merchant charges',
                    },
                    {
                      id: 'aiWeeklyDigest',
                      title: 'AI Weekly Financial Digest',
                      desc: 'Receive AI-synthesized insights on spending trends every Sunday',
                    },
                    {
                      id: 'goalMilestoneAlerts',
                      title: 'Savings Goal Reminders',
                      desc: 'Celebrate milestones and receive monthly deposit reminders',
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">{item.title}</p>
                        <p className="text-[11px] text-slate-500">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences[item.id]}
                        onChange={(e) =>
                          setPreferences({ ...preferences, [item.id]: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <Button
                    onClick={() => {
                      setSaveSuccess(true)
                      setTimeout(() => setSaveSuccess(false), 2500)
                    }}
                    icon={Save}
                  >
                    Save Notifications
                  </Button>
                </div>
              </div>
            )}

            {/* 5. Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-base text-slate-900">Appearance & Theme</h3>
                  <p className="text-xs text-slate-500">Customize the visual theme of the FinSight dashboard</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {['Light (Default)', 'Dark (Upcoming)', 'System'].map((mode, idx) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPreferences({ ...preferences, theme: mode })}
                      className={`p-4 rounded-xl border text-xs font-bold text-center transition-all ${
                        idx === 0
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-2 ring-indigo-600/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <Button
                    onClick={() => {
                      setSaveSuccess(true)
                      setTimeout(() => setSaveSuccess(false), 2500)
                    }}
                    icon={Save}
                  >
                    Apply Theme
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
