import { motion } from "framer-motion";

const SectionHeading = ({
    badge,
    title,
    subtitle,
    align = "center",
}) => {
    const alignment = {
        left: "text-left items-start",
        center: "text-center items-center",
    };

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 30,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
                amount: 0.3,
            }}
            transition={{
                duration: 0.7,
                ease: "easeOut",
            }}
            className={`flex flex-col ${alignment[align]} max-w-3xl ${
                align === "center" ? "mx-auto" : ""
            }`}
        >
            {badge && (
                <span className="inline-flex items-center rounded-full bg-rose-100 px-5 py-2 text-sm font-semibold tracking-wide text-rose-700 shadow-sm">
                    {badge}
                </span>
            )}

            <h2 className="mt-6 font-serif text-4xl font-bold leading-tight text-[#2D2A26] md:text-5xl">
                {title}
            </h2>

            {subtitle && (
                <p className="mt-5 max-w-2xl text-lg leading-8 text-[#6B655F]">
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
};

export default SectionHeading;