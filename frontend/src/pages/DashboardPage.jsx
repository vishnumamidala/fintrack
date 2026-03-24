import { useEffect } from "react";
import { CategoryPieChart } from "../components/charts/CategoryPieChart";
import { MonthlyBarChart } from "../components/charts/MonthlyBarChart";
import { TrendLineChart } from "../components/charts/TrendLineChart";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingSkeleton } from "../components/common/Skeleton";
import { AiAssistantPanel } from "../components/expenses/AiAssistantPanel";
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
    assistantLoading,
    assistantResponse,
    assistantError,
    syncDashboard,
    createExpense,
    updateExpense,
    deleteExpense,
    exportCsv,
    askAssistant,
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
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Control spending without losing momentum</h2>
          <p className="hero-copy">
            Track income, keep expenses under budget, and catch risky patterns before they grow.
          </p>
        </div>
        {summary ? (
          <BudgetProgress spent={summary.insights.currentMonth} budgetOverride={summary.recommendations.suggestedBudget} />
        ) : (
          <LoadingSkeleton />
        )}
      </section>

      {summaryLoading || !summary ? (
        <LoadingSkeleton variant="page" />
      ) : (
        <>
          <SummaryCards totals={summary.totals} insights={summary.insights} />
          <section className="product-grid">
            <FinanceHealthCard health={summary.health} />
            <ForecastPanel forecast={summary.forecast} suggestedBudget={summary.recommendations.suggestedBudget} />
          </section>
          <InsightsPanel insights={summary.insights} recommendations={summary.recommendations} />
          <AlertsPanel anomalies={summary.anomalies} recurring={summary.recurring} />
          <section className="product-grid">
            <ScenarioPlanner
              categories={summary.recommendations.topCategories}
              scenarioResult={scenarioResult}
              onRunScenario={runScenario}
            />
            <GoalsPanel goals={goals} onCreateGoal={createGoal} onDeleteGoal={deleteGoal} />
          </section>
          <AiAssistantPanel
            filters={filters}
            loading={assistantLoading}
            response={assistantResponse}
            error={assistantError}
            onAsk={askAssistant}
          />
          <section className="chart-grid">
            <CategoryPieChart data={categoryBreakdown} />
            <MonthlyBarChart data={monthlyExpenses} />
            <TrendLineChart data={monthlyExpenses} />
          </section>
        </>
      )}

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
    </div>
  );
};
