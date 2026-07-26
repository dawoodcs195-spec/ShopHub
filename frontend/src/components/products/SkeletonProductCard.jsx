import { motion } from "framer-motion";

const SkeletonProductCard = () => {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="h-full overflow-hidden rounded-[30px] border border-border dark:border-dark-border bg-card dark:bg-dark-card shadow-sm">
        <div className="animate-pulse">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square w-full bg-secondary/60 dark:bg-white/5" />

            {/* Badge placeholder */}
            <div className="absolute left-4 top-4 h-7 w-24 rounded-full bg-primary/15 dark:bg-white/10" />

            {/* Wishlist circle placeholder */}
            <div className="absolute right-4 top-4 h-11 w-11 rounded-full bg-card/80 dark:bg-dark-background/60 shadow-sm" />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="h-3 w-32 rounded bg-primary/15 dark:bg-white/10 mb-4" />

            <div className="h-6 w-4/5 rounded bg-secondary/70 dark:bg-white/10 mb-3" />
            <div className="h-6 w-3/5 rounded bg-secondary/70 dark:bg-white/10 mb-6" />

            <div className="h-4 w-40 rounded bg-secondary/60 dark:bg-white/5 mb-6" />

            <div className="flex items-end justify-between gap-6">
              <div className="flex-1">
                <div className="h-3 w-24 rounded bg-secondary/60 dark:bg-white/5 mb-2" />
                <div className="h-8 w-40 rounded bg-secondary/70 dark:bg-white/10" />
              </div>

              <div className="h-6 w-20 rounded-full bg-secondary/60 dark:bg-white/5" />
            </div>

            <div className="mt-8">
              <div className="h-12 w-full rounded-full bg-primary/20 dark:bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkeletonProductCard;