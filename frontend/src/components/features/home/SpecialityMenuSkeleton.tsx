export const SpecialityMenuSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="bg-background border border-primaryBorder rounded-2xl p-5 md:p-6 animate-pulse flex flex-col h-full"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 rounded-xl md:rounded-2xl mb-4 shrink-0"></div>

          <div className="h-5 md:h-6 bg-gray-100 rounded-md w-3/4 mb-2"></div>

          <div className="h-3 md:h-4 bg-gray-100 rounded-md w-1/2 mb-4"></div>

          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded w-full"></div>
            <div className="h-3 bg-gray-100 rounded w-full"></div>
            <div className="h-3 bg-gray-100 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
};