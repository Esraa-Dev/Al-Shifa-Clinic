import { useState } from "react";
import { Star, User, Calendar } from "lucide-react";
import Pagination from "../components/ui/Pagination";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import type { Rating } from "../types/types";
import { useDoctorRatings } from "../hooks/rating/useDoctorRatings";

const DoctorRatingsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();

  const { data, isLoading } = useDoctorRatings({
    page: currentPage,
    limit: 10
  });

  const ratings = data?.ratings || [];
  const pagination = data?.pagination || { totalPages: 1 };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {t("rating:doctorRatings")}
        </h1>
        <p className="text-gray-600">
          {t("rating:doctorSubtitle")}
        </p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white p-6 rounded-lg border border-primaryBorder">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-32"></div>
                    <div className="h-3 bg-gray-100 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : ratings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-primaryBorder">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {t("rating:noRatingsYet")}
            </p>
          </div>
        ) : (
          ratings.map((rating: Rating) => (
            <div key={rating._id} className="bg-white rounded-lg border border-primaryBorder p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      {rating.patient?.image || rating.patientId?.image ? (
                        <img
                          src={rating.patient?.image || rating.patientId?.image}
                          alt={`${rating.patient?.firstName || rating.patientId?.firstName || 'Patient'}'s profile`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="text-gray-400" size={24} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {rating.patient?.firstName || rating.patientId?.firstName || ''} {rating.patient?.lastName || rating.patientId?.lastName || ''}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <Calendar size={14} />
                        <span>
                          {format(
                            new Date(rating.appointmentDate || rating.createdAt),
                            "PPP"
                          )}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs capitalize">
                          {rating.appointmentType || t("common:unknown")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`${i < rating.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                        }`}
                      size={20}
                    />
                  ))}
                </div>
              </div>

              {rating.review && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-700">{rating.review}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}
export default DoctorRatingsPage;