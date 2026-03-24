import { useState } from "react";

export const AuthForm = ({ title, subtitle, fields, submitLabel, onSubmit, footer }) => {
  const [values, setValues] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  return (
    <div className="auth-shell">
      <section className="auth-panel">
        <div className="auth-copy">
          <p className="eyebrow">Production-ready Expense Tracker</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <form
          className="auth-form"
          onSubmit={async (event) => {
            event.preventDefault();
            await onSubmit(values);
          }}
        >
          {fields.map((field) => (
            <label key={field.name}>
              <span>{field.label}</span>
              <input
                type={field.type}
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

