export const DoctorSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-primaryBorder overflow-hidden animate-pulse">
      <div className="w-full h-48 md:h-52 bg-gray-100"></div>
      <div className="p-4 md:p-5">
        <div className="mb-4">
          <div className="h-6 bg-gray-100 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2"></div>
        </div>
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-gray-100 rounded w-2/3"></div>
          <div className="flex gap-2">
            <div className="h-4 bg-gray-100 rounded w-4"></div>
            <div className="h-4 bg-gray-100 rounded w-24"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-4 bg-gray-100 rounded w-4"></div>
            <div className="h-4 bg-gray-100 rounded w-32"></div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-primaryBorder">
          <div className="space-y-1">
            <div className="h-5 bg-gray-100 rounded w-14"></div>
            <div className="h-3 bg-gray-100 rounded w-10"></div>
          </div>
          <div className="h-10 bg-gray-100 rounded-lg w-28 md:w-32"></div>
        </div>
      </div>
    </div>
  );
};