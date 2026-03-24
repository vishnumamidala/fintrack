import { useMemo, useState } from "react";

const suggestedPrompts = [
  "I want to save more this month.",
  "Where am I overspending right now?",
  "Help me build a better monthly plan from my current spending.",
];

export const AiAssistantPanel = ({ onAsk, onReset, filters, loading, messages = [], error }) => {
  const [prompt, setPrompt] = useState("");

  const visibleMessages = useMemo(
    () => messages.filter((message) => message.role === "user" || message.role === "assistant"),
    [messages]
  );

  const submitPrompt = async (value) => {
    const nextPrompt = value.trim();
    if (!nextPrompt) {
      return;
    }

    setPrompt("");
    await onAsk(nextPrompt, filters);
  };

  return (
    <section className="card ai-panel reveal-up">
      <div className="card-head">
        <div>
          <h3>Smart Spending Assistant</h3>
          <p className="panel-copy">
            This chat uses your real dashboard data, recent transactions, goals, and your earlier replies to keep the conversation context-aware.
          </p>
        </div>
        <button className="button secondary" onClick={onReset} disabled={loading || !visibleMessages.length}>
          Clear Chat
        </button>
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

      <div className="ai-thread">
        {visibleMessages.length ? (
          visibleMessages.map((message, index) => (
            <article key={`${message.role}-${index}`} className={`chat-message ${message.role}`}>
              <span className="chat-role">{message.role === "assistant" ? "Assistant" : "You"}</span>
              <p>{message.content}</p>
            </article>
          ))
        ) : (
          <div className="ai-empty-state">
            <p className="ai-empty-title">Start a real conversation about your money.</p>
            <p className="panel-copy">
              Ask for savings advice, follow up on a category, or answer the assistant’s clarifying question and it will continue from there.
            </p>
          </div>
        )}
        {loading ? (
          <article className="chat-message assistant pending">
            <span className="chat-role">Assistant</span>
            <p>Thinking through your latest spending patterns...</p>
          </article>
        ) : null}
      </div>

      <div className="ai-form">
        <textarea
          rows="3"
          placeholder="Ask about budgets, goals, overspending, or answer the assistant’s follow-up..."
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
        />
        <div className="ai-actions">
          <button className="button primary" onClick={() => submitPrompt(prompt)} disabled={loading}>
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>

      {error ? <p className="assistant-error">{error}</p> : null}
    </section>
  );
};
