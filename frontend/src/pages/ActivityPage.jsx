import { useEffect, useState } from "react";
import { Bot, Goal, PiggyBank, Receipt, Settings, Sparkles } from "lucide-react";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingSkeleton } from "../components/common/Skeleton";
import { useExpenses } from "../context/ExpenseContext";

const formatTimestamp = (value) =>
  new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const iconMap = {
  auth: Settings,
  expense: Receipt,
  goal: Goal,
  assistant: Bot,
  scenario: Sparkles,
  preferences: PiggyBank,
};

export const ActivityPage = () => {
  const { activityFeed, fetchActivityFeed } = useExpenses();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadActivity = async () => {
      await fetchActivityFeed();
      setLoaded(true);
    };

    loadActivity();
  }, []);

  const isLoading = !loaded;

  return (
    <div className="activity-page">
      <section className="assistant-hero reveal-up">
        <div>
          <p className="eyebrow">Activity</p>
          <h2>Audit-ready product activity, built into the experience.</h2>
          <p className="hero-copy">
            This timeline captures key user actions across auth, expenses, goals, scenarios, preferences, and assistant
            usage so the product feels more trustworthy and operationally mature.
          </p>
        </div>
      </section>

      {isLoading ? (
        <LoadingSkeleton variant="card" rows={6} />
      ) : activityFeed.length ? (
        <section className="card activity-feed reveal-up">
          <div className="card-head">
            <div>
              <h3>Recent Activity</h3>
              <p className="panel-copy">A recruiter-friendly trail of meaningful product actions across the platform.</p>
            </div>
          </div>

          <div className="activity-list">
            {activityFeed.map((item) => {
              const Icon = iconMap[item.entityType] || Sparkles;

              return (
                <article key={item._id} className="activity-item">
                  <div className="activity-icon">
                    <Icon size={16} />
                  </div>
                  <div className="activity-content">
                    <div className="activity-topline">
                      <h4>{item.title}</h4>
                      <time dateTime={item.createdAt}>{formatTimestamp(item.createdAt)}</time>
                    </div>
                    <p>{item.description || "A tracked activity occurred in the system."}</p>
                    <span className="activity-tag">{item.action}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : (
        <EmptyState
          title="No tracked activity yet"
          description="As you create expenses, goals, preferences, or assistant conversations, this audit trail will populate automatically."
        />
      )}
    </div>
  );
};
