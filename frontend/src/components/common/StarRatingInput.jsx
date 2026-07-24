import { useState } from 'react';
import { FaStar } from "react-icons/fa";

const StarRatingInput = ({ rating, setRating }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((starValue) => (
                <button
                    key={starValue}
                    type="button"
                    onClick={() => {
                        console.log("Star clicked:", starValue);
                        setRating(starValue);
                        }}
                    onMouseEnter={() => setHover(starValue)}
                    onMouseLeave={() => setHover(0)}
                    className="transition transform focus:outline-none"
                >
                    <FaStar
    size={28}
    className={`transition-colors duration-200 ${
        starValue <= (hover || rating)
            ? "text-yellow-400"
            : "text-gray-300"
                }`}
                />
                </button>
            ))}
        </div>
    );
};

export default StarRatingInput;