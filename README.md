# FinSight — AI-Powered Personal Finance Management Platform

> **"Understand your money. Improve your future."**

FinSight is a production-grade, full-stack personal finance application engineered for an **AI Course-Based Project**. Built using **Java 21**, **Spring Boot 4.x**, **Spring AI**, **Groq (OpenAI-compatible) API**, **MongoDB Atlas**, **React 19**, and **Tailwind CSS**, it empowers users to track income and expenditures, manage budgets, meet milestone savings goals, and harness artificial intelligence for automated transaction categorization, anomaly detection, predictive forecasting, and conversational financial coaching.

---

## 🌟 Key Features

### 1. 🤖 Two-Tier Automated AI Transaction Categorization
- **Tier 1 (Deterministic Keyword Matching):** Instant sub-millisecond keyword matching for hundreds of common merchants (*Swiggy, Zomato, Uber, Blinkit, Amazon, Netflix, Bescom, Apollo, etc.*) with zero token consumption.
- **Tier 2 (Spring AI + Groq Fallback):** For novel, ambiguous, or multi-item descriptions, Spring AI delegates classification to a Groq-hosted LLM with strict JSON schema constraints.
- **In-Memory Caching:** Prevents redundant AI API calls for identical transaction descriptions.
- **User Override Preservation:** Supports user freedom—if a user manually selects a category, the interface preserves their choice without silent overwriting.

### 2. 💬 Conversational AI Financial Assistant
- Multi-turn conversational chat with full context awareness powered by Spring AI and Groq.
- Analyzes personal financial health, explains spending spikes, and provides tailored budgeting strategies.
- Data privacy guaranteed: Credentials and sensitive PII are never passed to external LLM providers.

### 3. 📊 AI Insights & Financial Health Score
- **Dynamic Financial Health Score (0–100):** Weighted multi-variable metric evaluating savings rate, budget adherence, and cash flow volatility.
- **Anomaly Detection:** Flags unusual spending spikes and recurring subscriptions.
- **Predictive Forecasting:** Projects end-of-month outflows and category burn rates using moving-average algorithms.

### 4. 🗂️ Responsive Collapsible Sidebar
- Dual-state desktop sidebar (`w-72` expanded vs. `w-20` collapsed) with smooth CSS transitions.
- Interactive tooltips on navigation icons in collapsed mode.
- Synchronized layout padding (`lg:pl-72` $\leftrightarrow$ `lg:pl-20`) to eliminate horizontal layout shifts.
- Retains independent mobile drawer behavior on small screens.
- Persists user preferences seamlessly via `localStorage`.

### 5. ⚙️ Functional Settings & Profile Management
- **Profile Update:** View and edit full name and email with validation, "Cancel", and "Save Changes" controls.
- **BCrypt Security:** Verify old credentials and securely update passwords using salted, one-way BCrypt hashing.
- **Principal-Based Authorization:** Scoped directly to the authenticated Spring Security Principal (`@AuthenticationPrincipal User user`).
- **Preferences Persistence:** Real-time persistence for default currency (INR ₹), alert notifications, and categorization rules.

### 6. 📖 Searchable Help & Documentation Hub
- 9 full-fledged documentation sections: *Getting Started, Transactions, Analytics, Budgets, Financial Goals, AI Insights, AI Assistant, Predictions, and Account & Security*.
- Real-time search across documentation topics, guides, and FAQs.
- Interactive question accordions and deep internal navigation links to application pages.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router 7, Recharts, Lucide React |
| **Backend** | Java 21, Spring Boot 4.1.1, Spring Security, Spring Data MongoDB, Bean Validation |
| **AI / ML** | Spring AI 2.0.2, Groq API (Llama 3 / OpenAI-compatible), Deterministic Rule Classifier |
| **Database** | MongoDB Atlas (Cloud NoSQL) |
| **Authentication** | Stateless JWT (JSON Web Tokens) with BCrypt password hashing |
| **Localization** | Indian Standard Numbering System (₹ Lakhs & Crores) |

---

## 🏛️ System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        FinSight Frontend (React 19)                    │
│   ├── Collapsible App Shell (Sidebar, Header)                          │
│   ├── Interactive Views (Dashboard, Analytics, Budgets, Goals, Help)   │
│   └── Centralized Service Layer (apiClient, authService, aiService)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST (JWT Bearer Token)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Spring Boot 4.x Backend API                        │
│   ├── JwtAuthenticationFilter & SecurityConfig                         │
│   ├── Controllers: Auth, User, Transactions, Budgets, AI, Assistant    │
│   └── Business Services: UserService, CategorizationService, etc.      │
└──────────────────────┬───────────────────────────────┬─────────────────┘
                       │                               │
       Database Access │                               │ AI Inference
                       ▼                               ▼
      ┌───────────────────────────────┐ ┌────────────────────────────────┐
      │      MongoDB Atlas Cloud      │ │     Spring AI / Groq Engine    │
      │   - Users & Preferences       │ │   - Structured JSON Classifier │
      │   - Encrypted Ledgers         │ │   - Conversational Assistant   │
      │   - Budgets & Financial Goals │ │   - Anomaly Pattern Detection  │
      └───────────────────────────────┘ └────────────────────────────────┘
```

---

## 📂 Project Structure

```text
AI COURSE-BASED PROJECT/
├── README.md                          # Master documentation
├── finsight/                          # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                # Reusable UI (Logo, Card, Button, Modal, etc.)
│   │   │   ├── layout/                # Sidebar (Collapsible), Header
│   │   │   ├── dashboard/             # StatCards, SpendingOverview, CategoryBreakdown
│   │   │   ├── transactions/          # TransactionModal (AI Categorization), Table
│   │   │   ├── budgets/               # BudgetCards, BudgetModal
│   │   │   ├── goals/                 # GoalCards, ContributeModal
│   │   │   ├── insights/              # HealthScore, AnomalyCards
│   │   │   └── assistant/             # AI Chat Assistant Interface
│   │   ├── context/                   # AuthContext (JWT session & user profile sync)
│   │   ├── pages/                     # Dashboard, Transactions, Analytics, Budgets,
│   │   │                              # Goals, Insights, Assistant, Settings, Help
│   │   ├── services/                  # Isolated API communication layer
│   │   │   ├── authService.js
│   │   │   ├── aiService.js
│   │   │   ├── transactionService.js
│   │   │   ├── budgetService.js
│   │   │   └── goalService.js
│   │   └── utils/                     # apiClient.js, formatters.js
│   ├── package.json
│   └── vite.config.js
│
└── finsight-backend/                  # Backend Application (Spring Boot 4.x)
    ├── src/main/java/com/finsight/backend/
    │   ├── config/                    # SecurityConfig, CorsConfig
    │   ├── controller/                # UserController, CategorizationController, etc.
    │   ├── dto/                       # CategorizeRequest, UpdateProfileRequest, etc.
    │   ├── model/                     # User, Transaction, Budget, Goal entities
    │   ├── repository/                # Spring Data MongoDB Repositories
    │   ├── security/                  # JwtAuthenticationFilter, JwtTokenProvider
    │   └── service/                   # CategorizationService, UserService, etc.
    ├── src/main/resources/
    │   └── application.properties     # MongoDB & Groq configuration
    └── pom.xml                        # Maven dependencies & Spring AI BOM
```

---

## 🚀 Getting Started

### Prerequisites
- **Java Development Kit (JDK):** Version 21 or later
- **Node.js:** v18.0.0 or later (v20+ recommended)
- **MongoDB:** Active MongoDB Atlas connection string (or local instance)
- **Groq API Key:** Active key for AI inference

---

### Backend Setup (`finsight-backend`)

1. **Navigate to the backend directory:**
   ```bash
   cd finsight-backend
   ```

2. **Configure environment properties:**
   Verify `src/main/resources/application.properties` includes:
   ```properties
   spring.application.name=finsight-backend
   server.port=8080

   # MongoDB Atlas Connection
   spring.data.mongodb.uri=mongodb+srv://<username>:<password>@cluster.mongodb.net/finsight?retryWrites=true&w=majority

   # Spring AI / Groq LLM Configuration
   spring.ai.openai.api-key=${GROQ_API_KEY}
   spring.ai.openai.base-url=https://api.groq.com/openai
   spring.ai.openai.chat.options.model=llama-3.3-70b-versatile

   # JWT Security
   jwt.secret=your_super_secret_jwt_key_with_at_least_256_bits
   jwt.expiration=86400000
   ```

3. **Compile and run the Spring Boot application:**
   ```bash
   # Windows
   .\mvnw.cmd spring-boot:run

   # Linux / macOS
   ./mvnw spring-boot:run
   ```
   Backend will start on `http://localhost:8080`.

---

### Frontend Setup (`finsight`)

1. **Navigate to the frontend directory:**
   ```bash
   cd finsight
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Ensure `.env` contains:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_USE_MOCK_SERVICES=false
   ```

4. **Launch the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 📡 API Reference Overview

| Module | Method | Endpoint | Description | Auth Required |
|---|---|---|---|---|
| **Auth** | `POST` | `/api/auth/signup` | Register a new user | Public |
| **Auth** | `POST` | `/api/auth/login` | Authenticate and obtain JWT token | Public |
| **User** | `GET` | `/api/user/profile` | Retrieve authenticated user profile | Bearer JWT |
| **User** | `PUT` | `/api/user/profile` | Update name and email address | Bearer JWT |
| **User** | `PUT` | `/api/user/password` | Verify current and update password | Bearer JWT |
| **User** | `GET` | `/api/user/preferences` | Retrieve user preferences map | Bearer JWT |
| **User** | `PUT` | `/api/user/preferences` | Update user preferences map | Bearer JWT |
| **AI** | `POST` | `/api/ai/categorize` | Hybrid rule + Spring AI categorization | Bearer JWT |
| **AI** | `GET` | `/api/insights` | Retrieve AI health score & insights | Bearer JWT |
| **AI** | `POST` | `/api/assistant/chat` | Conversational financial coaching | Bearer JWT |
| **Ledger** | `GET` | `/api/transactions` | Retrieve user transactions list | Bearer JWT |
| **Ledger** | `POST` | `/api/transactions` | Create new income/expense entry | Bearer JWT |
| **Budgets** | `GET` | `/api/budgets` | Fetch monthly category budget limits | Bearer JWT |
| **Goals** | `GET` | `/api/goals` | Fetch active savings goals & progress | Bearer JWT |

---

## 🧪 Build & Verification

- **Backend Verification:**
  ```bash
  cd finsight-backend
  .\mvnw.cmd compile -DskipTests
  # Result: BUILD SUCCESS
  ```

- **Frontend Production Build:**
  ```bash
  cd finsight
  npm run build
  # Result: 2790 modules transformed, 0 errors, output to dist/
  ```

---

## 🔒 Security Best Practices
- **No Client Secrets:** Groq API keys and sensitive credentials remain strictly backend-encapsulated.
- **Principal-Scoped Data:** All operations rely strictly on `@AuthenticationPrincipal User user`, guaranteeing multi-tenant data isolation.
- **Zero Plaintext Password Exposure:** Passwords are never stored in client state, cookies, or `localStorage`, and are permanently hashed with adaptive BCrypt salt rounds.
