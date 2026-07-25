import { FaHistory, FaTimes } from "react-icons/fa";

const RecentSearches = ({
    searches,
    onSelect,
    onRemove,
    onClear,
}) => {
    if (!searches.length) {
        return null;
    }

    return (
        <div className="border-b border-slate-200">
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
                <div className="flex items-center gap-2">
                    <FaHistory className="text-slate-400" />

                    <h3 className="font-semibold text-slate-700">
                        Recent Searches
                    </h3>
                </div>

                <button
                    type="button"
                    onClick={onClear}
                    className="text-sm font-medium text-[#B76E79] transition-colors hover:text-[#9F5C66]"
                >
                    Clear
                </button>
            </div>

            <div className="pb-4">
                {searches.map((search) => (
                    <div
                        key={search}
                        className="group flex items-center justify-between px-6 py-3 transition-colors hover:bg-[#FCFAF7]"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                onSelect(search)
                            }
                            className="flex flex-1 items-center gap-3 text-left"
                        >
                            <FaHistory className="text-slate-400" />

                            <span className="text-[#4A433D]">
                                {search}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                onRemove(search)
                            }
                            className="rounded-full p-2 text-slate-400 opacity-0 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100"
                            aria-label="Remove search"
                        >
                            <FaTimes size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentSearches;