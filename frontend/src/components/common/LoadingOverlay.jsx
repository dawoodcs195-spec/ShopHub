import { AnimatePresence, motion } from "framer-motion";
import Spinner from "./Spinner";

const LoadingOverlay = ({ isOpen, label = "Please wait..." }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/55"
          aria-busy="true"
          aria-live="polite"
        >
          <motion.div
            initial={{ scale: 0.96, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 10, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm rounded-[28px] border border-border dark:border-dark-border bg-card dark:bg-dark-card shadow-soft-lg px-7 py-6 backdrop-blur"
          >
            <div className="flex items-center gap-4">
              <Spinner size={36} />
              <div>
                <p className="font-serif text-lg font-bold text-text-primary dark:text-dark-card-foreground">
                  Just a moment
                </p>
                <p className="mt-1 text-sm text-text-secondary dark:text-dark-muted-foreground">
                  {label}
                </p>
              </div>
            </div>

            <p className="mt-5 text-xs text-text-secondary dark:text-dark-muted-foreground">
              Thank you for supporting handmade craftsmanship.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;