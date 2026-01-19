import { useTranslation } from "react-i18next";
import { Button } from "./Button";
import type { EmptyStateProps } from "../../types/types";


export const EmptyState = ({ 
  icon: Icon, 
  titleKey, 
  descriptionKey, 
  actionLabelKey, 
  onAction,
}: EmptyStateProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Icon size={64} className="text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-primaryText mb-2">
        {t(titleKey)}
      </h3>
      {descriptionKey && (
        <p className="text-gray-500 mb-4">{t(descriptionKey)}</p>
      )}
      {actionLabelKey && onAction && (
        <Button onClick={onAction}>{t(actionLabelKey)}</Button>
      )}
    </div>
  );
};