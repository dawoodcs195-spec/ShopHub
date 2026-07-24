import { motion } from 'framer-motion';

const SkeletonProductCard = () => {
    return (
        <motion.div 
            className="bg-surface rounded-lg shadow-soft overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="animate-pulse">
                {/* Image Skeleton */}
                <div className="bg-gray-200 aspect-square"></div>
                
                {/* Content Skeleton */}
                <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="flex justify-between items-center">
                        <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SkeletonProductCard;