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
    const isDark =
        typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark");

    const axisColor = isDark ? "rgba(248,250,252,0.72)" : "rgba(15,23,42,0.72)";
    const gridColor = isDark ? "rgba(248,250,252,0.08)" : "rgba(2,6,23,0.08)";
    const tooltipBg = isDark ? "rgba(2,6,23,0.92)" : "rgba(255,255,255,0.98)";
    const tooltipBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(2,6,23,0.10)";
    const tooltipText = isDark ? "rgba(248,250,252,0.95)" : "rgba(15,23,42,0.95)";
    const tooltipMuted = isDark ? "rgba(248,250,252,0.65)" : "rgba(15,23,42,0.60)";

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        const v = Number(payload[0]?.value || 0);

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
                    {label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{v} orders</div>
            </div>
        );
    };

    return (
        <div className="bg-secondary dark:bg-dark-secondary border border-black/5 dark:border-white/10 rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-card-foreground dark:text-dark-card-foreground mb-4">
                Orders This Period
            </h3>

            {(!data || data.length === 0) ? (
                <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
                    No orders data available.
                </p>
            ) : (
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 18, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="ordersBarGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.95} />
                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.55} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />

                            <XAxis
                                dataKey="month"
                                tick={{ fill: axisColor, fontSize: 12 }}
                                tickLine={false}
                                axisLine={{ stroke: gridColor }}
                            />

                            <YAxis
                                allowDecimals={false}
                                tick={{ fill: axisColor, fontSize: 12 }}
                                tickLine={false}
                                axisLine={{ stroke: gridColor }}
                                width={36}
                            />

                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: isDark ? "rgba(248,250,252,0.06)" : "rgba(2,6,23,0.04)" }}
                            />

                            <Bar
                                dataKey="orders"
                                fill="url(#ordersBarGradient)"
                                radius={[8, 8, 0, 0]}
                                maxBarSize={48}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default OrdersChart;