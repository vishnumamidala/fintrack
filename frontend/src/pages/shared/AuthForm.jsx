import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { BrandLogo } from "../../components/common/BrandLogo";

const socialIcons = {
  google: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="social-icon">
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.6 3.6 14.5 2.7 12 2.7 6.9 2.7 2.8 6.9 2.8 12s4.1 9.3 9.2 9.3c5.3 0 8.8-3.7 8.8-8.9 0-.6-.1-1.1-.2-1.6H12Z" />
      <path fill="#34A853" d="M3.8 7.4 7 9.7C7.8 7.8 9.7 6.4 12 6.4c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.6 3.6 14.5 2.7 12 2.7 8.4 2.7 5.2 4.8 3.8 7.4Z" />
      <path fill="#FBBC05" d="M12 21.3c2.4 0 4.5-.8 6-2.3l-2.8-2.2c-.8.6-1.8 1-3.2 1-2.2 0-4.1-1.4-4.8-3.4L4 17c1.5 2.7 4.4 4.3 8 4.3Z" />
      <path fill="#4285F4" d="M20.8 12.4c0-.6-.1-1.1-.2-1.6H12v3.9h5.4c-.3 1.3-1 2.2-2 2.9l2.8 2.2c1.6-1.5 2.6-3.8 2.6-6.4Z" />
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="social-icon">
      <path
        fill="currentColor"
        d="M15.3 3.7c-.8.1-1.8.6-2.4 1.3-.6.6-1.1 1.6-1 2.5.9.1 1.8-.3 2.5-1 .6-.7 1.1-1.7.9-2.8Zm3.2 12.7c-.4 1-1 1.9-1.7 2.9-.9 1.2-1.7 2-2.8 2-1 0-1.3-.6-2.7-.6-1.4 0-1.7.6-2.7.6-1.1 0-1.9-.9-2.8-2.1C4.2 17.8 3 14.7 3 11.8c0-2.8 1.8-4.2 3.7-4.2 1.2 0 2.2.7 2.9.7.7 0 1.9-.8 3.4-.7.6 0 2.3.2 3.4 1.8-.1.1-2 1.2-2 3.5 0 2.8 2.5 3.8 2.5 3.9-.1.2-.2.5-.4.8Z"
      />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="social-icon">
      <path
        fill="#1877F2"
        d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1c0 6 4.4 11 10.1 11.9v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.3h3.4l-.5 3.5h-2.9V24C19.6 23.1 24 18.1 24 12.1Z"
      />
    </svg>
  ),
};

export const AuthForm = ({ title, subtitle, fields, submitLabel, onSubmit, footer, socialProviders = [] }) => {
  const [values, setValues] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const handleSocialAuth = (provider) => {
    if (!provider.href) {
      toast.error(`${provider.name} sign-in is not configured yet.`);
      return;
    }

    window.location.href = provider.href;
  };

  return (
    <div className="auth-shell">
      <div className="page-orb orb-one" />
      <div className="page-orb orb-two" />
      <div className="page-orb orb-three" />
      <div className="auth-brandmark reveal-up">
        <Link className="auth-brand" to="/">
          <BrandLogo compact />
        </Link>
      </div>
      <section className="auth-panel reveal-up">
        <form
          className="auth-form auth-form-panel auth-form-minimal"
          onSubmit={async (event) => {
            event.preventDefault();
            await onSubmit(values);
          }}
        >
          <div className="auth-form-header">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          {socialProviders.length ? (
            <>
              <div className="social-auth-list">
                {socialProviders.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    className="social-auth-button"
                    aria-label={`Continue with ${provider.name}`}
                    title={`Continue with ${provider.name}`}
                    onClick={() => handleSocialAuth(provider)}
                  >
                    {socialIcons[provider.id]}
                  </button>
                ))}
              </div>
              <div className="auth-divider">
                <span>or continue with email</span>
              </div>
            </>
          ) : null}
          {fields.map((field) => (
            <label key={field.name}>
              <span>{field.label}</span>
              <input
                type={field.type}
                placeholder={field.label}
                value={values[field.name]}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, [field.name]: event.target.value }))
                }
                required
              />
            </label>
          ))}
          <button className="button primary" type="submit">
            {submitLabel}
          </button>
          <div className="auth-footer">{footer}</div>
        </form>
      </section>
    </div>
  );
};
