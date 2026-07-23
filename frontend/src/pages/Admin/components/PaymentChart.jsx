import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

const COLORS = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
];

const PaymentChart = ({ data }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">
                Payment Methods
            </h2>

            {data.length === 0 ? (
                <p className="text-gray-500">
                    No payment data available.
                </p>
            ) : (
                <div className="h-80">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={110}
                                label
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={entry.name}
                                        fill={
                                            COLORS[
                                                index %
                                                    COLORS.length
                                            ]
                                        }
                                    />
                                ))}
                            </Pie>

                            <Tooltip />

                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default PaymentChart;