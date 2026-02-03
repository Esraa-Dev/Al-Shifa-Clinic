export const DashboardTableSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <th key={i} className="px-6 py-3">
                                        <div className="h-4 bg-gray-100 rounded w-20 mx-auto"></div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {[1, 2, 3, 4, 5].map((rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((colIndex) => (
                                        <td key={colIndex} className="px-6 py-4">
                                            <div className="h-4 bg-gray-100 rounded w-24 mx-auto"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};