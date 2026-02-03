import React, { useRef } from 'react';
import { X, FileText, Pill, Download } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useTranslation } from 'react-i18next';
import { usePrescriptionByAppointmentId } from '../../../hooks/prescription/usePrescriptionByAppointmentId';
import { format } from 'date-fns';
import type { Prescription } from '../../../types/types';
import { useReactToPrint } from 'react-to-print';

interface PatientPrescriptionModalProps {
  appointmentId: string;
  doctorName: string;
  isOpen: boolean;
  onClose: () => void;
}

const PatientPrescriptionModal: React.FC<PatientPrescriptionModalProps> = ({
  appointmentId,
  doctorName,
  isOpen,
  onClose
}) => {
  const { t } = useTranslation(['prescription', 'common']);
  const { data: prescriptionData, isLoading } = usePrescriptionByAppointmentId(appointmentId);
  const prescription = prescriptionData?.data as Prescription | undefined;
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `prescription-${appointmentId}`,
  });

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">Loading...</div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          {t('prescription:notFound')}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-primaryBorder border-b">
          <div className="flex items-center gap-2">
            <FileText className="text-primary" size={20} />
            <div>
              <h3 className="font-semibold">{t('prescription:title')}</h3>
              <p className="text-sm text-primaryText">
                {t('prescription:prescribedBy')}: {doctorName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-primaryText cursor-pointer" aria-label={t("common:close")}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div ref={printRef} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-primaryText">{t('prescription:date')}</p>
                <p className="font-medium">{format(new Date(prescription.createdAt), 'PP')}</p>
              </div>
              {prescription.followUpDate && (
                <div>
                  <p className="text-sm text-primaryText">{t('prescription:followUpDate')}</p>
                  <p className="font-medium">{format(new Date(prescription.followUpDate), 'PP')}</p>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-1">{t('prescription:diagnosis')}</h4>
              <p className="primaryText bg-gray-50 p-3 rounded">{prescription.diagnosis}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-1">
                <Pill size={16} className="text-secondary" />
                {t('prescription:medications')}
              </h4>
              <div className="space-y-2">
                {prescription.medicines.map((medicine, index) => (
                  <div key={index} className= "border-primaryBorder border p-3 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="font-medium">{medicine.name}</h5>
                      <span className="text-xs bg-primary/5 text-primary px-2 py-0.5 rounded">
                        {medicine.dosage}
                      </span>
                    </div>
                    <div className="text-sm text-primaryText space-y-0.5">
                      <div className="flex justify-between">
                        <span>{t('prescription:frequency')}</span>
                        <span>{medicine.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('prescription:duration')}</span>
                        <span>{medicine.duration}</span>
                      </div>
                      {medicine.instructions && (
                        <div className="pt-1">
                          <span className="font-medium">{t('prescription:instructions')}: </span>
                          <span>{medicine.instructions}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {prescription.notes && (
              <div>
                <h4 className="font-semibold mb-1">{t('prescription:notes')}</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{prescription.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-primaryBorder border-t flex gap-2">
          <Button onClick={handlePrint} className="flex-1 gap-1">
            <Download size={16} />
            {t('prescription:download')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientPrescriptionModal;