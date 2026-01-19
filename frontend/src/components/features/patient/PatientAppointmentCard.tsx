import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { AppointmentCardProps } from '../../../types/types';
export const PatientAppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMMM yyyy', { locale: ar });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'مجدول';
      case 'In Progress': return 'جاري التنفيذ';
      case 'Completed': return 'مكتمل';
      case 'Cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'video': return 'استشارة فيديو';
      case 'voice': return 'مكالمة هاتفية';
      case 'clinic': return 'زيارة عيادة';
      default: return type;
    }
  };


  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            {appointment.doctorId.image ? (
              <img
                src={appointment.doctorId.image}
                alt={appointment.doctorId.firstName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="text-primary font-semibold">
                {appointment.doctorId.firstName?.charAt(0) || 'د'}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg">
              د. {appointment.doctorId.firstName} {appointment.doctorId.lastName}
            </h3>
            <p className="text-gray-600">{appointment.doctorId.specialization}</p>
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-medium">التخصص:</span> {appointment.doctorId.specialization}
            </p>
          </div>
        </div>

        <div className="text-left">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Calendar size={16} />
            <span className="font-medium">
              {formatDate(appointment.appointmentDate)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={16} />
            <span className="font-medium">
              {appointment.startTime} - {appointment.endTime}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
            {getStatusText(appointment.status)}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {getTypeText(appointment.type)}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            {appointment.fee} ج.م
          </span>
        </div>
      </div>

      {appointment.symptoms && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-gray-700">
            <span className="font-semibold">الأعراض: </span>
            {appointment.symptoms}
          </p>
        </div>
      )}
    </div>
  );
};