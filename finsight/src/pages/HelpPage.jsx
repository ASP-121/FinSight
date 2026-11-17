import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  BookOpen,
  ArrowLeftRight,
  BarChart3,
  PieChart,
  Target,
  Sparkles,
  Bot,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  X,
} from 'lucide-react'
import Card from '../components/common/Card'

const DOC_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpen,
    description: 'Learn the fundamentals of FinSight, account creation, and dashboard navigation.',
    link: '/dashboard',
    linkLabel: 'Go to Dashboard',
    articles: [
      {
        title: 'Introduction to FinSight',
        paragraphs: [
          'FinSight is an AI-powered personal finance management platform designed to help you track expenses, optimize budgets, reach financial milestones, and gain deep intelligence into your spending patterns.',
          'Built with modern full-stack architecture—Spring Boot 4, Spring AI, MongoDB Atlas, and React with Tailwind CSS—it provides institutional-grade data privacy alongside intelligent real-time financial analytics.',
        ],
      },
      {
        title: 'Creating an Account & Authentication',
        paragraphs: [
          'To start tracking your finances, create a new account by providing your full name, email address, and a secure password.',
          'FinSight secures your identity using cryptographic JSON Web Tokens (JWT). All authenticated requests pass this token in the Authorization header, ensuring that your financial records remain completely private and isolated.',
        ],
      },
      {
        title: 'Understanding the Dashboard',
        paragraphs: [
          'The Dashboard is your primary financial control center. It aggregates key metrics in real time:',
          '• Total Balance & Net Flow: Computed dynamically from your total income minus total expenditures.',
          '• Monthly Cash Flow: Visual comparison of monthly earnings versus spending.',
          '• Spending Breakdown: High-level category allocation displaying where your funds are allocated.',
          '• Recent Activity: Chronological ledger of your most recent transactions with status indicators.',
          '• Quick Actions: Instant access to log income or expenses, adjust budgets, or consult the AI Assistant.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I access FinSight from mobile devices?',
        a: 'Yes, FinSight is built with a responsive design and an adaptable collapsible sidebar that converts to a clean mobile drawer on small screens.',
      },
      {
        q: 'Is my financial data shared with third parties?',
        a: 'No. All financial records are stored securely in your isolated MongoDB Atlas database. AI processing only transmits sanitized query context without exposing personal credentials.',
      },
    ],
  },
  {
    id: 'transactions',
    title: 'Transactions',
    icon: ArrowLeftRight,
    description: 'Track income and expenses, leverage automated AI categorization, and manage records.',
    link: '/transactions',
    linkLabel: 'Manage Transactions',
    articles: [
      {
        title: 'Adding Income & Expenses',
        paragraphs: [
          'You can record a new transaction from anywhere in the application by clicking the "Add Transaction" button in the top navigation or on the Transactions page.',
          'Toggle between Expense or Income, enter the amount in Indian Rupees (₹), specify a descriptive label (such as "Swiggy dinner" or "Uber commute"), and select the transaction date. You can also attach optional notes or payment modes.',
        ],
      },
      {
        title: 'Automatic AI Transaction Categorization',
        paragraphs: [
          'FinSight utilizes a two-tier categorization system to automate record keeping:',
          '• Tier 1 (Deterministic Rules): Instant keyword recognition for hundreds of common merchants (Swiggy, Zomato, Uber, Blinkit, Amazon, Netflix, Bescom, Apollo, etc.). This executes instantly with zero latency.',
          '• Tier 2 (Spring AI + Groq): For unfamiliar, complex, or ambiguous transaction descriptions, FinSight invokes a high-speed LLM classifier via Spring AI to categorize the entry into one of the supported categories with an associated confidence score.',
          '• User Override: You always maintain full authority over categorization. If you manually select a category from the dropdown, FinSight prioritizes your choice and will not overwrite it.',
        ],
      },
      {
        title: 'Editing & Deleting Transactions',
        paragraphs: [
          'To update an existing record, click the Edit icon on any row in the transaction table. Modify any field and click Save Changes.',
          'To remove an inaccurate or accidental entry, click the Delete icon. FinSight will recalculate your balances, category totals, and budget utilization immediately.',
        ],
      },
      {
        title: 'Supported Transaction Categories',
        paragraphs: [
          'FinSight categorizes expenses into 11 canonical classifications: Food, Groceries, Transport, Shopping, Bills, Entertainment, Healthcare, Education, Salary, Freelance, and Other.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What happens if the AI suggests the wrong category?',
        a: 'Simply select the intended category from the dropdown menu or click Apply on an alternative. Your manual selection is always respected.',
      },
      {
        q: 'Can I filter transactions by date or category?',
        a: 'Yes, the Transactions page provides real-time search, category filtering, and type toggles (Income vs Expense) to quickly find historical records.',
      },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: BarChart3,
    description: 'Deep dive into spending breakdowns, category distribution, and multi-month trends.',
    link: '/analytics',
    linkLabel: 'View Analytics',
    articles: [
      {
        title: 'Understanding Spending Breakdowns',
        paragraphs: [
          'The Analytics page provides comprehensive graphical breakdowns of your expenditures:',
          '• Category Allocation: Interactive charts show the percentage of total outflows consumed by each category.',
          '• Primary Cost Drivers: Quickly identify the top 3 categories that account for the bulk of your monthly budget.',
          '• Average Spending Velocity: Monitor your burn rate per day and week to ensure predictable month-end balances.',
        ],
      },
      {
        title: 'Monthly Comparisons & Cash Flow Trends',
        paragraphs: [
          'Analyze your financial trajectory across consecutive months to assess lifestyle inflation, seasonal variations, and long-term savings stability.',
          'Compare cumulative monthly income against cumulative expenses to monitor your Net Savings Rate—the percentage of gross income retained after all obligations.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How frequently are analytics recalculated?',
        a: 'Analytics metrics update immediately whenever transactions are added, edited, or removed from your account.',
      },
    ],
  },
  {
    id: 'budgets',
    title: 'Budgets',
    icon: PieChart,
    description: 'Establish category spending caps, monitor utilization bars, and prevent overspending.',
    link: '/budgets',
    linkLabel: 'Open Budgets',
    articles: [
      {
        title: 'Creating Monthly Budgets',
        paragraphs: [
          'Budgets establish intentional financial guardrails. On the Budgets page, you can define maximum monthly allowances for specific categories such as Food, Entertainment, or Shopping.',
          'Enter your planned monthly spending limit in ₹. FinSight automatically aggregates all expenses logged in that category during the active month to track compliance.',
        ],
      },
      {
        title: 'Understanding Budget Utilization & Overspending Alerts',
        paragraphs: [
          'Each budget features an intuitive progress indicator and status tags:',
          '• Safe (0% – 79%): Visualized with green accents, indicating on-track spending pacing.',
          '• Warning (80% – 99%): Visualized with amber accents, alerting you that you are approaching your allocated ceiling.',
          '• Over Budget (100%+): Visualized with rose accents and an "Over Budget" badge. FinSight highlights these breaches in your alerts feed so you can curtail discretionary spending.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do budgets reset automatically each month?',
        a: 'Yes. Budgets correspond to the active calendar month and calculate real-time expenditure against the current month’s transaction records.',
      },
    ],
  },
  {
    id: 'goals',
    title: 'Financial Goals',
    icon: Target,
    description: 'Set milestone savings targets, log incremental contributions, and track progress.',
    link: '/goals',
    linkLabel: 'Manage Goals',
    articles: [
      {
        title: 'Creating Savings Goals',
        paragraphs: [
          'FinSight helps you establish and visualize financial milestones—whether you are building an emergency fund, saving for a down payment, or purchasing equipment.',
          'Define a goal title, a target amount in ₹, and an optional target completion date. FinSight computes the percentage achieved and estimates the monthly contribution required to hit your deadline.',
        ],
      },
      {
        title: 'Updating Goal Contributions',
        paragraphs: [
          'As you allocate funds toward a goal, click "Add Funds" on the goal card and enter the contribution amount. Your progress bar updates immediately.',
          'Once a goal reaches 100%, it is marked as completed and stored in your historical achievements.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I edit a goal after setting it?',
        a: 'Yes, you can edit the target amount, milestone date, or goal name at any time from the Financial Goals dashboard.',
      },
    ],
  },
  {
    id: 'ai-insights',
    title: 'AI Insights',
    icon: Sparkles,
    description: 'Explore automated financial health metrics, anomaly detection, and smart advice.',
    link: '/insights',
    linkLabel: 'View AI Insights',
    articles: [
      {
        title: 'Understanding AI Financial Insights',
        paragraphs: [
          'The AI Insights engine evaluates your transaction patterns to generate automated observations:',
          '• Unusual Spending Spikes: Detects when spending in a particular category significantly deviates from your rolling average.',
          '• Subscription Tracking: Recognizes recurring payments and calculates their cumulative annual impact.',
          '• Actionable Savings Advice: Delivers specific recommendations to reduce discretionary leaks without compromising your lifestyle.',
        ],
      },
      {
        title: 'Financial Health Score',
        paragraphs: [
          'FinSight calculates a dynamic Financial Health Score ranging from 0 to 100 based on multiple weighted variables:',
          '• Savings Ratio: Percentage of earnings preserved each billing cycle.',
          '• Budget Adherence: Proportion of categories maintained within specified caps.',
          '• Spending Volatility: Consistency of day-to-day expenditures.',
          'Scores are categorized into Excellent (80+), Good (60–79), Fair (40–59), and Needs Attention (<40).',
        ],
      },
    ],
    faqs: [
      {
        q: 'How does anomaly detection notify me?',
        a: 'High-severity spending anomalies automatically generate notification items in the Alerts drawer and highlight relevant categories on your dashboard.',
      },
    ],
  },
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    icon: Bot,
    description: 'Converse with your dedicated personal financial advisor powered by Groq and Spring AI.',
    link: '/assistant',
    linkLabel: 'Chat with AI Assistant',
    articles: [
      {
        title: 'Asking Questions About Your Personal Finances',
        paragraphs: [
          'The AI Assistant is an interactive financial consultant ready to answer questions about your data:',
          '• "How much did I spend on dining and groceries this month?"',
          '• "Which budget category am I closest to exceeding?"',
          '• "How can I save an extra ₹10,000 before next month?"',
          '• "What is my largest expense category over the last 90 days?"',
        ],
      },
      {
        title: 'Contextual Conversations & Memory',
        paragraphs: [
          'The assistant maintains conversation history across multi-turn chats. You can ask natural follow-ups such as "Why was that category so high?" or "Break that down into weekly totals."',
        ],
      },
      {
        title: 'Privacy & Financial Data Security',
        paragraphs: [
          'FinSight communicates with Groq through secure, encrypted backend APIs. Only summarized financial context necessary to answer your inquiry is provided. Account passwords and sensitive identifiers are never passed to external AI services.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can the assistant execute transactions on my behalf?',
        a: 'No. The assistant operates strictly in an analytical advisory role. It provides insights and recommendations, but all transaction and budget actions require your explicit confirmation.',
      },
    ],
  },
  {
    id: 'predictions',
    title: 'Predictions',
    icon: TrendingUp,
    description: 'Examine machine-learning forecasts, seasonal spending projections, and model boundaries.',
    link: '/analytics',
    linkLabel: 'Explore Predictions',
    articles: [
      {
        title: 'Understanding Expense Predictions',
        paragraphs: [
          'FinSight applies predictive models to your historical transaction patterns to estimate future spending:',
          '• Moving Averages & Trend Projections: Projects your estimated end-of-month expenditure based on current burn rate.',
          '• Category-Specific Forecasts: Identifies categories where spending is projected to grow or contract.',
          '• Runway Analysis: Estimates how many months your available reserves can sustain current expense levels.',
        ],
      },
      {
        title: 'How Historical Spending Influences Forecasts',
        paragraphs: [
          'Predictive accuracy improves with more transaction data:',
          '• A minimum of 30 days of records establishes an initial baseline.',
          '• 90+ days of history enables reliable seasonality detection and recurring payment modeling.',
          '• Statistical outlier smoothing filters one-off large purchases to prevent skewed forward estimates.',
        ],
      },
      {
        title: 'Limitations of Predictions',
        paragraphs: [
          'Predictions are statistical estimates based on historical patterns. Unplanned emergencies, major life events, or sudden lifestyle adjustments will alter actual outcomes. Use predictions as strategic guidelines rather than guarantees.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Why do predictions fluctuate early in the month?',
        a: 'Early in the month, fewer data points exist, leading to wider variance in extrapolation. Forecasts stabilize and increase in accuracy as more days pass.',
      },
    ],
  },
  {
    id: 'account-security',
    title: 'Account & Security',
    icon: ShieldCheck,
    description: 'Manage profile details, configure password credentials, and review security standards.',
    link: '/settings',
    linkLabel: 'Go to Settings',
    articles: [
      {
        title: 'Updating Profile Information',
        paragraphs: [
          'You can view and update your personal information in Settings -> Profile:',
          '1. Update your Full Name or Email Address.',
          '2. Click "Save Changes" to save updates directly to the backend database.',
          '3. Click "Cancel" if you wish to discard uncommitted changes.',
        ],
      },
      {
        title: 'Changing Your Password',
        paragraphs: [
          'Maintain robust account security with regular password refreshes in Settings -> Security:',
          '1. Enter your Current Password.',
          '2. Enter a New Password meeting security standards (minimum 6 characters).',
          '3. Re-enter the new password in Confirm New Password.',
          '4. Click "Update Password". The backend verifies your existing credentials, hashes the new password with BCrypt, and updates your account.',
        ],
      },
      {
        title: 'Understanding Account Security Architecture',
        paragraphs: [
          'FinSight utilizes enterprise security practices to safeguard your data:',
          '• Cryptographic BCrypt Hashing: Passwords are protected using salted, one-way adaptive hashing.',
          '• Stateless JWT Sessions: Authentication tokens are securely verified per request and expire automatically.',
          '• Principal-Based Authorization: All backend controllers identify users strictly through the authenticated Spring Security principal, preventing cross-user data exposure.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Are passwords stored in plaintext anywhere in the system?',
        a: 'No. Passwords are never stored in plaintext and never stored in localStorage or client cookies.',
      },
      {
        q: 'What should I do if I forget my password?',
        a: 'Because passwords are protected using one-way cryptographic hashing, they cannot be retrieved in plaintext. Reach out to your application administrator to reset your credentials.',
      },
    ],
  },
]

export default function HelpPage() {
  const [activeSectionId, setActiveSectionId] = useState('getting-started')
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaqs, setOpenFaqs] = useState({})

  const toggleFaq = (faqKey) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [faqKey]: !prev[faqKey],
    }))
  }

  // Filter sections and articles based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return DOC_SECTIONS

    const query = searchQuery.toLowerCase().trim()
    return DOC_SECTIONS.filter((section) => {
      const matchTitle = section.title.toLowerCase().includes(query)
      const matchDesc = section.description.toLowerCase().includes(query)
      const matchArticles = section.articles.some(
        (art) =>
          art.title.toLowerCase().includes(query) ||
          art.paragraphs.some((p) => p.toLowerCase().includes(query))
      )
      const matchFaqs = section.faqs.some(
        (faq) => faq.q.toLowerCase().includes(query) || faq.a.toLowerCase().includes(query)
      )
      return matchTitle || matchDesc || matchArticles || matchFaqs
    })
  }, [searchQuery])

  const activeSection = useMemo(() => {
    const found = filteredSections.find((s) => s.id === activeSectionId)
    return found || filteredSections[0] || DOC_SECTIONS[0]
  }, [filteredSections, activeSectionId])

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Header & Search */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            FinSight Documentation & Knowledge Base
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
            Search our comprehensive documentation covering features, automated AI categorization, budgets, analytics, and security.
          </p>

          {/* Search Bar */}
          <div className="relative pt-2">
            <div className="absolute inset-y-0 left-0 pl-3.5 pt-2 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search documentation, topics, FAQs (e.g. 'categorization', 'budget', 'password')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-transparent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 pt-2 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Documentation Container: 2-Column Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar (Desktop: col-span-4, Mobile: col-span-12) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Documentation Topics ({filteredSections.length})
            </div>

            {filteredSections.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No documentation topics match "{searchQuery}"
              </div>
            ) : (
              <div className="space-y-1">
                {filteredSections.map((sec) => {
                  const Icon = sec.icon
                  const isActive = activeSection.id === sec.id
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setActiveSectionId(sec.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-900 font-bold shadow-xs border border-indigo-100'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isActive
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs sm:text-sm">{sec.title}</span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isActive ? 'text-indigo-600 translate-x-0.5' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Quick Stats / Tip Box */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Pro Tip: Quick Navigation
            </div>
            <p className="text-indigo-800/90 leading-relaxed text-[11px]">
              Use the sidebar to jump across topics, or click any direct feature links to test functionality inside FinSight.
            </p>
          </div>
        </div>

        {/* Content Pane (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {activeSection && (
            <>
              {/* Section Header Card */}
              <Card>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700">
                      <activeSection.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {activeSection.title}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {activeSection.description}
                      </p>
                    </div>
                  </div>
                  {activeSection.link && (
                    <Link
                      to={activeSection.link}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-colors shrink-0"
                    >
                      {activeSection.linkLabel}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {/* Articles */}
                <div className="divide-y divide-slate-100 pt-2">
                  {activeSection.articles.map((article, idx) => (
                    <div key={idx} className="py-4 space-y-2">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                        {article.title}
                      </h3>
                      <div className="space-y-1.5 pl-6">
                        {article.paragraphs.map((p, pIdx) => (
                          <p
                            key={pIdx}
                            className={`text-xs text-slate-600 leading-relaxed ${
                              p.startsWith('•') || p.startsWith('1.') || p.startsWith('2.')
                                ? 'font-medium text-slate-700 pl-2'
                                : ''
                            }`}
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* FAQs Card for Active Section */}
              {activeSection.faqs && activeSection.faqs.length > 0 && (
                <Card>
                  <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-indigo-600" />
                        Frequently Asked Questions
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Common questions regarding {activeSection.title.toLowerCase()}
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {activeSection.faqs.map((faq, fIdx) => {
                      const faqKey = `${activeSection.id}-faq-${fIdx}`
                      const isOpen = !!openFaqs[faqKey]
                      return (
                        <div key={fIdx} className="py-3">
                          <button
                            type="button"
                            onClick={() => toggleFaq(faqKey)}
                            className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                          >
                            <span className="text-xs sm:text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors">
                              {faq.q}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="mt-2.5 p-3 rounded-xl bg-slate-50 text-xs text-slate-600 leading-relaxed animate-in fade-in duration-150 border border-slate-100">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
