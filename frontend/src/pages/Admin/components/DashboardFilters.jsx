import React from 'react';

const filterOptions = [
    { label: "Today", value: "today" },
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "This Month", value: "this_month" },
    { label: "This Year", value: "this_year" },
    { label: "All Time", value: "all" },
];

const DashboardFilters = ({ onFilterChange, activeFilter }) => {
    return (
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-gray-600 mr-2">Filter by period:</span>
                {filterOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onFilterChange(option.value)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            activeFilter === option.value
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DashboardFilters;