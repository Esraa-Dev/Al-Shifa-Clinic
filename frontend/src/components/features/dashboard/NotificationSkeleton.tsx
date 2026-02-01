export const NotificationSkeleton = () => (
    <div className="animate-pulse bg-white p-4 rounded-lg border border-primaryBorder">
        <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-48"></div>
                    <div className="h-3 bg-gray-100 rounded w-64"></div>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="h-3 bg-gray-100 rounded w-24"></div>
                        <div className="h-4 bg-gray-100 rounded w-12"></div>
                    </div>
                </div>
            </div>
            <div className="h-4 bg-gray-100 rounded w-20"></div>
        </div>
    </div>
);
