import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const RevenueChart = ({ data }) => {
    return (
        <div className="bg-surface rounded-lg shadow-soft p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Revenue Over Time</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#C08497" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#C08497" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EAE0D5" />
                        <XAxis dataKey="month" stroke="#7D6D75" fontSize={12} />
                        <YAxis stroke="#7D6D75" fontSize={12} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#FFFBF5', border: '1px solid #EAE0D5', borderRadius: '0.5rem' }}
                            labelStyle={{ color: '#422B3A' }}
                            formatter={(value) => [`Rs. ${value.toLocaleString()}`, "Revenue"]}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#C08497" strokeWidth={2} fill="url(#revenueGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;