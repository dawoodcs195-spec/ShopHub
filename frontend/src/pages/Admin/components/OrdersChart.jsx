import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const OrdersChart = ({ data }) => {
    return (
        <div className="bg-surface rounded-lg shadow-soft p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Orders This Period</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EAE0D5" />
                        <XAxis dataKey="month" stroke="#7D6D75" fontSize={12} />
                        <YAxis allowDecimals={false} stroke="#7D6D75" fontSize={12} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#FFFBF5', border: '1px solid #EAE0D5', borderRadius: '0.5rem' }}
                            labelStyle={{ color: '#422B3A' }}
                            formatter={(value) => [value, "Orders"]}
                        />
                        <Bar dataKey="orders" fill="#F7AF9D" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default OrdersChart;