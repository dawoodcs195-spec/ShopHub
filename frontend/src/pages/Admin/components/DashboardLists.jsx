import RecentOrders from "./RecentOrders";
import LatestProducts from "./LatestProducts";

const DashboardLists = ({
    recentOrders,
    latestProducts,
}) => {
    return (
        <div className="space-y-8">
            <RecentOrders
                orders={recentOrders}
            />

            <LatestProducts
                products={latestProducts}
            />
        </div>
    );
};

export default DashboardLists;