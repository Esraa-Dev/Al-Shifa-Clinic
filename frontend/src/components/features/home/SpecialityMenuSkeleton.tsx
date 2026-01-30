export const SpecialityMenuSkeleton = () => {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full translate-y-40 -translate-x-40"></div>

      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primaryText mb-3">
            <div className="h-9 bg-gray-100 rounded w-1/4 mx-auto animate-pulse"></div>
          </h2>
          <p className="text-secondary text-lg mb-4">
            <div className="h-5 bg-gray-100 rounded w-1/3 mx-auto animate-pulse"></div>
          </p>
          <div className="w-20 h-1 bg-linear-to-r from-primary to-secondary rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="group relative bg-background border border-primaryBorder rounded-2xl p-6 overflow-hidden"
            >
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary/10 rounded-full"></div>
              <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-secondary/10 rounded-full"></div>
              <div className="relative z-10">
                <div className="space-y-2">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex-center justify-center mb-4 animate-pulse"></div>
                  <h3 className="text-xl font-bold text-primaryText">
                    <div className="h-6 bg-gray-100 rounded w-full animate-pulse"></div>
                  </h3>
                  <p className="text-secondary text-sm font-medium">
                    <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                  </p>
                  <div className="space-y-1 mt-2">
                    <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
                    <div className="h-3 bg-gray-100 rounded w-5/6 animate-pulse"></div>
                    <div className="h-3 bg-gray-100 rounded w-4/6 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};