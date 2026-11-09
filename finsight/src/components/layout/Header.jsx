import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import {
  Menu,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import * as alertService from '../../services/alertService'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transactions',
  '/analytics': 'Analytics & Insights',
  '/budgets': 'Budgets',
  '/goals': 'Savings Goals',
  '/insights': 'AI Insights',
  '/assistant': 'FinSight AI Assistant',
  '/settings': 'Account Settings',
  '/help': 'Help & Documentation',
  '/profile': 'User Profile',
}

export default function Header({ onToggleSidebar }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [alerts, setAlerts] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const notificationRef = useRef(null)
  const profileRef = useRef(null)

  useEffect(() => {
    async function loadAlerts() {
      try {
        const data = await alertService.getAlerts()
        setAlerts(data)
      } catch (err) {
        console.error('Failed to load alerts', err)
      }
    }
    loadAlerts()
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = alerts.filter((a) => !a.read).length
  const currentTitle = PAGE_TITLES[location.pathname] || 'FinSight'

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation()
    const updated = await alertService.markAlertAsRead(id)
    setAlerts(updated)
  }

  const handleMarkAllRead = async () => {
    const updated = await alertService.markAllAlertsAsRead()
    setAlerts(updated)
  }

  const handleNotificationClick = (actionRoute) => {
    setShowNotifications(false)
    if (actionRoute) navigate(actionRoute)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/transactions?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-30 h-18 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all">
      {/* Left: Mobile hamburger & Dynamic page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* Middle & Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions, budgets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-56 lg:w-72 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </form>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-slate-900">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-full">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {alerts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No notifications right now
                  </div>
                ) : (
                  alerts.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item.actionRoute)}
                      className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                        !item.read ? 'bg-indigo-50/30' : ''
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                          item.severity === 'high'
                            ? 'bg-rose-100 text-rose-600'
                            : item.severity === 'medium'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-indigo-100 text-indigo-600'
                        }`}
                      >
                        {item.type === 'anomaly' ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : item.type === 'spike' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      {!item.read && (
                        <button
                          onClick={(e) => handleMarkAsRead(item.id, e)}
                          title="Mark as read"
                          className="shrink-0 p-1 text-slate-300 hover:text-indigo-600"
                        >
                          <span className="block w-2 h-2 rounded-full bg-indigo-600"></span>
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 border-t border-slate-100 text-center bg-slate-50/50">
                <Link
                  to="/insights"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                >
                  View all AI insights & anomalies →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 pr-2 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="User Menu"
          >
            <img
              src={
                user?.avatar
              }
              alt={user?.name || 'Aarya'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {user?.firstName || 'Aarya'}
              </p>
              <p className="text-[10px] text-slate-400">Personal</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 py-1">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.name || 'Aarya Patel'}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>View Profile</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={async () => {
                    setShowProfileMenu(false)
                    await logout()
                    navigate('/login')
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
