import { motion } from 'framer-motion';

const DashboardStats = ({ statCards }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {statCards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <motion.div
                        key={card.title}
                        className="bg-surface rounded-lg shadow-soft p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.iconBg}`}>
                            <Icon className={`${card.iconColor}`} size={24} />
                        </div>
                        <p className="text-sm text-text-secondary mt-4">{card.title}</p>
                        <p className="text-2xl font-bold text-text-primary mt-1">{card.value}</p>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default DashboardStats;