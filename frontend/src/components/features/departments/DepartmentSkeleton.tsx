export const DepartmentSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-primaryBorder animate-pulse flex flex-col h-full">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 shrink-0"></div>
          <div className="h-6 bg-gray-100 rounded-md w-2/3"></div>
        </div>

        <div className="space-y-2 mb-4 grow">
          <div className="h-3.5 bg-gray-100 rounded w-full"></div>
          <div className="h-3.5 bg-gray-100 rounded w-full"></div>
          <div className="h-3.5 bg-gray-100 rounded w-1/2"></div>
        </div>

        <div className="flex items-center justify-between mb-6 py-2 border-t border-gray-50 mt-auto">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-100 rounded w-16"></div>
            <div className="h-5 bg-gray-100 rounded w-8"></div>
          </div>
        </div>

        <div className="h-12 bg-gray-100 rounded-lg w-full border-4 border-transparent"></div>
      </div>
    </div>
  );
};