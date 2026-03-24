import { useState } from "react";

const suggestedPrompts = [
  "Where am I overspending this month?",
  "How can I reduce my top spending category?",
  "Summarize my cash flow trends in simple terms.",
];

export const AiAssistantPanel = ({ onAsk, filters, loading, response, error }) => {
  const [prompt, setPrompt] = useState("");

  const submitPrompt = async (value) => {
    if (!value.trim()) {
      return;
    }

    await onAsk(value, filters);
  };

  return (
    <section className="card ai-panel">
      <div className="card-head">
        <div>
          <h3>Smart Spending Assistant</h3>
          <p className="panel-copy">Uses a free local Ollama model when available, with a built-in fallback from your own transaction history.</p>
        </div>
      </div>

      <div className="ai-suggestions">
        {suggestedPrompts.map((item) => (
          <button
            key={item}
            className="suggestion-chip"
            onClick={() => {
              setPrompt(item);
              submitPrompt(item);
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="ai-form">
        <textarea
          rows="4"
          placeholder="Ask a question about your spending, categories, trends, or budget..."
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
        />
        <button className="button primary" onClick={() => submitPrompt(prompt)} disabled={loading}>
          {loading ? "Analyzing..." : "Ask Assistant"}
        </button>
      </div>

      <div className="ai-response">
        {error ? <p className="assistant-error">{error}</p> : null}
        {response ? <pre>{response}</pre> : <p>The assistant uses your current dashboard filters and recent transactions as context.</p>}
      </div>
    </section>
  );
};
