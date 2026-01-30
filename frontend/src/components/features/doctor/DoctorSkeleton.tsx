export const DoctorSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-primaryBorder overflow-hidden">
      <div className="w-full h-48 bg-primary/3"></div>
      <div className="p-4">
        <div className="mb-3">
          <div className="h-6 bg-gray-100 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2"></div>
        </div>
        <div className="mb-3">
          <div className="h-5 bg-gray-100 rounded w-1/3"></div>
        </div>
        <div className="flex items-center gap-1 mb-3">
          <div className="h-4 bg-gray-100 rounded w-4"></div>
          <div className="h-4 bg-gray-100 rounded w-24"></div>
        </div>
        <div className="flex items-center gap-1 mb-4">
          <div className="h-4 bg-gray-100 rounded w-4"></div>
          <div className="h-4 bg-gray-100 rounded w-28"></div>
        </div>
        <div className="mb-4">
          <div className="h-4 bg-gray-100 rounded w-36"></div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-primaryBorder">
          <div>
            <div className="h-6 bg-gray-100 rounded w-16 mb-1"></div>
            <div className="h-3 bg-gray-100 rounded w-12"></div>
          </div>
          <div className="h-10 bg-gray-100 rounded w-32"></div>
        </div>
      </div>
    </div>
  );
};