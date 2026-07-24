import RevenueChart from "./RevenueChart";
import OrdersChart from "./OrdersChart";
import PaymentChart from "./PaymentChart";
import TopProducts from "./TopProducts";

const DashboardCharts = ({ monthlyRevenue, monthlyOrders, paymentMethods, topProducts }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <RevenueChart data={monthlyRevenue} />
            <OrdersChart data={monthlyOrders} />
            <div className="lg:col-span-2">
                 <PaymentChart data={paymentMethods} />
            </div>
            <div className="lg:col-span-2">
                 <TopProducts products={topProducts} />
            </div>
        </div>
    );
};

export default DashboardCharts;