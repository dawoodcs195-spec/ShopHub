import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

const RevenueChart = ({ data }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">
                Monthly Revenue
            </h2>

            <div className="h-80">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient
                                id="revenueGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#2563eb"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#2563eb"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip
                            formatter={(value) => [
                                `Rs. ${value}`,
                                "Revenue",
                            ]}
                        />

                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#2563eb"
                            strokeWidth={3}
                            fill="url(#revenueGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;