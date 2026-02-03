export const SpecialityMenuSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="bg-background border border-primaryBorder rounded-2xl p-6 animate-pulse"
        >
          <div className="w-14 h-14 bg-gray-200 rounded-2xl mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      ))}
    </div>
  );
};