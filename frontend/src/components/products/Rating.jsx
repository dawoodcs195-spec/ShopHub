import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Rating = ({ value = 0, text = "", className = "" }) => {
    const safeValue = Number(value) || 0;

    const stars = Array.from({ length: 5 }).map((_, i) => {
        const starNumber = i + 1;

        if (safeValue >= starNumber) return "full";
        if (safeValue >= starNumber - 0.5) return "half";
        return "empty";
    });

    return (
        <div
            className={[
                "flex items-center gap-2",
                className,
            ].join(" ")}
            aria-label={`Rating: ${safeValue} out of 5`}
        >
            <div className="flex items-center gap-1 text-[#C7A35B]">
                {stars.map((type, idx) => {
                    if (type === "full") return <FaStar key={idx} className="text-sm" />;
                    if (type === "half") return <FaStarHalfAlt key={idx} className="text-sm" />;
                    return <FaRegStar key={idx} className="text-sm text-[#D8B36A]/55" />;
                })}
            </div>

            {text ? (
                <span className="text-sm text-text-secondary dark:text-dark-muted-foreground">
                    {text}
                </span>
            ) : null}
        </div>
    );
};

export default Rating;