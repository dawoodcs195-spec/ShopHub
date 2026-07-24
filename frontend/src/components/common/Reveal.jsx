import { useInView } from "react-intersection-observer";
import { motion, useReducedMotion } from "framer-motion";

const Reveal = ({
    children,
    className = "",
    y = 18,
    duration = 0.75,
    delay = 0,
    once = true,
    amount = 0.2,
    variants,
}) => {
    const reduceMotion = useReducedMotion();

    const [ref, inView] = useInView({
        triggerOnce: once,
        threshold: amount,
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
        >
            {children}
        </motion.div>
    );
};

export default Reveal;