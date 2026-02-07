export const ProfileSkeleton = () => {
    return (
        <div className="bg-background py-6 md:py-10 animate-pulse">
            <div className="container px-4 md:px-0">
                <div className="bg-white rounded-xl md:rounded-2xl border border-primaryBorder p-4 mb-6">
                    <div className="text-center">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full mx-auto mb-4"></div>
                        <div className="h-5 md:h-6 bg-gray-100 rounded w-32 md:w-40 mx-auto mb-2"></div>
                        <div className="h-3 md:h-4 bg-gray-100 rounded w-24 md:w-32 mx-auto"></div>
                        <div className="h-9 md:h-10 bg-gray-100 rounded w-32 md:w-40 mx-auto mt-4"></div>
                    </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="h-6 md:h-8 bg-gray-100 rounded w-40 md:w-48"></div>
                        <div className="h-9 md:h-10 bg-gray-100 rounded w-full sm:w-28"></div>
                    </div>

                    <div className="bg-white rounded-xl md:rounded-2xl border border-primaryBorder p-4 md:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="flex items-center gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-xl"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-3 md:h-4 bg-gray-100 rounded w-20 md:w-24"></div>
                                        <div className="h-4 md:h-5 bg-gray-100 rounded w-28 md:w-36"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl md:rounded-2xl border border-primaryBorder p-4 md:p-6">
                        <div className="h-5 md:h-6 bg-gray-100 rounded w-28 md:w-32 mb-4 md:mb-6"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="flex items-center gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-xl"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-3 md:h-4 bg-gray-100 rounded w-16 md:w-20"></div>
                                        <div className="h-4 md:h-5 bg-gray-100 rounded w-24 md:w-32"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl md:rounded-2xl border border-primaryBorder p-4 md:p-6">
                        <div className="h-5 md:h-6 bg-gray-100 rounded w-36 md:w-48 mb-4 md:mb-6"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="flex items-center gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-xl"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-3 md:h-4 bg-gray-100 rounded w-20 md:w-28"></div>
                                        <div className="h-4 md:h-5 bg-gray-100 rounded w-28 md:w-40"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl md:rounded-2xl border border-primaryBorder p-4 md:p-6">
                        <div className="h-5 md:h-6 bg-gray-100 rounded w-32 md:w-40 mb-4 md:mb-6"></div>

                        <div className="mb-4 md:mb-6">
                            <div className="h-4 md:h-5 bg-gray-100 rounded w-20 md:w-24 mb-2 md:mb-3"></div>
                            <div className="flex flex-wrap gap-2">
                                {[...Array(3)].map((_, index) => (
                                    <div key={index} className="px-3 py-1 md:px-4 md:py-2 bg-gray-100 rounded-full w-20 md:w-24 h-7 md:h-8"></div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="h-4 md:h-5 bg-gray-100 rounded w-24 md:w-28 mb-2 md:mb-3"></div>
                            <div className="space-y-2">
                                <div className="h-3 md:h-4 bg-gray-100 rounded w-full"></div>
                                <div className="h-3 md:h-4 bg-gray-100 rounded w-5/6"></div>
                                <div className="h-3 md:h-4 bg-gray-100 rounded w-4/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};