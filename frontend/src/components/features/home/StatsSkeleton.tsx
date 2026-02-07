export const StatsSkeleton = () => (
    <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
            <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-white/5"
            >
                <div className="h-7 sm:h-9 bg-white/20 rounded-lg mb-2 animate-pulse w-3/4 mx-auto"></div>
                <div className="h-3 sm:h-4 bg-white/20 rounded-md animate-pulse w-1/2 mx-auto"></div>
            </div>
        ))}
    </div>
);