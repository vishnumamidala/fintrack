import { useState } from "react";

export const AuthForm = ({ title, subtitle, fields, submitLabel, onSubmit, footer }) => {
  const [values, setValues] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  return (
    <div className="auth-shell">
      <div className="page-orb orb-one" />
      <div className="page-orb orb-three" />
      <section className="auth-panel reveal-up">
        <div className="auth-copy">
          <p className="eyebrow">Personal Finance, Refined</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <div className="auth-feature-list">
            <div>
              <strong>Forecasting</strong>
              <span>See your month-end trajectory before the month is over.</span>
            </div>
            <div>
              <strong>Goals</strong>
              <span>Track savings with a calmer, more focused planning workflow.</span>
            </div>
            <div>
              <strong>Intelligence</strong>
              <span>Spot subscriptions, anomalies, and budget pressure automatically.</span>
            </div>
          </div>
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
