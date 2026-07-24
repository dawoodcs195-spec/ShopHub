import RecentOrders from "./RecentOrders";
import LatestProducts from "./LatestProducts"; // Assuming this file exists and will be styled similarly

const DashboardLists = ({ recentOrders, latestProducts }) => {
    return (
        <div className="space-y-8">
            <RecentOrders orders={recentOrders} />
            {/* If LatestProducts component is used, it should be styled similarly to RecentOrders */}
            {/* <LatestProducts products={latestProducts} /> */}
        </div>
    );
};

export default DashboardLists;