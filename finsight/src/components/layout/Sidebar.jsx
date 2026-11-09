import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ReceiptText,
  BarChart3,
  PieChart,
  Target,
  Sparkles,
  BotMessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  X,
  User,
  ChevronRight,
} from 'lucide-react'
import Logo from '../common/Logo'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Transactions', path: '/transactions', icon: ReceiptText },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Budgets', path: '/budgets', icon: PieChart },
  { label: 'Goals', path: '/goals', icon: Target },
  { label: 'AI Insights', path: '/insights', icon: Sparkles, badge: 'New' },
  { label: 'AI Assistant', path: '/assistant', icon: BotMessageSquare },
]

const BOTTOM_ITEMS = [
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Help & Docs', path: '/help', icon: HelpCircle },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group ${
      isActive
        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }`

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo and Mobile Close */}
        <div className="h-18 px-6 flex items-center justify-between border-b border-slate-100">
          <Logo size="default" />
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          <div>
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Menu
            </p>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => onClose && onClose()}
                    className={linkClass}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-5 h-5 ${
                              isActive
                                ? 'text-white'
                                : 'text-slate-400 group-hover:text-slate-600'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md ${
                              isActive
                                ? 'bg-indigo-500 text-white'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </nav>
          </div>

          <div>
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Support & System
            </p>
            <nav className="space-y-1">
              {BOTTOM_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => onClose && onClose()}
                    className={linkClass}
                  >
                    {({ isActive }) => (
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-5 h-5 ${
                            isActive
                              ? 'text-white'
                              : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                    )}
                  </NavLink>
                )
              })}
            </nav>
          </div>
        </div>

        {/* User Profile Card & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <NavLink
            to="/profile"
            onClick={() => onClose && onClose()}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-200/60 transition-all group"
          >
           <div
  className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200
             flex items-center justify-center text-slate-500"
  aria-label="No profile picture"
>
  <User className="w-10 h-10" />
</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.accountTier}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-x-0.5" />
          </NavLink>

          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
