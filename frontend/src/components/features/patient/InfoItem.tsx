import type { InfoItemProps } from "../../../types/types";

const InfoItem = ({ icon, label, value }: InfoItemProps) => {
  const Icon = icon;
  return (
    <div className="flex items-center gap-4">
      <div 
      className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
        <Icon />
      </div>
      <div className="">
        <div className="text-sm text-secondary">{label}</div>
        <div className="font-medium text-primaryText">{value}</div>
      </div>
    </div>
  );
};

export default InfoItem;
