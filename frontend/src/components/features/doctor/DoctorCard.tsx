import { Star, MapPin, Calendar, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Doctor } from "../../../types/types";
import { Link } from "react-router-dom";

export const DoctorCard = ({
  doctor
}: { doctor: Doctor }) => {
  const { i18n } = useTranslation();

  const specialization = i18n.language === 'ar'
    ? doctor.specialization_ar || doctor.specialization_en || ""
    : doctor.specialization_en || doctor.specialization_ar || "";

  const qualification = i18n.language === 'ar'
    ? doctor.qualification_ar || doctor.qualification_en || ""
    : doctor.qualification_en || doctor.qualification_ar || "";

  const location = i18n.language === 'ar'
    ? 'مدينة نصر، شارع مكرم عبيد، برج الأطباء'
    : 'Nasr City, Makram Ebeid Street, Doctors Tower';

  return (
    <div className="bg-white rounded-xl border border-primaryBorder overflow-hidden hover:shadow-lg transition-shadow">
      <div className="w-full overflow-hidden relative">
        <img
          src={doctor.image || "/default-doctor.jpg"}
          alt={`${doctor.firstName} ${doctor.lastName}`}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex items-center justify-center gap-1 bg-white/95 px-2 py-1 rounded-full">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-sm font-bold text-primaryText">
            {doctor.rating?.toFixed(1) || 0}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-primaryText text-lg mb-1">
            {i18n.language === 'ar' ? 'د. ' : 'Dr. '}{doctor.firstName} {doctor.lastName}
          </h3>
          <p className="text-primary font-medium">
            {specialization}
          </p>
        </div>

        {qualification && (
          <div className="flex items-start gap-2 mb-3 text-sm text-secondary">
            <GraduationCap className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{qualification}</span>
          </div>
        )}

        <div className="flex items-center gap-1 mb-3 text-sm text-secondary">
          <Calendar className="w-4 h-4" />
          <span>{doctor.experience || 0} {i18n.language === 'ar' ? 'سنة خبرة' : 'years experience'}</span>
        </div>

        <div className="flex items-start gap-2 mb-4 text-sm text-primaryText">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="line-clamp-2">{location}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-primaryBorder">
          <div>
            <span className="text-xl font-bold text-primary">
              {doctor.fee || 0}
            </span>
            <span className="text-primaryText text-sm"> {i18n.language === 'ar' ? 'ج.م' : 'EGP'}</span>
          </div>

          <Link
            to={`/booking/${doctor._id}`}
            onClick={() => window.scrollTo(0, 0)}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-secondary transition-colors cursor-pointer"
          >
            {i18n.language === 'ar' ? 'احجز الآن' : 'Book Now'}
          </Link>
        </div>
      </div>
    </div>
  );
};