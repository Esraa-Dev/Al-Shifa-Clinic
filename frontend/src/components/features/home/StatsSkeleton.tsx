
export const StatsSkeleton = () => (
    <div className="grid grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white text-center">
                <div className="h-8 bg-white/30 rounded-lg mb-2 animate-pulse"></div>
                <div className="h-4 bg-white/30 rounded animate-pulse"></div>
            </div>
        ))}
    </div>
);