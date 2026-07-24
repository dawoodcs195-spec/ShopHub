import { motion } from "framer-motion";

const SkeletonProductCard = () => {
    return (
        <motion.div
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
        >
            <div className="h-full overflow-hidden rounded-[30px] border border-[#EFE6DC] bg-white shadow-sm">
                <div className="animate-pulse">
                    {/* Image */}
                    <div className="relative">
                        <div className="aspect-square w-full bg-[#F3ECE6]" />

                        {/* Badge placeholder */}
                        <div className="absolute left-4 top-4 h-7 w-24 rounded-full bg-[#F4DDE3]" />

                        {/* Wishlist circle placeholder */}
                        <div className="absolute right-4 top-4 h-11 w-11 rounded-full bg-white/80 shadow-sm" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="h-3 w-32 rounded bg-[#F4DDE3] mb-4" />

                        <div className="h-6 w-4/5 rounded bg-[#E9DED8] mb-3" />
                        <div className="h-6 w-3/5 rounded bg-[#E9DED8] mb-6" />

                        <div className="h-4 w-40 rounded bg-[#F3ECE6] mb-6" />

                        <div className="flex items-end justify-between gap-6">
                            <div className="flex-1">
                                <div className="h-3 w-24 rounded bg-[#F3ECE6] mb-2" />
                                <div className="h-8 w-40 rounded bg-[#E9DED8]" />
                            </div>

                            <div className="h-6 w-20 rounded-full bg-[#F3ECE6]" />
                        </div>

                        <div className="mt-8">
                            <div className="h-12 w-full rounded-full bg-[#D8B2A1]/40" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SkeletonProductCard;