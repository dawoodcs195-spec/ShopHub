import { motion } from "framer-motion";

const DashboardStats = ({ statCards }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 min-[360px]:gap-4 sm:gap-6 mb-8">
      {statCards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            className="bg-secondary dark:bg-dark-secondary border border-black/5 dark:border-white/10 rounded-xl shadow-soft p-4 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div
              className={[
                "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center",
                card.iconBg,
              ].join(" ")}
            >
              <Icon className={card.iconColor} size={20} />
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground dark:text-dark-muted-foreground mt-3 sm:mt-4">
              {card.title}
            </p>
            <p className="text-lg sm:text-2xl font-bold text-card-foreground dark:text-dark-card-foreground mt-1 break-words">
              {card.value}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DashboardStats;