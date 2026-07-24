// frontend/src/components/common/StarRatingInput.jsx

import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const StarRatingInput = ({ rating, setRating }) => {
    const [hover, setHover] = useState(null);

    return (
        <div className="flex space-x-1">
            {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;

                return (
                    <label key={i}>
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                            className="sr-only" // Hide the actual radio button
                        />
                        <motion.div
                            whileHover={{ scale: 1.2, y: -2 }}
                            whileTap={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <FaStar
                                className="cursor-pointer transition-colors duration-200"
                                color={ratingValue <= (hover || rating) ? "#f59e0b" : "#9CA3AF"} // Amber-500 for selected, Gray-400 for unselected
                                size={32}
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(null)}
                            />
                        </motion.div>
                    </label>
                );
            })}
        </div>
    );
};

export default StarRatingInput;