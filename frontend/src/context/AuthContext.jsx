import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import toast from "react-hot-toast";
import { api, setupAxiosInterceptors } from "../api/axios";

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: localStorage.getItem("expense-tracker-token"),
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, loading: true };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...initialState,
        token: null,
        loading: false,
      };
    case "AUTH_END":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    ...initialState,
    isAuthenticated: Boolean(initialState.token),
  });

  const logout = () => {
    localStorage.removeItem("expense-tracker-token");
    localStorage.removeItem("expense-tracker-user");
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    setupAxiosInterceptors(logout);
  }, []);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const storedUser = localStorage.getItem("expense-tracker-user");

      if (!state.token) {
        dispatch({ type: "AUTH_END" });
        return;
      }

      if (storedUser) {
        dispatch({ type: "SET_USER", payload: JSON.parse(storedUser) });
      }

      try {
        const response = await api.get("/auth/me");
        const user = response.data.data.user;
        localStorage.setItem("expense-tracker-user", JSON.stringify(user));
        dispatch({ type: "SET_USER", payload: user });
      } catch (error) {
        logout();
      }
    };

    bootstrapAuth();
  }, [state.token]);

  const saveAuth = (payload) => {
    localStorage.setItem("expense-tracker-token", payload.token);
    localStorage.setItem("expense-tracker-user", JSON.stringify(payload.user));
    dispatch({ type: "AUTH_SUCCESS", payload });
  };

  const register = async (formData) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await api.post("/auth/register", formData);
      saveAuth(response.data.data);
      toast.success("Welcome aboard");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "Registration failed");
      dispatch({ type: "AUTH_END" });
      return false;
    }
  };

  const login = async (formData) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await api.post("/auth/login", formData);
      saveAuth(response.data.data);
      toast.success("Signed in successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "Login failed");
      dispatch({ type: "AUTH_END" });
      return false;
    }
  };

  const updatePreferences = async (payload) => {
    try {
      const response = await api.put("/auth/me/preferences", payload);
      const user = response.data.data.user;
      localStorage.setItem("expense-tracker-user", JSON.stringify(user));
      dispatch({ type: "SET_USER", payload: user });
      toast.success("Preferences updated");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "Unable to update preferences");
      return false;
    }
  };

  const updateProfile = async (payload) => {
    try {
      const response = await api.put("/auth/me/profile", payload);
      const user = response.data.data.user;
      localStorage.setItem("expense-tracker-user", JSON.stringify(user));
      dispatch({ type: "SET_USER", payload: user });
      toast.success("Profile updated");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "Unable to update profile");
      return false;
    }
  };

  const value = useMemo(
    () => ({
      ...state,
      login,
      register,
      updateProfile,
      updatePreferences,
      logout,
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
