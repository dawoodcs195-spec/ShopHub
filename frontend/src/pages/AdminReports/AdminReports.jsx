import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { getDashboardStats } from "../../services/adminService";

import DashboardFilters from "../Admin/components/DashboardFilters";
import RevenueReport from "../Admin/components/RevenueReport";
import SalesReport from "../Admin/components/SalesReport";

const AdminReports = () => {
    const { token } = useAuth();
    
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState("all");

    const loadDashboardData = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await getDashboardStats(token, period);
            setDashboard(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load report data.");
        } finally {
            setLoading(false);
        }
    }, [token, period]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    const handleFilterChange = (newPeriod) => {
        setPeriod(newPeriod);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto p-4 sm:p-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Reports
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Analyze your store's performance with detailed reports.
                    </p>
                </header>
                
                <DashboardFilters 
                    onFilterChange={handleFilterChange} 
                    activeFilter={period} 
                />

                <div className="mt-8">
                    {loading ? (
                        <div className="bg-white p-8 rounded-xl shadow-lg text-center text-gray-500">
                            <p>Generating Reports...</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <RevenueReport dashboard={dashboard} />
                            <SalesReport dashboard={dashboard} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminReports;