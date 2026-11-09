# FinSight — Personal Finance Management UI

> **"Understand your money. Improve your future."**

FinSight is a production-quality, full-stack-ready frontend for personal financial management. Built with React 19, Vite, Tailwind CSS v4, Recharts, and Lucide React, it provides comprehensive tracking of income, expenses, budgets, savings goals, AI spending insights, and future forecasts using Indian standard numbering (₹ INR).

---

## 1. Project Architecture & Folder Structure

```text
finsight/
├── .env                         # API base URL & mock service toggle
├── .env.example                 # Environment configuration template
├── package.json
├── vite.config.js               # Vite config with Tailwind & path aliases
├── index.html                   # Fonts, branding, viewport setup
├── src/
│   ├── assets/                  # Static assets & brand marks
│   ├── components/
│   │   ├── common/              # Reusable UI primitives (Button, Card, Badge, Modal, etc.)
│   │   │   ├── Avatar.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── StatCard.jsx
│   │   ├── layout/              # App Shell (Sidebar, Header)
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── dashboard/           # Dashboard specific modules
│   │   │   ├── BudgetOverviewSection.jsx
│   │   │   ├── CategorySpendingCard.jsx
│   │   │   ├── DashboardInsightsCard.jsx
│   │   │   ├── PredictionCard.jsx
│   │   │   └── SpendingOverviewCard.jsx
│   │   ├── transactions/        # Transaction Table, Cards, and AI modal
│   │   │   ├── TransactionModal.jsx
│   │   │   └── TransactionTable.jsx
│   │   ├── budgets/             # Budget Cards and Modals
│   │   │   ├── BudgetCard.jsx
│   │   │   └── BudgetModal.jsx
│   │   ├── goals/               # Savings Goal Cards and Modals
│   │   │   ├── ContributeModal.jsx
│   │   │   ├── GoalCard.jsx
│   │   │   └── GoalModal.jsx
│   │   ├── insights/            # AI Health Score & Explanations
│   │   │   └── InsightCard.jsx
│   │   └── assistant/           # Conversational AI Assistant
│   ├── context/
│   │   └── AuthContext.jsx      # Authentication session & user state
│   ├── data/                    # Centralized mock datasets
│   │   ├── mockAlerts.js
│   │   ├── mockAnalytics.js
│   │   ├── mockBudgets.js
│   │   ├── mockGoals.js
│   │   ├── mockInsights.js
│   │   ├── mockPredictions.js
│   │   ├── mockTransactions.js
│   │   └── mockUser.js
│   ├── layouts/
│   │   └── AppLayout.jsx        # Master SaaS layout with responsive drawer
│   ├── pages/                   # Top-level route pages
│   │   ├── AnalyticsPage.jsx
│   │   ├── AssistantPage.jsx
│   │   ├── BudgetsPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── GoalsPage.jsx
│   │   ├── HelpPage.jsx
│   │   ├── InsightsPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── SignupPage.jsx
│   │   └── TransactionsPage.jsx
│   ├── services/                # Isolated API contract & service layer
│   │   ├── aiService.js
│   │   ├── alertService.js
│   │   ├── analyticsService.js
│   │   ├── authService.js
│   │   ├── budgetService.js
│   │   ├── dashboardService.js
│   │   ├── goalService.js
│   │   └── transactionService.js
│   ├── utils/                   # Formatting & API Client
│   │   ├── apiClient.js
│   │   └── formatters.js
│   ├── App.jsx                  # React Router definitions
│   ├── index.css                # Tailwind directives & base styles
│   └── main.jsx                 # Entry point
```

---

## 2. Routes Created

| Route | Page | Description |
|---|---|---|
| `/login` | `LoginPage` | Authentication with email, password, show/hide, remember me |
| `/signup` | `SignupPage` | Registration with monthly income and savings target |
| `/dashboard` | `DashboardPage` | Overview with 4 KPI stat cards, charts, budgets, AI insights, predictions |
| `/transactions` | `TransactionsPage` | Management page with filters, search, sorting, pagination, and modals |
| `/analytics` | `AnalyticsPage` | In-depth trend charts, category distributions, needs vs wants, and patterns |
| `/budgets` | `BudgetsPage` | Category limits, spent vs remaining progress bars, over-budget warnings |
| `/goals` | `GoalsPage` | Savings goals (Laptop, Emergency Fund, Vacation, Bike) & quick deposits |
| `/insights` | `InsightsPage` | Financial Health Score (78/100), breakdown, and expandable explanations |
| `/assistant` | `AssistantPage` | FinSight AI conversational chat with prompt chips and responses |
| `/settings` | `SettingsPage` | User profile, security credentials, preferences, and notifications |
| `/profile` | `ProfilePage` | Identity summary, member tier, and financial baseline snapshot |
| `/help` | `HelpPage` | FAQs, workflow walkthroughs, mock architecture guide, support form |
| `*` | `NotFoundPage` | Clean 404 page with return to dashboard navigation |

---

## 3. Main Reusable Components

- **`Logo`**: Original FinSight icon treatment with sparkle ping indicator.
- **`StatCard`**: Financial KPI metric card with percentage delta, indicator icons, and accessible badges.
- **`ProgressBar`**: Dynamic progress bar with automatic "Over budget" state detection and amount overage.
- **`TransactionModal`**: Add / edit transaction modal with simulated **real-time AI categorization** (`Swiggy` -> Food 96%) and manual category overrides.
- **`TransactionTable`**: Desktop data table transforming to responsive mobile cards on small screens.
- **`BudgetCard` & `BudgetModal`**: Category cards with progress bars and monthly limit modifications.
- **`GoalCard`, `GoalModal` & `ContributeModal`**: Milestone trackers with contribution deposit modal.
- **`InsightCard`**: AI insight card with Good, Warning, Attention, and Opportunity badges and expandable *"Why am I seeing this?"* drawers.
- **`PredictionCard`**: Future next-month spending projection chart with confidence intervals.
- **`ConfirmDialog`**: Destructive confirmation modal for deletes.
- **`LoadingSkeleton`**: Tailored skeleton loaders for cards, tables, and charts.
- **`EmptyState` & `ErrorState`**: User-friendly fallback states with retry and creation triggers.

---

## 4. Mock Service Layer (`src/services/`)

All services return Promise-based responses with simulated network latencies:

- **`authService.js`**: `login()`, `register()`, `getCurrentUser()`, `updateUserProfile()`, `logout()`
- **`dashboardService.js`**: `getDashboardData()`
- **`transactionService.js`**: `getTransactions()`, `getTransactionById()`, `createTransaction()`, `updateTransaction()`, `deleteTransaction()`
- **`budgetService.js`**: `getBudgets()`, `createBudget()`, `updateBudget()`, `deleteBudget()`
- **`goalService.js`**: `getGoals()`, `createGoal()`, `updateGoal()`, `deleteGoal()`, `contributeToGoal()`
- **`analyticsService.js`**: `getAnalytics()`
- **`aiService.js`**: `getAIInsights()`, `getPredictions()`, `categorizeTransaction()`, `sendAIMessage()`
- **`alertService.js`**: `getAlerts()`, `markAlertAsRead()`, `markAllAlertsAsRead()`, `dismissAlert()`

---

## 5. Future Spring Boot Backend Integration

When the Spring Boot backend is ready:

1. Update `.env`:
   ```bash
   VITE_API_BASE_URL=http://localhost:8080
   VITE_USE_MOCK_SERVICES=false
   ```
2. The UI components will **NOT require any modifications**.
   Each service function in `src/services/` already has the corresponding REST endpoint wired via `src/utils/apiClient.js`:
   - `POST /api/auth/login` & `POST /api/auth/register`
   - `GET /api/dashboard`
   - `GET|POST|PUT|DELETE /api/transactions`
   - `GET /api/analytics`
   - `GET|POST|PUT|DELETE /api/budgets`
   - `GET|POST|PUT|DELETE /api/goals`
   - `GET /api/ai/insights`
   - `GET /api/ai/predictions`
   - `POST /api/ai/chat`
   - `POST /api/ai/categorize`
   - `GET /api/alerts`

---

## 6. Installed Dependencies

- `react` (`^19.2.8`) & `react-dom`
- `react-router-dom` (`^7.18.4`)
- `lucide-react` (`^1.53.0`)
- `recharts` (`^3.10.1`)
- `tailwindcss` (`^4.3.3`) & `@tailwindcss/vite`

---

## 7. How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build
```
The application will be accessible at: `http://localhost:5173/`
