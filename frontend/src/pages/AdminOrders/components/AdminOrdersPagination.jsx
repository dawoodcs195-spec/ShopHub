const AdminOrdersPagination = ({
    page,
    totalPages,
    count,
    limit,
    onPageChange,
}) => {
    if (totalPages <= 1) {
        return null;
    }

    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(
        page * limit,
        count
    );

    const pages = [];

    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {
        pages.push(i);
    }

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
            <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">
                    {startItem}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                    {endItem}
                </span>{" "}
                of{" "}
                <span className="font-semibold">
                    {count}
                </span>{" "}
                orders
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <button
                    type="button"
                    onClick={() =>
                        onPageChange(page - 1)
                    }
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                        page === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white hover:bg-blue-50"
                    }`}
                >
                    Previous
                </button>

                {pages.map((pageNumber) => (
                    <button
                        key={pageNumber}
                        type="button"
                        onClick={() =>
                            onPageChange(
                                pageNumber
                            )
                        }
                        className={`w-10 h-10 rounded-lg transition-colors ${
                            pageNumber === page
                                ? "bg-blue-600 text-white"
                                : "bg-white border hover:bg-blue-50"
                        }`}
                    >
                        {pageNumber}
                    </button>
                ))}

                <button
                    type="button"
                    onClick={() =>
                        onPageChange(page + 1)
                    }
                    disabled={
                        page === totalPages
                    }
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                        page === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white hover:bg-blue-50"
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdminOrdersPagination;