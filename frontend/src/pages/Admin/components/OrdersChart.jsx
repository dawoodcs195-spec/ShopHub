import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

const OrdersChart = ({ data }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">
                Monthly Orders
            </h2>

            <div className="h-80">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis allowDecimals={false} />

                        <Tooltip
                            formatter={(value) => [
                                value,
                                "Orders",
                            ]}
                        />

                        <Bar
                            dataKey="orders"
                            fill="#16a34a"
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default OrdersChart;