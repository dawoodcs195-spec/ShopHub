const SkeletonProductDetails = () => {
    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Image */}
                    <div className="rounded-[28px] overflow-hidden border border-[#EFE6DC] bg-white shadow-sm">
                        <div className="aspect-square w-full bg-[#F3ECE6]" />
                    </div>

                    {/* Info */}
                    <div className="rounded-[28px] border border-[#EFE6DC] bg-white p-8 shadow-sm">
                        <div className="h-4 w-36 rounded bg-[#F4DDE3] mb-4" />

                        <div className="h-10 w-4/5 rounded bg-[#E9DED8] mb-3" />
                        <div className="h-10 w-3/5 rounded bg-[#E9DED8] mb-6" />

                        <div className="h-5 w-56 rounded bg-[#F3ECE6] mb-8" />

                        <div className="space-y-4">
                            <div className="h-12 w-full rounded-xl bg-[#F3ECE6]" />
                            <div className="h-12 w-full rounded-xl bg-[#F3ECE6]" />
                            <div className="h-16 w-2/3 rounded-xl bg-[#E9DED8]" />
                        </div>

                        <div className="mt-10 h-12 w-full rounded-full bg-[#D8B2A1]/45" />
                    </div>
                </div>

                {/* Reviews section skeleton */}
                <div className="mt-14 rounded-[28px] border border-[#EFE6DC] bg-white p-8 shadow-sm">
                    <div className="h-8 w-60 rounded bg-[#E9DED8] mb-6" />
                    <div className="space-y-4">
                        <div className="h-24 w-full rounded-2xl bg-[#F3ECE6]" />
                        <div className="h-24 w-full rounded-2xl bg-[#F3ECE6]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonProductDetails;