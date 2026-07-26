import { useInView } from "react-intersection-observer";
import { motion, useReducedMotion } from "framer-motion";

const Reveal = ({
  children,
  className = "",
  y = 18,
  duration = 0.75,
  delay = 0,
  once = true,

  // Keep your existing default, but we’ll clamp it on small screens
  amount = 0.2,

  variants,
}) => {
  const reduceMotion = useReducedMotion();

  // ✅ Fix: On small screens, tall sections may never hit 0.2 intersection ratio.
  // Clamp threshold to a safer value on mobile so content doesn't stay invisible.
  const safeThreshold = (() => {
    if (typeof amount !== "number") return amount;

    const isSmallScreen =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(max-width: 640px)").matches;

    // On mobile, reveal sooner so tall sections can still trigger
    const maxOnThisScreen = isSmallScreen ? 0.08 : 0.2;

    return Math.max(0, Math.min(amount, maxOnThisScreen));
  })();

  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: safeThreshold,
  });

  const defaultVariants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : y,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : duration,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants || defaultVariants}
      // ✅ Prevent invisible sections from being clickable while hidden
      style={{ pointerEvents: inView ? "auto" : "none" }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;