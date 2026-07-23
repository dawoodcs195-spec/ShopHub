import RevenueChart from "./RevenueChart";
import OrdersChart from "./OrdersChart";
import PaymentChart from "./PaymentChart";
import TopProducts from "./TopProducts";

const DashboardCharts = ({
    monthlyRevenue,
    monthlyOrders,
    paymentMethods,
    topProducts,
}) => {
    return (
        <div className="space-y-8 mb-10">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <RevenueChart data={monthlyRevenue} />
                <OrdersChart data={monthlyOrders} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <PaymentChart data={paymentMethods} />
                <TopProducts products={topProducts} />
            </div>
        </div>
    );
};

export default DashboardCharts;