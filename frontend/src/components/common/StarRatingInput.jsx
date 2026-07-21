import { FaStar } from "react-icons/fa";

const StarRatingInput = ({ rating, setRating }) => {
    return (
        <div className="flex gap-2">

            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition transform hover:scale-110"
                >
                    <FaStar
                        size={28}
                        className={
                            star <= rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                        }
                    />
                </button>
            ))}

        </div>
    );
};

export default StarRatingInput;