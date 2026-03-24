import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/common/ProtectedRoute";
import { AppLayout } from "../layouts/AppLayout";
import { ActivityPage } from "../pages/ActivityPage";
import { AssistantPage } from "../pages/AssistantPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ProfilePage } from "../pages/ProfilePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { SettingsPage } from "../pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "assistant", element: <AssistantPage /> },
          { path: "activity", element: <ActivityPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);
