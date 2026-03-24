import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthForm } from "./shared/AuthForm";

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  return (
    <AuthForm
      title="Build smarter money habits"
      subtitle="Create an account to unlock your dashboard, charts, and monthly insights."
      submitLabel="Create Account"
      fields={[
        { name: "name", label: "Full name", type: "text" },
        { name: "email", label: "Email", type: "email" },
        { name: "password", label: "Password", type: "password" },
      ]}
      footer={
        <p>
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      }
      onSubmit={async (values) => {
        const ok = await register(values);
        if (ok) navigate("/");
      }}
    />
  );
};

