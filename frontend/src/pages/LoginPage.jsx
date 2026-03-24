import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthForm } from "./shared/AuthForm";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <AuthForm
      title="Track every rupee with clarity"
      subtitle="Sign in to manage expenses, trends, and budgets in one place."
      submitLabel="Login"
      fields={[
        { name: "email", label: "Email", type: "email" },
        { name: "password", label: "Password", type: "password" },
      ]}
      footer={
        <p>
          No account yet? <Link to="/register">Create one</Link>
        </p>
      }
      onSubmit={async (values) => {
        const ok = await login(values);
        if (ok) navigate("/");
      }}
    />
  );
};
