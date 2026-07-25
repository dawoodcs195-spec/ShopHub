import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const SearchResult = ({
    product,
    onClose,
}) => {
    return (
        <motion.div
            layout
            initial={{
                opacity: 0,
                y: 10,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
            }}
            transition={{
                duration: 0.2,
            }}
        >
            <Link
                to={`/product/${product._id}`}
                onClick={onClose}
                className="group flex items-center gap-5 border-b border-slate-100 px-6 py-5 transition-colors duration-300 hover:bg-[#FCFAF7]"
            >
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                    <img
                        src={
                            product.image?.url ||
                            "https://placehold.co/160x160/F5E1E6/422B3A?text=Handmade"
                        }
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B76E79]">
                        {product.category}
                    </p>

                    <h3 className="mt-2 truncate font-serif text-xl font-semibold text-[#2D2A26]">
                        {product.name}
                    </h3>

                    <p className="mt-2 text-sm text-[#7A7067]">
                        Rs.{" "}
                        {product.price.toLocaleString()}
                    </p>
                </div>

                <div className="flex items-center gap-3 text-[#B76E79] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    <span className="hidden text-sm font-medium sm:block">
                        View
                    </span>

                    <FaArrowRight />
                </div>
            </Link>
        </motion.div>
    );
};

export default SearchResult;