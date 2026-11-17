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
  PanelLeftClose,
  PanelLeftOpen,
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

export default function Sidebar({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

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
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-slate-200/80 flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20 w-72' : 'w-72'}`}
      >
        {/* Top Header: Logo + Collapse / Close buttons */}
        <div
          className={`h-18 flex items-center border-b border-slate-100 transition-all duration-300 ${
            isCollapsed
              ? 'lg:px-2 px-6 lg:justify-center justify-between'
              : 'px-5 justify-between'
          }`}
        >
          {/* Logo */}
          <div className="flex items-center">
            {isCollapsed ? (
              <>
                <div className="hidden lg:flex items-center justify-center">
                  <Logo iconOnly size="default" />
                </div>
                <div className="lg:hidden">
                  <Logo size="default" />
                </div>
              </>
            ) : (
              <Logo size="default" />
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop Collapse / Expand Toggle */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Drawer Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 space-y-6">
          <div>
            {/* Menu Header (Hidden in collapsed mode on desktop) */}
            <p
              className={`px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 transition-opacity duration-200 ${
                isCollapsed ? 'lg:hidden' : 'block'
              }`}
            >
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
                    className={({ isActive }) =>
                      `relative group flex items-center rounded-xl font-medium text-sm transition-all duration-150 ${
                        isCollapsed
                          ? 'lg:justify-center lg:p-2.5 px-3.5 py-2.5 justify-between'
                          : 'px-3.5 py-2.5 justify-between'
                      } ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={`flex items-center ${
                            isCollapsed ? 'lg:gap-0 gap-3' : 'gap-3'
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 shrink-0 ${
                              isActive
                                ? 'text-white'
                                : 'text-slate-400 group-hover:text-slate-600'
                            }`}
                          />
                          <span
                            className={`truncate ${
                              isCollapsed ? 'lg:hidden inline' : 'inline'
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>

                        {/* Badge for Expanded mode */}
                        {item.badge && (
                          <span
                            className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md ${
                              isCollapsed ? 'lg:hidden' : ''
                            } ${
                              isActive
                                ? 'bg-indigo-500 text-white'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}

                        {/* Floating Tooltip in Collapsed Desktop Mode */}
                        {isCollapsed && (
                          <div className="hidden lg:flex items-center gap-1.5 absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-50 whitespace-nowrap">
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className="text-[10px] bg-purple-500 text-white px-1.5 py-0.2 rounded font-bold uppercase">
                                {item.badge}
                              </span>
                            )}
                            {/* Little triangle pointing left */}
                            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </nav>
          </div>

          <div>
            {/* Support Header */}
            <p
              className={`px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 transition-opacity duration-200 ${
                isCollapsed ? 'lg:hidden' : 'block'
              }`}
            >
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
                    className={({ isActive }) =>
                      `relative group flex items-center rounded-xl font-medium text-sm transition-all duration-150 ${
                        isCollapsed
                          ? 'lg:justify-center lg:p-2.5 px-3.5 py-2.5 justify-between'
                          : 'px-3.5 py-2.5 justify-between'
                      } ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={`flex items-center ${
                            isCollapsed ? 'lg:gap-0 gap-3' : 'gap-3'
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 shrink-0 ${
                              isActive
                                ? 'text-white'
                                : 'text-slate-400 group-hover:text-slate-600'
                            }`}
                          />
                          <span
                            className={`truncate ${
                              isCollapsed ? 'lg:hidden inline' : 'inline'
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>

                        {/* Tooltip in Collapsed Desktop Mode */}
                        {isCollapsed && (
                          <div className="hidden lg:flex items-center gap-1.5 absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-50 whitespace-nowrap">
                            <span>{item.label}</span>
                            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Bottom User Profile Section & Logout */}
        <div
          className={`p-3 border-t border-slate-100 bg-slate-50/50 transition-all duration-300 ${
            isCollapsed ? 'lg:p-2' : 'p-4'
          }`}
        >
          {isCollapsed ? (
            <>
              {/* Collapsed desktop user button */}
              <div className="hidden lg:flex flex-col items-center gap-2">
                <NavLink
                  to="/profile"
                  onClick={() => onClose && onClose()}
                  className="relative group p-2 rounded-xl hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-200/60 transition-all text-slate-600 hover:text-indigo-600"
                  title="View Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-50 whitespace-nowrap">
                    <span>{user?.name || 'Profile'}</span>
                    <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                  </div>
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="relative group p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-50 whitespace-nowrap">
                    <span>Sign out</span>
                    <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                  </div>
                </button>
              </div>

              {/* Mobile expanded version even when desktop is collapsed */}
              <div className="lg:hidden">
                <NavLink
                  to="/profile"
                  onClick={() => onClose && onClose()}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-200/60 transition-all group"
                >
                  <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {user?.name || 'User Profile'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user?.email || 'Personal Account'}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="mt-2 w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Full Expanded user details */}
              <NavLink
                to="/profile"
                onClick={() => onClose && onClose()}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-200/60 transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {user?.name || 'User Profile'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email || 'Personal Account'}
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
            </>
          )}
        </div>
      </aside>
    </>
  )
}
