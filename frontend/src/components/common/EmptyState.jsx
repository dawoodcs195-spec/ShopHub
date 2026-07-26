import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const EmptyState = ({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  tip,
}) => {
  const Action = ({ action, variant = "primary" }) => {
    if (!action) return null;

    const base =
      variant === "primary"
        ? "inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
        : "inline-flex items-center gap-3 rounded-full border border-border dark:border-dark-border bg-card dark:bg-dark-background px-7 py-4 font-semibold text-text-primary dark:text-dark-card-foreground shadow-soft transition-all duration-300 hover:-translate-y-0.5";

    const content = (
      <>
        {action.icon ? <action.icon /> : null}
        <span>{action.label}</span>
      </>
    );

    if (action.to) {
      return (
        <Link to={action.to} className={base}>
          {content}
        </Link>
      );
    }

    return (
      <button type="button" onClick={action.onClick} className={base}>
        {content}
      </button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden text-center rounded-[36px] border border-border dark:border-dark-border bg-card dark:bg-dark-card shadow-soft max-w-2xl mx-auto p-12 sm:p-14"
    >
      {/* Boutique glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-rose-100/40 dark:bg-dark-accent/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-amber-100/35 dark:bg-dark-secondary/45 blur-3xl" />

      <div className="relative">
        {Icon && (
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50 dark:from-dark-accent/35 dark:to-dark-secondary/35 text-primary shadow-sm">
            <Icon className="text-3xl" />
          </div>
        )}

        <h3 className="text-3xl sm:text-4xl font-serif font-bold text-text-primary dark:text-dark-card-foreground">
          {title}
        </h3>

        {description && (
          <p className="mt-4 text-text-secondary dark:text-dark-muted-foreground leading-8">
            {description}
          </p>
        )}

        {(primaryAction || secondaryAction) && (
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Action action={primaryAction} variant="primary" />
            <Action action={secondaryAction} variant="secondary" />
          </div>
        )}

        {tip && (
          <p className="mt-6 text-sm text-text-secondary dark:text-dark-muted-foreground">
            {tip}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyState;