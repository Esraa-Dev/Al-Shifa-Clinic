import { Star, MapPin, Calendar } from "lucide-react";
import Loading from "../ui/Loading";
import { useGetTopDoctors } from "../../hooks/doctor/useGetTopDoctors";
import type { Doctor } from "../../types/types";

const TopDoctors = () => {
  const { data: doctors = [], isLoading, isError } = useGetTopDoctors(4);

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading doctors.</div>;

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primaryText mb-3">
            فريق الأطباء
          </h2>
          <p className="text-secondary text-lg">
            أطباء متخصصون لرعايتك الصحية
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor: Doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-xl border border-primaryBorder overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="w-full h-48 overflow-hidden relative">
                <img
                  src={doctor.image || "/default-doctor.jpg"}
                  alt={`${doctor.firstName} ${doctor.lastName}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center justify-center gap-1 bg-white/95 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-sm font-bold text-primaryText">
                    {doctor.rating || 0}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="text-right mb-3">
                  <h3 className="font-bold text-primaryText text-lg mb-1">
                    د. {doctor.firstName} {doctor.lastName}
                  </h3>
                  <p className="text-primary font-medium">
                    {doctor.specialization || "تخصص غير محدد"}
                  </p>
                </div>

                <div className="flex items-center gap-1 mb-3 text-sm text-secondary">
                  <Calendar className="w-4 h-4" />
                  <span>{doctor.experience || 0} سنة خبرة</span>
                </div>

                <div className="flex items-center gap-1 mb-4 text-sm text-primaryText">
                  <MapPin className="w-4 h-4" />
                  <span>{doctor.address?.city || "غير محدد"}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-primaryBorder">
                  <div>
                    <span className="text-xl font-bold text-primary">
                      {doctor.fee || 0}
                    </span>
                    <span className="text-primaryText text-sm"> ج.م</span>
                  </div>

                  <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-secondary transition-colors">
                    احجز
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 cursor-pointer border border-primary text-primary rounded-xl hover:border-secondary hover:text-secondary transition-colors">
            عرض جميع الأطباء
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopDoctors;