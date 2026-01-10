import type { Doctor } from "../../types/types";

interface BookHeaderProps {
    doctor?: Doctor;
}

const BookHeader = ({ doctor }: BookHeaderProps) => {
    return (
        <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900">حجز موعد</h2>
            <p className="text-gray-600 mt-2">
                {doctor ?
                    `مع الدكتور ${doctor.firstName} ${doctor.lastName}` :
                    'جاري تحميل بيانات الطبيب...'
                }
            </p>
        </div>
    )
}

export default BookHeader