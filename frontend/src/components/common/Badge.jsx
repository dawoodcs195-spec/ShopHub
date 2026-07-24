const variants = {
    rose: "bg-rose-100 text-rose-700",
    gold: "bg-amber-100 text-amber-700",
    sage: "bg-emerald-100 text-emerald-700",
    lavender: "bg-violet-100 text-violet-700",
    slate: "bg-slate-100 text-slate-700",
};

const Badge = ({
    children,
    variant = "rose",
}) => {
    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${variants[variant]}`}
        >
            {children}
        </span>
    );
};

export default Badge;