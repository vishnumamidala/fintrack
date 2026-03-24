import { useEffect } from "react";
import { AiAssistantPanel } from "../components/expenses/AiAssistantPanel";
import { useExpenses } from "../context/ExpenseContext";

export const AssistantPage = () => {
  const {
    filters,
    assistantLoading,
    assistantMessages,
    assistantError,
    askAssistant,
    fetchAssistantChat,
    resetAssistantChat,
  } = useExpenses();

  useEffect(() => {
    fetchAssistantChat();
  }, []);

  return (
    <div className="assistant-page">
      <section className="assistant-hero reveal-up">
        <div>
          <p className="eyebrow">Assistant</p>
          <h2>Your finance copilot, in a dedicated chat.</h2>
          <p className="hero-copy">
            Ask follow-up questions, talk through spending tradeoffs, and let the assistant respond using your live budgets,
            goals, trends, and earlier messages.
          </p>
        </div>
      </section>

      <AiAssistantPanel
        filters={filters}
        loading={assistantLoading}
        messages={assistantMessages}
        error={assistantError}
        onAsk={askAssistant}
        onReset={resetAssistantChat}
      />
    </div>
  );
};
