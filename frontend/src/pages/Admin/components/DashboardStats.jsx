const DashboardStats = ({ statCards }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">
            {statCards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                    >
                        <Icon
                            className={`${card.iconColor} mb-4`}
                            size={38}
                        />

                        <h2 className="text-gray-500">
                            {card.title}
                        </h2>

                        <p className="text-3xl font-bold mt-2">
                            {card.value}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default DashboardStats;