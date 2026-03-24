import { createContext, useContext, useMemo, useReducer } from "react";
import toast from "react-hot-toast";
import Papa from "papaparse";
import { api } from "../api/axios";

const ExpenseContext = createContext(null);

const initialFilters = {
  page: 1,
  limit: 8,
  search: "",
  category: "",
  type: "",
  dateFrom: "",
  dateTo: "",
  sort: "date_desc",
};

const initialState = {
  expenses: [],
  pagination: null,
  summary: null,
  goals: [],
  scenarioResult: null,
  filters: initialFilters,
  loading: false,
  summaryLoading: false,
  assistantLoading: false,
  assistantResponse: "",
  assistantError: "",
};

const expenseReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_SUMMARY_LOADING":
      return { ...state, summaryLoading: action.payload };
    case "SET_EXPENSES":
      return { ...state, expenses: action.payload.data, pagination: action.payload.pagination, loading: false };
    case "SET_SUMMARY":
      return { ...state, summary: action.payload, summaryLoading: false };
    case "SET_GOALS":
      return { ...state, goals: action.payload };
    case "SET_SCENARIO":
      return { ...state, scenarioResult: action.payload };
    case "SET_ASSISTANT_LOADING":
      return { ...state, assistantLoading: action.payload };
    case "SET_ASSISTANT_RESPONSE":
      return { ...state, assistantResponse: action.payload, assistantError: "", assistantLoading: false };
    case "SET_ASSISTANT_ERROR":
      return { ...state, assistantError: action.payload, assistantLoading: false };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "RESET_FILTERS":
      return { ...state, filters: initialFilters };
    default:
      return state;
  }
};

const toQueryParams = (filters) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params.append(key, value);
    }
  });

  return params.toString();
};

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  const fetchExpenses = async (overrides = {}) => {
    const filters = { ...state.filters, ...overrides };
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await api.get(`/expenses?${toQueryParams(filters)}`);
      dispatch({ type: "SET_FILTERS", payload: filters });
      dispatch({ type: "SET_EXPENSES", payload: response.data });
    } catch (error) {
      toast.error("Unable to load expenses");
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const fetchSummary = async (overrides = {}) => {
    const filters = { ...state.filters, ...overrides };
    dispatch({ type: "SET_SUMMARY_LOADING", payload: true });

    try {
      const response = await api.get(`/expenses/summary?${toQueryParams(filters)}`);
      dispatch({ type: "SET_SUMMARY", payload: response.data.data });
    } catch (error) {
      toast.error("Unable to load summary");
      dispatch({ type: "SET_SUMMARY_LOADING", payload: false });
    }
  };

  const syncDashboard = async (filters = {}) => {
    await Promise.all([fetchExpenses(filters), fetchSummary(filters)]);
  };

  const createExpense = async (payload) => {
    try {
      await api.post("/expenses", payload);
      toast.success("Entry added");
      await syncDashboard({ page: 1 });
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "Unable to add expense");
    }
  };

  const updateExpense = async (id, payload) => {
    try {
      await api.put(`/expenses/${id}`, payload);
      toast.success("Entry updated");
      await syncDashboard();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "Unable to update expense");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      toast.success("Entry deleted");
      await syncDashboard();
    } catch (error) {
      toast.error("Unable to delete entry");
    }
  };

  const exportCsv = async () => {
    try {
      const params = toQueryParams({ ...state.filters, page: 1, limit: 1000 });
      const response = await api.get(`/expenses?${params}`);
      const csv = Papa.unparse(
        response.data.data.map((expense) => ({
          Title: expense.title,
          Amount: expense.amount,
          Category: expense.category,
          Type: expense.type,
          Date: new Date(expense.date).toLocaleDateString(),
        }))
      );

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expenses-export.csv");
      link.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported");
    } catch (error) {
      toast.error("Unable to export CSV");
    }
  };

  const askAssistant = async (prompt, filters = state.filters) => {
    dispatch({ type: "SET_ASSISTANT_LOADING", payload: true });

    try {
      const response = await api.post("/ai/assistant", { prompt, filters });
      dispatch({ type: "SET_ASSISTANT_RESPONSE", payload: response.data.data.answer });
    } catch (error) {
      dispatch({
        type: "SET_ASSISTANT_ERROR",
        payload:
          error.response?.data?.error?.message ||
          "Unable to reach the AI assistant right now.",
      });
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await api.get("/goals");
      dispatch({ type: "SET_GOALS", payload: response.data.data });
    } catch (error) {
      toast.error("Unable to load goals");
    }
  };

  const createGoal = async (payload) => {
    try {
      await api.post("/goals", payload);
      toast.success("Goal created");
      await fetchGoals();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "Unable to create goal");
    }
  };

  const deleteGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      toast.success("Goal removed");
      await fetchGoals();
    } catch (error) {
      toast.error("Unable to remove goal");
    }
  };

  const runScenario = async (payload) => {
    try {
      const response = await api.post("/expenses/scenario", payload);
      dispatch({ type: "SET_SCENARIO", payload: response.data.data });
    } catch (error) {
      toast.error("Unable to run scenario");
    }
  };

  const seedSampleData = async () => {
    try {
      await api.post("/expenses/seed-sample");
      toast.success("Sample data added");
      await syncDashboard({ page: 1 });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "Unable to add sample data");
      return false;
    }
  };

  const value = useMemo(
    () => ({
      ...state,
      fetchExpenses,
      fetchSummary,
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
      setFilters: (payload) => dispatch({ type: "SET_FILTERS", payload }),
      resetFilters: () => dispatch({ type: "RESET_FILTERS" }),
    }),
    [state]
  );

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within ExpenseProvider");
  }
  return context;
};
