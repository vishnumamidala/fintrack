# Demo Script

## 60-second recruiter version

This is a MERN-based expense tracker that goes beyond CRUD. It includes secure JWT auth, per-user financial data isolation, MongoDB aggregation pipelines for analytics, forecasting, anomaly detection, recurring bill detection, savings goals, and a scenario planner. I also added a free assistant layer that can use Ollama locally, with a built-in fallback so the product still works without paid AI APIs.

## 3-5 minute walkthrough

### 1. Product overview

- User authentication with protected routes and secure password hashing
- Expense CRUD with pagination, filtering, search, and CSV export
- Smart dashboard with forecasting, health scoring, anomaly alerts, recurring payments, and goals
- Scenario planner to simulate spending reductions or increases
- Settings page for user-managed budgets and category budgets

### 2. Backend architecture

- Express backend organized with MVC structure
- Separate config, middleware, routes, validators, and utility layers
- MongoDB/Mongoose models for `User`, `Expense`, and `Goal`
- Analytics centralized in one aggregation-driven utility to avoid duplicated business logic
- Protected routes ensure each user only accesses their own data

### 3. Frontend architecture

- React with Vite and React Router v6
- Context API + `useReducer` for auth and expense state
- Dashboard composed from reusable product widgets
- Axios interceptor for attaching auth tokens and handling 401s globally

### 4. Advanced features to highlight

- Spend health score from savings rate, concentration risk, and projected balance
- Month-end forecast based on current spend trend
- Recurring payment detection from transaction history
- Anomaly detection for unusually large expenses
- Savings goals with required monthly savings calculation
- Scenario planner for “what-if” finance modeling

### 5. Engineering quality

- Validation with `express-validator`
- Security middleware with `helmet` and rate limiting
- Test coverage on backend and frontend
- Docker/deployment-ready files included
- Documentation explains architecture, tradeoffs, and run instructions

## Suggested live demo order

1. Register or log in
2. Load sample data if the account is empty
3. Show dashboard summary cards and charts
4. Open anomaly alerts and recurring payments
5. Run a scenario like reducing `Food` by `-15%`
6. Add a savings goal
7. Open settings and change the monthly budget
8. Ask a question in the assistant panel

## Interview talking points

- Why MongoDB aggregation was a good fit for analytics-heavy views
- How per-user data isolation is enforced in queries
- Why I used a local AI fallback instead of depending on paid APIs
- How I would evolve this toward production: refresh tokens, integration tests, hosted deployment, and observability

