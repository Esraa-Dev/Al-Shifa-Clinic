import type { StatCardProps } from "../../../types/types";

export const StatCard = ({ title, value, icon, bgColor, iconColor }: StatCardProps) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-primaryBorder hover:shadow-md transition-all">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-base font-semibold text-primaryText mb-4">{title}</p>
                    <h3 className="text-3xl font-black text-gray-900 leading-none">
                        {value}
                    </h3>
                </div>
                <div className={`p-3 rounded-xl ${bgColor} ${iconColor}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};