import { useTranslation } from 'react-i18next';
import type { Doctor } from '../../../types/types';

export const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
    const { t, i18n } = useTranslation();

    return (
        <div className="lg:col-span-1">
            <div className="sticky top-8">
                <div className="relative flex-center w-full pt-20 overflow-hidden bg-transparent">
                    <div className="absolute top-10 left-10 opacity-20 select-none">
                        <div className="grid grid-cols-4 gap-3">
                            {[...Array(16)].map((_, i) => (
                                <div key={i} className="w-1 h-1 bg-primary rounded-full"></div>
                            ))}
                        </div>
                    </div>
                    <div className="relative w-72 h-72 md:w-85 md:h-85 flex-center">
                        <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-primary/20 rounded-full blur-3xl scale-150 opacity-40"></div>
                        <div className="absolute -inset-5 border border-primary/10 rounded-full"></div>
                        <div className="absolute -inset-10 border border-primary/5 rounded-full"></div>
                        <div className="absolute inset-0 bg-primary/10 rounded-full scale-110"></div>
                        <div className="absolute inset-0 border-12 border-primary/20 rounded-full shadow-[0_0_40px_rgba(37,148,201,0.15)]"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-[spin_20s_linear_infinite]"></div>
                        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl z-10 bg-white">
                            <img
                                src={doctor.image}
                                alt={`${doctor.firstName} ${doctor.lastName}`}
                                className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                            />
                        </div>
                    </div>
                    <svg
                        className="absolute -top-12 -right-12 w-64 h-64 text-primary opacity-15"
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
                        className="absolute -bottom-10 -left-10 w-40 h-40 text-primary opacity-10"
                        viewBox="0 0 200 200"
                    >
                        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                        <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </svg>
                </div>
                <div className='flex justify-center items-center relative z-20 -mt-5'>
                    <div className="w-64 bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.2)] border border-primaryBorder p-4 text-center">
                        <h3 className="text-lg font-bold text-primaryText">
                            {t('book:doctorCard.titlePrefix')} {doctor.firstName} {doctor.lastName}
                        </h3>
                        <p className="text-sm text-primary font-semibold mt-1">
                            {i18n.language === 'ar' ? doctor.specialization_ar : doctor.specialization_en}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;