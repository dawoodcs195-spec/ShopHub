import { motion } from "framer-motion";

const variants = {
    primary:
        "bg-[#B76E79] text-white hover:bg-[#A85F6B] shadow-lg hover:shadow-xl",

    secondary:
        "bg-white text-[#4A433D] border border-[#E7DDD3] hover:bg-[#FCFAF7] shadow-sm hover:shadow-md",

    outline:
        "bg-transparent text-[#B76E79] border border-[#B76E79] hover:bg-[#FFF6F7]",

    gold:
        "bg-gradient-to-r from-[#D8B36A] to-[#C89A4B] text-white hover:shadow-xl",
};

const sizes = {
    sm: "px-4 py-2 text-sm",

    md: "px-6 py-3 text-base",

    lg: "px-8 py-4 text-lg",
};

const Button = ({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    className = "",
    disabled = false,
    onClick,
    ...props
}) => {
    return (
        <motion.button
            whileHover={
                disabled
                    ? {}
                    : {
                          y: -2,
                          scale: 1.01,
                      }
            }
            whileTap={
                disabled
                    ? {}
                    : {
                          scale: 0.98,
                      }
            }
            transition={{
                duration: 0.2,
            }}
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-full
                font-semibold
                transition-all
                duration-300
                disabled:opacity-50
                disabled:cursor-not-allowed
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;