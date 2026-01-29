export const PatientProfileSkeleton = () => {
    return (
        <div className="bg-background py-10 animate-pulse">
            <div className="container">
                <div className="bg-white rounded-2xl border border-primaryBorder p-4 mb-6">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4"></div>
                        <div className="h-6 bg-gray-100 rounded w-40 mx-auto mb-2"></div>
                        <div className="h-4 bg-gray-100 rounded w-32 mx-auto"></div>
                        <div className="h-10 bg-gray-100 rounded w-40 mx-auto mt-4"></div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="h-8 bg-gray-100 rounded w-48"></div>
                        <div className="h-10 bg-gray-100 rounded w-28"></div>
                    </div>

                    <div className="bg-white rounded-2xl border border-primaryBorder p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-gray-100 rounded w-24"></div>
                                        <div className="h-5 bg-gray-100 rounded w-36"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-primaryBorder p-6">
                        <div className="h-6 bg-gray-100 rounded w-32 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-gray-100 rounded w-20"></div>
                                        <div className="h-5 bg-gray-100 rounded w-32"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-primaryBorder p-6">
                        <div className="h-6 bg-gray-100 rounded w-48 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-gray-100 rounded w-28"></div>
                                        <div className="h-5 bg-gray-100 rounded w-40"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-primaryBorder p-6">
                        <div className="h-6 bg-gray-100 rounded w-40 mb-6"></div>

                        <div className="mb-6">
                            <div className="h-5 bg-gray-100 rounded w-24 mb-3"></div>
                            <div className="flex flex-wrap gap-2">
                                {[...Array(3)].map((_, index) => (
                                    <div key={index} className="px-4 py-2 bg-gray-100 rounded-full w-24 h-8"></div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="h-5 bg-gray-100 rounded w-28 mb-3"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-100 rounded w-full"></div>
                                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-100 rounded w-4/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};