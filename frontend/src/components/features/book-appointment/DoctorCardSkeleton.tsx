export const DoctorCardSkeleton = () => {
    return (
        <div className="sticky top-8">
            <div className="relative flex-center w-full pt-20 overflow-hidden bg-transparent">
                <div className="absolute top-10 left-10 opacity-20 select-none">
                    <div className="grid grid-cols-4 gap-3">
                        {[...Array(16)].map((_, i) => (
                            <div key={i} className="w-1 h-1 bg-gray-200 rounded-full"></div>
                        ))}
                    </div>
                </div>

                <div className="relative w-72 h-72 md:w-85 md:h-85 flex-center">
                    <div className="absolute inset-0 bg-gray-100 rounded-full blur-3xl scale-150 opacity-40"></div>
                    <div className="absolute -inset-5 border border-primaryBorder rounded-full"></div>
                    <div className="absolute -inset-10 border border-gray-300/5 rounded-full"></div>
                    <div className="absolute inset-0 bg-primaryBorder rounded-full scale-110"></div>
                    <div className="absolute inset-0 border-12 border-gray-300/20 rounded-full"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-300/20 animate-[spin_20s_linear_infinite]"></div>

                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl z-10 bg-gray-200 animate-pulse">
                        <div className="w-full h-full bg-gray-200"></div>
                    </div>
                </div>

                <svg
                    className="absolute -top-12 -right-12 w-64 h-64 text-gray-300 opacity-15"
                    viewBox="0 0 200 200"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill="currentColor"
                        d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.2C87.4,-33.3,90.1,-17.6,89.3,-2.2C88.5,13.2,84.2,28.3,76.4,42.1C68.6,55.9,57.3,68.4,43.4,75.9C29.5,83.4,14.7,85.8,-0.1,86C-14.9,86.2,-29.8,84.2,-43.3,77C-56.8,69.8,-68.9,57.4,-77.3,43.4C-85.7,29.4,-90.4,14.7,-89.9,0.3C-89.4,-14.1,-83.7,-28.2,-74.9,-41.5C-66.1,-54.8,-54.2,-67.3,-40.4,-74.7C-26.6,-82.1,-13.3,-84.4,0.3,-85C13.9,-85.6,27.8,-84.5,44.7,-76.4Z"
                        transform="translate(100 100)"
                    />
                </svg>

                <svg
                    className="absolute -bottom-10 -left-10 w-40 h-40 text-gray-300 opacity-10"
                    viewBox="0 0 200 200"
                >
                    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                    <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
            </div>

            <div className='flex justify-center items-center relative z-20 -mt-5'>
                <div className="w-64 bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.2)] border border-gray-300 p-4 text-center animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
            </div>
        </div>
    );
};

export default DoctorCardSkeleton;