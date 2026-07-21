import {
    FaStar,
    FaStarHalfAlt,
    FaRegStar,
} from "react-icons/fa";

const Rating = ({ value = 0, text = "" }) => {
    const renderStar = (index) => {
        if (value >= index) {
            return <FaStar className="text-yellow-400" />;
        }

        if (value >= index - 0.5) {
            return <FaStarHalfAlt className="text-yellow-400" />;
        }

        return <FaRegStar className="text-yellow-400" />;
    };

    return (
        <div className="flex items-center gap-2">

            <div className="flex gap-1 text-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                        {renderStar(star)}
                    </span>
                ))}
            </div>

            {text && (
                <span className="text-gray-600 text-sm">
                    {text}
                </span>
            )}

        </div>
    );
};

export default Rating;