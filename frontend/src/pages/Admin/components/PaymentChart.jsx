import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#22C55E", "#3B82F6", "#A855F7", "#F59E0B", "#EF4444"];

const PaymentChart = ({ data }) => {
    const isDark =
        typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark");

    const tooltipBg = isDark ? "rgba(2,6,23,0.92)" : "rgba(255,255,255,0.98)";
    const tooltipBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(2,6,23,0.10)";
    const tooltipText = isDark ? "rgba(248,250,252,0.95)" : "rgba(15,23,42,0.95)";
    const tooltipMuted = isDark ? "rgba(248,250,252,0.65)" : "rgba(15,23,42,0.60)";

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload?.length) return null;
        const item = payload[0];
        const name = item?.name ?? "";
        const value = Number(item?.value || 0);

        return (
            <div
                style={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: 12,
                    padding: "10px 12px",
                    color: tooltipText,
                    boxShadow: isDark ? "none" : "0 12px 28px rgba(2,6,23,0.10)",
                }}
            >
                <div style={{ fontSize: 12, color: tooltipMuted, marginBottom: 4 }}>
                    Payment Method
                </div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>
                    {name}: {value.toLocaleString()}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-secondary dark:bg-dark-secondary border border-black/5 dark:border-white/10 rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-card-foreground dark:text-dark-card-foreground mb-4">
                Payment Methods
            </h3>

            {(!data || data.length === 0) ? (
                <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
                    No payment data available.
                </p>
            ) : (
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={115}
                                innerRadius={62}
                                paddingAngle={2}
                                stroke={isDark ? "rgba(255,255,255,0.10)" : "rgba(2,6,23,0.06)"}
                                strokeWidth={1}
                                labelLine={false}
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.62;
                                    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
                                    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
                                    return (
                                        <text
                                            x={x}
                                            y={y}
                                            fill="rgba(255,255,255,0.95)"
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                            fontSize={12}
                                            fontWeight={700}
                                        >
                                            {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    );
                                }}
                            >
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>

                            <Tooltip content={<CustomTooltip />} />

                            <Legend
                                iconType="circle"
                                formatter={(value) => (
                                    <span className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
                                        {value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default PaymentChart;