const SkeletonProductDetails = () => {
    return (
        <div className="min-h-screen bg-background dark:bg-dark-background">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="animate-pulse">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Image */}
                        <div className="rounded-[28px] overflow-hidden border border-border dark:border-dark-border bg-card dark:bg-dark-card shadow-sm">
                            <div className="aspect-square w-full bg-secondary/60 dark:bg-white/5" />
                        </div>

                        {/* Info */}
                        <div className="rounded-[28px] border border-border dark:border-dark-border bg-card dark:bg-dark-card p-8 shadow-sm">
                            <div className="h-4 w-36 rounded bg-primary/15 dark:bg-white/10 mb-4" />

                            <div className="h-10 w-4/5 rounded bg-secondary/70 dark:bg-white/10 mb-3" />
                            <div className="h-10 w-3/5 rounded bg-secondary/70 dark:bg-white/10 mb-6" />

                            <div className="h-5 w-56 rounded bg-secondary/60 dark:bg-white/5 mb-8" />

                            <div className="space-y-4">
                                <div className="h-12 w-full rounded-xl bg-secondary/60 dark:bg-white/5" />
                                <div className="h-12 w-full rounded-xl bg-secondary/60 dark:bg-white/5" />
                                <div className="h-16 w-2/3 rounded-xl bg-secondary/70 dark:bg-white/10" />
                            </div>

                            <div className="mt-10 h-12 w-full rounded-full bg-primary/20 dark:bg-white/10" />
                        </div>
                    </div>

                    {/* Reviews section skeleton */}
                    <div className="mt-14 rounded-[28px] border border-border dark:border-dark-border bg-card dark:bg-dark-card p-8 shadow-sm">
                        <div className="h-8 w-60 rounded bg-secondary/70 dark:bg-white/10 mb-6" />
                        <div className="space-y-4">
                            <div className="h-24 w-full rounded-2xl bg-secondary/60 dark:bg-white/5" />
                            <div className="h-24 w-full rounded-2xl bg-secondary/60 dark:bg-white/5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonProductDetails;