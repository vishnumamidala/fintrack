import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CategoryPieChart } from "../components/charts/CategoryPieChart";
import { MonthlyBarChart } from "../components/charts/MonthlyBarChart";
import { TrendLineChart } from "../components/charts/TrendLineChart";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingSkeleton } from "../components/common/Skeleton";
import { AlertsPanel } from "../components/expenses/AlertsPanel";
import { BudgetProgress } from "../components/expenses/BudgetProgress";
import { ExpenseFilters } from "../components/expenses/ExpenseFilters";
import { ExpenseForm } from "../components/expenses/ExpenseForm";
import { FinanceHealthCard } from "../components/expenses/FinanceHealthCard";
import { ForecastPanel } from "../components/expenses/ForecastPanel";
import { GoalsPanel } from "../components/expenses/GoalsPanel";
import { InsightsPanel } from "../components/expenses/InsightsPanel";
import { PaginationControls } from "../components/expenses/PaginationControls";
import { ScenarioPlanner } from "../components/expenses/ScenarioPlanner";
import { ExpenseTable } from "../components/expenses/ExpenseTable";
import { SummaryCards } from "../components/expenses/SummaryCards";
import { useExpenses } from "../context/ExpenseContext";

export const DashboardPage = () => {
  const {
    expenses,
    summary,
    goals,
    scenarioResult,
    filters,
    pagination,
    loading,
    summaryLoading,
    syncDashboard,
    createExpense,
    updateExpense,
    deleteExpense,
    exportCsv,
    seedSampleData,
    fetchGoals,
    createGoal,
    deleteGoal,
    runScenario,
    setFilters,
    resetFilters,
  } = useExpenses();

  useEffect(() => {
    syncDashboard();
    fetchGoals();
  }, []);

  const categoryBreakdown =
    summary?.categoryBreakdown
      ?.filter((item) => item._id.type === "expense")
      .map((item) => ({
        category: item._id.category,
        total: item.total,
      })) || [];

  const monthlyExpenses =
    summary?.monthlyTotals
      ?.filter((item) => item._id.type === "expense")
      .map((item) => ({
        label: `${item._id.year}/${String(item._id.month).padStart(2, "0")}`,
        total: item.total,
      })) || [];

  return (
    <div className="dashboard">
      <section className="store-hero reveal-up">
        <div className="store-hero-copy">
          <p className="store-kicker">Finance Store</p>
          <h2>Discover a calmer way to manage money.</h2>
          <p className="hero-copy">
            Explore forecasts, assistant guidance, goals, recurring payments, and transaction control in a more editorial, premium workspace.
          </p>
        </div>
        <div className="store-hero-side">
          <p>The best way to stay on top of spending, budgets, and your month ahead.</p>
          <div className="hero-inline-stats">
            <article>
              <strong>{summary ? summary.health.score : "--"}</strong>
              <span>Health score</span>
            </article>
            <article>
              <strong>{summary?.insights.topSpendingCategory || "Calm"}</strong>
              <span>Watch category</span>
            </article>
            <article>
              <strong>{summary ? `${summary.forecast.confidence}` : "--"}</strong>
              <span>Forecast confidence</span>
            </article>
          </div>
        </div>
      </section>

      {summaryLoading || !summary ? (
        <LoadingSkeleton variant="page" />
      ) : (
        <>
          <section className="store-strip reveal-up">
            <BudgetProgress spent={summary.insights.currentMonth} budgetOverride={summary.recommendations.suggestedBudget} />
          </section>

          <section className="store-section reveal-up">
            <div className="store-section-head">
              <h3>The latest. Take a look at what’s new right now.</h3>
            </div>
            <div className="store-row summary-row">
              <SummaryCards totals={summary.totals} insights={summary.insights} />
            </div>
          </section>

          <section className="store-section reveal-up">
            <div className="store-section-head">
              <h3>Intelligence. A smarter look at your financial rhythm.</h3>
            </div>
            <div className="editorial-grid">
              <FinanceHealthCard health={summary.health} />
              <ForecastPanel forecast={summary.forecast} suggestedBudget={summary.recommendations.suggestedBudget} />
            </div>
          </section>

          <section className="store-section reveal-up">
            <div className="store-section-head">
              <h3>The difference. Even more ways to plan with clarity.</h3>
            </div>
            <div className="showcase-grid">
              <InsightsPanel insights={summary.insights} recommendations={summary.recommendations} />
              <AlertsPanel anomalies={summary.anomalies} recurring={summary.recurring} />
            </div>
          </section>

          <section className="store-section reveal-up">
            <div className="store-section-head">
              <h3>Tools. Everything you need to plan, simulate, and save.</h3>
            </div>
            <div className="editorial-grid">
              <ScenarioPlanner
                categories={summary.recommendations.topCategories}
                scenarioResult={scenarioResult}
                onRunScenario={runScenario}
              />
              <GoalsPanel goals={goals} onCreateGoal={createGoal} onDeleteGoal={deleteGoal} />
            </div>
          </section>

          <section className="store-section reveal-up">
            <div className="store-section-head">
              <h3>Assistant. Help is here, whenever and however you need it.</h3>
            </div>
            <section className="card assistant-preview editorial-feature-card">
              <div className="card-head">
                <div>
                  <h3>Assistant Workspace</h3>
                  <p className="panel-copy">
                    Open a dedicated conversation space for cleaner, data-aware financial guidance based on your budgets, goals, and trends.
                  </p>
                </div>
                <Link className="button primary" to="/assistant">
                  Open Assistant
                </Link>
              </div>
            </section>
          </section>

          <section className="store-section reveal-up">
            <div className="store-section-head">
              <h3>Analytics. Visualize the month from multiple angles.</h3>
            </div>
            <section className="chart-grid">
              <CategoryPieChart data={categoryBreakdown} />
              <MonthlyBarChart data={monthlyExpenses} />
              <TrendLineChart data={monthlyExpenses} />
            </section>
          </section>
        </>
      )}

      <section className="store-section reveal-up">
        <div className="store-section-head">
          <h3>Transactions. Keep every entry organized and within reach.</h3>
        </div>
        <ExpenseForm onSubmit={createExpense} />
        <ExpenseFilters
          filters={filters}
          onChange={(payload) => {
            const nextFilters = { ...filters, ...payload };
            setFilters(payload);
            syncDashboard(nextFilters);
          }}
          onReset={() => {
            resetFilters();
            syncDashboard({
              page: 1,
              limit: filters.limit,
              search: "",
              category: "",
              type: "",
              dateFrom: "",
              dateTo: "",
              sort: "date_desc",
            });
          }}
          onExport={exportCsv}
        />

        {loading ? (
          <LoadingSkeleton variant="card" rows={6} />
        ) : expenses.length ? (
          <>
            <ExpenseTable expenses={expenses} onUpdate={updateExpense} onDelete={deleteExpense} />
            <PaginationControls
              pagination={pagination}
              onPageChange={(page) => {
                const nextFilters = { ...filters, page };
                setFilters({ page });
                syncDashboard(nextFilters);
              }}
            />
          </>
        ) : (
          <EmptyState
            title="No transactions yet"
            description="Start with your own entries or load polished sample data to explore forecasts, recurring insights, and health scoring."
            action={
              <div className="empty-actions">
                <button className="button primary" onClick={seedSampleData}>
                  Load Sample Data
                </button>
              </div>
            }
          />
        )}
      </section>
    </div>
  );
};
