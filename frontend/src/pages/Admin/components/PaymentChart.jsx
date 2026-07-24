import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// Colors from our new theme
const COLORS = ["#C08497", "#F7AF9D", "#7D6D75", "#D4AF37"];

const PaymentChart = ({ data }) => {
    return (
        <div className="bg-surface rounded-lg shadow-soft p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Payment Methods</h3>
            {data.length === 0 ? (
                <p className="text-text-secondary text-sm">No payment data available.</p>
            ) : (
                <div className="h-80 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                labelLine={false}
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                    return (
                                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={14}>
                                            {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    );
                                }}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#FFFBF5', border: '1px solid #EAE0D5', borderRadius: '0.5rem' }}
                                labelStyle={{ color: '#422B3A' }}
                            />
                            <Legend iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default PaymentChart;