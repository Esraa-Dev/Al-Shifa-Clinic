import { Star, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Doctor } from "../types/types";

const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate(`/booking/${doctor._id}`);
  };

  return (
    <div
      key={doctor._id}
      className="bg-white rounded-xl border border-primaryBorder overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="w-full h-48 overflow-hidden relative bg-gray-100">
        {doctor.image ? (
          <img
            src={doctor.image}
            alt={`${doctor.firstName} ${doctor.lastName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
            <span className="text-4xl font-bold text-primary">
              {doctor.firstName?.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 px-2 py-1 rounded-full">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-sm font-bold text-gray-800">
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
            {doctor.specialization || doctor.designation || "تخصص غير محدد"}
          </p>
        </div>

        {doctor.department?.name && (
          <div className="mb-3">
            <span className="inline-block bg-orange-50 text-orange-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {doctor.department.name}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1 mb-3 text-sm text-secondary">
          <Calendar className="w-4 h-4" />
          <span>{doctor.yearOfExperience || 0} سنة خبرة</span>
        </div>

        <div className="flex items-center gap-1 mb-4 text-sm text-primaryText">
          <MapPin className="w-4 h-4" />
          <span>{doctor.address?.city || "غير محدد"}</span>
        </div>

        {doctor.schedule && doctor.schedule.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              أيام العمل: {doctor.schedule.length} يوم
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-primaryBorder">
          <div>
            <span className="text-xl font-bold text-primary">
              {doctor.fee || doctor.appointmentSettings?.consultationCharge || 0}
            </span>
            <span className="text-primaryText text-sm"> ج.م</span>
          </div>

          <button
            onClick={handleBookAppointment}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-secondary transition-colors cursor-pointer"
          >
            احجز
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;