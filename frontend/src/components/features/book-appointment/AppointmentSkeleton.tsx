export const AppointmentSkeleton = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse">
          <div className="p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded-lg w-40 mb-2"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    <div className="h-5 bg-gray-200 rounded-lg w-16"></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2 text-sm border-t md:border-t-0 border-gray-200 pt-3 md:pt-0">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-20"></div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded-lg w-16"></div>
              <div className="flex items-center gap-2">
                <div className="h-10 bg-gray-200 rounded-xl w-40"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};